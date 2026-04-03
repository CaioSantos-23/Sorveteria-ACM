export const logo = require('../../assets/logo_gelato_mec.jpeg');

export const produtoImagens = {
  morango: require('../../assets/sorvete_morango_mec.jpeg'),
  chocolate: require('../../assets/sorvete_chocolate_mec.jpeg'),
  acai: require('../../assets/acai_mec.jpeg'),
  coco: require('../../assets/coco.jpeg'),
  limao: require('../../assets/Limao.jpeg'),
  doce_de_leite: require('../../assets/doce_de_Leite.jpeg'),
};

export function getImagemProduto(nome) {
  if (!nome) return null;
  const lower = nome.toLowerCase();
  if (lower.includes('morango')) return produtoImagens.morango;
  if (lower.includes('chocolate')) return produtoImagens.chocolate;
  if (lower.includes('acai') || lower.includes('açaí') || lower.includes('açai')) return produtoImagens.acai;
  if (lower.includes('coco')) return produtoImagens.coco;
  if (lower.includes('limao') || lower.includes('limão')) return produtoImagens.limao;
  if (lower.includes('doce de leite') || lower.includes('doce_de_leite') || lower.includes('doce')) return produtoImagens.doce_de_leite;
  return null;
}

export const DEMO_PRODUTOS = [
  {
    id: 'demo1',
    name: 'Morango',
    price: 12.90,
    qty: 15,
    ingredientes: 'Leite, Açúcar, Morango fresco, Creme de leite, Estabilizante natural',
    calorias: '220',
    descricao: 'Refrescante sorvete de morango com pedaços de fruta fresca colhida na época certa. Leve, cremoso e irresistível.',
  },
  {
    id: 'demo2',
    name: 'Chocolate',
    price: 13.90,
    qty: 12,
    ingredientes: 'Leite integral, Açúcar, Cacau 70%, Chocolate ao leite belga, Creme de leite, Baunilha',
    calorias: '285',
    descricao: 'Cremoso sorvete com chocolate belga de alta qualidade. Intenso sabor de cacau que derrete na boca.',
  },
  {
    id: 'demo3',
    name: 'Açaí',
    price: 15.90,
    qty: 8,
    ingredientes: 'Polpa de Açaí, Guaraná natural, Mel, Granola artesanal, Leite condensado, Banana',
    calorias: '310',
    descricao: 'Autêntico sorvete de açaí da Amazônia com granola crocante e mel puro. Energia e sabor em cada colherada.',
  },
  {
    id: 'demo4',
    name: 'Coco',
    price: 13.50,
    qty: 10,
    ingredientes: 'Leite de coco, Coco ralado, Açúcar, Creme de leite, Leite integral',
    calorias: '240',
    descricao: 'Sorvete tropical de coco com pedaços crocantes de coco ralado. Um sabor que leva direto para a praia.',
  },
  {
    id: 'demo5',
    name: 'Limão',
    price: 12.50,
    qty: 11,
    ingredientes: 'Suco de limão siciliano, Açúcar, Creme de leite, Leite condensado, Raspas de limão',
    calorias: '195',
    descricao: 'Refrescante sorvete de limão siciliano com toque cítrico perfeito. Ideal para os dias quentes.',
  },
  {
    id: 'demo6',
    name: 'Doce de Leite',
    price: 14.50,
    qty: 9,
    ingredientes: 'Leite integral, Açúcar, Doce de leite artesanal, Creme de leite, Baunilha',
    calorias: '295',
    descricao: 'Cremoso sorvete com doce de leite artesanal. Sabor reconfortante que abraça o paladar a cada colherada.',
  },
];
