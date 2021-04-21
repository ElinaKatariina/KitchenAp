import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import NavBar, { NavButton, NavButtonText, NavTitle, NavGroup } from 'react-native-nav';

export default function Home() {

    // disabling warning box
    console.disableYellowBox = true;

    return(
        <View style={styles.home}>
            <Text style={styles.menu}>THIS IS</Text>
            <Image 
                style={styles.logo}
                source={require('./img/logo.jpg')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    //styling for menu text
    menu: {
        fontSize: 65,
        color: 'lightblue',
        marginBottom: 50,
        letterSpacing: 25,
    },
    //styling of the border for logo img
    logo: {
        borderColor: 'lightblue',
        borderWidth: 2,
    },
});