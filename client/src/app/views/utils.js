// Inicializaciones
$(function(){
    /*
	    $(".dropdown-trigger").dropdown();
	    M.updateTextFields();
	    $('.materialboxed').materialbox();
    */
    M.AutoInit();

    // Redondear y rellenar imagen de usuario
    roundImage();
});

function roundImage(){
	$('.image_cover').each(function(){
		var imageWidth = $(this).find('img').width();
		var imageHeight = $(this).find('img'). height();
		if(imageWidth > imageHeight){
			$(this).addClass('landscape');
		}else{
			$(this).addClass('potrait');
		}
	});
}
