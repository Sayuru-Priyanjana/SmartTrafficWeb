import React from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const mapContainerStyle = {
  width: '100%',
  height: '450px',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const locations = [
  { name: 'Location 1', position: { lat: -3.745, lng: -38.523 } },
  { name: 'Location 2', position: { lat: -3.755, lng: -38.533 } },
  { name: 'Location 3', position: { lat: -3.765, lng: -38.543 } },
  // Add more locations as needed
];

const StyledButton = styled(Button)({
  borderRadius: 20,
  marginBottom: 20,
  width: '100%',
  textTransform: 'none',
  
});



const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    borderRadius: 20,
    marginBottom: 0,
    width: '100%',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#166948',
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
  

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{backgroundColor:'#e4ebe8' , padding:2, borderRadius:2, width:'100%'}}>
      <Paper sx={{ backgroundColor: '#166948', height: 100, width: '100%', marginBottom: 2, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          Smart Traffic and Forcasting System
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', marginTop: 2}}>
        <Paper sx={{ backgroundColor: '#c3d9d0', height: 480, width: 150, padding: 2, borderRadius: 2 }}>
          <BootstrapButton variant="contained" color="primary" component={Link} to="/road-data" sx={{  marginTop:7}}>Road Data</BootstrapButton> 
          <BootstrapButton variant="contained" color="primary" component={Link} to="/predictions" sx={{  marginTop:2}}>Predictions</BootstrapButton>
          <BootstrapButton variant="contained" color="primary" component={Link} to="/analitic"sx={{  marginTop:2}}>Analytic Data</BootstrapButton>
          <BootstrapButton variant="contained" color="primary" component={Link} to="/penalty"sx={{  marginTop:2}}>Penalty Data</BootstrapButton>
          <BootstrapButton variant="contained" color="primary" component={Link} to="/about-us"sx={{  marginTop:2}}>About Us</BootstrapButton>
        </Paper>

        <Paper sx={{ width: 300, height: '100%', padding: 2, marginLeft: 2, borderRadius: 2, marginTop:2, backgroundColor:'#e4ebe8'}}>
          <TableContainer>
            <Table sx={{width:'100%'}}>
              <TableHead sx={{ backgroundColor:'#d67a6f' }}>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>State</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{backgroundColor:'#dbb6b2'}}>
                <TableRow>
                  <TableCell>Location 1</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Location 2</TableCell>
                  <TableCell>Inactive</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Location 3</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box sx={{ flex: 1, marginLeft: 2, borderRadius: 2, marginTop:2 }}>
          <LoadScript googleMapsApiKey="AIzaSyDjthqbZuPPewv_1abNKgwHS4o0QHkRgXU">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={10}
              onLoad={(map) => console.log('Map Loaded:', map)}
              onError={(e) => console.log('Error loading map:', e)}
            >
              {locations.map((location, index) => (
                <Marker 
                  key={index} 
                  position={location.position}
                  label={{
                    text: location.name,
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </Box>
      </Box>

      
      

    </Container>
  );
}

export default HomePage;
