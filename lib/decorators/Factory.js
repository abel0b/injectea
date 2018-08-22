function Factory(options = {}) {
    return function (target) {
        target.$di = options
        return target
    }
}

export default Factory
