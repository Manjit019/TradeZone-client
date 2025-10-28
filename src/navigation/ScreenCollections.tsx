import LoginScreen from "@screens/auth/LoginScreen";
import SplashScreen from "@screens/onboarding/SplashScreen";


export const authStacks = [
    {
        name : 'SplashScreen',
        component : SplashScreen
    },
    {
        name : 'LoginScreen',
        component : LoginScreen
    }
]


export const dashboardStacks = [];

export const mergedStacks = [...authStacks,...dashboardStacks];