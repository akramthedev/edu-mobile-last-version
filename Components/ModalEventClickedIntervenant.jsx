import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useHistoryStack } from '../states/HistoryContext';


const ModalEventClickedIntervenant = ({ eventClicked,seteventClicked, showModal, setShowModal, theme }) => {


  const navigation = useNavigation();
  const { pushToHistory } = useHistoryStack();


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
    >
      {
        eventClicked !== null && 
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <View style={styles.centeredView}>
            <View style={[styles.darkOverlay]} />
            <TouchableWithoutFeedback>
                <View style={[styles.modalView, {backgroundColor : theme === "light" ? "white" : "rgb(40, 40, 40)"}, {borderWidth : 1}, {borderColor : theme === "light" ? "white" : "rgb(59, 59, 59)"}]}>
                    <Text style={[styles.modalTextTitlte, {color : theme === "light" ? "#141414" : "#E3E3E3"} ]}>{eventClicked.title}</Text>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                        <Text style={[styles.modalText, {color : theme === "light" ? "#141414" : "rgb(186, 186, 186)"}]}>Durée :</Text>
                        <Text style={[styles.modalText2, {color : theme === "light" ? "#141414" : "rgb(186, 186, 186)"}]}>2 heures</Text>
                    </View>
                    <View style={{flexDirection : "row", alignItems : "center", justifyContent : "space-between", width : "100%"}} >
                        <Text style={[styles.modalText, {color : theme === "light" ? "#141414" : "rgb(186, 186, 186)"}]}>Date et heure :</Text>
                        <Text style={[styles.modalText2, {color : theme === "light" ? "#141414" : "rgb(186, 186, 186)"}]}>8:30 - 10:30, 13 Sep</Text>
                    </View>
                    <View style={{flexDirection : "row", alignItems : "center", justifyContent : "space-between", width : "100%"}} >
                        <Text style={[styles.modalText, {color : theme === "light" ? "#141414" : "rgb(186, 186, 186)"}]}>Salle :</Text>
                        <Text style={[styles.modalText2, {color : theme === "light" ? "#141414" : "rgb(186, 186, 186)"}]}>Bâtiment A, Salle 202</Text>
                    </View>
                    <View style={{flexDirection : "row", alignItems : "center", justifyContent : "space-between", width : "100%"}} >
                        <Text style={[styles.modalText, {color : theme === "light" ? "#141414" : "rgb(186, 186, 186)"}]}>Professeur :</Text>
                        <Text style={[styles.modalText2, {color : theme === "light" ? "#141414" : "rgb(186, 186, 186)"}]}>Mr.Jhon Jack Rousseau </Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                        <Text style={[styles.modalText, {color : theme === "light" ? "#141414" : "rgb(186, 186, 186)"}]}>Section :</Text>
                        <Text style={[styles.modalText2, {color : theme === "light" ? "#141414" : "rgb(186, 186, 186)"}]}>Cours & TD</Text>
                    </View>
                    <TouchableOpacity style={[styles.StartTheClass]} 
                        onPress={() => { 
                          setShowModal(false);
                          seteventClicked(null);
                          pushToHistory("AssiduiteSingle", { data : {title : eventClicked.title, uniqueId: Date.now() } });
                          navigation.navigate('AssiduiteSingle', { data : {title : eventClicked.title, uniqueId: Date.now() } });
                        }}
                    >
                        <Text style={[styles.StartTheClassText]}>
                          Renseigner l'absence
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
      }
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
    padding: 10,
    paddingVertical : 17,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    paddingBottom: 0,
    elevation: 5,
    overflow: "hidden",
  },
  modalText: {
    marginBottom: 8,
    textAlign: "center",
    width : "auto",
    fontSize: 13,
    fontFamily: "InterBold",
    paddingLeft: 5,
    paddingRight: 5,
    marginRight : 10, 
},
  modalText2: {
    marginBottom: 8,
    textAlign: "right",
    fontSize: 13,
    flex : 1,
    fontFamily: "Inter",
    paddingLeft: 5,
    paddingRight: 5,
  },

  modalText3: {
    marginBottom: 8,
    textAlign: "right",
    color: "rgb(6, 131, 85)",
    fontSize: 13,
    flex : 1,
    fontFamily: "Inter",
    textDecorationLine : "underline", 
    paddingLeft: 5,
    paddingRight: 5,
  },
  modalTextTitlte: {
    textAlign: "left",
    fontSize: 20,
    width : "100%", 
    marginBottom: 28,
    fontFamily: "InterBold",
    paddingLeft: 3,
    paddingRight: 3,
  },
  buttonClose: {
    height: 50,
    width: 320,
    marginTop: 20, 
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  TEXTOK: {
    fontFamily: "Inter",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  StartTheClass : {
    height: 48,
    width: "100%",
    marginTop: 20, 
    backgroundColor : "#15B99B",
    borderRadius : 10, 
    alignItems: "center",
    justifyContent: "center",
    marginBottom : 11
  },
  StartTheClassText : {
    fontFamily : "InterBold", 
    fontSize : 15, 
    color : "white"
  }
};

export default ModalEventClickedIntervenant;