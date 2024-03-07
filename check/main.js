document.addEventListener("DOMContentLoaded", () => {
  const customDropdown = document.querySelector(".custom-dropdown");
  const selectedOption = customDropdown.querySelector(".selected-option");
  const dropdownOptions = customDropdown.querySelector(".dropdown-options");
  const countrySearchInput = document.getElementById("countrySearch");

  dropdownOptions.addEventListener("click", handleOptionClick);

  const countries = [
    { name: "Albanien", code: "AL" },
    { name: "Andorra", code: "AD" },
    { name: "Österreich", code: "AT" },
    { name: "Weißrussland", code: "BY" },
    { name: "Belgien", code: "BE" },
    { name: "Bosnien und Herzegowina", code: "BA" },
    { name: "Bulgarien", code: "BG" },
    { name: "Kroatien", code: "HR" },
    { name: "Zypern", code: "CY" },
    { name: "Tschechische Republik", code: "CZ" },
    { name: "Dänemark", code: "DK" },
    { name: "Estland", code: "EE" },
    { name: "Finnland", code: "FI" },
    { name: "Frankreich", code: "FR" },
    { name: "Deutschland", code: "DE" },
    { name: "Griechenland", code: "GR" },
    { name: "Ungarn", code: "HU" },
    { name: "Island", code: "IS" },
    { name: "Irland", code: "IE" },
    { name: "Italien", code: "IT" },
    { name: "Lettland", code: "LV" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Litauen", code: "LT" },
    { name: "Luxemburg", code: "LU" },
    { name: "Malta", code: "MT" },
    { name: "Moldawien", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Montenegro", code: "ME" },
    { name: "Niederlande", code: "NL" },
    { name: "Nordmazedonien", code: "MK" },
    { name: "Norwegen", code: "NO" },
    { name: "Polen", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Rumänien", code: "RO" },
    { name: "Russland", code: "RU" },
    { name: "San Marino", code: "SM" },
    { name: "Serbien", code: "RS" },
    { name: "Slowakei", code: "SK" },
    { name: "Slowenien", code: "SI" },
    { name: "Spanien", code: "ES" },
    { name: "Schweden", code: "SE" },
    { name: "Schweiz", code: "CH" },
    { name: "Ukraine", code: "UA" },
    { name: "Vereinigtes Königreich", code: "GB" },
    { name: "Vatikanstadt", code: "VA" },
  ];

  const browserLanguage = navigator.language;
  countries.sort((a, b) => a.name.localeCompare(b.name, browserLanguage || navigator.language));

  console.log(countries);

  function setSelectedCountryByIP() {
    fetch("http://ip-api.com/json")
      .then(response => response.json())
      .then(data => {
        const userCountryCode = data.countryCode;
        const country = countries.find(c => c.code === userCountryCode);
        if (country) {
          selectCountry(country);
        }
      })
      .catch(error => {
        console.error("Fehler beim Abrufen standortbasierter IP-Daten:", error);
      });
  }

  countries.forEach(country => {
    const option = createOption(country);
    dropdownOptions.appendChild(option);
  });

  function filterCountries(searchTerm) {
    const filteredCountries = countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    dropdownOptions.innerHTML = "";

    filteredCountries.forEach(country => {
      const option = createOption(country);
      dropdownOptions.appendChild(option);
    });
  }

  countrySearchInput.addEventListener("input", handleSearchInput);
  selectedOption.addEventListener("click", toggleDropdown);
  document.addEventListener("click", closeDropdown);

  function highlightSelectedOption(countryCode) {
    const options = dropdownOptions.querySelectorAll("li");
    options.forEach(option => {
      option.classList.remove("selected");
      if (option.dataset.value === countryCode) {
        option.classList.add("selected");
      }
    });
  }

  const defaultCountry = countries.find(country => country.code === "DE");
  if (defaultCountry) {
    selectCountry(defaultCountry);
  }

  setSelectedCountryByIP();

  function addCountryToDropdown(country) {
    const option = createOption(country);
    dropdownOptions.appendChild(option);
  }

  function createOption(country) {
    const option = document.createElement("li");
    option.textContent = country.name;
    option.dataset.value = country.code;
    option.addEventListener("click", () => {
      selectCountry(country);
    });
    return option;
  }

  function selectCountry(country) {
    selectedOption.textContent = country.name;
    highlightSelectedOption(country.code);
    customDropdown.classList.remove("active");
  }

  function handleOptionClick(event) {
    if (event.target.nodeName === "LI") {
      const selectedCountryCode = event.target.dataset.value;
      const selectedCountry = countries.find(c => c.code === selectedCountryCode);
      selectCountry(selectedCountry);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function handleSearchInput() {
    const searchTerm = countrySearchInput.value;
    filterCountries(searchTerm);
  }

  function toggleDropdown() {
    customDropdown.classList.toggle("active");
    document.body.style.overflow = customDropdown.classList.contains("active") ? "hidden" : "auto";
    countrySearchInput.value = "";
    countrySearchInput.focus();
  }

  function closeDropdown(event) {
    if (!customDropdown.contains(event.target)) {
      customDropdown.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  }
});