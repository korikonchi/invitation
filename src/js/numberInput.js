const container = document.querySelector('.input-number-controller')
const subtract = container.children[0]
const input = container.children[1]
const add = container.children[2]

subtract.addEventListener('click', handleMath)
add.addEventListener('click', handleMath)
input.addEventListener('blur', ({ target }) => {
  console.log(target)
})
input.addEventListener('change', ({ target }) => {
  console.log(target)
})

let number = ''
const minValue = 1,
  maxValue = 10,
  step = 1

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
