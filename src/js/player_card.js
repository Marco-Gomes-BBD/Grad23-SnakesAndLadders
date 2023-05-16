let content = ''

class PlayerCard extends HTMLElement{
    constructor(){
        super()
        const template = document.getElementById("player-card-template").content
        const shadowRoot = this.attachShadow({ mode: 'open' })
        console.log(template)
        shadowRoot.appendChild(template.cloneNode(true));
        this.addEventListener("click", () => {
            console.log("ouch")
        })
    }
}

window.customElements.define("player-card", PlayerCard)
console.log("imported element")
