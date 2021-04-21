import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer} from 'react-navigation';
import { createBottomTabNavigator} from 'react-navigation-tabs';
import Fridge from './components/fridge';
import Shoppin from './components/shoppin';
import Dry from './components/dry';
import Spices from './components/spices'; 
import Home from './Home';
import Stores from './components/stores';


//initializing navigation
const AppNavigator =  createBottomTabNavigator({
  Home: {screen: Home},
  Fridge:{screen: Fridge},
  Dry:{screen: Dry},
  Spices:{screen: Spices},
  Shopping:{screen: Shoppin},
  Stores:{screen: Stores}
}, {
  tabBarOptions: {          // navigation styling
    activeTintColor: 'white',
    activeBackgroundColor: 'lightblue',
    style: {
      backgroundColor: 'white',
      height: 70,
    },labelStyle: {
      fontSize: 17,
      marginBottom: 20,
    }
  }
});

const AppContainer =  createAppContainer(AppNavigator);

 export default function App() {

  return (
    <View style={styles.container}>
      <AppContainer style={styles.menu}/>
    </View>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 200,
    fontSize:20,
  },
  menu: {
    fontSize: 15,
  }
})
