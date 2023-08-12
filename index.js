// Search Movie
let searchKey = [];
function searchMovie(){
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
    // let datalist = document.cookie;
    // if(datalist != ''){
    //     datalist = datalist.split(';');
    //     if(datalist[0]){
    //         datalist = datalist[0].split('=');
    //         datalist =  datalist[0].split(',');
    //         searchKey = datalist
    //         searchKey.push(key);
    //     }
    //     else{
    //         searchKey.push(key);
    //     }
    // }else{
    //     searchKey.push(key);
    // }
    searchKey.push(key);
    document.cookie = "searchKey="+searchKey;
}

// Suggestion
suggestion();
function suggestion(){
    // let suggest = document.cookie;
    // if(suggest != ''){
    //     suggest = suggest.split(';');
    //     if(suggest[0]){
    //         suggest = suggest[0].split('=');
    //         suggest =  suggest[0].split(',');
    //         let length = suggest.length;
    //         let suggestInput = '';
    //         for(let i=0; i<length; i++){
    //             suggestInput += '<option value"'+suggest[i]+'">'
    //         }
    //         document.getElementById('suggest').innerHTML = suggest;
    //     }
    // }
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


// Add To Favourite
function addFav(i){
    let movies = [];
    let fav = document.getElementById('fav_'+i).value;
    let favList = document.cookie;
    if(favList != ''){
        console.log('favList Exits -----');
        favList = favList.split(';');
        if(favList[1]){
            console.log('Movies Exits -----');
            favList = favList[1].split('=');
            console.log('FavList Split with equal to ------');
            console.log(favList);
            favList =  favList[1].split(',');
            console.log('FavList Split with comma ------');
            console.log(favList);
            movies = favList;
            console.log('Movies Assigned -----');
            console.log(movies);
            movies.push(fav);
            console.log('Movies Pushed -----');
            console.log(movies);
        }
        else{
            movies.push(fav);
            console.log('Movies Not Exits -----');
            console.log('Movies Assigned -----');
            console.log(movies);
        }
    }
    else{
        console.log('Cookie Not Exist -----');
        movies.push(fav);
        console.log('Movies Pushed -----');
        console.log(movies);
    }
    document.cookie = "movies="+movies;   
    document.getElementById('favbtn_'+i).innerHTML = 'Added To Fav';
    document.getElementById('favbtn_'+i).disabled = true;
}

// Remove Fav
function removeFav(i){
    let remove = document.getElementById('remove_'+i).value;
    let favList = document.cookie;
    favList = favList.split(';');
    favList = favList[1].split('=');
    favList =  favList[1].split(',');
    favList = delete favList[remove];
    document.cookie = "movies="+favList;   
    favPage();
}

// Fav Page
function favPage(){
    let favList = document.cookie;
    favList = favList.split(';');
    favList = favList[1].split('=');
    favList =  favList[1].split(',');
    let length = favList.length;
    if(favList[0] != ''){
        document.getElementById('centered').style.display = 'block';
        for(let i=0; i<length; i++){
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
        document.getElementById('centered').style.display = 'none';
    }
}