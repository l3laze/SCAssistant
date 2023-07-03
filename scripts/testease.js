'use strict'

function testease () { /* eslint-disable-line no-unused-vars */
  const results = {
    passed: 0,
    total: 0,
    message: '',
    start: Date.now()
  }

  const check = '\u2714'
  const cross = '\u274C'

  function describe (label) {
    results.message += '\n' + label + '\n'
  }

  // Based on https://advancedweb.hu/how-to-add-timeout-to-a-promise-in-javascript/
  const timedTest = async function (prom, time, exception) {
    let timer

    return Promise.race([prom, new Promise((resolve, reject) => timer = setTimeout(reject, time, exception))]).finally(() => clearTimeout(timer)) /* eslint-disable-line no-return-assign */
  }

  async function test (label, func, flags) {
    const timeoutError = Symbol('Timeout error')
    let testPassed = false
    let error

    results.total++

    if (typeof flags === 'undefined') {
      flags = {
        fails: false,
        timeLimit: -1
      }
    }

    try {
      testPassed = flags.timeLimit !== -1 ? await timedTest(func(), flags.timeLimit, timeoutError) : func.constructor.name === 'AsyncFunction' ? await func() : func()

      if (testPassed === timeoutError) {
        throw timeoutError
      }
    } catch (e) {
      error = {
        message: (e === timeoutError ? `    Failed after ${flags.timeLimit}ms.\n` : `    Failed with error: \n${e.message}\n`)
      }
    }

    if (!testPassed && flags.fails) {
      testPassed = true
      error = {
        message: 'Expected failure.'
      }
    }

    if (testPassed) {
      results.passed++
      results.message += `    ${check} ${label}\n`
    } else {
      results.message += `    ${cross} ${label}\n${error.message}`
    }
  }

  async function it (label, func, time = -1) {
    await test(label, func, { timeLimit: time })
  }

  it.fails = async function (label, func, time = -1) {
    await test(label, func, { fails: true, timeLimit: time })
  }

  const defaultReporter = function () {
    const end = Date.now()

    return `${results.message}\n  ${((results.passed / results.total * 100) + '').substring(0, 5)}% of tests passed (${results.passed}/${results.total}).\nFinished in ${end - results.start}ms`
  }

  return {
    describe,
    it,
    reporter: defaultReporter
  }
}
