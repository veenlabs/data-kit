import React from 'react'
import { useStateSelector } from '@veenlabs/data-kit/state-service'

function CourseList() {
  const courses = useStateSelector('courses:courseList')

  if (courses.lenght < 1) {
    return null
  }
  return (
    <div>
      {courses.map((c) => (
        <div key={c}>{c}</div>
      ))}
    </div>
  )
}

export default CourseList
