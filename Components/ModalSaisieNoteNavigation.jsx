import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useHistoryStack } from '../states/HistoryContext';

const ModalChoixFiliere = ({ showModalX, setshowModalX, theme, data }) => {
  
    const navigation = useNavigation();
    const { pushToHistory } = useHistoryStack();


    console.warn(data);



    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={showModalX}
        onRequestClose={() => setshowModalX(false)}
        >
        <TouchableWithoutFeedback onPress={() => setshowModalX(false)}>
            <View style={styles.centeredView}>
            <View style={[styles.darkOverlay]} />
            <TouchableWithoutFeedback>
                <View style={[styles.modalView, {backgroundColor : theme === "light" ? "white" : "#141414"},{borderWidth : theme === "light" ? 0 : 1}, {borderColor : theme === "light" ? "gray" : "rgb(67, 67, 67)"}]}>
                
                <Text style={[styles.modalTextTitlte, { color : theme === "light" ? "#141414" : "#E3E3E3" }]}>
                    Saisie des notes : sélectionnez une option
                </Text>

                <TouchableOpacity style={[styles.buttonClose, {backgroundColor : theme === "light" ? "rgb(235, 235, 235)" : "#282828"}]} onPress={() => {pushToHistory("SaisieNote", {data : data, type : "examen-normal"});navigation.navigate("SaisieNote", {data : data, type : "examen-normal"});setshowModalX(false);}}>
                    <Text style={[styles.TEXTOK, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                        Session Normale
                    </Text>
                    <Octicons 
                        size={16}
                        name='chevron-right'
                        color={theme === "light" ? "gray" : "rgb(235, 235, 235)"}
                        style={{
                            position : "absolute", 
                            left : 16
                        }}
                    />
                    <View
                        style={{
                            position : "absolute", 
                            right : 10, 
                            paddingVertical : 3, 
                            paddingHorizontal : 7,
                            borderRadius : 6, 
                            backgroundColor : "rgba(255, 77, 0, 0.19)"
                        }}
                    >
                        <Text 
                            style={{
                                fontFamily : "Inter",
                                fontSize : 13, 
                                color : "rgb(255, 128, 0)"
                            }}
                        >
                            Non finalisé
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonClose, {backgroundColor : theme === "light" ? "rgb(235, 235, 235)" : "#282828"}]} onPress={() => {pushToHistory("SaisieNote", {data : data, type : "examen-ratt"});navigation.navigate("SaisieNote", {data : data, type : "examen-ratt"});setshowModalX(false);}}>
                    <Text style={[styles.TEXTOK, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                        Session Rattrapage
                    </Text>
                    <Octicons 
                        size={16}
                        name='chevron-right'
                        color={theme === "light" ? "gray" : "rgb(235, 235, 235)"}
                        style={{
                            position : "absolute", 
                            left : 16
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonClose, {backgroundColor : theme === "light" ? "rgb(235, 235, 235)" : "#282828"}]} onPress={() => {pushToHistory("SaisieNote", {data : data, type : "examen-tp"});navigation.navigate("SaisieNote", {data : data, type : "examen-tp"});setshowModalX(false);}}>
                    <Text style={[styles.TEXTOK, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                        Travaux Pratiques
                    </Text>
                    <Octicons 
                        size={16}
                        name='chevron-right'
                        color={theme === "light" ? "gray" : "rgb(235, 235, 235)"}
                        style={{
                            position : "absolute", 
                            left : 16
                        }}
                    />
                    <View
                        style={{
                            position : "absolute", 
                            right : 10, 
                            paddingVertical : 3, 
                            paddingHorizontal : 7,
                            borderRadius : 6, 
                            backgroundColor : "rgba(29, 176, 46, 0.2)"
                        }}
                    >
                        <Text 
                            style={{
                                fontFamily : "Inter",
                                fontSize : 13, 
                                color : "rgb(52, 189, 52)"
                            }}
                        >
                            Enregistré
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonClose, {backgroundColor : theme === "light" ? "rgb(235, 235, 235)" : "#282828"}]} onPress={() => {pushToHistory("SaisieNote", {data : data, type : "examen-projet-perso"});navigation.navigate("SaisieNote", {data : data, type : "examen-projet-perso"});setshowModalX(false);}}>
                    <Text style={[styles.TEXTOK, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                        Projets Personnels  
                    </Text>
                    <Octicons 
                        size={16}
                        name='chevron-right'
                        color={theme === "light" ? "gray" : "rgb(235, 235, 235)"}
                        style={{
                            position : "absolute", 
                            left : 16
                        }}
                    />
                    <View
                        style={{
                            position : "absolute", 
                            right : 10, 
                            paddingVertical : 3, 
                            paddingHorizontal : 7,
                            borderRadius : 6, 
                            backgroundColor : "rgba(176, 29, 29, 0.2)"
                        }}
                    >
                        <Text 
                            style={{
                                fontFamily : "Inter",
                                fontSize : 13, 
                                color : "rgb(229, 25, 25)"
                            }}
                        >
                            Annulé
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonClose, {backgroundColor : theme === "light" ? "rgb(235, 235, 235)" : "#282828"}]} onPress={() => {pushToHistory("SaisieNote", {data : data, type : "examen-comportement"});navigation.navigate("SaisieNote", {data : data, type : "examen-comportement"});setshowModalX(false);}}>
                    <Text style={[styles.TEXTOK, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                        Participation et Comportement
                    </Text>
                    <Octicons 
                        size={16}
                        name='chevron-right'
                        color={theme === "light" ? "gray" : "rgb(235, 235, 235)"}
                        style={{
                            position : "absolute", 
                            left : 16
                        }}
                    />
                    
                </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = {
  centeredView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  darkOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  modalView: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical : 24, 
    width: "94%",
    flexDirection : "column",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  modalText2: {
    marginBottom: 25, 
    textAlign: "left",
    fontSize: 15,
    fontFamily: "Inter",
    paddingLeft: 5,
    paddingRight: 5,
    width : "100%",
  },
  modalTextTitlte: {
    textAlign: "left",
    fontSize: 16,
    width : "100%",
    marginBottom: 20,
    letterSpacing: -0.2,
    fontFamily: "InterBold",
    paddingLeft: 3,
    paddingRight: 3,
  },
  buttonClose: {
    height: 50,
    width: "100%",
    borderRadius : 7,
    position : "relative",
    flexDirection : "row",
    marginBottom : 10,  
    alignItems : "center", 
    paddingLeft : 35, 
    paddingRight : 10,
},
  TEXTOK: {
    fontFamily: "InterMedium",
    fontSize: 15,
  },
};

export default ModalChoixFiliere;
