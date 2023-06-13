'use strict'

document.addEventListener('DOMContentLoaded', function initCoC () {
  let node

  for (let i = 0; i < 25; i++) {
    node = document.getElementById('node' + i)
    node.addEventListener('click', function (event) {
      const n = document.getElementById(event.target.id)

      if(n.classList.contains('hit')) {
        n.classList.remove('hit')
      } else {
        n.classList.add('hit')
      }
    })
  }
})

function resetCoC () {
  let node

  for (let i = 0; i < 25; i++) {
    node = document.getElementById('node' + i)
    node.classList.remove('hit')
  }
}
