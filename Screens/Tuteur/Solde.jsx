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
  BackHandler, 
  ScrollView, 
  FlatList
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import ENDPOINT_URL from '../../environments/ENDPOINT_URL';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { Keyboard } from 'react-native';
import { useTranslation } from "react-i18next";
import { useAuth } from '../../states/States';
import ErrorModal from '../../Components/ModalError';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';
import { useHistoryStack } from '../../states/HistoryContext';
import { useTheme } from "../../states/ThemeContext";     
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import SingleRowSolde from '../../Components/SingleRowSolde';
import { RefreshControl } from 'react-native';
import SkeletonActivity from '../../Components/SkeletonActivity';
import Sons from '../../fakeData/sons';
import ChildrenPicker from './ChildrenPicker';

const pieData = [
    { value: 35, color: 'rgb(153, 0, 255)', label: 'Alimentation' },
    { value: 25, color: 'rgb(255, 153, 0)', label: 'Fournitures' },
    { value: 20, color: 'rgb(66, 179, 43)', label: 'Activités' },
    { value: 20, color: 'rgb(31, 206, 206)', label: 'Autres' },
];

export default function Solde() {
    const [messageError, setMessageError] = useState(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { getPreviousScreen, popFromHistory } = useHistoryStack();
    const {theme} = useTheme();
    const [IsDashboardActivated, setIsDashboardActivated] = useState(true);
    const total = pieData.reduce((sum, { value }) => sum + value, 0);
    const pieDataWithPercent = pieData.map(item => ({
        ...item,
        text: `${((item.value / total) * 100).toFixed(1)}%`
    }));
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;  
    const [selectedSon, setSelectedSon] = useState(null);



    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };


    const startWavyAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    
    const fetchData = async () => {
        try {      
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            console.error('Error fetching stored date:', error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        startWavyAnimation();
        fetchData();  
        return () => animation.stopAnimation(); 
    }, [refreshing]);


       

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

 
    
    useEffect(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 333,
          useNativeDriver: true,
        }).start();
    }, []);



    const handleSonSelected = (son) => {
        console.log("Selected son:", son);
    };


  return (
    <View style={{ paddingHorizontal : 20,flex: 1, backgroundColor: theme === "light" ? "#f2f2f2" : "#141414" }}>        
        
        <View style={
            [styles.header, {backgroundColor : theme === "light" ? "#f2f2f2" : "#141414"}]
        } />
        {
            loading || refreshing ? 
        <SkeletonActivity theme={theme} />
        :
        <>
            {
                theme === "light" ? 
                    <View 
                        style={
                            [styles.header2, {backgroundColor : theme === "light" ? "#f2f2f2" : "#141414"}, 
                            ]
                        } 
                    >
                        <TouchableOpacity onPress={()=>{setIsDashboardActivated(true)}}  style={[styles.buttonSwitch,{backgroundColor : IsDashboardActivated ? "#15B99B"  : theme === "light" ? "white" : "rgb(228, 228, 228)"}, {borderWidth : 1, borderColor : "gainsboro"}]}>
                            <Text style={[styles.buttonSwitchText,{color : IsDashboardActivated ? "white" : "#141414"}]}>
                                {
                                    IsDashboardActivated && 
                                    <>
                                    <Octicons name='dot-fill' size={15} color="white" />
                                    &nbsp;&nbsp;
                                    </>
                                }
                                Mon Espace
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{setIsDashboardActivated(false)}} style={[styles.buttonSwitch, {backgroundColor : !IsDashboardActivated ? "#15B99B" : theme === "light" ? "white" : "rgb(228, 228, 228)"}, {borderWidth : 1, borderColor : "gainsboro"}]}>
                            <Text style={[styles.buttonSwitchText,{color : !IsDashboardActivated ? "white" : "#141414"}]}>
                                {
                                    !IsDashboardActivated && 
                                    <>
                                    <Octicons name='dot-fill' size={15} color="white" />
                                    &nbsp;&nbsp;
                                    </>
                                }
                                Espace Fils
                            </Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View 
                        style={
                            [styles.header2, {backgroundColor : theme === "light" ? "#f2f2f2" : "#141414"}]
                        } 
                    >
                        <TouchableOpacity onPress={()=>{setIsDashboardActivated(true)}}  style={[styles.buttonSwitch,{backgroundColor : IsDashboardActivated ? "#15B99B"  : theme === "light" ? "white" : "rgb(41, 41, 41)"}]}>
                            <Text style={[styles.buttonSwitchText,{color : IsDashboardActivated ? "white" : "white"}]}>
                                {
                                    IsDashboardActivated && 
                                    <>
                                    <Octicons name='dot-fill' size={15} color="white" />
                                    &nbsp;&nbsp;
                                    </>
                                }
                                Mon Espace
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{setIsDashboardActivated(false)}} style={[styles.buttonSwitch, {backgroundColor : !IsDashboardActivated ? "#15B99B" : theme === "light" ? "white" : "rgb(41, 41, 41)"}]}>
                            <Text style={[styles.buttonSwitchText,{color : !IsDashboardActivated ? "white" : "white"}]}>
                                {
                                    !IsDashboardActivated && 
                                    <>
                                    <Octicons name='dot-fill' size={15} color="white" />
                                    &nbsp;&nbsp;
                                    </>
                                }
                                Espace Fils
                            </Text>
                        </TouchableOpacity>
                    </View>
            }



            <ScrollView 
                style={{marginTop : 12}}  
                showsVerticalScrollIndicator={false} 
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={["#15B99B"]}  
                        tintColor="#15B99B"  
                    />
                }
            >
                {
                    IsDashboardActivated ? 
                    <>
                        <LinearGradient
                            start={{ x : 0, y: 1 }}  
                            end={{ x: 1, y: 0 }}     
                            style={styles.cardOfCalendarBankCard}
                            colors={[
                                "rgb(21, 153, 123)",   
                                "rgb(12, 88, 72)",    
                                "rgb(4, 40, 33)"      
                            ]}
                        >
                            <View
                                style={{
                                    padding : 15, 
                                    width : "100%", 
                                    flexDirection : "row", 
                                    justifyContent : "space-between"
                                }}
                            >

                                <View>
                                    <Text
                                        style={{
                                            fontFamily : "Inter", 
                                            color :"rgb(255, 255, 255)",  
                                            fontSize : 12.5, 
                                        }}
                                    >
                                        Balance actuelle 
                                    </Text>
                                    <View style={{alignItems : 'center', flexDirection : "row"}} >
                                        <Text
                                            style={{
                                                fontFamily : "InterBold", 
                                                color :"rgb(255, 255, 255)",  
                                                fontSize : 27, 
                                            }}
                                        >
                                            2 500 MAD&nbsp;&nbsp;&nbsp;
                                        </Text>
                                        <Octicons name='eye-closed' size={19} color="white" />
                                    </View>
                                </View>
                                <Image
                                    style={{
                                        height : 35, 
                                        width : 100,
                                        zIndex: 99999, 
                                        objectFit : "contain"
                                    }}
                                    source={require("../../assets/unilogox.png")}
                                />
                            </View>
                            <View
                                style={{
                                    padding : 15, 
                                    width : "100%", 
                                    flexDirection : "row", 
                                    justifyContent : "space-between"
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontFamily : "Inter", 
                                            color :"rgb(255, 255, 255)",  
                                            fontSize : 11, 
                                        }}
                                    >
                                        Identificant de carte
                                    </Text>
                                    <View style={{alignItems : 'center', flexDirection : "row"}} >
                                        <Text
                                            style={{
                                                fontFamily : "Inter", 
                                                color :"rgb(255, 255, 255)",  
                                                fontSize : 14, 
                                            }}
                                        >
                                            •••• •••• •••• JFSD93
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontFamily : "Inter", 
                                            color :"rgb(255, 255, 255)",  
                                            fontSize : 11, 
                                            textAlign : "right"
                                        }}
                                    >
                                        Date d'expiration
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily : "Inter", 
                                            color :"rgb(255, 255, 255)",  
                                            fontSize : 11, 
                                            textAlign : "right"
                                        }}
                                    >
                                        25/04/2026
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                        <TouchableOpacity
                            style={[styles.buttonChargerMonCompte,{backgroundColor : theme === "light" ? "white" : "#282828"}, { borderColor : theme === "light" ? "gainsboro" : "rgb(69, 69, 69)"}]}
                        >
                            <Text style={[styles.textOfCharger, {color : theme === "light" ? "#141414" : "white"}]} >
                                Charger mon compte&nbsp;&nbsp;&nbsp;
                            </Text>
                            <Octicons name='chevron-right' size={17} color={theme === "light" ? "#141414" : "white"} />
                        </TouchableOpacity>
                    </>
                    :
                
                    <>
                        
                        <ChildrenPicker
                            sons={Sons}
                            onSelect={handleSonSelected}
                            theme={theme}
                            selectedSon={selectedSon}
                            setSelectedSon={setSelectedSon}
                        />

                        <LinearGradient
                            start={{ x : 0, y: 1 }}  
                            end={{ x: 1, y: 0 }}     
                            style={[styles.cardOfCalendarBankCard, {marginTop : 13}]}
                            colors={[
                                "rgb(21, 153, 123)",   
                                "rgb(12, 88, 72)",    
                                "rgb(4, 40, 33)"      
                            ]}
                        >
                            <View
                                style={{
                                    padding : 15, 
                                    width : "100%", 
                                    flexDirection : "row", 
                                    justifyContent : "space-between"
                                }}
                            >

                                <View>
                                    <Text
                                        style={{
                                            fontFamily : "Inter", 
                                            color :"rgb(255, 255, 255)",  
                                            fontSize : 12.5, 
                                        }}
                                    >
                                        Balance actuelle 
                                    </Text>
                                    <View style={{alignItems : 'center', flexDirection : "row"}} >
                                        <Text
                                            style={{
                                                fontFamily : "InterBold", 
                                                color :"rgb(255, 255, 255)",  
                                                fontSize : 27, 
                                            }}
                                        >
                                            2 500 MAD&nbsp;&nbsp;&nbsp;
                                        </Text>
                                        <Octicons name='eye-closed' size={19} color="white" />
                                    </View>
                                </View>
                                <Image
                                    style={{
                                        height : 35, 
                                        width : 100,
                                        zIndex: 99999, 
                                        objectFit : "contain"
                                    }}
                                    source={require("../../assets/unilogox.png")}
                                />
                            </View>
                            <View
                                style={{
                                    padding : 15, 
                                    width : "100%", 
                                    flexDirection : "row", 
                                    justifyContent : "space-between"
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontFamily : "Inter", 
                                            color :"rgb(255, 255, 255)",  
                                            fontSize : 11, 
                                        }}
                                    >
                                        Identifiant de carte
                                    </Text>
                                    <View style={{alignItems : 'center', flexDirection : "row"}} >
                                        <Text
                                            style={{
                                                fontFamily : "Inter", 
                                                color :"rgb(255, 255, 255)",  
                                                fontSize : 14, 
                                            }}
                                        >
                                            •••• •••• •••• JFSD93
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontFamily : "Inter", 
                                            color :"rgb(255, 255, 255)",  
                                            fontSize : 11, 
                                            textAlign : "right"
                                        }}
                                    >
                                        Date d'expiration
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily : "Inter", 
                                            color :"rgb(255, 255, 255)",  
                                            fontSize : 11, 
                                            textAlign : "right"
                                        }}
                                    >
                                        25/04/2026
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>

                        <TouchableOpacity
                            style={[styles.buttonChargerMonCompte,{backgroundColor : theme === "light" ? "white" : "#282828"}, { borderColor : theme === "light" ? "gainsboro" : "rgb(69, 69, 69)"}]}
                        >
                            <Text style={[styles.textOfCharger, {color : theme === "light" ? "#141414" : "white"}]} >
                                Charger son compte&nbsp;&nbsp;&nbsp;
                            </Text>
                            <Octicons name='chevron-right' size={17} color={theme === "light" ? "#141414" : "white"} />
                        </TouchableOpacity>

                        <View style={[styles.cardOfCalendar, { flexDirection : "column" ,height : "auto", marginTop : 13, borderRadius : 9} , {backgroundColor : theme === "light" ? "white" : "#282828"}]}>
                            <Text
                                style={{
                                    fontFamily : "Inter", 
                                    color : theme === "light" ? "rgb(74, 74, 74)" : "rgb(189, 189, 189)", 
                                    fontSize : 14, 
                                    textAlign : "left", 
                                    width : "100%", 
                                    paddingLeft : 13, 
                                    marginTop : 15, 
                                }}
                            >
                                Totales des dépenses : 
                            </Text>
                            <View
                                style={styles.totalExpenses}
                            >
                                <Text
                                    style={{
                                        fontFamily : "InterBold", 
                                        color : theme === "light" ? "#141414" : "white", 
                                        fontSize : 30, 
                                        position : "relative", 
                                    }}
                                >
                                    8 221 MAD&nbsp;&nbsp;

                                    <Text
                                        style={{
                                            fontFamily : "Inter", 
                                            color : theme === "light" ? "rgb(74, 74, 74)" : "rgb(189, 189, 189)", 
                                            fontSize : 14, 
                                        }}
                                    >
                                        <Octicons name="arrow-up" size={15} color={theme === "light" ? "rgb(74, 74, 74)" : "rgb(189, 189, 189)"} />&nbsp;34% 
                                    </Text>
                                </Text>
                            </View>
                            <PieChart
                                data={pieData}
                                donut
                                showGradient
                                sectionAutoFocus
                                radius={60}
                                innerRadius={40}
                                innerCircleColor={theme === "light" ? "white" : "#282828"}
                                showText
                                textColor={theme === "light" ? "#141414" : "white"}
                                textSize={12}
                                labelsPosition="mid"
                            />
                            <View style={styles.legendContainer}>
                                {pieDataWithPercent.map((item, i) => (
                                    <View key={i} style={styles.legendItem}>
                                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                    <Text style={[styles.legendText, { color: theme === "light" ? "gray" : "rgb(190,190,190)" }]}>
                                        {item.label} — {item.text}
                                    </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </>
                }
                <View style={[styles.cardOfCalendar2, { borderWidth : 1 ,borderColor : theme === "light" ? "gainsboro" : "rgb(69, 69, 69)"},{ flexDirection : "column" ,height : "auto", marginTop : 13, borderRadius : 9} , {backgroundColor : theme === "light" ? "white" : "#282828"}]}>
                    <View
                        style={{
                            marginTop : 17,
                            width : "100%", 
                            alignItems : "center", 
                            flexDirection : "row", 
                            justifyContent : "space-between"
                        }}
                    >
                        <Text
                            style={{
                                fontFamily : "InterMedium", 
                                color : theme === "light" ? "#141414" : "white", 
                                fontSize : 15, 
                                textAlign : "left", 
                            }}
                        >
                            Liste des transactions : 
                        </Text>
                        <Text
                            style={{
                                fontFamily : "Inter", 
                                color : "#15B99B", 
                                fontSize : 14, 
                                textAlign : "left", 
                                textDecorationLine : "underline"
                            }}
                        >
                            Filtrer
                        </Text>
                    </View>

                    <View
                        style={{
                            height : 1.5, 
                            width : "100%",
                            margin : "auto", 
                            borderRadius : 2, 
                            marginVertical : 20,
                            backgroundColor : theme === "light" ? "gainsboro" : "#3A3A3A",                        
                        }}
                    />


                    {[...Array(9)].map((_, index) => (
                        <SingleRowSolde key={index} theme={theme} />
                    ))}

                
                </View>
            </ScrollView> 
        </>
        }
    </View>
  );
}

