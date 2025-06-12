import { Octicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
} from 'react-native';

const IncidentsFils = ({ item, theme }) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} >

          <View
            style={styles.containerOfTwoContainers}
          >
            <View style={[styles.containerInsider,                        
              { borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 },
              { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
              { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
              {borderBottomLeftRadius : 10, borderTopLeftRadius : 10},
              {backgroundColor : theme === "light" ? "white" : "#282828"}]} 
            >
              <Text style={[styles.containerInsiderText1, {color : theme === "light" ? "gray" : "gray"}]} >
                Total des incidents
              </Text>
              <Text style={[styles.containerInsiderText2, {color : theme === "light" ? "#141414" : "white"}]} >
                5
              </Text>
            </View>
            <View style={[styles.containerInsider,                        
              { borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 },
              { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
              { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
              {borderBottomRightRadius : 10, borderTopRightRadius : 10},
              {backgroundColor : theme === "light" ? "white" : "#282828"}]} 
            >
              <Text style={[styles.containerInsiderText1, {color : theme === "light" ? "gray" : "gray"}]} >
                Incidents graves
              </Text>
              <Text style={[styles.containerInsiderText2, {color : theme === "light" ? "#141414" : "white"}]} >
                2
              </Text>
            </View>
          </View>



          <View  style={{
              width : "100%", 
              height : 1, 
              borderRadius : 1,
              marginVertical : 17,
              backgroundColor : theme === "light" ? "rgb(223, 223, 223)" : "rgb(52, 52, 52)"
          }} /> 


         

          {[...Array(5)].map((_, index) => (
            <View
              key={index}
              style={[{
                backgroundColor: theme === "light" ? "white" : "rgb(31, 31, 31)",
                width: "100%",
                padding: 7,
                paddingRight: 15,
                marginBottom: 15,
                borderRadius: 9,
                flexDirection: "column"
              },
              { borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 },
              { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
              { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
              ]}
            >
              <Text
                style={{
                  fontFamily: "InterBold",
                  fontSize: 14,
                  marginBottom: 7,
                  paddingLeft: 10,
                  color: theme === "light" ? "#141414" : "#E3E3E3"
                }}
              >
                Prof. Dakir Rachid :
              </Text>
              <Text
                style={{
                  fontFamily: "Inter",
                  fontSize: 13,
                  paddingLeft: 20,
                  marginBottom: 7,
                  color: theme === "light" ? "#141414" : "#E3E3E3"
                }}
              >
                Etudiant non sérieux, très agité ne gère ni son stress ni sa bouche.
              </Text>
              <Text
                style={{
                  fontFamily: "Inter",
                  fontSize: 11.5,
                  paddingLeft: 20,
                  color: "gray"
                }}
              >
                14 Nov 2025
              </Text>
            </View>
          ))}

          


        </ScrollView>
      );
  };
  
const styles = StyleSheet.create({
  ContainerOfAbsenceGraph : {
    borderRadius:  10, 
    borderBottomLeftRadius : 0, 
    borderBottomRightRadius : 0, 
    padding : 10, 
    overflow: "hidden", 
    position : "relative", 
    marginBottom : 7, 
  }, 
  containerOfTwoContainers : {
    flexDirection : "row", 
    alignItems : "center", 
    height :'auto', 
    width : "100%",
    marginBottom : 5, 
    justifyContent: "space-between"
  }, 
  containerInsider : {
    flexDirection : "column", 
    alignItems : "center", 
    justifyContent : "center", 
    width : "49%", 
    paddingVertical : 11 
  }, 
  containerInsiderText1 : {
    fontSize : 13, 
    fontFamily : "Inter", 
    marginBottom : 3, 
  }, 
  containerInsiderText2 : {
    fontSize : 31,  
    fontFamily : "InterBold", 
    marginBottom : 7, 
  }
});

export default IncidentsFils;