import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import ENDPOINT_URL from '../../environments/ENDPOINT_URL';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { Keyboard } from 'react-native';
import { useTranslation } from "react-i18next";
import "../../i18n";
import ErrorModal from '../../Components/ModalError';



export default function InscriptionTuteur() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const [errorTitle, seterrorTitle] = useState('error1');
  const [errorMessage, setErrorMessage] = useState("An error has occurred.");
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [matricules, setMatricules] = useState([]);
  const [input, setInput] = useState('');
  const { t } = useTranslation();
  const handleAddMatricule = () => {
    if (input && !matricules.includes(input)) {
      setMatricules([...matricules, input]);
      setInput('');
    }
  };


  const showError = (title, message) => {
    seterrorTitle(title);
    setErrorMessage(message);
    setModalVisible(true);
  };


  const handleRemoveMatricule = (matricule) => {
    setMatricules(matricules.filter(item => item !== matricule));
  };

 
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleInscriptionTuteur = async () => {
    if (!prenom ) {
      showError("Error", "Veuillez saisir votre prénom.");
      return;
    }
    if (!nom ) {
      showError("Error", "Veuillez saisir votre nom.");
      return;
    }
    if (!email ) {
      showError("Error", "Veuillez saisir votre adresse email.");
      return;
    }
    if (!phone ) {
      showError("Error", "Veuillez saisir votre numéro de téléphone.");
      return;
    }
    // setLoading(true);

    // try {
    //   const req = await axios.post(`${ENDPOINT_URL}InscriptionTuteur`, {
    //     email: email,
    //     password: password,
    //   });

    //   if (req.status === 200) {
    //     setLoading(false);
    //     await AsyncStorage.setItem('Token', req.data.data.token);
    //     await AsyncStorage.setItem('created_at', req.data.data.user.created_at);
    //     await AsyncStorage.setItem('user_type', 
    //       req.data.data.user.user_type || "NotAdmin"
    //     );

    //     setModalVisible(false);
    //     setModalVisible(false);
    //   }
    //   if (req.status === 204) {
    //     setLoading(false);
    //     setMessageError("Nous traitons actuellement votre demande d'accès.");
    //     setModalVisible(true);
    //   }

    // } catch (error) {
    //   setLoading(false);
    //   setMessageError("Erreur lors de la connexion");
    //   setModalVisible(true);
    // }
  }




  
  useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
              setIsKeyboardVisible(true);
          }
      );
      const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
              setIsKeyboardVisible(false);
          }
      );

      return () => {
          keyboardDidHideListener.remove();
          keyboardDidShowListener.remove();
      };
  }, []);




 
   const [fontsLoaded] = useFonts({
      'JomoFont': require('../../fonts/Jomolhari-Regular.ttf'),
      'Inter': require('../../fonts2/SFPRODISPLAYREGULAR.ttf'), 
      'InterBold' : require('../../fonts2/SFPRODISPLAYBOLD.ttf'),
      'InterMedium' : require('../../fonts2/SFPRODISPLAYMEDIUM.ttf')
    });

              if (!fontsLoaded) {
                return null;
              }

  return (
    <>
      
     
      <ErrorModal 
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible}
        errorTitle={errorTitle}
        errorMessage={errorMessage}
      />


      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ImageBackground
          source={require('../../assets/gradient2.png')}
          style={styles.background}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} >
          <View style={styles.overlay}>

            <Text style={styles.title}>
              {t("inscTuteur1")}
            </Text>
            <Text style={styles.subtitle}>
              {t("inscTuteur2")}
            </Text>

            <View style={styles.inputsRow}>
                <View style={styles.inputContainer2}>
                    <Text style={styles.inputLabel}>
                      {t("FirstName")}&nbsp;&nbsp;<Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                    style={styles.input777}
                    placeholder={t("enterFName")}
                    placeholderTextColor="gray"
                    value={prenom}
                    onChangeText={setPrenom}
                    />
                </View>

                <View style={styles.inputContainer2}>
                    <Text style={styles.inputLabel}>
                      {t("LastName")}&nbsp;&nbsp;<Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                    style={styles.input777}
                    placeholder={t("enterLName")}
                    placeholderTextColor="gray"
                    value={nom}
                    onChangeText={setNom}
                    />
                </View>
            </View>


            <View style={styles.inputContainer}>
              <Text style={styles.inputPassword}>
                {t("email")}&nbsp;&nbsp;<Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={t("enterEmail")}
                    placeholderTextColor="gray"
                    value={email}
                    onChangeText={setEmail}
                />
              </View>
            </View>


            <View style={styles.inputContainer}>
              <Text style={styles.inputPassword}>
                {t("phone")}&nbsp;&nbsp;<Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={t("enterPhone")}
                    placeholderTextColor="gray"
                    value={phone}
                    onChangeText={setPhone}
                />
              </View>
            </View>



            <View style={styles.inputContainer}>
              <Text style={styles.inputPassword}>
                {t("residence")}&nbsp;&nbsp;<Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={t("enterResidence")}
                    placeholderTextColor="gray"
                    value={location}
                    onChangeText={setLocation}
                />
              </View>
            </View>



            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t("matrciulesAsUIV")}&nbsp;&nbsp;<Text style={styles.required}>*</Text></Text>
              <View style={{
                flexDirection : "row"
              }}>
                <TextInput
                  style={styles.input2222}
                  value={input}
                  onChangeText={setInput}
                  placeholder={t("enterMatAS")}
                />
                <TouchableOpacity style={styles.plusButton} onPress={handleAddMatricule}>
                  <Ionicons name="add" size={35} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.tagsWrapper}>
                {matricules.map((matricule, index) => (
                  <TouchableOpacity onPress={() => handleRemoveMatricule(matricule)} key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{matricule}</Text>
                    <View >
                      <Text style={styles.removeTag}>
                        <Ionicons name="close" size={19} color="#15A389" />
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

     
            
             {
              !isKeyboardVisible && 
              <View style={styles.lastContainer}>
              <TouchableOpacity 
                style={[styles.button, 
                  { opacity: loading ? 0.29 : 1 }
                ]}
                onPress={handleInscriptionTuteur}
                disabled={loading}
              >
                {loading ? (
                  <Text style={
                    [
                     styles.buttonText,
                     { color: loading ?"rgb(2, 39, 19)" : "white" }
                    ]}
                   >
                    {t('SiggingUp1')}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      {t("SignUp1")}
                    </Text>
                    <Ionicons name="chevron-forward" size={19} color="#fff" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.signupTextButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.signupText}>
                  {t("alreadyAccount")}&nbsp;&nbsp;<Text style={styles.signupLink}>{t("connectAccount")}</Text>
                </Text>
              </TouchableOpacity>
            </View>
             }
           
          </View>
          </ScrollView>
        </ImageBackground>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: screenWidth,
    height: screenHeight + 40,
    backgroundColor: "#fff",
  },
  overlay: {
    flex: 1,
    padding: 30,
    paddingBottom: 0,
    paddingTop: 40,
    marginBottom: 0,  
  },
  backgroundLoogogooo: {
    position: "absolute",
    top: 20,
    width: "100%",
    alignItems: "center",
    left: 30,
  },
  imageLogoHaut: {
    width: 144,
    resizeMode: 'contain',
    aspectRatio: 1,
  },
  title: {
    fontFamily: 'JomoFont',
    fontSize: 30,
    color: '#15A389',
    marginBottom : -10
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: '#141414',
    paddingLeft: 3,
    letterSpacing : -0.3, 
    marginBottom: 39,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputsRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 8,  
  },
  
  inputContainer2: {
    flex: 1, 
    marginBottom: 18,
  },
  inputLabel: {
    fontFamily: 'InterBold',
    fontSize: 15,
    color: "#545454",
    marginBottom: 12,
  },
  required: {
    color: '#078871',
    fontWeight: "bold"
  },
  input777 : {
    backgroundColor: '#fff',
    borderRadius: 100,
    height: 50,
    paddingHorizontal: 25,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    fontFamily: 'Inter',
  },
  input2222 : {
    backgroundColor: '#fff',
    borderRadius: 100,
    height: 50,
    paddingHorizontal: 25,
    fontSize: 14,
    flex : 1, 
    marginRight : 9, 
    borderWidth: 1,
    borderColor: "#f0f0f0",
    fontFamily: 'Inter',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 100,
    height: 50,
    paddingHorizontal: 25,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    fontFamily: 'Inter',
  },
  lastContainer: {
    width: "100%",
    marginTop: 'auto',
    paddingBottom : 20

  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#15B99B",
    borderRadius: 90,
    height: 55,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 7,
  },
  signupText: {
    fontFamily: 'Inter',
    fontSize: 13.5,
    color: '#141414',
    textAlign: 'center',
    marginTop: 15,
  },
  signupLink: {
    color:"rgb(6, 116, 95)",
    textDecorationLine : "underline"
  },
  centeredView: {
    position: "absolute",
    top: 0, 
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 40, 26, 0.8)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 14,
    textAlign: "center",
    color: "#000",
  },
  btnModel: {
    borderRadius: 11,
    padding: 10,
  },
  buttonClose: {
    backgroundColor: "#15B99B",
  },
  textStyle: {
    color: "white"
  },
  passwordContainer: {
    position: "relative"
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: 16
  },
  passwordForgotInput  : {
    fontSize: 13,
    paddingRight : 5, 
    fontFamily: 'Inter',
    color : "#078871",
    textDecorationLine : "underline"
  },

  passwordForgotContainer : {
    alignItems: "flex-end",
    height: "auto",
    width : "100%", 
  }, 

  buttonForgotPassword : {
    height : 40,
    width : 240,
    alignItems : "flex-end"  
  },
  inputPassword: {
    fontSize: 15,
    color: "#545454",
    marginBottom: 12,
    fontFamily : "InterBold"
  },
  input2: {
    backgroundColor: '#fff',
    borderRadius: 100,
    height: 50,
    paddingRight: 40,
    paddingLeft: 25,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    width: "100%",
  }, 
  plusButton: {
    backgroundColor: '#15A389',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 60, 
  },
  plusText: {
    color: '#fff',
    height : 45,
    width : 45, 
    borderRadius : 50
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#ebfffb',
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    borderWidth : 0.8, 
    borderColor : "#15A389",
    alignItems: 'center',
    borderStyle : "dashed"
  },
  tagText: {
    fontSize: 14,
    color: '#15A389',
    textTransform : "uppercase"
  },
  removeTag: {
    fontSize: 16,
    color: '#BE2929',
    marginLeft: 10,
  },
  scrollContainer: {
    flexGrow : 1
  },
});