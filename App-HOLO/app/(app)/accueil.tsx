import { Button, Label } from "@react-navigation/elements";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, Image, TouchableOpacity} from "react-native";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from "@expo-google-fonts/inconsolata";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Accueil() {
  const [fontsLoaded] = useFonts({
    Inconsolata_400Regular,
    Inconsolata_700Bold,
  });

  const [email, setEmail] = useState<string | null>(null);
  const [lastLogin, setLastLogin] = useState<Date | null>(null);

  useEffect(() => {
  const loadUser = async () => {
    const email = await AsyncStorage.getItem("email");
    const lastLoginString = await AsyncStorage.getItem("lastLogin");
    setLastLogin(lastLoginString ? new Date(lastLoginString) : null);
    setEmail(email);
  };

  loadUser();
}, []);

  const router = useRouter();
  return (
    <View>
      <Image source={require('../img/logo-Holo.png')} style={styles.image}/>  
      <View style={styles.view} >
        <View style={styles.box}>
          <Text style={styles.title}>👋 Bienvenue {email},</Text>
          <Text style={[styles.paragraphe, { color: "#FFFFFF" }]}>Note ton humeur et sens toi libre de t’exprimer tous les jours pour voir ton évolution tout au long de l’année !</Text>
        </View> 
        <View style={{ justifyContent: "flex-start", alignItems: "center", width: 340, flex:1, }}>
          <Text style={styles.date}>Mardi 23 Septembre</Text>
          <Text style={[styles.paragraphe, { color: "#001E6A", alignSelf: "flex-start" }]}>Aujourd'hui, tu te sens:</Text>
          <View style={{ flexDirection: "row", gap: 20, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <TouchableOpacity style={styles.choiceBox}>
              <Image source={require('../img/logo-Holo.png')} style={ styles.choiceBoxImage}/>
              <Text style={{ textAlign: "center", fontFamily: "Inconsolata_400Regular" }}>Heureux</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.choiceBox}>
              <Image source={require('../img/logo-Holo.png')} style={ styles.choiceBoxImage}/>
              <Text style={{ textAlign: "center", fontFamily: "Inconsolata_400Regular" }}>Triste</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.choiceBox}>
              <Image source={require('../img/logo-Holo.png')} style={ styles.choiceBoxImage}/>
              <Text style={{ textAlign: "center", fontFamily: "Inconsolata_400Regular" }}>Anxieux</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.choiceBox}>
              <Image source={require('../img/logo-Holo.png')} style={styles.choiceBoxImage}/>
              <Text style={{ textAlign: "center", fontFamily: "Inconsolata_400Regular" }}>En colère</Text>
            </TouchableOpacity>
          </View>     
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
    marginBottom: 8,
    fontFamily: "Inconsolata_700Bold",
  },

  paragraphe: {
    fontSize: 13,
    lineHeight: 14,
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

  choiceBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 120,
    resizeMode: "contain",
    borderColor: "#001E6A",
    borderWidth: 2,
    borderRadius: 15,
  },

  choiceBoxImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

});