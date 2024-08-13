import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputCountry = document.querySelector('input#search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

// search countries database
function inputHandler(event) {
  const searchInput = event.target.value.trim();

  cleanCountry();
  cleanListCountry();

  fetchCountries(searchInput)
    .then(data => {
      if (data.length > 10) {
        Notify.info('Too many matches found. Pease enter a more specific name');
        return;
      }
      countryDataMarkup(data);
    })
    .catch(err => {
      Notify.failure('Ooops, there is no country with that name');
    });
}

function createListMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li class="country-list_item" data-country='${name.common}'><img class="country-list_image" src="${flags.svg}" alt="${name.common}" height="40px" '/> <p class="country-list_post">${name.common}</p></li>`
    )
    .join('');
}

// creating country info markup
function createDataMarkup(data) {
  const countryEl = data[0];
  const { name, capital, population, flags, languages } = countryEl;
  return `<li class="country_item">
  <div class="country_flag-name-container">
  <img src="${flags.svg}" alt="${name.common}" height="30px"/></p>
  <h1 class="country_title">${name.official}</h2
  </div>
  <p><b>Capital:</b> ${capital}
  <p><b>Population:</b> ${population}
  <p><b>Languages:</b> ${Object.values(languages)}</p>
  </li>
  `;
}

// rendering
function countryDataMarkup(data) {
  if (data.length === 1) {
    const dataMarkup = createDataMarkup(data);
    infoCountry.innerHTML = dataMarkup;
  } else {
    const listMarkup = createListMarkup(data);
    listCountry.innerHTML = listMarkup;

    // add click to country on list
    const listCountryItem = document.querySelectorAll('li');

    listCountryItem.forEach(item => {
      item.addEventListener('click', event => {
        const clickedCountry = event.currentTarget.dataset.country;
        // searches the database by clicked country
        const wantedCountry = data.filter(
          country => country.name.common === clickedCountry
        );

        infoCountry.innnerHTML = createDataMarkup(wantedCountry);
        console.log('Item clicked', clickedCountry);
        cleanListCountry();
      });
    });
  }
}

inputCountry.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function cleanCountry() {
  infoCountry.innerHTML = '';
}

function cleanListCountry() {
  listCountry.innerHTML = '';
}
