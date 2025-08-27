# Sistema de Gestão de Leads para Refis e Purificadores

## Visão Geral

Sistema automatizado em Google Apps Script para gerenciar vendas de refis e purificadores de água. Organiza clientes, calcula potencial de compra e distribui tarefas entre vendedoras.

**Problema Resolvido:**
- Antes: Vendedoras perdiam tempo selecionando clientes, sem priorização clara e com distribuição desigual.
- Depois: Gera diariamente listas otimizadas com 40 clientes por vendedora.

**Tecnologias:**
- Google Sheets: Armazena dados.
- Google Apps Script: Executa automações.
- Triggers: Agendam tarefas automáticas.

---

## Estrutura de Arquivos

### Configuração
- **`.clasp.json`**: Conecta código local ao Google Apps Script.
- **`appsscript.json`**: Define fuso horário e versão do JavaScript.
- **`LICENSE`**: Licença MIT.
- **`README.md`**: Instruções básicas.

### Arquivos Funcionais

1. **`geraListas.js`**
   - **Função**: `gerarListasClientes()`
   - **Processo**:
     1. Inicializa planilhas.
     2. Limpa listas antigas.
     3. Filtra clientes com status "Ligar".
     4. Embaralha lista para distribuição justa.
     5. Divide 40 clientes para Maria e 40 para Gabrielly.
     6. Escreve nas planilhas respectivas.

2. **`calculaScore.js`**
   - **Função**: Calcula score de 0 a 100 por cliente.
   - **Critérios**:
     - **Base**: 10 pontos.
     - **Status da Última Ligação**:
       - Venda: +15
       - Caixa postal/Não atende: -5
       - Número incorreto/Outra cidade: -10
       - Não ligar mais: -20
     - **Tempo sem Comprar**:
       - 270-539 dias + "Ligar": +25
       - "Aguardar": +10
       - 540-730 dias: -5
       - 731-1095 dias: -10
       - >1095 dias: -15 a -20
     - **Histórico de Compras**: Multiplicador baseado em número de compras e tempo.
   - **Cores**:
     - Verde (>35): Alta probabilidade.
     - Amarelo (5-35): Média probabilidade.
     - Vermelho (<5): Baixa probabilidade.

3. **`atualizaBase.js`**
   - **Função**: `atualizarBaseDeDadosComHistorico()`
   - **Processo**:
     1. Limpa dados antigos.
     2. Lê histórico de ligações.
     3. Atualiza com última ligação.
     4. Resolve duplicatas, priorizando "Aguardar".
     5. Recalcula scores.

4. **`configGatilhos.js`**
   - **Gatilhos**:
     - 07:55: Gera listas (exceto domingos).
     - 08:05: Copia listas para planilhas individuais.
     - 22:00: Atualiza base e histórico.

5. **`atualizaListaFunc.js`**
   - **Funções**: Copia listas para planilhas de Maria e Gabrielly.
   - **Adicionar Funcionária**:
     ```javascript
     function copiarParaListaNovaFuncionaria() {
       copiarParaLista("Lista NovaFuncionaria", "URL_da_planilha");
     }
     ```

6. **`processaDadosCopia.js`**
   - **Função**: `copiarParaLista(nomeLista, urlDestino)`
   - **Processo**: Valida planilhas, limpa dados antigos, copia novos dados.

7. **`copiaCores.js`**
   - **Função**: Aplica cores (verde/amarelo/vermelho) nas listas.
   - **Opções**: Copia cores por ID, somente ID ou linha completa.

8. **`processaDadosHistorico.js`**
   - **Função**: `copiarHistorico(origemUrl, origemNomeAba, destinoNomeAba)`
   - **Processo**: Registra ligações no histórico central, ordena por data.

9. **`processaDadosPlanilhas.js`**
   - **Funções**:
     - `inicializarPlanilhas()`: Conecta planilhas.
     - `obterDadosPlanilha()`: Lê dados.
     - `limpaPlanilhas()`: Remove dados antigos.
     - `criarListaClientesValidos()`: Filtra clientes.
     - `embaralharArray()`: Mistura lista.

