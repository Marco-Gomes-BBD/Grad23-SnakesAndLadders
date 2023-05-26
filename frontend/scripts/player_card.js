class PlayerCard extends HTMLElement {
    constructor(template) {
        super();
        const content = template.content;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(content.cloneNode(true));
    }

    get player_name() {
        return this.getAttribute('player_name');
    }

    set player_name(val) {
        this.setAttribute('player_name', val);
        const name_container = this.shadowRoot.getElementById('player-name');
        name_container.innerHTML = this.getAttribute('player_name');
    }

    get player_color() {
        return this.getAttribute('player-color');
    }

    set player_color(val) {
        this.setAttribute('player-color', val);
        const color_block = this.shadowRoot.getElementById('color-block');
        color_block.setAttribute('style', '--bgcol:' + val);
    }
}

window.customElements.define('player-card', PlayerCard);
export { PlayerCard };
