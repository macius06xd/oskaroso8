import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import ReservationForm from './ReservationForm';

const formatDate = (date) =>
  new Date(date).toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

const ReservationDetails = ({ reservation, onDeleted, onUpdated }) => {
  const [editOpen, setEditOpen] = useState(false);

  if (!reservation) return null;

  const {
    _id,
    title,
    description,
    startDate,
    endDate,
    facility,
    sport,
    customer,
    status,
    notes
  } = reservation;
  console.log("czemu" , reservation)
  const handleDelete = async () => {
    if (
      window.confirm(
        `Czy na pewno chcesz usunąć rezerwację "${title}"? Ta operacja jest nieodwracalna.`
      )
    ) {
      try {
        await axios.delete(`/api/reservations/${_id}`);
        onDeleted(_id);
      } catch (error) {
        console.error('Error deleting reservation:', error);
        alert('Wystąpił błąd podczas usuwania rezerwacji.');
      }
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await axios.put(`/api/reservations/${_id}`, updatedData);
      onUpdated(response.data.data);
      setEditOpen(false);
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Wystąpił błąd podczas aktualizacji rezerwacji.');
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          ID: {_id}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>

        {description && (
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" gutterBottom>
          <strong>Obiekt:</strong> {facility}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Sport:</strong> {sport}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Data rozpoczęcia:</strong> {formatDate(startDate)}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Data zakończenia:</strong> {formatDate(endDate)}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" gutterBottom>
          <strong>Klient:</strong> {customer?.firstName} {customer?.lastName}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Email:</strong> {customer?.email}
        </Typography>
        {customer?.phone && (
          <Typography variant="body2" gutterBottom>
            <strong>Telefon:</strong> {customer.phone}
          </Typography>
        )}
        <Typography variant="body2" gutterBottom>
          <strong>Status:</strong> {status}
        </Typography>

        {notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" gutterBottom>
              <strong>Notatki:</strong> {notes}
            </Typography>
          </>
        )}

        <Stack direction="row" spacing={2} mt={3}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => setEditOpen(true)}
          >
            Edytuj
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Usuń
          </Button>
        </Stack>
      </Paper>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edytuj rezerwację</DialogTitle>
        <DialogContent>
          <ReservationForm
            initialData={reservation}
            onCancel={() => setEditOpen(false)}
            onSubmit={handleUpdate}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReservationDetails;
