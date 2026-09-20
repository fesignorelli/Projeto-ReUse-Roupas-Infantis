# 🌿 ReUse — Roupas Infantis

Aplicativo mobile para a **troca de roupas infantis de 0 a 13 anos entre famílias**, de forma sustentável, segura e **sem nenhum pagamento envolvido**.

O projeto foi desenvolvido em React Native com Expo como parte de uma atividade acadêmica voltada ao desenvolvimento mobile, UI/UX, armazenamento local e utilização de recursos nativos do dispositivo.

---

## 🎯 Objetivo

Crianças crescem rápido, e roupas em bom estado acabam esquecidas no armário. O **ReUse** conecta famílias para que essas peças ganhem uma nova vida por meio da troca direta, sem dinheiro envolvido.

A proposta busca:

* Reduzir o descarte de roupas infantis;
* Incentivar o consumo consciente;
* Facilitar a troca de peças entre famílias;
* Criar uma comunidade segura entre pais e responsáveis;
* Permitir o reaproveitamento de roupas em bom estado;
* Tornar o cadastro de peças rápido por meio da câmera do dispositivo.

---

## ✨ Funcionalidades

Atualmente, o aplicativo conta com:

* Tela inicial responsiva;
* Feed de peças disponíveis para troca;
* Busca por nome, tamanho, categoria, descrição ou localização;
* Filtros por faixa etária, novidades e peças verificadas;
* Cadastro de novas peças;
* Captura de foto utilizando a câmera do dispositivo;
* Alternância entre câmera frontal e traseira;
* Pré-visualização da foto capturada;
* Opção de confirmar ou refazer a foto;
* Validação dos campos obrigatórios;
* Armazenamento local das peças cadastradas;
* Persistência das peças após fechar e abrir o aplicativo;
* Cópia das imagens para o diretório permanente do aplicativo;
* Exibição das peças cadastradas no feed;
* Navegação entre Home, feed e cadastro;
* Mensagens de carregamento, sucesso e erro;
* Componentes com recursos básicos de acessibilidade.

---

## 📱 Fluxo principal

O principal fluxo implementado no aplicativo é o cadastro de uma peça:

1. O usuário acessa a Home;
2. Toca em **Cadastrar peça**;
3. Preenche as informações da roupa;
4. Abre a câmera do dispositivo;
5. Fotografa a peça;
6. Confirma ou refaz a foto;
7. Publica a peça;
8. A peça é armazenada localmente;
9. O usuário retorna ao feed;
10. A nova peça aparece entre os itens disponíveis para troca.

---

## 📷 Uso da câmera

A câmera foi utilizada no cadastro de peças.

O aplicativo solicita a permissão do usuário antes de acessar o recurso. Depois da autorização, é possível:

* Abrir a câmera;
* Alternar entre a câmera frontal e traseira;
* Fotografar uma peça;
* Visualizar a imagem capturada;
* Refazer a fotografia;
* Confirmar o uso da imagem;
* Exibir a foto no formulário;
* Usar a imagem no anúncio publicado.

