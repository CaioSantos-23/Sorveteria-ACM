import React from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions,
} from 'react-native';
import { getImagemProduto } from '../utils/images';

const { width } = Dimensions.get('window');

const CORES = ['#FFB3C6', '#B3D4FF', '#C3F0C8', '#FFE4B3', '#E4B3FF', '#B3F0F0', '#FFD4B3', '#D4B3FF'];
const EMOJIS = ['🍦', '🍧', '🍨', '🧁', '🍡', '🫐', '🍓', '🥭'];

function corDoItem(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return {
    cor: CORES[Math.abs(hash) % CORES.length],
    emoji: EMOJIS[Math.abs(hash + 1) % EMOJIS.length],
  };
}

export default function ProductDetailScreen({ produto, onVoltar }) {
  const { cor, emoji } = corDoItem(produto.id);
  const imagemAsset = getImagemProduto(produto.name);
  const imagem = produto.fotoUri ? { uri: produto.fotoUri } : imagemAsset;

  const ingredientesList = produto.ingredientes
    ? produto.ingredientes.split(',').map((i) => i.trim()).filter(Boolean)
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: cor }]}>
          {imagem ? (
            <Image source={imagem} style={styles.heroImagem} resizeMode="cover" />
          ) : (
            <Text style={styles.heroEmoji}>{produto.emoji || emoji}</Text>
          )}
          <TouchableOpacity style={styles.voltarBtn} onPress={onVoltar}>
            <Text style={styles.voltarText}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <View style={styles.content}>
          <Text style={styles.nome}>{produto.name}</Text>

          {/* Chips de info */}
          <View style={styles.chips}>
            <View style={styles.chip}>
              <Text style={styles.chipLabel}>Preço</Text>
              <Text style={styles.chipValor}>R$ {Number(produto.price).toFixed(2)}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipLabel}>Estoque</Text>
              <Text style={styles.chipValor}>{produto.qty} un.</Text>
            </View>
            {produto.calorias ? (
              <View style={styles.chip}>
                <Text style={styles.chipLabel}>Calorias</Text>
                <Text style={styles.chipValor}>{produto.calorias} kcal</Text>
              </View>
            ) : null}
          </View>

          {/* Ingredientes */}
          {ingredientesList.length > 0 && (
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>🧪 Ingredientes</Text>
              {ingredientesList.map((ing, index) => (
                <View key={index} style={styles.ingredienteItem}>
                  <View style={styles.bolinha} />
                  <Text style={styles.ingredienteTexto}>{ing}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Sabor / descrição */}
          {produto.descricao ? (
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>🍬 Sobre o Sabor</Text>
              <Text style={styles.descricaoTexto}>{produto.descricao}</Text>
            </View>
          ) : null}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F0FF',
  },
  hero: {
    width: '100%',
    height: width * (872 / 1600), // proporcao exata 16:9 da imagem
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroImagem: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  voltarBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  voltarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  heroEmoji: {
    fontSize: 96,
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    padding: 24,
    minHeight: 400,
  },
  nome: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  chips: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#F4F0FF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  chipLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  chipValor: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3D1A78',
  },
  secao: {
    marginBottom: 24,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  ingredienteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 10,
  },
  bolinha: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D8D',
  },
  ingredienteTexto: {
    fontSize: 15,
    color: '#444',
  },
  descricaoTexto: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
});
