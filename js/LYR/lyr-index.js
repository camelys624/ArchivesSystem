$(function() {
	layui.use('element', function() {
		var element = layui.element;
		$('.menu').on('click', function() {
			var ht = $(this).html();
			$(".tabChange").html(ht);
		});
	});
})