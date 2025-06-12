import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    RefreshControl,
    Animated,
    BackHandler
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../i18n";  
import { useAuth } from '../../states/States';
import { useCopilot } from "react-native-copilot";
import {  Octicons } from '@expo/vector-icons';
import CardSuivieFils from '../../Components/CardSuivieFils';
import Sons from '../../fakeData/sons';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../states/ThemeContext';
import { useHistoryStack } from '../../states/HistoryContext';


const SuivieFils = () => {
    const { 
        isCopilotActive, 
    } = useCopilot();    
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [isLoading, setisLoading] = useState(true);
    const [isRefresh, setisRefresh] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;  
    const [data, setdata] = useState(Sons);
    const [isShowModalNewThing, setShowModalNewThing] = useState(false);
    const navigation = useNavigation();   
    const { role } = useAuth(); 
    const { getPreviousScreen, popFromHistory, clearHistory} = useHistoryStack();
    
    
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
        const fetchData = () => {
            startWavyAnimation();  
            setisLoading(true);
            setTimeout(() => {
                setisLoading(false);
            }, 2000);
        };
      
        fetchData();
    }, [isRefresh]);



    useEffect(() => {
        startWavyAnimation();
        return () => animation.stopAnimation(); 
    }, []);




    return (
        <View style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>

            <View style={[styles.headerX, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]} />

            {isLoading ? 
                <>
                {
                    theme === "light" ? 
                    <>
                    {      
                        [...Array(3)].map((_, index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.skeletonCard,
                                    {
                                        opacity: animation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [1, 0.4],
                                        }),
                                    },
                                ]}
                            >
                                <View style={styles.skeletonContentContainer}>

                                    <View style={styles.skeletonImageContainer} />

                                    <View style={styles.skeletonTextContainer}>
                                        <View style={[styles.skeletonLine, { width: '50%', height: 16, marginBottom: 8 }]} />
                                        
                                        <View style={[styles.skeletonLine, { width: '80%', height: 16, marginBottom: 12 }]} />
                                        <View style={[styles.skeletonLine, { width: '60%', height: 16, marginBottom: 12 }]} />

                                        <View style={[styles.skeletonRow, { justifyContent: 'flex-start', gap: 13 }]}>
                                            <View style={[styles.skeletonLine, { width: 40, height: 14 }]} />
                                            <View style={[styles.skeletonLine, { width: 40, height: 14 }]} />
                                        </View>
                                    </View>
                        
                                </View>
                            </Animated.View>
                        ))
                        }
                    </>
                    :
                    <>
                    {
                        [...Array(3)].map((_, index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.skeletonCardDark,
                                    {
                                        opacity: animation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.1, 0.3],
                                        }),
                                    },
                                ]}
                            >
                                <View style={styles.skeletonContentContainer}>
                                    <View style={styles.skeletonImageContainerDark} />
                                    <View style={styles.skeletonTextContainer}>
                                        <View style={[styles.skeletonLineDark, { width: '50%', height: 16, marginBottom: 8 }]} />
                                        
                                        <View style={[styles.skeletonLineDark, { width: '80%', height: 16, marginBottom: 12 }]} />
                                        <View style={[styles.skeletonLineDark, { width: '60%', height: 16, marginBottom: 12 }]} />
                                        
                                        <View style={[styles.skeletonRow, { justifyContent: 'flex-start', gap: 13 }]}>
                                            <View style={[styles.skeletonLineDark, { width: 40, height: 14 }]} />
                                            <View style={[styles.skeletonLineDark, { width: 40, height: 14 }]} />
                                        </View>
                                    </View>
                        
                                </View>
                            </Animated.View>
                        ))
                    }
                    </>
                }
                </>
                : data.length === 0 ? (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>{t("noResultsFound")}</Text>  
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <CardSuivieFils item={item} theme={theme} />}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl  
                                    refreshing={isLoading} 
                                    onRefresh={() => { setisRefresh(!isRefresh) }}
                                    colors={['#15B99B']}
                                    tintColor={theme === 'light' ? '#15B99B' : 'white'}
                                />
                            }
                        />
                        <TouchableOpacity style={styles.buttonAddChild} >
                            <Octicons name='plus' size={16} color="white" />
                            <Text style={[styles.textOfButtonAddChild, {color : "white"}]} >
                                &nbsp;&nbsp;Ajouter un nouvel enfant
                            </Text>
                        </TouchableOpacity>
                    </>
                )
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
        position : "relative",
        height : 50, 
        borderRadius : 70, 
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
        width : 30,
        marginLeft : 18, 
        alignItems : "flex-start", 
        justifyContent : "center"
    }, 
    inputText1 : {
        height : 50, 
        flex  : 1, 
        fontSize : 13.5, 
        paddingLeft : 2, 
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
    searchSubmitButtonDarkMode : {    
        width : 50, 
        height : 50, 
        backgroundColor : "#282828", 
        borderRadius : 70, 
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
        right : 3
    }, 
    headerText : {
        color : "#141414", 
        fontFamily : "JomoFont", 
        fontSize : 22, 
        textAlign : "center", 
    },
    insider: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#15B99B",
        borderRadius: 90,
        height: 55,
        width: 200,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    buttonchangeLnaguges: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#15B99B",
        borderRadius: 90,
        height: 55,
        marginTop: 20,
        width: 200,
        marginBottom: 40,
    },
    tutorialButton: {
        marginTop: 30,
        backgroundColor: "#f39c12",
        borderRadius: 90,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        width: 200,
    },
    textBtton: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    },
    
    skeletonContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skeletonTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    skeletonImageContainer: {
        width: 55,
        height: 55,
        backgroundColor: '#e0e0e0',
        borderRadius: 50,
    },
    skeletonImageContainerDark: {
        width: 55,
        height: 55,
        backgroundColor: 'rgb(194, 194, 194)',
        borderRadius: 50,
    },
    skeletonLine: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },

    skeletonLineDark: {
        backgroundColor: 'rgb(194, 194, 194)',
        borderRadius: 4,
    },


    skeletonCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: 'rgb(188, 188, 188)',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
    },
    skeletonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },






  skeletonCardDark: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: 'rgb(56, 56, 56)',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 5,
},
skeletonRowDark: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
headerX : {
    height : 19, 
    width : "100%", 
},
textOfButtonAddChild : {
    fontSize: 15, 
    fontFamily : "InterBold"
}, 
buttonAddChild : {
    width : "100%", 
    height: 48, 
    marginBottom: 20,
    marginTop : 10,  
    borderRadius : 8, 
    backgroundColor : "#15B99B", 
    flexDirection : "row", 
    alignItems : "center", 
    justifyContent : "center"
}

});

export default SuivieFils;
