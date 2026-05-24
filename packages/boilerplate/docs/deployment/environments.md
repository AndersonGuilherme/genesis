# Environments

> Quantos ambientes, o que cada um faz, como se diferenciam. Sem isto claro, dev pisa em prod.

## Ambientes padrão

| Nome | Propósito | Dados | Acesso | URL |
|------|-----------|-------|--------|-----|
| local | dev individual | sintético / seed | dev | localhost |
| dev / preview | branch em CI | sintético | dev | dev.\<dominio\> |
| staging | espelho de prod | sintético + amostra anonimizada | dev + QA + produto | staging.\<dominio\> |
| production | clientes reais | reais | restrito | app.\<dominio\> |

## Princípios

1. **Dados reais só em produção.** Nunca copiar prod para dev sem anonimização.
2. **Staging = produção em escala menor.** Mesma stack, mesmas migrações, mesma observabilidade.
3. **Configuração via variável de ambiente.** Sem hardcode.
4. **Segredos por ambiente.** Cofres distintos.

## Isolamento

| Recurso | Isolamento entre ambientes |
|---------|----------------------------|
| Banco de dados | instâncias separadas |
| Storage | buckets separados |
| Filas | tópicos/queues separados |
| Domínio | subdomínio dedicado |
| Chaves de gateway | testkey vs. livekey |

## Provisionamento

- Como infra: _(ex.: Terraform / Pulumi / scripts)_
- Pipeline de provisionamento separado do pipeline de deploy
- Estado armazenado em backend remoto + lock

## Variáveis de ambiente

- Lista mínima documentada (sem valores reais) em `docs/deployment/env-vars.md` (criar quando time crescer)
- Valor injetado por cofre, nunca em arquivo no repo

## Seed de dados

- Local: rico, com casos comuns e edge cases
- Dev: idem
- Staging: dados sintéticos volumosos para testar performance
- Produção: nada de seed após primeiro tenant

## Acesso humano

| Ambiente | Quem entra | Como |
|---------|-------------|------|
| Local | dev | livre |
| Dev | dev | SSO |
| Staging | dev + QA + PM | SSO |
| Produção | engenharia on-call + admin | SSO + MFA + audit log |

Acesso de leitura ao banco de produção: restrito; preferir ferramentas de BI com mascaramento.

## Limpeza

- Branches preview: deletadas após merge ou 30 dias
- Logs de ambiente dev: 7 dias
- Backups dev: 7 dias

## Custos

| Ambiente | Custo aproximado / mês |
|---------|--------------------------|
| Dev compartilhado | _(R$)_ |
| Staging | _(R$)_ |
| Produção | _(R$)_ |

Revisar mensalmente.
