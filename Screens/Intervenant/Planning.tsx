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
import { useCopilot } from "react-native-copilot";
import { Octicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Calendar, CalendarTouchableOpacityProps, ICalendarEventBase } from 'react-native-big-calendar';
import FakeEvents from '../../fakeData/events';
import SkeletonPlanning from '../../Components/SkeletonPlanning'
import { useTheme } from '../../states/ThemeContext';
import ModalChoixFiliere from '../../Components/ModalChoixFiliere';
import Timeline from 'react-native-timeline-flatlist';
import ModalEventClickedIntervenant from '../../Components/ModalEventClickedIntervenant';
import groupedTimelineData from '../../fakeData/timelineData';
import { useHistoryStack } from '../../states/HistoryContext';



const Planning = () => {
    const [headerDate, setHeaderDate] = useState(new Date()); 
    const colorPalette = [
        "#aa02ed", "#ed0235", "#ff8c00", "#1abc9c", "#9b59b6", "#e74c3c", 
        "#34495e", "#2ecc71", "#e67e22", "#7f8c8d"
      ];
    const [isInscriptionOuverte, setisInscriptionOuverte] = useState(false);
    const navigation = useNavigation();
    const now = new Date();
    const scrollOffsetMinutes = now.getHours() * 60 + now.getMinutes();
    const dayName = now.toLocaleDateString('fr-FR', { weekday: 'long' });
    const dayNumber = now.getDate();
    const { 
        isCopilotActive, 
    } = useCopilot();    
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [isRefresh,  setisRefresh] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;  
    const [viewWay, setviewWay] = useState('liste');
    const [events, setEvents] = useState(null);
    const [showModal,setShowModal] = useState(false);
    const [eventClicked, seteventClicked] = useState(null);
    
    
  

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


 
    
    const fetchStoredDate = async () => {
        try {      
          setIsLoading(true);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
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


        
    
    useFocusEffect(
        useCallback(() => {
            startWavyAnimation();
            fetchStoredDate();      
        }, [theme])
    );
   
      
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
                    <ModalEventClickedIntervenant 
                        eventClicked={eventClicked}
                        seteventClicked={seteventClicked}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        theme={theme}
                    />
                  
                    {
                        viewWay !== "liste" ?
                        <View style={{height: 'auto', width: "100%", flexDirection : "row" , backgroundColor: "transparent", marginTop: 15, marginBottom : 10, justifyContent: "space-between"}} >
                            <Text style={[styles.sfwdfouwoduf,{color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                                Date affichée :
                            </Text>
                            <Text style={[styles.cardian, { color : theme === "light" ? "#141414" : "#E3E3E3" }]}>
                                { headerDate ? formatDisplayedDate(headerDate, viewWay) : "N/A"}
                            </Text>
                        </View>
                        :
                        <View
                            style={{
                                height : 50, 
                                marginTop : 13,
                                width : "100%", 
                                flexDirection : "row", 
                                justifyContent : "space-between", 
                                alignItems : "center",
                                marginBottom : 4.5
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    height : 50, 
                                    width : 50, 
                                    borderRadius :25,
                                    alignItems : "center", 
                                    justifyContent : "center", 
                                    backgroundColor : theme === "light" ? "white" : "#282828", 
                                    borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 ,
                                    shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828", 
                                    borderColor : theme === "light" ?  "#EFEFEF" : "#282828", 
                                }}
                            >
                                <Octicons
                                    style={{
                                    }}
                                    name="chevron-left"
                                    color={theme === "light" ? "#141414" : "#E3E3E3"}
                                    size={18}
                                />
                            </TouchableOpacity>
                            <Text style={{
                                fontSize : 16, 
                                fontFamily  : "InterBold", 
                                color : theme === "light" ? "#141414" : "#E3E3E3", 
                                textAlign : "center", 
                            }}>
                                17 Avril - 22 Avril
                            </Text>
                            <TouchableOpacity
                                style={{
                                    height : 50, 
                                    width : 50, 
                                    borderRadius :25,
                                    alignItems : "center", 
                                    justifyContent : "center", 
                                    backgroundColor : theme === "light" ? "white" : "#282828", 
                                    borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 ,
                                    shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828", 
                                    borderColor : theme === "light" ?  "#EFEFEF" : "#282828", 
                                }}
                            >
                                <Octicons
                                    style={{
                                    }}
                                    name="chevron-right"
                                    color={theme === "light" ? "#141414" : "#E3E3E3"}
                                    size={18}
                                />
                            </TouchableOpacity>
                        </View>
                    }

                    {
                        theme === "light" ? 
                        <View style={styles.containerOfViews} >
                            
                            <TouchableOpacity onPress={()=>{setviewWay('liste')}} style={[styles.singleView, styles.singleViewFirstOne,  {borderColor : "rgb(221, 221, 221)" },  {backgroundColor : viewWay === "liste" ? "#15B99B" : "white"}]} >
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

                            <TouchableOpacity  onPress={()=>{setviewWay('day')}}  style={[styles.singleView, {borderColor : "rgb(221, 221, 221)" } , {backgroundColor : viewWay === "day" ? "#15B99B" : "white"}]} >
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
                            <TouchableOpacity onPress={()=>{setviewWay('month')}} style={[styles.singleView, styles.singleViewLastOne,{borderColor : "rgb(221, 221, 221)" },  {backgroundColor : viewWay === "month" ? "#15B99B" : "white"}]} >
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
                        </View>
                        :
                        <View style={styles.containerOfViews} >
                            
                            <TouchableOpacity onPress={()=>{setviewWay('liste')}} style={[styles.singleViewX, styles.singleViewFirstOne,{borderColor : "rgb(221, 221, 221)" },  {backgroundColor : viewWay === "liste" ? "#15B99B" : "#282828"}]} >
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

                            <TouchableOpacity  onPress={()=>{setviewWay('day')}}  style={[styles.singleViewX, {borderColor : "rgb(69, 69, 69)" }, {backgroundColor : viewWay === "day" ? "#15B99B" : "#282828"}]} >
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
                            <TouchableOpacity onPress={()=>{setviewWay('month')}} style={[styles.singleViewX,styles.singleViewLastOne,  {borderColor : "rgb(69, 69, 69)" }, {backgroundColor : viewWay === "month" ? "#15B99B" : "#282828"}]} >
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
                        </View>
                    }


                    {
                    
                    viewWay === "liste" ? 
                  
                    <>
                        <ScrollView
                            contentContainerStyle={{
                                paddingBottom: 20,
                            }}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                        >
                            <View
                                style={[
                                    styles.remainingBox2,
                                    { backgroundColor: theme === "light" ? "white" : "#282828" },
                                    { borderWidth: 1 },
                                    { borderColor: theme === "light" ? "gainsboro" : "transparent" },
                                ]}
                            >
                                
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontFamily: "InterBold",
                                                color: "#15B99B",
                                                marginTop : 5, 
                                                marginLeft: 10,
                                            }}
                                        >
                                            {groupedTimelineData[0].day} Avril : 
                                        </Text>

                                        {
                                            !groupedTimelineData[0].events || groupedTimelineData[0].events.length === 0 ? 
                                            
                                            <Text style={{
                                                color : "gray", 
                                                fontFamily : "Inter", 
                                                fontSize : 12, 
                                                width : "100%", 
                                                textAlign : "center", 
                                                marginVertical : 24
                                            }}>
                                                Pas de séance ce jour-là
                                            </Text>
                                            :
                                            <Timeline
                                            style={{
                                                marginBottom : 24,
                                                marginTop : 15,  
                                            }}
                                            data={groupedTimelineData[0].events}
                                            circleSize={12}
                                            lineColor={theme === "light" ? "#15B99B" : "#15B99B"}
                                            circleColor="#15B99B"
                                            timeContainerStyle={{ minWidth: 52 }}
                                            timeStyle={{
                                                textAlign: "center",
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "InterBold",
                                                fontSize: 13,
                                                marginTop: -3.6,
                                                marginLeft: 10,
                                            }}
                                            titleStyle={{
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "Inter",
                                                fontSize: 13,
                                                fontWeight: "bold",
                                            }}
                                            descriptionStyle={{
                                                color: "gray",
                                                fontSize: 13,
                                                fontWeight: "500",
                                            }}
                                            renderDetail={(rowData) =>
                                            rowData.title && (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor:
                                                        theme === "light" ? "rgb(247, 247, 247)" : "rgb(47, 47, 47)",
                                                        borderRadius: 5,
                                                        padding: 15,
                                                        position: "relative",
                                                        marginBottom: -9,
                                                        marginRight: 10,
                                                    }}
                                                    onPress={() => {
                                                        seteventClicked({ title: rowData.title });
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: theme === "light" ? "#141414" : "#E3E3E3",
                                                            fontFamily: "InterBold",
                                                            fontSize: 13,
                                                            marginBottom: 5,
                                                            height: "auto",
                                                            maxWidth: "90%",
                                                        }}
                                                    >
                                                        {rowData.title}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: "gray",
                                                            fontFamily: "Inter",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        {rowData.description}
                                                    </Text>
                                                    <Octicons
                                                        style={{
                                                            position: "absolute",
                                                            right: 10,
                                                            top: "57%",
                                                        }}
                                                        name="chevron-right"
                                                        color={theme === "light" ? "#141414" : "#E3E3E3"}
                                                        size={18}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        />
                                        }
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontFamily: "InterBold",
                                                color: "#15B99B",
                                                marginTop : 5, 
                                                marginLeft: 10,
                                            }}
                                        >
                                            {groupedTimelineData[1].day} Avril : 
                                        </Text>

                                        {
                                            !groupedTimelineData[1].events || groupedTimelineData[1].events.length === 0 ? 
                                            
                                            <Text style={{
                                                color : "gray", 
                                                fontFamily : "Inter", 
                                                fontSize : 12, 
                                                width : "100%", 
                                                textAlign : "center", 
                                                marginVertical : 24
                                            }}>
                                                Pas de séance ce jour-là
                                            </Text>

                                            :
                                            <Timeline
                                            style={{
                                                marginBottom : 24,
                                                marginTop : 15,  
                                            }}                                           
                                            data={groupedTimelineData[1].events}
                                            circleSize={12}
                                            lineColor={theme === "light" ? "#15B99B" : "#15B99B"}
                                            circleColor="#15B99B"
                                            timeContainerStyle={{ minWidth: 52 }}
                                            timeStyle={{
                                                textAlign: "center",
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "InterBold",
                                                fontSize: 13,
                                                marginTop: -3.6,
                                                marginLeft: 10,
                                            }}
                                            titleStyle={{
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "Inter",
                                                fontSize: 13,
                                                fontWeight: "bold",
                                            }}
                                            descriptionStyle={{
                                                color: "gray",
                                                fontSize: 13,
                                                fontWeight: "500",
                                            }}
                                            renderDetail={(rowData) =>
                                            rowData.title && (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor:
                                                        theme === "light" ? "rgb(247, 247, 247)" : "rgb(47, 47, 47)",
                                                        borderRadius: 5,
                                                        padding: 15,
                                                        position: "relative",
                                                        marginBottom: -9,
                                                        marginRight: 10,
                                                    }}
                                                    onPress={() => {
                                                        seteventClicked({ title: rowData.title });
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: theme === "light" ? "#141414" : "#E3E3E3",
                                                            fontFamily: "InterBold",
                                                            fontSize: 13,
                                                            marginBottom: 5,
                                                            height: "auto",
                                                            maxWidth: "90%",
                                                        }}
                                                    >
                                                        {rowData.title}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: "gray",
                                                            fontFamily: "Inter",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        {rowData.description}
                                                    </Text>
                                                    <Octicons
                                                        style={{
                                                            position: "absolute",
                                                            right: 10,
                                                            top: "57%",
                                                        }}
                                                        name="chevron-right"
                                                        color={theme === "light" ? "#141414" : "#E3E3E3"}
                                                        size={18}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        />
                                        }
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontFamily: "InterBold",
                                                color: "#15B99B",
                                                marginTop : 5, 
                                                marginLeft: 10,
                                            }}
                                        >
                                            {groupedTimelineData[2].day} Avril : 
                                        </Text>

                                        {
                                            !groupedTimelineData[2].events || groupedTimelineData[2].events.length === 0 ? 
                                            
                                            <Text style={{
                                                color : "gray", 
                                                fontFamily : "Inter", 
                                                fontSize : 12, 
                                                width : "100%", 
                                                textAlign : "center", 
                                                marginVertical : 24
                                            }}>
                                                Pas de séance ce jour-là
                                            </Text>

                                            :

                                            <Timeline
                                            style={{
                                                marginBottom : 24,
                                                marginTop : 15,  
                                            }}                                           
                                            data={groupedTimelineData[2].events}
                                            circleSize={12}
                                            lineColor={theme === "light" ? "#15B99B" : "#15B99B"}
                                            circleColor="#15B99B"
                                            timeContainerStyle={{ minWidth: 52 }}
                                            timeStyle={{
                                                textAlign: "center",
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "InterBold",
                                                fontSize: 13,
                                                marginTop: -3.6,
                                                marginLeft: 10,
                                            }}
                                            titleStyle={{
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "Inter",
                                                fontSize: 13,
                                                fontWeight: "bold",
                                            }}
                                            descriptionStyle={{
                                                color: "gray",
                                                fontSize: 13,
                                                fontWeight: "500",
                                            }}
                                            renderDetail={(rowData) =>
                                            rowData.title && (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor:
                                                        theme === "light" ? "rgb(247, 247, 247)" : "rgb(47, 47, 47)",
                                                        borderRadius: 5,
                                                        padding: 15,
                                                        position: "relative",
                                                        marginBottom: -9,
                                                        marginRight: 10,
                                                    }}
                                                    onPress={() => {
                                                        seteventClicked({ title: rowData.title });
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: theme === "light" ? "#141414" : "#E3E3E3",
                                                            fontFamily: "InterBold",
                                                            fontSize: 13,
                                                            marginBottom: 5,
                                                            height: "auto",
                                                            maxWidth: "90%",
                                                        }}
                                                    >
                                                        {rowData.title}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: "gray",
                                                            fontFamily: "Inter",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        {rowData.description}
                                                    </Text>
                                                    <Octicons
                                                        style={{
                                                            position: "absolute",
                                                            right: 10,
                                                            top: "57%",
                                                        }}
                                                        name="chevron-right"
                                                        color={theme === "light" ? "#141414" : "#E3E3E3"}
                                                        size={18}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        />
                                        }
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontFamily: "InterBold",
                                                color: "#15B99B",
                                                marginTop : 5, 
                                                marginLeft: 10,
                                            }}
                                        >
                                            {groupedTimelineData[3].day} Avril : 
                                        </Text>

                                        {
                                            !groupedTimelineData[3].events || groupedTimelineData[3].events.length === 0 ? 
                                            
                                            <Text style={{
                                                color : "gray", 
                                                fontFamily : "Inter", 
                                                fontSize : 12, 
                                                width : "100%", 
                                                textAlign : "center", 
                                                marginVertical : 24
                                            }}>
                                                Pas de séance ce jour-là
                                            </Text>

                                            :
                                            <Timeline
                                            style={{
                                                marginBottom : 24,
                                                marginTop : 15,  
                                            }}                                           
                                            data={groupedTimelineData[3].events}
                                            circleSize={12}
                                            lineColor={theme === "light" ? "#15B99B" : "#15B99B"}
                                            circleColor="#15B99B"
                                            timeContainerStyle={{ minWidth: 52 }}
                                            timeStyle={{
                                                textAlign: "center",
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "InterBold",
                                                fontSize: 13,
                                                marginTop: -3.6,
                                                marginLeft: 10,
                                            }}
                                            titleStyle={{
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "Inter",
                                                fontSize: 13,
                                                fontWeight: "bold",
                                            }}
                                            descriptionStyle={{
                                                color: "gray",
                                                fontSize: 13,
                                                fontWeight: "500",
                                            }}
                                            renderDetail={(rowData) =>
                                            rowData.title && (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor:
                                                        theme === "light" ? "rgb(247, 247, 247)" : "rgb(47, 47, 47)",
                                                        borderRadius: 5,
                                                        padding: 15,
                                                        position: "relative",
                                                        marginBottom: -9,
                                                        marginRight: 10,
                                                    }}
                                                    onPress={() => {
                                                        seteventClicked({ title: rowData.title });
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: theme === "light" ? "#141414" : "#E3E3E3",
                                                            fontFamily: "InterBold",
                                                            fontSize: 13,
                                                            marginBottom: 5,
                                                            height: "auto",
                                                            maxWidth: "90%",
                                                        }}
                                                    >
                                                        {rowData.title}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: "gray",
                                                            fontFamily: "Inter",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        {rowData.description}
                                                    </Text>
                                                    <Octicons
                                                        style={{
                                                            position: "absolute",
                                                            right: 10,
                                                            top: "57%",
                                                        }}
                                                        name="chevron-right"
                                                        color={theme === "light" ? "#141414" : "#E3E3E3"}
                                                        size={18}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        />
                                        }
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontFamily: "InterBold",
                                                color: "#15B99B",
                                                marginTop : 5, 
                                                marginLeft: 10,
                                            }}
                                        >
                                            {groupedTimelineData[4].day} Avril : 
                                        </Text>

                                        {
                                            !groupedTimelineData[4].events || groupedTimelineData[4].events.length === 0 ? 
                                            <Text style={{
                                                color : "gray", 
                                                fontFamily : "Inter", 
                                                fontSize : 12, 
                                                width : "100%", 
                                                textAlign : "center", 
                                                marginVertical : 24
                                            }}>
                                                Pas de séance ce jour-là
                                            </Text>
                                            :
                                            <Timeline
                                            style={{
                                                marginBottom : 24,
                                                marginTop : 15,  
                                            }}                                           
                                            data={groupedTimelineData[4].events}
                                            circleSize={12}
                                            lineColor={theme === "light" ? "#15B99B" : "#15B99B"}
                                            circleColor="#15B99B"
                                            timeContainerStyle={{ minWidth: 52 }}
                                            timeStyle={{
                                                textAlign: "center",
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "InterBold",
                                                fontSize: 13,
                                                marginTop: -3.6,
                                                marginLeft: 10,
                                            }}
                                            titleStyle={{
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "Inter",
                                                fontSize: 13,
                                                fontWeight: "bold",
                                            }}
                                            descriptionStyle={{
                                                color: "gray",
                                                fontSize: 13,
                                                fontWeight: "500",
                                            }}
                                            renderDetail={(rowData) =>
                                            rowData.title && (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor:
                                                        theme === "light" ? "rgb(247, 247, 247)" : "rgb(47, 47, 47)",
                                                        borderRadius: 5,
                                                        padding: 15,
                                                        position: "relative",
                                                        marginBottom: -9,
                                                        marginRight: 10,
                                                    }}
                                                    onPress={() => {
                                                        seteventClicked({ title: rowData.title });
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: theme === "light" ? "#141414" : "#E3E3E3",
                                                            fontFamily: "InterBold",
                                                            fontSize: 13,
                                                            marginBottom: 5,
                                                            height: "auto",
                                                            maxWidth: "90%",
                                                        }}
                                                    >
                                                        {rowData.title}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: "gray",
                                                            fontFamily: "Inter",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        {rowData.description}
                                                    </Text>
                                                    <Octicons
                                                        style={{
                                                            position: "absolute",
                                                            right: 10,
                                                            top: "57%",
                                                        }}
                                                        name="chevron-right"
                                                        color={theme === "light" ? "#141414" : "#E3E3E3"}
                                                        size={18}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        />
                                        }

                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontFamily: "InterBold",
                                                color: "#15B99B",
                                                marginTop : 5, 
                                                marginLeft: 10,
                                            }}
                                        >
                                            {groupedTimelineData[5].day} Avril : 
                                        </Text>

                                        {
                                            !groupedTimelineData[5].events || groupedTimelineData[5].events.length === 0 ? 

                                            <Text style={{
                                                color : "gray", 
                                                fontFamily : "Inter", 
                                                fontSize : 12, 
                                                width : "100%", 
                                                textAlign : "center", 
                                                marginVertical : 24
                                            }}>
                                                Pas de séance ce jour-là
                                            </Text>
                                            :
                                            <Timeline
                                            style={{
                                                marginBottom : 24,
                                                marginTop : 15,  
                                            }}                                           
                                            data={groupedTimelineData[5].events}
                                            circleSize={12}
                                            lineColor={theme === "light" ? "#15B99B" : "#15B99B"}
                                            circleColor="#15B99B"
                                            timeContainerStyle={{ minWidth: 52 }}
                                            timeStyle={{
                                                textAlign: "center",
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "InterBold",
                                                fontSize: 13,
                                                marginTop: -3.6,
                                                marginLeft: 10,
                                            }}
                                            titleStyle={{
                                                color: theme === "light" ? "#141414" : "#E3E3E3",
                                                fontFamily: "Inter",
                                                fontSize: 13,
                                                fontWeight: "bold",
                                            }}
                                            descriptionStyle={{
                                                color: "gray",
                                                fontSize: 13,
                                                fontWeight: "500",
                                            }}
                                            renderDetail={(rowData) =>
                                            rowData.title && (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor:
                                                        theme === "light" ? "rgb(247, 247, 247)" : "rgb(47, 47, 47)",
                                                        borderRadius: 5,
                                                        padding: 15,
                                                        position: "relative",
                                                        marginBottom: -9,
                                                        marginRight: 10,
                                                    }}
                                                    onPress={() => {
                                                        seteventClicked({ title: rowData.title });
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: theme === "light" ? "#141414" : "#E3E3E3",
                                                            fontFamily: "InterBold",
                                                            fontSize: 13,
                                                            marginBottom: 5,
                                                            height: "auto",
                                                            maxWidth: "90%",
                                                        }}
                                                    >
                                                        {rowData.title}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: "gray",
                                                            fontFamily: "Inter",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        {rowData.description}
                                                    </Text>
                                                    <Octicons
                                                        style={{
                                                            position: "absolute",
                                                            right: 10,
                                                            top: "57%",
                                                        }}
                                                        name="chevron-right"
                                                        color={theme === "light" ? "#141414" : "#E3E3E3"}
                                                        size={18}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        />
                                        }


                            </View>

                    </ScrollView>
                    </>


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
                                    scrollOffsetMinutes={0}
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
        height: 100,
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
        overflow : "hidden", 
        paddingVertical : 15, 
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
        fontSize: 13,
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
        fontSize: 13,
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
                  

 