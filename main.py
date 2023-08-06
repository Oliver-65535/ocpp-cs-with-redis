import json
# import redis
import asyncio
import logging

from ocppcs.handler import ChargePoint
try:
    import websockets
except ModuleNotFoundError:
    print("This example relies on the 'websockets' package.")
    print("Please install it by running: ")
    print()
    print(" $ pip install websockets")
    import sys

    sys.exit(1)

from ocppcs.redis import redis, channel

# from ocpp.routing import on
# from ocpp.v16 import ChargePoint as cp
# from ocpp.v16 import call_result
# from ocpp.v16.enums import Action, RegistrationStatus, AuthorizationStatus

logging.basicConfig(level=logging.INFO)

# redis_url = 'redis://localhost:6379/0'
# channel = 'test'

# redis = aioredis.from_url(redis_url)

# connection = redis.StrictRedis.from_url(redis_url, decode_responses=True)

# pubsub = connection.pubsub(ignore_subscribe_messages=False)
# pubsub.subscribe(channel)

pubsub=''

async def on_connect(websocket, path):
    """For every new charge point that connects, create a ChargePoint
    instance and start listening for messages.
    """
    try:
        requested_protocols = websocket.request_headers["Sec-WebSocket-Protocol"]
    except KeyError:
        logging.error("Client hasn't requested any Subprotocol. Closing Connection")
        return await websocket.close()
    if websocket.subprotocol:
        logging.info("Protocols Matched: %s", websocket.subprotocol)
    else:
        # In the websockets lib if no subprotocols are supported by the
        # client and the server, it proceeds without a subprotocol,
        # so we have to manually close the connection.
        logging.warning(
            "Protocols Mismatched | Expected Subprotocols: %s,"
            " but client supports  %s | Closing connection",
            websocket.available_subprotocols,
            requested_protocols,
        )
        return await websocket.close()

    charge_point_id = path.strip("/")
    cp = ChargePoint(charge_point_id, websocket)

    await cp.start()

async def process_events():
    # """Listen to events in Redis and process them."""
    
    pubsub = redis.pubsub()
    await pubsub.subscribe(channel)
    async for message in pubsub.listen():
        if message["type"] != "message":
            continue
        payload = message["data"].decode()
        # Broadcast event to all users who have permissions to see it.
        event = json.loads(payload)
        print(payload,event)
        # recipients = (
        #     websocket
        #     for websocket, connection in CONNECTIONS.items()
        #     if event["content_type_id"] in connection["content_type_ids"]
        # )
        # websockets.broadcast(recipients, payload)


async def main():
    async with await websockets.serve(
        on_connect, "0.0.0.0", 9000, subprotocols=["ocpp1.6"]
    ):
        await process_events()  # runs forever


if __name__ == "__main__":
    asyncio.run(main())


