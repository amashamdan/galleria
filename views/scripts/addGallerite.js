$(document).ready(function() {
	/* Handler for clicking a gallerite type. */
	$(".type-header").click(function() {
		/* All other types' forms are collapsed. */
		$(this).parent().siblings("div").children("form").slideUp();
		/* The clicked type will slide down. */
		$(this).siblings("form").slideToggle();
	});
	/* Cancel button click handler. */
	$(".cancel").click(function(e) {
		/* Prevents submitting the form. */
		e.preventDefault();
		/* User redirected back to the homepage. */
		window.location.replace("/");
	});
	/* Handler for menu button click. For smaller devices. */
	$("#expand-menu").click(function() {
		/* Adds class 'open' to drawer. */
		$("#drawer").toggleClass("open");
	});
});
