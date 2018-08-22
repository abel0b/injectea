function Service(options = {}) {
    return function (target) {
        target.$di = options
    }
}

export default Service
