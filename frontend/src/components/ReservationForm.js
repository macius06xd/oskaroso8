import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import axios from 'axios';

const facilities = [
  { label: 'Boisko główne', value: 'Boisko glowne' },
  { label: 'Sala sportowa A', value: 'Sala sportowa A' },
  { label: 'Sala sportowa B', value: 'Sala sportowa B' },
  { label: 'Sala fitness', value: 'Sala fitness' },
  { label: 'Basen olimpijski', value: 'Basen olimpijski' }
];

const sports = [
  'Pilka nozna',
  'Koszykowka',
  'Tenis stolowy',
  'Fitness',
  'Plywanie',
  'Siatkowka',
  'Multi-sport',
  'Other'
];

const pad = (num) => num.toString().padStart(2, '0');

const toLocalISO = (date) => {
  if (!date) return '';
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes())
  );
};

const ReservationForm = ({ selectedDate, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: selectedDate ? toLocalISO(selectedDate) : '',
    endDate: '',
    facility: '',
    sport: 'other',
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  });
  console.log(selectedDate)
  console.log(form.startDate)
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/auth/me');
        const user = data?.data?.user;
        if (user) {
          setForm((prev) => ({
            ...prev,
            customer: {
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              phone: user.phone || ''
            }
          }));
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Nie udało się załadować danych użytkownika');
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('customer.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        customer: { ...prev.customer, [key]: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    console.log("elo")
    e.preventDefault();
    setError('');
    try {
      console.log(form.startDate)
      const payload = {
        ...form,
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
      };

      const response = await axios.post('/api/reservations', payload);

      setSuccessMessage('Rezerwacja została złożona.');
      onSuccess?.(response.data)
      console.log(response)
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        'Wystąpił błąd przy składaniu rezerwacji.'
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>
        Nowa rezerwacja
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            name="title"
            label="Tytuł"
            fullWidth
            value={form.title}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Opis"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            name="startDate"
            label="Data rozpoczęcia"
            type="datetime-local"
            fullWidth
            value={form.startDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            name="endDate"
            label="Data zakończenia"
            type="datetime-local"
            fullWidth
            value={form.endDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            select
            name="facility"
            label="Obiekt"
            fullWidth
            value={form.facility}
            onChange={handleChange}
          >
            {facilities.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            name="sport"
            label="Dyscyplina"
            fullWidth
            value={form.sport}
            onChange={handleChange}
          >
            {sports.map((sport) => (
              <MenuItem key={sport} value={sport}>
                {sport}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            name="customer.firstName"
            label="Imię klienta"
            fullWidth
            value={form.customer.firstName}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="customer.lastName"
            label="Nazwisko klienta"
            fullWidth
            value={form.customer.lastName}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="customer.email"
            label="Email klienta"
            fullWidth
            value={form.customer.email}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="customer.phone"
            label="Telefon klienta"
            fullWidth
            value={form.customer.phone}
            disabled
          />
        </Grid>

        <Grid item xs={12} display="flex" gap={2} mt={1}>
          <Button variant="contained" color="primary" type="submit" disabled={loadingUser}>
            Zarezerwuj
          </Button>
          {onCancel && (
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              Anuluj
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReservationForm;
