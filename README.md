## Redux Action Buffer
### Usage
Redux Persist Example:
```js
import {REHYDRATE} from 'redux-persist/constants'
import actionBuffer from 'redux-action-buffer'

let enhancer = compose(
  autoRehydrate,
  applyMiddleware(
    actionBuffer(REHYDRATE) //make sure to apply this after redux-thunk et al.
  )
)

createStore(
  reducer,
  {},
  enhancer
)
```

### API
actionBuffer(breaker, callback)
- **breaker** (string | function): Either a action type string that will break the buffer or a function that takes an action as the argument and returns true when the buffer should be broken.
- **callback** (function): A function that is invoked after the buffer is broken.
