LEIA ANTES DE TESTAR

usuario:teste@teste.com
senha:123asd


2026: A Visão do Subferia Hub
"O projeto nasceu de uma necessidade real: a desorganização no recrutamento e na interação de clãs em jogos como o GTA 5 e FiveM. Eu não queria apenas uma lista de nomes; eu queria um ecossistema onde a identidade do jogador fosse respeitada e a comunicação fosse instantânea. Foi assim que criei o Subferia Hub, o ponto de encontro oficial da GINGA."

🛠 As Dificuldades (Onde o "filho chora e a mãe não vê")
O caminho não foi linear. Como desenvolvedor, enfrentei desafios técnicos que quase derrubaram o sistema várias vezes:

A Batalha do Realtime: No início, as mensagens do chat não apareciam ou geravam o temido erro de postgres_changes. Lutar contra o ciclo de vida do React para garantir que a conexão com o banco não "explodisse" ao atualizar a página foi um dos maiores aprendizados.

O Enigma do Supabase: Configurar as chaves de API (supabaseUrl e anonKey) parece simples, mas quando você muda de projeto ou de host, o cache do navegador vicia em conexões antigas. Tive que aprender a "limpar o terreno" (cache e localstorage) para o site finalmente "falar" com o banco de dados correto.

A "Tela Preta" do Medo: Cada vez que uma função de tratamento de texto (como o toLowerCase) recebia um valor vazio do banco, o site inteiro travava. Tive que "blindar" cada card de jogador com verificações de erro para garantir que, mesmo sem foto ou sem rank, o Hub continuasse de pé.

A Persistência do "Estudante Shark": Implementar a lógica para que o nome do usuário não sumisse ao deslogar exigiu um domínio maior de localStorage e dos Hooks de autenticação.

💡 As Ideias que Moldaram o Hub
O projeto evoluiu conforme a comunidade pedia:

Filtros Cirúrgicos: Não basta procurar por "GTA". O sistema agora filtra por Jogo Principal e Rank, permitindo que líderes de clã achem exatamente o "Global" ou o "Elite" que precisam.

Identidade Visual "Old Money" & Futurista: Como designer, não aceitei o padrão. O Hub tem uma estética escura, com brilhos em Neon Indigo e tipografia em itálico carregada, focando no estilo competitivo.

Sistema de Avatares por Link: Para evitar custos altos de servidor logo de cara, tive a ideia de permitir que o usuário use URLs de imagens (Discord/Imgur). Isso deu cara aos jogadores instantaneamente.

O Botão de Cópia de Discord: Em vez de links complicados, um clique copia o Nick do Discord. É simples, funcional e focado no que o jogador de RP realmente usa.

Chat Global GINGA: A última grande ideia foi integrar um chat em tempo real na lateral. Transformou o site de uma "vitrine" em uma "praça" de conversa.

🚀 O Próximo Nível
O projeto não para no GitHub. Meus próximos passos já estão traçados:

Upload Direto: Deixar de usar links e permitir que o usuário suba o arquivo direto do PC.

Anúncios de Squad: Criar uma área de "Destaque" para clãs que estão em guerra ou recrutando com urgência.

Deploy na Vercel: Tirar o projeto do localhost e colocar o link na bio de todos os membros do clã.

Conclusão: O Subferia Hub é o resultado de persistência técnica e paixão pela comunidade gamer. Cada erro de console que resolvi me tornou um desenvolvedor mais preparado para os desafios do mercado de TI.
