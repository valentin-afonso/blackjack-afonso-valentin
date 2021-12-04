class Player {
    // getter et setter pour le wallet du joueur
    get getWallet() {
        return this.wallet;
    }
    set setWallet(wallet) {
        this.wallet = wallet;
    }
    // getter et setter pour la mise du joueur
    get getMise() {
        return this.mise;
    }
    set setMise(mise) {
        this.mise = mise;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    
    let buttonStart = document.getElementById("start_game");
    let buttonHit = document.getElementById("button-hit");
    let buttonStand = document.getElementById("button-stand");
    let buttonSurrender = document.getElementById("button-surrender");
    let buttonDouble = document.getElementById("button-double");
    let buttonNextGame = document.getElementById("button-next_game");
    let contain_end_game = document.getElementById("contain_end_game");
    let contain_player_hand = document.getElementById("contain_player_hand");
    let contain_croupier_hand = document.getElementById("contain_croupier_hand");
    let contain_actions = document.getElementById("contain_actions");
    let contain_action_button = document.getElementById("contain_action_button");
    let contain_action_next_game = document.getElementById("contain_action_next_game");
    let contain_ace_value = document.getElementById("contain_ace_value");
    let contain_mise_form = document.getElementById("contain_mise_form");
    let contain_wallet_mise = document.getElementById("contain_wallet_mise");
    let button_score_low = document.getElementById("score_low");
    let button_score_high = document.getElementById("score_high");
    let text_action = document.getElementById("text-action");
    let contain_score_player = document.getElementById("contain_score_player");
    let div_score_player = document.getElementById("score_player");
    let input_mise = document.getElementById("input_mise");
    let input_new_game = document.getElementById("input_new_game");
    let div_wallet = document.getElementById("wallet");
    let div_mise = document.getElementById("mise");
    let alert_info_mise = document.getElementById("alert_info_mise");
    let contain_separation = document.querySelector('.contain_separation');
    let modal_rules = document.getElementById('modal_rules');
    let help_modal = document.getElementById('help_modal');
    let close = document.querySelector('.close');

    let deck_id = '';
    let pile_name_player = 'player1';
    let pile_name_croupier = 'croupier';
    let array_score_card = {
        'A1' : 11,
        'A0' : 1,
        '2' : 2,
        '3' : 3,
        '4' : 4,
        '5' : 5,
        '6' : 6,
        '7' : 7,
        '8' : 8,
        '9' : 9,
        '0' : 10,
        'J' : 10,
        'Q' : 10,
        'K' : 10
    };
    let array_code_cards_player = [];
    let array_code_cards_croupier = [];
    let score_player = 0;
    let score_croupier = 0;
    let croupier_turn = false;
    let first_carte = true;

    // Initialize player
    const player1 = new Player();
    player1.setWallet = 1000;
    div_wallet.innerText = player1.getWallet + ' €';

    //Initialise deck et affiche la premiere page (form et wallet)
    inisializeDeck();
    scene1('show');

    function scene1(action) {
        if (action == 'show') {
            contain_mise_form.classList.add('js-contain_mise_form_show');
            contain_wallet_mise.classList.add('js-contain_wallet_mise_show');
            if (player1.getWallet >= 100) {
                input_mise.value = '100';
            } else {
                input_mise.value = player1.getWallet;
            }
        } else if (action == 'hiden') {
            contain_mise_form.classList.remove('js-contain_mise_form_show');
            contain_wallet_mise.classList.remove('js-contain_mise_form_show');
        }
    }

    function scene2(action) {
        if (action == 'show') {
            scene1('hiden');
            // Affiche les cartes
            contain_player_hand.classList.add('js-show_flex');
            contain_croupier_hand.classList.add('js-show_flex');
            // Affiche les bouttons et le texte 
            contain_action_button.classList.add('contain_action_button-js-show');
            contain_action_next_game.classList.remove('contain_action_next_game-js-show');
            contain_actions.classList.add('js-show_block');
            text_action.innerText = '- Que voulez vous faire ?';
            // Affiche le score du joueur
            contain_score_player.classList.add('js-contain_score_player_show');
            div_score_player.innerText = score_player;
            // Affiche la mise et wallet du joueur
            contain_wallet_mise.classList.add('js-contain_wallet_mise_show');
            contain_separation.classList.add('contain_separation-js-show');
        } else if (action == 'hiden'){
            contain_player_hand.classList.remove('js-show_flex');
            contain_croupier_hand.classList.remove('js-show_flex');
            contain_actions.classList.remove('js-show_block');
            contain_action_button.classList.remove('contain_action_button-js-show');
            contain_score_player.classList.remove('js-contain_score_player_show');
            contain_separation.classList.remove('contain_separation-js-show');

        }
    }

    buttonStart.onclick = function() {
        if (input_mise.value <= player1.getWallet && input_mise.value > 0) {
            first_carte = true;
            // Affiche la page de jeux 
            scene2('show');
            // Récupere et affiche la mise du joueur 
            player1.setMise = input_mise.value;
            div_mise.innerText = 'Votre mise : ' + player1.getMise + ' €';
            div_wallet.innerText = player1.getWallet + ' €';
            //Tire deux cartes du deck pour le joueur et le croupier 
            drawCards(deck_id, 2, pile_name_croupier);
            drawCards(deck_id, 2, pile_name_player);
        } else if (input_mise.value > player1.getWallet) {
            alert_info_mise.innerText = 'Vous n\'avez pas asser d\'argent pour miser cette somme';
        } else if (input_mise.value <= player1.getWallet) {
            alert_info_mise.innerText = 'Vous ne pouvez pas miser cette somme';
        }
     }
    // Ouvre la page des règles 
    help_modal.onclick = function() {
        modal_rules.style.display = "block";
    }
    // Ferme la page des règles
    close.onclick = function() {
        modal_rules.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal_rules) {
            modal_rules.style.display = "none";
        }
      }
    // Bouton "Tirer une autre carte"
    buttonHit.onclick = function() {
        drawCards(deck_id, 1, pile_name_player);
    }
    // Bouton "Rester"
    buttonStand.onclick = function() {
        croupier_turn = true;
        contain_action_button.classList.remove('contain_action_button-js-show')
        contain_action_next_game.classList.add('contain_action_next_game-js-show');
        if (score_croupier < 17) {
            first_carte = false;
            drawCards(deck_id, 1, pile_name_croupier);
        } else {
            analyseScore(score_player, score_croupier);
        }
    }
    // Bouton "Doubler la mise"
    buttonDouble.onclick = function() {
        player1.setMise = player1.getMise*2;
        div_mise.innerText = 'Votre mise : ' + player1.getMise + ' €';
        croupier_turn = true;
        drawCards(deck_id, 1, pile_name_player);


    }
    // Bouton "Abandonner"
    buttonSurrender.onclick = function() {
        contain_action_button.classList.remove('contain_action_button-js-show')
        contain_ace_value.classList.remove('js-contain_ace_value_show');
        contain_action_next_game.classList.add('contain_action_next_game-js-show');
        // Abandon et perdre la moitié de la mise 
        player1.setWallet = player1.getWallet - (player1.getMise/2);
        div_wallet.innerText = player1.getWallet;
        text_action.innerText = 'Vous avez abandonné';

        div_mise.innerText = '- ' + player1.getMise/2 + ' €';
        div_mise.classList.add('js-result');
        div_mise.style.color = 'red';

    }
    // Bouton "Nouvelle partie"
    buttonNextGame.onclick = function() {
        croupier_turn = false;
        first_carte = true;
        scene1('show');
        scene2('hiden');
        score_player = 0;
        score_croupier = 0;
        array_code_cards_player.length = 0;
        array_code_cards_croupier.length = 0;
        // Supression des cartes du DOM
        while (contain_player_hand.firstChild) {
            contain_player_hand.removeChild(contain_player_hand.lastChild);
        }
        while (contain_croupier_hand.firstChild) {
            contain_croupier_hand.removeChild(contain_croupier_hand.lastChild);
        }
        div_mise.classList.remove('js-result-red');
        div_mise.classList.remove('js-result-green');
        div_mise.innerText = '';
        div_mise.style.color = 'white';
        // On mélange le deck
        reshuffle(deck_id);
    }

    input_new_game.onclick = function() {
        contain_end_game.classList.remove('contain_end_game-js-show');
        player1.setWallet = 1000;
        croupier_turn = false;
        first_carte = true;
        scene1('show');
        scene2('hiden');
        score_player = 0;
        score_croupier = 0;
        array_code_cards_player.length = 0;
        array_code_cards_croupier.length = 0;
        // Supression des cartes du DOM
        while (contain_player_hand.firstChild) {
            contain_player_hand.removeChild(contain_player_hand.lastChild);
        }
        while (contain_croupier_hand.firstChild) {
            contain_croupier_hand.removeChild(contain_croupier_hand.lastChild);
        }
        div_mise.classList.remove('js-result-red');
        div_mise.classList.remove('js-result-green');
        div_mise.innerText = '';
        div_mise.style.color = 'white';
        // On mélange le deck
        reshuffle(deck_id);
    }

    // Function initialize a new deck.
    function inisializeDeck() {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);    
            deck_id = data.deck_id;
        })
        .catch(function (err) {
            console.warn('Something went wrong.', err);
        });
    }

    // Function draw card from deck
    function drawCards(deck_id, numberOfCard, pile_name) {
        fetch('https://deckofcardsapi.com/api/deck/' + deck_id + '/draw/?count=' + numberOfCard, {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('Draw cards a :' + pile_name);  
            console.log(data);
            for (i=0; i<numberOfCard; i++) { 
                // Afficher les images des cartes dans le DOM pour le croupier et le joueur
                let imgCards = document.createElement('img');
                imgCards.className = 'cards';
                let urlImg = data.cards[i].image;
                if (pile_name == 'player1') {
                    imgCards.src = urlImg;
                    imgCards.className = 'card_player cards';
                    contain_player_hand.append(imgCards);
                } else {
                    imgCards.id = 'img-'+i;
                    if (i !== 0 && first_carte == true || first_carte == false) {
                        imgCards.src = urlImg;
                        imgCards.className = 'carte_croupier_reveal carte-' + array_code_cards_croupier.length + ' cards';
                        let imgCards2 = document.createElement('img');
                        imgCards2.src = 'img/carte2.png';
                        imgCards2.className = 'dos_carte dos-carte-' + array_code_cards_croupier.length + ' cards';
                        contain_croupier_hand.append(imgCards2);
                    } else {
                        imgCards.src = urlImg;
                    }
                    contain_croupier_hand.append(imgCards);
                }
                // Ajout des cartes dans les mains respective
                addCardsInPile(pile_name, data.cards[i].code);   
            }
        })
        .catch(function (err) {
            console.warn('Something went wrong.', err);
        });
    }

    // Function add cardsInPile
    function addCardsInPile(pile_name, cards) {
        if (pile_name == 'croupier') {
            if (cards.substring(0, 1) == "A") {
                array_code_cards_croupier.push("A0");
            } else {
                array_code_cards_croupier.push(cards.substring(0, 1));
            }
            // Calcule du score
            calcScore();
        } else {
            // Gestion du score de l'as (1 ou 11 points en fonciton du choix du joueur)
            if (cards.substring(0, 1) == "A") {
                contain_ace_value.classList.add('js-contain_ace_value_show');
                button_score_low.onclick = function() {
                    array_code_cards_player.push('A0');
                    contain_ace_value.classList.remove('js-contain_ace_value_show');
                    div_score_player.innerText = score_player + 1;
                    // Calcule du score
                    calcScore();
                }
                button_score_high.onclick = function() {
                    array_code_cards_player.push('A1');
                    contain_ace_value.classList.remove('js-contain_ace_value_show');
                    div_score_player.innerText = score_player + 11;
                    // Calcule du score
                    calcScore();
                }
            } else {
                array_code_cards_player.push(cards.substring(0, 1));
                // Calcule du score
                calcScore();
            }
        }

    }
    // Function calculate score
    function calcScore() {
        score_player = 0;
        score_croupier = 0;
        // Calcul du total de point du joueur et du croupier 
        array_code_cards_player.forEach(value => 
            score_player = score_player + array_score_card[value]
        );
        array_code_cards_croupier.forEach(value => 
            score_croupier = score_croupier + array_score_card[value]
        );
        
        if (score_player > 21 && croupier_turn == false) {
            // Révele les carte cachées du croupier et analyse du score
            revealCards();
            analyseScore(score_player, score_croupier);
        }

        // Gestion des actions du croupier si c'est à son tour de jouer
        if (croupier_turn) {
            if (score_croupier >= 17) {
                revealCards();
                analyseScore(score_player, score_croupier);
            } else if (score_croupier < 17) {
                first_carte = false;
                // Le croupier tire une carte
                drawCards(deck_id, 1, pile_name_croupier);
            }
        }

        div_score_player.innerText = 'Votre score : ' + score_player;
    }

    // Function reshuffle deck
    function reshuffle(deck_id) {
        fetch('https://deckofcardsapi.com/api/deck/' + deck_id + '/shuffle/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('Reshuffle deck : ');
            console.log(data);
        })
        .catch(function (err) {
            console.warn('Something went wrong.', err);
        });
    }

    //Function analise du score
    function analyseScore(scorePlayer, scoreCroupier) {
        console.log('score player = ' + score_player);
        console.log('score croupier = ' + score_croupier);
        console.log('arrayCardPlayer[] : ' + array_code_cards_player);
        console.log('arrayCardCroupier[] : ' + array_code_cards_croupier);

        contain_action_button.classList.remove('contain_action_button-js-show')
        contain_action_next_game.classList.add('contain_action_next_game-js-show');

        /**
         * Joueur à 21 et le croupier moins
         * => Le joueur gagne
         */
        if (scorePlayer == 21 && scoreCroupier < 21) {
            text_action.innerText = '- BlackJack ! Vous avez gagné';
            player1.setWallet = player1.getWallet - (- player1.getMise);
            console.log('Règle : joueur à blackjack et le croupier moins');
            div_mise.innerText = '+ ' + player1.getMise;
            div_mise.classList.add('js-result');
            div_mise.style.color = 'green';
        }
        /**
         * Joueur > Croupier
         * Les deux <= 21
         * => Le joueur gagne
         */
        if (scorePlayer < 21 && scoreCroupier < scorePlayer) {
            text_action.innerText = '- Vous avez gagné !';
            player1.setWallet = player1.getWallet -(- player1.getMise);
            console.log('Règle : joueur > croupier (les deux <= 21)');
            div_mise.innerText = '+ ' + player1.getMise + ' €';
            div_mise.classList.add('js-result');
            div_mise.style.color = 'green';
        }
        /**
         * Player < Croupier
         * Les deux <= 21
         * => Le joueur perd 
         */
        if (scorePlayer < 21 && scoreCroupier <= 21 && scoreCroupier > scorePlayer) {
            text_action.innerText = '- Vous avez perdus';
            player1.setWallet = player1.getWallet - player1.getMise;
            console.log('Règle : joueur < croupier (les deux <= 21)');
            div_mise.innerText = '- ' + player1.getMise + ' €';
            div_mise.classList.add('js-result');
            div_mise.style.color = 'red';
        }
        /**
         * Joueur dépasse 21 et pas le croupier
         * => Le joueur perd
         */
        if (scorePlayer > 21 && scoreCroupier <= 21) {
            text_action.innerText = '- Vous avez perdus';
            player1.setWallet = player1.getWallet - player1.getMise;
            console.log('Règle : joueur à dépassé 21 et pas le croupier');
            div_mise.innerText = '- ' + player1.getMise + ' €';
            div_mise.classList.add('js-result');
            div_mise.style.color = 'red';
        }
        /**
         * Croupier dépasse 21 et pas le joueur
         * => Le joueur gagne
         */
        if (scorePlayer <= 21 && scoreCroupier > 21) {
            text_action.innerText = '- Vous avez gagné';
            player1.setWallet = player1.getWallet - (- player1.getMise);
            console.log('Règle : Croupier dépasse 21 et pas le joueur');
            div_mise.innerText = '+ ' + player1.getMise + ' €';
            div_mise.classList.add('js-result');
            div_mise.style.color = 'green';
        }
        /**
         * Egalité
         */
        if (score_player == scoreCroupier) {
            text_action.innerText = '- Egalité';
            player1.setWallet = player1.getWallet;
            console.log('Règle : Egalité');
        }
        /**
         * Joueur < Croupier
         * Les deux on dépassé  21 
         * => Le joueur gagne
         */
        if (scoreCroupier > 21 && scorePlayer > 21 && scorePlayer < scoreCroupier) {
            text_action.innerText = '- Vous avez Gagné !';
            player1.setWallet = player1.getWallet - (- player1.getMise);
            console.log('Règle : Les deux on dépassé 21 et joueur < croupier');
            div_mise.innerText = '+ ' + player1.getMise + ' €';
            div_mise.classList.add('js-result');
            div_mise.style.color = 'green';
        }
        /**
         * Joueur > Croupier
         * Les deux on dépassé  21  
         * => Le joueur perd
         */
        if (scoreCroupier > 21 && scorePlayer > 21 && scorePlayer > scoreCroupier) {
            text_action.innerText = '- Vous avez perdus !';
            player1.setWallet = player1.getWallet - player1.getMise;
            console.log('Règle : Les deux on dépassé 21 mais joueur > croupier');
            div_mise.innerText = '- ' + player1.getMise + ' €';
            div_mise.classList.add('js-result');
            div_mise.style.color = 'red';
        }
        // Affiche une page si le joueur n'a plus d'argent
        div_wallet.innerText = player1.getWallet;
        if (player1.getWallet == 0) {
            contain_end_game.classList.add('contain_end_game-js-show');
        }
        

    }
    // Function revealCards
    function revealCards() {
        for (i=1; i<array_code_cards_croupier.length; i++) {
            let classCard = document.querySelector('#contain_croupier_hand .carte-' + i);
            let imgDosCard = document.querySelector('#contain_croupier_hand .dos-carte-' + i);
            classCard.classList.add('js-reveal');
            imgDosCard.classList.add('dos_carte-js-hidde');
        }
    }

});