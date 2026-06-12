import React from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Platform, StatusBar,
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

export default function ProductDetailScreen({ produto, onVoltar, onEditar }) {
  const { cor, emoji } = corDoItem(produto.id);
  const imagemAsset = getImagemProduto(produto.name);
  const imagem = produto.fotoUri ? { uri: produto.fotoUri } : imagemAsset;

  const ingredientesList = produto.ingredientes
    ? produto.ingredientes.split(',').map((i) => i.trim()).filter(Boolean)
    : [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão Voltar fixo fora do ScrollView para garantir toque */}
      <TouchableOpacity testID="btn-voltar" style={styles.voltarBtn} onPress={onVoltar}>
        <Text style={styles.voltarText}>← Voltar</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: cor }]}>
          {imagem ? (
            <Image source={imagem} style={styles.heroImagem} resizeMode="cover" />
          ) : (
            <Text style={styles.heroEmoji}>{produto.emoji || emoji}</Text>
          )}
        </View>

        {/* Conteúdo */}
        <View style={styles.content}>
          <View style={styles.cabecalho}>
            <Text style={styles.nome}>{produto.name}</Text>
            {onEditar && (
              <TouchableOpacity style={styles.editarBtn} onPress={() => onEditar(produto)}>
                <Text style={styles.editarBtnText}>✏️ Editar</Text>
              </TouchableOpacity>
            )}
          </View>

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

          {/* Descrição */}
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
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    width: '100%',
    height: width * (9 / 16),
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
    top: (Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0) + 16,
    left: 16,
    zIndex: 10,
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
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  nome: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  editarBtn: {
    backgroundColor: '#F0EBFF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#D8B4FE',
  },
  editarBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3D1A78',
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
