const express = require("express");
const bodyparser = require("body-parser");
const cors = require('cors');
const jwt = require("jsonwebtoken");

const corsOptions = {
    origin: '*', // Permite todas as origens
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};
const senhaTokenJWT = "senhaSecretissimaIFSP";
const banco = require("./banco.js");
const app = express();

app.use(cors(corsOptions));
app.use("/", bodyparser.json());

// Função middleware que recebe o token do usuário, verifica se é válido e de um usuário permitido. Se der erro, bloqueia a requisição.
function verificarToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send({ msg: "Token inválido" });
    }

    jwt.verify(token, senhaTokenJWT, (err, decoded) => {
        if (err) {
            return res.status(403).send({ msg: "Token inválido" });
        }
        // Token parece válido, mas será que o usuário ainda existe???
        let existe = banco.existeId(decoded.data);
        if (!existe) {
            // O usuário não existe mais no banco. Nega o acesso.
            return res.status(403).send({ msg: "Token inválido" });
        }
        // Tudo certo... Coloca em req.user o ID do usuário logado.
        req.user = decoded.data;
        next();
    });
}

// Retorna a lista de mensagens do usuário. Deve estar logado para acessar.
app.get("/mensagem", verificarToken, async (req, res) => {
    let mensagens = await banco.listarMensagens(req.user);
    res.status(200).send(mensagens);
});

// Cadastra uma nova mensagem. Deve estar logado para acessar.
app.post("/mensagem", verificarToken, async (req, res) => {
    if (!req.body.texto) {
        return res.status(400).send({ msg: "Texto não encontrado" });
    }
    let resultado = await banco.cadastrarMensagem(req.user, req.body.texto);
    if (!resultado) {
        return res.status(500).send({ msg: "Erro ao cadastrar mensagem" });
    }
    res.status(200).send({ msg: "Mensagem cadastrada com sucesso!" });
});

// Lista os usuários do sistema.
app.get("/usuario", async (req, res) => {
    let usuarios = await banco.listarUsuarios();
    res.status(200).send(usuarios);
});

// Adiciona um novo usuário ao sistema. Requer "login" e "senha" no corpo da requisição.
app.post("/usuario", async (req, res) => {
    if (!req.body.login || !req.body.senha) {
        return res.status(404).send({ msg: "Login ou senha não encontrados" });
    }
    let existe = await banco.existeLogin(req.body.login);
    if (existe) {
        return res.status(400).send({ msg: "Login já existe" });
    }

    let sucesso = await banco.cadastrarUsuario(req.body.login, req.body.senha);
    if (!sucesso) {
        return res.status(500).send({ msg: "Houve problemas no cadastro de usuário" });
    }
    res.status(201).send({ msg: "Usuário cadastrado com sucesso!" });
});

// Realiza o processo de autenticação. Requer "login" e "senha" no corpo da requisição.
app.post("/usuario/login", async (req, res) => {
    if (!req.body.login || !req.body.senha) {
        return res.status(404).send({ msg: "Login ou senha não encontrados" });
    }
    let existe = await banco.existeLogin(req.body.login);
    if (!existe) {
        return res.status(400).send({ msg: "Login inválido" });
    }
    let resultado = await banco.fazerLogin(req.body.login, req.body.senha);
    if (resultado) {
        // Login bem sucedido. Cria o token JWT e retorna ao usuário.
        let jwtAssinado = await jwt.sign({ data: resultado.id }, senhaTokenJWT, { expiresIn: "60m", subject: resultado.login });
        return res.status(200).send({ msg: "Login realizado com sucesso", token: jwtAssinado, id: resultado.id });
    }
    res.status(400).send({ msg: "Login ou senha inválidos" });
});

app.listen(8000, () => {
    console.log("Executando na porta 8000");
});