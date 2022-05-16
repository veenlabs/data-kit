import assert from 'assert'
import createSlice from '../src/state-service/createSlice'

describe('Test state service', function () {
  it('should pass', function () {
    assert.equal(1, 1)
  })

  it('Should create actions', () => {
    const slice = createSlice({
      name: 'user',
      actions: {
        noSteps: {},
        autoSteps: { stepsInFuture: true },
        withSteps: {
          request: {
            reducer: () => {},
            saga: () => {},
          },
          success: {},
          failure: {},
        },
      },
    })

    assert.equal(slice.actions.noSteps(12).type, 'user::noSteps')
    assert.equal(slice.actions.noSteps(12).payload, 12)

    assert.equal(slice.actions.autoSteps(13).type, 'user::autoSteps::request')
    assert.equal(slice.actions.autoSteps(13).payload, 13)

    assert.equal(slice.actions.withSteps(14).type, 'user::withSteps::request')
    assert.equal(slice.actions.withSteps(14).payload, 14)

    assert.equal(slice.actions.withSteps.request(15).type, 'user::withSteps::request')
    assert.equal(slice.actions.withSteps.request(15).payload, 15)

    assert.equal(slice.actions.withSteps.success(15).type, 'user::withSteps::success')
    assert.equal(slice.actions.withSteps.success(15).payload, 15)
  })
})
