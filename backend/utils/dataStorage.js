const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const farmersFile = path.join(dataDir, 'farmers.json');
const actionsFile = path.join(dataDir, 'actions.json');
const scoresFile = path.join(dataDir, 'scores.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function read(file) {
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, 'utf8');
    if (!content.trim()) return [];
    try {
        return JSON.parse(content);
    } catch (error) {
        console.error('Error parsing JSON from file:', file, error);
        return [];
    }
}

function write(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// -------- FARMERS --------
function getFarmers() { return read(farmersFile); }
function getFarmerById(id) { return getFarmers().find(f => f.id === parseInt(id)); }
function getFarmerByEmail(email) { return getFarmers().find(f => f.email === email); }
function addFarmer(farmer) {
    const list = getFarmers();
    list.push(farmer);
    write(farmersFile, list);
    return farmer;
}

function updateFarmer(updated) {
    const list = getFarmers().map(f => f.id === updated.id ? updated : f);
    write(farmersFile, list);
    return updated;
}

// -------- ACTIONS --------
function getActions() { return read(actionsFile); }
function getActionsByFarmerId(id) {
    return getActions().filter(a => a.farmerId === parseInt(id));
}
function addAction(action) {
    const list = getActions();
    list.push(action);
    write(actionsFile, list);
    return action;
}

// -------- SCORES --------
function getScores() { return read(scoresFile); }
function getScoresByFarmerId(id) {
    return getScores().filter(s => s.farmerId === parseInt(id));
}
function addScore(score) {
    const list = getScores();
    list.push(score);
    write(scoresFile, list);
    return score;
}

function updateScore(updated) {
    const list = getScores().map(s => s.id === updated.id ? updated : s);
    write(scoresFile, list);
    return updated;
}

module.exports = {
    getFarmers,
    getFarmerById,
    getFarmerByEmail,
    addFarmer,
    updateFarmer,

    getActions,
    getActionsByFarmerId,
    addAction,

    getScores,
    getScoresByFarmerId,
    addScore,
    updateScore
};