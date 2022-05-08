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

const initialState = null

// data slices
const slice = createSlice({
  // config
  name: 'user',
  initialState: initialState,
  selectors: {
    getIsSet: (user) => !!user,
    getFullName: (user, state) => user.fullName, // read propery
    getUserWithRoles: (user, state) => ({ user, roles: state.roles }), //read full state
    getEmail: 'profile.fullName', // path in user object
    getQuickInfo: { fullName: 'fullName', email: 'email' },
  },

  // actions
  authenticate: {
    request: {
      reducer: (state, { payload }) => {
        return state
      },
      saga: function* () {
        console.log('MAKE API CALL. SHOULD COME HERE')
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
