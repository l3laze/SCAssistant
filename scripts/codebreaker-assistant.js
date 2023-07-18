/* global preGeneratedPossibilities */

const cbAssistant = (function CbAssistant () { /* eslint-disable-line no-unused-vars */
  'use strict'

  function handleScoreClick (event) {
    event.preventDefault()
    event.stopPropagation()

    const scoreboardElement = event.currentTarget

    const score = parseInt(scoreboardElement.innerText)

    if (event.button === 0) {
      scoreboardElement.innerText = score + 1 > 4 ? 0 : score + 1
    } else if (event.button === 2) {
      scoreboardElement.innerText = score - 1 < 0 ? 4 : score - 1
    }
  }

  function addRow () {
    const t = document.getElementById('cb-container')
    const d = document.createElement('div')
    const s = document.createElement('span')
    const c = document.createElement('div')
    const i = document.createElement('div')

    d.classList.add('row')
    s.classList.add('scoreboard')
    c.classList.add('correct')
    i.classList.add('misplaced')

    c.addEventListener('click', handleScoreClick)
    i.addEventListener('click', handleScoreClick)

    c.addEventListener('contextmenu', handleScoreClick)
    i.addEventListener('contextmenu', handleScoreClick)

    c.appendChild(document.createTextNode('0'))
    i.appendChild(document.createTextNode('0'))

    s.appendChild(c)
    s.appendChild(i)
    d.appendChild(s)

    t.appendChild(document.createElement('br'))

    t.appendChild(d)

    d.style.display = 'inline-block'
  }

  function getRow () {
    const r = Array.from(document.querySelectorAll('.row')).slice(-1)[0]

    return r
  }

  function addArrow (dir) {
    const r = getRow()
    const d = document.createElement('div')

    d.classList.add(dir)

    r.appendChild(d)
  }

  function getScoreboardElements () {
    const correctElement = Array.from(document.querySelectorAll('.correct')).slice(-1)[0]
    const misplacedElement = Array.from(document.querySelectorAll('.misplaced')).slice(-1)[0]

    return [
      correctElement,
      misplacedElement
    ]
  }

  function showStatus (message, type = 'success') {
    const s = document.createElement('div')

    s.classList.add('status', type)

    s.appendChild(document.createTextNode(message))

    document.getElementById('cb-container').appendChild(s)
  }

  function judgeGuess (answer, guess) {
    /**
      * @param answer e.g. ["red", "green", "blue", "blue"]
      * @param guess e.g. ["blue, green", "yellow", "red"]
      * return e.g. { bothCorrect: 1, colorCorrect: 2 }
      */
    const retVal = {
      correct: 0,
      misplaced: 0
    }
    const unaccountedForAnswers = []
    const unaccountedForGuesses = []

    for (let i = 0; i < answer.length; i++) {
      const a = answer[i]
      const g = guess[i]

      if (a === g) {
        retVal.correct++
      } else {
        unaccountedForAnswers.push(answer[i])
        unaccountedForGuesses.push(guess[i])
      }
    }

    unaccountedForAnswers.forEach((a) => {
      const guessIndex = unaccountedForGuesses.indexOf(a)

      if (guessIndex !== -1) {
        retVal.misplaced++
        unaccountedForGuesses.splice(guessIndex, 1)
      }
    })

    return retVal
  }

  /*
   * Treat the guess like an answer and the evidence as a guess, and
   * see whether the judgment is the same.
   */
  function guessContradictsSomeEvidence (guess, evidences) {
    let evidence

    for (const key in evidences) {
      evidence = evidences[key]

      const judgement = judgeGuess(guess, evidence.guess)

      if ((judgement.correct !== evidence.correct) || (judgement.misplaced !== evidence.misplaced)) {
        return true
      }
    }

    return false
  }

  function getRandomGuess () {
    if (possibilities.length < 1) {
      throw new Error('No more possibilities. There was likely a mistake in the data you entered.')
    }

    const randomIndex = Math.floor(Math.random() * possibilities.length)

    return possibilities.splice(randomIndex, 1)[0]
  }

  function generateAGuess (previousEvidence) {
    let randomGuess

    try {
      randomGuess = getRandomGuess()

      while (guessContradictsSomeEvidence(randomGuess, previousEvidence)) {
        randomGuess = getRandomGuess()
      }

      if (typeof randomGuess !== 'object' || randomGuess.constructor.name !== 'Array') {
        throw new Error(`Runtime error: Expected guess to be an array, but it was a(n) ${typeof randomGuess}`)
      }
    } catch (error) {
      showStatus(error.message, 'failure')

      document.getElementById('next').style.display = 'none'

      return
    }

    return randomGuess
  }

  function addGuess (theGuess) {
    const shortToLong = {
      u: 'up',
      d: 'down',
      l: 'left',
      r: 'right'
    }

    const keys = Object.keys(shortToLong)

    addRow()

    theGuess.forEach((alignment) => {
      if (keys.indexOf(alignment) < 0) {
        throw new Error('Runtime error: Expected one of up, down, left, or right, but found ' + alignment)
      }

      addArrow(shortToLong[alignment])
    })
  }

  function checkState () {
    const lastRow = getRow()

    if (typeof lastRow !== 'undefined') {
      const [correctElement, misplacedElement] = getScoreboardElements()
      const correctScore = parseInt(correctElement.innerText)
      const misplacedScore = parseInt(misplacedElement.innerText)

      if ((correctScore + misplacedScore) <= 4 && (correctScore + misplacedScore) >= 0) {
        if (typeof correctElement !== 'undefined') {
          correctElement.removeEventListener('click', handleScoreClick)
          correctElement.removeEventListener('contextmenu', handleScoreClick)
          correctElement.addEventListener('contextmenu', function (event) {
            event.preventDefault()

            return true
          })
        }

        if (typeof misplacedElement !== 'undefined') {
          misplacedElement.removeEventListener('click', handleScoreClick)
          misplacedElement.removeEventListener('contextmenu', handleScoreClick)
          misplacedElement.addEventListener('contextmenu', function (event) {
            event.preventDefault()

            return true
          })
        }
      }

      if (correctScore + misplacedScore > 4) {
        showStatus('The sum of Correct and Misplaced must be less than 4.', 'warning')

        return true
      } else if (correctScore === 4) {
        showStatus('Success! Try again.', 'success')

        document.getElementById('next').style.display = 'none'

        return true
      }

      const e = listOfEvidence[listOfEvidence.length - 1]

      e.correct = correctScore
      e.misplaced = misplacedScore
    }

    return false
  }

  function makeNextGuess () {
    document.getElementById('auto').innerText = 'Reset'
    document.getElementById('cb-container').style.display = ''
    document.getElementById('about').style.display = 'none'
    document.getElementById('help').style.display = 'none'
    document.getElementById('settings').style.display = 'none'

    Array.from(document.getElementsByClassName('status'))
      .forEach((s) => s.remove())

    if (checkState()) {
      return
    }

    const next = generateAGuess(listOfEvidence)

    if (!Array.isArray(next)) {
      return
    }

    addGuess(next)

    listOfEvidence.push({
      guess: next
    })

    return next
  }

  function resetCodebreakerBoard () {
    const cb = document.getElementById('cb-container')

    cb.style.display = ''
    document.getElementById('about').style.display = 'none'
    document.getElementById('help').style.display = 'none'
    document.getElementById('settings').style.display = 'none'

    // Not great, but better than previous garbage. Lol.
    Array.from(cb.children).forEach((row) => row.remove())

    document.getElementById('next').style.display = ''

    possibilities = Object.assign([], preGeneratedPossibilities)
    listOfEvidence = []

    return makeNextGuess()
  }

  let possibilities = []
  let listOfEvidence = []

  return {
    resetCodebreakerBoard,
    makeNextGuess,
    getRow,
    getScoreboardElements,
    judgeGuess
  }
})()
