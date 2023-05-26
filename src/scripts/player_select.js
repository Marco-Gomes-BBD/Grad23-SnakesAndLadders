import { PlayerCard } from "./player_card.js"
import { show_toast } from "./toast.js";

window.players = []

let add_player = () => {
    if (window.players.length >= 4) {
        show_toast('thats enough!!!', 'error')
        return
    }

    let form = document.getElementById("player-form")
    let player_name = document.getElementById("player-name").value;
    let taken = false;
    for (let i = 0; i < window.players.length; i++){
        if(window.players[i].player_name.toUpperCase() === player_name.toUpperCase()){
            taken = true;
            break;
        }
    }

    if (taken) {
        show_toast('that name is taken');
        return;
    }
    
    let player_card_list = document.getElementById("player-list");
    const template = document.getElementById('player-card-template');
    let player_card = new PlayerCard(template);
    player_card.player_name = player_name;
    player_card.player_color = assign_color().getAttribute("style").split(':')[1];
    player_card.player_icon = '';
    player_card_list.appendChild(player_card)
    player_card_list.append(player_card)

    window.players.push ({
        "player_name": player_card.player_name, 
        "player_color": player_card.player_color,
        "player_icon": player_card.player_icon,
    });

    if (window.players.length >= 2) {
        const proceed_button = document.getElementById("proceed-button");
        proceed_button.classList.remove('inactive');
        proceed_button.classList.add('affirmative');
        proceed_button.removeAttribute("disabled");
    } 

    form.reset();
}

const proceed = async () => {
    localStorage.setItem('players', JSON.stringify(window.players));
    window.location.assign("/game");
}

let selected_color = null

const toggle_color = (sender) => {
    
    if (sender.getAttribute("assigned")) {
        sender.setAttribute('selected', false);
        return
    }

    if (selected_color != null ) {
        selected_color.setAttribute('selected', false)
        selected_color = sender
        selected_color.setAttribute('selected', true)
    } else {
        selected_color = sender
        selected_color.setAttribute('selected', true)
    }
}

const assign_color = () => {
    const hold = selected_color
    if (selected_color != null) {
        selected_color.setAttribute('assigned', true)
        selected_color.setAttribute('selected', false)
        selected_color = null
    } else {
        show_toast("you need to select a color")
    }
    hold.addEventListener('click', () => {
        show_toast("pick a different color")
    })

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
