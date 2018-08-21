import DependencyTypes from './DependencyTypes'
import Dependency from './Dependency'

class Container {
    constructor() {
        this.dependencies = new Map()
    }

    register(options) {
        if (this.dependencies.get(options.name) !== undefined) {
            throw new Error(`Dependency '${options.name}' already defined`)
        }
        this.dependencies.set(options.name, new Dependency(options))
    }

    service(name, className, inject) {
        if (inject === undefined) {
            inject = []
        }
        this.register({
            type: DependencyTypes.SERVICE,
            name,
            inject,
            class: className
        })
    }

    factory(name, factory) {
        this.register({
            type: DependencyTypes.FACTORY,
            name,
            factory
        })
    }

    constant(name, value) {
        this.register({
            type: DependencyTypes.CONSTANT,
            name,
            value
        })
    }

    resolve(name) {
        if(this.dependencies.get(name) === undefined) {
            throw new Error(`Could not resolve dependency ${name}`)
        }
        if (this.dependencies.get(name).options.type === DependencyTypes.SERVICE && !this.dependencies.get(name).booted) {
            this.dependencies.get(name).inject(
                this.dependencies.get(name).options.inject.map(depName => this.resolve(depName))
            )
        }
        return this.dependencies.get(name).get()
    }
}

export default Container
