import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    BackHandler,
    Alert,
} from 'react-native';
import SkeletonCard from '../../Components/SkeletonCard';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../i18n";  
import { useAuth } from '../../states/States';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import TimelineComp from "../../Components/TimelineComp"
import { useTheme } from '../../states/ThemeContext';
import ModalChoixFiliere from '../../Components/ModalChoixFiliere';
import { useHistoryStack } from '../../states/HistoryContext';
import axios from 'axios';
import ENDPOINT_URL from '../../environments/ENDPOINT_URL';



const Parcours = () => {
 
  
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setloading] = useState(true);
    const [isInscriptionOuverte, setisInscriptionOuverte] = useState(false);

 
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


    
  const fetchParcoursData = async () => {
    try {
      setloading(true);

      let Etd_Id = await AsyncStorage.getItem('Etd_Id');

      if(Etd_Id){
        const response = await axios.get(`${ENDPOINT_URL}/api/Etudiant/getEtudiant/${Etd_Id}`);
        if(response.data){
          console.warn(response.data)

          if(!response.data.Cycles || (response.data.Cycles && response.data.Cycles.length === 0)){
            setData([]);
          }
          else{
            setData(response.data.Cycles);
          }
          setloading(false);
        } 
        else{
          setData([]);
          setloading(false);
        }
      }
      else{
        setData([]);
        setloading(false);
        Alert.alert("Oups, une erreur est survenue!")
      }

    } catch (error) {
      setData([]);
      console.error("Failed to fetch parcours data:", error);
    } finally {
      setloading(false);
    }
  };      


  
    useEffect(()=>{
        fetchParcoursData();
    }, []);



    useFocusEffect(
      useCallback(() => {
        setisInscriptionOuverte(false);
      }, [])
    );
       

 
    
    return (        
      <View style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }, {paddingTop : loading ? 30 : 20}]}>
             
             <ModalChoixFiliere 
                modalVisible={isInscriptionOuverte}
                setModalVisible={setisInscriptionOuverte}
                theme={theme}
            />


              {
                loading || !data  ? (
                  <>
                    {[...Array(3)].map((_, index) => (
                      <SkeletonCard key={index} theme={theme} />
                    ))}
                  </>
                ) : (
                <>
                  {
                    data && data.length === 0 ? (
                      <View style={{ height : "100%", width : "100%", alignItems : "center", justifyContent : "center" }} >
                        <Text style={{color : theme === "light" ? "gray" : "gray"}} >Aucune information disponible</Text>
                      </View>
                    ) : (
                      <TimelineComp initialData={data} theme={theme} />
                    )
                  }
                </>
              )
            }
        </View>
    );
};

export default Parcours;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 85,
        zIndex : 99999,
        top: 25,
        alignItems : "center",
        position : "relative",
        width : "100%", 
        marginBottom : 20 
    },

    header2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems : "flex-end",
        height : 85, 
        paddingBottom : 17, 
        marginLeft  : 3,
        marginRight : 3, 
    },


    searchInput : {
        flex : 1, 
        height : 50, 
        backgroundColor : "white", 
        borderRadius : 70, 
        marginRight : 15,
        borderColor : "#EFEFEF", 
        borderWidth : 1, 
        shadowColor:"rgb(188, 188, 188)", 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        position : "relative",
        alignItems : "center", 
        flexDirection : "row", 
        overflow : "hidden"
    },  
    searchX7 : {
        height : 50, 
        width : 50,
        alignItems : "center", 
        justifyContent : "center"
    }, 
    inputText1 : {
        height : 50, 
        width : 300, 
        fontSize : 12, 
        paddingRight : 50, 
        color:"#141414", 
        fontFamily : "Inter"
    }, 
    searchSubmitButton : {    
        width : 50, 
        height : 50, 
        backgroundColor : "white", 
        borderRadius : 70, 
        borderColor : "#EFEFEF", 
        borderWidth : 1, 
        shadowColor:"rgb(188, 188, 188)", 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        alignItems : "center", 
        justifyContent : "center"
    },
    
    imageUserIcon : {
        height : 50, 
        width : 50, 
        objectFit : "cover", 
        borderRadius : 50, 

    }, 
    buttonimageUserIcon : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        right: 3, 
        borderWidth : 1, 
        borderRadius : 50, 
        borderColor :"rgb(230, 230, 230)"
    }, 
    buttonimageUserIcon2 : {
        width : 50, 
        zIndex : 9999, 
        height : 50, 
        backgroundColor : "white", 
        borderRadius : 70, 
        borderColor : "#EFEFEF", 
        borderWidth : 1, 
        shadowColor:"rgb(188, 188, 188)", 
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.07,
        shadowRadius: 20,
        elevation: 5,
        alignItems : "center", 
        justifyContent : "center", 
        position : 'absolute', 
        right : 0
    }, 
    headerText : {
        fontFamily : "JomoFont", 
        fontSize : 22, 
        textAlign : "center", 
    },
    insider: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#15B99B",
        borderRadius: 90,
        height: 55,
        width: 200,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    buttonchangeLnaguges: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#15B99B",
        borderRadius: 90,
        height: 55,
        marginTop: 20,
        width: 200,
        marginBottom: 40,
    },
    tutorialButton: {
        marginTop: 30,
        backgroundColor: "#f39c12",
        borderRadius: 90,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        width: 200,
    },
    textBtton: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    },
    
    skeletonContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skeletonTextContainer: {
        flex: 1,
        marginRight: 16,
    },
    skeletonImageContainer: {
        width: 90,
        height: 90,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
    },
    skeletonLine: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
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
    skeletonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },

    skeletonLineShort: {
        width: '40%',
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 6,
    },
    skeletonHighlight: {
        width: '12%',
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 6,
    },
  
    skeletonHighlight2: {
      width: '20%',
      height: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 6,
  },skeletonLine2: {
    width: '35%',
    height: 10,
    backgroundColor: '#e0e0e0',    
    borderRadius: 6,
  },
    skeletonLabel1: {
      width: '17%',
      height: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 6,        
  },
  
  skeletonLabel2: {
    width: '13%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,        
  },
  skeletonLabel3: {
    width: '44%',    
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,        
  },
  skeletonLabel4: {
    width: '34%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,        
  },
  skeletonLabel5: {
    width: '38%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,        
  },
  
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
noResultsText: {
    fontSize: 13,
    color: 'gray',
    fontFamily : "Inter"
},
yearContainer: {
    marginBottom: 20,
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
  semesterHeader: {
    marginBottom: 10,
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
  headerCycle : {
    width : "100%", 
    height : "auto",
    paddingVertical : 10,  
    marginTop : 5
  },   
  headerCycleText : {
    fontFamily : "InterBold", 
    fontSize : 14
  },
  headerCycleText2 : {
    fontFamily : "Inter", 
    fontSize : 14
  }, 
  headerCycleText1 : {
    fontFamily : "InterBold", 
    fontSize : 14
  }, 
});
 