import { createSlice } from '@veenlabs/data-kit/state-service'
import { apiService, extend } from '@veenlabs/data-kit/api-service'

// Apis
extend({
  getMe: '/users/me',
  updateUser: ['post', '/users/'],
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
  me: apiService.getMe,
  update: {
    request: {
      api: apiService.updateUser,
    },
  },
  logout: (state, { payload }) => {
    return initialState
  },
})

export default slice
