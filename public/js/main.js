const origin = window.location.origin
const reset = {}
// create page
const createBtns = document.querySelector('.create-btn')
const createInput = document.querySelectorAll('.create-input')
// edit page
const editBtns = document.querySelector('.edit-btn')
const editInput = document.querySelectorAll('.edit-input')

init()

function init() {
  createPage()
  editPage()
}

function createPage() {
  if (createBtns !== null) {
    createBtns.addEventListener('click', (event) => {
      const target = event.target
      if (target.classList.contains('return-btn')) {
        event.preventDefault()
        window.location.href = `${origin}/restaurants`
      } else if (target.classList.contains('reset-btn')) {
        event.preventDefault()
        createInput.forEach((e) => (e.value = ''))
      }
    })
  }
}

function editPage() {
  if (editBtns !== null) {
    value('origin')
    editBtns.addEventListener('click', (event) => {
      const target = event.target
      if (target.classList.contains('return-btn')) {
        event.preventDefault()
        const pathname = window.location.pathname
        const newPath = pathname.replace('/edit', '')
        window.location.href = `${origin}${newPath}`
      } else if (target.classList.contains('reset-btn')) {
        event.preventDefault()
        value('current')
      }
    })
  }
}

function value(type) {
  editInput.forEach((e) => {
    const key = e.getAttribute('name')
    if (type === 'origin') {
      reset[key] = e.value
    } else if (type === 'current') {
      e.value = reset[key]
    }
  })
}
