import { Box, Button, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import Dot from 'components/@extended/Dot';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';

// material-ui

// third-party

// project import

// const rows = [
//   {
//     chargePointId: '111',
//     connectorId: 1,
//     transactionId: 1,
//     idTag: 'sdf',
//     reasonStart: 'ghhgh',
//     reasonStop: 'ghhgh',
//     meterStart: 'ghhgh',
//     meterStop: 'ghhgh',
//     reservationId: 0,
//     started_at: 'ghhgh',
//     stopped_at: 'ghhgh',
//     authorize: 'ghhgh',
//     start: 'ghhgh',
//     stop: 'ghhgh',
//     status: 'ghhgh'
//   }
// ];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'id'
  },
  {
    id: 'chargePointId',
    align: 'left',
    disablePadding: false,
    label: 'chargePointId'
  },
  {
    id: 'connectorId',
    align: 'left',
    disablePadding: true,
    label: 'connectorId'
  },
  {
    id: 'transactionId',
    align: 'left',
    disablePadding: false,
    label: 'transactionId'
  },
  {
    id: 'idTag',
    align: 'left',
    disablePadding: false,

    label: 'idTag'
  },
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
  {
    id: 'started_at',
    align: 'left',
    disablePadding: false,

    label: 'started_at'
  },
  {
    id: 'stopped_at',
    align: 'left',
    disablePadding: false,

    label: 'stopped_at'
  },
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
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'status'
  },
  {
    id: 'button',
    align: 'right',
    disablePadding: false,
    label: 'action'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
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

export default function TransactionsTable(props) {
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
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
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
                      {index}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.chargePointId}</TableCell>
                  <TableCell align="left">{row.connectorId}</TableCell>
                  <TableCell align="left">{row.transactionId}</TableCell>
                  <TableCell align="left">{row.idTag}</TableCell>
                  {/* <TableCell align="left">{row.reasonStart}</TableCell>
                  <TableCell align="left">{row.reasonStop}</TableCell> */}
                  {/* <TableCell align="left">{row.meterStart}</TableCell>
                  <TableCell align="left">{row.meterStop}</TableCell> */}
                  <TableCell align="left">{new Date(row.started_at).toLocaleString()}</TableCell>
                  <TableCell align="left">{row.stopped_at ? new Date(row.stopped_at).toLocaleString() : null}</TableCell>
                  {/* <TableCell align="left">{row.start}</TableCell>
                  <TableCell align="left">{row.stop}</TableCell> */}
                  {/* <TableCell align="left">{row.status}</TableCell> */}
                  <TableCell align="left">
                    <OrderStatus status={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Button onClick={() => props.handleRunMethod(row.chargePointId, row.transactionId)}>Stop</Button>
                    {/* <NumberFormat value={row.status} displayType="text" thousandSeparator prefix="$" /> */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
