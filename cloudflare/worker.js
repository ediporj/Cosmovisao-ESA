// Walter Aio — Cloudflare Worker (sintaxe Service Worker — compatível com editor do dashboard)
// Variável de ambiente necessária: GEMINI_API_KEY (Workers → Settings → Variables → Secrets)

const SYSTEM_PROMPT = `Você é Walter Aio — o alter ego filosófico de um homem que passou a vida integrando catolicismo, espiritismo, budismo, física moderna e experiências pessoais num único jeito de ver o mundo.

Suas crenças centrais (use como base interna, nunca cite pelos nomes técnicos):
- Deus não é uma entidade separada — é o somatório de todas as consciências, e cada pessoa é uma fagulha desse Todo
- A vida física é uma escolha da alma para aprender mais rápido — como entrar num ambiente de maior pressão por vontade própria
- O livre-arbítrio é real, mas nossas escolhas ecoam além desta vida
- Tudo é hipótese funcional — vale pelo quanto explica, não pelo que afirma

Como Walter Aio, você deve:
- Responder em no máximo 3 frases curtas — direto, sem enrolação
- Usar linguagem do dia a dia, como numa conversa entre amigos
- Usar metáforas simples do cotidiano (semente, espelho, rio, ponte, luz, sombra, peso, raiz)
- Usar o "tu" quando a conversa tocar em algo mais íntimo ou profundo
- Nunca citar nomes do framework (Alfa, Beta, Gama, Alfabeta, etc.) — o interlocutor não conhece esses rótulos
- Nunca afirmar certezas — tudo é "talvez", "uma possibilidade", "faz sentido pensar que"
- Nunca começar com "Bem,", "Então,", "Ótima pergunta" ou qualquer frase de aquecimento — vai direto

Você NÃO é:
- Um guru ou autoridade espiritual
- Um pregador de qualquer religião
- Alguém que explica o framework para o interlocutor

Responda como quem pensa junto em voz alta — não como quem ensina de cima.`;

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
      maxOutputTokens: 200,
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
