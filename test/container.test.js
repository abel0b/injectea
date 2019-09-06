import { expect }  from '@hapi/code'
import Lab  from '@hapi/lab'
import {Container, Service, Factory} from '../lib'

export const lab = Lab.script()

lab.experiment('Container', () => {
    lab.test('construct', () => {
        new Container()
    })

    lab.test('register service', async () => {
        const container = new Container()
        class Repository {}
        container.service(Repository)
        const rep = await container.resolve('Repository')
        expect(rep).to.instanceof(Repository)
    })

    lab.test('register named service', async () => {
        const container = new Container()
        class Repository {}
        Repository.$di = {name: 'Repository'}
        container.service(Repository)
        const rep = await container.resolve('Repository')
        expect(rep).to.instanceof(Repository)
    })

    lab.test('resolve bootable service', async () => {
        let started = false
        let count = 0
        class Engine {
            boot() {
                started = true
                count++
            }
        }
        Engine.$di = {
            boot: 'boot'
        }
        const container = new Container()
        container.service(Engine)
        await container.resolve('Engine')
        expect(
            started
        ).to.be.true()
        await container.resolve('Engine')
        expect(count).to.be.equal(1)
    })

    lab.test('resolve async bootable service', async () => {
        let started = false
        let count = 0
        class Engine {
            boot() {
                return new Promise(resolve => {
                    setTimeout(() => {
                        started = true
                        count++
                        resolve()
                    }, 1000)
                })
            }
        }
        Engine.$di = {
            boot: 'boot'
        }
        const container = new Container()
        container.service(Engine)
        await container.resolve('Engine')
        expect(
            started
        ).to.be.true()
        await container.resolve('Engine')
        expect(count).to.be.equal(1)
    })

    lab.test('constructor called once', async () => {
        let count = 0
        class FakeService {
            constructor() {
                count ++
            }
        }
        const container = new Container()
        container.service(FakeService)
        let a = await container.resolve('FakeService')
        let b = await container.resolve('FakeService')
        expect(a).to.equal(b)
        expect(count).to.be.equal(1)
    })

    lab.test('name conflict', () => {
        const container = new Container()
        container.value('foo', 1)
        expect(
            () => {
                container.value('foo', 2)
            }
        ).to.throw(Error)
    })

    lab.test('undefined dependency', async () => {
        const container = new Container()
        expect(
            container.resolve('foo')
        ).to.reject(Error)
    })

    lab.test('register value', async () => {
        const container = new Container()
        const val = 42
        container.value('num', val)
        expect(
            await container.resolve('num')
        ).to.equal(42)
    })

    lab.test('register factory', async () => {
        const container = new Container()
        const myFactory = function() {
            return 42
        }
        container.factory(myFactory)

        expect(
            await container.resolve('myFactory')
        ).to.equal(42)
    })

    lab.test('register factory with dependencies', async () => {
        const container = new Container()
        const myFactory = function(foo, bar) {
            return {foo, bar}
        }
        myFactory.$di = {
            name: 'factoryName',
            inject: ['foo', 'bar']
        }
        container.value('foo', {foo: 'foo'})
        container.value('bar', {bar: 'bar'})
        container.factory(myFactory)

        const resolved = await container.resolve('factoryName')
        expect(
            resolved.foo
        ).to.be.equal(await container.resolve('foo'))
        expect(
            resolved.bar
        ).to.be.equal(await container.resolve('bar'))
    })

    lab.test('factory function called once', async () => {
        const container = new Container()
        let count = 0
        const myFactory = function() {
            count ++
            return 42
        }
        container.factory(myFactory)

        expect(
            await container.resolve('myFactory')
        ).to.equal(42)
        expect(
            await container.resolve('myFactory')
        ).to.equal(42)

        expect(count).to.be.equal(1)
    })

    lab.test('inject dependencies', async () => {
        const container = new Container()
        class Foo {
            constructor(bar, baz) {
                this.bar = bar
                this.baz = baz
            }
        }
        Foo.$di = {
            inject: ['Bar', 'Baz']
        }
        class Bar {}
        class Baz {}
        container.service(Foo)
        container.service(Bar)
        container.service(Baz)

        const foo = await container.resolve('Foo')
        expect(foo.bar).to.equal(
            await container.resolve('Bar')
        )
        expect(foo.baz).to.equal(
            await container.resolve('Baz')
        )
    })


    lab.test('register a service', async () => {
        const container = new Container()

            @Service({name: 'Bar'})
        class Foo {
                baz() {
                    return 42
                }
            }

            container.register(Foo)

            expect(container.resolve('Foo')).to.reject(Error)
            const foo = await container.resolve('Bar')
            expect(foo.baz()).to.be.equal(42)
    })
    lab.test('register a factory', async () => {
        const container = new Container()

        function Make() {
            return 0
        }

        container.register(Factory()(Make))

        const make = await container.resolve('Make')
        expect(make).to.be.equal(0)
    })
    lab.test('register a service with default options', async () => {
        const container = new Container()

        class Foo {}

        container.register(Foo)
        await container.resolve('Foo')
    })
    lab.test('register a service with unknown type', async () => {
        const container = new Container()

            @Service({
                type: 'unknown'
            })
        class Foo {}

            expect(() => container.register(Foo)).to.throw(Error)
    })

    lab.test('resolve a service group', async () => {
        const container = new Container()

        @Service({
            group: 'foo'
        })
        class AFoo {}

        @Service({
            group: 'foo'
        })
        class BFoo {}

        container.register(AFoo)
        container.register(BFoo)

        const deps = await container.resolve('foo')
        await container.resolve('foo')
        expect(deps).to.be.an.array()
        expect(deps.length).to.be.equal(2)
        expect(deps[0]).to.exist()
        expect(deps[1]).to.exist()
    })
})
