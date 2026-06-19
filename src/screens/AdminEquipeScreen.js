import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, TextInput, Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '../components/BottomSheet';

const PAPEIS = ['Admin', 'Gerente', 'Estoque', 'Caixa'];

function getIniciais(nome) {
  if (!nome) return '?';
  return nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

function AdminForm({ onSalvar }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [conf, setConf] = useState('');
  const [papel, setPapel] = useState('Gerente');
  const [verSenha, setVerSenha] = useState(false);

  const senhaCurta = senha.length > 0 && senha.length < 6;
  const naoBatem = conf.length > 0 && conf !== senha;
  const valido = nome.trim() && email.includes('@') && senha.length >= 6 && conf === senha;

  return (
    <>
      <Text style={styles.sectionLabel}>Dados de acesso</Text>
      <View style={{ marginTop: 12 }}>
        <Text style={styles.label}>Nome *</Text>
        <TextInput testID="input-nome-equipe" style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" placeholderTextColor="#9090A0" autoCapitalize="words" />

        <Text style={styles.label}>E-mail *</Text>
        <TextInput testID="input-email-equipe" style={styles.input} value={email} onChangeText={setEmail} placeholder="nome@gelatomec.com" placeholderTextColor="#9090A0" keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Senha de acesso *</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            testID="input-senha-equipe"
            style={[styles.input, { paddingRight: 52 }, senhaCurta && { borderColor: '#E5484D' }]}
            value={senha} onChangeText={setSenha}
            placeholder="Mínimo 6 caracteres" placeholderTextColor="#9090A0"
            secureTextEntry={!verSenha}
          />
          <TouchableOpacity style={styles.olhoBtn} onPress={() => setVerSenha(!verSenha)}>
            <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9090A0" />
          </TouchableOpacity>
        </View>
        {senhaCurta && <Text style={styles.erroText}>A senha deve ter ao menos 6 caracteres</Text>}

        <Text style={styles.label}>Confirmar senha *</Text>
        <TextInput
          testID="input-confirmar-equipe"
          style={[styles.input, naoBatem && { borderColor: '#E5484D' }]}
          value={conf} onChangeText={setConf}
          placeholder="Repita a senha" placeholderTextColor="#9090A0"
          secureTextEntry={!verSenha}
        />
        {naoBatem && <Text style={styles.erroText}>As senhas não coincidem</Text>}

        <Text style={styles.label}>Função</Text>
        <View style={styles.papelRow}>
          {PAPEIS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.papelBtn, papel === p && styles.papelBtnAtivo]}
              onPress={() => setPapel(p)}
            >
              <Text style={[styles.papelBtnText, papel === p && styles.papelBtnTextAtivo]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoCardText}>O novo admin já poderá entrar no painel com este e-mail e senha.</Text>
      </View>

      <TouchableOpacity
        testID="btn-cadastrar-admin"
        style={[styles.botaoPink, !valido && { opacity: 0.5 }]}
        onPress={() => valido && onSalvar({ nome: nome.trim(), email: email.trim(), papel, senha })}
        disabled={!valido}
      >
        <Ionicons name="checkmark" size={20} color="#fff" />
        <Text style={styles.botaoPinkText}>Cadastrar admin</Text>
      </TouchableOpacity>
    </>
  );
}

function EditarAdminForm({ admin, onSalvar }) {
  const [nome, setNome] = useState(admin?.nome || '');
  const [papel, setPapel] = useState(admin?.papel || 'Gerente');
  const valido = nome.trim().length > 0;

  return (
    <>
      <Text style={styles.sectionLabel}>Editar {admin?.nome}</Text>
      <View style={{ marginTop: 12 }}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome completo"
          placeholderTextColor="#9090A0"
          autoCapitalize="words"
        />
        <Text style={styles.label}>Função</Text>
        <View style={styles.papelRow}>
          {PAPEIS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.papelBtn, papel === p && styles.papelBtnAtivo]}
              onPress={() => setPapel(p)}
            >
              <Text style={[styles.papelBtnText, papel === p && styles.papelBtnTextAtivo]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.botaoPink, !valido && { opacity: 0.5 }]}
        onPress={() => valido && onSalvar({ nome: nome.trim(), papel })}
        disabled={!valido}
      >
        <Ionicons name="checkmark" size={20} color="#fff" />
        <Text style={styles.botaoPinkText}>Salvar alterações</Text>
      </TouchableOpacity>
    </>
  );
}

