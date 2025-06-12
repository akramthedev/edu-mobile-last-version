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
import SkeletonActivity from '../../Components/SkeletonActivity';  
import notifications from '../../fakeData/notification'  
import activity from "../../fakeData/activity";                                       
import { useTheme } from "../../states/ThemeContext";
import ModalChoixFiliere from '../../Components/ModalChoixFiliere';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useHistoryStack } from '../../states/HistoryContext';

const Activity = () => {
    const { 
        isCopilotActive, 
    } = useCopilot();    
    const { t } = useTranslation();
    const {theme} = useTheme();
    const [isLoading, setisLoading] = useState(true);
    const [isNotifActivated, setisNotifActivated] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;  
    const [isInscriptionOuverte, setisInscriptionOuverte] = useState(false);
    
    
    const { getPreviousScreen, popFromHistory } = useHistoryStack();
    const navigation = useNavigation();
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

 

    const renderItem = ({ item }) => (
        <View style={[styles.notificationCompo, 
            { backgroundColor: theme === "light" ? "white" : "rgb(31, 31, 31)" }, 
            { shadowColor: theme === "light" ? "rgb(188, 188, 188)" : "transparent" }]}>
            
            <View style={styles.containerOfIcon}>
                <View style={[
                    styles.insideIcon, 
                    { 
                        backgroundColor: theme === "light" ? "rgb(246, 246, 246)" : "rgb(35, 35, 35)",
                        paddingLeft: (item.icon === "alert" || item.icon === "star") ? 0 : (isNotifActivated ? 1 : 1.3)
                    }
                ]}>
                    <Octicons name={item.icon} size={19} color={item.iconColor} />
                </View>
            </View>
            
            <View style={styles.containerTextDesc}>
                <Text style={[styles.containerTextDescTextetx, 
                    { color: theme === "light" ? "#282828" : "#E3E3E3" }]}>
                    {item.message}
                </Text>
                <Text style={styles.containerTextDescTextetxDate}>{item.date}</Text>
            </View>
        </View>
    );




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



     useFocusEffect(
          useCallback(() => {
            setisInscriptionOuverte(false);
          }, [])
        );


 

    return (
        <View style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>
            

            <ModalChoixFiliere
                modalVisible={isInscriptionOuverte}
                setModalVisible={setisInscriptionOuverte}
                theme={theme}
            />


            {
                isLoading ? 
                <SkeletonActivity theme={theme}  />
                : 
                <View style={[styles.container6766,{backgroundColor: theme === "light" ? '#f2f2f7' : '#141414'}]} >
                    {
                        theme === "light" ? 
                        <View style={[styles.containerofTwoButtonsSwitch, {borderBottomColor :"rgb(218, 218, 218)"}]} >
                            <TouchableOpacity onPress={()=>{setisNotifActivated(true)}}  style={[styles.buttonSwitch,{backgroundColor : isNotifActivated ? "#15B99B"  : theme === "light" ? "white" : "rgb(228, 228, 228)"}]}>
                                <Text style={[styles.buttonSwitchText,{color : isNotifActivated ? "white" : "#141414"}]}>
                                    {
                                        isNotifActivated && 
                                        <>
                                        <Octicons name='dot-fill' size={15} color="white" />
                                        &nbsp;&nbsp;
                                        </>
                                    }
                                    Notifications
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setisNotifActivated(false)}} style={[styles.buttonSwitch, {backgroundColor : !isNotifActivated ? "#15B99B" : theme === "light" ? "white" : "rgb(228, 228, 228)"}]}>
                                <Text style={[styles.buttonSwitchText,{color : !isNotifActivated ? "white" : "#141414"}]}>
                                    {
                                        !isNotifActivated && 
                                        <>
                                        <Octicons name='dot-fill' size={15} color="white" />
                                        &nbsp;&nbsp;
                                        </>
                                    }
                                    Suivi d’activité
                                </Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={[styles.containerofTwoButtonsSwitch, {borderBottomColor : "rgb(48, 48, 48)"}]} >
                            <TouchableOpacity onPress={()=>{setisNotifActivated(true)}}  style={[styles.buttonSwitch,{backgroundColor : isNotifActivated ? "#15B99B" : "rgb(41, 41, 41)"}]}>
                                <Text style={[styles.buttonSwitchText,{color : isNotifActivated ? "white" : "#E3E3E3"}]}>
                                    {
                                        isNotifActivated && 
                                        <>
                                        <Octicons name='dot-fill' size={15} color="white" />
                                        &nbsp;&nbsp;
                                        </>
                                    }
                                    Notifications
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setisNotifActivated(false)}} style={[styles.buttonSwitch, {backgroundColor : !isNotifActivated ? "#15B99B" : "rgb(41, 41, 41)"}]}>
                                <Text style={[styles.buttonSwitchText,{color : !isNotifActivated ? "white" : "#E3E3E3"},]}>
                                    {
                                        !isNotifActivated && 
                                        <>
                                        <Octicons name='dot-fill' size={15} color="white" />
                                        &nbsp;&nbsp;
                                        </>
                                    }
                                    Suivi d’activité
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                        <FlatList
                            data={isNotifActivated ? notifications : activity}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            style={{
                                backgroundColor : theme === "light" ? "#f2f2f7" : "#141414"
                            }}
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
                            
            }
        </View>
    );
};

export default Activity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 85,
        top: 25,
        alignItems : "center",
        position : "relative",
        width : "100%"
    }, 
    headerText : {
        fontFamily : "JomoFont", 
        fontSize : 22, 
        textAlign : "center", 
    },
    buttonimageUserIcon2 : {
        width : 50, 
        height : 50, 
        borderRadius : 70, 
        borderWidth : 1, 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        alignItems : "center", 
        justifyContent : "center", 
        position : 'absolute', 
        right : 0
    }, 
    containerofTwoButtonsSwitch : {
        flexDirection : "row", 
        alignItems :"center", 
        justifyContent : "space-between", 
        margin : "auto",
        paddingBottom : 15, 
        marginBottom : 15, 
        width : "98%", 
        borderBottomWidth : 1
    }, 
    buttonSwitch : {
        borderRadius : 10, 
        width : "48%",
        alignItems : "center", 
        justifyContent : "center", 
        backgroundColor : "red", 
        height : "auto", 
        paddingVertical : 12, 
        paddingHorizontal : 2
    },
   
    buttonSwitchText : {
        fontFamily : "InterBold", 
        color : "#141414", 
        fontSize : 14
    },
    notificationCompo : {
        width : "98%", 
        height : "auto", 
        flexDirection : "row",
        borderRadius : 9, 
        margin : "auto", 
        paddingVertical : 5, 
        paddingLeft : 0,
        paddingRight : 10,  
        marginBottom : 10, 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        overflow : "hidden"
    },
    containerOfIcon : {
        height : "auto",
        width : 60,
        alignItems : "center", 
        justifyContent : "center"
    },
    insideIcon : {
        height : 35,                 
        width : 35,
        paddingLeft : 1, 
        alignItems : "center", 
        justifyContent : "center", 
        borderRadius : 25,
    } , 
    containerTextDesc : {
        flex : 1, 
        paddingVertical : 5, 
        paddingHorizontal : 0
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
    container6766 : {flex : 1, marginTop : 20}
});