10. **`copiaHistorico.js`**: Copia histórico para Maria e Gabrielly.
11. **`gerabonsClientes.js`**: Separa clientes por qualidade.

---

## Planilhas

### 1. **Base de dados BI**
- **Propósito**: Armazena todos os dados de clientes.
- **Colunas**:
  - A: ID do Cliente (número)
  - B: Nome do Cliente (texto)
  - C: Data Última Compra (data)
  - D: Dias sem Compra (número)
  - E: (vazia)
  - F: Descrição Produto (texto)
  - G: Status (Ligar/Não ligar/Aguardar)
  - H: Número de Compras (número)
  - I: Data Última Ligação (data)
  - J: Status Última Ligação (Venda/Não atende/etc.)
  - K: Observações (texto)
  - L: Score (0-100)
- **Status (G)**: Ligar, Não ligar, Aguardar.
- **Status Ligação (J)**: Venda, Não atende, Caixa postal, Número incorreto, Outra cidade, Duplicata, Não ligar mais.

### 2. **Historico ligações**
- **Propósito**: Registra todas as ligações.
- **Colunas**:
  - A: ID do Cliente
  - B: Nome do Cliente
  - C: Status da Ligação
  - D: Data da Ligação
  - E: Observações
- **Características**: Permanente, ordenado por data, usado para aprendizado.

### 3. **Lista Maria e Lista Gabrielly**
- **Propósito**: Listas diárias de trabalho.
- **Colunas**:
  - A: ID do Cliente
  - B: Nome do Cliente
  - C: Telefone
  - D: Observações
  - E: Status da Ligação (preenchido pela vendedora)
  - F: Observações da Ligação
- **Características**: 40 clientes/dia, limpa diariamente, com cores.

---

## Fluxo Operacional

### 07:55 - Geração de Listas
- Inicializa planilhas, limpa listas antigas, filtra clientes "Ligar", embaralha, divide 40 clientes por vendedora.

### 08:05 - Distribuição
- Copia listas para planilhas individuais com cores aplicadas.

### 08:06-17:59 - Trabalho das Vendedoras
- Ligam para clientes, preenchem status e observações.

### 18:00-21:59 - Finalização
- Vendedoras concluem preenchimento e salvam.

### 22:00 - Processamento Noturno
- Coleta resultados, atualiza histórico, base e scores.

---

## Sistema de Pontuação

### Fórmula
- **Base**: 10 pontos.
- **Status Última Ligação**:
  - Venda: +15
  - Caixa postal/Não atende: -5
  - Número incorreto/Outra cidade: -10
  - Não ligar mais: -20
- **Tempo sem Compra**:
  - 270-539 dias + "Ligar": +25
  - "Aguardar": +10
  - 540-730 dias: -5
  - 731-1095 dias: -10
  - >1095 dias: -15 a -20
- **Histórico de Compras**: Multiplicador por número de compras.
- **Normalização**: Score entre 0 e 100.

### Exemplos
- **Excelente (85)**: Venda recente, 350 dias sem compra, 8 compras.
- **Bom (45)**: Status "Aguardar", 3 compras.
- **Médio (20)**: Caixa postal, 800 dias sem compra.
- **Ruim (2)**: "Não ligar mais", 1200 dias sem compra.

---

## Inteligência do Sistema

- **Memória**: Armazena histórico de ligações.
- **Padrões**: Identifica sazonalidade e comportamento.
- **Otimização**: Ajusta listas com base em resultados.
- **Prevenção**: Evita duplicatas e valida dados.

**Benefícios**:
- **Vendedoras**: Foco em clientes promissores, trabalho equilibrado.
- **Gestão**: Relatórios automáticos, controle total.
- **Negócio**: Mais vendas, menos custos, melhor relacionamento.

---

## Personalização

1. **Ajustar Pontuação** (`calculaScore.js`):
   ```javascript
   if (status_ultimaligacao == "Venda") score += 20; // Aumentar peso
   ```

2. **Mudar Quantidade de Clientes** (`geraListas.js`):
   ```javascript
   var listaMaria = clientesValidos.slice(0, 50);
   ```

