$(()=>{
    $("p").click(function(){
        $( this ).css("color","red")
    })
    $("#hide").click(()=>{
        $("p").hide()
    })

    $("#show").click(()=>{
        $("p").show()
    })
})