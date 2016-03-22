var BUFFERED_ACTION_RETURN = 'redux-action-buffer: buffered action'

module.exports = function bufferActions (breaker, cb) {
  var active = true
  var queue = []
  if (typeof breaker === 'string') {
    var actionType = breaker
    breaker = function (action) {
      if (action.type === actionType) return true
      else return false
    }
  }

  return next => action => {
    if (!active) return next(action)
    if (breaker(action)) {
      active = false
      var result = next(action)
      var queueResults = []
      queue.forEach(function(queuedAction) {
        var queuedActionResult = next(queuedAction)
        queueResults.push(queuedActionResult)
      })
      cb && cb(null, {
        results: queueResults,
        queue: queue
      })
      return result
    } else {
      queue.push(action)
      // @TODO consider returning a dummy action, or maybe null for cleanliness
      return BUFFERED_ACTION_RETURN
    }
  }
}
