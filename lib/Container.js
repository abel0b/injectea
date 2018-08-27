class Container {
    constructor() {
        this.dependencies = new Map()
        this.groups = new Map()
    }

    group(group, key) {
        if (this.groups.get(group) === undefined) {
            this.groups.set(group, [])
            this.provider(group, {
                group,
                value: null,
                async get(container) {
                    if (this.value === null) {
                        this.value = await container.resolveAll(container.groups.get(this.group))
                    }
                    return this.value
                }
            }
            )
        }
        this.groups.get(group).push(key)
    }

    provider(name, provider, group) {
        if (this.dependencies.get(name) !== undefined) {
            throw new Error(`Dependency '${name}' already defined`)
        }
        if (group) {
            this.group(group, name)
        }
        this.dependencies.set(name, provider)
    }

    service(service) {
        service.$di = service.$di || {}
        service.$di.name = service.$di.name || service.name
        service.$di.inject = service.$di.inject || []

        this.provider(service.$di.name, {
            service,
            booted: false,
            value: null,
            async get(container) {
                if (!this.booted) {
                    const args = await container.resolveAll(this.service.$di.inject)
                    this.value = new this.service(...args)
                    if (this.service.$di.boot) {
                        const result = eval(`this.value.${this.service.$di.boot}()`)
                        if (result instanceof Promise) {
                            await result
                        }
                    }
                    this.booted = true
                }
                return this.value
            }
        }, service.$di.group)
    }

    factory(factory) {
        factory.$di = factory.$di || {}
        factory.$di.name = factory.$di.name || factory.name
        factory.$di.inject = factory.$di.inject || []

        this.provider(factory.$di.name, {
            factory,
            booted: false,
            value: null,
            async get(container) {
                if (!this.booted) {
                    const args = await container.resolveAll(this.factory.$di.inject)
                    this.value = this.factory(...args)
                    if (this.value instanceof Promise) {
                        this.value = await this.value
                    }
                    this.booted = true
                }
                return this.value
            }
        }, factory.$di.group)
    }

    value(name, value) {
        this.provider(name, {
            value,
            async get() {
                return this.value
            }
        })
    }

    register(service) {
        service.$di = service.$di || {}
        service.$di.type = service.$di.type || 'service'
        if (service.$di.type === 'service') {
            this.service(service)
        }
        else if (service.$di.type === 'factory') {
            this.factory(service)
        }
        else {
            throw new Error(`Invalid service type option : ${service.$di.type}`)
        }
    }

    async resolve(name) {
        if(this.dependencies.get(name) === undefined) {
            throw new Error(`Could not resolve dependency ${name}`)
        }
        return await this.dependencies.get(name).get(this)
    }

    async resolveAll(names) {
        return await Promise.all(
            names.map(name => this.resolve(name))
        )
    }
}

export default Container
