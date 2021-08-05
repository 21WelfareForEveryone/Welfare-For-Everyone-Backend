require('dotenv').config();

if ( process.env.NODE_ENV !== 'production' ) {
    require('@babel/register')
}