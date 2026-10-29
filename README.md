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
* Anexo de imagem da galeria do dispositivo;
* Arrastar e soltar imagem no cadastro (versão web);
* Validação dos campos obrigatórios;
* Armazenamento local das peças cadastradas;
* Persistência das peças após fechar e abrir o aplicativo;
* Cópia das imagens para o diretório permanente do aplicativo;
* Exibição das peças cadastradas no feed;
* Navegação entre Home, feed e cadastro;
* Mensagens de carregamento, sucesso e erro exibidas em modais;
* Componentes com recursos básicos de acessibilidade;
* Cadastro de usuário, login e logout;
* Sessão persistente com renovação automática do token;
* Telas protegidas por login (cadastro de peça, perfil e trocas);
* Solicitação de troca com QR Code de confirmação;
* Leitura do QR Code pela câmera para confirmar a troca;
* Cálculo do CO₂ evitado em cada troca;
* Preenchimento do bairro pelo CEP;
* Cache local das respostas das APIs.

---

## 📱 Fluxo principal

O principal fluxo implementado no aplicativo é o cadastro de uma peça:

1. O usuário acessa a Home;
2. Toca em **Cadastrar peça** (se não estiver logado, entra ou cria uma conta);
3. Preenche as informações da roupa, com o bairro preenchido pelo CEP;
4. Fotografa a peça com a câmera ou anexa uma imagem da galeria;
5. Confirma, refaz ou troca a imagem;
6. Publica a peça;
7. Um modal confirma o cadastro;
8. A peça é armazenada localmente;
9. O usuário retorna ao feed;
10. A nova peça aparece entre os itens disponíveis para troca.

---

## 📷 Uso da câmera

A câmera é usada em dois momentos: no cadastro de peças e na leitura do QR Code que confirma uma troca.

O aplicativo solicita a permissão do usuário antes de acessar o recurso. Depois da autorização, é possível:

* Abrir a câmera;
* Alternar entre a câmera frontal e traseira;
* Fotografar uma peça;
* Visualizar a imagem capturada;
* Refazer a fotografia;
* Confirmar o uso da imagem;
* Exibir a foto no formulário;
* Usar a imagem no anúncio publicado;
* Ler o QR Code de uma troca na tela **Escanear QR**.

