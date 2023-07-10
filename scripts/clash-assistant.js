const clashAssistant = (function () { /* eslint-disable-line no-unused-vars */
  'use strict'

  document.getElementById('coc-container').addEventListener('click', function clickClash (event) { /* eslint-disable-line no-unused-vars */
    const targetElementId = event.target.id

    if (/node-\d{1,2}/.test(targetElementId)) {
      document.getElementById(targetElementId).classList.toggle('hit')
    }
  })

  function resetClashBoard () { /* eslint-disable-line no-unused-vars */
    let node

    for (let i = 0; i < 25; i++) {
      node = document.getElementById('node-' + i)
      node.classList.remove('hit')
    }
  }

  return {
    resetClashBoard
  }
})()
