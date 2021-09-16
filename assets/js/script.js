function changeView(section) {
    $("section").removeClass("show").addClass("hide")
    section.removeClass("hide").addClass("show")
}
$("#searchNav, #inspirationNav, #savedNav").on("click", function(event){
    event.preventDefault()
    var section = $("#" + this.id.split("Nav")[0])
    changeView(section)
})