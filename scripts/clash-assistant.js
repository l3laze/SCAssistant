'use strict'

document.addEventListener('DOMContentLoaded', function initClashBoard () {
  for (let i = 0; i < 25; i++) {
    const node = document.getElementById('node-' + i)

    node.addEventListener('click', function toggleHit (event) {
      const n = document.getElementById(event.target.id)

      if (n.classList.contains('hit')) {
        n.classList.remove('hit')
      } else {
        n.classList.add('hit')
      }
    })
  }
})

function resetClashBoard () { /* eslint-disable-line no-unused-vars */
  let node

  for (let i = 0; i < 25; i++) {
    node = document.getElementById('node-' + i)
    node.classList.remove('hit')
  }
}
