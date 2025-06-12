import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    BackHandler,
    FlatList,
    RefreshControl, 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../states/ThemeContext";
import { useNavigation } from '@react-navigation/native';
import { Octicons } from '@expo/vector-icons';
import { useHistoryStack } from '../../states/HistoryContext';
import subjects from '../../fakeData/subjects';


const Matieres = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [isLoading, setisLoading] = useState(true);
    const [isRefresh, setisRefresh] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;  

    

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
            }, 1000);
        };
        fetchData();
    }, [isRefresh]);


    useEffect(() => {
        startWavyAnimation();
        return () => animation.stopAnimation(); 
    }, []);


    const navigation = useNavigation();
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



    const renderSubject = ({ item }) => (
        <TouchableOpacity onPress={()=>{console.warn(item);}} style={[styles.card, {backgroundColor : theme === "light" ? "white" : "#282828"}, {shadowColor : theme === "light" ? "rgb(188, 188, 188)" :"transparent"} ]}>
            <View style={styles.content}>
                <Text style={[styles.title, {color : theme === "light" ?  "#141414" : "rgb(238, 238, 238)"}]}>
                    {item.name}            
                </Text>
                <View style={
                    styles.tagsContainer}
                >
                    <View style={[
                        styles.SingletagContainer, 
                        { backgroundColor: "#D5FFCC" }
                        ]}
                    >
                        <Text 
                            style={[
                                styles.tag, 
                                { color: "#1CA518" }
                            ]}
                        >
                            Lorem ipsum
                        </Text>
                    </View>
                    <View style={[
                        styles.SingletagContainer, 
                        { backgroundColor: "#FDFFD3" }
                        ]}
                    >
                        <Text 
                            style={[
                                styles.tag, 
                                { color: "#91990b" }
                            ]}
                        >
                            Dolor sitamet
                        </Text>
                    </View>

                </View>

                <Text style={[styles.description, {color : theme === "light" ? "#6B7280" : "#a7a7a7"}]} numberOfLines={2}>
                    Niveau du cours : {item.year}{item.year === 1 ? "ère" : "ème"} année, {item.semester}{item.semester === 1 ? "er" : "ème"} semestre
                </Text>
                <Text style={[styles.description, {color : theme === "light" ? "#6B7280" : "#a7a7a7"}]} numberOfLines={2}>
                    Langue de la formation :  {item.language}
                </Text>
                <Text style={[styles.description, {color : theme === "light" ? "#6B7280" : "#a7a7a7"}]} numberOfLines={2}>
                    Inscriptions actuelles : {item.currentEnrollment} / {item.maxStudents}
                </Text>
            </View>
            <Octicons 
                name='chevron-right'
                size={21}
                color={theme === "light" ? "gray" : "gainsboro"}
                style={{
                    position : "relative", 
                    right : -3, 
                    top : "40%"
                }}
            />
        </TouchableOpacity>
    )

 
    return (
        <View style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]} >
            <View 
                style={{
                    backgroundColor : theme === "light" ? '#f2f2f7' : '#141414',
                    width : "100%", 
                    height : 8
                }}
            />
        {
            isLoading ? 
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

                                    <View style={styles.skeletonTextContainer}>
                                        <View style={[styles.skeletonLine, { width: '50%', height: 16, marginBottom: 8 }]} />
                                        
                                        <View style={[styles.skeletonLine, { width: '80%', height: 16, marginBottom: 12 }]} />
                                        

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

                                    <View style={styles.skeletonTextContainer}>
                                        <View style={[styles.skeletonLineDark, { width: '50%', height: 16, marginBottom: 8 }]} />
                                        
                                        <View style={[styles.skeletonLineDark, { width: '80%', height: 16, marginBottom: 12 }]} />
                                        

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
            :
            <>
            {
                subjects.length === 0 ? 
                (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>{t("noResultsFound2")}</Text>  
                    </View>
                )
                :
                (
                    <FlatList
                        data={subjects}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSubject}
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
                )
            }
            </>
        }            
        </View>
    );
};

export default Matieres;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal : 15
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

skeletonContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
},
skeletonTextContainer: {
    flex: 1,
    marginRight: 16,
},
skeletonImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 60,
    marginRight : 17,    },
skeletonImageContainerDark: {
    width: 60,
    height: 60,
    marginRight : 17,
    backgroundColor: 'rgb(194, 194, 194)',
    borderRadius: 60,
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

card: {
    flexDirection: "row",
    borderRadius: 15,
    paddingVertical : 12, 
    paddingHorizontal : 18, 
    marginLeft  : 3,
    marginRight : 3, 
    marginBottom: 15,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 5,
    overflow : "hidden", 
    position : "relative"
  },
  content: {
    flex: 1,
    marginRight: 10,
    position : 'relative', 
  },
  title: {
    fontFamily : "InterBold", 
    fontSize: 16,
    marginBottom : 5, 
    position : "relative"
  },

  description: {
    fontFamily : "Inter", 
    fontSize: 13,
    marginBottom : 2
},

tagsContainer: {
    marginBottom : 7, 
    flexDirection: "row",
    flexWrap : "wrap"
  },
  SingletagContainer : {    // hello ? 
    flexDirection: "row",
    marginRight : 5, 
    borderRadius : 7,
    marginTop: 5
  },
  tag: {
    fontFamily : "InterMedium", 
    fontSize: 11,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
});
