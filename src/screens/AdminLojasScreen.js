import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, TextInput, Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '../components/BottomSheet';

function LojaForm({ inicial, onSalvar, onClose }) {
  const [nome, setNome] = useState(inicial?.nome || '');
  const [endereco, setEndereco] = useState(inicial?.endereco || '');
  const [cidade, setCidade] = useState(inicial?.cidade || '');
  const editando = !!inicial;

  const salvar = () => {
    if (!nome.trim()) { Alert.alert('Campo obrigatório', 'Informe o nome da loja.'); return; }
    onSalvar({ nome: nome.trim(), endereco: endereco.trim(), cidade: cidade.trim() });
  };

  return (
    <>
      <Text style={styles.sectionLabel}>Dados da franquia</Text>
      <View style={{ marginTop: 12 }}>
        <Text style={styles.label}>Nome da loja *</Text>
        <TextInput testID="input-nome-loja" style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Gelato MEC — Praia" placeholderTextColor="#9090A0" autoCapitalize="words" />
        <Text style={styles.label}>Endereço</Text>
        <TextInput testID="input-endereco-loja" style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, número" placeholderTextColor="#9090A0" autoCapitalize="words" />
        <Text style={styles.label}>Cidade</Text>
        <TextInput testID="input-cidade-loja" style={styles.input} value={cidade} onChangeText={setCidade} placeholder="Cidade" placeholderTextColor="#9090A0" autoCapitalize="words" />
      </View>
      <TouchableOpacity testID="btn-cadastrar-loja" style={styles.botaoPink} onPress={salvar}>
        <Ionicons name="checkmark" size={20} color="#fff" />
        <Text style={styles.botaoPinkText}>{editando ? 'Salvar alterações' : 'Cadastrar loja'}</Text>
      </TouchableOpacity>
    </>
  );
}

export default function AdminLojasScreen({ lojas, onAdicionarLoja, onEditarLoja, onDeletarLoja }) {
  const [sheet, setSheet] = useState(null); // null | { modo: 'novo' | 'editar', loja? }

  const handleSalvar = async (dados) => {
    if (sheet?.modo === 'editar') {
      await onEditarLoja(sheet.loja.id, dados);
    } else {
      await onAdicionarLoja(dados);
    }
    setSheet(null);
  };

  const confirmaDelete = (loja) => {
    Alert.alert(
      'Excluir loja',
      `Excluir "${loja.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDeletarLoja(loja.id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appbar}>
        <Text style={styles.appbarTitle}>Lojas</Text>
        <TouchableOpacity testID="add-loja-btn" style={styles.addBtn} onPress={() => setSheet({ modo: 'novo' })} activeOpacity={0.8}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lojas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text testID="contador-lojas" style={styles.contador}>{lojas.length} franquias cadastradas</Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.rowItem}>
            <View style={styles.lojaIcon}>
              <Ionicons name="storefront-outline" size={24} color="#3D1A78" />
            </View>
            <View style={styles.meta}>
              <Text style={styles.metaNome}>{item.nome}</Text>
              <Text style={styles.metaSub}>{item.endereco} · {item.cidade}</Text>
              {item.nota && (
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color="#E8A100" />
                  <Text style={styles.ratingText}>{item.nota}</Text>
                </View>
              )}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionEdit} onPress={() => setSheet({ modo: 'editar', loja: item })} activeOpacity={0.7}>
                <Ionicons name="pencil-outline" size={17} color="#3D1A78" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionDel} onPress={() => confirmaDelete(item)} activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={17} color="#E5484D" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>📍</Text>
            <Text style={styles.vazioTexto}>Nenhuma franquia cadastrada</Text>
          </View>
        }
      />

      <BottomSheet
        visible={!!sheet}
        title={sheet?.modo === 'editar' ? 'Editar loja' : 'Nova loja'}
        onClose={() => setSheet(null)}
      >
        {sheet && (
          <LojaForm
            inicial={sheet.loja}
            onSalvar={handleSalvar}
            onClose={() => setSheet(null)}
          />
        )}
      </BottomSheet>
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#3D1A78',
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
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 11,
    shadowColor: '#3D1A78', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  lojaIcon: {
    width: 54, height: 54, borderRadius: 12,
    backgroundColor: '#F4F0FF', alignItems: 'center', justifyContent: 'center',
  },
  meta: { flex: 1, minWidth: 0 },
  metaNome: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 3 },
  metaSub: { fontSize: 13, color: '#555566', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: 13, fontWeight: '800', color: '#E8A100' },
  actions: { flexDirection: 'row', gap: 7 },
  actionEdit: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F4F0FF', alignItems: 'center', justifyContent: 'center' },
  actionDel: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FCE9EA', alignItems: 'center', justifyContent: 'center' },
  vazio: { alignItems: 'center', paddingTop: 60, gap: 12 },
  vazioEmoji: { fontSize: 64 },
  vazioTexto: { fontSize: 16, fontWeight: '700', color: '#9090A0' },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: '#3D1A78', textTransform: 'uppercase', letterSpacing: 0.6, opacity: 0.85 },
  label: { fontSize: 14, fontWeight: '800', color: '#1A1A2E', marginTop: 14, marginBottom: 7 },
  input: {
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#ECE7F5',
    borderRadius: 13, paddingHorizontal: 15, paddingVertical: 13,
    fontSize: 15, fontWeight: '600', color: '#1A1A2E',
  },
  botaoPink: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FF4D8D', borderRadius: 15, paddingVertical: 15, marginTop: 20,
    shadowColor: '#FF4D8D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  botaoPinkText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
