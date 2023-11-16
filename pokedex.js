const pokedex = document.querySelector('.pokedex');
const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');
const randomSearch = document.querySelector('.random-search');

const pokeNameBox = document.createElement('h4');
pokeNameBox.setAttribute('class', 'poke-name-box');

const spriteBox = document.createElement('img');
spriteBox.setAttribute('class', 'sprite-box');

const pokeInfoBox = document.createElement('p');
pokeInfoBox.setAttribute('class', 'poke-info-box');

const tableContainer = document.createElement('div');
tableContainer.setAttribute('class', 'stats-table');

const prevButton = document.createElement('button');
prevButton.setAttribute('class', 'prev-button');
prevButton.textContent = 'Previous';

const nextButton = document.createElement('button');
nextButton.setAttribute('class', 'next-button');
nextButton.textContent = 'Next';

let randomSearchCalled = false;
let buttonClicked = false;

let currentPokeId;
const currentPokeStats = {
    HP: 5,
    Attack: 5,
    Defense: 5,
    'Special Attack': 5,
    'Special Defence': 5,
    Speed: 5
}

prevButton.addEventListener('click', () => {
    buttonClicked = true;
    spriteBox.innerHTML = '';

    if (currentPokeId >= 2) {
        pokeInfoBox.innerHTML = '';
        tableContainer.innerHTML = '';
        currentPokeId -= 1;
        getPokeSprite(currentPokeId);
        getPokeSpeciesInfo(currentPokeId);
    }
})

nextButton.addEventListener('click', () => {
    buttonClicked = true;
    spriteBox.innerHTML = '';

    if (currentPokeId <= 720) {
        pokeInfoBox.innerHTML = '';
        tableContainer.innerHTML = '';
        currentPokeId += 1;
        getPokeSprite(currentPokeId);
        getPokeSpeciesInfo(currentPokeId);
    }
})

searchButton.addEventListener('click', () => {
    randomSearchCalled = false;

    spriteBox.innerHTML = '';
    pokeInfoBox.innerHTML = '';
    tableContainer.innerHTML = '';

    pokedex.appendChild(pokeNameBox);
    pokedex.appendChild(spriteBox);
    pokedex.appendChild(pokeInfoBox);

    pokedex.appendChild(prevButton);
    pokedex.appendChild(nextButton);
    pokedex.appendChild(tableContainer);
    
    getPokeInfo(searchBar.value.toLowerCase())
});

randomSearch.addEventListener('click', () => {
    randomSearchCalled = true;

    spriteBox.innerHTML = '';
    pokeInfoBox.innerHTML = '';
    tableContainer.innerHTML = '';

    pokedex.appendChild(pokeNameBox);
    pokedex.appendChild(spriteBox);
    pokedex.appendChild(pokeInfoBox);

    pokedex.appendChild(prevButton);
    pokedex.appendChild(nextButton);

    pokedex.appendChild(tableContainer);

    const randomNumber = randomPokeNumber();
    getPokeSprite(randomNumber);
    getPokeSpeciesInfo(randomNumber);

    currentPokeId = randomNumber;
})

function showPokeStats(statObject) {
    const table = document.createElement('table');
    let statTotal = 0;

    for (let i = 0, j = 0; i < 6; i++, j++) {
        const statName = Object.keys(statObject)[j];
        const statValue = Object.values(statObject)[j];

        statTotal += statValue;

        const tableRow = document.createElement('tr');
        tableRow.setAttribute('class', 'stat-row');
        const tableCellOne = document.createElement('td');
        tableCellOne.setAttribute('class', 'stat-name-cell');
        const tableCellTwo = document.createElement('td');
        tableCellTwo.setAttribute('class', 'stat-value-cell');

        tableCellOne.textContent = statName;
        tableCellTwo.textContent = statValue;

        tableRow.appendChild(tableCellOne);
        tableRow.appendChild(tableCellTwo);
        table.appendChild(tableRow);
    }

    const totalValueName = document.createElement('td');
    totalValueName.setAttribute('class', 'stat-name-cell');
    totalValueName.textContent = 'Total';

    const totalValue = document.createElement('td');
    totalValue.setAttribute('class', 'total-cell');
    totalValue.textContent = statTotal;

    const totalRow = document.createElement('tr');
    totalRow.setAttribute('class', 'stat-row');

    totalRow.appendChild(totalValueName);
    totalRow.appendChild(totalValue);

    table.appendChild(totalRow);

    tableContainer.appendChild(table);
    fillStatBar(Object.values(statObject));
}

function fillStatBar(values) {
    const statBars = document.querySelectorAll('.stat-value-cell');

    statBars.forEach((statBar, i) => {
        const total = 255;
        const percentOfFull = (values[i] / total).toFixed(2);

        if (percentOfFull < 0.2) {
            statBar.style.background = `linear-gradient(90deg, red ${percentOfFull * 100}%, white ${percentOfFull * 100}%`;
        } else if (percentOfFull < 0.4) {
            statBar.style.background = `linear-gradient(90deg, orange ${percentOfFull * 100}%, white ${percentOfFull * 100}%`;
        } else if (percentOfFull < 0.6) {
            statBar.style.background = `linear-gradient(90deg, yellow ${percentOfFull * 100}%, white ${percentOfFull * 100}%`;
        } else if (percentOfFull < 0.8) {
            statBar.style.background = `linear-gradient(90deg, lightgreen ${percentOfFull * 100}%, white ${percentOfFull * 100}%`;
        } else {
            statBar.style.background = `linear-gradient(90deg, aqua ${percentOfFull * 100}%, white ${percentOfFull * 100}%`;
        }   
    });
}

function randomPokeNumber() {
    const min = 1;
    const max = 721;

    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getPokeInfo(name) {
    buttonClicked = false;

    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then (response => response.json())
    .then (pokeInfo => {
        console.log(pokeInfo);
        getPokeSprite(pokeInfo.id)
        getPokeSpeciesInfo(pokeInfo.id)
        currentPokeId = pokeInfo.id;

        for (i = 0; i < Object.keys(currentPokeStats).length; i++) {
            const statName = Object.keys(currentPokeStats)[i];
            currentPokeStats[statName] = pokeInfo.stats[i].base_stat;
        }

        showPokeStats(currentPokeStats);
    })
}

function getPokeInfoForRandom(name) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then (response => response.json())
    .then (pokeInfo => {
        console.log(pokeInfo);
        currentPokeId = pokeInfo.id;

        for (i = 0; i < Object.keys(currentPokeStats).length; i++) {
            const statName = Object.keys(currentPokeStats)[i];
            currentPokeStats[statName] = pokeInfo.stats[i].base_stat;
        }

        showPokeStats(currentPokeStats);
    })
}

function getPokeSprite(idNumber) {
    fetch(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idNumber}.png`)
    .then (response => response.blob())
    .then (pokeSpriteBlob => {
        const pokeSprite = URL.createObjectURL(pokeSpriteBlob);
        spriteBox.src = pokeSprite;
    })
}

function getPokeSpeciesInfo(idNumber) {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${idNumber}/`)
    .then (response => response.json())
    .then (pokeInfo => {
        pokeNameBox.textContent = pokeInfo.name[0].toUpperCase() + pokeInfo.name.slice(1);
        for (entry of pokeInfo.flavor_text_entries) {
            if (entry.language.name === 'en' && entry.version.name === 'alpha-sapphire') {
                const flavorText = entry.flavor_text; 
                pokeInfoBox.textContent = flavorText;                
            }
        }

        if (randomSearchCalled || buttonClicked) {
            getPokeInfoForRandom(pokeInfo.name);
        }        
    })
}
