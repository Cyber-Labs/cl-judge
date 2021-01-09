const fs = require('fs')

const scheduleJobs = () => {
  fs.readdirSync(__dirname, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .forEach((jobDir) => {
      const job = require(`./${jobDir}`)
      job.start()
      console.log(`Stared job ${jobDir}`)
    })
}

module.exports = { scheduleJobs }
