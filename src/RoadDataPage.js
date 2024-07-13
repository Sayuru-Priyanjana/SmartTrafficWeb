import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button ,Typography} from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase';
import ListIcon from '@mui/icons-material/List';
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





const RoadDataPage = () => {
  const [selectedValue, setSelectedValue] = useState('All');
  const [crossingData, setCrossingData] = useState([]);
  const [filteredCrossingData, setFilteredCrossingData] = useState([]);
  const [filteredHighSpeedData, setFilteredHighSpeedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const items = ['All', 'location_1', 'location_2'];

  useEffect(() => {
    const speedDataRef = ref(database, 'RoadData/SpeedData');
    onValue(speedDataRef, (snapshot) => {
      const data = snapshot.val();
      const dataArray = Object.keys(data).map(key => ({
        ...data[key],
        id: key
      })).sort((a, b) => new Date(b.date_time) - new Date(a.date_time)); // Sort by date in descending order

      setCrossingData(dataArray);
    });
  }, []);

  useEffect(() => {
    let filteredData = crossingData;

    if (selectedValue !== 'All') {
      filteredData = crossingData.filter(item => item.location === selectedValue);
    }

    const highSpeed = filteredData.filter(item => item.speed > 11);

    setFilteredCrossingData(filteredData);
    setFilteredHighSpeedData(highSpeed);
  }, [crossingData, selectedValue]);

  useEffect(() => {
    if (searchQuery === '') {
      // Reset to original filtered data if search query is empty
      setFilteredCrossingData(crossingData.filter(item => selectedValue === 'All' || item.location === selectedValue));
      setFilteredHighSpeedData(crossingData.filter(item => (selectedValue === 'All' || item.location === selectedValue) && item.speed > 11));
    } else {
      const filteredCrossing = crossingData.filter(item =>
        (item.date_time.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.number_plate.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedValue === 'All' || item.location === selectedValue)
      );

      const filteredHighSpeed = filteredCrossing.filter(item => item.speed > 8);

      setFilteredCrossingData(filteredCrossing);
      setFilteredHighSpeedData(filteredHighSpeed);
    }
  }, [searchQuery, crossingData, selectedValue]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  

  return (
    <Container sx={{backgroundColor:'#e4ebe8' , padding:2, borderRadius:2, width:'100%'}}>
     
      <Paper sx={{ backgroundColor: '#166948', height: 80, width: '100%', marginBottom: 2, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          Vehicle Crossing & Speed Data
        </Typography>
       
      </Paper>
      <BootstrapButton variant="contained" color="primary" component={Link} to="/"sx={{  marginTop:0}}>Home</BootstrapButton>
      
      

      <Box sx={{ display: 'flex', my: 3, gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="location-select-label">Select Location</InputLabel>
          <Select
            labelId="location-select-label"
            id="location-select"
            value={selectedValue}
            size="small"
            label="Select Location"
            onChange={handleChange}
            startAdornment={<ListIcon />}
          >
            {items.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Search Crossing Data"
          id="filled-hidden-label-small"
          defaultValue="Small"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ flex: 1, mr: 2 }}>
        <center><Typography variant="h6" color={'black'}  marginBottom={1}>All Crossing Data</Typography></center>

          <TableContainer component={Paper}>
            <Table sx={{ maxWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead sx={{backgroundColor:'#a7cca3'}}>
                <TableRow>
                  <TableCell>Date Time</TableCell>
                  <TableCell>Number Plate</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Speed (Km/h)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                
                {filteredCrossingData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date_time}</TableCell>
                    <TableCell>{row.number_plate}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <center><TableCell>{row.speed.toFixed(2)}</TableCell></center>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        

        <Box sx={{ flex: 1, ml: 2 }}>    

        <center><Typography variant="h6" color={'black'}  marginBottom={1}>High Speed Crossing Data</Typography></center>
         
          <TableContainer component={Paper}>
            <Table sx={{ maxWidth: 650 }} size="small" aria-label="High Speed">
              <TableHead sx={{backgroundColor:'#dbb6b2'}}>
                <TableRow>
                  <TableCell>Date Time</TableCell>
                  <TableCell>Number Plate</TableCell>
                  <TableCell>Location</TableCell>
                  <center><TableCell>Speed (Km/h)</TableCell></center>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHighSpeedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date_time}</TableCell>
                    <TableCell>{row.number_plate}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <center><TableCell>{row.speed.toFixed(2)}</TableCell></center>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          


        </Box>
      </Box>
    </Container>
  );
};

export default RoadDataPage;

