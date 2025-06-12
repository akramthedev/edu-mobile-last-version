import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const SkeletonCard = ({theme}) => {
  const animation = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animation]);

  return (
    <Animated.View
      style={[
        styles.skeletonCard, 
        {
          backgroundColor : theme === 'light' ? "white"  : "rgb(87, 87, 87)"
        },
        {
          shadowColor : theme === "light" ? "rgb(188, 188, 188)" : "transparent"
        },
        {
          opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.4],
          }),
        },
      ]}
    >
      {
        theme === "light" ? 
        <View style={styles.skeletonContentContainer}>
          <View style={styles.skeletonTextContainer}>
            <View style={[styles.skeletonLine, { width: '40%', height: 16, marginBottom: 8 }]} />
            <View style={styles.skeletonRow}>
              <View style={[styles.skeletonLine, { width: 40, height: 14, marginRight: 13 }]} />
              <View style={[styles.skeletonLine, { width: 60, height: 14 }]} />
            </View>
            <View style={[styles.skeletonLine, { width: '80%', height: 16, marginBottom: 3 }]} />
          </View>
        </View>
        :

        <View style={styles.skeletonContentContainer}>
          <View style={styles.skeletonTextContainer}>
            <View style={[styles.skeletonLineDark, { width: '40%', height: 16, marginBottom: 8 }]} />
            <View style={styles.skeletonRow}>
              <View style={[styles.skeletonLineDark, { width: 40, height: 14, marginRight: 13 }]} />
              <View style={[styles.skeletonLineDark, { width: 60, height: 14 }]} />
            </View>
            <View style={[styles.skeletonLineDark, { width: '80%', height: 16, marginBottom: 3 }]} />
          </View>
        </View>

      }
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  skeletonLineDark: {
    backgroundColor: 'rgb(134, 134, 134)',
    borderRadius: 4,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width : "100%",
    marginBottom: 8,
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
});

export default SkeletonCard;