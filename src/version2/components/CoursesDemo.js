import React from 'react'
import coursesSlice from '../data/slices/courses'
import { StateService } from '@veen2/data-kit'

const { useActions, useStateSelector } = StateService
function Courses() {
  const { getCourses4, getCourses4231, getCourses3, onlyReducerWithouStage, onlySagaWithouStage } = useActions(coursesSlice)
  return (
    <div>
      <h1>Courses</h1>
      <button onClick={getCourses4}>getCourses4</button>
      <button onClick={getCourses4.success}>getCourses4:success</button>
      <button onClick={getCourses4231}>getCourses4231:Not Working</button>
      <button onClick={getCourses3}>getCourses3:FAIL: Error saga not working</button>
      <button onClick={onlyReducerWithouStage}>onlyReducerWithouStage</button>
      <button onClick={onlySagaWithouStage}>onlySagaWithouStage</button>
    </div>
  )
}

export default Courses
