import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert, Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImagemProduto } from '../utils/images';

export default function AdminProdutosScreen({ produtos, onNovoProduto, onEditarProduto, onDeletarProduto }) {
  const confirmaDeletar = (produto) => {
    Alert.alert(
      'Excluir produto',
      `Excluir "${produto.name || produto.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDeletarProduto(produto.id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appbar}>
        <Text style={styles.appbarTitle}>Produtos</Text>
        <TouchableOpacity testID="add-produto-btn" style={styles.addBtn} onPress={onNovoProduto} activeOpacity={0.8}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text testID="contador-produtos" style={styles.contador}>{produtos.length} sabores cadastrados</Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const imagemAsset = getImagemProduto(item.name || item.nome);
          const imagemSrc = item.fotoUri ? { uri: item.fotoUri } : imagemAsset;
          const qtd = item.qty ?? item.qtd ?? 0;
          return (
            <View style={styles.rowItem}>
              {imagemSrc ? (
                <Image source={imagemSrc} style={styles.thumb} resizeMode="cover" />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Text style={{ fontSize: 24 }}>🍦</Text>
                </View>
              )}
              <View style={styles.meta}>
                <Text style={styles.metaNome}>{item.name || item.nome}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaPreco}>
                    R$ {Number(item.price ?? item.preco ?? 0).toFixed(2)}
                  </Text>
                  <Text style={styles.metaSep}>·</Text>
                  <Text style={styles.metaQtd}>{qtd} un</Text>
                  {qtd <= 3 && (
                    <View style={styles.badgeBaixo}>
                      <Text style={styles.badgeBaixoText}>baixo</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionEdit}
                  onPress={() => onEditarProduto(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil-outline" size={17} color="#3D1A78" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionDel}
                  onPress={() => confirmaDeletar(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={17} color="#E5484D" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>🍦</Text>
            <Text style={styles.vazioTexto}>Nenhum produto cadastrado</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3D1A78',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3D1A78',
  },
  appbarTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  addBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center',
  },
  lista: { padding: 16, backgroundColor: '#F4F0FF', flexGrow: 1 },
  contador: { fontSize: 13, fontWeight: '700', color: '#555566', marginBottom: 12 },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 11,
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  thumb: { width: 54, height: 54, borderRadius: 12, flex: '0 0 auto' },
  thumbPlaceholder: {
    backgroundColor: '#F4F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1, minWidth: 0 },
  metaNome: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaPreco: { fontSize: 13, fontWeight: '800', color: '#FF4D8D' },
  metaSep: { color: '#9090A0' },
  metaQtd: { fontSize: 13, color: '#555566', fontWeight: '600' },
  badgeBaixo: {
    backgroundColor: '#FDECEC',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 2,
  },
  badgeBaixoText: { fontSize: 10, fontWeight: '800', color: '#E5484D' },
  actions: { flexDirection: 'row', gap: 7 },
  actionEdit: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F4F0FF',
    alignItems: 'center', justifyContent: 'center',
  },
  actionDel: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#FCE9EA',
    alignItems: 'center', justifyContent: 'center',
  },
  vazio: { alignItems: 'center', paddingTop: 60, gap: 12 },
  vazioEmoji: { fontSize: 64 },
  vazioTexto: { fontSize: 16, fontWeight: '700', color: '#9090A0' },
});
