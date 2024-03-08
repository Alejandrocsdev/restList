const returnBtn = document.querySelector('.return-btn')
const resetBtn = document.querySelector('.reset-btn')
const createInput = document.querySelectorAll('.create-input')

returnBtn.addEventListener('click', (event) => {
  event.preventDefault()
  window.location.href = 'http://localhost:3000/restaurants'
})

resetBtn.addEventListener('click', (event) => {
  event.preventDefault()
    createInput.forEach((e) => {
      e.value = ''
    })
})
