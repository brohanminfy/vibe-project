import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors';
import userRoutes from './routes/user.routes.js'
import { swaggerUi, swaggerSpec } from './swagger.js'
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));


// Swagger

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.send('Cheat Buster API is running!');
});

// Use our user routes for any path starting with /api
app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on <http://localhost>:${PORT}`);
});
