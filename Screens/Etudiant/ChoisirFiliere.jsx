import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Modal,
    Animated,
    BackHandler
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../states/ThemeContext";
import { Picker } from '@react-native-picker/picker'; 
import ErrorModal from '../../Components/ModalError';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Octicons } from '@expo/vector-icons';
import { useHistoryStack } from '../../states/HistoryContext';

const ChoisirFiliere = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const animation = useRef(new Animated.Value(0)).current;
    const [isLoading, setisLoading] = useState(true);
    const diplomes = [
        { id: 'licence', name: 'Licence' },
        { id: 'master', name: 'Master' },
        { id: 'doctorat', name: 'Doctorat' },
    ];
    const filieres = [
        { id: 'genie_informatique', name: 'Génie Informatique' },
        { id: 'gestion', name: 'Gestion des Entreprises' },
        { id: 'marketing', name: 'Marketing Digital' },
    ];
    const [ancienneFiliere, setAncienneFiliere] = useState("Électronique Embarquée");
    const [nbAnnees, setNbAnnees] = useState(3);
    const [dernierDiplome, setDernierDiplome] = useState("DEUST");
    const [error, seterror] = useState("");
    const [showError, setshowError] = useState(false);
    const [titleError, setTitleError] = useState("");
    const [nouvelleFiliere, setNouvelleFiliere] = useState({ id: '', name: '' });
    const [nouvelleFiliere2, setNouvelleFiliere2] = useState({ id: '', name: '' });
    const [nouveauDiplome, setNouveauDiplome] = useState({ id: '', name: '' });
    const [ChangeUiOfPage, setChangeUiOfPage] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false); 



     
        const { getPreviousScreen, popFromHistory } = useHistoryStack();
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
    
     

    
    useEffect(() => {
        setisLoading(true);
        setTimeout(() => setisLoading(false), 1500);
        return () => animation.stopAnimation();
    }, []);


    const handleSave = () => {
        if (nouvelleFiliere.name !== "" && nouveauDiplome.name !== "") {
            setModalVisible(true); 
        } else {
            seterror("Veuillez remplir tous les champs.");
            setTitleError("Champs incomplets");
            setshowError(true);
        }
    };



    
    useFocusEffect(
        useCallback(() => {
            setModalVisible(false);
            seterror("");
            setTitleError("");
            setshowError(false);
            setNouveauDiplome({ id: '', name: '' });
            setNouvelleFiliere({ id: '', name: '' });
            setNouvelleFiliere2({id : "", name : ""});
            setChangeUiOfPage(false);
        }, [])
    );
       


    const handleModalConfirm = () => {
        setModalVisible(false);
        setTitleError("Enregistrement réussi");
        seterror('Votre choix a bien été pris en compte !');
        setChangeUiOfPage(true);
        setshowError(true);
    };



    const handleModalCancel = () => {
        setModalVisible(false);
    };



    return (
        <View style={[styles.containerFFf, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]} >
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>
                <Text style={[styles.infoText2,  {color : theme === "light" ? "#141414" : "#E3E3E3"}, {fontFamily : "InterBold", fontSize : 15, color : "#ff5900"}]} >
                    Profil académique actuel : 
                </Text>
                <View style={[styles.infoBox, {borderBottomColor : theme === "light" ? "rgb(203, 203, 203)" : "rgb(71, 71, 71)"}]}>
                    <Text style={[styles.infoText, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                        <Text style={{fontFamily : "InterMedium"}} >Année d'étude actuelle :</Text> {nbAnnees} {nbAnnees === 1 ? "ère" : "eme"} année
                    </Text>
                    <Text style={[styles.infoText, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                        <Text style={{fontFamily : "InterMedium"}} >Dernier diplôme :</Text> {dernierDiplome}
                    </Text>
                    <Text style={[styles.infoText, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                        <Text style={{fontFamily : "InterMedium"}} >Ancienne filière :</Text> {ancienneFiliere}
                    </Text>
                </View>

                {
                    ChangeUiOfPage === true ? 
                        <>
                            <Text style={[styles.labelX, {color : "#ff5900"}]}>Diplôme souhaité : <Text style={[{color : theme === "light" ? "#141414" : "#E3E3E3"}, {fontFamily : "Inter"}]} >{nouveauDiplome.name}</Text></Text>
                            <Text style={[styles.labelX, {color : "#ff5900"}]}>Filière 1 souhaitée : <Text style={[{color : theme === "light" ? "#141414" : "#E3E3E3"}, {fontFamily : "Inter"}]} >{nouvelleFiliere.name}</Text></Text>
                            <Text style={[styles.labelX, {color : "#ff5900"}]}>Filière 2 souhaitée : <Text style={[{color : theme === "light" ? "#141414" : "#E3E3E3"}, {fontFamily : "Inter"}]} >{nouvelleFiliere2.name}</Text></Text>
                        </>
                        :
                        <>
                            <Text style={[styles.label, {color : "#ff5900"}]}>Choix de filière numéro 1 :</Text>
                            <Picker
                                selectedValue={nouvelleFiliere.id}
                                onValueChange={(itemValue) => {
                                     
                                    if (itemValue !== "") {
                                        const selectedFiliere = filieres.find(filiere => filiere.id === itemValue);
                                        setNouvelleFiliere({ id: selectedFiliere.id, name: selectedFiliere.name });
                                    } else {
                                        setNouvelleFiliere({ id: '', name: '' });  
                                    }
                                }}
                                style={[styles.picker, {backgroundColor: theme === "light" ? "white" : "#313131"}, {color: theme === "light" ? "#141414" : "#E3E3E3"},  {borderColor : theme === "light" ? "gainsboro" : "#333333"}]}
                            >
                                <Picker.Item label="Sélectionnez une filière" value="" style={{fontFamily : "Inter", fontSize : 14.5}} />
                                {filieres.map(filiere => (
                                    <Picker.Item style={{fontFamily : "Inter", fontSize : 14.5}} key={filiere.id} label={filiere.name} value={filiere.id} />
                                ))}
                            </Picker>

                            <Text style={[styles.label, {color : "#ff5900"}]}>Choix de filière numéro 2 :</Text>
                            <Picker
                                selectedValue={nouvelleFiliere2.id}
                                onValueChange={(itemValue) => {
                                     
                                    if (itemValue !== "") {
                                        const selectedFiliere2 = filieres.find(filiere => filiere.id === itemValue);
                                        setNouvelleFiliere2({ id: selectedFiliere2.id, name: selectedFiliere2.name });
                                    } else {
                                        setNouvelleFiliere2({ id: '', name: '' });  
                                    }
                                }}
                                style={[styles.picker, {backgroundColor: theme === "light" ? "white" : "#313131"}, {color: theme === "light" ? "#141414" : "#E3E3E3"},  {borderColor : theme === "light" ? "gainsboro" : "#333333"}]}
                            >
                                <Picker.Item label="Sélectionnez une filière" value="" style={{fontFamily : "Inter", fontSize : 14.5}} />
                                {filieres.map(filiere => (
                                    <Picker.Item style={{fontFamily : "Inter", fontSize : 14.5}} key={filiere.id} label={filiere.name} value={filiere.id} />
                                ))}
                            </Picker>

                            <Text style={[styles.label, {color : "#ff5900"}]}>Diplôme souhaité :</Text>
                            <Picker
                                selectedValue={nouveauDiplome.id}
                                onValueChange={(itemValue) => {
                                    if (itemValue !== "") {
                                        const selectedDiplome = diplomes.find(diplome => diplome.id === itemValue);
                                        setNouveauDiplome({ id: selectedDiplome.id, name: selectedDiplome.name });
                                    } else {
                                        setNouveauDiplome({ id: '', name: '' }); 
                                    }
                                }}
                                style={[styles.picker, {backgroundColor: theme === "light" ? "white" : "#313131"}, {color: theme === "light" ? "#141414" : "#E3E3E3"},  {borderColor : theme === "light" ? "gainsboro" : "#333333"}]}
                            >
                                <Picker.Item label="Sélectionnez un diplôme" value="" style={{fontFamily : "Inter", fontSize : 14.5}} />
                                {diplomes.map(diplome => (
                                    <Picker.Item style={{fontFamily : "Inter", fontSize : 14.5}} key={diplome.id} label={diplome.name} value={diplome.id} />
                                ))}
                            </Picker>

                        </>
                }
            </ScrollView>

            <Text style={{  marginBottom : 20,textAlign : "center" ,color : "gray", fontSize: 12, fontFamily : "Inter" }} >
                <Octicons name='pin' size={13} color="gray" />&nbsp;&nbsp;Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi deserunt, iure voluptatibus non esse.
            </Text>


            {
                !ChangeUiOfPage && 
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Enregistrer mon choix</Text>
                </TouchableOpacity> 
            }

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
                            <Text style={{fontFamily : "InterBold"}}>Diplôme souhaité :</Text> {nouveauDiplome.name}
                        </Text>
                        <Text style={[styles.modalText, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                            <Text style={{fontFamily : "InterBold"}}>Choix filière 1 :</Text> {nouvelleFiliere.name}
                        </Text>
                        <Text style={[styles.modalText, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                            <Text style={{fontFamily : "InterBold"}}>Choix filière 2 :</Text> {nouvelleFiliere2.name}
                        </Text>
                        
                        <Text style={[styles.modalText, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                            &nbsp;
                        </Text>
                        <View style={{flexDirection : "row", justifyContent : "space-between"}} >
                            <TouchableOpacity style={[styles.modalButton, {backgroundColor: theme === "light" ? "rgb(227, 227, 227)" : "rgb(64, 64, 64)"}]} onPress={handleModalCancel}>
                                <Text style={[styles.modalButtonText2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, {backgroundColor: "#ff5900"}]} onPress={handleModalConfirm}>
                                <Text style={styles.modalButtonText}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ErrorModal
                modalVisible={showError}
                setModalVisible={setshowError}
                errorTitle={titleError}
                errorMessage={error}
            />  
        </View>
    );
};

export default ChoisirFiliere;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    infoBox: {
        borderRadius: 10,
        marginBottom: 10,
        paddingBottom : 15, 
        backgroundColor : "transparent", 
        borderBottomWidth : 1, 
    },
    infoText: {
        fontFamily: "Inter",
        fontSize: 14.5,
        letterSpacing : -0.2, 
        marginBottom: 5,
    },
    infoText2: {
        fontFamily: "InterBold",
        fontSize: 15,
        letterSpacing : -0.2, 
        marginBottom: 5,
    },
    label: {
        fontFamily: "InterBold",
        letterSpacing : -0.2, 
        fontSize: 15,
        marginBottom: 10,
        marginTop: 0,
    },

    labelX: {
        fontFamily: "InterBold",
        letterSpacing : -0.2, 
        fontSize: 14.5,
        marginBottom: 10,
        marginTop: 0,
    },
    button: {
        backgroundColor: "#ff5900",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "white",
        fontFamily: "InterBold",
        letterSpacing : -0.2, 
        fontSize: 15,
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
        fontSize: 14.5,
        marginBottom: 5
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
    containerFFf : {
        flex : 1, 
        paddingHorizontal : 20
    }, 
    picker: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        fontFamily : "Inter", 
        letterSpacing : -0.2, 
        borderRadius: 8,
        marginBottom: 20,
        paddingLeft: 10,
        fontSize: 14, 
        borderRadius : 10,  
    },
});
