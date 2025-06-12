import React, { useState, useRef, useEffect  } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated, 
    ScrollView, 
    Modal, 
    BackHandler, 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../i18n";  
import { useAuth } from '../../states/States';
import { useCopilot } from "react-native-copilot";
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../states/ThemeContext';
import SkeletonCard from '../../Components/SkeletonCard';
import { useHistoryStack } from '../../states/HistoryContext';




const rattArray = [
    {
        codeMatiere : "FH8924H9DEQSN",
        prix : 750, 
        matiere : "Analyse 4", 
        note : "6", 
        duree : "1h 45min", 
        dateExamen : "06/04/2025", 
        datelimiteInscription : "03/04/2025"
    },
    {
        codeMatiere : "NSODFPJZIQFDK",
        prix : 550, 
        matiere : "Thermodynamique", 
        note : "4", 
        duree : "3h 15min", 
        dateExamen : "09/04/2025", 
        datelimiteInscription : "07/04/2025"
    },
    {
        codeMatiere : "IOHSFWDHOWDFO",
        prix : 900, 
        matiere : "UML - conception", 
        note : "8", 
        duree : "2h 30min", 
        dateExamen : "12/04/2025", 
        datelimiteInscription : "10/04/2025"
    },
    {
        codeMatiere : "NDWF9BZ0ERQKK",
        prix : 460, 
        matiere : "Graphes - conception", 
        note : "8", 
        duree : "2h 30min", 
        dateExamen : "12/04/2025", 
        datelimiteInscription : "10/04/2025"
    }
]




