import { expect }  from 'code'
import * as Lab  from 'lab'
import Container from '../lib/Container'

const lab = Lab.script()

export { lab }


lab.experiment('Container', () => {
    lab.test('construct', () => {
        new Container()
    })

    lab.test('register service', () => {
        const container = new Container()
        class Repository {}
        container.service('Repository', Repository)
        const rep = container.resolve('Repository')
        expect(rep).to.instanceof(Repository)
    })

    lab.test('constructor called once', () => {
        let count = 0
        class FakeService {
            constructor() {
                count ++
            }
        }
        const container = new Container()
        container.service('FakeService', FakeService)
        let a = container.resolve('FakeService')
        let b = container.resolve('FakeService')
        expect(a).to.equal(b)
        expect(count).to.be.equal(1)
    })

    lab.test('name conflict', () => {
        const container = new Container()
        container.constant('foo', 1)
        expect(
            () => {
                container.constant('foo', 2)
            }
        ).to.throw(Error)
    })

    lab.test('undefined dependency', () => {
        const container = new Container()
        expect(
            () => {
                container.resolve('foo')
            }
        ).to.throw(Error)
    })

    lab.test('register constant', () => {
        const container = new Container()
        const myConst = 42
        container.constant('num', myConst)
        expect(
            container.resolve('num')
        ).to.equal(42)
    })

    lab.test('register factory', () => {
        const container = new Container()
        const myFactory = function() {
            return 42
        }
        container.factory('myFactory', myFactory)

        expect(
            container.resolve('myFactory')()
        ).to.equal(42)
    })

    lab.test('inject dependencies', () => {
        const container = new Container()
        class Foo {
            constructor(bar, baz) {
                this.bar = bar
                this.baz = baz
            }
        }
        class Bar {}
        class Baz {}
        container.service('Foo', Foo, ['Bar', 'Baz'])
        container.service('Bar', Bar)
        container.service('Baz', Baz)

        const foo = container.resolve('Foo')
        expect(foo.bar).to.equal(
            container.resolve('Bar')
        )
        expect(foo.baz).to.equal(
            container.resolve('Baz')
        )
    })
})
