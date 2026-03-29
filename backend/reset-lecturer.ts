import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fypms');
        console.log('Connected to MongoDB');

        const email = 'shehani@lecturer.nsbm.ac.lk';
        const user = await User.findOne({ email });

        if (user) {
            user.password = '12345678';
            await user.save();
            console.log(`✅ Success: Password for ${email} reset to 12345678`);
        } else {
            console.log(`❌ Error: User with email ${email} not found.`);
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Error resetting password:', err);
        process.exit(1);
    }
};

resetPassword();
