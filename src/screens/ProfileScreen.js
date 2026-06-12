import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, Alert, SafeAreaView, StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

function formatarTelefone(value) {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 2) return nums.length ? `(${nums}` : '';
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
}

function formatarData(value) {
  const nums = value.replace(/\D/g, '').slice(0, 8);
  if (nums.length <= 2) return nums;
  if (nums.length <= 4) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
  return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4)}`;
}

export default function ProfileScreen({ usuario, perfil, onSalvar, onVoltar, onSair }) {
  const [nome, setNome] = useState(perfil?.nome || usuario?.nome || '');
  const [nomeSocial, setNomeSocial] = useState(perfil?.nomeSocial || '');
  const [bio, setBio] = useState(perfil?.bio || '');
  const [telefone, setTelefone] = useState(perfil?.telefone || '');
  const [endereco, setEndereco] = useState(perfil?.endereco || '');
  const [cidade, setCidade] = useState(perfil?.cidade || '');
  const [nascimento, setNascimento] = useState(perfil?.nascimento || '');
  const [fotoUri, setFotoUri] = useState(perfil?.fotoUri || null);

  const escolherFoto = async () => {
    Alert.alert('Foto de perfil', 'Como deseja adicionar sua foto?', [
      {
        text: 'Galeria', onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria.'); return; }
          const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
          if (!result.canceled) setFotoUri(result.assets[0].uri);
        },
      },
      {
        text: 'Câmera', onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permissão necessária', 'Precisamos acessar sua câmera.'); return; }
          const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
          if (!result.canceled) setFotoUri(result.assets[0].uri);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const iniciais = (usuario?.nome || 'U')
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSalvar = () => {
    onSalvar({ nome, nomeSocial, bio, telefone, endereco, cidade, nascimento, fotoUri });
    Alert.alert('Perfil salvo!', 'Suas informações foram atualizadas com sucesso.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onVoltar} style={styles.voltarBtn}>
            <Text style={styles.voltarText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Meu Perfil</Text>
          <View style={{ width: 70 }} />
        </View>

        {/* Conteúdo */}
        <View style={styles.content}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* Avatar / Ícone de exibição */}
            <View style={styles.avatarArea}>
              <TouchableOpacity onPress={escolherFoto} style={styles.avatarWrapper} activeOpacity={0.8}>
                {fotoUri ? (
                  <Image source={{ uri: fotoUri }} style={styles.avatarFoto} />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarTexto}>{iniciais}</Text>
                  </View>
                )}
                <View style={styles.avatarCameraBtn}>
                  <Text style={{ fontSize: 13 }}>📷</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarNome}>{nomeSocial || usuario?.nome}</Text>
              <Text style={styles.avatarEmail}>{usuario?.email}</Text>
            </View>

            {/* Sobre mim */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>Sobre mim</Text>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Conte um pouco sobre você..."
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={3}
                value={bio}
                onChangeText={setBio}
              />
            </View>

            {/* Informações pessoais */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>Informações Pessoais</Text>

              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                placeholderTextColor="#aaa"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Nome social</Text>
              <TextInput
                style={styles.input}
                placeholder="Como prefere ser chamado(a)?"
                placeholderTextColor="#aaa"
                value={nomeSocial}
                onChangeText={setNomeSocial}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Data de nascimento</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#aaa"
                keyboardType="number-pad"
                value={nascimento}
                onChangeText={(t) => setNascimento(formatarData(t))}
                maxLength={10}
              />
            </View>

            {/* Contato */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>Contato</Text>

              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={(t) => setTelefone(formatarTelefone(t))}
                maxLength={15}
              />

              <Text style={styles.label}>Endereço</Text>
              <TextInput
                style={styles.input}
                placeholder="Rua, número, bairro"
                placeholderTextColor="#aaa"
                value={endereco}
                onChangeText={setEndereco}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Cidade</Text>
              <TextInput
                style={styles.input}
                placeholder="Sua cidade"
                placeholderTextColor="#aaa"
                value={cidade}
                onChangeText={setCidade}
                autoCapitalize="words"
              />
            </View>

            {/* Conta (só leitura) */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>Conta</Text>
              <View style={styles.infoLinha}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValor}>{usuario?.email}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
              <Text style={styles.botaoText}>Salvar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoSair} onPress={onSair}>
              <Text style={styles.botaoSairText}>Sair da conta</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3D1A78',
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
    minWidth: 70,
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
  content: {
    flex: 1,
    backgroundColor: '#F4F0FF',
  },
  scroll: {
    padding: 16,
  },
  avatarArea: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#3D1A78',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarFoto: {
    width: 96,
    height: 96,
    borderRadius: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarCameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF4D8D',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarTexto: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  avatarNome: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  avatarEmail: {
    fontSize: 13,
    color: '#888',
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
    fontSize: 13,
    fontWeight: '700',
    color: '#3D1A78',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
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
  infoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
  },
  infoValor: {
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '600',
    flexShrink: 1,
    marginLeft: 8,
    textAlign: 'right',
  },
  botao: {
    backgroundColor: '#FF4D8D',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
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
  botaoSair: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#FF4D8D',
  },
  botaoSairText: {
    color: '#FF4D8D',
    fontSize: 16,
    fontWeight: '700',
  },
});
