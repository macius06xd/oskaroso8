const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Reservation = require('../models/Reservation');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sports-reservation-system');
    console.log('🔗 Connected to MongoDB - Sports Reservation System');

    // Clear existing data
    await User.deleteMany({});
    await Reservation.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'Kompleksu Sportowego',
      email: process.env.ADMIN_EMAIL || 'admin@sportscomplex.com',
      password: adminPassword,
      role: 'admin',
      phone: '+48 123 456 789'
    });
    console.log('👤 Created admin user');

    // Create regular users
    const userPassword = await bcrypt.hash('user123', 12);
    const user1 = await User.create({
      firstName: 'Jan',
      lastName: 'Kowalski',
      email: 'jan.kowalski@example.com',
      password: userPassword,
      role: 'user',
      phone: '+48 987 654 321'
    });

    const user2 = await User.create({
      firstName: 'Anna',
      lastName: 'Nowak',
      email: 'anna.nowak@example.com',
      password: userPassword,
      role: 'user',
      phone: '+48 111 222 333'
    });

    console.log('👥 Created regular users');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const sampleReservations = [
      {
        title: 'Trening pilki noznej - Druzyna Orly',
        description: 'Cotygodniowy trening seniorow',
        startDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
        status: 'confirmed',
        facility: 'Boisko glowne',
        sport: 'Pilka nozna',
        team: 'FC Orly',
        equipment: ['Bramki', 'Pilki', 'Pacholki'],
        services: ['Oswietlenie'],
        payment: {
          amount: 100,
          currency: 'PLN',
          status: 'paid',
          method: 'transfer'
        },
        customer: {
          firstName: 'Marek',
          lastName: 'Trener',
          email: 'marek.trener@fcorly.com',
          phone: '+48 600 100 200'
        },
        assignedTo: admin._id,
        createdBy: admin._id
      },
      {
        title: 'Mecz koszykowki - Liga miejska',
        description: 'Mecz ligowy Titans vs Eagles',
        startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000),
        status: 'confirmed',
        facility: 'Sala sportowa A',
        sport: 'Koszykowka',
        team: 'Titans Basketball',
        equipment: ['Kosze', 'Pilki koszykarskie', 'Tablica wynikow'],
        services: ['Oswietlenie', 'Sedziowie', 'Obsluga medyczna'],
        payment: {
          amount: 200,
          currency: 'PLN',
          status: 'paid',
          method: 'card'
        },
        customer: {
          firstName: 'Piotr',
          lastName: 'Kapitan',
          email: 'piotr.kapitan@titans.com',
          phone: '+48 700 200 300'
        },
        assignedTo: admin._id,
        createdBy: user1._id
      },
      {
        title: 'Turniej tenisa stolowego',
        description: 'Lokalny turniej tenisa stolowego - eliminacje',
        startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
        status: 'pending',
        facility: 'Sala sportowa B',
        sport: 'Tenis stolowy',
        team: 'Klub Ping Pong',
        equipment: ['Stoly do ping ponga', 'Siatki', 'Pileczki'],
        services: ['Oswietlenie', 'System audio'],
        payment: {
          amount: 150,
          currency: 'PLN',
          status: 'pending',
          method: 'transfer'
        },
        customer: {
          firstName: 'Maria',
          lastName: 'Organizator',
          email: 'maria.org@pingpong.com',
          phone: '+48 800 300 400'
        },
        assignedTo: admin._id,
        createdBy: user2._id
      },
      {
        title: 'Zajecia fitness grupowe',
        description: 'Zajecia aerobiku i pilates',
        startDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000),
        status: 'confirmed',
        facility: 'Sala fitness',
        sport: 'Fitness',
        team: 'Grupa fitness',
        equipment: ['Maty', 'Hantle', 'Pilki fitness'],
        services: ['Oswietlenie', 'System audio', 'Klimatyzacja'],
        payment: {
          amount: 75,
          currency: 'PLN',
          status: 'paid',
          method: 'cash'
        },
        customer: {
          firstName: 'Katarzyna',
          lastName: 'Instruktor',
          email: 'kasia.fitness@gmail.com',
          phone: '+48 900 400 500'
        },
        assignedTo: admin._id,
        createdBy: admin._id
      },
      {
        title: 'Trening plywania - Mlodzi',
        description: 'Trening druzyny plywackiej mlodzikow',
        startDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000),
        status: 'confirmed',
        facility: 'Basen olimpijski',
        sport: 'Plywanie',
        team: 'Delfiny Mlodzi',
        equipment: ['Deski do plywania', 'Pull buoy', 'Pletwy'],
        services: ['Ratownik', 'Podgrzewanie wody'],
        payment: {
          amount: 120,
          currency: 'PLN',
          status: 'paid',
          method: 'transfer'
        },
        customer: {
          firstName: 'Tomasz',
          lastName: 'Trener',
          email: 'tomasz.plywanie@delfiny.com',
          phone: '+48 500 600 700'
        },
        assignedTo: admin._id,
        createdBy: user1._id
      },
      {
        title: 'Mecz siatkowki amatorskiej',
        description: 'Towarzyski mecz siatkowki',
        startDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000),
        status: 'pending',
        facility: 'Sala sportowa A',
        sport: 'Siatkowka',
        team: 'Amatorzy Siatkowki',
        equipment: ['Siatka', 'Pilki siatkowka', 'Anteny'],
        services: ['Oswietlenie'],
        payment: {
          amount: 80,
          currency: 'PLN',
          status: 'pending',
          method: 'cash'
        },
        customer: {
          firstName: 'Robert',
          lastName: 'Kapitan',
          email: 'robert.siatka@example.com',
          phone: '+48 600 700 800'
        },
        assignedTo: admin._id,
        createdBy: user2._id
      }
    ];

    await Reservation.insertMany(sampleReservations);
    console.log('🏟️  Created sample sports reservations');

    console.log('\n=== 🏟️  DANE TESTOWE OBIEKTU SPORTOWEGO ZOSTALY UTWORZONE ===');
    console.log('\n👤 Konta uzytkownikow:');
    console.log('  Administrator:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@sportscomplex.com'}`);
    console.log(`   Haslo: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('\n  Uzytkownicy:');
    console.log('   Email: jan.kowalski@example.com');
    console.log('   Haslo: user123');
    console.log('   Email: anna.nowak@example.com');
    console.log('   Haslo: user123');
    console.log('\n🏅 Utworzono 6 przykladowych rezerwacji sportowych:');
    console.log('   • Pilka nozna (Boisko glowne)');
    console.log('   • Koszykowka (Sala sportowa A)');
    console.log('   • Tenis stolowy (Sala sportowa B)');
    console.log('   • Fitness (Sala fitness)');
    console.log('   • Plywanie (Basen olimpijski)');
    console.log('   • Siatkowka (Sala sportowa A)');
    console.log('\n🚀 Mozesz teraz uruchomic aplikacje systemu rezerwacji sportowej!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeder
seedDatabase();
