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
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../i18n";  
import { useAuth } from '../../states/States';
import { useCopilot } from "react-native-copilot";
import {  Feather,  Octicons } from '@expo/vector-icons';
import SkeletonProfileStudent from '../../Components/SkeletonProfileStudent';
import { useLanguage } from '../../states/LanguageContext';
import { useTheme } from '../../states/ThemeContext';
import {  useNavigation } from '@react-navigation/native';
import {
    LineChart,
} from "react-native-chart-kit";
import { useHistoryStack } from '../../states/HistoryContext';



const screenWidth = Dimensions.get("window").width;



const gradeData = {
    labels: ["Se","Oc","No","De" ,"Ja", "Fe", "Ma", "Av", "Ma", "Ju"],
    datasets: [
      {
        data: [15, 13, 9, 14, 13, 17, 18, 15, 14, 13],
        color: () => `#15b99b`, 
        strokeWidth: 2
      }
    ],
};


const absenceData = {
    labels: ["Se","Oc","No","De" ,"Ja", "Fe", "Ma", "Av", "Ma", "Ju"],
    datasets: [
      {
        data: [5, 3, 0, 1, 6, 7, 3, 2, 4, 10],
        color: () => `#e17400`, 
        strokeWidth: 2
      }
    ],
};
  


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




