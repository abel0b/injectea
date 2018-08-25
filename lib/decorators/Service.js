function Service(options = {}) {
    return function (target) {
        target.$di = {
            type: 'service',
            ...options
        }
    }
}

export default Service
