import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_PERFIL = '@gelato_mec:perfil';

export function useProfile() {
  const [perfil, setPerfil] = useState({});

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const json = await AsyncStorage.getItem(CHAVE_PERFIL);
      if (json) setPerfil(JSON.parse(json));
    } catch (e) {
      console.warn('Erro ao carregar perfil:', e);
    }
  };

  const salvarPerfil = async (dados) => {
    setPerfil(dados);
    await AsyncStorage.setItem(CHAVE_PERFIL, JSON.stringify(dados));
  };

  return { perfil, salvarPerfil };
}
