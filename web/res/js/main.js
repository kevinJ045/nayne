$(document).ready(function(){
    $("#sidebar .toggle").click(function(){
        $("#sidebar").toggleClass('active');
    });

    $("#search").click(function(){
      $("#main-window").addClass('inactive');
      $("#search-window").addClass('active');
      $("#search-input").focus();
    });

    $(".overlay").click(function(){
      $("#main-window").removeClass('inactive');
      $("#search-window").removeClass('active');
    });

    
});
