// Utilities

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Is this even used any more?
function display (panel) {
  const panels = ['about', 'cb_container', 'help', 'settings']

  panels.map((p) => document.getElementById(p))
    .forEach((p) => {
      if (p.id === panel) {
        p.style.display = ''
      } else {
        p.style.display = 'none'
      }
    })
}

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
  
  const clickEvent = new MouseEvent('click')
  const shiftClickEvent = new MouseEvent('click', {'shiftKey': true})

  test('User Interface')

  const settings = document.getElementById('settings')

  test('Shows settings', function showSettings () {
    display('settings')

    return settings.style.display !== 'none'
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
    display('help')

    return help.style.display !== 'none'
  })

  const about = document.getElementById('about')

  test('Shows about', function showAbout () {
    display('about')

    return about.style.display !== 'none'
  })

  const auto = document.getElementById('auto')

  test('Resets board and makes a first guess', function initTest () {
    initAutomation()

    return typeof JSON.parse(Array.from(
      document.querySelectorAll('.row')).slice(-1)[0].dataset.evidence
    ).correct === 'undefined'
  })

  let row = Array.from(document.querySelectorAll('.row')).slice(-1)[0]
  let score = Array.from(row.querySelectorAll('.score')).slice(-1)[0]

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

  test('Decreases score on shift-click', function decScores () {
    for (let j = 0; j < 4; j ++) {
      score.children[1].dispatchEvent(shiftClickEvent)
    }

    return parseInt(score.children[1].innerText) === 0
  })

  test('Score wraps from 0 to 4', function loopsAroundMin () {
    score.children[1].dispatchEvent(shiftClickEvent)

    return parseInt(score.children[1].innerText) === 4
  })

  const next = document.getElementById('next')

  await test('Hides next after success', async function hidesNextOnSuccess () {
    score.children[0].dispatchEvent(shiftClickEvent)
    score.children[1].dispatchEvent(clickEvent)
    next.dispatchEvent(clickEvent)

    return next.style.display === 'none'
  })

  const res = document.getElementById('testResults')

  res.value = tests.message + '\n  ' + ((tests.passed / tests.total * 100) + '').substring(0, 5) +
  '% of tests passed (' + tests.passed + '/' + tests.total + ').'

  // Has to be actively displayed to be scrolled.
  display('settings')
  res.scrollTop = res.scrollHeight
}