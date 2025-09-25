import { Button, Label } from "@react-navigation/elements";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View, StyleSheet, Image} from "react-native";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from "@expo-google-fonts/inconsolata";


export default function Accueil() {
  const [fontsLoaded] = useFonts({
    Inconsolata_400Regular,
    Inconsolata_700Bold,
  });

  const router = useRouter();
  return (
    <View>
      <Image source={require('./img/logo-Holo.png')} style={styles.image}/>  
      <View style={styles.view} >
        <View style={styles.box}>
          <Text style={styles.title}>👋 Bienvenue Gaël,</Text>
          <Text style={[styles.paragraphe, { color: "#FFFFFF" }]}>Note ton humeur et sens toi libre de t’exprimer tous les jours pour voir l’évolution tout au long de l’année !</Text>
        </View> 
        <View style={{ justifyContent: "flex-start", alignItems: "center", width: 340, flex:1, }}>
          <Text style={styles.date}>Mardi 23 Septembre</Text>
          <Text style={[styles.paragraphe, { color: "#001E6A", alignSelf: "flex-start" }]}>Aujourd'hui, tu te sens:</Text>     
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

    view:{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 60,
    },


  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    left: 30,
    top: 30,
  },

  box: {
    backgroundColor: "#001E6A",
    width: 340,
    height: 110,
    padding: 15,
    borderRadius: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 10,
    fontFamily: "Inconsolata_700Bold",
  },

  paragraphe: {
    fontSize: 13,
    lineHeight: 13,
    height: 50,
    fontFamily: "Inconsolata_400Regular",
  },

  date: {
      color: "#001E6A",
      textAlign: "center",
      fontSize: 20,
      height: 80,
      textDecorationLine: "underline",
      fontFamily: "Inconsolata_700Bold",
    },



});