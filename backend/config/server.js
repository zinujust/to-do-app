const mongoose = require('mongoose');

mongoose.connect(process.env.DEV_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});