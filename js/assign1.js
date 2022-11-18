function initMap() {
    
}

document.addEventListener("DOMContentLoaded", function() { 
    
    const countryData = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/countries.php';
    const cityData = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/cities.php';
    const pictureData = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/images.php';
    const languageData = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/languages.php';
    
    // begin with an empty array
    const countries = [];
    const cities = [];
    const pictures = [];
    const languages = [];
    const countryCities = [];
    
    // FETCH COUNTRY DATA FROM API 
    fetch(countryData)
        .then(response => response.json())
        .then(data => {
            countries.push(...data) 

            const galList = document.querySelector("#galleryList");
            const divB = document.querySelector('div.b section');
            const divA = document.querySelector('div.a section');
            const divC = document.querySelector('#country');

            // displays country list
            const countryList = document.querySelector('#countryList');
             for(c of countries){
                 const li = document.createElement('li');
                 li.innerHTML = c.name;
                 countryList.appendChild(li);
             }
        
            // now set up keyboard event handlers
            const searchBox = document.querySelector('.search');
            const suggestions = document.querySelector('#filterList');
           
            searchBox.addEventListener('keyup', displayCountryMatches);
            
            // Displays countries searched for
            function displayCountryMatches(){
                if(this.value.length >= 2){
                    const matches = findMatches(this.value, countries);
                    //clearCountryList();
                    
                    // remove options form list
                    document.querySelector('#countryFound').innerHTML = "";
                    
                    // Displays searched countries
                    matches.forEach(con => {
                        let option = document.createElement('option');
                        option.textContent = con.name + ', ' + con.iso;
                        
                        const li = document.createElement('li');
                        li.innerHTML = con.name + ', ' + con.iso;
                        document.querySelector('#countryFound').appendChild(li);
                    }); 
                }     
            }
        
            // uses filter and regular expression to create list of matching countries
            function findMatches(wordToMatch, countries){
                return countries.filter(obj => {
                    const regex = new RegExp(wordToMatch, 'gi');
                    return obj.name.match(regex);
                });
            }
            
            // Clears country search box 
            function clearCountryList() {
                let countryList = document.querySelector("#countryFound");
                if (countryList.getElementsByTagName('*').length > 0)
                {
                    let countryListElements = document.querySelectorAll('#countries li');

                    countryListElements.forEach( c => {
                        countryList.removeChild(c);
                    });
                }
            }

            // FETCH CITY DATA FROM API
            fetch(cityData)
            .then(response => response.json())
            .then(data => {
                cities.push(...data) 
                
                //Populate cities and country data by clicking on a country
                countryList.addEventListener('click',(e)=>{
                    
                    document.querySelector('div.h h3').innerHTML = 'Cities';
                    document.querySelector('#cityField').style.display = 'unset';
                    divC.style.display = 'block';
                    
                    if(e.target && e.target.nodeName == "LI"){ 
                        let con = countries.find(g => g.name == e.target.innerHTML);
            
                        deletePics();
                        cityInfo(con);
                        countryInfo(con);  
                        
                        
                        // displays images of country when clicked
                        deletePics();
                        displayPicsCountry(con.iso);                                                
                        
                        // hides previously clicked city info   
                        const city = document.querySelector('#city');  
                            if (city.getElementsByTagName('*').length > 0 ){
                                let uls = document.querySelectorAll('#city span')
                                for (let ul of uls)
                                    {
                                        city.style.display = 'none';
                                    }
                            } 
                        countryMap(con);
                    } 
                })
                
                //Populate cities data by clicking on city
                cityList.addEventListener('click',(e)=>{
                    if(e.target && e.target.nodeName == "LI"){ 
                        let cit = cities.find(g => g.name == e.target.innerHTML);
                        let city = 'city';
                        
                        // displays images of city when clicked
                        deletePics();
                        displayPicsCity(cit.name);                     
                        
                        // Dsiplays city and map data
                        cityData(cit); 
                        cityMap(cit);
                    } 
                })
                
                // Finds city pictures 
                function displayPicsCity(pic){
                    for(p of pictures){
                            if(p.location.city == pic){
                               let pic = p.filename;
                                let picTitle = p.title;
                                let img = document.createElement('img');
                                displayPics(pic, picTitle, img);
                                
                                document.querySelector('div.d picture').appendChild(img);
                            }
                        }
                } 
                
                // Finds country pictures
                function displayPicsCountry(pic){
                    for(p of pictures){
                            if(p.location.iso == pic){
                               let pic = p.filename;
                                let picTitle = p.title;
                                let img = document.createElement('img');
                                let source = document.createElement('source');
                                
                                // Dsiaplay mobile size images
                                mobilePic(pic, source);
                                //document.querySelector('div.d picture').appendChild(source);
                                
                                displayPics(pic, picTitle, img);
                                document.querySelector('div.d picture').appendChild(img);
                            }
                        }
                } 
                
                 // Picture details to display
                    function displayPics(gal, galTitle, img){ 
                            img.src = "https://storage.googleapis.com/test-pics1/square150/" + gal;
                            img.alt = galTitle;
                        };
                
                    function mobilePic(gal, source){
                        source.srcset = "https://storage.googleapis.com/test-pics1/square75/" + gal;
                        //source.media = "(min-width: 75px)";
                        
                    };
                
                // Populates city list from a country   
                function cityInfo(gal){
                    
                    let citySearch = []
                    for(c of cities){
                        if(gal.iso == c.iso){
                            citySearch.push(c) 

                        }
                }
                    //// Displays countries searched for
                    const searchBox = document.querySelector('.search2');
                    const suggestions = document.querySelector('#filterList2');
                  
                    searchBox.addEventListener('keyup', displayCityMatches);
                   
                    function displayCityMatches(con){
                    
                    // City search box    
                      let  citiesListed = document.querySelectorAll('div.h li')
                        if(this.value.length > 2){
                            let matches = findMatches(this.value, citySearch);

                            // remove options form list
                            suggestions.innerhtml = "";
                            document.querySelector('#cityFound').innerHTML = "";

                            matches.forEach(con => {
                                let option = document.createElement('option');
                                option.textContent = con.name + ', ' + con.iso;
                                //suggestions.appendChild(option);

                                const li = document.createElement('li');
                                li.innerHTML = con.name + ', ' + con.iso;
                                document.querySelector('#cityFound').appendChild(li);
                            }); 
                        }     
                    }
                    // uses filter and regular expression to create list of matching cities
                    function findMatches(wordToMatch, cities){
                        return cities.filter(obj => {
                            const regex = new RegExp(wordToMatch, 'gi');
                            return obj.name.match(regex);
                        });
                    }
                    
                    //array of cities
                    const countryCities = [];
                        // deletes cities from list
                        const cityList = document.querySelector('#cityList');  
                        if (cityList.getElementsByTagName('*').length > 0 ){
                            let uls = document.querySelectorAll('#cityList li')
                            for (let ul of uls)
                                {
                                    cityList.removeChild(ul);
                                }
                        }
                    
                        // adds cities to list;
                        for(c of cities){
                            if(gal.iso == c.iso){
                                const li = document.createElement('li');
                                li.innerHTML = c.name;
                                cityList.appendChild(li); 
                                countryCities.push(c.name)
                            }
                        }
                };
                
                // Big picture mode when clicked on img
                document.querySelector('div.d').addEventListener('click',(e)=>{
                    if(e.target && e.target.nodeName == "IMG"){
                        picMode();
                        
                        document.querySelector('div.a').style.display = 'unset';
                        
                        // removes previosully clicked img and info
                        let bigPic = document.querySelector('div.i img')
                        if(bigPic){
                                   document.querySelector('div.i').removeChild(bigPic); 
                        }
                        
                        let bigPicData = document.querySelector('#descriptionData div')
                        
                        if(bigPicData){
                                   document.querySelector('#descriptionData').removeChild(bigPicData);
                                   }
                        
        
                        // Displays big img of clicked img
                        for (p of pictures){
                            if(e.target.alt == p.title){
                                const img = document.createElement('img');
                                img.src = "https://storage.googleapis.com/test-pics1/medium800/" + p.filename;
                                
                                let source = document.createElement('sorce');
                                source.srcset = "https://storage.googleapis.com/test-pics1/medium640/" + p.filename;
                                source.media = "(min-width: 600px)";
                                
                                //document.querySelector('div.i').appendChild(source); 
  
                                document.querySelector('div.i').style.backgroundImage ="url(" + 'https://storage.googleapis.com/test-pics1/medium800/' + p.filename + ')';
                                document.querySelector('div.i').style.backgroundRepeat = 'no-repeat';
                    
                                pictureMap(p)
                                
                                // img description 
                                const div = document.createElement('div');
                                div.innerHTML = p.description;
                                document.querySelector('#descriptionData').appendChild(div);
                                
                                // Speaks picture title  
                                let titleName = document.querySelector('#speakButton');  
                                //let speakThis = titleName.innerHTML;
                                let speak = e.target.alt;
                                
                                // click of speech button
                                titleName.addEventListener('click', () => {
                                    e.stopPropagation;
                                    let value = document.querySelector('#speakButton');
                                    value.value = e.target.alt
                                    //speak(speakThis)
                                    let speakThis = new SpeechSynthesisUtterance(value.value);
                                    window.speechSynthesis.speak(speakThis);
                                    delete speakThis;
                                });
                                
                                imgDescription(p);
                            }                            
                        }
                    } 
                })
     
                // img description data 
                function imgDescription(gal){
                    const userName = gal.user.firstname + ' ' + gal.user.lastname;
                    const location = gal.location.city + ',' + gal.location.country;
                          
                    document.querySelector('#pictureName').innerHTML = gal.title;
                    document.querySelector('#userName').innerHTML = userName;
                    document.querySelector('#picLocation').innerHTML = location;
                    
                    if(gal.exif){
                        // button click info
                        document.querySelector('#picMake').innerHTML = gal.exif.make;
                        document.querySelector('#picModel').innerHTML = gal.exif.model;
                        document.querySelector('#exposureTime').innerHTML = gal.exif.exposure_time + " of a secound";
                        document.querySelector('#aperture').innerHTML = 'f/' + gal.exif.aperture;
                        document.querySelector('#focalLength').innerHTML = gal.exif.focal_length + 'mm';
                        document.querySelector('#iso').innerHTML = 'ISO ' + gal.exif.iso; 
                        
                        // hover box info
                        document.querySelector('#hoverMake').innerHTML = gal.exif.make;
                        document.querySelector('#hoverModel').innerHTML = gal.exif.model;
                        document.querySelector('#hoverExpTime').innerHTML = gal.exif.exposure_time + " of a secound";
                        document.querySelector('#hoverAperture').innerHTML = 'f/' + gal.exif.aperture;
                        document.querySelector('#hoverFocalLength').innerHTML = gal.exif.focal_length + 'mm'
                        document.querySelector('#hoverIso').innerHTML = 'ISO ' + gal.exif.iso; 
                    }
                    else{
                        document.querySelector('#picMake').innerHTML = 'N/A';
                        document.querySelector('#picModel').innerHTML = 'N/A';
                        document.querySelector('#exposureTime').innerHTML = 'N/A';
                        document.querySelector('#aperture').innerHTML = 'N/A';
                        document.querySelector('#focalLength').innerHTML = 'N/A';
                        document.querySelector('#iso').innerHTML = 'N/A'; 
                        
                        document.querySelector('#hoverMake').innerHTML = 'N/A';
                        document.querySelector('#hoverModel').innerHTML = 'N/A';
                        document.querySelector('#hoverExpTime').innerHTML = 'N/A';
                        document.querySelector('#hoverAperture').innerHTML = 'N/A';
                        document.querySelector('#hoverFocalLength').innerHTML = 'N/A';
                        document.querySelector('#hoverIso').innerHTML = 'N/A';
                    }
                    
                    if(gal.credit){
                        document.querySelector('#actual').innerHTML = gal.credit.actual;
                        document.querySelector('#creator').innerHTML = gal.credit.creator;
                        document.querySelector('#source').innerHTML = gal.credit.source;
                    }
                    else{
                        document.querySelector('#actual').innerHTML = 'N/A';
                        document.querySelector('#creator').innerHTML = 'N/A';
                        document.querySelector('#source').innerHTML = 'N/A';
                    }
                    
                    if(gal.colors){
                        for(i=0; i < gal.colors.length; i++){
                            let color = gal.colors[i];
                            let span = document.createElement('span');
                            span.innerHTML = color;
                            span.style.backgroundColor = color;
                            span.style.width = '100px';
                            document.querySelector('#hoverBox').appendChild(span)
                        }
                    }
                }

                // Country details to display
                function countryInfo(gal){
                    document.querySelector('#countryName').innerHTML = gal.name
                    document.querySelector("#countryDes").innerHTML = gal.description;
                    document.querySelector('#countryArea').innerHTML = gal.details.area.toLocaleString() + ' Km' + '<sup>2</sup>';                   
                    document.querySelector("#countryCapital").innerHTML = gal.capital.cityName;
                    document.querySelector("#countryPop").innerHTML = gal.details.population.toLocaleString();
                    document.querySelector("#countryCurr").innerHTML = gal.details.currency;
                    document.querySelector("#countryDomain").innerHTML = gal.details.domain; 
                    document.querySelector("#countryLangs").innerHTML = fullLang(gal.details.languages);
                    //document.querySelector("#countryNeighbors").innerHTML = gal.details.neighbours;
                    document.querySelector("#countryNeighbors").innerHTML = fullCont(gal.details.neighbours);
                } 
                
                // City details to display
                function cityData(gal){
                    // unhides city info
                    city.style.display = 'unset';
                    document.querySelector('#cityName').innerHTML = gal.name
                    document.querySelector("#cityPop").innerHTML = gal.population.toLocaleString();
                    document.querySelector('#cityElevation').innerHTML = gal.elevation + ' m'; 
                    document.querySelector("#cityTimezone").innerHTML = gal.timezone;
                    
                } 
                
                //Populates country map 
                // Code found at: https://staticmapmaker.com/google/
                function countryMap(gal){
                    let img = document.createElement('img');
                    img.src = 'https://maps.googleapis.com/maps/api/staticmap?autoscale=false&size=600x300&maptype=roadmap&key=AIzaSyADtzML8YMw9r2-bli-nkDn53uI5OsXYVI&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C' + gal.name;
                    document.querySelector('div.g').appendChild(img);
                }
                    
                //Populates city map 
                // marker code found at: https://developers.google.com/maps/documentation/maps-static/dev-guide#scale_values
                function cityMap(gal){
                    let img = document.createElement('img');
                    img.src = 'https://maps.googleapis.com/maps/api/staticmap?center='+ gal.name +',' + gal.iso + '&zoom=9&scale=1&size=500x250&markers=color:blue%7Clabel:S%7C' + gal.latitude + ',' + gal.longitude + '&maptype=roadmap&key=AIzaSyADtzML8YMw9r2-bli-nkDn53uI5OsXYVI&format=png&visual_refresh=true';
                    document.querySelector('div.g').appendChild(img); 
                } 
                
                //Populates picture map
                function pictureMap(gal){
                    let img = document.createElement('img');
                    img.src = 'https://maps.googleapis.com/maps/api/staticmap?center='+ gal.location.city +',' + gal.location.iso + '&zoom=9&scale=1&size=500x250&markers=color:blue%7Clabel:S%7C' + gal.location.latitude + ',' + gal.location.longitude + '&maptype=roadmap&key=AIzaSyADtzML8YMw9r2-bli-nkDn53uI5OsXYVI&format=png&visual_refresh=true';
                    
//                     let map = new google.maps.Map(document.querySelector('#mapData'), {
//                        center: {lat: gal.location.latitude, lng: gal.location.longitude},
//                        mapTypeId: 'roadmap ',
//                        zoom: 14
//                     })

                    document.querySelector('#mapData').appendChild(img); 

                } 
                
                
                // deletes cities from list
                function deletePics(){
                        const picList = document.querySelectorAll('img');  
                        if (picList.length >= 0){
                            for (let pic of picList)
                                {
                                    pic.remove('img');
                                }
                        }
                }; 
                
                
                //Displays big picture mode
                function picMode(){
                    
                    
                    // Hides all other content
                    document.querySelector('.b').style.display = 'none';
                    document.querySelector('.c').style.display = 'none';
                    document.querySelector('.d').style.display = 'none';
                    document.querySelector('.e').style.display = 'none';
                    document.querySelector('.f').style.display = 'none';
                    document.querySelector('.g').style.display = 'none';
                    document.querySelector('.h').style.display = 'none';
                    
                    // displays picture mode grid
                    document.querySelector('.i').style.display ='unset';
                    document.querySelector('.j').style.display ='unset';
                    
                    // Tab click events hide and unhide approperiate sections 
                    document.querySelector('#detailsTab').addEventListener('click',(e)=>{
                        document.querySelector('#descriptionData').style.display = 'none'
                        document.querySelector('#mapData').style.display = 'none'
                        document.querySelector('#detailData').style.display = 'unset';
                    })
                    
                    document.querySelector('#mapsTab').addEventListener('click',(e)=>{
                        document.querySelector('#descriptionData').style.display = 'none'
                        document.querySelector('#mapData').style.display = 'unset'
                        document.querySelector('#mapData').style.display = 'unset'
                        document.querySelector('#detailData').style.display = 'none';
                    }) 
                    
                    document.querySelector('#descriptionsTab').addEventListener('click',(e)=>{
                        document.querySelector('#descriptionData').style.display = 'unset'
                        document.querySelector('#mapData').style.display = 'none'
                        document.querySelector('#detailData').style.display = 'none';
                    })
                    
                    // Tab click events hide and unhide approperiate sections 
                    document.querySelector('#closeTab').addEventListener('click',(e)=>{
                        document.querySelector('.i').style.display ='none';
                        document.querySelector('.j').style.display ='none';
                        
                        document.querySelector('.b').style.display = 'unset';
                        document.querySelector('.c').style.display = 'unset';
                        document.querySelector('.d').style.display = 'unset';
                        document.querySelector('.e').style.display = 'unset';
                        document.querySelector('.f').style.display = 'unset';
                        document.querySelector('.g').style.display = 'unset';
                        document.querySelector('.h').style.display = 'unset';
                        
                    })
                }
                
                // Finds full language name
                function fullLang(lang){
                    lang = lang.split(',');
                    filteredLangs = [];
                    let output = '';
                    
                    for(l of lang){
                        let lg = l.substr(0, 2);
                        let langFound = languages.find(la => la.iso == lg);
                        if(langFound){                        
                            output += langFound.name + ', ';
                        }                     
                    }
                    return(output);
                }
                
                function fullCont(cont){
                    cont = cont.split(',');
                    let output = '';
                    
                    for(c of cont){
                        let ct = c.substr(0, 2);
                        let contFound = countries.find(la => la.iso == ct);
                        if(contFound){
                            output += contFound.name + ', ';
                        }                     
                    }
                    return(output);
                }

                // FETCH CITY DATA FROM API
                fetch(pictureData)
                .then(response => response.json())
                .then(data => {
                    pictures.push(...data)
                })
                .catch(error => console.error(error)) 
                
                // FETCH LANGUAGE DATA FROM API
                fetch(languageData)
                .then(response => response.json())
                .then(data => {
                    languages.push(...data)           
                })
                .catch(error => console.error(error))
            }) 
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
})