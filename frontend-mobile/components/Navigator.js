import {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import Posts from '../screens/Posts';
import NewPost from '../screens/NewPost';
import Supernova from '../screens/Supernova';
import BlackHole from '../screens/BlackHole';
import UpdatePost from '../screens/UpdatePost';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Logout from './Logout';
import {context} from '../store/context';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function Tabs() {
  return (
    <BottomTabs.Navigator screenOptions={{headerStyle: {backgroundColor: '#090b44'}, headerTitleStyle: {fontFamily: 'SpaceGrotesk'}, headerTintColor: 'white', tabBarStyle: {backgroundColor: '#090b44'}, tabBarActiveTintColor: 'white', headerRight: () => <Logout/>}}>
      <BottomTabs.Screen name='Posts' component={Posts} options={{tabBarIcon: ({size, color}) => <Ionicons name='home' size={size} color={color}/>}}/>
      <BottomTabs.Screen name='New Post' component={NewPost} options={{tabBarIcon: ({size, color}) => <Ionicons name='add' size={size} color={color}/>}}/>
      <BottomTabs.Screen name='Supernova' component={Supernova} options={{tabBarIcon: ({size, color}) => <Ionicons name='flame' size={size} color={color}/>}}/>
      <BottomTabs.Screen name='Black Hole' component={BlackHole} options={{tabBarIcon: ({size, color}) => <Ionicons name='radio-button-on' size={size} color={color}/>}}/>
    </BottomTabs.Navigator>
  );
}

export default function Navigator() {
    const ctx = useContext(context);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: '#090b44'}, headerTitleStyle: {fontFamily: 'SpaceGrotesk'}, headerTintColor: 'white', contentStyle: {backgroundColor: '#c8d7f8'}, headerRight: ctx.isLoggedIn ? () => <Logout/> : () => {}}}>
                {!ctx.isLoggedIn && (
                    <>
                        <Stack.Screen name='Login' component={Login}/>
                        <Stack.Screen name='Signup' component={Signup}/>
                    </>
                )}
                {ctx.isLoggedIn && (
                    <>
                        <Stack.Screen name='Tabs' component={Tabs} options={{headerShown: false}}/>
                        <Stack.Screen name='Update Post' component={UpdatePost}/>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}