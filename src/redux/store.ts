// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

// src/redux/reducers.ts
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  // your reducers
});

export default rootReducer;

// src/redux/actions.ts
// Define your action creators here
