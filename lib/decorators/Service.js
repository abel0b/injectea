function Service(options = {}) {
    return function (target) {
        target.$di = {
            type: 'service',
            ...options
        }
        return target
    }
}

export default Service
