import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from '@expo-google-fonts/inconsolata';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from "react";
import api from "@/services/api";
import FontAwesome5 from "@expo/vector-icons/build/FontAwesome5";

export default function Recap() {
  const [fontsLoaded] = useFonts({
    Inconsolata_400Regular,
    Inconsolata_700Bold,
  });

  const humeurs = {
  happy: "heureux",
  sad: "triste",
  angry: "en colère",
  anxious: "anxieux",
} as const;

  interface Mood {
  _id?: string;
  id_user?: string;
  date: string;
  humor: keyof typeof humeurs;
  comment?: string;
}


  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);

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

useFocusEffect(
        useCallback(() => {
            fetchMoods();
        }, [])
    );

    const router = useRouter(); 
    
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#001E6A" />
      </View>
    );
  }

      const moodsByYearMonth = moods.reduce((acc, mood) => {
      const date = new Date(mood.date);
      const year = date.getFullYear();
      const month = date.toLocaleDateString("fr-FR", { month: "long" });

      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = [];

      acc[year][month].push(mood);
      return acc;
    }, {} as Record<number, Record<string, typeof moods>>);


  return (
    <View style={styles.container}>
      <Image source={require('../img/logo-Holo.png')} style={styles.image} />
      <TouchableOpacity style={{ position: "absolute", top: 50, right: 30, padding: 10, borderRadius: 10 }} onPress = {() => router.push('/profil')}>
            <FontAwesome5 name="user-circle" size={24} color="#001E6A" />
      </TouchableOpacity>
      <View style={styles.view}>


        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {Object.keys(moodsByYearMonth).length === 0 ? (
            <Text style={styles.empty}>Aucune humeur enregistrée</Text>
          ) : (
            Object.entries(moodsByYearMonth)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([year, months]) => (
                <View key={year} style={styles.yearBlock}>
                  <Text style={styles.yearTitle}>{year}</Text>

                  {Object.entries(months).sort((a, b) => {
                    const monthOrder = [
                      "décembre", "novembre", "octobre", "septembre", "août", "juillet",
                      "juin", "mai", "avril", "mars", "février", "janvier"      
                    ];
                    return monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0]);
                  }).map(([month, monthMoods]) => (
                    <View key={month} style={styles.monthBlock}>
                      <Text style={styles.monthTitle}>{month}</Text>

                      {monthMoods.sort((a, b) => new Date(b.date).getDate() - new Date(a.date).getDate()).map((mood) => {
                        const day = new Date(mood.date).getDate();

                        return (
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10}} key={mood._id}>
                          <Text style={styles.moodDay}>{day < 10 ? `0${day}` : day}</Text>

                          <View key={mood._id} style={[styles.moodCard, { borderLeftColor:
                            mood.humor === "happy" ? "#FF6700" :
                            mood.humor === "sad" ? "#3fd6d9ff" :
                            mood.humor === "angry" ? "#ed1717ff" :
                            mood.humor === "anxious" ? "#9e44edff" : "#ffffff"
                          }]}>

                            <Text style={styles.moodHumor}>
                              {humeurs[mood.humor]}
                            </Text>

                            {mood.comment ? (
                              <Text style={styles.moodComment}>
                                “{mood.comment}”
                              </Text>
                            ) : null}
                          </View>
                        </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              ))
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

  empty: {
  textAlign: "center",
  marginTop: 30,
  color: "#666",
  fontFamily: "Inconsolata_400Regular",
},

yearBlock: {
  marginBottom: 30,
  paddingHorizontal: 20,
},

yearTitle: {
  fontSize: 22,
  color: "#001E6A",
  fontFamily: "Inconsolata_700Bold",
  marginBottom: 10,
},

monthBlock: {
  marginBottom: 20,
  gap: 15,
},

monthTitle: {
  fontSize: 16,
  textTransform: "capitalize",
  color: "#001E6A",
  marginVertical: 10,
  fontFamily: "Inconsolata_700Bold",
},

moodCard: {
  backgroundColor: "#F4F6FB",
  borderRadius: 15,
  width: 270,
  padding: 15,
  shadowColor: "#001e6a",
  shadowOpacity: 0.08,
  shadowRadius: 5,
  elevation: 2,
  borderLeftWidth: 5,
},

moodDay: {
  fontSize: 20,
  color: "#888",
  fontFamily: "Inconsolata_400Regular",
},

moodHumor: {
  fontSize: 16,
  color: "#001E6A",
  fontFamily: "Inconsolata_700Bold",
},

moodComment: {
  marginTop: 6,
  fontSize: 13,
  color: "#444",
  fontStyle: "italic",
  fontFamily: "Inconsolata_400Regular",
},

});
