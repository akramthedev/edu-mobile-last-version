import React, { useState, useRef, useCallback, useEffect } from 'react';
import moment from "moment";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated, 
    ScrollView,
    BackHandler
} from 'react-native';
import 'dayjs/locale/fr';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../i18n";  
import { useAuth } from '../../states/States';
import { useCopilot} from "react-native-copilot";
import {  Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FakeDisponibilities from '../../fakeData/FakeDisponibilities';
import SkeletonPlanning from '../../Components/SkeletonPlanning'
import { useTheme } from '../../states/ThemeContext';
import { useHistoryStack } from '../../states/HistoryContext';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const HOURS = Array.from({ length: 23 - 7 + 1 }, (_, i) => `${7 + i}:00`);

const CreneauxIntervenant = () => {
    const navigation = useNavigation();
    const now = new Date();
    const { 
        isCopilotActive, 
    } = useCopilot();    
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [isRefresh,  setisRefresh] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;  
    const [viewWay, setviewWay] = useState('week');
    const [events, setEvents] = useState(null);
    const [showModal,setShowModal] = useState(false);
    const [eventClicked, seteventClicked] = useState(null);
    const fixedDate = new Date(2025, 3, 7);
    const initialDate = moment().startOf('week').add(1, 'day').toDate();
    const [currentDate, setCurrentDate] = useState(initialDate);
    const handleDateChanged = (newDate: Date) => {
        setCurrentDate(initialDate);
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

               const { getPreviousScreen, popFromHistory, pushToHistory } = useHistoryStack();
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
    
    const fetchStoredDate = async () => {
        try {      
          setIsLoading(true);
          await new Promise(resolve => setTimeout(resolve, 1000));
          setEvents(FakeDisponibilities);
        } catch (error) {
          console.error('Error fetching stored date:', error);
          setEvents([]);
        } finally {
          setIsLoading(false);
        }
      };


    useEffect(() => {
        startWavyAnimation();
        fetchStoredDate();
        return () => animation.stopAnimation(); 
    }, [isRefresh]);
 

 
 
    return (
        <View style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>
            {        
                isLoading || events === null  ? 
                <>
                    <SkeletonPlanning theme={theme} />
                </>
                :
                <>
                    
                    <View 
                        style={[styles.remainingBox, 
                            {backgroundColor : theme === "light" ? "white" : "#282828"}, 
                            {borderWidth : 1}, {borderColor : theme === "light" ? "gainsboro" : "transparent"}
                        ]} 
                    >
                        <ScrollView  showsVerticalScrollIndicator={false} style={styles.container}>
                            <View style={styles.timeline}>
                                <View style={styles.headerXXX}>
                                    <View style={styles.timeColumn} />
                                    {DAYS.map(day => (
                                        <View key={day} style={styles.dayHeader}><Text style={[styles.headerText, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>{day}</Text></View>
                                    ))}
                                </View>
                                <View style={styles.body}>
                                    <View style={styles.timeColumn}>
                                        {HOURS.map(hour => (
                                            <View key={hour} style={styles.timeSlot}><Text style={[styles.timeText, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>{hour}</Text></View>
                                        ))}
                                    </View>
                                    {DAYS.map(day => (
                                        <View key={day} style={[styles.dayColumn, {borderColor : theme === "light" ? "gainsboro" : "gray"}]}>
                                            {events.filter(slot => slot.id === day).map((slot, index) => (
                                                <View key={index} style={[styles.slot, {backgroundColor : theme === "light" ? "rgb(218, 218, 218)" : "rgb(75, 75, 75)"} ,getSlotStyle(slot.start, slot.end)]}>
                                                    <Text style={[styles.slotText, {color : theme === "light" ? "rgb(33, 33, 33)" : "#ffffff"}]}>{`${slot.start}`}</Text>
                                                    <Text style={[styles.slotText, {color : theme === "light" ? "rgb(33, 33, 33)" : "#ffffff"}]}>
                                                        -
                                                    </Text>
                                                    <Text style={[styles.slotText, {color : theme === "light" ? "rgb(33, 33, 33)" : "#ffffff"}]}>{`${slot.end}`}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <View 
                        style={styles.header}
                    >   
                        <TouchableOpacity 
                            style={{
                                backgroundColor : "rgb(255, 89, 0)", 
                                height : 50, 
                                width : "100%", 
                                borderRadius : 10, 
                                alignItems : "center", 
                                justifyContent : "center", 
                                position : "relative", 
                            }}
                            onPress={()=>{
                                pushToHistory("ChoixCreneauxIntervenant");
                                navigation.navigate("Authenticated", { screen: "ChoixCreneauxIntervenant" });
                            }}
                        >
                            <Text style={{
                                fontFamily : "InterBold", 
                                color : "white",
                                fontSize : 15
                            }} >
                                Modifier mes disponibilités
                            </Text>
                            <Octicons
                                style={{
                                    position : "absolute", 
                                    right : 20, 
                                }}
                                name='chevron-right'
                                size={20}
                                color="white"
                            />

                        </TouchableOpacity>
                    </View>
                </>
            }
        </View>
      );
};





const getSlotStyle = (start, end) => {
    const startHour = parseFloat(start.replace(':', '.'));
    const endHour = parseFloat(end.replace(':', '.'));
    return {
        top: (startHour - 7) * 50,
        height: (endHour - startHour) * 50,
    };
};





const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop : 20
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginVertical : 15, 
        width : "100%"
    },
 
    
    remainingBox : {
      flex : 1, 
      width : "100%", 
      marginTop : 0, 
      borderRadius : 13, 
      overflow : "hidden"
    }, 
      


    timeline: { 
        flexDirection: 'column', 
        width: "100%", 
    },
    headerXXX: {
        flexDirection: 'row',
        width: "100%",
        marginBottom: 7,
        marginTop: -8,
        zIndex: 10,  
    },
    timeColumn: { 
        width: "14.2857%",  
        alignItems: 'center', 
    },
    timeSlot: { 
        height: 50, 
        justifyContent: 'center' 
    },
    timeText: { 
        fontFamily : "InterBold", 
        fontSize : 13
    },
    headerText: { 
        textAlign: 'center', 
        fontFamily : "InterBold", 
        fontSize : 13
    },
    body: { 
        flexDirection: 'row', 
        width: "100%" 
    },
    dayColumn: { 
        width: "14.2857%",  
        borderLeftWidth: 1, 
        position: 'relative',
    },
    slot: { 
        position: 'absolute', 
        left: '10%',  
        right:"10%", 
        borderRadius: 5, 
        width : "80%",
        justifyContent: 'center', 
        paddingVertical: 0
    },
    slotText: { 
        textAlign: 'center', 
        fontSize: 13, 
        fontFamily  :"Inter"
    },
    dayHeader: { 
        width: "14.2857%",   
        padding: 10, 
        alignItems: 'center' 
    },
});

export default CreneauxIntervenant;