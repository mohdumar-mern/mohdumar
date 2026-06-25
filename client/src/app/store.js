import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import projectReducer from "../features/Project/projectSlice";
import skillReducer from "../features/Skills/skillSlice";
import serviceReducer from "../features/service/serviceSlice";
import profileReducer from "../features/Profile/profileSlice";
import contactReducer from "../features/Contact/contactSlice";
import authReducer from "../features/Auth/authSlice";

const isDevelopment = import.meta.env.VITE_REACT_APP_NODE_ENV === "development";


export const store = configureStore({
  reducer: {
    project: projectReducer,
    skill: skillReducer,
    service: serviceReducer,
    profile: profileReducer,
    contact: contactReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    isDevelopment
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
});
