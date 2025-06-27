import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  CalendarToday,
  Schedule,
  People,
  CheckCircle,
  ArrowForward,
  Event,
  AccessTime,
  Security,
} from '@mui/icons-material';

import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <CalendarToday color="primary" sx={{ fontSize: 40 }} />,
      title: 'Interaktywny kalendarz',
      description: 'Przejrzysty widok dostępnych terminów z możliwością przełączania między widokami dziennymi, tygodniowymi i miesięcznymi.',
    },
    {
      icon: <Schedule color="primary" sx={{ fontSize: 40 }} />,
      title: 'Łatwa rezerwacja',
      description: 'Proste i intuicyjne formularze rezerwacji z automatyczną walidacją dostępności terminów.',
    },
    {
      icon: <People color="primary" sx={{ fontSize: 40 }} />,
      title: 'Zarządzanie klientami',
      description: 'Kompleksowe zarządzanie danymi klientów i historią ich rezerwacji.',
    },
    {
      icon: <CheckCircle color="primary" sx={{ fontSize: 40 }} />,
      title: 'Automatyczne powiadomienia',
      description: 'Automatyczne wysyłanie potwierdzeń rezerwacji i przypomnień na email.',
    },
  ];

  const stats = [
    { label: 'Aktywnych użytkowników', value: '500+', icon: <People /> },
    { label: 'Rezerwacji dziennie', value: '50+', icon: <Event /> },
    { label: 'Średni czas obsługi', value: '2 min', icon: <AccessTime /> },
    { label: 'Bezpieczeństwo', value: '100%', icon: <Security /> },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
          mb: 6,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Kalendarz Rezerwacji
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Nowoczesny system zarządzania rezerwacjami
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Łatwe planowanie, szybka rezerwacja i profesjonalne zarządzanie terminami.
          Wszystko w jednym miejscu, dostępne z każdego urządzenia.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/calendar')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
              px: 4,
              py: 1.5,
            }}
            endIcon={<ArrowForward />}
          >
            Zobacz kalendarz
          </Button>
          
          {!user && (
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { 
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)' 
                },
                px: 4,
                py: 1.5,
              }}
            >
              Zarejestruj się
            </Button>
          )}
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Dlaczego warto wybrać nas?
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
          Nasze rozwiązanie oferuje wszystkie narzędzia potrzebne do efektywnego zarządzania rezerwacjami
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h5" component="h3">
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stats Section */}
      <Paper sx={{ p: 4, mb: 8, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Nasza obecność w liczbach
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box textAlign="center">
                <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mx: 'auto', mb: 2 }}>
                  {stat.icon}
                </Avatar>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Gotowy na rozpoczęcie?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Dołącz do setek zadowolonych użytkowników i zacznij zarządzać rezerwacjami jeszcze dziś
        </Typography>
        
        {user ? (
          <Box>
            <Chip 
              label={`Zalogowany jako ${user.firstName} ${user.lastName}`} 
              color="success" 
              sx={{ mb: 3 }}
            />
            <br />
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/calendar')}
              sx={{ mr: 2 }}
            >
              Przejdź do kalendarza
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/my-reservations')}
            >
              Moje rezerwacje
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
            >
              Załóż konto
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
            >
              Mam już konto
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
