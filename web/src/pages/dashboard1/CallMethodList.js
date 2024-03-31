import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  Paper,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  FixedSizeList,
  ListItemText,
  ListItemIcon,
  ListItem,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';

// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| INCOME AREA CHART ||============================== //

const CallMethodList = (props) => {

  const[selected,setSelected]=useState('')

  const handleSelect = (e,i) =>{
    props.handleChangeMethod(i)
    props.getMethod(e)
    setSelected(e)
  }

  return  (
    <Paper style={{maxHeight: 300, overflow: 'auto'}}>
  {props?.list ? (
     <List sx={{ p: 0 }}>
     {
       props.list.map((e,i)=>(
         <ListItem key={i}  sx={selected==e.action ? {
             background:'#95de64',
         }:null} disablePadding divider>
     <ListItemButton onClick={()=>handleSelect(e.action,i)}>
       <ListItemText primary={`${e.action}`} />
     </ListItemButton>
   </ListItem>
       ))
     }
 </List>
  ):null}
 
</Paper>);
};

// ChargePointList.propTypes = {
//   slot: PropTypes.string
// };

export default CallMethodList;
