import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/AuthenticationSlice";
import loginSlice from "./features/LoginSlice";
import { setupInterceptors } from "./services/authInterceptor";

 const store = configureStore({
  reducer: {
    auth: authReducer,
    login: loginSlice,
  },
});

setupInterceptors(store.getState);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store