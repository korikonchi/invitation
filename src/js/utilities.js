// Container of all
export const DOM = {
  formWishes: document.querySelector('.form-wishes'),
  formConfirm: document.querySelector('.form-dates'),
  loader: document.querySelector('.quantum-loader-page'),
  counter: document.querySelector('.counter'),
  inputNumber: document.querySelector('.input-number-controller'),
}

/**
 * Promise that delays execution by a determined amount of time in milliseconds
 *
 * @param {Number} delay in milliseconds
 * @returns
 */
export function setDelay(delay) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), delay)
  })
}

/**
 * HOF to display the distance from  today's date to target date
 * in days, hours minutes and seconds.
 *
 * @param {Date | String} targetDate
 * @param {Function} callback
 */
export function countDown(targetDate, callback) {
  const dayMs = 1000 * 60 * 60 * 24
  const hourMs = 1000 * 60 * 60
  const minMs = 1000 * 60
  if (!targetDate) throw new Error('Please provide a target Date')
  // Set the date we're counting down to
  const TARGET_DATE = new Date(targetDate).getTime()

  setInterval(() => {
    // Get today's date and time
    const now = new Date().getTime()
    // Find the distance between now and the count down date
    const distance = TARGET_DATE - now

    callback({
      d: Math.max(Math.floor(distance / dayMs), 0),
      h: Math.max(Math.floor((distance % dayMs) / hourMs), 0),
      m: Math.max(Math.floor((distance % hourMs) / minMs), 0),
      s: Math.max(Math.floor((distance % minMs) / 1000), 0),
    })
  }, 1000)
}

/**
 * Handle FormSubmits
 * @param {Object} e submit event
 */
export async function handleFormSubmit(e) {
  e.preventDefault()
  const path = e.target.getAttribute('data-path')
  const inputs = e.target.elements
  const body = {}

  for (let i = 0; i < inputs.length; i++) {
    const el = inputs[i]
    if (el.name) {
      if (el.type !== 'radio' || el.checked) {
        body[el.name] = el.value
      }
    }
  }
  try {
    DOM.loader.classList.add('hidden')
    const res = await fetchAPI(`${process.env.ROOT_API}/${path}`, {
      body: JSON.stringify(body),
    })

    if (res.error) throw new Error(res.status)
    console.log(res)
  } catch (error) {
    console.log(error)
  } finally {
    await setDelay(2000)
    for (let i = 0; i < inputs.length; i++) {
      const el = inputs[i]
      if (/^(text|email)/.test(el.type)) el.value = ''
      if (/^number$/.test(el.type)) el.value = '1'
    }
    DOM.loader.classList.remove('hidden')
  }
}

/**
 * Custom wrapper for the fetch function
 *
 * @param param - FetchAPIProps
 * @returns Promise or object
 */
async function fetchAPI({ api, options = { headers: {}, body: {} } }) {
  const ops = {
    ...options,
    redirect: 'follow',
    method: options.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  }
  try {
    if (method !== 'GET' && method !== 'HEAD')
      ops.body = JSON.stringify(options.body)
    const response = await fetch(api, ops)
    let payload = null
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.indexOf('application/json') >= 0) {
      payload = await response.json()
    } else {
      payload = await response.text()
    }
    if (response.status >= 200 && response.status <= 299) {
      return payload
    } else {
      return { error: response.status, payload }
    }
  } catch (error) {
    return { error: error.message }
  }
}
