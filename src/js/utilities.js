// Container of all DOM elements
export const state = {
  isAnimating: false,
  offView: true,
  bride: 0,
  groom: 0,
  invites: 200,
  pending: 200,
}

export const DOM = {
  formWishes: document.querySelector('.form-wishes'),
  formConfirm: document.querySelector('.form-dates'),
  loader: document.querySelector('.quantum-loader-page'),
  counter: document.querySelector('.counter'),
  inputNumber: document.querySelector('.input-number-controller'),
  checkList: document.querySelector('.check-list'),
}

const messages = {
  ConditionalCheckFailedException: 'Este email ya esta registrado',
}

const locale = {
  sender: 'Remitente',
  wish: 'Deseo',
  name: 'Nombre',
  family: 'Invitado de',
  number: 'Numero de invitados',
  email: 'Correo electronico',
  bride: 'La Novia',
  groom: 'El Novio',
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
export function handleFormSubmit(e) {
  e.preventDefault()
  const path = e.target.getAttribute('data-path')
  const inputs = e.target.elements
  const body = {}

  // Get all values from inputs
  for (let i = 0; i < inputs.length; i++) {
    const el = inputs[i]
    if (el.name) {
      if (el.type !== 'radio' || el.checked) {
        body[el.name] =
          el.type === 'textarea'
            ? el.value.substr(0, 1000)
            : el.value.substr(0, 40)
      }
    }
  }

  // show modal
  loadModal({
    classList: 'submit',
    title: 'Confirma tus datos',
    body: Object.entries(body).map(([key, value]) => {
      const val =
        value.length > 120 ? value.substr(0, 120).trim() + '...' : value
      return `<span>${locale[key]}</span>: <strong>${
        locale[val] || val
      }</strong><br/>`
    }),
    buttons: [
      { label: 'Editar', cta: 'close' },
      { label: 'Aceptar', cta: 'submit' },
    ],
    onSubmit: async () => {
      await submitToServer(path, body, inputs)
    },
    onClose: () => {
      console.log('Modal Removed')
    },
  })
}

async function submitToServer(path, body, inputs) {
  try {
    DOM.loader.classList.remove('hidden')
    await setDelay(2000)
    const res = await fetchAPI({
      api: `${process.env.ROOT_API}/${path}`,
      options: { body },
    })

    if (res.error) {
      loadModal({
        classList: 'error',
        title: messages[res.error],
        buttons: [{ label: 'Okay', cta: 'close' }],
      })
    } else {
      if (res.Bride) {
        state.invites = res.Invites
        state.bride = res.Bride
        state.groom = res.Groom
        state.pending = res.Pending
      }
      const title =
        path === 'send-wish'
          ? 'Gracias por tus buenos deseos'
          : 'Tu invitación ha sido confirmada'

      loadModal({
        title,
        classList: 'success',
        buttons: [{ label: 'Gracias', cta: 'close' }],
        onClose: () => {
          console.log(res)
        },
      })
    }
  } catch (error) {
    console.log(error)
  } finally {
    for (let i = 0; i < inputs.length; i++) {
      const el = inputs[i]
      if (/^(text|email)/.test(el.type)) el.value = ''
      if (/^number$/.test(el.type)) el.value = '1'
    }
    DOM.loader.classList.add('hidden')
  }
}

/**
 * Custom wrapper for the fetch function
 *
 * @param param - FetchAPIProps
 * @returns Promise or object
 */
export async function fetchAPI({ api, options = { headers: {}, body: {} } }) {
  const ops = {
    ...options,
    redirect: 'follow',
    method: options.method || 'POST',
    headers: {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
    },
  }

  try {
    if (ops.method !== 'GET' && ops.method !== 'HEAD')
      ops.body = JSON.stringify(options.body)
    const response = await fetch(api, ops)
    let payload = null
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.indexOf('application/json') >= 0) {
      payload = await response.json()
    } else {
      payload = await response.text()
    }
    return payload
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Manages each counter's animation
 *
 * @param {Object} application state
 * @param {NodeList} Dom elements to update
 */
export async function animateCounters(state, counters) {
  state.isAnimating = true

  function mathDelay(target, baseL = 200, baseT = 20) {
    const delay = Math.round((baseL * baseT) / target)
    return Math.min(delay, 800)
  }
  animateNumber({
    element: counters[0],
    delay: mathDelay(state.invites),
    targetNumber: state.invites,
    startNumber: 0,
    state,
  })
  animateNumber({
    element: counters[1],
    delay: mathDelay(state.groom),
    targetNumber: state.groom,
    startNumber: 0,
    state,
  })
  animateNumber({
    element: counters[2],
    delay: mathDelay(state.bride),
    targetNumber: state.bride,
    startNumber: 0,
    state,
  })
  animateNumber({
    element: counters[3],
    delay: mathDelay(state.invites - state.pending),
    targetNumber: state.pending,
    startNumber: state.invites,
    state,
  })
}

/**
 * Animate element.innerText with counter from startNumber to targetNumber
 *
 * @param {Object} parameters to run animation
 */
async function animateNumber({
  element,
  delay = 30,
  targetNumber = 0,
  startNumber = 0,
  state,
}) {
  const increase = targetNumber > startNumber
  element.innerText = startNumber

  if (increase) {
    for (let i = startNumber; i <= targetNumber; i++) {
      await setDelay(delay)
      element.innerText = i
    }
  } else {
    for (let i = startNumber; i >= targetNumber; i--) {
      await setDelay(delay)
      element.innerText = i
    }
  }
  state.isAnimating = false
}

function loadModal({
  classList,
  title,
  body = [],
  buttons = [],
  onSubmit = null,
  onClose = null,
}) {
  const container = document.createElement('div')
  container.className = 'modal-container'
  container.innerHTML = `
    <div class="modal-card card ${classList}">
      <h3 class="title">${title}</h3>
      <div class='body'>
      ${body.length ? `<p class=''>${body.join('')}</p>` : ''}</div>
      <div class='controls'>
        ${buttons
          .map((e, i) => {
            return `<button class="btn btn-submit modal-btn ${
              i > 0 && 'margin-left'
            }" type="button" data-cta=${e.cta}> ${e.label}</button>`
          })
          .join('')}
      </div>
    </div>
    <div class="modal-bg"></div>
  `

  container.addEventListener('click', (e) => {
    if (e.target.className === 'modal-bg') {
      handleModalClose()
    } else if (e.target?.type === 'button') {
      const action = e.target.getAttribute('data-cta')
      if (action === 'submit') {
        handleModalClose()
        onSubmit && onSubmit()
      } else if (action === 'close') {
        handleModalClose()
      }
    }
  })

  function handleModalClose() {
    onClose && onClose()
    container.remove()
  }

  document.body.appendChild(container)
}
