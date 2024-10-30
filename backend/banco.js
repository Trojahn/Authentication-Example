const bd = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function conecta() {
    const conexao = await bd.createConnection({
        host: "localhost",
        port: 3306,
        database: "exemplo_autenticacao",
        user: "root",
        password: ""
    });
    return conexao;
}

async function existeLogin(login) {
    let conexao = await conecta();
    let sql = "SELECT COUNT(*) as qtde FROM usuario WHERE login = ?;"
    const [resposta] = await conexao.query(sql, [login]);
    return resposta[0].qtde > 0;
}

async function cadastrarUsuario(login, senha) {
    let hash = await bcrypt.hash(senha, 10);
    let conexao = await conecta();
    let sql = "INSERT INTO usuario(login, senha) VALUES (?, ?);"
    const [resposta] = await conexao.query(sql, [login, hash]);
    return resposta.affectedRows > 0;
}

async function existeId(id) {
    let conexao = await conecta();
    let sql = "SELECT COUNT(*) as qtde FROM usuario WHERE id = ?;"
    const [resposta] = await conexao.query(sql, [id]);
    return resposta[0].qtde > 0;
}

async function fazerLogin(login, senha) {
    let conexao = await conecta();
    let sql = "SELECT * FROM usuario WHERE login = ?;"
    const [resposta] = await conexao.query(sql, [login]);
    
    let sucesso = await bcrypt.compare(senha, resposta[0].senha);
    if(sucesso) {
        // Retorna o ID do usuário logado.
        return {id: resposta[0].id, login: resposta[0].login};
    }
    return false;
}

async function listarMensagens(id) {
    const conexao = await conecta();
    let sql = "SELECT * FROM mensagem WHERE idUsuario = ? ORDER BY data;";
    let [respostas] = await conexao.query(sql, [id]);
    return respostas;
}

async function listarUsuarios() {
    const conexao = await conecta();
    let sql = "SELECT id, login FROM usuario ORDER BY id;";
    let [respostas] = await conexao.query(sql, []);
    return respostas;
}

async function cadastrarMensagem(id, texto) {
    let conexao = await conecta();
    let sql = "INSERT INTO mensagem(idUsuario, texto) VALUES (?, ?);"
    const [resposta] = await conexao.query(sql, [id, texto]);
    return resposta.affectedRows > 0;
}


module.exports = { existeLogin, cadastrarUsuario, listarUsuarios, fazerLogin, existeId, cadastrarMensagem, listarMensagens }