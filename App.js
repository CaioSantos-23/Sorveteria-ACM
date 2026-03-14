import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AddItem from './ToDo-Aula/src/add';
import ListItem from './ToDo-Aula/src/list';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

export default function App() {
  const [biometria, setBiometria] = useState(false);
  const [authStatus, setAuthStatus] = useState('idle'); // idle | checking | success | fail
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const compativel = await LocalAuthentication.hasHardwareAsync();
      setBiometria(compativel);
    })();
  }, []);

  const authenticate = async () => {
    setAuthStatus('checking');
    const authentication = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirme sua biometria',
    });
    setAuthStatus(authentication.success ? 'success' : 'fail');
  };

  const addItem = (product) => {
    setItems((prev) => [...prev, { id: uuidv4(), ...product }]);
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (authStatus === 'checking') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Autenticando...</Text>
      </View>
    );
  }

  if (authStatus === 'success') {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Catalogo</Text>
        <AddItem addItem={addItem} />
        <ListItem listItems={items} deleteItem={deleteItem} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{biometria ? 'Biometria disponivel' : 'Biometria nao disponivel'}</Text>
      <TouchableOpacity onPress={authenticate} style={styles.button} disabled={!biometria}>
        <Text>Entrar</Text>
      </TouchableOpacity>
      {authStatus === 'fail' && <Text style={styles.failText}>Falha na autenticacao. Tente novamente.</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  statusText: {
    marginTop: 12,
    fontSize: 16,
  },
  failText: {
    marginTop: 8,
    color: 'red',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
});
