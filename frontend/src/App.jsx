import { useState } from "react";
import FormLogin from "./FormLogin";
import FormCadastrar from "./FormCadastrar";
import Mensagens from "./Mensagens";

function App() {
  const [token, setToken] = useState(null);

  // Esta função é chamada quando o login foi realizado com sucesso e o token é recebido do backend. Nesse caso, armazena o token com useState.
  function loginRealizado(json) {
    console.log(json);
    setToken(json.token);
  }

  let page;
  if (!token) {
    page = (
      // Usuário não está logado.
      <>
        <div className="columns my-5">
          <div className="column is-2"></div>
          <div className="column is-3">
            <FormLogin retornar={loginRealizado}></FormLogin>
          </div>
          <div className="column is-1"></div>

          <div className="column is-1"></div>
          <div className="column is-3">
            <FormCadastrar></FormCadastrar>
          </div>
          <div className="column is-2"></div>
        </div>
      </>
    );
  } else {
    // Usuário está logado!
    page = (
      <>
        <div className="columns my-5">
          <div className="column is-4"></div>
          <div className="column">
            <Mensagens token={token}></Mensagens>
          </div>
          <div className="column is-4"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <header>
        <section className="hero is-success">
          <div className="hero-body">
            <p className="title">EXEMPLO</p>
            <p className="subtitle">Exemplo de sistema de autenticação</p>
          </div>
        </section>
      </header>
      <main>{page}</main>
    </>
  );
}

export default App;
