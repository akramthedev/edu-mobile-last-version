import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView, 
  Button,
  PanResponder,
  Image,
  ActivityIndicator,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons,Feather, MaterialCommunityIcons, MaterialIcons,SimpleLineIcons,Entypo, FontAwesome, AntDesign, Octicons, FontAwesome5 } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: screenWidth } = Dimensions.get('window');
import { useFonts } from 'expo-font';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../states/States';
import { useHistoryStack } from '../states/HistoryContext';
import ModeToggleButton from './ModeToggleButton';
const Sidebar = forwardRef(({navigation, theme}, ref) => {
  const slideAnimation = useRef(new Animated.Value(-screenWidth)).current;
  const { t } = useTranslation();
  const { role } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [showPremiumPopUp, setShowPremiumPopUp] = useState(false);
  const { pushToHistory } = useHistoryStack();

  useImperativeHandle(ref, () => ({
    toggleSidebar: () => {
      setIsVisible((prev) => !prev);
    }
  }));

  useEffect(() => {
    
    if (isVisible) {
      Animated.timing(slideAnimation, {
        toValue: 0, 
        duration: 333,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: -screenWidth * 0.8, 
        duration: 333,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);
 


   const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          slideAnimation.setValue(Math.max(gestureState.dx, -screenWidth * 0.8));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.timing(slideAnimation, {
            toValue: -screenWidth * 0.8,
            duration: 277,
            useNativeDriver: true,
          }).start(() => setIsVisible(false)); 
        } else {
          Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 277,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

    const handleOverlayPress = useCallback(() => {
      Animated.timing(slideAnimation, {
        toValue: -screenWidth * 0.8,
        duration: 277,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    }, []);
   
  return (

    <>

      {/* <Modal
        transparent={true}
        animationType="fade"
        visible={showPremiumPopUp}
        onRequestClose={() => setShowPremiumPopUp(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, {backgroundColor : theme === "light" ? "white" : "#141414"}]}>
            

          <TouchableOpacity
            onPress={() => setShowPremiumPopUp(false)}
            style={{
              position : "absolute", 
              right : 20, 
              top : 20, 
              borderRadius : 50, 
              height : 40, 
              width : 40, 
              backgroundColor : theme === "light" ? "rgb(233, 233, 233)" : "rgb(26, 26, 26)", 
              alignItems : "center", 
              justifyContent : "center",
            }}
          >
            <Octicons  
              name='x'
              size={20}
              color={theme === "light" ? "gray" : "rgb(151, 151, 151)"}
            />
          </TouchableOpacity>


            <Image 
              style={{
                height : 90, 
                width : 90, 
                objectFit : "cover", 
                marginBottom : 15, 
              }}
              source={require("../assets/couronne.png")}
            />

            <Text style={{
              color : theme === "light" ? "rgb(41, 41, 41)" : "white", 
              textAlign : "center",
              fontFamily : "InterMedium", 
              fontSize : 24.5, 
              marginBottom : 20, 
            }} >
              Get Premium Now!              
            </Text>
 
 
           
           
            <View
              style={{
                flexDirection : "row",
                justifyContent : "space-between", 
                width : "100%", 
                marginBottom : 15
              }}
            >
              <Image 
                style={{
                  height : 38, 
                  width : 38, 
                  objectFit : "cover", 
                  marginBottom : 15, 
                }}
                source={require("../assets/diamond.png")}
              />

            <View
              style={{
                flexDirection : "column",
                justifyContent : "space-between", 
                flex : 1, 
                marginBottom : 15
              }}
            >
                <Text style={{
                  color : theme === "light" ? "rgb(108, 108, 108)" : "rgb(155, 155, 155)", 
                  fontFamily : "InterBold", 
                  fontSize : 16, 
                  marginBottom : 5,
                  textAlign : "left" , 
                  paddingLeft : 15,  
                }} >
                  Lorem Ipsum Dolor 
                </Text>
                <Text style={{
                  color : theme === "light" ? "rgb(108, 108, 108)" : "rgb(155, 155, 155)", 
                  fontFamily : "Inter", 
                  fontSize : 14, 
                  marginBottom : 10,
                  textAlign : "left" , 
                  paddingLeft : 15,  
                }} >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur.
                 </Text>
              </View>
            </View>
 
            
            <View
              style={{
                flexDirection : "row",
                justifyContent : "space-between", 
                width : "100%", 
                marginBottom : 15
              }}
            >
              <Image 
                style={{
                  height : 38, 
                  width : 38, 
                  objectFit : "cover", 
                  marginBottom : 15, 
                }}
                source={require("../assets/diamond.png")}
              />

            <View
              style={{
                flexDirection : "column",
                justifyContent : "space-between", 
                flex : 1, 
                marginBottom : 15
              }}
            >
                <Text style={{
                  color : theme === "light" ? "rgb(108, 108, 108)" : "rgb(155, 155, 155)", 
                  fontFamily : "InterBold", 
                  fontSize : 16, 
                  marginBottom : 5,
                  textAlign : "left" , 
                  paddingLeft : 15,  
                }} >
                  Lorem Ipsum Dolor 
                </Text>
                <Text style={{
                  color : theme === "light" ? "rgb(108, 108, 108)" : "rgb(155, 155, 155)", 
                  fontFamily : "Inter", 
                  fontSize : 14, 
                  marginBottom : 10,
                  textAlign : "left", 
                  paddingLeft : 15,  
                }} >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur.
                 </Text>
              </View>
            </View>
 

            
            <View
              style={{
                flexDirection : "row",
                justifyContent : "space-between", 
                width : "100%", 
                marginBottom : 15
              }}
            >
              <Image 
                style={{
                  height : 38, 
                  width : 38, 
                  objectFit : "cover", 
                  marginBottom : 15, 
                }}
                source={require("../assets/diamond.png")}
              />

            <View
              style={{
                flexDirection : "column",
                justifyContent : "space-between", 
                flex : 1, 
                marginBottom : 15
              }}
            >
                <Text style={{
                  color : theme === "light" ? "rgb(108, 108, 108)" : "rgb(155, 155, 155)", 
                  fontFamily : "InterBold", 
                  fontSize : 16, 
                  marginBottom : 5,
                  textAlign : "left" , 
                  paddingLeft : 15,  
                }} >
                  Lorem Ipsum Dolor 
                </Text>
                <Text style={{
                  color : theme === "light" ? "rgb(108, 108, 108)" : "rgb(155, 155, 155)", 
                  fontFamily : "Inter", 
                  fontSize : 14, 
                  marginBottom : 10,
                  textAlign : "left" , 
                  paddingLeft : 15,  
                }} >
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur.
                </Text>
              </View>
            </View>
 
  
              <LinearGradient
                colors={['#6554db', '#b547f7']}  
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={{
                  width: '100%',
                  height: 50,
                  borderRadius: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowPremiumPopUp(false);
                    pushToHistory("GetPremium");
                    navigation.navigate("Authenticated", { screen: "GetPremium" });
                  }}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position : "relative", 
                    borderRadius: 10,
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      fontFamily: 'InterMedium',
                      fontSize: 15,
                      color: 'white',
                      letterSpacing: 0.3,
                    }}
                  >
                    Passer à Premium 
                  </Text>
                  <Octicons  
                      name='chevron-right'
                      size={20}
                      color="white"
                      style={{
                          position : "absolute", 
                          right : 25, 
                      }}
                    /> 
                </TouchableOpacity>
              </LinearGradient>







          </View>
        </View>
      </Modal> */}

    
    {
      role && 

      <Animated.View
        style={[
          styles.containerWrapper,
          {
            backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.666)' : 'transparent',
            left: isVisible ? 0 : -screenWidth * 2  
          }
        ]}
      >
 
     
        <Animated.View
          style={[theme === "light" ? styles.popupContainer : styles.popupContainerDark, { transform: [{ translateX: slideAnimation }] }]}
          {...panResponder.panHandlers}  
        >

          <TouchableOpacity onPress={()=>{ 
              setIsVisible(false);
              pushToHistory("Profile");
              navigation.navigate("Authenticated", { screen: "Profile" });
            }} 
            style={styles.header1} 
          >
            <Image
              style={[styles.ImageUserSidebar, {
                backgroundColor : theme === "light" ? "#efefef" : "#282828"
              }]}
              source={require('../assets/akram.png')}
            />
            <View
              style={styles.NameFullName}
            >
              <Text style={[styles.NameFullNameText1, 
                {color : theme === "light" ? "#141414" : "#E3E3E3"}
              ]}>
                Akram El Basri
              </Text>
              <Text style={[styles.NameFullNameText2, {
                color : theme === "light" ? "gray" : "rgb(125, 125, 125)"
              }]}>
                ID : HSD92END73
              </Text>
            </View>
          </TouchableOpacity>


          

          <ScrollView style={styles.popupContent} contentContainerStyle={styles.scrollContent}>


            



            <View style={[styles.FuckHr, {
              backgroundColor : theme === "light" ? "#e2e2e2" : "rgb(96, 96, 96)"
            }]} />
            <TouchableOpacity
              onPress={() => {
                setIsVisible(false);
                pushToHistory("Actualite");
                navigation.navigate("Authenticated", { screen: "Actualite" });
              }}
              style={styles.popupItem}
            >
              <View style={styles.popupItemInsider}>
                <View style={styles.iconContainer}>
                  <Octicons
                    name="home"
                    size={20}
                    color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"}
                  />
                </View>
                <Text style={[styles.popupText, {
                  color : theme === "light" ? "#393939" : "#E3E3E3"
                }]}>{t("actualityTitle1")}</Text>
              </View>
              
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if(role === "intervenant"){
                  pushToHistory("PlanningInterv");
                  navigation.navigate("Authenticated", { screen: "PlanningInterv" });
                }
                else if(role === "tuteur"){
                  pushToHistory("PlanningTuteur");
                  navigation.navigate("Authenticated", { screen: "PlanningTuteur" });
                }
                else{
                  pushToHistory("Planning");
                  navigation.navigate("Authenticated", { screen: "Planning" });
                }
                setIsVisible(false);
              }}
              style={styles.popupItem}
            >
              <View style={styles.popupItemInsider}>
                <View style={styles.iconContainer}>
                  <Octicons name="calendar" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                </View>
                <Text style={[styles.popupText, {
                  color : theme === "light" ? "#393939" : "#E3E3E3"
                }]}>Planning</Text>
              </View>
              
            </TouchableOpacity>


            {
              
              role === "etudiant" && 
              
              <>
              <TouchableOpacity
                onPress={() => {
                  pushToHistory("Parcours");
                  navigation.navigate("Authenticated", { screen: "Parcours" });
                  setIsVisible(false);
                }}
                style={styles.popupItem}
              >
                <View style={styles.popupItemInsider}>
                  <View style={styles.iconContainer}>
                    <Octicons name="mortar-board" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                  </View>
                  <Text style={[styles.popupText, {
                    color : theme === "light" ? "#393939" : "#E3E3E3"
                  }]}>{t("ParcoursTtile")}</Text>
                </View>
                
              </TouchableOpacity>

              </>

            }


            <TouchableOpacity
              onPress={() => {
                pushToHistory("Activity");
                navigation.navigate("Authenticated", { screen: "Activity" });
                setIsVisible(false);
              }}
              style={styles.popupItem}
            >
              <View style={styles.popupItemInsider}>
                <View style={styles.iconContainer}>
                  <Octicons name="bell" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                </View>
                <Text style={[styles.popupText, {
                  color : theme === "light" ? "#393939" : "#E3E3E3"
                }]}>
                  {t("rappelsTitle")}
                </Text>
                  {/* <View style={{ backgroundColor : theme === "light" ? "#15B99B" : "rgb(14, 147, 123)", height : 20, width : 20, alignItems : "center", justifyContent : "center", borderRadius : 30, position : "absolute", right : 0, top : 0, zIndex : 9 }} >
                    <Text style={{ fontFamily : "Inter", fontSize : 12, color : "white" }} >
                      6
                    </Text>
                  </View> */}
              </View>
              
            </TouchableOpacity>
 


{/* 
            <View style={[styles.FuckHr2, {
              backgroundColor : theme === "light" ? "#e2e2e2" : "rgb(96, 96, 96)"
            }]} />
 
             */}

          {

            role === "etudiant" ? 

            <>

            <TouchableOpacity
              onPress={() => {
                pushToHistory("Solde");
                navigation.navigate("Authenticated", { screen: "Solde" });
                setIsVisible(false);
              }}
              style={styles.popupItem}
            >
              <View style={styles.popupItemInsider}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="attach-money" style={{marginLeft : -2.8}} size={25} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                </View>
                <Text style={[styles.popupText, {
                  color : theme === "light" ? "#393939" : "#E3E3E3"
                }]}>{t("soldeTitle")}</Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {
                pushToHistory("Paiement");
                navigation.navigate("Authenticated", { screen: "Paiement" });
                setIsVisible(false);
              }}
              style={styles.popupItem}
            >
              <View style={styles.popupItemInsider}>
                <View style={styles.iconContainer}>
                  <Octicons name="credit-card" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                </View>
                <Text style={[styles.popupText, {
                  color : theme === "light" ? "#393939" : "#E3E3E3"
                }]}>{t("paiementTitle")}</Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {
                pushToHistory("ModalChoixFiliere");
                navigation.navigate("Authenticated", { screen: "ModalChoixFiliere" });
                setIsVisible(false);
              }}
              style={styles.popupItem}
            >
              <View style={styles.popupItemInsider}>
                <View style={styles.iconContainer}>
                  <Octicons name="workflow" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                </View>
                <Text style={[styles.popupText, {
                  color : theme === "light" ? "#393939" : "#E3E3E3"
                }]}>{t("choixFilier")}</Text>
              </View>
            </TouchableOpacity>
            </>

            :
            
            role === "intervenant" ? 

            <>


              <TouchableOpacity
                onPress={() => {
                  pushToHistory("Remuneration");
                  navigation.navigate("Authenticated", { screen: "Remuneration" });
                  setIsVisible(false);
                }}
                style={styles.popupItem}
              >
                <View style={styles.popupItemInsider}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="attach-money" size={25} style={{marginLeft : -2.8}}  color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                  </View>
                  <Text style={[styles.popupText, {
                    color : theme === "light" ? "#393939" : "#E3E3E3"
                  }]}>{t("RemunerationTitle")}</Text>
                </View>
              </TouchableOpacity>



          
          
          
            <TouchableOpacity
              onPress={() => {
                pushToHistory("Classes");
                navigation.navigate("Authenticated", { screen: "Classes" });
                setIsVisible(false);
              }}
              style={styles.popupItem}
            >
              <View style={styles.popupItemInsider}>
                <View style={styles.iconContainer}>
                  <Octicons name="briefcase" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                </View>
                <Text style={[styles.popupText, {
                  color : theme === "light" ? "#393939" : "#E3E3E3"
                }]}>{t("classesTTITITI")}</Text>
              </View>
            </TouchableOpacity>



            <TouchableOpacity
              onPress={() => {
                pushToHistory("Matieres");
                navigation.navigate("Authenticated", { screen: "Matieres" });
                setIsVisible(false);
              }}
              style={styles.popupItem}
            >
              <View style={styles.popupItemInsider}>
                <View style={styles.iconContainer}>
                  <Octicons name="mortar-board" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                </View>
                <Text style={[styles.popupText, {
                  color : theme === "light" ? "#393939" : "#E3E3E3"
                }]}>{t("Matieres")}</Text>
              </View>
            </TouchableOpacity>



            <TouchableOpacity
              onPress={() => {
                pushToHistory("CreneauxIntervenant");
                navigation.navigate("Authenticated", { screen: "CreneauxIntervenant" });
                setIsVisible(false);
              }}
              style={styles.popupItem}
            >
              <View style={styles.popupItemInsider}>
                <View style={styles.iconContainer}>
                  <Octicons name="workflow" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                </View>
                <Text style={[styles.popupText, {
                  color : theme === "light" ? "#393939" : "#E3E3E3"
                }]}>{t("choixcreneauxintervenantTitle2")}</Text>
              </View>
            </TouchableOpacity>

            </>
            
            :
            null
          
          }





            {
              role === "etudiant" && 

            <>
              <TouchableOpacity
                onPress={() => {
                  pushToHistory("Rattrapage");
                  navigation.navigate("Authenticated", { screen: "Rattrapage" });
                  setIsVisible(false);
                }}
                style={styles.popupItem}
              >
                <View style={styles.popupItemInsider}>
                  <View style={styles.iconContainer}>
                    <Octicons name="arrow-switch" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                  </View>
                  <Text style={[styles.popupText, {
                    color : theme === "light" ? "#393939" : "#E3E3E3"
                  }]}>{t("rattrapageTitlePage")}</Text>
                </View>
                
              </TouchableOpacity>

              
              <TouchableOpacity
                onPress={() => {
                  pushToHistory("AttestationRequest");
                  navigation.navigate("Authenticated", { screen: "AttestationRequest" });
                  setIsVisible(false);
                }}
                style={styles.popupItem}
              >
                <View style={styles.popupItemInsider}>
                  <View style={styles.iconContainer}>
                    <Octicons name="file" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                  </View>
                  <Text style={[styles.popupText, {
                    color : theme === "light" ? "#393939" : "#E3E3E3"
                  }]}>{t("docsAndCertTtile")}</Text>
                </View>
                
              </TouchableOpacity>
              </> 


            }


            
            {
              
              role === "etudiant" && 
              
              <TouchableOpacity
                onPress={() => {
                  pushToHistory("RevisionNote");
                  navigation.navigate("Authenticated", { screen: "RevisionNote" });
                  setIsVisible(false);
                }}
                style={styles.popupItem}
              >
                <View style={styles.popupItemInsider}>
                  <View style={styles.iconContainer}>
                    <Octicons name="sync" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                  </View>
                  <Text style={[styles.popupText, {
                    color : theme === "light" ? "#393939" : "#E3E3E3"
                  }]}>{t("reviewGrades")}</Text>
                </View>
                
              </TouchableOpacity>
            }

            {
              role === "tuteur" && 
              
              <>               
              <TouchableOpacity
                onPress={() => {
                  pushToHistory("SuivieFils");
                  navigation.navigate("Authenticated", { screen: "SuivieFils" });
                  setIsVisible(false);
                }}
                style={styles.popupItem}
              >
                <View style={styles.popupItemInsider}>
                  <View style={styles.iconContainer}>
                    <Octicons name="people" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                  </View>
                  <Text style={[styles.popupText, {
                    color : theme === "light" ? "#393939" : "#E3E3E3"
                  }]}>{t("suiviefils")}</Text>
                </View>
                
              </TouchableOpacity>

              <TouchableOpacity
              onPress={() => {
                pushToHistory("SoldeTutor");
                navigation.navigate("Authenticated", { screen: "SoldeTutor" });
                setIsVisible(false);
              }}
              style={styles.popupItem}
              >
              <View style={styles.popupItemInsider}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="attach-money" style={{marginLeft : -2.8}} size={25} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                </View>
                <Text style={[styles.popupText, {
                  color : theme === "light" ? "#393939" : "#E3E3E3"
                }]}>{t("soldeTitle")}</Text>
              </View>
              </TouchableOpacity>

              
              <TouchableOpacity
                onPress={() => {
                  pushToHistory("PaiementTutor");
                  navigation.navigate("Authenticated", { screen: "PaiementTutor" });
                  setIsVisible(false);
                }}
                style={styles.popupItem}
              >
                <View style={styles.popupItemInsider}>
                  <View style={styles.iconContainer}>
                    <Octicons name="credit-card" size={20} color={theme === "light" ? "rgb(57, 57, 57)" : "#E3E3E3"} />
                  </View>
                  <Text style={[styles.popupText, {
                    color : theme === "light" ? "#393939" : "#E3E3E3"
                  }]}>{t("paiementTitle")}</Text>
                </View>
              </TouchableOpacity>
              </>
            }
    
          {/*        
              <TouchableOpacity
                onPress={() => {
                  setIsVisible(false);
                  setShowPremiumPopUp(true);
                }}
                style={styles.popupItem}
              >
                <View style={styles.popupItemInsider}>
                  <View style={styles.iconContainer}>
                    <Octicons name="rocket" size={20} color={theme === "light" ? "rgb(140, 53, 255)" : "rgb(140, 53, 255)"} />
                  </View>
                  <Text style={[styles.popupText, {
                    color : theme === "light" ? "rgb(140, 53, 255)" : "rgb(140, 53, 255)"
                  }]}>{t("getPremiumTitle")}</Text>
                </View>
                
              </TouchableOpacity> 
          */}

            <View 
              style={[styles.FuckHr3, {
                backgroundColor : theme === "light" ? "#e2e2e2" : "rgb(96, 96, 96)"
              }]} 
            />


            <View
              style={{
                flexDirection : "row", 
                alignItems : "center", 
                justifyContent : "space-between", 
              }}
            >
              <Text style={{
                color : theme === "light" ? "#141414" : "white"
              }} >
                Mode Sombre : 
              </Text>
              <ModeToggleButton />
            </View>
          </ScrollView>
          <View style={styles.containerOfLnaguage1} >
              <Text
                style={{
                  fontFamily : "Inter", 
                  fontSize : 12, 
                  color : "rgb(184, 184, 184)"
                }}
              >
                Version 6.6.6
              </Text>
          </View>

          
        </Animated.View>


        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleOverlayPress}
          pointerEvents={isVisible ? 'auto' : 'none'}
        />

    </Animated.View>
  }
    
    </>
  );
});


