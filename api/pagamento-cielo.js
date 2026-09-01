const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx-MNgoT6LdavOZ9CiY4MnoBAYWab8KUnQAQVdGggbZOXaKkqOa4FpTVwhurwIGgp1aHQ/exec";

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "GET") {
    res.status(405).json({ ok: false, erro: "Método não permitido." });
    return;
  }

  const ref = String(req.query.ref || "").trim();

  if (!ref) {
    res.status(400).json({ ok: false, erro: "Referência da reserva não informada." });
    return;
  }

  if (ref.length > 120) {
    res.status(400).json({ ok: false, erro: "Referência da reserva inválida." });
    return;
  }

  const callback = "ponteCielo";
  const destino =
    APPS_SCRIPT_URL +
    "?acao=link_cielo_jsonp" +
    "&ref=" + encodeURIComponent(ref) +
    "&callback=" + callback +
    "&_=" + Date.now();

  try {
    const resposta = await fetch(destino, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "text/javascript,text/plain;q=0.9,*/*;q=0.8"
      }
    });

    const texto = await resposta.text();

    if (!resposta.ok) {
      throw new Error("O serviço de reservas respondeu com status " + resposta.status + ".");
    }

    const prefixo = callback + "(";
    const inicio = texto.indexOf(prefixo);
    const fim = texto.lastIndexOf(");");

    if (inicio < 0 || fim < 0 || fim <= inicio + prefixo.length) {
      console.error("Resposta inesperada do Apps Script:", texto.slice(0, 500));
      throw new Error("Resposta inesperada do serviço de reservas.");
    }

    const jsonTexto = texto.slice(inicio + prefixo.length, fim);
    const dados = JSON.parse(jsonTexto);

    if (!dados || dados.ok !== true || !dados.url) {
      res.status(400).json({
        ok: false,
        erro: (dados && dados.erro) || "Não foi possível gerar o link de pagamento."
      });
      return;
    }

    let url;
    try {
      url = new URL(String(dados.url));
    } catch (e) {
      throw new Error("A Cielo retornou um endereço de pagamento inválido.");
    }

    if (url.protocol !== "https:") {
      throw new Error("A Cielo retornou um endereço de pagamento inválido.");
    }

    res.status(200).json({ ok: true, url: url.toString() });
  } catch (erro) {
    console.error("Erro na ponte Cielo:", erro);
    res.status(502).json({
      ok: false,
      erro: erro && erro.message ? erro.message : "Não foi possível conectar ao serviço de pagamento."
    });
  }
};
