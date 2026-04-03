import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, Alert, SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AddProductScreen({ onSalvar, onVoltar }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [calorias, setCalorias] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotoUri, setFotoUri] = useState(null);

  const escolherFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para adicionar uma foto ao produto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setFotoUri(result.assets[0].uri);
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar sua câmera para fotografar o produto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setFotoUri(result.assets[0].uri);
  };

  const handleSalvar = () => {
    if (!nome.trim()) { Alert.alert('Campo obrigatório', 'Informe o nome do sabor.'); return; }
    const cleanPreco = parseFloat(preco.replace(',', '.'));
    const cleanQty = parseInt(quantidade, 10);
    if (isNaN(cleanPreco) || cleanPreco <= 0) { Alert.alert('Preço inválido', 'Informe um valor maior que zero.'); return; }
    if (isNaN(cleanQty) || cleanQty < 0) { Alert.alert('Quantidade inválida', 'Informe um número válido.'); return; }

    onSalvar({
      name: nome.trim(),
      price: cleanPreco,
      qty: cleanQty,
      ingredientes: ingredientes.trim(),
      calorias: calorias.trim(),
      descricao: descricao.trim(),
      fotoUri,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onVoltar} style={styles.voltarBtn}>
            <Text style={styles.voltarText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Novo Produto</Text>
          <View style={{ width: 70 }} />
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">

          {/* Foto do produto */}
          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Foto do produto</Text>
            <TouchableOpacity style={styles.fotoArea} onPress={escolherFoto} activeOpacity={0.8}>
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={styles.fotoPreview} resizeMode="cover" />
              ) : (
                <View style={styles.fotoPlaceholder}>
                  <Text style={styles.fotoPlaceholderEmoji}>📷</Text>
                  <Text style={styles.fotoPlaceholderText}>Toque para adicionar foto</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.fotoBotoes}>
              <TouchableOpacity style={styles.fotoBotao} onPress={escolherFoto}>
                <Text style={styles.fotoBotaoText}>🖼️ Galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fotoBotao} onPress={tirarFoto}>
                <Text style={styles.fotoBotaoText}>📷 Câmera</Text>
              </TouchableOpacity>
              {fotoUri && (
                <TouchableOpacity style={[styles.fotoBotao, styles.fotoBotaoRemover]} onPress={() => setFotoUri(null)}>
                  <Text style={styles.fotoBotaoText}>🗑️ Remover</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Informações básicas</Text>

            <Text style={styles.label}>Nome do Sabor *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Morango com Chantilly"
              placeholderTextColor="#aaa"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Preço (R$) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0,00"
                  placeholderTextColor="#aaa"
                  keyboardType="decimal-pad"
                  value={preco}
                  onChangeText={setPreco}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Quantidade *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#aaa"
                  keyboardType="number-pad"
                  value={quantidade}
                  onChangeText={setQuantidade}
                />
              </View>
            </View>

            <Text style={styles.label}>Calorias (kcal)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 280"
              placeholderTextColor="#aaa"
              keyboardType="number-pad"
              value={calorias}
              onChangeText={setCalorias}
            />
          </View>

          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Detalhes</Text>

            <Text style={styles.label}>Ingredientes (separados por vírgula)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Leite, Açúcar, Morango, Creme de leite"
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={3}
              value={ingredientes}
              onChangeText={setIngredientes}
            />

            <Text style={styles.label}>Descrição do Sabor</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Fale sobre este sabor especial..."
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={3}
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>

          <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
            <Text style={styles.botaoText}>Salvar Produto</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  voltarBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  voltarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitulo: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  form: {
    padding: 16,
  },
  secao: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  secaoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3D1A78',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  botao: {
    backgroundColor: '#FF4D8D',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#FF4D8D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  fotoArea: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0EBFF',
    borderWidth: 2,
    borderColor: '#D8B4FE',
    borderStyle: 'dashed',
  },
  fotoPreview: {
    width: '100%',
    height: '100%',
  },
  fotoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fotoPlaceholderEmoji: {
    fontSize: 36,
  },
  fotoPlaceholderText: {
    fontSize: 14,
    color: '#9B6DFF',
    fontWeight: '600',
  },
  fotoBotoes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  fotoBotao: {
    flex: 1,
    backgroundColor: '#F0EBFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  fotoBotaoRemover: {
    backgroundColor: '#FFE8E8',
  },
  fotoBotaoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3D1A78',
  },
});
