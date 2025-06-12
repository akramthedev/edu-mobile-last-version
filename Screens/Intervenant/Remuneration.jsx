import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView, 
    Animated, 
    BackHandler, 
    useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../states/States';
import { useCopilot } from "react-native-copilot";
import { useFonts } from 'expo-font';
import {  Octicons } from '@expo/vector-icons';
import { useLanguage } from '../../states/LanguageContext';
import { useTheme } from '../../states/ThemeContext';
import {  useNavigation } from '@react-navigation/native';
import { useHistoryStack } from '../../states/HistoryContext';
import "../../i18n";  
import { LineChart } from 'react-native-gifted-charts';
import lineData from "../../fakeData/lineData";
import transactions from "../../fakeData/transactions";



    const getAnimationDuration = (flattenedChartData) => {
        if (!Array.isArray(flattenedChartData) || flattenedChartData.length === 0) {
            return 1000;
        }
        const length = flattenedChartData.length;
        const groupCount = Math.floor(length / 12); 
        console.log("Group count:", groupCount);
        if (groupCount >= 1 && groupCount <= 9) {
            const duration = 1000 + (groupCount - 1) * 1000;
            console.warn("Animation duration:", duration);
            return duration;
        }
        return 9000;
    };

  
  


const Remuneration = ({route, sidebarRef}) => {

    const { width } = useWindowDimensions();
    const spacing = 100;
    const itemsPerMonth = 4; 
    const ref = useRef(null)
    const scrollRef = useRef(null);
    const [refresh, setrefresh] = useState(true);
    const { 
        isCopilotActive, 
    } = useCopilot();    
    const { t } = useTranslation();
    const {theme} = useTheme();
    const {language} = useLanguage();
    const [isLoading, setisLoading] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;  
    const navigation = useNavigation();
    const { getPreviousScreen, popFromHistory, pushToHistory } = useHistoryStack();
    const [data, setData] = useState(null);
    const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ];
    const [selectedYearIndex, setSelectedYearIndex] = useState(0);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
    const yearList = Object.keys(lineData);
    const flattenedChartData = [];
    const now = Date.now();
    const today = new Date();
    const timestamps = flattenedChartData.map(d => d.timestamp);
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);
    const nowRelative = (now - minTimestamp) / (maxTimestamp - minTimestamp);
    const chartWidth = flattenedChartData.length * spacing;
    const xPosition = nowRelative * chartWidth;
    const currentMonthNOW = monthNames[today.getMonth()];
    const currentYearNOW  = String(today.getFullYear());      
    let nowIndex; 
    const displayedYear = yearList[selectedYearIndex];
    const displayedMonth = monthNames[selectedMonthIndex];

    
    const getNowIndex = (data) => {
        const now = Date.now();
        for (let i = 0; i < data.length - 1; i++) {
          const t1 = data[i].timestamp;
          const t2 = data[i + 1].timestamp;
      
          if (now >= t1 && now <= t2) {
            const ratio = (now - t1) / (t2 - t1);
            return i + ratio; 
          }
        }
        return -1; 
      };


      Object.keys(lineData).forEach(year => {
        monthNames.forEach(month => {
          const points = lineData[year][month] || [];
      
          const isDisplayed = (year === displayedYear && month === displayedMonth);
      
          points.forEach(point => {
            flattenedChartData.push({
              ...point,
              year,
              month,
              label: point.label || month,
              labelTextStyle: {
                color: isDisplayed ? 'white' : 'white',
                fontSize: isDisplayed ? 12 : 12,
                fontFamily : isDisplayed ? "Inter" : "Inter", 
                backgroundColor : isDisplayed ?  "rgb(14, 156, 130)" : "transparent", 
                borderRadius : isDisplayed ? 30 : 5, 
                borderWidth : isDisplayed ? 1 : 0,
                borderColor : isDisplayed ? "white" : "transparent",  
                width : isDisplayed ? 66 : null, 
                height : isDisplayed ? 22 : null,
                paddingTop : isDisplayed ? 2 : null,
                marginTop : isDisplayed ? -2 : 0,
              },
            });
          });
        });
      });


    useEffect(() => {        
        if (Object.keys(lineData).length > 0 && !isLoading) {
            nowIndex = getNowIndex(flattenedChartData);
            const today = new Date();
            const currentMonthName = monthNames[today.getMonth()];
            const currentYear = today.getFullYear().toString();
        
            const yearIndex = yearList.findIndex(y => y === currentYear);
            const monthIndex = monthNames.findIndex(m => m === currentMonthName);
        
            if (yearIndex !== -1 && monthIndex !== -1) {
                setSelectedYearIndex(yearIndex);
                setSelectedMonthIndex(monthIndex);
                scrollToMonthInYear(currentYear, currentMonthName);
            }
        }
    }, [isLoading, refresh]);

    
    const getDataIndexForMonth = (targetYear, targetMonth) => {
        return flattenedChartData.findIndex(
          (item) => item.year === targetYear && item.month === targetMonth
        );
    };

     
 

    const scrollToMonthInYear = (year, month) => {
        const index = getDataIndexForMonth(year, month);
        if (index !== -1) {
            const x = index * spacing;
            scrollRef.current?.scrollTo({ x, animated: true });
        }
    };
     
        

        const handleNextMonth = () => {
            const newMonthIndex = selectedMonthIndex + 1;
            if (newMonthIndex >= 12) {
              if (selectedYearIndex < yearList.length - 1) {
                setSelectedYearIndex(selectedYearIndex + 1);
                setSelectedMonthIndex(0);
                scrollToMonthInYear(yearList[selectedYearIndex + 1], monthNames[0]);
              }
            } else {
              setSelectedMonthIndex(newMonthIndex);
              scrollToMonthInYear(yearList[selectedYearIndex], monthNames[newMonthIndex]);
            }
          };
          
          const handlePreviousMonth = () => {
            const newMonthIndex = selectedMonthIndex - 1;
            if (newMonthIndex < 0) {
              if (selectedYearIndex > 0) {
                setSelectedYearIndex(selectedYearIndex - 1);
                setSelectedMonthIndex(11);
                scrollToMonthInYear(yearList[selectedYearIndex - 1], monthNames[11]);
              }
            } else {
              setSelectedMonthIndex(newMonthIndex);
              scrollToMonthInYear(yearList[selectedYearIndex], monthNames[newMonthIndex]);
            }
          };



          const getCurrentRevenue = () => {
            const year = yearList[selectedYearIndex];
            const month = monthNames[selectedMonthIndex];
            const monthData = lineData[year]?.[month];
          
            if (!monthData) return 0;
          
            return monthData.reduce((sum, item) => sum + item.value, 0);
          };
          

          const getCurrentHoursDone = () => {
            const year = yearList[selectedYearIndex];
            const month = monthNames[selectedMonthIndex];
            const monthData = lineData[year]?.[month];
          
            if (!monthData) return 0;
          
            return monthData.reduce((sum, item) => sum + item.hours, 0);
          };
          

        

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

    useEffect(() => {
        startWavyAnimation();  
        
        const fetchData = () => {
            setisLoading(true);
            setData([{hello : "hello"}]);
            setTimeout(() => {
                setisLoading(false);
            }, 1000);
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        startWavyAnimation();
        return () => animation.stopAnimation(); 
    }, []);


    return(
        <View style={{
            backgroundColor: theme === "light" ? '#f2f2f7' : '#141414',
            flexDirection : "column", 
            flex : 1,
            position : "relative"
        }} >
            <View   style={[styles.container]}>
            {
                isLoading ?    
                
                <LinearGradient
                    start={{ x: 1, y: 0 }}  
                    end={{ x: 0, y: 1 }}     
                    style={styles.gradientBox2}
                    colors={[
                        "rgb(21, 153, 123)",   
                        "rgb(12, 88, 72)",    
                        "rgb(4, 40, 33)"      
                      ]}
                >
                    <TouchableOpacity 
                                        onPress={() => sidebarRef.current.toggleSidebar()}
                                        style={[
                                            {
                                            width : 50,     
                                            height : 50, 
                                            backgroundColor : "rgba(255, 255, 255, 0.30)", 
                                            borderRadius : 70, 
                                            alignItems : "center", 
                                            justifyContent : "center", 
                                            zIndex : 10,
                                            top : 45, 
                                            position: "absolute",
                                            right : 20
                                          }, 
                                        ]} 
                                    >
                                        <Octicons name="three-bars" size={18}   color="white"    />
                                    </TouchableOpacity>
                    <Text style={{color : "white"}} >
                        Chargement des données...
                    </Text>
                </LinearGradient>
                :
                <>
                    {flattenedChartData.length === 0 ? 
                    (
                        <LinearGradient
                            start={{ x: 1, y: 0 }}  
                            end={{ x: 0, y: 1 }}     
                            style={styles.gradientBox2}
                            colors={[
                                "rgb(21, 153, 123)",   
                                "rgb(12, 88, 72)",    
                                "rgb(4, 40, 33)"      
                              ]}
                        >
                            <TouchableOpacity 
                                        onPress={() => sidebarRef.current.toggleSidebar()}
                                        style={[
                                            {
                                            width : 50,     
                                            height : 50, 
                                            backgroundColor : "rgba(255, 255, 255, 0.30)", 
                                            borderRadius : 70, 
                                            alignItems : "center", 
                                            justifyContent : "center", 
                                            zIndex : 10,
                                            top : 45, 
                                            position: "absolute",
                                            right : 20
                                          }, 
                                        ]} 
                                    >
                                        <Octicons name="three-bars" size={18}   color="white"    />
                                    </TouchableOpacity>
                            <Text style={{
                                fontFamily : "Inter", 
                                color : "white",    
                                fontSize  : 14
                            }}>{t("noResultsFound2")}</Text>  
                        </LinearGradient>
                    )
                    :
                    (
                            <LinearGradient
                                start={{ x: 1, y: 0 }}  
                                end={{ x: 0, y: 1 }}     
                                style={styles.gradientBox}
                                colors={[
                                    "rgb(21, 153, 123)",   
                                    "rgb(12, 88, 72)",    
                                    "rgb(4, 40, 33)"      
                                  ]}
                            >
                                <View style={styles.header}>
                                    <View 
                                        style={{
                                            height : "auto",
                                            flex :1,  
                                            flexDirection : "column", 
                                        }}
                                    >
                                        <View
                                            style={{
                                                height : 60, 
                                                alignItems : "center", 
                                                justifyContent : "center",
                                                flexDirection : "column", 
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width : "auto", 
                                                    height : 60, 
                                                    flexDirection : "row", 
                                                    alignItems : "center",
                                                    justifyContent : "space-between"
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={handlePreviousMonth}
                                                    style={{
                                                        height : 40, 
                                                        width : 40, 
                                                        marginRight : 10, 
                                                        alignItems : 'center',
                                                        borderRadius : 40, 
                                                        backgroundColor : "rgba(255, 255, 255, 0.15)", 
                                                        justifyContent : "center"
                                                        
                                                    }}
                                                >
                                                    <Octicons 
                                                        name='chevron-left'
                                                        size={18}
                                                        color="white"
                                                    />
                                                </TouchableOpacity>
                                                <Text style={{
                                                    fontFamily : 'InterMedium', 
                                                    fontSize : 14, 
                                                    color : "white"
                                                }} >
                                                    {monthNames[selectedMonthIndex].slice(0, 3)}
                                                    &nbsp;
                                                    {yearList[selectedYearIndex]}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={handleNextMonth}
                                                    style={{
                                                        height : 40, 
                                                        width : 40, 
                                                        marginLeft : 10,
                                                        borderRadius : 40, 
                                                        alignItems : 'center',
                                                        backgroundColor : "rgba(255, 255, 255, 0.15)",  
                                                        justifyContent : "center"
                                                        
                                                    }}
                                                >
                                                    <Octicons 
                                                        name='chevron-right'
                                                        size={18}
                                                        color="white"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection : "row",
                                                justifyContent : "space-between",
                                            }}
                                        >

                                            <View
                                                style={{
                                                    height : 85,
                                                    marginTop : 30, 
                                                    alignItems : "flex-start", 
                                                    flexDirection : "row",
                                                    justifyContent : "center",
                                                    flexDirection : "column", 
                                                    position : "relative"
                                                }}
                                            >
                                                <Text style={{
                                                    color : "white", 
                                                    fontFamily : 'Inter', 
                                                    fontSize : 14, 
                                                    letterSpacing : 0.5 ,
                                                    marginBottom : 3,
                                                    textAlign : "left", 
                                                }} >
                                                    Revenues mensuelles
                                                </Text>
                                                <Text style={{
                                                    color : "white", 
                                                    fontFamily : 'InterBold', 
                                                    fontSize : 33 , 
                                                    textAlign : "left", 
                                                }} >
                                                    {getCurrentRevenue().toLocaleString('fr-FR', { minimumFractionDigits: 0 })}&nbsp;MAD
                                                </Text>
                                            </View>

                                            <View
                                                style={{
                                                    height : 85,
                                                    marginTop : 30, 
                                                    alignItems : "flex-start", 
                                                    justifyContent : "center",
                                                    flexDirection : "column", 
                                                    position : "relative"
                                                }}
                                            >
                                                <Text style={{
                                                    color : "white", 
                                                    fontFamily : 'Inter', 
                                                    fontSize : 14, 
                                                    letterSpacing : 0.5 ,
                                                    textAlign : "right", 
                                                    marginBottom : 3, 
                                                    width : "100%", 
                                                }} >
                                                    Heures totales
                                                </Text>
                                                <Text style={{
                                                    color : "white", 
                                                    fontFamily : 'InterBold', 
                                                    textAlign : "right",
                                                    width : "100%", 
                                                    fontSize : 33 , 
                                                }} >
                                                    {getCurrentHoursDone()}
                                                </Text>
                                            </View>

                                        </View>


                                    </View>
                                    {
                                                (selectedMonthIndex !== null && yearList !== null && yearList.length !== 0 && selectedYearIndex !== null) && 
                                                <TouchableOpacity
                                                    style={{
                                                        height : 50, 
                                                        width : 50, 
                                                        marginLeft : 15,
                                                        borderRadius : 40, 
                                                        alignItems : 'center',
                                                        backgroundColor : "rgba(255, 255, 255, 0.30)",  
                                                        justifyContent : "center",
                                                        position : "absolute", 
                                                        top : 5
                                                    }}
                                                    onPress={()=>{
                                                        setrefresh(prev => !prev)
                                                    }}
                                                >
                                                    <Octicons
                                                        name='sync'
                                                        size={21}
                                                        color="white" 
                                                    />
                                                </TouchableOpacity>
                                            }

                                    <TouchableOpacity 
                                        onPress={() => sidebarRef.current.toggleSidebar()}
                                        style={[
                                            {
                                            width : 50, 
                                            height : 50, 
                                            backgroundColor : "rgba(255, 255, 255, 0.30)", 
                                            borderRadius : 70, 
                                            alignItems : "center", 
                                            justifyContent : "center", 
                                            zIndex : 10,
                                            top : 5, 
                                            position: "absolute",
                                            right : 20
                                          }, 
                                        ]} 
                                    >
                                        <Octicons name="three-bars" size={18}   color="white"    />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView decelerationRate="fast" ref={scrollRef} showsHorizontalScrollIndicator={false} horizontal style={{ position :"relative" ,height :0 ,paddingLeft : 22,marginTop: 15,margin : "auto",marginBottom: 30,padding : 0,  backgroundColor : "transparent" }}>
                                    <LineChart
                                        scrollRef={ref}
                                        data={flattenedChartData}
                                        curved         
                                        height={200}
                                        hideRules={false}
                                        hideYAxisText
                                        showVerticalLines
                                        yAxisColor="transparent"
                                        xAxisColor="transparent"
                                        verticalLinesColor="rgba(255, 255, 255, 0.39)"
                                        thickness={1}
                                        verticalLinesStrokeDashArray={[5, 5]}
                                        initialSpacing={60} 
                                        textColor1="yellow"
                                        textShiftY={-8}
                                        textShiftX={-10}
                                        textFontSize={13}  
                                        spacing={spacing} 
                                        hideDataPoints
                                        color="#ffffff"
                                        noOfSections={5}
                                        rulesType="dashed"
                                        rotateLabe={false}
                                        rulesColor="rgba(255, 255, 255, 0.39)"
                                        yAxisTextStyle={{ color: 'transparent' }}
                                        xAxisLabelTextStyle={{
                                            color: 'white',
                                            fontSize: 10,
                                            zIndex : 99999999999999
                                        }}
                                        areaChart
                                        startFillColor={'#00ffd0'}
                                        endFillColor={'#000000'}
                                        startOpacity={0.555}
                                        endOpacity={0.33}
                                        backgroundColor="transparent"
                                        showValuesAsDataPointsText
                                        isAnimated={true}
                                        animationDuration={getAnimationDuration(flattenedChartData)}
                                        animateOnDataChange={getAnimationDuration(flattenedChartData)}
                                        lineGradient
                                        lineGradientStartColor="white"
                                        lineGradientEndColor="rgb(0, 255, 187)"
                                    />
                                </ScrollView>
                                
                                <View 
                                    style={{
                                        width : "90%", 
                                        height : 1, 
                                        backgroundColor : "rgba(255, 255, 255, 0.25)", 
                                        borderRadius : 3, 
                                        margin : "auto",
                                        marginTop : 30, 
                                        marginBottom : 15,
                                    }} 
                                />

                                <ScrollView 
                                    showsVerticalScrollIndicator={false}
                                    style={{
                                        width : "90%", 
                                        flex : 1,
                                        margin : "auto",
                                        flexDirection : "column",
                                    }} 
                                >
                                    <Text
                                        style={{
                                            fontFamily : "InterMedium", 
                                            fontSize : 16, 
                                            color: "white", 
                                            marginBottom : 15, 
                                        }}
                                    >
                                        Versements : 29
                                    </Text>
                                        
                                    {
                                        (transactions === null || transactions.length === 0) ? 
                                        <Text>
                                            Aucune donnée
                                        </Text>
                                        :
                                        <>
                                        {
                                            transactions.map((trans, index)=>{
                                                return(
                                                    <View 
                                                        key={trans.id}
                                                        style={{
                                                            width : "100%", 
                                                            paddingVertical : 15, 
                                                            paddingHorizontal : 10, 
                                                            margin : "auto",
                                                            borderRadius : 5,
                                                            marginBottom : 13, 
                                                            flexDirection : "row",
                                                            justifyContent : "space-between",
                                                            backgroundColor : "rgba(255, 255, 255, 1)"
                                                        }} 
                                                    >
                                                        <View
                                                            style={{
                                                                flexDirection : "row"
                                                            }}
                                                        >
                                                            <View 
                                                                style={{
                                                                    width : 30, 
                                                                    alignItems : "flex-start", 
                                                                    justifyContent : "center", 
                                                                    marginRight : 10
                                                                }} 
                                                            >
                                                                <View 
                                                                    style={{
                                                                        width : 30,
                                                                        height : 30, 
                                                                        borderRadius : 50, 
                                                                        backgroundColor : trans.success === 1 ? "rgb(233, 255, 234)" : "rgb(255, 232, 232)", 
                                                                        alignItems : "center", 
                                                                        justifyContent : "center"
                                                                    }} 
                                                                >
                                                                    {
                                                                        trans.success === 1  ? 
                                                                        <Octicons 
                                                                            name='check'
                                                                            size={18}
                                                                            color="rgb(66, 165, 78)"
                                                                        />
                                                                        :
                                                                        <Octicons 
                                                                            name='x'
                                                                            size={18}
                                                                            color="rgb(243, 27, 27)"
                                                                        />
                                                                    }
                                                                </View>
                                                            </View>
                                                            <View 
                                                                style={{
                                                                    flexDirection : "column",
                                                                }} 
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontFamily : "InterMedium", 
                                                                        fontSize : 15.6, 
                                                                        color: "#141414", 
                                                                        marginBottom : 3
                                                                    }}
                                                                >
                                                                    {trans.type}
                                                                </Text>
                                                                <Text
                                                                    style={{
                                                                        fontFamily : "Inter", 
                                                                        fontSize : 13, 
                                                                        color: "rgb(98, 98, 98)"
                                                                    }}
                                                                >
                                                                    {
                                                                        trans.time
                                                                    }
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View 
                                                            style={{
                                                                flexDirection : "column",
                                                            }} 
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontFamily : "InterMedium", 
                                                                    fontSize : 15, 
                                                                    color: trans.success === 1 ? "rgb(66, 165, 78)" : "rgb(243, 27, 27)",
                                                                    marginBottom : 3, 
                                                                    textAlign : "right"
                                                                }}
                                                            >
                                                                {trans.amount}
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    fontFamily : "Inter", 
                                                                    fontSize : 13, 
                                                                    color: "rgb(98, 98, 98)",
                                                                    textAlign : "right"
                                                                }}
                                                            >
                                                                &nbsp;&nbsp;&nbsp;
                                                            </Text>
                                                        </View>

                                                    </View>
                                                )
                                            })
                                        }
                                        </>
                                    }

                                </ScrollView>


                            </LinearGradient>
                    )}
                </>     
            }
            </View>
        </View>
    )
}


export default Remuneration;



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop : 40,
        marginBottom : 15, 
        flexDirection : "row",
        position : "relative",
        paddingHorizontal : 20
    },
    gradientBox: {
        flex: 1,
        flexDirection : "column"
    },

    gradientBox2: {
        flex: 1,
        flexDirection : "column",
        alignItems : "center", 
        justifyContent : "center"
    },
});