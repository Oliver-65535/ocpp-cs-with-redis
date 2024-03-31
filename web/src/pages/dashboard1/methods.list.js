export const callMethods = [
  {
    action: 'ChangeConfiguration',
    params: [
      { type: 'input', name: 'key' },
      { type: 'input', name: 'value' }
    ]
  },
  {
    action: 'ClearCache',
    params: []
  },
  {
    action: 'GetDiagnostics',
    params: [{ type: 'input', name: 'location' }]
  },
  {
    action: 'RemoteStartTransaction',
    params: [
      { type: 'input', field: 'number', name: 'connectorId' },
      { type: 'input', name: 'idTag' },
    // { type: 'input', name: 'transactionId' }
    ]
  },
  {
    action: 'RemoteStopTransaction',
    params: [{ type: 'input', field: 'number', name: 'transactionId' }]
  },
  {
    action: 'Reset',
    params: [{ type: 'select', name: 'type', list: ['Soft', 'Hard'] }]
  },
  {
    action: 'UnlockConnector',
    params: [{ type: 'input', field: 'number', name: 'connectorId' }]
  },
  {
    action: 'ReserveNow',
    params: [
      { type: 'input', field: 'number', name: 'connectorId' },
      { type: 'input', field: 'number', name: 'expiryDate' },
      { type: 'input', name: 'idTag' },
      { type: 'input', field: 'number', name: 'reservationId' }
    ]
  },
  {
    action: 'CancelReservation',
    params: [{ type: 'input', field: 'number', name: 'reservationId' }]
  },
  {
    action: 'DataTransfer',
    params: [
      { type: 'input', name: 'vendorId' },
      { type: 'input', name: 'messageId' },
      { type: 'input', name: 'data' }
    ]
  },
  {
    action: 'GetConfiguration',
    params: [{ type: 'input', name: 'key' }]
  },
  {
    action: 'GetLocalListVersion',
    params: []
  },
  {
    action: 'SendLocalList',
    params: [
      { type: 'input', field: 'number', name: 'listVersion' },
      { type: 'input', name: 'localAuthorizationList' }
    ]
  },
  {
    action: 'TriggerMessage',
    params: [
      {
        type: 'select',
        name: 'requestedMessage',
        list: [
          'BootNotification',
          'DiagnosticsStatusNotification',
          'FirmwareStatusNotification',
          'Heartbeat',
          'MeterValues',
          'StatusNotification'
        ]
      },
      { type: 'input', field: 'number', name: 'connectorId' }
    ]
  },
  {
    action: 'GetCompositeSchedule',
    params: [
      { type: 'input', field: 'number', name: 'connectorId' },
      { type: 'input', field: 'number', name: 'duration' },
      { type: 'input', name: 'chargingRateUnit' }
    ]
  },
  {
    action: 'SetChargingProfile',
    params: [{ type: 'input', field: 'number', name: 'id' }]
  },
  {
    action: 'ClearChargingProfile',
    params: [{ type: 'input', field: 'number', name: 'id' }]
  }
];
