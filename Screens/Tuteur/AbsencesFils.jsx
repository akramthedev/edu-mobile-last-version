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
import { LineChart } from 'react-native-gifted-charts';
import Svg, { Line } from 'react-native-svg';

const absenceData = [
  {value: 5, label: 'Se'},
  {value: 3, label: 'Oc'},
  {value: 1, label: 'No'},
  {value: 1, label: 'De'},
  {value: 6, label: 'Ja'},
  {value: 7, label: 'Fe'},
  {value: 3, label: 'Ma'},
  {value: 2, label: 'Av'},
  {value: 4, label: 'Ma'},
  {value: 10, label:'Ju'},
  {value: 3, label: 'Ao'},
];

 


const AbsencesFils = ({ item, theme }) => {

    return (
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} >
          <View  style={{
            alignItems : "center",
            justifyContent: 'flex-start', 
            flexDirection : "row", 
            marginBottom : 10, 
          }} >
            <Text style={{
              fontFamily: "InterBold",
              fontSize: 15,
              color : theme === "light" ? "#141414" : "white", 
            }}>
            Graphe d'absences :                         
            </Text>
          </View>
          <View style={[
              styles.ContainerOfAbsenceGraph,              
              { borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 },
              { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
              { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
              {backgroundColor : theme === "light" ? "white" : "#282828"}
            ]} 
          >
            <LineChart
              data={absenceData}
              height={111}
              hideDataPoints={false}
              spacing={30}
              color="rgb(250, 113, 0)"
              thickness={2}
              startFillColor="rgb(250, 113, 0)"
              startOpacity={0.4}
              endOpacity={0.1}
              initialSpacing={0}
              noOfSections={3}
              hideRules={false}              
              rulesColor={theme === "light" ? "gainsboro" : "rgb(78, 78, 78)"}       
              rulesThickness={1}     
              showVerticalLines={true} 
              verticalLinesColor={theme === "light" ? "gainsboro" : "rgb(78, 78, 78)"}       
              verticalLinesThickness={1}               
              verticalLinesSpacing={30}           
              rulesType="solid"           
              dashWidth={4}                 
              dashGap={4}                   
              yAxisTextStyle={{
                color: theme === "light" ? "#141414" : "white",
                fontSize: 10  
              }}
              xAxisLabelTextStyle={{
                color: theme === "light" ? "#141414" : "white", 
                fontSize: 10  
              }}
              curved={true} 
              dataPointsColor="rgb(255, 60, 0)"  
              dataPointsRadius={2.222}
              yAxisColor={theme === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"}
              xAxisColor={theme === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"}
              xAxisThickness={1}  
              yAxisThickness={1}  
            />
          </View> 
          <View
            style={styles.containerOfTwoContainers}
          >
            <View style={[styles.containerInsider,                        
              { borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 },
              { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
              { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
              {borderBottomLeftRadius : 10},
              {backgroundColor : theme === "light" ? "white" : "#282828"}]} 
            >
              <Text style={[styles.containerInsiderText1, {color : theme === "light" ? "gray" : "gray"}]} >
                Absences justifiées
              </Text>
              <Text style={[styles.containerInsiderText2, {color : theme === "light" ? "#141414" : "white"}]} >
                7
              </Text>
            </View>
            <View style={[styles.containerInsider,                        
              { borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 },
              { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
              { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
              {borderBottomRightRadius : 10},
              {backgroundColor : theme === "light" ? "white" : "#282828"}]} 
            >
              <Text style={[styles.containerInsiderText1, {color : theme === "light" ? "gray" : "gray"}]} >
                Absences non justifiées
              </Text>
              <Text style={[styles.containerInsiderText2, {color : theme === "light" ? "#141414" : "white"}]} >
                11
              </Text>
            </View>
          </View>



          <View  style={{
              width : "100%", 
              height : 1, 
              borderRadius : 1,
              marginTop : 17, 
              backgroundColor : theme === "light" ? "rgb(223, 223, 223)" : "rgb(52, 52, 52)"
          }} /> 


          <View  style={{
            alignItems : "center",
            justifyContent: 'flex-start', 
            flexDirection : "row", 
            marginBottom : 15, 
            marginTop: 15
          }} >
            <Text style={{
              fontFamily: "InterBold",    
              fontSize: 15,
              color : theme === "light" ? "#141414" : "white", 
            }}>
            Historique des absences : 18                       
            </Text>
          </View>

          

          <View
              key={666}
              style={[{
                backgroundColor: theme === "light" ? "white" : "rgb(31, 31, 31)",
                width: "100%",
                padding: 7,
                paddingRight: 15,
                marginBottom: 15,
                position : "relative", 
                borderRadius: 9,
                flexDirection: "column", 
                overflow: "hidden"
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
                28/04/2025
              </Text>
              <Text
                style={{
                  fontFamily: "Inter",
                  fontSize: 13,
                  paddingLeft: 10,
                  marginBottom: 7,
                  color: theme === "light" ? "#141414" : "#E3E3E3"
                }}
              >
                Cours non assisté : Analyse Numérique et UML 
              </Text>
              <View
                style={{
                  right : 0, 
                  top : 0, 
                  backgroundColor : "rgba(255, 0, 0, 0.13)",
                  borderRadius : 0, 
                  borderBottomLeftRadius : 8, 
                  paddingVertical : 2, 
                  paddingHorizontal : 10, 
                  position : "absolute",
                  paddingBottom :5
                }}
              >
                <Text
                  style={{
                    fontFamily : "InterMedium", 
                    fontSize : 12, 
                    color : "rgb(203, 0, 0)"
                  }}
                >
                  Non justifiée
                </Text>
              </View>
            </View>



          {[...Array(5)].map((_, index) => (
            <View
              key={index}
              style={[{
                backgroundColor: theme === "light" ? "white" : "rgb(31, 31, 31)",
                width: "100%",
                padding: 7,
                paddingRight: 15,
                marginBottom: 15,
                position : "relative",
                borderRadius: 9,
                flexDirection: "column",
                overflow: "hidden"

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
                28/04/2025
              </Text>
              <Text
                style={{
                  fontFamily: "Inter",
                  fontSize: 13,
                  paddingLeft: 10,
                  marginBottom: 7,
                  color: theme === "light" ? "#141414" : "#E3E3E3"
                }}
              >
                Cours non assisté : Analyse Numérique et UML 
              </Text>
              <View
                style={{
                  right : 0, 
                  top : 0, 
                  backgroundColor : "rgba(68, 255, 0, 0.14)",
                  borderRadius : 0, 
                  borderBottomLeftRadius : 8, 
                  paddingVertical : 2, 
                  paddingHorizontal : 10, 
                  position : "absolute",
                  paddingBottom :5
                }}
              >
                <Text
                  style={{
                    fontFamily : "InterMedium", 
                    fontSize : 12, 
                    color : "rgb(55, 165, 38)"
                  }}
                >
                  Justifiée
                </Text>
              </View>
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

export default AbsencesFils;