A funcionalidade foi implementada com o pacote [`expo-camera`](https://docs.expo.dev/versions/latest/sdk/camera/). Na leitura do QR Code, uma trava impede que o mesmo código seja processado várias vezes seguidas.

---

## 🖼️ Anexar imagem

Além da câmera, a foto da peça pode ser anexada de outras formas:

* **Galeria:** o botão **Galeria** abre as fotos do dispositivo com o [`expo-image-picker`](https://docs.expo.dev/versions/latest/sdk/imagepicker/), já com recorte na proporção 4:3 usada nos cards do feed. Na web, abre o seletor de arquivos do computador;
* **Arrastar e soltar (web):** no navegador, basta arrastar uma imagem até a área da foto. A área fica destacada com a mensagem **Solte a imagem para anexar**. Também é possível arrastar outra imagem por cima da atual para substituí-la.

Na web, a imagem é reduzida para no máximo 1200 px antes de ser salva, porque o armazenamento do navegador tem pouco espaço. No celular, a imagem é copiada para a pasta permanente do app, como as fotos da câmera.

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

## 🌐 Consumo de APIs

| API | Para que é usada | Tela |
| --- | --- | --- |
| [Platzi Fake Store API](https://fakeapi.platzi.com/) | Cadastro de usuário, login, perfil e renovação do token (JWT) | Login, Criar conta, Perfil |
| [UI Avatars](https://ui-avatars.com/) | Foto de perfil gerada com as iniciais do nome | Criar conta, Perfil |
| [QR Server](https://goqr.me/api/) | Geração do QR Code de confirmação da troca | Detalhe da troca |
| [Climatiq](https://www.climatiq.io/) | CO₂ evitado ao reaproveitar a peça em vez de produzir uma nova | Detalhe da troca, Perfil |
| [ViaCEP](https://viacep.com.br/) | Preenchimento do bairro e da cidade a partir do CEP | Cadastrar peça |

O cálculo do Climatiq usa o fator `consumer_goods-type_clothing_primary_material_production` (Defra/BEIS) e um peso médio por categoria de peça (`src/services/co2Service.js`). Sem a chave do Climatiq, ou se a API não responder, o app usa o mesmo fator de forma local, e o valor exibido fica igual.

### Configurando a chave do Climatiq

1. Crie uma conta gratuita em [climatiq.io](https://www.climatiq.io/) e gere uma API key;
2. Copie `.env.example` para `.env.local`;
3. Preencha `EXPO_PUBLIC_CLIMATIQ_KEY`;
4. Reinicie o Expo com `npx expo start --clear`.

> Variáveis com o prefixo `EXPO_PUBLIC_` ficam visíveis dentro do app. Para um projeto acadêmico isso é aceitável; em produção, a chamada deveria passar por um backend.

---

## 🔑 Autenticação e sessões

* **Criar conta e Login:** o usuário se cadastra com nome, e-mail e senha, ou entra com uma conta existente. Conta de demonstração: `john@mail.com` / `changeme`;
* **Tokens seguros:** o `access_token` e o `refresh_token` são guardados com o `expo-secure-store` (na web, no Async Storage);
* **Sessão persistente:** ao abrir o app, a sessão salva é restaurada sem pedir login novamente;
* **Renovação automática:** quando a API responde `401`, o app renova o token com o refresh token e repete a requisição. Se a renovação falhar, o usuário volta para o login;
* **Telas protegidas:** Cadastrar peça, Perfil, Solicitar troca, Detalhe da troca e Escanear QR exigem login. Depois de entrar, o usuário volta para onde estava;
* **Logout:** no Perfil, com um modal de confirmação.

---

## ⚡ Caching local

| Item em cache | Onde fica | Validade | Tela |
| --- | --- | --- | --- |
| Perfil do usuário | Async Storage | 24 horas (usa o último salvo se estiver sem internet) | Perfil |
| CO₂ por categoria de peça | Async Storage (`co2:<categoria>`) | 30 dias | Detalhe da troca, Escanear QR |
| Imagem do QR Code da troca | Arquivo no `expo-file-system` | Enquanto a troca existir | Detalhe da troca |
| Endereço por CEP | Async Storage (`cep:<cep>`) | 30 dias | Cadastrar peça |
| Trocas solicitadas e confirmadas | Async Storage (`@reuse:trades`) | Permanente | Perfil, Detalhe da troca |

O cache das respostas fica em `src/services/cache.js`: o dado é salvo com a data, devolvido enquanto estiver dentro da validade e, se a API falhar, o último valor salvo é usado.

---

## 🔁 Fluxo de troca

1. O usuário logado toca em **Solicitar troca** em uma peça;
2. A tela **Detalhe da troca** mostra o QR Code e o CO₂ que a troca evita;
3. No encontro, a outra família toca em **Escanear QR para confirmar** e lê o código;
4. A troca é marcada como confirmada e o CO₂ evitado é somado no **Perfil**.

O QR Code carrega o identificador e os dados da peça, então pode ser lido por outro aparelho mesmo que a troca não esteja salva nele.

---

## 🎨 UI/UX para mobile

O aplicativo foi planejado para proporcionar uma experiência simples, clara e adequada a dispositivos móveis.

Entre as decisões de UI/UX utilizadas estão:

* Botões grandes e fáceis de tocar;
* Hierarquia visual entre títulos, textos e ações;
* Cores diferentes para ações primárias e secundárias;
* Feedback visual durante o salvamento;
* Mensagens de erro, aviso e sucesso em modais com ícone e cor por tipo;
* Validação antes da publicação;
* Pré-visualização da foto antes da confirmação;
* Possibilidade de refazer, trocar ou remover a imagem;
* Destaque visual ao arrastar uma imagem sobre a área da foto (web);
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

## 💬 Modais de aviso

Todos os avisos do app aparecem em modais com o visual do ReUse, iguais no Android, no iOS e na web. Eles são exibidos pela função `showAlert` (`src/utils/showAlert.js`) e pelo componente `AlertHost` (`src/components/AlertHost.jsx`).

| Tipo | Cor | Exemplos |
| --- | --- | --- |
| Sucesso | Verde | Peça cadastrada, troca confirmada |
| Aviso | Rosa | Campos obrigatórios, QR Code inválido |
| Erro | Rosa | Falha de conexão, falha ao salvar, erro da câmera |
| Informação | Azul | Troca já confirmada |

Quando mais de um aviso é disparado, eles aparecem um após o outro. O botão voltar do Android fecha o aviso. A saída da conta tem um modal próprio (`LogoutConfirmModal.jsx`), que mostra o estado **Saindo...** enquanto encerra a sessão.

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
| Câmera e leitura de QR   | `expo-camera`                                                       |
| Galeria de imagens       | `expo-image-picker`                                                 |
| Armazenamento de imagens | `expo-file-system`                                                  |
| Armazenamento seguro     | `expo-secure-store`                                                 |
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
│   │   ├── AlertHost.jsx
│   │   ├── CameraCapture.jsx
│   │   ├── CategoriesSection.jsx
│   │   ├── FiltersBar.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── HowItWorksSection.jsx
│   │   ├── LogoutConfirmModal.jsx
│   │   ├── NavBar.jsx
│   │   ├── NewArrivalsSection.jsx
│   │   ├── NewsletterSection.jsx
│   │   ├── ProductCard.jsx
│   │   ├── SeasonalCollectionsSection.jsx
│   │   ├── TestimonialsSection.jsx
│   │   └── TrustSection.jsx
│   │
│   ├── hooks/
│   │   └── useImageDrop.js
│   │
│   ├── screens/
│   │   ├── CreateProductScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── LoginScreen.jsx
│   │   ├── ProductsFeedScreen.jsx
│   │   ├── ProfileScreen.jsx
│   │   ├── RegisterScreen.jsx
│   │   ├── ScanQrScreen.jsx
│   │   └── TradeDetailScreen.jsx
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── cache.js
│   │   ├── cepService.js
│   │   ├── co2Service.js
│   │   ├── productStorage.js
│   │   └── tradeStorage.js
│   │
│   └── utils/
│       ├── showAlert.js
│       └── webImage.js
│
├── .env.example
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

Configure a chave do Climatiq (opcional; sem ela o CO₂ é estimado localmente):

```bash
cp .env.example .env.local
```

Depois, preencha `EXPO_PUBLIC_CLIMATIQ_KEY` no `.env.local`. Esse arquivo não é enviado ao GitHub.

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

Para testar a câmera e a leitura do QR Code, recomenda-se executar o projeto em um dispositivo físico. Para testar o arrastar e soltar imagem, use a versão web (`w`).

---

## 🔐 Permissões

O aplicativo solicita acesso à câmera para fotografar as peças cadastradas e ler o QR Code das trocas. No iPhone, também pede acesso às fotos para anexar imagens da galeria.

As mensagens de permissão estão configuradas no `app.json`:

```json
{
  "plugins": [
    [
      "expo-camera",
      {
        "cameraPermission": "Permita que o ReUse use a câmera para fotografar as peças cadastradas e ler o QR Code das trocas."
      }
    ],
    "expo-secure-store",
    [
      "expo-image-picker",
      {
        "photosPermission": "Permita que o ReUse acesse suas fotos para anexar imagens das peças."
      }
    ]
  ]
}
```

---

## 🧪 Teste do fluxo principal

Para verificar o funcionamento:

1. Abra o aplicativo;
2. Toque em **Cadastrar peça** e entre na sua conta;
3. Preencha os campos obrigatórios;
4. Toque em **Tirar foto**;
5. Autorize o acesso à câmera;
6. Tire uma foto;
7. Confirme a imagem;
8. Toque em **Publicar peça** e confirme o modal de sucesso;
9. Confirme se a peça aparece no feed;
10. Feche completamente o aplicativo;
11. Abra novamente;
12. Confirme se a peça e a imagem continuam disponíveis.

### Anexar imagem

1. No cadastro de peça, toque em **Galeria** e escolha uma imagem;
2. Recorte a imagem e confirme;
3. Na versão web, arraste uma imagem do computador até a área da foto;
4. Tente publicar sem preencher um campo obrigatório e veja o modal de aviso.

### Login, sessão e troca

1. Toque no ícone de perfil e crie uma conta (ou use `john@mail.com` / `changeme`);
2. Feche e abra o aplicativo: a sessão continua ativa;
3. No cadastro de peça, digite um CEP e veja o bairro preenchido;
4. No feed, toque em **Solicitar troca** e veja o QR Code e o CO₂ evitado;
5. Escaneie o QR Code com outro aparelho (ou abra a versão web no computador e escaneie a tela);
6. Confira no **Perfil** a troca confirmada e o total de CO₂ evitado;
7. Toque em **Sair da conta** e confirme no modal.

---

Feito com 💚 para famílias que acreditam em moda infantil sustentável.
