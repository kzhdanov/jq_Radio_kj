(function (window, $, undefined) {
	$.Radio = function( options, element ) {
		this.$el = $( element );
		this._init( options );
	};

	$.Radio.defaults 	= {
		fallbackMessage	: 'HTML5 audio not supported',
		initialVolume	: 0.3,
		url : "http://eu3.radioboss.fm:8022/live",
		ws : "ws://92.61.68.163:8080",
	};

	$.Radio.prototype 	= {
		_init : function( options ) {
			var _self = this;
			this.options	= $.extend( true, {}, $.Radio.defaults, options );
			this.songs = '';
			this.$loader = this.$el.find( 'div.vc-loader' ).show();
			_self.$loader.hide();
			_self._createPlayer();
			_self._loadEvents();

      var ws = new WebSocket ($.Radio.defaults.ws);
		  		ws.onmessage = (function (message) {
		  var res = JSON.parse(message.data);

		      if(res.album != 'no name' && res.songName != 'no name')
		      	res.imgSrc = './RadioCovers/' + res.autor + '-' + res.album + '.jpg';
		      else
		      	res.imgSrc = './RadioCovers/Avance.jpg';

			  $('.js-group').text(res.autor);
			  $('.js-album').text(res.album);
			  $('.js-song').text(res.songName);
			  $('.js-image').attr('src', res.imgSrc);

			  var rating = new $.Rating();
				  rating._clean();
				  if (!window.Play) {
				  	rating.hoverOff();
				  } else {
					rating.hoverOn();
					rating.ratings.off('click');
					rating.ratings.click(rating.SetClick());
					rating.SetRating();
				  }
		    });
    	},

		_createPlayer	: function() {
			this.$audioEl	= $( '<audio id="audioElem"><span>' + this.options.fallbackMessage + '</span></audio>' );
			this.$el.prepend( this.$audioEl );
			this.audio	= this.$audioEl.get(0);
			this._createControls();
		},

		_createControls	: function() {
			var _self		= this;
			this.$controls 	= $( '<ul class="vc-controls" style="display:none;"/>' );
			this.$cPlay		= $( '<li class="vc-control-play">Play<span></span></li>' );
			this.$cStop		= $( '<li class="vc-control-stop">Stop<span></span></li>' );

			this.$controls.append( this.$cPlay ).append( $( '<li class="vc-control-empty"><span></span></li>' ) )
						  .append( this.$cStop )
						  .appendTo( this.$el );
			this.$volume 	= $( '<div style="display:none;" class="vc-volume-wrap"><div class="vc-volume-control"><div class="vc-volume-knob"></div></div></div> ').appendTo( this.$el );
			if (document.createElement('audio').canPlayType) {
				if (!document.createElement('audio').canPlayType('audio/mpeg') && !document.createElement('audio').canPlayType('audio/ogg')) {
					toastr.warning('wrong');
				}
				else {
					this.$controls.show();
					this.$volume.show();
					this.$volume.find( 'div.vc-volume-knob' ).knobKnob({
						snap : 10,
						value: 359 * this.options.initialVolume,
						turn : function( ratio ) {
							_self._changeVolume( ratio );
						}
					});
					this.audio.volume = this.options.initialVolume;

					var newWindow = new $.NewWindowPopUp();
				}
			}
		},

		_loadEvents	: function() {
			var _self = this;
			this.$cPlay.on( 'mousedown', function( event ) {
				_self._setButtonActive( $( this ) );
				_self._play();
			});
			this.$cStop.on( 'mousedown', function( event ) {
				_self._setButtonActive( $( this ) );
				_self._stop();
			});
		},

		_setButtonActive	: function( $button ) {
			$button.addClass( 'vc-control-pressed' );

			setTimeout( function() {
				$button.removeClass( 'vc-control-pressed' );
			}, 100 );
		},

		_prepare	: function( song ) {
			this._clear();
			this.$audioEl.attr( 'src', $.Radio.defaults.url );
		},

		_updateButtons : function( button ) {
			var pressedClass = 'vc-control-active';
			this.$cPlay.removeClass( pressedClass );
			this.$cStop.removeClass( pressedClass );
			switch( button ) {
				case 'play'		: this.$cPlay.addClass( pressedClass ); break;
			}
		},

		_changeVolume		: function( ratio ) {
			this.audio.volume = ratio;
		},

		_play	: function() {
			var _self	= this;
			this._updateButtons( 'play' );

				try {
					_self._prepare( _self.songs );
					$( this ).off( 'canplay' );
					_self.audio.currentTime = 0;
					_self.audio.play();
					var rating = new $.Rating();
					rating.SetRating();
					rating.SetClick();
					rating.hoverOn();
					window.Play = true;
					$('.songInfo').after().addClass('animating');
				} catch (e) {
					console.log(e);
				}

		},

		_stop	: function( buttons ) {
			var rating = new $.Rating();
			rating.hoverOff();
			if( !buttons ) {
				this._updateButtons( 'stop' );
			}
			this.audio.pause();
			$('.songInfo').after().removeClass('animating');
			this._clear();
		},

		_clear: function() {
			this.$audioEl.children( 'source' ).remove();
		},
	};

	$.NewWindowPopUp = function () {
		this._init();
	};
	$.NewWindowPopUp.prototype = {
		newWindowEl: $('.newWindow_link'),
		_init: function () {
			this.newWindowEl.click(function () {
				window.open('/window/new',"RadioAvance.ru",
					"width=480,height=260,scrollbars=no,status=yes")
			});
		},
	}

	$.Rating = function() {
		this._init();
	};
	$.Rating.prototype = {
		ratintDiv: $('.Rating'),
		ratings: $('.Rating li'),
		ratingTitle: $('.Rating__Title'),
		url: '/Rating/Save',
		key: 'i@#4rv98*oo#a12N$_RadioKey',

		_init: function () {
			this.setOpacity(true);
		},

		SetClick: function () {
			var _self = this,
					rndGuid = '';

			this.ratings.off('click');
			this.ratings.click(function() {
				_self.hoverOff();
				_self.ratings.off('click');
				try {
					var key = localStorage.getItem(_self.key);
					if ( !key ) {
						rndGuid = _self.randomGuid();
						localStorage.setItem(_self.key, rndGuid);
						_self.saveRating(_self.buildRating.call({shortGuid: rndGuid, ratings: _self.ratings }));
					} else {
						_self.saveRating(_self.buildRating.call({shortGuid: key, ratings: _self.ratings }));
					}
				} catch (e) {
					console.log(e);
				}
			});
		},

		SetRating: function () {
			var _self = this;
			if ( !localStorage.getItem(this.key) ) {
				_self._clean();
				_self.hoverOn();
			} else {
				$.ajax({
					method: "POST",
					async: true,
					url: '/Rating/Get',
					data: { user: localStorage.getItem(this.key),
									album: $.trim($('.js-album').text()),
									group: $.trim($('.js-group').text()),
								},
				}).done( function (res) {
					var i = 0;
					if ( Number( res.points ) !== 0) {
						for(;i<res.points;i+=1)	{
							_self.ratings[i].style.backgroundColor = '#333';
						}
						_self.hoverOff();
						_self.ratings.off('click');
					}
				}).fail(function(ex) {
					console.log('Oh, something went wrong...');
				});
			}
		},

		buildRating: function () {
			return {
				autor: $.trim($('.songInfo__group').text()),
				song: $.trim($('.songInfo__song').text()),
				album: $.trim($('.songInfo__album').text()),
				rate: [].slice.call(this.ratings).filter(function (i, e) {
					 			return i.style['background-color'] !== 'transparent'
							}).length,
				userTempId: this.shortGuid,
			}
		},

		saveRating: function ( obj ) {
			$.ajax({
				method: "POST",
				async: true,
				url: this.url,
				data: obj,
			}).fail(function(ex) {
				console.log('Oh, something went wrong...');
			});
		},

		randomGuid: function () {
			  return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function(c) {
			  var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	      return v.toString(16);
			});
		},

		_clean: function () {
				this.ratings.css({ backgroundColor: 'transparent' });
		},

		hoverOn: function () {
			this.ratings.mouseenter(function () {
				 var _self = $(this);
				 $('.Rating li').each(function (index, el) {
					if (el.id <= Number(_self.attr('id')))
						$(this).css({ backgroundColor: '#333' });
				});
			}).mouseleave(function () {
				 var _self = $(this);
				 $('.Rating li').each(function (index, el) {
					if (el.id <= Number(_self.attr('id')))
						$(this).css({ backgroundColor: 'transparent' });
				});
			 });
		},

		setOpacity: function(isTurn) {
			if (isTurn) {
				this.ratintDiv.css({ opacity: '.8' });
				this.ratingTitle.css({ opacity: '.5' });
			} else {
				this.ratintDiv.css({ opacity: '.3' });
				this.ratingTitle.css({ opacity: '.3' });
			}
		},

		hoverOff: function() {
			this.setOpacity(false);
			this.ratings.off("mouseenter mouseleave");
		},
	}

	var logError 	= function( message ) {
		toastr.error( message );
	};

	$.fn.radio	= function( options ) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			this.each(function() {
				var instance = $.data( this, 'cassette' );
				if ( !instance ) {
					logError( "cannot call methods on cassette prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for cassette instance" );
					return;
				}
				instance[ options ].apply( instance, args );
			});
		}
		else {
			this.each(function() {
				var instance = $.data( this, 'cassette' );
				if ( !instance ) {
					$.data( this, 'cassette', new $.Radio( options, this ) );
				}
			});
		}
		return this;
	};
} )( window, jQuery );
