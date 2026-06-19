import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';
import { ref, get } from 'firebase/database';
import { db } from '../services/firebaseConfig';

const CHAVE_USUARIOS = '@gelato_mec:usuarios';
const CHAVE_ULTIMO_USUARIO = '@gelato_mec:ultimo_usuario';

export function useAuth() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ultimoUsuario, setUltimoUsuario] = useState(null);
  const [biometriaDisponivel, setBiometriaDisponivel] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = async () => {
    try {
      const compativel = await LocalAuthentication.hasHardwareAsync();
      const cadastrada = await LocalAuthentication.isEnrolledAsync();
      setBiometriaDisponivel(compativel && cadastrada);

      const usuariosJson = await AsyncStorage.getItem(CHAVE_USUARIOS);
      if (usuariosJson) setUsuarios(JSON.parse(usuariosJson));

      const ultimoJson = await AsyncStorage.getItem(CHAVE_ULTIMO_USUARIO);
      if (ultimoJson) setUltimoUsuario(JSON.parse(ultimoJson));
    } catch (e) {
      console.warn('Erro ao inicializar auth:', e);
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email, senha) => {
    // 1. Verifica usuários normais no AsyncStorage
    const usuariosJson = await AsyncStorage.getItem(CHAVE_USUARIOS);
    const lista = usuariosJson ? JSON.parse(usuariosJson) : [];
    const usuario = lista.find(u => u.email === email && u.senha === senha);
    if (usuario) {
      setUsuarioLogado(usuario);
      setUltimoUsuario(usuario);
      await AsyncStorage.setItem(CHAVE_ULTIMO_USUARIO, JSON.stringify(usuario));
      return true;
    }

    // 2. Verifica admins/equipe no Firebase
    try {
      const snapshot = await get(ref(db, 'admins'));
      if (snapshot.exists()) {
        const dados = snapshot.val();
        const entrada = Object.entries(dados).find(([, v]) => v.email === email && v.senha === senha);
        if (entrada) {
          const [id, dadosAdmin] = entrada;
          const adminUser = { id, ...dadosAdmin, isAdmin: true };
          setUsuarioLogado(adminUser);
          setUltimoUsuario(adminUser);
          await AsyncStorage.setItem(CHAVE_ULTIMO_USUARIO, JSON.stringify(adminUser));
          return true;
        }
      }
    } catch (e) {
      console.warn('Erro ao verificar admins Firebase:', e);
    }

    return false;
  };

  const cadastrar = async (dados) => {
    const usuariosJson = await AsyncStorage.getItem(CHAVE_USUARIOS);
    const lista = usuariosJson ? JSON.parse(usuariosJson) : [];
    if (lista.find(u => u.email === dados.email)) return 'duplicado';
    const novos = [...lista, dados];
    setUsuarios(novos);
    await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(novos));
    setUltimoUsuario(dados);
    return 'ok';
  };

    const logout = async () => {
    setUsuarioLogado(null);
  };

  const autenticarBiometria = async () => {
    const resultado = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirme sua identidade',
      cancelLabel: 'Cancelar',
    });
    if (resultado.success) {
      setUsuarioLogado(ultimoUsuario);
      return true;
    }
    Alert.alert('Falha na biometria', 'Identidade não reconhecida. Tente novamente.');
    return false;
  };

  const ativarBiometria = async (dados) => {
    const resultado = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirme para ativar biometria',
      cancelLabel: 'Cancelar',
    });
    if (resultado.success) {
      setUltimoUsuario(dados);
      return true;
    }
    return false;
  };

  return {
    usuarioLogado,
    ultimoUsuario,
    biometriaDisponivel,
    carregando,
    login,
    cadastrar,
    logout,
    autenticarBiometria,
    ativarBiometria,
  };
}