3. **Adicionar Funcionária**:
   - Criar planilha individual.
   - Adicionar função em `atualizaListaFunc.js`.
   - Configurar gatilho em `configGatilhos.js`.

4. **Alterar Horários** (`configGatilhos.js`):
   ```javascript
   ScriptApp.newTrigger('rotinaDiasUteis').timeBased().atHour(6).nearMinute(30).everyDays(1).create();
   ```

5. **Mudar Cores** (`calculaScore.js`):
   ```javascript
   if (score > 50) bgColor = "#b7e1cd"; // Mais rigoroso
   ```

---

## Manutenção

- **Diária**: Geração, cópia, atualização (automático).
- **Semanal**: Verificar gatilhos, planilhas, scores.
- **Mensal**: Analisar critérios, distribuição, backup.
- **Trimestral**: Revisar scores, performance, ajustes.

---

## Troubleshooting

1. **Listas não geradas**:
   - Verificar gatilhos, permissões, executar manualmente.
2. **Cores ausentes**:
   - Recalcular scores, executar cópia de cores.
3. **Clientes duplicados**:
   - Limpar base, adicionar validação.
4. **Histórico não atualizado**:
   - Verificar gatilho, URLs, executar manualmente.
5. **Sistema lento**:
   - Otimizar consultas, arquivar dados antigos.

**Erros Comuns**:
- **"Service invoked too many times"**: Adicionar pausas (`Utilities.sleep(1000)`).
- **"No permission"**: Aceitar permissões manualmente.
- **"Service Spreadsheets failed"**: Verificar URLs e planilhas.

**Diagnóstico**:
```javascript
function testarSistema() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Planilha OK: " + ss.getName());
  var base = ss.getSheetByName("Base de dados BI");
  Logger.log("Base: " + (base ? "SIM" : "NÃO"));
}
```

---

## Métricas

- **Taxa de Conversão**: (Vendas / Ligações) × 100.
- **Efetividade do Score**: Comparar conversão por cor.
- **Qualidade da Base**: % de erros (número incorreto, não atende).

**Relatório Diário**:
```javascript
function relatorioDiario() {
  var hoje = new Date();
  var historico = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Historico ligações");
  var dados = historico.getDataRange().getValues();
  var ligacoesHoje = dados.filter(row => row[3].toDateString() === hoje.toDateString());
  var vendas = ligacoesHoje.filter(row => row[2] === "Venda").length;
  Logger.log("Ligações: " + ligacoesHoje.length + ", Vendas: " + vendas);
}
```

---

## Funcionalidades Futuras

- **Agendamento**: Priorizar clientes com data de retorno.
- **WhatsApp**: Enviar listas via API.
- **Dashboard**: Painel com métricas em tempo real.
- **Machine Learning**: Analisar dia, horário e comportamento.

---

## Treinamento

### Vendedoras
- **Dia 1**: Acessar planilha, entender cores, preencher status.
- **Dia 2**: Estratégias por cor, observações úteis, metas.
- **Dia 3**: Interpretar padrões, fornecer feedback, reportar problemas.

### Gestores
- **Semana 1**: Entender sistema, métricas, monitoramento.
- **Semana 2**: Resolver problemas, otimizar, gerar relatórios.
- **Mês 1**: Customizar, analisar estratégias, liderar equipe.

---

## Checklist de Implementação

- **Pré**: Criar planilhas, coletar URLs, configurar permissões.
- **Implementação**: Importar código, configurar gatilhos, testar funções.
- **Pós**: Treinar equipe, monitorar, ajustar, backup.

---

## Suporte

- **Técnico**: Consultar documentação, logs, executar testes.
- **Melhorias**: Documentar problemas, sugerir soluções.
- **Backup**: Código (semanal), dados (mensal), histórico (1 ano).

---

## Benefícios

- **Quantificáveis**:
  - Economia de 2-3h/dia.
  - Conversão 15-30% maior.
  - Distribuição equilibrada.
- **Intangíveis**:
  - Maior motivação.
  - Sistema que aprende.
  - Escalabilidade.

**Próximos Passos**:
1. Implementar checklist.
2. Treinar equipe.
3. Monitorar performance.
4. Ajustar critérios.
5. Planejar expansões.
