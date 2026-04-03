import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MapScreen from './src/screens/MapScreen';
import Sidebar from './src/components/Sidebar';

import { useAuth } from './src/hooks/useAuth';
import { useProducts } from './src/hooks/useProducts';
import { useProfile } from './src/hooks/useProfile';

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

  const { produtos, adicionarProduto } = useProducts();
  const { perfil, salvarPerfil } = useProfile();

  const [tela, setTela] = useState('login');
  const [telaInterna, setTelaInterna] = useState('home');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [telaAnterior, setTelaAnterior] = useState(null);

  const navegar = (destino) => {
    setTelaAnterior(telaInterna);
    setTelaInterna(destino);
  };

  const voltar = () => {
    setTelaInterna(telaAnterior || 'home');
    setTelaAnterior(null);
  };

  // --- Auth ---
  const handleLogin = async (email, senha) => {
    const ok = await login(email, senha);
    if (!ok) { Alert.alert('Erro', 'E-mail ou senha incorretos.'); return; }
    setTela('app');
    setTelaInterna('home');
  };

  const handleCadastro = async (dados, callbackBiometria) => {
    const resultado = await cadastrar(dados);
    if (resultado === 'duplicado') {
      Alert.alert('Atenção', 'Este e-mail já está cadastrado.');
      return;
    }

    if (biometriaDisponivel && callbackBiometria) {
      Alert.alert(
        'Conta criada!',
        `Bem-vindo(a), ${dados.nome}!\n\nDeseja ativar login por biometria (digital/Face ID)?`,
        [
          { text: 'Agora não', onPress: () => setTela('login') },
          {
            text: 'Ativar biometria',
            onPress: async () => {
              const ok = await ativarBiometria(dados);
              if (ok) {
                Alert.alert('Biometria ativada!', 'Agora você pode entrar com digital ou Face ID.', [
                  { text: 'OK', onPress: () => setTela('login') },
                ]);
              } else {
                setTela('login');
              }
            },
          },
        ]
      );
    } else {
      Alert.alert('Conta criada!', `Bem-vindo(a), ${dados.nome}! Faça o login.`, [
        { text: 'OK', onPress: () => setTela('login') },
      ]);
    }
  };

  const handleBiometria = async () => {
    const ok = await autenticarBiometria();
    if (ok) {
      setTela('app');
      setTelaInterna('home');
    }
  };

  const handleSair = () => {
    logout();
    setTela('login');
    setTelaInterna('home');
    setSidebarAberta(false);
  };

  // --- Produtos ---
  const handleAdicionarProduto = async (produto) => {
    const novo = await adicionarProduto(produto);
    Alert.alert('Produto salvo!', `${novo.nome} foi adicionado.`, [
      { text: 'OK', onPress: () => setTelaInterna('home') },
    ]);
  };

  // --- Sidebar ---
  const handleSidebarNavigate = (destino) => {
    setSidebarAberta(false);
    navegar(destino);
  };

  // =====================
  // SPLASH
  // =====================
  if (!splashFim || carregando) {
    return <SplashScreen onFim={() => setSplashFim(true)} />;
  }

  // =====================
  // TELAS DE AUTH
  // =====================
  if (tela === 'cadastro') {
    return (
      <>
        <RegisterScreen
          onRegister={handleCadastro}
          onGoLogin={() => setTela('login')}
          onAtivarBiometria={biometriaDisponivel}
        />
        <StatusBar style="light" />
      </>
    );
  }

  if (tela === 'login') {
    return (
      <>
        <LoginScreen
          onLogin={handleLogin}
          onGoRegister={() => setTela('cadastro')}
          onBiometria={handleBiometria}
          biometriaDisponivel={biometriaDisponivel}
          ultimoUsuario={ultimoUsuario}
        />
        <StatusBar style="light" />
      </>
    );
  }

  // =====================
  // APP (pós-login)
  // =====================
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {telaInterna === 'home' && (
        <HomeScreen
          produtos={produtos}
          onSelectProduto={(p) => { setProdutoSelecionado(p); navegar('detalhe'); }}
          onAbrirSidebar={() => setSidebarAberta(true)}
          onAbrirPerfil={() => navegar('perfil')}
        />
      )}

      {telaInterna === 'detalhe' && produtoSelecionado && (
        <ProductDetailScreen
          produto={produtoSelecionado}
          onVoltar={voltar}
        />
      )}

      {telaInterna === 'adicionar' && (
        <AddProductScreen
          onSalvar={handleAdicionarProduto}
          onVoltar={voltar}
        />
      )}

      {telaInterna === 'perfil' && (
        <ProfileScreen
          usuario={usuarioLogado}
          perfil={perfil}
          onSalvar={salvarPerfil}
          onVoltar={voltar}
          onSair={handleSair}
        />
      )}

      {telaInterna === 'mapa' && (
        <MapScreen onVoltar={voltar} />
      )}

      <Sidebar
        aberta={sidebarAberta}
        onFechar={() => setSidebarAberta(false)}
        onNavigate={handleSidebarNavigate}
        onSair={handleSair}
        usuario={usuarioLogado}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F0FF' },
});
