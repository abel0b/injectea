function scope(key) {
    return function (target) {
        if (target.$di === undefined) {
            target.$di = {}
        }
        target.$di = {
            ...target.$di,
            scope: key
        }
        return target
    }
}

export default scope
