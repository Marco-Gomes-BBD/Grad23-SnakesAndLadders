
const toast_element = document.getElementById('toast-message')

const show_toast = (message, type='info') => {
    toast_element.innerHTML = message
    toast_element.setAttribute('type', type)
    toast_element.className += " show";
    setTimeout(function(){ toast_element.className = toast_element.className.replace("show", ""); }, 3000);
}

export {show_toast}
