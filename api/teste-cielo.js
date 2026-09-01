export default async function handler(req, res) {
  try {
    const clientId = process.env.CIELO_CLIENT_ID;
    const clientSecret = process.env.CIELO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        ok: false,
        etapa: "configuracao",
        erro: "Credenciais da Cielo não configuradas na Vercel."
      });
    }

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const resposta = await fetch(
      "https://cieloecommerce.cielo.com.br/api/public/v2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic}`,
          Accept: "application/json"
        }
      }
    );

    const texto = await resposta.text();

    let dados = null;
    try {
      dados = JSON.parse(texto);
    } catch (_) {}

    if (!resposta.ok || !dados?.access_token) {
      return res.status(resposta.status || 500).json({
        ok: false,
        etapa: "autenticacao_cielo",
        status: resposta.status,
        resposta: dados || texto
      });
    }

    return res.status(200).json({
      ok: true,
      status: resposta.status,
      mensagem: "Autenticação com a Cielo realizada com sucesso."
    });

  } catch (erro) {
    return res.status(500).json({
      ok: false,
      etapa: "erro_interno",
      erro: erro?.message || String(erro)
    });
  }
}
