import { async } from 'regenerator-runtime';
import models from '../models'

export default {
    // CREATE
    store : async (data) => await models.user.create(data), 

    // READ
    all : async ( ) => await models.user.findAll(),

    find : async ( uuid ) => {
        return await models.user.findOne({
            where : {
                uuid : Buffer(uuid, 'hex')
            }
        })
    },

    // UPDATE
    update : async ( data ) => await models.user.update(data, {
        where : {
            user_id : data.user_id
        }
    }),

    // DELETE
    delete : async ( uuid ) => await models.user.destroy({
        where : {
            uuid : Buffer( uuid , 'hex' )
        }
    })
}