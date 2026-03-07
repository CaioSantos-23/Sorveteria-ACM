# Sorveteria ACM

Bem-vindo ao repositório do aplicativo **Sorveteria ACM**. Este é um projeto mobile desenvolvido em React Native utilizando o framework Expo.

## 🍦 Sobre o Aplicativo
O aplicativo atua como um app para a Sorveteria e implementa um sistema de segurança através de **autenticação biométrica**. 
Ao abrir o app, ocorre uma verificação se o dispositivo do usuário possui o hardware necessário para biometria (identificação por digital, Face ID, etc.). Clicando no botão de entrar, o aplicativo invoca a biometria nativa do aparelho e, caso tenha sucesso, libera o acesso para a tela segura ("Usuário logado com sucesso!").

## 💻 Desenvolvedores
Este projeto foi desenvolvido com dedicação e carinho por:
- **Caio Santos**
- **Mellani**
- **Aline**

## 🚀 Tecnologias Utilizadas
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- `expo-local-authentication` (Para a integração com a biometria do dispositivo)

## 🛠️ Como rodar o projeto
Para rodar este projeto na sua máquina, siga os passos:

1. Clone o repositório (`git clone https://github.com/CaioSantos-23/Sorveteria-ACM.git`).
2. Acesse a pasta do projeto (`cd sorvete-mec`).
3. Instale as dependências com `npm install`.
4. Inicie o servidor do Expo com `npx expo start`.
