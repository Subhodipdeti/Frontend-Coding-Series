// TODO:
// all the elements here
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// TODO:
// search function here
async function onSearch(event) {
    const searchValue = event.target.value;
    const response = await fetch('../data/movies.json');
    const data = await response.json();
    const results = data.results.filter(r => {
        const regexp = new RegExp(`${searchValue}`, 'gi');
        return r.title.match(regexp);
    });
    resetResult();
    if(searchValue.length > 0) {
        outputResult(results);
    }
}

// TODO:
// event listner here
searchInput.addEventListener('input', onSearch);

// TODO:
// parse DOM here
function outputResult(results) {
    const ul = document.createElement('ul');

    for (const item of results) {
        const li = document.createElement('li');
        const text = document.createTextNode(item.title);
        li.appendChild(text);
        ul.appendChild(li);
    }
    searchResults.className = "results";
    searchResults.appendChild(ul);
}

function resetResult() {
    if(searchResults.firstElementChild) {
        searchResults.className = "";
        searchResults.removeChild(searchResults.firstElementChild);
    }
}
