import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

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
    const usuariosJson = await AsyncStorage.getItem(CHAVE_USUARIOS);
    const lista = usuariosJson ? JSON.parse(usuariosJson) : [];
    const usuario = lista.find(u => u.email === email && u.senha === senha);
    if (!usuario) return false;
    setUsuarioLogado(usuario);
    setUltimoUsuario(usuario);
    await AsyncStorage.setItem(CHAVE_ULTIMO_USUARIO, JSON.stringify(usuario));
    return true;
  };

  const cadastrar = async (dados) => {
    const usuariosJson = await AsyncStorage.getItem(CHAVE_USUARIOS);
    const lista = usuariosJson ? JSON.parse(usuariosJson) : [];
    if (lista.find(u => u.email === dados.email)) return 'duplicado';
    const novos = [...lista, dados];
    setUsuarios(novos);
    await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(novos));
    setUltimoUsuario(dados);
    await AsyncStorage.setItem(CHAVE_ULTIMO_USUARIO, JSON.stringify(dados));
    return 'ok';
  };

  const logout = () => {
    setUsuarioLogado(null);
    // Mantém ultimoUsuario para biometria continuar funcionando
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
      await AsyncStorage.setItem(CHAVE_ULTIMO_USUARIO, JSON.stringify(dados));
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
