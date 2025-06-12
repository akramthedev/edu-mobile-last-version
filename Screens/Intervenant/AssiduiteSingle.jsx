import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated, 
    Image, 
    FlatList,
    BackHandler
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../states/ThemeContext";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Feather, Octicons } from '@expo/vector-icons';
import fakeStudents from '../../fakeData/fakeStudentsForAssiduite';
import "../../i18n";  
import { useHistoryStack } from '../../states/HistoryContext';
 


const ToggleButton = React.memo(({ theme, studentId, isPresent, onToggle }) => {
    const animatedValue = useRef(new Animated.Value(isPresent ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isPresent ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isPresent]); 


    const toggleTranslateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 28],
    });

    return (
        <TouchableOpacity onPress={() => onToggle(studentId)} style={styles.container}>
            <Animated.View style={[styles.toggleBackground, {
                backgroundColor: isPresent 
                    ? "#15B96F"   
                    : "#e42d2d"  
            }]}>
                <Animated.View
                    style={[
                        styles.circle,
                        { transform: [{ translateX: toggleTranslateX }] },
                        { backgroundColor: theme === "light" ? "white" : "#e3e3e3" }
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    );
});





const StudentCard = React.memo(({ item, isPresent, theme, onToggle, navigation, data }) => {
    const { pushToHistory } = useHistoryStack();
    return (
        <View 
            style={[
                styles.studentCard, 
                {backgroundColor : theme === "light" ? "white" : "#282828", }, 
                { borderWidth : 1, shadowOffset: { width: 0, height: 7 },shadowRadius: 20,elevation: 5, shadowOpacity: 0.07 },
                { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
                { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
                { backgroundColor : theme === "light" ?  "white" : "#282828"},
            ]}
        >
            <TouchableOpacity style={{
                flexDirection : "column", 
                alignItems: 'center',
            }} 
                onPress={()=>{
                    pushToHistory('SingleStudent2', { data : item, dataOfAssiduite : data });
                    navigation.navigate('SingleStudent2', { data : item, dataOfAssiduite : data });
                }}
            >
                <Image source={{ uri: item.Image }} style={[
                    styles.avatar,
                    { backgroundColor: theme === "light" ? "gainsboro" : "#282828" },
                    { borderColor: theme === "light" ? "gainsboro" : "gray" }
                ]} />
                <View style={styles.studentNameContainer}>
                    <Text style={[styles.studentName, {color : theme === "light" ? "#141414" : "#E3E3E3"}]}>
                        {item.Nom}
                        &nbsp;
                        {item.Prenom}
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.statusBadge]} >
                <ToggleButton
                    theme={theme}
                    studentId={item.Matricule}
                    isPresent={isPresent}
                    onToggle={onToggle}
                />
            </TouchableOpacity>
        </View>
    );
}, (prevProps, nextProps) => {
    return prevProps.isPresent === nextProps.isPresent &&
        prevProps.theme === nextProps.theme &&
        prevProps.item.id === nextProps.item.id;
});

const AssiduiteSingle = ({route, sidebarRef }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [isLoading, setisLoading] = useState(true);
    const { data } = route.params;
    const navigation = useNavigation();
    const [attendanceStatus, setAttendanceStatus] = useState(() =>
        fakeStudents.reduce((acc, student) => ({ ...acc, [student.Matricule]: true }), {})
    );
    const { getPreviousScreen, popFromHistory, pushToHistory } = useHistoryStack();
    
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

    const handleToggle = useCallback((studentId) => {
        setAttendanceStatus(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    }, []);

    useEffect(() => {
        setAttendanceStatus(fakeStudents.reduce((acc, student) => ({ 
            ...acc, 
            [student.Matricule]: true 
        }), {}));
    }, [route.params.data.title, route.params.data.uniqueId]); 

    useFocusEffect(
        useCallback(() => {
            setAttendanceStatus(prev => {
                const allTrue = Object.values(prev).every(v => v);
                return allTrue ? prev : fakeStudents.reduce((acc, student) => ({
                    ...acc,
                    [student.Matricule]: true
                }), {});
            });
            return () => {};
        }, [route.params.data.title, route.params.data.uniqueId])
    );

    const presentCount = Object.values(attendanceStatus).filter(Status => Status).length;
    const absentCount = fakeStudents.length - presentCount;

    const renderItem = useCallback(({ item }) => (
        <StudentCard
            item={item}
            isPresent={attendanceStatus[item.Matricule]}
            theme={theme}
            onToggle={handleToggle}
            navigation={navigation}
            data={route.params.data}
        />
    ), [attendanceStatus, theme]);

 
    return (
        <View style={[styles.containerFFf, { backgroundColor: theme === "light" ? '#f2f2f7' : '#141414' }]} >


            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() =>{
                        pushToHistory("PlanningInterv");
                        navigation.navigate("Authenticated", { screen: "PlanningInterv" });
                    }}
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
                <View style={styles.xxxKKK} >
                    <Text style={[styles.textTitleXX, {color : theme === "light" ? "rgb(39, 39, 39)" : "rgb(203, 203, 203)"}]} >
                        {data.title}
                    </Text> 
                </View>
                <TouchableOpacity 
                    onPress={() => sidebarRef.current.toggleSidebar()}
                    style={[
                        {
                          width : 50, 
                          height : 50, 
                          backgroundColor : "white", 
                          borderRadius : 70, 
                          borderColor : "#EFEFEF", 
                          borderWidth : 1, 
                          shadowColor:"rgb(188, 188, 188)", 
                          shadowOffset: { width: 0, height: 7 },
                          shadowOpacity: 0.07,
                          shadowRadius: 20,
                          elevation: 5,
                          alignItems : "center", 
                          justifyContent : "center", 
                          position : 'absolute', 
                          right : 3, 
                        }, 
                        { shadowColor : theme === "light" ?  "rgb(188, 188, 188)" : "#282828"}, 
                        { borderColor : theme === "light" ?  "#EFEFEF" : "#282828"}, 
                        { backgroundColor : theme === "light" ?  "white" : "#282828"}, 
                    ]} 
                >
                    <Octicons name="three-bars" size={20}   color={theme === "light" ? "rgb(104, 104, 104)" : "#e3e3e3" }    />
                </TouchableOpacity>
            </View>
            
            <View style={[styles.containerOFASS1]}>
                <View style={[styles.containerOFASS1Texttt1View]}>
                    <Text style={[styles.containerOFASS1Texttt1]}>
                        {presentCount}
                    </Text>
                    <Text style={{color: "gray", fontSize: 12}}>
                        Présents
                    </Text>
                </View>
                <View style={{
                    height: 40, 
                    width: 2, 
                    borderRadius: 4, 
                    backgroundColor: theme === "light" ? "gainsboro" : "#303030", 
                    marginLeft: 35, 
                    marginRight: 35
                }} />
                <View style={[styles.containerOFASS1Texttt2View]}>
                    <Text style={[styles.containerOFASS1Texttt2]}>
                        {absentCount}
                    </Text>
                    <Text style={{color: "gray", fontSize: 12}}>
                        Absents
                    </Text>
                </View>
            </View>

            <FlatList
                data={fakeStudents}
                renderItem={renderItem}
                keyExtractor={(item) => item.Matricule}
                numColumns={3}
                removeClippedSubviews 
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={10}  
                maxToRenderPerBatch={5} 
                windowSize={5} 
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.columnWrapper}
            />

        </View>
    );
};

