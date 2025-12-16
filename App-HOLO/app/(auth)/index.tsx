import { Link, useRouter} from "expo-router";
import { useState, useEffect } from "react";
import { Button, Label } from "@react-navigation/elements";
import { Text, TextInput, View, StyleSheet, Image, ActivityIndicator, TouchableOpacity} from "react-native";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from "@expo-google-fonts/inconsolata";
import { Asset } from "expo-asset";

export default function Index() {

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


  const router = useRouter();
  return (
    <View style={styles.view} className="main-container">
      <Image source={require('../img/deco-top.png')} style={[styles.image, { position: "absolute", top: 0, left: 0, resizeMode: "contain", height: 382, width: 390, }]} />
      <Image source={require('../img/logo-Holo.png')} style={styles.image} />
      <View style={{paddingLeft: 90, paddingRight: 90, paddingBottom: 150}}>
        <TouchableOpacity style={[styles.button, {backgroundColor: "#001E6A",}]} onPress={() => router.push("./inscription")}><Text style={{fontFamily: "Inconsolata_400Regular", color: "#ffffff"}}>S'inscrire</Text></TouchableOpacity>

        <TouchableOpacity style={[styles.button, {backgroundColor: "#FF6700", borderColor: "#FF6700"}]} onPress={() => router.push("./connexion")}><Text style={{fontFamily: "Inconsolata_400Regular", color: "#ffffff"}}>Se connecter</Text></TouchableOpacity>

      </View>
      <Text style={styles.footerText}>HOLO by Gaël Grandval</Text>
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

  button: {
    marginTop: 20,
    borderRadius: 5,
    width: 240,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inconsolata_700Bold",
  },

  footerText: {
    color: "#001E6A",
    textAlign: "center",
    fontSize: 12,
    bottom: 50,
    fontFamily: "Inconsolata_700Bold",
    },

  link: {
    color: "#FF6700",
    textDecorationLine: "underline",
  },
});