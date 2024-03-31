
// material-ui
import {
  Box,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

// ==============================|| INCOME AREA CHART ||============================== //

const ParamsList = (props) => {
  const handlerChange = (event,field) => {
    const value = (field=="number") ? parseInt(event.target.value): event.target.value;
    // setForm();
    // console.log('GETPARAMCOMPONENT', props.form);
    props.getParams({ ...props.form, [event.target.name]: value });
  };

  const handlerChangeSelect = (event) => {
    const n = {};
    n[event.target.name] = event.target.value;
    Object.assign(n, props.form);
    props.getParams(n);
  };

  return (
    <Box style={{ minHeight: 240, maxHeight: 240, overflow: 'auto', padding: '10px' }}>
      {props.params &&
        props.params.map((e, i) => (
          <Box key={i} sx={{ mb: 2 }}>
            {e.type == 'input' ? (
              <Stack spacing={1}>
                <InputLabel id="1212">{e.name}</InputLabel>
                <TextField key={e.name+i}
                  required
                  id="outlined-required"
                  placeholder="Required *"
                  name={e.name}
                  value={props.form[e.name]}
                  defaultValue=""
                  onChange={(event)=>handlerChange(event,e.field)}
                />
              </Stack>
            ) : (
              <Stack spacing={1}>
                <InputLabel  id="demo-simple-select-helper-label">{e.name}</InputLabel>
                <Select
                  key={e.name+i}
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  name={e.name}
                  value={props.form[e.name]}
                  // defaultValue={e.list[0]}
                  onChange={handlerChangeSelect}
                >
                  {e.list.map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>helper text</FormHelperText> */}
              </Stack>
            )}
          </Box>
        ))}
    </Box>
  );
};

// ChargePointList.propTypes = {
//   slot: PropTypes.string
// };

export default ParamsList;
