$(".table #unfollow_user_btn").hide();

$(".table #follow_user_btn").click(function(){
    let fitem=$(this)
    let fid=$(this).attr('data-fid')
    let base_url=document.getElementById("base_url").value+'follow_unfollow'
    let uid=document.getElementById("user_id").value
    $.ajax({
        type: 'post',
        url: `${base_url}`,
        data:{
            user_id:uid,
            follow_user_id:fid,
            is_follow:1
        },
        contentType: "application/x-www-form-urlencoded",
        success: function (data) {
            console.log(typeof(data))
            if(data.statusCode==200){
                Toastify({
                    text:"Followed Successfully",
                    className: "success",
                    style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast(); 
                fitem.toggle();
                window.location.reload()
                //$(`button[data-uid='${fid}']`).toggle();
            }else{
                Toastify({
                    text:"Something wrong!Try again",
                    className: "error",
                    style: {
                    background: "red",
                    }
                }).showToast();
            }
        }
    });
    
})

$(".table #unfollow_user_btn").click(function(){
    let uitem=$(this)
    let ufid=$(this).attr('data-uid')
    let base_url=document.getElementById("base_url").value+'follow_unfollow'
    let uid=document.getElementById("user_id").value
    $.ajax({
        type: 'post',
        url: `${base_url}`,
        data:{
            user_id:uid,
            follow_user_id:ufid,
            is_follow:0
        },
        contentType: "application/x-www-form-urlencoded",
        success: function (data) {
            if(data.statusCode==200){
                Toastify({
                    text:"UnFollowed Successfully",
                    className: "success",
                    style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast(); 
                uitem.toggle();
                window.location.reload()
                //$(`button[data-fid='${ufid}']`).toggle();
            }else{
                Toastify({
                    text:"Something wrong!Try again",
                    className: "error",
                    style: {
                    background: "red",
                    }
                }).showToast();
            }
        }
    });
   
})





