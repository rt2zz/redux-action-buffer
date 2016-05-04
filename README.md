## Redux Action Buffer
A middleware for [redux](https://github.com/reactjs/redux) that buffers all actions into a queue until a breaker condition is met, at which point the queue is released (i.e. actions are triggered).

One potential use case for this is to buffer any actions that occur before you are finished initializing your app. For example in conjunction with  [redux-persist](https://github.com/rt2zz/redux-persist).

### Usage
```js
import createActionBuffer from 'redux-action-buffer'
let breaker = BREAKER_ACTION_TYPE
let actionBuffer = createActionBuffer(
  BREAKER_ACTION_TYPE,
  (err, data) => {
    // callback fired immediately after releasing the buffer
    // data: { results: [actionReturnValue], queue: [rawAction] }
  }
)
```

#### Redux Persist Example
```js
import {REHYDRATE} from 'redux-persist/constants'
import createActionBuffer from 'redux-action-buffer'
import { createStore, compose } from 'redux'

let enhancer = compose(
  autoRehydrate(),
  applyMiddleware(
    createActionBuffer(REHYDRATE) //make sure to apply this after redux-thunk et al.
  )
)

createStore(
  reducer,
  {},
  enhancer
)
```

### Notes
Delaying actions can be tricky because many actions depend on having a return value, and buffering breaks that. To help catch this scenario the return value from all buffered actions is a string indicating the action has been buffered.

### API
actionBuffer(breaker, callback)
- **breaker** (string | function): Either a action type string that will break the buffer or a function that takes an action as the argument and returns true when the buffer should be broken.
- **callback** (function): A function that is invoked after the buffer is broken.
