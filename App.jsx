 import React, {useEffect, useRef, useState} from 'react';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import { StatusBar, TouchableOpacity, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './states/States';
import { ThemeProvider } from './states/ThemeContext';
import { LanguageProvider } from './states/LanguageContext';
import Actualite from './Screens/SHARED/Actualite';
import Solde from "./Screens/Etudiant/Solde";
import PlanningEtud from './Screens/Etudiant/Planning';
import PlanningInterv from './Screens/Intervenant/Planning';
import PlanningTuteur from './Screens/Tuteur/Planning';
import Activity from './Screens/SHARED/Activity';
import Parcours from './Screens/SHARED/Parcours';
import Classes from './Screens/Intervenant/Classes';
import SplashScreen from './Screens/SplashScreen';
import Matieres from './Screens/Intervenant/Matieres';
import Login from './Screens/Authentification/Login';
import SoldeTutor from "./Screens/Tuteur/Solde";
import ChooseProfile from './Screens/Authentification/ChooseProfile';
import InscriptionIntervenant from './Screens/Authentification/InscriptionIntervenant';
import InscriptionEtudiant from './Screens/Authentification/InscriptionEtudiant';
import InscriptionTuteur from './Screens/Authentification/InscriptionTuteur';
import InscriptionFuturEtudiant from './Screens/Authentification/InscriptionFuturEtudiant';
import AttestationRequest from './Screens/SHARED/AttestationRequest';
import Profile from './Screens/SHARED/Profile';
import BottomNavbar from './Components/BottomNavbar';
import Sidebar from './Components/Sidebar';
import ClassDetails from './Screens/Intervenant/ClassDetails'
import AssiduiteSingle from "./Screens/Intervenant/AssiduiteSingle";
import ChoixCreneauxIntervenant from './Screens/Intervenant/ChoixCreneauxIntervenant';
import CreneauxIntervenant from "./Screens/Intervenant/CreneauxIntervenant";
import ModalChoixFiliere from "./Screens/Etudiant/ChoisirFiliere"
import { CopilotProvider } from 'react-native-copilot';
import { I18nextProvider, useTranslation } from "react-i18next";
import Rattrapage from './Screens/Etudiant/Rattrapge';
import i18n from "./i18n";
import SingleActualite from './Screens/SHARED/SingleActualite';
import RevisionNote from './Screens/Etudiant/RevisionNote';
import { useFonts } from 'expo-font';
import { Octicons } from '@expo/vector-icons';
import { useTheme } from "./states/ThemeContext";
import ProfileStudent from './Screens/SHARED/ProfileStudent';
import ProfileStudent2 from './Screens/Intervenant/ProfileStudent2';
import { HistoryProvider } from "./states/HistoryContext";
import SaisieNote from './Screens/Intervenant/SaisieNote';
import Remuneration from './Screens/Intervenant/Remuneration';
import Paiement from "./Screens/Etudiant/Paiement";
import PaiementTutor from "./Screens/Tuteur/Paiement";
import GetPremium from "./Screens/SHARED/GetPremium";
import SuivieFils from "./Screens/Tuteur/SuivieFils";
import SingleSuivieFils from "./Screens/Tuteur/SingleSuivieFils";
import Welcome from "./Screens/Authentification/Welcome";



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const customTooltipStyle = {color : '#15B99B',   borderRadius: 10,  padding: 10, };







export default function App() {

  const [fontsLoaded] = useFonts({
    'JomoFont': require('./fonts/Jomolhari-Regular.ttf'),
    'Inter': require('./fonts2/SFPRODISPLAYREGULAR.ttf'), 
    'InterBold' : require('./fonts2/SFPRODISPLAYBOLD.ttf'),
    'InterMedium' : require('./fonts2/SFPRODISPLAYMEDIUM.ttf')
  });

  if (!fontsLoaded) {return null;}
  
  
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <HistoryProvider>
            <CopilotProvider tooltipStyle={customTooltipStyle} >
              <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.8)" barStyle="light-content" />
              <MainNavigator />
            </CopilotProvider>
          </HistoryProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}



