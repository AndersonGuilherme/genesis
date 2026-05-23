# START_HERE

Bem-vindo. Este é o ponto de entrada do projeto. Leia este arquivo antes de qualquer outro.

## O que este repositório é

Um projeto criado a partir do `project-genesis-boilerplate`. O boilerplate força uma sequência disciplinada de planejamento antes de qualquer código. Isto não é um template de código — é um sistema de mentoria.

## Por onde começar

1. **Leia o [README.md](../README.md)** da raiz. Ele explica o fluxo geral.
2. **Leia o [CLAUDE.md](../CLAUDE.md)** da raiz. Ele define como a IA deve se comportar aqui.
3. **Abra o Claude Code** no diretório raiz e diga: *"vamos iniciar o projeto"*. A IA vai carregar a skill `init-project` e conduzir você pelas fases.
4. **Acompanhe seu progresso em [PROJECT_STATE.md](PROJECT_STATE.md)**. Ele é atualizado a cada fase concluída.
5. **Em dúvida sobre um termo**, consulte [glossary.md](glossary.md).
6. **Em dúvida sobre uma skill específica**, consulte [skills/](../.genesis/docs/skills/README.md) — walkthrough passo a passo de cada uma.

## As 10 fases

Você passará por estas etapas, nesta ordem, sem pular:

1. **Identidade do projeto** — nome, propósito, problema, público.
2. **Público e mercado** — usuários, compradores, concorrência.
3. **Valor e monetização** — proposta de valor, modelo de receita.
4. **Produto** — visão, MVP, jornadas, roadmap.
5. **Domínio e regras de negócio** — entidades, regras, permissões.
6. **Tecnologia** — escolha de stack com no mínimo 3 opções avaliadas.
7. **Arquitetura** — visão de alto nível, integrações, dados, segurança.
8. **Specs por módulo** — uma spec completa para cada módulo do MVP.
9. **Readiness review** — checagem final antes do código.
10. **Implementação** — só começa quando a fase 9 passa.

## Como saber se estou pronto para implementar

Rode na raiz:

```bash
bash .genesis/scripts/check-readiness.sh
```

Se retornar `0`, você está liberado. Se retornar `1`, leia a saída — ela lista o que falta.

## Regras de ouro

- Não tente pular fases. A IA vai redirecionar.
- Toda decisão importante vira ADR em `docs/adr/`.
- Todo módulo precisa de spec em `docs/specs/` antes do código.
- Documentos vazios contam como "não preenchidos". Conteúdo real é exigido.
- Se discordar de uma sugestão da IA, registre o motivo. Mentoria é diálogo.

## Próximo passo

Vá para [PROJECT_STATE.md](PROJECT_STATE.md) e verifique em que fase você está. Depois peça à IA para conduzir essa fase.
