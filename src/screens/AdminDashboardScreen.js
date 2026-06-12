import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function getIniciais(nome) {
  if (!nome) return '?';
  return nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

export default function AdminDashboardScreen({ produtos, lojas, admins, usuario, onAbrirPerfil }) {
  const estoqueBaixo = produtos.filter((p) => (p.qty ?? p.qtd ?? 0) <= 3);
  const totalEstoque = produtos.reduce((s, p) => s + (p.qty ?? p.qtd ?? 0), 0);
  const maisVendidos = [...produtos].sort((a, b) => (b.qty ?? b.qtd ?? 0) - (a.qty ?? a.qtd ?? 0)).slice(0, 4);
  const bars = [92, 74, 58, 41];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appbar}>
        <View style={styles.appbarLeft}>
          <View style={styles.adminBadge}>
            <Ionicons name="ribbon" size={13} color="#fff" />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
          <Text style={styles.appbarTitle}>Painel Admin</Text>
        </View>
        <TouchableOpacity testID="avatar-admin" style={styles.avatarPill} onPress={onAbrirPerfil} activeOpacity={0.8}>
          <Text style={styles.avatarTexto}>{getIniciais(usuario?.nome)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pad}>
          <Text style={styles.saudacao}>Olá, {(usuario?.nome || '').split(' ')[0]}! 👋</Text>
          <Text style={styles.subtitulo}>Resumo da operação hoje</Text>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.stat}>
              <Text style={styles.statValor}>{produtos.length}</Text>
              <Text style={styles.statLabel}>Sabores ativos</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValor}>{lojas.length}</Text>
              <Text style={styles.statLabel}>Franquias</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValor}>{totalEstoque}</Text>
              <Text style={styles.statLabel}>Itens em estoque</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValor}>R$ 1.248</Text>
              <Text style={styles.statLabel}>Vendas hoje</Text>
            </View>
          </View>

          {/* Alerta de estoque baixo */}
          {estoqueBaixo.length > 0 && (
            <View style={styles.alertaCard}>
              <View style={styles.alertaHeader}>
                <Ionicons name="notifications-outline" size={18} color="#E5484D" />
                <Text style={styles.alertaTitle}>Estoque baixo</Text>
              </View>
              {estoqueBaixo.map((p) => (
                <View key={p.id} style={styles.alertaItem}>
                  <Text style={styles.alertaItemNome}>{p.name || p.nome}</Text>
                  <View style={styles.badgeBaixo}>
                    <Text style={styles.badgeBaixoText}>{p.qty ?? p.qtd} un</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Mais vendidos */}
          <Text style={styles.sectionLabel}>Mais vendidos esta semana</Text>
          <View style={styles.card}>
            {maisVendidos.map((p, i) => (
              <View key={p.id} style={[styles.barItem, i < maisVendidos.length - 1 && styles.barItemBorder]}>
                <View style={styles.barInfo}>
                  <Text style={styles.barNome}>{p.name || p.nome}</Text>
                  <Text style={styles.barPct}>{bars[i]}%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${bars[i]}%` }]} />
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 16 }} />
        </View>
      </ScrollView>
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
  appbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  adminBadgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  appbarTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  avatarPill: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#FF4D8D',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.55)',
  },
  avatarTexto: { color: '#fff', fontSize: 16, fontWeight: '800' },
  scroll: { flex: 1, backgroundColor: '#F4F0FF' },
  pad: { padding: 16 },
  saudacao: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  subtitulo: { fontSize: 14, color: '#555566', fontWeight: '600', marginBottom: 16 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statValor: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D1A78',
    lineHeight: 32,
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, fontWeight: '700', color: '#555566' },
  alertaCard: {
    backgroundColor: '#FFF6F8',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#FFD9E4',
  },
  alertaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  alertaTitle: { fontSize: 15, fontWeight: '800', color: '#E5484D' },
  alertaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  alertaItemNome: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  badgeBaixo: {
    backgroundColor: '#FDECEC',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeBaixoText: { fontSize: 11, fontWeight: '800', color: '#E5484D' },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3D1A78',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.85,
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  barItem: { paddingVertical: 12 },
  barItemBorder: { borderBottomWidth: 1, borderBottomColor: '#ECE7F5' },
  barInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barNome: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  barPct: { fontSize: 13, fontWeight: '700', color: '#9090A0' },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F4F0FF',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#3D1A78',
  },
});
