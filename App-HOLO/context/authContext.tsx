import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
  login: (username: string, token: string, lastLogin: Date, createdAt: Date, avatar: string) => {},
  logout: () => {}
});

export const AuthProvider =({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('token').then((res) => {
            setIsLoggedIn(res !== null);
        })
    }, [])

    const login = async (username : string, token : string, lastLogin : Date, createdAt : Date, avatar : string) => {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('lastLogin', lastLogin.toISOString());
        await AsyncStorage.setItem('createdAt', createdAt.toISOString()); 
        await AsyncStorage.setItem('avatar', avatar ?? "normal");
        setIsLoggedIn(true);
    }

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('lastLogin');
        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx;
};