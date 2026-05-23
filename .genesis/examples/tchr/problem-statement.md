# Problem statement — tchr (exemplo)

> Documento de exemplo. Demonstra o nível de profundidade esperado em `docs/product/problem-statement.md`.

## Problema em 1 frase

Escolas pequenas e professores autônomos perdem tempo e dinheiro porque administram alunos, conteúdo e cobrança em ferramentas desconectadas, e não conseguem vender cursos para um público fora do círculo imediato sem pagar tarifas altíssimas a marketplaces genéricos.

## Quem sofre

| Persona | Como esse problema aparece para ela | Frequência |
|---------|--------------------------------------|------------|
| Dona de escola de idiomas com 40–150 alunos | Cadastra aluno em planilha, cobra mensalidade em boleto manual, envia conteúdo em grupo de WhatsApp, e perde alunos por demora em perceber atraso de pagamento. | Diária |
| Professor autônomo de música ou reforço | Tem alunos no Instagram, mas para vender um curso gravado precisa criar conta no Hotmart, pagar 30% de comissão e ainda gerir aluno avulso em planilha. | Semanal |
| Cursinho pré-vestibular pequeno | Tem múltiplos professores, turmas com horários conflitantes, sistema financeiro caseiro, e atende WhatsApp dos pais nos finais de semana porque a secretaria não consegue centralizar. | Diária |

## Evidências

- **Entrevistas:** 14 entrevistas qualitativas (8 donas de escola de idiomas, 4 professores autônomos, 2 cursinhos), gravadas e resumidas em `docs/validation/user-interviews.md`.
- **Pesquisa de mercado:** SEBRAE estima 35 mil escolas privadas pequenas de educação básica e cursos livres no Brasil (sem contar universidades), o que dá um SAM relevante para gestão.
- **Comunidades:** posts recorrentes em grupos de Facebook como "Donos de escolas de idiomas" e "Professores Empreendedores" reclamando exatamente desse encaixe de ferramentas (printscreens em `docs/research/`).
- **Concorrentes existentes:** Wisecup, Conta Azul + Eduzz somados, Hotmart isolado. Nenhum atende a combinação "gestão escolar + marketplace integrado" de forma simples e barata.
- **Tentativas anteriores próprias:** o fundador já tentou construir versões mais limitadas; faltou disciplina de produto, não de capacidade técnica — daí a adoção deste boilerplate.

## Custo de não resolver

Tradução para o usuário-âncora (dona de escola de idiomas):

- **Financeiro:** estima-se entre R$ 1.500 e R$ 4.000 por mês de receita perdida por turma — entre mensalidades atrasadas que viram inadimplência e alunos que evadem sem ninguém perceber.
- **Tempo:** secretaria gasta 8–12 horas / semana em planilhas, ligações de cobrança e replicação de informação entre WhatsApp e arquivos.
- **Emocional:** dona da escola se sente "operadora" em vez de gestora; vergonha de mostrar o controle bagunçado para parceiros.
- **Estratégico:** escola nunca cresce além do "número de alunos que o dono consegue gerenciar na cabeça", limitando expansão.

Para o professor autônomo:

- Comissão de marketplace genérico come 20–35% da venda.
- Sem ferramenta para acompanhar aluno após a venda, churn de curso é alto e referrals não acontecem.

## Como resolvem hoje

| Solução atual | Limitação | Por que ainda usam |
|---------------|-----------|---------------------|
| Planilha do Google + grupo de WhatsApp | Não cobra automático, não escala, perde contexto | É grátis, é familiar, todo mundo já entende |
| Conta Azul (financeiro) + planilha (alunos) | Financeiro genérico, sem ligação com gestão escolar | Já assinaram, mudar dá trabalho |
| Hotmart | Não cuida da escola, alta comissão, sem visão integrada | Tem audiência, tem checkout, "funciona" |
| Sistema escolar grande (RM, ClassApp, etc.) | Caro, complexo, configuração demorada | Não usam — desistem na implantação |
| Estagiário ou secretaria sobrecarregada | Caro a longo prazo, gera dependência humana frágil | Funciona enquanto a pessoa fica |

## Por que esse problema importa AGORA

- **Pix consolidado** torna cobrança instantânea acessível para todos os portes de escola; era inviável há 4 anos.
- **Creator economy em educação** explodiu pós-2020 — há fila de professores tentando vender o próprio curso e batendo na parede da plataforma genérica.
- **Pressão regulatória** da LGPD obriga até escolas pequenas a estruturarem dados de menores; ninguém faz isso bem em planilha. Quem oferecer conformidade embutida ganha vantagem.
- **Custos de infraestrutura** caíram a ponto de viabilizar uma plataforma SaaS de baixo ticket que antes seria inviável.

## Hipóteses centrais

1. Donas de escolas pequenas estão dispostas a pagar entre R$ 199 e R$ 399 / mês por uma plataforma que entregue gestão integrada + cobrança automática + marketplace de cursos. **(Confiança: 2 — precisa validação com smoke test e piloto pago.)**
2. Professores autônomos vão preferir um marketplace com comissão menor (8–12%) e visão de aluno integrada à venda da prateleira do Hotmart. **(Confiança: 2 — precisa de ao menos 10 criadores reais publicando.)**
3. O fluxo "criar curso e vender no marketplace" pode coexistir com "gerir escola tradicional" sem confundir as personas. **(Confiança: 3 — duas entrevistas confirmaram interesse, mas pode haver canibalização de foco.)**

Cada hipótese tem entrada planejada em `docs/research/validation-plan.md`.

## Anti-problemas

- Não estamos resolvendo a falta de pedagogia das escolas.
- Não estamos competindo com plataformas de conteúdo enciclopédico (Khan Academy, etc.).
- Não estamos resolvendo o problema de produção de conteúdo (gravação, edição).
- Não estamos cuidando da emissão de NF-e completa (terceirizada via integração quando o tenant precisar).
