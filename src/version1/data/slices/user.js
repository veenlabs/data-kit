import { createSlice } from '@veenlabs/data-kit/state-service'
import { apiService, addApis } from '@veenlabs/data-kit/api-service'

// Apis
addApis({
  getMe: '/users/me',
  updateUser: ['post', '/users/'],
  fromReducer: '/red',
  createUser: {
    url: '/users',
    method: 'POST',
    // beforeRequest: (parent, result) => {
    //   // this will be called just before returning result from success
    //   // return response.data
    //   return { parent: parent(result), child: '123' }
    // },
    // beforeSuccess: (parent, result) => {
    //   // this will be called just before returning result from success
    //   // return response.data
    //   return { parent: parent(result), child: '123' }
    // },
  },
})
addApis({
  _config: { serverName: 'server2' },
  getMe: '/2/users/me',
  updateUser: [2, 'post', '/users/'],
  fromReducer: '/2/red',
})

const initialState = {
  userName: 'Before',
}

// data slices
const slice = createSlice({
  // config
  name: 'user',
  initialState: initialState,
  selectors: {
    getIsSet: (user) => !!user.user,
    getFullName: (user, state) => {
      // if (user.user == 'zpraveen') {
      //   // throw Error('Hello12')
      //   return user.user.c.c.c
      // }
      return user.user
    }, // read propery
    getUserWithRoles: (user, state) => ({ user, roles: state.roles }), //read full state
    getEmail: 'profile.fullName', // path in user object
    getQuickInfo: { fullName: 'fullName', email: 'email' },
  },

  // actions
  authenticate: {
    request: {
      reducer: (state, { payload }) => {
        console.log(state.user)
        state.user = (state.user ? state.user : '') + payload.user
        // return state
        // return payload
      },
      saga: function* ({ payload }) {
        console.log('MAKE API CALL. SHOULD COME HERE', payload)
      },
      extraOptions: {
        a: 1,
        b: 2,
      },
    },
    success: {
      reducer: () => {},
      saga: function* () {},
    },
  },
  me: apiService.fromReducer,
  update: {
    request: {
      api: apiService.fromReducer,
    },
  },
  logout: (state, { payload }) => {
    return initialState
  },
})

export default slice
