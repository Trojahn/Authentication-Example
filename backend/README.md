# Back-End

> Back-end utilizado para demonstrar um sistema que se utiliza de autenticação para poder realizar determinadas operações.

### Avisos

Este código é puramente didático e deve ser utilizado apenas como modelo inicial de desenvolvimento.

## 💻 Pré-requisitos

Antes de começar, verifique que sua máquina possua:

- `Node`
- `npm`
- Uma instalação do `mysql`

## 🚀 Instalando

Primeiro, certifique-se de criar o banco de dados `mysql` usando o arquivo **bancoDados.sql** presente nesta pasta.

Segundo, depois de o banco de dados criado, ajuste a função *conecta()* presente no arquivo **banco.js** para refletir os dados da sua instalação do mysql. Atenção especial a porta de conexão (*port*), nome de usuário (*username*) e senha (*password*). 

Terceiro iniciar o back-end, digite os seguintes comandos no terminal/prompt de comando:

```
cd backend/
npm install 
node index.js
```

Quarto, para avaliar se o back-end está operacional, acesse a rota **/usuario** e verifique se houve algum problema no terminal/prompt de comando do backend. Caso negativo, o back-end está funcionando corretamente.

## ☕ Usando

Acesse a url do serviço em execução. Em geral, o endereço `http://localhost:8000/` é geralmente utilizado.

As rotas disponíveis e seus propósitos são:

- GET `/usuario` - Retorna a lista de usuários cadastrados no sistema.
- POST `/usuario` - Cadastra um novo usuário no sistema. Requer **login** e **senha** no corpo da requisição.
- POST `/usuario/login` - Faz o processo de login. Requer **login** e **senha** no corpo da requisição. Retorna um token JWT com validade de 1h para ser enviado no header *Authorization* nas requisições necessárias.
- GET `/mensagem` - Retorna as mensagens cadastradas para o respectivo usuário logado.
- POST `/mensagem` - Cadastra uma nova mensagem para o usuário logado. Requer o parâmetro **texto** enviado no corpo da requisição.

Para que o usuário logado seja reconhecido, o token JWT válido deverá ser enviado no cabeçalho da requisição no campo `Authorization`. Para fins de compatibilidade, pode ser necessário ainda o cabeçalho `Content-Type: application/json`.