import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated, 
    RefreshControl, 
    FlatList,
    BackHandler, 
} from 'react-native';   
import { useTranslation } from 'react-i18next';   
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../i18n";  
import { useAuth } from '../../states/States';
import { useCopilot } from "react-native-copilot";
import {  Octicons } from '@expo/vector-icons';
import { useTheme } from "../../states/ThemeContext";     
import SkeletonCard from '../../Components/SkeletonCard';
import ModalRequestClicked from '../../Components/ModalRequestClicked';
import RN from '../../fakeData/revisionNotes';
import { useHistoryStack } from '../../states/HistoryContext';
import { useNavigation } from '@react-navigation/native';



const RevisionNote = () => {
    const {     
        isCopilotActive,     
    } = useCopilot();    
    const { t } = useTranslation();
    const {theme} = useTheme();
    const [isLoading, setisLoading] = useState(true);
    const [isNotifActivated, setisNotifActivated] = useState(true);
    const [isCreateNewRequestClicked, setisCreateNewRequestClicked] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;  
 

              const navigation = useNavigation();
               const { getPreviousScreen, popFromHistory } = useHistoryStack();
                    const handleBackPress = () => {
                        const previous = getPreviousScreen();
                        if (previous) {
                          popFromHistory();
                          navigation.navigate(previous.screenName, previous.params || {});
                          return true;  
                        } else {
                          navigation.navigate("Actualite");  
                          return true;  
                        }
                    };
                    
                    useEffect(() => {
                        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
                        return () => backHandler.remove();
                    }, []);



    const startWavyAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 390,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 390,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };
  

    const handleLoad = (delay = 2000) => {
        setisLoading(true);
        startWavyAnimation();
        // executing function to retrive the data from backend right here .. 
        setTimeout(() => setisLoading(false), delay);
    };



    const handleRefresh = useCallback(() => handleLoad(2000), []);
    
    

    useEffect(() => {
        handleLoad(2000);
        return () => animation.stopAnimation();
    }, []);


    const renderItem = ({ item }) => (
        <View 
          style={[
            styles.notificationCompo, 
            {borderColor : theme === "light" ? "transparent" : "rgb(49, 49, 49)"},
            {borderWidth : 1},
            { backgroundColor: theme === "light" ? "white" : "#1f1f1f" }, 
            { shadowColor: theme === "light" ? "rgb(151, 151, 151)" : "transparent" }
          ]}
        >

          <View style={styles.containerTextDesc}>
            <Text style={[styles.containerTextDescTextetx, { color: theme === "light" ? "#282828" : "#E3E3E3" }]}>
              Numéro de demande :&nbsp;&nbsp;
              <Text style={[styles.containerTextDescTextetx, { color: theme === "light" ? "#282828" : "gray" }]}>
                {item.requestNumber}
              </Text>
            </Text>
            
          </View>
          <View style={styles.containerTextDesc}>
            <Text style={[styles.containerTextDescTextetx, { color: theme === "light" ? "#282828" : "#E3E3E3" }]}>
              Matière :&nbsp;&nbsp;
              <Text style={[styles.containerTextDescTextetx, { color: theme === "light" ? "#282828" : "gray" }]}>
                Analyse numérique 3
              </Text>
            </Text>
             
          </View> 
      
          <View style={[styles.containerTimeline, { borderTopColor: theme === "light" ? "rgb(189, 189, 189)" : "rgb(76, 76, 76)" }]}>
            <View style={styles.TimelineReal}>
              {item.timeline.map((state, index) => (
                <React.Fragment key={index}>

                  <View 
                    style={[
                      styles.squareTop, 
                      index === 0
                        ? styles.firstsquareTop
                        : index === 1
                        ? styles.centersquareTop
                        : styles.lastsquareTop
                    ]}
                  >
                    <Text style={[styles.colorText, { color: theme === "light" ? "#141414" : "gray" }]}>
                      {state.name}
                    </Text>
                  </View>
                  
                  <View 
                    style={[
                      styles.dot, 
                      index === 0
                        ? styles.firstDot
                        : index === 1
                        ? styles.centerDot
                        : styles.lastDot,
                      {
                        backgroundColor: state.status === "completed" ? "#15B99B" : theme === "light" ? "white" : "#1f1f1f"
                      }
                    ]}
                  />
      
                  <View 
                    style={[
                      styles.squareTopPrime, 
                      index === 0
                        ? styles.firstsquareTopPrime
                        : index === 1
                        ? styles.centersquareTopPrime
                        : styles.lastsquareTopPrime
                    ]}
                  >
                    <Text style={[styles.colorText, { color: theme === "light" ? "#141414" : "gray" }]}>
                      {state.date}
                    </Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
         {
            item.timeline[2].status === "completed"  ?
            <View
              style={{
                alignItems : "flex-end", 
              }}
            >
              <Text style={[styles.textVoirDetails, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                Voir détails
              </Text>
            </View>
            :
            null
         }
        </View>
      );
      

 
    return (
        <View style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }, {paddingTop : isLoading ? 22 : 5 }]}>
            <ModalRequestClicked 
                showModal={isCreateNewRequestClicked}
                setShowModal={setisCreateNewRequestClicked}
                theme={theme}
            />
            
            
            {
                isLoading ? 
                <>
                    <SkeletonCard theme={theme}  />
                    <SkeletonCard theme={theme}  />
                    <SkeletonCard theme={theme}  />
                </>
                : 
                <>

                   

                <View style={[styles.container6766]} >
                        <FlatList
                            data={RN}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                             
                            refreshControl={
                                <RefreshControl
                                    refreshing={isLoading}
                                    onRefresh={handleRefresh}
                                    colors={['#15B99B']}
                                    tintColor={theme === 'light' ? '#15B99B' : 'white'}
                                />
                            }
                        />
                    </View>
                    <View style={{height : 70, width : "98%", margin : "auto",alignItems : "center", justifyContent : "center"}} >
                        <TouchableOpacity  onPress={()=>{setisCreateNewRequestClicked(true)}}  style={styles.createNewAttestationRequest}>
                            <Text  style={styles.createNewAttestationRequestText}>
                                <Octicons name='plus' size={15} color="white" />
                                &nbsp;&nbsp;Créer une nouvelle demande
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            }
        </View>
    );
};

export default RevisionNote;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
     
    notificationCompo : {
        width : "98%", 
        height : "auto", 
        borderRadius : 9, 
        margin : "auto", 
        paddingVertical : 11, 
        paddingHorizontal : 15, 
        marginBottom : 35, 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        overflow : "hidden"
    },
     
    
    containerTextDesc : {
        flex : 1, 
        paddingHorizontal : 0, 
        marginBottom : 3, 
        flexDirection : "row", 
        justifyContent : "space-between", 
        alignItems : "baseline"
    }, 
    containerTextDescTextetx : {
        fontFamily : "InterMedium", 
        fontSize : 14
    },
    containerTextDescTextetxDate : {
        color : "rgb(156, 156, 156)", 
        fontFamily : "Inter", 
        fontSize : 11, 
        marginTop : 5
    },
    containerTimeline:{
        height : 77,
        marginTop : 13, 
        width : "100%", 
        justifyContent: "center", 
        alignItems : "center", 
        borderTopWidth : 1, 

    },
    TimelineReal: {
        height : 2, 
        borderRadius : 2, 
        width : "100%",
        backgroundColor  :"#15B99B",
        position : "relative" , 
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 20,
        position: "absolute",
        top : -7,
        borderWidth : 2, 
        borderColor : "#15B99B", 
        zIndex : 99,
        backgroundColor : "transparent"
    },
    squareTop : {
        width: "auto",
        height: 20,
        borderRadius: 0,
        position: "absolute",
        top : -30,
        zIndex : 100, 
    },
    firstsquareTop : {
        left: 0,
    },

    centersquareTop: {
        left: "50%",
        transform: [{ translateX: -34 }]
      },
      lastsquareTop: {
        right: 0,
      },



      squareTopPrime : {
        width: "auto",
        height: 20,
        borderRadius: 0,
        position: "absolute",
        top : 16,
        zIndex : 100, 
    },
    firstsquareTopPrime : {
        left: 0,
    },

    centersquareTopPrime: {
        left: "50%",
        transform: [{ translateX: -30}]
      },
      lastsquareTopPrime: {
        right: 0,
      },



    firstDot: {
        left: 0,
      },
      centerDot: {
        left: "50%",
        marginLeft: -6,
      },
      lastDot: {
        right: 0,
      },
  
      colorText : {
        fontFamily : 'InterBold', 
        fontSize : 11
    },  
 
    createNewAttestationRequest : {
        height : 52, 
        width : "100%", 
        backgroundColor : "#15b99b",
        borderRadius : 8, alignItems : "center", 
        justifyContent : "center"
    },
    createNewAttestationRequestText : {
        fontFamily : "InterBold", 
        fontSize : 14,
        color : "white"
    }, 
    container6766 : {flex : 1, marginTop : 20},
    textVoirDetails : {
      textDecorationLine : "underline", 
      fontFamily : "InterMedium", 

    }
});