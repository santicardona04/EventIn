import React, { useState, useEffect } from "react";
import { addEventInfo } from "../../common/redux/actions";
import { View, StyleSheet, Alert } from "react-native";
import { Input, Text, LinearProgress } from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./FormStyles";
import MapView, { Callout, Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import { Ionicons } from '@expo/vector-icons';

// IMPORTANTE-- TODAVIA NO ANDA LA BARRA DE BUSQUEDA,SOLO ANDA NAVEGANDO EN EL MAPA Y PONIENDO EL PIN
//              EN EL LUGAR DESEADO
const FormMaps = ({ navigation }) => {
  const dispatch = useDispatch();
  //Location states
  const [showMap, setShowMap] = useState(false);
  const [pin, setPin] = useState({
    latitude: -34.667270557115565,
    longitude: -58.368570803061345,
  });
  console.log("esta es la ubicacion actual", pin);
  const [region, setRegion] = useState({
    latitude: -34.667270557115565,
    longitude: -58.368570803061345,
    latitudeDelta: 0.0000000000000004,
    longitudeDelta: 0.003421,
  });

  const [errorMsg, setErrorMsg] = useState(null);

  // En este useEffect pedimos acceso a la ubicación actual del usuario.
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Los permisos fueron denegados");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setPin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);
  if (errorMsg) {
    Alert.alert(errorMsg);
  }

  const handleShowMap = () => {
    setShowMap(true);
    Alert.alert("Importante!", "Para mover el pin debes mantenerlo presionado.");
  };

  const handleHideMap = () => {
    setShowMap(false);
  };

  const handleNext = () => {
    const partialEvent = {
      location: {
        lat: pin.latitude,
        long: pin.longitude,
      },
    };
    dispatch(addEventInfo(partialEvent));
    navigation.navigate("FormCardPreview")
  };
  return (
    <SafeAreaView style={styles.container}>
      <LinearProgress color="lightgreen" variant="determinate" value={0.6} />

      <Text h3 style={styles.textLoc}>Elige una ubicación:</Text>
      {/* <ScrollView> */}
      <View style={{ marginTop: 50 }}>
        <TouchableOpacity title="elegir ubicacion" onPress={handleShowMap} style={styles.btn2}>
          <Text style={styles.textMaps}>Mostrar mapa</Text>
        </TouchableOpacity>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
            setRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.0000000000000004,
              longitudeDelta: 0.003421,
            });
          }}
          fetchDetails={true}
          GooglePlacesSearchQuery={{ rankby: "distance" }}
          query={{
            key: "AIzaSyDHw9p6ttvBYzEy148PIWBnhdNd59jqxjo",
            language: "en",
            components: "country:argentina",
            types: "establishment",
            radius: 30000,
            location: `${region.latitude},${region.longitude}`,
          }}
          styles={{
            container: { 
              flex: 0, 
              width: "100%", 
              zIndex: 1, 
              borderWidth: 1, 
              borderRadius: 6, 
              height: 50 
            },
            listView: { backgroundColor: "white" },
          }}
        />
        {showMap && (
          <MapView
            style={estilos.map}
            initialRegion={{
              latitude: pin.latitude,
              longitude: pin.longitude,
              latitudeDelta: 0.0000000000000004,
              longitudeDelta: 0.003421,
            }}
            provider="google"
          >
            {/* <Marker coordinate={{latitude: region.latitude, longitude: region.longitude}}> 
          <Callout>
                <Text> estadio </Text>
              </Callout>
              </Marker> */}

            <Marker
              coordinate={pin}
              draggable={true}
              // onDragStart={(e) => {
              //     console.log("Drag start", e.nativeEvent.coordinate);
              //   }}
              onDragEnd={(e) => {
                setPin({
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                });
              }}
            >
              <Callout>
                <Text>el mejor estadio del mundo</Text>
              </Callout>
            </Marker>
          </MapView>
        )}
        { showMap &&
          <TouchableOpacity title="sacar mapa" onPress={handleHideMap} style={styles.btn2}>
            <Text style={styles.textMaps}>Ocultar mapa</Text>
          </TouchableOpacity>
        }
      </View>
      <View style={styles.btnsContainer}>
        <TouchableOpacity 
            title="Siguiente..." 
            onPress={handleNext} 
            style={[
              styles.btn, 
              {flexDirection: 'row', 
              justifyContent: 'center'
              }
              ]}>
          <Text style={styles.textBtn}>Siguiente</Text>
          <Ionicons name="arrow-forward" size={28} color="#fff" style={styles.arrowIcon}/>
        </TouchableOpacity>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};
const estilos = StyleSheet.create({
  mapContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: 400,
  },
});
export default FormMaps;
