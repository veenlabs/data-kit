# Data Kit by Veen Labs
[![npm downloads](https://img.shields.io/npm/dm/@veen2/data-kit.svg?style=flat-square&label=@veen2/data-kit)](https://www.npmjs.com/package/@veen2/data-kit)

Highly opinionated utilties for redux/react and async services. Suitable for enterprise level applications to toy apps.

## Motivation

To avoid writting repeating/redux-bolier-plate codes.  

## Installation
```bash
# NPM
npm install @veen2/data-kit

# Yarn
yarn add @veen2/data-kit
```

### Peer dependecies
Veen Data Kit expects you already installed the below list of packages. If not you can install yourself

```bash
# NPM
npm install axios immer lodash react redux react-redux redux-logger redux-saga


# Yarn
yarn add axios immer lodash react redux react-redux redux-logger redux-saga
```

# Purpose
Veen Datakit is created to addresss following issues

- I have to write a lot of boiler plate codes just to create a Toy app
- Enterpise apps are filled with repeating codes and their coverage 
- If I have to make an API call and display the results, then why I have to write lots of call. 
- Why I should write code to maintain status of Async operations(like APIS)
- To me Redux thunk looks ugly
- Redux Toolkit doesn't follow the simplicity of Redux 

## What's Included

@veen2/data-kit includes two main packages
- <b>AsyncService</b> : For making any kind of API operations
- <b>StateService</b> : To write redux logic, create/dispatch actions. Read data 


# APIs of AsyncService

- `addConfiguration()`: 
- `addOperations()`: 
- `asyncService`: 
- `types` : 
- `AsyncServiceStatusProvider` : 
- `useAsyncServiceStatus()`: 

# APIs of StateService

- `createSlice()` 
- `configureStore()` 
- `setup()` 
- `useActions()` 
- `getActions()` 
- `useReset()` 
- `useSliceSelector()` 
- `getSliceSelectors()`


# Get Started

## Lets create an api service using AsyncService

```js
import { AsyncService } from '@veen/data-kit'
const { addConfiguration, addOperations, types } = AsyncService

// Add configurations. (You can have multiple configurations). Check documents for more details
addConfiguration({
  baseUrl: 'http://localhost:8088',
  type: types.webType,
})


// Add apis. You can configure each operation more than just shown in the below examples. Check documents for more details
addOperations({
  createProduct: ['/api/v1/products', 'POST'],
  listProducts: '/api/v1/products',
})

```

## Lets configure redux, add slices and use them in React. Let the fun begin.


### createSlice()

```js
import { AsyncService, StateService } from '@veen2/data-kit'

const { asyncService } = AsyncService
const { createSlice } = StateService

const userSlice = createSlice({
  name: 'products',
  initialState: null,
  selectors: {
    getProducts: (s) => s.products || [],
    topProduct: (s) => (s.products || []).sort((a, b) => a - b), // some logic
  },
  actions: {
    // Just api service is mentioned as action. Data will fetched and stored in state
    listProducts: asyncService.listProducts,

    // This is a little complex action, it has three stages. (request, success, failure)
    // All stages are optional
    createProduct: {
      // In request stage we just mentioned the api service
      request: asyncService.createProduct,

      // In success stage we receive the data from request stage. We use it update state ourselves
      success: {
        reducer: (state, action) => {
          // A new product is created. Let's add to the state
          return Array.isArray(state) ? state.push(action.payload) : action.payload
        },
      },

      // Optional failure stage
      failure: {
        // Do something
      },
    },
  },
})

export default userSlice

```

### Configure Store

```js
import { StateService } from '@veen/data-kit'
import productsSlice from './slices/products'
import someOtherSlice from './slices/someOtherSlice'

const { configureStore, setup } = StateService

setup({
  loggingEnabled: true,
  beforeHandleSaga: function* (action, extraOptions) {
    console.log({ action, extraOptions })
    console.log('Saga starts....')
  },
  afterSuccessHandleSaga: function* () {
    console.log('Saga end....')
  },
})

const store = configureStore(productsSlice, someOtherSlice)

export default store

```

### Configure app
```js
import React from 'react'
import { AsyncService } from '@veen/data-kit'
import { Provider } from 'react-redux'

import './data/apiSetup'
import store from './data/store'
import Products from './components/Products'

const { AsyncServiceStatusProvider } = AsyncService

const Main = () => {
  return (
    <Provider store={store}>
      <AsyncServiceStatusProvider>
        <Products />
      </AsyncServiceStatusProvider>
    </Provider>
  )
}

function App() {
  return <Main />
}

export default App

```

### Add a component


```js
import React from 'react'
import { AsyncService, StateService } from '@veen2/data-kit'

const { useAsyncServiceStatus } = AsyncService
const { useActions, useSliceSelector } = StateService

function Products() {
  const createProductApiStatus = useAsyncServiceStatus('createProduct')
  const listProductsApiStatus = useAsyncServiceStatus('listProducts')

  // There are other ways avaliable to consume useActions then mentioned below
  const { listProducts, createProduct } = useActions('products')

  // There are other ways avaliable to consume useSliceSelector then mentioned below
  const products = useSliceSelector('products:getProducts')
  const topProduct = useSliceSelector('products:topProduct')

  React.useEffect(() => {
    // Fetch items when component mounts
    listProducts()
  }, [])

  return (
    <div>
      <h1>Api Statuses</h1>
      <div>createProduct: {createProductApiStatus}</div>
      <div>listProducts: {listProductsApiStatus}</div>

      <h1>Data List and creation</h1>

      <h3>Top Product</h3>
      <div>
        <button onClick={() => createProduct('Add a product')}>Add product</button>
      </div>
      <div>{topProduct}</div>

      <h3>Products</h3>
      <div>{products.join(' - ')}</div>
    </div>
  )
}

export default Products

```


### Thanks. More smaples coming soon. Follow Veenlans on twitter

https://twitter.com/veenlabs