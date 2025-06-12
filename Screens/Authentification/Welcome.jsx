import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image, 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import {  useFonts } from 'expo-font';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


export default function Welcome() {

  const navigation = useNavigation();

    
   const [fontsLoaded] = useFonts({
      'JomoFont': require('../../fonts/Jomolhari-Regular.ttf'),
      'GrotestY': require('../../fonts/Inter-VariableFont_opsz,wght.ttf'), 
      'GrotestX' : require('../../fonts2/HankenGrotesk-Bold.ttf'),
      'InterMedium' : require('../../fonts2/SFPRODISPLAYMEDIUM.ttf')
    });

              
    if (!fontsLoaded) {
      return null;
    }

  return (
    <>

      <Animated.View style={{ flex: 1, opacity: 1 }}>
        <ImageBackground
          source={require('../../assets/gradientWithStudent.png')}
          style={styles.background}
        >
          <View style={styles.overlay}>
            <View style={styles.backgroundLoogogooo}>
                <Image
                  style={styles.imageLogoHaut}
                  source={require('../../assets/universiapolis_logo.png')}
                />
            </View>



             
              <View style={styles.lastContainer2}>
                <Text style={styles.title}>Votre université,</Text>
                <Text style={styles.title}>dans votre poche.</Text>
                <Text style={styles.subtitle}>
                    D’un seul clic, consultez votre emploi du temps, vos notifications et vos documents importants.
                </Text>
              </View>

              <View style={styles.lastContainer}>
                <TouchableOpacity 
                  style={styles.button}
                  onPress={()=>{
                    navigation.navigate('Login')
                  }}
                >
                  <Text style={styles.buttonText}>
                    Accéder à mon espace
                  </Text>
                  <FontAwesome6
                    name='chevron-right'
                    size={16}
                    color="white" 
                    style={{
                        marginTop : 1.67
                    }}
                  />
                </TouchableOpacity>
              </View> 
            
           
          </View>
        </ImageBackground>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: screenWidth,
    height: screenHeight + 150,
    backgroundColor: "#fff",
  },
  overlay: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    paddingTop: 0,
    justifyContent: 'center',
  },
  backgroundLoogogooo: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    left: 20,
    right : 20,
  },
  imageLogoHaut: {
    width: 144,
    resizeMode: 'contain',
    aspectRatio: 1,
  },
  imageCenter : {
    width: "90%",
    margin : "auto",
    resizeMode: 'contain',
    aspectRatio: 1,
  },
  title: {
    fontFamily: 'GrotestX',
    fontSize: 40,
    letterSpacing : -0.5,
    color: 'rgb(32, 32, 32)',
    lineHeight : 40,
    textAlign : "center",
  },
  subtitle: {
    fontFamily: 'GrotestY',
    fontSize: 15,
    color: '#141414',
    textAlign : "center",
    paddingLeft: 3,
    marginBottom: 0,
    marginTop : 15, 

  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'GrotestX',
    fontSize: 15,
    color: "#545454",
    marginBottom: 12,
  },
  required: {
    color: '#078871',
    fontWeight: "bold"
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 100,
    height: 55,
    paddingHorizontal: 25,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    fontFamily: 'GrotestY',
  },
  lastContainer: {
    position: "absolute",
    bottom: 30,
    left: 20, 
    right : 20
  },
   lastContainer2: {
    position: "absolute",
    bottom: 115,
    left: 20, 
    right : 20
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#15B99B",
    borderRadius: 90,
    height: 55,
    marginTop: 10,
    width : "100%",
    zIndex : 1, 
  },
  
  buttonText: {
    color: "white",
    fontFamily: "InterMedium",
    fontSize: 16,
    marginRight: 10,
  },
  signupText: {
    fontFamily: 'GrotestY',
    fontSize: 13.5,
    color: '#141414',
    textAlign: 'center',
    marginTop: 15,
  },
  signupLink: {
    color:"rgb(6, 116, 95)",
    textDecorationLine : "underline"
  },
  centeredView: {
    position: "absolute",
    top: 0, 
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)", 
    justifyContent: "center",
    alignItems: "center",
  },
  centeredViewX: {
    position: "absolute",
    top: 0, 
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 14,
    textAlign: "center",
    color: "#000",
  },
  btnModel: {
    borderRadius: 11,
    padding: 10,
  },
  buttonClose: {
    backgroundColor: "#15B99B",
  },
  textStyle: {
    color: "white"
  },
  buttonloading: {
    backgroundColor: "#15B99B",
    borderRadius: 11,
    height: 53,
    marginTop: 20,
  },
  passwordContainer: {
    position: "relative"
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: 16
  },
  passwordForgotInput  : {
    fontSize: 13,
    paddingRight : 5, 
    fontFamily: 'GrotestY',
    color : "#078871",
    textDecorationLine : "underline"
  },

  passwordForgotContainer : {
    alignItems: "flex-end",
    height: "auto",
    width : "100%", 
  }, 

  buttonForgotPassword : {
    height : 40,
    width : 240,
    alignItems : "flex-end"  
  },
  inputPassword: {
    fontSize: 15,
    fontFamily : "GrotestX",
    color: "#545454",
    marginBottom: 12,
  },
  input2: {
    backgroundColor: '#fff',
    borderRadius: 100,
    height: 55,
    paddingRight: 40,
    paddingLeft: 25,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    width: "100%",
  }, 
  roleButton: {
    backgroundColor: "#15B99B",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: 150,
    alignItems: "center",
  },
  roleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  darkOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex : 9999999999999, 
  },
  modalView222 : {
    borderRadius: 12,
    padding: 20,
    width: 320,
    alignItems: "center",
    zIndex : 9999999999999, 
    paddingBottom: 0,
    elevation: 5,
    overflow: "hidden",
  },

  modalTextTitlte: {
    textAlign: "center",
    fontSize: 17,
    marginBottom: 10,
    letterSpacing: 0.15,
    fontFamily: "GrotestX",
    paddingLeft: 3,
    paddingRight: 3,
  },
  modalText2: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Inter",
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection : "column"
  },

});