function TrocarSenhaForm({ admin, onSalvar }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [conf, setConf] = useState('');
  const [verSenha, setVerSenha] = useState(false);

  const senhaCurta = novaSenha.length > 0 && novaSenha.length < 6;
  const naoBatem = conf.length > 0 && conf !== novaSenha;
  const valido = novaSenha.length >= 6 && conf === novaSenha;

  return (
    <>
      <Text style={styles.sectionLabel}>Alterar senha de {admin?.nome}</Text>
      <View style={{ marginTop: 12 }}>
        <Text style={styles.label}>Nova senha *</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[styles.input, { paddingRight: 52 }, senhaCurta && { borderColor: '#E5484D' }]}
            value={novaSenha} onChangeText={setNovaSenha}
            placeholder="Mínimo 6 caracteres" placeholderTextColor="#9090A0"
            secureTextEntry={!verSenha}
          />
          <TouchableOpacity style={styles.olhoBtn} onPress={() => setVerSenha(!verSenha)}>
            <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9090A0" />
          </TouchableOpacity>
        </View>
        {senhaCurta && <Text style={styles.erroText}>A senha deve ter ao menos 6 caracteres</Text>}

        <Text style={styles.label}>Confirmar nova senha *</Text>
        <TextInput
          style={[styles.input, naoBatem && { borderColor: '#E5484D' }]}
          value={conf} onChangeText={setConf}
          placeholder="Repita a senha" placeholderTextColor="#9090A0"
          secureTextEntry={!verSenha}
        />
        {naoBatem && <Text style={styles.erroText}>As senhas não coincidem</Text>}
      </View>

      <TouchableOpacity
        style={[styles.botaoPink, !valido && { opacity: 0.5 }]}
        onPress={() => valido && onSalvar(novaSenha)}
        disabled={!valido}
      >
        <Ionicons name="key-outline" size={20} color="#fff" />
        <Text style={styles.botaoPinkText}>Salvar nova senha</Text>
      </TouchableOpacity>
    </>
  );
}

