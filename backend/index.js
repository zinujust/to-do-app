const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');

const taskRouter = require('./routes/tasks');
const authRouter = require('./routes/auth')

const PORT = process.env.PORT || 3000;

app.use(cors()); // Ensure CORS is configured before the routes
app.use(express.json());

app.use('/tasks', taskRouter);
app.use('/auth', authRouter)

const dbURI = process.env.NODE_ENV === 'production' ? process.env.DB_URI_PROD : process.env.DB_URI_DEV;

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
else {
    app.use(morgan('combined'));
}

mongoose.connect(dbURI)
    .then(() => {
        logger.info(`Connected to MongoDB ${process.env.NODE_ENV} database`);
    })
    .catch(err => {
        logger.info(`MongoDB Connection error: , ${err}`)
    })

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    logger.error(`${err.message} - ${req.originalUrl} - ${req.method} ${req.ip}`);
    res.status(500).json({message: 'An error occurred'}); // Fix typo: jason -> json
})