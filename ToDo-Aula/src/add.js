import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, View, Text, Keyboard } from 'react-native';

export default function AddItem(props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');

  const handleSave = () => {
    const cleanName = name.trim();
    const cleanPrice = parseFloat(price.replace(',', '.'));
    const cleanQty = parseInt(qty, 10);

    if (!cleanName || isNaN(cleanPrice) || isNaN(cleanQty)) return;

    props.addItem({ name: cleanName, price: cleanPrice, qty: cleanQty });
    setName('');
    setPrice('');
    setQty('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>Adicionar produto</Text>
      <TextInput
        placeholder="Nome"
        onChangeText={setName}
        value={name}
        style={styles.input}
      />
      <TextInput
        placeholder="Preco (ex: 19.90)"
        keyboardType="decimal-pad"
        onChangeText={setPrice}
        value={price}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantidade"
        keyboardType="number-pad"
        onChangeText={setQty}
        value={qty}
        style={styles.input}
      />
      <Button onPress={handleSave} title="Salvar" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    marginVertical: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  text: {
    fontWeight: '700',
    marginBottom: 6,
  },
});
