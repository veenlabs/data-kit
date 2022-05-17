import React from 'react'
import { AsyncService } from '@veen/data-kit'

const { asyncService, useAsyncServiceStatus } = AsyncService

const ButtonWithStatus = ({ actionName, buttonLabel, data }) => {
  const status = useAsyncServiceStatus(actionName)
  return (
    <div>
      <h3>
        {actionName}:: {status}
      </h3>
      <div>
        <button
          onClick={async () => {
            let result = await asyncService[actionName](data)
            console.log(result)
          }}>
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}

function NewLogin() {
  return (
    <div>
      <h1>Api Test samples(no redux)</h1>
      <ButtonWithStatus actionName={'getCourses'} buttonLabel={'Get Courses1'} />
      <ButtonWithStatus actionName={'getCourses2'} buttonLabel={'Get Courses2'} />
      <ButtonWithStatus actionName={'getCourses3'} buttonLabel={'Get Courses3 (should fail)'} />
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
    </div>
  )
}

export default NewLogin
