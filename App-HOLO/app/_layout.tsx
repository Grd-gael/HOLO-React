import { Tabs } from "expo-router";
import { useState } from "react";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: isLoggedIn ? "flex" : "none" },
      }}
    >
      {isLoggedIn ? (
        <>
          <Tabs.Screen name="accueil" options={{ title: "Accueil" }} />
          <Tabs.Screen name="menu" options={{ title: "Profil" }} />
          <Tabs.Screen name="parametres" options={{ title: "Paramètres" }} />
        </>
      ) : (
        <>
          <Tabs.Screen name="connexion" options={{ title: "Connexion" }} />
          <Tabs.Screen name="inscription" options={{ title: "Inscription" }} />
        </>
      )}
    </Tabs>
  );
}
