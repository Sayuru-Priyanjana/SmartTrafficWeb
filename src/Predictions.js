import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { ref, get, onValue } from 'firebase/database';
import { database } from './firebase'; // Adjust the path based on your project structure
import format from 'date-fns/format';
import { Container, Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography, Paper } from '@mui/material';
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

const Predictions = () => {
  const [map, setMap] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [isAM, setIsAM] = useState(true);
  const [locations, setLocations] = useState([
    { title: 'Location_1', position: { lat: 8.8944804, lng: 80.7807722 }, incoming: 'Loading...', outgoing: 'Loading...' },
    { title: 'Location_2', position: { lat: 8.900000, lng: 80.790000 }, incoming: 'Loading...', outgoing: 'Loading...' }
  ]);

  const days = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];
  const [selectedDay, setSelectedDay] = useState(days[0]);

  useEffect(() => {
    fetchInitialData();
    listenForUpdates();
  }, []);

  const fetchInitialData = async () => {
    const newLocations = [...locations];

    for (const location of newLocations) {
      const snapshot = await get(ref(database, `Traffic_Data/${location.title}/Current`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        location.incoming = data.incoming_vehicles.toString();
        location.outgoing = data.outgoing_vehicles.toString();
      }
    }

    setLocations(newLocations);
  };

  const listenForUpdates = () => {
    const newLocations = [...locations];

    for (const location of newLocations) {
      onValue(ref(database, `Traffic_Data/${location.title}/Current`), (snapshot) => {
        const data = snapshot.val();
        location.incoming = data.incoming_vehicles.toString();
        location.outgoing = data.outgoing_vehicles.toString();
        setLocations([...newLocations]);
      });
    }
  };

  const getSelectedDate = (day) => {
    const now = new Date();
    let selectedDate = new Date();

    switch (day) {
      case 'day1': selectedDate = now; break;
      case 'day2': selectedDate = new Date(now.setDate(now.getDate() + 1)); break;
      case 'day3': selectedDate = new Date(now.setDate(now.getDate() + 2)); break;
      case 'day4': selectedDate = new Date(now.setDate(now.getDate() + 3)); break;
      case 'day5': selectedDate = new Date(now.setDate(now.getDate() + 4)); break;
      case 'day6': selectedDate = new Date(now.setDate(now.getDate() + 5)); break;
      case 'day7': selectedDate = new Date(now.setDate(now.getDate() + 6)); break;
      default: selectedDate = now;
    }

    return format(selectedDate, 'yyyy-MM-dd');
  };

  const updateMarkersWithFirebaseData = async (timestamp) => {
    const newLocations = [...locations];

    for (const location of newLocations) {
      const snapshot = await get(ref(database, `Traffic_Data/${location.title}/${timestamp}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        location.incoming = data.incoming_vehicles.toString();
        location.outgoing = data.outgoing_vehicles.toString();
      }
    }

    setLocations(newLocations);
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
  };

  const handleMinuteChange = (event) => {
    setSelectedMinute(event.target.value);
  };

  const handleToggleAMPM = () => {
    setIsAM(!isAM);
  };

  const handleSearch = () => {
    const hour = isAM ? selectedHour : (parseInt(selectedHour) + 12).toString().padStart(2, '0');
    const timestamp = `${getSelectedDate(selectedDay)} ${hour}:${selectedMinute}:00`;
    updateMarkersWithFirebaseData(`${selectedDay}/${timestamp}`);
    setSelectedDateTime(timestamp);
  };

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const hours = [...Array(12).keys()].map(i => (i + 1).toString().padStart(2, '0'));
  const minutes = [...Array(60).keys()].map(i => i.toString().padStart(2, '0'));

  return (
    <Container sx={{ textAlign: 'center', padding: 2 ,backgroundColor:'#e4ebe8'}}>
      <Paper sx={{ backgroundColor: '#166948', padding: 2, marginBottom: 2, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ color: 'white', marginBottom: 2 }}>
          You are watching: {selectedDateTime}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <BootstrapButton variant="contained" color="primary" component={Link} to="/" sx={{  marginRight:50}}>Home</BootstrapButton>
        
          <FormControl>
            <InputLabel id="day-select-label" style={{ color: 'white' }}>Select Day</InputLabel>
            <Select
              labelId="day-select-label"
              id="day-select"
              value={selectedDay}
              onChange={handleDayChange}
              sx={{ minWidth: 120, maxHeight:30,backgroundColor: 'white' }}
            >
              {days.map((day) => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="hour-select-label" style={{ color: 'white' }}>Hour</InputLabel>
            <Select
              labelId="hour-select-label"
              id="hour-select"
              value={selectedHour}
              onChange={handleHourChange}
              sx={{ minWidth: 80,maxHeight:30, backgroundColor: 'white' }}
            >
              {hours.map((hour) => (
                <MenuItem key={hour} value={hour}>{hour}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="minute-select-label" style={{ color: 'white' }}>Minute</InputLabel>
            <Select
              labelId="minute-select-label"
              id="minute-select"
              value={selectedMinute}
              onChange={handleMinuteChange}
              sx={{ minWidth: 80,maxHeight:30, backgroundColor: 'white' }}
            >
              {minutes.map((minute) => (
                <MenuItem key={minute} value={minute}>{minute}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleToggleAMPM} sx={{ padding: '5px 10px' ,backgroundColor:'white',maxHeight:30}}>
            {isAM ? 'AM' : 'PM'}
          </Button>
          <BootstrapButton variant="contained" color="primary" onClick={handleSearch} sx={{  marginTop:0}}>Search</BootstrapButton>
        </Box>
        


        


      </Paper>
      <LoadScript googleMapsApiKey="AIzaSyDjthqbZuPPewv_1abNKgwHS4o0QHkRgXU">
        <GoogleMap
          mapContainerStyle={{ height: 600, width: "100%" }}
          zoom={12}
          center={{ lat: 8.8944804, lng: 80.7807722 }}
          onLoad={onLoad}
        >
          {locations.map((location) => (
            <Marker
              key={location.title}
              position={location.position}
              title={location.title}
              label={`Incoming: ${location.incoming}, Outgoing: ${location.outgoing}`}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </Container>
  );
};

export default Predictions;
