import { test, expect, type Page } from '@playwright/test';


async function login(page: Page){

  const email = "usuario123@gmail.com";
  const senha = "123";
  // 1. Acessa o site
  await page.goto('https://bugbank.netlify.app/');

  // 2. Faz o login básico que todos os testes precisam
  await page.getByRole('button', { name: 'Registrar' }).click();

  await page.locator('form').filter({ hasText: 'Voltar ao loginE-' }).getByPlaceholder('Informe seu e-mail').fill(email);

  await page.getByRole('textbox', { name: 'Informe seu Nome' }).fill('Usuario Teste');

  await page.locator('form').filter({ hasText: 'Voltar ao loginE-' }).getByPlaceholder('Informe sua senha').fill(senha);

  await page.getByRole('textbox', { name: 'Informe a confirmação da senha' }).fill(senha);

  await page.locator('#toggleAddBalance').click();

  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await page.getByText('Fechar').click();


  await page.locator('form').filter({ hasText: 'E-mailSenhaAcessarRegistrarConheça nossos requisitosA aplicação não conta com' }).getByPlaceholder('Informe seu e-mail').fill(email);

  await page.locator('form').filter({ hasText: 'E-mailSenhaAcessarRegistrarConheça nossos requisitosA aplicação não conta com' }).getByPlaceholder('Informe sua senha').fill(senha);

  await page.getByRole('button', { name: 'Acessar' }).click();
}





test.describe('Testes de Transferência', () => {


  test('Não permitir letras no número da conta', async ({ page }) => {
    await login(page);
    await page.goto('https://bugbank.netlify.app/transfer');

    const campoConta = page.locator('input[name="accountNumber"]');

    await campoConta.fill('abc');
    await page.getByRole('textbox', { name: 'Informe o dígito da conta' }).fill('a');
    await page.getByRole('textbox', { name: 'Informe o valor da transferê' }).fill('100');
    await page.getByRole('button', { name: 'Transferir agora' }).click();

    await expect(page.getByText('Conta inválida ou inexistente')).not.toBeVisible();


    await expect(campoConta).toHaveValue('');
  });


  test('Não permitir transferência com valor negativo', async ({ page }) => {
    login(page);
    await page.goto('https://bugbank.netlify.app/transfer');

    const campoTransfer = page.locator('input[name="transferValue"]');

    await campoTransfer.fill('-50');

    await page.getByRole('button', { name: /transferir agora/i }).click();

    await expect(page.getByText(/não pode ser 0 ou valor negativo/i)).toBeVisible();
  });

  


});


