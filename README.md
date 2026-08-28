# 🌿 ReUse — Roupas Infantis

App mobile para **troca de roupas infantis (0 a 13 anos) entre famílias**, de forma sustentável, segura e **sem nenhum pagamento envolvido**.

---

## 🎯 Objetivo

Crianças crescem rápido e roupas boas acabam esquecidas no armário. O **ReUse** conecta famílias para que essas peças ganhem uma nova vida através da troca direta — sem dinheiro no meio do processo. A proposta é reduzir o descarte de roupas infantis, incentivar o consumo consciente e criar uma comunidade de confiança entre pais e responsáveis, com perfis verificados, avaliações reais e histórico de conversas dentro do próprio app.

---

## 🎨 Paleta de cores

| Nome | Hex | Uso principal |
|---|---|---|
| `pink.base` | `#ffc0cb` | Detalhes decorativos |
| `pink.medium` | `#f48199` | Texto de destaque, labels |
| `pink.dark` | `#e05578` | Botões primários, CTAs, ícones ativos |
| `pink.light` | `#ffdae9` | Fundos de seção, badges |
| `pink.xlight` | `#fff5f8` | Fundos suaves |
| `blue.base` | `#89cff0` | Detalhes decorativos |
| `blue.medium` | `#5ba8d4` | Seção de confiança/segurança |
| `blue.dark` | `#2d82b7` | Botões secundários, links |
| `blue.light` | `#b9d9eb` | Fundos de seção, badges |
| `blue.xlight` | `#eaf5fb` | Fundos suaves |
| `mint.base` | `#ace1af` | Detalhes decorativos |
| `mint.medium` | `#6db571` | Ícones, destaques (sustentabilidade) |
| `mint.dark` | `#3d8b42` | Selos de "verificado" |
| `mint.light` | `#d0f0c0` | Fundos de seção, badges |
| `mint.xlight` | `#edf7ed` | Fundos suaves |
| `cream` | `#fdf8f0` | Fundo padrão do app |
| `offwhite` | `#fafafa` | Fundo de inputs/campos |
| `ink.dark` | `#212121` | Texto principal, footer |
| `ink.mid` | `#555555` | Texto secundário |
| `ink.light` | `#888888` | Texto auxiliar, ícones neutros |
| `neutralIcon` | `#f1f1f1` | Fundos neutros |
| `neutralDivider` | `#e0e0e0` | Bordas e divisores |
| `softBorder` | `#f0e8ee` | Bordas suaves |

A paleta é centralizada em `tailwind.config.js`, então todas as cores acima estão disponíveis como classes utilitárias do NativeWind (ex: `bg-pink-dark`, `text-ink-mid`, `border-neutralDivider`).

**Tipografia:**
- **Montserrat** (`Bold` / `SemiBold`) → títulos e destaques (`font-heading`, `font-headingMedium`)
- **Hind Madurai** (`Regular` / `Medium` / `SemiBold`) → textos e corpo (`font-body`, `font-bodyMedium`, `font-bodySemibold`)

---

## 🛠️ Solução técnica

| Camada | Tecnologia |
|---|---|
| Framework | [Expo](https://expo.dev) `~57` + React Native `0.86` |
| Linguagem | TypeScript |
| Estilização | [NativeWind](https://www.nativewind.dev) (Tailwind CSS para React Native) |
| Ícones | `@expo/vector-icons` (Ionicons) |
| Fontes | `@expo-google-fonts/montserrat` + `@expo-google-fonts/hind-madurai` |
| Gradientes | `expo-linear-gradient` |
| Safe area | `react-native-safe-area-context` |
| Multiplataforma | iOS, Android e Web a partir da mesma base de código |

O projeto foi construído componente a componente, com cada seção da Home isolada em seu próprio arquivo dentro de `src/components`, o que facilita manutenção, testes visuais e reuso.

---

## 📁 Estrutura de pastas

```
reuse-app/
├── assets/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── NavBar.tsx                  # Barra de navegação (logo, menu, busca, usuário, carrinho)
│   │   ├── FiltersBar.tsx              # Chips de filtro (idade, estação, novidades)
│   │   ├── HeroSection.tsx             # Cabeçalho principal com CTA
│   │   ├── HowItWorksSection.tsx       # "Como funciona a troca?"
│   │   ├── CategoriesSection.tsx       # Grade de categorias
│   │   ├── SeasonalCollectionsSection.tsx  # Coleções por estação
│   │   ├── NewArrivalsSection.tsx      # Novas chegadas + filtros
│   │   ├── ProductCard.tsx             # Card de peça reutilizável
│   │   ├── TrustSection.tsx            # "Comunidade verificada pelos pais"
│   │   ├── TestimonialsSection.tsx     # Depoimentos ("Amadas pelos pais")
│   │   ├── NewsletterSection.tsx       # Cadastro de e-mail
│   │   └── Footer.tsx                  # Rodapé
│   └── screens/
│       └── HomeScreen.tsx              # Composição da tela inicial
├── App.tsx                             # Carregamento de fontes + splash screen
├── tailwind.config.js                  # Paleta de cores e tipografia
└── package.json
```

---

## 🚀 Como rodar o projeto

```bash
# instalar dependências
npm install

# iniciar o servidor de desenvolvimento
npx expo start
```

A partir daí você pode abrir o app:
- **No celular**: escaneando o QR code com o app **Expo Go**
- **No navegador**: pressionando `w` no terminal (ou `npx expo start --web`)
- **Em um emulador**: pressionando `i` (iOS) ou `a` (Android)

---

## ✨ Próximos passos

- Telas de detalhe de peça, chat e perfil
- Integração com backend/autenticação real
- Fluxo completo de solicitação e confirmação de troca

---

Feito com 💚 para famílias que acreditam em moda infantil sustentável.