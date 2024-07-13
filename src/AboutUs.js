import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const AboutUsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: 2 }}>
      <Paper sx={{ padding: 2, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          About Us Page
        </Typography>
        {/* Add content for About Us Page */}
      </Paper>
    </Container>
  );
}

export default AboutUsPage;
