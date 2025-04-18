
# PUCRS - Pós Graduação em Desenvolvimento Full Stack - Projeto de conclusão de curso

# TCC - Sistema de Pedidos para Restaurantes e Bares

## 📌 Visão Geral
O projeto é um sistema para gerenciamento de pedidos em restaurantes e bares, substituindo as tradicionais comandas de papel. O sistema facilita a comunicação entre garçons e a cozinha, otimizando o atendimento e melhorando a organização dos pedidos.

## 🚀 Tecnologias Utilizadas
### **Backend**
- **Linguagem:** TypeScript
- **Framework:** NestJS
- **Banco de Dados:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Autenticação:** JWT
- **Comunicação em Tempo Real:** WebSockets (Socket.io)
- **Upload de Imagens:** Imgur
- **Processamento de Upload:** Multer
- **Requisições HTTP:** Axios (para interagir com APIs externas)
- **Validação de Dados:** Zod
- **Testes:** Jest
- **DevOps:** Docker, GitHub Actions
- **Hospedagem:** Fly.io
- **Documentação da API:** Swagger

### **Frontend (Versão Web - Administração)**
- **Linguagem:** TypeScript
- **Framework:** Next.js
- **Estilização:** Tailwind CSS
- **Gerenciamento de Estado:** Zustand
- **Autenticação:** JWT
- **Requisições HTTP:** Axios
- **Componentização:** Storybook
- **Tela de Login:** Implementada para que apenas administradores cadastrados possam acessar o sistema
- **Hospedagem:** Vercel

### **Mobile (Versão para Garçom)**
- **Linguagem:** TypeScript
- **Framework:** React Native
- **Navegação:** React Navigation
- **Gerenciamento de Estado:** Zustand
- **Autenticação:** JWT
- **Tela de Login:** Implementada para que apenas garçons cadastrados possam acessar o sistema
- **Comunicação em Tempo Real:** WebSockets
- **Notificações Push:** Expo Notifications (FCM)
- **Distribuição:** Arquivo APK no site

## 🛠️ Como Rodar o Projeto
### **Pré-requisitos**
- Node.js instalado (versão recomendada: LTS)
- PostgreSQL configurado
- Docker instalado (opcional, mas recomendado para ambiente de desenvolvimento)

### **Passos para Rodar o Backend**
```sh
# Clone o repositório
git clone https://github.com/seu-usuario/tcc.git
cd tcc/backend

# Instale as dependências
yarn install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrações do banco de dados
npx prisma migrate dev

# Inicie o servidor
yarn start:dev
```

### **Passos para Rodar o Frontend (Administração)**
```sh
cd ../frontend

# Instale as dependências
yarn install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor local
yarn dev
```

### **Passos para Rodar o Mobile (Garçom)**
```sh
cd ../mobile

# Instale as dependências
yarn install

# Inicie o Expo
yarn start
```

## 📡 Principais Endpoints da API
| Método | Endpoint     | Descrição                                   |
| ------ | ------------ | ------------------------------------------- |
| POST   | /auth/signup | Criação de conta do administrador (empresa) |
| POST   | /auth/login  | Autenticação do usuário                     |
| POST   | /waiters     | Cadastro de garçons pela empresa            |
| GET    | /orders      | Listagem de pedidos                         |
| POST   | /orders      | Criação de um novo pedido                   |
| PATCH  | /orders/:id  | Atualização do status do pedido             |
| DELETE | /orders/:id  | Exclusão de um pedido                       |  |

## 📌 Fluxo do Sistema
1. O administrador cadastra a empresa e a empresa cadastra os garçons na versão web para que possam acessar o sistema.
2. O garçom utiliza o aplicativo mobile para registrar os pedidos dos clientes.
3. Os garçons devem fazer login no aplicativo para acessar o sistema.
4. Os pedidos são enviados para o backend e armazenados no banco de dados.
5. O dono do estabelecimento acessa a versão web para visualizar e preparar os pedidos.
6. A cozinha recebe as informações em tempo real via WebSockets.
7. O status do pedido pode ser atualizado para "Em preparo" ou "Finalizado".
8. O garçom recebe notificações sobre a conclusão do pedido e o entrega ao cliente.

## 🎯 Contribuição
Se deseja contribuir para o projeto, siga os seguintes passos:
1. Faça um fork do repositório.
2. Crie uma nova branch (`git checkout -b minha-feature`).
3. Commit suas mudanças (`git commit -m 'Adicionando nova feature'`).
4. Faça push da branch (`git push origin minha-feature`).
5. Abra um Pull Request.

## 📄 Licença
Este projeto está sob a licença GPL-3.0. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato
- Email: anapaulaferreiradev@gmail.com
- LinkedIn: [linkedin.com/in/ana-ferreira](https://linkedin.com/in/ana-ferreira)

---

