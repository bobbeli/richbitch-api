const functions = require('firebase-functions');
const express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let paymentDispatcher = require('./routes/payment');
let pushDispatcher = require('./routes/push');
require('dotenv-extended').load();
let log4js = require('log4js');
let admin = require('firebase-admin');
let logConf = require('./constants/log_conf');


/**
 * Logger
 * Load configuration File and choose Log Category (APP)
 */
log4js.configure(logConf);
let logger = log4js.getLogger('app');
logger.info("App is up and running");

/**
 * Initialize Fireabase Admin
 * @type {*|Express|Function}
 */

let serviceAccount = require('./prestige-api-firebase-adminsdk.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://richbitch-4fc7a.firebaseio.com/'
});


let app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Prestige API')
});

app.use('/payment', paymentDispatcher);
app.use('/push', pushDispatcher);


exports.app = functions.https.onRequest(app);
