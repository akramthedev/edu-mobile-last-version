import { Octicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";

const ChildrenPicker = ({ sons, onSelect, theme, selectedSon, setSelectedSon }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sons && sons.length > 0) {
      setSelectedSon(sons[0]);
    }
  }, [sons]);
  

  const handleSelect = (son) => {
    setSelectedSon(son);
    setVisible(false);
    onSelect && onSelect(son);
  };



  return (
    <View>
      <TouchableOpacity style={[styles.selectorButton, {borderColor : theme === "light" ? "gainsboro" : "rgb(61, 61, 61)"} ,{backgroundColor : theme === "light" ? "white" : "#282828"}]} onPress={() => setVisible(true)}>
        <Octicons  name="chevron-down" color={theme === "light" ? "#141414" : "white"} size={22}  />
        <Text style={[styles.selectorText, {
            color : theme === "light" ? "#141414" : "white"
        }]}>
          {selectedSon ? selectedSon.nom : "Choisir un fils"}
        </Text>
        <Text style={styles.selectorText2}>
          (Cliquez pour choisir)
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, {borderColor : theme === "light" ? "gainsboro" : "#555"} ,{backgroundColor : theme === "light" ? "white" : "#141414"}]}>
            <Text style={[styles.title, {color : theme === "light" ? "#141414" : "white"}]}>Sélectionner un fils : </Text>
            <FlatList
              data={sons}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)} style={[styles.card, {borderColor : theme === "light" ? "rgb(227, 227, 227)" : "rgb(84, 84, 84)"} ,{backgroundColor : theme === "light" ? "rgb(237, 237, 237)" : "#282828"}]}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={[styles.name, {color : theme === "light" ? "#141414" : "white"}]}>{item.nom}</Text>
                    <Text style={[styles.detail, {color : theme === "light" ? "rgb(113, 113, 113)" : "rgb(167, 167, 167)"}]}>{item.classe}</Text>
                    <Text style={[styles.detail, {color : theme === "light" ? "rgb(113, 113, 113)" : "rgb(167, 167, 167)"}]}>Âge: {item.age}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>Fermer la fenêtre</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChildrenPicker;

const styles = StyleSheet.create({
  selectorButton: {
    borderWidth : 1, 
    padding: 12,
    alignItems : "center", 
    justifyContent : "center", 
    flexDirection : "row", 
    borderRadius: 12,
    alignItems: "center",
  },
  selectorText: {
    fontFamily : "InterBold", 
    fontSize: 15,
    marginLeft : 6, 
    marginRight : 5
  },
  selectorText2: {
    color : "gray",
    fontFamily : "Inter", 
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    borderWidth : 1, 
    borderRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  title: {
    fontSize: 18,
    fontFamily: "InterBold",
    marginBottom: 17,
    textAlign: "left",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 7,
    borderWidth : 1, 
},
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  info: {
    marginLeft: 20,
  },
  name: {
    fontSize: 15,
    fontFamily : "InterMedium", 
  },
  detail: {
    fontSize: 14,
  },
  closeBtn: {
    marginTop: 10,
    backgroundColor: "rgb(21, 185, 155)",
    padding: 13,
    borderRadius: 6,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontFamily : "InterBold", 
    fontSize : 14
},
});
