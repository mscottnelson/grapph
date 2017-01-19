jQuery(function($){
	'use strict';

	var frame = new Sly('#forcecentered', {
		horizontal: 1,
		itemNav: 'forceCentered',
		smart: 1,
		activateMiddle: 1,
		activateOn: 'click',
		mouseDragging: 1,
		touchDragging: 1,
		releaseSwing: 100,
		startAt: 0,
		scrollBar: $("#forcecentered").parent().find('.scrollbar'),
		scrollBy: 1,
		speed: 300,
		elasticBounds: 1,
		easing: 'easeOutExpo',
		dragHandle: 1,
		dynamicHandle: 1,
		clickBar: 1
	},{
		active: [
				function (e,f) {
					$(".manual-control").find("input").val(f+120);
					$(".manual-control").find("input").attr("value",f+120).trigger('input');
				}
		]
	}).init();

});
