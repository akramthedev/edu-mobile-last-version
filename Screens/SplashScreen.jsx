import React, { useEffect, useState } from 'react';
import {  Image, Text, Animated } from 'react-native';
import { useFonts } from 'expo-font';

const SplashScreen = () => {
  

  const [fadeAnim] = useState(new Animated.Value(0)); 

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, 
      duration: 0, 
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,  
        duration: 666,  
        useNativeDriver: true,
      }).start();
    }, 100); 

    return () => clearTimeout(timeout); 
  }, [fadeAnim]);
 

  return (
    <Animated.View
      style={{
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: fadeAnim,  
      }}
    >
      <Image
        style={{
          height: 120,
          width: 167,
          resizeMode: 'cover',
        }}
        source={require('../assets/splashLogo.png')}
      />
      <Text
        style={{
          color: '#15b99b',
          fontWeight: 'bold',
          fontFamily: 'Inter',
          fontSize: 15,
        }}
      >
        EDU
      </Text>
    </Animated.View>
  );
};

export default SplashScreen;
