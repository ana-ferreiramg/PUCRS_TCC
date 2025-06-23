
# ✅ Testes Unitários e Integração Contínua (CI/CD)

## 🧪 Testes Unitários

O projeto utiliza testes unitários para garantir a confiabilidade das regras de negócio e o correto funcionamento dos serviços e controladores.

### 🛠️ Ferramentas Utilizadas

- **Jest**: Framework de testes para aplicações TypeScript/JavaScript.
- **Mocks**: Utilizados para simular dependências externas (banco de dados, serviços externos).

### 📌 Objetivos dos Testes

- Garantir que as regras de negócio sejam aplicadas corretamente.
- Validar os serviços e controladores de forma isolada.
- Assegurar que erros sejam tratados com clareza (ex: duplicidade, não encontrado).
- Cobrir os principais fluxos de uso e exceções.



### 🚀 Executando os Testes

    yarn test

## 🔁 Integração Contínua com GitHub Actions

A aplicação utiliza **GitHub Actions** para validar o código automaticamente a cada `push` ou `pull request`.

### ⚙️ Funcionalidades da CI

-   Instalação de dependências com `yarn`.
    
-   Execução de testes unitários com `yarn test`.
    
-   Validação de formatação com `prettier`.
    
-   Análise de código com `eslint`.

### ✅ Resultado

-   A cada alteração enviada ao repositório, o GitHub verifica automaticamente se o projeto continua íntegro.
    
-   Em caso de falha, o `merge` para `main` pode ser bloqueado, garantindo mais segurança e qualidade no desenvolvimento.
    

----------

## 📌 Conclusão

Com a aplicação dos testes unitários e a automação da validação via GitHub Actions, o projeto garante:

-   Maior **qualidade de código**.
    
-   **Menor risco** de introdução de bugs.
    
-   Mais **segurança para realizar alterações** e evoluções futuras no sistema.