export default AssiduiteSingle;







const styles = StyleSheet.create({
   
    containerFFf : {
        flex : 1, 
        paddingHorizontal : 20
    }, 
    textTitleXX : {
        fontFamily : "InterBold", 
        fontSize : 18, 
        textAlign : "center", 
        height : 39,
    },
    textTitleXX222 : {
        fontFamily : "Inter", 
        fontSize : 13.5, 
        textAlign : "center"
    },

    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 90,
        position : "relative",
        width : "100%"
    },

    headerText : {
        color : "#141414", 
        fontFamily : "JomoFont", 
        fontSize : 22, 
        textAlign : "center", 
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
    xxxKKK : {
        flexDirection : "column", 
        alignItems : "center", 
        justifyContent : "center"
    }, 
    containerOFASS1 : {
        height : 100, 
        marginBottom : 15, 
        width : "100%",
        justifyContent : "center", 
        alignItems : "center", 
        flexDirection : "row"
    },
    containerOFASS1Texttt1 : {
        fontSize : 42, 
        fontFamily : "Inter",
        fontWeight : "bold",
        color : "#15B96F", 
        marginBottom : -5
    },
    containerOFASS1Texttt2 : {
        fontWeight : "bold",
        fontFamily : "Inter",
        fontSize : 42, 
        color : "#e42d2d",
        marginBottom : -5     
    },
    containerOFASS1Texttt1View : {
        flexDirection : "column",
        alignItems : "center"
    },
    containerOFASS1Texttt2View : {
        flexDirection : "column",
        alignItems : "center", 
    },
    listContainer: {
        alignItems: 'center',
    },
    studentCard: {
        alignItems: 'center',
        width : "31%",
        marginBottom : 10,
        paddingTop :10, 
        borderRadius : 10, 
    },
    avatar: {
        width: 60,
        height: 60,
        borderWidth : 1, 
        borderRadius: 40,
    },
    studentName: {
        marginTop: 5,
        fontSize: 12.5,
        height : 33,
        paddingHorizontal : 5, 
        fontFamily: 'InterBold',
        textAlign : "center"
    },
    studentNameContainer : {
        height : "auto", 
        marginVertical : 5, 
        alignItems : "center", 
        justifyContent : "center"
    },
    statusBadge: {
        borderRadius: 12,
        flex : 1,
        alignItems : "center", 
        justifyContent : "center",
        minHeight : 50, 
        width : "100%",
    },
    present: {
        backgroundColor: '#15B96F',
    },
    absent: {
        backgroundColor: '#CD0202',
    },
    statusText: {
        color: 'white',
        fontSize: 12,
    },
    listContainer: {
        paddingHorizontal: 10, 
    },
    columnWrapper: {
        justifyContent: 'space-between',  
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleBackground: {
        width: 60,  
        height: 33, 
        borderRadius: 30, 
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    circle: {
        width: 25.3, 
        height:25.3,
        borderRadius: 21,  
        elevation: 3,  
        shadowColor: '#000',  
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },

});
