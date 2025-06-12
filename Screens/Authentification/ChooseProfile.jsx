import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  ScrollView
} from 'react-native';
import {  Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { useTranslation } from "react-i18next";
import "../../i18n";



export default function Login() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedCard, setSelectedCard] = useState(null);
  const { t } = useTranslation();
 

  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, []);




  const handleContinue = ()=>{
    console.log("Clicked : "+selectedCard);
    if(selectedCard === 1){
      navigation.navigate("InscriptionIntervenant");
    }
    else if(selectedCard === 2){
      navigation.navigate("InscriptionTuteur");
    }
    else if(selectedCard === 3){
      navigation.navigate("InscriptionEtudiant");
    } 
    else{
      navigation.navigate("InscriptionFuturEtudiant");
    } 
  }

  const getCardStyle = (id) => {
    return selectedCard === id 
      ? { ...styles.profileCard, borderWidth: 1.9, borderColor: '#15A389', borderStyle: 'dashed' } 
      : styles.profileCard;
  };


  const handleCardPress = (id) => {
    setSelectedCard(id);
  };
  
 
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
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ImageBackground
          source={require('../../assets/gradient2.png')}
          style={styles.background}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
              
              <View style={styles.overlay}>
                

                <Text style={styles.title}>
                  {
                    t("selectProfileText")
                  }
                </Text>


                <View style={styles.profileCardsContainer}>

                    

                <TouchableOpacity 
                    style={getCardStyle(3)} 
                    onPress={() => handleCardPress(3)}
                >
                    {
                        selectedCard === 3 && 
                        <View style={{
                            position : "absolute", 
                            right : 8, 
                            top : 8, 
                            backgroundColor : "#15A389", 
                            height : 26, 
                            width : 26, 
                            borderRadius : 15, 
                            color : "white", 
                            alignItems : "center"
                            , justifyContent : "center"
                        }} >
                            <MaterialCommunityIcons name="check" size={16} color="white" />
                        </View>
                    }
                    <View  
                        style={{
                            height :95, 
                            width : 95, 
                        }}
                    >
                        <Image
                            source={require('../../assets/icon3.png')}
                            style={{
                                objectFit : "cover", 
                                height : "100%", 
                                width : "100%", 
                                borderRadius : 10
                            }}
                        />                    
                    </View>
                    <View
                        style={{ flexDirection : "column", flex : 1, paddingLeft : 14 }}
                    >
                        <Text style={styles.profileCardTitle}>
                          {
                            t("student")
                          }
                        </Text>
                        <Text style={styles.profileCardDescription}>
                        {
                          t("textStudent")
                        }
                        </Text>
                    </View>
                  </TouchableOpacity>






                  <TouchableOpacity 
                    style={getCardStyle(2)} 
                    onPress={() => handleCardPress(2)}
                >
                    {
                        selectedCard === 2 && 
                        <View style={{
                            position : "absolute", 
                            right : 8, 
                            top : 8, 
                            backgroundColor : "#15A389", 
                            height : 26, 
                            width : 26, 
                            borderRadius : 15, 
                            color : "white", 
                            alignItems : "center"
                            , justifyContent : "center"
                        }} >
                            <MaterialCommunityIcons name="check" size={16} color="white" />
                        </View>
                    }
                    <View  
                        style={{
                            height :95, 
                            width : 95, 
                        }}
                    >

                        <Image
                            source={require('../../assets/icon2.png')}
                            style={{
                                objectFit : "cover", 
                                height : "100%", 
                                width : "100%", 
                                borderRadius : 10
                            }}
                        />
                    </View>
                    <View
                        style={{ flexDirection : "column", flex : 1, paddingLeft : 14 }}
                    >
                        <Text style={styles.profileCardTitle}>
                          {
                            t("tuteur")
                          }
                        </Text>
                        <Text style={styles.profileCardDescription}>
                        {
                          t("textTuteur")
                        }
                        </Text>
                    </View>
                  </TouchableOpacity>






                <TouchableOpacity 
                    style={getCardStyle(1)} 
                    onPress={() => handleCardPress(1)}
                >
                    {
                        selectedCard === 1 && 
                        <View style={{
                            position : "absolute", 
                            right : 8, 
                            top : 8, 
                            backgroundColor : "#15A389", 
                            height : 26, 
                            width : 26, 
                            borderRadius : 15, 
                            color : "white", 
                            alignItems : "center"
                            , justifyContent : "center"
                        }} >
                            <MaterialCommunityIcons name="check" size={16} color="white" />
                        </View>
                    }
                    <View  
                        style={{
                            height :95, 
                            width : 95, 
                        }}
                    >
                        <Image
                            source={require('../../assets/icon1.png')}
                            style={{
                                objectFit : "cover", 
                                height : "100%", 
                                width : "100%", 
                                borderRadius : 10
                            }}
                        />                    
                    </View>
                    <View
                        style={{ flexDirection : "column", flex : 1, paddingLeft : 14 }}
                    >
                        <Text style={styles.profileCardTitle}>
                        {
                          t("interv")
                        }
                        </Text>
                        <Text style={styles.profileCardDescription}>
                        {
                          t("textInterv")
                        }
                        </Text>
                    </View>
                  </TouchableOpacity>





            
              




                <TouchableOpacity 
                    style={getCardStyle(4)} 
                    onPress={() => handleCardPress(4)}
                >
                    {
                        selectedCard === 4 && 
                        <View style={{
                            position : "absolute", 
                            right : 8, 
                            top : 8, 
                            backgroundColor : "#15A389", 
                            height : 26, 
                            width : 26, 
                            borderRadius : 15, 
                            color : "white", 
                            alignItems : "center"
                            , justifyContent : "center"
                        }} >
                            <MaterialCommunityIcons name="check" size={16} color="white" />
                        </View>
                    }
                    <View  
                        style={{
                            height :95, 
                            width : 95, 
                        }}
                    >
                        <Image
                            source={require('../../assets/icon4.png')}
                            style={{
                                objectFit : "cover", 
                                height : "100%", 
                                width : "100%", 
                                borderRadius : 10
                            }}
                        />                    
                    </View>
                    <View
                        style={{ flexDirection : "column", flex : 1, paddingLeft : 14 }}
                    >
                        <Text style={styles.profileCardTitle}>
                        {
                          t("futurStudent")
                        }
                        </Text>
                        <Text style={styles.profileCardDescription}>
                        {
                          t("textFuturStudent")
                        }
                        </Text>
                    </View>
                  </TouchableOpacity>

                </View>







          
              

                <View style={styles.lastContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.button, 
                      { backgroundColor: !selectedCard ? 'rgba(0, 0, 0, 0.1)' : '#15B99B' }
                    ]}
                    onPress={handleContinue}
                    disabled={!selectedCard}
                  >
                     
                        <Text style={styles.buttonText}>
                        {
                          t("continue1")
                        }&nbsp;&nbsp;
                        </Text>
                        <Ionicons name="chevron-forward" size={19} color="#fff" />
                      
                  </TouchableOpacity>

                  <TouchableOpacity    
                    style={styles.signupTextButton}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text style={styles.signupText}>
                      {
                        t("alreadyAccount")
                      }&nbsp;&nbsp;<Text style={styles.signupLink}>
                        {
                          t("connectAccount")
                        }
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>
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
    height: screenHeight + 50,
    backgroundColor: "#fff",
  },
  overlay: {
    flex: 1, // Take full available height
    padding: 30,
    paddingBottom: 20, // Add bottom padding
    paddingTop: 35,
    justifyContent: 'space-between',
  },
  backgroundLoogogooo: {
    position: "absolute",
    top: 5,
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
    fontSize: 24,
    color: '#15A389',
    marginBottom : 16
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: '#141414',
    paddingLeft: 3,
    marginBottom: 30,
  },
 
  
  lastContainer: {
    width: "100%",
    marginTop: 'auto',
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
   
   
 
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingTop : 11, 
    paddingBottom : 14, 
    paddingLeft : 10, 
    paddingRight : 10, 
    marginBottom: 16,
    shadowColor: 'gray',
    flexDirection : "row",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    alignItems : "center", 
    position : "relative"
  },
  profileCardTitle: {
    fontFamily: 'JomoFont',
    fontSize: 19,
    color: '#15A389',
    marginBottom: -3,
  },
  profileCardDescription: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#444444',
  },
  scrollContainer: {
    flexGrow : 1
  },
  profileCardsContainer: {
    flex: 1, 
    marginBottom: 0,  
  },
});