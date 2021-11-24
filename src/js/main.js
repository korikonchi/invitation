import {
  countDown,
  DOM,
  handleFormSubmit,
  animateCounters,
  fetchAPI,
} from './utilities'

const state = {
  isAnimating: false,
  invites: 200,
  novio: 0,
  novia: 0,
  pendientes: 200,
  offView: true,
}

const counters = DOM.checkList.querySelectorAll('.number-checklist')

function setUpForms() {
  DOM.formWishes.addEventListener('submit', handleFormSubmit)
  DOM.formConfirm.addEventListener('submit', handleFormSubmit)
  DOM.formWishes.querySelector('textarea').value = ''
}

function updateCountDown() {
  const children = DOM.counter.children
  const days = children[0].querySelector('.counter-time')
  const hours = children[1].querySelector('.counter-time')
  const mins = children[2].querySelector('.counter-time')
  const secs = children[3].querySelector('.counter-time')

  countDown(process.env.TARGET_DATE, ({ d, h, m, s }) => {
    days.innerText = `${d}`.padStart(2, '0')
    hours.innerText = `${h}`.padStart(2, '0')
    mins.innerText = `${m}`.padStart(2, '0')
    secs.innerText = `${s}`.padStart(2, '0')
  })
}

function setUpNumberInput() {
  const subtract = DOM.inputNumber.children[0]
  const input = DOM.inputNumber.children[1]
  const add = DOM.inputNumber.children[2]
  const maxValue = 10
  const minValue = 1
  const step = 1

  let number = ''

  subtract.addEventListener('click', handleMath)
  add.addEventListener('click', handleMath)

  function handleMath(e) {
    if (number === '') {
      updateNumber(String(minValue))
    } else {
      let n = Number(number)
      const math = e.currentTarget.getAttribute('data-math')
      if (math === 'plus' && n + step <= maxValue) n = n + step
      if (math === 'minus' && n - step >= minValue) n = n - step

      updateNumber(`${n}`)
    }
  }

  // UpdateDOM
  function updateNumber(n) {
    number = n
    input.value = number
  }
}

async function fetchStats() {
  try {
    const res = await fetchAPI({
      api: `${process.env.ROOT_API}/get-invites`,
      options: {
        method: 'GET',
      },
    })

    state.novia = res.novia
    state.novio = res.novio
    state.pendientes = res.pendientes
  } catch (error) {
    console.log(error)
  }
}

function setInvitesAnimation() {
  document.body.addEventListener('scroll', triggerAnimation, { passive: true })
}

function triggerAnimation() {
  const bounds = DOM.checkList.getBoundingClientRect()
  const triggerHeight = window.innerWidth > 768 ? window.innerHeight / 2 : 0

  if (window.pageYOffset + bounds.top <= triggerHeight) {
    state.offView && !state.isAnimating && animateCounters(state, counters)
    state.offView = false
  } else if (
    !state.isAnimating &&
    window.pageYOffset + bounds.top >= window.innerHeight
  ) {
    state.offView = true
  }
}

;(function init() {
  try {
    fetchStats()
    setUpForms()
    updateCountDown()
    setUpNumberInput()
    setInvitesAnimation()

    setTimeout(() => {
      // Remove initial loader
      DOM.loader.classList.add('hidden')
      triggerAnimation()
    }, 1000)
  } catch (error) {
    console.log(error)
    DOM.loader.classList.add('hidden')
  }
})()
