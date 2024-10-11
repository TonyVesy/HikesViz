function populateCountryDropdown(data) {
    const countrySelect = document.getElementById("country-filter");

    // Get unique countries from the data
    const uniqueCountries = [...new Set(data.map(hike => hike.country_name))];

    // Populate the dropdown with country options
    uniqueCountries.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}
export { populateCountryDropdown };