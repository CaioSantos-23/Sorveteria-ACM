import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../useAuth';

const CHAVE_USUARIOS = '@gelato_mec:usuarios';
const CHAVE_ULTIMO_USUARIO = '@gelato_mec:ultimo_usuario';

const usuarioFixture = { nome: 'João Silva', email: 'joao@test.com', senha: '123456' };

async function renderAuthHook() {
  const hook = renderHook(() => useAuth());
  await waitFor(() => expect(hook.result.current.carregando).toBe(false));
  return hook;
}

describe('useAuth', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('inicialização', () => {
    it('começa com carregando=true e termina com carregando=false', async () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.carregando).toBe(true);
      await waitFor(() => expect(result.current.carregando).toBe(false));
    });

    it('começa sem usuário logado', async () => {
      const { result } = await renderAuthHook();
      expect(result.current.usuarioLogado).toBeNull();
    });

    it('carrega o último usuário salvo do AsyncStorage', async () => {
      await AsyncStorage.setItem(CHAVE_ULTIMO_USUARIO, JSON.stringify(usuarioFixture));
      const { result } = await renderAuthHook();
      expect(result.current.ultimoUsuario).toEqual(usuarioFixture);
    });
  });

  describe('login', () => {
    it('retorna true e define usuarioLogado com credenciais corretas', async () => {
      await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify([usuarioFixture]));
      const { result } = await renderAuthHook();

      let sucesso;
      await act(async () => {
        sucesso = await result.current.login('joao@test.com', '123456');
      });

      expect(sucesso).toBe(true);
      expect(result.current.usuarioLogado).toEqual(usuarioFixture);
    });

    it('retorna false com senha incorreta', async () => {
      await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify([usuarioFixture]));
      const { result } = await renderAuthHook();

      let sucesso;
      await act(async () => {
        sucesso = await result.current.login('joao@test.com', 'senhaErrada');
      });

      expect(sucesso).toBe(false);
      expect(result.current.usuarioLogado).toBeNull();
    });

    it('retorna false com e-mail não cadastrado', async () => {
      await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify([usuarioFixture]));
      const { result } = await renderAuthHook();

      let sucesso;
      await act(async () => {
        sucesso = await result.current.login('ninguem@test.com', '123456');
      });

      expect(sucesso).toBe(false);
    });

    it('retorna false quando não há usuários cadastrados', async () => {
      const { result } = await renderAuthHook();

      let sucesso;
      await act(async () => {
        sucesso = await result.current.login('joao@test.com', '123456');
      });

      expect(sucesso).toBe(false);
    });

    it('persiste o último usuário no AsyncStorage após login bem-sucedido', async () => {
      await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify([usuarioFixture]));
      const { result } = await renderAuthHook();

      await act(async () => {
        await result.current.login('joao@test.com', '123456');
      });

      const salvo = await AsyncStorage.getItem(CHAVE_ULTIMO_USUARIO);
      expect(JSON.parse(salvo)).toEqual(usuarioFixture);
    });
  });

  describe('cadastrar', () => {
    it('retorna "ok" e salva o novo usuário no AsyncStorage', async () => {
      const { result } = await renderAuthHook();

      let resultado;
      await act(async () => {
        resultado = await result.current.cadastrar(usuarioFixture);
      });

      expect(resultado).toBe('ok');
      const json = await AsyncStorage.getItem(CHAVE_USUARIOS);
      const lista = JSON.parse(json);
      expect(lista).toHaveLength(1);
      expect(lista[0].email).toBe('joao@test.com');
    });

    it('retorna "duplicado" para e-mail já existente', async () => {
      await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify([usuarioFixture]));
      const { result } = await renderAuthHook();

      let resultado;
      await act(async () => {
        resultado = await result.current.cadastrar({
          nome: 'Outro João',
          email: 'joao@test.com',
          senha: 'outrasenha',
        });
      });

      expect(resultado).toBe('duplicado');
    });

    it('permite cadastrar múltiplos usuários com e-mails diferentes', async () => {
      const { result } = await renderAuthHook();

      await act(async () => {
        await result.current.cadastrar({ nome: 'User 1', email: 'u1@test.com', senha: '111' });
        await result.current.cadastrar({ nome: 'User 2', email: 'u2@test.com', senha: '222' });
      });

      const json = await AsyncStorage.getItem(CHAVE_USUARIOS);
      const lista = JSON.parse(json);
      expect(lista).toHaveLength(2);
    });

    it('define ultimoUsuario após o cadastro', async () => {
      const { result } = await renderAuthHook();

      await act(async () => {
        await result.current.cadastrar(usuarioFixture);
      });

      expect(result.current.ultimoUsuario).toEqual(usuarioFixture);
    });
  });

  describe('logout', () => {
    it('limpa usuarioLogado', async () => {
      await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify([usuarioFixture]));
      const { result } = await renderAuthHook();

      await act(async () => {
        await result.current.login('joao@test.com', '123456');
      });
      expect(result.current.usuarioLogado).toEqual(usuarioFixture);

      act(() => {
        result.current.logout();
      });

      expect(result.current.usuarioLogado).toBeNull();
    });

    it('mantém ultimoUsuario após o logout (necessário para biometria)', async () => {
      await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify([usuarioFixture]));
      const { result } = await renderAuthHook();

      await act(async () => {
        await result.current.login('joao@test.com', '123456');
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.ultimoUsuario).toEqual(usuarioFixture);
    });
  });

  describe('autenticarBiometria', () => {
    it('loga com ultimoUsuario quando biometria é bem-sucedida', async () => {
      await AsyncStorage.setItem(CHAVE_ULTIMO_USUARIO, JSON.stringify(usuarioFixture));
      const LocalAuth = require('expo-local-authentication');
      LocalAuth.authenticateAsync.mockResolvedValueOnce({ success: true });

      const { result } = await renderAuthHook();

      let ok;
      await act(async () => {
        ok = await result.current.autenticarBiometria();
      });

      expect(ok).toBe(true);
      expect(result.current.usuarioLogado).toEqual(usuarioFixture);
    });

    it('retorna false quando biometria falha', async () => {
      const LocalAuth = require('expo-local-authentication');
      LocalAuth.authenticateAsync.mockResolvedValueOnce({ success: false });

      const { result } = await renderAuthHook();

      let ok;
      await act(async () => {
        ok = await result.current.autenticarBiometria();
      });

      expect(ok).toBe(false);
      expect(result.current.usuarioLogado).toBeNull();
    });
  });
});
