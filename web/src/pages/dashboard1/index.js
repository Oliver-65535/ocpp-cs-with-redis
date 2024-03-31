import { useEffect, useRef, useState } from 'react';

// material-ui
import { Button, Grid, List, ListItemButton, ListItemText, Stack, Typography, Paper } from '@mui/material';

// import { OcppServiceClient } from '../../proto/generated/ocpp_pb';

// project import
import OrdersTable from './OrdersTable';
import ChargePointList from './ChargePointList';
import CallMethodList from './CallMethodList';
import ParamsList from './ParamsList';
import { callMethods } from './methods.list';
// import IncomeAreaChart from './IncomeAreaChart';

import ReportAreaChart from './ReportAreaChart';

import MainCard from 'components/MainCard';

import { runMethod, getData } from '../../services/ocpp.service';
// import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  // const [value, setValue] = useState('today');
  // const [reqParams, setReqParams] = useState({ chargePointId: '', methodCall: '', params: {} });
  const [data, setData] = useState({ chargepoints: [], tasks: [], transactions: [] });
  const [paramsIndex, setParamsIndex] = useState(0);
  const [form, setForm] = useState({});
  const [response, setResponse] = useState('');

  const [tasks, setTasks] = useState([]);
  const l = useRef([]);
  const [chargePoint, setChargePoint] = useState('');
  const [method, setMethod] = useState('');

  useEffect(() => {
    // const timer = setInterval(() => {
      getData().then((e) => {
        // console.log("DDDDDDDDDDDDDDDDDDDDDDDDD",e)
        e.error == null ? setData(e.data) : setData({ chargepoints: [], tasks: [], transactions: [] });
      });
    // }, 3000);

    // return () => clearInterval(timer);
  }, []);

  // const n = useMemo((e)=>e,[logs.current])

  useEffect(() => {
    let mount = true;
    let events;
    let timer;
    let createEvents = () => {
      // Close connection if open
      if (events) {
        events.close();
      }
      // Establishing an SSE connection
      const baseUrl = window.location.origin
       events = new EventSource(`${baseUrl}/api/subscribe`);
      // events = new EventSource(`http://34.94.253.188:3021/api/subscribe`);
      events.onmessage = (event) => {
        // If the component is mounted, we set the state
        // of the list with the received data
        if (mount) {
          let parsedData = JSON.parse(event.data);
          addEvent(parsedData)
          setTasks(l.current);
        }
      };
      // If an error occurs, we wait a second
      // and call the connection function again
      events.onerror = (err) => {
        timer = setTimeout(() => {
          createEvents();
        }, 1000);
      };
    };
    createEvents();

    // Before unmounting the component, we clean
    // the timer and close the connection
    return () => {
      mount = false;
      clearTimeout(timer);
      events.close();
    };
  }, []);

  const handleChangeMethod = (index) => {
    setParamsIndex(index);
  };


  const handleRunMethod = () => {
    runMethod({ chargePointId: chargePoint, methodCall: method, params: form }).then((e) => {
      setResponse([]);
    });
  };

  const handleGetData = () => {
    console.log(data);
  };

  function addEvent(data){
    const row = [new Date().toLocaleString(), data]
    l.current = [row, ...l.current];
  }

  const getChargePoint = (chargePointId) => {
    setChargePoint(chargePointId);
  };
  const getMethod = (e) => {
    console.log('GET_METHOD', e);
    // setClearParams(true);
    setForm({});
    // setTimeout(()=>{setClearParams(false)},100)
    setMethod(e);
  };
  const getParams = (e) => {
    // console.log("GET_PARAMS",e)
    setForm(e);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      {/* row 2 */}
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Charge Points</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ChargePointList getChargePoint={getChargePoint} list={data.chargepoints} />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Command</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <CallMethodList handleChangeMethod={handleChangeMethod} getMethod={getMethod} list={callMethods} />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Parameters</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ParamsList getParams={getParams} form={form} params={callMethods[paramsIndex].params} />
        </MainCard>
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Button color="success" variant="contained" onClick={handleRunMethod}>
            Run
          </Button>
        </Stack>
      </Grid>

      {/* row 3 */}
      {/* <Grid item xs={12} md={6} lg={6}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Task</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
        <Paper style={{minHeight: 300,maxHeight: 300, overflow: 'auto'}}>
            <OrdersTable data={data.tasks} />
        </Paper>
        </MainCard>
      </Grid> */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Logs</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Paper style={{ minHeight: 300, maxHeight: 300, overflow: 'auto' }}>
            <pre>
              {l.current.map((e, i) => (
                <>
                  <span>{JSON.stringify(e)}</span>
                  <br />
                </>
              ))}
            </pre>
            {/* {response} */}
          </Paper>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
