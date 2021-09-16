function changeView(section) {
    //hides all section tags
    $("section").removeClass("show").addClass("hide")
    //shows chosen section
    section.removeClass("hide").addClass("show")
}
//listens to all nav links for a click event
$("#searchNav, #inspirationNav, #savedNav").on("click", function(event){
    event.preventDefault()
    //grabs current section depending on which nav link was clicked
    var section =  this.id.split("Nav")[0]
    //passes that section to the changeView function
    changeView($("#" + section))
    if(section === "inspiration"){
        generateRandomWord()
    }
})

function generateRandomWord(){
    fetch("https://random-word-api.herokuapp.com/word")
    .then( res => res.json())
    .then( data => {
        console.log(data[0])
       $("#randomWord").text(data[0])
    })
}


