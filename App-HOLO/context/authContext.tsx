import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
  login: (userId: string, username: string, lastLogin: string, createdAt: string, avatar: string) => {},
  logout: () => {}
});

export const AuthProvider =({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('token').then((res) => {
            setIsLoggedIn(res !== null);
        })
    }, [])

    const login = async (userId : string, username : string, lastLogin : string, createdAt : string, avatar : string) => {
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('username', username);
        if (lastLogin && typeof lastLogin === 'string') {
            await AsyncStorage.setItem('lastLogin', lastLogin);
        }

        if (createdAt && typeof createdAt === 'string') {
            await AsyncStorage.setItem('createdAt', createdAt);
        }
        await AsyncStorage.setItem('avatar', avatar ?? "normal");
        setIsLoggedIn(true);
    }

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('lastLogin');
        await AsyncStorage.removeItem('createdAt');
        await AsyncStorage.removeItem('avatar');
        await AsyncStorage.removeItem('userId');
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