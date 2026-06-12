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
  const s = String(id);
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  return {
    cor: CORES[Math.abs(hash) % CORES.length],
    emoji: EMOJIS[Math.abs(hash + 1) % EMOJIS.length],
  };
}

function getIniciais(nome) {
  if (!nome) return '?';
  return nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

export default function HomeScreen({ produtos, onSelectProduto, onAbrirPerfil, usuario, perfil }) {
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
    const qtd = item.qty ?? item.qtd ?? 0;
    return (
      <TouchableOpacity testID="produto-card" style={styles.card} onPress={() => onSelectProduto(item)} activeOpacity={0.85}>
        <View style={{ position: 'relative' }}>
          {imagemSrc ? (
            <Image source={imagemSrc} style={styles.fotoImagem} resizeMode="cover" />
          ) : (
            <View style={[styles.fotoArea, { backgroundColor: cor }]}>
              <Text style={styles.emoji}>{item.emoji || emoji}</Text>
            </View>
          )}
          {qtd <= 3 && qtd > 0 && (
            <View style={styles.badgeBaixo}>
              <Text style={styles.badgeBaixoText}>Últimas unidades</Text>
            </View>
          )}
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardNome} numberOfLines={1}>{item.name || item.nome}</Text>
          <Text style={styles.cardPreco}>R$ {Number(item.price ?? item.preco ?? 0).toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appbar}>
        <View style={styles.appbarRow}>
          <View style={styles.logoArea}>
            <View style={styles.logoMini}>
              <Image source={logo} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <Text style={styles.appbarTitle}>Gelato MEC</Text>
          </View>
          <TouchableOpacity style={styles.avatarPill} onPress={onAbrirPerfil} activeOpacity={0.8}>
            {perfil?.fotoUri ? (
              <Image source={{ uri: perfil.fotoUri }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <Text style={styles.avatarTexto}>{getIniciais(usuario?.nome)}</Text>
            )}
          </TouchableOpacity>
        </View>
        {/* Search bar dentro do appbar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar sabor..."
            placeholderTextColor="#9090A0"
            value={busca}
            onChangeText={setBusca}
            returnKeyType="search"
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
            {busca ? 'Tente outro nome.' : 'Aguarde o catálogo ser carregado!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D1A78',
  },
  appbar: {
    backgroundColor: '#3D1A78',
    paddingBottom: 14,
  },
  appbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logoMini: {
    width: 30,
    height: 30,
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: '#F7F2E7',
  },
  appbarTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#fff',
  },
  avatarPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FF4D8D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
  },
  avatarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginHorizontal: 16,
    gap: 8,
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    padding: 0,
  },
  searchClear: { fontSize: 13, color: '#9090A0', fontWeight: '600' },
  lista: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#F4F0FF',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
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
  fotoImagem: {
    width: '100%',
    aspectRatio: 1,
  },
  fotoArea: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 52 },
  badgeBaixo: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FDECEC',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeBaixoText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E5484D',
  },
  cardInfo: { padding: 10 },
  cardNome: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  cardPreco: {
    fontSize: 15,
    color: '#FF4D8D',
    fontWeight: '800',
  },
  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
    backgroundColor: '#F4F0FF',
  },
  vazioemoji: { fontSize: 72, marginBottom: 12 },
  vazioTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D1A78',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  vazioSub: {
    fontSize: 13,
    color: '#9090A0',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
