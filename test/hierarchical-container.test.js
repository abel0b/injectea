import { expect }  from 'code'
import Lab  from 'lab'
import {Container, service, mock} from '../lib'

export const lab = Lab.script()

lab.test('create child containers', async () => {
    const container = new Container()

    const child = new Container(container)

    container.child('test')

    expect(container.scope('test')).to.be.instanceof(Container)
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
    container.scope('test').register(FakeFoo)

    expect(() => {container.scope('production')}).to.throws(Error)

    expect(await container.resolve('Foo')).to.be.instanceof(Foo)
    expect(await container.scope('test').resolve('Foo')).to.be.instanceof(FakeFoo)
})
