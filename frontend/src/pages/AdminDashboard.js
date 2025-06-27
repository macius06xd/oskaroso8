import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panel administratora
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Dashboard administratora będzie dostępny wkrótce...
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
