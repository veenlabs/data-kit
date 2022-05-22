import { identity } from '../helpers/lodash'

const arrayToObject = (arr = [], producerFn = identity) => {
  return arr.reduce((a, c) => {
    a[c] = producerFn(c)
    return a
  }, {})
}

export { arrayToObject }
