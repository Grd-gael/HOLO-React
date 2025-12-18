import { Text, View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Pressable, Modal, TextInput, Alert } from "react-native";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useFonts, Inconsolata_400Regular, Inconsolata_700Bold } from '@expo-google-fonts/inconsolata';
import { use, useCallback, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "@/context/authContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Asset } from "expo-asset";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import api from "@/services/api";


export default function Profil() {
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
    
    
      

    const [username, setusername] = useState<string | null>("");
    const [moods, setMoods] = useState<Mood[]>([]);
    const [newUsername, setNewUsername] = useState<string>("");
    const [usernameModalVisible, setUsernameModalVisible] = useState(false);
    const [lastLogin, setLastLogin] = useState<Date | null>(null);
    const [createdAt, setCreatedAt] = useState<Date | null>(null);
    const [avatar, setAvatar] = useState<string>("normal.png");
    const [isReady, setIsReady] = useState(false);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
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

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Confirmer la suppression",
            "Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        const userID = await AsyncStorage.getItem("userId");
                        const response = await api.delete(`/user/${userID}`);
                        if (response.ok){
                            logout();
                            router.replace('../(auth)/');
                            Alert.alert("Compte supprimé", "Ton compte a été supprimé avec succès.");
                        }
                        else {
                            Alert.alert("Erreur", response.message || "Problème lors de la suppression du compte");
                        }
                    }
                }
            ]
        );
    }

    const editAvatar = async (newAvatar : string) => {
        const userID = await AsyncStorage.getItem("userId");
        const response = await api.put(`/user/${userID}/avatar`, {
          avatar: newAvatar,
        });
        if (response.ok){
            setAvatar(newAvatar);
            await AsyncStorage.setItem('avatar', newAvatar);
        }
        else {
            Alert.alert("Erreur", response.message || "Problème lors de l'inscription");
        }
    }

    const editUsername = async (newUsername : string) => {
        const userID = await AsyncStorage.getItem("userId");

        if (newUsername.trim() === "") {
            Alert.alert("Erreur", "Le nom d'utilisateur ne peut pas être vide.");
            return;
        }

        const response = await api.put(`/user/${userID}/username`, {
          username: newUsername,
        });
        if (response.ok){
            setusername(newUsername);
            await AsyncStorage.setItem('username', newUsername);
            setUsernameModalVisible(false);
        }
        else {
            Alert.alert("Erreur", "Ce nom d'utilisateur est déjà pris.");
        }
    }

    const loadMoods = async () => {
        const userID = await AsyncStorage.getItem("userId");
        const response = await api.get(`/mood/list/${userID}`);
        if (response.ok) {
          setMoods(response.data);
        } else {
          Alert.alert("Erreur", "Problème lors du chargement des humeurs");
        }
      };



     useEffect(() => {
      const loadUser = async () => {
        const userID = await AsyncStorage.getItem("userId");
        const username = await AsyncStorage.getItem("username");
        setNewUsername(username ?? "");
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
    
    loadMoods();
    loadUser();
    loadAssets();

    }, []);

    useFocusEffect(
            useCallback(() => {
                loadMoods();
            }, [])
        );
    
  
    if (!isReady) {
      return (
        <View style={styles.view}>
          <ActivityIndicator size="large" color="#001E6A" />
        </View>
      );
    }


    const moodCounts = moods.reduce<Record<string, number>>((acc, mood) => {
        acc[mood.humor] = (acc[mood.humor] || 0) + 1;
        return acc;
        }, {});


  
    const router = useRouter();
    
 return (
    <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={avatarModalVisible}
          onRequestClose={() => {
            setAvatarModalVisible(!avatarModalVisible);
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
                    onPress={() => 
                    [setAvatarModalVisible(!avatarModalVisible), editAvatar(avatar)]
                    }>
                    <Text style={{ color: "#FFFFFF", fontSize: 16, fontFamily: "Inconsolata_700Bold" }}>Enregistrer</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={usernameModalVisible}
          onRequestClose={() => {
            setUsernameModalVisible(!usernameModalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.paragraphe}>Choisis ton nom d'utilisateur :</Text>
                <View style={ {marginTop: -30 }}>
                    <TextInput
                    placeholder="Nouveau nom d'utilisateur"
                    value={newUsername}
                    placeholderTextColor= "rgba(0, 30, 106, 0.5)"
                    style={{
                        height: 40,
                        width: 240,
                        marginBottom: 12,
                        marginTop: 5,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 5,
                        borderColor: "#001E6A",
                        fontFamily: "Inconsolata_400Regular",
                    }}
                    onChangeText={setNewUsername}
                    />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <TouchableOpacity
                    style={{
                    backgroundColor: "#ee0000",
                    paddingVertical: 15,
                    paddingHorizontal: 50,
                    borderRadius: 10,
                    }}
                    onPress={() => 
                    [setUsernameModalVisible(!usernameModalVisible)]
                    }>
                    <Text style={{ color: "#FFFFFF", fontSize: 16, fontFamily: "Inconsolata_700Bold" }}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{
                    backgroundColor: "#001E6A",
                    paddingVertical: 15,
                    paddingHorizontal: 50,
                    borderRadius: 10,
                    }}
                    onPress={() => 
                    [editUsername(newUsername)]
                    }>
                    <Text style={{ color: "#FFFFFF", fontSize: 16, fontFamily: "Inconsolata_700Bold" }}>Enregistrer</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>
        </Modal>
        <Image source={require('@/app/img/logo-Holo.png')} style={styles.image}/>
        <TouchableOpacity style={{ position: "absolute", top: 50, right: 30 }} onPress ={handleDeleteAccount}>
            <FontAwesome5 name="trash-alt" size={30} color="#ee0000" />
        </TouchableOpacity>
        <View style={styles.view}>
            <TouchableOpacity onPress ={() => setAvatarModalVisible(true)}>
                <Image source={avatars[avatar]} style={styles.photoProfil}/>
                <FontAwesome5 name="pen" size={24} color="#001E6A" style={{ position: "absolute", top: 110, right: 0, backgroundColor: "#ffffff", borderRadius: 25, padding: 10, borderWidth: 1, borderColor: "#001E6A"     }} />
            </TouchableOpacity>

            <Text style={[styles.title, { color: "#001E6A" }]}>{username} 
                <TouchableOpacity  onPress ={() => setUsernameModalVisible(true)}>
                    <FontAwesome5 name="pen" size={18} color="#001E6A" style={{ marginLeft: 10 }}/>
                </TouchableOpacity>
            </Text>
            <Text style={[styles.paragraphe, { color: "#001E6A", marginBottom: -30 }]}>Membre depuis le {createdAt ? createdAt.toLocaleDateString("fr-FR") : "N/A"}</Text>

                <Text style={styles.information}>
                Nombre d'humeurs enregistrées: {moods.length}
                </Text>

                <View style={{ marginTop: 10, alignSelf: "flex-start", marginLeft: 20 }}>
                <Text style={[styles.paragraphe, {lineHeight: 20}]}><FontAwesome5 name="grin-beam" size={14} color="#001E6A" /> Heureux : {moodCounts.happy || 0} jour{moodCounts.happy > 1 ? "s" : ""}</Text>
                <Text style={[styles.paragraphe, {lineHeight: 20}]}><FontAwesome5 name="frown" size={14} color="#001E6A" /> Triste : {moodCounts.sad || 0} jour{moodCounts.sad > 1 ? "s" : ""}</Text>
                <Text style={[styles.paragraphe, {lineHeight: 20}]}><FontAwesome5 name="grimace" size={14} color="#001E6A" /> Anxieux : {moodCounts.anxious || 0} jour{moodCounts.anxious > 1 ? "s" : ""}</Text>
                <Text style={[styles.paragraphe, {lineHeight: 20}]}><FontAwesome5 name="angry" size={14} color="#001E6A" /> En colère : {moodCounts.angry || 0} jour{moodCounts.angry > 1 ? "s" : ""}</Text>
                </View>            
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
    information: {
        fontSize: 14,
        fontFamily: "Inconsolata_400Regular",
        backgroundColor: "#001E6A",
        color: "#FFFFFF",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
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