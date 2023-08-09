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
import time
from promisio import promisify
from ocppcs.call import get_call_payload,get_call_result

# from ocpp.routing import on
# from ocpp.v16 import ChargePoint as cp
# from ocpp.v16 import call_result
from ocpp.v16 import call
# from ocpp.v16.enums import Action, RegistrationStatus, AuthorizationStatus

logging.basicConfig(level=logging.INFO)

# redis_url = 'redis://localhost:6379/0'
# channel = 'test'

# redis = aioredis.from_url(redis_url)

# connection = redis.StrictRedis.from_url(redis_url, decode_responses=True)

# pubsub = connection.pubsub(ignore_subscribe_messages=False)
# pubsub.subscribe(channel)

pubsub=''

CHARGE_POINTS = {}

# async def handler(websocket,path):
#     """Authenticate user and register connection in CONNECTIONS."""
#     sesame = await websocket.recv()
    
#     # CONNECTIONS[websocket] = {"content_type_ids": "Эt_ids"}
#     try:
#         charge_point_id = path.strip("/")
#         CHARGE_POINTS[charge_point_id] = ChargePoint(charge_point_id, websocket)
#         print("CCCCCCCCCCCCCCCCCCCC",CHARGE_POINTS[charge_point_id])
#         await CHARGE_POINTS[charge_point_id].start()
#         await websocket.wait_closed()
#     finally:
#         del CHARGE_POINTS[websocket]
#         print("DDDDDDDDDDDDDDDDDD",CHARGE_POINTS[websocket])

async def on_connect(websocket, path):
    """For every new charge point that connects, create a ChargePoint
    instance and start listening for messages.
    """
    try:
        requested_protocols = websocket.request_headers["Sec-WebSocket-Protocol"]
    except websockets.exceptions.ConnectionClosed:
            print("Client disconnected.  Do cleanup")
    except KeyError:
        logging.error("Client hasn't requested any Subprotocol. Closing Connection")
        return await websocket.close()
    # finally:
    #     print("DISCONNECT", websocket)
    #     # del CONNECTIONS[websocket]
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
    # CONNECTIONS[websocket] = {"charge_point_id": charge_point_id}
    CHARGE_POINTS[charge_point_id] = ChargePoint(charge_point_id, websocket)
    print(charge_point_id)
    await CHARGE_POINTS[charge_point_id].start()

async def async_redis_publish(data):
    await redis.publish(channel, data)
    print(f"Функция async_redis_publish завершена:", data)

        
   
async def async_call(event):
    input_params = get_call_payload(event)
    response = await CHARGE_POINTS[event['chargePointId']].call(input_params)
    params = get_call_result(response,event['method'])
    payload = {
                'chargePointId': event['chargePointId'],
                'action': 'response',
                'actionId': event['actionId'],
                'method': event['method'],
                'params': params
            }
    data = json.dumps(payload)
    asyncio.create_task(async_redis_publish(data))

def json_to_data(json_data):
    try:
        return json.loads(json_data)
    except ValueError:  # includes simplejson.decoder.JSONDecodeError
        print('Decoding JSON has failed')

async def process_events():
    try:
        pubsub = redis.pubsub()
    except KeyError:  # includes simplejson.decoder.JSONDecodeError
        logging.error("ChargePoint not connected!")
    # pubsub = redis.pubsub()
    await pubsub.subscribe(channel)
    async for message in pubsub.listen():
        if message["type"] != "message":
            continue
        payload = message["data"].decode()
        # Broadcast event to all users who have permissions to see it.
        event_data = json_to_data(payload)
        print("===============================================",event_data)
        if len(payload) > 0 and type(event_data)is dict and 'data' in event_data.keys():
            data = event_data['data']
            if data['action']=='request':
                asyncio.create_task(async_call(event_data['data']))
            


async def main():
    async with await websockets.serve(
        on_connect, "0.0.0.0", 11180, subprotocols=["ocpp1.6"]
    ):
        await process_events()  # runs forever


if __name__ == "__main__":
    asyncio.run(main())


