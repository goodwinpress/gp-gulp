jQuery(document).ready(function($){
 
  // открываем поп-ап
   $('.open_modal').click(function() {  
    var popup_id = $('#' + $(this).attr("rel")); 
    var overlay = $(".modal-overlay");  
    var body = $(".body"); 
    $(popup_id).addClass("is-open");    
    $(overlay).addClass("is-open"); 
    $(body).addClass("disable-scroll");     
  });

  // закрываем поп-ап
  $('.modal-overlay, .modal-overlay__close').click(function() {  
    var body = $(".body"); 
    $('.modal-overlay, .modal').removeClass("is-open");  
    $(body).removeClass("disable-scroll");
  });

}); // конец

 
 
