import { countDown, DOM, handleFormSubmit } from './utilities'

function setUpForms() {
  DOM.formWishes.addEventListener('submit', handleFormSubmit)
  DOM.formConfirm.addEventListener('submit', handleFormSubmit)
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

function setUpNumberInput(params) {
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

async function fetchStats(params) {
  try {
    const res = await fetchAPI(`${process.env.ROOT_API}/get-invites`)
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}

;(function init() {
  try {
    setUpForms()
    updateCountDown()
    setUpNumberInput()
    fetchStats()

    // remove initial loader
    setTimeout(() => DOM.loader.classList.add('hidden'), 1000)
  } catch (error) {
    // location.reload()
    console.log(error)
  }
})()
