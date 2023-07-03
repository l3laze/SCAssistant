'use strict'

// Recursive generator from https://nebupookins.github.io/JS-Mastermind-Solver/
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

function makeFormattedPossibilitiesArray (rowSize) { /* eslint-disable-line no-unused-vars */
  const all = generatePossibilities(4, ['u', 'd', 'l', 'r'])
  let message = ''

  for (let p = 0; p < all.length; p++) {
    message += `${((p > 0 && p % rowSize === 0) ? '\n' : '')}${JSON.stringify(all[p])}`

    // Only add a comma while not at end of array.
    if (p < all.length - 1) {
      message += ','
    }

    // Only add a space while not at end of row (-1 because 0-index).
    if (p % rowSize < rowSize - 1) {
      message += ' '
    }
  }

  return `  [\n${message.replace(/"/g, '\'').replace(/','/g, '\', \'')}\n]`
}

const preGeneratedPossibilities = /* eslint-disable-line no-unused-vars */
  [
    ['u', 'u', 'u', 'u'], ['u', 'u', 'u', 'd'], ['u', 'u', 'u', 'l'], ['u', 'u', 'u', 'r'],
    ['u', 'u', 'd', 'u'], ['u', 'u', 'd', 'd'], ['u', 'u', 'd', 'l'], ['u', 'u', 'd', 'r'],
    ['u', 'u', 'l', 'u'], ['u', 'u', 'l', 'd'], ['u', 'u', 'l', 'l'], ['u', 'u', 'l', 'r'],
    ['u', 'u', 'r', 'u'], ['u', 'u', 'r', 'd'], ['u', 'u', 'r', 'l'], ['u', 'u', 'r', 'r'],
    ['u', 'd', 'u', 'u'], ['u', 'd', 'u', 'd'], ['u', 'd', 'u', 'l'], ['u', 'd', 'u', 'r'],
    ['u', 'd', 'd', 'u'], ['u', 'd', 'd', 'd'], ['u', 'd', 'd', 'l'], ['u', 'd', 'd', 'r'],
    ['u', 'd', 'l', 'u'], ['u', 'd', 'l', 'd'], ['u', 'd', 'l', 'l'], ['u', 'd', 'l', 'r'],
    ['u', 'd', 'r', 'u'], ['u', 'd', 'r', 'd'], ['u', 'd', 'r', 'l'], ['u', 'd', 'r', 'r'],
    ['u', 'l', 'u', 'u'], ['u', 'l', 'u', 'd'], ['u', 'l', 'u', 'l'], ['u', 'l', 'u', 'r'],
    ['u', 'l', 'd', 'u'], ['u', 'l', 'd', 'd'], ['u', 'l', 'd', 'l'], ['u', 'l', 'd', 'r'],
    ['u', 'l', 'l', 'u'], ['u', 'l', 'l', 'd'], ['u', 'l', 'l', 'l'], ['u', 'l', 'l', 'r'],
    ['u', 'l', 'r', 'u'], ['u', 'l', 'r', 'd'], ['u', 'l', 'r', 'l'], ['u', 'l', 'r', 'r'],
    ['u', 'r', 'u', 'u'], ['u', 'r', 'u', 'd'], ['u', 'r', 'u', 'l'], ['u', 'r', 'u', 'r'],
    ['u', 'r', 'd', 'u'], ['u', 'r', 'd', 'd'], ['u', 'r', 'd', 'l'], ['u', 'r', 'd', 'r'],
    ['u', 'r', 'l', 'u'], ['u', 'r', 'l', 'd'], ['u', 'r', 'l', 'l'], ['u', 'r', 'l', 'r'],
    ['u', 'r', 'r', 'u'], ['u', 'r', 'r', 'd'], ['u', 'r', 'r', 'l'], ['u', 'r', 'r', 'r'],
    ['d', 'u', 'u', 'u'], ['d', 'u', 'u', 'd'], ['d', 'u', 'u', 'l'], ['d', 'u', 'u', 'r'],
    ['d', 'u', 'd', 'u'], ['d', 'u', 'd', 'd'], ['d', 'u', 'd', 'l'], ['d', 'u', 'd', 'r'],
    ['d', 'u', 'l', 'u'], ['d', 'u', 'l', 'd'], ['d', 'u', 'l', 'l'], ['d', 'u', 'l', 'r'],
    ['d', 'u', 'r', 'u'], ['d', 'u', 'r', 'd'], ['d', 'u', 'r', 'l'], ['d', 'u', 'r', 'r'],
    ['d', 'd', 'u', 'u'], ['d', 'd', 'u', 'd'], ['d', 'd', 'u', 'l'], ['d', 'd', 'u', 'r'],
    ['d', 'd', 'd', 'u'], ['d', 'd', 'd', 'd'], ['d', 'd', 'd', 'l'], ['d', 'd', 'd', 'r'],
    ['d', 'd', 'l', 'u'], ['d', 'd', 'l', 'd'], ['d', 'd', 'l', 'l'], ['d', 'd', 'l', 'r'],
    ['d', 'd', 'r', 'u'], ['d', 'd', 'r', 'd'], ['d', 'd', 'r', 'l'], ['d', 'd', 'r', 'r'],
    ['d', 'l', 'u', 'u'], ['d', 'l', 'u', 'd'], ['d', 'l', 'u', 'l'], ['d', 'l', 'u', 'r'],
    ['d', 'l', 'd', 'u'], ['d', 'l', 'd', 'd'], ['d', 'l', 'd', 'l'], ['d', 'l', 'd', 'r'],
    ['d', 'l', 'l', 'u'], ['d', 'l', 'l', 'd'], ['d', 'l', 'l', 'l'], ['d', 'l', 'l', 'r'],
    ['d', 'l', 'r', 'u'], ['d', 'l', 'r', 'd'], ['d', 'l', 'r', 'l'], ['d', 'l', 'r', 'r'],
    ['d', 'r', 'u', 'u'], ['d', 'r', 'u', 'd'], ['d', 'r', 'u', 'l'], ['d', 'r', 'u', 'r'],
    ['d', 'r', 'd', 'u'], ['d', 'r', 'd', 'd'], ['d', 'r', 'd', 'l'], ['d', 'r', 'd', 'r'],
    ['d', 'r', 'l', 'u'], ['d', 'r', 'l', 'd'], ['d', 'r', 'l', 'l'], ['d', 'r', 'l', 'r'],
    ['d', 'r', 'r', 'u'], ['d', 'r', 'r', 'd'], ['d', 'r', 'r', 'l'], ['d', 'r', 'r', 'r'],
    ['l', 'u', 'u', 'u'], ['l', 'u', 'u', 'd'], ['l', 'u', 'u', 'l'], ['l', 'u', 'u', 'r'],
    ['l', 'u', 'd', 'u'], ['l', 'u', 'd', 'd'], ['l', 'u', 'd', 'l'], ['l', 'u', 'd', 'r'],
    ['l', 'u', 'l', 'u'], ['l', 'u', 'l', 'd'], ['l', 'u', 'l', 'l'], ['l', 'u', 'l', 'r'],
    ['l', 'u', 'r', 'u'], ['l', 'u', 'r', 'd'], ['l', 'u', 'r', 'l'], ['l', 'u', 'r', 'r'],
    ['l', 'd', 'u', 'u'], ['l', 'd', 'u', 'd'], ['l', 'd', 'u', 'l'], ['l', 'd', 'u', 'r'],
    ['l', 'd', 'd', 'u'], ['l', 'd', 'd', 'd'], ['l', 'd', 'd', 'l'], ['l', 'd', 'd', 'r'],
    ['l', 'd', 'l', 'u'], ['l', 'd', 'l', 'd'], ['l', 'd', 'l', 'l'], ['l', 'd', 'l', 'r'],
    ['l', 'd', 'r', 'u'], ['l', 'd', 'r', 'd'], ['l', 'd', 'r', 'l'], ['l', 'd', 'r', 'r'],
    ['l', 'l', 'u', 'u'], ['l', 'l', 'u', 'd'], ['l', 'l', 'u', 'l'], ['l', 'l', 'u', 'r'],
    ['l', 'l', 'd', 'u'], ['l', 'l', 'd', 'd'], ['l', 'l', 'd', 'l'], ['l', 'l', 'd', 'r'],
    ['l', 'l', 'l', 'u'], ['l', 'l', 'l', 'd'], ['l', 'l', 'l', 'l'], ['l', 'l', 'l', 'r'],
    ['l', 'l', 'r', 'u'], ['l', 'l', 'r', 'd'], ['l', 'l', 'r', 'l'], ['l', 'l', 'r', 'r'],
    ['l', 'r', 'u', 'u'], ['l', 'r', 'u', 'd'], ['l', 'r', 'u', 'l'], ['l', 'r', 'u', 'r'],
    ['l', 'r', 'd', 'u'], ['l', 'r', 'd', 'd'], ['l', 'r', 'd', 'l'], ['l', 'r', 'd', 'r'],
    ['l', 'r', 'l', 'u'], ['l', 'r', 'l', 'd'], ['l', 'r', 'l', 'l'], ['l', 'r', 'l', 'r'],
    ['l', 'r', 'r', 'u'], ['l', 'r', 'r', 'd'], ['l', 'r', 'r', 'l'], ['l', 'r', 'r', 'r'],
    ['r', 'u', 'u', 'u'], ['r', 'u', 'u', 'd'], ['r', 'u', 'u', 'l'], ['r', 'u', 'u', 'r'],
    ['r', 'u', 'd', 'u'], ['r', 'u', 'd', 'd'], ['r', 'u', 'd', 'l'], ['r', 'u', 'd', 'r'],
    ['r', 'u', 'l', 'u'], ['r', 'u', 'l', 'd'], ['r', 'u', 'l', 'l'], ['r', 'u', 'l', 'r'],
    ['r', 'u', 'r', 'u'], ['r', 'u', 'r', 'd'], ['r', 'u', 'r', 'l'], ['r', 'u', 'r', 'r'],
    ['r', 'd', 'u', 'u'], ['r', 'd', 'u', 'd'], ['r', 'd', 'u', 'l'], ['r', 'd', 'u', 'r'],
    ['r', 'd', 'd', 'u'], ['r', 'd', 'd', 'd'], ['r', 'd', 'd', 'l'], ['r', 'd', 'd', 'r'],
    ['r', 'd', 'l', 'u'], ['r', 'd', 'l', 'd'], ['r', 'd', 'l', 'l'], ['r', 'd', 'l', 'r'],
    ['r', 'd', 'r', 'u'], ['r', 'd', 'r', 'd'], ['r', 'd', 'r', 'l'], ['r', 'd', 'r', 'r'],
    ['r', 'l', 'u', 'u'], ['r', 'l', 'u', 'd'], ['r', 'l', 'u', 'l'], ['r', 'l', 'u', 'r'],
    ['r', 'l', 'd', 'u'], ['r', 'l', 'd', 'd'], ['r', 'l', 'd', 'l'], ['r', 'l', 'd', 'r'],
    ['r', 'l', 'l', 'u'], ['r', 'l', 'l', 'd'], ['r', 'l', 'l', 'l'], ['r', 'l', 'l', 'r'],
    ['r', 'l', 'r', 'u'], ['r', 'l', 'r', 'd'], ['r', 'l', 'r', 'l'], ['r', 'l', 'r', 'r'],
    ['r', 'r', 'u', 'u'], ['r', 'r', 'u', 'd'], ['r', 'r', 'u', 'l'], ['r', 'r', 'u', 'r'],
    ['r', 'r', 'd', 'u'], ['r', 'r', 'd', 'd'], ['r', 'r', 'd', 'l'], ['r', 'r', 'd', 'r'],
    ['r', 'r', 'l', 'u'], ['r', 'r', 'l', 'd'], ['r', 'r', 'l', 'l'], ['r', 'r', 'l', 'r'],
    ['r', 'r', 'r', 'u'], ['r', 'r', 'r', 'd'], ['r', 'r', 'r', 'l'], ['r', 'r', 'r', 'r']
  ]
