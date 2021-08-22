import { createSlice } from "@reduxjs/toolkit";

const localToken = localStorage.getItem('token');
const localIsLoggedIn = !!localToken;
let logoutTimer;

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjustedExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjustedExpirationTime - currentTime;

    return remainingDuration;
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localToken,
        isLoggedIn: localIsLoggedIn,
    },
    reducers: {
        logout(state) {
            state.token = '';
            state.isLoggedIn = false;
            localStorage.removeItem('token');
            if(logoutTimer) {
                clearTimeout(logoutTimer);
            }
        },
        login(state, action) {
            state.token = action.payload.token;
            state.isLoggedIn = true;
            const remainingTime = calculateRemainingTime(action.payload.expirationTime);

            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('expirationTime', remainingTime);
            
            logoutTimer = setTimeout(() => { 
                localStorage.removeItem('token');
            }, remainingTime);
        },
        saveLoginToken(state, action) {
            state.token = action.payload
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice;