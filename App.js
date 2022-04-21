import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Button, FlatList } from "react-native";
import { Keyboard } from 'react-native'; 
import { initializeApp } from'firebase/app';
import { getDatabase, push, ref, onValue } from'firebase/database';

export default function App() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [products, setProducts] = useState([]);


  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyBLr5p81yFrDvg-D5JoUYMSS-D6z6cGXbI",
    authDomain: "shoppinglistfirebase-14793.firebaseapp.com",
    databaseURL: "https://shoppinglistfirebase-14793-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "shoppinglistfirebase-14793",
    storageBucket: "shoppinglistfirebase-14793.appspot.com",
    messagingSenderId: "245936325682",
    appId: "1:245936325682:web:4a5224bb9f8c0422ebe82b"
    };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  // Save new product
  const saveProduct = () => {
    push(
      ref(database, 'products/'),
      { 'name': name, 'amount': amount });
    // Clears input fields and dismisses keyboard after button press
    setAmount('')
    setName('')
    Keyboard.dismiss()
    }

  // List all products
  useEffect(() => {
    const itemsRef = ref(database, 'products/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      setProducts(Object.values(data));
      })
    }, []);
  
  const listSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#bbb",
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 15, marginTop: 10}}>Add item to list: </Text>
      <TextInput
        style={styles.input}
        placeholder="Item name"
        onChangeText={(name) => setName(name)}
        value={name}>
      </TextInput>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        onChangeText={(amount) => setAmount(amount)}
        value={amount}>
      </TextInput>
      <View style={styles.button}>
      <Button title="Save" onPress={saveProduct}></Button>
      </View>
      <View>
      <Text style={{ fontWeight: "bold", fontSize: 15, marginTop: 10}}>Shopping list</Text>
      </View>
      <FlatList
          style={{ marginLeft: "5%", width: "70%" }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listcontainer}>
              <Text style={{fontSize: 15}}> {item.name}, {item.amount}{" "}</Text>
              <Text style={{fontSize: 15, color: '#0052cc'}} onPress={() => deleteProduct(item.id)}> Bought </Text>
            </View>
          )}
          data={products}
          ItemSeparatorComponent={listSeparator} 
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    alignItems: "center",
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    margin: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: 10,
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: "5%",
    marginBottom: "5%"
   },
});
