import { getUser, userAuthenticate } from '../service/UserService';
const Logger = require('../utils/logger');

const logger = new Logger();

export const fetchAllUser = async (req, res) => {
    try {
        const data = await getUser(req.query)
        res.status(200).json({sucess: true, data: data})
    } catch (error) {
        logger.log(`status 400, ${JSON.stringify(error.message)}`, 'error');
        res.status(400).json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    try {
        const data = await userAuthenticate(req.body)
        res.status(200).json(data)
    } catch (error) {
        logger.log(`status 400, ${JSON.stringify(error.message)}`, 'error');
        res.status(400).json({success: false, message: error.message})
    }
}