import { Text, View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Pressable, Modal, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from '@expo-google-fonts/inconsolata';
import { use, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "@/context/authContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Asset } from "expo-asset";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";


export default function Profil() {
    const [fontsLoaded] = useFonts({
        Inconsolata_400Regular,
        Inconsolata_700Bold,
    });

    const [username, setusername] = useState<string | null>(null);
    const [lastLogin, setLastLogin] = useState<Date | null>(null);
    const [createdAt, setCreatedAt] = useState<Date | null>(null);
    const [avatar, setAvatar] = useState<string>("normal.png");
    const [isReady, setIsReady] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { logout } = useAuth();
    
    const avatars: Record<string, any> = {
        normal: require("../img/profil_avatar/normal.png"),
        cool: require("../img/profil_avatar/cool.png"),
        goofy: require("../img/profil_avatar/goofy.png"),
        girly : require("../img/profil_avatar/girly.png"),
    };


    const handleLogout = () => {
        logout();
        router.replace('../(auth)/');
    }



     useEffect(() => {
      const loadUser = async () => {
        const username = await AsyncStorage.getItem("username");
        const lastLoginString = await AsyncStorage.getItem("lastLogin");
        const createdAtString = await AsyncStorage.getItem("createdAt");
        const avatar = await AsyncStorage.getItem("avatar");
        setAvatar(avatar ?? "normal");
        setLastLogin(lastLoginString ? new Date(lastLoginString) : null);
        setusername(username);
        setCreatedAt(createdAtString ? new Date(createdAtString) : null);
      };

      async function loadAssets() {
        await Asset.loadAsync([
          require("../img/deco-top.png"),
          require("../img/logo-Holo.png"),
          require("../img/deco-bottom.png"),
          require("../img/profil_avatar/normal.png"),
          require("../img/profil_avatar/cool.png"),
          require("../img/profil_avatar/goofy.png"),
          require("../img/profil_avatar/girly.png"),
        ]);
        setIsReady(true);
      }
    
      loadUser();
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
    <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.paragraphe}>Choisis ton avatar :</Text>
                <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap", marginTop: -30 }}>
                    <Pressable onPress={async () => {
                        setAvatar("normal");
                        await AsyncStorage.setItem('avatar', "normal");
                    }}>
                        <Image source={avatars["normal"]} style={{ width: 80, height: 80, borderRadius: 80, borderColor: avatar === "normal" ? "#001E6A" : "transparent", borderWidth: 2 }} />
                    </Pressable>
                    <Pressable onPress={async () => {
                        setAvatar("cool");
                        await AsyncStorage.setItem('avatar', "cool");
                    }}>
                        <Image source={avatars["cool"]} style={{ width: 80, height: 80, borderRadius: 80, borderColor: avatar === "cool" ? "#001E6A" : "transparent", borderWidth: 2 }} />
                    </Pressable>
                    <Pressable onPress={async () => {
                        setAvatar("goofy");
                        await AsyncStorage.setItem('avatar', "goofy");
                    }}>
                        <Image source={avatars["goofy"]} style={{ width: 80, height: 80, borderRadius: 80, borderColor: avatar === "goofy" ? "#001E6A" : "transparent", borderWidth: 2 }} />
                    </Pressable>
                    <Pressable onPress={async () => {
                        setAvatar("girly");
                        await AsyncStorage.setItem('avatar', "girly");
                    }}>
                        <Image source={avatars["girly"]} style={{ width: 80, height: 80, borderRadius: 80, borderColor: avatar === "girly" ? "#001E6A" : "transparent", borderWidth: 2 }} />
                    </Pressable>
                    
                    </View>
                    <TouchableOpacity
                    style={{
                    backgroundColor: "#001E6A",
                    paddingVertical: 15,
                    paddingHorizontal: 120,
                    borderRadius: 10,
                    width: 340,
                    }}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={{ color: "#FFFFFF", fontSize: 16, fontFamily: "Inconsolata_700Bold" }}>Enregistrer</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Image source={require('@/app/img/logo-Holo.png')} style={styles.image}/>
        <View style={styles.view}>
            <TouchableOpacity onPress ={() => setModalVisible(true)}>
                <Image source={avatars[avatar]} style={styles.photoProfil}/>
                <FontAwesome5 name="pen" size={24} color="#001E6A" style={{ position: "absolute", top: 110, right: 100, backgroundColor: "#ffffff", borderRadius: 25, padding: 10, borderWidth: 1, borderColor: "#001E6A"     }} />
            </TouchableOpacity>

            <Text style={[styles.title, { color: "#001E6A" }]}>{username}</Text>
            <Text style={[styles.paragraphe, { color: "#001E6A" }]}>Membre depuis le {createdAt ? createdAt.toLocaleDateString("fr-FR") : "N/A"}</Text>
            <Text style={[styles.paragraphe, { color: "#001E6A", marginTop: 10 }]}>Gère tes informations personnelles et tes préférences ici.</Text>
            <TouchableOpacity style={styles.logoutButton} onPress = {handleLogout}>
                <FontAwesome name="sign-out" size={20} color="#ee0000" />
                <Text style={{ color: "#ee0000" }}>Se déconnecter</Text>
            </TouchableOpacity>
        </View>
    </View>
 );
}


const styles = StyleSheet.create({

    view:{
        justifyContent: "space-between",
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

    photoProfil: {
        width: 150,
        height: 150,
        borderRadius: 150,
        marginBottom: 10,
        borderColor: "#001E6A",
        borderWidth: 2,
    },

  title: {
    color: "#001E6A",
    fontSize: 30,
    marginBottom: 8,
    fontFamily: "Inconsolata_700Bold",
  },

  paragraphe: {
    fontSize: 13,
    lineHeight: 14,
    height: 50,
    fontFamily: "Inconsolata_400Regular",
  },
    logoutButton: { 
        borderColor: "#ee0000",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10
    },


    // modal styles

centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#001E6A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    gap: 20,
  },
});