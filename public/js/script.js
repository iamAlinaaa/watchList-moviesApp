// http://www.omdbapi.com/?i=tt3896198&apikey=51388117

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

// changeable var for ajax transaction of movie details
let movieInfoDetails;

// load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=51388117`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data.Search);
  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "images/img_not_found.png";

    movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      // console.log(movie.dataset.id);
      // clear input and hide search list
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      // find movie by ID
      const result = await fetch(
        `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=51388117`
      );
      const movieDetails = await result.json();
      movieInfoDetails = movieDetails;
      // open movie info
      displayMovieDetails(movieDetails);
    });
  });

}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
      <div class = "movie-poster">
          <img src = "${
            details.Poster != "N/A" ? details.Poster : "img_not_found.png"
          }" id="${details.imdbID}" alt = "movie poster">
      </div>
      <div class = "movie-info">
          <h3 class = "movie-title">${details.Title}</h3>
          <button class="button-add-to-list" id="button-add-to-list" type="submit"><i class="fa-solid fa-plus"></i> Add</button>
          <a href="http://localhost:3000/watchlist"><button class="button-my-watch-list" id="button-my-watch-list" type="submit">My Watch List</button></a>
          <ul class = "movie-misc-info">
              <li class = "year">Year: ${details.Year}</li>
              <li class = "rated">Ratings: ${details.Rated}</li>
              <li class = "released">Released: ${details.Released}</li>
          </ul>
          <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
          <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
          <p class = "actors"><b>Actors: </b>${details.Actors}</p>
          <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
          <p class = "language"><b>Language:</b> ${details.Language}</p>
          <p class = "awards"><b><i class = "fas fa-award"></i></b> ${
            details.Awards
          }</p>
      </div>
      
      `;
  // add all details to innerHTML
  // resultGrid.innerHTML = movieInfoDetails;

  // add button to movie keeper file
  let addButton = document.querySelector(".button-add-to-list");

  //   check if add Button were clicked and perform a function
  addButton.addEventListener("click", addToMovieList);
}

function addToMovieList() {
  console.log(movieInfoDetails.imdbID);

  // set poster as not found if N/A and as original poster if picture is exist
  if (movieInfoDetails.Poster != "N/A") {
    moviePoster = movieInfoDetails.Poster;
  } else {
    moviePoster = "images/img_not_found.png";
  }

  $.ajax({
    method: "POST",
    url: "/",
    contentType: "application/json",
    data: JSON.stringify({
      movieID: movieInfoDetails.imdbID,
      moviePoster: moviePoster,
      movieTitle: movieInfoDetails.Title,
      movieAllInfo: movieInfoDetails
    }),
  });
}

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