test.describe('Testes de visibilidade de elementos', () => {


  test('Verificar se o texto informativo está visível', async ({ page }) => {
    await login(page);
    await page.goto('https://bugbank.netlify.app/transfer');

    const textoInformativo = page.locator('p.transfer__TextInformation-sc-1yjpf2r-7');

    await expect(textoInformativo).toBeVisible();
  });


  

    test('Validação da visibilidade do botão de acessar', async ({ page }) => {
      await page.goto('https://bugbank.netlify.app/');

      const button = page.getByRole('button', { name: 'Acessar' });

      expect(button).toBeVisible();
    });

    test('Validação da interação com o botão de requisitos ', async ({ page }) => {
      await page.goto('https://bugbank.netlify.app/');

      const linkRequisitos = page.locator('a[href="/requirements"]');
      expect(linkRequisitos).toBeVisible();

      await linkRequisitos.click();

      expect(page).toHaveURL('https://bugbank.netlify.app/requirements');

    });
  });




  test.describe('Criação de conta e login', () => {

    

 
  test('Criar conta com saldo ativado', async ({ page }) => {
  // Acessa o BugBank
  await page.goto('https://bugbank.netlify.app/');

  // Abre o formulário de cadastro
  await page.getByRole('button', { name: 'Registrar' }).click();

  // Preenche o e-mail
  await page
    .locator('form')
    .filter({ hasText: 'Voltar ao loginE-' })
    .getByPlaceholder('Informe seu e-mail')
    .fill('lima@gmail.com');

  // Preenche o nome
  await page.getByRole('textbox', { name: 'Informe seu Nome' }).fill('Lima');

  // Preenche a senha
  await page
    .locator('form')
    .filter({ hasText: 'Voltar ao loginE-' })
    .getByPlaceholder('Informe sua senha')
    .fill('lima123');

  // Confirma a senha
  await page
    .getByRole('textbox', { name: 'Informe a confirmação da senha' })
    .fill('lima123');

  // Ativa a opção de adicionar saldo
await page.locator('#toggleAddBalance').click();

// Desativa a opção de adicionar saldo
await page.locator('#toggleAddBalance').click();

// Ativa novamente a opção de adicionar saldo
await page.locator('#toggleAddBalance').click();

  // Cadastra a conta
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  // Verifica se a mensagem de sucesso aparece
  await expect(
    page.getByText(/A conta .* foi criada com sucesso/i)
  ).toBeVisible();

  // Fecha a mensagem de sucesso, se necessário, e volta ao login
  await page.getByText('Fechar').click().catch(() => {});

  // Faz login com a conta criada
  await page.locator('form').filter({ hasText: 'E-mailSenhaAcessarRegistrarConheça nossos requisitosA aplicação não conta com' }).getByPlaceholder('Informe seu e-mail').fill('lima123@gmail.com');
  
  await page.locator('form').filter({ hasText: 'E-mailSenhaAcessarRegistrarConheça nossos requisitosA aplicação não conta com' }).getByPlaceholder('Informe sua senha').fill('lima123');
  await page.getByRole('button', { name: /acessar|entrar/i }).click();

  // Verifica se o saldo é R$ 1.000,00
  await expect(page.getByText('R$ 1.000,00')).toBeVisible();
});


  });































async function acessarTransferenciaPeloMenu(page: Page) {
  await page.goto('https://bugbank.netlify.app/transfer');
  await expect(page.locator('input[name="accountNumber"]')).toBeVisible();
}

test.describe('Novos testes de transferência', () => {
  test('Preencher a transferência com o número da conta coletado', async ({ page }) => {
    await login(page);
    const conta = (await page.getByText(/Conta digital: \d+-\d+/).textContent())?.match(/(\d+)-(\d+)/);
    if (!conta) throw new Error('Número da conta não encontrado na home');
    await acessarTransferenciaPeloMenu(page);

    await page.locator('input[name="accountNumber"]').fill(conta[1]);
    await page.locator('input[name="digit"]').fill(conta[2]);
    await page.locator('input[name="transferValue"]').fill('10');
    await page.locator('input[name="description"]').fill('Teste de transferência');

    await expect(page.locator('input[name="accountNumber"]')).toHaveValue(conta[1]);
    await expect(page.locator('input[name="digit"]')).toHaveValue(conta[2]);
    await expect(page.locator('input[name="transferValue"]')).toHaveValue('10');
  });

  test('Validar o número da conta quando não informado', async ({ page }) => {
    await login(page);
    await acessarTransferenciaPeloMenu(page);

    await page.locator('input[name="transferValue"]').fill('10');
    await page.locator('input[name="description"]').fill('Conta não informada');
    await page.getByRole('button', { name: 'Transferir agora' }).click();

    await expect(
      page.locator('input[name="accountNumber"]').locator('xpath=..').locator('p.input__warging')
    ).toBeVisible();
  });

  test('Impedir transferência com valor negativo usando conta coletada', async ({ page }) => {
    await login(page);
    const conta = (await page.getByText(/Conta digital: \d+-\d+/).textContent())?.match(/(\d+)-(\d+)/);
    if (!conta) throw new Error('Número da conta não encontrado na home');
    await acessarTransferenciaPeloMenu(page);

    await page.locator('input[name="accountNumber"]').fill(conta[1]);
    await page.locator('input[name="digit"]').fill(conta[2]);
    await page.locator('input[name="transferValue"]').fill('-50');
    await page.locator('input[name="description"]').fill('Valor inválido');
    await page.getByRole('button', { name: 'Transferir agora' }).click();

    await expect(page.getByText(/não pode ser 0 ou valor negativo/i)).toBeVisible();
  });
});
