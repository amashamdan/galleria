$(document).ready(function() {
	$("#explore-image").click(function() {
		// lloks like using $(".original-image").width doesn't work because the image is hidden
		if (document.getElementById('explore-image').naturalWidth < $(window).width() && $(".original-image").height() < document.getElementById('explore-image').naturalHeight) {
			$(".zoomed-image").css({
				"top": "calc((100% - " + document.getElementById('explore-image').naturalHeight + "px)/2)",
				"left": "calc((100% - " + document.getElementById('explore-image').naturalWidth + "px)/2)",
			});
		} else if (document.getElementById('explore-image').naturalWidth > $(window).width() || document.getElementById('explore-image').naturalHeight > $(window).height())	{

			if (document.getElementById('explore-image').naturalWidth > document.getElementById('explore-image').naturalHeight) {
				$(".zoomed-image").css({
					"top": "0",
					"left": "0",
					"width": "100%"
				});
				$(".original-image").css({
					"width": "100%"
				})
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
		$(".layer").fadeIn();
		$(".zoomed-image").fadeIn();
		$("body").addClass("stop-scrolling");
	})

	$(".original-image").click(function() {
		$(".layer").fadeOut();
		$(".zoomed-image").fadeOut();
		$("body").removeClass("stop-scrolling");
	})


	$(".action").click(function() {
		var gallerite = $(this).attr("gallerite");
		var clickedButton = $(this);
		var action = $(this).attr("class").split(" ")[1].split("-")[0];
		$.ajax({
			url: "/action/" + gallerite,
			type: "POST",
			data: {action: action},
			statusCode: {
				200: action200(clickedButton, gallerite, action),
				404: action404
			}
		});
	});

	$(".gallerite-delete-button").click(function() {
		if (confirm("Are you sure you want to delete this gallerite?")) {
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
	})
});


function action200(clickedButton, gallerite, action) {
	if (action == "like") {
		var countHtml = clickedButton.parent().siblings("#likes").children("span");
		countHtml.html(Number(countHtml.html()) + 1);
		clickedButton.switchClass("like-button", "unlike-button");
		clickedButton.html('<span class="fontawesome-thumbs-down"></span>Unlike');
		$("#likers-list").append(
			'<a class="like-user" href="/user/' + user.id + '">' +
			'<img src="' + user._json.profile_image_url_https + '">' + 
			'<p>' + user._json.name + '</p></a>'
		);

	} else if (action == "unlike") {
		var countHtml = clickedButton.parent().siblings("#likes").children("span");
		countHtml.html(Number(countHtml.html()) - 1);
		clickedButton.switchClass("unlike-button", "like-button");
		clickedButton.html('<span class="fontawesome-thumbs-up"></span>Like');

		$(".like-user").each(function(match) {
			if ($(this).attr("href") == "/user/" + user.id) {
				$(this).remove();
			}
		})
	}
}

function delete200(deletedGallerite) {
	window.location.replace("/myGallerites");
}

function action404() {
	alert("An error occured.")
}