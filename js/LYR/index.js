$(function() {
	layui.use('element', function() {
		let element = layui.element;
		$('.menu').on('click', function() {
			let ht = $(this).html();
			$(".tabChange").html(ht);
		});
	});
})