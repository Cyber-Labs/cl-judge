export default function remainingTime (destinationTime, serverTime, clientTime) {
  const clientLag = (serverTime - clientTime) + 1500
  const currentTime = new Date()
  const timeDiff = (destinationTime - clientLag) - currentTime
  if (timeDiff <= 0) {
    return ''
  }
  const year = Math.floor(timeDiff / (1000 * 3600 * 24 * 365))
  const months = Math.floor(timeDiff / (1000 * 3600 * 24 * 30)) % 12
  const days = Math.floor(timeDiff / (1000 * 3600 * 24)) % 31
  const hour = Math.floor(timeDiff / (1000 * 3600)) % 24
  const min = Math.floor(timeDiff / (1000 * 60)) % 60
  const sec = Math.floor(timeDiff / 1000) % 60
  let res = ''
  if (year) {
    res += year === 1 ? `${year} year ` : ''
    res += year !== 1 ? `${year} years ` : ''
  }
  if (months) {
    res += months === 1 ? `${months} month ` : ''
    res += months !== 1 ? `${months} months ` : ''
  }
  if (days) {
    res += days === 1 ? `${days} day ` : ''
    res += days !== 1 ? `${days} days ` : ''
  }
  if (hour) {
    res += hour === 1 ? `${hour} hour ` : ''
    res += hour !== 1 ? `${hour} hours ` : ''
  }
  if (min) {
    res += min === 1 ? `${min} min ` : ''
    res += min !== 1 ? `${min} mins ` : ''
  }
  if (sec) {
    res += sec === 1 ? `${sec} sec ` : ''
    res += sec !== 1 ? `${sec} secs ` : ''
  }
  return res
}
