function Factory(options = {}) {
    return function (target) {
        target.$di = {
            type: 'factory',
            ...options
        }
        return target
    }
}

export default Factory
