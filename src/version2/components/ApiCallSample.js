import React from 'react'
import { AsyncService } from '@veen/data-kit'

const { asyncService, useAsyncServiceStatus } = AsyncService

const ButtonWithStatus = ({ actionName, buttonLabel, data }) => {
  const status = useAsyncServiceStatus(actionName)
  return (
    <div>
      <button
        onClick={async () => {
          let result = await asyncService[actionName](data)
          console.log(result)
        }}>
        {buttonLabel}:: {status}
      </button>
    </div>
  )
}

function NewLogin() {
  return (
    <div>
      <h1>Api Test samples(no redux)</h1>
      <ButtonWithStatus actionName={'authenticate1'} buttonLabel={'authenticate1 (should fail)'} />
      <ButtonWithStatus actionName={'authenticate2'} buttonLabel={'authenticate2 (should fail)'} data={{}} />
      <ButtonWithStatus
        actionName={'authenticate2'}
        buttonLabel={'authenticate2 (should pass)'}
        data={{
          password: '1qazxsw2',
          username: 'dev@notepadeducation.in',
        }}
      />
      <ButtonWithStatus actionName={'getCourses'} buttonLabel={'Get Courses1'} />
      <ButtonWithStatus actionName={'getCourses2'} buttonLabel={'Get Courses2'} />
      <ButtonWithStatus actionName={'getCourses3'} buttonLabel={'Get Courses3 (should fail)'} />
      <ButtonWithStatus actionName={'getCourses4'} buttonLabel={'Get Courses4'} />
    </div>
  )
}

export default NewLogin
