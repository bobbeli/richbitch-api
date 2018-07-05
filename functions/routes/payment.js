const express = require('express');
const paymentDispatcher = express.Router();
let log4js = require('log4js');
require('dotenv-extended').load();
let stripe = require('../constants/stripe');

let logConf = require('../constants/log_conf');

log4js.configure(logConf);
let logger = log4js.getLogger('app');

paymentDispatcher.route('/charge')
    .post((req, res) => {
        let token = req.body.stripeToken;
        let amount = parseInt(req.body.amount) * 100;
        logger.info('Amount ', amount);
        logger.info('token ', token.token.id);

        stripe.charges.create({
            amount: amount,
            currency: "chf",
            description: "Your Prestige gains",
            source: token.token.id,
        }, function(err, charge) {
            if(err){
                logger.error('failed charge ', err);
                res.status(err.statusCode).send(err);
            }else{
                logger.info('successfull ', charge, ' token: ', token, ' amount ', amount);
                res.status(200).send(charge);
            }
        });

    });


module.exports = paymentDispatcher;
