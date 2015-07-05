'use strict';

var app = (function(document, $) {
	var docElem = document.documentElement,
		_userAgentInit = function() {
			docElem.setAttribute('data-useragent', navigator.userAgent);
		},
		_init = function() {
			$(document).foundation();
            // needed to use joyride
            // doc: http://foundation.zurb.com/docs/components/joyride.html
            $(document).on('click', '#start-jr', function () {
                $(document).foundation('joyride', 'start');
            });
			_userAgentInit();
			_readyToRun();
		},
		_faceNavigation = function(){
			app.faceNavigationVars = {
				'last_x':undefined,
				'last_y':undefined,
				'selected_index':0,
				'action_pending':false,
			}
			var videoInput = document.createElement('video');
			var canvasInput = document.createElement('canvas');

			var htracker = new headtrackr.Tracker();
			htracker.init(videoInput, canvasInput);
			htracker.start();

			setInterval( function reset_faceNavigationVars(){
				app.faceNavigationVars.x = undefined;
				app.faceNavigationVars.y = undefined;
			} , 1000 );
			document.addEventListener('facetrackingEvent',function( fc ){

				var dfcx, dfcy;
				if( app.faceNavigationVars.x === undefined ){
					app.faceNavigationVars.x = fc.x;
					app.faceNavigationVars.y = fc.y;
				}
				dfcx = app.faceNavigationVars.x - fc.x;
				dfcy = app.faceNavigationVars.y - fc.y;

				if( dfcy >= 3 ){
					app.faceNavigationVars.y = fc.y;
					if( app.faceNavigationVars.action_pending ){
						$('.nav-bar li').eq(app.faceNavigationVars.selected_index).find('a')[0].click();
						console.log('clickeado')
						app.faceNavigationVars.action_pending = false;
					}else{
						$('.nav-bar').addClass('nav-bar__active');
					}
					// return;
				}else if( dfcy <= -2 ){
					app.faceNavigationVars.y = fc.y;
					$('.nav-bar').removeClass('nav-bar__active');
					app.faceNavigationVars.action_pending = true;
					setTimeout( function reset_action_pending(){
						app.faceNavigationVars.action_pending = false;
					},2000);
					// return;
				}

				if( dfcx >= 2 ){
					app.faceNavigationVars.x = fc.x;
					app.faceNavigationVars.selected_index = Math.min( app.faceNavigationVars.selected_index + 1 , $('.nav-bar li').length - 1 );
					$('.nav-bar li').removeClass('option__active');
					$('.nav-bar li').eq(app.faceNavigationVars.selected_index).addClass('option__active');
					dfcx = app.faceNavigationVars.x - fc.x;
					dfcy = app.faceNavigationVars.y - fc.y;
					// return;
				}else if( dfcx <= -2 ){
					app.faceNavigationVars.x = fc.x;
					app.faceNavigationVars.selected_index = Math.max( app.faceNavigationVars.selected_index - 1 , 0 );
					$('.nav-bar li').removeClass('option__active');
					$('.nav-bar li').eq(app.faceNavigationVars.selected_index).addClass('option__active');
					dfcx = app.faceNavigationVars.x - fc.x;
					dfcy = app.faceNavigationVars.y - fc.y;
					// return;
				}
			})
		},
		_readyToRun = function(){
			$(document).on('ready' , function(){
				app.faceNavigation();
			});
		};
	return {
		init: _init,
		readyToRun: _readyToRun,
		faceNavigation: _faceNavigation,
	};
})(document, jQuery);

(function() {
	app.init();
})();
