(function (window, $, undefined) {
	$.Radio = function( options, element ) {
		this.$el = $( element );
		this._init( options );
	};

	$.Radio.defaults 	= {
		fallbackMessage	: 'HTML5 audio not supported',
		initialVolume	: 0.3,
		url : "http://eu3.radioboss.fm:8013/live",
	};

	$.Radio.prototype 	= {
		_init	: function( options ) {
			var _self = this;
			this.options	= $.extend( true, {}, $.Radio.defaults, options );
			this.songs = '';
			this.$loader = this.$el.find( 'div.vc-loader' ).show();

			$.when( this._createPlay() ).done( function() {
				_self.$loader.hide();
				_self._createPlayer();
				_self.sound = new $.Sound();
				_self._loadEvents();
      });
    },

    _createPlay: function () {
		var _self = this;
    	var song = new $.Song();
			$.when( song.loadMetadata() ).done( function( song ) {
					_self.songs = song;
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
					var ajax = new $.Ajaxes();
					ajax.setTitleInterval(5000);
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
			//$.when( this.sound.play( 'click' ) ).done( function() {
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
			//});
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

	$.Ajaxes = function	() {};
	$.Ajaxes.prototype = {
		url: '/',
		intervalId: 0,
		urlImg: '/Images/GetCurrentImgUrl',

		setTitleInterval: function(interval) {
			this.setTitleAjax();
			var _self = this;
			setTimeout(function() {
				if($('.js-group').text() !== '') {
					intervalId = setInterval(_self.setTitleAjax.bind(_self), interval);
				} else {
					console.log('No available strim');
				}
			}, 20000);
		},

		setTitleAjax : function() {
			var _self = this;
			$.ajax({
				method: "POST",
				async: true,
				cache: false,
				crossDomain: false,
				url: this.url,
			}).done(function(data) {
				if(data) {
					if(data.type !== 'error') {
						if( data.autor !== $.trim($('.js-group').text()) ||
								data.songName !== $.trim($('.js-song').text()) ||
								data.album !== $.trim($('.js-album').text()))
						{
							_self.setImage(data);
							$('.js-group').empty().text(data.autor);
							$('.js-song').empty().text(data.songName);
							$('.js-album').empty().text(data.album);

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
						}
					} else {
						toastr.error("Oh, something went wrong... Can't connect to stream.");
						if (this.intervalId !== 0)
							clearInterval(this.intervalId);
					}
				} else
					toastr.error('Oh, something went wrong...');
			}).fail(function(ex) {
				toastr.error('Oh, something went wrong...');
			});
		},

		setImage: function (data) {
			var img = new Image();
			img.src = './RadioCovers/' + data.autor + '-' + data.album + '.jpg';
			img.onload = function(){
				$('.vc-tape-wrapper img').attr('src', img.src)
			};
			img.onerror = function(){
				$('.vc-tape-wrapper img').attr('src', "./RadioCovers/Avance.jpg")
			};
		}
	};

	$.Song = function() {};
	$.Song.prototype 	= {
		loadMetadata	: function() {
			var _self = this;
			var $tmpAudio 	= $( '<audio/>' );
			$tmpAudio.attr('preload', 'auto');
			$tmpAudio.attr( 'src', 'sounds/click.mp3' );
			$tmpAudio.on( 'loadedmetadata', function( event ) {
				_self.duration = $tmpAudio.get(0).duration;
			});
		}
	};

	$.Sound	= function() {
		this._init();
	};
	$.Sound.prototype		= {
		_init	: function() {
			this.$audio	= $( '<audio/>' ).attr( 'preload', 'auto' );
		},
		getSource	: function( type ) {
			return 'sounds/' + this.action + '.' + type;
		},
		play : function( action, loop ) {
			var _self = this;
				  _self.action = action;
		  var soundsrc = _self.getSource( 'mp3' );
			_self.$audio.attr( 'src', soundsrc );
			if( loop ) {
				_self.$audio.attr( 'loop', loop );
			}
			else {
				_self.$audio.removeAttr( 'loop' );
			}
			_self.$audio.on( 'canplay', function( event ) {
				$( this ).get(0).play();
			});
		}
	};

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
