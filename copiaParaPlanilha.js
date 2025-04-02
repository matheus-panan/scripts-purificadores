function copiarParaListaMaria() {
  try {
    // 1. Acessar a planilha e aba de origem
    var origem = SpreadsheetApp.getActiveSpreadsheet();
    var sheetOrigem = origem.getSheetByName("Lista Maria");
    
    if (!sheetOrigem) 
      throw new Error("A aba 'Lista Maria' não foi encontrada na planilha de origem");

    // 2. Acessar a planilha de destino
    var destino = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1SGzQA62IQVkjwD0fmejLsLMHoKz53B77J-8xCu7jIgw/edit");
    
    if (!destino) 
      throw new Error("Não foi possível acessar a planilha de destino");
    
    // 3. Obter ou criar a aba de destino
    var sheetDestino = destino.getSheetByName("Lista Maria") || destino.insertSheet("Lista Maria");

    sheetDestino.getRange("A1:D41").clearContent();
    
    // 4. Obter dados da origem
    var dados = sheetOrigem.getDataRange().getValues();
    
    if (dados.length === 0) 
      throw new Error("Nenhum dado encontrado na planilha de origem");
 
    // 5. Encontrar a próxima linha vazia NA COLUNA A (ajuste se necessário)
    var ultimaLinha = sheetDestino.getRange("A:A").getValues().filter(String).length;
    
    // Se a planilha estiver completamente vazia, ultimaLinha será 0
    var linhaInicio = 1;
    
    // 6. Colar os dados
    sheetDestino.getRange(linhaInicio, 1, dados.length, dados[0].length).setValues(dados);
    
    //SpreadsheetApp.getUi().alert(`Dados transferidos com sucesso para a linha ${linhaInicio}!`);
    
  } catch (error) {
    console.error("Erro: " + error.message);
    SpreadsheetApp.getUi().alert("Erro: " + error.message);
  }
}

function copiarParaListaGabrielly() {
  try {
    // 1. Acessar a planilha e aba de origem
    var origem = SpreadsheetApp.getActiveSpreadsheet();
    var sheetOrigem = origem.getSheetByName("Lista Gabrielly");
    
    if (!sheetOrigem) 
      throw new Error("A aba 'Lista Gabrielly' não foi encontrada na planilha de origem");
    
    // 2. Acessar a planilha de destino
    var destino = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/153BTT_4N4A9XEIml2NLNN6jb0QqI4KgW_hGTyzqLWZ0/edit");
    
    if (!destino) 
      throw new Error("Não foi possível acessar a planilha de destino");
    
    // 3. Obter ou criar a aba de destino
    var sheetDestino = destino.getSheetByName("Lista Gabrielly") || destino.insertSheet("Lista Gabrielly");
    
    sheetDestino.getRange("A1:C41").clearContent();
    
    // 4. Obter dados da origem
    var dados = sheetOrigem.getDataRange().getValues();
    
    if (dados.length === 0) {
      throw new Error("Nenhum dado encontrado na planilha de origem");
    }

    // 5. Encontrar a próxima linha vazia NA COLUNA A (ajuste se necessário)
    var ultimaLinha = sheetDestino.getRange("A:A").getValues().filter(String).length;
    
    // Se a planilha estiver completamente vazia, ultimaLinha será 0
    var linhaInicio = 1;
    
    // 6. Colar os dados
    sheetDestino.getRange(linhaInicio, 1, dados.length, dados[0].length).setValues(dados);
    
    //SpreadsheetApp.getUi().alert(`Dados transferidos com sucesso para a linha ${linhaInicio}!`);
    
  } catch (error) {
    console.error("Erro: " + error.message);
    SpreadsheetApp.getUi().alert("Erro: " + error.message);
  }
}