class GameSummary extends HTMLElement {
    constructor(summary) {
        super();
        const template = document.getElementById('history-element');
        const content = template.content;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(content.cloneNode(true));
        if (summary != null){
            this.summary = summary

            const b = this.shadowRoot.getElementById("select-btn");
            b.addEventListener('click', () => {
                console.log(summary.game_id)
                window.location.assign("/game?game_id="+summary.game_id)
            })
        }
    }

    continue_game = (summary) => {
        console.log(summary.game_id)
        //window.location.assign("/game?game_id="+this.summary.game_id)
    }

    get summary() {
        return this.getAttribute('summary')
    }

    set summary(summary){

        this.setAttribute('summary', summary)
        console.log(summary)


        const turn_p = this.shadowRoot.getElementById("player-turn");
        const board_detail_p = this.shadowRoot.getElementById("board-detail");

        turn_p.innerHTML = summary.roll.count + " turns played";
        
        board_detail_p.innerHTML = summary.board.width + " x " + summary.board.height
        
        for (let i = 0; i < summary.players.length; i++){
            let id = 'p' + i;
            const player_detail = this.shadowRoot.getElementById(id);

            player_detail.innerHTML = summary.players[i].player_name + "[" + summary.players[i].player_type + "]";
            player_detail.setAttribute("style", "background-color=" + summary.players[i].player_color)
        }
    }
}

window.customElements.define('game-summary', GameSummary);
export { GameSummary };
