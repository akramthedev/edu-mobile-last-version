import React, { useState, useEffect, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  StyleSheet,
  Alert,
  Text,
  Image, 
  View,
  TouchableOpacity,
  ScrollView,
  BackHandler, 
  Animated, 
  TextInput, 
  Keyboard
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../states/ThemeContext";
import { useNavigation } from '@react-navigation/native';
import { Feather, Octicons } from '@expo/vector-icons';
import { useHistoryStack } from '../../states/HistoryContext';

const formatExpiry = (text) => {
  const cleaned = text.replace(/\D+/g, '').slice(0, 4);  
  if (cleaned.length >= 3) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  }
  return cleaned;
};

const formatCardNumber = (text) => {
  const cleaned = text.replace(/\D+/g, '').slice(0, 16); 
  const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
  return formatted;
};



const unpaidFees = [
    {
      id: '1',
      title: 'Frais de dossier',
      amount: '1050 MAD',
      dueDate: '04/05/2025',
      tags: [
        { label: 'Impayé', type: 'error' },
      ]
    },
    {
      id: '2',
      title: "Frais de l'assurance médicale",
      amount: '300 MAD',
      dueDate: '04/05/2025',
      tags: [
        { label: 'Impayé', type: 'error' },
      ]
    }
];

const paidFees = [
    {
      id: '3',
      title: "Frais d'inscription",
      amount: '590 MAD',
      dueDate: '04/05/2025',
      tags: [
        { label: 'Payé', type: 'success' },
      ]
    },
    {
      id: '4',
      title: "Frais de librairie",
      amount: '950 MAD',
      dueDate: '04/05/2025',
      tags: [
        { label: 'Vérification en cours', type: 'pending' },
      ]
    }
];





