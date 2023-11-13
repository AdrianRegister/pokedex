const pokedex = document.querySelector('.pokedex');
const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');

const spriteBox = document.createElement('img');
spriteBox.setAttribute('class', 'sprite-box');

const pokeInfoBox = document.createElement('p');
pokeInfoBox.setAttribute('class', 'poke-info-box');

searchButton.addEventListener('click', () => {
    spriteBox.innerHTML = '';
    pokeInfoBox.innerHTML = '';
    getPokeInfo(searchBar.value.toLowerCase())
});

function getPokeInfo(name) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then (response => response.json())
    .then (pokeInfo => {
        console.log(pokeInfo);
        getPokeSprite(pokeInfo.id)
        getPokeInfo(pokeInfo.id)
    })

    function getPokeSprite(idNumber) {
        fetch(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idNumber}.png`)
        .then (response => response.blob())
        .then (pokeSpriteBlob => {
            const pokeSprite = URL.createObjectURL(pokeSpriteBlob);
            spriteBox.src = pokeSprite;
            pokedex.appendChild(spriteBox);
        })
    }

    function getPokeInfo(idNumber) {
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${idNumber}/`)
        .then (response => response.json())
        .then (pokeInfo => {
            for (entry of pokeInfo.flavor_text_entries) {
                if (entry.version.name === 'platinum') {
                    pokeInfoBox.textContent = entry.flavor_text;
                    pokedex.appendChild(pokeInfoBox);                   
                }
            }
        })
    }
}

