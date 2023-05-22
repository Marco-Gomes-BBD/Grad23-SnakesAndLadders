import { PlayerCard } from "./player_card.js"

window.players = []

let add_player = () => {
    if (window.players.length >= 4) {
        console.log("thats enough!!")
        return
    }

    let form = document.getElementById("player-form")
    let player_name = document.getElementById("player-name").value
    let player_card_list = document.getElementById("player-list")
    let player_card = new PlayerCard()
    player_card.player_name = player_name
    player_card.player_color = assign_color().getAttribute("style").split(':')[1]
    player_card_list.appendChild(player_card)
    player_card_list.append(player_card)

    window.players.push ({
        "player_name": player_card.player_name, 
        "player_color": player_card.player_color
    })

    if (window.players.length >= 2) {
        const proceed_button = document.getElementById("proceed-button")
        proceed_button.classList.remove('inactive')
        proceed_button.classList.add('affirmative')
        proceed_button.removeAttribute("disabled")
        console.log(proceed_button)
    } 

    form.reset()
}

const init_game = async () => {
    let seed = 5
    let players = window.players
    let xhr = new XMLHttpRequest();

    xhr.open("POST", "localhost:8080/start-game");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
    }};
    try {
        console.log({'host':"", 'seed': seed, 'players':players})
        //xhr.send({'host':"", 'seed': seed, 'players':players});
    } catch {
        
    }

    for (player_index in window.players){
        let player = window.players[player_index]
        let player_card_list = document.getElementById("player-list-container")
        while (player_card_list == null){
            console.log("nope")
            await new Promise(resolve => setTimeout(resolve, 100));
            player_card_list = document.getElementById("player-list-container")
        }
        console.log("yeah")
        let player_card = new PlayerCard()
        console.log(player)
        player_card.player_name = player.player_name
        player_card.player_color = player.player_color
        player_card_list.appendChild(player_card)
        player_card_list.append(player_card)
        console.log(player_card_list)
    }

}

const proceed = async () => {
    let seed = Math.floor(Math.random() * Number.MAX_VALUE)
    window.location.assign("/game");
    init_game()
}

let selected_color = null

const toggle_color = (sender) => {
    sender.setAttribute('selected', true)
    if (sender.getAttribute("assigned") == true) {
        sender.setAttribute('selected', false)
        return
    }

    if (selected_color != null) {
        console.log(selected_color)
        selected_color.setAttribute('selected', false)
        selected_color = sender
    } else {
        selected_color = sender
    }
}

const assign_color = () => {
    const hold = selected_color
    if (selected_color != null) {
        selected_color.setAttribute('assigned', true)
        selected_color.setAttribute('selected', false)
        selected_color = null
    } else {
        // todo: show toast message
        console.log("you need to select a color")
    }

    return hold
}


const init_player_select = () =>{
    const color_palette = document.getElementById("color-palette")
    const count = color_palette.childElementCount
    for (let i = 0; i < count; i++) {
        color_palette.children[i].addEventListener('click', () => {
            toggle_color(color_palette.children[i])
        })
    }

    const add_player_button = document.getElementById('add-player-button')
    add_player_button.addEventListener('click', () => {
        add_player()
    })

    const proceed_button = document.getElementById("proceed-button");
    proceed_button.addEventListener('click', () => {
        proceed()
    })
}

init_player_select()
