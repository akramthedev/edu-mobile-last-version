import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { AnimatedRegion } from 'react-native-maps';


const fakePath = [
  { latitude: 37.7749, longitude: -122.4194 },
  { latitude: 37.7750, longitude: -122.4184 },
  { latitude: 37.7751, longitude: -122.4174 },
  { latitude: 37.7752, longitude: -122.4164 },
  { latitude: 37.7753, longitude: -122.4154 },
  { latitude: 37.7754, longitude: -122.4144 },
];

const ETA_SECONDS = 12; // Fake ETA

export default function Maps() {
  const [position, setPosition] = useState(fakePath[0]);
  const [eta, setEta] = useState(ETA_SECONDS);
  const mapRef = useRef(null);
  const indexRef = useRef(0);
  const animatedPosition = useRef(
    new AnimatedRegion({
      latitude: fakePath[0].latitude,
      longitude: fakePath[0].longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  ).current;

  
  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % fakePath.length;
      const nextPos = fakePath[indexRef.current];

      // Animate Marker
      Animated.timing(animatedPosition, {
        toValue: nextPos,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      setPosition(nextPos);

      // Animate camera
      mapRef.current?.animateToRegion({
        ...nextPos,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Countdown ETA
      setEta((prev) => (prev > 0 ? prev - 2 : 0));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚚 Your Delivery is on the Way</Text>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...position,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Polyline coordinates={fakePath} strokeWidth={4} strokeColor="#2a9df4" />
        <Marker.Animated
          coordinate={animatedPosition}
          title="Delivery Van"
          description="In Transit"
        />
      </MapView>

      <View style={styles.card}>
        <Text style={styles.cardText}>Estimated Time of Arrival: ⏱ {eta}s</Text>
        <Text style={styles.status}>
          {eta > 0 ? '🛣 In Transit' : '✅ Delivered'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 180,
  },
  card: {
    backgroundColor: '#ffffffdd',
    margin: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardText: {
    fontSize: 18,
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: '#2a9d8f',
    fontWeight: 'bold',
  },
});
