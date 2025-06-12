import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHistoryStack } from '../states/HistoryContext';
import { LineChart } from 'react-native-gifted-charts';
import { Octicons } from '@expo/vector-icons';

const absenceData1 = [
  {value: 5, label: 'Se'},
  {value: 3, label: 'Oc'},
  {value: 1, label: 'No'},
  {value: 1, label: 'De'},
  {value: 6, label: 'Ja'},
  {value: 7, label: 'Fe'},
  {value: 3, label: 'Ma'},
  {value: 2, label: 'Av'},
  {value: 4, label: 'Ma'},
  {value: 10, label: 'Ju'},
  {value: 3, label: 'Ao'},
];

const absenceData2 = [
  {value: 1, label: 'Se'},
  {value: 1, label: 'Oc'},
  {value: 1, label: 'No'},
  {value: 4, label: 'De'},
  {value: 1, label: 'Ja'},
  {value: 1, label: 'Fe'},
  {value: 1, label: 'Ma'},
  {value: 7, label: 'Av'},
  {value: 2, label: 'Ma'},
  {value: 1, label: 'Ju'},
  {value: 3, label: 'Ao'},

];

const absenceData3 = [
  {value: 1, label: 'Se'},
  {value: 1, label: 'Oc'},
  {value: 1, label: 'No'},
  {value: 1, label: 'De'},
  {value: 8, label: 'Ja'},
  {value: 2, label: 'Fe'},
  {value: 1, label: 'Ma'},
  {value: 1, label: 'Av'},
  {value: 1, label: 'Ma'},
  {value: 1, label: 'Ju'},
  {value: 3, label: 'Ao'},

];

const CardSuivieFils = ({ item, theme }) => {
    const navigation = useNavigation();
    const { pushToHistory } = useHistoryStack();

    const goToSingleSuivieFils = () => {
      if(item){
        pushToHistory("SingleSuivieFils", { item: item });
        navigation.navigate('SingleSuivieFils', { item: item });
      }
    }

    const getChartData = () => {
      if(item.id === 1) return absenceData1;
      if(item.id === 11) return absenceData2;
      return absenceData3;
    }

    return (
        <TouchableOpacity onPress={goToSingleSuivieFils} style={[styles.card, {backgroundColor: theme === "light" ? "white" : "#282828"}, {shadowColor: theme === "light" ? "rgb(188, 188, 188)" :"transparent"}, {borderWidth: item.isEvent ? 3 : 0}, {borderStyle: "solid"}, {borderColor: item.isEvent && "rgb(250, 113, 0)"}]}>
        {
          item && 
          <View style={styles.innerCard} >
            <Image 
              source={{uri: item.image}}
              style={{ width: 55, height: 55, objectFit: "cover", borderRadius: 50 }} 
            />
            <View style={styles.contentRemainiing}>
              <Text style={[styles.title, {color: theme === "light" ? "#141414" : "rgb(238, 238, 238)"}]}>
                {item.nom}              
              </Text>
              <Text style={[{fontFamily: "Inter", fontSize: 13}, {color: theme === "light" ? "#141414" : "rgb(238, 238, 238)"}]}>
                {item.classe} / Génie informatique               
              </Text>
              <Text style={{
                  fontFamily: "Inter",
                  fontSize: 14,
                  color: theme === "light" ? "#141414" : "#e3e3e3"
              }}>
                CIN : J66999              
              </Text>
            </View>
            <Octicons
              name="chevron-right"
              size={19}
              style={{
                position : "absolute", 
                right : 5, 
                top : 17, 
              }}
              color="gray"
            />
          </View>
        }
          <LineChart
                  data={getChartData()}
                  height={60}
                  hideDataPoints={false}
                  spacing={30}
                  color="rgb(250, 113, 0)"
                  thickness={2}
                  startFillColor="rgb(250, 113, 0)"
                  startOpacity={0.4}
                  endOpacity={0.1}
                  initialSpacing={0}
                  noOfSections={3}
                  hideRules
                  yAxisTextStyle={{
                    color: theme === "light" ? "#141414" : "white",
                    fontSize: 10  
                  }}
                  xAxisLabelTextStyle={{
                    color: theme === "light" ? "#141414" : "white", 
                    fontSize: 10  
                  }}
                  yAxisColor="transparent"
                  xAxisColor={theme === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"}
                  curved={true} 
                  dataPointsColor="rgb(255, 60, 0)"  
                  dataPointsRadius={2.222}
                />
                <Text style={{
                    fontFamily: "Inter",
                    fontSize: 12,
                    position : "absolute",
                    bottom : 60,
                    color : "rgba(78, 78, 78, 0.65)", 
                    marginBottom: 10,
                    left : 150
                }}>
                    Aperçu d'Absence                     
                </Text>
        </TouchableOpacity>
      );
  };
  
const styles = StyleSheet.create({
    card: {
        flexDirection: "column",
        borderRadius: 15,
        alignItems: "flex-start", 
        padding: 12,
        marginLeft: 3,
        marginRight: 3, 
        marginBottom: 15,
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        overflow: "hidden"
    },
    innerCard : {
      flexDirection : "row",
      position : "relative", 
      marginBottom : 10, 
    },
    contentRemainiing: {
        flex: 1,
        paddingHorizontal: 15,
        position: 'relative'
    },
    title: {
        fontFamily: "InterBold", 
        fontSize: 15,
        position: "relative"
    },
});

export default CardSuivieFils;