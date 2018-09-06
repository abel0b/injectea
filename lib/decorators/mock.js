function mock(service) {
    return function (target) {
        target.$di = target.$di || {}
        target.$di = {
            ...service.$di,
            scope: 'test'
        }
        return target
    }
}

export default mock
