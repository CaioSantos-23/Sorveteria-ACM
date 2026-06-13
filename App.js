import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';

// Usuário
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MapScreen from './src/screens/MapScreen';

// Admin
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminProdutosScreen from './src/screens/AdminProdutosScreen';
import AdminLojasScreen from './src/screens/AdminLojasScreen';
import AdminEquipeScreen from './src/screens/AdminEquipeScreen';
import AdminPerfilScreen from './src/screens/AdminPerfilScreen';

// Componentes
import TabBar from './src/components/TabBar';

// Hooks
import { useAuth } from './src/hooks/useAuth';
import { useProducts } from './src/hooks/useProducts';
import { useProfile } from './src/hooks/useProfile';
import { useLojas } from './src/hooks/useLojas';
import { useAdmins } from './src/hooks/useAdmins';

const TABS_USUARIO = [
  { id: 'home', label: 'Início', icon: 'home' },
  { id: 'mapa', label: 'Franquias', icon: 'map' },
];

const TABS_ADMIN = [
  { id: 'painel', label: 'Painel', icon: 'chart' },
  { id: 'produtos', label: 'Produtos', icon: 'grid' },
  { id: 'lojas', label: 'Lojas', icon: 'store' },
  { id: 'equipe', label: 'Equipe', icon: 'team' },
];

function detectaAdmin(email) {
  const e = (email || '').toLowerCase();
  return e.includes('admin') || e.includes('@gelatomec.com');
}

