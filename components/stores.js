import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker} from'react-native-maps';

export default function Stores() {

    const [store, setStore] = useState({latitude: '', longitude: ''})

    useEffect(() => {
        fetch('GOOGLE_API_HERE')
        .then(response => response.json())
        .then(data => {
            setStore(data.results);
           // console.log(store);
        })
    })

    const showStores = (store) => {
        store.map((store, index) => {
            <Marker 
                 coordinate={{
                     latitude: store.geometry.location.lat, 
                     longitude: store.geometry.location.lng}} 
                     title={store.name}/>
            })
    }

    return(
        <MapView style={{ flex: 6 }}
            initialRegion={{
                latitude:60.2655435,
                longitude:24.8705631,
                latitudeDelta:0.0322,
                longitudeDelta:0.0221,}} >
        <Marker
            coordinate={{
                latitude:60.2655435,
                longitude:24.8705631}}
            title='Home'/>
        </MapView>
    )
}