# Riscos de negócio

> Lista viva. Cada risco tem severidade, probabilidade, dono, gatilho e plano de mitigação.

## Como medir

- **Probabilidade:** baixa / média / alta
- **Impacto:** baixo / médio / alto / fatal
- **Risco crítico** = (alta × alto) ou qualquer × fatal

## Riscos identificados

### R-001 — _(nome curto)_

| Campo | Valor |
|-------|-------|
| Categoria | mercado / regulatório / financeiro / dependência / time / operacional |
| Descrição | _(o que pode dar errado)_ |
| Probabilidade | baixa / média / alta |
| Impacto | baixo / médio / alto / fatal |
| Gatilho (como detectamos) | _(métrica ou evento)_ |
| Dono | _(nome ou papel)_ |
| Mitigação preventiva | _(o que reduz a chance)_ |
| Plano se ocorrer | _(reação imediata)_ |
| Status | aberto / mitigado / aceito |

### R-002 — _(próximo)_

_(Repetir template.)_

## Riscos típicos para começar a pensar

| Risco | Categoria | Probabilidade típica | Impacto típico |
|-------|-----------|----------------------|----------------|
| Gateway bloqueia conta da plataforma | dependência | média | alto |
| Concorrente baixa preço pela metade | mercado | média | médio |
| LGPD aperta com multa | regulatório | baixa | alto |
| Founder não conseguir financiar 18 meses | financeiro | média | fatal |
| Churn > 10% mensal no primeiro semestre | operacional | alta | alto |
| Dependência de 1 cliente grande (>20% MRR) | concentração | varia | alto |
| Talento sênior sair sem transferência | time | média | alto |
| Custo de infra crescer não-linear com usuários | operacional | média | médio |

## Cadência de revisão

- Riscos críticos: revisar quinzenal
- Outros: revisar mensal
- Novos: registrar em ≤ 24h após identificar

## Conexão com outras áreas

- Riscos técnicos: ver `docs/architecture/` e `docs/security/threat-model.md`
- Riscos de produto: ver `docs/product/mvp-scope.md` (sucesso / fracasso)
- Riscos de monetização: ver `docs/business/monetization.md`
