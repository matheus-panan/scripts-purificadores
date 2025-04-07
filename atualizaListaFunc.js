/*  Estas funções chamam a função copiarParaLista(nomeLista, urlDestino) para copiar os dados das listas que foram 
    processadas e geradas na planilha "Banco de dados" para as planilhas "Lista de Leads - Maria" e 
    "Lista de Leads - Gabrielly".
    
    OBS: Caso precise de uma outra planilha "Lista de Leads - NomeDoFuncionario", é só criar uma nova função passando 
    o nome da aba e o URL da nova planilha criada como parâmetros
    
    Exemplo: 
    function copiarParaListaNovoFuncionario() {
      copiarParaLista(
        "nomeAbaNovaPlanilha", 
        "urlNovaPlanilha"
      );
    }
*/

function copiarParaListaMaria() {
  copiarParaLista(
    "Lista Maria", 
    "https://docs.google.com/spreadsheets/d/1LUfxhG6SCKgP4G-LGj5QdypQQ0IgFqQLUpAVVzTSgcY/edit"
  );
}

function copiarParaListaGabrielly() {
  copiarParaLista(
    "Lista Gabrielly", 
    "https://docs.google.com/spreadsheets/d/1FPsHSvoWskEJXNwWk4IY3Z5XD3RiZM38wXzQQQaYl8c/edit"
  );
}