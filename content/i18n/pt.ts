/* Português do Brasil. Same shape as the English bundle (enforced by the
   Bundle type). Natural PT-BR, not a literal translation; technical terms
   Brazilian devs use in English stay in English (deploy, pipeline, prompt,
   CI, point-in-time). Facts, numbers and names must match the English. */

import type { Bundle } from "./index";
import { site } from "../site";

export const pt: Bundle = {
  locale: "pt",

  ui: {
    meta: { htmlLang: "pt-BR", ogLocale: "pt_BR", languageName: "Português" },

    skipLink: "Pular para o conteúdo",
    navLabel: "Índice de seções",
    nav: { journey: "Trajetória", arsenal: "Arsenal", work: "Trabalhos", languages: "Idiomas", contact: "Contato" },
    navServices: "Para empresas",
    rail: { origin: "Origem", journey: "Trajetória", arsenal: "Arsenal", work: "Trabalhos", pipeline: "Detalhe", languages: "Idiomas", contact: "Contato" },
    menu: { open: "Abrir menu", close: "Fechar menu" },
    theme: { toLight: "Mudar para whiteprint (claro)", toDark: "Mudar para blueprint (escuro)", lightTitle: "Whiteprint", darkTitle: "Blueprint" },
    langSwitch: { label: "Idioma" },

    origin: {
      eyebrow: "DESENHO",
      statusKey: "STATUS",
      cta: "Vamos conversar",
      cv: "Baixar CV",
      cvNote: "(PDF, em inglês)",
      titleBlockLabel: "Carimbo do desenho",
      languagesLabel: "Idiomas falados",
      dimLabel: "FOLHA 1 / 1 — ESCALA 1:1",
      bearingLabel: "RUMO {deg} → PARIS",
    },
    journey: {
      title: "Trajetória",
      intro: "Um fio condutor: entender como os sistemas se comportam e colocá-los a serviço de necessidades reais — de motores de física a infraestrutura de pesquisa.",
    },
    arsenal: {
      title: "Arsenal técnico",
      intro: "Lido como uma legenda, não como nuvem de tags — agrupado pela camada do sistema que cada parte toca.",
      credentials: "Certificações e cursos",
      certifications: "Certificações",
      training: "Cursos",
    },
    work: {
      title: "Trabalhos selecionados",
      intro: "Seis projetos, seis problemas. Cada desenho tem a cara do que a coisa realmente é.",
      hint: "role →",
    },
    carousel: {
      label: "Carrossel de projetos, com rolagem",
      prev: "Projeto anterior",
      next: "Próximo projeto",
      more: "Ver o desenho completo",
      cardLanguage: "Idioma do cartão",
      close: "Fechar",
      detailNote: "Estudo de caso em inglês.",
    },
    pipeline: { manualStep: "passo manual" },
    languages: {
      title: "Idiomas",
      intro: "Multilíngue e de olho na Europa — medido na escala CEFR, lido como um medidor de sinal.",
      names: { PT: "Português", EN: "Inglês", FR: "Francês", ES: "Espanhol" },
      native: "nativo",
    },
    contact: { title: "Contato" },
    footer: {
      builtWith: "feito à mão com Next.js, TypeScript e CSS puro, sobre a identidade esquemática da versão original em HTML.",
      security: "Como este site é protegido",
    },
    securityUi: {
      controls: "Controles",
      limitations: "Limitações conhecidas",
      report: "Relatar uma vulnerabilidade",
      threatModel: "Modelo de ameaças completo: SECURITY.md no GitHub (em inglês)",
    },
    subpage: { back: "← Voltar ao desenho", footerBack: "voltar para simonlaborde.com" },
    notFound: { title: "Fora do desenho", body: "Esta página não existe.", home: "Voltar ao desenho" },

    chat: {
      tag: "CONSOLE DE CONSULTA AO VIVO",
      title: "Pergunte sobre meu trabalho",
      intro: "Baseado no conteúdo deste site — uma pequena demonstração do trabalho com IA/LLM descrito aqui.",
      dialogLabel: "Pergunte a um assistente sobre o trabalho do Simon",
      close: "Fechar",
      you: "Você",
      thinking: "Pensando",
      placeholder: "ex.: Qual é o projeto mais forte dele?",
      inputLabel: "Sua pergunta",
      send: "Enviar",
      fallback: "Não consegui falar com o assistente agora — confira sua conexão e tente de novo, ou mande um e-mail para {email}.",
    },
    chatServer: {
      ip: "Muitas perguntas em pouco tempo — tente de novo daqui a alguns minutos ou mande um e-mail para {email}.",
      global: "O assistente atingiu o limite de hoje — ele volta à meia-noite (UTC). Enquanto isso, mande um e-mail para {email}.",
      unavailable: "O assistente está fora do ar por um instante — tente de novo em breve ou mande um e-mail para {email}.",
      notConfigured: "Este assistente ainda não está configurado. Enquanto isso, mande um e-mail para {email}.",
      rateLimited: "O assistente está com muita demanda agora — tente de novo em instantes ou mande um e-mail para {email}.",
      unverified: "Não consegui dar uma resposta confiável para isso. Pergunte direto ao Simon pelo e-mail {email}.",
      streamError: "Algo deu errado ao responder. Tente de novo ou mande um e-mail para {email}.",
    },
  },

  site: {
    role: "Engenharia de sistemas e full-stack",
    title: "Simon Laborde — Engenheiro Backend e de IA/LLM",
    description:
      "Simon Laborde — engenheiro backend e full-stack com foco em IA/LLM, com base em sistemas backend corporativos. Portfólio, experiência e contato.",
    roleLine:
      "Engenheiro backend e full-stack com foco em <strong>IA / LLM</strong>, com experiência em sistemas backend corporativos na Accenture.",
    thesis:
      "Faço a ponte entre sistemas complexos e as pessoas que dependem deles — hoje, construindo ferramentas com LLMs.",
    status: {
      label: "Aberto a vagas em IA e engenharia de software",
      detail: "Remoto ou presencial na UE — tempo integral, contrato ou freelance",
    },
    workRights:
      "Cidadão francês, com direito pleno de trabalhar na UE — sem necessidade de patrocínio de visto. Moro no Brasil; aberto a trabalho remoto e a mudança.",
    contactIntro:
      "Aberto a vagas em IA e engenharia de software — remoto ou presencial na UE — e também a projetos freelance e por contrato.",
    chatLauncher: { full: "PERGUNTE SOBRE MEU TRABALHO", short: "PERGUNTE" },
    chatSuggestions: [
      "Qual é a experiência dele com LLMs e agentes?",
      "Me conta sobre o pipeline do Lattes.",
      "O que ele já construiu com LLMs?",
      "Ele pode trabalhar na UE?",
    ],
    chatNotice: {
      securityLink: "Como este assistente é protegido",
      accuracy:
        "As respostas são geradas por IA a partir do conteúdo deste site — confirme qualquer ponto importante diretamente com o Simon.",
      privacy:
        "Privacidade: suas perguntas são enviadas à API Claude, da Anthropic, para gerar as respostas. Este site não salva conversas; seu endereço IP fica guardado por até 10 minutos para limitar o uso.",
    },
    titleBlock: [
      { dt: "Desenhado por", dd: "S. Laborde", mono: false, sign: true },
      { dt: "Origem", dd: "07°13′S 35°53′W", mono: true },
      { dt: "Rumo", dd: "Brasil → Europa", mono: false },
      { dt: "Revisão", dd: "2026.5", mono: true, stamp: true },
      { dt: "Folha", dd: "1 / 1", mono: true },
      { dt: "Escala", dd: "1:1", mono: true },
    ],
  },

  journey: [
    {
      when: "2024 — atual",
      title: "Desenvolvimento de software freelance",
      org: "Independente — remoto",
      body: "Criei o site bilíngue do LABNOV, laboratório de pesquisa em materiais da UFCG — um modelo de conteúdo no Sanity CMS para a equipe não técnica e um pipeline automático de publicações a partir da Plataforma Lattes — e o site do pintor pop art Rogério Freire. Outros trabalhos para clientes estão sob NDA.",
    },
    {
      when: "2020 — 2025",
      title: "Bacharelado em Sistemas de Informação",
      org: "UNIFACISA — Campina Grande",
      body: "TCC — <em>&ldquo;MedHelp: Sistema de Apoio à Decisão Clínica para Recomendações de Exames Preventivos com Processamento de Linguagem Natural&rdquo;</em> — processamento de linguagem natural (PLN) para apoio à decisão clínica, aprovado com nota máxima (10), e a semente do projeto MedHelp.",
    },
    {
      when: "2022 — 2023",
      title: "Custom Software Engineer",
      org: "Accenture",
      body: "Otimizei processos de faturamento e de backend no Oracle BRM com C e shell script; automatizei relatórios financeiros com o Oracle BI Publisher, dentro de um time ágil.",
    },
    {
      when: "2018 — 2020",
      title: "Base em desenvolvimento de jogos",
      org: "UNIFACISA",
      body: "Design de sistemas interativos, lógica de gameplay em C# e trabalho com motores de física — onde nasceu o instinto de entender como os sistemas se movem e quebram.",
    },
  ],

  arsenal: [
    { icon: "code", title: "Linguagens e runtimes", items: "Python · Java · C · C# · TypeScript · JavaScript · PL/SQL" },
    {
      icon: "ai",
      title: "IA / LLM",
      items:
        "Integração de LLMs e sistemas de prompts · Model Context Protocol (MCP) · design de agentes e subagentes · APIs Claude / Anthropic · NLP · scikit-learn · LightGBM · MLflow · pandas · NumPy",
    },
    { icon: "data", title: "Backend e dados", items: "APIs RESTful · PostgreSQL · MySQL · Oracle BRM · Oracle BI Publisher" },
    { icon: "frontend", title: "Frontend e mobile", items: "Next.js · React · React Native · Expo · Tailwind · HTML/CSS semântico" },
    { icon: "infra", title: "Infraestrutura e ferramentas", items: "Docker · AWS EC2 · Vercel · Git · JIRA · Sanity CMS · Figma" },
    { icon: "test", title: "Testes", items: "pytest" },
  ],

  pipeline: {
    title: "O pipeline de sincronização do Lattes",
    eyebrow: "Detalhe 04.1 — LABNOV",
    lead: "Um zoom em uma parte do projeto LABNOV: manter atualizada, sozinha, a lista de publicações de um laboratório de pesquisa — mesmo com um obstáculo que impede a automação total.",
    nodes: [
      { idx: "01", title: "Plataforma Lattes", body: "O registro de currículos acadêmicos do Brasil. Sem API pública; a exportação é protegida por CAPTCHA.", kind: "source" },
      { idx: "02", title: "Checkpoint de reCAPTCHA", body: "Não dá para automatizar. O pipeline pausa para um clique humano e depois segue sozinho.", kind: "gate" },
      { idx: "03", title: "Parser", body: "Extrai as publicações da exportação e padroniza autores, veículos e anos.", kind: "process" },
      { idx: "04", title: "Diff", body: "Compara com o CMS — entram os artigos novos, sem duplicar nem perder nada.", kind: "process" },
      { idx: "05", title: "Sanity CMS", body: "Só as mudanças são gravadas, no mesmo schema que a equipe já edita à mão.", kind: "store" },
      { idx: "06", title: "Site do LABNOV", body: "As novas publicações aparecem dentro de um ciclo de sync. Ninguém precisa manter a lista.", kind: "output" },
    ],
    meta: [
      { dt: "Problema", dd: "Uma lista pública de publicações que fica desatualizada no momento em que alguém esquece de mexer nela." },
      { dt: "Abordagem", dd: "Automatizar tudo, menos o único passo que não dá — e transformar esse passo em um clique, não em uma tarefa." },
      { dt: "Resultado", dd: "Uma lista praticamente sem manutenção, sempre fiel à fonte oficial." },
    ],
  },

  projects: {
    scout: {
      tag: "01 · Previsão com ML + agente Claude",
      status: "Em andamento",
      lead: "Prevê a variação, em 12 meses, do valor de mercado no Transfermarkt para 8.190 jogadores de 7 ligas europeias (2013–2024), com um agente Claude e um servidor MCP por cima — point-in-time, com testes de vazamento e um conjunto de teste lacrado e registrado.",
      layers: ["Agente Claude · servidor MCP", "Intervalos de previsão 80%", "LightGBM · runs no MLflow", "Features point-in-time", "Postgres · anti-vazamento"],
      skin: {
        readings: [
          { dt: "Jogadores", value: "8.190" },
          { dt: "Cobertura do intervalo", value: "82,2", unit: "%" },
          { dt: "Agente, evals held-out", value: "19/20" },
        ],
      },
    },
    medhelp: {
      tag: "02 · Apoio à decisão clínica com IA",
      lead: "Uma ferramenta de NLP projetada para o SUS, desenvolvida e avaliada com dados sintéticos, não com prontuários reais: normaliza anotações clínicas e sinaliza exames preventivos a partir do perfil e do histórico do paciente.",
      layers: ["Recomendação de exames", "Normalização com NLP", "Notas clínicas (sintéticas)"],
      skin: {
        vitals: [
          { dt: "Normalização de terminologia (23/25 termos, dados sintéticos)", value: "92", unit: "%" },
          { dt: "Superfície do modelo", value: "NLP" },
        ],
      },
    },
    rogerio: {
      tag: "03 · Site de artista e loja",
      lead: "Site do pintor pop art Rogério Freire: uma galeria com as obras originais, um catálogo de produtos feitos a partir delas e compra pelo WhatsApp ou por e-mail.",
      layers: ["Galeria de originais", "Catálogo de produtos", "Compra via WhatsApp/e-mail", "Next.js+Tailwind na Vercel"],
      skin: {
        placeholder: "PLACEHOLDER — obra pendente",
        caption: "PRANCHA 01 — pintura original · detalhes em breve",
      },
    },
    nutriquest: {
      tag: "04 · App de nutrição gamificado",
      status: "Em desenvolvimento (redesign em andamento)",
      lead: "Um app mobile que transforma o registro de refeições em jogo — sequências, níveis de XP e desafios semanais, em português do Brasil.",
      layers: ["UI mobile · XP e desafios", "Busca de alimentos · tabela TACO", "Dados no aparelho"],
      skin: {
        xpMeta: "Nível 7 · Nutricionista em formação",
        xpAmount: "1.840 / 2.400 XP",
        board: [
          { pos: "1", name: "ana.map", pts: "3.120" },
          { pos: "2", name: "você", pts: "1.840", you: true },
          { pos: "3", name: "tiago.rn", pts: "1.610" },
        ],
        caption: "Prévia da interface · dados de exemplo",
      },
    },
    labnov: {
      tag: "05 · Plataforma de pesquisa bilíngue",
      lead: "Site bilíngue para o laboratório de pesquisa LABNOV, da UFCG, com sincronização automática de publicações a partir da Plataforma Lattes e edição de conteúdo pelo Sanity CMS para a equipe não técnica.",
      layers: ["Site bilíngue em Next.js", "Modelo de conteúdo Sanity", "Sync automático do Lattes"],
    },
    financial: {
      tag: "06 · Backend corporativo, Accenture",
      title: "Otimização de faturamento corporativo",
      lead: "Performance de backend e automação de relatórios em uma plataforma corporativa de faturamento — análise e ajuste de processos batch e troca de etapas manuais de relatório por pipelines em script.",
      layers: ["Relatórios no BI Publisher", "Rating e billing batch (C)", "Plataforma Oracle BRM"],
    },
  },

  security: {
    title: "Como este site é protegido",
    eyebrow: "Detalhe — segurança",
    description:
      "Como o simonlaborde.com e o seu assistente de IA são protegidos: limites de gasto, validação de entrada, testes de prompt injection, cabeçalhos de segurança, checagens de CI e limitações conhecidas.",
    intro:
      "Este portfólio roda um assistente de IA ao vivo que custa dinheiro de verdade a cada resposta, então ele foi construído como um pequeno serviço de produção. Aqui está o que o protege, em linguagem simples — e o que ainda não protege.",
    items: [
      {
        title: "Limites de gasto no assistente de IA",
        body: "Cada visitante pode fazer até 8 perguntas a cada 10 minutos, e o site inteiro tem um teto de 200 respostas por dia. Os dois contadores ficam no Upstash Redis, então valem para todas as instâncias do servidor. Se o limitador não responder, o assistente se recusa a responder em vez de deixar as requisições passarem. Por trás disso, há um limite mensal de gasto em um workspace dedicado da Anthropic.",
      },
      {
        title: "Entradas limitadas e checadas antes",
        body: "Requisições acima de 16 KB são rejeitadas, cada mensagem é cortada em 800 caracteres, só as últimas 8 trocas são mantidas e cada chamada ao modelo tem teto de 1.500 tokens. Requisições malformadas são recusadas antes de chegar a qualquer limite ou ao modelo.",
      },
      {
        title: "Só este site pode chamar o assistente",
        body: "O endpoint do assistente só aceita requisições de navegador vindas do simonlaborde.com. Qualquer outro site recebe um 403 e nenhuma permissão para ler a resposta.",
      },
      {
        title: "Testes de prompt injection",
        body: "Os testes tentam sobrescrever as instruções, extrair o system prompt, trocar a persona do assistente, contrabandear instruções dentro de um texto colado, pressioná-lo a revelar dados privados e forçá-lo a dar um preço ou um prazo; um segundo grupo confere se cada resposta sobre a minha experiência bate com o meu perfil, avaliada por outro modelo de IA, e um terceiro tenta convencer o verificador de respostas a aprovar afirmações falsas. Os 17 passaram no site publicado em 14 de outubro de 2026. O assistente não tem ferramentas, não executa ações e só enxerga o conteúdo público deste site; as respostas aparecem como texto puro, nunca como HTML.",
      },
      {
        title: "Toda resposta é conferida antes de chegar a você",
        body: "Antes de uma resposta ser enviada, uma segunda chamada de IA confere cada afirmação contra o meu perfil. Se algo não tiver base, a resposta é reescrita uma vez; se ainda não passar — ou se a própria checagem falhar — você recebe um aviso curto com o meu e-mail, em vez de uma resposta não conferida.",
      },
      {
        title: "Suas perguntas e sua privacidade",
        body: "As perguntas são enviadas à API Claude, da Anthropic, para gerar a resposta e conferi-la. Este site não salva conversas, e seu endereço IP fica guardado por até 10 minutos para limitar o uso. Sem cookies, sem analytics.",
      },
      {
        title: "O formulário de contato",
        body: "Quando estiver ativado, o formulário de contato da página para empresas vai entregar as mensagens no meu e-mail pelo Resend, um serviço de envio de e-mails dos Estados Unidos; até lá, ao enviar, ele mostra o meu endereço de e-mail. Este site não guarda nem registra nada do que é enviado. Cada campo é validado no servidor, o formulário só aceita requisições deste site, um campo-armadilha escondido barra robôs simples, e limites de 3 mensagens por hora por conexão e 20 por dia seguram enxurradas — se o limitador não responder, o formulário se recusa a enviar.",
      },
      {
        title: "Cabeçalhos de segurança",
        body: "Uma Content Security Policy que só permite scripts, estilos, fontes e conexões do próprio site; HTTPS obrigatório com HSTS; sem MIME sniffing; uma política de referrer restrita; câmera, microfone, localização e pagamentos desativados; e nenhum outro site pode incorporar estas páginas em um frame.",
        link: {
          label: "Ver o relatório ao vivo no securityheaders.com",
          href: "https://securityheaders.com/?q=www.simonlaborde.com&followRedirects=on",
        },
      },
      {
        title: "Nenhuma requisição a terceiros",
        body: "As fontes são servidas pelo próprio site, então nem o build nem a visita ao site acessam o Google Fonts ou qualquer outro terceiro — e a Content Security Policy garante isso.",
      },
      {
        title: "Toda mudança passa pelas mesmas checagens",
        body: "Cada mudança é um pull request que precisa passar por lint, build de produção, smoke test no navegador, auditoria de dependências, varredura de segredos em todo o histórico do git (gitleaks) e análise estática com CodeQL. A branch principal é protegida sem exceção para admins — nem o dono consegue fazer push direto. O Dependabot sugere atualizações, e as actions do CI estão fixadas em hashes de commit exatos. A auditoria que montou tudo isso também encontrou uma vulnerabilidade crítica do Next.js na versão em produção (GHSA-vcvr-r3jv-pc5j), corrigida no mesmo dia.",
      },
      {
        title: "Dados pessoais",
        body: "O CV público é gerado sem número de telefone — o gerador se recusa a criá-lo se houver um — e o histórico do git foi reescrito para remover o número de todos os commits antigos.",
      },
    ],
    limitations: [
      "A Content Security Policy ainda permite scripts inline (‘unsafe-inline’). As páginas estáticas do Next.js precisam deles; removê-los exigiria renderizar cada página sob demanda.",
      "Os limites são por endereço IP, então alguém com muitos endereços poderia espalhar as requisições. O teto diário e o limite de gasto seguram o custo.",
      "As respostas da IA ainda podem exagerar. O assistente se baseia só no conteúdo deste site e é instruído a não enfeitar — confirme qualquer ponto importante diretamente comigo.",
      "O CDN da Vercel marca os arquivos estáticos públicos como legíveis por qualquer site (Access-Control-Allow-Origin: *). Isso é inofensivo para conteúdo público; o endpoint do assistente usa a própria lista de origens permitidas.",
      "O formulário de contato não tem CAPTCHA, que exigiria um script de terceiros. O campo-armadilha só barra robôs simples; os limites por hora e por dia seguram o resto.",
    ],
    reportLine: `Encontrou um problema? Mande um e-mail para ${site.links.email} — o endereço também está em /.well-known/security.txt. Por favor, não abra uma issue pública para problemas de segurança.`,
    securityMd: "https://github.com/simonrl13/simonrl13.github.io/blob/main/SECURITY.md",
  },

  /* TODO(simon): confirmar as listas "inclui" e cada linha de `data` antes do
     merge (mesmas regras de content/services.ts). "Nunca usados para treinar
     modelos" fica de fora até ser verificado nos termos de cada provedor. */
  services: {
    title: "Projetos para empresas",
    eyebrow: "Para empresas",
    description:
      "Dois projetos com escopo fechado para pequenas empresas: um assistente que responde seus clientes no WhatsApp a partir dos seus próprios documentos, e o processamento de documentos que acaba com a redigitação de recibos, boletos e papéis escaneados.",
    intro:
      "Dois projetos com escopo fechado para pequenas empresas, feitos por mim de ponta a ponta e rodando na minha infraestrutura. Cada um está descrito pelo resultado que você recebe, não pela tecnologia por trás.",

    labels: {
      included: "O que está incluído",
      audience: "Para quem é",
      pilot: "Como funciona o piloto",
      timeline: "Prazo",
      price: "Investimento",
    },

    pilot: "Primeiro, um piloto com escopo fechado: o escopo é combinado por escrito, 50% é pago no início, e os primeiros clientes têm desconto.",

    offers: [
      {
        id: "assistant",
        kicker: "Assistente de atendimento",
        outcome: "Seus clientes recebem respostas no WhatsApp às 23h, a partir dos seus próprios documentos.",
        audience: "Escritórios de contabilidade, clínicas e quem vende cursos.",
        included: [
          "Um assistente configurado com os documentos que você já tem: perguntas frequentes, tabelas de preço, políticas, catálogo.",
          "Respostas no WhatsApp da sua empresa, a qualquer hora do dia.",
          "O que não estiver nos seus documentos é encaminhado para você, em vez de ser inventado.",
          "Limites de uso e de gasto, para o custo de uso ficar previsível.",
        ],
        timeline: "Prazo definido na proposta",
        price: "Peça um orçamento",
      },
      {
        id: "documents",
        kicker: "Processamento de documentos",
        outcome: "Pare de redigitar recibos, boletos e documentos escaneados.",
        audience: "Escritórios de contabilidade e distribuidoras.",
        included: [
          "Os campos que você realmente usa — valores, datas, vencimentos, CNPJ/CPF — extraídos automaticamente.",
          "Funciona com fotos, PDFs e papel escaneado.",
          "Campos com dúvida são marcados para uma pessoa conferir.",
          "Resultado entregue numa planilha ou num formato que o seu sistema aceite importar.",
        ],
        timeline: "Prazo definido na proposta",
        price: "Peça um orçamento",
      },
    ],

    data: {
      title: "Como trato seus dados",
      intro: "Em linguagem simples — e por escrito no contrato do projeto.",
      items: [
        // TODO(simon): teste de isolamento por cliente obrigatório antes do primeiro piloto.
        {
          title: "Na minha infraestrutura, isolados por cliente",
          body: "Por padrão, os dados do seu projeto ficam guardados numa infraestrutura que eu opero, não nas suas contas, e separados por cliente: nenhum cliente tem acesso aos dados de outro.",
        },
        {
          title: "Processados por um provedor de IA nos Estados Unidos",
          body: "A IA que lê seus documentos e mensagens é operada por um provedor sediado nos Estados Unidos. Pela LGPD, isso é uma transferência internacional de dados, e ela fica descrita no contrato antes de qualquer dado ser enviado.",
        },
        {
          title: "Excluídos ao fim do projeto",
          body: "Quando o projeto termina, os dados do cliente que eu guardo para ele são excluídos. Os provedores usados (IA e e-mail) mantêm registros temporários conforme seus próprios termos, descritos no contrato.",
        },
      ],
    },

    form: {
      title: "Conte sobre a sua empresa",
      intro: "Eu respondo por e-mail.",
      privacy:
        "Este formulário coleta seu nome, empresa, e-mail e mensagem. Quando estiver ativado, eles vão chegar à minha caixa de entrada por e-mail, pelo Resend, um serviço de e-mail dos Estados Unidos, só para eu poder responder; até lá, ao enviar o formulário, você vê o meu endereço de e-mail. O Resend mantém uma cópia temporária do envio. Nada fica guardado neste site.",
      name: "Seu nome",
      business: "Empresa",
      email: "E-mail",
      message: "O que você gostaria de resolver?",
      consent:
        "Concordo com o uso destas informações para responder à minha mensagem, como descrito em “Como trato seus dados”.",
      submit: "Enviar",
      sending: "Enviando…",
      sent: "Obrigado — sua mensagem foi enviada. Eu respondo por e-mail.",
      failed: "Não foi possível enviar sua mensagem agora. Tente de novo ou mande um e-mail para {email}.",
    },

    server: {
      invalid: "Confira os campos e tente de novo.",
      consent: "Marque a caixa de consentimento para eu poder responder.",
      ip: "Muitas mensagens vindas desta conexão — tente de novo mais tarde ou mande um e-mail para {email}.",
      global: "O formulário atingiu o limite de hoje. Mande um e-mail para {email}.",
      unavailable: "O formulário está indisponível por um instante — tente de novo em breve ou mande um e-mail para {email}.",
      notConfigured: "O formulário ainda não está configurado. Mande um e-mail para {email}.",
    },

    footerLink: "Disponível para projetos",
  },
};
