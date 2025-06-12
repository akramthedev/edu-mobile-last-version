import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonActivity = ({theme}) => {
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
        <View style={[styles.container, {backgroundColor : theme === "light" ? "transparent" : "#141414"}]}>
        {
            theme === "light" ? 
            <>


            
            <Animated.View
                style={[
                    styles.menuSkeleton2,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.5],
                        }),
                    },
                ]}
            />
            
            
            <View style={{marginBottom : 4,flexDirection : "row", width : "100%", justifyContent : "space-between", }}>

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
                            outputRange: [1, 0.5],
                        }),
                    },
                ]}
            />
            
         
            </>
            :
            <>



            <Animated.View
                style={[
                    styles.menuSkeletonDark2,
                    {
                        opacity: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.5],
                        }),
                    },
                ]}
            />
             
            
            <View style={{marginBottom : 4,flexDirection : "row", width : "100%", justifyContent : "space-between", }} >
            
            
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
   
    textSkeleton: {
        width: '32%',
        height: 45,
        backgroundColor: '#ddd',
        marginBottom: 10,
        borderRadius : 7
    },
    menuSkeleton: {
        width: '100%',
        height : 300, 
        backgroundColor: '#ddd',
        marginBottom: 10,
        borderRadius: 12,
    }, 

    textSkeletonDark: {
        width: '32%',
        height: 45,
        backgroundColor: 'rgb(88, 88, 88)',
        marginBottom: 10,
        borderRadius : 7
    },
    menuSkeletonDark: {
        width: '100%',
        height : 300, 
        backgroundColor: 'rgb(88, 88, 88)',
        marginBottom: 10,
        borderRadius: 12,
    }, 
    menuSkeletonDark2: {
        width: '100%',
        height : 50, 
        backgroundColor: 'rgb(88, 88, 88)',
        marginBottom: 13,
        borderRadius: 12,
    }, 
    menuSkeleton2: {
        width: '100%',
        height : 50, 
        backgroundColor: '#ddd',
        marginBottom: 13,
        borderRadius: 12,
    }
});

export default SkeletonActivity;
