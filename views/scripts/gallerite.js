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
});