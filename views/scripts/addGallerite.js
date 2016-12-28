$(document).ready(function() {
	$(".type-header").click(function() {
		$(this).parent().siblings("div").children("form").slideUp();
		$(this).siblings("form").slideToggle();
	});

	$(".cancel").click(function(e) {
		e.preventDefault();
		window.location.replace("/");
	});
});
