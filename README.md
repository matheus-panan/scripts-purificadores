# Sistema de Gestão de Leads para Refis e Purificadores

## Visão Geral do Projeto

Este sistema automatizado, desenvolvido em Google Apps Script, otimiza o gerenciamento de vendas de refis e purificadores de água. Ele organiza informações de clientes, calcula o potencial de compra de cada um e distribui tarefas de forma equitativa entre as vendedoras.

### Problema Resolvido

- **Antes**: As vendedoras dedicavam tempo excessivo à seleção manual de clientes, resultando em priorização ineficaz e distribuição desigual de trabalho.
- **Depois**: O sistema gera diariamente listas otimizadas, com 40 clientes pré-selecionados para cada vendedora, garantindo eficiência e justiça na distribuição.

### Tecnologias Utilizadas

- **Google Sheets**: Utilizado para armazenamento e organização dos dados.
- **Google Apps Script**: Responsável pela execução das automações e lógica do sistema.
- **Triggers (Gatilhos)**: Empregados para agendar e automatizar tarefas em horários específicos.

---

## Estrutura de Arquivos e Funções

### Arquivos de Configuração

- **`.clasp.json`**: Conecta o ambiente de desenvolvimento local ao projeto no Google Apps Script.
- **`appsscript.json`**: Define configurações essenciais do projeto, como fuso horário e versão do JavaScript.
- **`LICENSE`**: Contém a licença de uso do projeto (Licença MIT).
- **`README.md`**: Fornece instruções básicas e uma visão geral do sistema.

### Arquivos Funcionais (Módulos)

1.  **`geraListas.js`**
    -   **Função Principal**: `gerarListasClientes()`
    -   **Processo**: Inicializa planilhas, limpa listas anteriores, filtra clientes com status "Ligar", embaralha a lista para garantir distribuição justa e divide 40 clientes para Maria e 40 para Gabrielly, escrevendo-os nas planilhas designadas.

2.  **`calculaScore.js`**
    -   **Função Principal**: Calcula um *score* de 0 a 100 para cada cliente, indicando seu potencial de compra.
    -   **Critérios de Pontuação**:
        -   **Base**: 10 pontos.
        -   **Status da Última Ligação**:
            -   Venda: +15 pontos
            -   Caixa postal/Não atende: -5 pontos
            -   Número incorreto/Outra cidade: -10 pontos
            -   Não ligar mais: -20 pontos
        -   **Tempo sem Comprar**:
            -   270-539 dias + "Ligar": +25 pontos
            -   "Aguardar": +10 pontos
            -   540-730 dias: -5 pontos
            -   731-1095 dias: -10 pontos
            -   >1095 dias: -15 a -20 pontos
        -   **Histórico de Compras**: Multiplicador baseado no número de compras e tempo desde a última compra.
    -   **Cores de Classificação do Score**:
        -   **Verde** (>35): Alta probabilidade de compra.
        -   **Amarelo** (5-35): Média probabilidade de compra.
        -   **Vermelho** (<5): Baixa probabilidade de compra.

3.  **`atualizaBase.js`**
    -   **Função Principal**: `atualizarBaseDeDadosComHistorico()`
    -   **Processo**: Limpa dados antigos, lê o histórico de ligações, atualiza a base com a última ligação de cada cliente, resolve duplicatas (priorizando o status "Aguardar") e recalcula os *scores*.

4.  **`configGatilhos.js`**
    -   **Gatilhos Configurados**:
        -   **07:55**: Geração de listas de clientes (exceto aos domingos).
        -   **08:05**: Cópia das listas geradas para as planilhas individuais das vendedoras.
        -   **22:00**: Atualização da base de dados e do histórico de ligações.

5.  **`atualizaListaFunc.js`**
    -   **Funções**: Responsável por copiar as listas de clientes para as planilhas específicas de Maria e Gabrielly.
    -   **Exemplo de Adição de Nova Funcionária**:
        ```javascript
        function copiarParaListaNovaFuncionaria() {
          copiarParaLista("Lista NovaFuncionaria", "URL_da_planilha_da_nova_funcionaria");
        }
        ```

6.  **`processaDadosCopia.js`**
    -   **Função Principal**: `copiarParaLista(nomeLista, urlDestino)`
    -   **Processo**: Valida as planilhas de destino, limpa dados antigos e copia os novos dados de clientes.

7.  **`copiaCores.js`**
    -   **Função Principal**: Aplica as cores (verde, amarelo, vermelho) nas listas de clientes com base no *score*.
    -   **Opções de Aplicação**: Copia cores por ID, somente ID ou para a linha completa.

