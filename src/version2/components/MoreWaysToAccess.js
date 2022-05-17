import React from 'react'
import { StateService } from '@veen/data-kit'
const { useActions } = StateService

function MoreWaysToAccess() {
  // const getCourses1 = useActions('courses:getCourses4')
  const { getCourses4 } = useActions('courses')
  const { justReducer } = useActions('courses')
  const getCourses1 = useActions('courses:getCourses4')
  const getCourses2 = useActions('courses:getCourses4:request')
  return (
    <div>
      <h2>MoreWaysToAccess</h2>
      <button onClick={getCourses4}>getCourses4</button>
      <button onClick={getCourses1}>getCourses1</button>
      <button onClick={getCourses2}>getCourses2</button>
      <button onClick={justReducer}>justReducer</button>
    </div>
  )
}

export default MoreWaysToAccess
