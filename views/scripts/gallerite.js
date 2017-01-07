$(document).ready(function() {
	/* Click handler for the gallerite's image (small photo not zoomed in) */
	$("#explore-image").click(function() {
		// looks like using $(".original-image").width doesn't work because the image is hidden.
		if (document.getElementById('explore-image').naturalWidth < $(window).width() && document.getElementById('explore-image').naturalHeight < $(window).height()) {
			/* If the photos original dimensions are less than width and height of the window, zoomed0image div top and left propoerties are set so that the zoomed image would be centered both vertically and horzontally. */
			$(".zoomed-image").css({
				"top": "calc((100% - " + document.getElementById('explore-image').naturalHeight + "px)/2)",
				"left": "calc((100% - " + document.getElementById('explore-image').naturalWidth + "px)/2)",
			});
		/* If either the width or height of the image is larger than tose of the window: */
		} else if (document.getElementById('explore-image').naturalWidth > $(window).width() || document.getElementById('explore-image').naturalHeight > $(window).height())	{
			/* If the width of the image is larger than its height: */
			if (document.getElementById('explore-image').naturalWidth > document.getElementById('explore-image').naturalHeight) {
				/* The zoomed-image div is given a width of 100% to fit the image in the window and maje sure it doesn't overflow the window. */
				$(".zoomed-image").css({
					"top": "0",
					"left": "0",
					"width": "100%"
				});
				/* The original image is also given a 100% width or it will also overflow. */
				$(".original-image").css({
					"width": "100%"
				})
			/* If the height is larger than the width, the heights are set to 100% instead of width. */
			} else if (document.getElementById('explore-image').naturalWidth < document.getElementById('explore-image').naturalHeight) {
				$(".zoomed-image").css({
					"top": "0",
					"left": "0",
					"height": "100%",
					"width": "100%"
				});
				$(".original-image").css({
					"height": "100%"
				})		
			}
		}
		/* The layer div (for trasparent black background) and zoomed-image divs are faded in. */
		$(".layer").fadeIn();
		$(".zoomed-image").fadeIn();
		/* Body scrolling disabled. */
		$("body").addClass("stop-scrolling");
	})
	/* Click handler for zooed image. */
	$(".original-image").click(function() {
		/* layer and zoomed-image divs are faded out. */
		$(".layer").fadeOut();
		$(".zoomed-image").fadeOut();
		/* body scrolling is restored. */
		$("body").removeClass("stop-scrolling");
	})
	/* Handler for clicking like or unlike buttons: */
	$(".action").click(function() {
		/* The clicked gallerite serial number is saved (it is saved as an attribute of the button). */
		var gallerite = $(this).attr("gallerite");
		/* Clicked button is saved. */
		var clickedButton = $(this);
		/* The action associated with button (like/unlike) is extracted from the class of the button. */
		var action = $(this).attr("class").split(" ")[1].split("-")[0];
		/* ajax request initated to perform the required action. */
		$.ajax({
			url: "/action/" + gallerite,
			type: "POST",
			/* action here is a string: "like" or "unlike". Needed for server. */
			data: {action: action},
			statusCode: {
				200: action200(clickedButton, gallerite, action),
				404: action404
			}
		});
	});
	/* The gallerite delete button handler. */
	$(".gallerite-delete-button").click(function() {
		/* Asks the user to confirm deletion of the gallerite. */
		if (confirm("Are you sure you want to delete this gallerite?")) {
			/* The deleted gallerite is found using the attribute gallerite. */
			var deletedGallerite = $(this).siblings(".action");
			$.ajax({
				url: "/delete/" + deletedGallerite.attr("gallerite"),
				type: "POST",
				statusCode: {
					200: delete200(),
					404: action404
				}
			});
		}
	});
	/* Handler for menu button click. For smaller devices. */
	$("#expand-menu").click(function() {
		/* Adds class 'open' to drawer. */
		$("#drawer").toggleClass("open");
	});
});
/* Ran when a status 200 is received from the server after database is updated due to clicking like or unlike button. */
function action200(clickedButton, gallerite, action) {
	/* If the action was like: */
	if (action == "like") {
		/* The likes count displayed on the page is updated. */
		var countHtml = clickedButton.parent().siblings("#likes").children("span");
		countHtml.html(Number(countHtml.html()) + 1);
		/* The button's class is toggled. */
		clickedButton.switchClass("like-button", "unlike-button");
		/* Button's html is updated to reflect the new action. */
		clickedButton.html('<span class="fontawesome-thumbs-down"></span>Unlike');
		/* The user's info are added to the user's section (users who liked the gallerite). */
		$("#likers-list").append(
			'<a class="like-user" href="/user/' + user.id + '">' +
			'<img src="' + user._json.profile_image_url_https + '">' + 
			'<p>' + user._json.name + '</p></a>'
		);
	/* If the action was unlike */
	} else if (action == "unlike") {
		/* Likes count updated. */
		var countHtml = clickedButton.parent().siblings("#likes").children("span");
		countHtml.html(Number(countHtml.html()) - 1);
		/* Button's class and html updated. */
		clickedButton.switchClass("unlike-button", "like-button");
		clickedButton.html('<span class="fontawesome-thumbs-up"></span>Like');
		/* User removed from the likers list. */
		$(".like-user").each(function(match) {
			if ($(this).attr("href") == "/user/" + user.id) {
				$(this).remove();
			}
		})
	}
}
/* When a galeerite is successfully deleted. */
function delete200(deletedGallerite) {
	/* User is redirected to myGallerites page. */
	window.location.replace("/myGallerites");
}
/* If an erorr status received from the server, a message is alerted to the user. */
function action404() {
	alert("An error occured.")
}