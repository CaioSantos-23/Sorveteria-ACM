import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logo } from '../utils/images';
import { Image } from 'react-native';

export default function RecuperarSenhaScreen({ onVoltar, onVerificarEmail, onRedefinirSenha }) {
  const [passo, setPasso] = useState(1); // 1 = email, 2 = nova senha
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confSenha, setConfSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const senhaCurta = novaSenha.length > 0 && novaSenha.length < 6;
  const naoBatem = confSenha.length > 0 && confSenha !== novaSenha;
  const senhaValida = novaSenha.length >= 6 && confSenha === novaSenha;

  const handleVerificar = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido.');
      return;
    }
    setCarregando(true);
    const encontrado = await onVerificarEmail(email.trim().toLowerCase());
    setCarregando(false);
    if (!encontrado) {
      Alert.alert('E-mail não encontrado', 'Não existe conta cadastrada com este e-mail.');
      return;
    }
    setPasso(2);
  };

  const handleRedefinir = async () => {
    if (!senhaValida) return;
    setCarregando(true);
    await onRedefinirSenha(email.trim().toLowerCase(), novaSenha);
    setCarregando(false);
    Alert.alert(
      'Senha redefinida!',
      'Sua senha foi atualizada com sucesso. Faça o login com a nova senha.',
      [{ text: 'Ir para login', onPress: onVoltar }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Header */}
          <TouchableOpacity style={styles.voltarBtn} onPress={onVoltar}>
            <Ionicons name="arrow-back-outline" size={22} color="#fff" />
            <Text style={styles.voltarText}>Voltar ao login</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.headerArea}>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logoImg} resizeMode="cover" />
            </View>
            <Text style={styles.titulo}>Recuperar senha</Text>
            <Text style={styles.subtitulo}>
              {passo === 1
                ? 'Informe o e-mail cadastrado na sua conta'
                : 'Crie uma nova senha para sua conta'}
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Indicador de passos */}
            <View style={styles.passos}>
              <View style={[styles.passo, passo >= 1 && styles.passoAtivo]}>
                <Text style={[styles.passoNum, passo >= 1 && styles.passoNumAtivo]}>1</Text>
              </View>
              <View style={[styles.passoDivisor, passo >= 2 && styles.passoDivisorAtivo]} />
              <View style={[styles.passo, passo >= 2 && styles.passoAtivo]}>
                <Text style={[styles.passoNum, passo >= 2 && styles.passoNumAtivo]}>2</Text>
              </View>
            </View>

            {passo === 1 ? (
              <>
                <Text style={styles.label}>E-mail cadastrado</Text>
                <TextInput
                  style={styles.input}
                  placeholder="voce@email.com"
                  placeholderTextColor="#9090A0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  autoFocus
                />
                <TouchableOpacity
                  style={[styles.botao, (!email.trim() || carregando) && { opacity: 0.5 }]}
                  onPress={handleVerificar}
                  disabled={!email.trim() || carregando}
                >
                  <Text style={styles.botaoText}>{carregando ? 'Verificando...' : 'Continuar'}</Text>
                  {!carregando && <Ionicons name="arrow-forward-outline" size={18} color="#fff" />}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.emailConfirmado}>
                  <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                  <Text style={styles.emailConfirmadoText}>{email}</Text>
                </View>

                <Text style={styles.label}>Nova senha</Text>
                <View style={styles.senhaContainer}>
                  <TextInput
                    style={[styles.input, { paddingRight: 52 }, senhaCurta && styles.inputErro]}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#9090A0"
                    secureTextEntry={!verSenha}
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    autoFocus
                  />
                  <TouchableOpacity style={styles.olhoBtn} onPress={() => setVerSenha(!verSenha)}>
                    <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9090A0" />
                  </TouchableOpacity>
                </View>
                {senhaCurta && <Text style={styles.erroText}>A senha deve ter ao menos 6 caracteres</Text>}

                <Text style={styles.label}>Confirmar nova senha</Text>
                <TextInput
                  style={[styles.input, naoBatem && styles.inputErro]}
                  placeholder="Repita a nova senha"
                  placeholderTextColor="#9090A0"
                  secureTextEntry={!verSenha}
                  value={confSenha}
                  onChangeText={setConfSenha}
                />
                {naoBatem && <Text style={styles.erroText}>As senhas não coincidem</Text>}

                <TouchableOpacity
                  style={[styles.botao, (!senhaValida || carregando) && { opacity: 0.5 }]}
                  onPress={handleRedefinir}
                  disabled={!senhaValida || carregando}
                >
                  <Ionicons name="key-outline" size={18} color="#fff" />
                  <Text style={styles.botaoText}>{carregando ? 'Salvando...' : 'Redefinir senha'}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingVertical: 20,
  },
  voltarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  voltarText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 14,
    elevation: 8,
    backgroundColor: '#F7F2E7',
  },
  logoImg: { width: '100%', height: '100%' },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    elevation: 10,
  },
  passos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 0,
  },
  passo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECE7F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passoAtivo: { backgroundColor: '#3D1A78' },
  passoNum: { fontSize: 15, fontWeight: '800', color: '#9090A0' },
  passoNumAtivo: { color: '#fff' },
  passoDivisor: {
    flex: 1,
    height: 2,
    backgroundColor: '#ECE7F5',
    marginHorizontal: 8,
  },
  passoDivisorAtivo: { backgroundColor: '#3D1A78' },
  emailConfirmado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  emailConfirmadoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803D',
    flexShrink: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 7,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ECE7F5',
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  inputErro: { borderColor: '#E5484D' },
  senhaContainer: { position: 'relative' },
  olhoBtn: { position: 'absolute', right: 12, top: 14 },
  erroText: {
    color: '#E5484D',
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 5,
    marginBottom: 2,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF4D8D',
    borderRadius: 15,
    paddingVertical: 15,
    marginTop: 20,
    elevation: 6,
    shadowColor: '#FF4D8D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  botaoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
