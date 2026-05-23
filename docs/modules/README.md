# Módulos

> Cada módulo é uma fronteira de responsabilidade. Nem componente técnico, nem feature isolada — é uma área coesa do domínio.

## O que é um módulo aqui

- Um módulo tem **dono**, **propósito**, **regras de negócio próprias**, **API**, **eventos** e **persistência**.
- Um módulo **não compartilha banco** com outro sem contrato explícito.
- Mudanças internas em um módulo **não devem quebrar** outros.

## Como organizar

```
docs/modules/
├── README.md                  (este arquivo)
├── module-template.md         (template a copiar)
├── <nome-modulo>.md           (uma spec por módulo)
```

## Ordem de implementação

Módulos são implementados na ordem em que destravam o MVP. Geralmente:

1. **Identidade** (auth, tenants, users)
2. **Domínio núcleo** (entidades centrais do produto)
3. **Operação** (regras de uso, permissões, workflows)
4. **Monetização** (cobrança, comissão, planos)
5. **Comunicação** (emails, notificações)
6. **Painéis** (dashboards, relatórios)
7. **Marketplace** (se aplicável)
8. **Admin** (back-office)

A ordem real depende da hipótese central do MVP — definir em [../product/mvp-scope.md](../product/mvp-scope.md).

## Lista de módulos do projeto

_(preencher após Fase 7 de arquitetura e Fase 8 de specs)_

| Módulo | Status | Spec | Owner |
|--------|--------|------|-------|
| _(ex.: identity)_ | _(não iniciado)_ | _(link)_ | _(nome)_ |
| _(ex.: school-management)_ | _(...)_ | _(...)_ | _(...)_ |
| _(ex.: catalog)_ | _(...)_ | _(...)_ | _(...)_ |
| _(ex.: billing)_ | _(...)_ | _(...)_ | _(...)_ |
| _(ex.: marketplace)_ | _(...)_ | _(...)_ | _(...)_ |

## Regras de fronteira

1. Módulo A só fala com Módulo B via **API pública** ou **eventos** desse módulo.
2. Cada módulo expõe um **contrato versionado**.
3. Quebrar contrato exige ADR e período de coexistência.
4. **Nada de imports cruzados** de classes internas.

## Eventos

- Cada módulo declara os eventos que **emite** e os que **consome**.
- Esquema dos eventos versionado em `docs/specs/events/`.
- Idempotência por chave de domínio (não por ordem de chegada).

## Spec por módulo

Use [../../.genesis/templates/module-spec-template.md](../../.genesis/templates/module-spec-template.md). Coloque o resultado em `docs/specs/<nome-modulo>/`.

## Sinais de módulo bem-formado

- Você consegue substituir o módulo inteiro mantendo o contrato.
- Testes do módulo rodam sem subir o resto do sistema.
- Mudança de regra de negócio mexe em 1 lugar, não em 5.

## Sinais de módulo mal-formado

- Outros módulos consultam o banco dele direto.
- Mudança simples exige tocar em vários módulos.
- Não tem ninguém que saiba explicar a fronteira.
