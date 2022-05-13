# Data Kit by Veen Labs

## Inspiration

## Get Started

## Todo 

- [x] Saga Error handlers
- [x] Saga events (beforeSaga, afterSaga)
- [X] Get rid errors when wrong name is provided
- [ ] More ways to get actions (direct access to actions and selectors from Component and Sagas)
- [ ] Async services, remove commonHeaders from formatter for API operation.
- [ ] Simplify actions
- [ ] Merge useSliceSelector2 and useSliceSelector 

<br />

# Samples

## createSlice

```js
const userSlice = createSlice({
    name: 'user',
    actions: {
        authenticate: {
            request: {
                saga: function* () {
                    // yield call()
                },
            },
            success: {
                reducer: () => { },
            },
        },
        authenticate2: [asyncService.authenticate, takeAll],
        getUser: asyncService.getUser,
    },
})
```

## Usage

```js
import userSlice from '../data/slices/user'

function AuthDemo() {
    const { authenticate, authenticate2, getUser } = useActions(userSlice)
    return (
        <div>
            <h1>
                AuthDemo : {userName} : {email}
            </h1>
            <button onClick={authenticate}>authenticate</button>
            <button onClick={authenticate2}>authenticate2</button>
            <button
                onClick={() => {
                    authenticate2(credentials)
                }}>
                authenticate2: with data
            </button>
            <button onClick={getUser}>getUser</button>
        </div>
    )
}
```


```js
function AuthDemo() {
    const { authenticate } = useActions('user')
    const authenticate1 = useActions('user:authenticate')
    const authenticate2 = useActions('user:authenticate:request')

    ....
}
```