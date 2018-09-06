function inject(...args) {
    return function (target) {
        target.$di = target.$di || {}
        target.$di.inject = args
        return target
    }
}

export default inject
