$(document).ready(function(){
	var
		menuWrap = $('.header .menu_wrap')
	,	menuWrapWidth = $('.header .menu_wrap').width()
	,	isMenuOpened = false
	,	_window = $(window)
	,	skillsBlock = $('.skills_block')
	,	skillsFilter = $('.skills_filters', skillsBlock)
	,	skillsWrapperList = $('.skills_wrapper', skillsBlock)
	,	currWrapId = 0
	;

	menuWrap.css({left: -menuWrapWidth, top:0 + $('#wpadminbar').height()});
	$('header .switcher').on('click', function(){
		menuWrapWidth = $('.header .menu_wrap').width();
		if(!isMenuOpened){
			isMenuOpened = true;
			menuWrap.addClass('opened').css({left: 0});
		}else{
			isMenuOpened = false;
			menuWrap.removeClass('opened').css({left: -menuWrapWidth});
		}
	})

	$('.totopbtn').on('click', function(){
		$('html, body').stop().animate({'scrollTop':$('header').height()},900);
	})

	$('.extra-block-2').prepend('<div class="cover"></div>');

	_window.on("resize", function(){
		resizeFunction();
	})

	resizeFunction();
	function resizeFunction(){
		var
			newWidth = _window.width()
		,	marginHalf = _window.width()/-2;
		;
		$('.extra-block-2 .cover').css({width: newWidth, "margin-left": marginHalf, left:"50%"});
		$('.extra-block-6').css({width: newWidth, "margin-left": marginHalf, left:"50%"});
		$('.home .google-map').css({width: newWidth, "margin-left": marginHalf, left:"50%"});
		$('.google-map-api').css({width: newWidth, "margin-left": marginHalf, left:"50%"});

		menuWrap.css({top:0 + $('#wpadminbar').height()});
	}

	skillWrapSwitcher(currWrapId);
	function skillWrapSwitcher(ind){
		skillsWrapperList.each(function(index){
			if(index == ind){
				$(this).css({display: "block"});
				animItem(currWrapId);
			}else{
				$(this).css({display: "none"});
			}
		})
		$("li", skillsFilter).each(function(index){
			if(index == ind){
				$(this).addClass('active');
			}else{
				$(this).removeClass('active');
			}
		})
	}

	function animItem(ind){
		skillsWrapperList.each(function(index){
			if(index == ind){
				var currWrap = $(this);
				$(".skills-item", currWrap).each(function(index){
					$(".inner_wrap > .diagram",this).css({height:0}).stop().delay(index*50).animate({height:350}, 500);
					$(".inner_wrap > .desc",this).css({opacity:0}).stop().delay(index*50).animate({opacity: 1}, 500);
				})
			}
		})
	}
	$("li > a", skillsFilter).on("click", function(){
		if($(this).parent().index() != currWrapId){
			currWrapId = $(this).parent().index();
			skillWrapSwitcher(currWrapId);
		}
		return false;
	})
	/*$('.home .google-map').prepend('<span class="switcher"></span>');
	$('.home .google-map .switcher').toggle(
		function(){
			$('.home .google-map').height(655);
			$('.home .google-map').addClass('opened');
		},
		function(){
			$('.home .google-map').height(150);
			$('.home .google-map').removeClass('opened');
		}
	)*/
	
})

$(function() {
	var
		menuWrap = $('.header .menu_wrap')
	,	offsetArray = []
	,	offsetValueArray = []
	,	_document = $(document)
	,	currHash = ''
	,	isAnim = false
	,	isHomePage = $('body').hasClass('home')? true:false
	;
	
	//--------------------------- Menu navigation ---------------------------
	$('#topnav > li', menuWrap).each(function(){
		if($(this).hasClass('menu-item-type-custom')){
			var newUrl = $('header .logo a').attr('href');
			newUrl += $('>a', this).attr('href');
			if(!isHomePage){
				$('>a', this).attr({'href':newUrl});
			}
		}
	})
	$('.select-menu > option', menuWrap).each(function(){
		var optionVal = $(this).attr('value');
		if(optionVal.indexOf('#')!=-1){
			var newVal = optionVal.substring(optionVal.indexOf('#'), optionVal.length);
			var newUrl = $('header .logo_h').attr('href');
			newUrl += newVal;
			if(!isHomePage){
				$(this).attr('value', newUrl);
			}
		}
	})

	getPageOffset();
	function getPageOffset(){
		offsetArray = [];
		offsetValueArray = [];
		$('.hashAncor').each(function(){
			var _item = new Object();
			_item.hashVal = "#"+$(this).attr('id');
			_item.offsetVal = $(this).offset().top;
			offsetArray.push(_item);
			offsetValueArray.push(_item.offsetVal);
		})
	}

	function offsetListener(scrollTopValue, anim){
		if(isHomePage){
			scrolledValue = scrollTopValue;
			var nearIndex = 0;

			nearIndex = findNearIndex(offsetValueArray, scrolledValue)
			currHash = offsetArray[nearIndex].hashVal;

			if(window.location.hash != currHash){
				if(anim){
					isAnim = true;
					$('html, body').stop().animate({'scrollTop':scrolledValue}, 600, function(){
						isAnim = false;
						window.location.hash = currHash;
						$('html, body').stop().animate({'scrollTop':scrolledValue},0);
						return false;
					});
				}else{
					window.location.hash = currHash;
					$('html, body').stop().animate({'scrollTop':scrolledValue},0);
					return false;
				}
			}
		}
	}

	function findNearIndex(array, targetNumber){
		var
			currDelta
		,	nearDelta
		,	nearIndex = -1
		,	i = array.length
		;

		while (i--){
			currDelta = Math.abs( targetNumber - array[i] );
			if( nearIndex < 0 || currDelta < nearDelta )
				{
					nearIndex = i;
					nearDelta = currDelta;
				}
		}
		return nearIndex;
	}
	$(window).on('mousedown',function(){
		isAnim = true;
	})
	$(window).on('mouseup',function(){
		isAnim = false;
		offsetListener(_document.scrollTop(), false);
	})

	$(window).on('mousewheel',function(event, delta){
		offsetListener(_document.scrollTop(), false);
	})
	$(window).on('resize', function(){
		getPageOffset();
	})
	$('#topnav > li a[href^="#"]').on('click',function (e) {
		e.preventDefault();

		var target = this.hash,
		$target = $(target);


		offsetListener($target.offset().top, true);

		return false;
	});
	
	$(window).on('hashchange', function() {
		var
			target = window.location.hash ? window.location.hash : offsetArray[0].hashVal;
			$('.active-menu-item').removeClass('active-menu-item');
			$('#topnav > li a[href="' + target + '"]', menuWrap).parent().addClass('active-menu-item');
	}).trigger('hashchange');

})


$(window).load(function(){
	var msie8;
	($.browser.msie && $.browser.version == "8.0")? msie8 = true : msie8 = false;

	$('.tonextbtn').on("click", function(){
		$('#topnav > li').eq(1).find('a').click();
	})
});

function RandomOfRange(min, max, isRound) {
	var res;
	if (isRound) {
		res = Math.round(Math.random()*(max-min)+min);
	}else{
		res = Math.random()*(max-min)+min;
	}
	return res;
}



