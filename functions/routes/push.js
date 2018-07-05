const express = require('express');
const pushDispatcher = express.Router();
let log4js = require('log4js');
require('dotenv-extended').load();
let admin = require('firebase-admin');

let logConf = require('../constants/log_conf');

/**
 * Logger
 */
log4js.configure(logConf);
let logger = log4js.getLogger('app');

/**
 * Firebase Database
 */

pushDispatcher.route('/subscribe')
    .post((req, res) => {
        let database = admin.database();

        let token = req.body.token;
        let uid = req.body.uid;
        let topic = req.body.topic;

        if(!token || typeof token === 'undefined'){
            res.status(300).send('no valid push token')
        }

        if(!uid || typeof uid === 'undefined'){
            res.status(300).send('no valid user id')
        }


        database.ref('users/' + uid + '/pushToken').set(token).then(() => {
            logger.info('Successfully Subscribed. Token: ' + token);
            res.status(201).send();
            return true;

        }).catch((err) => {
                logger.error(err);
                res.status(400).send(err);
            }
        );


    });

pushDispatcher.route('/unsubscribe')
    .post((req, res) => {
        let database = admin.database();

        let uid = req.body.uid;

        if(!uid || typeof uid === 'undefined'){
            res.status(300).send('no valid user id')
        }


        database.ref('users/' + uid + '/pushToken').set(null).then(() => {
            logger.info('Successfully Unsubscribed. UID: ' + uid);
            res.status(200).send();

        }).catch((err) => {
            logger.error(err);
            res.status(400).send(err)
        }
        );
    });

pushDispatcher.route('/send')
    .post((req, res) => {
        let registrationToken = req.body.token;


        let message = {
            token:registrationToken,
            data: {
                title : "Mauro is on top",
                body : "check out the PRESTIGE of Mauro",
                actions : "true"
            }
        };

        // Send a message to devices subscribed to the combination of topics
        // specified by the provided condition.
        admin.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                logger.info('Successfully Send. Message: ' + response);
                res.status(200).send('Successfully sent message:' + response)
            })
            .catch((error) => {
                logger.error(error);
                res.status(400).send('Error sendding message: ' + error);
            });


    });

module.exports = pushDispatcher;
