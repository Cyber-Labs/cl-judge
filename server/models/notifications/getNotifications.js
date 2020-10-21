const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Number} param0.limit
 * @return {Promise}
 *
 */

function getNotifications({ username, limit }) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT notif.id id,heading,description,created_at,\`read\`,nmap.id map_key FROM notifications notif INNER JOIN (SELECT id,notification_id,\`read\` FROM user_notifications WHERE username=?) nmap ON nmap.notification_id=notif.id ORDER BY created_at DESC LIMIT ${limit}`,
      [username],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        const mapKeys = results.map(({ map_key: mapKey }) => mapKey)
        const keyList = `(${mapKeys.join(',')})`
        pool.query(
          `UPDATE user_notifications SET \`read\`=1 WHERE  id in ${keyList} AND \`read\`=0`,
          [username],
          (error, results) => {
            if (error) {
              return reject(error)
            }
            return resolve(results)
          }
        )
        return resolve(results)
      }
    )
  })
}

module.exports = getNotifications
