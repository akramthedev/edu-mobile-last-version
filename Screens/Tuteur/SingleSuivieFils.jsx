import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    BackHandler,
} from 'react-native';
import tinycolor from "tinycolor2";
import { AntDesign, Feather, Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ModalComments from '../../Components/ModalComments';
import { useTheme } from '../../states/ThemeContext';
import { useHistoryStack } from '../../states/HistoryContext';
import AbsencesFils from './AbsencesFils';
import ParcoursFils from './ParcoursFils';
import IncidentsFils from './IncidentsFils';

const SingleSuivieFils = ({ route, sidebarRef }) => {
    const { theme } = useTheme();
    const { item } = route.params;
    const navigation = useNavigation();
    const { getPreviousScreen, popFromHistory, pushToHistory } = useHistoryStack();
    const [isParcoursActivated, setisParcoursActivated] = useState(true);
    const [isAbsenceActivated, setisAbsenceActivated] = useState(false);
    const [isIncidentActivated, setisIncidentActivated] = useState(false);
    

    
    const absenceData = [
        {value: 5, label: 'Se'},
        {value: 3, label: 'Oc'},
        {value: 1, label: 'No'},
        {value: 1, label: 'De'},
        {value: 6, label: 'Ja'},
        {value: 7, label: 'Fe'},
        {value: 3, label: 'Ma'},
        {value: 2, label: 'Av'},
        {value: 4, label: 'Ma'},
        {value: 10,label: 'Ju'},
        {value: 3, label: 'Ao'},
    ];


    const handleBackPress = () => {
            const previous = getPreviousScreen();
            if (previous) {
            popFromHistory();
            navigation.navigate(previous.screenName, previous.params || {});
            return true;  
        } else {
            navigation.navigate("SuivieFils");  
            return true;  
        }
    };
    
    
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => backHandler.remove();
    }, []);
 



    absenceData  
  
    return (
        <View  key={item.id}  style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() =>{
                        pushToHistory("SuivieFils");
                        navigation.navigate("SuivieFils");
                    }}
                    style={[
                        styles.buttonimageUserIcon3, 
                        { borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 },
                        { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
                        { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
                        { backgroundColor : theme === "light" ?  "white" : "#282828"},
                    ]} 
                >
                    <Feather name='chevron-left' size={26} color={theme === "light" ? "rgb(104, 104, 104)" : "#e3e3e3" } />
                </TouchableOpacity>
                <View style={styles.xxxKKK} >
                    <Text style={[styles.textTitleXX, {color : theme === "light" ? "rgb(39, 39, 39)" : "rgb(255, 255, 255)"}]} >
                        {item.nom}
                    </Text> 
                </View>
                <TouchableOpacity 
                    onPress={() => sidebarRef.current.toggleSidebar()}
                    style={[
                        {
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
                            right : 3, 
                        }, 
                        { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
                        { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
                        { backgroundColor : theme === "light" ?  "white" : "#282828"}, 
                    ]} 
                >
                    <Octicons name="three-bars" size={20}   color={theme === "light" ? "rgb(104, 104, 104)" : "#e3e3e3" }    />
                </TouchableOpacity>
            </View>
            <View style={[styles.containerOftextSingleX, ]}  >
                {
                    theme === "light" ? 
                    <View style={[styles.containerofTwoButtonsSwitch, {borderBottomColor :"rgb(218, 218, 218)"}]} >
                        <TouchableOpacity onPress={()=>{setisIncidentActivated(false);setisAbsenceActivated(false);setisParcoursActivated(true)}}  style={[styles.buttonSwitch,{backgroundColor : isParcoursActivated ? "#15B99B"  : theme === "light" ? "white" : "rgb(228, 228, 228)"}]}>
                            <Text style={[styles.buttonSwitchText,{color : isParcoursActivated ? "white" : "#141414"}]}>
                                Parcours
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{setisIncidentActivated(false);setisParcoursActivated(false);setisAbsenceActivated(true)}} style={[styles.buttonSwitch, {backgroundColor : isAbsenceActivated ? "#15B99B" : theme === "light" ? "white" : "rgb(228, 228, 228)"}]}>
                            <Text style={[styles.buttonSwitchText,{color : isAbsenceActivated ? "white" : "#141414"}]}>
                                Absences
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{setisParcoursActivated(false);setisAbsenceActivated(false);setisIncidentActivated(true);}} style={[styles.buttonSwitch, {backgroundColor : isIncidentActivated ? "#15B99B" : theme === "light" ? "white" : "rgb(228, 228, 228)"}]}>
                            <Text style={[styles.buttonSwitchText,{color : isIncidentActivated ? "white" : "#141414"}]}>
                                Incidents
                            </Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={[styles.containerofTwoButtonsSwitch, {borderBottomColor :"rgb(108, 108, 108)"}]} >
                        <TouchableOpacity onPress={()=>{setisIncidentActivated(false);setisAbsenceActivated(false);setisParcoursActivated(true)}}  style={[styles.buttonSwitch,{backgroundColor : isParcoursActivated ? "#15B99B" :"rgb(41, 41, 41)"}]}>
                            <Text style={[styles.buttonSwitchText,{color : isParcoursActivated ? "white" : "#E3E3E3"}]}>
                                Parcours
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{setisIncidentActivated(false);setisParcoursActivated(false);setisAbsenceActivated(true)}} style={[styles.buttonSwitch, {backgroundColor : isAbsenceActivated ? "#15B99B" :"rgb(41, 41, 41)" }]}>
                            <Text style={[styles.buttonSwitchText,{color : isAbsenceActivated ? "white" : "#E3E3E3"}]}>
                                Absences
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{setisParcoursActivated(false);setisAbsenceActivated(false);setisIncidentActivated(true);}} style={[styles.buttonSwitch, {backgroundColor : isIncidentActivated ? "#15B99B" :"rgb(41, 41, 41)" }]}>
                            <Text style={[styles.buttonSwitchText,{color : isIncidentActivated ? "white" : "#E3E3E3"}]}>
                                Incidents
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    isParcoursActivated ? 
                    <ParcoursFils item={item} theme={theme} />
                    :
                    isAbsenceActivated ? 
                    <AbsencesFils item={item} theme={theme} />
                    :
                    <IncidentsFils item={item} theme={theme} />
                } 
            </View>
        </View>
    );
};

