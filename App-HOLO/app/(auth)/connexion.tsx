import { Link, useRouter} from "expo-router";
import { useState, useEffect } from "react";
import { Button, Label } from "@react-navigation/elements";
import { Text, TextInput, View, StyleSheet, Image, ActivityIndicator, Alert} from "react-native";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from "@expo-google-fonts/inconsolata";
import { Asset } from "expo-asset";
import api from "@/services/api";
import { useAuth } from "@/context/authContext";

export default function Connexion() {

    const [fontsLoaded] = useFonts({
    Inconsolata_400Regular,
    Inconsolata_700Bold,
  });

  const [isReady, setIsReady] = useState(false);
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordBorderColor, setPasswordBorderColor] = useState("#001E6A");
  const [usernameBorderColor, setusernameBorderColor] = useState("#001E6A");
  const { login } = useAuth();
  


   useEffect(() => {
      async function loadAssets() {
        await Asset.loadAsync([
          require("../img/deco-top.png"),
          require("../img/logo-Holo.png"),
          require("../img/deco-bottom.png"),
        ]);
        setIsReady(true);
      }
      loadAssets();
    }, []);
  
    if (!isReady) {
      return (
        <View style={styles.view}>
          <ActivityIndicator size="large" color="#001E6A" />
        </View>
      );
    }

    const handleConnexion = async () => {
      try {
        const response = await api.post("/user/connexion", {
          username,
          password,
        });

        if (response.code == "INVALID_USER"){
          Alert.alert("Erreur", "Adresse username invalide");
          setusernameBorderColor("red");
        } else {
          setusernameBorderColor("#001E6A");
        }
        if (response.code == "PASSWORD_INVALID"){
          Alert.alert("Erreur", "Mot de passe invalide");
          setPasswordBorderColor("red");
        } else {
          setPasswordBorderColor("#001E6A");
        }

        if (response.ok){
          login(response.data.username, response.data.password, new Date(response.data.last_login_at), new Date(response.data.createdAt), response.data.avatar);
          router.replace("/(app)/accueil");
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
      }
    }


  const router = useRouter();
  return (
    <View style={styles.view} className="main-container">
      <Image source={require('../img/deco-top.png')} style={[styles.image, { position: "absolute", top: 0, left: 0, resizeMode: "contain", height: 382, width: 390, }]} />
      <Image source={require('../img/logo-Holo.png')} style={styles.image} />
      <View style={{paddingLeft: 90, paddingRight: 90, paddingBottom: 150, position: "relative", top: -40}}>
        <Link href="/" style={[styles.backText, { textDecorationLine: "underline" }]}> &lt; Retour</Link>
        <Text style={styles.title}>Connexion</Text>
        <Label style={styles.label}>Nom d'utilisateur</Label>
        <TextInput inputMode="email" placeholder="Nom d'utilisateur" onChangeText={setusername} style={[styles.input, { borderColor: usernameBorderColor, boxShadow : "0 0 3px " + usernameBorderColor }]} placeholderTextColor= "rgba(0, 30, 106, 0.5)"/>
        <Label style={styles.label} >Mot de passe</Label>
        <TextInput placeholder="Mot de passe" style={[styles.input, { borderColor: passwordBorderColor, boxShadow : "0 0 3px " + passwordBorderColor }]} onChangeText={setPassword} placeholderTextColor= "rgba(0, 30, 106, 0.5)" secureTextEntry={true} />
        <Button style={styles.button} color="#ffffff" onPress={handleConnexion}>Valider</Button>
        <Text style={styles.footerText}>Pas de compte ? <Link href="./inscription" style={styles.link}>Inscrivez-vous</Link></Text>
      </View>
      <Image source={require('../img/deco-bottom.png')} style={[styles.image, { position: "absolute", bottom: 0, right: 0, resizeMode: "contain", height: 365, width: 390, }]} />
    </View>
  );
}

const styles = StyleSheet.create({


  view:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },

  image: {
    width: 130,
    height: 130,
    marginBottom: 0,
    resizeMode: "contain",
    zIndex: -1,
  },

  backText: {
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 20,
    color: "#001E6A",
    fontFamily: "Inconsolata_400Regular",
  },

  title: {
    fontSize: 24,
    fontFamily: "Inconsolata_700Bold",
    color: "#001E6A",
    marginBottom: 0,
  },

  label: {
    alignSelf: "flex-start",
    marginTop: 10,
    color: "#001E6A",
    fontFamily: "Inconsolata_400Regular",
  },

  input: {
    height: 40,
    width: 240,
    marginBottom: 12,
    marginTop: 5,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#001E6A",
    boxShadow : "0 0 3px #001E6A",
    fontFamily: "Inconsolata_400Regular",
  },


  button: {
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: "#001E6A",
    width: 240,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    marginTop: 10,
    color: "#001E6A",
    textAlign: "right",
    fontSize: 12,
    fontFamily: "Inconsolata_400Regular",
  },

  link: {
    color: "#FF6700",
    textDecorationLine: "underline",
  },
});