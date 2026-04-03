import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { logo } from '../utils/images';

export default function RegisterScreen({ onRegister, onGoLogin, onAtivarBiometria }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleCadastrar = () => {
    if (!nome.trim()) { Alert.alert('Nome obrigatório', 'Por favor, informe seu nome completo.'); return; }
    if (!email.trim() || !email.includes('@')) { Alert.alert('E-mail inválido', 'Informe um endereço de e-mail válido.'); return; }
    if (senha.length < 6) { Alert.alert('Senha fraca', 'Sua senha precisa ter pelo menos 6 caracteres.'); return; }
    if (senha !== confirmar) { Alert.alert('Senhas diferentes', 'A confirmação não coincide com a senha digitada.'); return; }
    const dadosUsuario = { nome: nome.trim(), email: email.trim().toLowerCase(), senha };
    onRegister(dadosUsuario, onAtivarBiometria);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logoImg} resizeMode="cover" />
          </View>
          <Text style={styles.tagline}>Crie sua conta e aproveite!</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cadastro</Text>

          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#aaa"
            autoCapitalize="words"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <View style={styles.senhaContainer}>
            <TextInput
              style={[styles.input, styles.senhaInput]}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#aaa"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity
              style={styles.olhoBtn}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
              <Text style={styles.olhoText}>{mostrarSenha ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={[styles.input, confirmar && senha !== confirmar && styles.inputErro]}
            placeholder="Repita a senha"
            placeholderTextColor="#aaa"
            secureTextEntry={!mostrarSenha}
            value={confirmar}
            onChangeText={setConfirmar}
          />
          {confirmar.length > 0 && senha !== confirmar && (
            <Text style={styles.erroText}>As senhas não coincidem</Text>
          )}

          <TouchableOpacity style={styles.botao} onPress={handleCadastrar}>
            <Text style={styles.botaoText}>Criar conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.voltarBtn} onPress={onGoLogin}>
            <Text style={styles.voltarText}>← Já tenho conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D1A78',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    width: 200,
    height: 109,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 8,
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  tagline: {
    fontSize: 14,
    color: '#D8B4FE',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  inputErro: {
    borderColor: '#FF4D4D',
    backgroundColor: '#FFF5F5',
  },
  erroText: {
    color: '#FF4D4D',
    fontSize: 12,
    marginTop: 4,
  },
  senhaContainer: {
    position: 'relative',
  },
  senhaInput: {
    paddingRight: 50,
  },
  olhoBtn: {
    position: 'absolute',
    right: 14,
    top: 13,
  },
  olhoText: {
    fontSize: 18,
  },
  botao: {
    backgroundColor: '#FF4D8D',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#FF4D8D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  voltarBtn: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  voltarText: {
    color: '#888',
    fontSize: 14,
  },
});
