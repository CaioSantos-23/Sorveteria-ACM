import { getImagemProduto, DEMO_PRODUTOS } from '../images';

describe('getImagemProduto', () => {
  it('retorna imagem de morango para nome contendo "morango"', () => {
    expect(getImagemProduto('Sorvete de Morango')).not.toBeNull();
  });

  it('retorna imagem de chocolate para nome contendo "chocolate"', () => {
    expect(getImagemProduto('Chocolate Suíço')).not.toBeNull();
  });

  it('retorna imagem de açaí para variações do nome', () => {
    expect(getImagemProduto('Açaí Premium')).not.toBeNull();
    expect(getImagemProduto('acai tropical')).not.toBeNull();
    expect(getImagemProduto('Açai com banana')).not.toBeNull();
  });

  it('retorna imagem de coco para nome contendo "coco"', () => {
    expect(getImagemProduto('Sorvete de Coco')).not.toBeNull();
  });

  it('retorna imagem de limão para variações do nome', () => {
    expect(getImagemProduto('Limão Siciliano')).not.toBeNull();
    expect(getImagemProduto('limao gelado')).not.toBeNull();
  });

  it('retorna imagem de doce de leite para variações do nome', () => {
    expect(getImagemProduto('Doce de Leite')).not.toBeNull();
    expect(getImagemProduto('doce artesanal')).not.toBeNull();
  });

  it('retorna null para sabor desconhecido', () => {
    expect(getImagemProduto('Pistache')).toBeNull();
  });

  it('retorna null para entrada nula', () => {
    expect(getImagemProduto(null)).toBeNull();
  });

  it('retorna null para entrada undefined', () => {
    expect(getImagemProduto(undefined)).toBeNull();
  });

  it('retorna null para string vazia', () => {
    expect(getImagemProduto('')).toBeNull();
  });

  it('a busca é case-insensitive', () => {
    expect(getImagemProduto('MORANGO')).not.toBeNull();
    expect(getImagemProduto('CHOCOLATE')).not.toBeNull();
  });
});

describe('DEMO_PRODUTOS', () => {
  it('contém 6 produtos', () => {
    expect(DEMO_PRODUTOS).toHaveLength(6);
  });

  it('cada produto tem os campos obrigatórios', () => {
    DEMO_PRODUTOS.forEach((produto) => {
      expect(produto).toHaveProperty('id');
      expect(produto).toHaveProperty('name');
      expect(produto).toHaveProperty('price');
      expect(produto).toHaveProperty('qty');
    });
  });

  it('todos os preços são positivos', () => {
    DEMO_PRODUTOS.forEach((produto) => {
      expect(produto.price).toBeGreaterThan(0);
    });
  });

  it('todas as quantidades são não-negativas', () => {
    DEMO_PRODUTOS.forEach((produto) => {
      expect(produto.qty).toBeGreaterThanOrEqual(0);
    });
  });

  it('todos os ids são únicos', () => {
    const ids = DEMO_PRODUTOS.map((p) => p.id);
    const unicos = new Set(ids);
    expect(unicos.size).toBe(DEMO_PRODUTOS.length);
  });

  it('todos os nomes são strings não-vazias', () => {
    DEMO_PRODUTOS.forEach((produto) => {
      expect(typeof produto.name).toBe('string');
      expect(produto.name.length).toBeGreaterThan(0);
    });
  });
});
