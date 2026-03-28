import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

export default function LoginScreen({ onLogin, onGoRegister, onBiometria, biometriaDisponivel, ultimoUsuario }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    onLogin(email.trim().toLowerCase(), senha);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo / Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🍦</Text>
          <Text style={styles.brand}>Gelato MEC</Text>
          <Text style={styles.tagline}>Sabor que derrete o coração</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar</Text>

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
              placeholder="••••••••"
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

          <TouchableOpacity style={styles.botao} onPress={handleLogin}>
            <Text style={styles.botaoText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.linha} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.linha} />
          </View>

          <TouchableOpacity style={styles.botaoSecundario} onPress={onGoRegister}>
            <Text style={styles.botaoSecundarioText}>Criar conta</Text>
          </TouchableOpacity>

          {biometriaDisponivel && ultimoUsuario && (
            <TouchableOpacity style={styles.biometriaBtn} onPress={onBiometria}>
              <Text style={styles.biometriaEmoji}>👆</Text>
              <Text style={styles.biometriaText}>
                Entrar como {ultimoUsuario.nome} com biometria
              </Text>
            </TouchableOpacity>
          )}
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
    marginBottom: 32,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
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
    marginBottom: 24,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  linha: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#aaa',
    fontSize: 13,
  },
  botaoSecundario: {
    borderWidth: 2,
    borderColor: '#FF4D8D',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  botaoSecundarioText: {
    color: '#FF4D8D',
    fontSize: 16,
    fontWeight: '700',
  },
  biometriaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#F0E6FF',
    borderRadius: 12,
    gap: 8,
  },
  biometriaEmoji: {
    fontSize: 22,
  },
  biometriaText: {
    color: '#3D1A78',
    fontSize: 14,
    fontWeight: '600',
  },
});
