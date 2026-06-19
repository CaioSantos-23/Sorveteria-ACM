import { renderHook, act, waitFor } from '@testing-library/react-native';
import * as firebaseDatabase from 'firebase/database';
import { useProfile } from '../useProfile';

describe('useProfile (Firebase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Padrão: nenhum perfil salvo
    firebaseDatabase.get.mockResolvedValue({ exists: () => false, val: () => null });
  });

  describe('inicialização', () => {
    it('começa com objeto vazio quando não há perfil no Firebase', async () => {
      const { result } = renderHook(() => useProfile('joao@test.com'));
      await waitFor(() => expect(result.current.perfil).toEqual({}));
    });

    it('carrega o perfil existente do Firebase', async () => {
      const perfilSalvo = { nome: 'João', cidade: 'SP', bio: 'Dev' };
      firebaseDatabase.get.mockResolvedValueOnce({
        exists: () => true,
        val: () => perfilSalvo,
      });

      const { result } = renderHook(() => useProfile('joao@test.com'));
      await waitFor(() => expect(result.current.perfil).toEqual(perfilSalvo));
    });

    it('não carrega se nenhum email for fornecido', async () => {
      renderHook(() => useProfile(null));
      expect(firebaseDatabase.get).not.toHaveBeenCalled();
    });
  });

  describe('salvarPerfil', () => {
    it('atualiza o estado local imediatamente', async () => {
      const { result } = renderHook(() => useProfile('joao@test.com'));

      const novosPerfil = { nome: 'Maria', cidade: 'RJ' };
      await act(async () => {
        await result.current.salvarPerfil(novosPerfil);
      });

      expect(result.current.perfil).toEqual(novosPerfil);
    });

    it('chama set no Firebase com os dados corretos', async () => {
      const { result } = renderHook(() => useProfile('joao@test.com'));

      const novosPerfil = { nome: 'Maria', cidade: 'RJ' };
      await act(async () => {
        await result.current.salvarPerfil(novosPerfil);
      });

      expect(firebaseDatabase.set).toHaveBeenCalledWith(
        expect.anything(),
        novosPerfil
      );
    });

    it('sanitiza o email ao salvar (troca . # $ @ por _)', async () => {
      const { result } = renderHook(() => useProfile('joao.silva@test.com'));

      await act(async () => {
        await result.current.salvarPerfil({ nome: 'João' });
      });

      // O caminho usado deve conter o email sanitizado
      expect(firebaseDatabase.ref).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('joao_silva_test_com')
      );
    });

    it('sobrescreve o perfil anterior por completo', async () => {
      const { result } = renderHook(() => useProfile('joao@test.com'));

      await act(async () => {
        await result.current.salvarPerfil({ nome: 'João', cidade: 'SP' });
      });
      await act(async () => {
        await result.current.salvarPerfil({ nome: 'João Atualizado' });
      });

      expect(result.current.perfil).toEqual({ nome: 'João Atualizado' });
      expect(result.current.perfil.cidade).toBeUndefined();
    });
  });
});
