import React, { useState } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity,
  StyleSheet, Dimensions, SafeAreaView, TextInput,
} from 'react-native';
import { logo, getImagemProduto } from '../utils/images';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;

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

export default function HomeScreen({ produtos, onSelectProduto, onAbrirSidebar, onAbrirPerfil }) {
  const [busca, setBusca] = useState('');

  const produtosFiltrados = busca.trim() === ''
    ? produtos
    : produtos.filter((p) =>
        (p.name || p.nome || '').toLowerCase().includes(busca.toLowerCase())
      );

  const renderItem = ({ item }) => {
    const { cor, emoji } = corDoItem(item.id);
    const imagemAsset = getImagemProduto(item.name || item.nome);
    const imagemSrc = item.fotoUri ? { uri: item.fotoUri } : imagemAsset;
    return (
      <TouchableOpacity style={styles.card} onPress={() => onSelectProduto(item)} activeOpacity={0.85}>
        {imagemSrc ? (
          <Image source={imagemSrc} style={styles.fotoImagem} resizeMode="cover" />
        ) : (
          <View style={[styles.fotoArea, { backgroundColor: cor }]}>
            <Text style={styles.emoji}>{item.emoji || emoji}</Text>
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.cardNome} numberOfLines={1}>{item.name || item.nome}</Text>
          <Text style={styles.cardPreco}>R$ {Number(item.price ?? item.preco).toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={onAbrirSidebar}>
          <View style={styles.barra} />
          <View style={styles.barra} />
          <View style={styles.barra} />
        </TouchableOpacity>
        <Image source={logo} style={styles.headerLogo} resizeMode="contain" />
        <View style={{ width: 40 }} />
      </View>

      {/* Barra de pesquisa */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar sabor..."
            placeholderTextColor="#aaa"
            value={busca}
            onChangeText={setBusca}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista */}
      {produtosFiltrados.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioemoji}>{busca ? '🔍' : '🍦'}</Text>
          <Text style={styles.vazioTexto}>
            {busca ? `Nenhum sabor com "${busca}"` : 'Nenhum produto cadastrado'}
          </Text>
          <Text style={styles.vazioSub}>
            {busca ? 'Tente outro nome.' : 'Abra o menu e cadastre o primeiro sabor!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}

      {/* Botão perfil bottom-right */}
      <TouchableOpacity style={styles.perfilFab} onPress={onAbrirPerfil}>
        <Text style={styles.perfilFabText}>👤</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F0FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#3D1A78',
  },
  menuBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    gap: 5,
  },
  barra: {
    height: 3,
    width: 24,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  headerLogo: {
    width: 120,
    height: 65,
    borderRadius: 6,
  },
  searchContainer: {
    backgroundColor: '#3D1A78',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a2e',
    padding: 0,
  },
  searchClear: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '600',
  },
  fotoImagem: {
    width: '100%',
    height: CARD_SIZE * 0.56,
  },
  lista: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_SIZE,
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  fotoArea: {
    width: '100%',
    height: CARD_SIZE * 0.56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 52,
  },
  cardInfo: {
    padding: 10,
  },
  cardNome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  cardPreco: {
    fontSize: 13,
    color: '#FF4D8D',
    fontWeight: '600',
  },
  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  vazioemoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  vazioTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D1A78',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  vazioSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  perfilFab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3D1A78',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  perfilFabText: {
    fontSize: 24,
  },
});
