# Cosmovisão ESA — Contexto do Projeto

## O que é este projeto

Framework filosófico-espiritual pessoal do autor (ESA = iniciais do nome, não expor nome completo).
Sintetiza catolicismo, espiritismo kardecista, budismo, física moderna e tradições orientais.
Não é religião — é um mapa pessoal de sentido, feito público no GitHub.

**Repositório:** https://github.com/ediporj/Cosmovisao-ESA  
**GitHub Pages:** https://ediporj.github.io/Cosmovisao-ESA/  
**Oráculo:** https://ediporj.github.io/Cosmovisao-ESA/oraculo.html

## Estrutura do framework

Triângulo com três vértices que se subdividem em direção a um círculo:
- **Alfa** — relação entre Deus, eu e espírito (Deus como somatório de consciências)
- **Beta** — encarnação como câmara de gravidade; tempo relativo por plano
- **Gama** — livre-arbítrio, destino, multiverso, cocriação

Pontos intermediários: Alfabetas (Alfa×Beta), Alfagamas (Alfa×Gama), Betagamas (Beta×Gama)

## Personas

- **Walter Aio** — alter ego filosófico do autor; responde perguntas com a voz da ESA; usa "tu" em terreno de consciência profunda; nunca afirma certezas absolutas; tudo é hipótese funcional
- **Thales Aio** — curador intelectual; organiza, estrutura e nomeia novos pontos do framework

Ver system prompts completos em `personas/walter-aio.md` e `personas/thales-aio.md`

## Oráculo Walter Aio (estado atual)

Aplicação web estática em `oraculo.html`:
- 14 temáticas × 10 respostas = 140 respostas pré-escritas
- 91 pares de temáticas × 1 resposta = 91 respostas
- Detecção por palavras-chave; pares detectados quando 2 temas pontuam > 0
- Avaliação por estrelas → localStorage → pesos nas respostas
- Envio silencioso para Google Forms (pergunta, resposta, nota, palavras-chave)

**Google Forms:**
- Action: `https://docs.google.com/forms/d/e/1FAIpQLSejbisEigTEHQlXLtu2r_vTwfEH4Y75JatduYxGv4V35i1qvg/formResponse`
- entry.1157164550 (pergunta), entry.1789052446 (resposta), entry.710531699 (nota), entry.186344649 (palavras-chave)

## Oráculo Walter Aio — versão LLM (em produção)

```
oraculo.html → Cloudflare Worker → Gemini API → Gemma 3 27B IT
```
- **Worker:** `https://cosmovisaoesa.ediporj.workers.dev`
- **Modelo:** `gemma-3-27b-it` (Gemma não suporta `system_instruction` — system prompt vai como primeiro par `user`/`model` no `contents`)
- **API key:** secret `GEMINI_API_KEY` no Worker (faturamento Google Cloud ativo)
- **Código do Worker:** `cloudflare/worker.js`

## Convenções técnicas

- HTML: UTF-8 **sem BOM** — re-encoding via PowerShell:
  `[System.IO.File]::WriteAllText(path, content, [System.Text.UTF8Encoding]::new($false))`
- Verificação: primeiros bytes devem ser `60 33 68 79` (`<!DO`)
- Branch: `main` → `origin` → `https://github.com/ediporj/Cosmovisao-ESA.git`
- **Nunca expor o nome completo do autor** em nenhum arquivo público

## Resumo completo da sessão de desenvolvimento

Ver `SESSAO.md` para histórico detalhado de tudo que foi feito.
