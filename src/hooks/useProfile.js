import { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from '../services/firebaseConfig';

// Firebase não aceita '.', '#', '$', '[', ']' nas chaves → sanitiza o email
function sanitizarEmail(email) {
  if (!email) return 'anonimo';
  return email.replace(/[.#$[\]@]/g, '_');
}

export function useProfile(userEmail) {
  const [perfil, setPerfil] = useState({});
  const userId = sanitizarEmail(userEmail);

  useEffect(() => {
    if (!userEmail) return;
    carregar();
  }, [userEmail]);

  const carregar = async () => {
    try {
      const snapshot = await get(ref(db, `perfis/${userId}`));
      if (snapshot.exists()) {
        setPerfil(snapshot.val());
      }
    } catch (e) {
      console.warn('Erro ao carregar perfil:', e);
    }
  };

  const salvarPerfil = async (dados) => {
    try {
      setPerfil(dados);
      await set(ref(db, `perfis/${userId}`), dados);
    } catch (e) {
      console.warn('Erro ao salvar perfil:', e);
    }
  };

  return { perfil, salvarPerfil };
}
