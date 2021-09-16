//saved data
let synonymGroups;
if(JSON.parse(localStorage.getItem("synonym-groups"))){
    synonymGroups = JSON.parse(localStorage.getItem("synonym-groups"))
}else{
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
})

//inspiration
function generateRandomWord() {
    //api call that generates random word
    fetch("https://random-word-api.herokuapp.com/word")
        .then(res => res.json())
        .then(data => {
            //puts random word into html
            $("#randomWord").text(data[0])
        })
}
//listens to the new word button and generates new word when clicked
$("#newWordBtn").on("click", generateRandomWord)

//search
$("#searchBtn").on("click", function (event) {
    event.preventDefault()
    let word = $("#searchWord").val().toLowerCase()
    if(word === ""){
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
            generateListItems(data.synonyms)
        })
}
function generateListItems(synonymsArr) {
    synonymsArr.map(function (syn) {
        $("#searchResults").append(`<li><label>${syn}</labrl> <input type=checkbox class="pure-input addSyn" value=${syn}></input></li>`)
    })
}
$("#saveBtn").on("click", function(event){
    event.preventDefault();
   let synObj = {
        mainWord: $("#currentSearch").val(),
        synonyms: []
    }
  $.each( $(".addSyn"), function(){
       if(this.checked === true){
            synObj.synonyms.push(this.value)
       }
   })
   synonymGroups.push(synObj)
   localStorage.setItem("synonym-groups", JSON.stringify(synonymGroups))
})

//saved
function generateSavedSynonyms(synonymGroups){
    $.each(synonymGroups, function(syn){
        $("#saved").append(`<div><h3>${syn.name}</h3><ul id=${syn.name}></ul></div>`)
    })
}