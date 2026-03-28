import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AddItem from './ToDo-Aula/src/add';
import ListItem from './ToDo-Aula/src/list';

const gerarId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const usuariosCadastrados = [];

export default function App() {
  const [tela, setTela] = useState('login');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ultimoUsuario, setUltimoUsuario] = useState(null);
  const [biometriaDisponivel, setBiometriaDisponivel] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const compativel = await LocalAuthentication.hasHardwareAsync();
      const cadastrada = await LocalAuthentication.isEnrolledAsync();
      setBiometriaDisponivel(compativel && cadastrada);
    })();
  }, []);

  const handleBiometria = async () => {
    const resultado = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirme sua identidade',
      cancelLabel: 'Cancelar',
    });
    if (resultado.success) {
      setUsuarioLogado(ultimoUsuario);
      setTela('catalogo');
    } else {
      Alert.alert('Falha', 'Biometria não reconhecida.');
    }
  };

  const handleLogin = (email, senha) => {
    const usuario = usuariosCadastrados.find(
      (u) => u.email === email && u.senha === senha
    );
    if (!usuario) {
      Alert.alert('Erro', 'E-mail ou senha incorretos.');
      return;
    }
    setUsuarioLogado(usuario);
    setUltimoUsuario(usuario);
    setTela('catalogo');
  };

  const handleCadastro = ({ nome, email, senha }) => {
    const jaExiste = usuariosCadastrados.find((u) => u.email === email);
    if (jaExiste) {
      Alert.alert('Atenção', 'Este e-mail já está cadastrado.');
      return;
    }
    usuariosCadastrados.push({ nome, email, senha });
    Alert.alert('Sucesso!', `Conta criada para ${nome}. Faça o login.`, [
      { text: 'OK', onPress: () => setTela('login') },
    ]);
  };

  const addItem = (product) => {
    setItems((prev) => [...prev, { id: gerarId(), ...product }]);
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (tela === 'cadastro') {
    return (
      <>
        <RegisterScreen
          onRegister={handleCadastro}
          onGoLogin={() => setTela('login')}
        />
        <StatusBar style="light" />
      </>
    );
  }

  if (tela === 'catalogo') {
    return (
      <View style={styles.catalogo}>
        <View style={styles.catalogoHeader}>
          <Text style={styles.catalogoEmoji}>🍦</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.catalogoTitulo}>Catálogo</Text>
            <Text style={styles.catalogoSub}>Olá, {usuarioLogado?.nome}!</Text>
          </View>
          <Text
            style={styles.sairBtn}
            onPress={() => { setTela('login'); setUsuarioLogado(null); }}
          >
            Sair
          </Text>
        </View>
        <AddItem addItem={addItem} />
        <ListItem listItems={items} deleteItem={deleteItem} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <>
      <LoginScreen
        onLogin={handleLogin}
        onGoRegister={() => setTela('cadastro')}
        onBiometria={handleBiometria}
        biometriaDisponivel={biometriaDisponivel}
        ultimoUsuario={ultimoUsuario}
      />
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  catalogo: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  catalogoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  catalogoEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  catalogoTitulo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  catalogoSub: {
    fontSize: 13,
    color: '#888',
  },
  sairBtn: {
    color: '#FF4D8D',
    fontSize: 14,
    fontWeight: '600',
  },
});
