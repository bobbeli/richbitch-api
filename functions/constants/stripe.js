const configureStripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.DEBUG_MODUS === 'true'
    ? process.env.SK_TEST_MY_SECRET_KEY
    : process.env.SK_LIVE_MY_SECRET_KEY;



const stripe = configureStripe(STRIPE_SECRET_KEY);

module.exports = stripe;