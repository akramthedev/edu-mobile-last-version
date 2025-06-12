import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  Image, 
  TouchableWithoutFeedback,
  BackHandler, 
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import ENDPOINT_URL from '../../environments/ENDPOINT_URL';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { Keyboard } from 'react-native';
import { useTranslation } from "react-i18next";
import { useAuth } from '../../states/States';
import ErrorModal from '../../Components/ModalError';
import * as Device from 'expo-device';
import  * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';
import { useHistoryStack } from '../../states/HistoryContext';
import { useTheme } from "../../states/ThemeContext";     
import { SafeAreaView } from 'react-native-safe-area-context';




export default function GetPremium() {

    const [messageError, setMessageError] = useState(null);
    const [loading, setLoading] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { getPreviousScreen, popFromHistory } = useHistoryStack();
    const {theme} = useTheme();

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
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }, []);
    
 
  return (
    <View style={{ flex: 1, backgroundColor: theme === "light" ? "#f2f2f2" : "#141414" }}>        
        <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: theme === "light" ? "#f2f2f2" : "#141414", }}>
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        alignItems : "center", 
                        justifyContent : "center", 
                        width: "100%",
                        height: 200,
                        paddingTop : 50, 
                        backgroundColor: theme === "light" ? "#f2f2f2" : "#141414",
                    }}
                >
                    <Image 
                        style={{
                            height : 100, 
                            width : 100, 
                            objectFit : "cover", 
                            marginBottom : 15, 
                        }}
                        source={require("../../assets/couronneForPremiumPage.png")}
                    />
                </View>

                <ImageBackground
                    source={require('../../assets/backgroundPremium.png')}
                    style={[
                    styles.background,
                    {
                        backgroundColor:
                        theme === "light" ? "#f2f2f2" : "#141414",
                        flex: 1,
                    },
                    ]}
                    resizeMode="cover"
                >
                                <View style={styles.inputContainer}>
                                  <Text style={styles.inputPassword}>
                                    SHO <Text style={styles.required}>*</Text>
                                  </Text>
                                  <View style={styles.passwordContainer}>
                                    <TextInput
                                      style={styles.input2}
                                      placeholderTextColor="gray"
                                    />
                                    <TouchableOpacity 
                                      style={styles.eyeIcon} 
                                    >
                                       <Text>
                                        Hello ? 
                                       </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                </ImageBackground>
            </ScrollView>
        </Animated.View>
    </View>

  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: screenWidth,
    height: screenHeight + 50,
  },
  
});