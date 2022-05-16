import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleWare from 'redux-saga'
import { takeLatest } from 'redux-saga/effects'
import { getPreferences } from './setup'

function configureStore(...slices) {
  const reducers = {}
  let allSagas = [] //[[actionName, handler, sagaEffect]]
  let sagasToRun = []

  for (let slice of slices) {
    reducers[slice.name] = slice.reducer
    allSagas = allSagas.concat(slice.sagas)
  }

  for (let saga of allSagas) {
    sagasToRun.push(function* () {
      const [actionType, sagaToHandle, effect = takeLatest] = saga
      yield effect(actionType, sagaToHandle)
    })
  }

  const middlewares = []
  const sagaMiddleWare = createSagaMiddleWare()
  middlewares.push(sagaMiddleWare)

  if (getPreferences('loggingEnabled')) {
    middlewares.push(
      createLogger({
        logErrors: true,
      }),
    )
  }

  const store = createStore(combineReducers(reducers), applyMiddleware(...middlewares))
  sagasToRun.forEach(sagaMiddleWare.run)
  return store
}

export default configureStore
