document.addEventListener('DOMContentLoaded', function() {
    const rosterContainer = document.querySelector('.roster-container');
    const searchBar = document.getElementById('search-bar');
    let characters = [];

    fetch('data/roster_wade.csv')
        .then(response => response.text())
        .then(data => {
            characters = parseCSV(data);
            characters.sort((a, b) => b.power - a.power); // Trier par puissance décroissante
            displayCharacters(characters);
        });

    searchBar.addEventListener('input', function() {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredCharacters = characters.filter(char => char.characterId.toLowerCase().includes(searchTerm));
        displayCharacters(filteredCharacters);
    });

    function parseCSV(data) {
        const lines = data.split('\n');
        const result = [];
        const headers = lines[0].split(',');
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].split(',');
            if (line.length >= headers.length) {
                result.push({
                    name: line[headers.indexOf('Name')],
                    characterId: line[headers.indexOf('Character Id')],
                    level: line[headers.indexOf('Level')],
                    power: line[headers.indexOf('Power')],
                    stars: line[headers.indexOf('Stars')],
                    redStars: line[headers.indexOf('Red Stars')],
                    gearTier: line[headers.indexOf('Gear Tier')],
                    basic: line[headers.indexOf('Basic')],
                    special: line[headers.indexOf('Special')],
                    ultimate: line[headers.indexOf('Ultimate')],
                    passive: line[headers.indexOf('Passive')],
                    isoClass: line[headers.indexOf('ISO Class')],
                    isoMatrix: line[headers.indexOf('ISO Matrix')],
                    striker: line[headers.indexOf('Striker')],
                    raider: line[headers.indexOf('Raider')],
                    skirmisher: line[headers.indexOf('Skirmisher')],
                    fortifier: line[headers.indexOf('Fortifier')],
                    healer: line[headers.indexOf('Healer')]
                });
            }
        }
        return result.filter(char => char.name === 'Wade');
    }

    function displayCharacters(characters) {
        rosterContainer.innerHTML = ''; // Clear previous characters
        characters.forEach(char => {
            const charElement = document.createElement('div');
            charElement.classList.add('character');
            const redStarsToShow = Math.min(char.redStars, char.stars);
            const yellowStarsToShow = char.stars - redStarsToShow;
            const diamondsToShow = Math.max(0, char.redStars - char.stars);
            let isoImage;
            let isoClassImage;
            let isoLevel = 0;
            let starsHtml = '';

            if (diamondsToShow > 0) {
                starsHtml = '<img src="images/diamant.png" alt="Diamant" style="width: 20px; height: 20px;">'.repeat(diamondsToShow);
            } else {
                starsHtml = '<img src="images/étoile_rouge.png" alt="Étoile Rouge" style="width: 20px; height: 20px;">'.repeat(redStarsToShow) +
                            '<img src="images/étoile.png" alt="Étoile" style="width: 20px; height: 20px;">'.repeat(yellowStarsToShow);
            }
            switch (char.isoClass.toLowerCase()) {
                case 'striker':
                    isoClassImage = 'attaquant';
                    isoLevel = char.striker % 5;
                    break;
                case 'raider':
                    isoClassImage = 'fantassin';
                    isoLevel = char.raider % 5;
                    break;
                case 'skirmisher':
                    isoClassImage = 'tirailleur';
                    isoLevel = char.skirmisher % 5;
                    break;
                case 'fortifier':
                    isoClassImage = 'fortificateur';
                    isoLevel = char.fortifier % 5;
                    break;
                case 'healer':
                    isoClassImage = 'soigneur';
                    isoLevel = char.healer % 5;
                    break;
                default:
                    isoClassImage = 'unknown';
            }
            let isoColorSuffix;
            switch (char.isoMatrix.toLowerCase()) {
                case '':
                    isoColorSuffix = '-v';
                    break;
                case 'blue':
                    isoColorSuffix = '-b';
                    break;
                case 'purple':
                    isoColorSuffix = '-p';
                    break;
                default:
                    isoColorSuffix = '';
            }
            let isoLevelImage = `<img src="images/iso-${isoLevel}.png" alt="Iso Level ${isoLevel}" style="height: 20px; width: auto;">`;
            isoImage = `<img src="images/${isoClassImage}${isoColorSuffix}.png" alt="${char.isoClass} ${char.isoMatrix}">`;
            const backgroundColor = (char.gearTier >= 19 && char.gearTier <= 22) ? 'background-color: #d60707;' : '' |
                                    (char.gearTier >= 16 && char.gearTier <= 18) ? 'background-color: #076666;' : '' |
                                    (char.gearTier >= 13 && char.gearTier <= 15) ? 'background-color: #ce7d1c;' : '' |
                                    (char.gearTier >= 9 && char.gearTier <= 12) ? 'background-color: #ff00ff;' : ''  |
                                    (char.gearTier >= 5 && char.gearTier <= 8) ? 'background-color: #00ffff;' : '' |
                                    (char.gearTier >= 2 && char.gearTier <= 4) ? 'background-color: #00ff00;' : '' |
                                    (char.gearTier == 1) ? 'background-color: #696969;' : '' ;
                charElement.innerHTML = `
                <div style="display: flex; justify-content: center;">
                    <div style="width: 75px; height: 110px; ${backgroundColor}; border-radius: 15px; display: flex; align-items: center; justify-content: center;">
                        <img src="portrait/Portrait_${char.characterId}.png" alt="Portrait de ${char.characterId}" style="width: 75px; height: 110px; border-radius: 15px;">
                    </div>
                </div>
                <p style="margin-top: -30px; font-size: 12px;">NIV ${char.level}</p>
                <p style="margin-top: -6px">${char.power}</p>
                <h3 style="margin-top: -9px;">${char.characterId}</h3>
                <p>${starsHtml}</p>
                <p>Niveau d'équipement: ${char.gearTier}</p>
                <p>
                ${char.basic ? `<img src="images/${char.basic}.png" alt="Basic ${char.basic}">` : '🔒'}
                ${char.special ? `<img src="images/${char.special}.png" alt="Special ${char.special}">` : `🔒`}
                ${char.ultimate ? `<img src="images/${char.ultimate}.png" alt="Ultimate ${char.ultimate}">` : `🔒`}
                ${char.passive ? `<img src="images/${char.passive}-passif.png" alt="Passive ${char.passive}">` : `🔒`}
                </p>
                <p>${char.isoClass === '' ? '🔒' : isoImage}</p>
                <p>${isoLevelImage}</p>
            `;
            rosterContainer.appendChild(charElement);
        });
    }
});