Selectors
----
## Old
const courses = useStateSelector('courses:courseList')
const userReady = useStateSelector('user:getIsSet')

--
## New
const { getUserName: userName } = useSliceSelector(userSlice)
const email = useSliceSelector('user:getEmail')


Actions
----
## Old
const actions = getActions('user')
actions.authenticate({ a: 1, b: 2, c: 3 }))
yield put(getActions('courses').getCourses2(result, 'success'))
const { authenticate, logout } = useActions('user')


## New
const { authenticate } = useActions(userSlice)
const { authenticate } = useActions('user')
const authenticate1 = useActions('user:authenticate')
const authenticate2 = useActions('user:authenticate:request')
slice.actions.authenticate()

---------------------

## Final (Actions)
const { authenticate } = useActions(userSlice)
const { authenticate } = useActions('user')
const actions = useActions('user')
const authenticate = useActions('user:authenticate')
const authenticateSuc = useActions('user:authenticate:success')

slice.actions.authenticate() => {type:''}

const actions = getActions('user')
const {authenticate} = getActions('user')
const authenticate = getActions('user:authenticate')
actions.authenticate({ a: 1, b: 2, c: 3 }))
authenticate({ a: 1, b: 2, c: 3 }))

## Final (selectors)
const { getUserName: userName } = useSliceSelector(userSlice)
const email = useSliceSelector('user:getEmail')
userSlice.selectors.getEmail   => this should point to actual selector
getSelectors('user').getEmail => this should point to actual selector