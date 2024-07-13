import React, { useEffect, useState } from 'react';
import { database } from './firebase';
import { ref, onValue, remove } from 'firebase/database';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';



const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    borderRadius: 20,
    marginBottom: 2,
    width: 90,
    fontSize: 13,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#cc2916',
    borderColor: '#e1f2e6',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#cf594c',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  });




function Row(props) {
  const { rowKey, rowData, onDelete } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {rowKey}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h8" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Date & Time</TableCell>
                    <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Location</TableCell>
                    <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Penalty</TableCell>
                    <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Speed</TableCell>
                    <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(rowData).map((subKey) => (
                    <TableRow key={subKey}>
                      <TableCell sx={{ backgroundColor: '#ded5d5' }}>{rowData[subKey].date_time}</TableCell>
                      <TableCell sx={{ backgroundColor: '#ded5d5' }}>{rowData[subKey].location}</TableCell>
                      <TableCell sx={{ backgroundColor: '#ded5d5' }}>{rowData[subKey].penalty}</TableCell>
                      <TableCell sx={{ backgroundColor: '#ded5d5' }}>{rowData[subKey].speed}</TableCell>
                      <TableCell sx={{ backgroundColor: '#ded5d5' }}>{rowData[subKey].type}</TableCell>
                      <TableCell sx={{ backgroundColor: '#ded5d5' }} align="right">
                        <IconButton onClick={() => onDelete(rowKey, subKey)} sx={{ backgroundColor: '#c99797' }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  rowKey: PropTypes.string.isRequired,
  rowData: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function Penalty() {
  const [data, setData] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const penaltyRef = ref(database, 'Penalty');
    onValue(penaltyRef, (snapshot) => {
      setData(snapshot.val() || {});
    });
  }, []);

  const handleDelete = (mainKey, subKey) => {
    const subEntryRef = ref(database, `Penalty/${mainKey}/${subKey}`);
    remove(subEntryRef);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredData = Object.keys(data).filter((key) =>
    key.toLowerCase().includes(search.toLowerCase())
  ).reduce((obj, key) => {
    obj[key] = data[key];
    return obj;
  }, {});

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: 'auto', backgroundColor: '#e4ebe8', borderRadius: 2, boxShadow: 3 }}>
      <Paper sx={{ backgroundColor: '#166948', height: 80, width: '100%', marginBottom: 1, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
        Penalty Management
        </Typography>
      </Paper>

      <BootstrapButton variant="contained" color="primary" component={Link} to="/"sx={{  marginTop:0}}>Home</BootstrapButton>


      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        size="small"
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        style={{ marginBottom: 20 , marginTop:8}}
      />
      <TableContainer component={Paper}>
        <Table size="small" aria-label="penalty table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ backgroundColor: '#e6a3a3', fontWeight: 'bold' }}>Penalty Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(filteredData).map((mainKey) => (
              <Row key={mainKey} rowKey={mainKey} rowData={filteredData[mainKey]} onDelete={handleDelete} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
