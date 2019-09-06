import { expect }  from '@hapi/code'
import Lab  from '@hapi/lab'
import {Container, service, mock} from '../lib'

export const lab = Lab.script()

lab.test('create child containers', async () => {
    const container = new Container()

    container.child('test')

    expect(container.scope('test')).to.be.instanceof(Container)
})

lab.test('try to access to undefined scope', async () => {
    const container = new Container()

    container.value('foo', 42)

    expect(() => {
        container.scope('foo')
    }).to.throw(Error)
})

lab.test('resolve dependency from child container', async () => {
    const container = new Container()

    @service
    class Foo {}

    @mock(Foo)
    class FakeFoo {

    }

    container.child('test')

    container.register(Foo)
    container.register(FakeFoo)

    expect(() => {container.scope('production')}).to.throws(Error)

    expect(await container.resolve('Foo')).to.be.instanceof(Foo)
    expect(container.resolve('Undefined')).to.reject(Error)
    expect(await container.scope('test').resolve('Foo')).to.be.instanceof(FakeFoo)
})
