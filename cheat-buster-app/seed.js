import mongoose from 'mongoose'
import axios from 'axios'
import User from './models/user.model.js'
import dotenv from 'dotenv' 
dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected for seeding.');

        // Check if data already exists to avoid re-seeding
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Database already seeded. Exiting.');
            mongoose.disconnect();
            return;
        }

        // Fetch 50 fake users from the randomuser.me API
        const response = await axios.get('https://randomuser.me/api/?results=50&nat=us');
        const usersToSeed = response.data.results.map(user => ({
            firstName: user.name.first,
            lastName: user.name.last,
            email: user.email,
            age: user.dob.age,
            city: user.location.city,
            picture: user.picture.large
        }));

        await User.insertMany(usersToSeed);
        console.log('Database seeded successfully with 50 users!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
    }
};

seedDatabase();
