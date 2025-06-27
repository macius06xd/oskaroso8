const Reservation = require('../models/Reservation');
const { sendEmail } = require('../utils/email');
const mongoose = require('mongoose');

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Public (depending on implementation)
exports.getReservations = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.startDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by facility
    if (req.query.facility) {
      query.facility = req.query.facility;
    }

    // Filter by sport
    if (req.query.sport) {
      query.sport = req.query.sport;
    }

    // Filter by assigned user (for staff)
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    // For regular users, only show their own reservations
    if (req.user && req.user.role !== 'admin') {
      query['customer.email'] = req.user.email;
    }

    // Execute query with pagination
    const reservations = await Reservation.find(query)
      .populate('assignedTo', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip(startIndex);

    // Get total count for pagination
    const total = await Reservation.countDocuments(query);

    // Pagination result
    const pagination = {};

    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: reservations.length,
      total,
      pagination,
      data: reservations
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas pobierania rezerwacji'
    });
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Rezerwacja nie została znaleziona'
      });
    }

    // Check if user can access this reservation
    if (req.user.role !== 'admin' && reservation.customer.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Brak uprawnień do tej rezerwacji'
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas pobierania rezerwacji'
    });
  }
};

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Public
exports.createReservation = async (req, res) => {
  console.log("tworze")
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      allDay,
      facility,
      sport,
      team,
      equipment,
      services,
      customer,
      notes,
      assignedTo
    } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Data zakończenia musi być późniejsza niż data rozpoczęcia'
      });
    }

    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Nie można tworzyć rezerwacji w przeszłości'
      });
    }

    // Check for conflicts (facility-specific)
    const conflict = await Reservation.checkConflict(start, end, facility);
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'Wybrany obiekt jest już zajęty w tym terminie',
        conflictingReservation: {
          id: conflict._id,
          title: conflict.title,
          facility: conflict.facility,
          startDate: conflict.startDate,
          endDate: conflict.endDate
        }
      });
    }

    // Create reservation
    const reservationData = {
      title,
      description,
      startDate: start,
      endDate: end,
      allDay,
      facility,
      sport,
      team,
      equipment,
      services,
      customer,
      notes,
      assignedTo,
      createdBy: req.user ? req.user._id : null,
      metadata: {
        source: 'web',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    };

    const reservation = await Reservation.create(reservationData);

    // Populate the created reservation
    await reservation.populate('assignedTo', 'firstName lastName email');

    // Send confirmation email
    try {
      await sendEmail({
        to: customer.email,
        subject: 'Potwierdzenie rezerwacji',
        template: 'reservation-confirmation',
        data: {
          customerName: `${customer.firstName} ${customer.lastName}`,
          title: reservation.title,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          reservationId: reservation._id
        }
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Rezerwacja została utworzona pomyślnie',
      data: reservation
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Błąd podczas tworzenia rezerwacji'
    });
  }
};

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Rezerwacja nie została znaleziona'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && reservation.customer.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Brak uprawnień do edycji tej rezerwacji'
      });
    }

    // If updating dates, check for conflicts
    if (req.body.startDate || req.body.endDate) {
      const startDate = new Date(req.body.startDate || reservation.startDate);
      const endDate = new Date(req.body.endDate || reservation.endDate);

      if (startDate >= endDate) {
        return res.status(400).json({
          success: false,
          message: 'Data zakończenia musi być późniejsza niż data rozpoczęcia'
        });
      }

      const conflict = await Reservation.checkConflict(startDate, endDate, req.params.id);
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'Wybrany termin jest już zajęty',
          conflictingReservation: {
            id: conflict._id,
            title: conflict.title,
            startDate: conflict.startDate,
            endDate: conflict.endDate
          }
        });
      }
    }

    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('assignedTo', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Rezerwacja została zaktualizowana',
      data: reservation
    });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Błąd podczas aktualizacji rezerwacji'
    });
  }
};

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Private
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Rezerwacja nie została znaleziona'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && reservation.customer.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Brak uprawnień do usunięcia tej rezerwacji'
      });
    }

    await reservation.deleteOne();

    // Send cancellation email
    try {
      await sendEmail({
        to: reservation.customer.email,
        subject: 'Anulowanie rezerwacji',
        template: 'reservation-cancellation',
        data: {
          customerName: `${reservation.customer.firstName} ${reservation.customer.lastName}`,
          title: reservation.title,
          startDate: reservation.startDate,
          reservationId: reservation._id
        }
      });
    } catch (emailError) {
      console.error('Error sending cancellation email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Rezerwacja została usunięta'
    });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas usuwania rezerwacji'
    });
  }
};

// @desc    Get available time slots
// @route   GET /api/reservations/available
// @access  Public
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date, duration = 60 } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Data jest wymagana'
      });
    }

    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(9, 0, 0, 0); // 9:00 AM

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(17, 0, 0, 0); // 5:00 PM

    // Get existing reservations for the day
    const existingReservations = await Reservation.find({
      startDate: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      status: { $ne: 'cancelled' }
    }).sort({ startDate: 1 });

    // Generate available slots
    const slots = [];
    const slotDuration = parseInt(duration) * 60 * 1000; // Convert to milliseconds

    let currentTime = new Date(startOfDay);

    while (currentTime < endOfDay) {
      const slotEnd = new Date(currentTime.getTime() + slotDuration);

      // Check if this slot conflicts with any existing reservation
      const hasConflict = existingReservations.some(reservation => {
        return (currentTime < reservation.endDate && slotEnd > reservation.startDate);
      });

      if (!hasConflict && slotEnd <= endOfDay) {
        slots.push({
          startTime: new Date(currentTime),
          endTime: new Date(slotEnd),
          available: true
        });
      }

      currentTime = new Date(currentTime.getTime() + slotDuration);
    }

    res.status(200).json({
      success: true,
      data: {
        date: selectedDate,
        slots
      }
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas pobierania dostępnych terminów'
    });
  }
};

// @desc    Get reservation statistics
// @route   GET /api/reservations/stats
// @access  Private (Admin only)
exports.getReservationStats = async (req, res) => {
  try {
    const stats = await Reservation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Reservation.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalReservations = await Reservation.countDocuments();
    const thisMonthReservations = await Reservation.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalReservations,
        thisMonth: thisMonthReservations,
        byStatus: stats,
        byCategory: categoryStats
      }
    });
  } catch (error) {
    console.error('Get reservation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas pobierania statystyk'
    });
  }
};
