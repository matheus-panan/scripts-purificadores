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
