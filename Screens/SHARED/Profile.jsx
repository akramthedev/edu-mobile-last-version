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
import {   Ionicons, Octicons } from '@expo/vector-icons';
import LanguageToggleButton from '../../Components/LanguageToggleButton';
import ModeToggleButton from '../../Components/ModeToggleButton'
import SkeletonProfile from '../../Components/SkeletonProfile';
import { useLanguage } from '../../states/LanguageContext';
import { useTheme } from '../../states/ThemeContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ModalChoixFiliere from '../../Components/ModalChoixFiliere';
import { LineChart } from 'react-native-chart-kit';
import { useHistoryStack } from '../../states/HistoryContext';


const screenWidth = Dimensions.get("window").width;


const absenceData = {
    labels: ["Se","Oc","No","De" ,"Ja", "Fe", "Ma", "Av", "Ma", "Ju"],
    datasets: [
      {
        data: [5, 3, 0, 1, 6, 7, 3, 2, 4, 10],
        color: () => `#15b99b`, 
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






const Profile = () => {
    const { 
        isCopilotActive, 
    } = useCopilot();    
    const { t } = useTranslation();
    const { setIsAuthenticated } = useAuth();
    const {theme} = useTheme();
    const {language} = useLanguage();
    const [isLoading, setisLoading] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;  
    const [isInscriptionOuverte, setisInscriptionOuverte] = useState(false);
    
    
    
    const { getPreviousScreen, popFromHistory, clearHistory } = useHistoryStack();
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

    

    useFocusEffect(
         useCallback(() => {
            setisInscriptionOuverte(false);
             clearHistory();
         }, [])
     );




    useEffect(() => {
        const fetchData = () => {
            setisLoading(true);
            setTimeout(() => {
                setisLoading(false);  
            }, 1000);
        };

        fetchData();
    }, []);



    const logout = async () => {
        try {
          setIsAuthenticated(false);
          await AsyncStorage.removeItem('token');
        } catch(error) {
          console.log("Error : "+error);
        } 
    }
    



 
      
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
        <>
        <View
            style={{
                height : 11, 
                width : "100%", 
                backgroundColor : theme === "light" ? "#f2f2f7" : "#141414"
            }}
        />
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}  style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>
           
            <ModalChoixFiliere 
                modalVisible={isInscriptionOuverte}
                setModalVisible={setisInscriptionOuverte}
                theme={theme}
            />

            {
                isLoading ? 
                <SkeletonProfile theme={theme}  />
                :     
                <View>                                        
                        <View style={styles.containerOfImage} >
                            <Image  
                                source={require('../../assets/akram.png')}
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
                                Akram El Basri
                            </Text>
                        </View>

                        <View >



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
                                    BSD924ZEND 
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
                                    seasonedwebdev@gmail.com
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
                                    Date de naissance : 
                                </Text>
                                <Text
                                    style={{
                                        fontFamily : "Inter", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    01/01/1966 
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
                                    Téléphone : 
                                </Text>  
                                <Text
                                    style={{
                                        fontFamily : "Inter", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    0616506586
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
                                    Adresse : 
                                </Text>
                                <Text
                                    style={{
                                        fontFamily : "Inter", 
                                        fontSize : 13.3,
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }}
                                >
                                    50 Charaf, Agadir
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
                                    3ème année
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
                                    Génie informatique
                                </Text>
                            </View>



                            <View
                                style={{
                                    flexDirection : "row", 
                                    alignItems : "center", 
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
                                    14
                                </Text>
                            </View>



                          
                            <View  style={{
                                width : "100%", 
                                height : 1, 
                                borderRadius : 1,
                                marginVertical : 15,  
                                backgroundColor : theme === "light" ? "gainsboro" : "rgb(65, 65, 65)"
                            }} /> 
        





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
                                        fillColor: "#15b99b", 
                                        propsForDots: {
                                            r: "2",
                                            strokeWidth: "1",
                                            stroke: "#15b99b"
                                        }, 
                                      }}
                                    
                                    bezier
                                    style={{
                                        borderRadius: 12,
                                        paddingBottom: 10,  
                                    }}
                                />
                            </View>


                                <View style={[
                                    styles.ContainerCase, 
                                    {backgroundColor : theme === "light" ? "white" : "#282828"},
                                    {shadowColor : theme === "light" ? "rgb(232, 232, 232)" : "#282828"},
                                ]} >
                                    <View style={{flexDirection : "row"}} >
                                        <View style={styles.caseIcons} >
                                            <Octicons  name='sun' size={20}  color={theme === "light" ? "#141414" : "#e3e3e3"}  />
                                        </View>
                                        <Text style={[
                                            styles.TitleCase, 
                                            {color : theme === "light" ? "#141414" : "#e3e3e3"}
                                        ]}>
                                            {t("modeCl6")}
                                        </Text>
                                    </View>
                                    <ModeToggleButton />
                                </View>
                                <View style={[
                                    styles.ContainerCase, 
                                    {backgroundColor : theme === "light" ? "white" : "#282828"},
                                    {shadowColor : theme === "light" ? "rgb(232, 232, 232)" : "#282828"},
                                ]} >
                                    <View style={{flexDirection : "row"}} >
                                        <View style={styles.caseIcons} >
                                            <Octicons  name='tools' size={20}  color={theme === "light" ? "#141414" : "#e3e3e3"}  />
                                        </View>
                                        <Text style={[
                                            styles.TitleCase, 
                                            {color : theme === "light" ? "#141414" : "#e3e3e3"}
                                        ]}>
                                            {t("langueEnFr6")}
                                        </Text>
                                    </View>
                                    <LanguageToggleButton />
                                </View>





                                <TouchableOpacity style={[
                                    styles.ContainerCase2, 
                                    {backgroundColor : theme === "light" ? "white" : "#282828"},
                                    {shadowColor : theme === "light" ? "rgb(232, 232, 232)" : "#282828"},
                                ]} >
                                    <View style={styles.caseIcons} >
                                        <Octicons  name='bug' size={20}  color={theme === "light" ? "#141414" : "#e3e3e3"}  />
                                    </View>
                                    <Text style={[
                                        styles.TitleCase, 
                                        {color : theme === "light" ? "#141414" : "#e3e3e3"}
                                    ]}>
                                        {t("signalBug6")} 
                                    </Text>
                                    <Ionicons  style={styles.absoluteIcons}  name='chevron-forward' size={20} color={theme === "light" ? "#141414" : "#e3e3e3"} />

                                </TouchableOpacity>



                                

                                <TouchableOpacity style={[
                                    styles.ContainerCase2, 
                                    {backgroundColor : theme === "light" ? "white" : "#282828"},
                                    {shadowColor : theme === "light" ? "rgb(232, 232, 232)" : "#282828"},
                                ]}  onPress={logout} >
                                    <View style={styles.caseIcons} >
                                        <Octicons  name='key' size={20}  color={theme === "light" ? "#141414" : "#e3e3e3"}  />
                                    </View>
                                    <Text style={[
                                        styles.TitleCase, 
                                        {color : theme === "light" ? "#141414" : "#e3e3e3"}
                                    ]}>
                                        {t("logoutBitch")} 
                                    </Text>
                                    <Ionicons  style={styles.absoluteIcons}  name='chevron-forward' size={20} color={theme === "light" ? "#141414" : "#e3e3e3"} />

                                </TouchableOpacity>
                     
                      
                        </View>                                              
                </View>
            }
        </ScrollView>
        </>
    );
};

export default Profile;

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

    header2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems : "flex-end",
        height : 85, 
        paddingBottom : 17, 
        marginLeft  : 3,
        marginRight : 3, 
    },


    searchInput : {
        flex : 1, 
        height : 50, 
        backgroundColor : "white", 
        borderRadius : 70, 
        marginRight : 15,
        borderColor : "#EFEFEF", 
        borderWidth : 1, 
        shadowColor:"rgb(188, 188, 188)", 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        position : "relative",
        alignItems : "center", 
        flexDirection : "row", 
        overflow : "hidden"
    },  
    searchX7 : {
        height : 50, 
        width : 50,
        alignItems : "center", 
        justifyContent : "center"
    }, 
    inputText1 : {
        height : 50, 
        width : 300, 
        fontSize : 12, 
        paddingRight : 50, 
        color:"#141414", 
        fontFamily : "Inter"
    }, 
    searchSubmitButton : {    
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
        justifyContent : "center"
    },
    
    imageUserIcon : {
        height : 50, 
        width : 50, 
        objectFit : "cover", 
        borderRadius : 50, 

    }, 
    buttonimageUserIcon : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        right: 3, 
        borderWidth : 1, 
        borderRadius : 50, 
        borderColor :"rgb(230, 230, 230)"
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
    headerText : {
        fontFamily : "JomoFont", 
        fontSize : 22, 
        textAlign : "center", 
    },
    containerOfImage : {
        height : 130, 
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
        paddingBottom : 30, 
        flexDirection : "column",
        width : "100%", 
        alignItems : "center", 
        justifyContent : "center", 
    }, 
    NameText : {
        fontFamily : "InterBold", 
        fontSize : 20,   
        marginBottom : 1
    },
    EmailText : {
        fontFamily : "Inter", 
        fontSize : 12,   
    },
    ContainerCase : {
        width : "99%", 
        flexDirection : "row", 
        borderRadius : 13.5,
        alignItems : "center", 
        margin : "auto",
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
        width : "99%", 
        flexDirection : "row", 
        borderRadius : 13.5, 
        margin : "auto",
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
        fontSize : 14, 
        fontFamily : "Inter", 
        flex : 0.80, 
    }
});

