import React, { useState, useEffect, useCallback } from 'react';
import tinycolor from "tinycolor2";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    TextInput,
    FlatList,  
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../i18n";  
import { useAuth } from '../states/States';
import { useCopilot, CopilotStep, walkthroughable } from "react-native-copilot";
import { useFonts } from 'expo-font';
import { AntDesign, Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { useHistoryStack } from '../states/HistoryContext';

const CardStudent = ({ item, theme}) => {


    const navigation = useNavigation();
    const { pushToHistory } = useHistoryStack();


    const visitStudentProfile = ()=>{
      if(item){
        pushToHistory("SingleStudent", { data : item });
        navigation.navigate('SingleStudent', { data : item });
      }
    }
        
    
    return (
        <TouchableOpacity key={item.Matricule} onPress={()=>{visitStudentProfile();}} style={[styles.card, {backgroundColor : theme === "light" ? "white" : "#282828"}, {shadowColor : theme === "light" ? "rgb(188, 188, 188)" :"transparent"}]}>
            <View  style={styles.imageContainer}>
              <Image source={{ uri: item.Image }} style={[styles.image, {backgroundColor : theme === "light" ? "rgb(239, 239, 239)" : "rgb(74, 74, 74)"}]} />
            </View>
            <View   style={styles.content}>
                <Text style={[styles.title, {color : theme === "light" ?  "#141414" : "rgb(238, 238, 238)"}]}>
                  {item.Nom}&nbsp;{item.Prenom}                  
                </Text>
                <Text style={[styles.description, {color : theme === "light" ? "#6B7280" : "#a7a7a7"}]} numberOfLines={2}>
                    Matricule : {item.Matricule}
                </Text>
                <Text style={[styles.description, {color : theme === "light" ? "#6B7280" : "#a7a7a7"}]} numberOfLines={2}>
                    Absences : {item.NombreAbsence}
                </Text>
            </View>
            <View
              style={{alignItems : "center", justifyContent : "center", height : 70, width : 20, marginLeft : 10}}
            >
              <Octicons 
                name='chevron-right'
                size={20}
                color={theme === "light" ? "gray" : "gray"}
              />
            </View>
        </TouchableOpacity>
      );
  };


  
const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        borderRadius: 10,
        padding: 12,
        alignItems : "center",
        marginBottom: 15,
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        overflow : "hidden"
      },
      content: {
        flex: 1,
        flexDirection : "column", 
        justifyContent : "center"       
    },
      title: {
        fontFamily : "InterBold", 
        fontSize: 16,
        position : "relative"
      },
      tagsContainer: {
        flexDirection: "row",
        flexWrap : "wrap"
      },
      SingletagContainer : {
        flexDirection: "row",
        marginRight : 5, 
        borderRadius : 7,
        marginTop: 5
      },
      tag: {
        fontFamily : "InterBold", 
        fontSize: 10,
        paddingVertical: 1,
        paddingHorizontal: 4,
        borderRadius: 8,
      },
      tagGreen: {
        backgroundColor: "#D1FAE5",
        color: "#065F46",
      },
      tagOrange: {
        backgroundColor: "#FDE68A",
        color: "#92400E",
      },
      description: {
        fontFamily : "Inter", 
        fontSize: 12.25,
      },
      interactionContainer: {
        flexDirection: "row",
        marginTop: 8,
      },
      iconRow: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15,
      },
      iconText: {
        marginLeft: 4,
        fontFamily : "Inter", 
        fontSize: 12,
        color: "#6B7280",
      },
      imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        position : "relative",
        width : 63 , 
        height : 63, 
        borderRadius : 63, 
        marginRight : 15,
        overflow : "hidden"
      },
      image: {
        width: 63,
        height: 63,
        borderRadius: 63,
      },
      date: {
        fontFamily : "Inter", 
        fontSize: 12,
        position : "absolute", 
        bottom : 0, 
        right : 0, 
      },
});

export default CardStudent;