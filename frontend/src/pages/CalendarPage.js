import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Fab,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useQuery } from 'react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ReservationForm from '../components/ReservationForm';
import ReservationDetails from '../components/ReservationDetails';

const CalendarPage = () => {
  const { user } = useAuth();
  const calendarRef = useRef(null);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch reservations
  const { data: reservations, isLoading, error, refetch } = useQuery(
    'reservations',
    async () => {
      const response = await axios.get('/api/reservations', {
        params: {
          limit: 100, // Get more events for calendar view
        },
      });
      return response.data.data;
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setShowReservationForm(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const reservation = reservations?.find(r => r._id === event.id);
    
    if (reservation) {
      setSelectedEvent(reservation);
      setShowEventDialog(true);
    }
  };

  const getEventColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      case 'completed':
        return '#9e9e9e';
      default:
        return '#2196f3';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Potwierdzona';
      case 'pending':
        return 'Oczekująca';
      case 'cancelled':
        return 'Anulowana';
      case 'completed':
        return 'Zakończona';
      default:
        return status;
    }
  };

  const calendarEvents = reservations?.map(reservation => ({
    id: reservation._id,
    title: reservation.title,
    start: reservation.startDate,
    end: reservation.endDate,
    allDay: reservation.allDay,
    backgroundColor: getEventColor(reservation.status),
    borderColor: getEventColor(reservation.status),
    extendedProps: {
      status: reservation.status,
      category: reservation.category,
      customer: reservation.customer,
    },
  })) || [];

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <LoadingSpinner message="Ładowanie kalendarza..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 3 }}>
          Błąd podczas ładowania kalendarza: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Kalendarz rezerwacji
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Przeglądaj dostępne terminy i zarządzaj rezerwacjami
        </Typography>
      </Box>

      {/* Legend */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Legenda:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="Potwierdzona"
            sx={{ bgcolor: '#4caf50', color: 'white' }}
            size="small"
          />
          <Chip
            label="Oczekująca"
            sx={{ bgcolor: '#ff9800', color: 'white' }}
            size="small"
          />
          <Chip
            label="Anulowana"
            sx={{ bgcolor: '#f44336', color: 'white' }}
            size="small"
          />
          <Chip
            label="Zakończona"
            sx={{ bgcolor: '#9e9e9e', color: 'white' }}
            size="small"
          />
        </Box>
      </Paper>

      {/* Calendar */}
      <Paper sx={{ p: 2 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          initialView="dayGridMonth"
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={calendarEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          locale="pl"
          height="auto"
          nowIndicator={true}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
            startTime: '09:00',
            endTime: '17:00',
          }}
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          eventDisplay="block"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
        />
      </Paper>

      {/* Add Reservation FAB */}
      <Fab
        color="primary"
        aria-label="add reservation"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => {
          setSelectedDate(new Date());
          setShowReservationForm(true);
        }}
      >
        <Add />
      </Fab>

      {/* Reservation Form Dialog */}
      <Dialog
        open={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Nowa rezerwacja
          {selectedDate && (
            <Typography variant="body2" color="text.secondary">
              {format(selectedDate, 'dd MMMM yyyy', { locale: pl })}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <ReservationForm
            selectedDate={selectedDate}
            onSuccess={() => {
              setShowReservationForm(false);
              refetch();
            }}
            onCancel={() => setShowReservationForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog
        open={showEventDialog}
        onClose={() => setShowEventDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Szczegóły rezerwacji
          {selectedEvent && (
            <Chip
              label={getStatusLabel(selectedEvent.status)}
              sx={{
                ml: 2,
                bgcolor: getEventColor(selectedEvent.status),
                color: 'white'
              }}
              size="small"
            />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <ReservationDetails
              reservation={selectedEvent}
              onUpdate={() => {
                setShowEventDialog(false);
                refetch();
              }}
              onDelete={() => {
                setShowEventDialog(false);
                refetch();
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEventDialog(false)}>
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CalendarPage;
