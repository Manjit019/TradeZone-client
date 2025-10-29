

import { combineReducers } from "redux";
import { userSlice } from "./reducers/userSlice";

const rootReducer = combineReducers({
    user : userSlice.reducer,
});

export default rootReducer;