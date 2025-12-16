import { Text, View, Image, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from '@expo-google-fonts/inconsolata';


export default function Profil() {
    const [fontsLoaded] = useFonts({
        Inconsolata_400Regular,
        Inconsolata_700Bold,
    });
  
      const router = useRouter();
    
 return (
    <View>
        <Image source={require('../img/logo-Holo.png')} style={styles.image}/>
        <View style={styles.view} >
            <View style={styles.box}>
                      <Text style={styles.title}>PROFIL</Text>
                      <Text style={[styles.paragraphe, { color: "#FFFFFF" }]}>Consulte et modifie ton profil ici</Text>
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
});