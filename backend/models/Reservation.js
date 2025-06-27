const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tytul rezerwacji jest wymagany'],
    trim: true,
    maxlength: [100, 'Tytul nie moze byc dluzszy niz 100 znakow']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Opis nie moze byc dluzszy niz 500 znakow']
  },
  startDate: {
    type: Date,
    required: [true, 'Data rozpoczecia jest wymagana']
  },
  endDate: {
    type: Date,
    required: [true, 'Data zakonczenia jest wymagana']
  },
  allDay: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  // Sports facility information
  facility: {
    type: String,
    enum: [
      'Boisko glowne',
      'Sala sportowa A',
      'Sala sportowa B',
      'Sala fitness',
      'Basen olimpijski'
    ],
    required: [true, 'Obiekt sportowy jest wymagany']
  },
  sport: {
    type: String,
    enum: [
      'Pilka nozna',
      'Koszykowka',
      'Tenis stolowy',
      'Fitness',
      'Plywanie',
      'Siatkowka',
      'Multi-sport',
      'Other'
    ],
    default: 'Other'
  },

  // Team/Group information
  team: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Nazwa zespolu nie moze byc dluzsza niz 100 znakow']
    },
    size: {
      type: Number,
      min: [1, 'Rozmiar zespolu musi byc co najmniej 1'],
      max: [50, 'Rozmiar zespolu nie moze przekraczac 50 osob'],
      default: 1
    },
    contactPerson: {
      type: String,
      trim: true,
      maxlength: [100, 'Nazwa osoby kontaktowej nie moze byc dluzsza niz 100 znakow']
    }
  },

  // Equipment needed
  equipment: [{
    type: String,
    enum: [
      'Bramki',
      'Pilki',
      'Pacholki',
      'Kosze',
      'Pilki koszykarskie',
      'Tablica wynikow',
      'Stoly do ping ponga',
      'Siatki',
      'Pileczki',
      'Maty',
      'Hantle',
      'Pilki fitness',
      'Deski do plywania',
      'Pull buoy',
      'Pletwy',
      'Siatka',
      'Pilki siatkowka',
      'Anteny',
      'Other'
    ]
  }],

  // Additional services
  services: [{
    type: String,
    enum: [
      'Oswietlenie',
      'Sedziowie',
      'Obsluga medyczna',
      'System audio',
      'Ratownik',
      'Podgrzewanie wody',
      'Klimatyzacja',
      'Other'
    ]
  }],

  // Customer information
  customer: {
    firstName: {
      type: String,
      required: [true, 'Imie klienta jest wymagane'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Nazwisko klienta jest wymagane'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email klienta jest wymagany'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Prosze podac prawidlowy adres email'
      ]
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[\d\s\-\(\)]+$/, 'Prosze podac prawidlowy numer telefonu']
    }
  },

  // Staff member assigned to this reservation
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // User who created this reservation
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notatki nie moga byc dluzsze niz 1000 znakow']
  },

  // Payment information
  payment: {
    amount: {
      type: Number,
      min: [0, 'Kwota nie moze byc ujemna']
    },
    currency: {
      type: String,
      enum: ['PLN', 'EUR', 'USD'],
      default: 'PLN'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'cancelled'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'transfer', 'blik'],
      default: 'cash'
    }
  },

  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms'],
      default: 'email'
    },
    sentAt: Date,
    scheduledFor: Date
  }],

  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'admin', 'api'],
      default: 'web'
    },
    ipAddress: String,
    userAgent: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
reservationSchema.index({ startDate: 1, endDate: 1 });
reservationSchema.index({ 'customer.email': 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ facility: 1 });
reservationSchema.index({ assignedTo: 1 });

// Validation for date logic
reservationSchema.pre('save', function (next) {
  if (this.startDate >= this.endDate) {
    next(new Error('Data zakonczenia musi byc pozniejsza niz data rozpoczecia'));
  }
  next();
});

// Virtual for customer full name
reservationSchema.virtual('customerFullName').get(function () {
  return `${this.customer.firstName} ${this.customer.lastName}`;
});

// Virtual for duration in minutes
reservationSchema.virtual('durationMinutes').get(function () {
  return Math.round((this.endDate - this.startDate) / (1000 * 60));
});

// Virtual for facility display name
reservationSchema.virtual('facilityDisplayName').get(function () {
  const facilityNames = {
    'Boisko glowne': 'Boisko glowne',
    'Sala sportowa A': 'Sala sportowa A',
    'Sala sportowa B': 'Sala sportowa B',
    'Sala fitness': 'Sala fitness',
    'Basen olimpijski': 'Basen olimpijski'
  };
  return facilityNames[this.facility] || this.facility;
});

// Check if reservation conflicts with another
reservationSchema.statics.checkConflict = async function (startDate, endDate, facility, excludeId = null) {
  const query = {
    facility: facility,
    $or: [
      {
        startDate: { $lt: endDate },
        endDate: { $gt: startDate }
      }
    ],
    status: { $ne: 'cancelled' }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflictingReservation = await this.findOne(query);
  return conflictingReservation;
};

reservationSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Reservation', reservationSchema);
