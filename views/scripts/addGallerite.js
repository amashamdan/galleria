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
});
