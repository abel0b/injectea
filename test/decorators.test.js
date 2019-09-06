import { expect }  from '@hapi/code'
import * as Lab  from '@hapi/lab'
import {service, inject, factory, Service, Factory, Container} from '../lib'

const lab = Lab.script()

export { lab }

lab.experiment('decorators:', () => {
    lab.test('register service decorator', async () => {
        const container = new Container()

        @Service({
            name: 'Bar'
        })
        class Foo {}

        container.service(Foo)

        expect(
            container.resolve('Foo')
        ).to.reject(Error)

        const res = await container.resolve('Bar')
        expect(
            res.constructor.name
        ).to.be.equal(Foo.name)
    })

    lab.test('register Factory decorator', async () => {
        const container = new Container()

        function makeNumber(number) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(number)
                }, 1000)
            })
        }

        container.value('number', 42)
        container.factory(Factory({
            inject: ['number']
        })(makeNumber))

        expect(
            await container.resolve('makeNumber')
        ).to.be.equal(42)
    })

    lab.test('inject decorator', async () => {
        class Foo {}
        inject('foo', 'bar', 'baz')(Foo)
        expect(Foo.$di.inject).to.be.equal(['foo', 'bar', 'baz'])
    })


    lab.test('service decorator', async () => {
        const container = new Container()
        class Foo {}
        service('bar')(Foo)
        container.register(Foo)

        expect(container.resolve('Foo')).to.reject(Error)
        expect(await container.resolve('bar')).to.be.instanceof(Foo)
    })

    lab.test('service decorator with default configuration', async () => {
        const container = new Container()
        class Foo {}
        service(Foo)
        container.register(Foo)

        expect(await container.resolve('Foo')).to.be.instanceof(Foo)
    })

    lab.test('compose inject and service decorator', async () => {
        const container = new Container()
        class Foo {
            constructor(bar) {
                this.bar = bar
            }
        }
        service('F')(inject('B')(Foo))

        class Bar {}
        service('B')(Bar)

        container.register(Foo)
        container.register(Bar)

        const foo = await container.resolve('F')
        expect(foo.bar).to.be.instanceof(Bar)
    })

    lab.test('compose service and inject decorator', async () => {
        const container = new Container()
        class Foo {
            constructor(bar) {
                this.bar = bar
            }
        }
        inject('B')(service('F')(Foo))

        class Bar {}
        service('B')(Bar)

        container.register(Foo)
        container.register(Bar)

        const foo = await container.resolve('F')
        expect(foo.bar).to.be.instanceof(Bar)
    })

    lab.test('factory decorator', async () => {
        const container = new Container()

        function makeThing() {
            return Promise.resolve('thing')
        }

        expect(factory('thing')(makeThing).name).to.be.equal(makeThing.name)

        container.register(makeThing)

        expect(await container.resolve('thing')).to.be.equal('thing')
    })

})