A funcionalidade foi implementada com o pacote [`expo-camera`](https://docs.expo.dev/versions/latest/sdk/camera/).

---

## 💾 Uso do Async Storage

O [`@react-native-async-storage/async-storage`](https://react-native-async-storage.github.io/async-storage/) é utilizado para armazenar localmente as peças cadastradas.

Os dados são salvos com a chave:

```text
@reuse:products
```

Cada peça pode armazenar informações como:

```json
{
  "id": "identificador-da-peca",
  "title": "Vestido floral infantil",
  "category": "Vestidos",
  "size": "3-4 anos",
  "condition": "Ótimo estado",
  "description": "Vestido usado poucas vezes.",
  "location": "Vila Madalena, SP",
  "imageUrl": "caminho-local-da-imagem",
  "createdAt": "data-do-cadastro",
  "tradesCount": 0,
  "isNew": true,
  "verified": false
}
```

Com isso, as peças permanecem disponíveis mesmo depois que o aplicativo é fechado e aberto novamente.

As imagens capturadas são copiadas para uma pasta permanente com o `expo-file-system`. O Async Storage guarda os dados do anúncio e o caminho local da imagem.

---

## 🎨 UI/UX para mobile

O aplicativo foi planejado para proporcionar uma experiência simples, clara e adequada a dispositivos móveis.

Entre as decisões de UI/UX utilizadas estão:

* Botões grandes e fáceis de tocar;
* Hierarquia visual entre títulos, textos e ações;
* Cores diferentes para ações primárias e secundárias;
* Feedback visual durante o salvamento;
* Mensagens claras de erro e sucesso;
* Validação antes da publicação;
* Pré-visualização da foto antes da confirmação;
* Possibilidade de refazer ou remover a imagem;
* Busca com opção de limpeza;
* Filtros apresentados como chips selecionáveis;
* Cards com informações organizadas;
* Navegação com ações de voltar;
* Áreas seguras para diferentes tamanhos de tela;
* Rolagem vertical sem indicador visual;
* Teclado configurado para não bloquear os campos;
* Textos auxiliares para orientar o usuário;
* Labels de acessibilidade nos principais botões;
* Estados vazios quando nenhuma peça é encontrada;
* Botão flutuante para facilitar um novo cadastro.

---

## 🎨 Paleta de cores

| Nome             |       Hex | Uso principal                          |
| ---------------- | --------: | -------------------------------------- |
| `pink.base`      | `#ffc0cb` | Detalhes decorativos                   |
| `pink.medium`    | `#f48199` | Textos de destaque e labels            |
| `pink.dark`      | `#e05578` | Botões primários, CTAs e ícones ativos |
| `pink.light`     | `#ffdae9` | Fundos de seção e badges               |
| `pink.xlight`    | `#fff5f8` | Fundos suaves                          |
| `blue.base`      | `#89cff0` | Detalhes decorativos                   |
| `blue.medium`    | `#5ba8d4` | Seções de confiança e segurança        |
| `blue.dark`      | `#2d82b7` | Botões secundários e links             |
| `blue.light`     | `#b9d9eb` | Fundos de seção e badges               |
| `blue.xlight`    | `#eaf5fb` | Fundos suaves                          |
| `mint.base`      | `#ace1af` | Detalhes decorativos                   |
| `mint.medium`    | `#6db571` | Ícones e destaques de sustentabilidade |
| `mint.dark`      | `#3d8b42` | Selos de verificação                   |
| `mint.light`     | `#d0f0c0` | Fundos de seção e badges               |
| `mint.xlight`    | `#edf7ed` | Fundos suaves                          |
| `cream`          | `#fdf8f0` | Fundo padrão do aplicativo             |
| `offwhite`       | `#fafafa` | Fundo de inputs e campos               |
| `ink.dark`       | `#212121` | Texto principal e rodapé               |
| `ink.mid`        | `#555555` | Texto secundário                       |
| `ink.light`      | `#888888` | Texto auxiliar e ícones neutros        |
| `neutralIcon`    | `#f1f1f1` | Fundos neutros                         |
| `neutralDivider` | `#e0e0e0` | Bordas e divisores                     |
| `softBorder`     | `#f0e8ee` | Bordas suaves                          |

A paleta está centralizada no arquivo `tailwind.config.js`. As cores são utilizadas como classes do NativeWind, como:

```jsx
<View className="bg-pink-dark" />
<Text className="text-ink-mid" />
<View className="border-neutralDivider" />
```

---

## ✍️ Tipografia

O projeto utiliza duas famílias tipográficas:

* **Montserrat:** títulos, botões e textos de destaque;
* **Hind Madurai:** textos de corpo, descrições e informações auxiliares.

Classes configuradas:

| Classe               | Utilização                       |
| -------------------- | -------------------------------- |
| `font-heading`       | Títulos em Montserrat Bold       |
| `font-headingMedium` | Destaques em Montserrat SemiBold |
| `font-body`          | Textos em Hind Madurai Regular   |
| `font-bodyMedium`    | Textos em Hind Madurai Medium    |
| `font-bodySemibold`  | Textos em Hind Madurai SemiBold  |

---

## 🛠️ Tecnologias utilizadas

| Camada                   | Tecnologia                                                          |
| ------------------------ | ------------------------------------------------------------------- |
| Framework                | [Expo](https://expo.dev/)                                           |
| Interface mobile         | React Native                                                        |
| Linguagem                | JavaScript com JSX                                                  |
| Estilização              | [NativeWind](https://www.nativewind.dev/)                           |
| Armazenamento local      | `@react-native-async-storage/async-storage`                         |
| Câmera                   | `expo-camera`                                                       |
| Armazenamento de imagens | `expo-file-system`                                                  |
| Ícones                   | `@expo/vector-icons` — Ionicons                                     |
| Fontes                   | `@expo-google-fonts/montserrat` e `@expo-google-fonts/hind-madurai` |
| Gradientes               | `expo-linear-gradient`                                              |
| Safe area                | `react-native-safe-area-context`                                    |
| Plataformas              | Android, iOS e Web                                                  |

---

## 📁 Estrutura de pastas

```text
reuse-app/
├── assets/
│   ├── logo.png
│   ├── icon.png
│   └── imagens-do-aplicativo
│
├── src/
│   ├── components/
│   │   ├── CameraCapture.jsx
│   │   ├── CategoriesSection.jsx
│   │   ├── FiltersBar.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── HowItWorksSection.jsx
│   │   ├── NavBar.jsx
│   │   ├── NewArrivalsSection.jsx
│   │   ├── NewsletterSection.jsx
│   │   ├── ProductCard.jsx
│   │   ├── SeasonalCollectionsSection.jsx
│   │   ├── TestimonialsSection.jsx
│   │   └── TrustSection.jsx
│   │
│   ├── screens/
│   │   ├── CreateProductScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   └── ProductsFeedScreen.jsx
│   │
│   └── services/
│       └── productStorage.js
│
├── App.jsx
├── app.json
├── babel.config.js
├── global.css
├── index.ts
├── metro.config.js
├── nativewind-env.d.ts
├── package.json
├── package-lock.json
└── tailwind.config.js
```

---

## 🚀 Como executar

### Pré-requisitos

Antes de iniciar, instale:

* [Node.js](https://nodejs.org/);
* npm;
* [Expo Go](https://expo.dev/go) no celular, caso queira testar em um dispositivo físico.

### Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd reuse-app
```

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

Caso seja necessário limpar o cache:

```bash
npx expo start --clear
```

---

## 📲 Formas de execução

Depois de iniciar o Expo:

* Pressione `w` para abrir no navegador;
* Pressione `a` para abrir em um emulador Android;
* Pressione `i` para abrir em um simulador iOS disponível;
* Escaneie o QR Code com o Expo Go para abrir no celular.

Para testar a câmera como recurso nativo, recomenda-se executar o projeto em um dispositivo físico.

---

## 🔐 Permissões

O aplicativo solicita acesso à câmera para fotografar as peças cadastradas.

A mensagem de permissão está configurada no `app.json`:

```json
{
  "plugins": [
    [
      "expo-camera",
      {
        "cameraPermission": "Permita que o ReUse use a câmera para fotografar as peças cadastradas."
      }
    ]
  ]
}
```

---

## 🧪 Teste do fluxo principal

Para verificar o funcionamento:

1. Abra o aplicativo;
2. Toque em **Cadastrar peça**;
3. Preencha os campos obrigatórios;
4. Toque em **Tirar foto da peça**;
5. Autorize o acesso à câmera;
6. Tire uma foto;
7. Confirme a imagem;
8. Toque em **Publicar peça**;
9. Confirme se a peça aparece no feed;
10. Feche completamente o aplicativo;
11. Abra novamente;
12. Confirme se a peça e a imagem continuam disponíveis.

---

Feito com 💚 para famílias que acreditam em moda infantil sustentável.
