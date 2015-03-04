$(function(){

  var deleteItemBtn = $(".js-delete-item"),
      userRegisterForm = $("form.register");
      userLoginForm = $("form.login");

  deleteItemBtn.on("click", deleteItem);
  userRegisterForm.on("submit", userRegister);
  userLoginForm.on("submit", userLogin);

  /**
   * 删除 movie item
   * @return {[type]} [description]
   */
  function deleteItem(){
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
  }

  /**
   * 用户注册
   * @param  {Event} event Event
   * @return {[type]}       [description]
   */
  function userRegister(event){
    event.preventDefault();
    $.ajax({
      url: "/api/user/register",
      type: "POST",
      data: $(this).serializeObject(),
      success:function(data){
        console.log(data);
      },
      error:function(data){
        console.log(data.responseText);
      }
    })
  }

  /**
   * 用户登录
   * @param  {Event} event Event
   * @return {[type]}       [description]
   */
  function userLogin(event){
    event.preventDefault();
    $.ajax({
      url: "/api/user/login",
      type: "POST",
      data: $(this).serializeObject(),
      success:function(data){
        console.log(data);
      },
      error:function(data){
        console.log(data.responseText);
      }
    })
  }
})
