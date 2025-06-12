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
  Image, 
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


export default function InscriptionEtudiant() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [matricule, setMatricule] = useState('');

  const [errorTitle, seterrorTitle] = useState('error1');
  const [errorMessage, setErrorMessage] = useState("An error has occurred.");
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);


  const showError = (title, message) => {
    seterrorTitle(title);
    setErrorMessage(message);
    setModalVisible(true);
  };

  const handleInscriptionEtudiant = async () => {
    if (!email ) {
      showError("Error", "Veuillez saisir votre adresse email.");
      return;
    }
    if (!matricule ) {
      showError("Error", "Veuillez saisir votre matricule.");
      return;
    }
    if (!password ) {
      showError("Error", "Veuillez saisir votre mot de passe.");
      return;
    }
    // setLoading(true);
    // try {
    //   const req = await axios.post(`${ENDPOINT_URL}InscriptionEtudiant`, {
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
          <View style={styles.overlay}>
            <View style={styles.backgroundLoogogooo}>
              {
                !isKeyboardVisible && 
                <Image
                  style={styles.imageLogoHaut}
                  source={require('../../assets/universiapolis_logo.png')}
                />
              }
            </View>

            <Text style={styles.title}>
              {
                t("inscriptEtudiant")
              }
            </Text>
            <Text style={styles.subtitle}>
            {
              t("inscriptEtudiantText")
            }
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {
                  t("numberMatricule")
                }&nbsp;&nbsp;<Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t("enter_matrciule")}
                placeholderTextColor="gray"
                value={matricule}
                onChangeText={setMatricule}
              />
            </View>


            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {t("email")}&nbsp;&nbsp;<Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t("enterEmail")}
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
              />
            </View>


            <View style={styles.inputContainer}>
              <Text style={styles.inputPassword}>
                {t("password")}&nbsp;&nbsp;<Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input2}
                  placeholder={t("enter_password")}
                  placeholderTextColor="gray"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye" : "eye-off"} 
                    size={22} 
                    color="rgb(18, 179, 149)" 
                  />
                </TouchableOpacity>
              </View>
            </View>

       
            
              {
                !isKeyboardVisible && 
                <View style={styles.lastContainer}>
                  <TouchableOpacity 
                    style={[styles.button, 
                      { opacity: loading ? 0.29 : 1 }
                    ]}
                    onPress={handleInscriptionEtudiant}
                    disabled={loading}
                  >
                    {loading ? (
                      <Text style={
                        [
                         styles.buttonText,
                         { color: loading ?"rgb(2, 39, 19)" : "white" }
                        ]}
                      >
                        {t("SiggingUp1")}
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
    paddingTop: 0,
    justifyContent: 'center',
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
    marginBottom : -9
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: '#141414',
    paddingLeft: 3,
    marginBottom: 60,
    letterSpacing : -0.3
  },
  inputContainer: {
    marginBottom: 20,
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 100,
    height: 55,
    paddingHorizontal: 25,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    fontFamily: 'Inter',
  },
  lastContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    left: 30
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#15B99B",
    borderRadius: 90,
    height: 55,
    marginTop: 20,
    zIndex : 1
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
    fontFamily : "InterBold",
    marginBottom: 12,
  },
  input2: {
    backgroundColor: '#fff',
    borderRadius: 100,
    height: 55,
    paddingRight: 40,
    paddingLeft: 25,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    width: "100%",
  }
});