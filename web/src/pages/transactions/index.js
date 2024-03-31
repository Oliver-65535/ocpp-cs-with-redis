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
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { getData, runMethod } from '../../services/ocpp.service';
import { useEffect, useState } from 'react';

import MainCard from '../../components/MainCard';
import TransactionsTable from './TransactionsTable';

// material-ui

// project import

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Transactions = () => {
  const [data, setData] = useState({ chargepoints: [], tasks: [], transactions: [] });

  useEffect(() => {
    const timer = setInterval(() => {
      getData().then((e) => {
        // console.log("DDDDDDDDDDDDDDDDDDDDDDDDD",e)
        e.error == null ? setData(e.data) : setData({ chargepoints: [], tasks: [], transactions: [] });
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleRunMethod = (chargePointId, id) => {
    runMethod({ chargePointId, methodCall: 'RemoteStopTransaction', params: { transactionId: id } });
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 3 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Active Transactions</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <TransactionsTable rows={data.transactions} handleRunMethod={handleRunMethod} />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default Transactions;
