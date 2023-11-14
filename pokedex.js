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

const prevButton = document.createElement('button');
prevButton.setAttribute('class', 'prev-button');
prevButton.textContent = 'Previous';

const nextButton = document.createElement('button');
nextButton.setAttribute('class', 'next-button');
nextButton.textContent = 'Next';

let currentPokeId;

prevButton.addEventListener('click', () => {
    spriteBox.innerHTML = '';
    pokeInfoBox.innerHTML = '';

    currentPokeId -= 1;

    getPokeSprite(currentPokeId);
    getPokeSpeciesInfo(currentPokeId);
})

nextButton.addEventListener('click', () => {
    spriteBox.innerHTML = '';
    pokeInfoBox.innerHTML = '';

    currentPokeId += 1;

    getPokeSprite(currentPokeId);
    getPokeSpeciesInfo(currentPokeId);
})


searchButton.addEventListener('click', () => {
    spriteBox.innerHTML = '';
    pokeInfoBox.innerHTML = '';

    pokedex.appendChild(pokeNameBox);
    pokedex.appendChild(spriteBox);
    pokedex.appendChild(pokeInfoBox);

    pokedex.appendChild(prevButton);
    pokedex.appendChild(nextButton);

    getPokeInfo(searchBar.value.toLowerCase())
});

randomSearch.addEventListener('click', () => {
    spriteBox.innerHTML = '';
    pokeInfoBox.innerHTML = '';

    pokedex.appendChild(pokeNameBox);
    pokedex.appendChild(spriteBox);
    pokedex.appendChild(pokeInfoBox);

    pokedex.appendChild(prevButton);
    pokedex.appendChild(nextButton);

    const randomNumber = randomPokeNumber();
    getPokeSprite(randomNumber);
    getPokeSpeciesInfo(randomNumber);

    currentPokeId = randomNumber;
})

function randomPokeNumber() {
    const min = 1;
    const max = 721;

    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getPokeInfo(name) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then (response => response.json())
    .then (pokeInfo => {
        console.log(pokeInfo);
        getPokeSprite(pokeInfo.id)
        getPokeSpeciesInfo(pokeInfo.id)
        currentPokeId = pokeInfo.id;
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
    })
}
