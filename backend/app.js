require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});
app.use(bodyParser.json());
app.use('/images', express.static(path.join('images')));
app.use('/auth', authRoutes);
app.use('/post', postRoutes);

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mern-projects.ojy7v65.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(res => app.listen(process.env.PORT || 8000))
    .catch(err => console.log(err));