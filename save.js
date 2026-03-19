function exportSave(data) {
    return btoa(JSON.stringify(data)); // simple base64 encoding
}

function importSave(encrypted) {
    return JSON.parse(atob(encrypted));
}

function saveGame() {
    const coins = parseInt(document.getElementById('coins').textContent);
    const saveData = { coins };
    const exported = exportSave(saveData);
    alert("Copy this string to save your game:\n" + exported);
}

function loadGame() {
    const importedStr = prompt("Paste your save string:");
    if (!importedStr) return;
    const imported = importSave(importedStr);
    document.getElementById('coins').textContent = imported.coins || 0;
}

// Attach buttons after page loads
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveBtn').addEventListener('click', saveGame);
    document.getElementById('loadBtn').addEventListener('click', loadGame);
});
