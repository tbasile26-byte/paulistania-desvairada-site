(function(){
 window.TioDinhoChatbotData={
  endpoint:'https://script.google.com/macros/s/AKfycbx3SxEiRSI2komamNn303Smrbqp86mWW7GvIYcEr4LHObueaEkQOleGrx_uEbhO4BiLZw/exec',
  whatsapp:'https://wa.me/5511971799889',
  reservationUrl:'primaveras-de-uma-vida.html#reservar',
  validDates:['2026-09-04','2026-09-11','2026-09-18','2026-09-25','2026-10-02','2026-10-09','2026-10-16','2026-10-23'],
  greeting:'Oi! Posso ajudar com reservas, menu degustação, horários, pagamentos e outras dúvidas.',
  fallback:'Não encontrei essa informação com segurança. Fale com a gente pelo WhatsApp.',
  shortcuts:['Como reservar?','Tem vaga no menu degustação?','Como funciona o menu?','Formas de pagamento','Cancelamento','Horários','Onde fica?'],
  knowledge:[
   {keywords:['como reservar','reserva','reservar'],answer:'Para o almoço, você pode reservar a mesa e antecipar os pratos pela página de reservas. Não é obrigatório escolher os pratos antes. Para o menu degustação “Primaveras de uma vida”, faça a reserva pelo formulário da página com pelo menos 2 dias de antecedência.',link:{label:'Reservar menu degustação',href:'primaveras-de-uma-vida.html#reservar'}},
   {keywords:['como funciona o menu','menu degustação','menu degustacao','primaveras de uma vida'],answer:'“Primaveras de uma vida” é um jantar em 10 etapas, inspirado em décadas, textos e pratos. Cada mesa segue seu próprio ritmo; não é sarau nem experiência coletiva. O livreto está incluído, as bebidas não estão incluídas e a duração prevista é de 1h30 a 2h. A chegada é entre 19h e 20h.'},
   {keywords:['formas de pagamento','forma de pagamento','pagamento','quanto custa','preço','preco','valor','pix','cartão','cartao'],answer:'O menu degustação custa R$ 140 por pessoa. A reserva é confirmada com sinal de 50% (R$ 70), por Pix ou cartão em até 2 vezes; os R$ 70 restantes são pagos no restaurante. Para grupos de 9 pessoas ou mais, o link de pagamento é enviado após a confirmação de disponibilidade. No almoço reservado, não há pagamento antecipado: o consumo é pago no restaurante.'},
   {keywords:['cancelamento','cancelar','cancelo','reembolso','desistir'],answer:'Para o almoço, o cancelamento não tem taxa; avise pelo WhatsApp. Para menus e eventos, dentro do prazo legal aplicável há reembolso integral. Fora dele: até 7 dias antes, reembolso integral; de 6 a 2 dias antes, 50%; na véspera, no dia ou em caso de não comparecimento, não há reembolso. Taxas de processamento não reembolsáveis podem ser descontadas. A transferência da reserva pode ser feita se avisada antes, e a troca de data depende de disponibilidade.'},
   {keywords:['horários','horario','horário','que horas','funcionamento'],answer:'O almoço funciona de terça a sábado, das 11h às 15h. As reservas de almoço são oferecidas das 11h30 às 14h30, em intervalos de 15 minutos. Para reservar no mesmo dia, faça o pedido antes das 11h; depois desse horário, fale pelo WhatsApp. No menu degustação, a chegada é entre 19h e 20h.'},
   {keywords:['onde fica','endereço','endereco','localização','localizacao'],answer:'O Tio Dinho fica na Rua João Leone, 51, em Sousas, Campinas — SP.'},
   {keywords:['restrição','restricao','alergia','vegetariano','intolerância','intolerancia'],answer:'Restrições alimentares precisam ser informadas com antecedência e são avaliadas pela cozinha.'},
   {keywords:['bebida','vinho','rolha','rolha livre'],answer:'As bebidas não estão incluídas no menu degustação. É permitido levar vinho; a taxa de rolha é de R$ 25 por garrafa.'},
   {keywords:['almoço','almoco','prato do dia','pf do dia'],answer:'No almoço, você pode reservar a mesa com ou sem escolher os pratos antes. O PF muda diariamente; consulte o WhatsApp. Entradas, bebidas e sobremesas podem ser escolhidas no restaurante, e os itens estão sujeitos à disponibilidade de estoque.'}
  ]
 };
})();
