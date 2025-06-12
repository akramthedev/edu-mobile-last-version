import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Feather, Ionicons, Octicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Modal, Animated, View, SectionList, Text, TouchableOpacity,ActivityIndicator,  TouchableWithoutFeedback, FlatList, Image, StyleSheet, ScrollView, TextInput, Dimensions, LayoutAnimation, UIManager, Platform, BackHandler  } from 'react-native';

const { height: windowHeight } = Dimensions.get('window');

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const TimelineCompForTutor = React.memo(({ initialData, theme }) => {

  const [moduleClicked, setModuleClicked] = useState(null);
  const [currentYearInfo, setCurrentYearInfo] = useState({
    title: '',
    annee: '',
    filiere: ''
  });
  const [yearHeaderLayouts, setYearHeaderLayouts] = useState([]);
  const [expandedSemesters, setExpandedSemesters] = useState({});
  const [isModuleClicked, setisModuleClicked] = useState(false);
  const [matiereActivated, setmatiereActivated] = useState(1);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const first = initialData[0];
      setCurrentYearInfo({
        title: first.year,
        annee: first.annee,
        filiere: first.title
      });
    }
  }, [initialData]);



  const slideAnim = useRef(new Animated.Value(windowHeight)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [isModuleClicked]);


  const closeModal = () => {
    overlayOpacity.setValue(0); 
    setisModuleClicked(false);
    setModuleClicked(null);
    setmatiereActivated(1);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: windowHeight,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 50, 
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(windowHeight);
    });
  };

  const openModule = (module) => {
    overlayOpacity.setValue(1);
    setModuleClicked(module);   
    setisModuleClicked(true);
  };

 

  useEffect(() => {
    if (yearHeaderLayouts.length === initialData.length) {
      handleScroll({ nativeEvent: { contentOffset: { y: 0 } } });
    }
  }, [yearHeaderLayouts]);


 
 


  const handleYearLayout = (sectionIndex) => (event) => {
    const { y } = event.nativeEvent.layout;
    setYearHeaderLayouts((prev) => {
      const newLayouts = [...prev];
      newLayouts[sectionIndex] = y;
      return newLayouts;
    });
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    let currentSectionIndex = 0;
    for (let i = 0; i < yearHeaderLayouts.length; i++) {
      if (offsetY >= yearHeaderLayouts[i]) {
        currentSectionIndex = i;
      } else {
        break;
      }
    }
    if (initialData[currentSectionIndex]) {
      const section = initialData[currentSectionIndex];
      if (currentYearInfo.title !== section.year || currentYearInfo.annee !== section.annee) {
        requestAnimationFrame(() => {
          setCurrentYearInfo({
            title: section.year,
            annee: section.annee,
            filiere: section.title
          });
        });
      }
    }
  };

  const toggleSemester = (sectionIndex, semesterIndex) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSemesters(prev => ({
      ...prev,
      [`${sectionIndex}-${semesterIndex}`]: !prev[`${sectionIndex}-${semesterIndex}`]
    }));
  };

  const children = [];
  const stickyHeaderIndices = [];

  initialData.forEach((section, sectionIndex) => {
    children.push(
      <View 
        key={`year-${sectionIndex}`} 
        style={styles.yearContainer} 
        onLayout={handleYearLayout(sectionIndex)}
      >
      </View>
    );

    section.semesters.forEach((semester, semesterIndex) => {
      const isExpanded = expandedSemesters[`${sectionIndex}-${semesterIndex}`];
      children.push(
        <TouchableOpacity
          key={`semester-${sectionIndex}-${semesterIndex}`}
          style={[styles.stickySemester, {backgroundColor : theme === "light" ? "#f2f2f7" : "#141414"}, 
            {
              borderBottomColor : theme === "light" ? "rgb(206, 206, 206)" : "rgb(102, 102, 102)"
            }
          ]}
          onPress={() => toggleSemester(sectionIndex, semesterIndex)}
        >
            {
              isExpanded ? 
              <Octicons  size={18} name='chevron-down' color={semester.isValidated === true ? "rgb(0, 186, 112)" : semester.isValidated === false ? "#E70303" :  theme === "light" ?  "#4d4d4d" : "#E3E3E3"} style={{position : "absolute", left : 2 ,top : 14, zIndex : 99999 }} />
              :
              <Octicons  size={18} name="chevron-right" color={semester.isValidated === true ? "rgb(0, 186, 112)" : semester.isValidated === false ? "#E70303" :  theme === "light" ?  "#4d4d4d" : "#E3E3E3"} style={{position : "absolute", left : 2 ,top : 14, zIndex : 99999}} />
            }          
          <Text style={semester.isValidated === true ? styles.semesterTitle : semester.isValidated === false ? styles.semesterTitle2 : theme === "light" ? styles.semesterTitle2980 : styles.semesterTitle298099Dark}>
            {semester.semester} : {semester.isValidated === true ? 'Validé' : semester.isValidated === false ? 'Non Validé' : ""}
          </Text>
          <Text style={semester.isValidated === true ? styles.semesterTitle666 : semester.isValidated === false ? styles.semesterTitle6662 :  theme === "light" ?  styles.semesterTitle666299 : styles.semesterTitle666299Dark}>
            {semester.note === null ? "N/A" : <>{semester.note} / 20</>}
          </Text>
        </TouchableOpacity>
      );
      stickyHeaderIndices.push(children.length - 1);

      if (isExpanded) {
        semester.modules.forEach((module, moduleIndex) => {
          children.push(
            <TouchableOpacity
              key={`module-${sectionIndex}-${semesterIndex}-${moduleIndex}`}
              activeOpacity={0.4}
              onPress={() => {openModule(module)}}
              style={[theme === "light" ? styles.moduleContainer : styles.moduleContainerDark ]}
            >
              <Text style={[styles.moduleTitle666, {color : theme === "light" ? "rgb(29, 29, 29)" : "rgb(183, 183, 183)"}]}>
                {module.title}
              </Text>
              <View style={styles.containerRowX}>
                <Text style={styles.moduleDescription}>Statut de validation : </Text>
                <Text style={module.isPassed === null ? styles.moduleTitleNotEvenPassed : module.isPassed === false ? styles.moduleTitleRed : styles.moduleTitle}>
                  {module.isPassed === false ? "Non validé" : module.isPassed === true ? "Validé" : "N/A"}
                </Text>
              </View>
              <View style={styles.containerRowX}>
                <Text style={styles.moduleDescription}>Moyenne générale : </Text>
                <Text style={module.isPassed === null ? styles.moduleTitleNotEvenPassed : module.isPassed === false ? styles.moduleTitleRed : styles.moduleTitle}>
                  {module.note === null ? "N/A" : module.note+" / 20"}
                </Text>
              </View>
              <View style={styles.containerRowX2}>
                <Text style={styles.VoirPlusDetails} >
                  Voir détails
                </Text>
              </View>
            </TouchableOpacity>
          );
        });
      }
    });
  });
  return (
    <View style={styles.container}>
      <View style={styles.fixedYearHeader}>
        <Text style={[styles.yearTitle
          ,{backgroundColor : theme === "light" ? "rgb(242, 242, 247)" : "#141414"}
          ,{color : theme === "light" ? "rgb(40, 40, 40)" : "rgb(0, 186, 112)"}
        ]}>
          Année universitaire : {currentYearInfo.title} / <Text style={[styles.yearTitle78,{backgroundColor : theme === "light" ? "rgb(242, 242, 247)" : "#141414"},{color : theme === "light" ? "rgb(35, 35, 35)" : "#E3E3E3"}]}>{currentYearInfo.annee}</Text>
        </Text>
        <Text style={[styles.headerCycleText1 ,{color : theme === "light" ? "rgb(40, 40, 40)" : "rgb(0, 186, 112)"}]}>
          Filière : <Text style={[styles.yearTitle78,{backgroundColor : theme === "light" ? "rgb(242, 242, 247)" : "#141414"},{color : theme === "light" ? "#141414" : "#E3E3E3"}]}>{currentYearInfo.filiere}</Text>
        </Text>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={20}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={stickyHeaderIndices}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        {children}
      </ScrollView>


      {isModuleClicked && (
        <Modal animationType="none" transparent>
          <View style={styles.bottomView}>
            <Animated.View style={[styles.darkOverlay, { opacity: overlayOpacity }]} />
            <Animated.View 
              style={[styles.modalView, {backgroundColor : theme === "light" ? "white" : "rgb(31, 31, 31)"}, {borderTopColor : theme === "light" ? "white" : "rgb(85, 85, 85)"}, { transform: [{ translateY: slideAnim }] }]}
            >
              {moduleClicked ? (
                <>
                <TouchableOpacity onPress={closeModal} style={[styles.headerModalXk, {borderColor : theme === "light" ? "rgb(224, 224, 224)" : "rgb(99, 99, 99)"}]}>
                  <Text style={[styles.modalTextTitle, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                    {moduleClicked.title}
                  </Text>
                  <Octicons name="x" size={20} color={theme === "light" ? "#141414" : "#E3E3E3"} />
                </TouchableOpacity>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
                  <View style={styles.nsdfwononsf} >
                    <View style={styles.containerONe77} >
                      <View style={styles.roundItem77} />
                      <Text style={[styles.roundItem77Text,{color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        Validé
                      </Text>
                    </View>
                    <View style={styles.containerONe77} >
                      <View style={styles.roundItem77Gray} />
                      <Text style={[styles.roundItem77Text,{color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        Non Validé
                      </Text>
                    </View>
                    <View style={styles.containerONe77} >
                      <View style={styles.roundItem77Gray} />
                      <Text style={[styles.roundItem77Text,{color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        En cours
                      </Text>
                    </View>
                  </View>

                  <View style={styles.nsdfwononsf202} >
                    <TouchableOpacity onPress={()=>{setmatiereActivated(1)}} style={[
                      styles.containerONe7790, 
                      { backgroundColor : matiereActivated === 1 ? "#15B99B" : theme === "light" ? "#F2F2F2" : "rgb(49, 49, 49)"}, 
                      {borderColor : theme === "light" ? "rgb(208, 208, 208)" : "rgb(79, 79, 79)"}
                    ]} >
                      <Text style={[
                        styles.roundItem77Text, 
                        {color : matiereActivated === 1 ? "white" : theme === "light" ? "#141414" : "#E3E3E3"}
                      ]} >
                        Analyse I
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{setmatiereActivated(2)}} style={[
                      styles.containerONe7790, 
                      { backgroundColor : matiereActivated === 2 ? "#15B99B" : theme === "light" ? "#F2F2F2" : "rgb(49, 49, 49)"}, 
                      {borderColor : theme === "light" ? "rgb(208, 208, 208)" : "rgb(79, 79, 79)"}
                    ]} >
                      <Text style={[
                        styles.roundItem77Text, 
                        {color : matiereActivated === 2 ? "white" : theme === "light" ? "#141414" : "#E3E3E3"}
                      ]} >
                      Analyse II
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{setmatiereActivated(3)}} style={[
                      styles.containerONe7790, 
                      { backgroundColor : matiereActivated === 3 ? "#15B99B" : theme === "light" ? "#F2F2F2" : "rgb(49, 49, 49)"}, 
                      {borderColor : theme === "light" ? "rgb(208, 208, 208)" : "rgb(79, 79, 79)"}
                    ]} >
                      <Text style={[
                        styles.roundItem77Text, 
                        {color : matiereActivated === 3 ? "white" : theme === "light" ? "#141414" : "#E3E3E3"}
                      ]} >
                      Analyse III
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.nsdfwononsf2} >
                      <Text style={[styles.roundItem77Text2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        Matière séléctionnée : 
                      </Text>
                      <Text style={[styles.roundItem77Text, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        Analyse { matiereActivated === 1 ? "I" : matiereActivated === 2 ? "II" : "III" }
                      </Text>
                  </View>
                  <View style={styles.nsdfwononsf2} >
                      <Text style={[styles.roundItem77Text2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        Professeur affecté : 
                      </Text>
                      <Text style={[styles.roundItem77Text, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        Mme.Moro Jasmine
                      </Text>
                  </View>
                  <View style={styles.nsdfwononsf3} >
                      <View  style={styles.nsdfwononsf212}>
                        <Text style={[styles.roundItem77Text2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                          Incidents : 
                        </Text>
                        <Text style={styles.roundItem77Text1} >
                          3
                        </Text>
                      </View>
                      <View style={styles.nsdfwononsf212}>
                        <Text style={[styles.roundItem77Text2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                          Absences non justifiées : 
                        </Text>
                        <Text style={styles.roundItem77Text2Red} >
                          5
                        </Text>
                      </View>
                      <View style={styles.nsdfwononsf212}>
                        <Text style={[styles.roundItem77Text2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                          Absences justifiées : 
                        </Text>
                        <Text style={styles.roundItem77Text3} >
                          10
                        </Text>
                      </View>
                  </View>
                  <View style={styles.nsdfwononsf2999} >
                    <View style={styles.nsdfwononsf212}>
                      <Text style={[styles.roundItem77Text2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        Détails des notes :  
                      </Text>
                      <Text style={styles.roundItem77Text} >
                        &nbsp;
                      </Text>
                    </View>

                    <View style={styles.nsdfwononsf212} /> 

                    <View style={styles.nsdfwononsf212212}>
                      <Text style={[styles.roundItem77Text22222, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                      Contrôles continus :   
                      </Text>
                      <Text style={[
                        styles.roundItem77Text9à00, 
                        {
                          color : "red"
                        }
                      ]} >
                        8 / 20
                      </Text>
                    </View>

                    <View style={styles.nsdfwononsf212212}>
                      <Text style={[styles.roundItem77Text22222, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                      Travaux pratiques :   
                      </Text>
                      <Text style={[
                        styles.roundItem77Text9à00, 
                        {
                          color : "red"
                        }
                      ]} >
                        4 / 20
                      </Text>
                    </View>

                    <View style={styles.nsdfwononsf212212}>
                      <Text style={[styles.roundItem77Text22222, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                      Examens écrits :   
                      </Text>
                      <Text style={[
                        styles.roundItem77Text9à00, 
                        {
                          color : "#15a35c"
                        }
                      ]} >
                        17 / 20
                      </Text>
                    </View>



                    <View style={styles.nsdfwononsf212212}>
                      <Text style={[styles.roundItem77Text22222, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                      Examens oraux :   
                      </Text>
                      <Text style={[
                        styles.roundItem77Text9à00, 
                        {
                          color : "#15a35c"
                        }
                      ]} >
                        13 / 20
                      </Text>
                    </View>



                    <View style={[
                      styles.nsdfwononsf212212
                    ]}>
                      <Text style={[styles.roundItem77Text22222, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                      Projets de module :   
                      </Text>
                      <Text style={[
                        styles.roundItem77Text9à00, 
                        {
                          color : "#15a35c"
                        }
                      ]} >
                        10 / 20
                      </Text>
                    </View>

                    <View style={[
                      styles.nsdfwononsf212212, 
                      {
                        borderTopColor : "rgb(246, 246, 246)", 
                        borderTopWidth : 1, 
                        marginTop : 15, 
                        paddingTop : 15, 
                        paddingBottom : 0
                      }
                    ]}>
                      <Text style={[styles.roundItem77Text22222, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                      Moyenne :   
                      </Text>
                      <Text style={[
                        styles.roundItem77Text9à00, 
                        {
                          color : "#15a35c"
                        }
                      ]} >
                        10.4 / 20
                      </Text>
                    </View>


                    <View style={styles.nsdfwononsf212212}>
                      <Text style={[styles.roundItem77Text22222, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                      Mention :   
                      </Text>
                      <Text style={[
                        styles.roundItem77Text9à00, 
                        {
                          fontFamily : "Inter"
                        }, 
                        {color : theme === "light" ? "#141414" : "#E3E3E3"}
                      ]} >
                        Passable
                      </Text>
                    </View>




                  </View>
                  
                </ScrollView>
                </>
              ) : (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#000" />
                </View>
              )}
            </Animated.View>
          </View>
        </Modal>
      )}


        
    </View>
  );
})

const styles = StyleSheet.create({  
  centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  container : {
      flex : 1, 
      flexGrow : 1,
      paddingBottom : 0, 
  },
   
  headerModalXk: {
      width: '100%',
      height: 60,
      borderBottomWidth: 1,
      justifyContent: 'center',
      position: 'relative',
      flexDirection : "row", 
      alignItems : "center", 
      justifyContent : "space-between"
  },
  yearContainer: {
      marginBottom : 0, 
  },
  
  yearTitle: {
      fontSize: 14.3,
      fontFamily: "InterBold",
      zIndex: 2,
  },

  yearTitle78: {
    fontSize: 14.3,
    fontFamily: "Inter",
    zIndex: 2,
  },

  headerCycle : {
      width : "100%", 
      height : "auto",
    },   
    headerCycleText : {
      color : "rgb(40, 40, 40)",
      textAlign : "left",
  },
    headerCycleText2 : {
      color : "rgb(40, 40, 40)",
      textAlign : "left",
      fontFamily : "Inter", 
      fontSize : 14.3
    }, 
    headerCycleText1 : {
      textAlign : "left",
      fontFamily : "InterBold", 
      fontSize : 14.3, 
    }, 

    stickyHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#f2f2f7',
      zIndex: 10,
      paddingHorizontal: 0,
      height: 0,
      borderBottomWidth: 1,
      borderColor: '#eaeaea',
      justifyContent: 'center' 
  },
  containerPlUniv : {
      backgroundColor : "#f2f2f7",
      flexDirection : "row", 
      alignItems : "center", 
      zIndex : 99999, 
      width : "100%", 
      justifyContent : "space-between"
  },
  containerPlUniv2222 : {
    backgroundColor : "#f2f2f7",
    flexDirection : "row", 
    alignItems : "center", 
    zIndex : 99999, 
    width : "100%", 
    marginTop : 10,  
    justifyContent : "space-between"
},
  containerPlUnivButton : {
      backgroundColor : "#15B99B", 
      paddingVertical : 5, 
      paddingHorizontal :12, 
      borderRadius : 4, 
      flexDirection : "row", 
      alignItems : "center", justifyContent : "center"
  }, 
  containerPlUnivText : {
      fontFamily : "Inter", 
      letterSpacing : -0.3, 
      fontSize : 14, 
      color : "white", 
  }, 
  noPaddingButMargin: {
      paddingBottom: 5,
      marginBottom : 40  
  },
  barXXx : {
      backgroundColor : "rgb(34, 197, 167)", 
      height : 2.6, 
      width : 30, 
      top : 8.4, 
      left : -20, 
      zIndex : 200, 
      position : "absolute"
  },
  containerSemester : {
      position : "relative", 
      paddingRight : 15, 
      alignItems : "center", 
      flexDirection : "row",
      paddingTop : 0, 
  },
  
  moduleContainer : {
      borderWidth : 1, 
      borderColor : "rgb(236, 236, 236)", 
      backgroundColor : "white", 
      marginBottom : 16, 
      padding : 10,
      paddingLeft : 15, 
      paddingRight : 15,  
      borderRadius : 12, 
      shadowColor:"rgb(188, 188, 188)", 
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.07,
      shadowRadius: 20,
      elevation: 5,
      position : "relative"
  },
  moduleContainerDark : {
    borderWidth : 1, 
    backgroundColor : "#282828", 
    marginBottom : 16, 
    padding : 10,
    paddingLeft : 15, 
    paddingRight : 15,  
    borderRadius : 12, 
    elevation: 5,
    position : "relative"
}, 
  semesterTitle : {
      fontFamily : "InterBold", 
      fontSize : 14.3, 
      zIndex : 1, 
      color : "rgb(0, 186, 112)", 
      height : "93%",
      position : "relative",
      paddingTop : 13, 
      paddingLeft : 20,
    }, 
  semesterTitle2 : {
    fontFamily : "InterBold", 
    fontSize : 14.3,  
    zIndex : 1, 
    color : "#E70303",
    height : "93%",
    position : "relative",
    paddingTop : 13, 
    marginLeft : 5, 
    paddingLeft : 20,
  }, 
  semesterTitle2980 : {
    fontFamily : "InterBold", 
    position : "relative",
    fontSize : 14.3,  
    zIndex : 1, 
    marginLeft : 5, 
    paddingTop : 13, 
    height : "93%",
    color : "#4d4d4d",
    paddingLeft : 20,
  }, 
  semesterTitle298099Dark : {
    fontFamily : "InterBold", 
    position : "relative",
    fontSize : 14.3,  
    zIndex : 1, 
    marginLeft : 5, 
    paddingTop : 13, 
    height : "93%",
    color : "#E3E3E3",
    paddingLeft : 20,
  },
  semesterTitle666 : {
    fontFamily : "InterBold", 
    fontSize : 14.3, 
    zIndex : 1, 
    position : "absolute", 
    right : 0, 
    top : 12, 
    marginLeft : -1, 
    color : "rgb(0, 186, 112)", 
  }, 
  semesterTitle6662 : {
    fontFamily : "InterBold", 
    position : "absolute", 
    right : 0, 
    marginLeft : -1, 
    fontSize : 14.3, 
    top : 12, 
    zIndex : 1, 
    color : "#E70303"
  }, 
  semesterTitle666299 : {
    fontFamily : "InterBold", 
    position : "absolute", 
    right : 0, 
    marginLeft : -1, 
    fontSize : 14.3, 
    top : 12, 
    zIndex : 1, 
    color : "rgb(77, 77, 77)"
  },
  semesterTitle666299Dark : {
    fontFamily : "InterBold", 
    position : "absolute", 
    right : 0, 
    marginLeft : -1, 
    fontSize : 14.3, 
    top : 12, 
    zIndex : 1, 
    color : "#E3E3E3"
  },
  moduleTitle666 : {
    fontFamily : "InterBold", 
    fontSize : 15, 
    alignItems : "center",
  },
  moduleTitle : {
      fontFamily : "InterBold", 
      fontSize : 13, 
       
      alignItems : "center",
      color : "rgb(0, 186, 112)", 
  },
  moduleTitleRed : {
    fontFamily : "InterBold", 
      fontSize : 13, 
       
      alignItems : "center",
      color : "#E70303",   
  },
  moduleTitleNotEvenPassed : {
    fontFamily : "InterBold", 
    fontSize : 13, 
    alignItems : "center",
    color : "gray",   
  },
  moduleDescription : {
      fontFamily : "Inter", 
      fontSize : 13, 
      color : "gray",
  },
  TagsContainer : {
      flexDirection: "row",
      flexWrap : "wrap"
  },

  SingletagContainer : {
      flexDirection: "row",
      marginRight : 5, 
      borderRadius : 7,
      marginTop: 3, 
    },
    tag: {
      fontFamily : "InterBold", 
      fontSize: 12,
      paddingVertical: 1,
      paddingHorizontal: 5,
      borderRadius: 8,
      margin: 0
    },
    voirPlus : {
      position: "absolute", 
      bottom : 18, 
      right : 20
    }, 
    voirPlusText : {
      fontFamily : "Inter", 
      fontSize : 13, 
      color : "gray", 
      textDecorationLine : "underline"
    }, 
    moduleTitleContainer : {
      alignItems:  "center", 
      flexDirection : "row", 
      marginBottom : 5
    }, 
    semesterTitleContainer: {
      alignItems:  "center", 
      flexDirection : "row", 
      position : "relative", 
      width : "100%",
      height : 42,  
    }, 
    SingletagContainer2 : {
      flexDirection: "row",
      marginRight : 5, 
      borderRadius : 7,
      marginTop: 5, 
      position : "absolute", 
      left : 85, 
    },
    







  bottomView : {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  darkOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex : 9999999999
  },
  modalView: {
      borderRadius: 20,
      width: '100%',
      height: '85%',
      paddingHorizontal: 16,
      paddingTop: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderTopWidth : 1, 
      position : "relative", 
      paddingBottom : 5, 
      zIndex : 9999999999, 
      borderBottomEndRadius : 0, 
      borderBottomStartRadius : 0
  },
  header: {
      width: '100%',
      height: 45,
      borderBottomWidth: 1,
      borderColor: 'rgb(234, 234, 234)',
      justifyContent: 'center',
      position: 'relative',
  },
  modalTextTitle: {
      fontSize: 17,
      fontFamily: 'InterBold',
      letterSpacing: 0.15,
  },
  closeButton: {
      position: 'absolute',
      right: 0,
      top: 12,
  },
  scrollView: {
      flex: 1,
  },
  BarTimDot : {
    height : 2, 
    backgroundColor : "rgb(220, 220, 220)", 
    width : 20, 
    position : "absolute", 
    top : 20
  }, 

  stickySemester: {
    height : 55, 
    width : "100%", 
    paddingLeft : 3.5,
    marginBottom : 10, 
    flexDirection : "row", 
    alignItems : "flex-end", 
    justifyContent : "space-between", 
    zIndex : 99, 
    marginBottom : 10, 
    position : "relative", 
    borderBottomWidth : 1, 
  },
  
  stickyHeaderContainer: {
    backgroundColor: 'red',  
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  containerRowX : {
    width : "100%", 
    height : "auto", 
    flexDirection : 'row', 
    justifyContent : "space-between", 
  },
  containerRowX2 : {
    width : "100%", 
    height : "auto", 
    flexDirection : 'row', 
    justifyContent : "flex-end", 
    marginTop : 3.4, 
    marginBottom : 5, 
  },
  VoirPlusDetails : {
    textDecorationLine : "underline", 
    color : "gray", 
    fontSize : 12, 
    fontFamily : "Inter", 
    width : "auto", 
  },
  loaderContainer : {
    height : "100%",
    width : "100%", 
    alignItems : "center", 
    justifyContent : "center"
  },
  nsdfwononsf : {
    width : "100%", 
    alignItems : "center", 
    justifyContent : "flex-start", 
    flexDirection : "row",
    height : "auto", 
    paddingVertical : 15, 
    borderBottomWidth: 1,
      borderColor: 'rgb(224, 224, 224)',
  }, 
  nsdfwononsf2 : {
    width : "100%", 
    alignItems : "center", 
    justifyContent : "space-between", 
    flexDirection : "row",
    height : "auto", 
    paddingVertical : 15, 
    borderBottomWidth: 1,
      borderColor: 'rgb(224, 224, 224)',
  },
  nsdfwononsf2999 : {
    width : "100%", 
    alignItems : "center", 
    justifyContent : "space-between", 
    flexDirection : "column",
    height : "auto", 
    paddingVertical : 15, 
  },
  nsdfwononsf212 : {
    width : "100%", 
    alignItems : "center", 
    justifyContent : "space-between", 
    flexDirection : "row",
    height : "auto", 
  },
  nsdfwononsf212212 : {
    width : "100%", 
    alignItems : "center", 
    justifyContent : "space-between", 
    flexDirection : "row",
    height : "auto", 
    marginTop : 5, 
  },
  nsdfwononsf3 : {
    width : "100%", 
    flexDirection : "column",
    height : "auto", 
    paddingVertical : 15, 
    borderBottomWidth: 1,
      borderColor: 'rgb(224, 224, 224)',
  }, 
  containerONe77:  {
    flexDirection : "row", 
    alignItems : "center", 
    justifyContent : "flex-start", 
    marginRight : 25,
  },
  containerONe7790 : {
    height : 'auto', 
    paddingVertical : 11,
    paddingHorizontal : 10, 
    width : "30%",
    borderRadius : 5,
    borderWidth : 1,
    alignItems : "center", 
    justifyContent : "center"
  },

  nsdfwononsf202 : {
    flexDirection : "row", 
    alignItems : "center", 
    justifyContent : "space-between", 
    height : "auto", 
    paddingVertical : 15, 
    borderBottomWidth: 1,
      borderColor: 'rgb(224, 224, 224)',
  }, 
  roundItem77 : {
    height : 12.5, 
    width : 12.5, 
    borderRadius : 50, 
    backgroundColor : "#15B99B", 
    marginRight : 7, 
  }, 
  roundItem77Gray : {
    height : 13, 
    width : 13, 
    borderRadius : 50, 
    backgroundColor : "rgb(212, 212, 212)", 
    marginRight : 7, 
  }, 
  
  roundItem77Text : {
    fontFamily : "Inter", 
    fontSize : 14
  },
  roundItem77Text1 : {
    fontFamily : "InterBold", 
    fontSize : 14,
    color : "rgb(232, 124, 0)"
  },
  roundItem77Text2Red: {
    fontFamily : "InterBold", 
    fontSize : 14,
    color : "rgb(227, 36, 23)"
  },
  roundItem77Text3 : {
    fontFamily : "InterBold", 
    fontSize : 14,
    color : "#15a35c"
  },

  roundItem77Text2 : {
    fontFamily : "InterBold", 
    fontSize : 14
  },

  roundItem77Text22222 : {
    fontFamily : "Inter", 
    fontSize : 14
  },
  roundItem77Text9à00 : {
    fontFamily : "InterBold", 
    fontSize : 13
  }

});

export default TimelineCompForTutor;