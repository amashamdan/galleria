$(document).ready(function() {

	/* If there are more than bricklayer divs on page, cannot select them all at once, so the each function creates a Bricklayer instance for each div seperately. code was originally:
	var bricklayer = new Bricklayer(document.querySelector('.bricklayer'))
	*/
	$(".bricklayer").each(function() {
		var bricklayer = new Bricklayer(this)
	})
		

	$(".action").click(function() {
		var gallerite = $(this).attr("gallerite");
		var likesToIncrement = $(this).siblings("p").children(".no-of-likes");
		var action = $(this).attr("class").split(" ")[1].split("-")[0];
		$.ajax({
			url: "/action/" + gallerite,
			type: "POST",
			data: {action: action},
			statusCode: {
				200: action200(likesToIncrement, gallerite, action),
				404: action404
			}
		});
	});

	$(".delete-button").click(function() {
		if (confirm("Are you sure you want to delete this gallerite?")) {
			var deletedGallerite = $(this).parent();
			$.ajax({
				url: "/delete/" + $(this).attr("gallerite"),
				type: "POST",
				statusCode: {
					200: delete200(deletedGallerite),
					404: action404
				}
			});
		}
	})
});

function action200(likesToIncrement, gallerite, action) {
	if (action == "like") {
		likesToIncrement.html(Number(likesToIncrement.html()) + 1);
		likesToIncrement.parent().siblings("button").switchClass("like-button", "unlike-button");
		likesToIncrement.parent().siblings("button").html('<span class="fontawesome-thumbs-down"></span>Unlike');
	} else if (action == "unlike") {
		likesToIncrement.html(Number(likesToIncrement.html()) - 1);
		likesToIncrement.parent().siblings("button").switchClass("unlike-button", "like-button");
		likesToIncrement.parent().siblings("button").html('<span class="fontawesome-thumbs-up"></span>Like');
	}
}

function delete200(deletedGallerite) {
	deletedGallerite.remove();
}

function action404() {
	alert("An error occured.")
}