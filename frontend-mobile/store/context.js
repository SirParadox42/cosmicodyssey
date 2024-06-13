import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const context = createContext({isLoggedIn: false, token: null, userId: null, login() {}, logout() {}});

export function ContextProvider({children}) {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const login = (token, userId, image) => {
        setToken(token);
        setUserId(userId);
        AsyncStorage.setItem('userData', JSON.stringify({token, userId, image}));
    };
    const logout = () => {
        setToken(null);
        setUserId(null);
        AsyncStorage.removeItem('userData');
    };

    useEffect(() => {
        const getStoredData = async() => {
            const storedData = await AsyncStorage.getItem('userData');

            if (storedData) {
                const parsedData = JSON.parse(storedData);
                login(parsedData.token, parsedData.userId);
            }
        };

        getStoredData();
    }, []);
    
    return (
        <context.Provider value={{isLoggedIn: !!token, token, userId, login, logout}}>
            {children}
        </context.Provider>
    );
}