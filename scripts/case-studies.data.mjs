// Source of truth for /case-studies/ pages. Each entry generates an EN page
// at case-studies/{slug}.html and an ES page at es/case-studies/{slug}.html.
// Keep content tight — these pages target long-tail RevOps search queries.

export const CASE_STUDIES = [
  {
    slug: 'territory-design-account-coverage',
    pdfs: [{ href: '/samples/territory-account-model.pdf', en: 'View the Territory Model PDF', es: 'Ver el Modelo de Territorios (PDF)' }],
    keywords: 'territory design, account coverage, sales territory planning, account segmentation, Salesforce territory model',
    en: {
      title: 'Territory Design & Account Coverage Model — RevOps Case Study | Jaime M. Mena',
      description: 'How I built an account segmentation, assignment, and coverage model for a multi-segment B2B SaaS sales organization. Tiers, rules, hierarchical rollups, and the operating cadence behind it.',
      ogAlt: 'Territory Design Case Study — Jaime M. Mena',
      h1: 'Territory Design & Account Coverage Model',
      sub: 'Northstar SaaS · Territory Planning',
      lead: 'Most territory models break because the math is fine but the operating cadence around them is not. This is the model and the playbook that holds it together for a multi-segment B2B SaaS sales organization.',
      problem: {
        heading: 'The problem',
        body: 'A 40-rep sales org with overlapping account claims, no shared definition of "named account" between AMER and EMEA, and a leadership team trying to roll up forecast attainment by segment using three different spreadsheets a week. Reps were getting credit for the same logos across segments. Pipeline coverage looked healthy in aggregate and underfunded in every segment when you actually counted.',
      },
      approach: {
        heading: 'The approach',
        body: 'Start from the ICP and the TAM, not from where reps happen to live. Segment accounts into tiers based on revenue potential, fit score, and intent signals. Build assignment rules in Salesforce that enforce one owner per account at all times, with carve-out exceptions documented in a single sheet that the deal desk owns. Stack the segments into a hierarchy so leadership sees AMER → SMB / Mid-Market / Enterprise without manual stitching every Friday.',
      },
      outcome: {
        heading: 'The outcome',
        items: [
          'Single source of truth for "who owns this account" across the whole sales org.',
          'Hierarchical rollups for AMER, EMEA, and ROW that match the way leadership talks about the business.',
          'Coverage gaps surfaced before the quarter started instead of after — the model flags segments where pipeline-to-quota ratio drops below 3x, so leadership can rebalance rep loads early.',
          'Quarterly territory rebalancing cut from a multi-week political project to a two-hour exec review with the model as the conversation anchor.',
        ],
      },
      lessons: {
        heading: 'What I would do differently',
        body: 'Bake in a quarterly review cadence from day one. The first iteration treated the model as a static artifact; reality is that the ICP shifts, comp plans change, and reps leave. The model needs a steward and a calendar event, or it rots within two quarters.',
      },
    },
    es: {
      title: 'Diseño de Territorios y Modelo de Cobertura de Cuentas — Caso de Estudio RevOps | Jaime M. Mena',
      description: 'Cómo construí un modelo de segmentación, asignación y cobertura de cuentas para una organización de ventas B2B SaaS multi-segmento. Tiers, reglas, rollups jerárquicos y la cadencia operativa detrás.',
      ogAlt: 'Caso de Estudio de Diseño de Territorios — Jaime M. Mena',
      h1: 'Diseño de Territorios y Modelo de Cobertura de Cuentas',
      sub: 'Northstar SaaS · Planificación de Territorios',
      lead: 'La mayoría de los modelos de territorios fallan porque las matemáticas están bien pero la cadencia operativa alrededor no. Este es el modelo y el playbook que lo mantiene en pie para una organización de ventas B2B SaaS multi-segmento.',
      problem: {
        heading: 'El problema',
        body: 'Una org de ventas de 40 representantes con reclamos de cuentas superpuestos, sin una definición compartida de "cuenta nombrada" entre AMER y EMEA, y un liderazgo intentando hacer rollup del attainment por segmento usando tres hojas de cálculo distintas cada semana. Los representantes obtenían crédito por las mismas marcas en distintos segmentos. La cobertura de pipeline se veía sana en agregado y desfinanciada en cada segmento cuando realmente contabas.',
      },
      approach: {
        heading: 'El enfoque',
        body: 'Empezar desde el ICP y el TAM, no desde dónde viven los representantes. Segmentar cuentas en tiers basados en potencial de ingresos, fit score y señales de intención. Construir reglas de asignación en Salesforce que enforcen un solo dueño por cuenta en todo momento, con excepciones documentadas en una hoja que pertenece al deal desk. Apilar los segmentos en una jerarquía para que el liderazgo vea AMER → SMB / Mid-Market / Enterprise sin coser manualmente cada viernes.',
      },
      outcome: {
        heading: 'El resultado',
        items: [
          'Fuente única de verdad para "quién es dueño de esta cuenta" en toda la org de ventas.',
          'Rollups jerárquicos para AMER, EMEA y ROW que coinciden con la forma en que el liderazgo habla del negocio.',
          'Brechas de cobertura identificadas antes de que iniciara el trimestre — el modelo señala segmentos donde la razón pipeline-a-cuota baja de 3x, para que el liderazgo rebalancee cargas temprano.',
          'Rebalanceo trimestral de territorios reducido de un proyecto político de varias semanas a una revisión ejecutiva de dos horas con el modelo como ancla.',
        ],
      },
      lessons: {
        heading: 'Qué haría diferente',
        body: 'Incorporar una cadencia de revisión trimestral desde el día uno. La primera iteración trataba al modelo como un artefacto estático; la realidad es que el ICP cambia, los planes de compensación se mueven y los representantes se van. El modelo necesita un dueño y un evento en el calendario, o se pudre en dos trimestres.',
      },
    },
  },

  {
    slug: 'forecast-inspection-framework',
    pdfs: [{ href: '/samples/forecast-framework.pdf', en: 'View the Forecast Framework PDF', es: 'Ver el Marco de Pronósticos (PDF)' }],
    keywords: 'sales forecast inspection, MEDDPICC, pipeline review framework, forecast accuracy, stage exit criteria',
    en: {
      title: 'Forecast Inspection & Pipeline Review Framework — RevOps Case Study | Jaime M. Mena',
      description: 'A weekly forecast review framework with stage exit criteria, deal inspection checklists, red-flag heuristics, and MEDDPICC checkpoints. Lifted forecast accuracy ~18% in a prior role.',
      ogAlt: 'Forecast Inspection Framework — Jaime M. Mena',
      h1: 'Forecast Inspection & Pipeline Review Framework',
      sub: 'Northstar SaaS · Forecast Operations',
      lead: 'A weekly forecasting cadence the CRO can actually trust. Stage exit criteria reps cannot fudge, deal inspection checklists that surface the same patterns every time, and MEDDPICC qualification checkpoints anchored to behavior, not intuition.',
      problem: {
        heading: 'The problem',
        body: 'Forecast accuracy bouncing 25%+ quarter over quarter. Commit calls full of "this one is going to close" with no observable evidence behind the claim. Reps habituated to pulling deals across the line on the last day of the quarter and getting away with it. Leadership had no way to spot which deals would actually close vs which were happy talk until it was too late.',
      },
      approach: {
        heading: 'The approach',
        body: 'Define stage exit criteria as observable, binary behaviors — not soft milestones. A deal is in Stage 3 if and only if these four things are documented in Salesforce. Pair the stage model with MEDDPICC qualification: each letter has a required field, and the forecast call begins with deals that are missing any of them. Red-flag heuristics (stalled > 21 days, single-threaded, no compelling event) auto-tag deals before the meeting, so the conversation starts where it matters.',
      },
      outcome: {
        heading: 'The outcome',
        items: [
          'Forecast accuracy lifted ~18% within two quarters of rollout.',
          'Commit call duration cut by ~40% because the prep was already done before the meeting started.',
          'A shared vocabulary between reps, frontline managers, and the CRO — when someone says "this is a clean Stage 4," everyone now means the same thing.',
          'Faster escalation of at-risk deals — red flags surface them on Monday instead of the end of the quarter.',
        ],
      },
      lessons: {
        heading: 'What I would do differently',
        body: 'Push harder on enablement at the rollout. The framework only works if reps internalize the qualification questions — not just answer them in Salesforce. The first quarter was light on coaching investment, and the second quarter\'s accuracy gain compounded once managers started running pipeline reviews with the same vocabulary the framework introduced.',
      },
    },
    es: {
      title: 'Marco de Inspección de Pronósticos y Revisión de Pipeline — Caso de Estudio RevOps | Jaime M. Mena',
      description: 'Un marco semanal de revisión de pronósticos con criterios de salida por etapa, checklists de inspección de deals, heurísticas de señales de riesgo y checkpoints MEDDPICC. Subió la precisión ~18% en un rol previo.',
      ogAlt: 'Marco de Inspección de Pronósticos — Jaime M. Mena',
      h1: 'Marco de Inspección de Pronósticos y Revisión de Pipeline',
      sub: 'Northstar SaaS · Operaciones de Pronóstico',
      lead: 'Una cadencia semanal de pronósticos en la que el CRO realmente puede confiar. Criterios de salida por etapa que los representantes no pueden adulterar, checklists de inspección de deals que sacan los mismos patrones cada vez, y checkpoints MEDDPICC anclados en comportamiento, no en intuición.',
      problem: {
        heading: 'El problema',
        body: 'Precisión de pronósticos saltando 25%+ trimestre a trimestre. Llamadas de commit llenas de "este va a cerrar" sin evidencia observable detrás. Representantes habituados a empujar deals a la línea el último día del trimestre y salirse con la suya. El liderazgo no tenía forma de distinguir qué deals realmente cerrarían vs cuáles eran charla optimista hasta que era demasiado tarde.',
      },
      approach: {
        heading: 'El enfoque',
        body: 'Definir criterios de salida por etapa como comportamientos observables y binarios — no hitos blandos. Un deal está en Etapa 3 si y solo si estas cuatro cosas están documentadas en Salesforce. Acompañar el modelo de etapas con calificación MEDDPICC: cada letra tiene un campo requerido, y la llamada de pronóstico comienza con los deals a los que les falta alguno. Heurísticas de señales de riesgo (estancado > 21 días, single-threaded, sin evento detonante) auto-etiquetan deals antes de la reunión, para que la conversación empiece donde importa.',
      },
      outcome: {
        heading: 'El resultado',
        items: [
          'Precisión del pronóstico subió ~18% en dos trimestres de adopción.',
          'Duración de la llamada de commit recortada ~40% porque la preparación ya estaba hecha antes de la reunión.',
          'Un vocabulario compartido entre representantes, managers de primera línea y el CRO — cuando alguien dice "esto es una Etapa 4 limpia", todos significan lo mismo.',
          'Escalación más rápida de deals en riesgo — las señales de riesgo los identifican el lunes en vez de al final del trimestre.',
        ],
      },
      lessons: {
        heading: 'Qué haría diferente',
        body: 'Empujar más fuerte en enablement durante el rollout. El marco solo funciona si los representantes internalizan las preguntas de calificación — no solo las responden en Salesforce. El primer trimestre fue ligero en inversión de coaching, y la ganancia de precisión del segundo trimestre se compuso una vez que los managers empezaron a correr revisiones de pipeline con el mismo vocabulario que el marco introdujo.',
      },
    },
  },

  {
    slug: 'executive-gtm-dashboard',
    pdfs: [{ href: '/samples/executive-gtm-dashboard.pdf', en: 'View the Executive Dashboard PDF', es: 'Ver el Dashboard Ejecutivo (PDF)' }],
    keywords: 'GTM dashboard, executive sales reporting, pipeline health, BDR activity, marketing funnel, KPI scorecard',
    en: {
      title: 'Executive GTM Health Dashboard — RevOps Case Study | Jaime M. Mena',
      description: 'A weekly executive scorecard tracking pipeline health, marketing funnel, BDR activity, and forecast confidence across segments. Built so the CRO can answer "how are we doing" in one screen.',
      ogAlt: 'Executive GTM Health Dashboard — Jaime M. Mena',
      h1: 'Executive GTM Health Dashboard',
      sub: 'Northstar SaaS · Executive Reporting',
      lead: 'One screen the CRO opens every Monday morning and immediately knows whether the quarter is on track. Pipeline health, marketing funnel, BDR activity, and forecast confidence — segment by segment, with no spreadsheet stitching.',
      problem: {
        heading: 'The problem',
        body: 'The exec team was reading three different weekly reports from Sales, Marketing, and BDR ops, each with its own definition of pipeline and conversion. Numbers never reconciled. The CRO would spend the first 20 minutes of every QBR triangulating "is this our actual pipeline or yours."',
      },
      approach: {
        heading: 'The approach',
        body: 'One canonical data model upstream of the dashboard. Marketing-qualified-leads, sales-qualified-leads, opportunities, and deals all defined once, with a single source for stage and segment. Build the visual layer last, in Looker / Tableau, anchored on the same fields. Top of the dashboard answers "how are we doing this quarter" in 10 seconds. Below the fold, drill-downs answer "why" for each segment.',
      },
      outcome: {
        heading: 'The outcome',
        items: [
          'A single weekly scorecard that replaced three previously-conflicting reports.',
          'Pipeline-coverage trend visible at a glance by segment — red/yellow/green status against 3x quota target.',
          'BDR activity tied to downstream pipeline contribution, so the team could finally evaluate the marketing funnel as a system instead of as separate widgets.',
          'Faster QBR prep — the dashboard IS the deck, with one slide per drill-down.',
        ],
      },
      lessons: {
        heading: 'What I would do differently',
        body: 'Build the data model spec with Marketing and BDR ops in the room from day one. The first version of the dashboard exposed definitional disagreements that should have been resolved before any visualization work happened. Two weeks of "the dashboard is wrong" were really "we never agreed on what an SQL is."',
      },
    },
    es: {
      title: 'Dashboard Ejecutivo de Salud GTM — Caso de Estudio RevOps | Jaime M. Mena',
      description: 'Un scorecard ejecutivo semanal que rastrea salud de pipeline, embudo de marketing, actividad de BDR y confianza del pronóstico por segmento. Construido para que el CRO pueda responder "cómo vamos" en una sola pantalla.',
      ogAlt: 'Dashboard Ejecutivo de Salud GTM — Jaime M. Mena',
      h1: 'Dashboard Ejecutivo de Salud GTM',
      sub: 'Northstar SaaS · Reportes Ejecutivos',
      lead: 'Una sola pantalla que el CRO abre cada lunes en la mañana y sabe inmediatamente si el trimestre va en línea. Salud de pipeline, embudo de marketing, actividad de BDR y confianza del pronóstico — segmento por segmento, sin coser hojas de cálculo.',
      problem: {
        heading: 'El problema',
        body: 'El equipo ejecutivo estaba leyendo tres reportes semanales distintos de Ventas, Marketing y BDR ops, cada uno con su propia definición de pipeline y conversión. Los números nunca cuadraban. El CRO pasaba los primeros 20 minutos de cada QBR triangulando "¿este es nuestro pipeline real o el tuyo?".',
      },
      approach: {
        heading: 'El enfoque',
        body: 'Un modelo de datos canónico aguas arriba del dashboard. Marketing-qualified-leads, sales-qualified-leads, oportunidades y deals todos definidos una sola vez, con una fuente única para etapa y segmento. Construir la capa visual al final, en Looker / Tableau, anclada en los mismos campos. La parte superior del dashboard responde "cómo vamos este trimestre" en 10 segundos. Bajo la línea de pliegue, los drill-downs responden el "por qué" para cada segmento.',
      },
      outcome: {
        heading: 'El resultado',
        items: [
          'Un solo scorecard semanal que reemplazó tres reportes previamente conflictivos.',
          'Tendencia de cobertura de pipeline visible de un vistazo por segmento — estado rojo/amarillo/verde contra meta de 3x cuota.',
          'Actividad de BDR conectada con la contribución de pipeline aguas abajo, para que el equipo finalmente pudiera evaluar el embudo de marketing como sistema en vez de como widgets separados.',
          'Preparación de QBR más rápida — el dashboard ES la presentación, con una slide por drill-down.',
        ],
      },
      lessons: {
        heading: 'Qué haría diferente',
        body: 'Construir el spec del modelo de datos con Marketing y BDR ops en la sala desde el día uno. La primera versión del dashboard expuso desacuerdos de definición que debían resolverse antes de cualquier trabajo de visualización. Dos semanas de "el dashboard está mal" eran realmente "nunca acordamos qué es un SQL".',
      },
    },
  },

  {
    slug: 'sales-commission-plan',
    pdfs: [
      { href: '/samples/commissions-playbook.pdf', en: 'View the Playbook PDF', es: 'Ver la Guía (PDF)' },
      { href: '/samples/commission-calculator.pdf', en: 'View the Calculator PDF', es: 'Ver la Calculadora (PDF)' },
    ],
    keywords: 'sales commission plan, OTE design, accelerators, MEDDPICC kickers, SPIF, sales compensation, commission calculator',
    en: {
      title: 'Sales Commission Plan & Calculator — RevOps Case Study | Jaime M. Mena',
      description: 'An end-to-end commission plan with tiered accelerators, MEDDPICC compliance kickers, SPIF programs, and a dynamic Excel calculator for attainment tracking, payout modeling, and scenario analysis.',
      ogAlt: 'Sales Commission Plan Case Study — Jaime M. Mena',
      h1: 'Sales Commission Plan & Calculator',
      sub: 'North Star Analytics · Compensation Design',
      lead: 'A compensation plan that drives the behavior leadership says it wants — and a working Excel calculator so reps can self-verify their commission instead of opening tickets with Finance every two weeks. Built for an 8-rep B2B SaaS team.',
      problem: {
        heading: 'The problem',
        body: 'A comp plan that read clean on a PDF but unraveled the moment a deal carried a partial-year discount, a multi-year ramp, or a mid-quarter amendment. Reps were spending hours every month reconstructing their own commission. Finance was spending more hours arguing with reps. Sales leadership couldn\'t answer "is this plan still driving the right deals" because nobody had a clear payout history by deal type.',
      },
      approach: {
        heading: 'The approach',
        body: 'Design the plan and the calculator in parallel — if a clause cannot be modeled cleanly, it does not belong in the plan. Tier the accelerators against historical attainment so 70th-percentile reps see a real upside without breaking the comp ratio. Layer in MEDDPICC compliance kickers on Enterprise deals — small payout, big behavioral lever. SPIFs as time-boxed campaigns with explicit start/end and a deal-type filter, not standing programs. The calculator outputs a deal-by-deal payout trace so any rep can see exactly how their number was built.',
      },
      outcome: {
        heading: 'The outcome',
        items: [
          'Time spent reconciling commissions cut from hours per rep per month to minutes.',
          'A working calculator the team uses as a forecasting tool — reps now model their own quarter against pipeline before commit calls.',
          'Comp-ratio compliance maintained while introducing accelerators that meaningfully reward overperformance.',
          'MEDDPICC qualification adoption lifted because the comp plan made it visible — small kicker, large signal.',
        ],
      },
      lessons: {
        heading: 'What I would do differently',
        body: 'Run the calculator against the prior two quarters of closed-won data BEFORE rolling out the plan, with reps in the room. The first version surfaced two edge cases that the model handled correctly but felt unfair to the reps when they saw their own historical numbers re-computed. A retro pass would have caught them before the all-hands.',
      },
    },
    es: {
      title: 'Plan de Comisiones de Ventas y Calculadora — Caso de Estudio RevOps | Jaime M. Mena',
      description: 'Un plan de comisiones integral con aceleradores escalonados, bonos de cumplimiento MEDDPICC, programas SPIF, y una calculadora de Excel dinámica para seguimiento de logros, modelado de pagos y análisis de escenarios.',
      ogAlt: 'Caso de Estudio del Plan de Comisiones — Jaime M. Mena',
      h1: 'Plan de Comisiones de Ventas y Calculadora',
      sub: 'North Star Analytics · Diseño de Compensación',
      lead: 'Un plan de compensación que impulsa el comportamiento que el liderazgo dice querer — y una calculadora de Excel funcional para que los representantes verifiquen sus comisiones en vez de abrir tickets con Finanzas cada dos semanas. Construido para un equipo B2B SaaS de 8 representantes.',
      problem: {
        heading: 'El problema',
        body: 'Un plan de compensación que se leía limpio en un PDF pero se deshacía en el momento en que un deal traía un descuento parcial de año, una rampa multi-anual, o una enmienda a mitad de trimestre. Los representantes pasaban horas cada mes reconstruyendo su propia comisión. Finanzas pasaba más horas discutiendo con representantes. El liderazgo de ventas no podía responder "¿este plan sigue impulsando los deals correctos?" porque nadie tenía un historial claro de pagos por tipo de deal.',
      },
      approach: {
        heading: 'El enfoque',
        body: 'Diseñar el plan y la calculadora en paralelo — si una cláusula no se puede modelar limpiamente, no pertenece al plan. Escalonar los aceleradores contra el attainment histórico para que los representantes en el percentil 70 vean un upside real sin romper el ratio de compensación. Sumar kickers por cumplimiento MEDDPICC en deals Enterprise — pago pequeño, palanca conductual grande. SPIFs como campañas con tiempo definido con inicio/fin explícitos y un filtro por tipo de deal, no programas permanentes. La calculadora produce un trazado de pago deal-por-deal para que cualquier representante vea exactamente cómo se construyó su número.',
      },
      outcome: {
        heading: 'El resultado',
        items: [
          'Tiempo dedicado a reconciliar comisiones reducido de horas por representante por mes a minutos.',
          'Una calculadora funcional que el equipo usa como herramienta de pronóstico — los representantes ahora modelan su propio trimestre contra el pipeline antes de las llamadas de commit.',
          'Cumplimiento del comp-ratio mantenido mientras se introdujeron aceleradores que recompensan significativamente el sobre-cumplimiento.',
          'Adopción de calificación MEDDPICC subió porque el plan de comisiones la hizo visible — kicker pequeño, señal grande.',
        ],
      },
      lessons: {
        heading: 'Qué haría diferente',
        body: 'Correr la calculadora contra los dos trimestres anteriores de closed-won ANTES de lanzar el plan, con representantes en la sala. La primera versión sacó dos casos límite que el modelo manejaba correctamente pero que se sintieron injustos para los representantes cuando vieron sus propios números históricos recalculados. Un pase retrospectivo los habría atrapado antes del all-hands.',
      },
    },
  },

  {
    slug: 'multi-touch-attribution',
    pdfs: [{ href: '/samples/attribution-model.pdf', en: 'View the Attribution Model PDF', es: 'Ver el Modelo de Atribución (PDF)' }],
    keywords: 'multi-touch attribution, marketing attribution model, first-touch, last-touch, W-shaped attribution, channel ROI, budget reallocation',
    en: {
      title: 'Multi-Touch Attribution Analysis — RevOps Case Study | Jaime M. Mena',
      description: 'A channel attribution analysis comparing first-touch, last-touch, linear, and W-shaped models across $4.2M in closed-won revenue. Channel efficiency findings and a budget reallocation recommendation.',
      ogAlt: 'Multi-Touch Attribution — Jaime M. Mena',
      h1: 'Multi-Touch Attribution Analysis',
      sub: 'Northstar SaaS · Marketing Attribution',
      lead: 'A side-by-side comparison of four attribution models across $4.2M in closed-won revenue, plus the budget reallocation recommendation the CFO actually signed off on. Built to settle the perennial Sales-vs-Marketing argument about credit.',
      problem: {
        heading: 'The problem',
        body: 'Marketing was running first-touch and crediting paid social with 35% of revenue. Sales was running last-touch and crediting outbound with 60%. The CFO was sitting between them with a $1.8M marketing budget asking which channels to fund next quarter, and getting two different answers depending on who was at the table.',
      },
      approach: {
        heading: 'The approach',
        body: 'Pull a clean 12-month closed-won dataset with every touchpoint timestamped — paid, organic, outbound, events, content. Run all four standard models against the same data: first-touch, last-touch, linear, and W-shaped (with weight at first-touch, opportunity-creation, and closed-won). Show the contribution per channel under each model, side by side. Layer in cost data to compute channel ROI and CAC, not just attributed revenue.',
      },
      outcome: {
        heading: 'The outcome',
        items: [
          'A single chart the CFO, CMO, and CRO could all agree on — even if they each preferred a different model.',
          'Budget reallocation recommendation that defunded two underperforming paid channels and shifted ~22% of the marketing budget into content and events, where the W-shaped model showed the strongest mid-funnel lift.',
          'A clear answer to "are we overspending on attribution-credited channels with poor CAC" — yes, in two cases, and the data justified pulling back.',
          'Subsequent quarter\'s closed-won revenue tracked the reallocation with measurable lift in pipeline-to-close conversion.',
        ],
      },
      lessons: {
        heading: 'What I would do differently',
        body: 'Bring Marketing into the model selection early. Marketing teams have a legitimate preference for first-touch because it values their top-of-funnel work, and dismissing that preference as bias misses the point. The right answer is multi-model attribution as a standing report, not picking one model and forcing everyone to use it.',
      },
    },
    es: {
      title: 'Análisis de Atribución Multi-Touch — Caso de Estudio RevOps | Jaime M. Mena',
      description: 'Análisis de atribución de canales comparando modelos first-touch, last-touch, lineal y W-shaped en $4.2M de ingresos cerrados. Hallazgos de eficiencia por canal y una recomendación de reasignación de presupuesto.',
      ogAlt: 'Atribución Multi-Touch — Jaime M. Mena',
      h1: 'Análisis de Atribución Multi-Touch',
      sub: 'Northstar SaaS · Atribución de Marketing',
      lead: 'Una comparación lado-a-lado de cuatro modelos de atribución en $4.2M de ingresos cerrados, más la recomendación de reasignación de presupuesto que el CFO efectivamente firmó. Construido para zanjar el eterno debate Ventas-vs-Marketing sobre crédito.',
      problem: {
        heading: 'El problema',
        body: 'Marketing estaba corriendo first-touch y acreditando paid social con 35% de los ingresos. Ventas estaba corriendo last-touch y acreditando outbound con 60%. El CFO estaba sentado entre ellos con un presupuesto de marketing de $1.8M preguntando qué canales financiar el próximo trimestre, y obteniendo dos respuestas distintas dependiendo de quién estaba en la mesa.',
      },
      approach: {
        heading: 'El enfoque',
        body: 'Extraer un dataset limpio de 12 meses de closed-won con cada touchpoint con timestamp — paid, orgánico, outbound, eventos, contenido. Correr los cuatro modelos estándar contra los mismos datos: first-touch, last-touch, lineal y W-shaped (con peso en first-touch, creación de oportunidad y closed-won). Mostrar la contribución por canal bajo cada modelo, lado a lado. Sumar datos de costo para calcular ROI por canal y CAC, no solo ingresos atribuidos.',
      },
      outcome: {
        heading: 'El resultado',
        items: [
          'Una sola gráfica con la que el CFO, CMO y CRO podían estar de acuerdo — aun si cada uno prefería un modelo distinto.',
          'Recomendación de reasignación de presupuesto que defundió dos canales pagados de bajo desempeño y movió ~22% del presupuesto de marketing a contenido y eventos, donde el modelo W-shaped mostraba el levantamiento más fuerte de medio embudo.',
          'Una respuesta clara a "¿estamos sobregastando en canales con buen crédito de atribución pero CAC pobre?" — sí, en dos casos, y los datos justificaron recortar.',
          'Los ingresos cerrados del trimestre siguiente reflejaron la reasignación con un levantamiento medible en la conversión pipeline-a-cierre.',
        ],
      },
      lessons: {
        heading: 'Qué haría diferente',
        body: 'Traer a Marketing a la selección del modelo temprano. Los equipos de Marketing tienen una preferencia legítima por first-touch porque valora su trabajo de top-of-funnel, y descartar esa preferencia como sesgo pierde el punto. La respuesta correcta es atribución multi-modelo como reporte permanente, no elegir un modelo y forzar a todos a usarlo.',
      },
    },
  },

  {
    slug: 'customer-health-score',
    pdfs: [{ href: '/samples/health-score-framework.pdf', en: 'View the Health Score PDF', es: 'Ver el Marco de Salud del Cliente (PDF)' }],
    keywords: 'customer health score, churn prevention, customer success framework, weighted scoring model, risk tier playbook, NRR',
    en: {
      title: 'Customer Health Score & Churn Prevention Framework — RevOps Case Study | Jaime M. Mena',
      description: 'A weighted composite health scoring model using 6 data sources with automated risk tiers, SLA-bound response playbooks, and an 8-week implementation roadmap targeting $3.2M in preventable churn.',
      ogAlt: 'Customer Health Score — Jaime M. Mena',
      h1: 'Customer Health Score & Churn Prevention Framework',
      sub: 'Northstar SaaS · Customer Success',
      lead: 'A weighted composite health score, automated risk tiering, and a CSM playbook with SLAs — built to surface preventable churn 60–90 days before renewal, not 60–90 days after notice. The model targeted $3.2M in at-risk ARR.',
      problem: {
        heading: 'The problem',
        body: 'CSMs were getting notice of an at-risk account when the customer sent a non-renewal email — too late to actually save it. Health signals existed scattered across product analytics, support tickets, NPS, executive engagement, and billing, but no single owner watched them together. Net Revenue Retention was leaking ~7 points off-target.',
      },
      approach: {
        heading: 'The approach',
        body: 'Define a weighted composite score across 6 signals: product usage trend, support ticket sentiment, NPS, executive sponsor activity, billing-on-time, and contract-renewal proximity. Each signal carries a weight that reflects how predictive it is of churn at this customer segment. Auto-bucket accounts into Green / Yellow / Red. Yellow triggers a CSM playbook with a 7-day SLA; Red triggers an exec-sponsor escalation with a 48-hour SLA. The model recomputes weekly, and CSMs see their book sorted by score in their morning view.',
      },
      outcome: {
        heading: 'The outcome',
        items: [
          'Yellow-tier accounts converting back to Green at ~58% rate when the playbook was followed within SLA — measurable proof that early intervention works.',
          'Two enterprise saves in the first quarter post-launch, jointly worth ~$420K ARR, surfaced by the model before the customers raised the issue.',
          'NRR variance compressed quarter-over-quarter as renewal forecasting got better-anchored on health-score trends instead of CSM gut feel.',
          'A shared definition of "at-risk" across CSM, Sales, and Exec sponsor — when the system says Red, everyone now means the same thing.',
        ],
      },
      lessons: {
        heading: 'What I would do differently',
        body: 'Tune the weights with the CSM team in the room before launch, not after. The first weight set was correct in aggregate but misweighted product-usage for the smallest segment (where low usage is normal and not a churn signal). Three weeks of false-Red alerts eroded CSM trust in the score before we recalibrated. A pre-launch backtest with a domain-expert review would have caught it.',
      },
    },
    es: {
      title: 'Marco de Puntaje de Salud del Cliente y Prevención de Churn — Caso de Estudio RevOps | Jaime M. Mena',
      description: 'Un modelo de puntaje de salud compuesto ponderado usando 6 fuentes de datos con niveles de riesgo automatizados, playbooks de respuesta con SLA y una hoja de ruta de 8 semanas enfocada en $3.2M en churn prevenible.',
      ogAlt: 'Puntaje de Salud del Cliente — Jaime M. Mena',
      h1: 'Marco de Puntaje de Salud del Cliente y Prevención de Churn',
      sub: 'Northstar SaaS · Customer Success',
      lead: 'Un puntaje de salud compuesto ponderado, tiering de riesgo automatizado y un playbook para CSM con SLAs — construido para detectar churn prevenible 60–90 días antes de la renovación, no 60–90 días después del aviso. El modelo apuntaba a $3.2M en ARR en riesgo.',
      problem: {
        heading: 'El problema',
        body: 'Los CSMs recibían aviso de una cuenta en riesgo cuando el cliente enviaba un email de no-renovación — demasiado tarde para salvarla realmente. Las señales de salud existían dispersas en analítica de producto, tickets de soporte, NPS, engagement del ejecutivo, y facturación, pero ningún dueño las vigilaba en conjunto. El Net Revenue Retention estaba filtrando ~7 puntos bajo la meta.',
      },
      approach: {
        heading: 'El enfoque',
        body: 'Definir un puntaje compuesto ponderado a través de 6 señales: tendencia de uso del producto, sentimiento de tickets de soporte, NPS, actividad del sponsor ejecutivo, facturación a tiempo y proximidad a renovación de contrato. Cada señal carga un peso que refleja qué tan predictiva es del churn en ese segmento de cliente. Auto-clasificar cuentas en Verde / Amarillo / Rojo. Amarillo dispara un playbook de CSM con SLA de 7 días; Rojo dispara escalación al sponsor ejecutivo con SLA de 48 horas. El modelo recalcula semanalmente, y los CSMs ven su libro ordenado por puntaje en su vista matutina.',
      },
      outcome: {
        heading: 'El resultado',
        items: [
          'Cuentas en nivel Amarillo convirtiéndose de regreso a Verde a una tasa de ~58% cuando el playbook se siguió dentro del SLA — prueba medible de que la intervención temprana funciona.',
          'Dos saves enterprise en el primer trimestre post-lanzamiento, conjuntamente valorados en ~$420K ARR, identificadas por el modelo antes de que los clientes plantearan el tema.',
          'Varianza de NRR comprimida trimestre a trimestre conforme el pronóstico de renovaciones quedó mejor anclado en tendencias de puntaje de salud en lugar de la intuición del CSM.',
          'Una definición compartida de "en riesgo" entre CSM, Ventas y Sponsor Ejecutivo — cuando el sistema dice Rojo, todos significan lo mismo.',
        ],
      },
      lessons: {
        heading: 'Qué haría diferente',
        body: 'Afinar los pesos con el equipo de CSM en la sala antes del lanzamiento, no después. El primer set de pesos era correcto en agregado pero mal-ponderado el uso del producto para el segmento más pequeño (donde uso bajo es normal y no es señal de churn). Tres semanas de falsos-Rojos erosionaron la confianza del CSM en el puntaje antes de recalibrar. Un backtest pre-lanzamiento con revisión de experto en dominio lo habría atrapado.',
      },
    },
  },

  {
    slug: 'bookings-revenue-reconciliation',
    pdfs: [{ href: '/samples/bookings-revenue-recon.pdf', en: 'View the Reconciliation Model PDF', es: 'Ver el Modelo de Reconciliación (PDF)' }],
    keywords: 'bookings vs revenue, revenue recognition, sales finance reconciliation, ASC 606, amendment handling, deferred revenue',
    en: {
      title: 'Bookings vs. Revenue Reconciliation Model — RevOps Case Study | Jaime M. Mena',
      description: 'A 20-deal reconciliation model bridging sales bookings to recognized revenue with amendment handling, monthly recognition schedules, and automated cross-tab variance analysis. Sales-Finance alignment.',
      ogAlt: 'Bookings vs. Revenue Reconciliation — Jaime M. Mena',
      h1: 'Bookings vs. Revenue Reconciliation Model',
      sub: 'Northstar SaaS · Sales-Finance Alignment',
      lead: 'A 20-deal worked model that bridges sales bookings to recognized revenue line by line — including amendments, partial-month starts, and ramped contracts. Built to end the quarterly "but Sales said we booked X" debate between RevOps and Finance.',
      problem: {
        heading: 'The problem',
        body: 'Every quarter Sales would report a bookings number. Every quarter Finance would report a revenue number. The two never matched, and the conversation about why turned into a forensic accounting exercise instead of an operating discussion. Multi-year ramps, mid-contract amendments, and partial-month starts each introduced a different bridging adjustment, and nobody had documented the rules in one place.',
      },
      approach: {
        heading: 'The approach',
        body: 'Pick 20 representative deals covering the full taxonomy: clean new-business, multi-year with annual ramp, mid-term upgrade, mid-term downgrade, partial-month start, dollar-for-dollar swap, and the awkward stuff. Walk each deal from contract date through monthly recognition through the end of the term, applying ASC 606 where relevant. Build the model so that bookings → ARR → MRR → recognized-revenue is one continuous calculation with all bridging items called out. Automate variance analysis between forecasted and actual recognition.',
      },
      outcome: {
        heading: 'The outcome',
        items: [
          'A single shared model that Sales and Finance both trust as the source of truth for any deal-level question.',
          'Faster quarter-close — the bridging walk is automated, not rebuilt from emails and slack threads.',
          'Visibility into variance drivers (amendments, partial-period starts, ramp inflection points) so Finance can flag forecasting risk earlier.',
          'A documented policy for the edge cases that previously required a 30-minute phone call to settle.',
        ],
      },
      lessons: {
        heading: 'What I would do differently',
        body: 'Treat the model and the policy doc as a single deliverable, not two artifacts. The first version shipped with a clean spreadsheet but the rules for "when does an amendment trigger re-bridging" were buried in cell comments. Finance and Sales had different mental models for the same edge case for another quarter before we wrote the policy in plain English.',
      },
    },
    es: {
      title: 'Modelo de Reconciliación de Bookings vs. Ingresos — Caso de Estudio RevOps | Jaime M. Mena',
      description: 'Un modelo de reconciliación de 20 deals que conecta bookings de ventas con ingresos reconocidos, manejo de enmiendas, calendarios mensuales de reconocimiento y análisis automatizado de varianza entre pestañas.',
      ogAlt: 'Reconciliación de Bookings vs. Ingresos — Jaime M. Mena',
      h1: 'Modelo de Reconciliación de Bookings vs. Ingresos',
      sub: 'Northstar SaaS · Alineación Ventas-Finanzas',
      lead: 'Un modelo trabajado de 20 deals que conecta bookings de ventas con ingresos reconocidos línea por línea — incluyendo enmiendas, arranques de mes parciales y contratos con rampa. Construido para terminar el debate trimestral "pero Ventas dijo que reservamos X" entre RevOps y Finanzas.',
      problem: {
        heading: 'El problema',
        body: 'Cada trimestre Ventas reportaba un número de bookings. Cada trimestre Finanzas reportaba un número de ingresos. Los dos nunca cuadraban, y la conversación sobre por qué se convertía en un ejercicio de contabilidad forense en lugar de una discusión operativa. Rampas multi-anuales, enmiendas a mitad de contrato y arranques de mes parciales cada uno introducía un ajuste de puente distinto, y nadie había documentado las reglas en un solo lugar.',
      },
      approach: {
        heading: 'El enfoque',
        body: 'Escoger 20 deals representativos cubriendo la taxonomía completa: new-business limpio, multi-anual con rampa anual, upgrade a mitad de término, downgrade a mitad de término, arranque de mes parcial, swap dólar-por-dólar, y los casos incómodos. Caminar cada deal desde fecha de contrato a través del reconocimiento mensual hasta el final del término, aplicando ASC 606 donde sea relevante. Construir el modelo para que bookings → ARR → MRR → ingresos-reconocidos sea un cálculo continuo con todos los ítems de puente explícitos. Automatizar el análisis de varianza entre reconocimiento pronosticado y real.',
      },
      outcome: {
        heading: 'El resultado',
        items: [
          'Un solo modelo compartido en el que Ventas y Finanzas confían como fuente de verdad para cualquier pregunta a nivel deal.',
          'Cierre de trimestre más rápido — la caminata de puente está automatizada, no reconstruida desde emails y hilos de Slack.',
          'Visibilidad de los drivers de varianza (enmiendas, arranques de periodo parcial, puntos de inflexión de rampa) para que Finanzas pueda señalar riesgo de pronóstico más temprano.',
          'Una política documentada para los casos límite que antes requerían una llamada de 30 minutos para resolver.',
        ],
      },
      lessons: {
        heading: 'Qué haría diferente',
        body: 'Tratar el modelo y el documento de política como un solo entregable, no dos artefactos. La primera versión se entregó con una hoja de cálculo limpia pero las reglas de "cuándo dispara una enmienda re-puenteo" estaban enterradas en comentarios de celda. Finanzas y Ventas tuvieron modelos mentales distintos para el mismo caso límite por otro trimestre antes de que escribiéramos la política en lenguaje claro.',
      },
    },
  },
];
