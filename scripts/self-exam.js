'use strict'

/* global testease, MouseEvent */

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function selfExam () { /* eslint-disable-line no-unused-vars */
  const { describe, it, reporter } = testease()

  describe('Test Framework.')

  it('Can handle success cases', function () {
    return true
  })

  it.fails('Can handle failure cases', function () {
    return false
  })

  await it.fails('Can handle error cases', async function () {
    throw new Error('Hello, error!')
  })

  await it('Can use async/await', async function () {
    await sleep(0)

    return true
  })

  await it.fails('Can timeout tests', async function () {
    await sleep(1)

    return false
  }, 0)

  describe('SC Assistant.')

  const clickEvent = new MouseEvent('click')
  const rightClickEvent = new MouseEvent('contextmenu')

  // Ensure the UI is in a default state, as if the app had just started.
  if (document.getElementById('cb_container').style.display === 'none') {
    document.getElementById('modeBtn').dispatchEvent(clickEvent)
  }

  document.getElementById('auto').dispatchEvent(clickEvent)
  document.getElementById('hamburger').classList.remove('active')
  document.getElementById('controls').classList.remove('responsive')

  it('Shows settings', function showSettings () {
    const s = document.getElementById('settingsBtn')

    s.dispatchEvent(clickEvent)

    return s.style.display !== 'none'
  })

  it('Shows help', function showHelp () {
    const h = document.getElementById('helpBtn')

    h.dispatchEvent(clickEvent)

    return h.style.display !== 'none'
  })

  it('Shows about', function showAbout () {
    const a = document.getElementById('aboutBtn')

    a.dispatchEvent(clickEvent)

    return a.style.display !== 'none'
  })

  it('Resets board and makes a first guess', function initTest () {
    document.getElementById('auto').dispatchEvent(clickEvent)

    return typeof document.querySelectorAll('.row')[0] !== 'undefined'
  })

  const row = Array.from(document.querySelectorAll('.row')).slice(-1)[0]
  const score = Array.from(row.querySelectorAll('.scoreboard')).slice(-1)[0]

  it('Increases score on click', function incScores () {
    for (let i = 0; i < 4; i++) {
      score.children[0].dispatchEvent(clickEvent)
      score.children[1].dispatchEvent(clickEvent)
    }

    return parseInt(score.children[0].innerText) === 4
  })

  it('Score wraps from 4 to 0', function loopsAroundMax () {
    score.children[0].dispatchEvent(clickEvent)

    return parseInt(score.children[0].innerText) === 0
  })

  it('Decreases score on "contextmenu" (right click)', function decScores () {
    for (let j = 0; j < 4; j++) {
      score.children[1].dispatchEvent(rightClickEvent)
    }

    return parseInt(score.children[1].innerText) === 0
  })

  it('Score wraps from 0 to 4', function loopsAroundMin () {
    score.children[1].dispatchEvent(rightClickEvent)

    return parseInt(score.children[1].innerText) === 4
  })

  const next = document.getElementById('next')

  it('Hides next after success', function hidesNextOnSuccess () {
    score.children[0].dispatchEvent(rightClickEvent)
    score.children[1].dispatchEvent(clickEvent)
    next.dispatchEvent(clickEvent)

    document.getElementById('auto').innerText = 'Start'
    document.getElementById('cb_container').innerHTML = ''

    return next.style.display === 'none'
  })

  it('Switches to CoC mode', function switchMode () {
    const m = document.getElementById('modeBtn')

    m.dispatchEvent(clickEvent)

    return document.getElementById('coc_container').style.display !== 'none'
  })

  it('Can select tiles in CoC mode', function selectFromCoC () {
    const n = document.getElementById('node13')

    n.dispatchEvent(clickEvent)

    return n.classList.contains('hit')
  })

  it('Can reset CoC board', function resetCoCBoard () {
    const r = document.getElementById('reset')

    r.dispatchEvent(clickEvent)

    return document.getElementById('node13').classList.contains('hit') === false
  })

  document.getElementById('modeBtn').dispatchEvent(clickEvent)
  document.getElementById('hamburger').dispatchEvent(clickEvent)
  document.getElementById('settingsBtn').dispatchEvent(clickEvent)

  const resultOutput = document.getElementById('testResults')
  resultOutput.innerText = reporter()

  resultOutput.scrollTop = resultOutput.scrollHeight
}
