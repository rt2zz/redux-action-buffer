import test from 'ava'

import { createStore, applyMiddleware } from 'redux'
import actionBuffer from '../index'

const BREAKER = 'BREAKER'

// @TODO split into multiple atomic tests
test('buffers actions', t => {
  var actionHistory = []

  function breakCallback(err, {results, queue}) {
    // result is an object with results and queue arrays
    t.is(results.length, 2)
    t.is(queue.length, 2)
  }

  let store = createStore(
    (state, action) => {
      if (action.type.indexOf('@@') !== 0) actionHistory.push(action)
      return {}
    },
    null,
    applyMiddleware(actionBuffer(BREAKER, breakCallback))
  )

  let action1 = {type: 'ACTION1'}
  let action2 = {type: 'ACTION2'}
  let action3 = {type: 'ACTION3'}
  let breaker = {type: 'BREAKER'}

  let r1 = store.dispatch(action1)
  let r2 = store.dispatch(action2)
  let rB = store.dispatch(breaker)
  let r3 = store.dispatch(action3)

  // buffered actions return strings, other actions return themselves
  t.ok(typeof r1 === 'string')
  t.ok(typeof r2 === 'string')
  t.same(rB, breaker)
  t.same(r3, action3)

  // history is re-ordered as expected
  t.is(actionHistory.indexOf(breaker), 0)
  t.is(actionHistory.indexOf(action1), 1)
  t.is(actionHistory.indexOf(action2), 2)
  t.is(actionHistory.indexOf(action3), 3)
  t.pass()
})
