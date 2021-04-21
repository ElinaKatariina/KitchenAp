import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import firebaseConfig from '../config';
import { TextInput, FlatList } from 'react-native-gesture-handler';
import RadioForm from 'react-native-simple-radio-button';
import Dialog from 'react-native-dialog';

export default function Spices() {

    // connecting to database through firebase config file
    firebase.database().ref('kitchen/')

    //product information
    const [cabin, setCabin] = useState('spices');       //when product added directly to ´dry´, cabin state is automatically set on ´dry´
    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState('');
    const [state, setState] = useState('');             // problematic name?
    const [constant, setConstant] = useState('');
    const [inKitchen, setInKitchen] = useState(true);   // if product is found in kitchen it shows on cabin page
    

    //others
    const [spices, setSpices] = useState([]);
    const [radio, setRadio] = useState(-1); 
    const [dialog, setDialog] = useState(false);
    const [edit, setEdit] = useState(false);

    
    // this will open and close the dialog that allows to add products to cabin
    const showDialog = () => {
        setDialog(true);
      };
    const handleCancel = () => {
        setDialog(false);
      };

    /// this will open and close the dialog that allows to edit the state of the product
    const cancelEdit = () => {
        setEdit(false);
    }
    const showEdit = () => {
        setEdit(true);
    }


    //saving data from the dialog to firebase
    const saveItem = () => {
        if (product == null) {
            Alert.alert('Nothing to add!');
        } else {
            firebase.database().ref('kitchen/').push(       //pushing data to 'kitchen/' database
                {'cabin': cabin,
                'product': product, 
                'amount': amount,
                'state': state,
                'constant': constant,
                'inKitchen': inKitchen}
            );
            Alert.alert(product + ' added to Spices!');     // products added succesfully
            setProduct(null);                                 // Setting states empty
            setAmount('');
            setRadio(-1);
        }
        setDialog(false);                                   // closing dialog after saving product to database
    }   

    // saving edited state
    // plan was to open the product state and edit the state from 'full' to 'half' or 'low' 
    const saveEdit = (e) => {
        Alert.alert("State Edited")
        //what i wanted to do but didn't work
        //firebase.database().ref('kitchen/').orderByChild('product').equalTo(item.product).update({'state': state})
        setEdit(false);
    }

    //delete item
    //what i wanted to do but didn't work
    // if item is not constantly needed it gets deleted. Otherwise it moves back to shopping list
    const del = (props) => {
        if (props.constant === "No") {
            Alert.alert("Item deleted");
            //firebase.database().ref('kitchen/').orderByChild('product').equalTo(item.product).remove;
        } else if (props.constant === "Yes") {
            Alert.alert("Item moved to shopping list");
            //firebase.database().ref('kitchen/').orderByChild('product').equalTo(item.product).update({'inKitchen': false});
        }
    }

    // Reading data from database that has 'spices' as 'cabin' information.
    // Setting data to 'setSpices' Arraylist
    useEffect(() => {
        firebase.database().ref('kitchen/').orderByChild('cabin').equalTo('spices').on('value', snapshot => {
            if (snapshot.exists()){
            const data = snapshot.val();
            const list = Object.values(data);
            const newArray = list.filter(item => item.inKitchen === true);
            setSpices(newArray);
            }
        });
    }, []);

   
    return(
        <ScrollView>
        <View style={styles.container}>
            <Text style={styles.menu}>S  P  I  C  E  S</Text>
            <TouchableOpacity onPress={showDialog}>
                <Text style={styles.button}>
                Add New</Text></TouchableOpacity>
            <View style={{marginTop: 30}}>
                <FlatList 
                    data={spices}
                    listKey={item => item.getKey()}
                    renderItem={({item}) => 
                    <View style={styles.listContainer}>
                        <Text style={styles.listP}>{item.product}</Text>
                        <Button onPress={showEdit}  
                                color='#a3e2ff' 
                                value={item.product}
                                title={item.state}/>
                        <Text style={styles.listInfo}>{item.amount}</Text>
                        <Button color="#ed8e87" value={item.constant} onPress={del} title="Del"/>
                    </View>}
                    keyExtractor={item => item.list}
                />
            </View>
                <Dialog.Container visible={dialog}>
            <View style={styles.form}>
                <Text style={styles.formTitle}>Add New Spice!{"\n"}</Text>
                    <Text style={styles.formText}>Product Name: </Text>
                    <TextInput
                    style={styles.formInput}
                    value={product}
                    onChangeText={product=>  setProduct(product)}
                    />
                    <Text style={styles.formText}>{"\n"}State: </Text>
                    <RadioForm 
                        radio_props={[{label: 'Full', value: 'Full'}, 
                                        {label: 'Half', value: 'Half'},
                                        {label: 'Low', value: 'Low'}]}
                        onPress={value => {setState(value)}}
                        initial={radio}
                        animation={true}
                        formHorizontal={true}
                        labelHorizontal={false}
                        buttonSize={10}
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
            <View>
            <Dialog.Container visible={edit}>
                <Text style={styles.formTitle}>
                    Update state for {"\n"}
                </Text>
                <RadioForm 
                        radio_props={[{label: 'Full', value: 'Full'}, 
                                        {label: 'Half', value: 'Half'},
                                        {label: 'Low', value: 'Low'}]}
                        onPress={value => {setState(value)}}
                        initial={radio}
                        animation={true}
                        formHorizontal={true}
                        labelHorizontal={false}
                        buttonSize={25}
                        style={{marginLeft: 60}}
                    />
                <View style={{flexDirection: 'row', marginLeft: 70, height: 50, marginTop: 20}}>
                    <Button style={{fontSize: 20}} title="Cancel" onPress={cancelEdit}></Button>
                    <Button style={{fontSize: 20}} title="Save" onPress={saveEdit}></Button>
                </View>
            </Dialog.Container>
            </View>
        </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    menu: {
        height: 80,
        marginTop: -12,
        fontSize: 65,
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
        width: 350,
        marginLeft: 15,
        textAlign: "center",
        flex: 2,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'lightgrey'
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