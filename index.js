// Search Movie
let searchKey = [];
function searchMovie(){
    let key = document.getElementById('search-box').value;
    if(key == ''){
        document.getElementById('search-result').innerHTML = 'Cannot Find Movie On Empty Search';
        return;
    }
    fetch("http://www.omdbapi.com/?apikey=17553897&s="+key).then(function (response) {
        return response.json();
    }).then(function (data) {
        let result = data.Search;
        let length = result.length;
        let design = '';
        for(let i=0; i<length; i++){
            design += '<div class="search-result-box">';
            design += '<img src="'+result[i].Poster+'">';
            design += '<h3>'+result[i].Title+'</h3>';
            design += '<input type="text" hidden id="fav_'+i+'" value="'+result[i].imdbID+'">';
            design += '<button class="btn m-10" onclick="addFav('+i+')">Add To Favourite</button>';
            design += '<a href="movies.html?id='+result[i].imdbID+'" class="m-10 btn">Details</a></div>';
        }
        document.getElementById('search-result').innerHTML = design;
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
    searchKey.push(key);
    document.cookie = "searchKey="+searchKey;
}

// Detailed View of Movie
function detailed(){
    let id = window.location.search.substring(1);
    if(id == ''){
        document.getElementById('detail-result').innerHTML = 'No Movies Found';
        return;
    }
    id = id.split('=');
    fetch("http://www.omdbapi.com/?apikey=17553897&i="+id[1]).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        let detail = data;

        let design = '<h2>'+detail.Title+'</h2>';
        design += '<img src="'+detail.Poster+'">';
        design += '<div class="short-detail"><p>Released : '+detail.Released+'</p><p>Runtime : '+detail.Runtime+'</p><p>Genre : '+detail.Genre+'</p><p>Language : '+detail.Language+'</p><p>Director : '+detail.Director+'</p><p>IMDB Rating : '+detail.imdbRating+'</p></div>';
        design += '<div class="plot"> Description : <p>'+detail.Plot+'</p></div>';
        document.getElementById('detail-result').innerHTML = design;
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
}

// Add To Favourite
let movies = [];
function addFav(i){
    console.log(i);
    let fav = document.getElementById('fav_'+i).value;
    movies.push(fav);
    document.cookie = "movies="+movies;
}

// Fav Page
function favPage(){
    let length = movies.length;
    for(let i=0; i<length; i++){
        fetch("http://www.omdbapi.com/?apikey=17553897&i="+movies[i]).then(function (response) {
        return response.json();
        }).then(function (data) {
            let result = data;
            let design = '';
            design += '<div class="search-result-box">';
            design += '<img src="'+result.Poster+'">';
            design += '<h3>'+result.Title+'</h3>';
            design += '<input type="text" hidden id="fav_'+i+'" value="'+result.imdbID+'">';
            design += '<button class="btn m-10" onclick="addFav('+i+')">Add To Favourite</button>';
            design += '<a href="movies.html?id='+result.imdbID+'" class="m-10 btn">Details</a></div>';
            document.getElementById('fav-result').innerHTML = design;
        }).catch(function (err) {
            console.warn('Something went wrong.', err);
        });
    }
}