document.addEventListener('DOMContentLoaded', function() {
    const characters = [];
    const selectedCharacters = new Set();
    const originCounts = {
        Biotechnique: 0,
        Mutant: 0,
        Mystique: 0,
        Expertise: 0,
        Techno: 0
    };
    const uniqueCounts = {};
    let loadingFromCookie = false;

    loadHeaderFooter();

    Papa.parse('data/perso.csv', {
        download: true,
        header: true,
        complete: function(results) {
            characters.push(...results.data);
            populateSelectMenus();
            loadSelectedCharactersFromCookie();
        }
    });

    function loadHeaderFooter() {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-container').innerHTML = data;
            });

        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-container').innerHTML = data;
            });
    }

    function populateSelectMenus() {
        document.querySelectorAll('.character-select').forEach((select, index, selects) => {
            const tableCaption = select.closest('table').caption.textContent;
            characters.forEach(character => {
                if (character['Character Id'] !== 'MysteryMan') {
                    if ((tableCaption === 'Ville' && character['Localisation'] === 'Ville') ||
                        (tableCaption === 'Mondial Vilain' && character['Localisation'] === 'Mondial' && character['Allignement'] === 'Vilain') ||
                        (tableCaption === 'Mondial Hero' && character['Localisation'] === 'Mondial' && character['Allignement'] === 'Hero') ||
                        (tableCaption === 'Cosmique Vilain' && character['Localisation'] === 'Cosmique' && character['Allignement'] === 'Vilain') ||
                        (tableCaption === 'Cosmique Hero + Lilandra' && character['Localisation'] === 'Cosmique' && character['Allignement'] === 'Hero') ||
                        (tableCaption === 'Cosmique Hero + Lilandra' && character['Character Id'] === 'Lilandra')) {
                        const option = document.createElement('option');
                        option.value = character['Character Id'];
                        option.textContent = character['Alias'] || character['Character Id']; // Utiliser l'alias ou l'ID du personnage
                        select.appendChild(option);
                    }
                }
            });

            select.addEventListener('change', function() {
                const selectedCharacterId = this.value;
                if (!loadingFromCookie && selectedCharacters.has(selectedCharacterId)) {
                    alert('Ce personnage est déjà sélectionné.');
                    this.value = '';
                    return;
                }

                const img = this.nextElementSibling;
                img.src = `portrait/Portrait_${selectedCharacterId}.png`;
                img.alt = selectedCharacterId;

                const logo = img.nextElementSibling;
                const logo2 = logo.nextElementSibling;
                const uniquesContainer = logo2.nextElementSibling;
                const character = characters.find(c => c['Character Id'] === selectedCharacterId);
                if (character) {
                    const origins = [character['Origine'], character['Origine2']].filter(Boolean);
                    const originValues = origins.map(origin => origin.trim());

                    // Mise à jour des compteurs d'origine
                    if (this.dataset.previousValue) {
                        const previousCharacter = characters.find(c => c['Character Id'] === this.dataset.previousValue);
                        if (previousCharacter) {
                            const previousOrigins = [previousCharacter['Origine'], previousCharacter['Origine2']].filter(Boolean).map(origin => origin.trim());
                            previousOrigins.forEach(origin => {
                                originCounts[origin] -= previousOrigins.length > 1 ? 0.5 : 1;
                            });

                            // Mise à jour des compteurs d'unique
                            const previousUniques = previousCharacter['Unique'].split(',').map(unique => unique.trim());
                            previousUniques.forEach(unique => {
                                uniqueCounts[unique]--;
                                if (uniqueCounts[unique] === 0) {
                                    delete uniqueCounts[unique];
                                }
                            });
                        }
                    }

                    originValues.forEach(origin => {
                        originCounts[origin] += originValues.length > 1 ? 0.5 : 1;
                    });

                    updateOriginCounters();

                    if (originValues[0]) {
                        logo.src = `images/${originValues[0].toLowerCase()}.png`;
                        logo.alt = originValues[0];
                        logo.style.display = 'inline';
                    } else {
                        logo.src = '';
                        logo.alt = '';
                        logo.style.display = 'none';
                    }

                    if (originValues[1]) {
                        logo2.src = `images/${originValues[1].toLowerCase()}.png`;
                        logo2.alt = originValues[1];
                        logo2.style.display = 'inline';
                    } else {
                        logo2.src = '';
                        logo2.alt = '';
                        logo2.style.display = 'none';
                    }

                    // Mise à jour des uniques
                    const uniques = character['Unique'].split(',').map(unique => unique.trim());
                    uniquesContainer.innerHTML = '';
                    uniques.forEach(unique => {
                        const uniqueImg = document.createElement('img');
                        uniqueImg.src = `uniques/ICON_GEAR_${unique}.png`;
                        uniqueImg.alt = unique;
                        uniquesContainer.appendChild(uniqueImg);

                        if (!uniqueCounts[unique]) {
                            uniqueCounts[unique] = 0;
                        }
                        uniqueCounts[unique]++;
                    });

                    updateUniqueCounters();
                }

                if (this.dataset.previousValue) {
                    selectedCharacters.delete(this.dataset.previousValue);
                }
                selectedCharacters.add(selectedCharacterId);
                this.dataset.previousValue = selectedCharacterId;

                updateSelectMenus();
                saveSelectedCharactersToCookie();
            });

            select.value = 'MysteryMan';
            const img = select.nextElementSibling;
            img.src = 'portrait/Portrait_MysteryMan.png';
            img.alt = 'MysteryMan';

            const logo = img.nextElementSibling;
            logo.src = '';
            logo.alt = '';
            logo.style.display = 'none';

            const logo2 = logo.nextElementSibling;
            logo2.src = '';
            logo2.alt = '';
            logo2.style.display = 'none';

            const uniquesContainer = logo2.nextElementSibling;
            uniquesContainer.innerHTML = '';

            // Automatically select Lilandra for the last case of "Cosmique Hero + Lilandra"
            if (tableCaption === 'Cosmique Hero + Lilandra' && index === selects.length - 5) {
                select.value = 'Lilandra';
                const event = new Event('change');
                select.dispatchEvent(event);
            }
        });

        updateSelectMenus();
    }

    function updateSelectMenus() {
        document.querySelectorAll('.character-select').forEach(select => {
            const currentSelection = select.value;
            Array.from(select.options).forEach(option => {
                if (option.value !== currentSelection && selectedCharacters.has(option.value)) {
                    option.disabled = true;
                } else {
                    option.disabled = false;
                }
            });
        });
    }

    function updateOriginCounters() {
        document.getElementById('biotechnique-count').textContent = originCounts.Biotechnique;
        document.getElementById('mutant-count').textContent = originCounts.Mutant;
        document.getElementById('mystique-count').textContent = originCounts.Mystique;
        document.getElementById('expertise-count').textContent = originCounts.Expertise;
        document.getElementById('techno-count').textContent = originCounts.Techno;
    }

    function updateUniqueCounters() {
        const uniquesCounters = document.getElementById('uniques-counters');
        uniquesCounters.innerHTML = '';

        for (const unique in uniqueCounts) {
            const uniqueItem = document.createElement('div');
            uniqueItem.className = 'unique-item';
            const uniqueImg = document.createElement('img');
            uniqueImg.src = `uniques/ICON_GEAR_${unique}.png`;
            uniqueImg.alt = unique;
            uniqueItem.appendChild(uniqueImg);
            const uniqueCount = document.createElement('div');
            uniqueCount.textContent = uniqueCounts[unique];
            uniqueItem.appendChild(uniqueCount);
            uniquesCounters.appendChild(uniqueItem);
        }
    }

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) === 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }

    function saveSelectedCharactersToCookie() {
        const selectedArray = Array.from(selectedCharacters);
        setCookie('selectedCharacters', JSON.stringify(selectedArray), 7);
    }

    function loadSelectedCharactersFromCookie() {
        const selectedArray = JSON.parse(getCookie('selectedCharacters') || '[]');
        loadingFromCookie = true;

        const selects = document.querySelectorAll('.character-select');

        selectedArray.forEach((characterId, index) => {
            if (index < selects.length) {
                const select = selects[index];
                if (select.querySelector(`option[value="${characterId}"]`)) {
                    select.value = characterId;
                    selectedCharacters.add(characterId);
                    const event = new Event('change');
                    select.dispatchEvent(event);
                }
            }
        });
        loadingFromCookie = false;
    }
});