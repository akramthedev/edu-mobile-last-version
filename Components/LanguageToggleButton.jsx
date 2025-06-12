import React, { useRef, useEffect, useState } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Modal, View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import "../i18n";  
import { useLanguage } from '../states/LanguageContext';
import { useTheme } from '../states/ThemeContext';

export default function LanguageToggleButton() {
  const { t } = useTranslation();
  const { language, handleLanguageChange, isLoadingChangingLanguage } = useLanguage();
  const { theme } = useTheme();

  const isSClicked = language === 'fr';

  const animatedValue = useRef(new Animated.Value(isSClicked ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isSClicked ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSClicked]);

  const toggle = () => {
    setShowLoading(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      await handleLanguageChange(language === 'en' ? 'fr' : 'en');
      setShowLoading(false);
    });
  };

  const toggleTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28],
  });

  const backgroundColor =
    theme === "light"
      ? (isSClicked ? "#15B99B" : "rgb(231, 231, 231)")
      : animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["rgb(91, 91, 91)", "#15B99B"],
        });

  return (
    <>
      <Modal transparent visible={showLoading} animationType="fade">
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#15B99B" />
        </View>
      </Modal>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={toggle}
          style={styles.container}
          disabled={isLoadingChangingLanguage}
        >
          <Animated.View style={[styles.toggleBackground, { backgroundColor }]}>
            <Animated.View
              style={[
                styles.circle,
                { transform: [{ translateX: toggleTranslateX }] },
                { backgroundColor: theme === "light" ? "white" : "#e3e3e3" }
              ]}
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBackground: {
    width: 60,
    height: 35,
    borderRadius: 25,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 21,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  modalContainer: {
    flex: 1,
    zIndex : 999999999999999, 
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
