/* ==========================================================================
   Observatório SUAS — CATÁLOGO DE PAINÉIS
   --------------------------------------------------------------------------
   ESTE É O ÚNICO ARQUIVO DO DIA A DIA.
   Para incluir, trocar ou remover um painel, edite apenas a lista abaixo.

   Como pegar o link no Power BI
     1. Abra o relatório no Power BI Service.
     2. Arquivo › Inserir relatório › Publicar na Web (público).
     3. Copie o link (https://app.powerbi.com/view?r=...).
        Pode colar o <iframe> inteiro: o site extrai o endereço sozinho.
     4. Cole no campo "url" do painel correspondente.

   Painel com "url" vazio aparece normalmente no menu, mas abre uma tela
   avisando que ainda não foi publicado. Assim a estrutura do Observatório
   fica pronta antes dos relatórios.

   Campos de um TEMA
     titulo    Nome exibido no menu, nos cartões e nas migalhas.
     icone     Um dos ícones do sprite (lista abaixo).
     eixo      Agrupa os temas nos filtros da página inicial.
     cor       "azul" | "verde" | "amarelo"  (tons do brasão da Prefeitura).
     descricao Uma frase curta, mostrada no cartão da página inicial.
     paineis   Lista de { titulo, url }. A ordem aqui é a ordem no site.

   Ícones disponíveis
     i-radar          i-casa-coracao   i-escudo-pessoas  i-identidade
     i-mao-moeda      i-grupo          i-cesta           i-rede
     i-mapa           i-grafico        i-capacitacao     i-carteira
     i-balanca        i-predio         i-lupa-dados      i-escudo-ok

   Endereço de cada painel: #/tema/painel (gerado a partir dos títulos,
   sem acentos). Renomear um painel muda o link dele.
   ========================================================================== */

