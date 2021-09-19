//saved data
let synonymGroups;
if (JSON.parse(localStorage.getItem("synonym-groups"))) {
    synonymGroups = JSON.parse(localStorage.getItem("synonym-groups"))
} else {
    synonymGroups = []
}

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
    changeView($("#" + section))
    if (section === "inspiration") {
        generateRandomWord()
    }
    else if (section === "saved") {
        generateSavedSynonyms(synonymGroups)
    }
})

//inspiration
function generateRandomWord() {
    //api call that generates random word
    fetch("https://random-word-api.herokuapp.com/word")
        .then(res => res.json())
        .then(data => {
            //puts random word into html
            let word = data[0].charAt(0).toUpperCase() + data[0].slice(1)
            $("#randomWord").text(word)
        })
}
//listens to the new word button and generates new word when clicked
$("#newWordBtn").on("click", generateRandomWord)

//search
$("#searchBtn").on("click", function (event) {
    event.preventDefault()
    $("#saveForm").removeClass("hide").addClass("show")
    let word = $("#searchWord").val().toLowerCase()
    if (word === "") {
        //TODO add error message
        return;
    }
    generateSynonyms(word)
})

function generateSynonyms(word) {
    //TODO needs api key
    let query = "https://wordsapiv1.p.mashape.com/words/" + word + "/synonyms"
    fetch(query)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            $("#currentSearch").text(data.word)
            generateSynonyms(data.synonyms)
        })
}
function generateSynonyms(synonymsArr) {
    synonymsArr.map(function (syn) {
        $("#searchResults").append(`<li><label>${syn}</label> <input type=checkbox class="pure-input addSyn" value=${syn}></input></li>`)
    })
}
$("#saveBtn").on("click", function (event) {
    event.preventDefault();
    //create object of searched word and it's synonyms
    let synObj = {
        mainWord: $("#currentSearch").val(),
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
    //add searched word and its synonyms to the array of searches
    synonymGroups.push(synObj)
    //and store that list in local storage
    localStorage.setItem("synonym-groups", JSON.stringify(synonymGroups))
    //hide results
    $("#searchResults").empty();
    $("#saveForm").removeClass("show").addClass("hide");
})

//saved
function generateSavedSynonyms(synonymGroups) {
    $("#saved").empty()
    //loop over saved searches
    $.each(synonymGroups, function () {
        //and append a card for each one
        $("#saved").append(`<div><h3>${this.name}</h3><ul>${generateListItems(this.synonyms)}</ul></div>`)
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