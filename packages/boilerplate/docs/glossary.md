# Glossário

Termos consistentes usados em todo o `project-genesis-boilerplate`. Quando houver conflito entre palavras, use a definição daqui.

## Termos centrais

| Termo | Definição neste projeto |
|-------|--------------------------|
| Boilerplate | Este repositório. Sistema guiado de criação de projetos, não template de código. |
| Projeto-filho | Projeto criado a partir deste boilerplate (via `genesis-init.sh`, `degit` ou clone). |
| Tenant | Cliente do SaaS (ex.: uma escola, uma empresa). **Não é usuário**. |
| Usuário | Pessoa física com conta no sistema. |
| Persona | Arquétipo de usuário com job-to-be-done e dor concreta. Não confundir com cargo. |
| Anti-persona | Persona que **não** queremos atender agora. |

## Mentoria e fluxo

| Termo | Definição |
|-------|-----------|
| Fase | Uma das 10 etapas do fluxo (identidade → mercado → valor → produto → módulos → tecnologia → arquitetura → specs → readiness → implementação). |
| Skill | Procedimento orientador armazenado em `.claude/skills/<nome>/SKILL.md`. Invocável por nome. |
| Agent | Personagem especializado em `.claude/agents/<nome>.md`. Pode ser invocado para revisão profunda. |
| Rule | Princípio aplicado automaticamente em `.claude/rules/`. Carregado pelo CLAUDE.md. |
| Hook | Script shell em `.claude/hooks/` ligado a um evento do Claude Code via `settings.json`. |
| Mentor cético construtivo | Postura padrão da IA: pressionar premissas e oferecer alternativas, sem hostilidade. |

## Documentação

| Termo | Definição |
|-------|-----------|
| Spec | Documento em `docs/specs/<modulo>/`. Define contrato de módulo (entidades, regras, APIs, eventos, AC). |
| Spec executável | Spec cujos critérios de aceite viram testes automatizados. |
| ADR | Architecture Decision Record. Vive em `docs/adr/NNNN-titulo.md`. |
| AC | Critério de aceite. Formato Given/When/Then. |
| JTBD | Jobs-To-Be-Done. O que o usuário está "contratando o produto" para fazer. |
| BMC | Business Model Canvas. |
| TAM/SAM/SOM | Total / Serviceable / Obtainable market. |

## Engenharia

| Termo | Definição |
|-------|-----------|
| Módulo | Fronteira de responsabilidade do código com dono claro. Tem API e eventos próprios. |
| Bounded context | Termo DDD usado intercambiavelmente com "módulo" neste boilerplate. |
| Monolito modular | Único deploy unit, mas com módulos isolados por API/eventos. **Default deste projeto**. |
| Idempotência | Mesma operação repetida produz mesmo resultado. Obrigatória em cobrança e webhooks. |
| Multi-tenancy | Suporte a múltiplos tenants. Modelo padrão sugerido: pool (1 banco, `tenant_id` em todas as queries). |
| Spike | Exploração descartável em ≤ 2 semanas. Exceção registrada em rules. |
| Readiness | Estado em que o projeto pode iniciar implementação. Verificável via `.genesis/scripts/check-readiness.sh`. |
| Dogfood | Usar o próprio boilerplate em um projeto real. Registrado em `.genesis/tests/dogfood-tchr.md`. |

## Negócio

| Termo | Definição |
|-------|-----------|
| MVP | Menor conjunto de funcionalidades que **valida a hipótese central** com usuários reais. Não é beta nem POC. |
| Anti-MVP | Lista do que está intencionalmente **fora** do MVP. |
| North Star Metric | Métrica única que melhor representa valor entregue. |
| CAC / LTV / Payback | Custo aquisição cliente / Lifetime value / Tempo para CAC pagar. |
| Take rate | Comissão / GMV em marketplaces. |
| Churn (logo / revenue) | Saída de clientes vs. saída de receita. Distinguir. |
| Inércia | Comportamento atual do usuário quando não compra nada. É concorrente. |

## Segurança

| Termo | Definição |
|-------|-----------|
| PII | Personally Identifiable Information. Tratada conforme `docs/security/data-privacy.md`. |
| RBAC | Role-Based Access Control. Modelo padrão para começo. |
| ABAC | Attribute-Based Access Control. Quando regras viram condicionais complexas. |
| MFA | Multi-Factor Authentication. Obrigatório para admin e papéis financeiros. |
| Threat model | Modelo de ameaças (STRIDE simplificado) em `docs/security/threat-model.md`. |
| Webhook signing | Verificação de origem via segredo compartilhado. Obrigatório para webhooks recebidos. |
| Sanitização de log | Remoção/redação de PII em logs. Aplicada em middleware central. |

## Operação

| Termo | Definição |
|-------|-----------|
| RED | Rate / Errors / Duration. Métricas-padrão por serviço. |
| USE | Utilization / Saturation / Errors. Métricas-padrão por recurso de infra. |
| SLO | Service Level Objective. Alvo interno. |
| RPO / RTO | Recovery Point / Recovery Time Objective. |
| DLQ | Dead-Letter Queue. Onde mensagens com falha repetida acabam. |
| Game day | Simulação controlada de falha. Trimestral quando time tem maturidade. |
| Postmortem | Documento pós-incidente. Sem busca por culpado. |

## Convenções de nome

- **Slugs em kebab-case:** módulos, skills, rules, ADRs.
- **Entidades em PascalCase:** Class, Student, School.
- **Tabelas em snake_case plural:** `classes`, `students`, `schools`.
- **IDs sempre uuid v4.**
- **Timestamps em UTC, ISO-8601.**
