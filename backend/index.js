const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
const userRoutes = require('./routes/userRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);

const PORT = process.env.PORT || 201;

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
