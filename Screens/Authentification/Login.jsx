import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  Image, 
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import {  useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import ENDPOINT_URL from '../../environments/ENDPOINT_URL';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { Keyboard } from 'react-native';
import { useTranslation } from "react-i18next";
import { useAuth } from '../../states/States';
import NetInfo from '@react-native-community/netinfo';
import ModalForgotPassword from '../../Components/ModalForgotPassword';
import ErrorModal2 from '../../Components/ErrorModal2';



    

export default function Login() {

  const { setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState('FEA92445-41CD-0747-1EC2-C0665D44E2DF');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isConnectedToInternet, setIsConnectedToInternet] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnectedToInternet(state.isConnected);
    });

    return () => unsubscribe();
  }, []);
 
   

  const handleLogin = async () => {
    setShowForgotPassword(false);
    setLoading(true);

    if (!email ) {
      setLoading(false);
      setMessageError("Veuillez saisir votre adresse e-mail.");
      setModalVisible(true);
      return;
    }
    // if (!password ) {
    //   setLoading(false);
    //   setMessageError("Veuillez saisir votre mot de passe.");
    //   setModalVisible(true);
    //   return;
    // }
      
    try {

      // const res = await axios.post(`${ENDPOINT_URL}/api/auth/login`, {
      //   username: email,
      //   password: password,
      // });

      // if (res.status === 200) {
  
      //   const fail = () => {
      //     setLoading(false); 
      //     setMessageError("Une erreur est survenue pendant la connexion."); 
      //     setModalVisible(true); 
      //   };

      //   const trySetItem = async (key, value) => {
      //     if (value === null || value === undefined) {
      //       fail(); 
      //       return false;  
      //     }
      //     await AsyncStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
      //     return true; 
      //   };

      //   const success =
      //     await trySetItem('userMongoDbData', res.data.mongodbUser) &&  
      //     await trySetItem('userId', res.data.mongodbUser._id) &&  
      //     await trySetItem('token', res.data.access_token) &&          
      //     await trySetItem('role', res.data.role) &&                    
      //     await trySetItem('refresh_token', res.data.refresh_token) &&  
      //     await trySetItem('token_expiry', (Date.now() + res.data.expires_in * 1000).toString());  

        
      //   if (success) {
      //     loginWS(res.data.mongodbUser);
      //     setLoading(false);  
      //     setIsAuthenticated(true);  
      //   }
      // }
      // else{
      //   setLoading(false);
      //   setMessageError("Une erreur est survenue pendant la connexion.");
      //   setModalVisible(true);
      // }


      
      let Etd_Id = email;
      await AsyncStorage.setItem('Etd_Id', Etd_Id);
      await AsyncStorage.setItem('token', Etd_Id);
      await AsyncStorage.setItem('role', "etudiant");
      setLoading(false);  
      setIsAuthenticated(true);





    } catch (error) {
      if(error.status === 401){
        setLoading(false);
        setMessageError("Vos identifiants semblent incorrects. Vérifiez-les et réessayez.");
        setModalVisible(true);
      }
      else{
        setLoading(false);  
        console.log("Error : "+error);
        setMessageError("Une erreur est survenue pendant la connexion.");
        setModalVisible(true);
      }
    }
  }



  const handleRoleSelection = async (role) => {
    setLoading(true);
    setSelectedRole(role);
    await AsyncStorage.setItem('token', "167");
    await AsyncStorage.setItem('role', role);
    setIsAuthenticated(true);
  };


  
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


  const forgotPasswordFun = ()=>{
    setShowForgotPassword(true);
  }

 

 
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
    {/* <ErrorModal 
      modalVisible={modalVisible} 
      setModalVisible={setModalVisible}
      errorTitle={"Merci pour vos informations !"}
      errorMessage={messageError}
    /> */}

    <ErrorModal2 
      modalVisible={modalVisible} 
      setModalVisible={setModalVisible}
      errorTitle={"Erreur"}
      errorMessage={messageError}
    />

    <ModalForgotPassword 
      modalVisible={showForgotPassword} 
      setModalVisible={setShowForgotPassword}
      errorTitle={"Mot de passe oublié ?"}
      errorMessage={"Veuillez contacter l'administration pour réinitialiser vos identifiants d'accès."}
    />


    {
      isConnectedToInternet !== null && 
      
      <Modal
      animationType="fade"
      transparent={true}
      visible={!isConnectedToInternet}
      onRequestClose={() => {}}
    >

        <TouchableWithoutFeedback onPress={() =>{console.log("Unclosable pop Up ")}}>
          <View style={styles.centeredViewX}>
            <View style={[styles.darkOverlay]} />
            <TouchableWithoutFeedback>
              <Animated.View style={[styles.modalView222, { opacity: 1 }, {backgroundColor : "white"}]}>
                <Text style={[styles.modalTextTitlte, {color : "141414"}]}>
                  No Internet Connection
                </Text>
                <View style={{flexDirection : "column"}} >
                  <Text style={[styles.modalText2, {color:"141414"}]}>
                    Please check your internet connection and try again.
                  </Text>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
    </Modal>

    }

       

  <Modal
    animationType="fade"
    transparent={true}
    visible={roleModalVisible}
    onRequestClose={() => setRoleModalVisible(false)}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Choisissez votre rôle :</Text>
        {["etudiant", "intervenant", "tuteur"].map((role) => (
          <TouchableOpacity
            key={role}
            style={styles.roleButton}
            onPress={() => handleRoleSelection(role)}
          >
            <Text style={styles.roleText}>{role}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </Modal>

  

      <Animated.View style={{ flex: 1, opacity: 1 }}>
        <ImageBackground
          source={require('../../assets/gradient1.png')}
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

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              {
                t("textLogin1")
              }
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {t("email")} <Text style={styles.required}>*</Text>
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
                {t("password")} <Text style={styles.required}>*</Text>
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

            
              <View style={styles.passwordForgotContainer}>
                <TouchableOpacity onPress={forgotPasswordFun} style={styles.buttonForgotPassword}>
                  <Text style={styles.passwordForgotInput}>
                  {
                    t("password_forgotten")
                  }
                  </Text>
                </TouchableOpacity>
              </View>

            
            {
              !isKeyboardVisible && 
              <View style={styles.lastContainer}>
                <TouchableOpacity 
                  style={styles.button}
                  disabled={loading}
                  onPress={handleLogin}
                >
                  <Text style={styles.buttonText}>{ loading ? "Chargement..." : t("loginBitch") }</Text>
                   <FontAwesome6
                      name='chevron-right'
                      size={16}
                      color="white" 
                      style={{
                          marginTop : 1.67
                      }}
                    />
                </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.signupTextButton}
                    onPress={() => navigation.navigate('ChooseProfile')}
                  >
                    <Text style={styles.signupText}>
                      {t("noAccount")}&nbsp;&nbsp;<Text style={styles.signupLink}>
                        {
                          t("createAccountLink")
                        }
                      </Text>
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
    height: screenHeight + 150,
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
    top: 0  ,
    alignItems: "center",
    left: 20,
    right : 20,
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
    marginBottom: 75,
    letterSpacing : -0.2

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
    left: 20, 
    right : 20
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#15B99B",
    borderRadius: 90,
    height: 55,
    width : "100%",
    marginTop: 20,
    zIndex : 1, 
  },
  
 buttonText: {
    color: "white",
    fontFamily: "InterMedium",
    fontSize: 16,
    marginRight: 10,
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
    backgroundColor: "rgba(0, 0, 0, 0.8)", 
    justifyContent: "center",
    alignItems: "center",
  },
  centeredViewX: {
    position: "absolute",
    top: 0, 
    left: 0,
    right: 0,
    bottom: 0,
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
  buttonloading: {
    backgroundColor: "#15B99B",
    borderRadius: 11,
    height: 53,
    marginTop: 20,
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
    fontFamily : "InterBold",
    color: "#545454",
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
  }, 
  roleButton: {
    backgroundColor: "#15B99B",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: 150,
    alignItems: "center",
  },
  roleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  darkOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex : 9999999999999, 
  },
  modalView222 : {
    borderRadius: 12,
    padding: 20,
    width: 320,
    alignItems: "center",
    zIndex : 9999999999999, 
    paddingBottom: 0,
    elevation: 5,
    overflow: "hidden",
  },

  modalTextTitlte: {
    textAlign: "center",
    fontSize: 17,
    marginBottom: 10,
    letterSpacing: 0.15,
    fontFamily: "InterBold",
    paddingLeft: 3,
    paddingRight: 3,
  },
  modalText2: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Inter",
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection : "column"
  },

});