if (document.cookie != null && document.cookie != '') {
    fetch('/user-details?' + document.cookie)
        .then((response) => response.json())
        .then((details) => {
            const img = document.getElementById('user-avatar');
            const name = document.getElementById('username');

            name.innerHTML = details.login;
            img.src = details.avatar_url;
        });
}
