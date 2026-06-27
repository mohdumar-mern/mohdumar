import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { store } from '../app/store'
import App from '../App'

describe('App Tests', () => {
  test('App renders without crashing', () => {
    render(
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    )
    expect(document.body).toBeTruthy()
  })
})