import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './index.js'
export const store = () => {
  return configureStore({
    reducer:rootReducer,
  })
}

