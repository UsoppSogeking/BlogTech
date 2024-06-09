# Blogtech

**Blogtech** é uma plataforma de blog onde os usuários podem criar contas, postar conteúdos, comentar em posts e dar likes. Além disso, é possível seguir outros usuários, visualizar perfis e gerenciar postagens favoritas.

## Funcionalidades

- **Criação de contas:** Usuários podem se registrar e fazer login para acessar todas as funcionalidades.
- **Postagem de conteúdos:** Usuários autenticados podem criar e publicar posts.
- **Edição e exclusão de posts:** Usuários podem editar e excluir seus próprios posts.
- **Comentários e likes:** É possível comentar em posts e dar likes.
- **Edição e exclusão de comentários:** Usuários podem editar e excluir seus próprios comentários.
- **Perfis de usuário:** Clicando no nome ou foto do criador do post, o usuário é redirecionado para a página de perfil do criador.
- **Seguir usuários:** Na página de perfil, é possível seguir outros usuários.
- **Posts favoritados:** Visualização de posts favoritados em uma página dedicada.
- **Página Home:** Listagem de todos os posts de todos os usuários.

## Motivação

Durante meus estudos de programação, percebi a importância de criar projetos do zero para realmente aprender. Professores e programadores experientes sempre enfatizam que a melhor forma de aprender a programar é através da prática e desenvolvimento de projetos próprios.

Iniciar meu próprio projeto foi um desafio completamente diferente de seguir as aulas de um curso. Enfrentei muitos obstáculos, desde decidir por onde começar até resolver erros que surgiam durante o desenvolvimento. Funcionalidades que pareciam simples acabaram se tornando complicadas e vice-versa. No entanto, essa experiência me proporcionou um aprendizado inestimável e me deixou muito satisfeito com o resultado final.

Foram 6-7 semanas de desenvolvimento intenso, mas o conhecimento adquirido foi imensurável.

## Tecnologias Utilizadas

- **Frontend:**
  - React
  - JavaScript
  - HTML
  - CSS

- **Bibliotecas:**
  - Bootstrap
  - data-fns
  - react-bootstrap
  - react-router-dom
  - react-markdown

- **Backend:**
  - Firebase Firestore

## Instalação

1. Clone o repositório:
    ```sh
    git clone https://github.com/seu-usuario/blogtech.git
    ```

2. Navegue até o diretório do projeto:
    ```sh
    cd blogtech
    ```

3. Instale as dependências:
    ```sh
    npm install
    ```

4. Crie um arquivo `.env` na raiz do projeto com suas configurações do Firebase Firestore:
    ```env
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    ```

5. Inicie o servidor de desenvolvimento:
    ```sh
    npm run dev
    ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
