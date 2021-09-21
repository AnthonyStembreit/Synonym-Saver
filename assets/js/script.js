//saved data
let synonymGroups;
if (JSON.parse(localStorage.getItem("synonym-groups"))) {
    synonymGroups = JSON.parse(localStorage.getItem("synonym-groups"))
} else {
    synonymGroups = []
}
generateRandomWord()
//navigation
function changeView(section) {
    //hides all section tags
    $("section").removeClass("show").addClass("hide")
    //shows chosen section
    section.removeClass("hide").addClass("show")
}
//listens to all nav links for a click event
$("#searchNav, #inspirationNav, #savedNav").on("click", function (event) {
    event.preventDefault()
    //grabs current section depending on which nav link was clicked
    var section = this.id.split("Nav")[0]
    //passes that section to the changeView function
  
    if (section === "saved") {
        generateSavedSynonyms(synonymGroups)
    }
    changeView($("#" + section))
})

//inspiration
function generateRandomWord() {
    //api call that generates random word
    fetch("https://random-word-api.herokuapp.com/word")
        .then(res => res.json())
        .then(data => {
            //puts random word into html
            let randomWord = data[0].charAt(0).toUpperCase() + data[0].slice(1)
            $("#randomWord").text(randomWord)
        })
}
//listens to the new word button and generates new word when clicked
$("#newWordBtn").on("click", generateRandomWord)

//search
$("#searchBtn").on("click", function (event) {
    event.preventDefault()
    //show the save form
    $("#saveForm").removeClass("hide").addClass("show")
    let word = $("#searchWord").val().toLowerCase()
    if (word === "") {
        //TODO add error message
        return;
    }
    //call api to generate synonyms
    synonymApiCall(word)
})

function synonymApiCall(word) {
    //TODO needs api key
    let query = "https://wordsapiv1.p.rapidapi.com/words/" + word + "/synonyms"
    fetch(query, {
        "method": "GET",
        "headers":{
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": "6ec0b03c88mshe0c69e744b0bc5ap16d52cjsnb06422c56cfb"
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            let searchedWord = data.word.charAt(0).toUpperCase() + data.word.slice(1)
            $("#currentSearch").text(searchedWord)
            generateSynonyms(data.synonyms)
        })
}
function generateSynonyms(synonymsArr) {
    //loops over synonyms returned from api call
    synonymsArr.map(function (syn) {
        //appends a check box input for each synonym to the html form
        $("#searchResults").append(`<li><label>${syn}</label> <input type=checkbox class="pure-input addSyn" value="${syn}"></input></li>`)
    })
}
$("#saveBtn").on("click", function (event) {
    event.preventDefault();
    console.log("hit")
    console.log($("#currentSearch").text())
    //create object of searched word and it's synonyms
    let synObj = {
        mainWord: $("#currentSearch").text(),
        synonyms: []
    }
    //loop over synonyms
    $.each($(".addSyn"), function () {
        //if the synonym was chosen to be saved
        if (this.checked === true) {
            //then add that synonym to the synonyms array in the synObj
            synObj.synonyms.push(this.value)
        }
    })
    console.log(synObj.synonyms)
    if(synObj.synonyms.length === 0){
        console.log("must choose to save some synonyms")
        return;
    }else{
        //add searched word and its synonyms to the array of searches
        synonymGroups.push(synObj)
        //and store that list in local storage
        localStorage.setItem("synonym-groups", JSON.stringify(synonymGroups))
        //hide results and form 
        $("#searchResults").empty();
        $("#saveForm").removeClass("show").addClass("hide");
    }
})

//saved
function generateSavedSynonyms(synonymGroups) {
    $("#saved").empty()
    //loop over saved searches
    $.each(synonymGroups, function () {
        //and append a card for each one
        console.log(this)
        $("#saved").append(`<div><h3>${this.mainWord}</h3><ul>${generateListItems(this.synonyms)}</ul></div>`)
    })
}
function generateListItems(synonymsArr) { 
    //and returns an array of li of the synonyms
    let mapped = synonymsArr.map(function (syn) {
        return `<li>${syn}</li>`
    })
    //returns the array of li joined without commas
    return mapped.join("")
}