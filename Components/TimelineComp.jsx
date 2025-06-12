import React, { useState, useRef, useEffect } from 'react';
import { Octicons } from '@expo/vector-icons';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Platform,
  Modal
} from 'react-native';

const { height: windowHeight } = Dimensions.get('window');



const TimelineComp = React.memo(({ initialData, theme }) => {
  const [moduleClicked, setModuleClicked] = useState(null);
  const [isModuleClicked, setIsModuleClicked] = useState(false);
  const [currentYearInfo, setcurrentYearInfo] = useState({
    anneeUniversitaire : '2025-2026',
    diplome: 'Master',
    annee: '5ème année',
    programme : "Power BI",
    filiere: 'Management',
    option : 'Commercial', 
    mode : 'présentiel'
  });
  const [matiereActivated , setmatiereActivated ] = useState(1);

  const [currentHeaderInfo, setCurrentHeaderInfo] = useState({
    diplome: '',
    title: '',
    annee: '',
    year: '',
  });

  const [yearHeaderLayouts, setYearHeaderLayouts] = useState({});

  const [expandedDiplomaIndex, setExpandedDiplomaIndex] = useState(null);

  const [expandedYears, setExpandedYears] = useState({});

  const [expandedSemesters, setExpandedSemesters] = useState({});

  const slideAnim = useRef(new Animated.Value(windowHeight)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;

useEffect(() => {
    if (initialData.length > 0) {
      const firstDiploma = initialData[0];
      if (Array.isArray(firstDiploma.Niveaux) && firstDiploma.Niveaux.length > 0) {
        const firstYear = firstDiploma.Niveaux[0];
        setCurrentHeaderInfo({
          diplome: firstDiploma.Cycle_Intitule ?? 'N/A',
          title: firstYear.Niv_Intitule ?? 'N/A',
          annee: firstYear.Ann_Intitule ?? 'N/A',
        });
      } else {
        setCurrentHeaderInfo({
          diplome: firstDiploma.Cycle_Intitule ?? 'N/A',
          title: 'N/A',
          annee: 'N/A',
        });
      }
    } else {
      setCurrentHeaderInfo({ diplome: 'N/A', title: 'N/A', annee: 'N/A' });
    }
  }, [initialData]);




  useEffect(() => {
    if (isModuleClicked) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [isModuleClicked, slideAnim]);

  const openModule = (module) => {
    overlayOpacity.setValue(1);
    setModuleClicked(module);
    setIsModuleClicked(true);
  };

  const closeModal = () => {
    overlayOpacity.setValue(0);
    setIsModuleClicked(false);
    setModuleClicked(null);
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

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    const entries = Object.entries(yearHeaderLayouts)
      .map(([key, y]) => ({ key, y }))
      .sort((a, b) => a.y - b.y);

    let currentKey = null;
    for (let i = 0; i < entries.length; i++) {
      if (offsetY >= entries[i].y - 1) {
        currentKey = entries[i].key;
      } else {
        break;
      }
    }
    if (currentKey) {
      const parts = currentKey.split('-');
      const diplomaIndex = parseInt(parts[0], 10);
      const yearIndex = parseInt(parts[1], 10);
      const diploma = initialData[diplomaIndex];
      if (diploma && Array.isArray(diploma.Niveaux) && diploma.Niveaux[yearIndex]) {
        const yearObj = diploma.Niveaux[yearIndex];
        const newDiplome = diploma.Cycle_Intitule ?? '';
        const newTitle = yearObj.Niv_Intitule ?? '';
        const newAnnee = yearObj.Ann_Intitule ?? '';
        if (
          currentHeaderInfo.diplome !== newDiplome ||
          currentHeaderInfo.title !== newTitle ||
          currentHeaderInfo.annee !== newAnnee
        ) {
          requestAnimationFrame(() => {
            setCurrentHeaderInfo({
              diplome: newDiplome,
              title: newTitle,
              annee: newAnnee,
            });
          });
        }
      }
    }
  };


  const handleYearLayout = (diplomaIndex, yearIndex) => (event) => {
    const { y } = event.nativeEvent.layout;
    const key = `${diplomaIndex}-${yearIndex}`;
    setYearHeaderLayouts((prev) => {
      if (prev[key] !== y) {
        return { ...prev, [key]: y };
      }
      return prev;
    });
  };

  const toggleDiploma = (diplomaIndex) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setmatiereActivated(1);
    setExpandedDiplomaIndex((prevIndex) => {
      if (prevIndex === diplomaIndex) {
        setExpandedYears((prevY) => {
          const copy = { ...prevY };
          delete copy[diplomaIndex];
          return copy;
        });
        setExpandedSemesters((prevS) => {
          const copy = { ...prevS };
          Object.keys(copy).forEach((semKey) => {
            if (semKey.startsWith(`${diplomaIndex}-`)) {
              delete copy[semKey];
            }
          });
          return copy;
        });
        return null;
      } else {
        if (prevIndex !== null && prevIndex !== undefined) {
          setExpandedYears((prevY) => {
            const copy = { ...prevY };
            delete copy[prevIndex];
            return copy;
          });
          setExpandedSemesters((prevS) => {
            const copy = { ...prevS };
            Object.keys(copy).forEach((semKey) => {
              if (semKey.startsWith(`${prevIndex}-`)) {
                delete copy[semKey];
              }
            });
            return copy;
          });
        }
        return diplomaIndex;
      }
    });
  };

  const toggleYear = (diplomaIndex, yearIndex) => {
    setmatiereActivated(1);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedYears((prev) => {
      const prevOpen = prev[diplomaIndex];
      const newState = { ...prev };
      if (prevOpen === yearIndex) {

        delete newState[diplomaIndex];
        setExpandedSemesters((prevS) => {
          const copy = { ...prevS };
          Object.keys(copy).forEach((semKey) => {
            if (semKey.startsWith(`${diplomaIndex}-${yearIndex}-`)) {
              delete copy[semKey];
            }
          });
          return copy;
        });
      } else {
        newState[diplomaIndex] = yearIndex;
        if (prevOpen !== undefined && prevOpen !== null) {
          setExpandedSemesters((prevS) => {
            const copy = { ...prevS };
            Object.keys(copy).forEach((semKey) => {
              if (semKey.startsWith(`${diplomaIndex}-${prevOpen}-`)) {
                delete copy[semKey];
              }
            });
            return copy;
          });
        }
      }
      return newState;
    });
  };



  const toggleSemester = (diplomaIndex, yearIndex, semesterIndex) => {
    setmatiereActivated(1);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const key = `${diplomaIndex}-${yearIndex}-${semesterIndex}`;
    setExpandedSemesters((prev) => {
      const newState = { ...prev };
      if (newState[key]) {
        delete newState[key];
      } else {
        newState[key] = true;
      }
      return newState;
    });
  };

  const children = [];
  const stickyHeaderIndices = [];









  initialData.forEach((diploma, diplomaIndex) => {
    const isDiplomaExpanded = expandedDiplomaIndex === diplomaIndex;
    children.push(
      <TouchableOpacity
        key={`diploma-${diplomaIndex}`}
        onPress={() => toggleDiploma(diplomaIndex)}
        style={[
          styles.diplomeHeader,
          {
            // backgroundColor: theme === "light" ? "rgb(233, 233, 233)" : "yellow",
            borderWidth : 2, 
            borderColor : isDiplomaExpanded ? "#15B99B" : "transparent"
          },
        ]}
      >
        <View style={{
          width : 20, 
          height : 20,
          backgroundColor : "green"
        }} >
          {isDiplomaExpanded ? (
            <Octicons
              size={20}
              name="chevron-down"
              color={theme === "light" ? "#333" : "#ddd"}
            />
          ) : (
            <Octicons
              size={20}
              name="chevron-right"
              color={theme === "light" ? "#333" : "#ddd"}
            />
          )}
          </View>
          <Text
            style={[
              styles.diplomaHeaderText,
              {fontFamily : "InterMedium"},
              { color: theme === "light" ? "#000" : "#fff" },
            ]}
          >
            Diplôme&nbsp;:&nbsp;{diploma?.Cycle_Intitule ?? 'N/A'}
          </Text>
        {
          (diploma.InsCyclePer_Valide !== null && diploma.InsCyclePer_Valide === 1) ?
          <Octicons
            name="mortar-board"
            size={20}
            color="#15B99B"
            style={{
              position : "absolute", 
              right: 15, 
              top : 17
            }}
          /> 
          :
          <Octicons
            name="mortar-board"
            size={20}
            color={theme === "light" ? "rgb(146, 146, 146)" : "rgb(146, 146, 146)"}
            style={{
              position : "absolute", 
              right: 15, 
              top : 17
            }}
          /> 
        }
      </TouchableOpacity>
    );



    stickyHeaderIndices.push(children.length - 1);

    if (isDiplomaExpanded && Array.isArray(diploma.Niveaux)) {
      diploma.Niveaux.forEach((yearObj, yearIndex) => {
        const expandedYearIndexForDiploma = expandedYears[diplomaIndex];
        const isYearExpanded = expandedYearIndexForDiploma === yearIndex;

        children.push(
          <TouchableOpacity
            key={`year-${diplomaIndex}-${yearIndex}`}
            onLayout={handleYearLayout(diplomaIndex, yearIndex)}
            onPress={() => toggleYear(diplomaIndex, yearIndex)}
            style={[
              styles.yearHeaderContainer,
              {
                paddingLeft: 20,
                backgroundColor:
                  theme === "light" ? "rgb(220, 220, 220)" : "rgb(28, 28, 28)",
                 borderWidth : 2, 
                borderColor : isYearExpanded ? ( theme === "light" ? "rgb(21, 131, 110)" : "rgb(10, 79, 66)" ) : "transparent"
              },
            ]}
          >
            {isYearExpanded ? (
              <Octicons
                size={20}
                name="chevron-down"
                color={theme === "light" ? "#333" : "#ddd"}
                style={{ marginRight: 15, marginLeft: 15 }}
              />
            ) : (
              <Octicons
                size={20}
                name="chevron-right"
                color={theme === "light" ? "#333" : "#ddd"}
                style={{ marginRight: 15, marginLeft: 15 }}
              />
            )}
            <Text style={[ {fontFamily : "InterMedium"},styles.yearHeaderText, { color: theme === 'light' ? '#000' : '#fff' }]}>
              {yearObj.Niv_Intitule ?? 'N/A'} | {yearObj.Ann_Intitule ?? 'N/A'}
            </Text>
          </TouchableOpacity>
        );
        stickyHeaderIndices.push(children.length - 1);

        if (isYearExpanded && Array.isArray(yearObj.Semestres)) {

          yearObj.Semestres.forEach((semester, semesterIndex) => {
            const semKey = `${diplomaIndex}-${yearIndex}-${semesterIndex}`;
            const isSemExpanded = !!expandedSemesters[semKey];
            const semesterLabel = semester.Semestre || `${semesterIndex + 1}`;
            const validation = semester.EtudiantSemestre_Validation;
            const moyenne = semester.EtudiantSemestre_Moyenne;
            children.push(
              <TouchableOpacity
                key={`semester-${semKey}`}
                style={[
                  styles.containerSemester,
                  {
                    paddingLeft: 30,
                    backgroundColor:
                      theme === "light" ? "#f2f2f7" : "#141414",
                    borderBottomColor:
                      theme === "light"
                        ? "rgb(206, 206, 206)"
                        : "rgb(102, 102, 102)",
                  },
                ]}
                onPress={() =>
                  toggleSemester(diplomaIndex, yearIndex, semesterIndex)
                }
              >
                {isSemExpanded ? (
                  <Octicons
                    size={18}
                    name="chevron-down"
                    color={
                      validation === 1
                        ? "rgb(0, 186, 112)"
                        : validation === 0
                        ? "#E70303"
                        : theme === "light"
                        ? "#4d4d4d"
                        : "#E3E3E3"
                    }
                    style={{ marginRight: 3, marginLeft: 6.666 }}
                  />
                ) : (
                  <Octicons
                    size={18}
                    name="chevron-right"
                    color={
                      validation === 1
                        ? "rgb(0, 186, 112)"
                        : validation === 0
                        ? "#E70303"
                        : theme === "light"
                        ? "#4d4d4d"
                        : "#E3E3E3"
                    }
                    style={{ marginRight: 3, marginLeft: 6.666 }}
                  />
                )}
                <View
                  style={{
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={
                      validation === 1
                        ? styles.semesterTitle
                        : validation === 0
                        ? styles.semesterTitle2
                        : theme === "light"
                        ? styles.semesterTitle2980
                        : styles.semesterTitle298099Dark
                    }
                  >
                    Semestre {semesterLabel}
                    <Text
                      style={{
                        fontFamily: "Inter",
                        color: theme === "light" ? "rgb(66, 66, 66)" : "rgb(170, 170, 170)",
                        fontSize : 11
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;(Crédits validés : <>{semester?.CreditsValide ?? "N/A"}</>)
                    </Text>
                  </Text>
                </View>
                <Text
                  style={
                    validation === 1
                      ? styles.semesterTitle666
                      : validation === 0
                      ? styles.semesterTitle6662
                      : theme === "light"
                      ? styles.semesterTitle666299
                      : styles.semesterTitle666299Dark
                  }
                >
                  {moyenne === null ? "N/A" : `${moyenne}/20`}
                </Text>
              </TouchableOpacity>
            );
            stickyHeaderIndices.push(children.length - 1);

            if (isSemExpanded && Array.isArray(semester.Modules)) {

              semester.Modules.forEach((module, moduleIndex) => {
                const moduleKey =
                  module.Module_ID ||
                  module.Module_Id ||
                  `${diplomaIndex}-${yearIndex}-${semesterIndex}-${moduleIndex}`;
                children.push(
                  <TouchableOpacity
                    key={`module-${moduleKey}`}
                    onPress={() => {
                      openModule(module);
                       
                    }}
                    style={[
                      theme === "light"
                        ? styles.moduleContainer
                        : styles.moduleContainerDark,
                      { paddingLeft: 15 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.moduleTitle666,
                        {
                          color:
                            theme === "light"
                              ? "rgb(29, 29, 29)"
                              : "rgb(255, 255, 255)",
                        },
                      ]}
                    >
                      {module.Module_Intitule ?? 'Module'}{' '}
                    </Text>
                    
                    <View style={styles.containerRowX}>
                      <Text style={styles.moduleDescription}>
                        Code du module :{" "}
                      </Text>
                      <Text
                        style={
                         [
                           styles.textXOSFD03, 
                           {
                            color : theme === "light" ? "gray" : "gray"
                           }
                         ]
                        }
                      >
                        {module.Module_Code ? module.Module_Code : 'N/A'}
                      </Text>
                    </View>


                    
 


                    <View style={styles.containerRowX}>
                      <Text style={styles.moduleDescription}>
                       Nombre de crédits :{" "}
                      </Text>
                      <Text
                        style={
                         [
                           styles.textXOSFD03, 
                           {
                            color : theme === "light" ? "gray" : "gray"
                           }
                         ]
                        }
                      >
                        {
                          module.Credits ? module.Credits : "N/A"
                        }
                      </Text>
                    </View>
                    

                    <View style={styles.containerRowX}>
                      <Text style={styles.moduleDescription}>
                        Statut de validation :{" "}
                      </Text>
                      <Text
                        style={
                          module.MduValidation === null
                            ? styles.moduleTitleNotEvenPassed
                            : module.MduValidation === 0
                            ? styles.moduleTitleRed
                            : styles.moduleTitle
                        }
                      >
                        {module.MduValidation === 0
                          ? "Non validé"
                          : module.MduValidation === 1
                          ? "Validé"
                          : "N/A"}
                      </Text>
                    </View>
                    <View style={styles.containerRowX}>
                      <Text style={styles.moduleDescription}>
                        Moyenne générale :{" "}
                      </Text>
                      <Text
                        style={
                          module.MduValidation === null
                            ? styles.moduleTitleNotEvenPassed
                            : module.MduValidation === 0
                            ? styles.moduleTitleRed
                            : styles.moduleTitle
                        }
                      >
                        {module.MduMoyenne === null
                          ? "N/A"
                          : `${module.MduMoyenne} / 20`}
                      </Text>
                    </View>
                    <View style={styles.containerRowX2}>
                      <Text style={styles.VoirPlusDetails}>Voir détails</Text>
                    </View>
                  </TouchableOpacity>
                );
              });
            }
          });
        }
      });
    }
  });





























  



  return (
    <View style={styles.container}>
      <View style={styles.fixedYearHeader}>
        <Text style={[styles.yearTitle
          ,{backgroundColor : theme === "light" ? "rgb(242, 242, 247)" : "#141414"}
          ,{color : theme === "light" ? "rgb(40, 40, 40)" : "rgb(223, 223, 223)"}
        ]}>
          Année universitaire :&nbsp;
          <Text style={[styles.yearTitle78,{backgroundColor : theme === "light" ? "rgb(242, 242, 247)" : "#141414"},{color : theme === "light" ? "rgb(35, 35, 35)" : "#E3E3E3"}]}>
            {currentYearInfo.anneeUniversitaire}
          </Text>
        </Text>
        <Text style={[styles.headerCycleText1 ,{color : theme === "light" ? "rgb(40, 40, 40)" : "rgb(218, 218, 218)"}]}>
          Inscrit en&nbsp;
          <Text style={[styles.yearTitle78,{backgroundColor : theme === "light" ? "rgb(242, 242, 247)" : "#141414"},{color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
            {currentYearInfo.annee}
          </Text>
          , diplôme
          <Text style={[styles.yearTitle78,{backgroundColor : theme === "light" ? "rgb(242, 242, 247)" : "#141414"},{color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
            &nbsp;{currentYearInfo.diplome}
          </Text>
          , filière
          <Text style={[styles.yearTitle78,{backgroundColor : theme === "light" ? "rgb(242, 242, 247)" : "#141414"},{color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
            &nbsp;{currentYearInfo.filiere}
          </Text>
          &nbsp;du programme
          <Text style={[styles.yearTitle78,{backgroundColor : theme === "light" ? "rgb(242, 242, 247)" : "#141414"},{color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
            &nbsp;{currentYearInfo.programme}
          </Text>
          &nbsp;option&nbsp;
          <Text style={[styles.yearTitle78,{backgroundColor : theme === "light" ? "rgb(242, 242, 247)" : "#141414"},{color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
            {currentYearInfo.option}
          </Text>
          &nbsp; en mode&nbsp;
          <Text style={[styles.yearTitle78,{backgroundColor : theme === "light" ? "rgb(242, 242, 247)" : "#141414"},{color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
            {currentYearInfo.mode}
          </Text>
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
                    {moduleClicked.Module_Intitule ?? "N/A"}
                  </Text>
                  <Octicons name="x" size={20} color={theme === "light" ? "#141414" : "#E3E3E3"} />
                </TouchableOpacity>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
                  <View style={styles.nsdfwononsf} >
                    <View style={styles.containerONe77} >
                     
                      {
                        moduleClicked.MduValidation === 1 ?
                        <View style={styles.roundItem77} />  
                        :
                        <View style={styles.roundItem77Gray} />  
                      }
                      <Text style={[styles.roundItem77Text,{color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        Validé
                      </Text>
                    </View>
                    <View style={styles.containerONe77} >
                      {
                        moduleClicked.MduValidation === 0 ?
                        <View style={styles.roundItem77Red} />  
                        :
                        <View style={styles.roundItem77Gray} />  
                      }
                      <Text style={[styles.roundItem77Text,{color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        Non Validé
                      </Text>
                    </View>
                    <View style={styles.containerONe77} >
                      {
                        moduleClicked.MduValidation === null ?
                        <View style={styles.roundItem77NoColor} />  
                        :
                        <View style={styles.roundItem77Gray} />  
                      }
                      <Text style={[styles.roundItem77Text,{color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        En cours
                      </Text>
                    </View>
                  </View>


                  {
                    moduleClicked.Matieres.length !== 0 && 

                  <>

                  {/* <View style={styles.nsdfwononsf2} >
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
                  </View> */}

                  


                  <View style={styles.nsdfwononsf212099}>
                      <Text style={[styles.roundItem77Text2, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                        Nombre de matière : {moduleClicked?.Matieres?.length ?? 0 } 
                      </Text>
                      <Text style={styles.roundItem77Text} >
                        &nbsp;
                      </Text>
                  </View>

                    {
                      moduleClicked.Matieres.map((matiere, index)=>{
                        return(
                          <View key={index} style={[styles.nsdfwononsf2999, styles.nsdfwononsf29993489652, {borderColor : theme === "light" ? "gainsboro" : "rgb(221, 221, 221)"}]} >
                            <View style={styles.nsdfwononsf21299999}>
                              <Text style={[styles.roundItem77Text299999, {color : theme === "light" ? "#141414" : "#E3E3E3"}]} >
                                {matiere.Mat_Intitule ?? "N/A"} 
                              </Text>
                              <Text style={styles.roundItem77Text} >
                                &nbsp;
                              </Text>
                            </View>

                            <View style={styles.nsdfwononsf212} /> 

                            <View style={styles.nsdfwononsf212212}>
                              <Text style={[styles.roundItem77Text22222, {color : theme === "light" ? "#141414" : "rgb(192, 192, 192)"}]} >
                              Code de matière :  
                              </Text>
                              <Text style={[
                                styles.roundItem77Text9à00, 
                                {
                                  color : theme === "light" ? "#141414" : "rgb(192, 192, 192)"
                                }
                              ]} >
                               {matiere.Mat_Code ?? "N/A"}
                              </Text>
                            </View>


                            {/* <View style={styles.nsdfwononsf212212}>
                              <Text style={[styles.roundItem77Text22222, {color : theme === "light" ? "#141414" : "rgb(192, 192, 192)"}]} >
                                Intervenant :  
                              </Text>
                              <Text style={[
                                styles.roundItem77Text9à00, 
                                {
                                  color : theme === "light" ? "#141414" : "rgb(192, 192, 192)"
                                }
                              ]} >
                                {matiere?.IntervenantId ?? "N/A"}
                              </Text>
                            </View> */}

                           
                            <View style={styles.nsdfwononsf212212}>
                              <Text style={[styles.roundItem77Text22222, {color : theme === "light" ? "#141414" : "rgb(192, 192, 192)"}]} >
                                Note générale :  
                              </Text>
                              <Text style={[
                                styles.roundItem77Text9à00, 
                                {
                                  color : theme === "light" ? "#141414" : "rgb(192, 192, 192)"
                                }
                              ]} >
                               {matiere.Note ? matiere.Note+" / 100" : 'N/A'}
                              </Text>
                            </View>





                            {
                              (matiere?.Elements && matiere?.Elements.length !== 0) && (
                                <View style={{width : "100%"}} >
                                  <View style={[styles.nsdfwononsf212212, {marginBottom : 10}]}>
                                    <Text style={[styles.roundItem77Text22222, { color: theme === "light" ? "#141414" : "rgb(192, 192, 192)" }]}>
                                      Détails des éléments d’évaluation :
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      borderWidth: 1,
                                      borderColor: theme === "light" ? "#ccc" : "rgb(100, 100, 100)",
                                      borderRadius: 4,
                                      marginTop: 10,
                                      overflow: "hidden",
                                    }}
                                  >
                                    {/* Header */}
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        backgroundColor: theme === "light" ? "#f0f0f0" : "rgb(50, 50, 50)",
                                        borderBottomWidth: 1,
                                        borderBottomColor: theme === "light" ? "#ccc" : "rgb(80, 80, 80)",
                                      }}
                                    >
                                      <Text
                                        style={[
                                          styles.roundItem77Text22222,
                                          {
                                            flex: 1,                  
                                            fontFamily: "InterBold",
                                            fontSize: 13,
                                            paddingVertical: 10,
                                            paddingHorizontal: 12,
                                            borderRightWidth: 1,
                                            borderRightColor: theme === "light" ? "#ccc" : "rgb(80, 80, 80)",
                                            color: theme === "light" ? "#141414" : "rgb(192, 192, 192)",
                                          },
                                        ]}
                                      >
                                        Type d’évaluation
                                      </Text>
                                      <Text
                                        style={[
                                          styles.roundItem77Text22222,
                                          {
                                            width: 80,               
                                            fontFamily: "InterBold",
                                            fontSize: 13,
                                            textAlign: "center",
                                            paddingVertical: 10,
                                            paddingHorizontal: 12,
                                            borderRightWidth: 1,
                                            borderRightColor: theme === "light" ? "#ccc" : "rgb(80, 80, 80)",
                                            color: theme === "light" ? "#141414" : "rgb(192, 192, 192)",
                                          },
                                        ]}
                                      >
                                        Note
                                      </Text>
                                      <Text
                                        style={[
                                          styles.roundItem77Text22222,
                                          {
                                            width: 100,              
                                            fontFamily: "InterBold",
                                            fontSize: 13,
                                            textAlign: "center",
                                            paddingVertical: 10,
                                            paddingHorizontal: 12,
                                            color: theme === "light" ? "#141414" : "rgb(192, 192, 192)",
                                          },
                                        ]}
                                      >
                                        Pourcentage
                                      </Text>
                                    </View>

                                    {/* Rows */}
                                    {matiere.Elements.map((element, index) => (
                                      <View
                                        key={index}
                                        style={{
                                          flexDirection: "row",
                                          borderBottomWidth: index === matiere.Elements.length - 1 ? 0 : 1,
                                          borderBottomColor: theme === "light" ? "#ccc" : "rgb(60, 60, 60)",
                                          backgroundColor: theme === "light" ? "#fff" : "rgb(30, 30, 30)",
                                        }}
                                      >
                                        <Text
                                          style={[
                                            styles.roundItem77Text9à00,
                                            {
                                              flex: 1,                 
                                              paddingVertical: 10,
                                              paddingHorizontal: 12,
                                              borderRightWidth: 1,
                                              borderRightColor: theme === "light" ? "#ccc" : "rgb(60, 60, 60)",
                                              color: theme === "light" ? "#141414" : "rgb(192, 192, 192)",
                                            },
                                          ]}
                                        >
                                          {element?.EvalItem_Intitule
                                            ? element.EvalItem_Intitule.charAt(0).toUpperCase() + element.EvalItem_Intitule.slice(1).toLowerCase()
                                            : "N/A"}
                                        </Text>
                                        <Text
                                          style={[
                                            styles.roundItem77Text9à00,
                                            {
                                              width: 80,              
                                              textAlign: "center",
                                              paddingVertical: 10,
                                              paddingHorizontal: 12,
                                              borderRightWidth: 1,
                                              borderRightColor: theme === "light" ? "#ccc" : "rgb(60, 60, 60)",
                                              color: theme === "light" ? "#141414" : "rgb(192, 192, 192)",
                                            },
                                          ]}
                                        >
                                          {element?.Note ? `${element.Note} / 20` : "N/A"}
                                        </Text>
                                        <Text
                                          style={[
                                            styles.roundItem77Text9à00,
                                            {
                                              width: 100,             
                                              textAlign: "center",
                                              paddingVertical: 10,
                                              paddingHorizontal: 12,
                                              color: theme === "light" ? "#141414" : "rgb(192, 192, 192)",
                                            },
                                          ]}
                                        >
                                          {element?.Pourcentage ? `${element.Pourcentage} %` : "N/A"}
                                        </Text>
                                      </View>
                                    ))}
                                  </View>
                                </View>
                              )
                            }

                           

                         
                         

                          </View>
                        )
                      })
                    }
                  </>
                  }



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
      marginBottom : 2,
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
      marginBottom : 10, 
  },

  yearTitle78: {
    fontSize: 14.3,
    fontFamily: "InterMedium",
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
      fontFamily : "Inter", 
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
      paddingRight : 30, 
      alignItems : "center", 
      flexDirection : "row",
      paddingTop : 0, 
      marginBottom : 0,
      height : 63, 
  },

  yearHeaderContainer : {
      paddingRight : 30, 
      alignItems : "center", 
      flexDirection : "row",
      paddingTop : 15, 
      marginTop : 5, 
      paddingBottom : 17, 
      marginBottom : 10, 
      borderRadius : 7

  },
  
  
  moduleContainer : {
      borderWidth : 1, 
      borderColor : "rgb(236, 236, 236)", 
      backgroundColor : "white", 
      marginBottom : 16, 
      padding : 15  ,
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
    backgroundColor : "#282828", 
    marginBottom : 16, 
    padding : 15,
    paddingLeft : 15, 
    paddingRight : 15,  
    borderRadius : 12, 
    elevation: 5,
    position : "relative"
}, 
  semesterTitle : {
      fontFamily : "InterMedium", 
      fontSize : 14.3, 
      zIndex : 1, 
      color : "rgb(0, 186, 112)",
      position : "relative",
      paddingLeft : 10,
    }, 
  semesterTitle2 : {
    fontFamily : "InterMedium", 
    fontSize : 14.3,  
    zIndex : 1, 
    color : "#E70303",
    position : "relative",
    marginLeft :0, 
    paddingLeft : 10,
  }, 
  semesterTitle2980 : {
    fontFamily : "InterMedium", 
    position : "relative",
    fontSize : 14.3,  
    zIndex : 1, 
    marginLeft :0, 
     
    color : "#4d4d4d",
    paddingLeft : 10,
  }, 
  semesterTitle298099Dark : {
    fontFamily : "InterMedium", 
    position : "relative",
    fontSize : 14.3,  
    zIndex : 1, 
    marginLeft :0, 
     
    color : "#E3E3E3",
    paddingLeft : 10,
  },
  semesterTitle666 : {
    fontFamily : "InterMedium", 
    fontSize : 14.3, 
    zIndex : 1, 
    position : "absolute", 
    right : 0, 
    top : 22.4, 
    marginRight :6, 
    color : "rgb(0, 186, 112)", 
  }, 
  semesterTitle6662 : {
    fontFamily : "InterMedium", 
    position : "absolute", 
    right : 0, 
    marginRight :6, 
    fontSize : 14.3, 
    top : 22.4, 
    zIndex : 1, 
    color : "#E70303"
  }, 
  semesterTitle666299 : {
    fontFamily : "InterMedium", 
    position : "absolute", 
    right : 0, 
    marginRight :6, 
    fontSize : 14.3, 
    top : 22.4, 
    zIndex : 1, 
    color : "rgb(77, 77, 77)"
  },
  semesterTitle666299Dark : {
    fontFamily : "InterMedium", 
    position : "absolute", 
    right : 0, 
    marginRight :6, 
    fontSize : 14.3, 
    top : 22.4, 
    zIndex : 1, 
    color : "#E3E3E3"
  },
  moduleTitle666 : {
    fontFamily : "InterBold", 
    fontSize : 15, 
    alignItems : "center",
    marginBottom : 10
  },
  moduleTitle : {
      fontFamily : "Inter", 
      fontSize : 13, 
      alignItems : "center",
      color : "rgb(0, 186, 112)", 
  },
  moduleTitleRed : {
    fontFamily : "Inter", 
      fontSize : 13, 
       
      alignItems : "center",
      color : "#E70303",   
  },
  moduleTitleNotEvenPassed : {
    fontFamily : "Inter", 
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
    marginBottom : 6, 
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
    borderBottomWidth: 0.5,
      borderColor: 'rgb(224, 224, 224)',
  }, 
  nsdfwononsf2 : {
    width : "100%", 
    alignItems : "center", 
    justifyContent : "space-between", 
    flexDirection : "row",
    height : "auto", 
    paddingVertical : 15, 
    borderBottomWidth: 0.5,
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
  nsdfwononsf29993489652 : {
    borderBottomWidth : 1.19,
    paddingBottom : 15, 
    marginBottom : 15
  },
  nsdfwononsf212 : {
    width : "100%", 
    alignItems : "center", 
    justifyContent : "space-between", 
    flexDirection : "row",
    height : "auto", 
  },

  nsdfwononsf21299999 : {
     width : "100%", 
    alignItems : "center", 
    justifyContent : "space-between", 
    flexDirection : "row",
    height : "auto", 
    marginBottom : 15
  },

  nsdfwononsf212099 : {
    width : "100%", 
    alignItems : "center", 
    justifyContent : "space-between", 
    flexDirection : "row",
    height : "auto",
    marginTop :20 
  },
  nsdfwononsf212212 : {
    width : "100%", 
    alignItems : "center", 
    justifyContent : "space-between", 
    flexDirection : "row",
    height : "auto", 
    marginTop : 5, 
  },
  nsdfwononsf212212PaddingAdded : {
    paddingLeft : 20,
    marginTop : 10
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
    borderWidth : 0,
    alignItems : "center", 
    justifyContent : "center"
  },

  nsdfwononsf202 : {
    flexDirection : "row", 
    alignItems : "center", 
    justifyContent : "space-between", 
    height : "auto", 
    paddingVertical : 15, 
    borderBottomWidth: 0,
      borderColor: 'rgb(224, 224, 224)',
  }, 
  roundItem77 : {
    height : 12.5, 
    width : 12.5, 
    borderRadius : 50, 
    backgroundColor : "rgb(0, 186, 112)", 
    marginRight : 7, 
  }, 
  roundItem77Gray : {
    height : 13, 
    width : 13, 
    borderRadius : 50, 
    backgroundColor : "rgb(212, 212, 212)", 
    marginRight : 7, 
  }, 
  roundItem77Red : {
    height : 13, 
    width : 13, 
    borderRadius : 50, 
    backgroundColor : "#E70303", 
    marginRight : 7, 
  },
  roundItem77NoColor : {
    height : 13, 
    width : 13, 
    borderRadius : 50, 
    backgroundColor : "rgb(232, 124, 0)", 
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
    color : "#E70303"
  },
  roundItem77Text3 : {
    fontFamily : "InterBold", 
    fontSize : 14,
    color : "#15a35c"
  },

  roundItem77Text2 : {
    fontFamily : "Inter", 
    fontSize : 14
  },
  roundItem77Text299999: {
    fontFamily : "InterBold", 
    fontSize : 24
  },

  roundItem77Text22222 : {
    fontFamily : "Inter", 
    fontSize : 14
  },
  roundItem77Text9à00 : {
    fontFamily : "Inter", 
    fontSize : 14
  },
  fixedYearHeader : {
    marginBottom : 15, 
  }, 
  textXOSFD03 : {
    fontFamily : "Inter", 
    fontSize : 13
  }, 
  nsdfwononsf212212989 : {
    borderBottomWidth : 1
  }, 
  diplomaHeaderText : {
    fontSize : 15,
  } ,


  diplomeHeader : {

    backgroundColor : "red",
    flexDirection : "row",
    width : "100%",
    borderRadius : 7, 
    marginBottom : 15, 

  },


});

export default TimelineComp;