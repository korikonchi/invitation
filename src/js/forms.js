const sendWishes = document.querySelector('.form-wishes')
const confirm = document.querySelector('.form-dates')
export const loader = document.querySelector('.quantum-loader-page')

const rootAPI = 'http://api.isrra-y-jess.com/prod'

sendWishes.addEventListener('submit', handleForm)
confirm.addEventListener('submit', handleForm)

async function handleForm(e) {
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
    loader.classList.add('hidden')
    const res = await fetch(`${rootAPI}/${path}`, {
      body: JSON.stringify(body),
      method: 'POST',
    })

    if (res.status >= 200 && res.status <= 299) {
      const body = await res.json()
      console.log(body)
    } else {
      console.log(res.status)
      throw new Error(res.status)
    }
  } catch (error) {
    console.log(error)
  } finally {
    await setDelay(2000)
    for (let i = 0; i < inputs.length; i++) {
      const el = inputs[i]
      if (/^(text|email)/.test(el.type)) el.value = ''
      if (/^number$/.test(el.type)) el.value = '1'
    }
    loader.classList.remove('hidden')
  }
}

function setDelay(delay) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), delay)
  })
}
