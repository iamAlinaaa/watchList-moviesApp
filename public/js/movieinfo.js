const resultGrid = document.getElementById("result-grid");

$(window).on("load", function () {
  // console.log("HELLO");

  $.ajax({
    method: "POST",
    url: "/movieinfo",
    contentType: "application/json",
    success: function (res) {
      console.log(`got Item ID ${res.serverItemID}`);
      showMovieInfo(res.serverItemID);
    },
    
  });
});

async function showMovieInfo(itemID) {
  // find movie by ID
  const result = await fetch(
    `http://www.omdbapi.com/?i=${itemID}&apikey=51388117`
  );

  const movieDetails = await result.json();
  console.log(movieDetails);
  displayMovieDetails(movieDetails);
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
            <a href="http://localhost:3000/watchlist"><button class="button-return-to-list" id="button-return-to-list" type="submit"><i class="fa-solid fa-arrow-left"></i> Back to Watch List</button></a>
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
}
