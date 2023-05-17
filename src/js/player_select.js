const player_list = []

let add_player = () => {
    let form = document.getElementById("player-form")
    let player_name = document.getElementById("player-name").value
    let player_card_list = document.getElementById("player-list")
    let player_card = new PlayerCard()
    player_card.player_name = player_name
    player_card_list.appendChild(player_card)

    let player_color = 0;

    form.reset()
    console.log("player_name->" + player_name)
}

let proceed = () => {
    navigate("/game")
}
