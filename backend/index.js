const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const taskRouter = require('./routes/tasks');

const PORT = process.env.PORT || 3000;

app.use(cors()); // Ensure CORS is configured before the routes
app.use(express.json());
app.use('/tasks', taskRouter);

const dbURI = process.env.NODE_ENV === 'production' ? process.env.DB_URI_PROD : process.env.DB_URI_DEV;
mongoose.connect(dbURI)
    .then(() => {
        console.log(`Connected to MongoDB ${process.env.NODE_ENV} database`);
    })
    .catch(err => {
        console.error(`MongoDB Connection error: , ${err}`)
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: 'An error occurred'}); // Fix typo: jason -> json
})