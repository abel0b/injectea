import { expect }  from 'code'
import * as Lab  from 'lab'
import {Service, Factory, Container} from '../lib'

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
})
