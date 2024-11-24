import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { AppRoutes } from './app.routes';
import Menu from '../components/Menu';

export function Routes(){
    return(
        <NavigationIndependentTree>
            <NavigationContainer>
                <Menu />
                <AppRoutes/>
            </NavigationContainer>
        </NavigationIndependentTree>
        
    )
}