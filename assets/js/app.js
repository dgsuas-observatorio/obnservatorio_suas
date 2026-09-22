/* ==========================================================================
   Observatório SUAS — aplicação
   --------------------------------------------------------------------------
   JavaScript puro, sem dependências. Responsável por:
     · ler e validar o catálogo (assets/js/catalogo.js);
     · montar mega-menu, gaveta, cartões da página inicial e filtros;
     · rotear por endereço (#/tema/painel) com links compartilháveis;
     · carregar os painéis do Power BI com cache, estados e tela cheia;
     · paleta de comandos (Ctrl/⌘ + K) com busca e navegação por teclado.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Ajustes ---------------------------------------------------- */
  var MAX_PAINEIS_EM_CACHE = 3;      // iframes mantidos em memória
  var ESPERA_AVISO = 9000;           // ms até avisar que está demorando
  var HOSTS_PERMITIDOS = ["app.powerbi.com"];

  /* ---------- Atalhos ---------------------------------------------------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var app = $(".app");
  var principal = $("#principal");
  var vistas = {
    inicio: $("#vista-inicio"),
    painel: $("#vista-painel"),
    erro: $("#vista-nao-encontrado")
  };

  /* ---------- Utilidades ------------------------------------------------- */
  function semAcento(txt) {
    return String(txt || "").normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function apelido(txt) {
    return semAcento(txt)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  function normaliza(txt) {
    return semAcento(txt).toLowerCase();
  }

  function escapaHTML(txt) {
    return String(txt).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function icone(nome, classe) {
    return '<svg class="icone' + (classe ? " " + classe : "") + '" aria-hidden="true" focusable="false"><use href="#' + nome + '"/></svg>';
  }

  function plural(n, um, muitos) { return n + " " + (n === 1 ? um : muitos); }

  /* Aceita a URL pura ou o <iframe> inteiro copiado do Power BI. */
  function limpaURL(valor) {
    if (!valor) return "";
    var texto = String(valor).trim();
    var achado = texto.match(/src\s*=\s*["']([^"']+)["']/i);
    if (achado) texto = achado[1];
    texto = texto.replace(/&amp;/g, "&");
    try {
      var u = new URL(texto);
      if (u.protocol !== "https:") return "";
      if (HOSTS_PERMITIDOS.indexOf(u.hostname) === -1) return "";
      return u.href;
    } catch (e) {
      return "";
    }
  }

  /* ---------- Catálogo --------------------------------------------------- */
  var temas = [];
  var indice = [];      // busca: temas + painéis
  var porRota = {};     // "tema/painel" -> { tema, painel }

  function prepararCatalogo() {
    var bruto = Array.isArray(window.CATALOGO) ? window.CATALOGO : [];
    var usados = {};

    temas = bruto.map(function (t, i) {
      var slug = apelido(t.titulo) || "tema-" + (i + 1);
      while (usados[slug]) slug += "-" + (i + 1);
      usados[slug] = true;

      var usadosPainel = {};
      var paineis = (t.paineis || []).map(function (p, j) {
        var ps = apelido(p.titulo) || "painel-" + (j + 1);
        while (usadosPainel[ps]) ps += "-" + (j + 1);
        usadosPainel[ps] = true;
        return {
          titulo: p.titulo,
          slug: ps,
          url: limpaURL(p.url),
          rota: slug + "/" + ps,
          temaSlug: slug,
          indice: j + 1
        };
      });

      return {
        titulo: t.titulo,
        slug: slug,
        icone: t.icone || "i-grafico",
        eixo: t.eixo || "Geral",
        cor: t.cor || "azul",
        descricao: t.descricao || "",
        paineis: paineis
      };
    }).filter(function (t) { return t.paineis.length > 0; });

    temas.forEach(function (t) {
      indice.push({ tipo: "tema", titulo: t.titulo, caminho: plural(t.paineis.length, "painel", "painéis"), rota: t.paineis[0].rota, icone: t.icone, busca: normaliza(t.titulo + " " + t.eixo + " " + t.descricao) });
      t.paineis.forEach(function (p) {
        porRota[p.rota] = { tema: t, painel: p };
        indice.push({ tipo: "painel", titulo: p.titulo, caminho: t.titulo, rota: p.rota, icone: t.icone, busca: normaliza(p.titulo + " " + t.titulo + " " + t.eixo) });
      });
    });
  }

  /* ---------- Página inicial --------------------------------------------- */
  var eixoAtivo = "todos";

  function montarIndicadores() {
    var totalPaineis = temas.reduce(function (s, t) { return s + t.paineis.length; }, 0);
    animarNumero($("#total-temas"), temas.length);
    animarNumero($("#total-paineis"), totalPaineis);
    var ano = $("#ano-atual");
    if (ano) ano.textContent = new Date().getFullYear();
  }

  function animarNumero(el, alvo) {
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = alvo; return; }
    var inicio = performance.now(), dur = 900;
    function passo(agora) {
      var t = Math.min(1, (agora - inicio) / dur);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  function montarFiltros() {
    var caixa = $("#filtros");
    if (!caixa) return;
    var eixos = [];
    temas.forEach(function (t) { if (eixos.indexOf(t.eixo) === -1) eixos.push(t.eixo); });

    caixa.innerHTML = ['todos'].concat(eixos).map(function (e) {
      var rotulo = e === "todos" ? "Todos" : e;
      return '<button class="filtro" type="button" data-eixo="' + escapaHTML(e) + '" aria-pressed="' + (e === eixoAtivo) + '">' + escapaHTML(rotulo) + "</button>";
    }).join("");

    caixa.addEventListener("click", function (ev) {
      var botao = ev.target.closest(".filtro");
      if (!botao) return;
      eixoAtivo = botao.dataset.eixo;
      $$(".filtro", caixa).forEach(function (b) { b.setAttribute("aria-pressed", String(b === botao)); });
      montarGrade();
    });
  }

  function montarGrade() {
    var grade = $("#grade-temas");
    var vazio = $("#grade-vazia");
    if (!grade) return;

    var lista = temas.filter(function (t) { return eixoAtivo === "todos" || t.eixo === eixoAtivo; });
    vazio.hidden = lista.length > 0;

    grade.innerHTML = lista.map(function (t, i) {
      var visiveis = t.paineis.slice(0, 4);
      var restantes = t.paineis.length - visiveis.length;

      var itens = visiveis.map(function (p) {
        return '<li><a class="cartao__link" href="#/' + p.rota + '"><span>' + escapaHTML(p.titulo) + "</span>" + icone("i-seta-direita") + "</a></li>";
      }).join("");

      if (restantes > 0) {
        itens += '<li><a class="cartao__link cartao__mais" href="#/' + t.paineis[visiveis.length].rota + '">+ ' + plural(restantes, "painel", "painéis") + " neste tema</a></li>";
      }

      return '<li class="cartao cartao--' + t.cor + ' vidro">' +
        '<div class="cartao__topo">' +
          '<span class="cartao__icone">' + icone(t.icone) + "</span>" +
          '<div class="cartao__cabecalho">' +
            '<h3 class="cartao__titulo">' + escapaHTML(t.titulo) + "</h3>" +
            '<p class="cartao__meta"><b>' + t.paineis.length + "</b> " + (t.paineis.length === 1 ? "painel" : "painéis") + " · " + escapaHTML(t.eixo) + "</p>" +
          "</div>" +
          '<span class="cartao__numero">' + String(i + 1).padStart(2, "0") + "</span>" +
        "</div>" +
        (t.descricao ? '<p class="cartao__descricao">' + escapaHTML(t.descricao) + "</p>" : "") +
        '<ul class="cartao__lista" role="list">' + itens + "</ul>" +
      "</li>";
    }).join("");
  }

  /* ---------- Mega-menu e gaveta ----------------------------------------- */
  function itemDeMenu(t, classe) {
    return '<li><a class="' + classe + " " + classe + "--" + t.cor + '" href="#/' + t.paineis[0].rota + '" data-tema="' + t.slug + '">' +
      '<span class="mega__icone">' + icone(t.icone) + "</span>" +
      '<span class="mega__texto">' +
        '<span class="mega__titulo">' + escapaHTML(t.titulo) + "</span>" +
        '<span class="mega__meta">' + plural(t.paineis.length, "painel", "painéis") + " · " + escapaHTML(t.eixo) + "</span>" +
      "</span></a></li>";
  }

  function montarMenus() {
    var mega = $("#mega-grade");
    var gaveta = $("#gaveta-lista");
    var html = temas.map(function (t) { return itemDeMenu(t, "mega__item"); }).join("");
    if (mega) mega.innerHTML = html;
    if (gaveta) gaveta.innerHTML = html;
  }

  var botaoMega = $("#botao-mega");
  var mega = $("#mega");

  function abrirMega(abrir) {
    if (!mega || !botaoMega) return;
    mega.hidden = !abrir;
    botaoMega.setAttribute("aria-expanded", String(abrir));
  }

  if (botaoMega) {
    botaoMega.addEventListener("click", function () {
      abrirMega(mega.hidden);
    });
  }

  document.addEventListener("click", function (ev) {
    if (mega && !mega.hidden && !ev.target.closest("#mega") && !ev.target.closest("#botao-mega")) abrirMega(false);
  });

  var gaveta = $("#gaveta");
  var scrim = $("#scrim");
  var botaoGaveta = $("#botao-gaveta");

  function abrirGaveta(abrir) {
    if (!gaveta) return;
    gaveta.hidden = !abrir;
    scrim.hidden = !abrir;
    botaoGaveta.setAttribute("aria-expanded", String(abrir));
    document.body.style.touchAction = abrir ? "none" : "";
    if (abrir) {
      var primeiro = $("a", gaveta);
      if (primeiro) primeiro.focus();
    }
  }

  if (botaoGaveta) botaoGaveta.addEventListener("click", function () { abrirGaveta(gaveta.hidden); });
  if (scrim) scrim.addEventListener("click", function () { abrirGaveta(false); });
  var fecharGaveta = $("#fechar-gaveta");
  if (fecharGaveta) fecharGaveta.addEventListener("click", function () { abrirGaveta(false); botaoGaveta.focus(); });

  /* ---------- Paleta de comandos (Ctrl/⌘ + K) ---------------------------- */
  var paleta = $("#paleta");
  var campo = $("#paleta-campo");
  var resultados = $("#paleta-resultados");
  var paletaVazio = $("#paleta-vazio");
  var selecionado = 0;
  var listaAtual = [];
  var focoAnterior = null;

  function abrirPaleta(abrir) {
    if (!paleta) return;
    if (abrir) {
      focoAnterior = document.activeElement;
      paleta.hidden = false;
      campo.value = "";
      filtrarPaleta("");
      campo.focus();
    } else {
      paleta.hidden = true;
      if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
    }
  }

  function filtrarPaleta(termo) {
    var t = normaliza(termo.trim());
    listaAtual = !t
      ? indice.filter(function (i) { return i.tipo === "tema"; })
      : indice.filter(function (i) { return i.busca.indexOf(t) !== -1; })
              .sort(function (a, b) {
                var g = (a.tipo === "tema" ? 0 : 1) - (b.tipo === "tema" ? 0 : 1);
                if (g !== 0) return g;                       // temas primeiro, grupos estáveis
                return a.busca.indexOf(t) - b.busca.indexOf(t);
              })
              .slice(0, 40);

    selecionado = 0;
    paletaVazio.hidden = listaAtual.length > 0;

    var grupoAtual = "";
    resultados.innerHTML = listaAtual.map(function (item, i) {
      var cabecalho = "";
      var grupo = item.tipo === "tema" ? "Temas" : "Painéis";
      if (grupo !== grupoAtual) { grupoAtual = grupo; cabecalho = '<li class="paleta__grupo" role="presentation">' + grupo + "</li>"; }
      return cabecalho +
        '<li role="presentation"><a class="paleta__item' + (i === 0 ? " is-ativo" : "") + '" role="option" aria-selected="' + (i === 0) + '" id="paleta-op-' + i + '" href="#/' + item.rota + '" data-i="' + i + '">' +
          '<span class="paleta__item-icone">' + icone(item.icone) + "</span>" +
          '<span class="paleta__item-texto">' +
            '<span class="paleta__item-titulo">' + destacar(item.titulo, termo.trim()) + "</span>" +
            '<span class="paleta__item-caminho">' + escapaHTML(item.caminho) + "</span>" +
          "</span>" +
          icone("i-enter", "paleta__seta") +
        "</a></li>";
    }).join("");
  }

  function destacar(texto, termo) {
    if (!termo) return escapaHTML(texto);
    var pos = normaliza(texto).indexOf(normaliza(termo));
    if (pos === -1) return escapaHTML(texto);
    return escapaHTML(texto.slice(0, pos)) + "<mark>" + escapaHTML(texto.slice(pos, pos + termo.length)) + "</mark>" + escapaHTML(texto.slice(pos + termo.length));
  }

  function moverSelecao(passo) {
    var itens = $$(".paleta__item", resultados);
    if (!itens.length) return;
    selecionado = (selecionado + passo + itens.length) % itens.length;
    itens.forEach(function (el, i) {
      el.classList.toggle("is-ativo", i === selecionado);
      el.setAttribute("aria-selected", String(i === selecionado));
    });
    itens[selecionado].scrollIntoView({ block: "nearest" });
    campo.setAttribute("aria-activedescendant", "paleta-op-" + selecionado);
  }

  if (campo) {
    campo.addEventListener("input", function () { filtrarPaleta(campo.value); });
    campo.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowDown") { ev.preventDefault(); moverSelecao(1); }
      else if (ev.key === "ArrowUp") { ev.preventDefault(); moverSelecao(-1); }
      else if (ev.key === "Enter") {
        var alvo = $$(".paleta__item", resultados)[selecionado];
        if (alvo) { ev.preventDefault(); location.hash = alvo.getAttribute("href").slice(1); abrirPaleta(false); }
      }
    });
    resultados.addEventListener("click", function (ev) {
      if (ev.target.closest(".paleta__item")) abrirPaleta(false);
    });
    paleta.addEventListener("mousedown", function (ev) {
      if (ev.target === paleta) abrirPaleta(false);
    });
  }

  $$("#abrir-paleta, #heroi-buscar, #paleta-fechar").forEach(function (b) {
    b.addEventListener("click", function () { abrirPaleta(b.id !== "paleta-fechar"); });
  });

  document.addEventListener("keydown", function (ev) {
    var k = ev.key.toLowerCase();
    if ((ev.ctrlKey || ev.metaKey) && k === "k") { ev.preventDefault(); abrirPaleta(paleta.hidden); return; }
    if (k === "/" && !/^(input|textarea|select)$/i.test(document.activeElement.tagName) && paleta.hidden) {
      ev.preventDefault(); abrirPaleta(true); return;
    }
    if (ev.key === "Escape") {
      if (!paleta.hidden) { abrirPaleta(false); return; }
      if (gaveta && !gaveta.hidden) { abrirGaveta(false); botaoGaveta.focus(); return; }
      if (mega && !mega.hidden) { abrirMega(false); botaoMega.focus(); }
    }
  });

  /* ---------- Painel: cache de iframes ----------------------------------- */
  var palco = $("#palco");
  var carregando = $("#carregando");
  var avisoLentidao = $("#aviso-lentidao");
  var pendente = $("#pendente");
  var cache = {};       // rota -> iframe
  var ordem = [];       // rotas em ordem de uso
  var temporizador = null;
  var rotaAtual = "";

  function mostrarCarregando(mostrar) {
    carregando.hidden = !mostrar;
    if (!mostrar) { avisoLentidao.hidden = true; clearTimeout(temporizador); }
  }

  function trocarIframe(painel) {
    Object.keys(cache).forEach(function (r) { cache[r].classList.toggle("is-ativo", r === painel.rota); });

    var frame = cache[painel.rota];
    if (frame) { mostrarCarregando(false); return; }

    mostrarCarregando(true);
    frame = document.createElement("iframe");
    frame.className = "palco__iframe";
    frame.title = "Painel: " + painel.titulo;
    frame.setAttribute("loading", "eager");
    frame.setAttribute("allowfullscreen", "true");
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    frame.src = painel.url;

    frame.addEventListener("load", function () {
      if (rotaAtual === painel.rota) mostrarCarregando(false);
      frame.classList.add("is-ativo");
    });

    palco.appendChild(frame);
    cache[painel.rota] = frame;
    frame.classList.add("is-ativo");
    ordem.push(painel.rota);

    while (ordem.length > MAX_PAINEIS_EM_CACHE) {
      var velha = ordem.shift();
      if (velha === painel.rota) { ordem.push(velha); break; }
      if (cache[velha]) { cache[velha].remove(); delete cache[velha]; }
    }

    clearTimeout(temporizador);
    temporizador = setTimeout(function () {
      if (rotaAtual === painel.rota && !carregando.hidden) avisoLentidao.hidden = false;
    }, ESPERA_AVISO);
  }

  /* ---------- Montagem da vista de painel -------------------------------- */
  function montarMigalhas(tema, painel) {
    var ol = $("#migalhas ol");
    ol.innerHTML =
      '<li class="migalhas__item"><a href="#/">Início</a></li>' +
      '<li class="migalhas__item"><a href="#/' + tema.paineis[0].rota + '">' + escapaHTML(tema.titulo) + "</a></li>" +
      '<li class="migalhas__item" aria-current="page">' + escapaHTML(painel.titulo) + "</li>";
  }

  function montarAbas(tema, painel) {
    var abas = $("#abas");
    if (tema.paineis.length < 2) { abas.hidden = true; abas.innerHTML = ""; return; }
    abas.hidden = false;
    abas.innerHTML = tema.paineis.map(function (p) {
      var ativo = p.rota === painel.rota;
      return '<a class="aba" href="#/' + p.rota + '"' + (ativo ? ' aria-current="page"' : "") + '>' +
        '<span class="aba__indice">' + p.indice + "</span>" + escapaHTML(p.titulo) + "</a>";
    }).join("");
    var ativa = $(".aba[aria-current]", abas);
    if (ativa) ativa.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function abrirPainel(tema, painel) {
    rotaAtual = painel.rota;
    trocarVista("painel");

    $("#titulo-painel").textContent = painel.titulo;
    document.title = painel.titulo + " · " + tema.titulo + " — Observatório SUAS";
    montarMigalhas(tema, painel);
    montarAbas(tema, painel);

    var temURL = !!painel.url;
    pendente.hidden = temURL;
    $("#acao-nova-aba").href = painel.url || "#";
    $("#acao-nova-aba").setAttribute("aria-disabled", String(!temURL));
    $("#acao-nova-aba").classList.toggle("acao--inativa", !temURL);
    $("#aviso-nova-aba").href = painel.url || "#";
    $("#acao-recarregar").disabled = !temURL;

    if (temURL) {
      trocarIframe(painel);
    } else {
      mostrarCarregando(false);
      Object.keys(cache).forEach(function (r) { cache[r].classList.remove("is-ativo"); });
    }

    anunciar("Painel " + painel.titulo + ", do tema " + tema.titulo + ", aberto.");
    marcarMenuAtivo(tema.slug);
  }

  function marcarMenuAtivo(slug) {
    $$("#mega-grade a, #gaveta-lista a").forEach(function (a) {
      if (slug && a.dataset.tema === slug) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    var inicio = $("[data-rota-inicio]");
    if (inicio) {
      if (slug) inicio.removeAttribute("aria-current");
      else inicio.setAttribute("aria-current", "page");
    }
  }

  /* ---------- Rotas ------------------------------------------------------ */
  function trocarVista(nome) {
    app.dataset.vista = nome;
    vistas.inicio.hidden = nome !== "inicio";
    vistas.painel.hidden = nome !== "painel";
    vistas.erro.hidden = nome !== "erro";
    abrirMega(false);
    abrirGaveta(false);
  }

  function focarVista(nome) {
    var alvo = $("[data-foco]", vistas[nome]);
    if (alvo) alvo.focus({ preventScroll: true });
  }

  function lerRota() {
    var bruto = location.hash.replace(/^#/, "");
    var partes = bruto.split("#");
    return { caminho: (partes[0] || "/").replace(/^\/+/, ""), ancora: partes[1] || "" };
  }

  function rotear(primeiraVez) {
    var r = lerRota();

    if (!r.caminho) {
      rotaAtual = "";
      trocarVista("inicio");
      document.title = "Observatório SUAS — Sistema Único de Assistência Social | Porto Velho";
      marcarMenuAtivo("");
      if (r.ancora) {
        var alvo = document.getElementById(r.ancora);
        if (alvo) {
          requestAnimationFrame(function () {
            principal.scrollTo({ top: Math.max(0, alvo.offsetTop - 12), behavior: primeiraVez ? "auto" : "smooth" });
            alvo.focus({ preventScroll: true });
          });
          return;
        }
      }
      principal.scrollTop = 0;
      if (!primeiraVez) focarVista("inicio");
      return;
    }

    var achado = porRota[r.caminho];
    if (!achado) {
      // "#/tema" abre o primeiro painel do tema
      var tema = temas.filter(function (t) { return t.slug === r.caminho; })[0];
      if (tema) { location.replace("#/" + tema.paineis[0].rota); return; }
      rotaAtual = "";
      trocarVista("erro");
      document.title = "Painel não encontrado — Observatório SUAS";
      marcarMenuAtivo("");
      if (!primeiraVez) focarVista("erro");
      return;
    }

    abrirPainel(achado.tema, achado.painel);
  }

  /* ---------- Ações do painel -------------------------------------------- */
  $("#acao-recarregar").addEventListener("click", function () {
    var achado = porRota[rotaAtual];
    if (!achado || !achado.painel.url) return;
    if (cache[rotaAtual]) { cache[rotaAtual].remove(); delete cache[rotaAtual]; ordem = ordem.filter(function (r) { return r !== rotaAtual; }); }
    trocarIframe(achado.painel);
    avisar("Recarregando o painel…");
  });

  $("#acao-copiar").addEventListener("click", function () {
    var link = location.href;
    var copiar = navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(link)
      : Promise.reject();
    copiar.then(function () { avisar("Link copiado para a área de transferência."); })
          .catch(function () { window.prompt("Copie o link deste painel:", link); });
  });

  var moldura = $("#palco-moldura");
  var botaoTela = $("#acao-tela-cheia");

  botaoTela.addEventListener("click", function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (moldura.requestFullscreen) moldura.requestFullscreen();
    else avisar("Este navegador não permite tela cheia.");
  });

  document.addEventListener("fullscreenchange", function () {
    var cheio = !!document.fullscreenElement;
    botaoTela.setAttribute("aria-pressed", String(cheio));
    botaoTela.title = cheio ? "Sair da tela cheia" : "Ver em tela cheia";
    $(".acao__texto", botaoTela).textContent = cheio ? "Sair" : "Tela cheia";
    $("use", botaoTela).setAttribute("href", cheio ? "#i-sair-tela-cheia" : "#i-tela-cheia");
  });

  /* ---------- Avisos e anúncios ------------------------------------------ */
  var toast = $("#toast");
  var relogioToast = null;

  function avisar(texto) {
    toast.textContent = texto;
    toast.classList.add("is-visivel");
    clearTimeout(relogioToast);
    relogioToast = setTimeout(function () { toast.classList.remove("is-visivel"); }, 2800);
  }

  function anunciar(texto) {
    var el = $("#anunciador");
    el.textContent = "";
    setTimeout(function () { el.textContent = texto; }, 60);
  }

  /* ---------- Voltar ao topo --------------------------------------------- */
  var voltarTopo = $("#voltar-topo");
  principal.addEventListener("scroll", function () {
    voltarTopo.hidden = !(app.dataset.vista === "inicio" && principal.scrollTop > 420);
  }, { passive: true });
  voltarTopo.addEventListener("click", function () {
    principal.scrollTo({ top: 0, behavior: "smooth" });
    voltarTopo.hidden = true;
    $("[data-foco]", vistas.inicio).focus({ preventScroll: true });
  });

  /* ---------- Âncoras internas da página inicial -------------------------- */
  document.addEventListener("click", function (ev) {
    var link = ev.target.closest("[data-ancora]");
    if (!link) return;
    ev.preventDefault();
    abrirMega(false);
    abrirGaveta(false);
    var destino = "#/#" + link.dataset.ancora;
    if (location.hash === destino) rotear(false);
    else location.hash = destino.slice(1);
  });

  /* ---------- Início ------------------------------------------------------ */
  prepararCatalogo();
  montarIndicadores();
  montarMenus();
  montarFiltros();
  montarGrade();
  rotear(true);

  window.addEventListener("hashchange", function () { rotear(false); });
})();
