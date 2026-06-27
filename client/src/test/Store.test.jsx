import { describe, test, expect } from 'vitest'
import { store } from '../app/store'

describe('Redux Store Tests', () => {

  test('Store initializes correctly', () => {
    const state = store.getState()
    expect(state).toBeTruthy()
  })

  test('Project state exists', () => {
    expect(store.getState().project).toBeDefined()
  })

  test('Skill state exists', () => {
    expect(store.getState().skill).toBeDefined()
  })

  test('Service state exists', () => {
    expect(store.getState().service).toBeDefined()
  })

  test('Profile state exists', () => {
    expect(store.getState().profile).toBeDefined()
  })

  test('Contact state exists', () => {
    expect(store.getState().contact).toBeDefined()
  })

  test('Auth state exists', () => {
    expect(store.getState().auth).toBeDefined()
  })

})