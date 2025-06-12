import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView, 
    Image,
    Animated, 
    BackHandler, 
    TextInput, 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../i18n";  
import { useAuth } from '../../states/States';
import { useCopilot } from "react-native-copilot";
import {  Feather } from '@expo/vector-icons';
import SkeletonCard from '../../Components/SkeletonCard';
import { useLanguage } from '../../states/LanguageContext';
import { useTheme } from '../../states/ThemeContext';
import {  useNavigation } from '@react-navigation/native';
import { useHistoryStack } from '../../states/HistoryContext';
import ProgressBar from '../../Components/ProgressBar';



const SaisieNote = ({route, sidebarRef}) => {

    const { data, type } = route.params;
    const { 
        isCopilotActive, 
    } = useCopilot();    
    const { t } = useTranslation();
    const {theme} = useTheme();
    const {language} = useLanguage();
    const [isLoading, setisLoading] = useState(true);
    const [showModalX, setshowModalX] = useState(false);
    const [DataFromRoute, setDataFromRoute] = useState([]);
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
                setDataFromRoute([]);
            }
            else{
                setDataFromRoute(data);
                console.warn("Type of Exam : "+type);
                console.warn("Data : "+JSON.stringify(data));
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
                        handleBackPress()
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
                        {t("saiseNoteTitlePgae")}
                    </Text> 
                </View>
                <TouchableOpacity 
                    style={[
                        {
                          width : "auto", 
                          paddingVertical : 5, 
                          paddingHorizontal : 8,
                          backgroundColor : theme === "light" ? "rgb(255, 255, 255)" : "hsl(168, 82.10%, 15.30%)", 
                          borderRadius : 6, 
                          alignItems : "center", 
                          justifyContent : "center", 
                          position : 'absolute', 
                          right : 3, 
                          bottom : 8
                        }, 
                    ]} 
                >
                    <Text style={{
                        color : theme === "light" ? "#15B99B" : "rgb(36, 213, 180)"
                    }} >
                        Enregistrer
                    </Text>
                </TouchableOpacity>
            </View>

            <View   style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>
            {
                isLoading ?    
                <>
                    <SkeletonCard theme={theme}  />
                    <SkeletonCard theme={theme}  />
                    <SkeletonCard theme={theme}  />
                </>
                :
                <>
                    {DataFromRoute.length === 0 ? 
                    (
                        <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultsText}>{t("noResultsFound2")}</Text>  
                        </View>
                    )
                    :
                    (
                        <>

                            <ProgressBar score={23} maxScore={30} theme={theme} title={"Notes saisies"} />

                            <View  
                                style={{
                                    width : "100%", 
                                    height : 1, 
                                    borderRadius : 1,
                                    marginTop : 20,  
                                    marginBottom : 16,  
                                    backgroundColor : theme === "light" ? "gainsboro" : "rgb(65, 65, 65)"
                                }}
                            />

                            <View style={styles.ViewSpaceBetween} >
                                <Text style={[styles.textSpacedTitles, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    Type d'examen : 
                                </Text>
                                <Text style={[styles.textSpacedTitles2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    {type === "examen-normal" ? "Session Normale" : type === "examen-ratt" ? "Session Rattrapage" : type === "examen-tp" ? "Travaux Pratiques" : type === "examen-projet-perso" ? "Projets Personnels" : "Participation et Comportement"}
                                </Text>
                            </View>
                            <View style={styles.ViewSpaceBetween} >
                                <Text style={[styles.textSpacedTitles, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    Année universitaire : 
                                </Text>
                                <Text style={[styles.textSpacedTitles2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    {data[0].AnneUniversitaire ? data[0].AnneUniversitaire : "--"}
                                </Text>
                            </View>
                            <View style={styles.ViewSpaceBetween} >
                                <Text style={[styles.textSpacedTitles, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    Filière : 
                                </Text>
                                <Text style={[styles.textSpacedTitles2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    {data[0].AnneUniversitaire ? data[0].Filiere : "--"}
                                </Text>
                            </View>
                            <View style={styles.ViewSpaceBetween} >
                                <Text style={[styles.textSpacedTitles, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    Classe : 
                                </Text>
                                <Text style={[styles.textSpacedTitles2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                    {data[0].AnneUniversitaire ? data[0].Classe : "--"}
                                </Text>
                            </View>
                            
                            <View  
                                style={{
                                    width : "100%", 
                                    height : 1, 
                                    borderRadius : 1,
                                    marginTop : 14,  
                                    marginBottom : 20,  
                                    backgroundColor : theme === "light" ? "gainsboro" : "rgb(65, 65, 65)"
                                }}
                            />

                            <ScrollView showsVerticalScrollIndicator={false}  style={[styles.container,{padding : 15 ,borderRadius : 7},{marginBottom : 10} ,{ backgroundColor: theme === "light" ? 'white' : '#282828' }]}>
                                {data.map((student, index) => (
                                    <View key={student.id} style={[styles.item,{borderBottomColor : theme === "light" ? "gainsboro" : "#454545"}]}>
                                            <Image source={{ uri: student.Image }} style={[styles.image, {backgroundColor : theme === "light" ? "rgb(239, 239, 239)" : "rgb(74, 74, 74)"}]} />
                                            <Text style={[styles.studentText, {color : theme === "light" ? "#141414" : "white"}]}>
                                                {student.Prenom} {student.Nom}                                             </Text>
                                            <TextInput
                                                placeholder="Note..."
                                                placeholderTextColor={theme === "light" ? "gray" : "gray"}
                                                keyboardType="numeric"
                                                style={[styles.input, {borderColor : theme === "light" ? "gainsboro" : "rgb(81, 81, 81)"} ,{color : theme === "light" ? "#141414" : "white" }]}
                                            />
                                            <Text style={[styles.outOf, {color : theme === "light" ? "#141414" : "white"}]}>/ 20.00</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </>
                    )}
                </>     
            }
            </View>
        </View>
    )
}


export default SaisieNote;




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
    item: {
        marginBottom: 20,
        borderBottomWidth: 1,
        paddingBottom : 20, 
        fontFamily : "Inter",
        flexDirection : "row", 
        alignItems : "center"
      },
      studentText: {
        fontSize: 16,
        fontFamily : "Inter",
        paddingLeft : 10,
        flex : 1, 
        paddingRight : 7,  
      },
      inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      input: {
        height: 40,
        borderRadius: 6,
        paddingHorizontal: 12,
        fontSize: 16,
        width : 80, 
        fontFamily : "Inter",
        borderWidth : 1, 
    },
      outOf: {
        marginLeft: 8,
        fontSize: 15,
        fontFamily : "Inter",
      },
      image : {
        objectFit : "cover", 
        height : 39, width: 39, 
        borderRadius : 30
      },
    
    
});