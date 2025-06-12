import React, {useState} from 'react';
import { View, Text,Keyboard, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather, Ionicons, Octicons, SimpleLineIcons } from '@expo/vector-icons';
import {useAuth} from '../states/States';
import { useFonts } from 'expo-font';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../states/ThemeContext';
import { useHistoryStack } from '../states/HistoryContext';




const BottomNavbar = ({ state, descriptors, navigation, onTabChange }) => {
  const { theme } = useTheme()
  const { role } = useAuth()
  const { pushToHistory } = useHistoryStack();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const currentRoute = state?.routes[state.index]?.name;
  const { t } = useTranslation();


  React.useEffect(() => {
    if (onTabChange && currentRoute) {
      onTabChange(currentRoute);
    }
  }, [currentRoute]);

  


      React.useEffect(() => {
          const keyboardDidShowListener = Keyboard.addListener(
              'keyboardDidShow',
              () => {
                  setIsKeyboardVisible(true);
              }
          );
          const keyboardDidHideListener = Keyboard.addListener(
              'keyboardDidHide',
              () => {
                  setIsKeyboardVisible(false);
              }
          );
        
          return () => {
              keyboardDidHideListener.remove();
              keyboardDidShowListener.remove();
          };   
      }, []);
    
  


  
  const getIconColor = (routeName) => {
    if(theme === "light"){
      return currentRoute && (currentRoute === routeName || currentRoute.includes(routeName)) 
      ? 'rgb(18, 179, 149)' 
      : 'rgb(77, 77, 77)';
    }
    else{
      return currentRoute && (currentRoute === routeName || currentRoute.includes(routeName)) 
      ? 'rgb(18, 179, 149)' 
      : '#e3e3e3';
    }
  };

  const isCurrentRouteEqualToRemuneration = (routeName) => {
    return currentRoute && (currentRoute === routeName || currentRoute.includes(routeName));
  };
  
  const getIconColor2 = (routeName) => {
    if(theme === "light"){
      return currentRoute && (currentRoute === routeName || currentRoute.includes(routeName)) 
      ? 'rgb(1, 29, 24)' 
      : 'rgb(77, 77, 77)';
    }
    else{
      return currentRoute && (currentRoute === routeName || currentRoute.includes(routeName)) 
      ? 'rgb(18, 179, 149)' 
      : '#e3e3e3';
    }
  };
   

  
  return (
    <>
    {
      !isKeyboardVisible && 

        <View style={
          isCurrentRouteEqualToRemuneration('Remuneration') ? styles.navbarXXX : theme === "light" ? styles.navbar : styles.navbarDark
        }>
          <TouchableOpacity
            style={styles.buttonNavigation}
            onPress={() =>{
              pushToHistory("Actualite");
              navigation.navigate('Actualite');
            }}
          >
            <Octicons
              name="home"
              size={20}
              color={isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor('Actualite')} 
            />
            <Text style={[styles.link, { color: isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor2('Actualite') }]}>{t("actualityTitle1")}</Text>
          </TouchableOpacity>
    
          <TouchableOpacity
            style={styles.buttonNavigation}
            onPress={() =>{
              if(role === "etudiant"){
                pushToHistory("Planning");
                navigation.navigate('Planning');
              }
              else if(role === "intervenant"){
                pushToHistory("PlanningInterv");
                navigation.navigate('PlanningInterv');
              }
              else{
                pushToHistory("PlanningTuteur");
                navigation.navigate('PlanningTuteur');
              }
            }}
          >
            <Octicons
              name="calendar"
              size={20}
              color={ isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor('Planning')} 
            />
            <Text style={[styles.link, { color: isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor2('Planning') }]}>Planning</Text>
          </TouchableOpacity>
    
          {
            role && 
            <>
            {
              role === "etudiant" ? 
              <TouchableOpacity
                style={styles.buttonNavigation}
                onPress={() =>{
                  pushToHistory("Parcours");
                  navigation.navigate('Parcours');
                }}
              >
                <Octicons
                    name="mortar-board"
                    size={20}
                    color={ isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor('Parcours')} 
                  />
                <Text style={[styles.link, {  color: isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor2('Parcours') }]}>{t("ParcoursTtile")}</Text>
              </TouchableOpacity>
              :
              role === "intervenant" ?
              <TouchableOpacity
                style={styles.buttonNavigation}
                onPress={() =>{
                  pushToHistory("Classes");
                  navigation.navigate('Classes');
                }}
              >
                <Octicons
                    name="briefcase"
                    size={20}
                    color={isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor('Classes')} 
                  />
                <Text style={[styles.link, {  color: isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor2('Classes') }]}>{t("classesTTITITI")}</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity
                style={styles.buttonNavigation}
                onPress={() =>{
                  pushToHistory("SuivieFils");
                  navigation.navigate('SuivieFils');
                }}
              >       
                <Octicons          
                    name="people"
                    size={20}
                    color={isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor('SuivieFils')} 
                  />
                <Text style={[styles.link, {  color: isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor2('SuivieFils') }]}>{t("suiviefils2")}</Text>
              </TouchableOpacity>
            }
            </>
          }       
         
          <TouchableOpacity
            style={styles.buttonNavigation}
            onPress={() =>{
              pushToHistory("Activity");
              navigation.navigate('Activity');
            }}
          >
              <Octicons
                name="bell"
                size={20}
                color={isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor('Activity')} 
              />
              {/* <View style={{ backgroundColor : theme === "light" ? "#15B99B" : "rgb(14, 147, 123)", height : 18,  width : 18, alignItems : "center", justifyContent : "center", borderRadius : 30, position : "absolute", right : "25%", top : 5, zIndex : 9 }} >
                <Text style={{ fontFamily : "InterBold", fontSize : 11, color : "white", marginTop : -1.4, }} >
                  4
                </Text>
              </View> */}
            <Text style={[styles.link, {  color: isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor2('Activity') }]}>{t("rappelsTitle2")}</Text>
          </TouchableOpacity>
    
          
    
          <TouchableOpacity
            style={styles.buttonNavigation}
            onPress={() =>{
              pushToHistory("Profile");
              navigation.navigate('Profile');
            }}
          >
            <Octicons
                name="person"
                size={20}
                color={ isCurrentRouteEqualToRemuneration('Remuneration') ? "white" :getIconColor('Profile')} 
              />
            <Text style={[styles.link, { color: isCurrentRouteEqualToRemuneration('Remuneration') ? "white" : getIconColor2('Profile') }]}>{t("profileTitle1")}</Text>
          </TouchableOpacity>





        </View>
    }
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    height: 66,
    width : "100%", 
    alignItems: 'center',
    shadowColor:"rgb(0, 0, 0)", 
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 5,
  },
  navbarDark: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgb(28, 28, 28)',
    height: 66,
    width : "100%", 
    alignItems: 'center',
  },
  navbarXXX : {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgb(5, 49, 40)',
    borderTopColor : "rgb(13, 79, 66)",
    borderWidth : 1, 
    height: 66,
    width : "100%", 
    alignItems: 'center',
  },
  link: {
    fontSize: 9,
    fontFamily : "Inter", 
    marginTop: 4,
  },
  buttonNavigation: {
    height: '100%',
    width: '20%',
    position : "relative",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(BottomNavbar);