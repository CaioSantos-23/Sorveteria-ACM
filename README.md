# Gelato MEC 🍦

Bem-vindo ao repositório do **Gelato MEC** — aplicativo mobile da sorveteria Gelato MEC, desenvolvido em React Native com Expo. 100% Javascript!

> *"Sabor que derrete o coração"*

---

## 📱 Sobre o Aplicativo

O **Gelato MEC** é um app completo para gerenciamento e vitrine de uma rede de sorveterias. Ele oferece autenticação segura, catálogo visual de produtos com busca, mapa de franquias e perfil de usuário com persistência de dados.

---

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação
- **Tela de Login** com e-mail e senha
- **Tela de Cadastro** com validação de campos e confirmação de senha
- **Login por Biometria** (digital / Face ID) disponível após o primeiro login
- **Ativação de biometria no cadastro** — o usuário pode ativar digital/Face ID logo ao criar a conta
- Tela de loading/splash animada com a logo ao abrir o app
- **Botão "Sair da conta"** disponível no Perfil e no Menu Lateral

### 🍦 Catálogo de Produtos
- **Tela principal** com grid de produtos em 2 colunas
- **Barra de pesquisa** no topo para filtrar sabores em tempo real
- Cards com **foto real** do produto e nome do sabor abaixo
- **6 sabores pré-cadastrados:** Morango, Chocolate, Açaí, Coco, Limão e Doce de Leite
- Imagens automáticas para todos os sabores pré-cadastrados
- Suporte a **foto personalizada** por produto (galeria ou câmera)

### 🔎 Detalhes do Produto
- Acesso ao clicar em qualquer parte do card (foto ou nome)
- Exibe: **foto em destaque**, nome, preço, quantidade em estoque, calorias
- **Lista de ingredientes** separados por vírgula
- Descrição do sabor

### ➕ Cadastro de Produto
- Acessado pelo menu lateral
- Campos: nome do sabor, preço, quantidade, calorias, ingredientes e descrição
- **Upload de foto** via galeria ou câmera com recorte automático 16:9

### 📍 Mapa de Franquias
- Acessado pelo menu lateral
- Exibe mapa com **localização do usuário**
- Mostra todas as franquias em um **raio de 10 km**
- Integração com **Google Maps** e **Google Places API**
- Lista horizontal de franquias com nome, endereço e avaliação
- Dados fictícios para demonstração (enquanto sem chave da API)

### 👤 Perfil do Usuário
- Acessado pelo botão flutuante no canto inferior direito
- **Foto de perfil** com câmera ou galeria (recorte quadrado)
- Campos editáveis: nome de exibição, bio, telefone, cidade, data de nascimento
- Exibe e-mail da conta (somente leitura)
- **Botão "Sair da conta"** para fazer logout

### ☰ Menu Lateral (Sidebar)
- Abre com animação slide-in pelo botão ☰ no canto superior esquerdo
- Opções: **Mapa de Franquias** e **Cadastrar Produto**
- Exibe nome do usuário logado
- **Botão "Sair da conta"** no rodapé do menu

### 💾 Persistência de Dados
- Todos os dados são salvos localmente com **AsyncStorage**
- Usuários cadastrados, produtos e perfil sobrevivem ao fechamento do app
- Último usuário logado é lembrado para login por biometria

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0.0 | Plataforma de desenvolvimento |
| expo-local-authentication | ~17.0.8 | Biometria (digital / Face ID) |
| expo-image-picker | ~16.0.6 | Upload de fotos (câmera e galeria) |
| expo-location | ~18.0.4 | Localização GPS do usuário |
| expo-status-bar | ~3.0.9 | Barra de status |
| react-native-maps | ~1.18.0 | Mapa interativo (Google Maps) |
| @react-native-async-storage/async-storage | ~2.1.2 | Persistência de dados local |

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado
- Expo Go instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Conta gratuita no [expo.dev](https://expo.dev)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/CaioSantos-23/Sorveteria-ACM.git

# 2. Acesse a pasta do projeto
cd sorvete-mec

# 3. Instale as dependências
npm install --legacy-peer-deps

# 4. Faça login na sua conta Expo
npx expo login

# 5. Inicie o servidor com tunnel (necessário quando PC e celular estão em redes diferentes)
npx expo start --tunnel
```

### No celular
1. Abra o **Expo Go**
2. Escaneie o QR Code exibido no terminal
3. Aguarde o bundle carregar

---

## 🗺️ Configurar Google Maps (Opcional)

Para o mapa exibir franquias reais ao invés dos dados de demonstração:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto e ative as APIs:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
   - **Places API**
3. Gere uma **API Key**
4. Substitua `'SUA_CHAVE_AQUI'` em dois arquivos:

**`src/screens/MapScreen.js`** — linha 8:
```js
const GOOGLE_API_KEY = 'sua_chave_aqui';
```

**`app.json`** — dentro de `android.config`:
```json
"googleMaps": {
  "apiKey": "sua_chave_aqui"
}
```

---

## 📁 Estrutura do Projeto

```
sorvete-mec/
├── assets/
│   ├── logo_gelato_mec.jpeg
│   ├── sorvete_morango_mec.jpeg
│   ├── sorvete_chocolate_mec.jpeg
│   ├── acai_mec.jpeg
│   ├── coco.jpeg
│   ├── Limao.jpeg
│   └── doce_de_Leite.jpeg
├── src/
│   ├── screens/
│   │   ├── SplashScreen.js         # Tela de carregamento
│   │   ├── LoginScreen.js          # Login com e-mail/senha e biometria
│   │   ├── RegisterScreen.js       # Cadastro de usuário
│   │   ├── HomeScreen.js           # Grid de produtos com busca
│   │   ├── ProductDetailScreen.js  # Detalhes do produto
│   │   ├── AddProductScreen.js     # Cadastro de novo produto
│   │   ├── ProfileScreen.js        # Perfil do usuário
│   │   └── MapScreen.js            # Mapa de franquias
│   ├── components/
│   │   └── Sidebar.js              # Menu lateral animado
│   ├── hooks/
│   │   ├── useAuth.js              # Autenticação e biometria
│   │   ├── useProducts.js          # Gerenciamento de produtos
│   │   └── useProfile.js           # Perfil do usuário
│   └── utils/
│       └── images.js               # Mapeamento de imagens e dados demo
├── App.js                          # Navegação e estado global
├── app.json                        # Configurações do Expo
└── package.json
```

---

## 👩‍💻 Desenvolvedores

| Nome | |
|---|---|
| **Caio Santos** | Desenvolvimento |
| **Mellani Lyvian** | Desenvolvimento |
| **Aline Simas** | Desenvolvimento |
