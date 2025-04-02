function rotinaDiasUteis() {
  var hoje = new Date();
  var diaDaSemana = hoje.getDay();
  //Logger.log(diaDaSemana) 
  
  // Se não for domingo (0), execute a função
  if (diaDaSemana !== 0) {
    gerarListasClientes();
  }
}

function criarAcionadorDiario() {
  // Remover quaisquer acionadores existentes para evitar duplicação
  var acionadores = ScriptApp.getProjectTriggers();
  for (var i = 0; i < acionadores.length; i++) {
    if (acionadores[i].getHandlerFunction() === 'rotinaDiasUteis') {
      ScriptApp.deleteTrigger(acionadores[i]);
    }
  }

  // Criar um novo acionador diário às 8:00
  ScriptApp.newTrigger('rotinaDiasUteis')
    .timeBased()
    .atHour(08)
    .nearMinute(00)
    .everyDays(1)
    .create();
    
  Logger.log('Acionador criado com sucesso!');
}

function criarAcionadorParaCopia(){
  // Remover quaisquer acionadores existentes para evitar duplicação
  var acionadores = ScriptApp.getProjectTriggers();
  for (var i = 0; i < acionadores.length; i++) {
    if (acionadores[i].getHandlerFunction() === 'copiarParaListaMaria')
      ScriptApp.deleteTrigger(acionadores[i]);
    else if(acionadores[i].getHandlerFunction()=== 'copiarParaListaGabrielly')
      ScriptApp.deleteTrigger(acionadores[i]);
  }

  // Criar um novo acionador diário às 8:30
  ScriptApp.newTrigger('copiarParaListaMaria')
    .timeBased()
    .atHour(08)
    .nearMinute(10)
    .everyDays(1)
    .create();

  ScriptApp.newTrigger('copiarParaListaGabrielly')
    .timeBased()
    .atHour(08)
    .nearMinute(10)
    .everyDays(1)
    .create();  
    
  Logger.log('Acionadores criados com sucesso!');
}