from typing import Set
from aiohttp import web
from aiohttp.web import Response

from aiohttp_sse import EventSourceResponse, sse_response

import asyncio
from ocppcs.call import get_call_payload,get_call_result
import json
from swagger_ui import aiohttp_api_doc

from charge_points import CHARGE_POINTS

channels = web.AppKey("channels", Set[asyncio.Queue[str]])
chargers = web.AppKey("chargers", Set[asyncio.Queue[str]])
# from ocpp_cs import async_call

async def handle(request):
    print ("handle trigger")
    return Response(text='handle trigger', content_type='text/html')

async def hello(request):
    async with sse_response(request) as resp:
            # data = 'Server Time : {}'
            print(CHARGE_POINTS)
            await resp.send(json.dumps(CHARGE_POINTS))

async def async_call(event):
    # global CHARGE_POINTS
    print(CHARGE_POINTS, event)
    input_params = get_call_payload(event)
    print(input_params)
    response = await CHARGE_POINTS[event['chargePointId']].call(input_params)
    params = get_call_result(response,event['method'])
    print(params)
    return params
    # payload = {
    #             'chargePointId': event['chargePointId'],
    #             'action': 'response',
    #             'actionId': event['actionId'],
    #             'method': event['method'],
    #             'params': params
    #         }
    # data = json.dumps(payload)
    # asyncio.create_task(async_redis_publish(data))

async def call_http(request):
    data = await request.json()
    response = await async_call(data)
    # print("ANSWER", json.dumps(response))
    return web.json_response(json.dumps(response))
    # return Response(text=response, content_type='text/html')

async def index(request):
    d = """
        <html>
        <body>
            <script>
                var evtSource = new EventSource("/sse");
                evtSource.onmessage = function(e) {
                    document.getElementById('response').innerText = e.data
                }
            </script>
            <h1>Response from server:</h1>
            <div id="response"></div>
        </body>
    </html>
    """
    return Response(text=d, content_type='text/html')

async def ping(request):
    """
    ---
    description: This endpoint returns user which is defined though data definition during initialization.
    tags:
    - Users
    produces:
    - application/json
    responses:
        "200":
            description: Successful operation, returns User object nested permisiion list
    """
    return web.Response(text="pong")

async def pr(request) -> web.StreamResponse:
    return web.json_response(
            {
                "data": [
                    {"name": "Bill Doe", "id": "233242342342"},
                    {"name": "Mary Doe", "id": "2342342343222"},
                    {"name": "Alex Smith", "id": "234234234344"},
                ],
                "paging": {
                    "cursors": {
                        "before": "QVFIUjRtc2c5NEl0ajN",
                        "after": "QVFIUlpFQWM0TmVuaDRad0dt",
                    },
                    "next": (
                        "https://graph.facebook.com/v2.7/12345678901234567/"
                        "friends?access_token=EAACEdEose0cB"
                    ),
                },
                "summary": {"total_count": 3},
            }
        )

async def message(request: web.Request) -> web.Response:
    app = request.app
    data = await request.post()

    for queue in app[channels]:
        payload = json.dumps(dict(data))
        await queue.put(payload)
    return web.Response()

async def event(data):
    print("AAAAAAAAAAAA",data)
    for queue in app[channels]:
        payload = json.dumps(dict(data))
        await queue.put(payload)
    return web.Response()
  
async def emit_charger_list(data):
    print("CHARGER_LIST TTTTTTTTTT",data)
    for queue in app[chargers]:
        payload = json.dumps(dict(data))
        await queue.put(payload)
    return web.Response()

async def subscribe(request: web.Request) -> EventSourceResponse:
    async with sse_response(request) as response:
        app = request.app
        queue: asyncio.Queue[str] = asyncio.Queue()
        print("Someone joined.")
        app[channels].add(queue)
        try:
            while response.is_connected():
                payload = await queue.get()
                await response.send(payload)
                queue.task_done()
        finally:
            app[channels].remove(queue)
            print("Someone left.")
    return response
  
async def subscribe_charger_list(request: web.Request) -> EventSourceResponse:
    async with sse_response(request) as response:
        app = request.app
        queue: asyncio.Queue[str] = asyncio.Queue()
        print("charger joined.")
        app[chargers].add(queue)
        try:
            while response.is_connected():
                payload = await queue.get()
                await response.send(payload)
                queue.task_done()
        finally:
            app[chargers].remove(queue)
            print("charger left.")
    return response

async def chat(_request: web.Request) -> web.Response:
    html = """
    <html>
      <head>
        <title>Tiny Chat</title>
        <script
        src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js">
        </script>
        <style>
        .messages {
          overflow: scroll;
          height: 200px;
        }
        .messages .sender{
          float: left;
          clear: left;
          width: 120px;
          margin-right: 10px;
          text-align: right;
          background-color: #ddd;
        }
        .messages .message{
          float: left;
        }
        form {
          display: inline;
        }

        </style>
        <script>
          $(function(){
            var source = new EventSource("/subscribe");
            source.addEventListener('message', function(event) {
              console.log(event.data)
              message = JSON.parse(event.data);
              $('.messages').append(
              "<div class=sender>"+"event:"+"</div>"+
              "<div class=message>"+JSON.stringify(message)+"</div>");
            });
            $('form').submit(function(e){
              e.preventDefault();
              $.post('/everyone',
                {
                  sender: $('.name').text(),
                  message: $('form .message').val()
                })
              $('form .message').val('')
            });

            $('.change-name').click(function(){
              name = prompt("Enter your name:");
              $('.name').text(name);
            });
         });
        </script>
      </head>
      <body>
        <div class=messages></div>
        <button class=change-name>Change Name</button>
        <span class=name>Anonymous</span>
        <span>:</span>
      <form>
        <input class="message" placeholder="Message..."/>
        <input type="submit" value="Send" />
      </form>
      </body>
    </html>

    """
    return web.Response(text=html, content_type="text/html")

async def start_site(address='0.0.0.0', port=3021):
    global CHARGE_POINTS,app
    app = web.Application()
    app[channels] = set()
    app[chargers] = set()
    aiohttp_api_doc(app, config_path='openapi (1).yaml', url_prefix='/api/doc', title='API doc')
    app.router.add_route('POST', '/api/call', call_http)
    app.router.add_route('GET', '/handle', handle)
    app.router.add_route('GET', "/api/ping", ping)
    app.router.add_route("GET", "/", chat)
    app.router.add_route("POST","/everyone", message)
    app.router.add_route("GET", "/subscribe", subscribe)
    # app.router.add_route("GET", "/charger-list", subscribe_charger_list)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, address, port)
    await site.start()