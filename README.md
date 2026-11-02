# Trilha do Caos

Primeira entrega incremental de um jogo local para duas pessoas. React, TypeScript, Vite, React Three Fiber, Drei e Zustand. Todos os modelos são procedurais, sem assets externos.

## Executar

Node.js 24. Execute `npm ci`, `npm run dev`. Para produção: `npm run build` e `npx vite preview --host 0.0.0.0`. Testes: `npm test`.

## Implementado

Tabuleiro real com distribuição de 64 casas, árvores animadas, cenário isométrico, controle orbital, acompanhamento do jogador, caminhada interpolada, dois jogadores, dado aleatório/manual, limite de movimento, encerramento ao fim da rodada e desempate por estrelas. Editor inicial com nome, pele, cabelo, roupa e óculos; personagens e partida persistidos no navegador. Perguntas com 25 segundos, recompensa e explicação. Bônus não ativam outro evento.

## Próximas etapas / limites explícitos

Esta versão não cumpre ainda todos os critérios do projeto completo. Casas de enigma, minijogo, aposta, duelo e caos são paradas livres claramente identificadas. Faltam quatro minijogos, cartas, banco amplo de perguntas sem repetição, personalização completa, dado 3D, sons, animações de reação, efeitos ambientais adicionais e configurações de qualidade/movimento reduzido. Movimento bônus ainda é interpolado diretamente, sem percorrer todas as casas intermediárias. Não há cache para reabrir offline: a partida já carregada funciona sem servidor, mas atualizar a página exige servir os arquivos novamente. LocalStorage é do dispositivo e origem; não é backup externo. 

## Organização

`rules.ts`: tipos, distribuição e regras puras. `store.ts`: estados explícitos, turnos e persistência. `Scene.tsx`: tabuleiro, ambiente e câmera. `Character.tsx`: avatar modular procedural. `App.tsx`: interface e desafio inicial. `rules.test.ts`: verificações de regras e turnos.

## Windows: iniciar com dois cliques

Instale o Node.js LTS de https://nodejs.org. No GitHub, clique em **Code → Download ZIP** e extraia todos os arquivos. Abra a pasta extraída e execute **INICIAR-JOGO.bat**. A primeira execução instala as dependências e requer internet. O navegador abre automaticamente; mantenha a janela de comandos aberta enquanto joga.

## Cenário: trilha de aventura

Percurso contínuo com 64 casas amostradas por distância, curvas orgânicas e ponte elevada sobre uma lagoa. Ilha ampla com bosque, acampamento, cogumelos, flores e borboletas animadas. A vegetação mantém distância da trilha. Câmera acompanha o movimento e o botão Visão geral restaura o enquadramento. Testes adicionais verificam separação das casas, superfície da trilha e posição das árvores.

Validação desta revisão: build e 7 testes passaram. A captura automatizada no Chromium não foi concluída; a inspeção visual final ainda precisa ser feita no navegador do jogador.
