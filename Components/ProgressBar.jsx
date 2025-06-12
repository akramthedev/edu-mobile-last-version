import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProgressBar = ({ score,  maxScore, theme, title }) => {
  const progress = Math.min(score / maxScore, 1);  

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={[styles.score,  {color : theme ==="light" ? "#141414" : "#E3E3E3" }]}>{parseInt(score)}</Text>
        <Text style={[styles.outOf, {color : theme ==="light" ? "#141414" : "#E3E3E3" }]}> / {maxScore}&nbsp;&nbsp;{title}</Text>
      </View>
      <View style={[styles.barContainer, {backgroundColor : theme === "light" ? "rgb(231, 231, 231)" :"#333" }]}>
        <LinearGradient
          colors={['rgb(19, 148, 126)', '#15B99B', '#3cf3d1', "#acfff0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progress, { width: `${progress * 100}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 12,
    width: '100%',
  },
  title: {
    fontSize: 14,
    fontFamily : "Inter"
},
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  score: {
    fontSize: 14,
    fontFamily : "Inter"
},
  outOf: {
    fontSize: 14,
    fontFamily : "Inter"
  },
  barContainer: {
    height: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 20,
    borderRightWidth : 1, 
    borderRightColor : "rgb(44, 229, 195)"
  },
});

export default ProgressBar;