export default SingleSuivieFils;

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
        marginBottom : 10, 
        top: 25,
        alignItems : "center",
        position : "relative",
        width : "100%"
    },

    headerText : {
        color : "#141414", 
        fontFamily : "JomoFont", 
        fontSize : 22, 
        textAlign : "center", 
    },
    buttonimageUserIcon : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        right: 3, 
        borderRadius : 50, 
        backgroundColor :"#15B99B", 
        alignItems : "center", 
        justifyContent : "center"
    }, 

    buttonimageUserIcon0 : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        right: 3, 
        borderRadius : 50, 
        backgroundColor :"white", 
        alignItems : "center", 
        borderWidth : 1, 
        borderColor :"rgb(226, 226, 226)",
        justifyContent : "center"
    }, 
    buttonimageUserIcon001 : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        right: 3, 
        borderRadius : 50, 
        backgroundColor :"#282828", 
        alignItems : "center", 
        borderWidth : 1, 
        borderColor :"#282828",
        justifyContent : "center"
    }, 

    buttonimageUserIcon2 : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        right: 63, 
        borderRadius : 50, 
        backgroundColor :"white", 
        alignItems : "center", 
        borderWidth : 1, 
        borderColor :"rgb(226, 226, 226)",
        justifyContent : "center"
    }, 

    buttonimageUserIcon3 : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        left: 3, 
        borderRadius : 50, 
        backgroundColor :"white", 
        alignItems : "center", 
        borderWidth : 1, 
        borderColor :"rgb(226, 226, 226)",
        justifyContent : "center"
    }, 
    containerOftextSingleX : {
        paddingLeft : 3, 
        paddingRight : 3, 
        marginTop : 14,
        flex : 1, 
    },  
    textTitleXX : {
        fontFamily : "InterBold", 
        fontSize : 19,
    }, 
    containerofTwoButtonsSwitch : {
        flexDirection : "row", 
        alignItems :"center", 
        justifyContent : "space-between", 
        margin : "auto",
        paddingBottom : 15, 
        marginBottom : 15, 
        width : "100%", 
        borderBottomWidth : 1
    }, 
    buttonSwitch : {
        borderRadius : 10, 
        width : "32%",
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
     
});