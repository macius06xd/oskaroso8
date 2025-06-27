const express = require('express');
const {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
  getAvailableSlots,
  getReservationStats
} = require('../controllers/reservationController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const {
  validateRequest,
  validateQuery,
  createReservationSchema,
  updateReservationSchema,
  queryReservationsSchema,
  availableSlotsSchema
} = require('../utils/validation');

const router = express.Router();

// Public routes
router.get('/available', validateQuery(availableSlotsSchema), getAvailableSlots);
router.post('/', validateRequest(createReservationSchema), optionalAuth, createReservation);

// Protected routes
router.get('/', protect, validateQuery(queryReservationsSchema), getReservations);
router.get('/stats', protect, authorize('admin'), getReservationStats);
router.get('/:id', protect, getReservation);
router.put('/:id', protect, validateRequest(updateReservationSchema), updateReservation);
router.delete('/:id', protect, deleteReservation);

module.exports = router;
