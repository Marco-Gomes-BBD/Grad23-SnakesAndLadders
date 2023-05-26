import { GameSummary } from './game-summary.js';

if (document.cookie != null) {
    fetch('/api/ongoing?' + document.cookie)
        .then((response) => response.json())
        .then((details) => {
            const container = document.getElementById('game-select');
            details.forEach((element) => {
                let new_child = new GameSummary(element);
                container.appendChild(new_child);
            });
        });
}
