import { pick } from 'lodash'
import jwt from 'jsonwebtoken'

const config = require('../config/appconfig');

const User = require('../models/User')

export const getUser = async payload => {
    let limit = parseInt(payload.limit) || 10
    let skip = (parseInt(payload.page) - 1) * parseInt(payload.limit) || 0

    const data = await User.aggregate([
        {
            $facet: {
                "data": [
                    { $sort: { createdAt: -1 }},
                    { $skip: skip },
                    { $limit: limit }
                ],
                "totalCount": [
                    { $count: 'count' }
                ]
            }
        }
    ])
    return data
}

export const userAuthenticate = payload => {
    return new Promise((resolve, reject) => {
        User.findOne({ username: payload.username }, (err, user) => {
            if (err) reject(err)

            if (!user) {
                reject({ success: false, message: 'Username or Password is not valid' })
            } else {
                user.comparedPassword(payload.password, function (error, isMatch) {
                    if (error) reject(error)
                    if (!error && isMatch) {
                        let _payload = pick(user, [
                            "username", "name", "_id",
                        ])
        
                        var token = jwt.sign(_payload, config.auth.jwt_secret, {
                            expiresIn: config.auth.jwt_expiresin
                        });
        
                        resolve({ success: true, data: { token: token, name: user.name, username: user.username, message: `Logged in successfully as ${user.name}` } })
                    } else {
                        reject({ success: false, message: 'Username or Password is not valid' })
                    }
                })
            }
        })
    })
}