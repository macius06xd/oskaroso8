import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Divider,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Kalendarz Rezerwacji
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Nowoczesny system rezerwacji umożliwiający łatwe zarządzanie terminami
              i wizytami. Zarezerwuj swój termin już dziś!
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Kontakt
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="body2">
                kontakt@kalendarz-rezerwacji.pl
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="body2">
                +48 123 456 789
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="body2">
                ul. Przykładowa 123, 00-000 Warszawa
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Przydatne linki
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/calendar" color="inherit" underline="hover">
                Kalendarz
              </Link>
              <Link href="/login" color="inherit" underline="hover">
                Logowanie
              </Link>
              <Link href="/register" color="inherit" underline="hover">
                Rejestracja
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Polityka prywatności
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Regulamin
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Kalendarz Rezerwacji. Wszystkie prawa zastrzeżone.
          </Typography>
          <Typography variant="body2">
            Stworzone z ❤️ dla lepszego zarządzania rezerwacjami
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
