import { useState, useEffect } from 'react';
import { ref, push, remove, update, onValue } from 'firebase/database';
import { db } from '../services/firebaseConfig';

const CAMINHO = 'admins';

export function useAdmins(enabled = true) {
  const [admins, setAdmins] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    const adminsRef = ref(db, CAMINHO);
    const cancelar = onValue(adminsRef, (snapshot) => {
      if (snapshot.exists()) {
        const dados = snapshot.val();
        const lista = Object.keys(dados).map((key) => ({ id: key, ...dados[key] }));
        setAdmins(lista);
      } else {
        setAdmins([]);
      }
      setCarregando(false);
    });
    return () => cancelar();
  }, [enabled]);

  const adicionarAdmin = async (admin) => {
    const duplicado = admins.some(a => a.email === admin.email);
    if (duplicado) return 'duplicado';
    const novoRef = await push(ref(db, CAMINHO), admin);
    return { id: novoRef.key, ...admin };
  };

  const deletarAdmin = async (id) => {
    await remove(ref(db, `${CAMINHO}/${id}`));
  };

  const alterarSenhaAdmin = async (id, novaSenha) => {
    await update(ref(db, `${CAMINHO}/${id}`), { senha: novaSenha });
  };

  return { admins, carregando, adicionarAdmin, deletarAdmin, alterarSenhaAdmin };
}
