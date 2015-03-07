$(function(){

  var movieListEnterTimeout;

  var movieList = $(".movie-list"),
      deleteItemBtn = $(".js-delete-item"),
      loginOutBtn = $(".login-out"),
      userRegisterForm = $("form.register"),
      userLoginForm = $("form.login"),
      adminLoginForm = $("form.admin-login"),
      moviePostForm = $(".movie-post");

  movieList.on("mouseenter", ".poster", movieListEnter);
  movieList.on("mouseleave", ".poster", movieListLeave);
  deleteItemBtn.on("click", deleteItem);
  loginOutBtn.on("click", loginOut);
  userRegisterForm.on("submit", userRegister);
  userLoginForm.on("submit", userLogin);
  adminLoginForm.on("submit", adminLogin);
  moviePostForm.on("submit", moviePost);

  function movieListEnter(){
    var li = $(this).parents("li"),
        detailModel = li.find(".detail-model"),
        loading = li.find(".time-loading");
    loading.find(".right").css({transition: "all 1s .2s", transform: "rotate(180deg)"});
    loading.find(".left").css({transition: "all 1s 1s", transform: "rotate(180deg)"});
    movieListEnterTimeout = setTimeout(function(){
      detailModel.fadeIn(200);
    }, 1800);
  }

  function movieListLeave(){
    clearTimeout(movieListEnterTimeout);
    var li = $(this).parents("li"),
        detailModel = li.find(".detail-model"),
        loading = li.find(".time-loading");
    loading.find(".right, .left").css({transition: "none", transform: "rotate(0)"});
    detailModel.fadeOut(200);
  }

  /**
   * 删除 movie item
   * @return {[type]} [description]
   */
  function deleteItem(){
    var id = $(this).data("id");
    $.ajax({
      url: "/api/admin/movie/delete?id=" + id,
      type: "DELETE",
      success: function(data){
        console.log(data);
      },
      error: function(data){
        console.log(data.responseText);
      }
    })
  }

  function loginOut(){
    $.ajax({
      url: "/api/user/loginout",
      type: "GET",
      success: function(data){
        if(data.result){
          window.location.reload();
        }
      },
      error: function(data){
        console.log(data.responseText);
      }
    });
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

  /**
   * 管理员登陆
   * @param  {Event} event Event
   * @return {[type]}       [description]
   */
  function adminLogin(event){
    event.preventDefault();
    $.ajax({
      url: "/api/admin/user/login",
      type: "POST",
      data: $(this).serializeObject(),
      success:function(data){
        if(data.result){
          window.location.href = "/admin";
        }
      },
      error:function(data){
        console.log(data.responseText);
      }
    });
  }

  function moviePost(event){
    event.preventDefault();
    $.ajax({
      url: "/api/admin/movie/set",
      type: "POST",
      data: $(this).serializeObject(),
      success:function(data){
        if(data.result){
          window.location.href = "/detail/#{data.data.id}";
        }
      },
      error:function(data){
        console.log(data.responseText);
      }
    });
  }
});