const Paiement = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectionMode, setSelectionMode] = useState(false);
  const [DefaultPayement, setDefaultPayement] = useState("Online");
  const { getPreviousScreen, popFromHistory, pushToHistory } = useHistoryStack();
  const [selectedFees, setSelectedFees] = useState([]);
  const [STEP, setSTEP] = useState(1);
  const [showFacture, setshowFacture] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const [CardNumber, setCardNumber] = React.useState('');
  const [Expiry, setExpiry] = React.useState('');
  const [CVC, setCVC] = React.useState('');
  const animationRef = useRef(null);
  const topHeight = useRef(new Animated.Value(0)).current;
  const bottomHeight = useRef(new Animated.Value(0)).current;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [fileUris, setFileUris] = useState([]);
  const [fileInfos, setFileInfos] = useState([]);
  const [loadingUpload, setloadingUpload] = useState(false);
  const [paymentLoader, setpaymentLoader] = useState(false);
  const [showPaymentError, setshowPaymentError] = useState(false);
  const [showPaymentSuccess, setshowPaymentSuccess] = useState(false);

  useEffect(() => {
    Animated.timing(bottomHeight, {
      toValue: (selectedFees.length > 0 ) ? 150 : 0,    
      duration: 500,                              
      useNativeDriver: false                         
    }).start();
    Animated.timing(topHeight, {
      toValue: (selectedFees.length > 0 ) ? 111 : 0,    
      duration: 500,                              
      useNativeDriver: false                         
    }).start();
  }, [selectedFees.length]);

 

  
    useEffect(() => {
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
  



  const handleBackPress = () => {
    const previous = getPreviousScreen();
    if (previous) {
      popFromHistory();
       navigation.navigate(previous.screenName, previous.params || {});
    } else {
      navigation.navigate("Actualite");
    }
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);



  const handleLongPress = (id) => {
    if (!selectionMode) setSelectionMode(true);
    setSelectedFees(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (next.length === 0) setSelectionMode(false);  
      return next;
    });
  };


  const calculatePrices = () => {
    const selectedItems = unpaidFees.filter(fee => selectedFees.includes(fee.id));
    const total = selectedItems.reduce((sum, fee) => {
      const numericValue = parseFloat(fee.amount.replace('MAD', '').trim());
      return sum + numericValue;
    }, 0);
    return total;
  };
  


  useEffect(() => {
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = displayValue;
    const endValue = calculatePrices();
    const duration = 400;
    const startTime = Date.now();

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);
      
      const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(endValue);
      }
    };

    animationRef.current = requestAnimationFrame(updateCounter);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedFees]);



  const selectedFeeObjects = unpaidFees.filter(fee => selectedFees.includes(fee.id));

  const totalAmount = selectedFeeObjects.reduce((sum, fee) => {
    const numericValue = parseFloat(fee.amount.replace('MAD', '').trim());
    return sum + numericValue;
  }, 0);
  



  const selectImages = async () => {
    setloadingUpload(true);
    setIsKeyboardVisible(false);
  
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Requise', 'Accès à la galerie requis pour sélectionner des images.');
      setloadingUpload(false);
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uris = result.assets.map(asset => asset.uri);
      const infos = result.assets.map(asset => ({
        name: asset.uri.split('/').pop() || 'Nom inconnu',
        resolution: `${asset.width} x ${asset.height}`,
        type: asset.type || 'Type inconnu',
      }));
  
      setFileUris(uris);
      setFileInfos(infos);
    }
  
    setloadingUpload(false);
  };





  const handleOnlinePayment = async()=>{
    try{
      setpaymentLoader(true);
      console.log("Moving to the Payment / online...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setpaymentLoader(false);
      setshowPaymentSuccess(false);
      setshowPaymentError(true);

      // we do this initialization just when it the transaction is successfull 
      // setSelectedFees([]); 
      // setCVC('');
      // setCardNumber("");
      // setExpiry("");
      // setFileUris([]);setFileInfos([]);


    
    }
    catch(e){
      setpaymentLoader(false);
      console.log(e.message);
    }
    finally{
      setpaymentLoader(false);
    }
  }


  const handleVersementPayment = async()=>{
    try{
      setpaymentLoader(true);
      console.log("Moving to the Payment / versement...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setpaymentLoader(false);
      setshowPaymentSuccess(true);
      setshowPaymentError(false);


      // we do this initialization just when it the transaction is successfull 
      setSelectedFees([]); 
      setCVC('');
      setCardNumber("");
      setExpiry("");
      setFileUris([]);
      setFileInfos([]);



    }
    catch(e){
      setpaymentLoader(false);
      console.log(e.message);
    } 
    finally{
      setpaymentLoader(false);
    }
  }


  const handleDownloadFacture = async () => {
    console.log("Download in Progress...");
  };


  return (
    <View style={[styles.container, { backgroundColor: theme === 'light' ? '#f2f2f7' : '#141414' }]}>



        {
          paymentLoader === true && 
          <View
            style={{
              backgroundColor : theme === "light" ? "#f2f2f7" : "#141414", 
              position : "absolute", 
              zIndex : 9999, 
              height : "100%", 
              width : "100%", 
              flex : 1, 
              alignItems : "center", 
              justifyContent : "center"
            }}
          >


            <Text style={{
              textAlign : "center", 
              fontSize : 18, 
              marginBottom : 20, 
              fontFamily : "InterBold",
              color : theme === "light" ? "#141414" : "#E3E3E3"
            }} >
              Traitement de la transaction...
            </Text>
            <Text style={{
              textAlign : "center", 
              fontSize : 14, 
              fontFamily : "Inter",
              width : 300, 
              color : "rgb(150, 150, 150)"
            }} >
            Veuillez patienter pendant la connexion à votre 
            </Text>
            <Text style={{
              textAlign : "center", 
              fontSize : 14, fontFamily : "Inter",
              width : 300, 
              color : "rgb(150, 150, 150)"
            }} >
              établissement bancaire.
            </Text>
          </View>
        }




      {
          showPaymentSuccess === true && 
          <View
            style={{
              backgroundColor : theme === "light" ? "#f2f2f7" : "#141414", 
              position : "absolute", 
              zIndex : 9999, 
              height : "100%", 
              width : "100%", 
              flex : 1, 
              alignItems : "center", 
              justifyContent : "center"
            }}
          >

          <View
              style={{
                backgroundColor :"rgba(84, 181, 46, 0.3)", 
                height : 90, 
                width : 90, 
                borderRadius : 100,  
                marginBottom : 30,
                position : "relative",
                alignItems : "center", 
                justifyContent : "center"
              }}
           >
            <Octicons 
              name="check"
              size={45}
              color="rgb(79, 163, 46)"
            />
           </View>

            <Text style={{
              textAlign : "center", 
              fontSize : 18, 
              marginBottom : 10, 
              fontFamily : "InterBold",
              color : theme === "light" ? "#141414" : "#E3E3E3"
            }} >
              Transaction réussie
            </Text>
            <Text style={{
              textAlign : "center", 
              fontSize : 14, 
              fontFamily : "Inter",
              width : "95%", 
              color : "rgb(150, 150, 150)"
            }} >
              Votre paiement a bien été effectué
            </Text>
            <Text style={{
              textAlign : "center", 
              fontSize : 14, fontFamily : "Inter",
              width : "95%", 
              color : "rgb(150, 150, 150)"
            }} >
              Merci de votre confiance !
            </Text>


            <TouchableOpacity
              onPress={()=>{
                setshowPaymentError(false);
                setshowPaymentSuccess(false);
                setshowFacture(true);
                setSTEP(3);
              }} 
              style={{
                backgroundColor : "white", 
                width : "90%",
                height : 53, 
                marginLeft : "5%",
                marginRight : "5%",
                alignItems : "center", 
                justifyContent  :"center",
                borderRadius : 10, 
                backgroundColor : theme === "light" ? "gainsboro" : "#282828", 
                position : "absolute", 
                bottom : 20, 
              }}
            >
              <Text style={{
                fontFamily : "InterMedium", 
                fontSize : 15,
                color : theme === "light" ? "#141414" : "white", 
                letterSpacing : 0.3
              }} >
                Accéder à la facture
              </Text>
              <Octicons  
                name='chevron-right'
                 size={20}
                 color="white"
                 style={{
                     position : "absolute", 
                     right : 25, 
                 }}
              /> 
            </TouchableOpacity>
          </View>
        }





      {
          showPaymentError === true && 
          <View
            style={{
              backgroundColor : theme === "light" ? "#f2f2f7" : "#141414", 
              position : "absolute", 
              zIndex : 9999, 
              height : "100%", 
              width : "100%", 
              flex : 1, 
              alignItems : "center", 
              justifyContent : "center"
            }}
          >

          <View
              style={{
                backgroundColor :"rgba(255, 0, 0, 0.24)", 
                height : 90, 
                width : 90, 
                borderRadius : 100,  
                marginBottom : 30,
                position : "relative",
                alignItems : "center", 
                justifyContent : "center"
              }}
           >
            <Octicons 
              name="x"
              size={45}
              color="rgba(255, 0, 0, 0.777)"
            />
           </View>

            <Text style={{
              textAlign : "center", 
              fontSize : 18, 
              marginBottom : 10, 
              fontFamily : "InterBold",
              color : theme === "light" ? "#141414" : "#E3E3E3"
            }} >
              Transaction échouée
            </Text>
            <Text style={{
              textAlign : "center", 
              fontSize : 14, 
              fontFamily : "Inter",
              width : "95%", 
              color : "rgb(150, 150, 150)"
            }} >
              Le paiement n’a pas pu être finalisé
            </Text>
            <Text style={{
              textAlign : "center", 
              fontSize : 14, fontFamily : "Inter",
              width : "95%", 
              color : "rgb(150, 150, 150)"
            }} >
              Aucun montant n’a été débité
            </Text>


            <TouchableOpacity
              onPress={()=>{
                setshowPaymentError(false);
                setshowPaymentSuccess(false);
              }} 
              style={{
                backgroundColor : "white", 
                width : "90%",
                height : 53, 
                marginLeft : "5%",
                marginRight : "5%",
                alignItems : "center", 
                justifyContent  :"center",
                borderRadius : 10, 
                backgroundColor : theme === "light" ? "gainsboro" : "#282828", 
                position : "absolute", 
                bottom : 20, 
              }}
            >
              <Text style={{
                fontFamily : "InterMedium", 
                fontSize : 15,
                color : theme === "light" ? "#141414" : "white", 
                letterSpacing : 0.3
              }} >
                 Réessayer à nouveau
              </Text>
              <Octicons  
                name='chevron-right'
                 size={20}
                 color="white"
                 style={{
                     position : "absolute", 
                     right : 25, 
                 }}
              /> 
            </TouchableOpacity>


          </View>
        }



 







        <View style={[styles.containerX, { backgroundColor: theme === 'light' ? '#f2f2f7' : '#141414' }]} />
        {
          STEP === 1  ?           
          <ScrollView
              showsVerticalScrollIndicator={false} 
          >
            {
          !isKeyboardVisible && 
          <Animated.View
              style={[
              styles.containerXYPrime,
              {paddingHorizontal : 20 },
              {backgroundColor : theme === "light" ? "#f2f2f7" : "#141414"},
              {
                  height: topHeight,
              }, 
              ]}
          >
            {
            
            selectedFees.length !== 0 && 
            <>
              <TouchableOpacity 
                onPress={()=>{
                  setSTEP(1);
                }}
                style={{
                  height : 60, 
                  width : 'auto', 
                  flexDirection : "column", 
                  alignItems : "center", 
                  justifyContent : "center"
                }}
              >
                <Image 
                  source={STEP === 1 ? require('../../assets/selectionActivated.png') : require('../../assets/selectionLight.png')}
                  style={{
                    width : 25, 
                    height : 25, 
                    marginBottom : 7, 
                    objectFit : "cover", 
                  }}
                />
                <Text style={{
                    fontSize : 12, 
                    fontFamily : "InterMedium", 
                    color : STEP === 1  ? "#15B99B" : "#aeaeae"
                  }} 
                >
                  Sélection
                </Text>
              </TouchableOpacity>
              <View style={{ marginHorizontal: 9 , width : 33, height : 1, backgroundColor : theme === "light" ? "rgb(201, 201, 201)" : "rgb(91, 91, 91)", borderRadius : 4}} />
              <TouchableOpacity 
                onPress={()=>{
                  if(selectedFees && selectedFees.length !== 0){
                    setSTEP(2);
                  }
                }}
                style={{
                  height : 60, 
                  width : 'auto', 
                  flexDirection : "column", 
                  alignItems : "center", 
                  justifyContent : "center"
                }}
              >
                <Image 
                  source={STEP === 2 ? require('../../assets/bankCardActivated.png') : require('../../assets/bankCardDark.png')}
                  style={{
                    width : 25, 
                    height : 25, 
                    marginBottom : 7, 
                    objectFit : "cover", 
                  }}
                />
                <Text style={{
                    fontSize : 12, 
                    fontFamily : "InterMedium", 
                    color : STEP === 2  ? "#15B99B" : "#aeaeae"
                  }} 
                >
                  Paiement
                </Text>
              </TouchableOpacity>
              <View style={{ marginHorizontal: 9 , width : 33, height : 1, backgroundColor : theme === "light" ? "rgb(201, 201, 201)" : "rgb(91, 91, 91)", borderRadius : 4}} />
              <TouchableOpacity 
                onPress={()=>{
                  if(showFacture === true){
                    setSTEP(3);
                  }                
                }}
                style={{
                  height : 60, 
                  width : 'auto', 
                  flexDirection : "column", 
                  alignItems : "center", 
                  justifyContent : "center"
                }}
              >
                <Image 
                  source={STEP === 3 ? require('../../assets/invoiceActivated.png') : require('../../assets/invoiceDark.png')}
                  style={{
                    width : 21, 
                    height : 23, 
                    marginBottom : 7, 
                    objectFit : "cover", 
                  }}
                />
                <Text style={{
                    fontSize : 12, 
                    fontFamily : "InterMedium", 
                    color : STEP === 3  ? "#15B99B" : "#aeaeae", 
                    marginTop : 3
                  }} 
                >
                  Facture
                </Text>
              </TouchableOpacity>   
            </>
            }
          </Animated.View>
        }
            {
              selectedFees.length === 0 && 
              <Text style={[styles.hintText, {color : theme === "light" ? "rgb(154, 154, 154)" : "rgb(170, 170, 170)"}]}>
                  Astuce : Appuyez longuement sur une carte de frais impayée pour sélectionner ceux à payer.
              </Text>
            }
            
              {unpaidFees.map(item => (
              <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  delayLongPress={222}    
                  onLongPress={() => handleLongPress(item.id)}
                  onPress={() => selectionMode && handleLongPress(item.id)}
                  style={[
                  styles.cardUnpaid,
                      {backgroundColor : theme === "light" ? "white" : "#282828"}, 
                      {shadowColor: theme === "light" ? "rgb(138, 138, 138)" : "#282828" },
                  selectedFees.includes(item.id) && styles.cardSelected
                  ]}
              >
                  <View style={styles.cardLeft}>
                    <Text style={[styles.cardTitle, { color: theme === 'light' ? '#000' : '#fff' }]}>
                        {item.title}
                    </Text>
                    <Text style={[styles.cardDue, { color: theme === 'light' ? '#555' : '#ccc' }]}>
                        Due le : {item.dueDate}
                    </Text>
                    <View style={styles.tagsContainer}>
                        {item.tags.map((tag, idx) => (
                        <View
                            key={idx}
                            style={[
                            styles.tag,
                            tag.type === 'error' ? { backgroundColor : theme === "light" ? "rgba(255, 0, 0, 0.09)" : "rgba(146, 0, 0, 0.18)"} : styles.tagSuccess
                            ]}
                        >
                            <Text
                            style={[
                                styles.tagText,
                                tag.type === 'error' ? styles.tagTextError : theme === "light" ? styles.tagTextSuccessLight : styles.tagTextSuccessDark
                            ]}
                            >
                            {tag.label}
                            </Text>
                        </View>
                        ))}
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <Text style={[styles.amount, { color: theme === 'light' ? '#000' : '#fff' }]}>
                        {item.amount}
                    </Text>
                  </View>
                  
                   
                </TouchableOpacity>
              ))}
            
              {paidFees.map(item => (
              <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={[
                  styles.card,
                      {backgroundColor : theme === "light" ? "white" : "#282828"}, 
                      {shadowColor: theme === "light" ? "rgb(138, 138, 138)" : "#282828" },
                  selectedFees.includes(item.id) && styles.cardSelected
                  ]}
              >
                  <View style={styles.cardLeft}>
                  <Text style={[styles.cardTitle, { color: theme === 'light' ? '#000' : '#fff' }]}>
                      {item.title}
                  </Text>
                  <Text style={[styles.cardDue, { color: theme === 'light' ? '#555' : '#ccc' }]}>
                      Due le : {item.dueDate}
                  </Text>
                  <View style={styles.tagsContainer}>
                      {item.tags.map((tag, idx) => (
                      <View
                          key={idx}
                          style={[
                          styles.tag,
                          tag.type === 'success' ? styles.tagSuccess : styles.tagPending
                          ]}
                      >
                          <Text
                          style={[
                              styles.tagText,
                              tag.type === 'success' ? styles.tagTextSuccessDark : theme === "light" ? styles.tagPendingTextLight : styles.tagPendingTextDark
                          ]}
                          >
                          {tag.label}
                          </Text>
                      </View>
                      ))}
                  </View>
                  </View>
                  <View style={styles.cardRight}>
                  <Text style={[styles.amount, { color: theme === 'light' ? '#000' : '#fff' }]}>
                      {item.amount}
                  </Text>
                  </View>

                  <TouchableOpacity
                      style={{
                        backgroundColor : theme === "light" ? "transparent" : "#282828", 
                        borderRadius : 9, 
                        paddingHorizontal : 10, 
                        alignContent : "center", 
                        justifyContent : "center", 
                        alignItems : "center", 
                        position : "absolute", 
                        bottom : 14, 
                        right : 10, 
                        paddingBottom : 10, 
                        paddingTop : 6
                      }}
                      onPress={()=>{
                        console.log("Télécharger la facture")
                      }}
                    >
                      <Text  style={{
                        color : theme === "light" ? '#555' : '#ccc',
                        textDecorationLine : "underline",  
                        fontFamily : "InterMedium", 
                        fontSize : 12
                      }}>
                        Télécharger la Facture
                      </Text>
                    </TouchableOpacity>


              </TouchableOpacity>
              ))}
          </ScrollView>
          :
          STEP === 2 ? 
          <ScrollView
            showsVerticalScrollIndicator={false} 
            style={{
              paddingHorizontal : 20
            }}
          >

            {
              !isKeyboardVisible && 
              <Animated.View
                  style={[
                  styles.containerXYPrime,
                  {paddingHorizontal : 20 },
                  {backgroundColor : theme === "light" ? "#f2f2f7" : "#141414"},
                  {
                      height: topHeight,
                  }, 
                  ]}
              >
                {
                
                selectedFees.length !== 0 && 
                <>
                  <TouchableOpacity 
                    onPress={()=>{
                      setSTEP(1);
                    }}
                    style={{
                      height : 60, 
                      width : 'auto', 
                      flexDirection : "column", 
                      alignItems : "center", 
                      justifyContent : "center"
                    }}
                  >
                    <Image 
                      source={STEP === 1 ? require('../../assets/selectionActivated.png') : require('../../assets/selectionLight.png')}
                      style={{
                        width : 25, 
                        height : 25, 
                        marginBottom : 7, 
                        objectFit : "cover", 
                      }}
                    />
                    <Text style={{
                        fontSize : 12, 
                        fontFamily : "InterMedium", 
                        color : STEP === 1  ? "#15B99B" : "#aeaeae"
                      }} 
                    >
                      Sélection
                    </Text>
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: 9 , width : 33, height : 1, backgroundColor : theme === "light" ? "rgb(201, 201, 201)" : "rgb(91, 91, 91)", borderRadius : 4}} />
                  <TouchableOpacity 
                    onPress={()=>{
                      if(selectedFees && selectedFees.length !== 0){
                        setSTEP(2);
                      }
                    }}
                    style={{
                      height : 60, 
                      width : 'auto', 
                      flexDirection : "column", 
                      alignItems : "center", 
                      justifyContent : "center"
                    }}
                  >
                    <Image 
                      source={STEP === 2 ? require('../../assets/bankCardActivated.png') : require('../../assets/bankCardDark.png')}
                      style={{
                        width : 25, 
                        height : 25, 
                        marginBottom : 7, 
                        objectFit : "cover", 
                      }}
                    />
                    <Text style={{
                        fontSize : 12, 
                        fontFamily : "InterMedium", 
                        color : STEP === 2  ? "#15B99B" : "#aeaeae"
                      }} 
                    >
                      Paiement
                    </Text>
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: 9 , width : 33, height : 1, backgroundColor : theme === "light" ? "rgb(201, 201, 201)" : "rgb(91, 91, 91)", borderRadius : 4}} />
                  <TouchableOpacity 
                    onPress={()=>{
                      if(showFacture === true){
                        setSTEP(3);
                      }                
                    }}
                    style={{
                      height : 60, 
                      width : 'auto', 
                      flexDirection : "column", 
                      alignItems : "center", 
                      justifyContent : "center"
                    }}
                  >
                    <Image 
                      source={STEP === 3 ? require('../../assets/invoiceActivated.png') : require('../../assets/invoiceDark.png')}
                      style={{
                        width : 21, 
                        height : 23, 
                        marginBottom : 7, 
                        objectFit : "cover", 
                      }}
                    />
                    <Text style={{
                        fontSize : 12, 
                        fontFamily : "InterMedium", 
                        color : STEP === 3  ? "#15B99B" : "#aeaeae", 
                        marginTop : 3
                      }} 
                    >
                      Facture
                    </Text>
                  </TouchableOpacity>   
                </>
                }
              </Animated.View>
            }
            <View
              style={{
                width : "100%", 
                height : "auto", 
                marginBottom : 5, 
              }}
            >
              <Text style={{
                color : theme === "light" ? "#141414" : "white", 
                fontSize: 15, 
                fontFamily : "InterMedium"
              }} >
                Récapitulatif des frais :  
              </Text>
            </View>
            {
              selectedFees && selectedFees.length !== 0 && 
              <>
              {
                unpaidFees
                  .filter(fee => selectedFees.includes(fee.id))
                  .map((fee, index)=>{
                    return(
                      <View
                        key={index}
                        style={{
                          width : "100%", 
                          height : "auto", 
                          flexDirection : "row", 
                          marginTop : 10,
                          justifyContent : "space-between"
                        }}
                      >
                        <Text style={{
                          color : theme === "light" ? "#141414" : "rgb(179, 179, 179)", 
                          fontSize: 13, 
                          fontFamily : "InterMedium"
                        }} >
                          {fee.title}
                        </Text>
                        <Text style={{
                          color : theme === "light" ? "#141414" : "rgb(179, 179, 179)", 
                          fontSize: 13, 
                          fontFamily : "Inter"
                        }} >
                          {fee.amount}
                        </Text>
                      </View>
                    )
                })
              } 
              </>
            }
            <View
              style={{
                width : "100%", 
                height : "auto", 
                flexDirection : "row", 
                marginTop : 10,
                justifyContent : "space-between"
              }}
            >
              <Text style={{
                color : "#15B99B",
                fontSize: 13, 
                fontFamily : "InterMedium"
              }} >
                Montant total 
              </Text>
              <Text style={{
                color : "#15B99B",
                fontSize: 13, 
                fontFamily : "Inter"
              }} >
                {totalAmount} MAD
              </Text>
            </View>

            <View
              style={{
                backgroundColor : theme === "light" ? "rgb(194, 194, 194)" : "rgb(70, 70, 70)", 
                width : "100%", 
                margin : "auto", 
                marginTop : 31, 
                marginBottom : 22, 
                height : 1
              }}
            />

            <View
              style={{
                width : "100%", 
                height : "auto", 
              }}
            >
              <Text style={{
                color : theme === "light" ? "#141414" : "white", 
                fontSize: 15, 
                marginBottom : 7,
                fontFamily : "InterMedium"
              }} >
                Mode de paiement :
              </Text>
            </View>

            <Text 
              style={{
                color : theme === "light" ? "#141414" : "rgb(179, 179, 179)", 
                fontSize: 13, 
                marginBottom : 11, 
                fontFamily : "Inter"
              }} >
              Sélectionner ce qui vous correspond le mieux
            </Text>


            <View 
              style={{
                flexDirection : "row", 
                justifyContent : "space-between" , 
                width : "100%", 
              }} 
            >
              <TouchableOpacity 
                onPress={()=>{
                  setDefaultPayement("Online")
                }}
                style={{
                  flexDirection : "column", 
                  justifyContent : "center" , 
                  alignItems : "center",
                  width : "48%", 
                  borderRadius : 10, 
                  backgroundColor : theme === "light" ? "white" : "#282828", 
                  height : 111, 
                  borderWidth : DefaultPayement === "Online" ? 2 : 1, 
                  borderColor : DefaultPayement === "Online" ? "#e17f0e" : theme === "light" ? "gainsboro" : "transparent"
                }} 
              >
                <Image 
                  style={{
                    height : 49, 
                    width : 49, 
                    marginBottom : 6, 
                    objectFit : "cover"
                  }}
                  source={require('../../assets/CARDonline.png')}
                />
                <Text 
                  style={{
                    color : theme === "light" ? "#141414" : "#E3E3E3"
                  }} 
                >
                  Online
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={()=>{
                  setDefaultPayement("cash")
                }}
                style={{
                  flexDirection : "column", 
                  justifyContent : "center" , 
                  alignItems : "center",
                  width : "48%", 
                  borderRadius : 10, 
                  backgroundColor : theme === "light" ? "white" : "#282828", 
                  height : 111, 
                  borderWidth : DefaultPayement === "cash" ? 2 : 1, 
                  borderColor : DefaultPayement === "cash" ? "rgba(225, 127, 14, 0.99)" : theme === "light" ? "gainsboro" : "transparent"
                }} 
              >
                <Image 
                  style={{
                    height : 49, 
                    width : 49, 
                    marginBottom : 6, 
                    objectFit : "cover"
                  }}
                  source={require('../../assets/CASH.png')}
                />
                <Text 
                  style={{
                    color : theme === "light" ? "#141414" : "#E3E3E3"
                  }} 
                >
                  Versement
                </Text>
              </TouchableOpacity>
            </View>



            {
              DefaultPayement === "Online" ? 
              <View style={[styles.containerOfCardX]}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, {color : theme === "light" ? "#141414" : "white"}]}>
                      Numéro de carte bancaire : 
                    </Text>
                    <TextInput
                      style={[styles.input,{ borderWidth : theme === "light" ? 1 : 0 },{ borderColor : theme === "light" ? "gainsboro" : "transparent" },{ color : theme === "light" ? "gray" : "#E3E3E3" }, {backgroundColor : theme === "light" ? "white" : "#282828"}]}
                      placeholder="1234 5678 9012 3456"
                      keyboardType="number-pad"
                      value={CardNumber}
                      onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                      maxLength={19}
                      placeholderTextColor="rgb(179, 179, 179)"
                    />
                </View>
                <View style={styles.row}>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, {color : theme === "light" ? "#141414" : "white"}]}>
                        Mois / Année : 
                      </Text>
                      <TextInput
                        style={[styles.input,{ borderWidth : theme === "light" ? 1 : 0 },{ borderColor : theme === "light" ? "gainsboro" : "transparent" },{ color : theme === "light" ? "gray" : "#E3E3E3" },{backgroundColor : theme === "light" ? "white" : "#282828"}]}
                        placeholder="MM / AA"
                        keyboardType="number-pad"
                        value={Expiry}
                        onChangeText={(text) => setExpiry(formatExpiry(text))}
                        maxLength={5}
                        placeholderTextColor="rgb(179, 179, 179)"
                      />
                  </View>
                  <View style={[styles.inputGroup2]}>
                      <Text style={[styles.label, {color : theme === "light" ? "#141414" : "white"}]}>
                        CVC : 
                      </Text>
                      <TextInput
                        style={[styles.input,{ borderWidth : theme === "light" ? 1 : 0 },{ borderColor : theme === "light" ? "gainsboro" : "transparent" },{ color : theme === "light" ? "gray" : "#E3E3E3" },{backgroundColor : theme === "light" ? "white" : "#282828"}]}
                        placeholder="CVC"
                        keyboardType="number-pad"
                        value={CVC}
                        onChangeText={setCVC}
                        maxLength={3}
                        placeholderTextColor="rgb(179, 179, 179)"
                      />
                  </View>
                  <View style={[styles.row, {flex : 1, alignItems : "center", justifyContent : "flex-end"} , { marginTop: 20 }]}>
                      <Image
                        source={require('../../assets/viza.png')} 
                        style={styles.logo}
                      />
                      <Image
                        source={require('../../assets/cmi.png')}  
                        style={styles.logo}
                      />
                      <Image
                        source={require('../../assets/mastercard.png')}  
                        style={styles.logo2}
                      />
                  </View>
                </View>
              </View>
              :
              <View style={styles.containerOfCardX}>
              <Text style={[styles.label, {fontSize : 15} , { marginBottom: 12, color: theme === "light" ? "#141414" : "white" }]}>
                Téléversez vos justificatifs de paiement :
              </Text>
            
              <Text style={{
                color: theme === "light" ? "#141414" : "rgb(179, 179, 179)",
                fontSize: 13,
                marginBottom: 11,
                fontFamily: "Inter"
              }}>
                Scannez-les en vous assurant que la qualité de l'image soit lisible, puis envoyez-les.
              </Text>
            
              <TouchableOpacity
                style={{
                  backgroundColor: "rgba(225, 127, 14, 0.99)",
                  borderRadius: 9,
                  width: "100%",
                  height: 49,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={selectImages}
              >
                <Text style={{
                  color: "white",
                  fontSize: 15,
                  fontFamily: "InterMedium",
                  letterSpacing: 0.3,
                  flexDirection: "row"
                }}>
                  {loadingUpload ? (
                    "Chargement des fichiers..."
                  ) : (
                    <>
                      <Octicons name="upload" size={15} color="white" />
                      {"  "}
                      {fileUris.length === 0 ? "Importer depuis vos documents" : "Importer d'autres fichiers"}
                    </>
                  )}
                </Text>
              </TouchableOpacity>
            
              {fileUris.length > 0 ? (
                <View style={{ marginTop: 10 }}>
                  {fileInfos.map((info, index) => (
                    <Text
                      key={index}
                      style={{
                        color: "rgba(225, 127, 14, 0.99)",
                        fontFamily: "Inter",
                        fontSize: 12,
                        textAlign: "left",
                        marginTop: 4
                      }}
                    >
                      <Feather  size={14} name='paperclip' color={theme === "light" ? "gray" : "#E3E3E3"}  />&nbsp;&nbsp;{info.name}  
                    </Text>
                  ))}
                </View>
              ) : (
                <Text style={{
                  color: "rgba(225, 127, 14, 0.99)",
                  fontFamily: "Inter",
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 10
                }}>
                  Aucun fichier
                </Text>
              )}
            </View>
            

            }



          </ScrollView>
          :
          <ScrollView
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ flex: 1 }}
          >

            {
              !isKeyboardVisible && 
              <View
                  style={[
                  styles.containerXYPrime,
                  {paddingHorizontal : 20 },
                  {backgroundColor : theme === "light" ? "#f2f2f7" : "#141414"},
                  {
                      height: 100,
                  }, 
                  ]}
              >
                <>
                  <TouchableOpacity 
                    onPress={()=>{
                      setSTEP(1);
                      setshowFacture(false);
                    }}
                    style={{
                      height : 60, 
                      width : 'auto', 
                      flexDirection : "column", 
                      alignItems : "center", 
                      justifyContent : "center"
                    }}
                  >
                    <Image 
                      source={require('../../assets/selectionLight.png')}
                      style={{
                        width : 25, 
                        height : 25, 
                        marginBottom : 7, 
                        objectFit : "cover", 
                      }}
                    />
                    <Text style={{
                        fontSize : 12, 
                        fontFamily : "InterMedium", 
                        color : STEP === 1  ? "#15B99B" : "#aeaeae"
                      }} 
                    >
                      Sélection
                    </Text>
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: 9 , width : 33, height : 1, backgroundColor : theme === "light" ? "rgb(201, 201, 201)" : "rgb(91, 91, 91)", borderRadius : 4}} />
                  <TouchableOpacity 
                    onPress={()=>{
                      console.log("Forbidden")
                    }}
                    style={{
                      height : 60, 
                      width : 'auto', 
                      flexDirection : "column", 
                      alignItems : "center", 
                      justifyContent : "center"
                    }}
                  >
                    <Image 
                      source={require('../../assets/bankCardDark.png')}
                      style={{
                        width : 25, 
                        height : 25, 
                        marginBottom : 7, 
                        objectFit : "cover", 
                      }}
                    />
                    <Text style={{
                        fontSize : 12, 
                        fontFamily : "InterMedium", 
                        color : STEP === 2  ? "#15B99B" : "#aeaeae"
                      }} 
                    >
                      Paiement
                    </Text>
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: 9 , width : 33, height : 1, backgroundColor : theme === "light" ? "rgb(201, 201, 201)" : "rgb(91, 91, 91)", borderRadius : 4}} />
                  <TouchableOpacity 
                    onPress={()=>{
                      if(showFacture === true){
                        setSTEP(3);
                      }                
                    }}
                    style={{
                      height : 60, 
                      width : 'auto', 
                      flexDirection : "column", 
                      alignItems : "center", 
                      justifyContent : "center"
                    }}
                  >
                    <Image 
                      source={require('../../assets/invoiceActivated.png')}
                      style={{
                        width : 21, 
                        height : 23, 
                        marginBottom : 7, 
                        objectFit : "cover", 
                      }}
                    />
                    <Text style={{
                        fontSize : 12, 
                        fontFamily : "InterMedium", 
                        color : STEP === 3  ? "#15B99B" : "#aeaeae", 
                        marginTop : 3
                      }} 
                    >
                      Facture
                    </Text>
                  </TouchableOpacity>   
                </>
                
              </View>
            }

            <View
              style={{
                flexDirection : "column", 
                alignItems : "center", 
                paddingHorizontal : 20, 
                justifyContent : "space-between", 
                width : "100%", 
                position : "relative", 
                flex : 1, 
                height : "100%", 
                paddingBottom : 100
              }}
            >
              <View
                style={{
                  width : "100%", 
                  height : "auto", 
                  flexDirection : "row", 
                  marginTop : 10,
                  marginBottom : 10, 
                  justifyContent : "space-between"
                }}
              >
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 15, 
                  fontFamily : "InterMedium"
                }} >
                  Détails de la facture : 
                </Text>
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 15, 
                  fontFamily : "InterMedium"
                }} >
                &nbsp;
                </Text>
              </View>

              <View
                style={{
                  width : "100%", 
                  height : "auto", 
                  flexDirection : "row", 
                  marginTop : 10,
                  justifyContent : "space-between"
                }}
              >
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  Numéro de facture : 
                </Text>
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  HF9349DE02
                </Text>
              </View>


              <View
                style={{
                  width : "100%", 
                  height : "auto", 
                  flexDirection : "row", 
                  marginTop : 10,
                  justifyContent : "space-between"
                }}
              >
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  Numéro de transaction : 
                </Text>
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  J742RGF024348
                </Text>
              </View>





              <View
                style={{
                  width : "100%", 
                  height : "auto", 
                  flexDirection : "row", 
                  marginTop : 10,
                  justifyContent : "space-between"
                }}
              >
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  Mode de paiement : 
                </Text>
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  Par carte
                </Text>
              </View>




              <View
                style={{
                  width : "100%", 
                  height : "auto", 
                  flexDirection : "row", 
                  marginTop : 10,
                  justifyContent : "space-between"
                }}
              >
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  Banque : 
                </Text>
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  CIH-MA
                </Text>
              </View>



              
              <View
                style={{
                  width : "100%", 
                  height : "auto", 
                  flexDirection : "row", 
                  marginTop : 10,
                  justifyContent : "space-between"
                }}
              >
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  Numéro de compte : 
                </Text>
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  XXXX-XXXX-XXXX-7439
                </Text>
              </View>






                <View
                  style={{
                    backgroundColor : theme === "light" ? "rgb(194, 194, 194)" : "rgb(70, 70, 70)", 
                    width : "100%", 
                    margin : "auto", 
                    marginTop : 31, 
                    marginBottom : 22, 
                    height : 1
                  }}
                />
                  


                  <View
                style={{
                  width : "100%", 
                  height : "auto", 
                  flexDirection : "row", 
                  marginTop : 10,
                  marginBottom : 10, 
                  justifyContent : "space-between"
                }}
              >
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 15, 
                  fontFamily : "InterMedium"
                }} >
                  Détails des frais : 
                </Text>
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 15, 
                  fontFamily : "InterMedium"
                }} >
                &nbsp;
                </Text>
              </View>

              <View
                style={{
                  width : "100%", 
                  height : "auto", 
                  flexDirection : "row", 
                  marginTop : 10,
                  justifyContent : "space-between"
                }}
              >
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                 Frais de candidature CNSS
                </Text>
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  500 MAD
                </Text>
              </View>


              <View
                style={{
                  width : "100%", 
                  height : "auto", 
                  flexDirection : "row", 
                  marginTop : 10,
                  justifyContent : "space-between"
                }}
              >
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  Frais d'inscription
                </Text>
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  1400 MAD
                </Text>
              </View>



              <View
                style={{
                  width : "100%", 
                  height : "auto", 
                  flexDirection : "row", 
                  marginTop : 10,
                  justifyContent : "space-between"
                }}
              >
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  Frais des examens
                </Text>
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  2500 MAD
                </Text>
              </View>




              <View
                style={{
                  width : "100%", 
                  height : "auto", 
                  flexDirection : "row", 
                  marginTop : 10,
                  justifyContent : "space-between"
                }}
              >
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  Montant total : 
                </Text>
                <Text style={{
                  color : theme === "light" ? "#141414" : "white",
                  fontSize: 13, 
                  fontFamily : "Inter"
                }} >
                  4178 MAD
                </Text>
              </View>

                <TouchableOpacity
                  onPress={()=>{
                    handleDownloadFacture()
                  }} 
                  style={{
                    backgroundColor : "white", 
                    width : "100%",
                    height : 53, 
                    alignItems : "center", 
                    justifyContent  :"center",
                    borderRadius : 10, 
                    backgroundColor : "#15B99B", 
                    position : "absolute", 
                    bottom : 20, 
                  }}
                >
                  <Text style={{
                    fontFamily : "InterMedium", 
                    fontSize : 15,
                    color : "white", 
                    letterSpacing : 0.3
                  }} >
                    Télécharger la facture
                  </Text>
                </TouchableOpacity>


 
              </View>  

          </ScrollView>
        }
        {
          STEP !== 3 && !isKeyboardVisible &&
          <Animated.View
              style={[
                styles.containerXY,
                {paddingHorizontal : 20 },
                {borderWidth : selectedFees.length > 0 ? 1 : 0},
                {borderColor : theme === "light" ? "rgb(226, 226, 226)" : "rgb(92, 92, 92)"},
                {backgroundColor : theme === "light" ? "rgb(255, 255, 255)" : "rgb(28, 28, 28)"},
                {height: bottomHeight}, 
              ]}
          >
              <View
                  style={{
                      flexDirection : "row", 
                      justifyContent : "space-between" , 
                      paddingTop : STEP === 2 ? 20 : 25,
                      marginBottom : STEP === 2 ? 5 : 22 
                  }}
              >
                  <Text
                      style={{
                          color : theme === "light" ? "#141414" : "white", 
                          fontSize : 15, 
                          fontFamily : "InterMedium"
                      }}
                  >
                      Montant total : 
                  </Text>
                  <Text
                      style={{
                          color : theme === "light" ? "#141414" : "white", 
                          fontSize : 15, 
                          fontFamily : "InterBold"
                      }}
                  >
                      {displayValue}&nbsp;&nbsp;MAD
                  </Text>
              </View>
              {
                STEP === 2 && 
                  <View
                      style={{
                          flexDirection : "row", 
                          justifyContent : "space-between" , 
                          marginBottom : 10
                      }}
                  >
                      <Text
                          style={{
                              color : theme === "light" ? "rgb(133, 133, 133)" : "gray", 
                              fontSize : 13, 
                              fontFamily : "InterMedium"
                          }}
                      >
                          Mode : 
                      </Text>
                      <Text
                          style={{
                              color : theme === "light" ? "rgb(133, 133, 133)" : "gray", 
                              fontSize : 13, 
                              fontFamily : "InterMedium"
                          }}
                      >
                        {
                          DefaultPayement === "cash" ? "Versement" : "Online"
                        }
                      </Text>
                  </View>
              }
              {
                  selectedFees && selectedFees.length > 0 && 
                  <TouchableOpacity
                      style={{
                          backgroundColor : "#15B99B", 
                          borderRadius : 9, 
                          width : "100%", 
                          height : 49, alignContent : "center", 
                          justifyContent : "center", 
                          alignItems : "center", 
                          position : "relative"
                      }}
                      onPress={()=>{
                        if(STEP === 1){
                          setSTEP(2);
                        }
                        else if(STEP === 2){
                          if(DefaultPayement === "Online"){
                            if(CardNumber.length < 16){
                              Alert.alert('Le numéro de carte doit contenir exactement 16 chiffres.');
                              return;
                            }
                            else if(Expiry.length < 3){
                              Alert.alert("Veuillez saisir une date d'expiration valide.");
                              return;
                            }
                            else if(CVC.length < 3){
                              Alert.alert('Le numéro de CVC doit contenir exactement 3 chiffres.');
                              return;
                            }
                            else{
                              handleOnlinePayment();
                            }

                          }
                          else{
                            if (fileInfos.length === 0 || fileUris.length === 0) {
                              Alert.alert('Veuillez téléverser au moins un justificatif pour pouvoir continuer.');
                              return;
                            } else {
                              handleVersementPayment();
                            }
                            
                          }
                        }
                      }}
                  >
                      <Text
                          style={{
                              color : "white", 
                              fontSize : 15, 
                              fontFamily : "InterMedium", 
                              letterSpacing : 0.3,
                          }}
                      >
                        {
                          STEP === 1 ? "Confirmer la sélection" :
                          STEP === 2 ? "Effectuer le paiement" :
                          ""
                        }
                      </Text>
                      <Octicons  
                              name='chevron-right'
                              size={20}
                              color="white"
                              style={{
                                  position : "absolute", 
                                  right : 25, 
                              }}
                      /> 

                  </TouchableOpacity>
              }
          </Animated.View>
        }
    </View>
  );
};

