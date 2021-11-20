const dayMs = 1000 * 60 * 60 * 24
const hourMs = 1000 * 60 * 60
const minMs = 1000 * 60

function countDown(date, callback) {
  if (!date) throw new Error('Please provide a target Date')
  // Set the date we're counting down to
  const TARGET_DATE = new Date(date).getTime()

  setInterval(() => {
    // Get today's date and time
    var now = new Date().getTime()

    // Find the distance between now and the count down date
    let distance = TARGET_DATE - now

    callback(
      distance <= 0
        ? {
            d: 0,
            h: 0,
            m: 0,
            s: 0,
          }
        : {
            d: Math.floor(distance / dayMs),
            h: Math.floor((distance % dayMs) / hourMs),
            m: Math.floor((distance % hourMs) / minMs),
            s: Math.floor((distance % minMs) / 1000),
          }
    )
  }, 1000)
}

function UpdateCountDown(targetDate) {
  const container = document.querySelector('.timer')
  const children = container.children
  const days = children[0].querySelector('.timer-time')
  const hours = children[1].querySelector('.timer-time')
  const mins = children[2].querySelector('.timer-time')
  const secs = children[3].querySelector('.timer-time')

  countDown(targetDate, ({ d, h, m, s }) => {
    days.innerText = d
    hours.innerText = h
    mins.innerText = m
    secs.innerText = s
  })
}

export default UpdateCountDown
