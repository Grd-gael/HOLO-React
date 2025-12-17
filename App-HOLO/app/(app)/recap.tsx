import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from '@expo-google-fonts/inconsolata';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "@/services/api";

export default function Recap() {
  const [fontsLoaded] = useFonts({
    Inconsolata_400Regular,
    Inconsolata_700Bold,
  });

  interface Mood {
  _id?: string;
  id_user?: string;
  date: string;
  humor: string;
  comment?: string;
}


  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          setLoading(false);
          return;
        }
        const response = await api.get(`/mood/list/${userId}`);
        if (response.ok) {
          setMoods(response.data || []);
        } else {
          console.warn("Erreur API : ", response.message);
        }
      } catch (error) {
        console.error("Erreur fetch moods :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMoods();
  }, []);

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#001E6A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../img/logo-Holo.png')} style={styles.image} />
      <View style={styles.view}>
        <View style={styles.box}>
          <Text style={styles.title}>RECAP</Text>
          <Text style={[styles.paragraphe, { color: "#FFFFFF" }]}>Consulte ton récapitulatif de l'année</Text>
        </View>

        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
          {moods.length === 0 ? (
            <Text style={{ color: '#666', textAlign: 'center', marginTop: 20 }}>Aucune humeur enregistrée</Text>
          ) : (
            moods.map((mood) => {
              const date = new Date(mood.date).toLocaleDateString();
              return (
                <View key={mood._id || mood._id || Math.random().toString()} style={styles.moodItem}>
                  <Text style={styles.moodDate}>{date}</Text>
                  <Text style={styles.moodHumor}>Humeur : {mood.humor}</Text>
                  {mood.comment ? <Text style={styles.moodComment}>Commentaire : {mood.comment}</Text> : null}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
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
    marginBottom: 20,
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

  moodItem: {
    backgroundColor: "#E0E7FF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    width: 340,
  },
  moodDate: {
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Inconsolata_700Bold",
  },
  moodHumor: {
    marginBottom: 5,
    fontFamily: "Inconsolata_400Regular",
  },
  moodComment: {
    fontStyle: "italic",
    fontFamily: "Inconsolata_400Regular",
  },
});
