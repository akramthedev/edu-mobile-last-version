import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    BackHandler,
    ScrollView,
} from 'react-native';
import SkeletonCard from '../../Components/SkeletonCard';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../i18n";  
import { useAuth } from '../../states/States';
import { useCopilot } from "react-native-copilot";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import parcoursData from "../../fakeData/parcours";
import { useHistoryStack } from '../../states/HistoryContext';
import TimelineCompForTutor from '../../Components/TimelineCompForTutor';

const ParcoursFils = ({ item, theme }) => {

    const { 
        isCopilotActive, 
    } = useCopilot();    
    
    const { t } = useTranslation();
    const animation = useRef(new Animated.Value(0)).current;  
    const [data, setData] = useState(null);
    const [loading, setloading] = useState(true);
    const navigation = useNavigation();
    const { getPreviousScreen, popFromHistory } = useHistoryStack();
    
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



    

    useEffect(()=>{
        setloading(true);
        setData(parcoursData);
        setTimeout(()=>{
          setloading(false);
        }, 2000);
    }, []);






           


   return (        
      <View style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>
           
              {
                loading ? (
                  <>
                    {[...Array(3)].map((_, index) => (
                      <SkeletonCard key={index} theme={theme} />
                    ))}
                  </>
                ) : (
                <>
                  {
                    data && data.length === 0 ? (
                      <View>
                        <Text>Aucune donnée</Text>
                      </View>
                    ) : (
                      <TimelineCompForTutor initialData={parcoursData}  theme={theme}  />
                    )
                  }
                </>
              )
            }
        </View>
    );
  };
  
  

  
const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
    
    skeletonCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: 'rgb(188, 188, 188)',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
    },
     
 
  semesterContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  
  semesterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  modulesContainer: {
    marginTop: 10,
  },
  moduleItem: {
    backgroundColor: "#f1f3f4",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  moduleDesc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginVertical: 10,
  },
 
});
 

export default ParcoursFils;