const Rattrapage = () => {

    const { 
        isCopilotActive, 
    } = useCopilot();    
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [isLoading, setisLoading] = useState(true);
    const [isRefresh, setisRefresh] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;  
    const navigation = useNavigation();    
    const [selectedExams, setSelectedExams] = useState([]);
    const [montantTotal, setMontantTotal] = useState(0);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = useState(0);
    const animationRef = useRef(null);
    const [isModalVisible, setisModalVisible] = useState(false);
    



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




    useEffect(() => {
        if (animationRef.current) {
            clearInterval(animationRef.current);
        }

        const startValue = displayValue;
        const endValue = montantTotal;
        const duration = 400;  
        const startTime = Date.now();

        const updateCounter = () => {
            const now = Date.now();
            const progress = Math.min(1, (now - startTime) / duration);
            
            const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
            setDisplayValue(currentValue);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(updateCounter);
            } else {
                setDisplayValue(endValue);
            }
        };

        animationRef.current = requestAnimationFrame(updateCounter);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [montantTotal]);


    const toggleSelection = (codeMatiere) => {
        setSelectedExams((prevSelected) => {
            const isSelected = prevSelected.includes(codeMatiere);
            const selectedExam = rattArray.find(exam => exam.codeMatiere === codeMatiere);
    
            if (!selectedExam) return prevSelected;  
    
            if (isSelected) {
                setMontantTotal(prevTotal => {
                    const newTotal = prevTotal - parseInt(selectedExam.prix);
                    return newTotal >= 0 ? newTotal : 0;
                });
                return prevSelected.filter(code => code !== codeMatiere);
            } else {
                setMontantTotal(prevTotal => prevTotal + parseInt(selectedExam.prix));
                return [...prevSelected, codeMatiere];
            }
        });
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



    const handleOutsidePress = () => {
        setisModalVisible(false);   
      };


  
    return (
        <View style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>
            {isLoading ? (
                <>
                    <SkeletonCard theme={theme} />
                    <SkeletonCard theme={theme} />
                    <SkeletonCard theme={theme} />
                </>
            ) : (
                <>


                    <Modal
                        transparent={true}
                        visible={isModalVisible}
                        animationType="fade"
                        onRequestClose={() => setIsModalVisible(false)}
                    >
                        <TouchableWithoutFeedback onPress={handleOutsidePress}>
                            <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={[styles.modalContainer, {borderColor: theme === 'light' ? 'gainsboro' : 'rgb(72, 72, 72)'}, {backgroundColor: theme === 'light' ? 'white' : '#141414'}]}>
                                <Text style={[styles.modalTitle, {color: theme === 'light' ? '#141414' : '#E3E3E3'}]}>
                                    Votre choix d'examen de rattrapage a bien été pris en compte !
                                </Text>
                                <Text style={[styles.modalText, {color: theme === 'light' ? '#141414' : '#E3E3E3'}]}>
                                    <Text style={{fontFamily: 'InterBold'}}>Matière 1 :</Text> Lorem ipsum 2
                                </Text>
                                <Text style={[styles.modalText, {color: theme === 'light' ? '#141414' : '#E3E3E3'}]}>
                                    <Text style={{fontFamily: 'InterBold'}}>Matière 2 :</Text> Lorem ipsum 7
                                </Text>
                                <Text style={[styles.modalText, {color: theme === 'light' ? '#141414' : '#E3E3E3'}]}>
                                    <Text style={{fontFamily: 'InterBold'}}>Matière 3 :</Text> Lorem ipsum 4
                                </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>


                    <View
                        style={
                            [styles.container8898, {

                            }]
                        }
                    >
                        <Text style={[styles.container8898Text, {color : theme === "light" ? "#141414" : "white"}]} >
                            Montant total : 
                        </Text>
                        <Text style={[styles.container8898Text, {color: theme === "light" ? "#141414" : "white"}]}>
                            {displayValue} MAD
                        </Text>
                    </View>


                    <ScrollView showsVerticalScrollIndicator={false}>
                        {rattArray.map((ratt) => {
                            const isSelected = selectedExams.includes(ratt.codeMatiere);
                            return (
                                <TouchableOpacity 
                                    key={ratt.codeMatiere} 
                                    style={[
                                        styles.cardRattrapge,
                                        { backgroundColor: theme === "light" ? 'white' : '#282828' },
                                        { borderColor: isSelected ? "#15B99B" : (theme === "light" ? "rgb(225, 225, 225)" : "rgb(66, 66, 66)") },
                                        { borderWidth: isSelected ? 2.4 : 1 },
                                        { shadowColor: theme === "light" ? "rgb(189, 189, 189)" : "transparent" }
                                    ]}
                                    onPress={() => toggleSelection(ratt.codeMatiere)}
                                >
                                    <View
                                        style={[
                                            styles.roundElement, 
                                            {backgroundColor : isSelected ? "#15b99b" : theme === "light" ? "rgb(211, 211, 211)" : "gray"}
                                        ]}
                                    />
                                    <View style={styles.rowCardRatt}>
                                        <Text style={[styles.textRowCR, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>Matière :</Text>
                                        <Text style={[styles.textRowCR2, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>{ratt.matiere}</Text>
                                    </View>
                                    <View style={styles.rowCardRatt}>
                                        <Text style={[styles.textRowCR, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>Prix :</Text>
                                        <Text style={[styles.textRowCR2, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>{ratt.prix} MAD</Text>
                                    </View>
                                    <View style={styles.rowCardRatt}>
                                        <Text style={[styles.textRowCR, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>Note précédente :</Text>
                                        <Text style={[styles.textRowCR3Note, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>{ratt.note} / 20</Text>
                                    </View>
                                    <View style={styles.rowCardRatt}>
                                        <Text style={[styles.textRowCR, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>Durée de l'examen :</Text>
                                        <Text style={[styles.textRowCR2, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>{ratt.duree}</Text>
                                    </View>
                                    <View style={styles.rowCardRatt}>
                                        <Text style={[styles.textRowCR, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>Date limite d'inscription :</Text>
                                        <Text style={[styles.textRowCR2, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>{ratt.datelimiteInscription}</Text>
                                    </View>
                                    <View style={styles.rowCardRatt}>
                                        <Text style={[styles.textRowCR, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>Date de l'examen :</Text>
                                        <Text style={[styles.textRowCR2, { color: theme === "light" ? "#141414" : "#E3E3E3" }]}>{ratt.dateExamen}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>




                    <TouchableOpacity 
                        style={[styles.buttonOfSubmiting, { opacity: selectedExams.length === 0 ? 0.3 : 1 }]}
                        disabled={selectedExams.length === 0}
                        onPress={()=>{if(selectedExams.length !== 0 ){setisModalVisible(true);}}}
                    >
                        <Text style={styles.textRowCR777}>S'inscrire aux rattrapages</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop : 20, 
    },
    cardRattrapge : {
        width : "100%",
         minHeight : 125, 
        height : "auto",
        padding:  14, 
        paddingLeft : 22, 

        borderRadius : 12.333, 
        borderWidth : 1, 
        marginBottom : 16 , 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        overflow : "hidden"
    },
    rowCardRatt : {
        flexDirection : "row", 
        alignItems : "center", 
        justifyContent : "space-between", 
        width : "100%", 
    },
    textRowCR : {
        textAlign : "left", 
        fontFamily : "InterBold",
    },
    textRowCR2 : {
        textAlign : "right",
        fontFamily : "Inter",
    },
    textRowCR3Note : {
        textAlign : "right",
        fontFamily : "InterBold",
    }, 
    textRowCR777 : {
        textAlign : "center",
        fontFamily : "InterBold",
        color : "white", 
        fontSize : 15
    }, 
    buttonOfSubmiting : {
        width : "100%", 
        height : 50, 
        alignItems : "center", 
        justifyContent : "center",
        borderRadius : 12.333, 
        backgroundColor  : "#15B99B", 
        marginBottom : 15, 
        marginTop : 5
    },
    roundElement : {
        height : "100%", 
        width : 2, 
        borderRadius : 20,
        position : "absolute", 
        left : 9, 
        top : "14%"
    },  
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)"
    },
    modalContainer: {
        width: '90%',
        paddingVertical : 20, 
        paddingHorizontal : 13, 
        borderRadius: 10,
        borderWidth : 1
    },
    modalTitle: {
        fontFamily: "InterBold",
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center"
    },
    modalText: {
        fontFamily: "Inter",
        fontSize: 15,
        marginBottom: 5
    },
    modalButton: {
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        width : "48%"
    },
    modalButtonText2: {
        fontFamily: "InterMedium",
        fontSize: 15,
    },
    modalButtonText: {
        color: "white",
        fontFamily: "InterBold",
        fontSize: 15,
    },
    container8898 : {
        width : "100%", 
        alignItems : "center", 
        justifyContent : "space-between", 
        marginBottom : 20,
        flexDirection : "row"
    }, 
    container8898Text : {
        fontFamily : "InterBold", 
        fontSize : 17,
    }
})


export default Rattrapage;