import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { mergedStacks } from './ScreenCollections';

const Stack = createNativeStackNavigator();


const MainNavigator = () => {

    return (
        <Stack.Navigator 
            screenOptions={{
                headerShown : false,
                animation : 'fade_from_bottom'
            }}
        >
            {mergedStacks.map((screen, index)=>{
                return (
                    <Stack.Screen 
                        key={index}
                        name={screen.name}
                        component={screen.component}
                    />
                )
            })}
        </Stack.Navigator>
    )
};

export default MainNavigator;