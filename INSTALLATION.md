# Instrukcje instalacji i uruchomienia

## Wymagania systemowe

- Node.js (wersja 16 lub nowsza)
- MongoDB (lokalnie lub w chmurze)
- Git

## Instalacja backendu

1. Przejdź do folderu backend:
```bash
cd backend
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skopiuj plik konfiguracyjny:
```bash
copy .env.example .env
```

4. Edytuj plik `.env` i ustaw swoje dane:
- `MONGODB_URI` - połączenie z bazą danych MongoDB
- `JWT_SECRET` - tajny klucz do JWT (wygeneruj losowy ciąg znaków)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - ustawienia SMTP do wysyłania emaili

5. Uruchom serwer:
```bash
npm run dev
```

Backend będzie dostępny pod adresem: http://localhost:5000

## Instalacja frontendu

1. Otwórz nowy terminal i przejdź do folderu frontend:
```bash
cd frontend
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom aplikację:
```bash
npm start
```

Frontend będzie dostępny pod adresem: http://localhost:3000

## Dane testowe

Po uruchomieniu aplikacji możesz utworzyć konto administratora lub użyć danych testowych:

### Tworzenie konta administratora
1. Zarejestruj się przez interfejs aplikacji
2. W bazie danych MongoDB znajdź utworzonego użytkownika i zmień pole `role` na `admin`

### Konfiguracja MongoDB

Jeśli nie masz MongoDB zainstalowanego lokalnie, możesz:

1. Zainstalować MongoDB lokalnie
2. Użyć MongoDB Atlas (darmowa opcja w chmurze)
3. Użyć Docker: `docker run -d -p 27017:27017 mongo`

## Funkcjonalności

### Już zaimplementowane:
- ✅ Rejestracja i logowanie użytkowników
- ✅ Autoryzacja JWT
- ✅ Podstawowy kalendarz z FullCalendar
- ✅ Responsywny design z Material-UI
- ✅ Routing i navigation
- ✅ Walidacja danych
- ✅ System powiadomień

### Do implementacji:
- 🔄 Kompletny formularz rezerwacji
- 🔄 Szczegóły rezerwacji
- 🔄 Panel administratora
- 🔄 Zarządzanie profilem
- 🔄 Moje rezerwacje
- 🔄 Wysyłanie emaili
- 🔄 Sprawdzanie dostępności terminów

## API Endpoints

### Autoryzacja
- `POST /api/auth/register` - Rejestracja
- `POST /api/auth/login` - Logowanie
- `GET /api/auth/me` - Dane użytkownika
- `PUT /api/auth/updatedetails` - Aktualizacja danych
- `PUT /api/auth/updatepassword` - Zmiana hasła

### Rezerwacje
- `GET /api/reservations` - Lista rezerwacji
- `POST /api/reservations` - Nowa rezerwacja
- `GET /api/reservations/:id` - Szczegóły rezerwacji
- `PUT /api/reservations/:id` - Aktualizacja rezerwacji
- `DELETE /api/reservations/:id` - Usunięcie rezerwacji
- `GET /api/reservations/available` - Dostępne terminy

### Użytkownicy (Admin)
- `GET /api/users` - Lista użytkowników
- `GET /api/users/:id` - Szczegóły użytkownika
- `PUT /api/users/:id` - Aktualizacja użytkownika
- `DELETE /api/users/:id` - Dezaktywacja użytkownika

## Struktura projektu

```
reservation-calendar/
├── backend/                 # Serwer Node.js
│   ├── controllers/        # Kontrolery API
│   ├── middleware/         # Middleware autoryzacji
│   ├── models/            # Modele MongoDB
│   ├── routes/            # Definicje tras API
│   ├── utils/             # Funkcje pomocnicze
│   ├── server.js          # Główny plik serwera
│   └── package.json
├── frontend/              # Aplikacja React
│   ├── public/           # Pliki statyczne
│   ├── src/
│   │   ├── components/   # Komponenty React
│   │   ├── contexts/     # Context providers
│   │   ├── pages/        # Strony aplikacji
│   │   ├── App.js        # Główny komponent
│   │   └── index.js      # Punkt wejścia
│   └── package.json
└── README.md
```

## Wsparcie

W przypadku problemów z instalacją lub uruchomieniem, sprawdź:
1. Czy wszystkie zależności zostały zainstalowane
2. Czy MongoDB jest uruchomione
3. Czy porty 3000 i 5000 są wolne
4. Czy plik .env jest poprawnie skonfigurowany
