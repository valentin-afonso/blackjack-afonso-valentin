document.addEventListener("DOMContentLoaded", function() {
    
    var buttonStart = document.getElementById("start_game");
    var contain_player_hand = document.getElementById("contain_player_hand");
    var contain_croupier_hand = document.getElementById("contain_croupier_hand");
    var contain_action_text = document.getElementById("contain_action_text");
    var contain_action_button = document.getElementById("contain_action_button");
    var deck_id = '';
    var pile_name_player = 'player1';
    var pile_name_croupier = 'croupier';
    var array_score_card = {
        'A' : 11,
        '2' : 2,
        '3' : 3,
        '4' : 4,
        '5' : 5,
        '6' : 6,
        '7' : 7,
        '8' : 8,
        '9' : 9,
        '10' : 10,
        'J' : 10,
        'Q' : 10,
        'K' : 10
    };
    var array_cards_player = [];
    var array_cards_croupier = [];
    var score_player = 0;
    var score_croupier = 0;

    // Créé un deck
    inisializeDeck();
    buttonStart.onclick = function() {
        buttonStart.style.display = 'none';
        // Distribu et ajoute deux carte au croupier et au joueur
        drawCards(deck_id, 2, pile_name_croupier);
        drawCards(deck_id, 2, pile_name_player);
        displayActions();
    
    }


    // Initialize a new deck.
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
            console.log('New deck : ');
            console.log(data);    
            var new_deck_id = data.deck_id;
            deck_id = new_deck_id;
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
            console.log('Draw 2 cards :');  
            console.log(data);
            for (i=0; i<numberOfCard; i++) { 
                // Afficher les images
                var urlImg = data.cards[i].image;
                if (pile_name == 'player1') {
                    // Récuperer le score du joueur
                    array_cards_player.push(data.cards[i].code.substring(0, 1));

                    var imgCards = document.createElement('img');
                    imgCards.src = urlImg;
                    contain_player_hand.appendChild(imgCards);
                } else {
                    // Récuperer le score du croupier
                    array_cards_croupier.push(data.cards[i].code.substring(0, 1));
                    
                    var imgCards = document.createElement('img');
                    imgCards.id = 'img-'+i;
                    if (i !== 0) {
                        imgCards.src = 'img/dos-carte-bleu.png';
                        imgCards.className = 'carte_croupier';
                    } else {
                        imgCards.src = urlImg;
                    }
                    contain_croupier_hand.appendChild(imgCards);
                }
                // Ajout des carte dans une pile
                array_cards_player.forEach(value => 
                    score_player = score_player + array_score_card[value]
                );
                array_cards_croupier.forEach(value => 
                    score_croupier = score_croupier + array_score_card[value]
                );
                addCardsInHand(deck_id, pile_name, data.cards[i].code);   
            }

        })
        .catch(function (err) {
            console.warn('Something went wrong.', err);
        });
    }

    // Function add cards in pile (hand's player)
    function addCardsInHand(deck_id, pile_name, cards) {

        fetch('https://deckofcardsapi.com/api/deck/' + deck_id + '/pile/' + pile_name + '/add/?cards=' + cards, {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('Create pile : ');
            console.log(data);       
            listPile(deck_id, pile_name)
        })
        .catch(function (err) {
            console.warn('Something went wrong.', err);
        });

        console.log('arrayCardPlayer[] : ' + array_cards_player);
        console.log('arrayCardCroupier[] : ' + array_cards_croupier);
        console.log('score player = ' + score_player);
    }

    //Listing cards in pile
    function listPile(deck_id, pile_name) {
        fetch('https://deckofcardsapi.com/api/deck/' + deck_id + '/pile/' + pile_name + '/list/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('List pile : ');
            console.log(data);           
        })
        .catch(function (err) {
            console.warn('Something went wrong.', err);
        });

    }

    // Affiche les actions possible 
    function displayActions() {
        var actionText = document.createElement('p');
        actionText.className = 'text_action';
        var text_action = document.createTextNode('Que voulez vous faire ?');
        actionText.appendChild(text_action);
        contain_action_text.appendChild(actionText);
        add_input('button', 'button-hit', 'action-button', 'Tirer une carte');
        add_input('button', 'button-stand', 'action-button', 'Rester');
        add_input('button', 'button-surrender', 'action-button', 'Abandonner');
    }

    function add_input(type, id, className, value) {
        var newInput= document.createElement("input");
        newInput.value=value;
        newInput.id= id;
        newInput.className = className;
        newInput.type = type;
        contain_action_button.appendChild(newInput);
    }
});