'use strict'

/* global preGeneratedPossibilities */

function scoreLClick (ev) {
  const scoreboardElement = ev.currentTarget
  const score = parseInt(scoreboardElement.innerText)

  scoreboardElement.innerText = score + 1 > 4 ? 0 : score + 1
}

function scoreRClick (ev) {
  ev.preventDefault()
  ev.stopPropagation()

  const scoreboardElement = ev.currentTarget
  const score = parseInt(scoreboardElement.innerText)

  scoreboardElement.innerText = score - 1 < 0 ? 4 : score - 1

  return false
}

function addRow () {
  const d = document.createElement('div')
  const s = document.createElement('span')
  const c = document.createElement('div')
  const i = document.createElement('div')

  d.classList.add('row')
  s.classList.add('scoreboard')
  c.classList.add('correct')
  i.classList.add('misplaced')

  c.addEventListener('click', scoreLClick)
  i.addEventListener('click', scoreLClick)

  c.addEventListener('contextmenu', scoreRClick)
  i.addEventListener('contextmenu', scoreRClick)

  c.appendChild(document.createTextNode('0'))
  i.appendChild(document.createTextNode('0'))

  s.appendChild(c)
  s.appendChild(i)
  d.appendChild(s)

  const t = document.getElementById('cb_container')

  t.appendChild(document.createElement('br'))

  t.appendChild(d)
}

function addArrow (dir) {
  const r = Array.from(document.querySelectorAll('.row')).slice(-1)[0]
  const d = document.createElement('div')

  d.classList.add(dir)

  r.appendChild(d)
}

function getRow () {
  const r = Array.from(document.querySelectorAll('.row')).slice(-1)[0]

  return r
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

  document.getElementById('cb_container').appendChild(s)
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

function guessContradictsSomeEvidence (guess, evidences) {
  let evidence

  for (const key in evidences) {
    evidence = evidences[key]
    /*
     * Treat the guess like an answer and the evidence as a guess, and
     * see whether the judgment is the same.
     */

    const judgement = judgeGuess(guess, evidence.guess)

    if ((judgement.correct !== evidence.correct) || (judgement.misplaced !== evidence.misplaced)) {
      // console.log("guess", guess, "contradicts evidence", evidence.guess);

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
  /**
    * Returns an array e.g. ["red", "green", "blue"] or null to indicate
    * that there are no possible guesses left. It randomly selects one of
    * the guesses from the provided `gameState` parameter, and removes
    * that guess from the list of possible guesses. This function may also
    * "shuffle" or reorder the elements in the possible guesses list for
    * efficiency reasons.
    */

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

    throw new Error('Fatal Error. Preventing script from continuing without possibilities array reset.')
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

  let row = getRow()

  row.dataset.guess = theGuess
  row.style.display = 'inline-block'

  theGuess.forEach((alignment) => {
    if (keys.indexOf(alignment) < 0) {
      throw new Error('Runtime error: Expected one of up, down, left, or right, but found ' + alignment)
    }

    addArrow(shortToLong[alignment])
  })

  row = getRow()
  row.dataset.evidence = JSON.stringify({
    guess: theGuess
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
        correctElement.removeEventListener('click', scoreLClick)
        correctElement.removeEventListener('contextmenu', scoreRClick)
      }

      if (typeof misplacedElement !== 'undefined') {
        misplacedElement.removeEventListener('click', scoreLClick)
        misplacedElement.removeEventListener('contextmenu', scoreRClick)
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

    const e = JSON.parse(getRow().dataset.evidence)

    e.correct = correctScore
    e.misplaced = misplacedScore

    getRow().dataset.evidence = JSON.stringify(e)
  }

  return false
}

function makeNextGuess () {
  document.getElementById('auto').innerText = 'Reset'

  const evidence = []

  document.getElementById('cb_container').style.display = ''
  document.getElementById('about').style.display = 'none'
  document.getElementById('help').style.display = 'none'
  document.getElementById('settings').style.display = 'none'

  Array.from(document.getElementsByClassName('status'))
    .forEach((s) => s.remove())

  if (checkState()) {
    return
  }

  const rows = Array.from(document.getElementById('cb_container').querySelectorAll('.row'))

  for (const r of rows) {
    if (typeof r.dataset.evidence !== 'undefined') {
      evidence.push(JSON.parse(r.dataset.evidence))
    }
  }

  const next = generateAGuess(evidence)

  addGuess(next)
}

function resetCodebreakerBoard () { // eslint-disable-line no-unused-vars
  const cb = document.getElementById('cb_container')

  cb.style.display = ''
  document.getElementById('about').style.display = 'none'
  document.getElementById('help').style.display = 'none'
  document.getElementById('settings').style.display = 'none'

  // Not great, but better than previous garbage. Lol.
  cb.innerHTML = ''

  document.getElementById('next').style.display = ''

  possibilities = Object.assign([], preGeneratedPossibilities)

  makeNextGuess()
}

let possibilities = []
