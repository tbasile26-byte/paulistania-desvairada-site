const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx-MNgoT6LdavOZ9CiY4MnoBAYWab8KUnQAQVdGggbZOXaKkqOa4FpTVwhurwIGgp1aHQ/exec";

const CIELO_TOKEN_URL =
  "https://cieloecommerce.cielo.com.br/api/public/v2/token";

const CIELO_PRODUCTS_URL =
  "https://cieloecommerce.cielo.com.br/api/public/v1/products/";


module.exports = async function handler(req, res) {

  res.setHeader(
    "Cache-Control",
    "no-store, max-age=0"
  );


  if (req.method !== "GET") {

    return res.status(405).json({
      ok: false,
      erro: "Método não permitido."
    });

  }


  const ref =
    String(
      req.query.ref || ""
    ).trim();


  if (!ref) {

    return res.status(400).json({
      ok: false,
      erro: "Referência da reserva não informada."
    });

  }


  if (ref.length > 120) {

    return res.status(400).json({
      ok: false,
      erro: "Referência da reserva inválida."
    });

  }


  try {

    /*
     * =====================================================
     * 1. BUSCA OS DADOS DA RESERVA NO APPS SCRIPT
     * =====================================================
     */

    const urlReserva =
      APPS_SCRIPT_URL +
      "?acao=dados_reserva_cielo" +
      "&ref=" +
      encodeURIComponent(ref) +
      "&_=" +
      Date.now();


    const respostaReserva =
      await fetch(
        urlReserva,
        {
          method: "GET",
          redirect: "follow",
          cache: "no-store",
          headers: {
            Accept: "application/json"
          }
        }
      );


    const textoReserva =
      await respostaReserva.text();


    let dadosReserva;


    try {

      dadosReserva =
        JSON.parse(textoReserva);

    } catch (erro) {

      console.error(
        "Resposta inesperada do Apps Script:",
        textoReserva.slice(0, 500)
      );

      throw new Error(
        "O serviço de reservas respondeu de forma inesperada."
      );

    }


    if (
      !respostaReserva.ok ||
      !dadosReserva ||
      dadosReserva.ok !== true ||
      !dadosReserva.reserva
    ) {

      return res.status(400).json({
        ok: false,
        erro:
          dadosReserva &&
          dadosReserva.erro
            ? dadosReserva.erro
            : "Não foi possível localizar a reserva."
      });

    }


    const reserva =
      dadosReserva.reserva;


    /*
     * =====================================================
     * 2. VALIDA O VALOR
     * =====================================================
     */

    const total =
      Number(
        reserva.total
      );


    if (
      !Number.isFinite(total) ||
      total <= 0
    ) {

      throw new Error(
        "O valor total da reserva é inválido."
      );

    }


    /*
     * =====================================================
     * 3. AUTENTICA NA CIELO
     * =====================================================
     */

    const clientId =
      process.env.CIELO_CLIENT_ID;

    const clientSecret =
      process.env.CIELO_CLIENT_SECRET;


    if (
      !clientId ||
      !clientSecret
    ) {

      throw new Error(
        "As credenciais da Cielo não estão configuradas na Vercel."
      );

    }


    const basic =
      Buffer
        .from(
          clientId +
          ":" +
          clientSecret
        )
        .toString(
          "base64"
        );


    const respostaToken =
      await fetch(
        CIELO_TOKEN_URL,
        {
          method: "POST",

          headers: {

            Authorization:
              "Basic " +
              basic,

            Accept:
              "application/json",

            "Content-Type":
              "application/x-www-form-urlencoded"

          },

          body:
            "grant_type=client_credentials"

        }
      );


    const textoToken =
      await respostaToken.text();


    let dadosToken = {};


    try {

      dadosToken =
        JSON.parse(
          textoToken || "{}"
        );

    } catch (erro) {}


    if (
      !respostaToken.ok ||
      !dadosToken.access_token
    ) {

      console.error(
        "Erro Cielo token:",
        respostaToken.status,
        textoToken
      );

      throw new Error(
        "Não foi possível autenticar a integração com a Cielo."
      );

    }


    const token =
      dadosToken.access_token;


    /*
     * =====================================================
     * 4. MONTA O PEDIDO CIELO
     * =====================================================
     */

    const precoCentavos =
      Math.round(
        total * 100
      );


    /*
     * OrderNumber:
     * apenas letras e números.
     * Usamos parte do ID + horário para evitar repetição.
     */

    const idLimpo =
      String(
        reserva.id || "RESERVA"
      )
        .replace(
          /[^A-Za-z0-9]/g,
          ""
        )
        .slice(
          0,
          8
        );


    const agora =
      Date.now()
        .toString()
        .slice(-10);


    const orderNumber =
      (
        idLimpo +
        agora
      )
        .slice(
          0,
          20
        );


    const experiencia =
      String(
        reserva.experiencia ||
        "Experiência Paulistânia"
      )
        .trim()
        .slice(
          0,
          128
        );


    const descricao =
      [
        experiencia,
        reserva.tipoBilhete
          ? "Bilhete: " +
            reserva.tipoBilhete
          : "",
        reserva.quantidade
          ? "Quantidade: " +
            reserva.quantidade
          : ""
      ]
        .filter(Boolean)
        .join(" | ")
        .slice(
          0,
          255
        );


    const corpoCielo = {

      OrderNumber:
        orderNumber,

      type:
        "Service",

      name:
        experiencia,

      description:
        descricao,

      price:
        precoCentavos,

      quantity:
        1,

      shipping: {
        type:
          "WithoutShipping"
      },

      softDescriptor:
        "PAULISTANIA"

    };


    /*
     * =====================================================
     * 5. CRIA O LINK NA CIELO
     * =====================================================
     */

    const respostaCielo =
      await fetch(
        CIELO_PRODUCTS_URL,
        {
          method: "POST",

          headers: {

            Authorization:
              "Bearer " +
              token,

            Accept:
              "application/json",

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify(
              corpoCielo
            )

        }
      );


    const textoCielo =
      await respostaCielo.text();


    let dadosCielo = {};


    try {

      dadosCielo =
        JSON.parse(
          textoCielo || "{}"
        );

    } catch (erro) {}


    if (
      !respostaCielo.ok
    ) {

      console.error(
        "Erro ao criar link Cielo:",
        respostaCielo.status,
        textoCielo
      );

      throw new Error(
        "A Cielo não conseguiu criar o link de pagamento."
      );

    }


    /*
     * A própria resposta da criação normalmente
     * já traz shortUrl.
     */

    let urlPagamento =
      dadosCielo.shortUrl ||
      dadosCielo.shortURL ||
      dadosCielo.url ||
      "";


    /*
     * Se a criação devolver apenas o ID,
     * consultamos o link na Cielo.
     */

    if (
      !urlPagamento &&
      dadosCielo.id
    ) {

      const respostaConsulta =
        await fetch(
          CIELO_PRODUCTS_URL +
          encodeURIComponent(
            dadosCielo.id
          ),
          {

            method:
              "GET",

            headers: {

              Authorization:
                "Bearer " +
                token,

              Accept:
                "application/json"

            }

          }
        );


      const textoConsulta =
        await respostaConsulta.text();


      let dadosConsulta = {};


      try {

        dadosConsulta =
          JSON.parse(
            textoConsulta || "{}"
          );

      } catch (erro) {}


      if (
        respostaConsulta.ok
      ) {

        urlPagamento =
          dadosConsulta.shortUrl ||
          dadosConsulta.shortURL ||
          "";

      }

    }


    if (!urlPagamento) {

      console.error(
        "Resposta da Cielo sem URL:",
        textoCielo
      );

      throw new Error(
        "A Cielo criou a cobrança, mas não retornou o endereço de pagamento."
      );

    }


    /*
     * =====================================================
     * 6. VALIDA A URL
     * =====================================================
     */

    let url;


    try {

      url =
        new URL(
          String(
            urlPagamento
          )
        );

    } catch (erro) {

      throw new Error(
        "A Cielo retornou um endereço de pagamento inválido."
      );

    }


    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {

      throw new Error(
        "A Cielo retornou um endereço de pagamento inválido."
      );

    }


    /*
     * =====================================================
     * 7. RETORNA O LINK AO CHECKOUT
     * =====================================================
     */

    return res.status(200).json({

      ok:
        true,

      url:
        url.toString(),

      reserva:
        reserva.id || "",

      cieloId:
        dadosCielo.id || "",

      orderNumber:
        orderNumber

    });


  } catch (erro) {

    console.error(
      "Erro pagamento Cielo:",
      erro
    );


    return res.status(502).json({

      ok:
        false,

      erro:
        erro &&
        erro.message
          ? erro.message
          : "Não foi possível gerar o pagamento."

    });

  }

};
