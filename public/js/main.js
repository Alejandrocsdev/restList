const origin = window.location.origin
const reset = {}
// sort
const select = document.querySelector('.sort')
// create page
const createBtns = document.querySelector('.create-btn')
const createInput = document.querySelectorAll('.create-input')
// edit page
const editBtns = document.querySelector('.edit-btn')
const editInput = document.querySelectorAll('.edit-input')

init()

function init() {
  select.addEventListener('change', sort)
  createPage()
  editPage()
}

function sort(event) {
  const restaurants = Array.from(document.querySelectorAll('.restaurants-container > a'))

  const value = this.value

  restaurants.sort((a, b) => {
    const nameA = a.querySelector('.restaurant-name').innerText
    const nameB = b.querySelector('.restaurant-name').innerText
    const rateA = Number(a.querySelector('.restaurant-rating').innerText)
    const rateB = Number(b.querySelector('.restaurant-rating').innerText)
    const idA = Number(a['href'].split('/').slice(-1))
    const idB = Number(b['href'].split('/').slice(-1))

    if (value === 'name-ascend') {
      return nameA.localeCompare(nameB)
    } else if (value === 'name-descend') {
      return nameB.localeCompare(nameA)
    } else if (value === 'rate-ascend') {
      return rateA - rateB
    } else if (value === 'rate-descend') {
      return rateB - rateA
    } else if (value === 'default') {
      return idA - idB
    }
  })

  const container = document.querySelector('.restaurants-container')
  container.innerHTML = ''
  restaurants.forEach((restaurant) => {
    container.appendChild(restaurant)
  })
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