8.  **`processaDadosHistorico.js`**
    -   **Função Principal**: `copiarHistorico(origemUrl, origemNomeAba, destinoNomeAba)`
    -   **Processo**: Registra todas as ligações no histórico central, garantindo que estejam ordenadas por data.

9.  **`processaDadosPlanilhas.js`**
    -   **Funções Auxiliares**:
        -   `inicializarPlanilhas()`: Estabelece a conexão com as planilhas do Google Sheets.
        -   `obterDadosPlanilha()`: Realiza a leitura dos dados de uma planilha específica.
        -   `limpaPlanilhas()`: Remove dados antigos das planilhas.
        -   `criarListaClientesValidos()`: Filtra e cria uma lista de clientes válidos para contato.
        -   `embaralharArray()`: Mistura a ordem dos elementos em um array para distribuição aleatória.

10. **`copiaHistorico.js`**: Copia o histórico de ligações para as planilhas individuais de Maria e Gabrielly.

11. **`gerabonsClientes.js`**: Separa os clientes com base na sua qualidade e potencial de compra.

---

## Estrutura das Planilhas

### 1. Base de Dados BI

-   **Propósito**: Armazenar de forma centralizada todos os dados dos clientes.
-   **Colunas Principais**:
    -   **A**: ID do Cliente (numérico)
    -   **B**: Nome do Cliente (texto)
    -   **C**: Data da Última Compra (data)
    -   **D**: Dias sem Compra (numérico)
    -   **E**: (Vazia - reservada para futuras expansões)
    -   **F**: Descrição do Produto (texto)
    -   **G**: Status (Ligar / Não ligar / Aguardar)
    -   **H**: Número de Compras (numérico)
    -   **I**: Data da Última Ligação (data)
    -   **J**: Status da Última Ligação (Venda / Não atende / etc.)
    -   **K**: Observações (texto)
    -   **L**: Score (0-100)
-   **Valores para Status (Coluna G)**: `Ligar`, `Não ligar`, `Aguardar`.
-   **Valores para Status da Última Ligação (Coluna J)**: `Venda`, `Não atende`, `Caixa postal`, `Número incorreto`, `Outra cidade`, `Duplicata`, `Não ligar mais`.

### 2. Histórico de Ligações

-   **Propósito**: Registrar detalhadamente todas as interações de ligação com os clientes.
-   **Colunas Principais**:
    -   **A**: ID do Cliente
    -   **B**: Nome do Cliente
    -   **C**: Status da Ligação
    -   **D**: Data da Ligação
    -   **E**: Observações
-   **Características**: Os dados são permanentes, ordenados por data e utilizados para análise e aprendizado contínuo do sistema.

### 3. Lista Maria e Lista Gabrielly

-   **Propósito**: Fornecer listas diárias de clientes para as vendedoras trabalharem.
-   **Colunas Principais**:
    -   **A**: ID do Cliente
    -   **B**: Nome do Cliente
    -   **C**: Telefone
    -   **D**: Observações
    -   **E**: Status da Ligação (preenchido pela vendedora)
    -   **F**: Observações da Ligação
-   **Características**: Cada lista contém 40 clientes por dia, é limpa diariamente e os clientes são apresentados com cores indicativas do *score*.

---

## Fluxo Operacional Detalhado

O sistema opera em um ciclo diário, garantindo a atualização e distribuição contínua de leads:

-   **07:55 - Geração de Listas**: O sistema inicializa as planilhas, limpa as listas antigas, filtra os clientes com status "Ligar", embaralha a lista e divide 40 clientes para cada vendedora.
-   **08:05 - Distribuição das Listas**: As listas geradas são copiadas para as planilhas individuais de Maria e Gabrielly, com as cores de *score* já aplicadas.
-   **08:06-17:59 - Trabalho das Vendedoras**: As vendedoras realizam as ligações para os clientes em suas listas, preenchendo o status e as observações de cada interação.
-   **18:00-21:59 - Finalização do Dia**: As vendedoras concluem o preenchimento de suas listas e salvam as informações.
-   **22:00 - Processamento Noturno**: O sistema coleta os resultados das ligações, atualiza o histórico, a base de dados principal e recalcula os *scores* dos clientes.

---

## Sistema de Pontuação (Score)

### Fórmula de Cálculo

O *score* de cada cliente é calculado com base nos seguintes critérios:

-   **Base**: 10 pontos iniciais.
-   **Status da Última Ligação**:
    -   Venda: +15
    -   Caixa postal/Não atende: -5
    -   Número incorreto/Outra cidade: -10
    -   Não ligar mais: -20
-   **Tempo sem Compra**:
    -   270-539 dias + "Ligar": +25
    -   "Aguardar": +10
    -   540-730 dias: -5
    -   731-1095 dias: -10
    -   >1095 dias: -15 a -20