window.CATALOGO = [

  /* ---------------------------------------------------------------- */
  {
    titulo: "Vigilância Socioassistencial",
    icone: "i-radar",
    eixo: "Vigilância e indicadores",
    cor: "azul",
    descricao: "Leitura territorial das vulnerabilidades e da capacidade de resposta da rede socioassistencial do município.",
    paineis: [
      { titulo: "Panorama geral do SUAS", url: "" },
      { titulo: "Vulnerabilidade e risco social", url: "" },
      { titulo: "Cobertura e demanda por serviço", url: "" },
      { titulo: "RMA — Registro Mensal de Atendimentos", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Proteção Social Básica",
    icone: "i-casa-coracao",
    eixo: "Proteção social",
    cor: "verde",
    descricao: "CRAS, PAIF e serviços de prevenção que fortalecem famílias e vínculos comunitários.",
    paineis: [
      { titulo: "CRAS — Unidades e território", url: "" },
      { titulo: "PAIF — Famílias acompanhadas", url: "" },
      { titulo: "Atendimentos particularizados", url: "" },
      { titulo: "Encaminhamentos da rede", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Proteção Social Especial",
    icone: "i-escudo-pessoas",
    eixo: "Proteção social",
    cor: "azul",
    descricao: "Média e alta complexidade: CREAS, PAEFI, acolhimento, abordagem social e Centro POP.",
    paineis: [
      { titulo: "CREAS e PAEFI", url: "" },
      { titulo: "Violações de direitos", url: "" },
      { titulo: "Serviço de acolhimento", url: "" },
      { titulo: "Abordagem social e Centro POP", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Cadastro Único",
    icone: "i-identidade",
    eixo: "Renda e benefícios",
    cor: "amarelo",
    descricao: "Perfil das famílias cadastradas, atualização cadastral e cobertura do CadÚnico em Porto Velho.",
    paineis: [
      { titulo: "Famílias e pessoas cadastradas", url: "" },
      { titulo: "Perfil socioeconômico", url: "" },
      { titulo: "Atualização cadastral", url: "" },
      { titulo: "Cadastro por bairro e distrito", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Benefícios e Transferência de Renda",
    icone: "i-mao-moeda",
    eixo: "Renda e benefícios",
    cor: "verde",
    descricao: "Bolsa Família, BPC e benefícios eventuais concedidos pelo município.",
    paineis: [
      { titulo: "Programa Bolsa Família", url: "" },
      { titulo: "BPC — Benefício de Prestação Continuada", url: "" },
      { titulo: "Benefícios eventuais", url: "" },
      { titulo: "Condicionalidades", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Convivência e Fortalecimento de Vínculos",
    icone: "i-grupo",
    eixo: "Proteção social",
    cor: "azul",
    descricao: "SCFV por ciclo de vida: crianças, adolescentes, pessoas idosas e grupos prioritários.",
    paineis: [
      { titulo: "SCFV — Visão geral", url: "" },
      { titulo: "Crianças e adolescentes", url: "" },
      { titulo: "Pessoas idosas", url: "" },
      { titulo: "Públicos prioritários", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Segurança Alimentar e Nutricional",
    icone: "i-cesta",
    eixo: "Proteção social",
    cor: "verde",
    descricao: "Ações de combate à fome: restaurantes populares, distribuição de alimentos e equipamentos públicos.",
    paineis: [
      { titulo: "Distribuição de alimentos", url: "" },
      { titulo: "Equipamentos de alimentação e nutrição", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Rede Socioassistencial",
    icone: "i-rede",
    eixo: "Gestão e financiamento",
    cor: "azul",
    descricao: "Unidades públicas e entidades privadas que compõem a rede do SUAS no município.",
    paineis: [
      { titulo: "Unidades públicas do SUAS", url: "" },
      { titulo: "Entidades e organizações parceiras", url: "" },
      { titulo: "Capacidade de atendimento", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Território e Vulnerabilidade",
    icone: "i-mapa",
    eixo: "Vigilância e indicadores",
    cor: "amarelo",
    descricao: "Mapas por bairro, zona urbana e distritos: onde estão as pessoas e onde está a oferta.",
    paineis: [
      { titulo: "Mapa da assistência social", url: "" },
      { titulo: "Bairros e áreas de abrangência", url: "" },
      { titulo: "Distritos e zona rural", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Indicadores e Estatísticas",
    icone: "i-grafico",
    eixo: "Vigilância e indicadores",
    cor: "azul",
    descricao: "Séries históricas e indicadores de gestão produzidos pelo DPEI para acompanhar metas e resultados.",
    paineis: [
      { titulo: "Indicadores de gestão do SUAS", url: "" },
      { titulo: "Séries históricas", url: "" },
      { titulo: "Metas do Plano Municipal de Assistência Social", url: "" },
      { titulo: "Censo SUAS", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Gestão do Trabalho",
    icone: "i-capacitacao",
    eixo: "Gestão e financiamento",
    cor: "verde",
    descricao: "Perfil das equipes, vínculos, lotação e educação permanente dos trabalhadores do SUAS.",
    paineis: [
      { titulo: "Trabalhadores do SUAS", url: "" },
      { titulo: "Educação permanente e capacitações", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Financiamento e FMAS",
    icone: "i-carteira",
    eixo: "Gestão e financiamento",
    cor: "amarelo",
    descricao: "Execução orçamentária do Fundo Municipal de Assistência Social e cofinanciamento federal e estadual.",
    paineis: [
      { titulo: "Execução do FMAS", url: "" },
      { titulo: "Cofinanciamento federal e estadual", url: "" },
      { titulo: "Repasses por bloco de financiamento", url: "" }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    titulo: "Controle Social e Transparência",
    icone: "i-balanca",
    eixo: "Gestão e financiamento",
    cor: "azul",
    descricao: "Conselho Municipal de Assistência Social, conferências e prestação de contas à sociedade.",
    paineis: [
      { titulo: "CMAS — Deliberações e reuniões", url: "" },
      { titulo: "Conferências e participação social", url: "" }
    ]
  }
];
