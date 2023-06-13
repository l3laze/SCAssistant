'use strict'

// Utilities

/*
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
*/

async function selfTest () {
  /*
   * Test framework
   */
  const tests = {
    passed: 0,
    failed: 0,
    total: 0,
    message: ''
  }

  const check = '\u2714'
  const cross = '\u274C'

  const test = async function (label, func) {
    if (typeof func === 'undefined') {
      tests.message += '\n  ' + label + '\n'
    } else {
      tests.total++

      if (await func()) {
        tests.passed++
        tests.message += '    ' + check + ' ' + label + '\n'
      } else {
        tests.failed++
        tests.message += '    ' + cross + ' ' + label + '\n'
      }
    }
  }

  /*
   * Tests
   */

  /*
  test('Framework can handle failures.', function () {
    return false
  })
  */
  
  const clickEvent = new MouseEvent('click')
  const rightClickEvent = new MouseEvent('contextmenu')

  if (document.getElementById('cb_container').style.display === 'none') {
    document.getElementById('modeBtn').dispatchEvent(clickEvent)
  }

  document.getElementById('hamburger').classList.remove('active')
  document.getElementById('controls').classList.remove('responsive')

  test('User Interface')

  const settings = document.getElementById('settings')

  test('Shows settings', function showSettings () {
    const s = document.getElementById('settingsBtn')

    s.dispatchEvent(clickEvent)

    return s.style.display !== 'none'
  })

  /*
  const dark = document.getElementById('dark')
  const light = document.getElementById('light')

  await test('Changes theme', async function changesTheme () {
    return true
  })
  */

  const help = document.getElementById('help')

  test('Shows help', function showHelp () {
    const h = document.getElementById('helpBtn')

    h.dispatchEvent(clickEvent)

    return h.style.display !== 'none'
  })

  const about = document.getElementById('about')

  test('Shows about', function showAbout () {
    const a = document.getElementById('aboutBtn')

    a.dispatchEvent(clickEvent)

    return a.style.display !== 'none'
  })

  const auto = document.getElementById('auto')

  test('Resets board and makes a first guess', function initTest () {
    resetCB()

    return typeof document.querySelectorAll('.row')[0] !== 'undefined'
  })

  let row = Array.from(document.querySelectorAll('.row')).slice(-1)[0]
  let score = Array.from(row.querySelectorAll('.scoreboard')).slice(-1)[0]

  test('Increases score on click', function incScores () {
    for (let i = 0; i < 4; i ++) {
      score.children[0].dispatchEvent(clickEvent)
      score.children[1].dispatchEvent(clickEvent)
    }

    return parseInt(score.children[0].innerText) === 4
  })

  test('Score wraps from 4 to 0', function loopsAroundMax () {
    score.children[0].dispatchEvent(clickEvent)

    return parseInt(score.children[0].innerText) === 0
  })

  test('Decreases score on "contextmenu" (right click)', function decScores () {
    for (let j = 0; j < 4; j ++) {
      score.children[1].dispatchEvent(rightClickEvent)
    }

    return parseInt(score.children[1].innerText) === 0
  })

  test('Score wraps from 0 to 4', function loopsAroundMin () {
    score.children[1].dispatchEvent(rightClickEvent)

    return parseInt(score.children[1].innerText) === 4
  })

  const next = document.getElementById('next')

  test('Hides next after success', function hidesNextOnSuccess () {
    score.children[0].dispatchEvent(rightClickEvent)
    score.children[1].dispatchEvent(clickEvent)
    next.dispatchEvent(clickEvent)

    document.getElementById('auto').innerText = 'Start'
    document.getElementById('cb_container').innerHTML = ''

    return next.style.display === 'none'
  })

  test('Switches to CoC mode', function switchMode () {
    const m = document.getElementById('modeBtn')

    m.dispatchEvent(clickEvent)

    return document.getElementById('coc_container').style.display !== 'none'
  })

  test('Can select tiles in CoC mode', function selectFromCoC () {
    const n = document.getElementById('node13')

    n.dispatchEvent(clickEvent)

    return n.classList.contains('hit')
  })

  await test('Can reset CoC board', async function resetCoCBoard () {
    const r = document.getElementById('reset')

    r.dispatchEvent(clickEvent)

    return document.getElementById('node13').classList.contains('hit') === false
  })

  const res = document.getElementById('testResults')

  res.innerText = `${tests.message}\n  ${((tests.passed / tests.total * 100) + '').substring(0, 5)}% of tests passed (${tests.passed}/${tests.total}).`

  
  document.getElementById('modeBtn').dispatchEvent(clickEvent)
  document.getElementById('hamburger').dispatchEvent(clickEvent)
  document.getElementById('settingsBtn').dispatchEvent(clickEvent)

  res.scrollTop = res.scrollHeight
}