import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const MyReservations = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Moje rezerwacje
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Lista Twoich rezerwacji będzie dostępna wkrótce...
        </Typography>
      </Box>
    </Container>
  );
};

export default MyReservations;
