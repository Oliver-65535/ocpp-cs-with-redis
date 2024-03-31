import json
import asyncio
import logging

from ocppcs.handler import ChargePoint
from api import start_site
from charge_points import CHARGE_POINTS
from api import event

try:
    import websockets
except ModuleNotFoundError:
    print("This example relies on the 'websockets' package.")
    print("Please install it by running: ")
    print()
    print(" $ pip install websockets")
    import sys

    sys.exit(1)

logging.basicConfig(level=logging.INFO)


async def on_connect(websocket, path):
    """For every new charge point that connects, create a ChargePoint
    instance and start listening for messages.
    """
    try:
        requested_protocols = websocket.request_headers["Sec-WebSocket-Protocol"]
    except websockets.ConnectionClosedOK:
        logging.info('Connection closed properly')
    except websockets.ConnectionClosedError:
        logging.info('Connection closed with an error')
    except Exception as e:
        print(e)
        print('Generic Exception caught in {}'.format(e))
    except KeyError:
        logging.error("Client hasn't requested any Subprotocol. Closing Connection")
        return await websocket.close()
    finally:
        logging.info('Connection closed with an error FINNALY')
    # finally:
    #     disconnect()
        # print("DISCONNECT", websocket)
        # del CHARGE_POINTS[charge_point_id]
        # await emit_charger_list(list(CHARGE_POINTS.keys()))
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
   

    charge_point_id = path.rsplit('/', 1)[-1]
    # CONNECTIONS[websocket] = {"charge_point_id": charge_point_id}
    CHARGE_POINTS[charge_point_id] = ChargePoint(charge_point_id, websocket)
    print(charge_point_id)
    # await event({'sender':'chargePoint','message':charge_point_id})
    payload = {
            'chargePointId': charge_point_id,
            'method': 'connected',
            'params': {'chargers':list(CHARGE_POINTS.keys())}
        }
    await event(payload)
    await CHARGE_POINTS[charge_point_id].start()
    
def disconnect():
    # del CHARGE_POINTS[charge_point_id]
    payload = {
            'method': 'diconnected',
            'params': {'chargers':list(CHARGE_POINTS.keys())}
        }
    # await event(payload)
    print(f"diconnected UUUUUUUUUUU:", list(CHARGE_POINTS.keys()))

async def async_redis_publish(data):
    # await redis.publish(channel, data)
    print(f"Функция async_redis_publish завершена:", data)

        
def json_to_data(json_data):
    try:
        return json.loads(json_data)
    except ValueError:  # includes simplejson.decoder.JSONDecodeError
        print('Decoding JSON has failed')

async def main():
    # global CHARGE_POINTS
    server = await websockets.serve(
        on_connect, "0.0.0.0", 11180, subprotocols=["ocpp1.6"]
    )

    logging.info("Server OCPP Started. Port:11180")
    logging.info("Server HTTP API Started. Port:3021")
    await server.wait_closed()

loop = asyncio.get_event_loop()

loop.create_task(main())
loop.create_task(start_site())
# loop.create_task(process_events())

try:
    loop.run_forever()
except:
    pass
finally:
    loop.run_until_complete(main())
    loop.run_until_complete(start_site())
    # loop.run_until_complete(process_events())


# async def main():
#     async with await websockets.serve(
#         on_connect, "0.0.0.0", 11180, subprotocols=["ocpp1.6"]
#     ):
#         # await sse_redis()  # runs forever
#         await process_events()  # runs forever


# if __name__ == "__main__":
#     asyncio.run(main())


