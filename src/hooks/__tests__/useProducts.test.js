import { renderHook, act, waitFor } from '@testing-library/react-native';
import * as firebaseDatabase from 'firebase/database';
import { useProducts } from '../useProducts';
import { DEMO_PRODUTOS } from '../../utils/images';

// Auxiliar: configura o mock do onValue para retornar dados específicos
function mockOnValue(dados) {
  firebaseDatabase.onValue.mockImplementation((ref, callback) => {
    if (dados) {
      callback({ exists: () => true, val: () => dados });
    } else {
      callback({ exists: () => false, val: () => null });
    }
    return jest.fn();
  });
}

describe('useProducts (Firebase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Padrão: banco vazio
    mockOnValue(null);
  });

  describe('inicialização', () => {
    it('chama push para semear demos quando o banco está vazio', async () => {
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.carregando).toBe(false));

      // push é chamado uma vez por produto demo
      expect(firebaseDatabase.push).toHaveBeenCalledTimes(DEMO_PRODUTOS.length);
    });

    it('carrega produtos do Firebase quando existem dados', async () => {
      const dadosFirebase = {
        'id-morango': { name: 'Morango', price: 12.9, qty: 10 },
        'id-chocolate': { name: 'Chocolate', price: 13.9, qty: 8 },
      };
      mockOnValue(dadosFirebase);

      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.produtos).toHaveLength(2));

      expect(result.current.produtos[0].id).toBe('id-morango');
      expect(result.current.produtos[0].name).toBe('Morango');
    });

    it('converte o objeto do Firebase em array com campo id', async () => {
      const dadosFirebase = { 'abc123': { name: 'Uva', price: 10, qty: 5 } };
      mockOnValue(dadosFirebase);

      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.produtos).toHaveLength(1));

      expect(result.current.produtos[0]).toHaveProperty('id', 'abc123');
      expect(result.current.produtos[0]).toHaveProperty('name', 'Uva');
    });
  });

  describe('adicionarProduto', () => {
    it('chama push com os dados do produto', async () => {
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.carregando).toBe(false));

      await act(async () => {
        await result.current.adicionarProduto({ name: 'Limão', price: 11.0, qty: 6 });
      });

      expect(firebaseDatabase.push).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'Limão', price: 11.0 })
      );
    });

    it('retorna o novo produto com o id gerado pelo Firebase', async () => {
      // Banco com dados → evita semeadura, que consumiria o mockResolvedValueOnce
      mockOnValue({ 'existente': { name: 'Morango', price: 12 } });
      firebaseDatabase.push.mockResolvedValueOnce({ key: 'novo-firebase-id' });

      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.carregando).toBe(false));

      let novo;
      await act(async () => {
        novo = await result.current.adicionarProduto({ name: 'Pêssego', price: 14.0, qty: 3 });
      });

      expect(novo.id).toBe('novo-firebase-id');
      expect(novo.name).toBe('Pêssego');
    });
  });

  describe('editarProduto', () => {
    it('chama update com os novos dados', async () => {
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.carregando).toBe(false));

      await act(async () => {
        await result.current.editarProduto('id-abc', { name: 'Morango Atualizado', price: 15 });
      });

      expect(firebaseDatabase.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'Morango Atualizado', price: 15 })
      );
    });
  });

  describe('deletarProduto', () => {
    it('chama remove com a referência correta', async () => {
      const { result } = renderHook(() => useProducts());
      await waitFor(() => expect(result.current.carregando).toBe(false));

      await act(async () => {
        await result.current.deletarProduto('id-para-deletar');
      });

      expect(firebaseDatabase.remove).toHaveBeenCalled();
    });
  });
});