export default function AdminEquipeScreen({ admins, onAdicionarAdmin, onDeletarAdmin, onAlterarSenhaAdmin, onEditarAdmin, usuarioLogado }) {
  const [sheetAberta, setSheetAberta] = useState(false);
  const [adminEditando, setAdminEditando] = useState(null);
  const [adminEditandoDados, setAdminEditandoDados] = useState(null);

  const confirmaDelete = (admin) => {
    Alert.alert(
      'Remover acesso',
      `Remover o acesso de "${admin.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => onDeletarAdmin(admin.id) },
      ]
    );
  };

  const handleSalvar = async (dados) => {
    const resultado = await onAdicionarAdmin(dados);
    if (resultado === 'duplicado') {
      Alert.alert('E-mail já cadastrado', 'Já existe um membro da equipe com este e-mail.');
      return;
    }
    setSheetAberta(false);
  };

  const handleAlterarSenha = async (novaSenha) => {
    await onAlterarSenhaAdmin(adminEditando.id, novaSenha);
    setAdminEditando(null);
    Alert.alert('Senha alterada', `A senha de ${adminEditando.nome} foi atualizada com sucesso.`);
  };

  const handleEditarDados = async (dados) => {
    await onEditarAdmin(adminEditandoDados.id, dados);
    setAdminEditandoDados(null);
    Alert.alert('Alterações salvas', `Os dados de ${dados.nome} foram atualizados.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appbar}>
        <Text style={styles.appbarTitle}>Equipe</Text>
        <TouchableOpacity testID="add-equipe-btn" style={styles.addBtn} onPress={() => setSheetAberta(true)} activeOpacity={0.8}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={admins}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text testID="contador-equipe" style={styles.contador}>{admins.length} administrador{admins.length !== 1 ? 'es' : ''}</Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const eDono = item.dono || item.email === usuarioLogado?.email;
          return (
            <View style={styles.rowItem}>
              <View style={[styles.avatarThumb, { backgroundColor: eDono ? '#3D1A78' : '#FF4D8D' }]}>
                <Text style={styles.avatarThumbText}>{getIniciais(item.nome)}</Text>
              </View>
              <View style={styles.meta}>
                <View style={styles.metaNomeRow}>
                  <Text style={styles.metaNome}>{item.nome}</Text>
                  {eDono && <Ionicons name="ribbon" size={14} color="#E8A100" style={{ marginLeft: 4 }} />}
                </View>
                <Text style={styles.metaEmail}>{item.email}</Text>
                <View style={styles.papelBadge}>
                  <Text style={styles.papelBadgeText}>{item.papel || 'Gerente'}</Text>
                </View>
              </View>
              {!eDono && (
                <View style={styles.acoesBotoes}>
                  <TouchableOpacity style={styles.actionEdit} onPress={() => setAdminEditandoDados(item)} activeOpacity={0.7}>
                    <Ionicons name="pencil-outline" size={17} color="#FF8C00" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionKey} onPress={() => setAdminEditando(item)} activeOpacity={0.7}>
                    <Ionicons name="key-outline" size={17} color="#3D1A78" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionDel} onPress={() => confirmaDelete(item)} activeOpacity={0.7}>
                    <Ionicons name="trash-outline" size={17} color="#E5484D" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>👥</Text>
            <Text style={styles.vazioTexto}>Nenhum administrador cadastrado</Text>
          </View>
        }
      />

      <BottomSheet
        visible={sheetAberta}
        title="Novo administrador"
        onClose={() => setSheetAberta(false)}
      >
        <AdminForm onSalvar={handleSalvar} />
      </BottomSheet>

      <BottomSheet
        visible={!!adminEditandoDados}
        title="Editar membro"
        onClose={() => setAdminEditandoDados(null)}
      >
        <EditarAdminForm admin={adminEditandoDados} onSalvar={handleEditarDados} />
      </BottomSheet>

      <BottomSheet
        visible={!!adminEditando}
        title="Alterar senha"
        onClose={() => setAdminEditando(null)}
      >
        <TrocarSenhaForm admin={adminEditando} onSalvar={handleAlterarSenha} />
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
  avatarThumb: {
    width: 54, height: 54, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarThumbText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  meta: { flex: 1, minWidth: 0 },
  metaNomeRow: { flexDirection: 'row', alignItems: 'center' },
  metaNome: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },
  metaEmail: { fontSize: 13, color: '#555566', fontWeight: '600', marginTop: 2 },
  papelBadge: {
    backgroundColor: '#EDE3FF', borderRadius: 999,
    paddingHorizontal: 8, paddingVertical: 3, marginTop: 5, alignSelf: 'flex-start',
  },
  papelBadgeText: { fontSize: 11, fontWeight: '800', color: '#3D1A78' },
  acoesBotoes: { flexDirection: 'row', gap: 8 },
  actionEdit: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' },
  actionKey: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EDE3FF', alignItems: 'center', justifyContent: 'center' },
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
  olhoBtn: { position: 'absolute', right: 12, top: 13 },
  erroText: { color: '#E5484D', fontSize: 12.5, fontWeight: '700', marginTop: 5 },
  papelRow: { flexDirection: 'row', gap: 8 },
  papelBtn: {
    flex: 1, backgroundColor: '#F4F0FF', borderRadius: 12,
    paddingVertical: 10, alignItems: 'center',
  },
  papelBtnAtivo: { backgroundColor: '#3D1A78' },
  papelBtnText: { fontSize: 13, fontWeight: '800', color: '#3D1A78' },
  papelBtnTextAtivo: { color: '#fff' },
  infoCard: {
    backgroundColor: '#FBF8FF', borderRadius: 13, padding: 14, marginTop: 16,
  },
  infoCardText: { fontSize: 13, color: '#555566', fontWeight: '700', lineHeight: 19 },
  botaoPink: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FF4D8D', borderRadius: 15, paddingVertical: 15, marginTop: 20,
    shadowColor: '#FF4D8D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  botaoPinkText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
