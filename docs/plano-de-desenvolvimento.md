
## 🔄 Plano de Desenvolvimento e Ciclo de Vida

Este documento descreve o plano de desenvolvimento da aplicação, contemplando a metodologia adotada, as etapas do ciclo de vida do software, o controle de versões, os processos de validação e as estratégias de deploy.

----------

### 🧭 Metodologia Adotada

A metodologia escolhida para o desenvolvimento deste projeto foi baseada nos princípios ágeis, adaptando práticas do **Scrum** para a realidade de um projeto individual. Essa escolha visa proporcionar entregas incrementais, revisões constantes e facilidade de adaptação ao longo do desenvolvimento.

-   **Planejamento Inicial**: Definição de escopo, levantamento de requisitos e tecnologias.
    
-   **Iterações Semanais**: Organização das tarefas em ciclos curtos, com metas definidas.
    
-   **Revisões Contínuas**: Avaliação constante das funcionalidades desenvolvidas.
    
-   **Documentação Paralela**: Atualização contínua do repositório e documentação técnica.
    

----------

### 🧩 Etapas de Desenvolvimento

O projeto foi dividido em etapas para facilitar o controle e a entrega progressiva das funcionalidades:

1.  **Configuração do Ambiente de Desenvolvimento**
    
    -   Criação de repositórios
        
    -   Configuração do backend (NestJS) e frontend (Next.js)
        
2.  **Modelagem e Banco de Dados**
    
    -   Modelagem conceitual e relacional
        
    -   Criação do schema no Prisma
        
3.  **Desenvolvimento da API**
    
    -   Implementação dos módulos de autenticação, produtos, categorias, pedidos e usuários
        
    -   Testes de rotas e validações com Postman
        
4.  **Interface do Administrador (Web)**
    
    -   Construção das páginas com Next.js + Tailwind CSS
        
    -   Integração com API utilizando Axios
        
    -   Gerenciamento de estado com Zustand
        
5.  **Aplicativo do Garçom (Mobile)**
    
    -   Interface com React Native
        
    -   Autenticação e listagem de produtos
        
    -   Integração com WebSocket para atualização em tempo real
        
6.  **Comunicação em Tempo Real**
    
    -   Implementação com **Socket.io** para pedidos e status
        
7.  **Hospedagem e Deploy**
    
    -   Backend: Render
        
    -   Frontend: Vercel
        
    -   Banco de dados: Neon
        
    -   Imagens: Cloudinary
        

----------

### 🗂️ Controle de Versões

O controle de versões foi realizado com **Git**, utilizando boas práticas de versionamento semântico:

-   `feat:` para novas funcionalidades
    
-   `fix:` para correções de bugs
    
-   `chore:` para ajustes de configuração ou estrutura
    
-   `docs:` para mudanças em documentação
    

O projeto foi dividido em branches específicas para desenvolvimento (`frontend`, `backend`, `main`), facilitando o isolamento de features e o processo de revisão.

----------

### ✅ Validação

Foram realizadas as seguintes validações ao longo do desenvolvimento:

-   Testes manuais com Postman e interface
    
-   Simulação de fluxos completos (cadastro, login, pedidos)
    
-   Validação de regras de negócio no backend
    

----------

### 🚀 Deploy

O deploy foi planejado com foco em acessibilidade e baixo custo:

-   **Backend (NestJS)**: hospedado na plataforma Render
    
-   **Frontend (Next.js)**: hospedado na Vercel com deploy automático via GitHub
    
-   **Banco de dados (PostgreSQL)**: Neon, com conexão segura
    
-   **Imagens**: Armazenadas na nuvem com Cloudinary para garantir disponibilidade e desempenho
    
-   **CI/CD**: Configuração de workflows com GitHub Actions para testes e deploy automatizados