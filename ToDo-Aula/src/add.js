import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, View, Text, Keyboard } from 'react-native';

export default function AddItem(props) {
  const [item, setItem] = useState('');

  const handleSave = () => {
    const value = item.trim();
    if (!value) return;
    props.addItem(value);
    setItem('');
    Keyboard.dismiss();
  };

  return (
    <View>
      <Text style={styles.text}>Entre com o proximo item</Text>
      <TextInput onChangeText={setItem} value={item} style={styles.input} />
      <Button onPress={handleSave} title="Salvar" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomColor: 'black',
    backgroundColor: '#f4f4f4',
    margin: 4,
  },
  text: {
    fontWeight: '700',
  },
});
