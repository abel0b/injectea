# Injectea
[![npm version](https://img.shields.io/npm/v/injectea.svg)](https://www.npmjs.com/package/injectea)  [![pipeline status](https://gitlab.com/abeliam/injectea/badges/master/pipeline.svg)](https://gitlab.com/abeliam/injectea/commits/master) [![coverage report](https://gitlab.com/abeliam/injectea/badges/master/coverage.svg)](https://gitlab.com/abeliam/injectea/commits/master)

Dependency injection container

## Features
- todo

## Usage
Create a container
```
import {Container} from 'injectea'

const container = new Container()
```

## Register dependencies
# class
```
@service
class Foo {

}

@service
@inject('Foo')
class Bar {
    constructor(foo) {
        console.log(foo instanceof Foo) // true
    }
}

const container = new Container()
container.register(Foo)

const foo = await container.resolve('Foo')
```

# factory
todo

# value
todo
