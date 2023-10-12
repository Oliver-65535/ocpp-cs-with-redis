import asyncio
from aiohttp import web

runners = []


async def start_site(app, address='localhost', port=8080):
    runner = web.AppRunner(app)
    runners.append(runner)

    await runner.setup()
    site = web.TCPSite(runner, address, port)
    await site.start()


loop = asyncio.get_event_loop()

loop.create_task(start_site(web.Application()))
loop.create_task(start_site(web.Application(), port=8081))
loop.create_task(start_site(web.Application(), port=8082))

try:
    loop.run_forever()
except:
    pass
finally:
    for runner in runners:
        loop.run_until_complete(runner.cleanup())
