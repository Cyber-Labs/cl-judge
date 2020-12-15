/**
 * @param {Array} param0.contests
 * @param {Object} param0.query
 */

const sortContests = (contests, query) => {
  let limit = Number(query.limit)
  let active = Boolean(query.active) || false
  let past = Boolean(query.past) || false
  let upcoming = Boolean(query.upcoming) || false

  if (!limit || isNaN(limit) || limit === null || limit === undefined) {
    limit = 5
  }
  const today = new Date()
  const currentTime = today.getTime()
  let pastContests = []
  let activeContests = []
  let upcomingContests = []

  let i = 0
  while (i < contests.length && (active || past || upcoming)) {
    const startTime = contests[i].start_time.getTime()
    const endTime = contests[i].end_time.getTime()
    if (endTime < currentTime && past && pastContests.length < limit) {
      pastContests.push(contests[i])
      i++
      if (pastContests.length === limit) {
        past = false
      }
      continue
    } else if (
      endTime > currentTime &&
      startTime < currentTime &&
      active &&
      activeContests.length < limit
    ) {
      activeContests.push(contests[i])
      i++
      if (activeContests.length === limit) {
        active = false
      }
      continue
    } else if (
      startTime > currentTime &&
      upcoming &&
      upcomingContests.length < limit
    ) {
      upcomingContests.push(contests[i])
      i++
      if (upcomingContests.length === limit) {
        upcoming = false
      }
      continue
    }
    i++
  }

  return {
    pastContests,
    activeContests,
    upcomingContests,
  }
}

module.exports = sortContests
