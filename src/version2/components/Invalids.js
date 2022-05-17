import React from 'react'
import userSlice from '../data/slices/user'
import { StateService } from '@veen/data-kit'

const { useActions, useSliceSelector, useSliceSelector2, useReset } = StateService

function Invalids() {
  const { inValidAction } = useActions(userSlice)
  const { getInvalidData } = useSliceSelector(userSlice)
  const invoice = useSliceSelector2('user:invoices')

  return (
    <div>
      <h1>Invalids</h1>
      <button onClick={inValidAction}>inValidAction</button>
      <div>getInvalidData: {getInvalidData}</div>
      <div>invoice: {getInvalidData}</div>
    </div>
  )
}

export default Invalids