export default Paiement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerX: {
    width : "100%", 
    height : 10
    },
    containerXY: {
        width : "102%",
        marginLeft : "-1%", 
        borderTopRightRadius : 20, 
        borderTopLeftRadius : 20, 
        shadowColor: '#000',
        shadowOffset: { width: 10, height: -20 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 15, 
    },

    containerXYPrime: {
      width : "100%", 
      alignItems : "center", 
      justifyContent : "center", 
      flexDirection : "row", 
    },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold'
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, 
    marginTop : 20, 
  },
  sectionH2eader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20, 
    marginTop : 10
  },
  line: {
    flex: 1,
    height: 1,
  },
  sectionHeaderText: {
    marginHorizontal: 10,
    fontSize: 12,
    letterSpacing : 0.3, 
    fontFamily: 'Inter'
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    width : "90%", 
    position : "relative",
    margin : "auto",  
    marginLeft : "5%", 
    marginRight : "5%", 
    padding: 15,
    marginBottom: 15, 
    elevation : 4, 
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 20,

  },
  cardUnpaid : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    width : "90%", 
    position : "relative",
    margin : "auto",  
    marginLeft : "5%", 
    marginRight : "5%", 
    padding: 15,
    marginBottom: 15, 
    elevation : 4, 
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#15B99B'
  },
  cardLeft: {
    flex: 1
  },
  cardTitle: {
    fontSize: 14,
    paddingRight : 40, 
    fontFamily: 'InterMedium',
    marginBottom: 4
  },
  cardDue: {
    fontSize: 12,
    fontFamily: 'Inter',
    marginBottom: 10
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
    alignItems : "center", 
    justifyContent : "center",
    marginBottom: 4, 
    paddingBottom : 3
  },
  tagError: {
    backgroundColor: 'rgba(255, 0, 0, 0.167)'
  },
  tagPending : {
    backgroundColor: 'rgba(234, 117, 21, 0.13)'
  },
  tagSuccess: {
    backgroundColor: 'rgba(0, 255, 0, 0.09)'
  },
  tagText: {
    fontSize: 11,
    letterSpacing : 0.4, 
    fontFamily: 'InterMedium'
  },
  tagTextError: {
    color: 'rgb(232, 20, 38)', 
    letterSpacing : 0.4
  },
  tagTextSuccessLight: {
    letterSpacing : 0.4,
    color: 'rgb(45, 172, 104)'
  },
  tagTextSuccessDark: {
    letterSpacing : 0.4,
    color: 'rgb(39, 214, 121)'
  },
  tagPendingTextLight: {
    letterSpacing : 0.4,
    color: 'rgb(214, 118, 39)'
  },
  tagPendingTextDark: {
    letterSpacing : 0.4,
    color: 'rgb(214, 118, 39)'
  },
  cardRight: {
    position : "relative",
    alignItems: 'flex-end'
  },
  amount: {
    fontSize: 16,
    fontFamily: 'InterBold'
  },
  detailsText: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#aaa',
    marginTop: 4, 
    textDecorationLine : "underline"
  },
  hintText: {
    textAlign: 'center',
    fontSize: 12,
    paddingHorizontal : 25, 
    fontFamily: 'Inter',
    marginBottom : 20, 
  }, 


  containerOfCardX: {
    width: '100%',
    marginTop : 16.167, 
    alignSelf: 'center',
    marginBottom : 50
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputGroup2: {
    marginBottom: 10,
    marginLeft: 30,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
  },
  logo: {
    width: 25,
    height: 10,
    marginRight : 6, 
    resizeMode: 'contain',
  },

  logo2: {
    width: 20,
    height: 15,
    marginRight : 6, 
    resizeMode: 'contain',
  },


});
