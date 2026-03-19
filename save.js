function exportSave(data) {
    return btoa(JSON.stringify(data)); // simple encoding
}

function importSave(encrypted) {
    return JSON.parse(atob(encrypted));
}

// Example: save/load coins
function saveGame() {
    const saveData = {coins: parseInt(document.getElementById('coins').textContent)};
    const exported = exportSave(saveData);
    console.log("Exported save:", exported);
    alert("Copy this string to save: " + exported);
}

function loadGame() {
    const importedStr = prompt("Paste your save string:");
    if (!importedStr) return;
    const imported = importSave(importedStr);
    document.getElementById('coins').textContent = imported.coins || 0;
}

// Optional buttons for saving/loading
const uiDiv = document.getElementById('ui');
const saveBtn = document.createElement('button');
saveBtn.textContent = "Save Game";
saveBtn.onclick = saveGame;
uiDiv.appendChild(saveBtn);

const loadBtn = document.createElement('button');
loadBtn.textContent = "Load Game";
loadBtn.onclick = loadGame;
uiDiv.appendChild(loadBtn);
