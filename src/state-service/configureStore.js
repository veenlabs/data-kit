import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleWare from 'redux-saga'

function configureStore(...slices) {
  const reducers = {}
  let sagasToRun = []

  for (let slice of slices) {
    reducers[slice.name] = slice.reducers
    sagasToRun = sagasToRun.concat(slice.sagas)
  }

  const middlewares = []
  const sagaMiddleWare = createSagaMiddleWare()
  middlewares.push(sagaMiddleWare)

  const store = createStore(combineReducers(reducers), applyMiddleware(...middlewares))
  sagasToRun.forEach(sagaMiddleWare.run)
  return store
}

export default configureStore
