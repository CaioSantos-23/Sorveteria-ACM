import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet, Dimensions, SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.72;

export default function Sidebar({ aberta, onFechar, onNavigate, onSair, usuario }) {
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: aberta ? 0 : -SIDEBAR_WIDTH,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: aberta ? 1 : 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [aberta]);

  if (!aberta && slideAnim._value === -SIDEBAR_WIDTH) return null;

  const opcoes = [
    { id: 'mapa', emoji: '📍', label: 'Franquias no Mapa' },
    { id: 'adicionar', emoji: '➕', label: 'Cadastrar Produto' },
  ];

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents={aberta ? 'auto' : 'none'}>
      {/* Overlay escuro */}
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onFechar} activeOpacity={1} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header do drawer */}
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerEmoji}>🍦</Text>
            <Text style={styles.drawerBrand}>Gelato MEC</Text>
            {usuario && (
              <Text style={styles.drawerUsuario}>Ola, {usuario.nome}!</Text>
            )}
          </View>

          {/* Divisor */}
          <View style={styles.divisor} />

          {/* Opcoes */}
          <View style={styles.opcoes}>
            {opcoes.map((opcao) => (
              <TouchableOpacity
                key={opcao.id}
                style={styles.opcaoItem}
                onPress={() => onNavigate(opcao.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.opcaoEmoji}>{opcao.emoji}</Text>
                <Text style={styles.opcaoLabel}>{opcao.label}</Text>
                <Text style={styles.opcaoSeta}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rodapé */}
          <View style={styles.rodape}>
            <TouchableOpacity style={styles.sairBtn} onPress={onSair}>
              <Text style={styles.sairEmoji}>🚪</Text>
              <Text style={styles.sairText}>Sair da conta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fecharBtn} onPress={onFechar}>
              <Text style={styles.fecharText}>✕ Fechar menu</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 16,
  },
  drawerHeader: {
    backgroundColor: '#3D1A78',
    padding: 24,
    paddingTop: 40,
  },
  drawerEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  drawerBrand: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  drawerUsuario: {
    color: '#D8B4FE',
    fontSize: 14,
    marginTop: 4,
  },
  divisor: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  opcoes: {
    paddingVertical: 8,
  },
  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  opcaoEmoji: {
    fontSize: 22,
    width: 30,
  },
  opcaoLabel: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a2e',
    fontWeight: '600',
  },
  opcaoSeta: {
    fontSize: 20,
    color: '#ccc',
  },
  rodape: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 4,
  },
  sairBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sairEmoji: {
    fontSize: 18,
  },
  sairText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF4D8D',
  },
  fecharBtn: {
    paddingVertical: 8,
  },
  fecharText: {
    color: '#888',
    fontSize: 14,
  },
});
