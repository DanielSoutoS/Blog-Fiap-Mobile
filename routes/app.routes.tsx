// import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import  Login  from '../app/screens/Login'
import { Home } from '../app/screens/Home'
import Register from '@/app/screens/Register'


const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes(){
    return(
        <Navigator
            screenOptions={{ headerShown: false}}>    
            <Screen
                name="Home"
                component={Home}/>            
            <Screen
                name="Login"
                component={Login}/>      
            <Screen
                name="Register"
                component={Register}/>       
        </Navigator>
    )
}