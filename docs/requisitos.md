
# 📄 Documento de Requisitos — Sistema de Pedidos Digital

Este documento tem como objetivo apresentar os **requisitos funcionais e não funcionais** da aplicação desenvolvida como Trabalho de Conclusão de Curso. A solução proposta busca modernizar o atendimento em estabelecimentos alimentícios, como bares e lanchonetes, permitindo que garçons realizem pedidos via aplicativo mobile e que o administrador tenha controle total via painel web.

----------

## 📌 1. Definição do Escopo

A aplicação será composta por:

-   **Aplicativo Mobile (Garçom):** utilizado para realizar pedidos diretamente da mesa do cliente.
    
-   **Sistema Web (Administrador):** utilizado para cadastro de produtos, controle de pedidos, visualização de estatísticas e gerenciamento da operação.
    
-   **API (Backend):** responsável por armazenar, validar e prover os dados de forma segura e escalável.
    

A proposta **não inclui** módulos de pagamento integrado nem controle de estoque detalhado.

----------

## 👥 2. Necessidades dos Usuários

### Administrador

-   Gerenciar produtos, categorias e preços.
    
-   Visualizar pedidos em tempo real.
    
-   Controlar o status dos pedidos (ex: pendente, em preparo, finalizado).
    
-   Cadastrar usuários (garçons).
    

### Garçom

-   Visualizar produtos disponíveis organizados por categoria.
    
-   Criar e enviar pedidos com múltiplos itens.
    
-   Acompanhar o status dos pedidos realizados.
    

----------

## ✅ 3. Requisitos Funcionais (RF)

 - O sistema deve permitir o cadastro de categorias e produtos.
 
 - O sistema deve permitir que apenas administradores acessem o painel de administração.
 
 - O sistema deve permitir que garçons façam login no aplicativo mobile. 
 
 - O sistema deve permitir que garçons visualizem produtos por categoria. 
 
 - O sistema deve permitir a criação de pedidos com múltiplos itens. 
 
 - O sistema deve permitir que os pedidos criados sejam enviados para a cozinha em tempo real. 
 
 - O sistema deve atualizar o status dos pedidos em tempo real. 
 
 - O administrador deve poder alterar o status de um pedido.
 
 - O sistema deve registrar a data e hora de criação de cada pedido.

----------

## ⚙️ 4. Requisitos Não Funcionais (RNF)

 - A aplicação deve ser acessível via dispositivos móveis e desktops.
   
 - A aplicação deve ser desenvolvida utilizando a linguagem TypeScript.
   
 - A aplicação deve utilizar autenticação baseada em JWT.
   
 - O backend deve ser implementado utilizando NestJS.
   
 - O frontend web deve ser construído com Next.js e Tailwind CSS.
    
 - O aplicativo mobile deve ser construído com React Native.
    
 - A comunicação em tempo real deve ser feita via Socket.io.
   
 - As imagens dos produtos devem ser armazenadas em um serviço em nuvem
   (Cloudinary).
   
 - A aplicação deve ser hospedada em serviços gratuitos com suporte a
   CI/CD.

----------

## 🎯 5. Critérios de Aceitação

-   Todos os requisitos funcionais descritos devem ser atendidos e testados.
    
-   A aplicação deve funcionar em produção com desempenho aceitável.
     
-   Todos os endpoints protegidos devem exigir autenticação.