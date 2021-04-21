import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import firebaseConfig from '../config';
import { TextInput, FlatList } from 'react-native-gesture-handler';
import RadioForm, { RadioButtonInput } from 'react-native-simple-radio-button';
import Dialog from 'react-native-dialog';
import CheckBox from 'react-native-checkbox';


export default function Shoppin() {

    // connecting to database through firebase config file
    firebase.database().ref('kitchen/')

    // product information
    const [cabin, setCabin] = useState('dry');
    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState(null);
    const [state, setState] = useState('Full');
    const [constant, setConstant] = useState('');           // Is the product constantly needed
    const [inKitchen, setInKitchen] = useState(false);      // product is not yet in kitchen (false). This is why it shows on shopping list
    const [checked, setChecked] = useState(false);          // this to know if item is checked on the shopping list

    //other information
    const [shoppin, setShoppin] = useState([]);             // list to use when viewing shopping list
    const [radio, setRadio] = useState(-1);
    const [dialog, setDialog] = useState(false);
    const [key, setKey] = useState('');                     // saving items unique key to help deleting and editing item
    
    // this will open and close the dialog that allows to add products to shopping list
    const showDialog = () => {
        setDialog(true);
      };
    const handleCancel = () => {
        setDialog(false);
      };

    //saving data from the dialog to database
    const saveItem = () => {
        if (product == null) {
            Alert.alert('Nothing to add!');
        } else {
            firebase.database().ref('kitchen/').push(
                {'cabin': cabin,
                'product': product, 
                'amount': amount,
                'state': state,
                'constant': constant,
                'inKitchen': inKitchen}
            );
            Alert.alert(product + ' added to Shopping list!');
            setProduct(null);           // emptying data in dialog
            setAmount(null);
            setRadio(-1);
        }
        setDialog(false);               //closing dialog view after saving data to database
    } 

    // Reading data from database that is not yet in kitchen (inKitchen state is equal to false)
    // Setting data to 'setShoppin' Arraylist
    useEffect(() => {
        firebase.database().ref('kitchen/').orderByChild('inKitchen').equalTo(false).on('value', snapshot => {
            if (snapshot.exists()){
            const data = snapshot.val();
            const list = Object.values(data);
                setShoppin(list);
            }
        });
    }, []);

    //fetching unique key for each item
    // this i need to be able to delete and edit a specific item
    const fetchKey = () => {
        firebase.database().ref('kitchen/').orderByChild('inKitchen').equalTo(false).on('value', snapshot => {
            const data = snapshot.val();
            console.log(Object.keys(data));
        })
    }

    // this changes 'inKitchen' state from 'false' to 'true'
    // it moves all the items from shopping list to cabin pages
    const inKit = () => {
            firebase.database().ref('kitchen/').orderByChild('inKitchen').equalTo(false).on('value', snapshot => {
                const data = snapshot.val();
                setKey(Object.keys(data));
            })
            key.map((item, index) => {
                firebase.database().ref('kitchen/').child(item).update({'inKitchen': true});  
            })
    }

    //deleting specific item from shopping list
        //what i wanted to do but didn't work
    const del = (props) => {
        if (props.constant === "No") {
            Alert.alert("Item deleted");
            //firebase.database().ref('kitchen/').orderByChild('product').equalTo(item.product).remove;
        } else if (props.constant === "Yes") {
            Alert.alert("Item moved to shopping list");
            //firebase.database().ref('kitchen/').orderByChild('product').equalTo(item.product).update({'inKitchen': false});
        }
    }


    return(
        <ScrollView style={styles.scrview}>
        <View style={styles.container}>
            <Text style={styles.menu}>S H O P P I N G    L I S T</Text>
            <TouchableOpacity onPress={showDialog}>
                <Text style={styles.button}>
                Add New</Text></TouchableOpacity>
            <View style={{marginTop: 30}}>
                <FlatList 
                    data={shoppin}
                    listKey={item => item.getKey()}
                    renderItem={({item}) => 
                    <View style={styles.listContainer}>
                        <Text style={styles.listP}>{item.product}</Text>
                        <Text style={styles.listInfo}>{item.amount}</Text>
                        <Button color="#ed8e87" value={item.constant} onPress={del} title="Del"/>
                        <View>
                        <CheckBox
                            label=" "
                            checked={item.checked}
                        />
                        </View>
                    </View>}
                />
                <Button color='#a3e2ff' onPress={inKit} title="I bought everything!"/>
            </View>
            <View  style={{flexDirection: 'row', marginLeft: 100, marginTop: 30,}}>
            </View>



            <View style={styles.form}>
            <Dialog.Container visible={dialog}>
                <Text style={styles.formTitle}>Add New Product to Shopping List!{"\n"}</Text>
            <View style={styles.form}>
                <Text style={styles.formText}>Product belogs to: </Text>
                    <RadioForm 
                        radio_props={[{label: 'Fridge', value: 'fridge'},
                                        {label: 'Dry', value: 'dry'},
                                        {label: 'Spices', value: 'spices'}]}
                        onPress={value => {setCabin(value)}}
                        initial={radio}
                        animation={true}
                        formHorizontal={true}
                        labelHorizontal={false}
                        buttonSize={10}
                    />
                    <Text style={styles.formText}>Product Name: </Text>
                    <TextInput
                    style={styles.formInput}
                    value={product}
                    onChangeText={product=>  setProduct(product)}
                    />
                    <Text style={styles.formText}>{"\n"}Amount: </Text>
                    <TextInput 
                    style={styles.formInput}
                    value={amount}
                    onChangeText={amount => setAmount(amount)}
                    />
                    <Text style={styles.formText}>{"\n"}Constantly needed: </Text>
                    <RadioForm 
                        radio_props={[{label: 'Yes', value: 'Yes'}, 
                                        {label: 'No', value: 'No'}]}
                        onPress={value => {setConstant(value)}}
                        initial={radio}
                        animation={true}
                        formHorizontal={true}
                        labelHorizontal={false}
                        buttonSize={10}
                    />
                    <View style={{flexDirection: 'row', marginLeft: 70, height: 50, marginTop: 20}}>
                        <Button style={{fontSize: 20}} title="Cancel" onPress={handleCancel}></Button>
                        <Button style={{fontSize: 20}} title="Save" onPress={saveItem}></Button>
                    </View>
            </View>
            </Dialog.Container>
            </View>
        </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    menu: {
        height: 80,
        fontSize: 45,
        textAlign: 'center',
        color: 'lightblue',
    },
    formTitle: {
        fontSize: 30,
        color: 'grey',
        textAlign: "center",
    },
    formText: {
        fontSize: 25,
        color: 'grey',
    },
    formInput: {
        fontSize: 20,
        color: 'lightblue',
        marginLeft:40,
        borderColor: 'lightgrey',
        borderWidth: 1,
        width: 180,
        height: 30,
    },
    listContainer: {
        width: 340,
        marginLeft: 17,
        textAlign: "center",
        flex: 2,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'lightgrey',
        height: 40,
    },
    listP: {
        flex: 2,
        fontSize: 18,
        color: 'grey',
        textAlign: "left",
        marginLeft: 10,
        marginRight: 60,
        flexDirection: 'row',
    },
    listInfo: {
        flex: 2,
        fontSize: 17,
        color: 'grey',
        textAlign: "right",
        marginRight: 10,
        flexDirection: 'row',
    },
    button: {
        fontSize: 18,
        borderWidth: 2,
        borderColor: 'lightblue',
        width: 100,
        height: 25,
        textAlign: 'center',
        marginLeft: 135,
        borderRadius: 5,
        color: 'grey',
    }
});