import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from '../components/UI/Input/Input'

describe('Input Component Tests', () => {

  test('Input renders correctly', () => {
    render(<Input label="Name" name="name" placeholder="Enter name" />)
    expect(screen.getByPlaceholderText('Enter name')).toBeTruthy()
  })

  test('Input shows label', () => {
    render(<Input label="Name" name="name" placeholder="Enter name" />)
    expect(screen.getByText('Name')).toBeTruthy()
  })

  test('Input onChange works', () => {
    const handleChange = vi.fn()
    render(<Input label="Name" name="name" placeholder="Enter name" onChange={handleChange} />)
    fireEvent.change(screen.getByPlaceholderText('Enter name'), {
      target: { value: 'Umar' }
    })
    expect(handleChange).toHaveBeenCalled()
  })

})