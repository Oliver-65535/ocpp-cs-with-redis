
from ocpp.v16.enums import Action
from ocpp.v16 import call, call_result


def get_call_payload(inp):
    # print("@@@@@@@@@@@@@@@@@@@@@@@@@@", 'params' in inp.keys())
    if 'params' in inp.keys():
        params = inp["params"]
    method=inp['method']

    match method:
        case Action.ChangeAvailability:
            return call.ChangeAvailabilityPayload(
                type=params['type']
            )
        case Action.GetConfiguration:
            return call.GetConfigurationPayload(
                key=params['key']
            )
        case Action.ChangeConfiguration:
            return call.ChangeConfigurationPayload(
                key=[params['key']],
                value=params['value'],
            )
        case Action.RemoteStartTransaction:
            return call.RemoteStartTransactionPayload(
                connector_id=params['connectorId'],
                id_tag=params['idTag']
            )
        case Action.RemoteStopTransaction:
            return call.RemoteStopTransactionPayload(
                transaction_id=params['transactionId'],
            )
        case Action.ClearCache:
            return call.ClearCachePayload()
        case Action.GetDiagnostics:
            return call.GetDiagnosticsPayload(
                location=params['location']
            )
        case Action.Reset:
            return call.ResetPayload(
                type=params['type']
            )
        case Action.UnlockConnector:
            return call.UnlockConnectorPayload(
                connector_id=params['connectorId']
            )
        case Action.ReserveNow:
            return call.ReserveNowPayload(
                connector_id=params['connectorId'],
                expiry_date=params['expiryDate'],
                id_tag=params['idTag'],
                reservation_id=params['reservationId'],
            )
        case Action.CancelReservation:
            return call.CancelReservationPayload(
                reservation_id=params['reservationId'],
            )
        case Action.DataTransfer:
            return call.DataTransferPayload(
                vendor_id=params['vendorId'],
                message_id=params['messageId'],
                data=params['data'],
            )
        case Action.GetLocalListVersion:
            return call.GetLocalListVersionPayload()
        case Action.SendLocalList:
            return call.SendLocalListPayload(
                list_version=params['listVersion'],
                local_authorization_list=params['localAuthorizationList']
            )
        case Action.TriggerMessage:
            return call.TriggerMessagePayload(
                requested_message=params['requestedMessage'],
                connector_id=params['connectorId']
            )
        case _:
            print("not implemented!")
            return None


def get_call_result(response, method):

    match method:
        case Action.ChangeAvailability:
            call_result.ChangeAvailabilityPayload()
            return {'status': response.status}
        case Action.RemoteStartTransaction:
            return {'status': response.status}
        case Action.RemoteStopTransaction:
            return {'status': response.status}
        case Action.GetConfiguration:
            return {'configurationKey': response.configuration_key}
        case Action.ChangeConfiguration:
            return {'status': response.status}
        case Action.ClearCache:
            return {'status': response.status}
        case Action.GetDiagnostics:
            return {'fileName': response.file_name}
        case Action.Reset:
            return {'status': response.status}
        case Action.UnlockConnector:
            return {'status': response.status}
        case Action.ReserveNow:
            return {'status': response.status}
        case Action.CancelReservation:
            return {'status': response.status}
        case Action.DataTransfer:
            return {'status': response.status}
        case Action.GetLocalListVersion:
            return {'listVersion': response.list_version}
        case Action.SendLocalList:
            return {'status': response.status}
        case Action.TriggerMessage:
            return {'status': response.status}  
        case _:
            print("not implemented!")
            return None


# def get_call_payload(inp):
#     # print("@@@@@@@@@@@@@@@@@@@@@@@@@@", 'params' in inp.keys())
#     if 'params' in inp.keys():
#         params = inp["params"]
#     method=inp['method']

#     match method:
#         case Action.RemoteStartTransaction:
#             return call.RemoteStartTransactionPayload(
#                 connector_id=params['connectorId'],
#                 id_tag=params['idTag']
#             )
#         case Action.RemoteStopTransaction:
#             return call.RemoteStopTransactionPayload(
#                 transaction_id=params['transactionId'],
#             )
#         case Action.GetConfiguration:
#             return call.GetConfigurationPayload(
#                 key=params['key']
#             )
#         case Action.ChangeConfiguration:
#             return call.ChangeConfigurationPayload(
#                 key=params['key'],
#                 value=params['value'],
#             )
#         case _:
#             print("not implemented!")
#             return None


# def get_call_result(response, method):

#     match method:
#         case Action.RemoteStartTransaction:
#             return {'status': response.status}
#         case Action.RemoteStopTransaction:
#             return {'status': response.status}
#         case Action.GetConfiguration:
#             return {'configurationKey': response.configuration_key}
#         case Action.ChangeConfiguration:
#             return {'status': response.status}
#         case _:
#             print("not implemented!")
#             return None
