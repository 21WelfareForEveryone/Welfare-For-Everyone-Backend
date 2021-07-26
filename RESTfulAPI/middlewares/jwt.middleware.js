import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import userRepo from '../repositories/user.repository'

export default async (req, res, next) => {
    try {
        req.user = null

        if ( req.headers.authorization ) {
            let uuid
            jwt.verify (
                req.headers.authorization.split(' ')[1],
                process.env.JWT_SECRET,
                (err, payload) => {
                    if ( err ){
                        return next(createError(401 , 'Invalid Token Information'))
                    }

                    uuid = payload.uuid
                }
            )

            const user = await userRepo.find(uuid)

            if ( !user ) {
                return next(createError(404, 'User Not Found'))
            }

            req.user = user
        }

        next()
    } catch (e) {
        next(e)
    }
}