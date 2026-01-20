import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/AuthSlice";
import loginSlice from "./features/LoginSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    login: loginSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
