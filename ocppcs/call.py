
from ocpp.v16.enums import Action
from ocpp.v16 import call, call_result


def get_call_payload(inp):
    print("@@@@@@@@@@@@@@@@@@@@@@@@@@", 'params' in inp.keys())
    if 'params' in inp.keys():
        params = inp["params"]
    method=inp['method']

    match method:
        case Action.RemoteStartTransaction:
            return call.RemoteStartTransactionPayload(
                connector_id=params['connectorId'],
                id_tag=params['idTag']
            )
        case Action.RemoteStopTransaction:
            return call.RemoteStopTransactionPayload(
                transaction_id=params['transactionId'],
            )
        case Action.GetConfiguration:
            return call.GetConfigurationPayload(
                key=params['key']
            )
        case Action.ChangeConfiguration:
            return call.ChangeConfigurationPayload(
                key=params['key'],
                value=params['value'],
            )
        case _:
            print("not implemented!")
            return None


def get_call_result(response, method):

    match method:
        case Action.RemoteStartTransaction:
            return {'status': response.status}
        case Action.RemoteStopTransaction:
            return {'status': response.status}
        case Action.GetConfiguration:
            return {'configurationKey': response.configuration_key}
        case Action.ChangeConfiguration:
            return {'status': response.status}
        case _:
            print("not implemented!")
            return None
