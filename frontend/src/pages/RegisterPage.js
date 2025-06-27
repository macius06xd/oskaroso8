import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Phone,
  Visibility,
  VisibilityOff,
  PersonAdd,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setError('');
    const result = await registerUser(data);
    
    if (result.success) {
      navigate('/calendar');
    } else {
      setError(result.error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box textAlign="center" mb={3}>
            <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography component="h1" variant="h4" gutterBottom>
              Rejestracja
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Utwórz nowe konto w systemie rezerwacji
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Imię"
                  autoComplete="given-name"
                  autoFocus
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  {...register('firstName', {
                    required: 'Imię jest wymagane',
                    minLength: {
                      value: 2,
                      message: 'Imię musi mieć co najmniej 2 znaki',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Imię nie może być dłuższe niż 50 znaków',
                    },
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Nazwisko"
                  autoComplete="family-name"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  {...register('lastName', {
                    required: 'Nazwisko jest wymagane',
                    minLength: {
                      value: 2,
                      message: 'Nazwisko musi mieć co najmniej 2 znaki',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Nazwisko nie może być dłuższe niż 50 znaków',
                    },
                  })}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Adres email"
              type="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              {...register('email', {
                required: 'Email jest wymagany',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Nieprawidłowy format adresu email',
                },
              })}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Numer telefonu (opcjonalnie)"
              type="tel"
              autoComplete="tel"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              {...register('phone', {
                pattern: {
                  value: /^[+]?[\d\s\-\(\)]+$/,
                  message: 'Nieprawidłowy format numeru telefonu',
                },
              })}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Hasło"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password', {
                required: 'Hasło jest wymagane',
                minLength: {
                  value: 6,
                  message: 'Hasło musi mieć co najmniej 6 znaków',
                },
                maxLength: {
                  value: 100,
                  message: 'Hasło nie może być dłuższe niż 100 znaków',
                },
              })}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Potwierdź hasło"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
              {...register('confirmPassword', {
                required: 'Potwierdzenie hasła jest wymagane',
                validate: (value) =>
                  value === password || 'Hasła nie są identyczne',
              })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Rejestracja...' : 'Zarejestruj się'}
            </Button>

            <Box textAlign="center">
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                Masz już konto? Zaloguj się
              </Link>
            </Box>
          </form>
        </Paper>

        {/* Information */}
        <Paper
          sx={{
            mt: 3,
            p: 2,
            width: '100%',
            bgcolor: 'success.light',
            color: 'success.contrastText',
          }}
        >
          <Typography variant="body2" textAlign="center">
            <strong>Po rejestracji otrzymasz:</strong> dostęp do kalendarza rezerwacji,
            możliwość zarządzania swoimi rezerwacjami oraz automatyczne powiadomienia email.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