const MainNavigator = () => {

  const { isLoading, isAuthenticated } = useAuth();

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer >
        <Stack.Navigator key={isAuthenticated ? "auth" : "guest"} screenOptions={{ headerShown: false }}>
          {isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : (
            <>
              {!isAuthenticated ? (
                <>
                  <Stack.Screen name="Welcome" component={Welcome} />
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="ChooseProfile" component={ChooseProfile} />
                  <Stack.Screen name="InscriptionEtudiant" component={InscriptionEtudiant} />
                  <Stack.Screen name="InscriptionTuteur" component={InscriptionTuteur} />
                  <Stack.Screen name="InscriptionIntervenant" component={InscriptionIntervenant} />
                  <Stack.Screen name="InscriptionFuturEtudiant" component={InscriptionFuturEtudiant} />
                </>
              ) : (
                <Stack.Screen name="Authenticated" component={AuthenticatedRoutes} />
              )}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
};



const AuthenticatedRoutes = React.memo(({ navigation }) => {
  const sidebarRef = useRef();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState('Actualite');
 
  useEffect(() => {
    console.log("Current Tab Route:", currentTab);
  }, [currentTab]);

  return (
    <>
      <Sidebar ref={sidebarRef} navigation={navigation} theme={theme} />
      
      {
        (
              currentTab.toLowerCase() !== "singleactualite" 
          &&  currentTab.toLowerCase() !== "saisienote"
          &&  currentTab.toLowerCase() !== "remuneration" 
          &&  currentTab.toLocaleLowerCase() !== "assiduitesingle" 
          &&  currentTab.toLocaleLowerCase() !== "singlestudent" 
          &&  currentTab.toLocaleLowerCase() !== "classdetails"
          &&  currentTab.toLocaleLowerCase() !== "singlestudent2" 
          &&  currentTab.toLocaleLowerCase() !== "singlesuiviefils" 
          &&  currentTab.toLocaleLowerCase() !== "getpremium"
        ) 
        &&
        <View 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 89,
            alignItems : "flex-end",
            width : "100%",
            position : "relative",
            width : "100%",
            backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' 
          }}
        >
          <Text style={[
            {
              fontFamily : "InterBold", 
              fontSize : 19, 
              textAlign : "center", 
              marginBottom : 8
            }, 
            { color : theme === "light" ? "#141414" : "#E3E3E3"}
          ]}>
            {
              currentTab.toLowerCase() === "actualite" ? t("homePage") : 
              currentTab.toLocaleLowerCase() === "activity" ? t("rappelsTitle2") : 
              currentTab.toLocaleLowerCase() === "profile" ? t("profile6") : 
              currentTab.toLocaleLowerCase() === "planning" ? "Planning" : 
              currentTab.toLocaleLowerCase() === "modalchoixfiliere" ?t("choixFilier") : 
              currentTab.toLocaleLowerCase() === "attestationrequest" ? t("docsAndCertTtile1") : 
              currentTab.toLocaleLowerCase() === "parcours" ? t('parcoursTitlePage') : 
              currentTab.toLocaleLowerCase() === "revisionnote" ? t('reviewGrades') : 
              currentTab.toLocaleLowerCase() === "choixcreneauxintervenant" ? t('choixcreneauxintervenantTitle3') : 
              currentTab.toLocaleLowerCase() === "creneauxintervenant" ? t('choixcreneauxintervenantTitle2') : 
              currentTab.toLocaleLowerCase() === "classes" ? t('ClassesTtile') : 
              currentTab.toLocaleLowerCase() === "matieres" ? t('Matieres') : 
              currentTab.toLocaleLowerCase() === "planninginterv" ? "Planning" : 
              currentTab.toLocaleLowerCase() === "planningtuteur" ? t("PlanningTuteur") :
              currentTab.toLocaleLowerCase() === "assiduitesingle" ? t("AssiduiteSingle") : 
              currentTab.toLocaleLowerCase() === "paiement" ? t("paiementTitle") : 
              currentTab.toLocaleLowerCase() === "paiementtutor" ? t("paiementTitle") : 
              currentTab.toLocaleLowerCase() === "suiviefils" ? t("suiviefils") : 
              currentTab.toLocaleLowerCase() === "solde" ? t("soldeTitle") : 
              currentTab.toLocaleLowerCase() === "soldetutor" ? t("soldeTitle") : 
              currentTab.toLocaleLowerCase() === "singlesuiviefils" ? t("SingleSuivieFilsTitle") : 
              currentTab.toLocaleLowerCase() === "rattrapage" ? t('rattrapageTitlePage') : ""
            }
          </Text>
          <TouchableOpacity 
            onPress={() => sidebarRef.current.toggleSidebar()}
            style={[
                {
                  width : 50, 
                  height : 50, 
                  backgroundColor : "white", 
                  borderRadius : 70, 
                  alignItems : "center", 
                  justifyContent : "center", 
                  position : 'absolute', 
                  right : 15, 
                }, 
                { borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 },
                { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
                { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
                { backgroundColor : theme === "light" ?  "white" : "#282828"}, 
            ]} 
          >
            <Octicons name="three-bars" size={20}   color={theme === "light" ? "rgb(104, 104, 104)" : "#e3e3e3" }    />
          </TouchableOpacity>
        </View>
      }

      <Tab.Navigator
        tabBar={(props) => 
          <BottomNavbar 
            {...props}  
            onTabChange={(tabName) => setCurrentTab(tabName)} 
          />}
          screenOptions={{
            tabBarStyle: { backgroundColor: theme === "light" ? "#f2f2f7" : "#141414"  },
          }}
      >
        <Tab.Screen name="Actualite" component={Actualite} options={{ headerShown: false }} />
        <Tab.Screen name="Parcours" component={Parcours} options={{ headerShown: false }} />
        <Tab.Screen name="Planning" component={PlanningEtud} options={{ headerShown: false }} />
        <Tab.Screen name="PlanningInterv" component={PlanningInterv} options={{ headerShown: false }} />
        <Tab.Screen name="PlanningTuteur" component={PlanningTuteur} options={{ headerShown: false }} />
        <Tab.Screen name="Activity" component={Activity} options={{ headerShown: false }} />
        <Tab.Screen name="SingleActualite" component={SingleActualite} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Tab.Screen name="AttestationRequest" component={AttestationRequest} options={{ headerShown: false }} />
        <Tab.Screen name="ModalChoixFiliere" component={ModalChoixFiliere} options={{ headerShown: false }} />
        <Tab.Screen name="Rattrapage" component={Rattrapage} options={{ headerShown: false }} />
        <Tab.Screen name="RevisionNote" component={RevisionNote} options={{ headerShown: false }} />
        <Tab.Screen name="ChoixCreneauxIntervenant" component={ChoixCreneauxIntervenant} options={{ headerShown: false }} />
        <Tab.Screen name="CreneauxIntervenant" component={CreneauxIntervenant} options={{ headerShown: false }} />
        <Tab.Screen name="Classes" component={Classes} options={{ headerShown: false }} />
        <Tab.Screen name="Matieres" component={Matieres} options={{ headerShown: false }} />
        <Tab.Screen name="GetPremium" component={GetPremium} options={{ headerShown: false }} />
        <Tab.Screen name="Solde" component={Solde} options={{ headerShown: false }} />
        <Tab.Screen name="SoldeTutor" component={SoldeTutor} options={{ headerShown: false }} />
        <Tab.Screen name="SuivieFils" component={SuivieFils} options={{ headerShown: false }} />
        <Tab.Screen name="Paiement" component={Paiement} options={{ headerShown: false }} />
        <Tab.Screen name="PaiementTutor" component={PaiementTutor} options={{ headerShown: false }} />
        <Tab.Screen 
          name="AssiduiteSingle" 
          options={{ headerShown: false }}
        >
          {(props) => <AssiduiteSingle {...props} sidebarRef={sidebarRef} />}
        </Tab.Screen>
        <Tab.Screen 
          name="SingleStudent" 
          options={{ headerShown: false }}
        >
          {(props) => <ProfileStudent {...props} sidebarRef={sidebarRef} />}
        </Tab.Screen>
        <Tab.Screen 
          name="SingleStudent2" 
          options={{ headerShown: false }}
        >
          {(props) => <ProfileStudent2 {...props} sidebarRef={sidebarRef} />}
        </Tab.Screen>
        <Tab.Screen 
          name="ClassDetails" 
          options={{ headerShown: false }}
        >
          {(props) => <ClassDetails {...props} sidebarRef={sidebarRef} />}
        </Tab.Screen>
        <Tab.Screen 
          name="SaisieNote" 
          options={{ headerShown: false }}
        >
          {(props) => <SaisieNote {...props} sidebarRef={sidebarRef} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Remuneration" 
          options={{ headerShown: false }}
        >
          {(props) => <Remuneration {...props} sidebarRef={sidebarRef} />}
        </Tab.Screen>
        <Tab.Screen 
          name="SingleSuivieFils" 
          options={{ headerShown: false }}
        >
          {(props) => <SingleSuivieFils {...props} sidebarRef={sidebarRef} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
});