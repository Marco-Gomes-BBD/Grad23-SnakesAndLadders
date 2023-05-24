
const load_section = async (id, location) => {
    let element = document.getElementById(id);
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {element.innerHTML = this.responseText;}
            if (this.status == 404) {element.innerHTML = "Page not found.";}
        }
    }
    xhttp.open("GET", location, true);
    xhttp.send();
}

export {load_section}
