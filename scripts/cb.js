'use strict'

function bumpScore (what, how) {
  let score = parseInt(what.innerText)

  if (typeof how === 'undefined' && score === 4) {
    score = 0
  } else if (how === 'minus') {
    score--

    if(score < 0) {
      score = 4
    }
  } else {
    score++
  }

  what.innerText = score
}

function scoreLClick (ev) {
  bumpScore(ev.currentTarget)
}

function scoreRClick (ev) {
  ev.preventDefault()
  bumpScore(ev.currentTarget, 'minus')
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

function getScoreboard () {
  const s = Array.from(document.querySelectorAll('.scoreboard')).slice(-1)[0]
  const correct = s.children[0]
  const misplaced = s.children[1]

  return {
    correct,
    misplaced
  }
}

function showStatus (message, type = 'success') {
  const s = document.createElement('div')

  s.classList.add('status', type)

  s.appendChild(document.createTextNode(message))

  document.getElementById('cb_container').appendChild(s)
}

function generatePossibilities (num, alignments) {
  if (num === 1) {
    return alignments.slice(0)
  }

  const suffixes = generatePossibilities(num - 1, alignments)
  const ret = []

  alignments.forEach((a) => {
    suffixes.forEach((s) => {
      ret.push([a].concat(s))
    })
  })

    return ret
  }

function judgeGuess(answer, guess) {
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
  for (let key in evidences) {
    let evidence = evidences[key]
    /*
     * Treat the guess like an answer and the evidence as a guess, and
     * see whether the judgment is the same.
     */

    let judgement = judgeGuess(guess, evidence.guess)

    if ((judgement.correct !== evidence.correct) || (judgement.misplaced !== evidence.misplaced)) {
      //console.log("guess", guess, "contradicts evidence", evidence.guess);

      return true
    }
  }

  return false
}

function quickRemoveFromArray (index, array) {
 /**
  * Removes and returns the element at the provided index from an array.
  * This function may shuffle/reorder the elements of the array for
  * efficiency reasons. For example, if you request to remove the first
  * element of the array, rather than reindexing every element in the
  * array (O(N)), this function may choose to swap the first and last
  * element of the array, and then remove the last element from the
  * array (O(1)).
  */
  const arrayLength = array.length

  if (index >= arrayLength || index < 0) {
    throw new Error("Tried to access index " + index + " from array of length " + arrayLength)
  }

  if (arrayLength === 1) {
    return array.pop()
  }

  const retVal = array[index]
  const lastElement = array.pop()
  array[index] = lastElement

  return retVal
}

function generateGuess (evidence) {
 /**
  * Returns an array e.g. ["red", "green", "blue"] or null to indicate
  * that there are no possible guesses left. It randomly selects one of
  * the guesses from the provided `gameState` parameter, and removes
  * that guess from the list of possible guesses. This function may also
  * "shuffle" or reorder the elements in the possible guesses list for
  * efficiency reasons.
  */

  let guessIndex = Math.floor(Math.random() * possibilities.length)
  let guess = quickRemoveFromArray(guessIndex, possibilities)

  while (guessContradictsSomeEvidence(guess, evidence)) {
    if (possibilities.length < 1) {
      return null
    }

    guessIndex = Math.floor(Math.random() * possibilities.length)

    guess = quickRemoveFromArray(guessIndex, possibilities)
  }

  if (typeof guess !== 'object' || guess.constructor.name !== 'Array') {
    throw new Error("Expected guess to be an array, but it was a(n) " + (typeof guess))
  }

  return guess
}

function addGuess (guess, correct, misplaced) {
  const shortToLong = {
    u: 'up',
    d: 'down',
    l: 'left',
    r: 'right'
  }

  const keys = Object.keys(shortToLong)

  guess.forEach((alignment) => {
    if (keys.indexOf(alignment) < 0) {
      throw new Error('Expected one of up, down, left, or right, but found ' + alignment)
    }

    addArrow(shortToLong[alignment])
  })

  const row = getRow()
  row.dataset.evidence = JSON.stringify({
    guess
  })
}

function nextGuess () {
  document.getElementById('auto').innerText = 'Reset'

  const c = Array.from(document.querySelectorAll('.correct')).slice(-1)[0]
  const i = Array.from(document.querySelectorAll('.misplaced')).slice(-1)[0]

  if (typeof c !== 'undefined') {
    c.removeEventListener('click', scoreLClick)
    c.removeEventListener('contextmenu', scoreRClick)
  }

  if (typeof i !== 'undefined') {
    i.removeEventListener('click', scoreLClick)
    i.removeEventListener('contextmenu', scoreRClick)
  }

  const evidence = []

  document.getElementById('cb_container').style.display = ''
  document.getElementById('about').style.display = 'none'
  document.getElementById('help').style.display = 'none'
  document.getElementById('settings').style.display = 'none'

  Array.from(document.getElementsByClassName('status'))
    .forEach((s) => s.remove())

  const lastRow = getRow()

  if (typeof lastRow !== 'undefined' && lastRow.style.display !== 'none') {
    const sb = getScoreboard()
    const correct = parseInt(sb.correct.innerText)
    const misplaced = parseInt(sb.misplaced.innerText)

    if (correct + misplaced > 4) {
      showStatus('The sum of Correct and Misplaced must be less than 4.', 'warning')

      return
    }

    if (correct === 4) {
      showStatus('Success! Try again.', 'success')

      document.getElementById('next').style.display = 'none'

      return
    }

    const e = JSON.parse(getRow().dataset.evidence)

    e['correct'] = correct
    e['misplaced'] = misplaced

    getRow().dataset.evidence = JSON.stringify(e)
  }

  const rows = Array.from(document.getElementById('cb_container').querySelectorAll('.row'))
  
  for(let r of rows) {
    if (typeof r.dataset.evidence !== 'undefined') {
      evidence.push(JSON.parse(r.dataset.evidence))
    }
  }

  const next = generateGuess(evidence)

  if (next === null) {
    document.getElementById('next').style.display = 'none'

    showStatus('Ran out of possibilities to guess. There may be a mistake in the data you entered.', 'failure')
  } else {
    addRow()

    const row = getRow()

    row.dataset.guess = next
    row.style.display = 'inline-block'

    addGuess(next)
  }
}

function resetCB () {
  const rows = Array.from(document.querySelectorAll('.row'))
  const cb = document.getElementById('cb_container')

  cb.style.display = ''
  document.getElementById('about').style.display = 'none'
  document.getElementById('help').style.display = 'none'
  document.getElementById('settings').style.display = 'none'

  // Not great, but better than previous garbage. Lol.
  cb.innerHTML = ''
  
  document.getElementById('next').style.display = ''

  possibilities = generatePossibilities(4, ['u', 'd', 'l', 'r'])

  nextGuess()
}

let possibilities = []
