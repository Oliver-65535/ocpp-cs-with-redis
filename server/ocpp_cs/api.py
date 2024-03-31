from typing import Set
from aiohttp import web
from aiohttp.web import Response
import aiohttp_cors
from aiohttp_sse import EventSourceResponse, sse_response

import asyncio
from ocppcs.call import get_call_payload,get_call_result
import json
from swagger_ui import aiohttp_api_doc

from charge_points import CHARGE_POINTS

app = None
channels = web.AppKey("channels", Set[asyncio.Queue[str]])

async def async_call(event):
    input_params = get_call_payload(event)
    response = await CHARGE_POINTS[event['chargePointId']].call(input_params)
    params = get_call_result(response,event['method'])
    return params

async def call(request):
    data = await request.json()
    await event(data)
    response = await async_call(data)
    await event(response)
    return web.json_response(response)

async def root_handler(request):
    return web.FileResponse("./web/build/index.html")

async def ping(request):
    return web.Response(text="pong")
  
async def get_chargers(request):
    return web.json_response(list(CHARGE_POINTS.keys()))  

async def message(request: web.Request) -> web.Response:
    app = request.app
    data = await request.post()
    for queue in app[channels]:
        payload = json.dumps(dict(data))
        await queue.put(payload)
    return web.Response()

async def event(data):
    # print("AAAAAAAAAAAA",data)
    for queue in app[channels]:
        payload = json.dumps(dict(data))
        await queue.put(payload)
    return web.Response()

async def subscribe(request: web.Request) -> EventSourceResponse:
    async with sse_response(request) as response:
        app = request.app
        queue: asyncio.Queue[str] = asyncio.Queue()
        # print("Someone joined.")
        app[channels].add(queue)
        try:
            while response.is_connected():
                payload = await queue.get()
                await response.send(payload)
                queue.task_done()
        finally:
            app[channels].remove(queue)
            # print("Someone left.")
    return response

async def start_site(address='0.0.0.0', port=3021):
    global app
    app = web.Application()
    app[channels] = set()
    aiohttp_api_doc(app, config_path='openapi.yaml', url_prefix='/api/docs', title='API docs')
    app.router.add_route('POST', '/api/call', call)
    app.router.add_route("GET", "/api/subscribe", subscribe)
    app.router.add_route('GET', "/api/ping", ping)
    app.router.add_route('GET', "/api/get-chargers", get_chargers)
    app.router.add_route("*", "/", root_handler)
    app.add_routes([web.static("/", "./web/build")])
    
    # cors = aiohttp_cors.setup(app, defaults={
    # "*": aiohttp_cors.ResourceOptions(
    #       allow_credentials=True,
    #       expose_headers="*",
    #       allow_headers="*"
    #   )
    # })

    # for route in list(app.router.routes()):
    #   cors.add(route)
    
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, address, port)
    await site.start()