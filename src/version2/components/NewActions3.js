import React from 'react'
import { StateService } from '@veen/data-kit'
import courseSlice from '../data/slices/courses'

const { useActions, getActions } = StateService

function NewActions() {
  // // #### Use getActions

  // const actionSuccess1 = getActions('user:getUser:success')
  // console.log(actionSuccess1('sucData'))
  // // user::getUser::success'

  // // request will be called by default
  // const  requestgetCourses4231q = getActions('courses:getCourses4231')
  // console.log(requestgetCourses4231q('reqData'))
  // // courses::getCourses4231::request'

  // // // same path returns an object too if path has stages
  // // const  {request, success, failure} = getActions('courses:getCourses4231')
  // // console.log(request('reqData'))
  // // // courses::getCourses4231::request'
  // // console.log(success('sucData'))
  // // // courses::getCourses4231::success'
  // // console.log(failure('failData'))
  // // // courses::getCourses4231::failure'

  // const  requestonlyReducerWithouStage2 = getActions('courses:onlyReducerWithouStage')
  // console.log(requestonlyReducerWithouStage2('reqData'))
  // // courses::onlyReducerWithouStage'

  // // // // This will fail as onlyReducerWithouStage. Doesn't have any stages
  // // const  {request, success, failure} = getActions('courses:onlyReducerWithouStage')
  // // console.log(request === undefined, true)

  // const actions2 = getActions('courses')
  // // const actions2 = getActions(courseSlice)
  // console.log(actions2.getCourses4231('reqData'))
  // console.log(actions2.getCourses4231.request('reqData'))
  // console.log(actions2.getCourses4231.success('succ-data'))
  // console.log(actions2.onlyReducerWithouStage('onlyReducerWithouStage'))
  // // Below one will throw error
  // // console.log(actions2.onlyReducerWithouStage.request('onlyReducerWithouStage'))

  // // #### Use Actions
  const actionSuccess = useActions('user:getUser:success')
  // // user::getUser::success'

  // request will be called by default
  const requestgetCourses4231 = useActions('courses:getCourses4231')
  // courses::getCourses4231::request'

  // same path returs an object too if path has stages
  const { request, success, failure } = useActions('courses:getCourses4231')

  const requestonlyReducerWithouStage = useActions('courses:onlyReducerWithouStage')
  // courses::onlyReducerWithouStage

  // const actions = useActions(courseSlice)
  const actions = useActions('courses')
  //actions.getCourses4231('reqData')
  // courses::getCourses4231::request

  //actions.getCourses4231('reqData').request
  // courses::getCourses4231::request

  //actions.getCourses4231('reqData').success
  // courses::getCourses4231::success

  const userActions = useActions('user')
  const courseInvlaidAction = useActions('courses:invalidAction')
  const courseInvlaidAction2 = useActions('courses:invalidAction:foo')

  return (
    <div>
      <h1>Actions</h1>
      <button onClick={actionSuccess}>
        actionSuccess <br /> user::getUser::success
      </button>
      <button onClick={requestgetCourses4231}>
        requestgetCourses4231 <br /> getCourses4231::request
      </button>
      <button onClick={request}>
        courses:getCourses4231 <br /> courses::getCourses4231::request
      </button>
      <button onClick={failure}>
        courses:getCourses4231 <br /> courses::getCourses4231::failure
      </button>
      <button onClick={requestonlyReducerWithouStage}>
        requestonlyReducerWithouStage <br /> courses::onlyReducerWithouStage
      </button>
      <button onClick={() => actions.getCourses4231('reqData')}>
        actions.getCourses4231 <br /> courses::getCourses4231::request
      </button>
      <button onClick={() => actions.getCourses4231.request('reqData')}>
        actions.getCourses4231('reqData').request <br /> courses::getCourses4231::request
      </button>

      <button onClick={() => actions.getCourses4231.success('reqData')}>
        actions.getCourses4231('reqData').success <br /> courses::getCourses4231::success
      </button>

      <button onClick={() => actions.getCourses4231.failure('reqData')}>
        actions.getCourses4231('reqData').failure <br /> courses::getCourses4231::failure
      </button>

      <button onClick={userActions.invalid}>userActions.invalid</button>
      <button onClick={userActions.invalid.level2}>userActions.invalid.level2</button>

      <button onClick={courseInvlaidAction}>courses:invalidAction</button>

      <button onClick={courseInvlaidAction2}>courses:invalidAction:foo</button>
    </div>
  )
}

export default NewActions

// console.log(courseSlice.actions.getCourses4231('1'))
// console.log(courseSlice.actions.getCourses4231.request('2'))
// console.log(courseSlice.actions.getCourses4231.success('2'))
// console.log(courseSlice.actions.onlyReducerWithouStage('3'))

// console.log(courseSlice.actions.abc('1'))
// console.log('-->',courseSlice.actions.ABC.request())//('2'))
// console.log(courseSlice.actions.ABC.success('2'))
// console.log(courseSlice.actions.onlyReducerWithouStage('3'))
