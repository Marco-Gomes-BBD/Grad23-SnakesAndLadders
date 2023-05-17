let content = ''

class PlayerCard extends HTMLElement{
    constructor(){
        super()
        const template = document.getElementById("player-card-template").content
        const shadowRoot = this.attachShadow({ mode: 'open' })
        shadowRoot.appendChild(template.cloneNode(true));
        this.addEventListener("click", () => {
            console.log("ouch")
        })
    }

    get player_name() {
        return this.getAttribute('player_name')
    }

    set player_name(val) {
        this.setAttribute('player_name', val)
        const name_container = this.shadowRoot.getElementById("player-name")
        name_container.innerHTML = this.getAttribute('player_name')
    }
}

window.customElements.define("player-card", PlayerCard)

console.log("imported element")
