import { Redirect } from "expo-router";
import { useAuth } from "../context/authContext";

export default function Index() {
  const { isLoggedIn } = useAuth();

  return (
    <Redirect
      href={isLoggedIn ? "/(app)/accueil" : "/(auth)"}
    />
  );
}