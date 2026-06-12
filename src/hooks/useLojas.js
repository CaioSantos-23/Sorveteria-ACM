import { useState, useEffect } from 'react';
import { ref, push, update, remove, onValue } from 'firebase/database';
import { db } from '../services/firebaseConfig';

const CAMINHO = 'lojas';

const DEMO_LOJAS = [
  { id: 'demo-loja-1', nome: 'Gelato MEC — Centro', endereco: 'Rua das Flores, 123', cidade: 'Miguel Pereira', nota: 4.8, lat: -22.45, lng: -43.46 },
  { id: 'demo-loja-2', nome: 'Gelato MEC — Norte', endereco: 'Av. Principal, 456', cidade: 'Miguel Pereira', nota: 4.6, lat: -22.43, lng: -43.44 },
  { id: 'demo-loja-3', nome: 'Gelato MEC — Sul', endereco: 'Praça da Matriz, 78', cidade: 'Arcádia', nota: 4.9, lat: -22.48, lng: -43.48 },
  { id: 'demo-loja-4', nome: 'Gelato MEC — Lago', endereco: 'Estrada do Lago, 9', cidade: 'Barão de Jávary', nota: 4.7, lat: -22.42, lng: -43.50 },
];

export function useLojas(enabled = true) {
  const [lojas, setLojas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    const lojasRef = ref(db, CAMINHO);
    const cancelar = onValue(lojasRef, async (snapshot) => {
      if (snapshot.exists()) {
        const dados = snapshot.val();
        const lista = Object.keys(dados).map((key) => ({ id: key, ...dados[key] }));
        setLojas(lista);
      } else {
        await semearDemos();
      }
      setCarregando(false);
    });
    return () => cancelar();
  }, [enabled]);

  const semearDemos = async () => {
    const lojasRef = ref(db, CAMINHO);
    for (const l of DEMO_LOJAS) {
      const { id, ...dados } = l;
      await push(lojasRef, dados);
    }
  };

  const adicionarLoja = async (loja) => {
    const novoRef = await push(ref(db, CAMINHO), loja);
    return { id: novoRef.key, ...loja };
  };

  const editarLoja = async (id, dados) => {
    await update(ref(db, `${CAMINHO}/${id}`), dados);
  };

  const deletarLoja = async (id) => {
    await remove(ref(db, `${CAMINHO}/${id}`));
  };

  return { lojas, carregando, adicionarLoja, editarLoja, deletarLoja };
}
