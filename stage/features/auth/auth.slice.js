import { createSlice } from '@reduxjs/toolkit'

const initState = {
  user: {},
  isLoading: false
}
const authSlice = createSlice({
  name: '/authSlice',
  initialState: initState,
  reducers: {
    loginData: (state, action) => {
      state.user = action.payload
    },
    registerData:  (state, action) => {
      state.user = action.payload
    }
  }
})

export const { loginData, registerData } = authSlice.actions
export default authSlice.reducer
