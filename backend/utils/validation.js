const Joi = require('joi');

// User validation schemas
exports.registerSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Imię jest wymagane',
      'string.min': 'Imię musi mieć co najmniej 2 znaki',
      'string.max': 'Imię nie może być dłuższe niż 50 znaków'
    }),
  
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Nazwisko jest wymagane',
      'string.min': 'Nazwisko musi mieć co najmniej 2 znaki',
      'string.max': 'Nazwisko nie może być dłuższe niż 50 znaków'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Proszę podać prawidłowy adres email',
      'string.empty': 'Email jest wymagany'
    }),
  
  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Hasło jest wymagane',
      'string.min': 'Hasło musi mieć co najmniej 6 znaków',
      'string.max': 'Hasło nie może być dłuższe niż 100 znaków'
    }),
  
  phone: Joi.string()
    .pattern(/^[+]?[\d\s\-\(\)]+$/)
    .allow('')
    .messages({
      'string.pattern.base': 'Proszę podać prawidłowy numer telefonu'
    })
});

exports.loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Proszę podać prawidłowy adres email',
      'string.empty': 'Email jest wymagany'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Hasło jest wymagane'
    })
});

exports.updateUserSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Imię musi mieć co najmniej 2 znaki',
      'string.max': 'Imię nie może być dłuższe niż 50 znaków'
    }),
  
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Nazwisko musi mieć co najmniej 2 znaki',
      'string.max': 'Nazwisko nie może być dłuższe niż 50 znaków'
    }),
  
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Proszę podać prawidłowy adres email'
    }),
  
  phone: Joi.string()
    .pattern(/^[+]?[\d\s\-\(\)]+$/)
    .allow('')
    .messages({
      'string.pattern.base': 'Proszę podać prawidłowy numer telefonu'
    })
});

exports.updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Aktualne hasło jest wymagane'
    }),
  
  newPassword: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Nowe hasło jest wymagane',
      'string.min': 'Nowe hasło musi mieć co najmniej 6 znaków',
      'string.max': 'Nowe hasło nie może być dłuższe niż 100 znaków'
    })
});

// Reservation validation schemas
exports.createReservationSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Tytuł rezerwacji jest wymagany',
      'string.min': 'Tytuł musi mieć co najmniej 3 znaki',
      'string.max': 'Tytuł nie może być dłuższy niż 100 znaków'
    }),
  
  description: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Opis nie może być dłuższy niż 500 znaków'
    }),
  
  startDate: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.base': 'Proszę podać prawidłową datę rozpoczęcia',
      'date.min': 'Data rozpoczęcia nie może być w przeszłości',
      'any.required': 'Data rozpoczęcia jest wymagana'
    }),
  
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .required()
    .messages({
      'date.base': 'Proszę podać prawidłową datę zakończenia',
      'date.min': 'Data zakończenia musi być późniejsza niż data rozpoczęcia',
      'any.required': 'Data zakończenia jest wymagana'
    }),
  
  allDay: Joi.boolean().default(false),
  
  facility: Joi.string()
    .valid(
      'Boisko glowne',
      'Sala sportowa A',
      'Sala sportowa B',
      'Sala fitness',
      'Basen olimpijski'
    )
    .messages({
      'any.only': 'Obiekt musi być jednym z dostępnych obiektów sportowych',
      'string.empty': 'Obiekt sportowy jest wymagany'
    }),

  sport: Joi.string()
    .valid(
      'Pilka nozna',
      'Koszykowka',
      'Tenis stolowy',
      'Fitness',
      'Plywanie',
      'Siatkowka',
      'Multi-sport',
      'Other'
    )
    .messages({
      'any.only': 'Sport musi być jednym z: Pilka nozna, Koszykowka, Tenis stolowy, Fitness, Plywanie, Siatkowka, Multi-sport, Other',
      'string.empty': 'Sport jest wymagany'
    }),

  
  team: Joi.object({
    name: Joi.string()
      .trim()
      .max(100)
      .messages({
        'string.max': 'Nazwa zespołu nie może być dłuższa niż 100 znaków'
      }),
    
    size: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .default(1)
      .messages({
        'number.base': 'Rozmiar zespołu musi być liczbą',
        'number.min': 'Rozmiar zespołu musi być co najmniej 1',
        'number.max': 'Rozmiar zespołu nie może przekraczać 50 osób'
      }),
    
    contactPerson: Joi.string()
      .trim()
      .max(100)
      .messages({
        'string.max': 'Nazwa osoby kontaktowej nie może być dłuższa niż 100 znaków'
      })
  }),
  
  equipment: Joi.array()
    .items(Joi.string().valid('balls', 'nets', 'goals', 'mats', 'weights', 'sound-system', 'projector', 'other'))
    .messages({
      'array.includes': 'Nieprawidłowe wyposażenie'
    }),
  
  services: Joi.array()
    .items(Joi.string().valid('referee', 'coaching', 'equipment-rental', 'catering', 'cleaning', 'security'))
    .messages({
      'array.includes': 'Nieprawidłowa usługa'
    }),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium')
    .messages({
      'any.only': 'Priorytet musi być jednym z: low, medium, high'
    }),
  
  customer: Joi.object({
    firstName: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Imię klienta jest wymagane',
        'string.min': 'Imię musi mieć co najmniej 2 znaki',
        'string.max': 'Imię nie może być dłuższe niż 50 znaków'
      }),
    
    lastName: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Nazwisko klienta jest wymagane',
        'string.min': 'Nazwisko musi mieć co najmniej 2 znaki',
        'string.max': 'Nazwisko nie może być dłuższe niż 50 znaków'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Proszę podać prawidłowy adres email klienta',
        'string.empty': 'Email klienta jest wymagany'
      }),
    
    phone: Joi.string()
      .pattern(/^[+]?[\d\s\-\(\)]+$/)
      .allow('')
      .messages({
        'string.pattern.base': 'Proszę podać prawidłowy numer telefonu'
      })
  }).required(),
  
  notes: Joi.string()
    .trim()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Notatki nie mogą być dłuższe niż 1000 znaków'
    }),
  
  assignedTo: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Nieprawidłowy identyfikator użytkownika'
    })
});

