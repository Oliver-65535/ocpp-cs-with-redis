import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { clearLogs, getLogs } from '../../services/ocpp.service';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LogsTable } from './LogsTable'
import MainCard from 'components/MainCard';
import { useMemo } from 'react';
import { ListItem } from '../../../node_modules/@mui/material/index';

// const events = new EventSource('http://34.94.253.188:3021/subscribe');

// material-ui

// project import

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Row = (e) => 
  {
    return e.data.map((e, i) => (
      <><span>{JSON.stringify(e)}</span><br/></>
    // <ListItem
    //   key={i}
    //   disablePadding
    //   divider
    // >
    //   <ListItemButton onClick={() => {}}>
    //   <ListItemText primary={`${e?.chargePointId}`} />
    //     <ListItemText primary={`${e?.method}`} />
    //     <ListItemText primary={`${JSON.stringify(e.params)}`} />
    //   </ListItemButton>
    // </ListItem>
  ))
}


const Logs = () => {
  const [tasks, setTasks] = useState([]);
  const l = useRef([])
  
    

  // const n = useMemo((e)=>e,[logs.current])

  useEffect(() => {
    let mount = true;
    let events;
    let timer;
    let createEvents = () => {
       // Close connection if open
       if(events){
             events.close();
       }
       // Establishing an SSE connection
       const baseUrl = window.location.origin
       events = new EventSource(`${baseUrl}/api/subscribe`);
      //  events = new EventSource(`http://34.94.253.188:3021/api/subscribe`);
       events.onmessage = (event) => {
             // If the component is mounted, we set the state
             // of the list with the received data
             if(mount){
                let parsedData = JSON.parse(event.data);
                console.log(event.data)
                l.current = [parsedData, ...l.current];
                setTasks(l.current)
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
    }
 }, []);

  // useEffect(() => {
  //   // const timer = setInterval(() => {
  //   //   getLogs().then((e) => {
  //   //     // console.log("DDDDDDDDDDDDDDDDDDDDDDDDD",e)
  //   //     e.error == null ? setLogs(e.data) : setLogs({ logs: [] });
  //   //   });
  //   // }, 2000);

  //   // return () => clearInterval(timer);

  // }, []);

  // function pushLog(){
  //   console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
  //   setLogs([
  //     ...logs,
  //     logs.length+1
  //   ]);
  // }

  const handleClickClear = () => {
    clearLogs();
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 3 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Logs</Typography>
          </Grid>
          <Grid item>
            <Button onClick={handleClickClear}>Clear</Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Paper style={{ minHeight: 300, maxHeight: '90hv', overflow: 'auto' }}>
            {/* <List sx={{ p: 0 }}> */}
              {/* <LogsTable rows={l.current}></LogsTable> */}
              <pre><Row data={l.current}></Row></pre>
            {/* </List>         */}
          </Paper>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default Logs;
