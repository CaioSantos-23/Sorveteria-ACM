# Documentação Completa — Gelato MEC

> **"Sabor que derrete o coração"**
> Aplicativo mobile de catálogo e gestão de sorveteria, desenvolvido com React Native + Expo.

---

## Sumário

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Estrutura de Pastas](#2-estrutura-de-pastas)
3. [Dependências e o que cada uma faz](#3-dependências-e-o-que-cada-uma-faz)
4. [Ponto de Entrada — index.js e App.js](#4-ponto-de-entrada--indexjs-e-appjs)
5. [Navegação — como funciona sem React Navigation](#5-navegação--como-funciona-sem-react-navigation)
6. [Tela de Splash — SplashScreen.js](#6-tela-de-splash--splashscreenjs)
7. [Login e Autenticação — LoginScreen.js + useAuth.js](#7-login-e-autenticação--loginscreenjs--useauthjs)
8. [Cadastro de Usuário — RegisterScreen.js](#8-cadastro-de-usuário--registerscreenjs)
9. [Tela Principal — HomeScreen.js](#9-tela-principal--homescreenjs)
10. [Detalhe do Produto — ProductDetailScreen.js](#10-detalhe-do-produto--productdetailscreenjs)
11. [Adicionar Produto — AddProductScreen.js](#11-adicionar-produto--addproductscreenjs)
12. [Perfil do Usuário — ProfileScreen.js + useProfile.js](#12-perfil-do-usuário--profilescreenjs--useprofilejs)
13. [Mapa de Franquias — MapScreen.js](#13-mapa-de-franquias--mapscreenjs)
14. [Menu Lateral — Sidebar.js](#14-menu-lateral--sidebarjs)
15. [Gerenciamento de Produtos — useProducts.js](#15-gerenciamento-de-produtos--useproductsjs)
16. [Utilitários de Imagem — utils/images.js](#16-utilitários-de-imagem--utilsimagejs)
17. [Armazenamento Local — AsyncStorage](#17-armazenamento-local--asyncstorage)
18. [Paleta de Cores e Identidade Visual](#18-paleta-de-cores-e-identidade-visual)
19. [Fluxo Completo do Aplicativo](#19-fluxo-completo-do-aplicativo)
20. [Conceitos Técnicos Ensinados](#20-conceitos-técnicos-ensinados)
21. [Testes Automatizados — Jest](#21-testes-automatizados--jest)
22. [Painel Administrativo](#22-painel-administrativo)
23. [Firebase Realtime Database](#23-firebase-realtime-database)
24. [Testes de UI com Maestro — Fluxos, Erros e Soluções](#24-testes-de-ui-com-maestro--fluxos-erros-e-soluções)

---

## 1. Visão Geral do Projeto

O **Gelato MEC** é um aplicativo mobile completo para uma rede de sorveterias fictícia. Ele foi construído do zero com **React Native** e **Expo**, sem backend externo — todos os dados ficam salvos localmente no dispositivo.

### O que o app faz:
- Permite que usuários criem conta e façam login (com senha ou biometria)
- Exibe um catálogo de sorvetes em grade
- Mostra os detalhes de cada produto (ingredientes, calorias, etc.)
- Permite cadastrar novos produtos com foto
- Localiza franquias da rede num mapa interativo
- Permite editar o perfil do usuário

### Por que esse app é educativo:
Ele cobre praticamente tudo que um app mobile real precisa:
autenticação, navegação, formulários, câmera, GPS, mapas, persistência de dados e animações — tudo sem depender de nenhum servidor.

---

## 2. Estrutura de Pastas

```
sorvete-mec/
│
├── assets/                          ← Imagens estáticas do app
│   ├── icon.png                     ← Ícone do app (usado pelo Expo)
│   ├── splash-icon.png              ← Imagem da tela de splash (usada pelo Expo)
│   ├── logo_gelato_mec.jpeg         ← Logo exibido dentro do app
│   ├── sorvete_morango_mec.jpeg     ← Foto do sorvete de morango
│   ├── sorvete_chocolate_mec.jpeg   ← Foto do sorvete de chocolate
│   ├── acai_mec.jpeg                ← Foto do açaí
│   ├── coco.jpeg                    ← Foto do sorvete de coco
│   ├── Limao.jpeg                   ← Foto do sorvete de limão
│   ├── doce_de_Leite.jpeg           ← Foto do doce de leite
│   ├── android-icon-foreground.png  ← Ícone adaptativo Android (frente)
│   ├── android-icon-background.png  ← Ícone adaptativo Android (fundo)
│   └── android-icon-monochrome.png  ← Ícone monocromático Android
│
├── src/                             ← Todo o código-fonte do app
│   │
│   ├── screens/                     ← Cada tela do app é um arquivo aqui
│   │   ├── SplashScreen.js          ← Tela de carregamento animada
│   │   ├── LoginScreen.js           ← Tela de login
│   │   ├── RegisterScreen.js        ← Tela de cadastro
│   │   ├── HomeScreen.js            ← Tela principal com produtos
│   │   ├── ProductDetailScreen.js   ← Detalhes de um produto
│   │   ├── AddProductScreen.js      ← Formulário para novo produto
│   │   ├── ProfileScreen.js         ← Perfil do usuário
│   │   └── MapScreen.js             ← Mapa de franquias
│   │
│   ├── components/                  ← Componentes reutilizáveis
│   │   └── Sidebar.js               ← Menu lateral deslizante
│   │
│   ├── hooks/                       ← Lógica de negócio separada em hooks
│   │   ├── useAuth.js               ← Tudo sobre autenticação
│   │   ├── useProducts.js           ← Tudo sobre produtos
│   │   ├── useProfile.js            ← Tudo sobre o perfil
│   │   └── __tests__/               ← Testes dos hooks
│   │       ├── useAuth.test.js
│   │       ├── useProducts.test.js
│   │       └── useProfile.test.js
│   │
│   └── utils/                       ← Funções e dados auxiliares
│       ├── images.js                ← Mapeamento de imagens + dados demo
│       └── __tests__/               ← Testes dos utilitários
│           └── images.test.js
│
├── __mocks__/                       ← Mocks globais para os testes
│   └── fileMock.js                  ← Substitui arquivos de imagem nos testes
│
├── App.js                           ← Raiz do app (navegação central)
├── index.js                         ← Ponto de entrada do Expo
├── app.json                         ← Configuração do Expo
├── eas.json                         ← Configuração de build (EAS)
├── metro.config.js                  ← Configuração do Metro bundler
├── jest.config.js                   ← Configuração do Jest
├── jest.setup.js                    ← Setup global dos testes (mocks)
└── package.json                     ← Dependências do projeto
```

### Por que organizar assim?

A separação em `screens/`, `components/`, `hooks/` e `utils/` é uma convenção muito usada em projetos React Native.

- **screens**: cada arquivo = uma tela que o usuário vê
- **components**: pedaços de UI que aparecem em mais de uma tela
- **hooks**: a lógica "pesada" (cálculos, chamadas de API, acesso ao storage) fica separada da UI
- **utils**: funções pequenas e dados constantes que qualquer arquivo pode importar

---

## 3. Dependências e o que cada uma faz

Listadas no `package.json`:

**Dependências de produção:**

| Pacote | Versão | Para que serve |
|--------|--------|----------------|
| `expo` | ~54.0.35 | Framework base — simplifica o desenvolvimento mobile |
| `react` | 19.1.0 | Biblioteca principal de UI |
| `react-native` | 0.81.5 | Componentes nativos para iOS e Android |
| `react-native-maps` | 1.20.1 | Componente de mapa (Google Maps / Apple Maps) |
| `expo-location` | ~19.0.8 | Acesso ao GPS do dispositivo |
| `expo-local-authentication` | ~17.0.8 | Biometria (impressão digital e Face ID) |
| `expo-image-picker` | ~17.0.11 | Abre câmera ou galeria para escolher foto |
| `expo-status-bar` | ~3.0.9 | Controla a aparência da barra de status |
| `@react-native-async-storage/async-storage` | 2.2.0 | Banco de dados local simples (chave → valor) |

**Dependências de desenvolvimento (testes):**

| Pacote | Versão | Para que serve |
|--------|--------|----------------|
| `jest-expo` | ~54.0.0 | Preset Jest configurado para projetos Expo |
| `@testing-library/react-native` | ^13.3.3 | Utilitários de teste para componentes e hooks RN |
| `react-test-renderer` | ^19.1.0 | Renderizador de componentes React para ambiente de teste |

**Scripts disponíveis (`npm run ...`):**

| Script | Comando | O que faz |
|--------|---------|-----------|
| `start` | `expo start` | Inicia o servidor de desenvolvimento |
| `android` | `expo run:android` | Compila e executa no Android |
| `ios` | `expo run:ios` | Compila e executa no iOS |
| `web` | `expo start --web` | Executa no navegador |
| `test` | `jest` | Roda todos os testes uma vez |
| `test:watch` | `jest --watch` | Roda testes em modo interativo |
| `test:coverage` | `jest --coverage` | Roda testes e gera relatório de cobertura |

### Como instalar tudo isso?

Quando você clona o projeto e roda:
```bash
npm install
```
O npm lê o `package.json` e baixa todos esses pacotes automaticamente para a pasta `node_modules/`.

---

## 4. Ponto de Entrada — index.js e App.js

### index.js

```javascript
import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);
```

Este é o arquivo que o Expo executa primeiro quando o app inicia. Ele só faz uma coisa: diz ao Expo que `App.js` é o componente raiz de tudo. É o equivalente do `main()` em outras linguagens.

---

### App.js — O cérebro do aplicativo

O `App.js` é o componente mais importante do projeto. Ele funciona como um **roteador manual**: controla qual tela está visível a cada momento.

#### Como a navegação é controlada:

```javascript
// Dois estados principais de navegação:
const [tela, setTela] = useState('splash');
// Valores possíveis: 'splash' | 'login' | 'cadastro' | 'app'

const [telaInterna, setTelaInterna] = useState('home');
// Valores possíveis: 'home' | 'detalhe' | 'adicionar' | 'perfil' | 'mapa'
```

**Por que dois estados?**
Porque o app tem dois "mundos":
- O mundo de **autenticação** (`tela`): splash → login → cadastro
- O mundo **autenticado** (`telaInterna`): home → detalhe → adicionar → perfil → mapa

Enquanto `tela !== 'app'`, o usuário não chegou ainda ao mundo autenticado.

#### Função de navegação:

```javascript
const navegar = (destino) => {
  setTelaAnterior(telaInterna);  // Salva a tela atual
  setTelaInterna(destino);        // Vai para a nova tela
};

const voltar = () => {
  setTelaInterna(telaAnterior || 'home');  // Volta para a anterior
};
```

Isso simula o comportamento de uma pilha de navegação (como o React Navigation faz) de forma manual e simples.

#### Como o App.js decide o que mostrar:

```javascript
// 1. Se o splash ainda está rodando, mostra o Splash
if (!splashFim) return <SplashScreen onFim={() => setSplashFim(true)} />;

// 2. Se não está logado, mostra login ou cadastro
if (tela === 'login') return <LoginScreen ... />;
if (tela === 'cadastro') return <RegisterScreen ... />;

// 3. Se está logado, mostra as telas internas
return (
  <>
    {telaInterna === 'home' && <HomeScreen ... />}
    {telaInterna === 'detalhe' && <ProductDetailScreen ... />}
    {telaInterna === 'adicionar' && <AddProductScreen ... />}
    {telaInterna === 'perfil' && <ProfileScreen ... />}
    {telaInterna === 'mapa' && <MapScreen ... />}
    <Sidebar ... />
  </>
);
```

---

## 5. Navegação — como funciona sem React Navigation

A maioria dos apps React Native usa a biblioteca **React Navigation** para controlar as telas. Este projeto optou por uma abordagem mais simples: **navegação por estado**.

### Como funciona na prática:

Imagine que você tem um painel de controle com uma alavanca. A alavanca pode apontar para "home", "mapa", "perfil" etc. Quando você move a alavanca, o React re-renderiza o app e mostra a tela correspondente.

```javascript
// Navegando para o mapa:
setTelaInterna('mapa');

// Voltando para home:
setTelaInterna('home');
```

### Vantagem:
- Muito simples de entender
- Sem dependências extras
- Controle total sobre o comportamento

### Desvantagem:
- Não tem animações de transição automáticas
- Sem histórico de navegação automático (gestos de deslizar para voltar)
- Em apps grandes, fica difícil de manter

Para projetos maiores, **React Navigation** é a escolha correta.

---

## 6. Tela de Splash — SplashScreen.js

A tela de splash é aquela que aparece por alguns segundos enquanto o app carrega, antes de mostrar o login.

### O que ela faz:

1. Aparece imediatamente quando o app abre
2. Exibe o logo com uma animação de entrada (fade + escala)
3. Depois de 2.4 segundos, dispara a função `onFim` que avisa o App.js que acabou

### Como a animação foi feita:

```javascript
// 1. Criamos dois valores animados
const fadeAnim = useRef(new Animated.Value(0)).current;  // Opacidade: começa em 0
const scaleAnim = useRef(new Animated.Value(0.8)).current; // Escala: começa em 80%

// 2. Ao montar o componente, iniciamos a animação
useEffect(() => {
  Animated.parallel([          // Roda as duas animações ao mesmo tempo
    Animated.timing(fadeAnim, {
      toValue: 1,              // Vai até opacidade 100%
      duration: 800,           // Em 800ms
      useNativeDriver: true,
    }),
    Animated.timing(scaleAnim, {
      toValue: 1,              // Vai até escala 100%
      duration: 800,
      useNativeDriver: true,
    }),
  ]).start();

  // 3. Depois de 2.4s, avisa que terminou
  const timer = setTimeout(() => onFim(), 2400);
  return () => clearTimeout(timer); // Limpa o timer se o componente desmontar
}, []);
```

### `useNativeDriver: true` — O que é isso?

Por padrão, animações no React Native rodam no thread JavaScript, o que pode causar travamentos. Com `useNativeDriver: true`, a animação é enviada para o thread nativo (C++/Java/Swift), que é muito mais eficiente. **Regra geral: sempre use quando possível.**

### `useRef` para animações — Por quê?

`Animated.Value` não deve ser recriado a cada re-render. `useRef` garante que o objeto de animação seja criado apenas uma vez e persista durante todo o ciclo de vida do componente.

---

## 7. Login e Autenticação — LoginScreen.js + useAuth.js

### LoginScreen.js — A interface

A tela de login tem:
- Campo de e-mail
- Campo de senha com botão para mostrar/ocultar
- Botão "Entrar"
- Botão "Criar conta" (navega para o cadastro)
- Botão de biometria (aparece apenas se disponível)

#### Como o botão de ocultar senha funciona:

```javascript
const [mostrarSenha, setMostrarSenha] = useState(false);

<TextInput
  secureTextEntry={!mostrarSenha}   // true = oculta, false = mostra
  value={senha}
  onChangeText={setSenha}
/>

<TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
  <Text>{mostrarSenha ? '🙈' : '👁️'}</Text>
</TouchableOpacity>
```

---

### useAuth.js — A lógica de autenticação

Este hook concentra toda a lógica relacionada a usuários. Isso é uma boa prática: **separa o "o que mostrar" (componente) do "como funciona" (hook)**.

#### Onde os usuários ficam salvos:

```javascript
const CHAVE_USUARIOS = '@gelato_mec:usuarios';
const CHAVE_ULTIMO_USUARIO = '@gelato_mec:ultimo_usuario';
```

Os usuários são salvos no AsyncStorage como uma lista JSON. Não há banco de dados real, não há servidor — tudo fica no próprio dispositivo.

#### Como o login funciona:

```javascript
const login = async (email, senha) => {
  // 1. Busca a lista de usuários salvos
  const json = await AsyncStorage.getItem(CHAVE_USUARIOS);
  const usuarios = json ? JSON.parse(json) : [];

  // 2. Procura um usuário com email E senha correspondentes
  const usuario = usuarios.find(
    u => u.email === email && u.senha === senha
  );

  if (!usuario) return false;  // Credenciais erradas

  // 3. Salva quem foi o último a logar (para biometria futura)
  await AsyncStorage.setItem(CHAVE_ULTIMO_USUARIO, JSON.stringify(usuario));

  // 4. Atualiza o estado com o usuário logado
  setUsuarioLogado(usuario);
  return true;
};
```

> **Aviso de segurança:** Em produção real, senhas NUNCA devem ser salvas em texto puro. Deve-se usar hashing (ex: bcrypt) e um servidor seguro. Para fins educativos e demonstrativos, este app simplifica isso.

#### Como o cadastro funciona:

```javascript
const cadastrar = async ({ nome, email, senha }) => {
  const json = await AsyncStorage.getItem(CHAVE_USUARIOS);
  const usuarios = json ? JSON.parse(json) : [];

  // Verifica se o e-mail já existe
  if (usuarios.some(u => u.email === email)) {
    return 'duplicado';  // Retorna um código de erro
  }

  // Cria o novo usuário e adiciona à lista
  const novoUsuario = { id: Date.now(), nome, email, senha };
  const novosUsuarios = [...usuarios, novoUsuario];

  // Salva a lista atualizada
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(novosUsuarios));
  setUsuarioLogado(novoUsuario);
  return 'ok';
};
```

#### Como a biometria funciona:

```javascript
// Verifica se o hardware suporta biometria
const biometriaDisponivel = await LocalAuthentication.hasHardwareAsync()
  && await LocalAuthentication.isEnrolledAsync();

// Dispara o prompt de biometria do sistema operacional
const resultado = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Confirme sua identidade',
  fallbackLabel: 'Usar senha',
});

if (resultado.success) {
  // Loga com o último usuário que usou o app
  setUsuarioLogado(ultimoUsuario);
  return true;
}
```

A biometria não verifica "qual" usuário é — ela apenas confirma que a pessoa que está segurando o celular tem permissão para usar o dispositivo. Por isso, o app loga automaticamente com o `ultimoUsuario` (o último e-mail que fez login).

---

## 8. Cadastro de Usuário — RegisterScreen.js

### O que a tela de cadastro valida:

1. **Nome** — obrigatório, não pode estar vazio
2. **E-mail** — deve conter "@" (validação básica de formato)
3. **Senha** — mínimo de 6 caracteres
4. **Confirmação de senha** — deve ser igual à senha

### Como a validação em tempo real funciona:

```javascript
// Enquanto o usuário digita, verificamos se as senhas batem
const senhasIguais = senha === confirmacaoSenha;

// E usamos isso para colorir o campo de confirmação
<TextInput
  style={[
    styles.input,
    // Se as senhas não batem E o campo não está vazio, fica vermelho
    confirmacaoSenha && !senhasIguais && styles.inputErro
  ]}
/>

// Também mostramos uma mensagem de erro
{confirmacaoSenha && !senhasIguais && (
  <Text style={styles.textoErro}>As senhas não coincidem</Text>
)}
```

### Oferecer ativação de biometria após o cadastro:

Depois de criar a conta, o app pergunta se o usuário quer ativar o login por biometria:

```javascript
const resultado = await cadastrar({ nome, email, senha });

if (resultado === 'ok') {
  // Verifica se biometria está disponível no dispositivo
  if (biometriaDisponivel) {
    Alert.alert(
      'Ativar biometria?',
      'Deseja usar impressão digital / Face ID nos próximos logins?',
      [
        { text: 'Não', onPress: () => onIrParaLogin() },
        { text: 'Sim', onPress: async () => {
          await ativarBiometria(novoUsuario);
          onIrParaLogin();
        }},
      ]
    );
  }
}
```

---

## 9. Tela Principal — HomeScreen.js

A tela home é o coração do app. Ela exibe todos os produtos em uma grade de 2 colunas com busca em tempo real.

### Como a grade de produtos é criada:

```javascript
<FlatList
  data={produtosFiltrados}    // Lista de produtos (já filtrada pela busca)
  numColumns={2}              // 2 colunas!
  keyExtractor={item => String(item.id)}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => onVerDetalhe(item)}>
      <ProductCard produto={item} />
    </TouchableOpacity>
  )}
/>
```

`FlatList` é o componente ideal para listas longas no React Native. Diferente de um `ScrollView` simples, ela **virtualiza** os itens: renderiza apenas os que estão visíveis na tela, economizando memória e processamento.

### Como a busca funciona:

```javascript
const [termoBusca, setTermoBusca] = useState('');

// Filtra os produtos conforme o usuário digita
const produtosFiltrados = produtos.filter(p =>
  p.nome.toLowerCase().includes(termoBusca.toLowerCase())
);

// Campo de busca
<TextInput
  value={termoBusca}
  onChangeText={setTermoBusca}   // Atualiza o estado a cada tecla
  placeholder="Buscar sorvetes..."
/>
```

### Como os cards de produto têm cores diferentes:

Como os produtos podem não ter imagem, cada card recebe uma cor de fundo gerada a partir do ID do produto:

```javascript
// Paleta de cores possíveis
const CORES_CARDS = ['#FF6B9D', '#C44569', '#F8B500', '#6C5CE7', ...];

// Função determinística: mesmo ID sempre gera mesma cor
const getCorCard = (id) => {
  const indice = id % CORES_CARDS.length;
  return CORES_CARDS[indice];
};
```

"Determinístico" significa que o resultado é sempre o mesmo para o mesmo input. Assim, o sorvete de morango sempre terá a mesma cor, mesmo depois de fechar e abrir o app.

### Botão flutuante de perfil (FAB):

```javascript
// FAB = Floating Action Button
<TouchableOpacity
  style={styles.fabPerfil}  // position: 'absolute', bottom: 20, right: 20
  onPress={onIrParaPerfil}
>
  <Text>👤</Text>
</TouchableOpacity>
```

---

## 10. Detalhe do Produto — ProductDetailScreen.js

Quando o usuário toca em um produto na home, vai para esta tela com informações completas.

### O que é exibido:

- **Área hero** no topo: imagem do produto (ou cor + emoji se não houver imagem)
- **Nome** do produto em destaque
- **Chips informativos**: preço, quantidade em estoque, calorias
- **Lista de ingredientes** (se cadastrada)
- **Descrição** do sabor

### Como os "chips" informativos são feitos:

```javascript
// Um chip é apenas um View com bordas arredondadas e texto
const Chip = ({ icone, texto }) => (
  <View style={styles.chip}>
    <Text>{icone} {texto}</Text>
  </View>
);

// Uso:
<Chip icone="💰" texto={`R$ ${produto.preco}`} />
<Chip icone="📦" texto={`${produto.quantidade} un`} />
<Chip icone="🔥" texto={`${produto.calorias} kcal`} />
```

### Como os ingredientes são exibidos:

Os ingredientes são salvos como uma string separada por vírgulas (ex: `"leite, açúcar, morango"`). Para exibir como lista:

```javascript
// Divide a string em array pelo separador ", "
const ingredientes = produto.ingredientes.split(',').map(i => i.trim());

// Exibe cada um como um item de lista
{ingredientes.map((ingrediente, index) => (
  <Text key={index}>• {ingrediente}</Text>
))}
```

---

## 11. Adicionar Produto — AddProductScreen.js

Permite cadastrar novos sorvetes com foto, nome, preço e outras informações.

### Como o upload de imagem funciona:

```javascript
import * as ImagePicker from 'expo-image-picker';

const escolherImagem = async () => {
  // 1. Pede permissão para acessar a galeria
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Precisamos de permissão para acessar suas fotos');
    return;
  }

  // 2. Abre o seletor de imagens
  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,     // Permite recortar
    aspect: [16, 9],         // Proporção 16:9 (horizontal)
    quality: 0.8,            // 80% de qualidade (reduz tamanho do arquivo)
  });

  // 3. Se o usuário selecionou uma imagem (não cancelou)
  if (!resultado.canceled) {
    setImagemUri(resultado.assets[0].uri);  // Salva o caminho da imagem
  }
};
```

### Por que proporção 16:9?

Para que todos os cards na home tenham a mesma altura, independente do produto. Imagens com proporções diferentes "quebrariam" o layout da grade.

### Validação do formulário antes de salvar:

```javascript
const salvar = () => {
  // Campos obrigatórios
  if (!nome.trim()) return Alert.alert('Informe o nome do produto');
  if (!preco.trim()) return Alert.alert('Informe o preço');
  if (!quantidade.trim()) return Alert.alert('Informe a quantidade');

  // Validação numérica
  if (isNaN(parseFloat(preco))) return Alert.alert('Preço inválido');
  if (isNaN(parseInt(quantidade))) return Alert.alert('Quantidade inválida');

  // Tudo ok, salva o produto
  adicionarProduto({
    nome: nome.trim(),
    preco: parseFloat(preco),
    quantidade: parseInt(quantidade),
    calorias: calorias ? parseInt(calorias) : null,
    ingredientes: ingredientes.trim(),
    descricao: descricao.trim(),
    imagemUri: imagemUri,
  });
};
```

---

## 12. Perfil do Usuário — ProfileScreen.js + useProfile.js

### ProfileScreen.js — A interface

A tela de perfil permite ao usuário personalizar sua conta:

- **Avatar**: exibe a foto de perfil ou as iniciais do nome
- **Campos editáveis**: nome de exibição, bio, telefone, cidade, data de nascimento
- **E-mail**: exibido mas não editável (é o identificador único da conta)
- **Botão de salvar**: persiste as mudanças
- **Botão de sair**: faz logout

#### Como o avatar com iniciais funciona:

```javascript
// Extrai as iniciais do nome (ex: "João Silva" → "JS")
const getIniciais = (nome) => {
  if (!nome) return '?';
  return nome
    .split(' ')           // Divide em palavras
    .slice(0, 2)          // Pega as duas primeiras
    .map(p => p[0])       // Pega a primeira letra de cada
    .join('')             // Junta: "J" + "S" = "JS"
    .toUpperCase();
};

// Exibe foto OU iniciais
{perfil.fotoUri ? (
  <Image source={{ uri: perfil.fotoUri }} style={styles.avatar} />
) : (
  <View style={styles.avatarPlaceholder}>
    <Text style={styles.avatarIniciais}>{getIniciais(usuarioLogado.nome)}</Text>
  </View>
)}
```

---

### useProfile.js — Lógica do perfil

```javascript
const CHAVE_PERFIL = '@gelato_mec:perfil';

const useProfile = () => {
  const [perfil, setPerfil] = useState({});

  // Carrega o perfil salvo quando o hook é usado pela primeira vez
  useEffect(() => {
    const carregar = async () => {
      const json = await AsyncStorage.getItem(CHAVE_PERFIL);
      if (json) setPerfil(JSON.parse(json));
    };
    carregar();
  }, []);

  const salvarPerfil = async (dados) => {
    const perfilAtualizado = { ...perfil, ...dados };  // Merge dos dados
    await AsyncStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfilAtualizado));
    setPerfil(perfilAtualizado);
  };

  return { perfil, salvarPerfil };
};
```

O operador spread `...` no merge garante que apenas os campos alterados sejam substituídos, mantendo os outros intactos.

---

## 13. Mapa de Franquias — MapScreen.js

Esta é a parte mais técnica do app. Combina permissões de localização, GPS e renderização de mapas.

### Fluxo completo do mapa:

```
1. Tela abre
    ↓
2. Pede permissão de localização ao usuário
    ↓
3. Se negada → mostra mensagem de erro
    ↓
4. Se concedida → busca as coordenadas GPS do dispositivo
    ↓
5. Centraliza o mapa na localização do usuário
    ↓
6. Desenha o círculo de 10km
    ↓
7. Coloca os marcadores das franquias
    ↓
8. Exibe lista horizontal de franquias abaixo do mapa
```

### Como pedir e verificar permissão de localização:

```javascript
import * as Location from 'expo-location';

useEffect(() => {
  const iniciar = async () => {
    // Solicita permissão de localização enquanto o app está em uso
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErroLocalizacao('Permissão de localização negada');
      return;
    }

    // Obtém a posição atual (pode demorar alguns segundos)
    const posicao = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced  // Equilíbrio entre precisão e velocidade
    });

    setLocalizacao({
      latitude: posicao.coords.latitude,
      longitude: posicao.coords.longitude,
      latitudeDelta: 0.1,   // Controla o zoom do mapa (menor = mais zoom)
      longitudeDelta: 0.1,
    });
  };

  iniciar();
}, []);
```

### Como o mapa é renderizado:

```javascript
import MapView, { Marker, Circle } from 'react-native-maps';

<MapView
  style={{ flex: 1 }}
  region={localizacao}      // Onde o mapa está centralizado
  showsUserLocation={true}  // Ponto azul na localização do usuário
>
  {/* Círculo de 10km ao redor do usuário */}
  <Circle
    center={localizacao}
    radius={10000}              // 10.000 metros = 10km
    strokeColor="#3D1A78"       // Cor da borda do círculo
    fillColor="rgba(61,26,120,0.1)"  // Cor de preenchimento (transparente)
  />

  {/* Marcador para cada franquia */}
  {franquias.map(franquia => (
    <Marker
      key={franquia.id}
      coordinate={{
        latitude: franquia.latitude,
        longitude: franquia.longitude,
      }}
      title={franquia.nome}
      description={franquia.endereco}
      pinColor="#FF4D8D"    // Cor rosa do pin
    />
  ))}
</MapView>
```

### Como os dados das franquias são obtidos:

O app tem dois modos:

**Modo com chave de API do Google:**
```javascript
// Faz uma busca real por sorveterias próximas
const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
  + `?location=${lat},${lng}`
  + `&radius=10000`
  + `&type=ice_cream`
  + `&key=${GOOGLE_API_KEY}`;

const resposta = await fetch(url);
const dados = await resposta.json();
```

**Modo demo (sem chave de API):**
```javascript
// Gera franquias fictícias ao redor da localização real do usuário
const franquiasDemo = [
  {
    id: 1,
    nome: 'Gelato MEC Centro',
    endereco: 'Av. Principal, 100',
    // Desloca levemente as coordenadas reais do usuário
    latitude: localizacao.latitude + 0.02,
    longitude: localizacao.longitude + 0.01,
    avaliacao: 4.8,
  },
  // ...mais 3 franquias
];
```

### Como focar o mapa em uma franquia ao tocar na lista:

```javascript
// Referência ao componente MapView para controlar programaticamente
const mapRef = useRef(null);

const focarFranquia = (franquia) => {
  mapRef.current?.animateToRegion({
    latitude: franquia.latitude,
    longitude: franquia.longitude,
    latitudeDelta: 0.01,   // Zoom mais próximo
    longitudeDelta: 0.01,
  }, 1000);  // Animação de 1 segundo
};
```

### A lista horizontal de franquias:

```javascript
<ScrollView
  horizontal={true}             // Rola para os lados
  showsHorizontalScrollIndicator={false}  // Sem scrollbar
>
  {franquias.map(franquia => (
    <TouchableOpacity
      key={franquia.id}
      onPress={() => focarFranquia(franquia)}  // Foca o mapa ao tocar
    >
      <Text>{franquia.nome}</Text>
      <Text>{franquia.endereco}</Text>
      {franquia.avaliacao && <Text>⭐ {franquia.avaliacao}</Text>}
    </TouchableOpacity>
  ))}
</ScrollView>
```

---

## 14. Menu Lateral — Sidebar.js

O menu lateral é um componente que desliza pela esquerda para revelar opções de navegação.

### Como a animação de deslize funciona:

```javascript
// A posição horizontal do sidebar
// -300 = totalmente fora da tela (escondido à esquerda)
//    0 = totalmente visível
const posicaoX = useRef(new Animated.Value(-300)).current;

// Quando deve abrir:
const abrir = () => {
  Animated.timing(posicaoX, {
    toValue: 0,       // Move para a posição visível
    duration: 280,    // Em 280ms
    useNativeDriver: true,
  }).start();
};

// Quando deve fechar:
const fechar = () => {
  Animated.timing(posicaoX, {
    toValue: -300,    // Volta para fora da tela
    duration: 280,
    useNativeDriver: true,
  }).start();
};

// O componente usa a posição animada como transform
<Animated.View style={[
  styles.sidebar,
  { transform: [{ translateX: posicaoX }] }  // Move horizontalmente
]}>
```

### O overlay escuro por trás:

Quando o sidebar abre, um fundo semitransparente escuro cobre o resto da tela. Tocar nele fecha o menu:

```javascript
{aberta && (
  <TouchableOpacity
    style={styles.overlay}     // Cobre a tela toda
    onPress={fechar}           // Fecha ao tocar
    activeOpacity={1}
  />
)}
```

### O que o sidebar exibe:

```javascript
// Header com logo e saudação
<View style={styles.header}>
  <Text>🍦</Text>
  <Text>Gelato MEC</Text>
  <Text>Bem-vindo, {usuario.nome}!</Text>
</View>

// Opções de navegação
<TouchableOpacity onPress={() => onNavegar('mapa')}>
  <Text>📍 Franquias no Mapa</Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => onNavegar('adicionar')}>
  <Text>➕ Cadastrar Produto</Text>
</TouchableOpacity>

// Botão de sair no rodapé
<TouchableOpacity onPress={onLogout}>
  <Text>🚪 Sair</Text>
</TouchableOpacity>
```

---

## 15. Gerenciamento de Produtos — useProducts.js

```javascript
const CHAVE_PRODUTOS = '@gelato_mec:produtos';

const useProducts = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      const json = await AsyncStorage.getItem(CHAVE_PRODUTOS);

      if (json) {
        // Tem produtos salvos, carrega eles
        setProdutos(JSON.parse(json));
      } else {
        // Primeira vez abrindo o app: carrega os produtos de demonstração
        await AsyncStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(DEMO_PRODUTOS));
        setProdutos(DEMO_PRODUTOS);
      }
    };
    carregar();
  }, []);

  const adicionarProduto = async (dadosProduto) => {
    // Gera um ID único combinando timestamp e número aleatório
    const novoProduto = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      ...dadosProduto,
    };

    const novaLista = [...produtos, novoProduto];
    await AsyncStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(novaLista));
    setProdutos(novaLista);
    return novoProduto;
  };

  const deletarProduto = async (id) => {
    const novaLista = produtos.filter(p => p.id !== id);
    await AsyncStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(novaLista));
    setProdutos(novaLista);
  };

  return { produtos, adicionarProduto, deletarProduto };
};
```

---

## 16. Utilitários de Imagem — utils/images.js

Este arquivo resolve um problema: como mostrar a imagem certa para cada produto, sem que o usuário precise fazer upload de tudo?

### Mapeamento por nome de sabor:

```javascript
// Importa as imagens dos assets
import morango from '../../assets/sorvete_morango_mec.jpeg';
import chocolate from '../../assets/sorvete_chocolate_mec.jpeg';
// ...

// Cria um dicionário: nome do sabor → imagem
export const produtoImagens = {
  'morango': morango,
  'strawberry': morango,
  'chocolate': chocolate,
  'açaí': acai,
  'acai': acai,
  'coco': coco,
  'coconut': coco,
  'limão': limao,
  'lemon': limao,
  'doce de leite': doceDeLeite,
  'caramel': doceDeLeite,
};

// Função que busca a imagem pelo nome (case-insensitive)
export const getImagemProduto = (nomeProduto) => {
  if (!nomeProduto) return null;

  const nomeLower = nomeProduto.toLowerCase();

  // Tenta encontrar uma chave que esteja contida no nome do produto
  const chave = Object.keys(produtoImagens).find(k =>
    nomeLower.includes(k)
  );

  return chave ? produtoImagens[chave] : null;
};
```

Assim, se um produto se chamar "Sorvete de Morango Especial", a função encontra "morango" no nome e retorna a imagem correta automaticamente.

### Os produtos de demonstração:

```javascript
export const DEMO_PRODUTOS = [
  {
    id: 1,
    nome: 'Morango',
    preco: 12.90,
    quantidade: 15,
    calorias: 220,
    ingredientes: 'Leite integral, creme de leite, polpa de morango, açúcar',
    descricao: 'Sorvete cremoso com pedaços generosos de morango fresco',
  },
  {
    id: 2,
    nome: 'Chocolate',
    preco: 13.90,
    quantidade: 12,
    calorias: 285,
    ingredientes: 'Leite integral, cacau em pó, chocolate amargo, açúcar',
    descricao: 'Intenso sabor de chocolate com toque de cacau amargo',
  },
  // ... mais 4 sabores
];
```

---

## 17. Armazenamento Local — AsyncStorage

O AsyncStorage é o "banco de dados" do app. Funciona como um dicionário persistente: você salva com uma chave e recupera com a mesma chave, mesmo depois de fechar o app.

### Como funciona:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// SALVAR dados
await AsyncStorage.setItem('minha_chave', 'meu valor');

// RECUPERAR dados
const valor = await AsyncStorage.getItem('minha_chave');

// DELETAR dados
await AsyncStorage.removeItem('minha_chave');
```

### Importante: o AsyncStorage só guarda strings

Por isso, objetos e arrays precisam ser convertidos com `JSON.stringify` antes de salvar e `JSON.parse` depois de recuperar:

```javascript
// Salvando um objeto
const usuario = { nome: 'João', email: 'joao@email.com' };
await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

// Recuperando o objeto
const json = await AsyncStorage.getItem('usuario');
const usuario = json ? JSON.parse(json) : null;
```

### Chaves usadas no app:

| Chave | O que guarda |
|-------|-------------|
| `@gelato_mec:usuarios` | Lista de todos os usuários cadastrados |
| `@gelato_mec:ultimo_usuario` | Último usuário logado (para biometria) |
| `@gelato_mec:produtos` | Lista de todos os produtos |
| `@gelato_mec:perfil` | Dados do perfil do usuário atual |

O prefixo `@gelato_mec:` é uma convenção para evitar conflitos com outros apps que possam usar a mesma chave.

---

## 18. Paleta de Cores e Identidade Visual

```
Roxo Principal:   #3D1A78  ← Cabeçalhos, botões principais, fundo do splash
Roxo Claro:       #D8B4FE  ← Textos secundários, acentos
Fundo do App:     #F4F0FF  ← Fundo suave com leve tom roxo
Rosa/Destaque:    #FF4D8D  ← Botões de ação, marcadores do mapa
Branco:           #FFFFFF  ← Cards, áreas de conteúdo
Texto Principal:  #1a1a2e  ← Títulos, textos importantes
Texto Secundário: #555555  ← Subtítulos
Texto Terciário:  #888888  ← Labels, hints
Erro:             #FF4D4D  ← Mensagens de erro, botões destrutivos
Sucesso:          #C3F0C8  ← Confirmações positivas
```

A identidade visual segue uma paleta **roxa** que remete a elegância e sofisticação, com o **rosa** como cor de destaque/ação para elementos interativos.

---

## 19. Fluxo Completo do Aplicativo

```
┌─────────────────────────────────────────────────────┐
│                   App inicia                        │
└────────────────────────┬────────────────────────────┘
                         ↓
               ┌─────────────────┐
               │  SplashScreen   │  (2.4 segundos)
               │  Logo animado   │
               └────────┬────────┘
                        ↓
          ┌─────────────────────────┐
          │   Usuário já logado?    │
          └──────┬──────────┬───────┘
               NÃO          SIM
                ↓            ↓
         ┌──────────┐   ┌──────────┐
         │LoginScreen│   │HomeScreen│
         └──────┬────┘   └──────────┘
                │
         ┌──────┴──────────┐
         │   Tem conta?    │
         └──┬──────────┬───┘
          SIM          NÃO
           ↓            ↓
     Login com    RegisterScreen
     email ou      ↓ (cadastro)
     biometria    └──→ LoginScreen
           ↓
     ┌──────────────────────────────────────────┐
     │               HomeScreen                │
     │           (grade de produtos)           │
     └──┬──────────┬────────────┬──────────────┘
        │          │            │
        ↓          ↓            ↓
  Toca em     Botão 👤      Botão ☰
  produto      (FAB)       (Menu)
        ↓          ↓            ↓
  ProductDetail  Profile   ┌────────────┐
  Screen        Screen     │  Sidebar   │
                           └──┬──────┬──┘
                              ↓      ↓
                           Mapa   Add
                          Screen Product
                                  Screen
```

---

## 20. Conceitos Técnicos Ensinados

Este projeto cobre os seguintes conceitos, que você pode estudar mais a fundo:

### React e React Native
- **useState** — Estado local de um componente
- **useEffect** — Efeitos colaterais (carregar dados, subscrições)
- **useRef** — Referências mutáveis que não causam re-render
- **Custom Hooks** — Separar lógica em hooks reutilizáveis
- **Props** — Passar dados de pai para filho
- **FlatList** — Listas performáticas com virtualização
- **StyleSheet** — Estilos inline e reutilizáveis

### Animações
- **Animated API** — Animações usando JavaScript thread ou Native Driver
- **Animated.timing** — Animação por tempo com easing
- **Animated.parallel** — Rodar múltiplas animações simultaneamente
- **useNativeDriver** — Executar animações na thread nativa

### Persistência
- **AsyncStorage** — Banco de dados chave-valor local
- **JSON.stringify / JSON.parse** — Serialização de objetos para string

### Autenticação
- **Biometria com expo-local-authentication** — Impressão digital e Face ID
- **Armazenamento seguro de sessão** — Salvar usuário logado localmente

### Câmera e Galeria
- **expo-image-picker** — Acesso a câmera e fotos
- **Permissões em tempo de execução** — Solicitar acesso ao hardware

### Mapas e Localização
- **react-native-maps** — Componentes de mapa (MapView, Marker, Circle)
- **expo-location** — GPS e permissões de localização
- **animateToRegion** — Animar o mapa programaticamente

### Boas Práticas
- **Separação de responsabilidades** — UI na screen, lógica no hook
- **Validação de formulários** — Em tempo real e antes do envio
- **Tratamento de estados de loading e erro** — UX mais robusta
- **Geração de IDs únicos** — `Date.now() + Math.random()`

---

---

## 21. Testes Automatizados — Jest

O projeto usa **Jest** com o preset `jest-expo` para garantir que a lógica de negócio funciona corretamente.

### Por que testar?

Testes automatizados detectam regressões: quando você altera um hook ou utilitário, os testes avisam imediatamente se algo quebrou — antes de o usuário perceber.

---

### Configuração

#### jest.config.js

```javascript
module.exports = {
  preset: 'jest-expo',              // Preset oficial do Expo para Jest
  setupFilesAfterEnv: ['./jest.setup.js'],  // Mocks globais
  moduleNameMapper: {
    // Usa o mock oficial do AsyncStorage (em memória)
    '^@react-native-async-storage/async-storage$':
      require.resolve('@react-native-async-storage/async-storage/jest/async-storage-mock'),
    // Arquivos de imagem (.jpg, .png, etc.) retornam o número 1
    '\\.(jpg|jpeg|png|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
```

**Por que `jest-expo` como preset?**
O preset configura automaticamente o Babel, os transformers e o ambiente para que módulos nativos do Expo (como `expo-local-authentication`) possam ser importados sem erros em ambiente Node.js.

**Por que mapear imagens para `fileMock.js`?**
Em testes, não precisamos das imagens reais. O `fileMock.js` retorna `1` (o mesmo que React Native usa internamente para assets estáticos), fazendo com que `getImagemProduto('Morango')` retorne um valor truthy sem carregar nenhum arquivo JPEG.

#### jest.setup.js

```javascript
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(false)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(false)),
  authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
}));
```

Este arquivo roda antes de cada suite de testes. Ele mocka o módulo de biometria porque ele acessa hardware nativo, que não existe em ambiente de teste.

`jest.fn()` cria uma **função espiã** — ela pode ser chamada normalmente, registra todas as chamadas, e pode ter seu comportamento sobrescrito por teste com `.mockResolvedValueOnce(...)`.

---

### Suites de Teste

#### `src/utils/__tests__/images.test.js` — 11 testes

Testa a função pura `getImagemProduto` e os dados de `DEMO_PRODUTOS`.

```javascript
// Exemplo: busca case-insensitive
it('a busca é case-insensitive', () => {
  expect(getImagemProduto('MORANGO')).not.toBeNull();
});

// Exemplo: entradas inválidas retornam null
it('retorna null para entrada nula', () => {
  expect(getImagemProduto(null)).toBeNull();
});
```

**Por que testar funções puras primeiro?**
Funções puras (sem efeitos colaterais) são as mais fáceis de testar e as mais propensas a bugs silenciosos. Um erro de digitação no `includes('limão')` seria difícil de notar sem um teste.

---

#### `src/hooks/__tests__/useAuth.test.js` — 18 testes

Testa toda a lógica de autenticação.

```javascript
// Padrão de teste de hooks:
const { result } = renderHook(() => useAuth());

// waitFor aguarda até a condição ser verdadeira (útil para efeitos assíncronos)
await waitFor(() => expect(result.current.carregando).toBe(false));

// act envolve ações que causam mudanças de estado
await act(async () => {
  const sucesso = await result.current.login('joao@test.com', '123456');
  expect(sucesso).toBe(true);
});
```

**Casos cobertos:**
- Login com credenciais corretas/incorretas
- Cadastro de novo usuário e e-mail duplicado
- Persistência no AsyncStorage após login e cadastro
- Logout limpa `usuarioLogado` mas preserva `ultimoUsuario`
- `autenticarBiometria` retorna true/false conforme o hardware responde

**Como o AsyncStorage é testado?**
O `moduleNameMapper` substitui o AsyncStorage real por uma implementação em memória. É o mesmo comportamento (async, chave-valor), mas sem persistir em disco. Um `AsyncStorage.clear()` no `beforeEach` garante que cada teste começa com o estado limpo.

---

#### `src/hooks/__tests__/useProducts.test.js` — 12 testes

Testa o CRUD de produtos.

```javascript
// Testa que DEMO_PRODUTOS são carregados na primeira inicialização
it('carrega DEMO_PRODUTOS quando AsyncStorage está vazio', async () => {
  const { result } = await renderProductsHook();
  expect(result.current.produtos).toHaveLength(DEMO_PRODUTOS.length);
});

// Testa que um produto deletado some do AsyncStorage também
it('persiste a deleção no AsyncStorage', async () => {
  // ... deletarProduto('p1')
  const json = await AsyncStorage.getItem('@gelato_mec:produtos');
  expect(JSON.parse(json)).toHaveLength(0);
});
```

---

#### `src/hooks/__tests__/useProfile.test.js` — 8 testes

Testa leitura e escrita do perfil do usuário.

```javascript
// Testa que salvarPerfil substitui o perfil inteiro (não faz merge)
it('substitui o perfil anterior por completo', async () => {
  await act(async () => {
    await result.current.salvarPerfil({ nome: 'João', cidade: 'SP' });
  });
  await act(async () => {
    await result.current.salvarPerfil({ nome: 'João Atualizado' });
  });

  expect(result.current.perfil.cidade).toBeUndefined(); // 'SP' foi perdida
});
```

Esse teste documenta um comportamento importante: `salvarPerfil` **substitui** o perfil inteiro. Se você quiser manter campos anteriores, precisa fazer o merge manualmente antes de chamar a função.

---

### Como rodar os testes

```bash
# Rodar todos os testes uma vez
npm test

# Modo watch — roda novamente a cada mudança de arquivo
npm run test:watch

# Gerar relatório de cobertura de código
npm run test:coverage
```

### Conceitos de teste aplicados

| Conceito | O que é | Onde é usado |
|----------|---------|-------------|
| `renderHook` | Renderiza um hook isolado para testar sem UI | Todos os hooks |
| `act` | Envolve ações que causam mudanças de estado | Chamadas a login, cadastrar, etc. |
| `waitFor` | Aguarda uma condição assíncrona ser verdadeira | Esperar `carregando = false` |
| `jest.fn()` | Cria uma função espiã (mock) | Mocks de LocalAuthentication |
| `mockResolvedValueOnce` | Faz o mock retornar um valor específico apenas uma vez | Testes de biometria |
| `beforeEach` | Roda antes de cada teste para limpar o estado | `AsyncStorage.clear()` |
| `moduleNameMapper` | Redireciona imports para mocks | AsyncStorage e imagens |

---

---

## 22. Painel Administrativo

O painel administrativo foi adicionado ao projeto numa segunda fase do desenvolvimento. Ele permite que um usuário com perfil de **admin** gerencie produtos, lojas e a própria equipe de administradores.

### Arquitetura do painel

O App.js passou a suportar dois "papéis" (roles) de usuário:

```javascript
// Ao fazer login, o App.js verifica se o email está na coleção de admins do Firebase
const ehAdmin = await verificarSeAdmin(usuario.email);
setRole(ehAdmin ? 'admin' : 'user');
```

Dependendo do papel:
- **user** → vê HomeScreen, MapScreen e ProductDetailScreen com TabBar na parte inferior
- **admin** → vê AdminDashboardScreen com abas Painel / Produtos / Lojas / Equipe

### Telas do painel

#### AdminDashboardScreen
Tela inicial do admin com cards de atalho (Produtos, Lojas, Equipe) e acesso ao perfil pelo avatar no canto superior direito.

#### AdminProdutosScreen
- Lista todos os produtos cadastrados no Firebase (FlatList)
- Contador de produtos no topo (`testID="contador-produtos"`)
- Botão `+` para adicionar um novo produto → abre AddProductScreen
- Toque em um produto existente → abre AddProductScreen em modo de edição

#### AdminLojasScreen
- Lista todas as lojas cadastradas no Firebase
- Contador de lojas (`testID="contador-lojas"`)
- Formulário inline para adicionar loja (nome, endereço, cidade)
- Botão `+` para revelar o formulário

#### AdminEquipeScreen
- Lista todos os administradores cadastrados
- Contador de admins (`testID="contador-equipe"`)
- Formulário com nome, e-mail, senha, confirmação de senha e seleção de permissão
- Botão salvar fica desabilitado (`disabled={!valido}`) até todos os campos estarem válidos

#### AdminPerfilScreen
- Foto de perfil com câmera ou galeria
- Edição de nome de exibição
- Troca de senha (com validação de mínimo 6 caracteres e confirmação)
- Botão de salvar com feedback visual (ícone muda para ✓ por 2s)

---

### Problema crítico: barra de status do Android (status bar)

**O problema** surgiu durante os testes: botões posicionados no topo das telas não respondiam ao toque.

**Causa raiz:** No Android, `SafeAreaView` do pacote `react-native` **não aplica inset no topo**. A área de conteúdo começa pixel a pixel a partir do canto superior da tela, sobrepondo a barra de status do sistema (~24–30 px de altura). O sistema operacional intercepta todos os toques nessa faixa antes que o React Native os receba — tornando qualquer botão que estiver ali completamente insensível ao toque.

**Diagnóstico visual:** O botão aparecia corretamente na tela, mas nunca disparava o `onPress`. Comparado com o iOS onde a `SafeAreaView` funciona, no Android parecia que o botão estava "morto".

**Solução aplicada em todas as telas do admin:**

```javascript
import { Platform, StatusBar } from 'react-native';

// No StyleSheet:
safeArea: {
  flex: 1,
  backgroundColor: '#3D1A78',
  paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
},
```

Para botões com `position: 'absolute'` (como o btn-voltar do ProductDetailScreen), a correção foi:

```javascript
voltarBtn: {
  position: 'absolute',
  top: (Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0) + 16,
  left: 16,
  // ...
},
```

**Regra geral:** Sempre que uma tela tiver um AppBar ou botão no topo, adicione `paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0` na SafeAreaView raiz da tela. Isso empurra o conteúdo para baixo da área da barra de status, garantindo que os toques cheguem ao React Native.

---

### Estrutura de pastas atualizada com o admin

```
src/screens/
├── AdminDashboardScreen.js  ← Hub do painel admin
├── AdminProdutosScreen.js   ← CRUD de produtos
├── AdminLojasScreen.js      ← CRUD de lojas
├── AdminEquipeScreen.js     ← CRUD de admins
└── AdminPerfilScreen.js     ← Perfil do admin logado

src/hooks/
├── useAdmins.js             ← Leitura/escrita de admins no Firebase
└── useLojas.js              ← Leitura/escrita de lojas no Firebase

src/components/
├── TabBar.js                ← Barra de abas inferior (usuário)
└── BottomSheet.js           ← Sheet deslizante de baixo para cima

src/services/
└── firebaseConfig.js        ← Inicialização do Firebase
```

---

## 23. Firebase Realtime Database

### Por que usar Firebase?

Durante o desenvolvimento dos testes Maestro, ficou evidente um problema com o AsyncStorage: o comando `clearState: true` no Maestro apaga todo o AsyncStorage antes de cada teste. Isso significa que produtos, lojas e admins cadastrados em um teste desaparecem no próximo.

**Solução:** Mover os dados que precisam persistir entre testes (produtos, lojas, admins) para o Firebase Realtime Database, que não é afetado pelo `clearState` do Maestro — ele fica num servidor externo.

O AsyncStorage continuou sendo usado apenas para dados de sessão do usuário (quem está logado) e perfil.

### Configuração — firebaseConfig.js

```javascript
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "https://gelato-mec-default-rtdb.firebaseio.com",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
```

> **Atenção de segurança:** As chaves do Firebase estão no código-fonte. Para um projeto de produção, essas chaves devem ficar em variáveis de ambiente (`.env`) e nunca ser comitadas no repositório. Para fins educativos e de demonstração, ficaram no código.

### useAdmins.js — Lógica de admins

```javascript
import { db } from '../services/firebaseConfig';
import { ref, onValue, push, set, remove } from 'firebase/database';

export function useAdmins() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // onValue escuta mudanças em tempo real
    const adminRef = ref(db, 'admins');
    const unsub = onValue(adminRef, (snapshot) => {
      const data = snapshot.val() || {};
      // Converte o objeto do Firebase em array
      const lista = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setAdmins(lista);
    });
    return () => unsub(); // Cancela a escuta ao desmontar
  }, []);

  const cadastrarAdmin = async ({ nome, email, senha, permissao }) => {
    const adminRef = ref(db, 'admins');
    await push(adminRef, { nome, email, senha, permissao });
  };

  const removerAdmin = async (id) => {
    await remove(ref(db, `admins/${id}`));
  };

  return { admins, cadastrarAdmin, removerAdmin };
}
```

### useLojas.js — Lógica de lojas

Mesma estrutura do `useAdmins.js`, mas para lojas. Cada loja tem: `nome`, `endereco`, `cidade`, `lat`, `lng` (coordenadas), `avaliacao`.

### Diferença entre Firebase e AsyncStorage

| Característica | AsyncStorage | Firebase |
|---|---|---|
| Onde fica | No próprio celular | Servidor na nuvem |
| Persiste após `clearState` | Não — é apagado | Sim — servidor não é afetado |
| Acesso offline | Sim | Parcial (cache) |
| Dados compartilhados entre usuários | Não | Sim |
| Precisa de internet | Não | Sim |

---

## 24. Testes de UI com Maestro — Fluxos, Erros e Soluções

### O que é Maestro?

**Maestro** é um framework de testes de UI para apps mobile. Diferente do Jest (que testa lógica de código em Node.js), o Maestro controla o app de verdade num dispositivo Android real via ADB, simulando toques, digitação e navegação da mesma forma que um usuário faria.

Versão usada: **Maestro v2.6.1**
Dispositivo Android: Expo Go (`host.exp.exponent`) via USB

### Como rodar os testes

```bash
# Requisito: ADB port forwarding (deve ser refeito após cada reconexão USB)
adb reverse tcp:8081 tcp:8081

# Servidor Expo deve estar rodando:
npx expo start

# Rodar um teste individual:
.\maestro.bat test .maestro/home_produtos.yaml

# Rodar todos os 9 testes:
.\maestro.bat test .maestro/login_usuario.yaml
.\maestro.bat test .maestro/cadastro.yaml
.\maestro.bat test .maestro/home_produtos.yaml
.\maestro.bat test .maestro/mapa.yaml
.\maestro.bat test .maestro/admin_produtos.yaml
.\maestro.bat test .maestro/admin_lojas.yaml
.\maestro.bat test .maestro/admin_equipe.yaml
.\maestro.bat test .maestro/admin_perfil.yaml
```

### Os 9 flows de teste

| Arquivo | O que testa |
|---|---|
| `login_usuario.yaml` | Login de usuário comum com e-mail e senha |
| `cadastro.yaml` | Cadastro de novo usuário |
| `home_produtos.yaml` | Navegar na home, abrir detalhe de produto, voltar, ir ao mapa |
| `mapa.yaml` | Abrir mapa, buscar por nome, tocar em "Perto de mim" |
| `admin_produtos.yaml` | Login como admin, adicionar produto, verificar contador |
| `admin_lojas.yaml` | Login como admin, adicionar loja, verificar na lista |
| `admin_equipe.yaml` | Login como admin, cadastrar novo admin, verificar na lista |
| `admin_perfil.yaml` | Login como admin, editar nome no perfil, salvar |

### Flows auxiliares (não são testes, são sub-rotinas)

- `_criar_usuario.yaml` — abre o app, cria uma conta de usuário e faz login; chamado por `runFlow` dos testes de usuário
- `_criar_admin.yaml` — mesma coisa mas com `admin@gelatomec.com`; chamado pelos testes de admin
- `delay_5s.js` — script JavaScript que pausa 5 segundos; usado para esperar animações lentas

---

### Erros encontrados e como foram resolvidos

#### Erro 1 — ADB port forwarding perdido após reconexão USB

**Sintoma:** Maestro trava em "Connecting to device" ou o Expo dá erro de conexão com o servidor de bundle após reconectar o cabo USB.

**Causa:** O `adb reverse` configura um túnel de rede do celular para o PC. Esse túnel é destruído quando o cabo USB é desconectado ou o PC hiberna.

**Solução:** Sempre executar antes de qualquer teste:
```bash
adb reverse tcp:8081 tcp:8081
```

---

#### Erro 2 — btn-voltar não funcionava no ProductDetailScreen

**Sintoma:** O Maestro reportava `tapOn: COMPLETED` mas a tela não mudava. O botão era visível, o tap era reconhecido, mas `onPress` nunca disparava.

**Causa:** O botão estava posicionado com `position: 'absolute', top: 16` dentro de uma `SafeAreaView` sem offset de status bar. No Android, isso coloca o botão dentro da faixa da barra de status do sistema (~24–30 px do topo), onde o sistema operacional intercepta todos os toques antes que o React Native os receba.

**Solução em duas partes:**

1. Mover o `btn-voltar` para **fora** do `ScrollView` (era filho de uma `View` com `overflow: 'hidden'`, o que também bloqueava o toque):

```jsx
<SafeAreaView style={styles.container}>
  {/* Botão FORA do ScrollView */}
  <TouchableOpacity testID="btn-voltar" style={styles.voltarBtn} onPress={onVoltar}>
    <Text style={styles.voltarText}>← Voltar</Text>
  </TouchableOpacity>
  <ScrollView>
    <View style={[styles.hero, { backgroundColor: cor }]}>
      {/* sem o botão aqui */}
    </View>
    ...
  </ScrollView>
</SafeAreaView>
```

2. Adicionar offset da status bar no `top`:

```javascript
voltarBtn: {
  position: 'absolute',
  top: (Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0) + 16,
  left: 16,
  zIndex: 10,
  backgroundColor: 'rgba(0,0,0,0.35)',
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 20,
},
```

---

#### Erro 3 — Botão "+" das telas admin insensível ao toque

**Sintoma:** O mesmo que o Erro 2, mas nos botões de adicionar das telas admin (AdminProdutosScreen, AdminLojasScreen, AdminEquipeScreen). O botão aparecia sobreposto à barra de status.

**Causa:** Mesma do Erro 2 — `SafeAreaView` sem `paddingTop` no Android.

**Solução:** Adicionar a seguinte propriedade ao estilo `safeArea` de cada tela admin:

```javascript
safeArea: {
  flex: 1,
  backgroundColor: '#3D1A78',
  paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
},
```

Telas corrigidas: `AdminProdutosScreen`, `AdminLojasScreen`, `AdminEquipeScreen`, `AdminDashboardScreen`, `AdminPerfilScreen`, `AddProductScreen`.

---

#### Erro 4 — `assertVisible: text: "sabores cadastrados"` falhava apesar do texto estar na tela

**Sintoma:** O teste `admin_produtos.yaml` reportava que o texto "sabores cadastrados" não estava visível, mas o app mostrava "6 sabores cadastrados" claramente.

**Causa:** O texto ficava dentro do `ListHeaderComponent` de uma `FlatList`. O Maestro tem dificuldade em encontrar texto dentro do `ListHeaderComponent` via seletor `text:`.

**Solução:** Adicionar `testID` ao componente e usar o seletor `id:` no lugar de `text:`:

```jsx
// No componente (AdminProdutosScreen.js):
<Text testID="contador-produtos" style={styles.contador}>
  {produtos.length} sabores cadastrados
</Text>
```

```yaml
# No teste (admin_produtos.yaml):
- extendedWaitUntil:
    visible:
      id: "contador-produtos"
    timeout: 15000
```

**Lição:** Sempre adicione `testID` a qualquer elemento que precise ser assertado em testes — não confie em seletores por texto para elementos dentro de `FlatList`.

---

#### Erro 5 — `clearText` causava "Invalid Command"

**Sintoma:** O YAML `- clearText` em modo standalone lançava `Error: Invalid Command: clearText` no Maestro v2.6.1.

**Causa:** Nessa versão do Maestro, `clearText` como comando independente não existe. Ele só funciona como sub-comando de `tapOn`.

**Workaround:** Em vez de limpar e redigitar, apenas **acrescentar** o novo texto ao existente. Exemplo no teste `admin_perfil.yaml`:

```yaml
# Errado — causa "Invalid Command":
- clearText

# Certo — acrescenta ao texto existente:
- tapOn:
    id: "input-nome"
- inputText: " Atualizado"
```

O nome do admin fica "Admin Teste Atualizado" em vez de "Atualizado", mas isso é aceitável para o teste, que só verifica a mensagem de confirmação.

---

#### Erro 6 — Diálogo de permissão de localização bloqueava o teste

**Sintoma:** Ao navegar para a aba "Franquias" (MapScreen), o Expo Go exibia dois diálogos sequenciais de permissão de localização com botões ALLOW/DENY. O teste parava esperando elementos da MapScreen mas estava bloqueado pelos diálogos.

**Causa:** O Android pede permissão de localização em duas etapas: localização aproximada (coarse) e depois precisa (fine). Cada pedido gera um diálogo diferente.

**Solução:** Dois blocos `runFlow: when:` para tratar os dois diálogos de forma condicional:

```yaml
- tapOn:
    text: "Franquias"

# Primeiro diálogo (coarse location)
- runFlow:
    when:
      visible:
        text: "ALLOW"
    commands:
      - tapOn:
          text: "ALLOW"

# Segundo diálogo (fine location)
- runFlow:
    when:
      visible:
        text: "ALLOW"
    commands:
      - tapOn:
          text: "ALLOW"

- extendedWaitUntil:
    visible:
      text: "Franquias no Mapa"
    timeout: 15000
```

O `runFlow: when:` é condicional: só executa os comandos internos se a condição for verdadeira. Se o diálogo não aparecer (permissão já concedida), o bloco é simplesmente ignorado.

Como reforço, também foi usada a pré-concessão via ADB:
```bash
adb shell pm grant host.exp.exponent android.permission.ACCESS_FINE_LOCATION
adb shell pm grant host.exp.exponent android.permission.ACCESS_COARSE_LOCATION
```

---

#### Erro 7 — `titulo-cadastro` intermitentemente não aparecia após `clearState`

**Sintoma:** Às vezes o teste `_criar_usuario.yaml` reportava timeout esperando `titulo-cadastro` (o título da RegisterScreen). Acontecia especialmente após `launchApp: clearState: true`.

**Causa:** O `clearState: true` apaga o AsyncStorage e reinicia o app do zero. Algumas vezes, após o app iniciar, a animação de splash ainda está rodando quando o Maestro tenta tocar em `btn-criar-conta` — o toque é registrado mas a tela ainda está animando e o botão não processa o evento de navegação.

**Solução:** Adicionar retry com verificação condicional:

```yaml
- extendedWaitUntil:
    visible:
      id: "btn-criar-conta"
    timeout: 30000
- waitForAnimationToEnd
- runScript:
    file: delay_5s.js
- tapOn:
    id: "btn-criar-conta"

# Se após o tap ainda está na tela de login (tap não registrou), tenta de novo
- runFlow:
    when:
      visible:
        id: "btn-criar-conta"
    commands:
      - runScript:
          file: delay_5s.js
      - tapOn:
          id: "btn-criar-conta"

- extendedWaitUntil:
    visible:
      id: "titulo-cadastro"
    timeout: 60000  # Aumentado de 30s para 60s
```

---

#### Erro 8 — Botão "Salvar Produto" não encontrado para tap

**Sintoma:** O Maestro reportava que `btn-salvar-produto` não estava visível para ser tocado.

**Causa:** O formulário de adicionar produto tem muitos campos. Ao abrir o teclado para preencher os últimos campos, o botão "Salvar Produto" ficava fora da viewport (abaixo do teclado). Além disso, o botão ainda não tinha `testID`.

**Solução em duas partes:**

1. Adicionar `testID` ao botão:
```jsx
<TouchableOpacity testID="btn-salvar-produto" style={styles.botao} onPress={handleSalvar}>
  <Text style={styles.botaoText}>{editando ? 'Salvar Alterações' : 'Salvar Produto'}</Text>
</TouchableOpacity>
```

2. No teste, fechar o teclado e fazer scroll antes de tocar:
```yaml
- inputText: "50"
- hideKeyboard
- scrollUntilVisible:
    element:
      id: "btn-salvar-produto"
    direction: DOWN
    timeout: 5000
- tapOn:
    id: "btn-salvar-produto"
```

---

#### Erro 9 — "Início" não encontrada imediatamente após btn-voltar

**Sintoma:** Após tocar em `btn-voltar` e voltar da ProductDetailScreen, o teste `home_produtos.yaml` falhava ao tentar `assertVisible: text: "Início"` logo em seguida.

**Causa:** A navegação de volta para a HomeScreen envolve uma transição de estado que demora alguns frames. O `assertVisible` imediato não dava tempo para a HomeScreen renderizar.

**Solução:** Substituir `assertVisible` imediato por `extendedWaitUntil` com timeout e adicionar `waitForAnimationToEnd`:

```yaml
- tapOn:
    id: "btn-voltar"
- waitForAnimationToEnd
- extendedWaitUntil:
    visible:
      text: "Início"
    timeout: 15000
```

---

### Resumo de todos os `testID` adicionados

Para que o Maestro consiga identificar os elementos de forma confiável, os seguintes `testID` foram adicionados ao longo do projeto:

| testID | Arquivo | Elemento |
|---|---|---|
| `btn-criar-conta` | LoginScreen.js | Botão "Criar conta" |
| `titulo-cadastro` | RegisterScreen.js | Título da tela de cadastro |
| `btn-voltar` | ProductDetailScreen.js | Botão voltar da tela de detalhe |
| `produto-card` | HomeScreen.js | Cada card de produto na grade |
| `input-busca-mapa` | MapScreen.js | Campo de busca do mapa |
| `btn-perto-mim` | MapScreen.js | Botão "Perto de mim" |
| `contador-produtos` | AdminProdutosScreen.js | Texto "X sabores cadastrados" |
| `add-produto-btn` | AdminProdutosScreen.js | Botão "+" para adicionar produto |
| `input-nome-produto` | AddProductScreen.js | Campo nome do produto |
| `input-preco-produto` | AddProductScreen.js | Campo preço |
| `input-qtd-produto` | AddProductScreen.js | Campo quantidade |
| `btn-salvar-produto` | AddProductScreen.js | Botão salvar produto |
| `contador-lojas` | AdminLojasScreen.js | Texto "X lojas cadastradas" |
| `add-loja-btn` | AdminLojasScreen.js | Botão "+" para adicionar loja |
| `input-nome-loja` | AdminLojasScreen.js | Campo nome da loja |
| `input-endereco-loja` | AdminLojasScreen.js | Campo endereço |
| `input-cidade-loja` | AdminLojasScreen.js | Campo cidade |
| `btn-cadastrar-loja` | AdminLojasScreen.js | Botão salvar loja |
| `contador-equipe` | AdminEquipeScreen.js | Texto "X admins" |
| `add-equipe-btn` | AdminEquipeScreen.js | Botão "+" para adicionar admin |
| `input-nome-equipe` | AdminEquipeScreen.js | Campo nome do novo admin |
| `input-email-equipe` | AdminEquipeScreen.js | Campo e-mail do novo admin |
| `input-senha-equipe` | AdminEquipeScreen.js | Campo senha |
| `input-confirmar-equipe` | AdminEquipeScreen.js | Campo confirmar senha |
| `btn-cadastrar-admin` | AdminEquipeScreen.js | Botão cadastrar admin |
| `avatar-admin` | AdminDashboardScreen.js | Avatar para ir ao perfil |
| `input-nome` | AdminPerfilScreen.js | Campo de nome no perfil |
| `btn-salvar-perfil` | AdminPerfilScreen.js | Botão salvar perfil |

---

### Boas práticas aprendidas com os testes Maestro

1. **Sempre use `testID` em elementos interativos** — nunca dependa de texto para identificar botões em testes, pois o texto pode mudar ou ser difícil de encontrar dentro de listas.

2. **`extendedWaitUntil` + timeout explícito** em vez de `assertVisible` simples para elementos que podem demorar a aparecer (especialmente após navegação ou operações assíncronas).

3. **`hideKeyboard` antes de `scrollUntilVisible`** — o teclado aberto reduz a viewport e pode esconder elementos que o `scrollUntilVisible` precisa enxergar.

4. **`runFlow: when:` para diálogos opcionais** — diálogos de permissão nem sempre aparecem (se a permissão já foi concedida). O bloco condicional permite que o teste funcione em ambos os casos sem falhar.

5. **`waitForAnimationToEnd` após navegações** — dá tempo para transições de tela concluírem antes do próximo comando.

6. **Aumente o timeout em `extendedWaitUntil` para operações após `clearState`** — o app recomeça do zero, o bundle precisa ser re-avaliado e o splash é exibido. Timeouts de 30–60 segundos são razoáveis para os primeiros elementos após `clearState`.

7. **`adb reverse` após qualquer reconexão USB** — não esqueça. É a causa número um de falhas inexplicáveis quando o app parece estar funcionando mas os testes não respondem.

---

*Documentação gerada para o projeto Gelato MEC — React Native + Expo*
