$(document).ready(function() {
 
 $(".nav a").click(function(e) {
  e.preventDefault();
  
  $(".nav a").removeClass("selected");
  $(this).addClass("selected");
  });
  
});