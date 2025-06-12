import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonActivity = ({index , theme}) => {
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
        <View key={index} style={[styles.container, {backgroundColor : theme === "light" ? "transparent" : "#141414"}]}>
        {
            theme === "light" ? 
            <>
            
            
            <View style={{marginBottom : 38,flexDirection : "row", width : "100%", justifyContent : "space-between", }}>

            <Animated.View
                style={[
                    styles.textSkeleton,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.4],
                        }),
                    },
                ]}
            />
            
            <Animated.View
                style={[
                    styles.textSkeleton,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.3],
                        }),
                    },
                ]}
            />
                            
                            </View>

            
            <Animated.View
                style={[
                    styles.menuSkeleton,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.3],
                        }),
                    },
                ]}
            />
            
            <Animated.View
                style={[
                    styles.menuSkeleton,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.5],
                        }),
                    },
                ]}
            />
            
            <Animated.View
                style={[
                    styles.menuSkeleton,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.24],
                        }),
                    },
                ]}
            />

 


            <Animated.View
                style={[
                    styles.menuSkeleton,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.46],
                        }),
                    },
                ]}
            />
            </>
            :
            <>
             
            
            <View style={{marginBottom : 38,flexDirection : "row", width : "100%", justifyContent : "space-between", }} >
            <Animated.View
                style={[
                    styles.textSkeletonDark,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.5],
                        }),
                    },
                ]}
            />
            
            <Animated.View
                style={[
                    styles.textSkeletonDark,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.3],
                        }),
                    },
                ]}
            />
            </View>
            
            <Animated.View
                style={[
                    styles.menuSkeletonDark,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.5],
                        }),
                    },
                ]}
            />
            
            <Animated.View
                style={[
                    styles.menuSkeletonDark,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.3],
                        }),
                    },
                ]}
            />
            
            <Animated.View
                style={[
                    styles.menuSkeletonDark,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.4],
                        }),
                    },
                ]}
            />

 


            <Animated.View
                style={[
                    styles.menuSkeletonDark,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.4],
                        }),
                    },
                ]}
            />
            </>
        }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems : "center", 
        justifyContent : "center", 
        paddingTop : 19, 
    },
    imageSkeleton: {
        width: 105,
        height: 105,
        backgroundColor: '#ddd',
        borderRadius: 99,
        marginBottom: 20,
    },
    textSkeleton: {
        width: '48%',
        height: 45,
        backgroundColor: '#ddd',
        marginBottom: 10,
        borderRadius : 7
    },
    textSkeleton2: {
        width: '50%',
        height: 20,
        backgroundColor: '#ddd',
        marginBottom: 30,
    },
    menuSkeleton: {
        width: '100%',
        height: 60,
        backgroundColor: '#ddd',
        marginBottom: 10,
        borderRadius: 12,
    }, 
    



    imageSkeletonDark: {
        width: 105,
        height: 105,
        backgroundColor: 'rgb(88, 88, 88)',
        borderRadius: 99,
        marginBottom: 20,
    },
    textSkeletonDark: {
        width: '48%',
        height: 45,
        backgroundColor: 'rgb(88, 88, 88)',
        marginBottom: 10,
        borderRadius : 7
    },
    textSkeleton2Dark: {
        width: '50%',
        height: 20,
        backgroundColor: 'rgb(88, 88, 88)',
        marginBottom: 30,
        borderRadius : 7
    },
    menuSkeletonDark: {
        width: '100%',
        height: 52,
        backgroundColor: 'rgb(88, 88, 88)',
        marginBottom: 10,
        borderRadius: 12,
    }
});

export default SkeletonActivity;