const styles = StyleSheet.create({

  popupContent: {
      flex : 1, 
      paddingTop : 20, 
      paddingLeft : 20, 
      paddingRight : 20, 
      position : "relative"
    },
  popupText: {
      fontSize: 14,
      fontFamily: 'Inter',
      zIndex : 9, 
      width : "auto",
  },
  popupItem : {
      height : 46,
      flexDirection : "row", 
      marginBottom : 9, 
      width : "100%",
      alignItems : "center",
      justifyContent : "space-between",
      paddingHorizontal : 0,
  },
  popupItemInsider : {
      flexDirection : "row", 
      alignItems : "center",
      justifyContent :"flex-start",
      flex : 1
  }, 
  header1 : {
    height : 100,   
    position : "relative", 
    zIndex : 99999999, 
    top : 30,
    paddingLeft : 20, 
    paddingRight : 20, 
    flexDirection : "row",
    alignItems : "center", 
  },
  ImageUserSidebar : {
    height : 55, 
    width : 55,
    objectFit : "cover", 
    borderRadius : 30
  },
  NameFullName : {
    flexDirection:"column", 
  },
  NameFullNameText2 : {
    fontFamily : "Inter", 
    fontSize : 14, 
    paddingLeft : 15,
  },
  NameFullNameText1 : {
    fontFamily : "InterBold", 
    fontSize : 17,
    paddingLeft : 15
  }, 
  FuckHr : {
    width : "100%", 
    height : 1, 
    backgroundColor : "#e2e2e2", 
    borderRadius : 3, 
    marginTop : 7, 
    marginBottom : 4
  },
  FuckHr2 : {
    width : "100%", 
    height : 1, 
    backgroundColor : "rgb(226, 226, 226)", 
    borderRadius : 3, 
    marginTop : 4, 
    marginBottom : 4
  }, 
  FuckHr3 : {
    width : "100%", 
    height : 1, 
    backgroundColor : "rgb(226, 226, 226)", 
    borderRadius : 3, 
    marginTop : 10,
    marginBottom : 15,  
  }, 
  iconContainer : {
    marginRight : 15, 
    height : 20, 
    width : 20, 
    position : "relative"
  },
  containerOfLnaguage : {
    position : "absolute", 
    bottom : 10,
    paddingLeft : 20, 
    paddingRight : 20,  
    width : "100%", 
    height : 50, 
    flexDirection : "row",
    alignItems : "center", 
    justifyContent : "space-between"
  },
  containerOfLnaguage1 : {
    position : "absolute", 
    bottom : 20,
    paddingLeft : 20, 
    paddingRight : 20,  
    width : "100%", 
    height : "auto", 
    flexDirection : "row",
    alignItems : "center", 
    justifyContent : "center"
  },
  containerOfLnaguage2 : {
    width : "48%", 
    borderRadius : 50, 
    height : 40, 
    alignItems : "center", 
    justifyContent : "center"
  },
  colorizeBackground : {
    backgroundColor : "rgb(12, 190, 110)", 
  }, 
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.79)',  
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,  
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter',
  },
  loaderImg : {
    height : 75, 
    width : 75, 
    objectFit : "cover"
  }, 
  containerWrapper: {
    position: 'absolute',
    top: 0,
    width: screenWidth * 1, 
    height: '100%',
    zIndex: 1000,
    flexDirection: 'row',
  },
  overlayTouchable: {
    width: screenWidth * 0.2,
    backgroundColor: 'transparent',
  },
  popupContainer: {
    width: "80%",
    height: '100%',
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  popupContainerDark: {
    width: "80%",
    height: '100%',
    backgroundColor: "rgb(22, 22, 22)",
    borderRightColor: "rgb(91, 91, 91)",
    borderRightWidth: 1,
    shadowColor: "rgb(92, 92, 92)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,  
  },


  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',  
  },
  modalContainer: {
    width: "88%",
    paddingVertical : 30, 
    paddingHorizontal : 34, 
    borderRadius: 15,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalDescription: {
    marginVertical: 10,
    textAlign: 'center',
  },


});


export default React.memo(Sidebar);