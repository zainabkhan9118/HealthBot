const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/check-ins', require('./routes/checkIn'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/progress', require('./routes/progress'));

app.get('/', (req, res) => {
  res.send('HealthBot Authentication API is running');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
