import json
from datetime import datetime
import time
from ocpp.routing import on
from ocpp.v16 import ChargePoint as cp
from ocpp.v16 import call_result
from ocpp.v16.enums import Action, RegistrationStatus, AuthorizationStatus

# from main import redis, channel
from ocppcs.redis import redis, channel


class ChargePoint(cp):
    @on(Action.BootNotification)
    async def on_boot_notification(
        self, charge_point_vendor: str, charge_point_model: str, **kwargs
    ):
        payload = {
            'chargePointId': self.id,
            'action': 'event',
            'actionId': None,
            'method': Action.BootNotification,
            'params': {
                'chargePointVendor': charge_point_vendor,
                'chargePointModel': charge_point_model
            }

        }
        await publish_redis_message(payload)
        # await redis.publish(channel,message)
        return call_result.BootNotificationPayload(
            current_time=datetime.utcnow().isoformat(),
            interval=10,
            status=RegistrationStatus.accepted,
        )

    # @on("disconnect")
    # async def on_disconnect(self):
    #     # payload = {}
    #     # await publish_redis_message( payload)
    #     print("DISCONNECT")

    @on(Action.Heartbeat)
    async def on_heartbet(
        self, **kwargs
    ):
        payload = {
            'chargePointId': self.id,
            'action': 'event',
            'actionId': None,
            'method': Action.Heartbeat,
            'params': {}
        }
        await publish_redis_message(payload)
        return call_result.HeartbeatPayload(
            current_time=datetime.utcnow().isoformat())

    @on(Action.Authorize)
    async def on_authorize(self, id_tag: any, **kwargs):
        payload = {
            'chargePointId': self.id,
            'action': 'event',
            'actionId': None,
            'method': Action.Authorize,
            'params': {'idTag': id_tag}
        }
        await publish_redis_message(payload)
        return call_result.AuthorizePayload(
            id_tag_info={
                'status': AuthorizationStatus.accepted
            }
        )

    @on(Action.StartTransaction)
    async def on_start_transaction(
        self, connector_id: int, id_tag, meter_start, reservation_id, timestamp, **kwargs
    ):
        payload = {
            'chargePointId': self.id,
            'action': 'event',
            'actionId': None,
            'method': Action.StartTransaction,
            'params': {
                'connectorId': connector_id,
                'idTag': id_tag,
                'meterStart': meter_start,
                'reservationId': reservation_id,
                'timestamp': timestamp,
            }
        }
        await publish_redis_message(payload)
        return call_result.StartTransactionPayload(
            id_tag_info={
                'status': AuthorizationStatus.accepted
            },
            transaction_id=int(time.time_ns()/10000000)
        )

    @on(Action.StopTransaction)
    async def on_stop_transaction(
        self, transaction_id: int, timestamp, meter_stop: int, id_tag: str, **kwargs
    ):
        payload = {
            'chargePointId': self.id,
            'action': 'event',
            'actionId': None,
            'method': Action.StopTransaction,
            'params': {
                'idTag': id_tag,
                'meterStop': meter_stop,
                'timestamp': timestamp,
                'transactionId': transaction_id,
                **kwargs
            }
        }
        await publish_redis_message(payload)
        return call_result.StopTransactionPayload(
            id_tag_info={
                'status': AuthorizationStatus.accepted
            }
        )

    @on(Action.MeterValues)
    async def on_meter_values(
        self, connector_id: int, transaction_id: int, meter_value, **kwargs
    ):
        payload = {
            'chargePointId': self.id,
            'action': 'event',
            'actionId': None,
            'method': Action.MeterValues,
            'params': {
                'connectorId': connector_id,
                'transactionId': transaction_id,
                'meterValue': meter_value
            }
        }

        await publish_redis_message(payload)
        return call_result.MeterValuesPayload()

    @on(Action.StatusNotification)
    async def on_status_notification(
        self, connector_id, error_code, info, status, timestamp, vendor_id, vendor_error_code, **kwargs
    ):
        payload = {
            'chargePointId': self.id,
            'action': 'event',
            'actionId': None,
            'method': Action.StatusNotification,
            'params': {
                'connectorId': connector_id,
                'errorCode': error_code,
                'info': info,
                'status': status,
                'timestamp': timestamp,
                'vendorId': vendor_id,
                'vendorErrorCode': vendor_error_code
            }
        }

        await publish_redis_message(payload)
        return call_result.StatusNotificationPayload()


async def publish_redis_message(payload):
    data = json.dumps(payload)
    await redis.publish(channel, data)
    return data
