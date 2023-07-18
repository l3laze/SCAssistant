const clashAssistant = (function () { /* eslint-disable-line no-unused-vars */
  'use strict'

  document.getElementById('coc-container').addEventListener('click', function clickClash (event) { /* eslint-disable-line no-unused-vars */
    if (/node-\d{1,2}/.test(event.target.id)) {
      event.target.classList.toggle('hit')
    }
  })

  function resetClashBoard () { /* eslint-disable-line no-unused-vars */
    for (let i = 0; i < 25; i++) {
      document.getElementById('node-' + i).classList.remove('hit')
    }
  }

  return {
    resetClashBoard
  }
})()