const ProfileStudent = ({route, sidebarRef}) => {
    const { 
        isCopilotActive, 
    } = useCopilot();    
    const { t } = useTranslation();
    const {theme} = useTheme();
    const { data, dataX } = route.params;
    const {language} = useLanguage();
    const [isLoading, setisLoading] = useState(true);
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
    
    


    useEffect(() => {
        const fetchData = () => {
            setisLoading(true);
            setTimeout(() => {
                setisLoading(false);  
            }, 1000);
        };
        fetchData();
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
                startWavyAnimation();  
                setisLoading(true);
                setTimeout(() => {
                    setisLoading(false);
                }, 1000);
            };
          
            fetchData();
    }, []);


    
        useEffect(() => {
            startWavyAnimation();
            return () => animation.stopAnimation(); 
          }, []);
    
 

    return (
        <View style={{
            backgroundColor: theme === "light" ? '#f2f2f7' : '#141414',
            flexDirection : "column", 
            flex : 1,
        }} >

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
                                            handleBackPress();
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
                                          {t("profile8")}
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
                    <SkeletonProfileStudent theme={theme}  />
                </>

                :     
                <>                

                        <View style={styles.containerOfImage} >
                            <Image  
                                source={{
                                    uri : data.Image
                                }}
                                style={[styles.imageProfile,
                                    { backgroundColor : theme === "light" ? "rgb(232, 232, 232)" : "rgb(37, 37, 37)" }, 
                                    { borderColor : theme === "light" ? "rgb(201, 201, 201)" : "rgb(61, 61, 61)" }, 
                                ]} 
                            />
                        </View>
                        <View style={styles.containerNameAndEmail} >
                            <Text style={[
                                styles.NameText, 
                                {color : theme === "light" ? "#141414" : "#e3e3e3"}
                            ]}>
                                {data.Nom}&nbsp;{data.Prenom}
                            </Text>
                            
                        </View>



                            <View
                                style={{
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 10, 
                                    justifyContent : "space-between"
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily : "InterBold",
                                        fontSize : 15, 
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                   Informations personnelles : 
                                </Text>  
                                <Text
                                    style={{
                                        fontFamily : "Inter", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    &nbsp;
                                </Text>
                        </View>

                            

                        <View
                                style={{
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 10, 
                                    justifyContent : "space-between"
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily : "InterBold",
                                        fontSize : 13.3,  
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    Matricule : 
                                </Text>
                                <Text
                                    style={{
                                        fontFamily : "Inter", 
                                        fontSize : 13.3, 
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    {data.Matricule} 
                                </Text>
                            </View>

                            
                            
                            <View
                                style={{
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 10, 
                                    justifyContent : "space-between"
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily : "InterBold", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    Email : 
                                </Text>
                                <Text
                                    style={{
                                        fontFamily : "Inter", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    {data.Email} 
                                </Text>
                            </View>

 
                            <View  style={{
                                width : "100%", 
                                height : 1, 
                                borderRadius : 1,
                                marginVertical : 15,  
                                backgroundColor : theme === "light" ? "gainsboro" : "rgb(65, 65, 65)"
                            }} /> 
         

                              <View
                                style={{
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 10, 
                                    justifyContent : "space-between"
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily : "InterBold", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    Année : 
                                </Text>
                                <Text
                                    style={{
                                        fontFamily : "Inter", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    {data.Annee} 
                                </Text>
                            </View>




                            <View
                                style={{
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 10, 
                                    justifyContent : "space-between"
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily : "InterBold", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    Filière : 
                                </Text>
                                <Text
                                    style={{
                                        fontFamily : "Inter", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    {data.Filiere} 
                                </Text>
                            </View>



                            <View
                                style={{
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 10, 
                                    justifyContent : "space-between"
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily : "InterBold", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    Nombre d'absences : 
                                </Text>
                                <Text
                                    style={{
                                        fontFamily : "Inter", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    {data.NombreAbsence} 
                                </Text>
                            </View>






                          
                            <View  style={{
                                width : "100%", 
                                height : 1, 
                                borderRadius : 1,
                                marginVertical : 15,  
                                backgroundColor : theme === "light" ? "gainsboro" : "rgb(65, 65, 65)"
                            }} /> 
        



                    {/* 

                            
                            <View style={{ marginTop: 0 }}>
                                <Text style={{
                                fontFamily: "InterBold",
                                fontSize: 14.4,
                                marginBottom: 10,
                                color: theme === "light" ? "#141414" : "#e3e3e3"
                                }}>
                                    Aperçu des Notes :&nbsp;&nbsp;2024-2025
                                </Text>
                                <LineChart
                                    data={gradeData}
                                    width={screenWidth - 30}
                                    height={185}
                                    chartConfig={{
                                        ...chartConfig(theme),
                                        backgroundGradientFrom: theme === "light" ? "#ffffff" : "#282828",
                                        backgroundGradientTo: theme === "light" ? "#ffffff" : "#282828",
                                        fillShadow: true,  
                                        fillColor: "#15b99b",  
                                      }}
                                    
                                    bezier
                                    style={{
                                        borderRadius: 12,
                                        paddingBottom: 10,  
                                    }}
                                />
                            </View> */}

                            <View style={{ marginTop: 0 }}>
                                <Text style={{
                                fontFamily: "InterBold",
                                fontSize: 15,
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
                                        fillColor: "#e17400", 
                                        propsForDots: {
                                            r: "2",
                                            strokeWidth: "1",
                                            stroke: "#e17400"
                                        }, 
                                      }}
                                    
                                    bezier
                                    style={{
                                        borderRadius: 12,
                                        paddingBottom: 2,  
                                    }}
                                />
                            </View>


                            
                            <View  style={{
                                width : "100%", 
                                height : 1, 
                                borderRadius : 1,
                                marginVertical : 15,  
                                backgroundColor : theme === "light" ? "gainsboro" : "rgb(65, 65, 65)"
                            }} /> 


                            <View
                                style={{
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    justifyContent : "space-between", 
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily : "InterBold",
                                        fontSize : 15, 
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    Commentaires : 15
                                </Text>  
                                <TouchableOpacity
                                    style={{
                                        paddingVertical : 10, 
                                        paddingHorizontal : 15, 
                                        borderRadius : 10, 
                                        backgroundColor : theme === "light" ? "white" : "#282828"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily : "InterMedium", 
                                            fontSize : 13.5,
                                            alignItems : "center",
                                            justifyContent : "center",
                                            color : theme === "light" ? "#141414" : "#E3E3E3"
                                        }}
                                    >
                                       <Octicons
                                            size={13}
                                            name='plus'
                                            color={theme === "light" ? "#141414" : "#E3E3E3"}
                                       />
                                       &nbsp;&nbsp;Ajouter 
                                    </Text>
                                </TouchableOpacity>
                            </View>

       





                            <View  style={{
                                width : "100%", 
                                height : 1, 
                                borderRadius : 1,
                                marginVertical : 15,  
                                backgroundColor : theme === "light" ? "gainsboro" : "rgb(65, 65, 65)"
                            }} /> 







                            <View
                                style={{
                                    backgroundColor : "red", 
                                    width : "100%", 
                                    height : "auto", 
                                    padding : 7, 
                                    paddingRight : 15, 
                                    marginBottom : 15, 
                                    borderRadius : 9, 
                                    backgroundColor : theme === "light" ? "white" : "rgb(31, 31, 31)",
                                    flexDirection : "column"
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily : "InterBold", 
                                        fontSize : 14,
                                        marginBottom : 7, 
                                        paddingLeft : 10,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    Prof. Dakir Rachid : 
                                </Text>
                                <Text
                                    style={{
                                        fontFamily : "Inter", 
                                        fontSize : 13,
                                        paddingLeft : 20,
                                        marginBottom : 7, 
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    Etudiant non sérieux, très agité ne gére ni son stress ni sa bouche.
                                </Text>
                                <Text
                                    style={{
                                        fontFamily : "Inter", 
                                        fontSize : 11.5,
                                        paddingLeft : 20,
                                        
                                        color : "gray"
                                    }}
                                >
                                    14 Nov 2025
                                </Text>
                            </View>



 

                </>
            }
        </ScrollView>
        </View>

    );
};

export default ProfileStudent;

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
        marginBottom : 15, 
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
});

