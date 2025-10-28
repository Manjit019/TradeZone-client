import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import MainNavigator from "./MainNavigator"
import { Colors } from "@constants/Colors"
import { navigationRef } from "@utils/NavigationUtil"


const Navigation = () => {

    const MyTheme = {
        ...DefaultTheme,
        colors : {
            ...DefaultTheme.colors,
            primary :  Colors.themeColor,
            background : Colors.background,
            card : Colors.card,
            text : Colors.text,
            border : Colors.border,
            notification : Colors.notification_card,
        }
    }

    return (
        <NavigationContainer ref={navigationRef} theme={MyTheme}>
            <MainNavigator />
        </NavigationContainer>
    )
}

export default Navigation;
