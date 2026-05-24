# Acceptance criteria

> Como escrever critérios de aceite. Critério bom é testável, mensurável, sem ambiguidade.

## Formato padrão: Given / When / Then

```
Cenário: <nome curto e descritivo>
  Dado <pré-condição clara>
  E <pré-condição adicional, opcional>
  Quando <ação do ator>
  Então <resultado observável>
  E <resultado adicional, opcional>
```

## Boas práticas

1. **Cenários positivos e negativos.** Cobrir caminho feliz + erros.
2. **Um cenário, um comportamento.** Se tem 3 "E" depois de "Então", divida.
3. **Linguagem do domínio.** Não usar tecnicismo onde regra de negócio basta.
4. **Sem implementação.** Diga **o quê**, não **como**.
5. **Cada critério vira teste.** Sem teste, critério é fantasia.

## Exemplos bons

```
Cenário: criar turma com nome único
  Dado um dono autenticado com plano Pro
  E não existe turma chamada "Turma A" na escola dele
  Quando ele cria uma turma com nome "Turma A" e capacidade 30
  Então a turma é criada
  E aparece na listagem de turmas da escola
  E o evento class.created é emitido com payload contendo id, nome, capacidade
```

```
Cenário: rejeitar criação de turma com nome duplicado
  Dado um dono autenticado
  E já existe uma turma "Turma A" na escola dele
  Quando ele tenta criar outra turma "Turma A"
  Então a resposta é HTTP 409
  E o código de erro retornado é CLASS_NAME_TAKEN
  E nenhum evento é emitido
```

```
Cenário: aluno menor exige consentimento de responsável
  Dado um cadastro de aluno com idade < 18
  Quando o cadastro é submetido
  Então o sistema só ativa o aluno após confirmação por email do responsável
  E o status do aluno enquanto pendente é "aguardando_responsavel"
```

## Exemplos ruins

```
Cenário: criar turma direito
  Dado que o usuário existe
  Quando ele cria turma
  Então tudo funciona
```

Problemas: "direito", "tudo funciona" são imprecisos; não dizem o quê verificar.

```
Cenário: ver listagem
  Quando o usuário acessa a página
  Então o sistema mostra as turmas
```

Problemas: falta pré-condição (qual usuário? quais turmas?), falta detalhe do que ver.

## Checklist de qualidade

- [ ] Cenário tem nome descritivo
- [ ] Pré-condições são objetivas
- [ ] Ação é única
- [ ] Resultados são observáveis
- [ ] Sem palavras vagas ("rápido", "corretamente", "direito")
- [ ] Vinculável a teste automatizado

## Tipos de critério

| Tipo | Característica |
|------|----------------|
| Funcional | comportamento do usuário |
| Regra de negócio | invariante do domínio |
| Permissão | quem pode fazer o quê |
| Erro | como falhar de forma graciosa |
| Performance | "não-funcional" mensurável (ex.: p95 < 300ms) |
| Segurança | confidencialidade, integridade, disponibilidade |
| Observabilidade | logs / métricas geradas |

Não esquecer de cobrir os tipos não-funcionais — eles costumam ser ignorados.

## Onde guardar

Dentro de cada spec, na seção "Critérios de aceite". Veja [../specs/spec-template.md](../specs/spec-template.md).
