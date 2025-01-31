const passages = {
  English: {
    text: `The digital revolution has transformed how we live and work. In today's interconnected world, technology plays a pivotal role in shaping our daily experiences. From artificial intelligence to renewable energy, innovations continue to drive progress and create new opportunities. As we navigate these changes, it's crucial to understand both the benefits and challenges of our increasingly digital society.`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "en"
  },
  French: {
    text: `La révolution numérique a transformé notre façon de vivre et de travailler. Dans le monde interconnecté d'aujourd'hui, la technologie joue un rôle central dans nos expériences quotidiennes. De l'intelligence artificielle aux énergies renouvelables, les innovations continuent de stimuler le progrès et de créer de nouvelles opportunités. Alors que nous naviguons à travers ces changements, il est crucial de comprendre à la fois les avantages et les défis de notre société de plus en plus numérique.`,
    estimatedDuration: 50,
    difficulty: "intermediate",
    code: "fr"
  },
  Anglais: {
    text: `The digital revolution has transformed how we live and work. In today's interconnected world, technology plays a pivotal role in shaping our daily experiences. From artificial intelligence to renewable energy, innovations continue to drive progress and create new opportunities. As we navigate these changes, it's crucial to understand both the benefits and challenges of our increasingly digital society.`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "en"
  },
  Français: {
    text: `La révolution numérique a transformé notre façon de vivre et de travailler. Dans le monde interconnecté d'aujourd'hui, la technologie joue un rôle central dans nos expériences quotidiennes. De l'intelligence artificielle aux énergies renouvelables, les innovations continuent de stimuler le progrès et de créer de nouvelles opportunités. Alors que nous naviguons à travers ces changements, il est crucial de comprendre à la fois les avantages et les défis de notre société de plus en plus numérique.`,
    estimatedDuration: 50,
    difficulty: "intermediate",
    code: "fr"
  },
  Arabic: {
    text: `لقد غيرت الثورة الرقمية طريقة حياتنا وعملنا. في عالم اليوم المترابط، تلعب التكنولوجيا دوراً محورياً في تشكيل تجاربنا اليومية. من الذكاء الاصطناعي إلى الطاقة المتجددة، تواصل الابتكارات دفع التقدم وخلق فرص جديدة. بينما نتنقل عبر هذه التغييرات، من الضروري فهم كل من فوائد وتحديات مجتمعنا الرقمي المتزايد.`,
    estimatedDuration: 55,
    difficulty: "intermediate",
    code: "ar"
  },
  Arabe: {
    text: `لقد غيرت الثورة الرقمية طريقة حياتنا وعملنا. في عالم اليوم المترابط، تلعب التكنولوجيا دوراً محورياً في تشكيل تجاربنا اليومية. من الذكاء الاصطناعي إلى الطاقة المتجددة، تواصل الابتكارات دفع التقدم وخلق فرص جديدة. بينما نتنقل عبر هذه التغييرات، من الضروري فهم كل من فوائد وتحديات مجتمعنا الرقمي المتزايد.`,
    estimatedDuration: 55,
    difficulty: "intermediate",
    code: "ar"
  },
  عربي: {
    text: `لقد غيرت الثورة الرقمية طريقة حياتنا وعملنا. في عالم اليوم المترابط، تلعب التكنولوجيا دوراً محورياً في تشكيل تجاربنا اليومية. من الذكاء الاصطناعي إلى الطاقة المتجددة، تواصل الابتكارات دفع التقدم وخلق فرص جديدة. بينما نتنقل عبر هذه التغييرات، من الضروري فهم كل من فوائد وتحديات مجتمعنا الرقمي المتزايد.`,
    estimatedDuration: 55,
    difficulty: "intermediate",
    code: "ar"
  },
  Spanish: {
    text: `La revolución digital ha transformado nuestra forma de vivir y trabajar. En el mundo interconectado de hoy, la tecnología juega un papel fundamental en nuestras experiencias diarias. Desde la inteligencia artificial hasta las energías renovables, las innovaciones continúan impulsando el progreso y creando nuevas oportunidades. Mientras navegamos por estos cambios, es crucial entender tanto los beneficios como los desafíos de nuestra sociedad cada vez más digital.`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "es"
  },
  Español: {
    text: `La revolución digital ha transformado nuestra forma de vivir y trabajar. En el mundo interconectado de hoy, la tecnología juega un papel fundamental en nuestras experiencias diarias. Desde la inteligencia artificial hasta las energías renovables, las innovaciones continúan impulsando el progreso y creando nuevas oportunidades. Mientras navegamos por estos cambios, es crucial entender tanto los beneficios como los desafíos de nuestra sociedad cada vez más digital.`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "es"
  },
  Espagnol: {
    text: `La revolución digital ha transformado nuestra forma de vivir y trabajar. En el mundo interconectado de hoy, la tecnología juega un papel fundamental en nuestras experiencias diarias. Desde la inteligencia artificial hasta las energías renovables, las innovaciones continúan impulsando el progreso y creando nuevas oportunidades. Mientras navegamos por estos cambios, es crucial entender tanto los beneficios como los desafíos de nuestra sociedad cada vez más digital.`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "es"
  },
  German: {
    text: `Die digitale Revolution hat unsere Art zu leben und zu arbeiten verändert. In der vernetzten Welt von heute spielt Technologie eine zentrale Rolle in unseren täglichen Erfahrungen. Von künstlicher Intelligenz bis hin zu erneuerbaren Energien treiben Innovationen den Fortschritt voran und schaffen neue Möglichkeiten. Während wir durch diese Veränderungen navigieren, ist es entscheidend, sowohl die Vorteile als auch die Herausforderungen unserer zunehmend digitalen Gesellschaft zu verstehen.`,
    estimatedDuration: 55,
    difficulty: "intermediate",
    code: "de"
  },
  Deutsch: {
    text: `Die digitale Revolution hat unsere Art zu leben und zu arbeiten verändert. In der vernetzten Welt von heute spielt Technologie eine zentrale Rolle in unseren täglichen Erfahrungen. Von künstlicher Intelligenz bis hin zu erneuerbaren Energien treiben Innovationen den Fortschritt voran und schaffen neue Möglichkeiten. Während wir durch diese Veränderungen navigieren, ist es entscheidend, sowohl die Vorteile als auch die Herausforderungen unserer zunehmend digitalen Gesellschaft zu verstehen.`,
    estimatedDuration: 55,
    difficulty: "intermediate",
    code: "de"
  },
  Chinese: {
    text: `数字革命已经改变了我们的生活和工作方式。在当今互联互通的世界中，技术在塑造我们的日常体验方面发挥着关键作用。从人工智能到可再生能源，创新不断推动进步并创造新机遇。在我们应对这些变化的过程中，理解我们日益数字化的社会的优势和挑战至关重要。`,
    estimatedDuration: 40,
    difficulty: "intermediate",
    code: "zh"
  },
  中文: {
    text: `数字革命已经改变了我们的生活和工作方式。在当今互联互通的世界中，技术在塑造我们的日常体验方面发挥着关键作用。从人工智能到可再生能源，创新不断推动进步并创造新机遇。在我们应对这些变化的过程中，理解我们日益数字化的社会的优势和挑战至关重要。`,
    estimatedDuration: 40,
    difficulty: "intermediate",
    code: "zh"
  },
  Japanese: {
    text: `デジタル革命は私たちの生活と仕事の仕方を変えました。今日の相互接続された世界では、テクノロジーが私たちの日常体験を形作る上で重要な役割を果たしています。人工知能から再生可能エネルギーまで、革新は進歩を推進し、新しい機会を生み出し続けています。これらの変化に対応する中で、ますますデジタル化する社会の利点と課題の両方を理解することが重要です。`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "ja"
  },
  日本語: {
    text: `デジタル革命は私たちの生活と仕事の仕方を変えました。今日の相互接続された世界では、テクノロジーが私たちの日常体験を形作る上で重要な役割を果たしています。人工知能から再生可能エネルギーまで、革新は進歩を推進し、新しい機会を生み出し続けています。これらの変化に対応する中で、ますますデジタル化する社会の利点と課題の両方を理解することが重要です。`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "ja"
  },
  Korean: {
    text: `디지털 혁명은 우리의 생활과 일하는 방식을 변화시켰습니다. 오늘날의 상호 연결된 세계에서 기술은 우리의 일상적인 경험을 형성하는 데 중추적인 역할을 합니다. 인공지능에서 재생 에너지에 이르기까지, 혁신은 계속해서 진보를 이끌고 새로운 기회를 창출합니다. 이러한 변화를 헤쳐나가면서, 점점 더 디지털화되는 우리 사회의 이점과 과제를 모두 이해하는 것이 중요합니다.`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "ko"
  },
  한국어: {
    text: `디지털 혁명은 우리의 생활과 일하는 방식을 변화시켰습니다. 오늘날의 상호 연결된 세계에서 기술은 우리의 일상적인 경험을 형성하는 데 중추적인 역할을 합니다. 인공지능에서 재생 에너지에 이르기까지, 혁신은 계속해서 진보를 이끌고 새로운 기회를 창출합니다. 이러한 변화를 헤쳐나가면서, 점점 더 디지털화되는 우리 사회의 이점과 과제를 모두 이해하는 것이 중요합니다.`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "ko"
  },
  Italian: {
    text: `La rivoluzione digitale ha trasformato il nostro modo di vivere e lavorare. Nel mondo interconnesso di oggi, la tecnologia svolge un ruolo fondamentale nel plasmare le nostre esperienze quotidiane. Dall'intelligenza artificiale alle energie rinnovabili, le innovazioni continuano a guidare il progresso e a creare nuove opportunità. Mentre navighiamo attraverso questi cambiamenti, è cruciale comprendere sia i benefici che le sfide della nostra società sempre più digitale.`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "it"
  },
  Italiano: {
    text: `La rivoluzione digitale ha trasformato il nostro modo di vivere e lavorare. Nel mondo interconnesso di oggi, la tecnologia svolge un ruolo fondamentale nel plasmare le nostre esperienze quotidiane. Dall'intelligenza artificiale alle energie rinnovabili, le innovazioni continuano a guidare il progresso e a creare nuove opportunità. Mentre navighiamo attraverso questi cambiamenti, è cruciale comprendere sia i benefici che le sfide della nostra società sempre più digitale.`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "it"
  },
  Portuguese: {
    text: `A revolução digital transformou nossa forma de viver e trabalhar. No mundo interconectado de hoje, a tecnologia desempenha um papel fundamental em moldar nossas experiências diárias. Da inteligência artificial às energias renováveis, as inovações continuam impulsionando o progresso e criando novas oportunidades. Enquanto navegamos por essas mudanças, é crucial entender tanto os benefícios quanto os desafios de nossa sociedade cada vez mais digital.`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "pt"
  },
  Português: {
    text: `A revolução digital transformou nossa forma de viver e trabalhar. No mundo interconectado de hoje, a tecnologia desempenha um papel fundamental em moldar nossas experiências diárias. Da inteligência artificial às energias renováveis, as inovações continuam impulsionando o progresso e criando novas oportunidades. Enquanto navegamos por essas mudanças, é crucial entender tanto os benefícios quanto os desafios de nossa sociedade cada vez mais digital.`,
    estimatedDuration: 45,
    difficulty: "intermediate",
    code: "pt"
  }
};

export const getReadingPassage = (language) => {
  // Return the passage for the specified language
  if (!passages[language]) {
    console.error(`No passage found for language: ${language}`);
    throw new Error(`No passage found for language: ${language}`);
  }
  return passages[language];
};