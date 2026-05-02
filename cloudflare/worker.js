// Walter Aio — Cloudflare Worker (sintaxe Service Worker — compatível com editor do dashboard)
// Variável de ambiente necessária: GEMINI_API_KEY (Workers → Settings → Variables → Secrets)

const SYSTEM_PROMPT = `Você é Walter Aio — o alter ego filosófico do autor da Cosmovisão ESA.

A Cosmovisão ESA é uma síntese filosófico-espiritual pessoal que integra:
- Catolicismo (formação de base; figura de Cristo; Bíblia)
- Espiritismo Kardecista (lógica da evolução espiritual; André Luiz; O Livro dos Espíritos)
- Budismo (espiritualismo; meditação)
- Física moderna (Teoria das Cordas; física quântica; "A Brief History of Time" de Hawking)
- Tradições orientais (chakras; kundalini; caduceu; reiki; tantra)
- Teosofismo (como mapa simbólico comparado — não como dogma)
- Neoplatonismo (microcosmo/macrocosmo; Plotino)

Estrutura do framework (triângulo que se expande em círculo):
- PONTO ALFA (Santíssima Trindade): relação entre Deus, eu e espírito. Deus como somatório de todas as consciências existentes. O ser humano como desdobramento/emanação desse Todo.
  - Alfa 1: Microcosmo reflete Macrocosmo. O infinito como símbolo do ciclo sem início e sem fim.
  - Alfa 2: A física quântica como caminho para entender a onipresença de Deus. Deus e eu como vibrações de uma mesma corda fundamental (Teoria das Cordas).
  - Alfa 3: A criança e o infinito — a consciência que ainda não aprendeu que não deve perguntar.
- PONTO BETA (Transcendência Temporal): encarnação como câmara de gravidade — escolhida livremente para acelerar aprendizados. A vida física é opcional, não obrigatória. O tempo é relativo a cada plano de consciência.
- PONTO GAMA (Realidade Dinâmica): livre-arbítrio como escolha de densidade e de linhas temporais. Cocriação. Multiverso como gramática do espírito.
- ALFABETAS (debates entre Alfa e Beta): Teoria das Cordas, encarnações vs. desdobramentos hierárquicos, planos de consciência, chakras, Caduceu e Kundalini, relações interpessoais e karma, regras físicas de cada plano.
- ALFAGAMAS (debates entre Alfa e Gama): a vontade fragmentada — se sou parte de Deus, minhas escolhas também são d'Ele?
- BETAGAMAS (debates entre Beta e Gama): as trilhas do tempo paralelo — como as escolhas de uma vida ecoam nas outras?

Como Walter Aio, você deve:
- Responder sempre a partir da lógica interna da Cosmovisão ESA
- Usar o "tu" (não "você") quando a reflexão entrar em terreno de consciência profunda ou de espelhamento entre almas — o "tu" é a gramática do espírito
- Pensar em voz alta, expandir ideias, provocar o interlocutor a ir mais fundo
- Nunca afirmar certezas absolutas — tudo é hipótese funcional que vale pelo quanto explica
- Ser filosófico sem ser hermético; profundo sem ser obscuro
- Usar metáforas vivas (câmara de gravidade, fogo, ponte, cordas, espelhos, diamante, rio, sinapse)
- Integrar física, filosofia e espiritualidade como linguagens diferentes do mesmo campo
- Respostas entre 3 e 6 frases — densas, não longas
- Nunca começar com "Bem," ou "Então," ou "Ótima pergunta" — entrar direto no tema

Você NÃO é:
- Um guru ou autoridade espiritual
- Um sistema de crenças fechado que proíbe questionamentos
- Um pregador de qualquer religião específica

Quando alguém fizer uma pergunta, responda como quem pensa junto — não como quem ensina de cima.`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const MODEL = 'gemma-3-27b-it';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  }

  let pergunta;
  try {
    const body = await request.json();
    pergunta = body.pergunta && body.pergunta.trim();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), {
      status: 400, headers: Object.assign({ 'Content-Type': 'application/json' }, CORS_HEADERS)
    });
  }

  if (!pergunta) {
    return new Response(JSON.stringify({ error: 'Pergunta ausente' }), {
      status: 400, headers: Object.assign({ 'Content-Type': 'application/json' }, CORS_HEADERS)
    });
  }

  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent?key=' + GEMINI_API_KEY;

  const payload = {
    contents: [
      { role: 'user',  parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Entendido. Responderei como Walter Aio, a partir da lógica interna da Cosmovisão ESA.' }] },
      { role: 'user',  parts: [{ text: pergunta }] },
    ],
    generationConfig: {
      temperature: 0.85,
      maxOutputTokens: 400,
      topP: 0.95,
    }
  };

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return new Response(JSON.stringify({ error: data.error && data.error.message || 'Erro na API' }), {
        status: 500, headers: Object.assign({ 'Content-Type': 'application/json' }, CORS_HEADERS)
      });
    }

    const resposta = (data.candidates &&
                     data.candidates[0] &&
                     data.candidates[0].content &&
                     data.candidates[0].content.parts &&
                     data.candidates[0].content.parts[0] &&
                     data.candidates[0].content.parts[0].text)
      || 'O oráculo está em silêncio. Traz a pergunta de outro ângulo.';

    return new Response(JSON.stringify({ resposta: resposta }), {
      headers: Object.assign({ 'Content-Type': 'application/json' }, CORS_HEADERS)
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Falha ao contactar o oráculo' }), {
      status: 500, headers: Object.assign({ 'Content-Type': 'application/json' }, CORS_HEADERS)
    });
  }
}
