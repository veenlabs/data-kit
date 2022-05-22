import { StateService, AsyncService } from '@veen/data-kit'
import { select } from 'redux-saga/effects'
const { faker } = require('@faker-js/faker')

const { createSlice, getSliceSelectors } = StateService

const slice = createSlice({
  name: 'products',
  initialState: {
    animals: ['Monkey', 'Donkey'],
    companies: [],
    users: [],
  },
  selectors: {
    getAnimals: (state) => state.products.animals,
    getCompanies: (state) => state.products.companies,
    getUsers: (state) => state.products.users,
    product1: () => 'product1',
    product2: () => 'product2',
  },
  actions: {
    addAnimal: {
      reducer: (state, action) => {
        state.animals.push(faker.animal.horse())
      },
    },
    addCompany: {
      reducer: (state, action) => {
        state.companies.push(faker.company.companyName())
      },
    },
    addUser: {
      reducer: (state, action) => {
        state.users.push(faker.name.firstName())
      },
    },
    logAnimals: {
      saga: function* (action) {
        const { getAnimals } = getSliceSelectors('products')
        const animals = yield select(getAnimals)
        console.log(animals)
      },
    },
  },
})

export default slice
