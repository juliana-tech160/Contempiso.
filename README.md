# CONTEMPISO — Protótipo mobile

Aplicação demonstrativa mobile-first para cadastro e acompanhamento de pedidos de fabricação e instalação de lajes.

## Como executar
1. Extraia o arquivo ZIP.
2. Abra a pasta `contempiso_app`.
3. Abra `index.html` em um navegador atualizado (Chrome, Edge, Firefox ou Safari).
4. Para testar no celular, coloque os arquivos em uma hospedagem estática ou execute um servidor local na mesma rede e acesse pelo navegador do aparelho.

Não é necessário instalar dependências.

## Funcionalidades
- Painel inicial com resumo de pedidos em fabricação e agendados.
- Cadastro de pedido com validação de campos obrigatórios.
- Listagem com busca por cliente, endereço ou código.
- Atualização de status: Em fabricação, Agendado e Instalado.
- Aviso de próxima instalação.
- Armazenamento local no navegador (`localStorage`).

## Dados e limitações
Este é um protótipo front-end. Os pedidos ficam salvos somente no navegador e dispositivo em que foram cadastrados. Não existe login, banco de dados remoto, sincronização entre celulares, cópia de segurança ou controle de permissões. Use apenas dados fictícios durante a demonstração. Para uso real pela empresa, será necessário desenvolver e configurar um back-end com autenticação, banco de dados, política de privacidade e backups.

## Personalização
- Cores, espaçamentos e aparência: `styles.css`.
- Telas e campos: `index.html`.
- Regras, validação e armazenamento: `app.js`.

## Teste sugerido
1. Na tela inicial, acesse “Novo pedido”.
2. Cadastre um pedido usando dados fictícios.
3. Na listagem, localize o pedido e altere seu status para “Agendado”.
## Evolução do projeto

O CONTEMPISO está em desenvolvimento e busca facilitar o gerenciamento de clientes, pedidos, obras e agendamentos.
