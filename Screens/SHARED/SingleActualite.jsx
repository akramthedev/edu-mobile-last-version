import React, { useState, useEffect, useCallback } from 'react';
import tinycolor from "tinycolor2";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    BackHandler,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ModalComments from '../../Components/ModalComments';
import { useTheme } from '../../states/ThemeContext';
import { useHistoryStack } from '../../states/HistoryContext';

const SingleActualite = ({ route }) => {
    const { theme } = useTheme();
    const { item, isLiked, likes } = route.params;
    const [isLoading, setisLoading] = useState(true);
    const [isLikedByTheUser, setisLikedByTheUser] = useState(null);
    const [numberLikes, setNumberLikes] = useState(null);
    const [numberComments, setNumberComments] = useState(null);
    const [dataSingleAct, setDataSingleAct] = useState(null);
    const [isCommentsClicked, setisCommentsClicked] = useState(false);
    const [commentsData, setcommentsData] = useState(null);
    const navigation = useNavigation();
 

    
        const { getPreviousScreen, popFromHistory } = useHistoryStack();
                const handleBackPress = () => {
                const previous = getPreviousScreen();
                if (previous) {
                    popFromHistory();
                    navigation.navigate(previous.screenName, previous.params || {});
                    return true;  
                } else {
                    navigation.navigate("Actualite");  
                    return true;  
                }
                };
                useEffect(() => {
                    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
                    return () => backHandler.remove();
                }, []);


    useFocusEffect(
        useCallback(() => {
            setisLoading(true);
            
            setDataSingleAct(item);
            setNumberLikes(parseInt(likes));
            setNumberComments(parseInt(item.comments));
    
            setisLikedByTheUser(isLiked);
             
    
            setisLoading(false);
    
        }, [item.id]) 
    );



    useFocusEffect(
        useCallback(() => {
          const fetchComments = async () => {
            const comments = item.commentsData;
            setcommentsData(comments);
            console.log(comments);
          };
          fetchComments();
        }, [item.commentsData])
      );


   

    const LikeActuality = ()=>{
        setisLikedByTheUser(!isLikedByTheUser);
        if(isLikedByTheUser){
            setNumberLikes(numberLikes-1)
        }
        else{
            setNumberLikes(numberLikes+1)
        }
    }




 
    const startWavyAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 390,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 390,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };


  
    return (
        <View  key={item.id}  style={[styles.container, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]}>
            
            {
                
                commentsData !== null && 
                <ModalComments
                    modalVisible={isCommentsClicked}
                    setModalVisible={setisCommentsClicked}
                    initialComments={commentsData}  
                    setCommentsData={setcommentsData} 
                    setNumberComments={setNumberComments} 
                    theme={theme} 
                />

            }

            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() =>{navigation.goBack()}}
                    style={[
                        styles.buttonimageUserIcon3, 
                        { borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 },
                        { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
                        { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
                        { backgroundColor : theme === "light" ?  "white" : "#282828"},
                    ]} 
                >
                    <Feather name='chevron-left' size={26} color={theme === "light" ? "rgb(104, 104, 104)" : "#e3e3e3" } />
                </TouchableOpacity>
                {
                    isLikedByTheUser !== null && 
                        <TouchableOpacity 
                            onPress={() =>{LikeActuality()}}
                            style={isLikedByTheUser ? styles.buttonimageUserIcon : theme === "light" ? styles.buttonimageUserIcon0 : styles.buttonimageUserIcon001} 
                        >
                            {
                                isLikedByTheUser ? 
                                <>
                                {
                                    theme === "light" ? <AntDesign name='heart' size={20} color="white" />
                                    :
                                    <AntDesign name='heart' size={20} color="#141414" />
                                }
                                </>
                                :
                                <Feather name='heart' size={23} color={theme === "light" ? "rgb(104, 104, 104)" : "#e3e3e3" } />
                            }
                        </TouchableOpacity>
                }
                <TouchableOpacity 
                    onPress={() =>{
                        setisCommentsClicked(true);
                    }}
                    style={[
                        styles.buttonimageUserIcon2, 
                        { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
                        { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
                        { backgroundColor : theme === "light" ?  "white" : "#282828"}, 
                    ]} 
                >
                    <AntDesign name='message1' size={22} color={theme === "light" ? "rgb(104, 104, 104)" : "#e3e3e3" } />
                </TouchableOpacity>
            </View>

            <ScrollView style={[styles.containerOftextSingleX, ]}   showsVerticalScrollIndicator={false}>
                
                <Text style={[
                    styles.text1X, 
                    {color : theme === "light" ? "rgb(81, 81, 81)" : "#E3E3E3"}
                ]} >
                {
                    dataSingleAct && dataSingleAct.title
                }
                </Text> 

                <View style={
                     styles.tagsContainer}
                >
                     {
                    
                       item.tags.map((tag, index) => {
                         const bgColor = tinycolor(tag.backgroundColor);
                         const highContrastBg = bgColor.isDark() ? bgColor.lighten(10).toString() : bgColor.darken(3).toString();
                
                         return (
                           <View key={tag.id} style={[
                             styles.SingletagContainer, 
                             { backgroundColor: highContrastBg }
                           ]}>
                             <Text 
                               key={index} 
                               style={[
                                 styles.tag, 
                                 { color: tag.color }
                               ]}
                             >
                               {tag.name}
                             </Text>
                           </View>
                         );
                       })
                     }        
                </View>

                <View style={styles.View2x} >
                    <Text>
                       <Text style={[
                            styles.text3X, 
                            {color : theme === "light" ? "rgb(81, 81, 81)" : "rgb(197, 197, 197)"}
                        ]} >  
                            {dataSingleAct && numberLikes} likes&nbsp;&nbsp;|&nbsp;&nbsp;
                        </Text>
                        <Text style={[
                            styles.text3X, 
                            {color : theme === "light" ? "rgb(81, 81, 81)" : "rgb(197, 197, 197)"}
                        ]} >
                            {dataSingleAct && numberComments} commentaires
                        </Text>
                    </Text>
                    <Text style={[
                            styles.text3X, 
                            {color : theme === "light" ? "rgb(81, 81, 81)" : "rgb(197, 197, 197)"}
                        ]} >
                        {
                            dataSingleAct && dataSingleAct.date
                        }
                    </Text>
                </View> 
                
                <View style={styles.imageBakcground} >
                    <Image
                        source={{ uri : dataSingleAct && dataSingleAct.image }}
                        style={styles.imageRealBakc}
                    />
                </View>

                <Text style={[
                    styles.text7X, 
                    {color : theme === "light" ? "rgb(81, 81, 81)" : "rgb(197, 197, 197)"}
                ]} >
                    {dataSingleAct &&
                        dataSingleAct.description.split("\n").map((line, index) => (
                        <Text key={index}>
                            {line}
                            {"\n"}{"\n"}
                        </Text>
                    ))}
                </Text>
            </ScrollView>

        </View>
    );
};

export default SingleActualite;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 85,
        top: 25,
        alignItems : "center",
        position : "relative",
        width : "100%"
    },

    headerText : {
        color : "#141414", 
        fontFamily : "JomoFont", 
        fontSize : 22, 
        textAlign : "center", 
    },
    buttonimageUserIcon : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        right: 3, 
        borderRadius : 50, 
        backgroundColor :"#15B99B", 
        alignItems : "center", 
        justifyContent : "center"
    }, 

    buttonimageUserIcon0 : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        right: 3, 
        borderRadius : 50, 
        backgroundColor :"white", 
        alignItems : "center", 
        borderWidth : 1, 
        borderColor :"rgb(226, 226, 226)",
        justifyContent : "center"
    }, 
    buttonimageUserIcon001 : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        right: 3, 
        borderRadius : 50, 
        backgroundColor :"#282828", 
        alignItems : "center", 
        borderWidth : 1, 
        borderColor :"#282828",
        justifyContent : "center"
    }, 

    buttonimageUserIcon2 : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        right: 63, 
        borderRadius : 50, 
        backgroundColor :"white", 
        alignItems : "center", 
        borderWidth : 1, 
        borderColor :"rgb(226, 226, 226)",
        justifyContent : "center"
    }, 

    buttonimageUserIcon3 : {
        height : 50, 
        width : 50, 
        overflow :"hidden", 
        position : "absolute", 
        left: 3, 
        borderRadius : 50, 
        backgroundColor :"white", 
        alignItems : "center", 
        borderWidth : 1, 
        borderColor :"rgb(226, 226, 226)",
        justifyContent : "center"
    }, 
    containerOftextSingleX : {
        paddingLeft : 3, 
        paddingRight : 3, 
        marginTop : 14,
    },  
    text1X : {
        fontFamily : "Inter", 
        fontSize : 24, 
        fontWeight : "bold", 
        marginTop : 10, 
        marginBottom : 10,
    },
    imageBakcground : {
        width : "100%", 
        height : 167,
        borderRadius : 9,
        marginTop : 30, 
        backgroundColor :"rgb(233, 233, 233)",
        marginBottom : 30, 
        overflow : "hidden"
    },  
    imageRealBakc : {
        width : "100%", 
        height : "100%", 
        objectFit : "cover"
    }, 
    text3X : {
        color : "rgb(133, 133, 133)", 
        fontSize : 12, 
        fontFamily : "Inter"
    },
    text7X : {
        fontSize : 14.5, 
        fontFamily : "Inter", 
        marginBottom : 15
    },
    View2x : {
        width : "100%", 
        marginTop : 10, 
        justifyContent : "space-between", 
        flexDirection : "row"
    }, 
    tagsContainer: {
        flexDirection: "row",
        flexWrap : "wrap",
        gap : 6
      },
      SingletagContainer : {
        flexDirection: "row",
        marginRight : 5, 
        borderRadius : 7,
        marginTop: 0
      },
      tag: {
        fontFamily : "InterBold", 
        fontSize: 12.67,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 8,
      },

      commentContainer: {
        flexDirection: "row",
        marginTop: 15,
        alignItems: "flex-start",
    },
    userPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        padding: 10,
        borderRadius: 10,
    },
    userName: {
        fontSize: 14,
        fontFamily: "InterBold",
    },
    commentText: {
        fontSize: 14,
        fontFamily: "Inter",
        marginTop: 5,
    },
    commentTime: {
        fontSize: 12,
        color: "gray",
        marginTop: 5,
    },
    subCommentContainer: {
        flexDirection: "row",
        marginTop: 10,
        paddingLeft: 20,
    },
    userPhotoSmall: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
});