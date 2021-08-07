const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const User = require('./models/user');

const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes);

app.listen(3000);