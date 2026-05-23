# Consent Form: <nome-da-finalidade>

> Aplicado pela skill `lgpd-define-consent-strategy`. Um arquivo por finalidade.
> Texto exibido ao titular + metadados de versionamento.

## Identificação

- **Finalidade**: <finalidade específica, ex.: "Envio de newsletter mensal sobre cursos novos">
- **Categoria no inventory**: <ID da OP correspondente, ex.: OP-04>
- **Base legal**: consentimento (art. 7, I)
- **Versão**: <v1 | v2 | ...>
- **Hash do texto**: <sha256 do texto exato exibido>
- **Vigência**: <YYYY-MM-DD até substituição>

## Texto exibido ao titular

> Concordo em receber emails periódicos com novidades sobre cursos, ofertas e conteúdo educacional do <nome-do-produto>.
>
> Posso revogar este consentimento a qualquer momento em "Meus Consents" (`/me/consents`) ou clicando em "descadastrar" no rodapé de qualquer email.
>
> Saiba mais na Política de Privacidade (`/privacy`).

## UI obrigatória

- [ ] Checkbox **desmarcado** por default.
- [ ] Texto curto + link pra política completa.
- [ ] Sem coerção (não bloqueia uso do produto se titular não consentir nesta finalidade).
- [ ] Confirmação visível após grant.
- [ ] Endpoint de revogação acessível.

## Registro no backend

Ao titular marcar e enviar:

```
INSERT INTO consents (
  user_id, purpose, version, granted_at, granted_ip, granted_user_agent
) VALUES (
  $1, 'marketing.newsletter', 'v1', now(), $2, $3
)
```

Ao revogar:

```
UPDATE consents
SET revoked_at = now(), revoked_ip = $2, revoked_user_agent = $3
WHERE user_id = $1 AND purpose = 'marketing.newsletter' AND revoked_at IS NULL
```

## Audit log

```json
{
  "event": "consent.granted",
  "user_id": "<uuid>",
  "purpose": "marketing.newsletter",
  "version": "v1",
  "ip": "<ip>",
  "timestamp": "<iso8601>"
}
```

## SLA de propagação

- Revogação ativa: imediato no próximo request da mesma finalidade.
- Batch jobs (envio de email): até 24h para deixar de enviar.

## Reconsent

Texto muda → nova versão → novo hash → próximo login mostra banner pra reconsentir → registro `consent.granted` com `version = nova`.

## Checklist final

- [ ] Texto sem ambiguidade.
- [ ] Link pra política completo.
- [ ] Checkbox desmarcado.
- [ ] Endpoint de revogação testado.
- [ ] Versão + hash registrados.
- [ ] Audit log emitido em grant + revoke.
