function gerarListasClientes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dadosSheet = ss.getSheetByName("Última Compra"); // Nome da aba com os dados
  var listaMariaSheet = ss.getSheetByName("Lista Maria");
  var listaGabriellySheet = ss.getSheetByName("Lista Gabrielly");
  
  // Obtendo os dados da aba "Ultima Compra"
  var dataRange = dadosSheet.getDataRange();
  var data = dataRange.getValues();
  
  // Limpa as listas anteriores
  listaMariaSheet.getRange("A2:A41").clearContent();
  listaGabriellySheet.getRange("A2:A41").clearContent();
  
  // Obtendo a data de 9 meses atrás
  var dataLimite = new Date();
  dataLimite.setMonth(dataLimite.getMonth() - 9);
  
  var clientesValidos = []; // Armazena clientes válidos que atendem aos critérios

  for (var i = 1; i < data.length; i++) {
    var cliente = data[i][0]; // Coluna A (Cliente)
    var status = data[i][8]; // Coluna I (Status)
    var dataCompra = new Date(data[i][2]); // Coluna C (Data da Última Compra)
    
    // Verifica se a compra é anterior a 9 meses e se o status não é 'V'
    if (dataCompra < dataLimite && status !== "V") {
      clientesValidos.push(cliente); // Adiciona cliente à lista de válidos
    }
  }
  
  // Embaralha a lista de clientes válidos
  clientesValidos = embaralharArray(clientesValidos);
  
  // Divide os clientes válidos entre as listas de Maria e Gabrielly
  var listaMaria = clientesValidos.slice(0, 40); // Pega os primeiros 40
  var listaGabrielly = clientesValidos.slice(40, 80); // Pega os próximos 40
  
  // Altera o status para 'V' para os clientes que foram adicionados
  for (var i = 0; i < listaMaria.length; i++) {
    var index = data.findIndex(row => row[0] === listaMaria[i]); // Encontra o índice do cliente na lista original
    if (index !== -1) {
      dadosSheet.getRange(index + 1, 9).setValue("V"); // Coluna I
    }
    listaMariaSheet.getRange(i + 2, 1).setValue(listaMaria[i]); // Escreve na lista de Maria
  }
  
  for (var j = 0; j < listaGabrielly.length; j++) {
    var index = data.findIndex(row => row[0] === listaGabrielly[j]); // Encontra o índice do cliente na lista original
    if (index !== -1) {
      dadosSheet.getRange(index + 1, 9).setValue("V"); // Coluna I
    }
    listaGabriellySheet.getRange(j + 2, 1).setValue(listaGabrielly[j]); // Escreve na lista de Gabrielly
  }
}

// Função para embaralhar um array
function embaralharArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); // Gera um índice aleatório
    // Troca elementos
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
