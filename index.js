let template_doc = document.getElementById("player-card-template")

class PlayerCard extends HTMLElement{
    constructor(){
        super()
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
    }
}

window.customElements.define('player-card', PlayerCard)

console.log("Olo")