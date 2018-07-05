
const logConf = {
    appenders:
        {
            app: { type: 'console' }
        },
    categories:
        {
            default: { appenders: ['app'], level: 'info' }
        }
};

module.exports = logConf;