import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './dist/models/User.js';
import Project from './dist/models/Project.js';
import Meeting from './dist/models/Meeting.js';

dotenv.config();

const supervisors = [
  { name: 'Maithri Chandima', email: 'maithri@lecturer.nsbm.ac.lk', legacyName: 'Ms. Maithri Chandima' },
  { name: 'Pavithra Subhashini', email: 'pavithra@lecturer.nsbm.ac.lk', legacyName: 'Ms. Pavithra Subhashini' },
  { name: 'Isuru Koswatte', email: 'isuru@lecturer.nsbm.ac.lk', legacyName: 'Dr. Isuru Koswatte' },
  { name: 'Damayanthi Dahanayake', email: 'damayanthi@lecturer.nsbm.ac.lk', legacyName: 'Dr. Damayanthi Dahanayake' },
  { name: 'Thisarani Wickramasinghe', email: 'thisarani@lecturer.nsbm.ac.lk', legacyName: 'Ms. Thisarani Wickramasinghe' },
  { name: 'Chamil Gunarathna', email: 'chamil@lecturer.nsbm.ac.lk', legacyName: 'Mr. Chamil Gunarathna' },
  { name: 'Lakni Peiris', email: 'lakni@lecturer.nsbm.ac.lk', legacyName: 'Ms. Lakni Peiris' },
  { name: 'Githmi Charundi Perera', email: 'githmi@lecturer.nsbm.ac.lk', legacyName: 'Ms. Githmi Charundi Perera' },
  { name: 'Sanuli Weerasinghe', email: 'sanuli@lecturer.nsbm.ac.lk', legacyName: 'Ms. Sanuli Weerasinghe' },
  { name: 'Dharani Rajasinghe', email: 'dharani@lecturer.nsbm.ac.lk', legacyName: 'Ms. Dharani Rajasinghe' },
  { name: 'Chathurma Wijesinghe', email: 'chathurma@lecturer.nsbm.ac.lk', legacyName: 'Ms. Chathurma Wijesinghe' },
  { name: 'Ashini Wanasinghe', email: 'ashini@lecturer.nsbm.ac.lk', legacyName: 'Ms. Ashini Wanasinghe' },
  { name: 'Tharushi Attanayake', email: 'tharushi@lecturer.nsbm.ac.lk', legacyName: 'Ms. Tharushi Attanayake' },
  { name: 'Sachini Tharaka', email: 'sachini@lecturer.nsbm.ac.lk', legacyName: 'Ms. Sachini Tharaka' },
  { name: 'Hiruni Weerasinghe', email: 'hiruni@lecturer.nsbm.ac.lk', legacyName: 'Ms. Hiruni Weerasinghe' },
  { name: 'Hasantha Dissanayake', email: 'hasantha@lecturer.nsbm.ac.lk', legacyName: 'Mr. Hasantha Dissanayake' },
  { name: 'Hirushi Dilpriya', email: 'hirushi@lecturer.nsbm.ac.lk', legacyName: 'Ms. Hirushi Dilpriya' },
  { name: 'Kushani Perera', email: 'kushani@lecturer.nsbm.ac.lk', legacyName: 'Ms. Kushani Perera' },
  { name: 'Demini Rajapaksha', email: 'demini@lecturer.nsbm.ac.lk', legacyName: 'Ms. Demini Rajapaksha' },
  { name: 'Sandyani De Silva', email: 'sandyani@lecturer.nsbm.ac.lk', legacyName: 'Ms. Sandyani De Silva' },
  { name: 'Madhavi Madushani', email: 'madhavi@lecturer.nsbm.ac.lk', legacyName: 'Ms. Madhavi Madushani' },
  { name: 'Dulanjali Wijesekara', email: 'dulanjali@lecturer.nsbm.ac.lk', legacyName: 'Ms. Dulanjali Wijesekara' },
  { name: 'Shehani Joseph', email: 'shehani@lecturer.nsbm.ac.lk', legacyName: 'Ms. Shehani Joseph' }
];

const getLegacyEmail = (legacyName) => {
  return `${legacyName.toLowerCase().replace(/\s+/g, '').replace(/\./g, '')}@lecturer.nsbm.ac.lk`;
};

const seedSupervisors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fypms');
    console.log('Connected to MongoDB');

    for (const supervisor of supervisors) {
      const { name, email, legacyName } = supervisor;
      const legacyEmail = getLegacyEmail(legacyName);

      const matches = await User.find({
        role: 'supervisor',
        $or: [
          { email },
          { email: legacyEmail },
          { name },
          { name: legacyName }
        ]
      });

      let primary = matches.find((u) => u.email === email) || matches[0] || null;

      if (!primary) {
        primary = await User.create({
          name,
          email,
          password: '12345678',
          role: 'supervisor'
        });
      }

      primary.name = name;
      primary.email = email;
      primary.role = 'supervisor';
      primary.password = '12345678';
      await primary.save();

      const duplicates = matches.filter((u) => u._id.toString() !== primary._id.toString());
      for (const duplicate of duplicates) {
        await Project.updateMany({ supervisorId: duplicate._id }, { supervisorId: primary._id });
        await Meeting.updateMany({ supervisorId: duplicate._id }, { supervisorId: primary._id });

        await User.updateMany(
          { assignedSupervisor: duplicate._id },
          { assignedSupervisor: primary._id }
        );

        const usersWithDuplicateAssigned = await User.find({ assignedStudents: duplicate._id }).select('_id');
        const userIds = usersWithDuplicateAssigned.map((u) => u._id);

        if (userIds.length > 0) {
          await User.updateMany(
            { _id: { $in: userIds } },
            { $pull: { assignedStudents: duplicate._id } }
          );

          await User.updateMany(
            { _id: { $in: userIds } },
            { $addToSet: { assignedStudents: primary._id } }
          );
        }

        await User.deleteOne({ _id: duplicate._id });
      }

      const action = matches.length === 0 ? 'Created' : 'Upserted';
      console.log(`${action} supervisor: ${name} (${email})`);
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding supervisors:', error);
    process.exit(1);
  }
};

seedSupervisors();
