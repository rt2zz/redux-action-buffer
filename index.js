var BUFFERED_ACTION_RETURN = 'redux-action-buffer: buffered action'

var setImmediate = typeof global !== 'undefined' &&
  typeof global.setImmediate !== 'undefined'
  ? global.setImmediate
  : setTimeout

module.exports = function bufferActions(options, cb) {
  var active = true
  var queue = []
  var passthrough = (options && options.passthrough) || []
  var breaker = typeof options === 'object' ? options.breaker : options

  var breakerType = typeof breaker

  if (breakerType === 'string' || breakerType === 'symbol') {
    var actionType = breaker
    breaker = function(action) {
      if (action.type === actionType) return true
      else return false
    }
  }

  return function(store) {
    return function(next) {
      return function(action) {
        // console.log("next", next, action);
        if (!active || passthrough.includes(action.type)) return next(action)
        if (breaker(action)) {
          active = false
          var result = next(action)
          setImmediate(function() {
            var queueResults = []
            queue.forEach(function(queuedAction) {
              var queuedActionResult = next(queuedAction)
              queueResults.push(queuedActionResult)
            })
            cb &&
              cb(null, {
                results: queueResults,
                queue: queue
              })
          })
          return result
        } else {
          queue.push(action)
          // @TODO consider returning a dummy action, or maybe null for cleanliness
          return BUFFERED_ACTION_RETURN
        }
      }
    }
  }
}
