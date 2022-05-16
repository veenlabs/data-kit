import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { default as debounce } from 'lodash/debounce'

const initialState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// counterSlice.reducer

// counterSlice.actions.foop

type Slice<Actions> = {
  name: String,
}
function getUser<Actions>(a: T): Slice<Actions> {}
const user = {
  name: 'p',
  age: 23,
}

const newUser = getUser(user)
newUser

// export const store = configureStore({
//     reducer: {
//       counter: counterSlice.reducer,
//     },
// })
