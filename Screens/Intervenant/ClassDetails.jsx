import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView, 
    Image,
    Animated, 
    Dimensions,
    BackHandler
} from 'react-native';
import CardStudent from '../../Components/CardStudent';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../i18n";  
import { useAuth } from '../../states/States';
import { useCopilot } from "react-native-copilot";
import {  Feather, Octicons } from '@expo/vector-icons';
import SkeletonCard from '../../Components/SkeletonCard';
import { useLanguage } from '../../states/LanguageContext';
import { useTheme } from '../../states/ThemeContext';
import {  useNavigation } from '@react-navigation/native';
import ModalSaisieNoteNavigation from '../../Components/ModalSaisieNoteNavigation';
import { useHistoryStack } from '../../states/HistoryContext';
import {LineChart} from "react-native-chart-kit";



const absenceData = {
    labels: ["Se","Oc","No","De" ,"Ja", "Fe", "Ma", "Av", "Ma", "Ju"],
    datasets: [
      {
        data: [5, 3, 0, 1, 6, 7, 3, 2, 4, 10],
        color: () => `#15B99B`, 
        strokeWidth: 2
      }
    ],
};

const screenWidth = Dimensions.get("window").width;

const chartConfig = (theme) => ({
    backgroundColor: theme === "light" ? "#ffffff" : "#282828",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => theme === "light" ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
    labelFontSize: 10,
    style: {
      borderRadius: 11
    },
    propsForDots: {
      r: "2",
      strokeWidth: "1",
      stroke: "#15b99b"
    },
    formatYLabel: (value) => parseInt(value).toString()
});





