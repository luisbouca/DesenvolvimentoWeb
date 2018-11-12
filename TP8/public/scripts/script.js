$(()=>{

    ajaxGet('http://localhost:85/File/All',function (data) {
                
        var table = $("#files");
        table.empty();
        table.append(data); 
        //table.DataTable();
    })
    
    $("#add").click(function(e){
        e.preventDefault();
        
        console.log("data:");
        console.log(new FormData($("#form")[0]))
        ajaxPost(e =>{
                alert('AJAX ERRO:'+JSON.stringify(e));
                console.log("AJAX ERRO:"+JSON.stringify(e));
        });
        ajaxGet('http://localhost:85/File/All',function (data) {
                
            var table = $("#files");
            table.empty();
            table.append(data); 
        })
        $('#name').val("");
        $('#desc').val("");
        $('#ficheiro').val("");
    })

    $("#refresh").click(function(e){
        e.preventDefault();
        ajaxGet('http://localhost:85/File/All',function (data) {
                
            var table = $("#files");
            table.empty();
            table.append(data); 
        })
    });

    $("#clear").click(function(e){
        e.preventDefault();
        ajaxGet('http://localhost:85/File/All/Hide/',function (data) {
                
            var table = $("#files");
            table.empty();
            table.append(data); 
        })
    });

    $(document).on('click','#hide',function(){
        var indexRow = this.parentNode.parentNode.rowIndex -1 ;
        ajaxGet('http://localhost:85/File/Hide/'+indexRow,function (data) {
                
            var table = $("#files");
            table.empty();
            table.append(data); 
        })
    })

    $(document).on('click','#details',function(){
        var indexRow = this.parentNode.parentNode.rowIndex;        
        ajaxGet('http://localhost:85/File/'+(indexRow-1),function (data) {
                
            var table = $("#files");
            $(".killme").remove();
            if( indexRow >=$("#files tr").length){
                table.append(data);
            }else{
                $("#files tr").eq(indexRow).after(data);
            }
        })
    })

    function ajaxPost(error){
        $.ajax({
            type:"POST",
            processData: false,
            contentType: false,
            url: "http://localhost:85/File/Save",
            data: new FormData($("#form")[0]),
            success: success,
            error: error
        })
    }

    function ajaxGet(url,success){
 
        $.ajax({
            url: url,
            method: "GET",
            success: success
        });
    }
})