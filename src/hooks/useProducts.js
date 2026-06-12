import { useState, useEffect } from 'react';
import { ref, push, update, remove, onValue } from 'firebase/database';
import { db } from '../services/firebaseConfig';
import { DEMO_PRODUTOS } from '../utils/images';

const CAMINHO = 'produtos';

export function useProducts(enabled = true) {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    const produtosRef = ref(db, CAMINHO);

    const cancelar = onValue(produtosRef, async (snapshot) => {
      if (snapshot.exists()) {
        const dados = snapshot.val();
        const lista = Object.keys(dados).map((key) => ({ id: key, ...dados[key] }));
        setProdutos(lista);
      } else {
        await semearDemos();
      }
      setCarregando(false);
    });

    return () => cancelar();
  }, [enabled]);

  // Insere os produtos de demonstração no Firebase quando o banco está vazio
  const semearDemos = async () => {
    const produtosRef = ref(db, CAMINHO);
    for (const p of DEMO_PRODUTOS) {
      const { id, ...dados } = p; // Firebase gera o id automaticamente com push()
      await push(produtosRef, dados);
    }
  };

  const adicionarProduto = async (produto) => {
    const produtosRef = ref(db, CAMINHO);
    const novoRef = await push(produtosRef, produto);
    return { id: novoRef.key, ...produto };
  };

  const editarProduto = async (id, dados) => {
    const produtoRef = ref(db, `${CAMINHO}/${id}`);
    await update(produtoRef, dados);
  };

  const deletarProduto = async (id) => {
    const produtoRef = ref(db, `${CAMINHO}/${id}`);
    await remove(produtoRef);
  };

  return { produtos, carregando, adicionarProduto, editarProduto, deletarProduto };
}