const styles = StyleSheet.create({
    cardOfCalendar : {
        width : "100%", 
        height : "auto",
        alignItems : "center", 
        flexDirection : "row", 
        alignItems : "center"
    },
    cardOfCalendarBankCard : {
        width : "100%", 
        position : 'relative', 
        justifyContent : 'space-between', 
        flexDirection : "column", 
        height : 167,
        borderRadius  : 15, 
        borderWidth : 1, 
        borderColor : "rgb(13, 150, 125)", 
    },  
    cardOfCalendar2 : {
        paddingHorizontal : 13, 
        width : "100%", 
        height : "auto",
        marginBottom : 15, 
        flexDirection : "row", 
    },
    
    inputOfCalendar : {
        height : 40, 
        width : 40, 
        borderRadius : 10, 
        alignItems : "center", 
        justifyContent : "center", 
        marginLeft : 10, 
    },
    header: {
        height: 20,
        width : "100%"
    },
    header2: {
        height: 50,
        alignItems : "center", 
        justifyContent : "space-between", 
        flexDirection : "row",
        width : "100%"
    },
    inputOfTimeFIlter : {
        width : "100%", 
        height : 43, 
        borderRadius: 10, 
        flexDirection:  "row", 
        alignItems : "center",
        justifyContent : "flex-end"
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
    totalExpenses : {
        width : "100%", 
        position : "relative", 
        height : "auto",
        marginBottom : 10, 
        paddingHorizontal : 13, 
        justifyContent : "flex-end", 
        alignItems : "flex-start"
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom : 15,
      },
      legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical : 4, 
      },
      legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 5,
      },
      legendText: {
        fontSize: 12,
        fontFamily : 'Inter'
      },
    buttonChargerMonCompte : {
        width : "100%", 
        borderWidth : 1,
        height : 48, 
        borderRadius : 8, 
        marginTop : 15,
        alignItems : "center", 
        justifyContent : "center", 
        flexDirection  :"row"
    }, 
    textOfCharger : {
        fontSize : 15, 
        fontFamily : "InterMedium"
    }
}); 
