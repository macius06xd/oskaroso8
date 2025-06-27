import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProfilePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profil użytkownika
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Zarządzanie profilem będzie dostępne wkrótce...
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;
