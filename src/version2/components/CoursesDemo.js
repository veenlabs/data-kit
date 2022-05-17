import React from 'react'
import coursesSlice from '../data/slices/courses'
import { StateService } from '@veen/data-kit'

const { useActions, useStateSelector } = StateService
function Courses() {
  const { getCourses4 } = useActions(coursesSlice)
  return (
    <div>
      <h1>Courses</h1>
      <button onClick={getCourses4}>getCourses4</button>
    </div>
  )
}

export default Courses
