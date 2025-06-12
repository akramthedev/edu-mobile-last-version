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
import ModalEventClicked from '../../Components/ModalEventClicked'     
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../i18n";  
import { useAuth } from '../../states/States';
import { useCopilot} from "react-native-copilot";
import {  Octicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Calendar, CalendarTouchableOpacityProps, ICalendarEventBase } from 'react-native-big-calendar';
import FakeEvents from '../../fakeData/events';
import SkeletonPlanning from '../../Components/SkeletonPlanning'
import { useTheme } from '../../states/ThemeContext';
import ModalChoixFiliere from '../../Components/ModalChoixFiliere';
import { useHistoryStack } from '../../states/HistoryContext';

const Planning = () => {
    const [headerDate, setHeaderDate] = useState(new Date()); 
    const colorPalette = [
        "#aa02ed", "#ed0235", "#ff8c00", "#1abc9c", "#9b59b6", "#e74c3c", 
        "#34495e", "#2ecc71", "#e67e22", "#7f8c8d"
      ];
    const [isInscriptionOuverte, setisInscriptionOuverte] = useState(false);




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
    


    
    useFocusEffect(
        useCallback(() => {
            setisInscriptionOuverte(false);
        }, [])
    );
   


     
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
        


    
    const fetchStoredDate = async () => {
        try {      
          setIsLoading(true);
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const filteredEvents = FakeEvents.map((event, index) => {
            const colorIndex = index % colorPalette.length; 
            return {
              ...event,
              color: colorPalette[colorIndex],
            };
          });
      
          setEvents(filteredEvents);
        } catch (error) {
          console.error('Error fetching stored date:', error);
          setEvents([]);
        } finally {
          setIsLoading(false);
        }
      };



      const formatDisplayedDate = (date, view) => {
        if (!date) return "N/A";
    
        if (view === 'day') {
            return moment(date).format('DD/MM/YYYY'); 
        } else if (view === 'week') {
            let startOfWeek = moment(date).startOf('week'); 
            let endOfWeek = moment(date).endOf('week'); 
            return `${startOfWeek.format('DD/MM/YYYY')} - ${endOfWeek.format('DD/MM/YYYY')}`;
        } else if (view === 'month') {
            return moment(date).format('MM/YYYY'); 
        }
        return '';      
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

 


   

    useEffect(() => {
        startWavyAnimation();
        fetchStoredDate();  
        return () => animation.stopAnimation(); 
    }, [isRefresh]);


    
      
    const renderEvent = <T extends ICalendarEventBase>(
        event: T,
        touchableOpacityProps: CalendarTouchableOpacityProps
      ) => {
        const { key, ...restProps } = touchableOpacityProps; 
      
        return (
          <TouchableOpacity key={key} {...restProps} style={[restProps.style, styles.customEvent, {paddingLeft : viewWay === "day" ? 20 : 0 }, {justifyContent : viewWay !== "day" ? "center" : null }, {alignItems : viewWay !== "day" ? "center" : null }, { backgroundColor: event.color || "#e65a03" }]}>
          {viewWay === "day" ?
          <>
            <View
                style={{
                  position: "absolute",
                  left: 6,        
                  top: 4,
                  width: 4,
                  borderRadius: 10,
                  backgroundColor: "white",
                  height: "100%",
                }}
            />
            <Text style={styles.eventText}>{event.title}</Text>
            <Text style={styles.eventText2}>Prof. Adamo Jack</Text>
            <Text style={styles.eventText2}>Salle AII</Text>
            <Text style={styles.eventText2}>
              {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} —{" "}
              {event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </>
          :
          <Text style={styles.eventTextType}>{event.type}</Text>
          } 
          </TouchableOpacity>                             
        );
      };
      

 

 
    return (
        <View style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>

            <ModalChoixFiliere 
                modalVisible={isInscriptionOuverte}
                setModalVisible={setisInscriptionOuverte}
                theme={theme}
            />
    
            {        
                isLoading || events === null  ? 
                <>
                    <SkeletonPlanning theme={theme} />
                    <View style={{ flex : 1, backgroundColor: "transparent", alignItems: "center", justifyContent: "flex-end", paddingBottom : 34}} >
                        <Text style={{ fontFamily: "Inter", color: "rgb(155, 155, 155)", fontSize: 12, textAlign : "center", marginBottom : -3 }}>
                            <Octicons name='pin' size={14} color="rgb(155, 155, 155)" />&nbsp;&nbsp;Astuce : Faites glisser votre doigt <Text style={{textDecorationLine : "underline", fontFamily : "InterBold"}}>horizontalement</Text>&nbsp;<Text style={{ fontFamily : "InterBold"}}>(sans inclinaison)</Text> vers la gauche ou la droite pour modifier la date.
                        </Text>
                    </View>
                </>
                :
                <>
                    <ModalEventClicked 
                        eventClicked={eventClicked}
                        seteventClicked={seteventClicked}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        theme={theme}
                    />
                  
                    
                        <View style={{height: 'auto', width: "100%", flexDirection : "row" , backgroundColor: "transparent", marginTop: 15, marginBottom : 10, justifyContent: "space-between"}} >
                            {
                                viewWay !== "liste" ?
                                <>
                                    <Text style={[styles.sfwdfouwoduf,{color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                                        Date affichée :
                                    </Text>
                                    <Text style={[styles.cardian, { color : theme === "light" ? "#141414" : "#E3E3E3" }]}>
                                        { headerDate ? formatDisplayedDate(headerDate, viewWay) : "N/A"}
                                    </Text>
                                </>
                                :
                                <>
                                    <Text style={[styles.sfwdfouwoduf,{color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                                        Date affichée :
                                    </Text>
                                    <Text style={[styles.cardian, { color : theme === "light" ? "#141414" : "#E3E3E3" }]}>
                                        28/03/2025 - 02/04/2025
                                    </Text>
                                </>
                            }
                        </View>

                    {
                        theme === "light" ? 
                        <View style={styles.containerOfViews} >
                            <TouchableOpacity  onPress={()=>{setviewWay('day')}}  style={[styles.singleView, {borderColor : "rgb(221, 221, 221)" } ,styles.singleViewFirstOne, {backgroundColor : viewWay === "day" ? "#15B99B" : "white"}]} >
                                <Text style={[styles.text1X1, {color : viewWay === "day" ? "white" : "#141414"}]} >
                                        {
                                            viewWay === "day" && 
                                            <>
                                            <Octicons name='dot-fill' size={14} color={viewWay === "day" ? "white" : "#141414"} />
                                            &nbsp;
                                            </>
                                        }
                                    Jour
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setviewWay('week')}}  style={[styles.singleView, {borderColor : "rgb(221, 221, 221)" }, {backgroundColor : viewWay === "week" ? "#15B99B" : "white"}]} >
                                <Text style={[styles.text1X1, {color : viewWay === "week" ? "white" : "#141414"}]} >
                                        {
                                            viewWay === "week" && 
                                            <>
                                            <Octicons name='dot-fill' size={14} color={viewWay === "week" ? "white" : "#141414"} />
                                            &nbsp;
                                            </>
                                        }Semaine
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setviewWay('month')}} style={[styles.singleView, {borderColor : "rgb(221, 221, 221)" },  {backgroundColor : viewWay === "month" ? "#15B99B" : "white"}]} >
                                <Text style={[styles.text1X1, {color : viewWay === "month" ? "white" : "#141414"}]} >
                                {
                                            viewWay === "month" && 
                                            <>
                                            <Octicons name='dot-fill' size={14} color={viewWay === "month" ? "white" : "#141414"} />
                                            &nbsp;
                                            </>
                                        }Mois    
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setviewWay('liste')}} style={[styles.singleView, styles.singleViewLastOne, {borderColor : "rgb(221, 221, 221)" },  {backgroundColor : viewWay === "liste" ? "#15B99B" : "white"}]} >
                                <Text style={[styles.text1X1, {color : viewWay === "liste" ? "white" : "#141414"}]} >
                                {
                                            viewWay === "liste" && 
                                            <>
                                            <Octicons name='dot-fill' size={14} color={viewWay === "liste" ? "white" : "#141414"} />
                                            &nbsp;
                                            </>
                                        }Liste    
                                </Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.containerOfViews} >
                            <TouchableOpacity  onPress={()=>{setviewWay('day')}}  style={[styles.singleViewX,styles.singleViewFirstOne, {borderColor : "rgb(69, 69, 69)" }, {backgroundColor : viewWay === "day" ? "#15B99B" : "#282828"}]} >
                                <Text style={[styles.text1X1, {color : viewWay === "day" ? "white" : "#E3E3E3"}]} >
                                    
                                        {
                                            viewWay === "day" && 
                                            <>
                                            <Octicons name='dot-fill' size={14} color="white" />
                                            &nbsp;
                                            </>
                                        }
                                    Jour
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setviewWay('week')}}  style={[styles.singleViewX, {borderColor : "rgb(69, 69, 69)" },{backgroundColor : viewWay === "week" ? "#15B99B" : "#282828"}]} >
                                <Text style={[styles.text1X1, {color : viewWay === "week" ? "white" : "#E3E3E3"}]} >
                                {
                                            viewWay === "week" && 
                                            <>
                                            <Octicons name='dot-fill' size={14} color="white" />
                                            &nbsp;
                                            </>
                                        }
                                    Semaine
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setviewWay('month')}} style={[styles.singleViewX, {borderColor : "rgb(69, 69, 69)" }, {backgroundColor : viewWay === "month" ? "#15B99B" : "#282828"}]} >
                                <Text style={[styles.text1X1, {color : viewWay === "month" ? "white" : "#E3E3E3"}]} >
                                {
                                            viewWay === "month" && 
                                            <>
                                            <Octicons name='dot-fill' size={14} color="white" />
                                            &nbsp;
                                            </>
                                        }
                                    Mois
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setviewWay('liste')}} style={[styles.singleViewX, styles.singleViewLastOne, {borderColor : "rgb(221, 221, 221)" },  {backgroundColor : viewWay === "liste" ? "#15B99B" : "#282828"}]} >
                                <Text style={[styles.text1X1, {color : viewWay === "month" ? "white" : "#E3E3E3"}]} >
                                {
                                            viewWay === "liste" && 
                                            <>
                                            <Octicons name='dot-fill' size={14} color={viewWay === "liste" ? "white" : "#141414"} />
                                            &nbsp;
                                            </>
                                        }Liste    
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }


                    {
                        viewWay === "liste" ? 
                            
                    <ScrollView 
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={[
                        styles.remainingBox2, 
                        {backgroundColor : theme === "light" ? "white" : "#282828"}, 
                        { borderWidth : 1}, 
                        {borderColor : theme === "light" ? "gainsboro" : "transparent"}]}
                    >
                        <View style={styles.headerOfList} >
                            <Text style={[styles.headerOfListText, {color : theme === "light" ? "#141414" : "gray"}]}>                                
                                Lundi
                            </Text>
                            <Text style={[styles.headerOfListText, {color : theme === "light" ? "#141414" : "gray"}]}>                                
                                28/03/2025
                            </Text>
                        </View>


                        <View style={[styles.containerX89, { borderBottomColor : theme === "light" ? "gainsboro" : "gray"}]} >
                            <View style={styles.BodyOfList} >
                                <Text style={[styles.BodyOfListText2]}>
                                    08:45 - 12:00
                                </Text>
                                <Text style={[styles.BodyOfListText2]}>
                                    INF3071 TP S303
                                </Text>
                            </View>

                            <View style={styles.BodyOfList} >
                                <Text style={[styles.BodyOfListText2]}>
                                    12:30 - 14:00
                                </Text>
                                <Text style={[styles.BodyOfListText2]}>
                                    LAG3001 CM Accra
                                </Text>
                            </View>

                            <View style={styles.BodyOfList} >
                                <Text style={[styles.BodyOfListText2]}>
                                    14:30 - 16:30
                                </Text>
                                <Text style={[styles.BodyOfListText2]}>
                                    INF3031 CO788
                                </Text>
                            </View>
                        </View>



                        <View style={styles.headerOfList} >
                            <Text style={[styles.headerOfListText, {color : theme === "light" ? "#141414" : "gray"}]}>                                
                                Mardi
                            </Text>
                            <Text style={[styles.headerOfListText, {color : theme === "light" ? "#141414" : "gray"}]}>                                
                                29/03/2025
                            </Text>
                        </View>


                        <View style={[styles.containerX89, { borderBottomColor : theme === "light" ? "gainsboro" : "gray"}]} >
                            <View style={styles.BodyOfList} >
                                <Text style={[styles.BodyOfListText2]}>
                                    08:45 - 12:00
                                </Text>
                                <Text style={[styles.BodyOfListText2]}>
                                    INF3071 TP S303
                                </Text>
                            </View>

                            <View style={styles.BodyOfList} >
                                <Text style={[styles.BodyOfListText2]}>
                                    12:30 - 14:00
                                </Text>
                                <Text style={[styles.BodyOfListText2]}>
                                    LAG3001 CM Accra
                                </Text>
                            </View>

                        </View>


                        
                        <View style={styles.headerOfList} >
                            <Text style={[styles.headerOfListText, {color : "#15B99B"}]}>                                
                                Mercredi
                            </Text>
                            <Text style={[styles.headerOfListText, {color : "#15B99B"}]}>                                
                                30/03/2025
                            </Text>
                        </View>
                        


                        <View style={[styles.containerX89, { borderBottomColor : theme === "light" ? "gainsboro" : "gray"}]} >
                            <View style={[styles.BodyOfList]} >
                                <Text style={[[styles.BodyOfListText2, {color : theme === "light" ? "#141414" : "white"}]]}>
                                    08:45 - 12:00
                                </Text>
                                <Text style={[[styles.BodyOfListText2, {color : theme === "light" ? "#141414" : "white"}]]}>
                                    INF3071 TP S303
                                </Text>
                            </View>

                            <View style={styles.BodyOfList} >
                                <Text style={[[styles.BodyOfListText2, {color : theme === "light" ? "#141414" : "white"}]]}>
                                    12:30 - 14:00
                                </Text>
                                <Text style={[[styles.BodyOfListText2, {color : theme === "light" ? "#141414" : "white"}]]}>
                                    LAG3001 CM Accra
                                </Text>
                            </View>

                            <View style={styles.BodyOfList} >
                                <Text style={[[styles.BodyOfListText2, {color : theme === "light" ? "#141414" : "white"}]]}>
                                    14:30 - 16:00
                                </Text>
                                <Text style={[[styles.BodyOfListText2, {color : theme === "light" ? "#141414" : "white"}]]}>
                                    LAG3001 CM Accra
                                </Text>
                            </View>
                        </View>


                        
                        <View style={styles.headerOfList} >
                            <Text style={[styles.headerOfListText, {color : theme === "light" ? "#141414" : "gray"}]}>                                
                                Jeudi
                            </Text>
                            <Text style={[styles.headerOfListText, {color : theme === "light" ? "#141414" : "gray"}]}>                                
                                31/03/2025
                            </Text>
                        </View>


                        <View style={[styles.containerX89, { borderBottomColor : theme === "light" ? "gainsboro" : "gray"}]} >
                            <View style={styles.BodyOfList} >
                                <Text style={[styles.BodyOfListText2]}>
                                    08:45 - 12:00
                                </Text>
                                <Text style={[styles.BodyOfListText2]}>
                                    INF3071 TP S303
                                </Text>
                            </View>

                            <View style={styles.BodyOfList} >
                                <Text style={[styles.BodyOfListText2]}>
                                    12:30 - 14:00
                                </Text>
                                <Text style={[styles.BodyOfListText2]}>
                                    LAG3001 CM Accra
                                </Text>
                            </View>
                        </View>


                        
                        <View style={styles.headerOfList} >
                            <Text style={[styles.headerOfListText, {color : theme === "light" ? "#141414" : "gray"}]}>                                
                                Vendredi
                            </Text>
                            <Text style={[styles.headerOfListText, {color : theme === "light" ? "#141414" : "gray"}]}>                                
                                01/04/2025
                            </Text>
                        </View>


                        <View style={[styles.containerX89, { borderBottomColor : theme === "light" ? "gainsboro" : "gray"}]} >
                            <View style={styles.BodyOfList} >
                                <Text style={[styles.BodyOfListText2]}>
                                    08:45 - 12:00
                                </Text>
                                <Text style={[styles.BodyOfListText2]}>
                                    INF3071 TP S303
                                </Text>
                            </View>

                            <View style={styles.BodyOfList} >
                                <Text style={[styles.BodyOfListText2]}>
                                    12:30 - 14:00
                                </Text>
                                <Text style={[styles.BodyOfListText2]}>
                                    LAG3001 CM Accra
                                </Text>
                            </View>
                        </View>


                          
                        <View style={styles.headerOfList} >
                            <Text style={[styles.headerOfListText, {color : theme === "light" ? "#141414" : "gray"}]}>                                
                                Samedi
                            </Text>
                            <Text style={[styles.headerOfListText, {color : theme === "light" ? "#141414" : "gray"}]}>                                
                                02/04/2025
                            </Text>
                        </View>


                        <View style={[styles.containerX89, { borderBottomColor : theme === "light" ? "gainsboro" : "gray"}]} >
                            <View style={styles.BodyOfList} >
                                <Text style={[styles.BodyOfListText2]}>
                                    08:45 - 12:00
                                </Text>
                                <Text style={[styles.BodyOfListText2]}>
                                    INF3071 TP S303
                                </Text>
                            </View>

                            <View style={styles.BodyOfList} >
                                <Text style={[styles.BodyOfListText2]}>
                                    12:30 - 14:00
                                </Text>
                                <Text style={[styles.BodyOfListText2]}>
                                    LAG3001 CM Accra
                                </Text>
                            </View>
                        </View>



                    </ScrollView>
                    :
                        
                    <View style={[styles.remainingBox, 
                        {backgroundColor : theme === "light" ? "white" : "#282828"}, 
                        {
                            borderWidth : 1
                        }, {
                            borderColor : theme === "light" ? "gainsboro" : "transparent"
                        }]} >
                    
                            
                                <Calendar
                                    events={events}
                                    mode={(viewWay === null || viewWay === "" || viewWay === "liste") ? "week" : viewWay}
                                    showTime
                                    locale="fr"
                                    minHour={6}
                                    hideNowIndicator={false}
                                    showVerticalScrollIndicator={false}
                                    maxHour={23}
                                    height={200}
                                    onSwipeEnd={(date) => {
                                        setHeaderDate(date); 
                                    }}                         
                                    moreLabel="+ autres"
                                    style={styles.calendar}
                                    onPressEvent={(event) => {
                                        if (event.end.getHours() >= 23 && event.end.getMinutes() > 0) {
                                        alert('Oups, une erreur est survenue...');
                                        return;
                                        }
                                        seteventClicked(event);
                                        console.warn(event);
                                        setShowModal(true);
                                    }}
                                    overlapOffset={8}
                                    renderEvent={renderEvent}
                                /> 
                        
        
                    </View>
                    }
                    {
                        viewWay !== "liste" && 
                        <View style={{height: 50, width: "100%", backgroundColor: "transparent", alignItems: "center", justifyContent: "center", paddingBottom : 12}} >
                            <Text style={{ fontFamily: "Inter", color: "rgb(155, 155, 155)", fontSize: 12, textAlign : "center", marginBottom : -3 }}>
                                <Octicons name='pin' size={14} color="rgb(155, 155, 155)" />&nbsp;&nbsp;Astuce : Faites glisser votre doigt <Text style={{textDecorationLine : "underline", fontFamily : "InterBold"}}>horizontalement</Text>&nbsp;<Text style={{ fontFamily : "InterBold"}}>(sans inclinaison)</Text> vers la gauche ou la droite pour modifier la date.
                            </Text>
                        </View>
                    }
                </>
            }

           
        </View>
      );
};

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
        position : "relative",
        width : "100%"
    },
    buttonimageUserIcon2 : {
        width : 50, 
        height : 50, 
        backgroundColor : "white", 
        borderRadius : 70, 
        borderColor : "#EFEFEF", 
        borderWidth : 1, 
        shadowColor:"rgb(188, 188, 188)", 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        alignItems : "center", 
        justifyContent : "center", 
        position : 'absolute', 
        right : 0
    }, 
    headerText : {
        color : "#141414", 
        fontFamily : "JomoFont", 
        fontSize : 22, 
        textAlign : "center", 
    },
    calendar: {
        flex : 1, 
        overflow : "hidden"
    },
    containerOfViews : {
        width : "100%", 
        height : 55, 
        marginTop : 0, 
        alignItems : "center", 
        justifyContent : "space-between", 
        flexDirection : 'row'
    },
    modeDaffichage : {
        flexDirection : "row"
    },
    text1X1 : {
        fontFamily : "Inter", 
        fontSize : 13, 
    }, 
    textModeAff : {
        fontFamily : "Inter", 
        fontSize : 13
    },
    
    remainingBox : {
      flex : 1, 
      width : "100%", 
      marginTop : 0, 
      marginBottom : 8, 
      borderRadius : 13, 
      borderTopEndRadius : 0, 
      borderTopStartRadius : 0, 
      overflow : "hidden"
    }, 
    remainingBox2 : {
        flex : 1, 
        width : "100%", 
        marginTop : 0, 
        marginBottom : 8, 
        borderRadius : 0, 
        padding : 10, 
        overflow : "hidden", 
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 10,
        padding: 13,
        width: '90%',
    },
    dayContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      dateText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      moreText: {
        fontSize: 12,
        color: 'gray',
      },

      customEvent: {
        paddingRight : 3, 
        borderRadius: 10,
      },
      eventText: {
        color: 'white',  
        fontSize: 13,
        fontFamily : "InterBold"
    },
    eventTextType : {
        color: 'white',  
        fontSize: 13,
        fontFamily : "InterBold"
    },
    eventText2: {
        color: 'white',  
        fontSize: 12,
        fontFamily : "Inter", 
        marginBottom : -2
    },
    eventText3: {
        color: 'white',  
        fontSize: 13,
        fontFamily : "Inter"
    },
    eventText4: {
        color: 'white',  
        fontSize: 13,
        fontFamily : "Inter"
    },

    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        margin: 15,
      },
      loaderText: {
        fontFamily: 'Inter',
        fontSize: 14,
        letterSpacing: 0.3,
      },
      sfwdfouwoduf : {
        fontFamily: "InterBold", fontSize: 14
       },

       singleView : {
        width : "24%",  
        paddingVertical : 8, 
        paddingHorizontal : 2, 
        height : 45, 
        alignItems : "center", 
        justifyContent : "center",
        backgroundColor : "#E3E3E3", 
        shadowColor:"rgb(188, 188, 188)", 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        borderWidth : 1, 
        borderBottomEndRadius : 0, 
        borderBottomStartRadius : 0
    },
    
       singleViewX : {
        width : "24%", 
        paddingVertical : 8, 
        paddingHorizontal : 2, 
        height : 45, 
        alignItems : "center", 
        justifyContent : "center",
        backgroundColor : "rgb(43, 43, 43)", 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        borderBottomEndRadius : 0, 
        borderBottomStartRadius : 0
    },
        
    singleViewFirstOne : {
        borderTopEndRadius : 0, 
        borderRadius : 13, 
    },
    singleViewLastOne : {
        borderTopStartRadius : 0, 
        borderRadius : 13, 
    },
    headerOfList : {
        width : "100%", 
        flexDirection : "row", 
        justifyContent : "space-between", 
        alignItems : "center", 
        marginTop : 20
    }, 
    BodyOfList : {
        width : "100%", 
        flexDirection : "row", 
        justifyContent : "space-between", 
        alignItems : "center", 
        marginTop : 9
    },
    cardian : {
        fontFamily: "InterMedium", fontSize: 13.5
    }, 
    headerOfListText : {
        fontFamily : "InterBold", 
        fontSize : 14, 
        color : "#15B99B"   
    }, 
    BodyOfListText2 : {
        fontFamily : "Inter", 
        fontSize : 14, 
        color : "rgb(134, 134, 134)", 
        marginBottom : -5
    },
    containerX89 : {
        marginTop : 7, 
        flexDirection : "column", 
        paddingBottom : 25, 
        marginBottom : 1, 
        borderBottomWidth : 1, 
    },
});

export default Planning;
                  

 