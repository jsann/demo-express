$(function(){
  $(".js-delete-item").on("click", function(){
    var id = $(this).data("id");
    $.ajax({
      url: "/api/admin/items/delete?id=" + id,
      type: "DELETE",
      success: function(data){
        console.log(data)
      },
      error: function(data){
        console.log(data.responseText)
      }
    })
  })
})
