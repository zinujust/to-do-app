// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const logger = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');


// Import routers
const taskRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');
const { info } = require('winston');

// Initialize express app
const app = express();

// Set the port
const PORT = process.env.PORT || 3000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MERN To-do API',
            version: '1.0.0',
            description: 'API Documentation for the MERN to-do Application',
            
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: [`./routes/*.js`],
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Use morgan for logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Routes
app.use('/tasks', taskRouter);
app.use('/auth', authRouter);

// Database connection
const dbURI = process.env.NODE_ENV === 'production' ? process.env.DB_URI_PROD : process.env.DB_URI_DEV;

mongoose.connect(dbURI)
    .then(() => {
        logger.info(`Connected to MongoDB ${process.env.NODE_ENV} database`);
    })
    .catch(err => {
        logger.info(`MongoDB Connection error: ${err}`);
    });

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`${err.message} - ${req.originalUrl} - ${req.method} ${req.ip}`);
    res.status(500).json({ message: 'An error occurred' }); // Fix typo: jason -> json
});

module.exports = app