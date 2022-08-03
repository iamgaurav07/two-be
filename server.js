require("dotenv").config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as uuid from 'uuid';

const config = require('./config/appconfig');
const Logger = require('./utils/logger.js');

const logger = new Logger();

const app = express();

app.use(cors());
app.set('config', config); // the system configrationsx
app.use(bodyParser.json());

app.use((req, res, next) => {
	req.identifier = uuid.v4();
	const logString = `a request has been made with the following uuid [${req.identifier}] ${req.url} ${req.headers['user-agent']} ${JSON.stringify(req.body)}`;
	logger.log(logString, 'info');
	next();
});

app.use('/api', require('./router'));

import path from 'path'
app.use(express.static(path.resolve(__dirname, './build')));

app.get('/*', function(req, res) {
    return res.sendFile(path.join(__dirname + './build', 'index.html'));
});

app.use((req, res, next) => {
	logger.log('the url you are trying to reach is not hosted on our server', 'error');
	const err = new Error('Not Found');
	err.status = 404;
	res.status(err.status).json({ type: 'error', message: 'the url you are trying to reach is not hosted on our server' });
	next(err);
});

module.exports = app;