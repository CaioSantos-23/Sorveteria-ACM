import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEMO_PRODUTOS } from '../utils/images';

const CHAVE_PRODUTOS = '@gelato_mec:produtos';

const gerarId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export function useProducts() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const json = await AsyncStorage.getItem(CHAVE_PRODUTOS);
      if (json) {
        setProdutos(JSON.parse(json));
      } else {
        setProdutos(DEMO_PRODUTOS);
        await AsyncStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(DEMO_PRODUTOS));
      }
    } catch (e) {
      console.warn('Erro ao carregar produtos:', e);
      setProdutos(DEMO_PRODUTOS);
    }
  };

  const adicionarProduto = async (produto) => {
    const novo = { id: gerarId(), ...produto };
    const novos = [...produtos, novo];
    setProdutos(novos);
    await AsyncStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(novos));
    return novo;
  };

  const deletarProduto = async (id) => {
    const novos = produtos.filter(p => p.id !== id);
    setProdutos(novos);
    await AsyncStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(novos));
  };

  return { produtos, adicionarProduto, deletarProduto };
}
