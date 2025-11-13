import '@testing-library/jest-dom'

// Mock localStorage
const store = {}

const localStorageMock = {
  getItem: (key) => {
    return store[key] || null
  },
  setItem: (key, value) => {
    store[key] = value.toString()
  },
  removeItem: (key) => {
    delete store[key]
  },
  clear: () => {
    Object.keys(store).forEach((key) => {
      delete store[key]
    })
  },
  key: (index) => {
    const keys = Object.keys(store)
    return keys[index] || null
  },
  get length() {
    return Object.keys(store).length
  },
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})