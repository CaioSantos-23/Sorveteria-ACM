import React from 'react';
import { StyleSheet, Button, FlatList, TouchableOpacity, View, Text } from 'react-native';

export default function ListItem(props) {
  return (
    <View style={styles.wrapper}>
      <FlatList
        data={props.listItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity style={styles.card}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>Preco: R$ {item.price.toFixed(2)}</Text>
                <Text style={styles.meta}>Quantidade: {item.qty}</Text>
              </View>
              <Button
                title="Deletar"
                onPress={() => {
                  props.deleteItem(item.id);
                }}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  card: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    display: 'flex',
    borderRadius: 8,
  },
  name: {
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    color: '#444',
  },
});