exports.updateReservationSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.min': 'Tytuł musi mieć co najmniej 3 znaki',
      'string.max': 'Tytuł nie może być dłuższy niż 100 znaków'
    }),
  
  description: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Opis nie może być dłuższy niż 500 znaków'
    }),
  
  startDate: Joi.date()
    .iso()
    .messages({
      'date.base': 'Proszę podać prawidłową datę rozpoczęcia'
    }),
  
  endDate: Joi.date()
    .iso()
    .when('startDate', {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref('startDate')),
      otherwise: Joi.date()
    })
    .messages({
      'date.base': 'Proszę podać prawidłową datę zakończenia',
      'date.min': 'Data zakończenia musi być późniejsza niż data rozpoczęcia'
    }),
  
  allDay: Joi.boolean(),
  
  status: Joi.string()
    .valid('pending', 'confirmed', 'cancelled', 'completed')
    .messages({
      'any.only': 'Status musi być jednym z: pending, confirmed, cancelled, completed'
    }),
  
facility: Joi.string()
    .valid(
      'Boisko glowne',
      'Sala sportowa A',
      'Sala sportowa B',
      'Sala fitness',
      'Basen olimpijski'
    )
    .required()
    .messages({
      'any.only': 'Obiekt musi być jednym z dostępnych obiektów sportowych',
      'string.empty': 'Obiekt sportowy jest wymagany'
    }),

  sport: Joi.string()
    .valid(
      'Pilka nozna',
      'Koszykowka',
      'Tenis stolowy',
      'Fitness',
      'Plywanie',
      'Siatkowka',
      'Multi-sport',
      'Other'
    )
    .messages({
      'any.only': 'Sport musi być jednym z: Pilka nozna, Koszykowka, Tenis stolowy, Fitness, Plywanie, Siatkowka, Multi-sport, Other',
      'string.empty': 'Sport jest wymagany'
    }),

  
  team: Joi.object({
    name: Joi.string()
      .trim()
      .max(100)
      .messages({
        'string.max': 'Nazwa zespołu nie może być dłuższa niż 100 znaków'
      }),
    
    size: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .messages({
        'number.base': 'Rozmiar zespołu musi być liczbą',
        'number.min': 'Rozmiar zespołu musi być co najmniej 1',
        'number.max': 'Rozmiar zespołu nie może przekraczać 50 osób'
      }),
    
    contactPerson: Joi.string()
      .trim()
      .max(100)
      .messages({
        'string.max': 'Nazwa osoby kontaktowej nie może być dłuższa niż 100 znaków'
      })
  }),
  
  equipment: Joi.array()
    .items(Joi.string().valid('balls', 'nets', 'goals', 'mats', 'weights', 'sound-system', 'projector', 'other'))
    .messages({
      'array.includes': 'Nieprawidłowe wyposażenie'
    }),
  
  services: Joi.array()
    .items(Joi.string().valid('referee', 'coaching', 'equipment-rental', 'catering', 'cleaning', 'security'))
    .messages({
      'array.includes': 'Nieprawidłowa usługa'
    }),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .messages({
      'any.only': 'Priorytet musi być jednym z: low, medium, high'
    }),
  
  customer: Joi.object({
    firstName: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'Imię musi mieć co najmniej 2 znaki',
        'string.max': 'Imię nie może być dłuższe niż 50 znaków'
      }),
    
    lastName: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'Nazwisko musi mieć co najmniej 2 znaki',
        'string.max': 'Nazwisko nie może być dłuższe niż 50 znaków'
      }),
    
    email: Joi.string()
      .email()
      .messages({
        'string.email': 'Proszę podać prawidłowy adres email klienta'
      }),
    
    phone: Joi.string()
      .pattern(/^[+]?[\d\s\-\(\)]+$/)
      .allow('')
      .messages({
        'string.pattern.base': 'Proszę podać prawidłowy numer telefonu'
      })
  }),
  
  notes: Joi.string()
    .trim()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Notatki nie mogą być dłuższe niż 1000 znaków'
    }),
  
  assignedTo: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      'string.pattern.base': 'Nieprawidłowy identyfikator użytkownika'
    })
});

// Query validation schemas
exports.queryReservationsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().when('startDate', {
    is: Joi.exist(),
    then: Joi.date().min(Joi.ref('startDate'))
  }),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed'),
  category: Joi.string().valid('meeting', 'appointment', 'event', 'consultation', 'other'),
  assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
});

exports.availableSlotsSchema = Joi.object({
  date: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.base': 'Proszę podać prawidłową datę',
      'date.min': 'Data nie może być w przeszłości',
      'any.required': 'Data jest wymagana'
    }),
  
  duration: Joi.number()
    .integer()
    .min(15)
    .max(480)
    .default(60)
    .messages({
      'number.base': 'Czas trwania musi być liczbą',
      'number.min': 'Minimalny czas trwania to 15 minut',
      'number.max': 'Maksymalny czas trwania to 480 minut (8 godzin)'
    })
});

// Middleware function to validate request data
exports.validateRequest = (schema) => {
  return (req, res, next) => {
    console.log(req.body)
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Błąd walidacji danych',
        errors
      });
    }

    req.body = value;
    next();
  };
};

// Middleware function to validate query parameters
exports.validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Błąd walidacji parametrów zapytania',
        errors
      });
    }

    req.query = value;
    next();
  };
};
