import type { ContextType } from "@/lib/constants/specialties";

export interface ProcedimentoStep {
  text: string;
}

export interface ProcedimentoInfo {
  indicacoes: string[];
  contraindicacoes: string[];
  complicacoes: string[];
  bizus: string;
}

export interface Procedimento {
  id: string;
  name: string;
  context: ContextType[];
  /** HD keywords that trigger a suggestion for this procedure */
  hdTags: string[];
  steps: ProcedimentoStep[];
  info?: ProcedimentoInfo;
}

export const PROCEDIMENTOS: readonly Procedimento[] = [
  {
    id: "paracentese_alivio",
    name: "Paracentese de Alívio",
    context: ["ps"],
    hdTags: ["cirrose", "ascite"],
    steps: [
      { text: "Posiciono paciente em DDH" },
      {
        text: "Com Transdutor linear, realizo USG de abdome, identificando local de punção mais favorável em quadrante inferior esquerdo",
      },
      { text: "Realizo antissepsia e assepsia" },
      { text: "Posiciono campos" },
      { text: "Infundo cerca de 5ml de Lidocaína subcutânea" },
      {
        text: "Posiciono jelco 14 e punciono local, com saída de secreção amarela-citrino",
      },
      {
        text: "Coleto 3 seringas de 20ml para análise bioquímica e biológica",
      },
      { text: "Fixo equipo e conecto-o ao sistema coletor aberto" },
      { text: "Encaminho amostras das seringas ao laboratório" },
      {
        text: "Acompanho paciente por cerca de ___h com drenagem estimada de ___mL de conteúdo ascítico amarelo-citrino",
      },
      {
        text: "Realizo curativo simples com gaze e esparadrapo",
      },
      {
        text: "Retorno paciente em bom estado geral, sem queixas, à ala ___ onde está internada",
      },
    ],
  },
  {
    id: "cvc_3_vias",
    name: "Passagem de Cateter Venoso Central 3 Vias",
    context: ["uti", "sala_de_emergencia", "cirurgia"],
    hdTags: ["choque", "npt", "falha de acesso", "dhe"],
    steps: [
      {
        text: "Assepsia do paciente, escovação de mãos, paramentação com gorro, capote estéril e luva estéril",
      },
      {
        text: "Antissepsia e colocação de campos estéreis por sobre o paciente",
      },
      { text: "Avaliação do sítio de punção com USG novamente" },
      {
        text: "Anestesia com lidocaína 5% - 1 ml sobre sítio de punção",
      },
      { text: "Salinizado 3 vias do cateter" },
      {
        text: "Punção de veia femoral em primeira tentativa, confirmada através da visualização do fio guia dentro do trajeto venoso nos planos transversal e longitudinal",
      },
      { text: "Dilatação de pele e subcutâneo" },
      {
        text: "Passagem de cateter pelo fio guia sem intercorrências",
      },
      {
        text: "Realizado teste com refluxo nas três vias e lavado após",
      },
      {
        text: "Sutura após anestesia com mais 2ml de Lidocaína 5% sobre pontos de fixação de fábrica do cateter (4 pontos)",
      },
      { text: "Curativo com gaze estéril bem locado" },
      { text: "Radiografia de controle após" },
    ],
    info: {
      indicacoes: [
        "Medicações hiperosmolares/vesicantes (ex: G50%, KCl)",
        "Vasopressores",
        "Nutrição parenteral",
        "Falência de acesso periférico",
        "Monitorização hemodinâmica",
        "Hemodiálise",
        "Marcapasso provisório transvenoso",
      ],
      contraindicacoes: [],
      complicacoes: [],
      bizus: `Em qual sítio puncionar? Janelar USG em todos. Verificar anatomia, presença de trombos, distância pele-vaso.

1º) Subclávia – preferencial, menos infecção de todos, mais complicações (pneumotórax, pegar artéria, não compressível). Se optar, deixar USG longitudinal; clavícula faz sombra acústica, pleura logo abaixo.

2º) VJID – trajeto menor. VJIE tem ducto torácico.

3º) VJIE – se houver chance de precisar de Shilley, deixar VJID livre.

4º) Femoral – preferível no trauma/choque com ABCDE em andamento (controverso: mais infecção; só se diarreia ou obeso).

Shilley: sítio preferencial (mais calibroso) VJID > femoral > subclávia.`,
    },
  },
  {
    id: "gasometria_arterial",
    name: "Coleta de Gasometria Arterial",
    context: ["uti", "sala_de_emergencia"],
    hdTags: ["dhe", "insuficiencia respiratoria", "cetoacidose diabetica"],
    steps: [
      {
        text: "O paciente foi preparado e posicionado com campos estéreis de maneira habitual, utilizando antissepsia com clorexidina. Lidocaína a 1% foi utilizada para anestesiar a região.",
      },
      {
        text: "A artéria radial <ESQUERDA/DIREITA> foi palpada e canulada com sucesso na primeira tentativa. Foi visualizado sangue arterial pulsátil e, em seguida, a artéria foi cateterizada utilizando a técnica de Seldinger, com o cateter sendo fixado no local por sutura.",
      },
      {
        text: "Foi obtida boa forma de onda. O paciente tolerou bem o procedimento, sem complicações imediatas. A área foi limpa e aplicado curativo com Tegaderm.",
      },
    ],
  },
  {
    id: "passagem_pai",
    name: "Passagem de PAI",
    context: ["sala_de_emergencia", "uti"],
    hdTags: ["choque"],
    steps: [
      { text: "Sítio: __ (AFE, AFD, ARE, ARD). Procedimento sem intercorrências imediatas." },
      { text: "Antissepsia + assepsia." },
      { text: "Anestesia local com lidocaína a 2%." },
      { text: "Canulação da ___ guiada por USG e passagem de fio guia." },
      { text: "Passado cateter monolúmen." },
      { text: "Refluxo de sangue arterial, com boa pulsação." },
      { text: "Conexão do cateter ao sistema de PAI e lavagem da via." },
      { text: "Zerado sistema. Boa curva ao monitor." },
      { text: "Fixação com curativo." },
    ],
    info: {
      indicacoes: [
        "Choque",
        "Uso de vasopressores",
        "Instabilidade hemodinâmica",
        "Necessidade de monitorização contínua da pressão arterial",
      ],
      contraindicacoes: [
        "Infecção local no sítio de punção",
        "Ausência de circulação colateral adequada, como teste de Allen alterado, como contraindicação relativa",
      ],
      complicacoes: ["Isquemia distal", "Trombose", "Infecção", "Hematoma", "Sangramento local"],
      bizus: `Preferir artéria radial inicialmente quando disponível.
Zerar o sistema corretamente antes de interpretar valores.
Observar a morfologia da curva no monitor.
Manter sistema pressurizado e lavagem contínua para reduzir risco de trombose.`,
    },
  },
  {
    id: "toracocentese",
    name: "Toracocentese Diagnóstica e de Alívio",
    context: ["sala_de_emergencia", "enfermaria", "uti"],
    hdTags: ["derrame pleural", "pneumotorax", "insuficiencia respiratoria"],
    steps: [
      {
        text: "Paciente em posição sentada, confortável, com braços apoiados e tronco levemente inclinado para frente.",
      },
      {
        text: "Realizo USG de tórax com transdutor curvo, identificando o melhor local de punção, preferencialmente em linha axilar posterior, acima do diafragma, no espaço com maior acúmulo e segurança.",
      },
      { text: "Realizo antissepsia e assepsia da pele, seguido de colocação de campos estéreis." },
      {
        text: "Procedo com anestesia local utilizando lidocaína 2% sem vasoconstrictor, cerca de 5 a 10 mL, infiltrando pele, subcutâneo e pleura parietal.",
      },
      {
        text: "Realizo punção com jelco 14 ou cateter específico para toracocentese, imediatamente acima do bordo superior da costela inferior, com saída de líquido pleural.",
      },
      {
        text: "Para finalidade diagnóstica, coleto amostras em seringas de 20 mL e encaminho para análise bioquímica, microbiológica e citopatológica.",
      },
      { text: "Conecto o cateter a sistema coletor, frasco a vácuo ou bolsa, realizando drenagem controlada." },
      {
        text: "Monitoro o paciente durante o procedimento, limitando drenagem a aproximadamente 1.000 a 1.500 mL na primeira punção para reduzir risco de edema pulmonar por reexpansão.",
      },
      {
        text: "Ao término, retiro o cateter, realizo curativo compressivo estéril e observo o paciente por alguns minutos.",
      },
      {
        text: "Solicito radiografia de tórax de controle para avaliar reexpansão pulmonar e descartar pneumotórax.",
      },
      {
        text: "Registro volume drenado e aspecto do líquido, por exemplo citrino, sero-hemático, turvo ou hemorrágico.",
      },
    ],
    info: {
      indicacoes: [
        "Derrame pleural de etiologia a esclarecer",
        "Derrame pleural volumoso com dispneia",
        "Suspeita de infecção pleural ou empiema",
        "Neoplasia com derrame pleural",
        "Avaliação de transudato versus exsudato",
      ],
      contraindicacoes: [
        "Não há contraindicação absoluta quando o benefício clínico é alto",
        "Coagulopatia importante",
        "Plaquetopenia grave",
        "Pequeno volume de derrame, com risco maior que benefício",
        "Infecção no sítio de punção",
        "Paciente não colaborativo sem estratégia segura de contenção ou sedação",
      ],
      complicacoes: [
        "Pneumotórax",
        "Hemotórax",
        "Punção hepática ou esplênica por erro de sítio",
        "Edema pulmonar por reexpansão",
        "Infecção",
        "Dor pleurítica",
        "Tosse durante o procedimento",
      ],
      bizus: `USG sempre: reduz complicações e ajuda a escolher janela segura.
Puncionar sempre acima da costela para evitar o feixe vasculonervoso.
Não drenar grandes volumes rapidamente.
Se houver tosse intensa, dor ou desconforto importante, considerar interromper.
Derrames pequenos têm maior risco de complicação.
Pedir RX ou USG de controle após o procedimento.
Preferir posição sentada quando possível, pois melhora segurança e acesso.`,
    },
  },
  {
    id: "iot_intubacao_orotraqueal",
    name: "IOT - Intubação Orotraqueal",
    context: ["uti", "sala_de_emergencia"],
    hdTags: [
      "insuficiência respiratória",
      "insuficiencia respiratoria",
      "rebaixamento",
      "rebaixamento nivel de consciencia",
      "proteção de via aérea",
      "protecao de via aerea",
      "via aérea",
      "via aerea",
      "choque",
      "pcr",
      "parada cardiorrespiratória",
      "parada cardiorrespiratoria",
      "trauma",
      "broncoaspiração",
      "broncoaspiracao",
    ],
    steps: [
      {
        text: "Intubação orotraqueal realizada por __, após avaliação de via aérea, risco de aspiração e necessidade de controle ventilatório. Paciente monitorizado com cardioscopia, pressão não invasiva e oximetria, com acesso venoso pérvio e material de via aérea preparado à beira-leito.",
      },
      {
        text: "Preparação: realizada pré-oxigenação com FiO2 elevada, posicionamento em sniffing/rampa conforme anatomia, aspiração testada e plano de resgate definido com dispositivo supraglótico, bougie e via aérea cirúrgica disponíveis.",
      },
      {
        text: "Sequência rápida: medicações de indução e bloqueio neuromuscular administradas conforme prescrição e condição hemodinâmica. Após perda de consciência e relaxamento adequado, procedo à laringoscopia direta/vídeo-laringoscopia.",
      },
      {
        text: "Técnica: visualizo glote Cormack-Lehane __ e introduzo tubo orotraqueal nº __ com cuff, progredindo até __ cm na arcada dentária. Insuflo cuff e inicio ventilação com bolsa-válvula-máscara conectada ao tubo.",
      },
      {
        text: "Confirmação: posicionamento confirmado por capnografia, expansibilidade torácica bilateral, ausculta pulmonar simétrica e ausência de ruídos em epigástrio. Tubo fixado e solicitada radiografia de tórax para controle de profundidade.",
      },
      {
        text: "Pós-procedimento: paciente mantido em ventilação mecânica, sedoanalgesia ajustada, parâmetros iniciais comunicados à equipe e procedimento finalizado sem intercorrências imediatas.",
      },
    ],
    info: {
      indicacoes: [
        "Insuficiência respiratória com falha de oxigenação ou ventilação",
        "Rebaixamento do nível de consciência com perda de proteção de via aérea",
        "Rebaixamento de consciência com Glasgow <= 8",
        "Parada cardiorrespiratória ou instabilidade grave com necessidade de controle ventilatório",
        "Trauma com risco de via aérea",
        "Alto risco de aspiração ou necessidade de procedimento sob anestesia geral",
      ],
      contraindicacoes: [
        "Não há contraindicação absoluta em emergência",
        "Via aérea não avaliável sem plano de resgate disponível",
        "Trauma ou anatomia que impeça técnica orotraqueal convencional sem estratégia alternativa",
      ],
      complicacoes: [
        "Hipoxemia, hipotensão e broncoaspiração",
        "Intubação esofágica ou seletiva",
        "Trauma dentário, labial, laríngeo ou traqueal",
        "Pneumotórax e parada cardiorrespiratória periprocedimento",
      ],
      bizus: `Antes da primeira tentativa, verbalize o plano A/B/C: laringoscopia, dispositivo supraglótico e via aérea cirúrgica. Capnografia é o padrão para confirmar posição traqueal quando disponível. Se a saturação cair ou a visão estiver ruim, priorize oxigenação e replaneje a próxima tentativa.`,
    },
  },
  {
    id: "cricotireoidostomia",
    name: "Cricotireoidostomia",
    context: ["uti", "sala_de_emergencia"],
    hdTags: [
      "insuficiência respiratória",
      "insuficiencia respiratoria",
      "rebaixamento nivel de consciencia",
      "pcr",
      "trauma",
      "via aérea difícil",
      "via aerea dificil",
      "não intubo",
      "nao intubo",
      "não ventilo",
      "nao ventilo",
      "obstrução de via aérea",
      "obstrucao de via aerea",
      "trauma de face",
      "edema de glote",
      "anafilaxia",
      "queimadura de via aérea",
      "queimadura de via aerea",
    ],
    steps: [
      {
        text: "Cricotireoidostomia realizada em cenário de via aérea não obtida por métodos convencionais, com ventilação/oxigenação inadequada e falha ou impossibilidade de dispositivo supraglótico.",
      },
      {
        text: "Preparação: acionada ajuda imediata, mantida tentativa de oxigenação com bolsa-válvula-máscara, monitorização contínua e material de cricotireoidostomia à beira-leito. Identifico cartilagem tireoide, cartilagem cricoide e membrana cricotireoidea.",
      },
      {
        text: "Antissepsia e acesso: realizo antissepsia ampla do pescoço. Se houver tempo e paciente consciente, faço anestesia local; em emergência extrema, procedo imediatamente com incisão vertical na pele sobre a membrana cricotireoidea.",
      },
      {
        text: "Abertura da via aérea: após dissecção romba, realizo incisão transversal na membrana cricotireoidea, dilato a abertura e introduzo cânula/tubo com cuff direcionado caudalmente para a traqueia.",
      },
      {
        text: "Confirmação: insuflo cuff e conecto ventilação, confirmando posição por capnografia, expansibilidade torácica, melhora da saturação e ausculta pulmonar bilateral. Fixação realizada com cadarço/sutura e curativo estéril.",
      },
      {
        text: "Pós-procedimento: comunico equipe de cirurgia/anestesia para avaliação definitiva da via aérea, solicito controle radiográfico quando aplicável e mantenho vigilância para sangramento, enfisema subcutâneo e deslocamento.",
      },
    ],
    info: {
      indicacoes: [
        "Cenário não intubo/não oxigeno",
        "Obstrução alta de via aérea sem possibilidade de intubação orotraqueal",
        "Trauma facial grave com falha de métodos não cirúrgicos",
      ],
      contraindicacoes: [
        "Criança pequena, em que a anatomia favorece outras estratégias especializadas",
        "Capacidade de oxigenar adequadamente por método menos invasivo enquanto se prepara via aérea definitiva",
      ],
      complicacoes: [
        "Sangramento e falso trajeto",
        "Lesão de tireoide, cricoide, traqueia ou esôfago",
        "Enfisema subcutâneo, pneumomediastino e pneumotórax",
        "Infecção e estenose subglótica tardia",
      ],
      bizus: `É procedimento de resgate, não de conforto. A decisão deve ser precoce quando a oxigenação está falhando. A referência anatômica principal é a membrana cricotireoidea; em pescoço difícil, uma incisão vertical maior ajuda a recuperar a linha média.`,
    },
  },
  {
    id: "drenagem_toracica_pigtail",
    name: "Drenagem Torácica com Pigtail",
    context: ["uti", "sala_de_emergencia", "enfermaria", "cirurgia"],
    hdTags: [
      "pneumotórax",
      "pneumotorax",
      "derrame pleural",
      "hidrotórax",
      "hidrotorax",
      "empiema",
      "hemotórax",
      "hemotorax",
      "insuficiência respiratória",
      "insuficiencia respiratoria",
    ],
    steps: [
      {
        text: "Drenagem torácica com cateter pigtail realizada por __, após avaliação clínica e confirmação por imagem. Procedimento explicado quando possível, com checagem de lateralidade, anticoagulação/coagulopatia e necessidade de analgesia.",
      },
      {
        text: "Planejamento: paciente posicionado em decúbito dorsal ou semi-sentado, com braço ipsilateral elevado. Local de punção definido por ultrassonografia ou referência anatômica segura, respeitando borda superior da costela para evitar feixe vásculo-nervoso.",
      },
      {
        text: "Antissepsia e anestesia: realizada antissepsia ampla, campos estéreis e anestesia local por planos até pleura parietal, aspirando durante a progressão para confirmar entrada no espaço pleural.",
      },
      {
        text: "Técnica de Seldinger: punciono espaço pleural com agulha/cateter, confirmo saída de ar ou líquido, introduzo fio-guia sem resistência, retiro agulha, realizo pequena incisão cutânea e dilatação progressiva do trajeto.",
      },
      {
        text: "Posicionamento: avanço cateter pigtail sobre o fio-guia, retiro o fio, destravo a curvatura distal e conecto a sistema coletor/selo d'água ou aspiração conforme indicação. Observo oscilação, borbulhamento e débito inicial de __ mL.",
      },
      {
        text: "Finalização: fixo o cateter à pele, faço curativo estéril oclusivo, solicito radiografia de tórax de controle e mantenho monitorização de dor, débito, fuga aérea e padrão respiratório.",
      },
    ],
    info: {
      indicacoes: [
        "Pneumotórax sintomático, grande, recorrente ou em ventilação positiva",
        "Derrame pleural sintomático ou recorrente com indicação de drenagem",
        "Coleções pleurais selecionadas em que cateter fino é apropriado",
      ],
      contraindicacoes: [
        "Instabilidade que exige descompressão imediata por técnica mais rápida",
        "Coagulopatia grave não corrigida quando houver tempo para correção",
        "Aderências pleurais extensas ou coleção loculada sem janela segura",
      ],
      complicacoes: [
        "Sangramento, dor e infecção",
        "Lesão pulmonar, diafragmática ou abdominal",
        "Mau posicionamento, obstrução ou deslocamento do cateter",
        "Edema de reexpansão em drenagens volumosas",
      ],
      bizus: `Para líquido, USG muda o jogo: marca profundidade, evita diafragma e escolhe a melhor janela. Para ar, pense na direção do cateter e confirme funcionamento do sistema antes de sair do leito.`,
    },
  },
  {
    id: "sonda_nasogastrica",
    name: "Passagem de Sonda Nasogástrica",
    context: ["uti", "sala_de_emergencia", "enfermaria", "cirurgia"],
    hdTags: [
      "obstrução intestinal",
      "obstrucao intestinal",
      "íleo",
      "ileo",
      "distensão abdominal",
      "distensao abdominal",
      "vômitos",
      "vomitos",
      "hemorragia digestiva",
      "hda",
      "broncoaspiração",
      "broncoaspiracao",
      "descompressão gástrica",
      "descompressao gastrica",
      "dieta enteral",
      "pos-operatorio",
      "pancreatite",
      "abdome agudo obstrutivo",
      "cancer gastrico",
    ],
    steps: [
      {
        text: "Passagem de sonda nasogástrica realizada por __ para descompressão, lavagem, administração de contraste/medicação ou suporte enteral temporário. Checo risco de trauma facial grave, suspeita de fratura de base de crânio ou obstrução nasal/esofágica.",
      },
      {
        text: "Preparação: paciente em posição sentada ou cabeceira elevada, com proteção de tórax, material separado, sonda escolhida, lubrificante disponível e narina mais pérvia identificada. Explico o procedimento e combino deglutição durante a progressão quando paciente colaborativo.",
      },
      {
        text: "Medida e anestesia: meço a distância nariz-orelha-apêndice xifoide e marco a sonda. Lubrifico a extremidade distal e considero anestésico tópico/vasoconstrictor nasal conforme tolerância e protocolo local.",
      },
      {
        text: "Passagem: introduzo a sonda pelo assoalho da narina, direcionando posteriormente. Ao atingir orofaringe, solicito flexão cervical e deglutição com pequenos goles de água se permitido, avançando até a marca sem resistência importante.",
      },
      {
        text: "Checagem: aspiro conteúdo gástrico e avalio pH quando disponível. Para uso nutricional, medicamentoso ou dúvida de posicionamento, aguardo confirmação radiográfica antes de liberar a sonda.",
      },
      {
        text: "Finalização: fixo a sonda ao nariz, conecto a drenagem gravitacional ou baixa aspiração intermitente conforme indicação, registro tipo/calibre, narina, marca externa e aspecto/volume do conteúdo inicial.",
      },
    ],
    info: {
      indicacoes: [
        "Descompressão gástrica em obstrução, íleo ou distensão importante",
        "Esvaziamento gástrico em situações selecionadas, como sangramento digestivo alto",
        "Administração de contraste, medicações ou dieta quando posição estiver confirmada",
      ],
      contraindicacoes: [
        "Trauma maxilofacial grave ou suspeita de fratura de base de crânio",
        "Obstrução nasofaríngea ou esofágica",
        "Varizes esofágicas, estenose ou cirurgia esofagogástrica recente como contraindicações relativas",
      ],
      complicacoes: [
        "Epistaxe, dor e lesão de mucosa",
        "Posicionamento traqueobrônquico e aspiração",
        "Perfuração em pacientes de alto risco",
        "Sinusite, refluxo e lesão por pressão nasal",
      ],
      bizus: `A sonda deve seguir pelo assoalho da narina, não para cima. Em paciente com rebaixamento importante, proteja a via aérea antes. Para dieta e medicação, radiografia é a confirmação mais segura quando houver qualquer dúvida.`,
    },
  },
  {
    id: "cvc_intraosseo",
    name: "CVC Intraósseo",
    context: ["sala_de_emergencia", "uti", "enfermaria"],
    hdTags: ["choque"],
    steps: [
      {
        text: "Indico acesso intraósseo por necessidade de acesso vascular imediato em contexto de choque, PCR ou falha de acesso venoso periférico.",
      },
      { text: "Seleciono sítio de punção adequado, preferencialmente tíbia proximal, após checar ausência de fratura, infecção local ou punção recente no mesmo osso." },
      { text: "Realizo antissepsia ampla, estabilizo o membro e introduzo a agulha intraóssea perpendicularmente ao osso até perda de resistência." },
      { text: "Retiro o mandril, conecto extensor e confirmo posicionamento por estabilidade da agulha, aspiração quando possível e flush com baixa resistência." },
      { text: "Fixo o dispositivo, conecto equipo pressurizado se necessário e inicio infusão de drogas ou volume conforme prescrição." },
      { text: "Se paciente consciente, realizo analgesia local/intraóssea conforme protocolo e monitoro dor, extravasamento e perfusão distal." },
    ],
    info: {
      indicacoes: [
        "Choque com dificuldade de acesso venoso",
        "Parada cardiorrespiratória",
        "Emergência com falha de acesso periférico",
      ],
      contraindicacoes: [
        "Fratura no osso alvo",
        "Infecção local no sítio de punção",
        "Punção intraóssea prévia no mesmo sítio",
      ],
      complicacoes: ["Extravasamento", "Síndrome compartimental", "Osteomielite", "Fratura"],
      bizus: `Tíbia proximal é o sítio mais usado.
Confirme posição com flush fácil e ausência de extravasamento.
Pode infundir drogas e volume normalmente, idealmente com pressão.
Analgesia é importante se o paciente estiver consciente.`,
    },
  },
  {
    id: "pai_pressao_arterial_invasiva",
    name: "PAI - Pressão Arterial Invasiva",
    context: ["sala_de_emergencia", "uti", "enfermaria"],
    hdTags: ["choque"],
    steps: [
      {
        text: "Indico monitorização invasiva da pressão arterial por choque, uso de vasopressores ou instabilidade hemodinâmica com necessidade de medidas contínuas.",
      },
      { text: "Escolho sítio arterial, preferencialmente radial, avaliando perfusão distal, circulação colateral e presença de infecção local." },
      { text: "Realizo antissepsia, campos estéreis e anestesia local com lidocaína." },
      { text: "Punciono a artéria escolhida, preferencialmente guiado por USG, e avanço fio-guia quando utilizada técnica de Seldinger." },
      { text: "Introduzo cateter arterial, observo refluxo pulsátil e conecto ao sistema de transdução previamente preenchido e sem bolhas." },
      { text: "Zero o sistema no eixo flebostático, confirmo curva arterial adequada no monitor e fixo o cateter com curativo estéril." },
    ],
    info: {
      indicacoes: [
        "Choque",
        "Uso de vasopressores",
        "Instabilidade hemodinâmica",
        "Monitorização contínua da pressão arterial",
      ],
      contraindicacoes: [
        "Infecção local no sítio de punção",
        "Ausência de circulação colateral adequada, como teste de Allen alterado, como contraindicação relativa",
      ],
      complicacoes: ["Isquemia distal", "Trombose", "Infecção", "Hematoma"],
      bizus: `Preferir radial inicialmente.
Sempre zerar o sistema corretamente.
Observar a curva no monitor, não apenas o número.
Lavagem contínua e sistema pressurizado ajudam a evitar trombose.`,
    },
  },
  {
    id: "drenagem_toracica_tubular",
    name: "Drenagem torácica - Tubular",
    context: ["sala_de_emergencia", "uti", "enfermaria", "cirurgia"],
    hdTags: ["derrame pleural", "pneumotorax"],
    steps: [
      {
        text: "Indico drenagem torácica tubular por pneumotórax hipertensivo, hemotórax ou derrame pleural complexo/empiema avançado.",
      },
      { text: "Posiciono paciente em decúbito dorsal ou semi-sentado, com braço ipsilateral elevado, e identifico o triângulo de segurança." },
      { text: "Realizo antissepsia ampla, campos estéreis e anestesia local por planos até a pleura." },
      { text: "Faço incisão no sítio escolhido e dissecção romba com pinça até atingir o espaço pleural." },
      { text: "Realizo exploração digital antes de inserir o dreno, confirmando entrada no espaço pleural e afastando aderências imediatas." },
      { text: "Introduzo dreno tubular direcionado conforme objetivo, conecto ao selo d'água e confirmo oscilação, borbulhamento e débito inicial." },
      { text: "Fixo o dreno, realizo curativo oclusivo e solicito radiografia de tórax de controle." },
    ],
    info: {
      indicacoes: [
        "Pneumotórax hipertensivo",
        "Hemotórax",
        "Derrame pleural complexo ou empiema avançado",
      ],
      contraindicacoes: ["Coagulopatia grave como contraindicação relativa"],
      complicacoes: ["Lesão pulmonar", "Sangramento", "Infecção", "Mau posicionamento"],
      bizus: `Triângulo de segurança sempre.
Exploração digital antes de inserir o dreno.
Direcionar posterior/inferior para líquido e anterior/superior para ar, conforme contexto.
Checar funcionamento no selo d'água antes de sair do leito.`,
    },
  },
  {
    id: "drenagem_abscesso",
    name: "Drenagem de abscesso",
    context: ["ps"],
    hdTags: ["infeccao de pele e partes moles", "abscesso"],
    steps: [
      {
        text: "Indico drenagem por presença de abscesso com flutuação ou falha de tratamento clínico, após avaliação de profundidade e extensão da coleção.",
      },
      { text: "Realizo antissepsia local, preparo campo e anestesia local ao redor do ponto de maior flutuação." },
      { text: "Faço incisão no ponto de maior flutuação, respeitando linhas de tensão e estruturas nobres adjacentes." },
      { text: "Dreno conteúdo purulento, desfaço loculações com pinça romba quando necessário e coleto material para cultura se indicado." },
      { text: "Lavo abundantemente a cavidade com soro fisiológico e avalio necessidade de curativo, dreno ou gaze." },
      { text: "Mantenho cicatrização por segunda intenção e oriento curativos, retorno e sinais de alarme." },
    ],
    info: {
      indicacoes: ["Abscesso com flutuação", "Falha de tratamento clínico"],
      contraindicacoes: ["Celulite sem coleção", "Abscessos profundos sem avaliação por imagem"],
      complicacoes: ["Sangramento", "Recidiva", "Infecção secundária"],
      bizus: `Incisão no ponto de maior flutuação.
Lavar bem a cavidade.
Não fechar a pele: manter cicatrização por segunda intenção.
Considerar antibiótico associado conforme extensão, imunossupressão, celulite ao redor ou sinais sistêmicos.`,
    },
  },
  {
    id: "sonda_vesical_demora",
    name: "Sonda Vesical de Demora",
    context: ["ps", "uti", "enfermaria", "sala_de_emergencia"],
    hdTags: ["bexigoma", "retencao urinaria", "pos-operatorio", "urologia"],
    steps: [
      {
        text: "Indico sondagem vesical de demora por retenção urinária, necessidade de monitorização de diurese ou contexto pós-operatório.",
      },
      { text: "Explico o procedimento quando possível, posiciono paciente adequadamente e preparo material estéril." },
      { text: "Realizo higiene, antissepsia e montagem de campo estéril, mantendo técnica asséptica durante todo o procedimento." },
      { text: "Lubrifico a sonda e introduzo suavemente pela uretra, sem forçar caso haja resistência importante." },
      { text: "Confirmo saída de urina antes de insuflar o balão com volume recomendado pelo fabricante." },
      { text: "Traciono levemente até apoio do balão, conecto ao coletor fechado, fixo a sonda e registro débito/aspecto inicial da urina." },
    ],
    info: {
      indicacoes: ["Retenção urinária", "Monitorização de diurese", "Pós-operatório"],
      contraindicacoes: ["Suspeita de lesão uretral"],
      complicacoes: ["Infecção do trato urinário", "Trauma uretral", "Hematúria"],
      bizus: `Técnica estéril sempre.
Nunca forçar passagem.
Confirmar saída de urina antes de insuflar o balão.
Em suspeita de lesão uretral, discutir avaliação urológica antes da passagem.`,
    },
  },
  {
    id: "priapismo_tecnica_winter",
    name: "Priapismo - Técnica de Winter",
    context: ["ps"],
    hdTags: ["priapismo", "urologia"],
    steps: [
      {
        text: "Indico abordagem de priapismo isquêmico com duração maior que 4 horas, após avaliação clínica e analgesia adequada.",
      },
      { text: "Realizo preparo asséptico, bloqueio/anestesia peniana conforme necessidade e monitorização clínica." },
      { text: "Punciono corpo cavernoso distal conforme técnica de Winter, aspirando sangue escuro até melhora da tumescência quando possível." },
      { text: "Irrigo com soro fisiológico conforme resposta clínica e protocolo local." },
      { text: "Reavalio detumescência, dor e perfusão local, repetindo manobra ou acionando urologia conforme evolução." },
      { text: "Realizo curativo compressivo leve e registro resposta ao procedimento e necessidade de nova intervenção." },
    ],
    info: {
      indicacoes: ["Priapismo isquêmico com duração maior que 4 horas"],
      contraindicacoes: ["Priapismo não isquêmico"],
      complicacoes: ["Disfunção erétil", "Infecção", "Sangramento"],
      bizus: `É urgência: agir rápido reduz risco de disfunção erétil.
Garantir analgesia adequada.
Pode precisar repetir o procedimento ou escalar para urologia.
Diferenciar priapismo isquêmico de não isquêmico sempre que possível.`,
    },
  },
  {
    id: "troca_nefrostomia",
    name: "Troca de nefrostomia",
    context: ["cirurgia"],
    hdTags: [],
    steps: [
      {
        text: "Indico troca de nefrostomia por obstrução, infecção, mau funcionamento ou troca programada.",
      },
      { text: "Avalio estabilidade clínica, sinais de infecção, coagulopatia e disponibilidade de suporte adequado." },
      { text: "Realizo antissepsia ampla, preparo campo estéril e coleto cultura antes da troca quando indicado." },
      { text: "Introduzo fio-guia pelo trajeto da nefrostomia existente, mantendo acesso ao sistema coletor durante a retirada do cateter antigo." },
      { text: "Avanço novo cateter sobre o fio-guia, confirmo drenagem adequada e posicionamento conforme recurso disponível." },
      { text: "Fixo o cateter, conecto ao coletor, realizo curativo estéril e registro aspecto/débito inicial." },
    ],
    info: {
      indicacoes: ["Obstrução", "Infecção", "Troca programada"],
      contraindicacoes: ["Instabilidade sem suporte adequado", "Coagulopatia como contraindicação relativa"],
      complicacoes: ["Infecção", "Sangramento", "Mau posicionamento"],
      bizus: `Sempre usar fio-guia para preservar o trajeto.
Coletar cultura antes quando houver suspeita infecciosa.
Confirmar posicionamento antes de fixar definitivamente.
Não retirar o cateter antigo sem garantir manutenção do acesso.`,
    },
  },
] as const;
