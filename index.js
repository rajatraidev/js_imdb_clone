// Search Movie
function searchMovie(){
    let searchKey = [];
    let key = document.getElementById('search-box').value;
    if(key == ''){
        document.getElementById('search-result').innerHTML = 'Cannot Find Movie On Empty Search';
        return;
    }
    document.getElementById('centered').style.display = 'block';
    fetch("https://www.omdbapi.com/?apikey=17553897&s="+key).then(function (response) {
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
            design += '<a class="btn m-10" onclick="addFav('+i+')" id="favbtn_'+i+'">Add To Favourite</a>';
            design += '<a href="movies.html?id='+result[i].imdbID+'" class="m-10 btn" target="_blank">Details</a></div>';
        }
        document.getElementById('search-result').innerHTML = design;
        document.getElementById('centered').style.display = 'none';
    }).catch(function (err) {
        document.getElementById('centered').style.display = 'none';
        document.getElementById('search-result').innerHTML = 'No Movie Found!';
        
    });
    let datalist = document.cookie;
    if(datalist != ''){
        datalist = datalist.split(';');
        let index =  cookieIndex(datalist, 'searchKey');
        if(index !== undefined){
            datalist = datalist[index].split('=');
            datalist =  datalist[1].split(',');
            searchKey = datalist
            searchKey.push(key);
        }
        else{
            searchKey.push(key);
        }
    }else{
        searchKey.push(key);
    }
    document.cookie = "searchKey="+searchKey+";expires=Fri, 31 Dec 9999 21:10:10 GMT"
}

// Suggestion
suggestion();
function suggestion(){
    let suggest = document.cookie;
    if(suggest != ''){
        suggest = suggest.split(';');
        let index =  cookieIndex(suggest, 'searchKey');
        if(index !== undefined){
            suggest = suggest[index].split('=');
            suggest =  suggest[1].split(',');
            let length = suggest.length;
            let suggestInput = '';
            for(let i=0; i<length; i++){
                suggestInput += '<option value="'+suggest[i]+'">'
            }
            document.getElementById('suggest').innerHTML = suggestInput;
        }
    }
}

// Detailed View of Movie
function detailed(){
    let id = window.location.search.substring(1);
    if(id == ''){
        document.getElementById('detail-result').innerHTML = 'No Movies Found';
        return;
    }
    id = id.split('=');
    document.getElementById('centered').style.display = 'block';
    fetch("https://www.omdbapi.com/?apikey=17553897&i="+id[1]).then(function (response) {
        return response.json();
    }).then(function (data) {
        let detail = data;
        let design = '<h2>'+detail.Title+'</h2>';
        design += '<img src="'+detail.Poster+'">';
        design += '<div class="short-detail"><p>Released : '+detail.Released+'</p><p>Runtime : '+detail.Runtime+'</p><p>Genre : '+detail.Genre+'</p><p>Language : '+detail.Language+'</p><p>Director : '+detail.Director+'</p><p>IMDB Rating : '+detail.imdbRating+'</p></div>';
        design += '<div class="plot"> Description : <p>'+detail.Plot+'</p></div>';
        document.getElementById('detail-result').innerHTML = design;
        document.getElementById('centered').style.display = 'none';
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
}

// Finding Cookies
function cookieIndex(cookies, cookieName){
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        
        if (cookie.startsWith(cookieName + '=')) {
          return i;
        }
      }
}

// Add To Favourite
function addFav(i){
    let movies = [];
    let fav = document.getElementById('fav_'+i).value;
    let favList = document.cookie;
    if(favList != ''){
        favList = favList.split(';');
        let index =  cookieIndex(favList, 'movies');
        if(index !== undefined){
            favList = favList[index].split('=');
            favList =  favList[1].split(',');
            movies = favList;
            movies.push(fav);
        }
        else{
            movies.push(fav);
        }
    }
    else{
        movies.push(fav);
    }
    document.cookie = "movies="+movies+";expires=Fri, 31 Dec 9999 21:10:10 GMT";   
    document.getElementById('favbtn_'+i).innerHTML = 'Added To Fav';
    document.getElementById('favbtn_'+i).disabled = true;
}

// Remove Favourite
function removeFav(i){
    let remove = document.getElementById('remove_'+i).value;
    let favList = document.cookie;
    favList = favList.split(';');
    let index = cookieIndex(favList, 'movies');
    if(index !== undefined){
        favList = favList[index].split('=');
        favList =  favList[1].split(',');
        favList = favList.filter(item => item !== remove);
        document.cookie = "movies="+favList+";expires=Fri, 31 Dec 9999 21:10:10 GMT";  
        window.location.reload();
    }
    
}

// Favourite Page
function favPage(){
    let favList = document.cookie;
    favList = favList.split(';');
    favList = favList[1].split('=');
    favList =  favList[1].split(',');
    let length = favList.length;
    document.getElementById('centered').style.display = 'block';
    
    for(let i=0; i<length; i++){
        if(favList[i] != ''){
            fetch("https://www.omdbapi.com/?apikey=17553897&i="+favList[i]).then(function (response) {
            return response.json();
            }).then(function (data) {
                let result = data;
                let design = '';
                design += '<div class="search-result-box">';
                design += '<img src="'+result.Poster+'">';
                design += '<h3>'+result.Title+'</h3>';
                design += '<input type="text" hidden id="remove_'+i+'" value="'+result.imdbID+'">';
                design += '<a class="btn m-10" onclick="removeFav('+i+')">Remove</a>';
                design += '<a href="movies.html?id='+result.imdbID+'" class="m-10 btn" target="_blank">Details</a></div>';
                document.getElementById('fav-result').innerHTML += design;
            }).catch(function (err) {
                console.warn('Something went wrong.', err);
            });
        }
    }

    document.getElementById('centered').style.display = 'none';
}