export default function App() {
  const [splashFim, setSplashFim] = useState(false);

  const {
    usuarioLogado,
    ultimoUsuario,
    biometriaDisponivel,
    carregando,
    login,
    cadastrar,
    logout,
    autenticarBiometria,
    ativarBiometria,
  } = useAuth();

  const logado = !!usuarioLogado;
  const { produtos, adicionarProduto, editarProduto, deletarProduto } = useProducts(logado);
  const { lojas, adicionarLoja, editarLoja, deletarLoja } = useLojas(logado);
  const { admins, adicionarAdmin, deletarAdmin, alterarSenhaAdmin } = useAdmins(logado);
  const { perfil, salvarPerfil } = useProfile(usuarioLogado?.email);

  // Auth state
  const [telaAuth, setTelaAuth] = useState('login');

  // Navegação usuário
  const [abaUser, setAbaUser] = useState('home');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [verPerfil, setVerPerfil] = useState(false);

  // Navegação admin
  const [abaAdmin, setAbaAdmin] = useState('painel');
  const [verPerfilAdmin, setVerPerfilAdmin] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);
  const [telaAdicionarProduto, setTelaAdicionarProduto] = useState(false);

  const ehAdmin = detectaAdmin(usuarioLogado?.email);

  // ========================
  // HANDLERS AUTH
  // ========================
  const handleLogin = async (email, senha) => {
    const ok = await login(email, senha);
    if (!ok) { Alert.alert('Erro', 'E-mail ou senha incorretos.'); return; }
  };

  const handleCadastro = async (dados) => {
    const resultado = await cadastrar(dados);
    if (resultado === 'duplicado') {
      Alert.alert('Atenção', 'Este e-mail já está cadastrado.');
      return;
    }
    if (biometriaDisponivel) {
      Alert.alert(
        'Conta criada!',
        `Bem-vindo(a), ${dados.nome}!\n\nDeseja ativar login por biometria?`,
        [
          { text: 'Agora não', onPress: () => setTelaAuth('login') },
          {
            text: 'Ativar', onPress: async () => {
              await ativarBiometria(dados);
              setTelaAuth('login');
            },
          },
        ]
      );
    } else {
      Alert.alert('Conta criada!', `Bem-vindo(a), ${dados.nome}! Faça o login.`, [
        { text: 'OK', onPress: () => setTelaAuth('login') },
      ]);
    }
  };

  const handleBiometria = async () => {
    await autenticarBiometria();
  };

  const handleVerificarEmail = async (emailDigitado) => {
    const usuariosJson = await AsyncStorage.getItem('@gelato_mec:usuarios');
    const lista = usuariosJson ? JSON.parse(usuariosJson) : [];
    if (lista.some(u => u.email === emailDigitado)) return true;
    try {
      const { get, ref } = await import('firebase/database');
      const { db } = await import('./src/services/firebaseConfig');
      const snapshot = await get(ref(db, 'admins'));
      if (snapshot.exists()) {
        const dados = snapshot.val();
        return Object.values(dados).some(a => a.email === emailDigitado);
      }
    } catch (e) {}
    return false;
  };

  const handleRedefinirSenha = async (emailDigitado, novaSenha) => {
    // Atualiza em AsyncStorage (usuários comuns)
    const usuariosJson = await AsyncStorage.getItem('@gelato_mec:usuarios');
    const lista = usuariosJson ? JSON.parse(usuariosJson) : [];
    const idx = lista.findIndex(u => u.email === emailDigitado);
    if (idx !== -1) {
      lista[idx].senha = novaSenha;
      await AsyncStorage.setItem('@gelato_mec:usuarios', JSON.stringify(lista));
      return;
    }
    // Atualiza no Firebase (admins/equipe)
    try {
      const { get, ref, update } = await import('firebase/database');
      const { db } = await import('./src/services/firebaseConfig');
      const snapshot = await get(ref(db, 'admins'));
      if (snapshot.exists()) {
        const dados = snapshot.val();
        const entrada = Object.entries(dados).find(([, v]) => v.email === emailDigitado);
        if (entrada) {
          await update(ref(db, `admins/${entrada[0]}`), { senha: novaSenha });
        }
      }
    } catch (e) {}
  };

  const handleTrocarSenha = async (senhaAtual, novaSenha) => {
    const usuariosJson = await AsyncStorage.getItem('@gelato_mec:usuarios');
    const lista = usuariosJson ? JSON.parse(usuariosJson) : [];
    const idx = lista.findIndex(u => u.email === usuarioLogado.email && u.senha === senhaAtual);
    if (idx === -1) return false;
    lista[idx].senha = novaSenha;
    await AsyncStorage.setItem('@gelato_mec:usuarios', JSON.stringify(lista));
    return true;
  };

  const handleSair = () => {
    logout();
    setTelaAuth('login');
    setAbaUser('home');
    setAbaAdmin('painel');
    setProdutoSelecionado(null);
    setVerPerfil(false);
    setVerPerfilAdmin(false);
    setTelaAdicionarProduto(false);
    setProdutoParaEditar(null);
  };

  // ========================
  // HANDLERS PRODUTOS
  // ========================
  const handleAdicionarProduto = async (dados) => {
    const novo = await adicionarProduto(dados);
    Alert.alert('Produto salvo!', `${novo.name} foi adicionado.`, [
      { text: 'OK', onPress: () => { setTelaAdicionarProduto(false); setProdutoParaEditar(null); } },
    ]);
  };

  const handleEditarProduto = async (dados) => {
    await editarProduto(produtoParaEditar.id, dados);
    Alert.alert('Produto atualizado!', `${dados.name} foi atualizado.`, [
      { text: 'OK', onPress: () => { setTelaAdicionarProduto(false); setProdutoParaEditar(null); } },
    ]);
  };

  const abrirEdicaoProduto = (produto) => {
    setProdutoParaEditar(produto);
    setTelaAdicionarProduto(true);
  };

  // ========================
  // SPLASH
  // ========================
  if (!splashFim || carregando) {
    return <SplashScreen onFim={() => setSplashFim(true)} />;
  }

  // ========================
  // AUTH
  // ========================
  if (!usuarioLogado) {
    if (telaAuth === 'cadastro') {
      return (
        <>
          <RegisterScreen
            onRegister={handleCadastro}
            onGoLogin={() => setTelaAuth('login')}
            onAtivarBiometria={biometriaDisponivel}
          />
          <StatusBar style="light" />
        </>
      );
    }
    if (telaAuth === 'recuperar') {
      return (
        <>
          <RecuperarSenhaScreen
            onVoltar={() => setTelaAuth('login')}
            onVerificarEmail={handleVerificarEmail}
            onRedefinirSenha={handleRedefinirSenha}
          />
          <StatusBar style="light" />
        </>
      );
    }
    return (
      <>
        <LoginScreen
          onLogin={handleLogin}
          onGoRegister={() => setTelaAuth('cadastro')}
          onBiometria={handleBiometria}
          biometriaDisponivel={biometriaDisponivel}
          ultimoUsuario={ultimoUsuario}
          onRecuperarSenha={() => setTelaAuth('recuperar')}
        />
        <StatusBar style="light" />
      </>
    );
  }

  // ========================
  // APP USUÁRIO
  // ========================
  if (!ehAdmin) {
    // Sub-telas sem tab bar
    if (produtoSelecionado) {
      return (
        <View style={styles.container}>
          <StatusBar style="light" />
          <ProductDetailScreen
            produto={produtoSelecionado}
            onVoltar={() => setProdutoSelecionado(null)}
          />
        </View>
      );
    }

    if (verPerfil) {
      return (
        <View style={styles.container}>
          <StatusBar style="light" />
          <ProfileScreen
            usuario={usuarioLogado}
            perfil={perfil}
            onSalvar={salvarPerfil}
            onVoltar={() => setVerPerfil(false)}
            onSair={handleSair}
            onTrocarSenha={handleTrocarSenha}
          />
        </View>
      );
    }

    // Telas com tab bar
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={{ flex: 1 }}>
          {abaUser === 'home' && (
            <HomeScreen
              produtos={produtos}
              usuario={usuarioLogado}
              perfil={perfil}
              onSelectProduto={(p) => setProdutoSelecionado(p)}
              onAbrirPerfil={() => setVerPerfil(true)}
            />
          )}
          {abaUser === 'mapa' && (
            <MapScreen lojas={lojas} />
          )}
        </View>
        <TabBar tabs={TABS_USUARIO} active={abaUser} onChange={setAbaUser} />
      </View>
    );
  }

  // ========================
  // APP ADMIN
  // ========================

  // Adicionar / editar produto (tela cheia sem tab bar)
  if (telaAdicionarProduto) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <AddProductScreen
          produto={produtoParaEditar}
          onSalvar={produtoParaEditar ? handleEditarProduto : handleAdicionarProduto}
          onVoltar={() => { setTelaAdicionarProduto(false); setProdutoParaEditar(null); }}
        />
      </View>
    );
  }

  // Perfil do admin (sem tab bar)
  if (verPerfilAdmin) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <AdminPerfilScreen
          usuario={usuarioLogado}
          perfil={perfil}
          onSalvar={salvarPerfil}
          onVoltar={() => setVerPerfilAdmin(false)}
          onSair={handleSair}
        />
      </View>
    );
  }

  // Telas admin com tab bar
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        {abaAdmin === 'painel' && (
          <AdminDashboardScreen
            produtos={produtos}
            lojas={lojas}
            admins={admins}
            usuario={usuarioLogado}
            onAbrirPerfil={() => setVerPerfilAdmin(true)}
          />
        )}
        {abaAdmin === 'produtos' && (
          <AdminProdutosScreen
            produtos={produtos}
            onNovoProduto={() => { setProdutoParaEditar(null); setTelaAdicionarProduto(true); }}
            onEditarProduto={abrirEdicaoProduto}
            onDeletarProduto={deletarProduto}
          />
        )}
        {abaAdmin === 'lojas' && (
          <AdminLojasScreen
            lojas={lojas}
            onAdicionarLoja={adicionarLoja}
            onEditarLoja={editarLoja}
            onDeletarLoja={deletarLoja}
          />
        )}
        {abaAdmin === 'equipe' && (
          <AdminEquipeScreen
            admins={admins}
            onAdicionarAdmin={adicionarAdmin}
            onDeletarAdmin={deletarAdmin}
            onAlterarSenhaAdmin={alterarSenhaAdmin}
            usuarioLogado={usuarioLogado}
          />
        )}
      </View>
      <TabBar tabs={TABS_ADMIN} active={abaAdmin} onChange={setAbaAdmin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F0FF' },
});
