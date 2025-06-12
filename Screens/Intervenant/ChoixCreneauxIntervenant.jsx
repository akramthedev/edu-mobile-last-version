import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView, 
    Modal,      
    BackHandler
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../states/ThemeContext";
import SuccessPopUp from '../../Components/SuccessPopUp';
import { Octicons } from '@expo/vector-icons';
import { useHistoryStack } from '../../states/HistoryContext';
import { useNavigation } from '@react-navigation/native';

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const defaultTimeSlots = ["08:30 - 10:30", "10:30 - 12:30", "14:30 - 16:30", "16:30 - 18:30", "18:30 - 20:30", "20:30 - 22:00"];
const timeSlotsByDay = {
    "Lundi": defaultTimeSlots,
    "Mardi": defaultTimeSlots,
    "Mercredi": defaultTimeSlots,
    "Jeudi": defaultTimeSlots,
    "Vendredi": defaultTimeSlots,
    "Samedi": defaultTimeSlots
};

const ChoixCreneauxIntervenant = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [selectedDay, setSelectedDay] = useState("Lundi");
    const [selectedSlots, setSelectedSlots] = useState({});
    const [isModalVisible, setModalVisible] = useState(false);
    const [error, seterror] = useState("");
    const [showError, setshowError] = useState(false);
    const [titleError, setTitleError] = useState("");
    const [ChangeUiOfPage, setChangeUiOfPage] = useState(false);
    const [hasChanged, sethasChanged] = useState(false);
    const [LastUpdate, setLastUpdate] = useState(null);


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




    const toggleSlotSelection = (slot) => {
        sethasChanged(true);
        setSelectedSlots(prev => {
            const currentSlots = prev[selectedDay] || [];
            return {
                ...prev,
                [selectedDay]: currentSlots.includes(slot)
                    ? currentSlots.filter(s => s !== slot)
                    : [...currentSlots, slot]
            };
        });
    };


    
    const handleModalConfirm = () => {
        const newDate = new Date();
        const formattedDate = `${newDate.getHours().toString().padStart(2, '0')}:${newDate.getMinutes().toString().padStart(2, '0')} - ${newDate.getDate().toString().padStart(2, '0')}/${(newDate.getMonth() + 1).toString().padStart(2, '0')}/${newDate.getFullYear()}`;
        setLastUpdate(formattedDate);
        setModalVisible(false);
        setTitleError("Enregistrement réussi");
        seterror('Votre demande de créneau a été prise en compte avec succès.');
        setChangeUiOfPage(true);
        setshowError(true);
        sethasChanged(false);
    };




    return (
        <View style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>            
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, {backgroundColor: theme === "light" ? "white" : "#141414"}]}>
                        <Text style={[styles.modalTitle, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                            Confirmer votre choix
                        </Text>
                        <Text style={[styles.modalText, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                            Êtes-vous sûr et certain de votre choix ? Prenez un moment pour revérifier avant d’enregistrer.
                        </Text>
                        <Text style={[styles.modalText, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                            &nbsp;
                        </Text>
                        <View style={{flexDirection : "row", justifyContent : "space-between"}} >
                            <TouchableOpacity style={[styles.modalButton, {backgroundColor: theme === "light" ? "rgb(227, 227, 227)" : "rgb(64, 64, 64)"}]} onPress={()=>{setModalVisible(false)}}>
                                <Text style={[styles.modalButtonText2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, {backgroundColor: "#ff5900"}]} onPress={handleModalConfirm}>
                                <Text style={styles.modalButtonText}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <SuccessPopUp
                modalVisible={showError}
                setModalVisible={setshowError}
                errorTitle={titleError}
                errorMessage={error}
                navigation={navigation}
            />

            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer} contentContainerStyle={{
                alignItems: 'center', 
                paddingVertical: 5,  
            }} >
                {days.map(day => {
                    const hasSelectedSlots = selectedSlots[day] && selectedSlots[day].length > 0;
                    return (
                        <TouchableOpacity 
                            key={day} 
                            style={[styles.dayButton, 
                                {
                                    backgroundColor : selectedDay === day ? "#ff5900" : theme === "light" ? "white" : "#282828"
                                }
                            ]}
                            onPress={() => setSelectedDay(day)}
                        >
                            <View style={[styles.radio, hasSelectedSlots && styles.radioSelected]} />
                            <Text style={[styles.dayText, {
                                color : selectedDay === day ? "white" : theme === "light" ? "#141414" : "#E3E3E3"
                            }]}>{day}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            
            <ScrollView showsVerticalScrollIndicator={false} style={styles.slotsContainer}>
                {(timeSlotsByDay[selectedDay] || []).map(slot => (
                    <TouchableOpacity 
                        key={slot} 
                        style={[
                            styles.slot,
                            {
                                borderColor: (selectedSlots[selectedDay] || []).includes(slot) 
                                    ? "#ff5900" 
                                    : theme === "light" 
                                        ? "gainsboro" 
                                        : "#333333"
                            }, 
                            {
                                backgroundColor : theme === "light" ? "white" : "#282828"
                            }
                        ]} 
                        onPress={() => toggleSlotSelection(slot)}
                    >
                        <View style={[styles.radio, (selectedSlots[selectedDay] || []).includes(slot) && styles.radioSelected]} />
                        <Text 
                            style={[
                                styles.slotText, 
                                (selectedSlots[selectedDay] || []).includes(slot) && styles.selectedSlotText, 
                                {
                                    color: (selectedSlots[selectedDay] || []).includes(slot) 
                                        ? "#ff5900" 
                                        : theme === "light" 
                                            ? "#141414" 
                                            : "#E3E3E3"
                                }
                            ]}
                        >
                            {slot}
                        </Text>
                    </TouchableOpacity>
                ))}
                {
                    (ChangeUiOfPage && LastUpdate !== null) && 
                    <View 
                        style={
                            [
                                styles.isjrdjfjsdpfi, 
                                {borderTopColor : theme === "light" ? "gainsboro" : "#282828"}
                            ]
                        }
                    >
                        <Text style={[styles.textOfDE]} >
                            Dernier enregistrement : 
                        </Text>
                        <Text style={[styles.textOfDE]} >
                            {LastUpdate}
                        </Text>
                    </View>
                }
            </ScrollView>


            <View style={{ height: "auto", width: "100%",paddingLeft : 20, paddingRight : 20,  alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontFamily: "Inter", color: "rgb(155, 155, 155)", fontSize: 12, textAlign: "center" }}>
                    <Octicons name='pin' size={14} color="rgb(155, 155, 155)" /> Astuce : Cochez les horaires qui vous arrangent et passez d’un jour à l’autre grâce aux onglets en haut.
                </Text>
            </View>
            

            <TouchableOpacity disabled={!hasChanged}  style={[styles.confirmButton,{opacity : hasChanged ? 1 : 0.2}]} onPress={()=>{setModalVisible(true)}} >
                <Text style={styles.confirmButtonText}>Enregistrer les créneaux</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChoixCreneauxIntervenant;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
        paddingTop : 20
    },
    daysContainer: {
        paddingBottom : 5, 
        paddingTop : 5, 
        paddingLeft : 20, 
        paddingRight : 20, 
        flexGrow: 0,
        minHeight: 60, 
        maxHeight: 60,
        marginBottom : 30
    },
    dayButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 10,
        elevation: 2,
        height : 40, 
        position: 'relative'
    },
    dayText: {
        color: '#333',
        fontFamily : "Inter"
    },
    selectedDayText: {
        color: '#fff',
        fontFamily : "Inter"
    },
    selectedIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: 'absolute',
        top: 5,
        right: 5,
    },
    slotsContainer: {
        flexGrow: 1,
        paddingLeft : 20, 
        paddingRight : 20
    },
    slot: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent : "center",
        paddingVertical: 16,
        paddingHorizontal : 15,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
    },
    radio: {
        width: 10.5,
        height: 10.5,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'rgb(211, 211, 211)',
        marginRight: 10,
    },  
    radioSelected: {
        backgroundColor: 'rgb(213, 103, 44)',
        borderColor: 'rgb(213, 103, 44)',
    },
    slotText: {
        color: '#333',
        fontFamily : "Inter"
    },
    selectedSlotText: {
        color: '#ff5900',
        fontFamily : "InterBold"
    },
    confirmButton: {
        backgroundColor: '#ff5900',
        paddingVertical: 15.99,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 14,
        marginLeft : 20, 
        marginRight : 20
    },
    confirmButtonText: {
        color: '#fff',
        fontFamily : "InterBold",
        fontSize : 15
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
    },
    modalTitle: {
        fontFamily: "InterBold",
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center"
    },
    modalText: {
        fontFamily: "Inter",
        fontSize: 13,
        marginBottom: 5, 
        textAlign : "center"
    },
    modalButton: {
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        width : "48%"
    },
    modalButtonText: {
        color: "white",
        fontFamily: "InterBold",
        fontSize: 14,
    },
    modalButtonText2: {
        fontFamily: "InterMedium",
        fontSize: 14,
    },
    isjrdjfjsdpfi : {
        alignItems : "center", 
        justifyContent : "space-between", 
        width : "100%", 
        flexDirection : "row", 
        borderTopWidth : 1, 
        paddingTop : 12, 
        marginTop : 3
    }, 
    textOfDE : {
        fontFamily : "Inter", 
        fontSize : 13, 
        color : "gray"
    }
});