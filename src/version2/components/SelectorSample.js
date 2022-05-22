import React from 'react'
import { StateService } from '@veen/data-kit'

const { useSliceSelector, useActions } = StateService

function SelectorSample() {
  const animals = useSliceSelector('products:getAnimals')
  const companies = useSliceSelector('products:getCompanies')
  const users = useSliceSelector('products:getUsers')
  const { product1, product2, getAnimals: animals2 } = useSliceSelector('products')
  const { addAnimal, addCompany, addUser, logAnimals } = useActions('products')
  return (
    <div>
      <h2>Selectors sample</h2>
      <div>{animals.join(' - ')}</div>
      <div>{animals2.join(' - ')}</div>
      <div>{companies.join(' - ')}</div>
      <div>{users.join(' - ')}</div>
      <div>{product1}</div>
      <div>{product2}</div>
      <h3>Actions</h3>
      <button onClick={addAnimal}>addAnimal</button>
      <button onClick={addCompany}>addCompany</button>
      <button onClick={addUser}>addUser</button>
      <button onClick={logAnimals}>logAnimals</button>
    </div>
  )
}

export default SelectorSample
