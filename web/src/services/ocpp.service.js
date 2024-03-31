import axios from 'axios';

// const input = {
//   chargePointId: '111',
//   methodCall: 'RemoteStartTransaction',
//   params: { connectorId: 1, idTag: '2345' }
// };

// const URL = "http://localhost:3021/dashboard"
// const URL = 'http://34.94.253.188:3021/api';
const baseUrl = window.location.origin
const URL = `${baseUrl}/api`;
// const inputParams = JSON.stringify(input);
const customConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const runMethod = async ({ chargePointId, methodCall, params }) => {
  try {
    if (!chargePointId || !methodCall) {
      alert('Select ChargePoint and Command!');
    }

    console.log('QUERYDATA', chargePointId, methodCall, params);
    const inputParams = JSON.stringify({ chargePointId, method:methodCall, params });
    // const inputParams = { chargePointId, method:methodCall, params };
    const result = await axios.post(URL + '/call', inputParams, customConfig);
    console.log(result.data);
    return { error: null, data: result.data };
  } catch (error) {
    console.log(error);
    return { error: error?.message, data: null };
  }
};

export const getData = async () => {
  try {
    const result = await axios.get(URL + '/get-chargers');
     console.log(result.data);
    return { error: null, data: { chargepoints: result.data ?? [], tasks: [], transactions: [] } };
    // return { error: null, data: result.data };
  } catch (error) {
    console.log(error);
    return { error: error?.message, data: null };
  }
};

export const getLogs = async () => {
  try {
    const result = await axios.get(URL + '/get-logs');
    //  console.log(result.data);
    return { error: null, data: result.data };
  } catch (error) {
    console.log(error);
    return { error: error?.message, data: null };
  }
};

export const clearLogs = async () => {
  try {
    const result = await axios.get(URL + '/clear-logs');
    //  console.log(result.data);
    return { error: null, data: result.data };
  } catch (error) {
    console.log(error);
    return { error: error?.message, data: null };
  }
};
