// Inicializaciones
$(document).ready(function(){
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown();
    M.updateTextFields();
    $('.materialboxed').materialbox();
    // Redondear y rellenar imagen de usuario
    $('.image_cover').each(function(){
		var imageWidth = $(this).find('img').width();
		var imageheight = $(this).find('img'). height();
		if(imageWidth > imageheight){
			$(this).addClass('landscape');
		}else{
			$(this).addClass('potrait');
		}
	});

});