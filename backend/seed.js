import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const supervisors = [
  "Ms. Maithri Chandima",
  "Ms. Pavithra Subhashini",
  "Dr. Isuru Koswatte",
  "Dr. Damayanthi Dahanayake",
  "Ms. Thisarani Wickramasinghe",
  "Mr. Chamil Gunarathna",
  "Ms. Lakni Peiris",
  "Ms. Githmi Charundi Perera",
  "Ms. Sanuli Weerasinghe",
  "Ms. Dharani Rajasinghe",
  "Ms. Chathurma Wijesinghe",
  "Ms. Ashini Wanasinghe",
  "Ms. Tharushi Attanayake",
  "Ms. Sachini Tharaka",
  "Ms. Hiruni Weerasinghe",
  "Mr. Hasantha Dissanayake",
  "Ms. Hirushi Dilpriya",
  "Ms. Kushani Perera",
  "Ms. Demini Rajapaksha",
  "Ms. Sandyani De Silva",
  "Ms. Madhavi Madushani",
  "Ms. Dulanjali Wijesekara",
  "Ms. Shehani Joseph"
];

const seedSupervisors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fypms');
    console.log('Connected to MongoDB');

    for (const name of supervisors) {
      const email = `${name.toLowerCase().replace(/\s+/g, '.').replace(/\./g, '')}@lecturer.nsbm.ac.lk`;
      const existing = await User.findOne({ email });
      if (!existing) {
        await User.create({
          name,
          email,
          password: 'password123', // default password
          role: 'supervisor'
        });
        console.log(`Created supervisor: ${name}`);
      } else {
        console.log(`Supervisor ${name} already exists`);
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding supervisors:', error);
    process.exit(1);
  }
};

seedSupervisors();