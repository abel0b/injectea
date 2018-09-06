function service(mixed) {
    const configure = function (target, options) {
        target.$di = target.$di || {}
        target.$di = {
            ...target.$di,
            type: 'service',
            ...options
        }
        return target
    }
    if (typeof mixed === 'function') {
        return configure(mixed, {
            name: mixed.name
        })
    }
    return function (target) {
        let options
        if(typeof mixed === 'string') {
            options = {
                name: mixed
            }
        }
        else {
            options = mixed
        }
        return configure(target, options)
    }
}

export default service
