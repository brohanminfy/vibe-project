const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');

const API_BASE_URL = 'http://localhost:3000/api';

const displayBustedResult = (user) => {
    resultsContainer.innerHTML = `
        <div class="card">
            <img src="${user.picture}" alt="User picture">
            <h3>BUSTED!</h3>
            <p><strong>${user.firstName} ${user.lastName}</strong> (${user.age}) was found in our database.</p>
            <p>They live in ${user.city}.</p>
        </div>
    `;
};

const displaySafeResult = (message) => {
    resultsContainer.innerHTML = `<p class="safe">${message}</p>`;
};

const displayError = (message) => {
    resultsContainer.innerHTML = `<p class="error">${message}</p>`;
}

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const emailToSearch = searchInput.value;

    resultsContainer.innerHTML = '<p>Searching...</p>';

    try {
        const response = await axios.get(`${API_BASE_URL}/search`, {
            params: {
                email: emailToSearch
            }
        });

        displayBustedResult(response.data);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            displaySafeResult(error.response.data.message);
        } else if (error.response && error.response.status === 400) {
            displayError(error.response.data.error);
        } else {
            displayError('Could not connect to the server. Please try again later.');
        }
    }
});
