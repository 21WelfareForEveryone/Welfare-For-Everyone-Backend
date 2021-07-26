import dotenv from 'dotenv';

import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
const logger = require('morgan');
const cors = require('cors');

const app = express()
const path = require('path')

dotenv.config()

app.use(logger(':method :url :data :status'), function(req, res, next){ next() })

app.use(express.json({ limit : 7000000 }))
app.use(express.urlencoded({ limit: 7000000, extended: true , parameterLimit : 7000000}))

app.use(jwtMiddleware)