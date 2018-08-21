import DependencyTypes from './DependencyTypes'

class Dependency {
    constructor(options) {
        this.value = undefined
        this.options = options
        this.injected = []
    }

    get booted() {
        return this.value !== undefined
    }

    inject(args) {
        this.injected = args
    }

    get() {
        if (this.value === undefined) {
            this.boot()
        }
        return this.value
    }

    boot() {
        if(this.options.type === DependencyTypes.SERVICE) {
            this.value = new this.options.class(...this.injected)
        }
        else if (this.options.type === DependencyTypes.FACTORY) {
            this.value = this.options.factory
        }
        else {
            this.value = this.options.value
        }
    }
}

export default Dependency
