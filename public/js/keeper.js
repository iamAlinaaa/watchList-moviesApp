// Movie watch list page
const movieItemsGrid = document.getElementById("movie-items-grid");

$(window).on("load", function () {
  // console.log("HELLO");

  // get movies database and info from it directly
  $.ajax({
    method: "POST",
    url: "/watchlist",
    contentType: "application/json",
    success: function (res) {
      console.log(res.serverArray);
      res.serverArray.forEach(function (oneMovie) {
        // create new div and add CLASS and ID to it
        let movieWatchItem = document.createElement("div");

        movieWatchItem.classList.add("movie-item");
        movieWatchItem.setAttribute("id", `${oneMovie.dbMovieID}`);

        movieWatchItem.innerHTML = `
      <img src="${oneMovie.dbMoviePoster}" title="${oneMovie.dbMovieTitle}">
      <button class ="button-delete" type="submit"><img src="images/sign-error-icon.png" id="delete-${oneMovie.dbMovieID}"></button>
      <button class ="button-select" type="submit"><img src="images/sign-check-icon.png" id="select-${oneMovie.dbMovieID}"></button>
      <button class ="button-info" type="submit"><a href="http://localhost:3000/movieinfo"><img src="images/sign-info-icon.png" id="info-${oneMovie.dbMovieID}" title="More Info"></a></button>
  `;
        movieItemsGrid.appendChild(movieWatchItem);
      });
    },
  });
});

// listen to the USER CLICK and find id of clicked button
document.addEventListener("click", function (event) {
  // find Button ID and div Movie item ID
  let foundID = event.target.id;
  let itemID = String(foundID.slice(foundID.indexOf("-") + 1));

  // check for INFO BUTTON
  if (foundID.includes("info-")) {
    // SEND MOVIE ID TO "/movieinfo";
    $.ajax({
      method: "POST",
      url: "/watchlist",
      contentType: "application/json",
      data: JSON.stringify({
        movieItemID: itemID,
      }),
    });
  }
  // check for SELECT BUTTON
  else if (foundID.includes("select-")) {
    // CHANGE movie item style if clicked
    document.getElementById(itemID).classList.toggle("seen-movie");
  }
  // check for DELETE BUTTON
  else if (foundID.includes("delete-")) {
    console.log("DEL");
    $.ajax({
      method: "POST",
      url: "/remove",
      contentType: "application/json",
      data: JSON.stringify({
        movieItemID: itemID,
      }),
    });
    // We can use hise element or remove from DOM visually (and after reloading of the page item will be removed from DB)
    // document.getElementById(itemID).style.visibility = "hidden";
    document.getElementById(itemID).remove();
  }
});
