
## 🚀 Tecnologias Utilizadas

- **NestJS** – Framework para Node.js com suporte a TypeScript e arquitetura modular.
- **Prisma** – ORM para integração com banco PostgreSQL (Neon).
- **JWT** – Autenticação segura baseada em tokens.
- **Cloudinary** – Armazenamento de imagens em nuvem.
- **Socket.io** – Comunicação em tempo real entre app mobile e backend.
- **Docker** – Banco de dados local em container PostgreSQL.
- **ESLint + Prettier** – Padronização e qualidade de código.
- **GitHub Actions** – Integração contínua com testes automáticos.

---

## 📦 Instalação

    # Clonar o repositório
    git clone https://github.com/ana-ferreiramg/PUCRS_TCC.git

    # Acessar a pasta do backend
    cd api

    # Instalar as dependências
    yarn install

## 🔧 Configuração

Crie um arquivo `.env` na raiz da pasta `api` com as seguintes variáveis:

    .env
    DATABASE_URL=postgresql://usuario:senha@localhost:5432/db
    JWT_SECRET=uma_chave_secreta
    JWT_EXPIRATION=86400
    FRONTEND_URL=http://localhost:3000
    WS_ORIGIN=ws://localhost:3001
    CLOUDINARY_API_URL=https://api.cloudinary.com/v1_1/seu-cloud-name
    CLOUDINARY_CLOUD_NAME=seu-cloud-name
    CLOUDINARY_API_KEY=sua-api-key
    CLOUDINARY_API_SECRET=sua-api-secret
    CLOUDINARY_UPLOAD_PRESET=seu-preset
## 🔁 CI/CD

Este projeto possui integração contínua com GitHub Actions:

-   Lint com ESLint

-   Formatação com Prettier

-   Execução de testes automatizados

## 🛑 Problema com Sleep da Render

Nos planos gratuitos da **Render**, os serviços inativos por alguns minutos entram em modo _sleep_, resultando em lentidão no primeiro acesso após certo tempo.

### 🛠️ Solução adotada: [UptimeRobot](https://uptimerobot.com)

Foi configurado um monitor de uptime gratuito no [UptimeRobot.com](https://uptimerobot.com), que realiza requisições periódicas à URL pública da API (a cada 12 minutos), impedindo que o servidor entre em modo _sleep_.

📌 Isso garante que:

-   A API esteja **sempre ativa e responsiva**.

-   O tempo de resposta no primeiro acesso do dia seja mínimo.

## ☁️ Deploy

-   **Render**: backend publicado com CI/CD pelo GitHub Actions

-   **Neon**: banco de dados PostgreSQL gratuito e escalável

-   **Cloudinary**: armazenamento e manipulação de imagens
