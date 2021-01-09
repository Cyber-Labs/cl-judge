const CronJob = require('cron').CronJob
const { deleteUnverifiedAccounts } = require('./deleteUnverifiedAccounts')

module.exports = new CronJob('0 0 0 * * *', deleteUnverifiedAccounts)