const ClassDetails = ({route, sidebarRef}) => {

    const { data } = route.params;
    const { 
        isCopilotActive, 
    } = useCopilot();    
    const { t } = useTranslation();
    const {theme} = useTheme();
    const {language} = useLanguage();
    const [isLoading, setisLoading] = useState(true);
    const [showModalX, setshowModalX] = useState(false);
    const [DataClassDetails, setDataClassDetails] = useState([]);
    const animation = useRef(new Animated.Value(0)).current;  
    const navigation = useNavigation();
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

    useEffect(() => {
        startWavyAnimation();  
        
        const fetchData = () => {
            setisLoading(true);
            if(data === null || data.length === 0){
                setDataClassDetails([]);
            }
            else{
                setDataClassDetails(data);
            }
            setTimeout(() => {
                setisLoading(false);
            }, 1000);
        };
    
        fetchData();
    }, [data]);

    useEffect(() => {
        startWavyAnimation();
        return () => animation.stopAnimation(); 
    }, []);


    return(
        <View style={{
            backgroundColor: theme === "light" ? '#f2f2f7' : '#141414',
            flexDirection : "column", 
            flex : 1,
            position : "relative"
        }} >

            <ModalSaisieNoteNavigation 
                showModalX={showModalX}
                setshowModalX={setshowModalX}
                theme={theme}
                data={DataClassDetails}
            />
                
            <View
                style={{
                    height : 18, 
                    width : "100%", 
                    backgroundColor: theme === "light" ? '#f2f2f7' : '#141414',
                }}
            />

            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() =>{
                        pushToHistory("Classes");
                        navigation.navigate("Classes");
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
                    <Text style={[styles.textTitleXX, {color : theme === "light" ? "rgb(39, 39, 39)" : "rgb(203, 203, 203)"}]} >
                        {t("detailsClasses")}
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

            <ScrollView showsVerticalScrollIndicator={false}  style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>
            {
                isLoading ?    
                <>
                    <SkeletonCard theme={theme}  />
                    <SkeletonCard theme={theme}  />
                    <SkeletonCard theme={theme}  />
                </>
                :
                <>
                    {DataClassDetails.length === 0 ? 
                    (
                        <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultsText}>{t("noResultsFound2")}</Text>  
                        </View>
                    )
                    :
                    (
                        <>
                            <View style={styles.ViewSpaceBetween} >
                                <Text style={[styles.textSpacedTitles, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    Année universitaire : 
                                </Text>
                                <Text style={[styles.textSpacedTitles2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    {DataClassDetails[0].AnneUniversitaire ? DataClassDetails[0].AnneUniversitaire : "--"}
                                </Text>
                            </View>
                            <View style={styles.ViewSpaceBetween} >
                                <Text style={[styles.textSpacedTitles, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    Filière : 
                                </Text>
                                <Text style={[styles.textSpacedTitles2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    {DataClassDetails[0].AnneUniversitaire ? DataClassDetails[0].Filiere : "--"}
                                </Text>
                            </View>
                            <View style={styles.ViewSpaceBetween} >
                                <Text style={[styles.textSpacedTitles, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    Classe : 
                                </Text>
                                <Text style={[styles.textSpacedTitles2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    {DataClassDetails[0].AnneUniversitaire ? DataClassDetails[0].Classe : "--"}
                                </Text>
                            </View>
                            <View  
                                style={{
                                    width : "100%", 
                                    height : 1, 
                                    borderRadius : 1,
                                    marginVertical : 18,  
                                    backgroundColor : theme === "light" ? "gainsboro" : "rgb(65, 65, 65)"
                                }}
                            />
                             <View style={{ marginTop: 0 }}>
                                <Text style={{
                                fontFamily: "InterBold",
                                fontSize: 14.4,
                                marginBottom: 10,
                                color: theme === "light" ? "#141414" : "#e3e3e3"
                                }}>
                                    Aperçu des Absences :&nbsp;&nbsp;2024-2025                            
                                </Text>
                                <LineChart
                                    data={absenceData}
                                    width={screenWidth - 30}
                                    height={185}
                                    chartConfig={{
                                        ...chartConfig(theme),
                                        backgroundGradientFrom: theme === "light" ? "#ffffff" : "#282828",
                                        backgroundGradientTo: theme === "light" ? "#ffffff" : "#282828",
                                        fillShadow: true,  
                                        fillColor: "#15B99B", 
                                        propsForDots: {
                                            r: "2",
                                            strokeWidth: "1",
                                            stroke: "#15B99B"
                                        }, 
                                      }}
                                    
                                    bezier
                                    style={{
                                        borderRadius: 12,
                                    }}
                                />
                            </View>
                            <View  
                                style={{
                                    width : "100%", 
                                    height : 1, 
                                    borderRadius : 1,
                                    marginVertical : 18,  
                                    backgroundColor : theme === "light" ? "gainsboro" : "rgb(65, 65, 65)"
                                }}
                            />
                            <View style={styles.ViewSpaceBetween3} >
                                <Text style={[styles.textSpacedTitles, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    Liste des étudiants :&nbsp;&nbsp;<Text style={{color : "gray",fontFamily : "InterBold", fontSize : 14}}>{DataClassDetails.length}</Text>
                                </Text>
                                <Text style={[styles.textSpacedTitles2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    &nbsp;
                                </Text>
                            </View> 
                            {
                                DataClassDetails.length !== 0 && 
                                <>
                                    {
                                        DataClassDetails.map((student, index)=>(
                                            <CardStudent 
                                                key={student.Matricule} 
                                                item={student} 
                                                theme={theme} 
                                            />
                                        ))
                                    }
                                    <View  
                                        style={{
                                            width : "100%", 
                                            height : 70, 
                                            backgroundColor : "transparent"
                                        }}
                                    />
                                </>
                            }
                        </>
                    )}
                </>     
            }
            </ScrollView>
            <TouchableOpacity 
                onPress={()=>{
                    setshowModalX(true);
                }} 
                style={{
                    width : "100%", 
                    height : 55,
                    width : 55,
                    borderRadius : 30, 
                    backgroundColor : "#15B99B",
                    position : "absolute",
                    zIndex : 10, 
                    right : 15,
                    bottom : 15, 
                    alignItems : "center", 
                    justifyContent : "center"
                }}
            >
                <Octicons
                    name='pencil'
                    size={25}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    )
}


export default ClassDetails;




const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
     
 
    containerOfImage : {
        height : 100,
        marginBottom : 15,  
        width : "100%", 
        alignItems : "center", 
        justifyContent : "center"
    },
    imageProfile : {
        height : 100, 
        width : 100, 
        objectFit : "cover", 
        borderRadius : 100, 
        borderWidth : 1, 
        
    },
    containerNameAndEmail : {
        height : "auto",
        paddingTop : 0,
        paddingBottom : 20, 
        flexDirection : "column",
        width : "100%", 
        alignItems : "center", 
        justifyContent : "center", 
    }, 
    NameText : {
        fontFamily : "InterBold", 
        fontSize : 17,   
        marginBottom : 4
    },
    EmailText : {
        fontFamily : "Inter", 
        fontSize : 12, 
        marginBottom : 4  
    },
    ContainerCase : {
        width : "100%", 
        flexDirection : "row", 
        borderRadius : 12,
        alignItems : "center", 
        justifyContent:  "space-between",
        paddingVertical : 16, 
        paddingHorizontal : 13, 
        position : "relative", 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        marginBottom : 10
    }, 
    ContainerCase2 : {
        width : "100%", 
        flexDirection : "row", 
        borderRadius : 12, 
        alignItems : "center", 
        paddingVertical : 16, 
        paddingHorizontal : 13, 
        position : "relative", 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        marginBottom : 10
    }, 
    absoluteIcons:  {
        position : "absolute", 
        right : 13
    },
    caseIcons : {
        height : 22, 
        width : 22, 
        alignItems : "baseline", 
        justifyContent : "center", 
        marginRight : 10
    },
    TitleCase : {
        fontSize : 13, 
        fontFamily : "Inter", 
        flex : 0.80, 
    }, 
    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 71,
        marginBottom : 25, 
        position : "relative",
        marginLeft : 15, 
        marginRight : 15
    },

    headerText : {
        color : "#141414", 
        fontFamily : "JomoFont", 
        fontSize : 22, 
        textAlign : "center", 
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
    xxxKKK : {
        flexDirection : "column", 
        alignItems : "center", 
        justifyContent : "center"
    }, 
    textTitleXX : {
        fontFamily : "InterBold", 
        fontSize : 18, 
        textAlign : "center", 
        height : 39,
    },
    textTitleXX222 : {
        fontFamily : "Inter", 
        fontSize : 13.5, 
        textAlign : "center"
    },
    ViewSpaceBetween : {
        flexDirection : "row", 
        justifyContent : "space-between", 
        width : "100%", 
        alignItems : "center", 
        marginBottom : 5
    }, 
    ViewSpaceBetween2 : {
        flexDirection : "row", 
        justifyContent : "space-between", 
        width : "100%", 
        alignItems : "center", 
    }, 
    ViewSpaceBetween3 : {
        flexDirection : "row", 
        justifyContent : "space-between", 
        width : "100%", 
        alignItems : "center", 
        marginBottom : 10
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 13,
        color: 'gray',
        fontFamily : "Inter"
    },
    textSpacedTitles :  {
        fontSize: 14,
        fontFamily : "InterBold"
    },
    textSpacedTitles2 :  {
        fontSize: 14,
        fontFamily : "Inter"
    },
});



