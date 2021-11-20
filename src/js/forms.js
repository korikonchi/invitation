// fetch forms disablrr default submit to DB

// function name(params) {}

const sendWishes = document.querySelector('.form-wishes')
const confirm = document.querySelector('.form-dates')
const loader = document.querySelector('.quantum-loader-page')

sendWishes.addEventListener('submit', (e) => {
  e.preventDefault()

  console.log(e)
})

confirm.addEventListener('submit', async (e) => {
  const inputs = e.target.elements
  e.preventDefault()

  const body = {
    name: inputs['name'].value,
    email: inputs['email'].value,
    number: parseInt(inputs['number'].value),
    family: inputs['family'].value,
  }

  console.log(JSON.stringify(body))

  try {
    loader.classList.toggle('hidden')
    const res = await fetch('http://localhost:4321/dev/confirm-invite', {
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
    loader.classList.toggle('hidden')
  } catch (error) {
    console.log(error)
  }
})
