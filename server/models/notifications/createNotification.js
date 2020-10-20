const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {Object} param0.body
 * @return {Promise}
 *
 */

function createNotification({ body }) {
  return new Promise((resolve, reject) => {
    const {
      heading,
      description,
      public,
      target_usernames: targetUsernames,
    } = body
    pool.query(
      `INSERT INTO notifications (heading,description) VALUES(?,?)`,
      [heading, description],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        const { insertId: notificationId } = results
        if (public) {
          pool.query(`SELECT username FROM users`, [], (error, results) => {
            if (error) {
              return reject(error)
            }
            const values = results
              .map((user) => `(${notificationId},'${user.username}')`)
              .join(',')
            pool.query(
              `INSERT INTO user_notifications(notification_id,username) VALUES ${values}`,
              [],
              (error) => {
                if (error) {
                  return reject(error)
                }
                resolve({ message: 'Notification created successfully' })
              }
            )
          })
        }
        let invalidUsernames = []
        targetUsernames.forEach((username) => {
          pool.query(
            `INSERT INTO user_notifications(notification_id,username) VALUES (?,?)`,
            [notificationId, username],
            (error, results) => {
              if (error || results === undefined) {
                invalidUsernames.push(username)
              }
            }
          )
        })
        resolve({
          message: 'Notification created successfully',
          notificationId: notificationId,
          invalidUsernames: invalidUsernames,
        })
      }
    )
  })
}

module.exports = createNotification
