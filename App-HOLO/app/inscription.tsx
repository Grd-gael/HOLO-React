import { Link, useRouter} from "expo-router";
import { useState, useEffect } from "react";
import { Button, Label } from "@react-navigation/elements";
import { Text, TextInput, View, StyleSheet, Image, ActivityIndicator, Alert} from "react-native";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from "@expo-google-fonts/inconsolata";
import { Asset } from "expo-asset";
import api from "../services/api";
  
export default function Inscription() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fontsLoaded] = useFonts({
    Inconsolata_400Regular,
    Inconsolata_700Bold,
  });

const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      await Asset.loadAsync([
        require("./img/deco-top.png"),
        require("./img/logo-Holo.png"),
        require("./img/deco-bottom.png"),
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
    try {
      console.log(email, password, confirmPassword);
      const { response } = await api.post("/user/inscription", {
        email,
        password,
        confirmPassword,
      });

      console.log(response);

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succès", "Inscription réussie !");
      } else {
        Alert.alert("Erreur", data.message || "Problème lors de l'inscription");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se connecter au serveur");
    }
  };


  const router = useRouter();
  return (
    <View style={styles.view} className="main-container">
        <Image source={require('./img/deco-top.png')} style={[styles.image, { position: "absolute", top: 0, left: 0, resizeMode: "contain", height: 382, width: 390, }]} />
        <Image source={require('./img/logo-Holo.png')} style={styles.image} />
        <View style={{paddingLeft: 90, paddingRight: 90, paddingBottom: 110}}>
          <Link href="/" style={[styles.backText, { textDecorationLine: "underline" }]}> &lt; Retour</Link>
          <Text style={styles.title}>Inscription</Text>

          <Label style={styles.label}>Email</Label>
          <TextInput inputMode="email" placeholder="Email" style={styles.input} placeholderTextColor= "rgba(0, 30, 106, 0.5)" value={email} onChangeText={setEmail} />

          <Label style={styles.label} >Mot de passe</Label>
          <TextInput placeholder="Mot de passe" style={styles.input} placeholderTextColor= "rgba(0, 30, 106, 0.5)" secureTextEntry={true} value={password} onChangeText={setPassword} />

          <Label style={styles.label} >Confirmer le Mot de passe</Label>
          <TextInput placeholder="Confirmer le mot de passe" style={styles.input} placeholderTextColor= "rgba(0, 30, 106, 0.5)" secureTextEntry={true} value={confirmPassword} onChangeText={setConfirmPassword} />

          <Button style={styles.button} color="#ffffff" onPress={handleRegister}><Text style={{fontFamily: "Inconsolata_400Regular"}}>Valider</Text></Button>
          <Text style={styles.footerText}>Déjà un compte ? <Link href="/connexion" style={styles.link}>Connectez-vous</Link></Text>

        </View>
        <Image source={require('./img/deco-bottom.png')} style={[styles.image, { position: "absolute", bottom: 0, right: 0, resizeMode: "contain", height: 365, width: 390, }]} />
        </View>
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