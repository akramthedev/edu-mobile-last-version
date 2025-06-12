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
import {  Feather,Octicons } from '@expo/vector-icons';
import fakeStudents from '../../fakeData/fakeStudents';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../states/ThemeContext';
import { useHistoryStack } from '../../states/HistoryContext';




const Classes = () => {
    const { 
        isCopilotActive, 
    } = useCopilot();        
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [isLoading, setisLoading] = useState(true);
    const [isRefresh, setisRefresh] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;  
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(fakeStudents);
    const navigation = useNavigation();   
    const { role } = useAuth(); 
    const [expandedYear, setExpandedYear] = useState(null);
    const [expandedFiliere, setExpandedFiliere] = useState(null);
    const [expandedClasse, setExpandedClasse] = useState(null);
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
            setExpandedClasse(null);
            setExpandedFiliere(null);
            setExpandedYear(null);
            setTimeout(() => {
                setisLoading(false);
            }, 1000);
        };
      
        fetchData();
    }, [isRefresh]);


    useEffect(() => {
        const filtered = fakeStudents.filter(item =>
            item.Matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.Nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.Prenom.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.Email.toLowerCase().includes(searchQuery.toLowerCase()) 
        );
        setFilteredData(filtered);
    }, [searchQuery]);

    
    
    const groupedData = filteredData.reduce((acc, student) => {
        const year = student.Annee;
        const filiere = student.Filiere;
        const classe = student.Classe;
        
        if (!acc[year]) acc[year] = {};
        if (!acc[year][filiere]) acc[year][filiere] = {};
        if (!acc[year][filiere][classe]) acc[year][filiere][classe] = [];
        
        acc[year][filiere][classe].push(student);
        return acc;
    }, {});


    const yearsArray = Object.entries(groupedData).map(([year, filieres]) => ({
        year,
        filieres: Object.entries(filieres).map(([filiere, classes]) => ({
            filiere,
            classes: Object.entries(classes).map(([classe, students]) => ({
                classe,
                students,
            })),
        })),
    }));

    const toggleYear = (year) => {
        setExpandedYear(prev => prev === year ? null : year);
        setExpandedFiliere(null);
        setExpandedClasse(null);
    };
    
    const toggleFiliere = (year, filiere) => {
        const filiereKey = `${year}-${filiere}`;
        setExpandedFiliere(prev => prev === filiereKey ? null : filiereKey);
        setExpandedClasse(null);
    };

    const toggleClasse = (year, filiere, classe) => {
        const classeKey = `${year}-${filiere}-${classe}`;
        setExpandedClasse(prev => prev === classeKey ? null : classeKey);
        pushToHistory("ClassDetails", { data : groupedData[year][filiere][classe] });
        navigation.navigate("ClassDetails", { data : groupedData[year][filiere][classe] });
    };
  
    

    const renderYear = ({ item }) => (
        <View style={styles.sectionContainer}>
            <TouchableOpacity
                style={[styles.filiereHeader, {backgroundColor: theme === "light" ? "rgb(255, 255, 255)" : "rgb(41, 41, 41)" }, {borderWidth: expandedYear === item.year ? 2 : 1}, {borderColor: expandedYear === item.year ? "#15B99B" : theme === "light" ? "rgb(230, 230, 230)" : "transparent" }]}
                onPress={() => toggleYear(item.year)}>
                <Text style={[styles.filiereTitle, { color: theme === 'light' ? '#141414' : '#fff' }]}>
                    Année: {item.year}&nbsp;<Text style={[styles.filiereTitle, { color: theme === 'light' ? 'gray' : 'gray' }]} >({item.filieres.length} filières)</Text>
                </Text>
                <Feather 
                    name={expandedYear === item.year ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color={theme === 'light' ? '#141414' : '#fff'} 
                />
            </TouchableOpacity>

            {expandedYear === item.year && item.filieres.map((filiereObj) => {
                const filiereKey = `${item.year}-${filiereObj.filiere}`;
                return (
                    <View key={filiereKey} style={styles.filiereContainer}>
                        <TouchableOpacity
                            style={[styles.classeHeader, {backgroundColor: theme === "light" ? "rgb(235, 235, 235)" : "rgb(66, 66, 66)" }, {borderWidth: expandedFiliere === filiereKey ? 2 : 1}, {borderColor: expandedFiliere === filiereKey ? "#159BB9" : theme === "light" ? "rgb(224, 224, 224)" : "transparent" }]}
                            onPress={() => toggleFiliere(item.year, filiereObj.filiere)}>
                            <Text style={[styles.classeTitle, { color: theme === 'light' ? '#141414' : '#fff' }]}>
                                Filière: {filiereObj.filiere}&nbsp;
                                <Text style={[styles.filiereTitle, { color: theme === 'light' ? 'gray' : 'rgb(210, 210, 210)' }]} >({filiereObj.classes.length} classes)</Text>
                            </Text>
                            <Feather 
                                name={expandedFiliere === filiereKey ? 'chevron-up' : 'chevron-down'} 
                                size={18} 
                                color={theme === 'light' ? '#141414' : '#fff'} 
                            />
                        </TouchableOpacity>

                        {expandedFiliere === filiereKey && filiereObj.classes.map((classeObj) => {
                            const classeKey = `${item.year}-${filiereObj.filiere}-${classeObj.classe}`;
                            return (
                                <View key={classeKey} style={styles.classeContainer}>
                                    <TouchableOpacity
                                        style={[styles.subClasseHeader, {backgroundColor: theme === "light" ? "rgb(222, 222, 222)" : "rgb(90, 90, 90)" }, {borderWidth: expandedClasse === classeKey ? 2 : 1}, {borderColor: expandedClasse === classeKey ? "rgb(239, 104, 14)" : theme === "light" ? "rgb(210, 210, 210)" : "transparent" }]}
                                        onPress={() => toggleClasse(item.year, filiereObj.filiere, classeObj.classe)}>
                                        <Text style={[styles.subClasseTitle, { color: theme === 'light' ? '#141414' : '#fff' }]}>
                                            {classeObj.classe}&nbsp;
                                            <Text style={[styles.filiereTitle, { color: theme === 'light' ? 'gray' : 'rgb(255, 255, 255)' }]} >({classeObj.students.length} étudiants)</Text>
                                        </Text>
                                        <Feather 
                                            name="chevron-right"
                                            size={16} 
                                            color={theme === 'light' ? '#141414' : '#fff'} 
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );





    useEffect(() => {
        startWavyAnimation();
        return () => animation.stopAnimation(); 
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>

            
            <View style={styles.header2} >
                <View 
                    style={[styles.searchInput, 
                        {backgroundColor : theme === "light" ? "white" : "#282828"}, 
                        {shadowColor: theme === "light" ? "rgb(188, 188, 188)" : "#282828" },
                        {borderWidth : theme === "light" ? 1 : 0}, 
                        {borderColor : theme === "light" ? "#EFEFEF" : "#282828"}
                    ]}
                >

                    <TouchableOpacity
                        style={styles.searchX7}
                    >
                        <Octicons 
                            name="person" 
                            size={19} 
                            color="rgb(170, 170, 170)"  
                         />
                     </TouchableOpacity>
                    <TextInput
                        style={[styles.inputText1, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}
                        placeholder="Rechercher par matricule ou nom..."
                        placeholderTextColor="rgb(138, 138, 138)"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                    />
                    {
                        searchQuery.length >= 1 && 
                        <TouchableOpacity
                            onPress={()=>{
                                setSearchQuery("");
                            }}
                            style={{
                                height : 33,
                                width : 50,
                                borderRadius : 0, 
                                marginLeft : 0, 
                                alignItems : "center", 
                                justifyContent : "center", 
                            }}
                        >
                            <Octicons 
                                name="x" 
                                size={19} 
                                color="rgb(170, 170, 170)"  
                            />
                        </TouchableOpacity>
                    }
                </View>
                {/* <TouchableOpacity
                    style={{
                        height : 50, 
                        width : 50, 
                        borderRadius : 25, 
                        marginLeft : 10, 
                        alignItems : "center", 
                        justifyContent : "center", 
                        shadowOffset: { width: 0, height: 7 },
                        shadowOpacity: 0.07,
                        shadowRadius: 20,
                        elevation: 5,
                        backgroundColor : theme === "light" ? "white" : "#282828",
                        shadowColor: theme === "light" ? "rgb(188, 188, 188)" : "#282828" ,
                        borderWidth : theme === "light" ? 1 : 0, 
                        borderColor : theme === "light" ? "#EFEFEF" : "#282828"
                    }}
                >
                    <Octicons 
                        name="search" 
                        size={19} 
                        color="rgb(170, 170, 170)"  
                    />
                </TouchableOpacity> */}
            </View>

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
                : filteredData.length === 0 ? (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>{t("noResultsFound")}</Text>  
                    </View>
                ) : (
                    <FlatList
                        data={yearsArray}
                        keyExtractor={(item) => item.year}
                        renderItem={renderYear}
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
    
    inputText1 : {
        height : 50, 
        flex : 1, 
        fontSize : 13.5, 
        paddingLeft : 0, 
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





filiereHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft:11,
    paddingRight : 9, 
    borderRadius: 6,
    marginVertical: 8,
},
classeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft: 11,
    paddingRight : 9,
    borderRadius: 6,
},
filiereTitle: {
    fontSize: 14,
    fontFamily : "InterMedium", 
    maxWidth : '95%'
},
classeTitle: {
    fontSize: 14,
    maxWidth : '95%',
    fontFamily : "InterMedium"
},
classeContainer: {
    marginVertical: 6,
    paddingRight : 70, 
    paddingLeft : 0, 
},
filiereContainer : {
    marginVertical: 6,
    paddingRight : 55, 
    paddingLeft : 0, 

},
studentsContainer: {
    marginTop : 12, 
    marginRight : 33
},

searchX7 : {
    height : 50, 
    width : 30,
    marginLeft : 18, 
    alignItems : "flex-start", 
    justifyContent : "center"
}, 

subClasseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 6,
    marginVertical: 4,
},
subClasseTitle: {
    fontSize: 14,
    maxWidth : '95%',
    fontFamily : "InterMedium"
},

});

export default Classes;