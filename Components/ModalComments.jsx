import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, FlatList, Image, StyleSheet, ScrollView, TextInput } from 'react-native';

const ModalComments = ({ modalVisible, setModalVisible, initialComments, setNumberComments, theme }) => {

    const [replyingTo, setReplyingTo] = useState(null);

    const [commentText, setCommentText] = React.useState('');
    const [data, setData] = React.useState(initialComments);

    
    


    const handleSubmitComment = () => {
        if (commentText.trim()) {
            const newComment = {
                id: Date.now(),  
                user: {
                    name: "You",  
                    photo: "https://media.licdn.com/dms/image/v2/D4E03AQGQmsDhYF9YKg/profile-displayphoto-shrink_200_200/B4EZRdjpS9HAAY-/0/1736736414927?e=2147483647&v=beta&t=2t54nn1TRUB0_gkGS34Q473sm17e38b4nO0CdZVPgsc",  
                },
                description: commentText,
                time: "Just now",
                subComments: [],  
            };
            
            let updatedData = [];
    
            if (replyingTo) {
                updatedData = data.map(item => {
                    if (item.user.name === replyingTo) {
                        
                        const newSubComment = {
                            id: Date.now(),
                            user: { name: "You", photo: "https://media.licdn.com/dms/image/v2/D4E03AQGQmsDhYF9YKg/profile-displayphoto-shrink_200_200/B4EZRdjpS9HAAY-/0/1736736414927?e=2147483647&v=beta&t=2t54nn1TRUB0_gkGS34Q473sm17e38b4nO0CdZVPgsc" },
                            description: commentText,
                            time: "Just now",
                        };
    
                        
                        return {
                            ...item,
                            subComments: [...item.subComments, newSubComment],  
                        };
                    }
                    return item;  
                });
            } else {
                updatedData = [newComment, ...data];   
            }
    
            setData(updatedData);  
            setCommentText(''); 
            setReplyingTo(null);
            setNumberComments(prev => prev + 1);
        }
    };



    const handleAnnuler = ()=>{
        setModalVisible(false)
        setReplyingTo(null);
        setCommentText("");        
    }
    




    

    
    const renderSubComment = ({ item, index, subCommentsLength }) => {
        const isLastSubComment = index === subCommentsLength - 1;
        return (
            <View
                key={item.id.toString()}
                style={[
                    styles.subCommentContainer,
                    isLastSubComment && styles.noBorderBottom,
                    {borderBottomColor : theme === "light" ? "rgb(235, 235, 235)" : "rgb(78, 78, 78)"}
                ]}
            >
                <Image source={{ uri: item.user.photo }} style={[styles.userPhotoSmall, {backgroundColor : theme === "light" ? "rgb(204, 204, 204)" : "rgb(61, 61, 61)"}]} />
                <View style={styles.subCommentContent}>
                    <Text style={[styles.userName, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>{item.user.name}</Text>
                    <Text style={[styles.commentText, {color : theme === "light" ? "#141414" : "rgb(155, 155, 155)"}]}>{item.description}</Text>
                    <Text style={[styles.commentTime,{color : theme === "light" ? "#141414" : "rgb(133, 133, 133)"}]}>{item.time}</Text>
                </View>
            </View>
        );
    };



    const renderComment = ({ item, index }) => {
        const isLastComment = index === data.length - 1;
        return (
            <View style={[styles.commentContainer, isLastComment ? styles.noBorderBottom : {}, {borderBottomColor : theme === "light" ? "rgb(235, 235, 235)" : "rgb(78, 78, 78)"}]}>
                <Image source={{ uri: item.user.photo }} style={[styles.userPhoto, {backgroundColor : theme === "light" ? "rgb(204, 204, 204)" : "rgb(61, 61, 61)"}]} />
                <View style={styles.commentContent}>
                    <Text style={[styles.userName, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>{item.user.name}</Text>
                    <Text style={[styles.commentText, {color : theme === "light" ? "#141414" : "rgb(155, 155, 155)"}]}>{item.description}</Text>
                    <View style={[styles.commentTime,{color : theme === "light" ? "#141414" : "rgb(133, 133, 133)"}]}>
                        <Text style={[styles.commentTime1,{color : theme === "light" ? "#141414" : "rgb(133, 133, 133)"}]}>{item.time}</Text>
                        <TouchableOpacity onPress={() => setReplyingTo(item.user.name)} style={[styles.commentTime2,{color : theme === "light" ? "#141414" : "rgb(133, 133, 133)"}]}>
                            <Text style={[styles.commentTime2,]}>RÉPONDRE</Text>
                        </TouchableOpacity>
                    </View>
                    {item.subComments && item.subComments.length > 0 && (
                        <View>
                            {item.subComments.map((subItem, subIndex) => renderSubComment({
                                item: subItem,
                                index: subIndex,
                                subCommentsLength: item.subComments.length
                            }))}
                        </View>
                    )}
                </View>
            </View>
        );
    };



    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => handleAnnuler()}
        >
                <View style={styles.centeredView}>
                    <View style={styles.darkOverlay} />
                        <View style={[
                            styles.modalView, 
                            {backgroundColor : theme === "light" ? "white" : "#141414"},
                            {borderColor : theme === "light" ? "white" : "rgb(34, 34, 34)"},
                            {borderWidth : theme === "light" ? 0 : 1}
                        ]}>
                            <TouchableOpacity onPress={() => handleAnnuler()} style={[styles.header, {borderBottomColor : theme === "light" ? "rgb(234, 234, 234)" : "rgb(67, 67, 67)"}]}>
                                <Text style={[
                                    styles.modalTextTitle, 
                                    {
                                        color : theme === "light" ? "#141414" : "#E3E3E3"
                                    }
                                ]}>Commentaires : 6</Text>
                                <View style={styles.closeButton}>
                                    <Ionicons name="close" size={20} color={theme === "light" ? "#141414" : "#E3E3E3"} />
                                </View>
                            </TouchableOpacity>
                            <FlatList
                                data={data}
                                keyExtractor={item => item.id.toString()}
                                renderItem={renderComment}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            />
                            <View style={[replyingTo ? styles.inputContainer2222 : styles.inputContainer, {backgroundColor : theme === "light" ? "white" : "#141414"}, {borderTopColor : theme === "light" ? "rgb(234, 234, 234)" : "rgb(67, 67, 67)"}]}> 
                                {replyingTo && (
                                    <TouchableOpacity onPress={() => setReplyingTo(null)} style={styles.replyingToTag}>
                                        <Text style={styles.replyingToText}>{replyingTo}</Text>
                                        <View  >
                                            <Ionicons name="close" size={13} color="#fff" />
                                        </View>
                                    </TouchableOpacity>
                                )}
                                <TextInput
                                    style={[styles.input, replyingTo ? { height : 70 } : {height : 60}, {backgroundColor : theme === "light" ? "white" : "#141414"}, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}  
                                    placeholder={replyingTo ? `Répondre à ${replyingTo}...` : "Ajouter un commentaire..."}
                                    placeholderTextColor={theme === "light" ? "#999" : "#E3E3E3"}
                                    value={commentText}
                                    onChangeText={setCommentText}
                                />
                                <TouchableOpacity style={styles.sendButton} onPress={handleSubmitComment}>
                                    <Ionicons name="send" size={20} color={commentText.length === 0 || commentText === null ?"rgb(215, 215, 215)" : "#15B99B"} />
                                </TouchableOpacity>
                            </View>
                        </View>
                </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalView: {
        borderRadius: 20,
        width: '92%',
        height: '96%',
        paddingHorizontal: 15,
        paddingTop: 10,
        elevation: 5,
        position : "relative", 
        paddingBottom : 75
    },
    header: {
        width: '100%',
        height: 45,
        borderBottomWidth: 1,
        justifyContent: 'center',
        position: 'relative',
    },
    modalTextTitle: {
        fontSize: 16,
        fontFamily: 'InterBold',
        color: '#000',
        letterSpacing: 0.15,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 12,
        zIndex : 99
    },
    scrollView: {
        flex: 1,
    },
    commentList: {
        paddingBottom: 20,
    },
    commentContainer: {
        flexDirection: 'row',
        marginTop: 15,
        borderBottomWidth : 1, 
        paddingBottom : 10
    },
    userPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "rgb(206, 206, 206)",
    },
    commentContent: {
        flex: 1,
    },
    userName: {
        fontSize: 15,
        fontFamily: 'InterBold',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
        fontFamily: 'Inter',
        marginBottom: 4,
    },
    commentTime: {
        fontSize: 11,
        fontFamily: 'Inter',
        flexDirection : "row", 
        justifyContent : "space-between"
    },
    commentTime2: {
        fontSize: 11,
        fontFamily: 'InterBold',
        color: '#15B99B',
        flexDirection : "row", 
        justifyContent : "space-between", 
        textDecorationLine : "underline", 
    },
    commentTime1: {
        fontSize: 11,
        fontFamily: 'Inter',
        color: 'rgb(155, 155, 155)',
        flexDirection : "row", 
        justifyContent : "space-between"
    },
    subCommentContainer: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 6,
        paddingLeft: 0,
        marginLeft: 0,
        borderBottomColor: "rgb(235, 235, 235)",
        borderBottomWidth: 1,
    },
    noBorderBottom: {
        borderBottomWidth: 0,  
    },
    userPhotoSmall: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: "rgb(235, 235, 235)",
        borderRadius: 15,
        marginRight: 10,
    },
    subCommentContent: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        bottom : 1, 
        left : 15, 
        zIndex : 1, 
        height : 74, 
        width : "100%",
        position : "absolute",
    },
    inputContainer2222: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        bottom : 1, 
        left : 15, 
        zIndex : 1, 
        width : "100%",
        height : 80,
        position : "absolute",
        backgroundColor : "white",
    },
    input: {
        flex: 1,

        borderRadius: 20,
        marginRight: 10,
        paddingRight : 10, 
        paddingLeft : 10
    },
    sendButton: {
        padding: 10,
    },
    replyingToTag: {
    position: 'absolute',
    left: 8,
    top: 3,
    backgroundColor: '#15B99B',
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
},
replyingToText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Inter',
    marginRight: 5,
},
});

export default ModalComments;