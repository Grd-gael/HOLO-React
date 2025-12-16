import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name='index' options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name='connexion' options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name='inscription' options={{ headerShown: false, animation: 'none' }} />
        </Stack>
    )
}