import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, Alert, Image, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

function getIniciais(nome) {
  if (!nome) return '?';
  return nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

export default function AdminPerfilScreen({ usuario, perfil, onSalvar, onVoltar, onSair }) {
  const [nome, setNome] = useState(perfil?.nome || usuario?.nome || '');
  const [fotoUri, setFotoUri] = useState(perfil?.fotoUri || null);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confSenha, setConfSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const senhaCurta = novaSenha.length > 0 && novaSenha.length < 6;
  const naoBatem = confSenha.length > 0 && confSenha !== novaSenha;
  const podeTrocar = senhaAtual.length > 0 && novaSenha.length >= 6 && confSenha === novaSenha;

  const escolherFoto = () => {
    Alert.alert('Foto de perfil', 'Como deseja adicionar sua foto?', [
      {
        text: 'Galeria', onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') return;
          const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
          if (!result.canceled) setFotoUri(result.assets[0].uri);
        },
      },
      {
        text: 'Câmera', onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return;
          const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
          if (!result.canceled) setFotoUri(result.assets[0].uri);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSalvar = () => {
    onSalvar({ nome, fotoUri });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  const handleTrocarSenha = () => {
    if (!podeTrocar) return;
    Alert.alert('Senha alterada!', 'Sua senha foi atualizada com sucesso.');
    setSenhaAtual('');
    setNovaSenha('');
    setConfSenha('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.appbar}>
          <TouchableOpacity onPress={onVoltar} style={styles.voltarBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
            <Text style={styles.voltarText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.appbarTitle}>Meu Perfil</Text>
          <View style={{ width: 70 }} />
        </View>

        <View style={styles.content}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* Avatar */}
            <View style={styles.avatarArea}>
              <TouchableOpacity onPress={escolherFoto} style={styles.avatarWrapper} activeOpacity={0.8}>
                {fotoUri ? (
                  <Image source={{ uri: fotoUri }} style={styles.avatarFoto} />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarTexto}>{getIniciais(usuario?.nome)}</Text>
                  </View>
                )}
                <View style={styles.cameraBtn}>
                  <Ionicons name="camera" size={15} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarNome}>{nome || usuario?.nome}</Text>
              <Text style={styles.avatarEmail}>{usuario?.email}</Text>
              <View style={styles.adminBadge}>
                <Ionicons name="ribbon" size={13} color="#3D1A78" />
                <Text style={styles.adminBadgeText}>Administrador</Text>
              </View>
            </View>

            {/* Dados da conta */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>Dados da conta</Text>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                testID="input-nome"
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
                placeholderTextColor="#9090A0"
                autoCapitalize="words"
              />
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputReadOnly}>
                <Text style={styles.inputReadOnlyText}>{usuario?.email}</Text>
                <Ionicons name="lock-closed-outline" size={16} color="#9090A0" />
              </View>
            </View>

            {/* Trocar senha */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>Trocar senha</Text>

              <Text style={styles.label}>Senha atual</Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={[styles.input, { paddingRight: 52 }]}
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                  placeholder="••••••"
                  placeholderTextColor="#9090A0"
                  secureTextEntry={!verSenha}
                />
                <TouchableOpacity style={styles.olhoBtn} onPress={() => setVerSenha(!verSenha)}>
                  <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9090A0" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Nova senha</Text>
              <TextInput
                style={[styles.input, senhaCurta && styles.inputErro]}
                value={novaSenha}
                onChangeText={setNovaSenha}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#9090A0"
                secureTextEntry={!verSenha}
              />
              {senhaCurta && <Text style={styles.erroText}>A senha deve ter ao menos 6 caracteres</Text>}

              <Text style={styles.label}>Confirmar nova senha</Text>
              <TextInput
                style={[styles.input, naoBatem && styles.inputErro]}
                value={confSenha}
                onChangeText={setConfSenha}
                placeholder="Repita a nova senha"
                placeholderTextColor="#9090A0"
                secureTextEntry={!verSenha}
              />
              {naoBatem && <Text style={styles.erroText}>As senhas não coincidem</Text>}

              <TouchableOpacity
                style={[styles.botaoTrocarSenha, !podeTrocar && { opacity: 0.4 }]}
                onPress={handleTrocarSenha}
                disabled={!podeTrocar}
              >
                <Text style={styles.botaoTrocarSenhaText}>Trocar senha</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity testID="btn-salvar-perfil" style={styles.botaoSalvar} onPress={handleSalvar}>
              <Ionicons name={salvo ? 'checkmark' : 'save-outline'} size={20} color="#fff" />
              <Text style={styles.botaoSalvarText}>{salvo ? 'Alterações salvas!' : 'Salvar alterações'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoSair} onPress={onSair}>
              <Ionicons name="log-out-outline" size={20} color="#E5484D" />
              <Text style={styles.botaoSairText}>Sair da conta</Text>
            </TouchableOpacity>

            <View style={{ height: 32 }} />
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  appbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#3D1A78',
  },
  voltarBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, minWidth: 70 },
  voltarText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  appbarTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  content: { flex: 1, backgroundColor: '#F4F0FF' },
  scroll: { padding: 16 },
  avatarArea: { alignItems: 'center', paddingVertical: 24 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 104, height: 104, borderRadius: 52,
    backgroundColor: '#3D1A78',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3D1A78', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
    borderWidth: 4, borderColor: '#FF4D8D',
  },
  avatarFoto: {
    width: 104, height: 104, borderRadius: 52,
    borderWidth: 4, borderColor: '#FF4D8D',
  },
  avatarTexto: { color: '#fff', fontSize: 38, fontWeight: '800' },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: -2,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#FF4D8D', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#F4F0FF',
  },
  avatarNome: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  avatarEmail: { fontSize: 14, color: '#9090A0', fontWeight: '600', marginBottom: 8 },
  adminBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#EDE3FF', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12,
  },
  adminBadgeText: { fontSize: 13, fontWeight: '800', color: '#3D1A78' },
  secao: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: '#3D1A78', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  secaoTitulo: {
    fontSize: 12, fontWeight: '800', color: '#3D1A78',
    textTransform: 'uppercase', letterSpacing: 0.6, opacity: 0.85, marginBottom: 12,
  },
  label: { fontSize: 14, fontWeight: '800', color: '#1A1A2E', marginTop: 10, marginBottom: 7 },
  input: {
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#ECE7F5',
    borderRadius: 13, paddingHorizontal: 15, paddingVertical: 13,
    fontSize: 15, fontWeight: '600', color: '#1A1A2E',
  },
  inputErro: { borderColor: '#E5484D' },
  inputReadOnly: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F8F8F8', borderWidth: 1.5, borderColor: '#ECE7F5',
    borderRadius: 13, paddingHorizontal: 15, paddingVertical: 13,
  },
  inputReadOnlyText: { fontSize: 15, fontWeight: '600', color: '#9090A0' },
  olhoBtn: { position: 'absolute', right: 12, top: 13 },
  erroText: { color: '#E5484D', fontSize: 12.5, fontWeight: '700', marginTop: 5 },
  botaoTrocarSenha: {
    backgroundColor: '#F4F0FF', borderRadius: 13, paddingVertical: 13,
    alignItems: 'center', marginTop: 16,
  },
  botaoTrocarSenhaText: { color: '#3D1A78', fontSize: 15, fontWeight: '800' },
  botaoSalvar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FF4D8D', borderRadius: 15, paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#FF4D8D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  botaoSalvarText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  botaoSair: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 15, paddingVertical: 15, borderWidth: 1.5, borderColor: '#E5484D',
  },
  botaoSairText: { color: '#E5484D', fontSize: 16, fontWeight: '700' },
});
