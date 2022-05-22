import React from 'react'
import { StateService } from '@veen2/data-kit'
import courseSlice from '../data/slices/courses'

console.log(courseSlice.actions.requestonlyReducerWithouStage2())

console.log('--->', courseSlice.actions.getCourses4231())
console.log('--->', courseSlice.actions.getCourses4231.request())
console.log('--->', courseSlice.actions.getCourses4231.request())

const { useActions2, getActions } = StateService

function NewActions() {
  // #### Use getActions

  // const actionSuccess1 = getActions('user:getUser:success')
  // console.log(actionSuccess1('sucData'))
  // // user::getUser::success'

  // // request will be called by default
  // const  requestgetCourses4231q = getActions('courses:getCourses4231')
  // console.log(requestgetCourses4231q('reqData'))
  // courses::getCourses4231::request'

  // same path returns an object too if path has stages
  // const  {request, success, failure} = getActions('courses:getCourses4231')
  // console.log(request('reqData'))
  // courses::getCourses4231::request'
  // console.log(success('sucData'))
  // courses::getCourses4231::success'
  // console.log(failure('failData'))
  // courses::getCourses4231::failure'

  // const  requestonlyReducerWithouStage2 = getActions('courses:onlyReducerWithouStage')
  // console.log(requestonlyReducerWithouStage2('reqData'))
  // courses::onlyReducerWithouStage'

  // // This will fail as onlyReducerWithouStage. Doesn't have any stages
  // const  {request, success, failure} = getActions('courses:onlyReducerWithouStage')

  const actions2 = getActions('courses')
  // const actions = getActions(courseSlice)
  // console.log(actions2.getCourses4231('reqData'))
  // console.log(actions2.getCourses4231.request('reqData'))
  // console.log(actions2.getCourses4231.success('succ-data'))
  // console.log(actions2.onlyReducerWithouStage('onlyReducerWithouStage'))
  // Below one will throw error
  // console.log(actions.onlyReducerWithouStage.request('onlyReducerWithouStage'))

  // #### Use Actions
  const actionSuccess = useActions2('user:getUser:success')
  // user::getUser::success'

  // request will be called by default
  const requestgetCourses4231 = useActions2('courses:getCourses4231')
  // courses::getCourses4231::request'

  // same path returs an object too if path has stages
  const { request, success, failure } = useActions2('courses:getCourses4231')

  const requestonlyReducerWithouStage = useActions2('courses:onlyReducerWithouStage')
  // courses::onlyReducerWithouStage

  const actions = useActions2(courseSlice)
  // const actions = useActions2('courses')
  //actions.getCourses4231('reqData')
  // courses::getCourses4231::request

  //actions.getCourses4231('reqData').request
  // courses::getCourses4231::request

  //actions.getCourses4231('reqData').success
  // courses::getCourses4231::success

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
    </div>
  )
}

export default NewActions

//   const actions = useActions2('user')
//   console.log(actions.authenticate)
