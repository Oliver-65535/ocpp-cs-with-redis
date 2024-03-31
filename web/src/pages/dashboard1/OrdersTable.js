import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

// function createData(chargePointId, name,  carbs) {
//   return { chargePointId, name, carbs };
// }

// const rows = [
//   createData(84564564, 'Camera Lens', 2 ),
//   createData(98764564, 'Laptop', 0 ),
//   createData(98756325, 'Mobile', 1),
//   createData(98652366, 'Handset', 1),
//   createData(13286564, 'Computer Accessories', 1),
//   createData(86739658, 'TV', 0),
//   createData(13256498, 'Keyboard', 2),
//   createData(98753263, 'Mouse', 2),
//   createData(98753275, 'Desktop', 1),
//   createData(98753291, 'Chair', 0)
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
    disablePadding: true,
    label: 'id'
  },
  {
    id: 'chargePointId',
    align: 'left',
    disablePadding: false,
    label: 'ChargePoint'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Command'
  },
  // {
  //   id: 'fat',
  //   align: 'right',
  //   disablePadding: false,
  //   label: 'Total Order'
  // },
  {
    id: 'carbs',
    align: 'left',
    disablePadding: false,

    label: 'Status'
  },
  // {
  //   id: 'protein',
  //   align: 'right',
  //   disablePadding: false,
  //   label: 'Total Amount'
  // }
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
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Accepted';
      break;
    case 2:
      color = 'error';
      title = 'Rejected';
      break;
    case 3:
        color = 'success';
        title = 'Unlocked';
        break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};


const responceStatus = (response) => {
  let status;

  if(response){
    switch (response.status) {
      case "Accepted":
        status = 1;
        break;
      case "Rejected":
        status = 2;
        break;
      case "Unlocked":
        status = 3;
        break;  
      default:
        status = 4;
    }
  }
  else status = 0;
  return status
};

OrderStatus.propTypes = {
  status: PropTypes.number
};



// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable(props) {
  const [order] = useState('asc');
  const [orderBy] = useState('chargePointId');
  const [selected] = useState([]); 

  const isSelected = (chargePointId) => selected.indexOf(chargePointId) !== -1;

  const rows = props.data.map((e,i)=>{
    
      return { id:i, chargePointId:e.chargePointId, name: e.methodCall , carbs:responceStatus(e.response) };
    
  })

// console.log(" OrderTable(props)",props.data)

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
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row.id}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.chargePointId}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">
                    <OrderStatus status={row.carbs} />
                  </TableCell>
                  {/* <TableCell align="right">
                    <NumberFormat value={row.protein} displayType="text" thousandSeparator prefix="$" />
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
