window.onload=function(){
    function ajaxGet(){
         $.ajax({
           url:'/api/index/list',
		      type:'POST',
             //url:'/build/mock/list.json',
             success:function(res){
               console.log(res);
                //  $(".app").html()
             }
         })
    }
    ajaxGet();

    document.querySelector("#myTel").addEventListener('click',function(){
            ant.chooseContact({
                 "title":'choose contacts',
                 "multiMax":2,
                 "multiMaxText":'max!',
            },function(result){
                  alert(JSON.stringify(result))
            })
    });

document.querySelector("#myNew").addEventListener('click',function(){
        alert("即将跳转到新的页面");
             ant.pushWindow({
                  url:'./subIndex.html'
       });
     })

}
