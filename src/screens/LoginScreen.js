import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, Pressable,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logo } from '../utils/images';

function ehAdmin(email) {
  const e = email.toLowerCase();
  return e.includes('admin') || e.includes('@gelatomec.com');
}

export default function LoginScreen({ onLogin, onGoRegister, onBiometria, biometriaDisponivel, ultimoUsuario, onRecuperarSenha }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const isAdmin = ehAdmin(email);

  const handleEsqueceuSenha = () => {
    onRecuperarSenha();
  };

  const handleLogin = () => {
    if (!email.trim()) { Alert.alert('E-mail obrigatório', 'Por favor, informe seu e-mail.'); return; }
    if (!senha.trim()) { Alert.alert('Senha obrigatória', 'Por favor, informe sua senha.'); return; }
    onLogin(email.trim().toLowerCase(), senha);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={styles.headerArea}>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logoImg} resizeMode="cover" />
            </View>
            <Text style={styles.appName}>Gelato MEC</Text>
            <Text style={styles.tagline}>Sabor que derrete o coração</Text>
          </View>

          {/* Card */}
          <View style={styles.card} importantForAutofill="noExcludeDescendants">
            {isAdmin && (
              <View style={styles.adminBadge}>
                <Ionicons name="ribbon" size={14} color="#3D1A78" />
                <Text style={styles.adminBadgeText}>Conta de administrador detectada</Text>
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                testID="input-email-login"
                style={styles.input}
                placeholder="voce@email.com"
                placeholderTextColor="#9090A0"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="off"
                importantForAutofill="no"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.senhaContainer}>
                <TextInput
                  testID="input-senha-login"
                  style={[styles.input, { paddingRight: 52 }]}
                  placeholder="••••••"
                  placeholderTextColor="#9090A0"
                  secureTextEntry={!mostrarSenha}
                  autoComplete="off"
                  importantForAutofill="no"
                  value={senha}
                  onChangeText={setSenha}
                />
                <TouchableOpacity
                  style={styles.olhoBtn}
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                >
                  <Ionicons name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9090A0" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.botaoPrimario} onPress={handleLogin}>
              <Text style={styles.botaoPrimarioText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkEsqueceu} onPress={handleEsqueceuSenha}>
              <Text style={styles.linkEsqueceuText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            {!isAdmin && (
              <TouchableOpacity testID="btn-criar-conta" style={styles.botaoSecundario} onPress={onGoRegister}>
                <Text style={styles.botaoSecundarioText}>Criar conta</Text>
              </TouchableOpacity>
            )}

            {biometriaDisponivel && ultimoUsuario && (
              <TouchableOpacity style={styles.biometriaBtn} onPress={onBiometria}>
                <Ionicons name="finger-print-outline" size={22} color="#3D1A78" />
                <Text style={styles.biometriaText}>
                  Entrar como {ultimoUsuario.nome} com biometria
                </Text>
              </TouchableOpacity>
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
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingVertical: 32,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 8,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    backgroundColor: '#F7F2E7',
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDE3FF',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  adminBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3D1A78',
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 7,
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
  senhaContainer: {
    position: 'relative',
  },
  olhoBtn: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  botaoPrimario: {
    backgroundColor: '#3D1A78',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  botaoPrimarioText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  botaoSecundario: {
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#F4F0FF',
  },
  botaoSecundarioText: {
    color: '#3D1A78',
    fontSize: 16,
    fontWeight: '800',
  },
  biometriaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: '#F4F0FF',
    borderRadius: 13,
    gap: 8,
  },
  biometriaText: {
    color: '#3D1A78',
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  linkEsqueceu: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
  },
  linkEsqueceuText: {
    color: '#9090A0',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
