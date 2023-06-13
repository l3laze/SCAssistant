'use strict'

document.getElementById('hamburger').addEventListener('click', function () {
  document.getElementById('controls').classList.toggle('responsive')
  document.getElementById('hamburger').classList.toggle('active')
})

document.getElementById('overlay_container').addEventListener('click', function () {
  if (this.style.display !== 'none') {
    this.style.display = 'none'
  }
})

document.getElementById('modal_container').addEventListener('click', function (event) {
  event.preventDefault()
  event.stopPropagation()
  return false
})

document.getElementById('closeModal').addEventListener('click', function () {
  document.getElementById('overlay_container').style.display = 'none'
})

function openModal (which) {
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

  document.getElementById('modal_title_text').innerText = which[0].toUpperCase() + which.slice(1)

  document.getElementById(which).style.display = 'block'

  document.getElementById('overlay_container').style.display = 'block'

  document.getElementById('controls').classList.toggle('responsive')
  document.getElementById('hamburger').classList.toggle('active')
}

function switchMode () {
  const cbc = document.getElementById('cb_container')
  const ccc = document.getElementById('coc_container')

  const modeBtn = document.getElementById('modeBtn')
  const mode = modeBtn.innerText.split(' ')[1]

  document.getElementById('controls').classList.remove('responsive')
  document.getElementById('hamburger').classList.remove('active')

  if (mode === 'CB') {
    ccc.style.display = 'block'
    cbc.style.display = 'none'
    modeBtn.innerText = 'Mode: CoC'

    document.getElementById('auto').style.display = 'none'
    document.getElementById('next').style.display = 'none'
    document.getElementById('reset').style.display = 'block'
  } else {
    ccc.style.display = 'none'
    cbc.style.display = 'block'
    modeBtn.innerText = 'Mode: CB'

    document.getElementById('auto').style.display = ''
    document.getElementById('next').style.display = Array.from(document.querySelectorAll('.row')).length > 0 ? '' : 'none'
    document.getElementById('reset').style.display = 'none'
  }
}