-   **Histórico de Compras**: Um multiplicador é aplicado com base no número total de compras do cliente.
-   **Normalização**: O *score* final é normalizado para um valor entre 0 e 100.

### Exemplos de Score

-   **Excelente (85)**: Cliente com venda recente, 350 dias sem compra e 8 compras no histórico.
-   **Bom (45)**: Cliente com status "Aguardar" e 3 compras no histórico.
-   **Médio (20)**: Cliente com status "Caixa postal" e 800 dias sem compra.
-   **Ruim (2)**: Cliente com status "Não ligar mais" e 1200 dias sem compra.

---

## Inteligência e Benefícios do Sistema

### Componentes de Inteligência

-   **Memória**: Armazena um histórico detalhado de todas as ligações e interações.
-   **Padrões**: Identifica sazonalidades e comportamentos de compra dos clientes.
-   **Otimização**: Ajusta e refina as listas de clientes com base nos resultados das ligações anteriores.
-   **Prevenção**: Evita a duplicação de clientes e valida a integridade dos dados.

### Benefícios Gerados

-   **Para as Vendedoras**: Permite focar em clientes com maior potencial de conversão e garante uma distribuição de trabalho equilibrada.
-   **Para a Gestão**: Oferece relatórios automáticos e um controle total sobre o processo de vendas.
-   **Para o Negócio**: Resulta em um aumento nas vendas, redução de custos operacionais e um melhor relacionamento com os clientes.

---

## Personalização do Sistema

O sistema é flexível e permite diversas personalizações para se adaptar às necessidades específicas:

1.  **Ajustar Pontuação do Score** (`calculaScore.js`):
    ```javascript
    if (status_ultimaligacao == "Venda") score += 20; // Exemplo: Aumentar o peso da venda
    ```

2.  **Mudar Quantidade de Clientes por Lista** (`geraListas.js`):
    ```javascript
    var listaMaria = clientesValidos.slice(0, 50); // Exemplo: Mudar para 50 clientes
    ```

3.  **Adicionar Nova Funcionária**:
    -   Criar uma nova planilha individual para a funcionária.
    -   Adicionar uma nova função em `atualizaListaFunc.js` para copiar a lista.
    -   Configurar um novo gatilho em `configGatilhos.js` para a distribuição diária.

4.  **Alterar Horários dos Gatilhos** (`configGatilhos.js`):
    ```javascript
    ScriptApp.newTrigger('rotinaDiasUteis').timeBased().atHour(6).nearMinute(30).everyDays(1).create(); // Exemplo: Mudar para 06:30
    ```

5.  **Mudar Cores de Classificação** (`calculaScore.js`):
    ```javascript
    if (score > 50) bgColor = "#b7e1cd"; // Exemplo: Mudar o limite para a cor verde
    ```

---

## Manutenção do Sistema

Para garantir o bom funcionamento e a longevidade do sistema, as seguintes rotinas de manutenção são recomendadas:

-   **Diária**: Geração, cópia e atualização das listas (processos automáticos).
-   **Semanal**: Verificar o status dos gatilhos, a integridade das planilhas e a precisão dos *scores*.
-   **Mensal**: Analisar os critérios de pontuação, a efetividade da distribuição de leads e realizar backups dos dados.
-   **Trimestral**: Revisar a performance geral do sistema, ajustar os critérios de *score* e planejar otimizações.

---

## Troubleshooting (Resolução de Problemas)

### Problemas Comuns e Soluções

1.  **Listas não geradas**: Verificar os gatilhos configurados, as permissões de acesso do script e tentar executar as funções manualmente para diagnóstico.
2.  **Cores ausentes nas listas**: Recalcular os *scores* dos clientes e executar a função de cópia de cores novamente.
3.  **Clientes duplicados na base**: Limpar a base de dados e adicionar validações para prevenir futuras duplicatas.
4.  **Histórico de ligações não atualizado**: Verificar o gatilho de atualização do histórico, as URLs das planilhas e executar a função manualmente.
5.  **Sistema lento**: Otimizar as consultas aos dados e considerar arquivar dados antigos para melhorar a performance.

### Erros Comuns do Google Apps Script

-   **"Service invoked too many times"**: Adicionar pausas no código (`Utilities.sleep(1000)`) para evitar exceder os limites de execução do Google Apps Script.
-   **"No permission"**: Aceitar as permissões solicitadas pelo Google Apps Script manualmente na primeira execução ou após atualizações.
-   **"Service Spreadsheets failed"**: Verificar se as URLs das planilhas estão corretas e se as planilhas existem e estão acessíveis.

### Diagnóstico Rápido

Para verificar a conexão com as planilhas, utilize a seguinte função de diagnóstico:

```javascript
function testarSistema() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Planilha OK: " + ss.getName());
  var base = ss.getSheetByName("Base de dados BI");
  Logger.log("Base: " + (base ? "SIM" : "NÃO"));
}
```

---

## Métricas de Desempenho

Para avaliar a eficácia do sistema, as seguintes métricas são cruciais:

-   **Taxa de Conversão**: Calculada como `(Vendas / Ligações) × 100`. Indica a porcentagem de ligações que resultaram em venda.
-   **Efetividade do Score**: Comparar a taxa de conversão por cada faixa de cor (verde, amarelo, vermelho) para validar a precisão do *score*.
-   **Qualidade da Base**: Medir a porcentagem de erros na base de dados (ex: número incorreto, cliente não atende).

### Relatório Diário de Ligações

É possível gerar um relatório diário das ligações e vendas utilizando a seguinte função:

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

## Funcionalidades Futuras Planejadas

O sistema possui potencial para expansão com as seguintes funcionalidades:

-   **Agendamento Inteligente**: Priorizar clientes com base em datas de retorno ou agendamentos específicos.
-   **Integração com WhatsApp**: Enviar listas de clientes ou notificações via API do WhatsApp.
-   **Dashboard Interativo**: Criar um painel visual com métricas em tempo real para acompanhamento da gestão.
-   **Machine Learning**: Implementar algoritmos para analisar padrões de dia, horário e comportamento do cliente, otimizando ainda mais o *score* e a distribuição.

---

## Plano de Treinamento

### Para Vendedoras

-   **Dia 1**: Acessar a planilha, compreender o significado das cores e aprender a preencher corretamente o status das ligações.
-   **Dia 2**: Desenvolver estratégias de abordagem baseadas nas cores dos clientes, registrar observações úteis e entender as metas diárias.
-   **Dia 3**: Interpretar padrões de comportamento dos clientes, fornecer feedback para melhoria do sistema e reportar problemas ou anomalias.

### Para Gestores

-   **Semana 1**: Compreender o funcionamento completo do sistema, as métricas de desempenho e as ferramentas de monitoramento.
-   **Semana 2**: Aprender a resolver problemas comuns, otimizar configurações e gerar relatórios detalhados.
-   **Mês 1**: Capacitar-se para customizar o sistema, analisar estratégias de vendas e liderar a equipe com base nos dados fornecidos.

---

## Checklist de Implementação

Um guia passo a passo para a implementação do sistema:

-   **Pré-implementação**: Criar as planilhas necessárias no Google Sheets, coletar as URLs de cada planilha e configurar as permissões de acesso para o Google Apps Script.
-   **Implementação**: Importar o código do projeto para o Google Apps Script, configurar os gatilhos de automação e realizar testes completos de todas as funções.
-   **Pós-implementação**: Treinar a equipe de vendas e gestão, monitorar continuamente a performance do sistema, realizar ajustes finos conforme necessário e manter backups regulares.

---

## Suporte e Boas Práticas

### Suporte Técnico

-   **Diagnóstico**: Consultar a documentação do projeto, analisar os logs de execução do Google Apps Script e realizar testes específicos para identificar problemas.
-   **Melhorias**: Documentar detalhadamente quaisquer problemas encontrados e sugerir soluções ou otimizações para o sistema.

### Rotina de Backup

-   **Código**: Realizar backup do código-fonte semanalmente.
-   **Dados**: Realizar backup dos dados das planilhas mensalmente.
-   **Histórico**: Manter um backup do histórico de ligações por pelo menos 1 ano.

---

## Benefícios Quantificáveis e Intangíveis

### Benefícios Quantificáveis

-   **Economia de Tempo**: Redução de 2 a 3 horas diárias no tempo de seleção de clientes.
-   **Aumento da Conversão**: Expectativa de aumento de 15% a 30% na taxa de conversão de vendas.
-   **Distribuição Equilibrada**: Garante que a carga de trabalho seja distribuída de forma justa entre as vendedoras.

### Benefícios Intangíveis

-   **Maior Motivação da Equipe**: Vendedoras mais focadas e motivadas ao trabalhar com listas otimizadas.
-   **Sistema Adaptativo**: O sistema aprende e se aprimora continuamente com base nos resultados.
-   **Escalabilidade**: Facilidade para expandir o sistema e adicionar novas funcionalidades ou vendedoras.

### Próximos Passos

1.  Executar o checklist de implementação.
2.  Realizar o treinamento completo da equipe.
3.  Monitorar de perto a performance do sistema.
4.  Ajustar os critérios de *score* e as configurações conforme a necessidade.
5.  Planejar e implementar futuras expansões e melhorias.

