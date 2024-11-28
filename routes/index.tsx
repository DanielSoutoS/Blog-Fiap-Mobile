import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { AppRoutes } from './app.routes';
import { GlobalProvider } from '../app/contexts/GlobalContext';
import Menu from '../components/Menu';

export function Routes(){
    return(
        <GlobalProvider>
            <NavigationIndependentTree>
                <NavigationContainer>
                    <Menu />
                    <AppRoutes/>
                </NavigationContainer>
            </NavigationIndependentTree>
        </GlobalProvider>       
    )
}