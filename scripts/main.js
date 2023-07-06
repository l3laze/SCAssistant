'use strict'

/* global CBAssistant */

const cbAssistant = CBAssistant() /* eslint-disable-line no-unused-vars */

document.getElementById('hamburger').addEventListener('click', function () {
  document.getElementById('controls').classList.toggle('responsive')
  document.getElementById('hamburger').classList.toggle('active')
})

document.getElementById('overlay-container').addEventListener('click', function () {
  if (this.style.display !== 'none') {
    this.style.display = 'none'
  }
})

document.getElementById('modal-container').addEventListener('click', function (event) {
  event.preventDefault()
  event.stopPropagation()
  return false
})

document.getElementById('close-modal').addEventListener('click', function () {
  document.getElementById('overlay-container').style.display = 'none'
})

window.addEventListener('contextmenu', function (e) {
  // /e.preventDefault()
  // e.stopPropagation()

  return false
})

function openModal (which) { /* eslint-disable-line no-unused-vars */
  const modals = [
    'settings',
    'help',
    'about'
  ]

  modals.forEach((m) => {
    if (m !== which) {
      document.getElementById(m).style.display = 'none'
    }
  })

  document.getElementById('modal-title-text').innerText = which[0].toUpperCase() + which.slice(1)

  document.getElementById(which).style.display = 'block'

  document.getElementById('overlay-container').style.display = 'block'

  document.getElementById('controls').classList.toggle('responsive')
  document.getElementById('hamburger').classList.toggle('active')
}

function switchMode () { /* eslint-disable-line no-unused-vars */
  const cbc = document.getElementById('cb-container')
  const ccc = document.getElementById('coc-container')

  const modeButton = document.getElementById('mode-button')
  const mode = modeButton.innerText.split(' ')[1]

  document.getElementById('controls').classList.remove('responsive')
  document.getElementById('hamburger').classList.remove('active')

  if (mode === 'CB') {
    ccc.style.display = 'block'
    cbc.style.display = 'none'
    modeButton.innerText = 'Mode: CoC'

    document.getElementById('auto').style.display = 'none'
    document.getElementById('next').style.display = 'none'
    document.getElementById('reset').style.display = 'block'
  } else {
    ccc.style.display = 'none'
    cbc.style.display = 'block'
    modeButton.innerText = 'Mode: CB'

    document.getElementById('auto').style.display = ''
    document.getElementById('next').style.display = Array.from(document.querySelectorAll('.row')).length > 0 ? '' : 'none'
    document.getElementById('reset').style.display = 'none'
  }
}
