import React, { useRef, useEffect, memo, useState } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Modal, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../states/ThemeContext';

const ModeToggleButton = memo(() => {
  const { theme, handleThemeToggle, isLoadingChangingMode } = useTheme();
  
  const animatedValue = useRef(new Animated.Value(theme === 'light' ? 0 : 1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: theme === 'light' ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [theme]);

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
      await handleThemeToggle();
      setShowLoading(false);
    });
  };

  const toggleTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28],
  });

  return (
    <>
      <Modal transparent visible={showLoading} animationType="fade">
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#15B99B" />
        </View>
      </Modal>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity disabled={isLoadingChangingMode} onPress={toggle} style={styles.container}>
          <Animated.View style={[styles.toggleBackground, { backgroundColor: theme === "light" ? "rgb(231, 231, 231)" : "#15b99B" }]}>
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
});

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

export default ModeToggleButton;
