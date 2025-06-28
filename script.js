const countryList = document.getElementById("countries");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("regions");
const sortSelect = document.getElementById("population");

let countries = [];

async function fetchCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population"
    );
    if (!res.ok) throw new Error("Failed to fetch countries.");
    countries = await res.json();
    displayCountries(countries);
  } catch (error) {
    countryList.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayCountries(data) {
  countryList.innerHTML = "";

  data.forEach((country) => {
    const card = document.createElement("div");
    card.className = "country-card";
    card.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common} flag" />
      <h2>${country.name.common}</h2>
      <p><strong>Capital:</strong> ${
        country.capital ? country.capital[0] : "N/A"
      }</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    `;
    countryList.appendChild(card);
  });
}

function filterAndSortCountries() {
  let filtered = [...countries];

  const searchText = searchInput.value.toLowerCase();
  const region = regionFilter.value;
  const sortOrder = sortSelect.value;

  if (searchText) {
    filtered = filtered.filter((c) =>
      c.name.common.toLowerCase().includes(searchText)
    );
  }

  if (region) {
    filtered = filtered.filter((c) => c.region === region);
  }

  if (sortOrder) {
    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.population - b.population
        : b.population - a.population
    );
  }

  displayCountries(filtered);
}

searchInput.addEventListener("input", filterAndSortCountries);
regionFilter.addEventListener("change", filterAndSortCountries);
sortSelect.addEventListener("change", filterAndSortCountries);

fetchCountries();
