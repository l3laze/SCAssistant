'use strict'

/* global cbAssistant, preGeneratedPossibilities, testease, MouseEvent */

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function selfExam () { /* eslint-disable-line no-unused-vars */
  const { describe, it, reporter } = testease()

  describe('Testease Framework')

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

  const resultOutput = document.getElementById('test-results')
  resultOutput.innerText = reporter()

  resultOutput.scrollTop = resultOutput.scrollHeight
}

async function testApp () { /* eslint-disable-line no-unused-vars */
  const { describe, it, reporter } = testease()

  describe('SC Assistant')

  const clickEvent = new MouseEvent('click')
  const rightClickEvent = new MouseEvent('contextmenu')

  // Ensure the UI is in a default state, as if the app had just started.
  document.getElementById('overlay-container').dispatchEvent(clickEvent)

  if (document.getElementById('cb-container').style.display === 'none') {
    document.getElementById('mode-button').dispatchEvent(clickEvent)
  }

  document.getElementById('auto').dispatchEvent(clickEvent)
  document.getElementById('hamburger').classList.remove('active')
  document.getElementById('controls').classList.remove('responsive')

  it('Shows settings', function showSettings () {
    const s = document.getElementById('settings-button')

    s.dispatchEvent(clickEvent)

    return s.style.display !== 'none'
  })

  it('Shows help', function showHelp () {
    const h = document.getElementById('help-button')

    h.dispatchEvent(clickEvent)

    return h.style.display !== 'none'
  })

  it('Shows about', function showAbout () {
    const a = document.getElementById('about-button')

    a.dispatchEvent(clickEvent)

    return a.style.display !== 'none'
  })

  it('Resets board and makes a first guess', function initTest () {
    document.getElementById('auto').dispatchEvent(clickEvent)

    return typeof document.querySelectorAll('.row')[0] !== 'undefined'
  })

  const row = document.querySelectorAll('.row')[0]
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
    document.getElementById('cb-container').innerHTML = ''

    return next.style.display === 'none'
  })

  it('Switches to CoC mode', function switchMode () {
    const m = document.getElementById('mode-button')

    m.dispatchEvent(clickEvent)

    return document.getElementById('coc-container').style.display !== 'none'
  })

  it('Can select tiles in CoC mode', function selectFromCoC () {
    const n = document.getElementById('node-13')

    n.dispatchEvent(clickEvent)

    return n.classList.contains('hit')
  })

  it('Can reset CoC board', function resetCoCBoard () {
    const r = document.getElementById('reset')

    r.dispatchEvent(clickEvent)

    return document.getElementById('node-13').classList.contains('hit') === false
  })

  document.getElementById('auto').dispatchEvent(clickEvent)
  document.getElementById('mode-button').dispatchEvent(clickEvent)
  document.getElementById('hamburger').dispatchEvent(clickEvent)
  document.getElementById('settings-button').dispatchEvent(clickEvent)

  const resultOutput = document.getElementById('test-results')
  resultOutput.innerText = reporter()

  resultOutput.scrollTop = resultOutput.scrollHeight
}

async function testSolving () { /* eslint-disable-line no-unused-vars */
  const { it, reporter } = testease()

  const clickEvent = new MouseEvent('click')
  const guessesEach = []

  await it(`Can solve all ${preGeneratedPossibilities.length} possibilities`, async function tryHard () {
    const allOfThePossibilities = Object.assign([], preGeneratedPossibilities)

    let numberOfGuesses = 0
    let usedGuesses = []
    let latestGuess = []
    let latestScore = {}
    let latestRow
    let scoreBoard

    for (let i = 0; i < allOfThePossibilities.length; i++) {
      cbAssistant.resetCodebreakerBoard()

      numberOfGuesses = 0

      do {
        numberOfGuesses++
        latestRow = cbAssistant.getRow()
        latestGuess = JSON.parse(latestRow.dataset.evidence).guess
        latestScore = cbAssistant.judgeGuess(allOfThePossibilities[i], latestGuess)

        usedGuesses.push(latestGuess.join(''))

        scoreBoard = latestRow.querySelector('.scoreboard')

        for (let j = 0; j < latestScore.correct; j++) {
          scoreBoard.children[0].dispatchEvent(clickEvent)
        }

        for (let k = 0; k < latestScore.misplaced; k++) {
          scoreBoard.children[1].dispatchEvent(clickEvent)
        }

        cbAssistant.makeNextGuess()

        if (latestScore.correct === 4) {
          guessesEach.push(numberOfGuesses)

          console.log(`Solved ${JSON.stringify(allOfThePossibilities[i])} in ${numberOfGuesses} attempts (${usedGuesses})`)
        }
      } while (latestScore.correct !== 4)

      usedGuesses = []
    }
  })

  document.getElementById('settings-button').dispatchEvent(clickEvent)
  document.getElementById('hamburger').dispatchEvent(clickEvent)

  const resultOutput = document.getElementById('test-results')

  const sortedGuessesEach = guessesEach.sort((a, b) => a > b)

  const message = reporter().split('\n')

  message.splice(1, 0, `\nMin. Guesses = ${sortedGuessesEach[0]}\nMax. Guesses = ${sortedGuessesEach.slice(-1)}`)

  resultOutput.innerText = message.join('\n')
  resultOutput.scrollTop = resultOutput.scrollHeight
}
