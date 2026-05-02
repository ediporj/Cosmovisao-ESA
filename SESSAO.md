# Resumo da Sessão de Desenvolvimento — Cosmovisão ESA

**Repositório:** https://github.com/ediporj/Cosmovisao-ESA  
**GitHub Pages:** https://ediporj.github.io/Cosmovisao-ESA/  
**Data:** 2026-04-27

---

## O que é o projeto

A **Cosmovisão ESA** é um framework filosófico-espiritual pessoal do autor (ESA = iniciais do nome). Sintetiza catolicismo, espiritismo kardecista, budismo, física moderna e tradições orientais num único sistema coerente. Não é religião — é um mapa pessoal de sentido, feito público.

O framework parte de três vértices (**Alfa, Beta, Gama**) que formam um triângulo. Novos pontos intermediários vão surgindo entre os vértices (Alfabetas, Alfagamas, Betagamas), subdividindo o triângulo progressivamente em direção a um círculo.

---

## O que foi feito nesta sessão

### 1. Animação SVG (`Animacao.html`)
- Triângulo → polígono → círculo com animação SMIL
- Rótulos para todos os pontos intermediários (todas as gerações)
- Arcos laranja mostrando a distância entre o polígono atual e o círculo unitário
- Publicado em: `https://ediporj.github.io/Cosmovisao-ESA/Animacao.html`

### 2. Estrutura do repositório
Arquivos criados a partir de exportação do ChatGPT:

```
framework/
  definicoes-fundamentais.md     — racional, razoável, ateu, individualidade de Deus
  angustia-e-deus.md             — aproximar-se de Deus é angustiante
  estrutura.md
  ponto-alfa.md
  ponto-beta.md
  ponto-gama.md
  correlacao-capitulos.md        — pontos do framework × capítulos do livro
  alfa/
    alfa-1.md                    — Microcosmo e Macrocosmo
    alfa-2.md                    — Onipresença e Física Quântica
    alfa-3.md                    — A Criança e o Infinito
  alfabeta/
    alfabeta-1.md  até alfabeta-7.md
  alfa3beta/
    alfa3beta0.md                — O Despertar de Deus no Caos
    alfa3beta1.md                — A Consciência do Jogador
  alfagama/
    alfagama-1.md                — A Vontade Fragmentada
  betagama/
    betagama-1.md                — As Trilhas do Tempo Paralelo
  referencias/
    blavatsky-teosofia.md
personas/
  walter-aio.md                  — system prompt + guia de uso
  thales-aio.md                  — system prompt + guia de uso
  A_cabeca_do_Walter-aio.md      — raciocínio interno da persona (criado pelo autor)
oraculo/
  raciocinio-walter-aio.md       — fluxo de pensamento durante criação das 231 respostas
```

### 3. Oráculo Walter Aio (`oraculo.html`)
Aplicação web estática completa. Publicada em:  
`https://ediporj.github.io/Cosmovisao-ESA/oraculo.html`

**Funcionamento atual (versão estática):**
- Detecção de tema por palavras-chave na pergunta
- 14 temáticas × 10 respostas = 140 respostas
- 91 pares de temáticas × 1 resposta = 91 respostas
- **231 respostas totais** escritas manualmente na voz de Walter Aio
- Avaliação por estrelas (1-5) com pesos em localStorage
- Envio silencioso para Google Forms (pergunta, resposta, nota, palavras-chave)
- Efeito typewriter na resposta
- Sem backend, sem API key, sem limite de consultas

**Google Forms:**
- URL: `https://docs.google.com/forms/d/e/1FAIpQLSejbisEigTEHQlXLtu2r_vTwfEH4Y75JatduYxGv4V35i1qvg/formResponse`
- Campos: `entry.1157164550` (pergunta), `entry.1789052446` (resposta), `entry.710531699` (nota), `entry.186344649` (palavras-chave)

**Temáticas do DB:**
`deus`, `morte`, `amor`, `destino`, `liberdade`, `consciencia`, `tempo`, `angustia`, `criacao`, `karma`, `encarnacao`, `ciencia`, `sentido`, `ateu`, `silencio` (fallback)

**Lógica de detecção de pares:**
```javascript
// Detecta os 2 temas mais pontuados
// Se ambos > 0, monta chave alfabética: [t1, t2].sort().join('_')
// Verifica se existe em PAIRS → serve resposta do par com label "T1 × T2"
```

### 4. README
- Chamada para o oráculo no topo com badge
- Seção "Como contribuir" com formas concretas de participação
- Nome completo do autor removido de todos os arquivos
- Link para raciocínio do oráculo

---

## Estado atual — limitação conhecida

A versão com respostas pré-escritas funciona, mas tem limitação: as perguntas reais são muito específicas e as respostas genéricas nem sempre ressoam bem.

---

## Oráculo com LLM — CONCLUÍDO ✓

**Arquitetura em produção:**
```
oraculo.html → Cloudflare Worker → Gemini API (Google AI Studio) → Gemma 3 27B IT
```

- **Worker:** `https://cosmovisaoesa.ediporj.workers.dev` (deploy no dashboard Cloudflare)
- **Modelo:** `gemma-3-27b-it` via Gemini API
- **API key:** armazenada como secret no Worker (`GEMINI_API_KEY`) — nunca exposta no HTML
- **Conta Google AI Studio:** faturamento ativado (necessário mesmo no tier gratuito)

**Lições aprendidas:**
- Cloudflare dashboard só aceita sintaxe Service Worker (`addEventListener`), não ES modules (`export default`)
- Gemma não suporta `system_instruction` — system prompt deve ser injetado como primeiro par `user`/`model` no array `contents`
- Modelo `gemini-2.0-flash` (sem versão) foi depreciado; usar `gemini-2.0-flash-001` ou Gemma
- Faturamento precisa estar ativo no Google Cloud mesmo para requisições gratuitas

**Arquivos:**
- `cloudflare/worker.js` — código do Worker (para referência e re-deploy)
- `oraculo.html` — frontend que chama o Worker

---

## Convenções técnicas importantes

- Arquivos HTML devem ser salvos em **UTF-8 sem BOM**
- Re-encoding via PowerShell: `[System.IO.File]::WriteAllText(path, content, [System.Text.UTF8Encoding]::new($false))`
- Verificação: primeiros bytes devem ser `60 33 68 79` (`<!DO`)
- Repositório: branch `main`, remote `origin` → `https://github.com/ediporj/Cosmovisao-ESA.git`
