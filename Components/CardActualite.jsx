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



const CardActualite = ({ item, theme }) => {
   
  const [isLikedByTheUser, setisLikedByTheUser ] = useState(null);
  const [Likes, setLikes ] = useState(null);
  const navigation = useNavigation();

    const { pushToHistory } = useHistoryStack();

    useEffect(()=>{
      if(item){
        setisLikedByTheUser(item.isLiked);
        setLikes(parseInt(item.likes));
      }
    }, [item]);


  

    const goToSingleActuality = ()=>{
      if(item){
        pushToHistory("SingleActualite", { item : item, isLiked : isLikedByTheUser, likes : Likes,  });
        navigation.navigate('SingleActualite', { item : item, isLiked : isLikedByTheUser, likes : Likes,  });
      }
    }


    return (
        <TouchableOpacity onPress={()=>{goToSingleActuality()}} style={[styles.card, {backgroundColor : theme === "light" ? "white" : "#282828"}, {shadowColor : theme === "light" ? "rgb(188, 188, 188)" :"transparent"} , {borderWidth : item.isEvent ? 3: 0},{borderStyle : "solid"}, {borderColor : item.isEvent && "#15b99b"}]}>
              {item.isEvent && 
                <View style={{backgroundColor : "#15b99b", position : 'absolute', right : -13, zIndex : 10, top : -13,borderWidth : 10,  height : 60, width : 60, alignItems : "center", justifyContent : "center", borderBottomLeftRadius : 30, paddingLeft : 0, borderColor : theme === "light" ? "white" : "#282828"}}>
                  <Octicons name='flame' size={20} color="rgb(242, 242, 242)"  />
                </View>                
              }
            <View   style={styles.content}>
                <Text style={[styles.title, {color : theme === "light" ?  "#141414" : "rgb(238, 238, 238)"}]}>
                  {item.title}                  
                </Text>
                <View style={
                  styles.tagsContainer}
                >
                  {
                    
                    item.tags.map((tag, index) => {
                      const bgColor = tinycolor(tag.backgroundColor);
                      const highContrastBg = bgColor.isDark() ? bgColor.lighten(10).toString() : bgColor.darken(3).toString();

                      return (
                        <View key={tag.id} style={[
                          styles.SingletagContainer, 
                          { backgroundColor: highContrastBg }
                        ]}>
                          <Text 
                            key={index} 
                            style={[
                              styles.tag, 
                              { color: tag.color }
                            ]}
                          >
                            {tag.name}
                          </Text>
                        </View>
                      );
                    })
                  }        
              </View>
              <Text style={[styles.description, {color : theme === "light" ? "#6B7280" : "#a7a7a7"}]} numberOfLines={2}>
                
                {item.description.split("\n").map((line, index) => (
                  <Text key={index}>
                      {line}
                  </Text>
                  ))
                }


              </Text>
      
              <View style={styles.interactionContainer}>
                <View 
                  style={styles.iconRow}  
                >
                  {
                    isLikedByTheUser !== null ?
                    <>
                    {
                      isLikedByTheUser ? 
                      <AntDesign name='heart' size={16} color="#15B99B" />
                      :
                      <Feather name='heart' size={16} color="gray" />
                    }
                    </>
                    :
                    <Feather name='heart' size={16} color="gray" />
                  }
                  <Text style={[styles.iconText, {color : theme === "light" ? "#6B7280" : "#a7a7a7"}]}>{Likes && Likes}</Text>
                </View>
                <TouchableOpacity  style={styles.iconRow}>
                  <AntDesign name='message1' size={16} color="gray" />
                  <Text style={[styles.iconText, {color : theme === "light" ? "#6B7280" : "#a7a7a7"}]}>{item.comments}</Text>
                </TouchableOpacity>
              </View>
            </View>
      
            <View  style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={[styles.image, {backgroundColor : theme === "light" ? "rgb(239, 239, 239)" : "rgb(74, 74, 74)"}]} />
              <Text style={[styles.date, {color : theme === "light" ? "#6B7280" : "#a7a7a7"}]}>{item.date}</Text>
            </View>
        </TouchableOpacity>
      );
  };


  
const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        borderRadius: 15,
        padding: 12,
        marginLeft  : 3,
        marginRight : 3, 
        marginBottom: 15,
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        overflow : "hidden"
      },
      content: {
        flex: 1,
        marginRight: 10,
        position : 'relative'
      },
      title: {
        fontFamily : "InterBold", 
        fontSize: 16,
        marginBottom : 7, 
        position : "relative"
      },
      tagsContainer: {
        marginBottom : 7, 
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
        fontSize: 13,
        marginVertical: 5,
        marginBottom : 7
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
        width : 100 , 
        
      },
      image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        borderRadius : 5, 
        marginBottom : 10
      },
      date: {
        fontFamily : "Inter", 
        fontSize: 12,
        position : "absolute", 
        bottom : 0, 
        right : 0, 
      },
});

export default CardActualite