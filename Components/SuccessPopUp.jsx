import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { useTheme } from "../states/ThemeContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useHistoryStack } from '../states/HistoryContext';


const SuccessPopUp = ({ modalVisible, setModalVisible, errorTitle, errorMessage, animationSpeed = 300, navigation }) => {
  
  const { theme } = useTheme()
  const [fadeAnim] = useState(new Animated.Value(0));  
const { pushToHistory } = useHistoryStack();
  
  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,  
        duration: animationSpeed,  
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,  
        duration: animationSpeed,  
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, fadeAnim, animationSpeed]);


  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={[styles.darkOverlay]} />
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalView, { opacity: fadeAnim }, {backgroundColor : theme === "light" ? "white" : "#141414"}]}>
              <Text style={[styles.modalTextTitlte, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>{errorTitle}</Text>
              <View style={{flexDirection : "column"}} >
              {typeof errorMessage === "object" && errorMessage !== null 
                  ? 
                 <>
                  <Text style={[styles.modalText233, {color: theme === "light" ? "#141414" : "#E3E3E3"}]}>
                    Ip Adress : {errorMessage.IP_ADDRESS && errorMessage.IP_ADDRESS}
                  </Text>
                  <Text style={[styles.modalText233, {color: theme === "light" ? "#141414" : "#E3E3E3"}]}>
                    Fabricant : {errorMessage.DEVICE_INFO.manufacturer && errorMessage.DEVICE_INFO.manufacturer}&nbsp;/&nbsp;{errorMessage.DEVICE_INFO.brand && errorMessage.DEVICE_INFO.brand}
                  </Text>
                  <Text style={[styles.modalText233, {color: theme === "light" ? "#141414" : "#E3E3E3"}]}>
                    Autre infos : {errorMessage.DEVICE_INFO.deviceType && errorMessage.DEVICE_INFO.deviceType}&nbsp;/&nbsp;{errorMessage.DEVICE_INFO.osName && errorMessage.DEVICE_INFO.osName }&nbsp;/&nbsp;v.{errorMessage.DEVICE_INFO.osVersion}
                  </Text>
                 </> 
              : 
              <Text style={[styles.modalText2, {color: theme === "light" ? "#141414" : "#E3E3E3"}]}>
                {errorMessage}
              </Text>
              }
              </View>
              <TouchableOpacity style={styles.buttonClose} onPress={() => {setModalVisible(false);pushToHistory("CreneauxIntervenant");navigation.navigate('CreneauxIntervenant')}}>
                <Text style={[styles.TEXTOK, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>OK</Text>
              </TouchableOpacity>
            </Animated.View>
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
    zIndex : 9999999999999, 
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
    zIndex : 9999999999999, 
  },
  modalView: {
    borderRadius: 12,
    padding: 20,
    width: 320,
    alignItems: "center",
    zIndex : 9999999999999, 
    paddingBottom: 0,
    elevation: 5,
    overflow: "hidden",
  },
  modalText: {
    marginBottom: 5,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Inter",
    paddingLeft: 5,
    paddingRight: 5,
  },
  modalText2: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Inter",
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection : "column"
  },
  modalText233: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 13,
    fontFamily: "InterBold",
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection : "row", 
    justifyContent : "space-between"
  },
  modalTextTitlte: {
    textAlign: "center",
    fontSize: 17,
    marginBottom: 10,
    letterSpacing: 0.15,
    fontFamily: "InterBold",
    paddingLeft: 3,
    paddingRight: 3,
  },
  buttonClose: {
    height: 50,
    width: 320,
    borderTopColor: "rgb(222, 222, 222)",
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  TEXTOK: {
    fontFamily: "InterBold",
    fontSize: 15,
    letterSpacing: 0.3,
  },
};

export default SuccessPopUp;