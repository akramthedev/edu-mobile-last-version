import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useHistoryStack } from '../states/HistoryContext';

const ModalChoixIntervenant = ({ modalVisible, setModalVisible, theme }) => {
  
  const navigation = useNavigation();
    const { pushToHistory } = useHistoryStack();
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={[styles.darkOverlay]} />
          <TouchableWithoutFeedback>
            <View style={[styles.modalView, {backgroundColor : theme === "light" ? "white" : "#141414"},{borderWidth : theme === "light" ? 0 : 1}, {borderColor : theme === "light" ? "gray" : "rgb(67, 67, 67)"}]}>
              <Text style={[styles.modalTextTitlte, { color : theme === "light" ? "#141414" : "#E3E3E3" }]}>
                <Octicons name='flame' size={20} color="rgb(255, 89, 0)" />
                &nbsp;&nbsp;Planifiez votre disponibilité !
              </Text>
              <Text style={[styles.modalText2, { color : theme === "light" ? "#141414" : "#E3E3E3" }]}>
              L'organisation des cours commence, et nous comptons sur vous !  Afin de préparer au mieux les plannings, nous vous invitons à renseigner vos disponibilités dès maintenant.
              </Text>
              <TouchableOpacity style={styles.buttonClose} onPress={() => {setModalVisible(false);pushToHistory("CreneauxIntervenant");navigation.navigate("CreneauxIntervenant")}}>
                <Text style={[styles.TEXTOK]}>
                    Indiquer mes créneaux
                </Text>
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
    paddingHorizontal: 15,
    paddingVertical : 20, 
    width: "92%",
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
    fontSize: 14,
    fontFamily: "Inter",
    paddingLeft: 5,
    paddingRight: 5,
    width : "100%",
  },
  modalTextTitlte: {
    textAlign: "left",
    fontSize: 18,
    width : "100%",
    marginBottom: 25,
    letterSpacing: -0.2,
    fontFamily: "InterBold",
    paddingLeft: 3,
    paddingRight: 3,
  },
  buttonClose: {
    height: 48,
    width: "100%",
    backgroundColor: "rgb(214, 75, 0)",
    alignItems: "center",
    borderRadius : 11, 
    justifyContent: "center",
  },
  TEXTOK: {
    fontFamily: "InterBold",
    fontSize: 15,
    color : "white"
  },
};

export default ModalChoixIntervenant;
