
import jwt from 'jsonwebtoken'
import { isUndefined } from 'lodash'
const config = require('../config/appconfig')
const Logger = require('../utils/logger');

const logger = new Logger();

export const verifyToken = async (req, res, next) => {
    try {
		if (isUndefined(req.headers.authorization)) {
            logger.log(`status 401, Not Authorized to access this resource!`, 'error');
			res.status(401).json({ success: false, message: 'Not Authorized to access this resource!' });
		}
		const Bearer = req.headers.authorization.split(' ')[0];

		if (!Bearer || Bearer !== 'Bearer') {
            logger.log(`status 401, Not Authorized to access this resource!`, 'error');
			res.status(401).json({ success: false, message: 'Not Authorized to access this resource!' });
		}

		const token = req.headers.authorization.split(' ')[1];

		if (!token) {
            logger.log(`status 401, Not Authorized to access this resource!`, 'error');
			res.status(401).json({ success: false, message: 'Not Authorized to access this resource!' });
		}

		// verifies secret and checks exp
		jwt.verify(token, config.auth.jwt_secret, (err, decoded) => {
			if (err) {
                logger.log(`status 401, please provide a vaid token ,your token might be expired!`, 'error');
                res.status(401).json({ success: false, message: 'please provide a vaid token ,your token might be expired' });
			}
			req.decoded = decoded;
			next();
		});
	} catch (err) {
        logger.log(`status 400, ${err.message}`, 'error');
		res.status(400).json({ success: false, message: err.message });
	}
}