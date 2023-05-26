import { PlayerCard } from './player_card.js';

class GamePlayerCard extends PlayerCard {
    get player_icon() {
        return this.getAttribute('player_icon');
    }

    set player_icon(val) {
        this.setAttribute('player_icon', val);
        const icon_container = this.shadowRoot.getElementById('player-icon');
        icon_container.innerHTML = this.getAttribute('player_icon');
    }
}

window.customElements.define('game-player-card', GamePlayerCard);
export { GamePlayerCard };
