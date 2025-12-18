import { Link, useRouter} from "expo-router";
import { useState, useEffect } from "react";
import { Button, Label } from "@react-navigation/elements";
import { Text, TextInput, View, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from "react-native";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from "@expo-google-fonts/inconsolata";
import { Asset } from "expo-asset";
import { useAuth } from "@/context/authContext";

import api from "../../services/api";
import FontAwesome5 from "@expo/vector-icons/build/FontAwesome5";
  
export default function Inscription() {

  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameBorderColor, setUsernameBorderColor] = useState("#001E6A");
  const [passwordBorderColor, setPasswordBorderColor] = useState("#001E6A");
  const [confirmPasswordBorderColor, setConfirmPasswordBorderColor] = useState("#001E6A");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [iconPassword, setIconPassword] = useState("eye");
  const [iconConfirmPassword, setIconConfirmPassword] = useState("eye");
  const { login } = useAuth();


  const [fontsLoaded] = useFonts({
    Inconsolata_400Regular,
    Inconsolata_700Bold,
  });

const [isReady, setIsReady] = useState(false);

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


  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      setConfirmPasswordBorderColor("red");
      setPasswordBorderColor("#001E6A");
      setUsernameBorderColor("#001E6A");
      return;
    }
    else {
      setConfirmPasswordBorderColor("#001E6A");
    }
    try { 
      const response  = await api.post("/user/inscription", {
        username,
        password
      });
      if (response.ok) {
        console.log(response.data);
        await login(response.data._id, response.data.username, response.data.last_login_at, response.data.createdAt, response.data.avatar);
        router.replace("/(app)/accueil");
      } else {
        if (response.code === "USERNAME_REQUIRED") {
          setUsernameBorderColor("red");
          setPasswordBorderColor("#001E6A");
          setConfirmPasswordBorderColor("#001E6A");
        } else {
          setUsernameBorderColor("#001E6A");
        }
        if (response.code === "PASSWORD_REQUIRED") {
          setPasswordBorderColor("red");
          setUsernameBorderColor("#001E6A");
          setConfirmPasswordBorderColor("#001E6A");
        } else {
          setPasswordBorderColor("#001E6A");
        }
        if (response.code === "USER_ALREADY_EXISTS") {
          setUsernameBorderColor("red");
          setConfirmPasswordBorderColor("#001E6A");
          setPasswordBorderColor("#001E6A");
        } else {
          setUsernameBorderColor("#001E6A");
        }
        Alert.alert("Erreur", response.message || "Problème lors de l'inscription");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se connecter au serveur");
    }
  };

  const router = useRouter();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
    <View style={styles.view} className="main-container">
        <Image source={require('../img/deco-top.png')} style={[styles.image, { position: "absolute", top: 0, left: 0, resizeMode: "contain", height: 382, width: 390, }]} />
        <Image source={require('../img/logo-Holo.png')} style={styles.image} />
        <View style={{paddingLeft: 90, paddingRight: 90, paddingBottom: 110}}>
          <Link href='/' style={[styles.backText, { textDecorationLine: "underline" }]}> &lt; Retour</Link>
          <Text style={styles.title}>Inscription</Text>

          <Label style={styles.label}>Nom d'utilisateur</Label>
          <TextInput inputMode="email"placeholder="Nom d'utilisateur" style={[styles.input, { borderColor: usernameBorderColor, boxShadow : "0 0 3px " + usernameBorderColor }]} placeholderTextColor= "rgba(0, 30, 106, 0.5)" value={username} onChangeText={setusername} />

          <Label style={styles.label} >Mot de passe</Label>
          <TextInput placeholder="Mot de passe" style={[styles.input, { borderColor: passwordBorderColor, boxShadow : "0 0 3px " + passwordBorderColor }]} placeholderTextColor= "rgba(0, 30, 106, 0.5)" secureTextEntry={hidePassword} value={password} onChangeText={setPassword} />
          <TouchableOpacity style={{ position: "absolute", right: 100, top: 170, paddingVertical: 10 }} onPress={() => {
            setHidePassword(!hidePassword);
            setIconPassword(iconPassword === "eye" ? "eye-slash" : "eye");
          }}>
            <FontAwesome5 name={iconPassword} size={20} color="#001E6A" />
          </TouchableOpacity>

          <Label style={styles.label} >Confirmer le Mot de passe</Label>
          <TextInput id="confirmPassword" placeholder="Confirmer le mot de passe" style={[styles.input, { borderColor: confirmPasswordBorderColor, boxShadow : "0 0 3px " + confirmPasswordBorderColor }]} placeholderTextColor= "rgba(0, 30, 106, 0.5)" secureTextEntry={hideConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword}/>
          <TouchableOpacity style={{ position: "absolute", right: 100, top: 255, paddingVertical: 10 }} onPress={() => {
            setHideConfirmPassword(!hideConfirmPassword);
            setIconConfirmPassword(iconConfirmPassword === "eye" ? "eye-slash" : "eye");
          }}>
            <FontAwesome5 name={iconConfirmPassword} size={20} color="#001E6A" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button]} onPress={handleRegister}><Text style={{fontFamily: "Inconsolata_400Regular", color: "#ffffff"}}>Valider</Text></TouchableOpacity>
          <Text style={styles.footerText}>Déjà un compte ? <Link href="./connexion" style={styles.link}>Connectez-vous</Link></Text>

        </View>
        <Image source={require('../img/deco-bottom.png')} style={[styles.image, { position: "absolute", bottom: 0, right: 0, resizeMode: "contain", height: 365, width: 390, }]} />
        </View>
        </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({


  view:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap:0,
      },

  image: {
    width: 130,
    height: 130,
    marginBottom: -22,
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

  label: {
    alignSelf: "flex-start",
    marginTop: 10,
    color: "#001E6A",
    fontFamily: "Inconsolata_400Regular",
  },


    title: {
        fontSize: 24,
        color: "#001E6A",
        marginBottom: 0,
        fontFamily: "Inconsolata_700Bold",
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