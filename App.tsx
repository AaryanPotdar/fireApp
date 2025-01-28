import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from './app/context/ThemeContext'
import { useTheme } from './app/context/ThemeContext'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import List from './app/screens/List';
import Details from './app/screens/Details';

const Stack = createNativeStackNavigator()

export default function App() {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen 
                        name="My Todos" 
                        component={List}
                        options={{
                            headerRight: () => <ThemeToggle />
                        }}
                    />
                    <Stack.Screen name="Details" component={Details} />
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    )
}

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <Pressable onPress={toggleTheme} style={{ marginRight: 15 }}>
            <Ionicons 
                name={theme === 'light' ? 'moon' : 'sunny'} 
                size={24} 
                color={theme === 'light' ? '#1E293B' : '#1E293B'} 
            />
        </Pressable>
    );
};
