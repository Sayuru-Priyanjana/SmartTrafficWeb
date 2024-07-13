import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, get } from 'firebase/database';
import ApexCharts from 'react-apexcharts';
import { Container, Typography, Box, Grid, Paper, FormControl, Select, MenuItem, InputLabel,Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';


const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    borderRadius: 20,
    marginBottom: 2,
    width: 140,
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
  


const LocationDetailPage = () => {
  const [selectedLocation, setSelectedLocation] = useState('Location_1');
  const [currentIncoming, setCurrentIncoming] = useState('Loading...');
  const [currentOutgoing, setCurrentOutgoing] = useState('Loading...');
  const [dailyData, setDailyData] = useState([]);
  const days = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];
  const locations = ['Location_1', 'Location_2'];

  useEffect(() => {
    fetchCurrentData();
    fetchAllDaysData();
  }, [selectedLocation]);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const fetchCurrentData = async () => {
    const snapshot = await get(ref(database, `Traffic_Data/${selectedLocation}/Current`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      setCurrentIncoming(data.incoming_vehicles);
      setCurrentOutgoing(data.outgoing_vehicles);
    }
  };

  const fetchAllDaysData = async () => {
    const allDaysData = await Promise.all(days.map(fetchTableData));
    setDailyData(allDaysData);
  };

  const fetchTableData = async (day) => {
    const snapshot = await get(ref(database, `Traffic_Data/${selectedLocation}/${day}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const incoming = [];
      const outgoing = [];
      const labels = [];
      Object.keys(data).forEach((key, index) => {
        const dateTime = new Date(key);
        const time = `${dateTime.getHours()}:${dateTime.getMinutes()}`;
        if (index % 5 === 0) {
          labels.push(time);
        } else {
          labels.push('');
        }
        incoming.push(data[key].incoming_vehicles);
        outgoing.push(data[key].outgoing_vehicles);
      });
      return { labels, incoming, outgoing };
    }
    return { labels: [], incoming: [], outgoing: [] };
  };

  const getDateForDay = (dayIndex) => {
    const date = new Date();
    date.setDate(date.getDate() + dayIndex);
    return date.toDateString();
  };

  const chartOptions = (labels) => ({
    chart: {
      type: 'line',
      height: 350,
      zoom: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: labels,
      title: {
        text: 'Time',
        style: {
          fontSize: '16px',
          color: '#333',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Number of Vehicles',
        style: {
          fontSize: '16px',
          color: '#333',
        },
      },
    },
    tooltip: {
      theme: 'dark',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
  });

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: '#e4ebe8', padding: 2, borderRadius: 2, width: '100%' }}>
      <Box mb={2} sx={{ backgroundColor: '#166948', height: 100, width: '100%', marginBottom: 2, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h5"  marginLeft={7} marginRight={30} color={'white'}>{selectedLocation} Analitic Data</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} sm={4}>
           
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="h6" color={'white'}>Longitude and Latitude</Typography>
            <Typography variant="body1" color={'white'}>Lng: 8.832457 </Typography>
            <Typography variant="body1" color={'white'}>Lat: 8.796545 </Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="h6" color={'white'}>Current Traffic Data</Typography>
            <Typography variant="body1" color={'white'}>Incoming: {currentIncoming}</Typography>
            <Typography variant="body1" color={'white'}>Outgoing: {currentOutgoing}</Typography>
          </Grid>


        


        </Grid>

        
      </Box>

      


      <Box sx={{ display: 'flex', my: 3, gap: 2 }}>
        <BootstrapButton variant="contained" color="primary" component={Link} to="/"sx={{  marginTop:0}}>Home</BootstrapButton>
        <BootstrapButton variant="contained" color="primary" component={Link} to="/predictions"sx={{  marginTop:0}}>View on Map</BootstrapButton>

        <FormControl fullWidth sx={{marginLeft:10}}>
        <InputLabel id="location-select-label" sx={{ color: 'black' }}>Select Location</InputLabel>
        <Select
          labelId="location-select-label"
          id="location-select"
          value={selectedLocation}
          label="Select Location"
          size='small'
          onChange={handleLocationChange}
          sx={{ color: 'black', '.MuiOutlinedInput-notchedOutline': { borderColor: 'black' } }}
        >
          {locations.map((location) => (
            <MenuItem key={location} value={location}>
              {location}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
      </Box>


      {dailyData.map((data, index) => (
        <Paper key={days[index]} elevation={3} sx={{ marginBottom: 4, padding: 2 ,borderRadius:8,opacity:0.8}}>
          <Typography variant="h6" gutterBottom>
            Traffic Chart - {getDateForDay(index)}
          </Typography>
          <ApexCharts
            options={chartOptions(data.labels)}
            series={[
              {
                name: 'Incoming',
                data: data.incoming,
                color: 'green',
              },
              {
                name: 'Outgoing',
                data: data.outgoing,
                color: 'red',
              },
            ]}
            type="line"
            height={350}
          />
        </Paper>
      ))}
    </Container>
  );
};

export default LocationDetailPage;
