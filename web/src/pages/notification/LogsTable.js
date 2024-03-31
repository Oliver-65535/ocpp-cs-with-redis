import { Box, Button, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import Dot from 'components/@extended/Dot';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';


// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  // {
  //   id: 'id',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'id'
  // },
  {
    id: 'chargePointId',
    align: 'left',
    disablePadding: false,
    label: 'chargePointId'
  },
  {
    id: 'method',
    align: 'left',
    disablePadding: true,
    label: 'method'
  },
  {
    id: 'params',
    align: 'left',
    disablePadding: false,
    label: 'params'
  },
  // {
  //   id: 'idTag',
  //   align: 'left',
  //   disablePadding: false,

  //   label: 'idTag'
  // },
  // {
  //   id: 'reasonStart',
  //   align: 'left',
  //   disablePadding: false,

  //   label: 'reasonStart'
  // },
  // {
  //   id: 'reasonStop',
  //   align: 'left',
  //   disablePadding: false,

  //   label: 'reasonStop'
  // },
  // {
  //   id: 'meterStart',
  //   align: 'left',
  //   disablePadding: false,

  //   label: 'meterStart'
  // },
  // {
  //   id: 'meterStop',
  //   align: 'left',
  //   disablePadding: false,

  //   label: 'meterStop'
  // },
  // {
  //   id: 'started_at',
  //   align: 'left',
  //   disablePadding: false,

  //   label: 'started_at'
  // },
  // {
  //   id: 'stopped_at',
  //   align: 'left',
  //   disablePadding: false,

  //   label: 'stopped_at'
  // },
  // {
  //   id: 'start',
  //   align: 'left',
  //   disablePadding: false,

  //   label: 'start'
  // },
  // {
  //   id: 'stop',
  //   align: 'left',
  //   disablePadding: false,

  //   label: 'stop'
  // },
  // {
  //   id: 'status',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'status'
  // },
  // {
  //   id: 'button',
  //   align: 'right',
  //   disablePadding: false,
  //   label: 'action'
  // }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            // key={headCell.}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            // sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 'Preparing':
      color = 'primary';
      title = 'Preparing';
      break;
    case 'Charging':
      color = 'success';
      title = 'Charging';
      break;
    case 'Finishing':
      color = 'warning';
      title = 'Finishing';
      break;
    default:
      color = 'error';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export function LogsTable(props) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const rows = props.rows;

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {rows.map((row, index) => {
              const isItemSelected = isSelected(row.trackingNo);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={index}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row.chargePointId}
                    </Link>
                  </TableCell>
                  {/* <TableCell align="left">{row.chargePointId}</TableCell> */}
                  <TableCell align="left">{row.method}</TableCell>
                  <TableCell align="left">{JSON.stringify(row.params)}</TableCell>
                  {/* <TableCell align="left">{row.transactionId}</TableCell> */}
                  {/* <TableCell align="left">{row.idTag}</TableCell> */}
                  {/* <TableCell align="left">{row.reasonStart}</TableCell>
                  <TableCell align="left">{row.reasonStop}</TableCell> */}
                  {/* <TableCell align="left">{row.meterStart}</TableCell>
                  <TableCell align="left">{row.meterStop}</TableCell> */}
                  {/* <TableCell align="left">{new Date(row.started_at).toLocaleString()}</TableCell> */}
                  {/* <TableCell align="left">{row.stopped_at ? new Date(row.stopped_at).toLocaleString() : null}</TableCell> */}
                  {/* <TableCell align="left">{row.start}</TableCell>
                  <TableCell align="left">{row.stop}</TableCell> */}
                  {/* <TableCell align="left">{row.status}</TableCell>
                  <TableCell align="left">
                    <OrderStatus status={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Button onClick={() => props.handleRunMethod(row.chargePointId, row.transactionId)}>Stop</Button> */}
                    {/* <NumberFormat value={row.status} displayType="text" thousandSeparator prefix="$" /> */}
                  {/* </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
