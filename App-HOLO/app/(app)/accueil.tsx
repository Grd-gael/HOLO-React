import { Button, Label } from "@react-navigation/elements";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert} from "react-native";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from "@expo-google-fonts/inconsolata";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Asset } from "expo-asset";
import api from "@/services/api";


export default function Accueil() {
  const [fontsLoaded] = useFonts({
    Inconsolata_400Regular,
    Inconsolata_700Bold,
  });

  const [username, setUsername] = useState<string | null>(null);
  const [lastLogin, setLastLogin] = useState<Date | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);
  const [humor, setHumor] = useState<string | null>(null);
  const [comment, setComment] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);


  const saveMood = (humor: string | null, comment: string | null) => async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const date = new Date();
      const response = await api.post("/mood/add", {
        id_user: userId,
        date,
        humor,
        comment,
      });

      if (response.ok) {
        Alert.alert("Succès", "Ton humeur a été enregistrée !");
        setPressed(null);
        setHumor(null);
        setComment(null);
      } else {
        Alert.alert("Erreur", response.message || "Problème lors de l'enregistrement de ton humeur");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'humeur :", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de l'enregistrement de ton humeur");
    }
  };


  const handlePress = (box : number) => {
    if (pressed === box) {
      setPressed(null);
      setHumor(null);
      return;
    }
    if (box === 1) {
      setHumor("happy");
    } else if (box === 2) {
      setHumor("sad");
    } else if (box === 3) {
      setHumor("anxious");
    } else if (box === 4) {
      setHumor("angry");
    }
    setPressed(box);
  };

  const DateToday = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = today.toLocaleDateString("fr-FR", options);

    return date.charAt(0).toUpperCase() + date.slice(1);
  }

  useEffect(() => {
  const loadUser = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem("username");
      const lastLoginString = await AsyncStorage.getItem("lastLogin");

      setUsername(savedUsername);
      setLastLogin(lastLoginString ? new Date(lastLoginString) : null);
    } catch (e) {
      console.error("Erreur chargement utilisateur", e);
    } finally {
      
      setIsReady(true); 
    }
  };

  loadUser();
}, []);

    useFocusEffect(
  useCallback(() => {
    const loadUser = async () => {
      const username = await AsyncStorage.getItem("username");
      setUsername(username);
    };

    loadUser();
  }, [])
);
  
    if (!isReady) {
      return (
        <View style={styles.view}>
          <ActivityIndicator size="large" color="#001E6A" />
        </View>
      );
    }

  const router = useRouter();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAwareScrollView 
     style={{ flex: 1, backgroundColor: "#FFFFFF" }}
    enableOnAndroid={true}
    extraScrollHeight={20} >
    <View>
      <Image source={require('../img/logo-Holo.png')} style={styles.image}/>  
      <TouchableOpacity style={{ position: "absolute", top: 50, right: 30, padding: 10, borderRadius: 10 }} onPress = {() => router.push('/profil')}>
            <FontAwesome5 name="user-circle" size={24} color="#001E6A" />
      </TouchableOpacity>

      <View style={styles.view} >
        <View style={styles.box}>
          <Text style={styles.title}>👋 Bonjour {username},</Text>
          <Text style={[styles.paragraphe, { color: "#FFFFFF" }]}>Note ton humeur et sens toi libre de t’exprimer tous les jours pour voir ton évolution tout au long de l’année !</Text>
        </View> 
        <View style={{ display: "flex", justifyContent : "flex-start", alignItems: "center"}}>
          <Text style={styles.date}>{DateToday()}</Text>
          <Text style={[styles.paragraphe, { color: "#001E6A", alignSelf: "flex-start" }]}>Aujourd'hui, tu te sens:</Text>
          <View style={{ flexDirection: "row", gap: 20, marginTop: -20, flexWrap: "wrap", justifyContent: "center" }}>
            <TouchableOpacity style={[styles.choiceBox, pressed === 1 && { borderColor: "#FF6700" }]} onPress={() => handlePress(1)}>
              <FontAwesome5 name="grin-beam" size={60} style={[styles.choiceBoxImage, pressed === 1 && { color: "#FF6700" }]}/>
              <Text style={{ textAlign: "center", fontFamily: "Inconsolata_400Regular", color: pressed === 1 ? "#FF6700" : "#001E6A" }}>Heureux</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.choiceBox, pressed === 2 && { borderColor: "#9e44edff" }]} onPress={() => handlePress(2)}>
              <FontAwesome5 name="frown" size={60} style={[styles.choiceBoxImage, pressed === 2 && { color: "#9e44edff" }]}/>
              <Text style={{ textAlign: "center", fontFamily: "Inconsolata_400Regular", color: pressed === 2 ? "#9e44edff" : "#001E6A" }}>Triste</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.choiceBox, pressed === 3 && { borderColor: "#1aa810ff" }]} onPress={() => handlePress(3)}>
              <FontAwesome5 name="grimace" size={60} style={[styles.choiceBoxImage, pressed === 3 && { color: "#1aa810ff" }]}/>
              <Text style={{ textAlign: "center", fontFamily: "Inconsolata_400Regular", color: pressed === 3 ? "#1aa810ff" : "#001E6A" }}>Anxieux</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.choiceBox, pressed === 4 && { borderColor: "#ed1717ff" }]} onPress={() => handlePress(4)}>
              <FontAwesome5 name="angry" size={60} style={[styles.choiceBoxImage, pressed === 4 && { color: "#ed1717ff" }]}/>
              <Text style={{ textAlign: "center", fontFamily: "Inconsolata_400Regular", color: pressed === 4 ? "#ed1717ff" : "#001E6A" }}>En colère</Text>
            </TouchableOpacity>
          </View>  
          <Text style={[styles.paragraphe, { color: "#001E6A", alignSelf: "flex-start",  marginTop: 30 }]}>Ajouter un commentaire ?</Text> 
            <TextInput
            placeholder="Écris ton commentaire ici..."
            placeholderTextColor= "rgba(0, 30, 106, 0.5)"
              style={{
                height: 80,
                width: 340,
                marginTop:-20,
                marginBottom: 20,
                borderColor: "#001E6A",
                borderWidth: 2,
                borderRadius: 10,
                padding: 10,
                fontFamily: "Inconsolata_400Regular",
                textAlignVertical: "top",
              }}
              multiline
              numberOfLines={4}
              value={comment??""}
              onChangeText={setComment}
            /> 
          <TouchableOpacity
            style={{
              backgroundColor: "#001E6A",
              paddingVertical: 15,
              paddingHorizontal: 120,
              borderRadius: 10,
              width: 340,
            }}
            onPress={saveMood(humor, comment)}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontFamily: "Inconsolata_700Bold" }}>Enregistrer</Text>
          </TouchableOpacity>
          
        </View>
        
      </View>
    </View>
    </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({

    view:{
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 40,
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
    fontSize: 15,
    lineHeight: 16,
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
      marginBottom: -30,
    },

  choiceBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 100,
    borderColor: "#001E6A",
    borderWidth: 2,
    borderRadius: 15,
  },

  choiceBoxImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    color: "#001E6A",
  },

});