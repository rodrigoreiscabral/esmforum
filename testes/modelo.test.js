const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de resposta', () => {
  const idPergunta = modelo.cadastrar_pergunta('Qual é a capital do Brasil?');
  const idResposta = modelo.cadastrar_resposta(idPergunta, 'Brasília');
  
  // Verificando se a resposta foi cadastrada corretamente
  const respostas = modelo.get_respostas(idPergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('Brasília');
  expect(respostas[0].id_pergunta).toBe(idPergunta);

  // Verificar se o número de respostas foi atualizado
  const perguntas = modelo.listar_perguntas();
  expect(perguntas[0].num_respostas).toBe(1);
});

test('Testando get_pergunta', () => {
  const idPergunta = modelo.cadastrar_pergunta('Qual é a cor do céu?');
  
  // Recuperar a pergunta pelo ID
  const pergunta = modelo.get_pergunta(idPergunta);
  expect(pergunta).not.toBeNull();
  expect(pergunta.id_pergunta).toBe(idPergunta);
  expect(pergunta.texto).toBe('Qual é a cor do céu?');
});

test('Testando get_respostas', () => {
  const idPergunta = modelo.cadastrar_pergunta('Quanto é 5 + 5?');
  
  // Cadastrando respostas para a pergunta
  modelo.cadastrar_resposta(idPergunta, '10');
  modelo.cadastrar_resposta(idPergunta, '11');
  modelo.cadastrar_resposta(idPergunta, '9');
  
  // Recuperar todas as respostas para a pergunta
  const respostas = modelo.get_respostas(idPergunta);
  expect(respostas.length).toBe(3);
  expect(respostas[0].texto).toBe('10');
  expect(respostas[1].texto).toBe('11');
  expect(respostas[2].texto).toBe('9');
});
