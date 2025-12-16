import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function TabsLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "flex", backgroundColor: "#FFFFFF" },
        tabBarActiveTintColor: "#001E6A",
        tabBarInactiveTintColor: "#999999",
      }}
  >
          <Tabs.Screen name="accueil" options={{ title: "Accueil", tabBarIcon: ({ color, size }) => <FontAwesome name="home" color={color} size={size} /> }} />
          <Tabs.Screen name="recap" options={{ title: "Recap", tabBarIcon: ({ color, size }) => <FontAwesome name="list" color={color} size={size} /> }} />
          <Tabs.Screen name="profil" options={{ title: "Profil", tabBarIcon: ({ color, size }) => <FontAwesome name="user" color={color} size={size} /> }} />
          
    </Tabs>
  );
}

