# 📝 Fiap Tech Blog - Mobile

  

Este repositório contém o projeto Front-end Challenge da pós Tech Fiap+Alura.

  

Foi desenvolvido em React-Native. Abaixo, você encontrará um guia passo a passo para abrir o projeto em seu ambiente local.

  

***

  

## 🛠️ Pré-requisitos

  

Antes será necessário:

  

:white_check_mark: Instalar o [Expo Go](https://expo.dev/go);


:white_check_mark: Recomendado ter o emulador instalado no seu computador. Sugestões: [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/) para Android e/ou [Xcode](https://developer.apple.com/xcode/) para IOS;

  
:white_check_mark: Iniciar o MySQL: dentro do MySQL e criar um Schema com o nome fiap (CREATE DATABASE fiap;), assim que rodar o projeto back-end as tabelas serão criadas automaticamente;

  

:white_check_mark: Clonar e rodar o projeto da parte do back-end. É necessário para fazer toda a integração/requisições dos posts.

  

Para isso acesse o projeto back-end no link [Projeto Back-end: Fiap Tech Blog](https://github.com/oPedroFlores/fiap-project.git) ou se preferir no terminal digite o seguinte comando:

  

```bash

git  clone  https://github.com/oPedroFlores/fiap-project.git

```

  

***

## 💡 Executando o Projeto

  

### Passo :one:: Clonar o repositório

  

Clone este repositório para sua máquina local. Para clonar, clique no botão "Clone" acima ou no terminal execute o seguinte comando:

  

```bash

git  clone  https://github.com/DanielSoutoS/Blog-Fiap-Mobile

```

  

Isso criará uma cópia local do repositório em seu ambiente.

<br>

<br>

### Passo :two:: Instalar o projeto

  

Abra o projeto no terminal e digite o comando:

  

```bash

npm  install

```

Espere toda a instalação completar

<br>

<br>

### Passo :three:: Rodar o projeto

  

Ainda no terminal digite o comando:

  

```bash

npx expo start

```

  

Assim o projeto será exibido no seu navegador no endereço [http://localhost:8081](http://localhost:8081). É possível acessá-lo também clicando (control + click) no link ao lado, disponível também no terminal do front-end.

  

Antes de prosseguir, certifique-se de que o back-end esteja rodando corretamente, bem como as etapas indicadas na seção Pré-Requisitos.

<br>

<br>

### Passo :four:: Cadastrar um usuário

  

Ao abrir o projeto no seu navegador no endereço [http://localhost:3000](http://localhost:3000)

  

Crie o usuário, senha e confirme a senha.

<br>

<br>

### Passo :five:: Alterar o papel (role) do usuário criado para "professor"

  

Logar com o usuário admin:

- e-mail: admin@gmail.com

- password: admin

  

Navegar à página "Admin", disponível apenas para usuários administradores (com a role igual a "admin") e alterar a role.

  

Com esta alteração, será possível realizar o cadastro de Posts!

<br>

<br>

### Passo :six:: Cadastrar um Post

  

Ao retornar ao endereço [http://localhost:3000](http://localhost:3000) será possível visualizar, bem como acessar a tab 'Cadastrar Post'

- Crie um título (Title) bem como um corpo de texto (Body)

- Clique em 'Create Post'

  

Você verá a mensagem "Post criado com sucesso!"

<br>

<br>

### Passo :seven:: Verificar todos os posts

  

Você poderá verificar o Post criado, bem como os demais ao retornar à tab "Home"

- Clique na tab 'Home'. Nela é possível visualizar os posts com menor número de caracteres.

- Para visualizar os posts com maior volume de caracteres clique em "Leia mais" no componente do post em questão

  

É possível visualizar até 10 posts por página. Ao criar o 11º post, poderemos encontrar o post mais antigo na 2ª página. Para visualizá-lo:

- Clique em "Próxima" para navegar até a próxima página.

  

<br>

<br>

### Passo :eight:: Explore a tab de detalhes do post

  

Nesta página é possível engajar com o Post, bem como realizar comentários. Os usuários com o perfil (role) igual a "professor" poderão apagar comentários. Quando aplicável

  

Reaja clicando nos botões referentes à sua intenção e/ou apague posts que sejam pertinentes

  

<br>

<br>

### Passo :nine:: Explore a busca de posts

  

Clique na barra de navegação, digite o texto (header ou body) desejado para buscar um post específico e clique em "pesquisar"

  

Observe que a aplicação filtrará os dados com base na busca realizada.

  

<br>

<br>

### Passo :keycap_ten:: Explore a paginação

  

É possível visualizar até 10 posts por página. Ao cirar o 11º post, poderemos encontrar o post mais antigo na 2ª página. Para visualizá-lo:

  

Clique em "Próxima" para navegar até a próxima página.

  

É possível visualizar até 10 posts por página. Ao cirar o 11º post, poderemos encontrar o post mais antigo na 2ª página. Para visualizá-lo:

  

Clique em "Próxima" para navegar até a próxima página.

***
## 🔒 Permissões de Usuários
Por padrão, o sistema cria um usuário admin com permissão "master" para gerenciar todos os posts e usuários. Existem quatro cenários de permissão para os usuários:

  

### Usuário não cadastrado
:x: Criar posts <br>
:x: Interagir com posts ou comentários <br>
:x: Reagir aos posts <br>
:white_check_mark: Ler posts <br>

### Aluno
:x: Criar posts <br>
:white_check_mark: Reagir aos posts <br>
:white_check_mark: Criar e excluir seus próprios comentários <br>

### Professor
:white_check_mark: Criar, editar e excluir seus próprios posts <br>
:white_check_mark: Interagir com posts e criar/excluir seus próprios comentários <br>
:white_check_mark: Acesso à aba "Criar Post" <br>

### Admin
:white_check_mark: Interagir com posts e comentários <br>
:white_check_mark: Acesso à aba "Criar Post" <br>
:white_check_mark: Criar, editar e excluir todos os posts <br>
:white_check_mark: Acesso à aba "Admin" <br>
:white_check_mark: Redefinir Nome, E-mail, Senha e Role de todos os usuários <br>
