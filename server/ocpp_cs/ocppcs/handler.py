import json
from datetime import datetime
import time
from ocpp.routing import on
from ocpp.v16 import ChargePoint as cp
from ocpp.v16 import call_result
from ocpp.v16.enums import Action, RegistrationStatus, AuthorizationStatus

# from main import redis, channel
# from ocppcs.redis import redis, channel
from utils.varcaseconverter import snake_to_camel_case

from api import event 

class ChargePoint(cp):
    @on(Action.BootNotification)
    async def on_boot_notification(
        self, charge_point_vendor: str, charge_point_model: str, **kwargs
    ):
        payload = {
            'chargePointId': self.id,
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

    @on(Action.Heartbeat)
    async def on_heartbet(
        self, **kwargs
    ):
        payload = {
            'chargePointId': self.id,
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
        transaction_id=1 #int(time.time_ns()/10000000)
        payload = {
            'chargePointId': self.id,
            'method': Action.StartTransaction,
            'params': {
                'connectorId': connector_id,
                'idTag': id_tag,
                'meterStart': meter_start,
                'timestamp': timestamp,
                'transactionId':transaction_id,
                **snake_to_camel_case(kwargs)
            }
        }
        await publish_redis_message(payload)
        return call_result.StartTransactionPayload(
            id_tag_info={
                'status': AuthorizationStatus.accepted
            },
            transaction_id=transaction_id
        )

    @on(Action.StopTransaction)
    async def on_stop_transaction(
        self, transaction_id: int, timestamp: str, meter_stop: int, **kwargs
    ):
        payload = {
            'chargePointId': self.id,
            'method': Action.StopTransaction,
            'params': {
                'meterStop': meter_stop,
                'timestamp': timestamp,
                'transactionId': transaction_id,
                **snake_to_camel_case(kwargs)
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
        self, connector_id: int, meter_value: list, **kwargs
    ):
        payload = {
            'chargePointId': self.id,
            'method': Action.MeterValues,
            'params': {
                'connectorId': connector_id,
                'meterValue': meter_value,
                **snake_to_camel_case(kwargs)
            }
        }

        await publish_redis_message(payload)
        return call_result.MeterValuesPayload()

    @on(Action.StatusNotification)
    async def on_status_notification(
        self, connector_id, error_code, status, **kwargs
    ):

        payload = {
            'chargePointId': self.id,
            'method': Action.StatusNotification,
            'params': {
                'connectorId': connector_id,
                'status': status,
                'errorCode': error_code,
                **snake_to_camel_case(kwargs)
            }
        }
        print('kwargs', kwargs)

        await publish_redis_message(payload)
        return call_result.StatusNotificationPayload()

    @on(Action.DataTransfer)
    async def on_data_transfer(
        self, vendor_id: str, **kwargs
    ):

        payload = {
            'chargePointId': self.id,
            'method': Action.DataTransfer,
            'params': {
                'vendorId': vendor_id,
                **snake_to_camel_case(kwargs)
            }
        }
        await publish_redis_message(payload)
        return call_result.StopTransactionPayload(
            id_tag_info={
                'status': AuthorizationStatus.accepted
            }
        )


async def publish_redis_message(payload):
    # data = json.dumps(payload)
    await event(payload)
    # return data