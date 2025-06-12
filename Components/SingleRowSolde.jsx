import {View, TouchableOpacity, Text, } from 'react-native';


export default function SingleRowSolde({key, theme}) {
    return(
        <View
            key={key}
            style={{
                width : "100%", 
                flexDirection : "row", 
                borderBottomColor : theme === "light" ? "gainsboro" : "#3A3A3A",        
                borderBottomWidth : 1, 
                marginBottom : 10, 
                paddingBottom : 10, 
                justifyContent : "space-between",
            }}
        >
            <View
                style={{
                    flexDirection : "column", 
                }}
            >
                <Text
                    style={{
                        fontFamily : "Inter", 
                        color : theme === "light" ? "#141414" : "#E3E3E3", 
                        fontSize : 14, 
                    }}
                >
                    Abonnement bibliothèque
                </Text>
                <Text
                    style={{
                        fontFamily : "Inter", 
                        color : theme === "light" ? "gray" : "gray", 
                        fontSize : 12.5, 
                    }}
                >
                    Juin 20, 2025 à 16:35
                </Text>
            </View>
            <Text
                style={{
                    fontFamily : "Inter", 
                    color : "rgb(223, 7, 7)", 
                    fontSize : 14, 
                }}
            >
                -150 MAD
            </Text>
        </View>
    )
}
