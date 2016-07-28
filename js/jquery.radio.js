(function (window, $, undefined) {
	$.Radio = function( options, element ) {
		this.$el = $( element );
		this._init( options );
	};

	$.Radio.defaults 	= {
		fallbackMessage	: 'HTML5 audio not supported',
		initialVolume	: 0.3,
		url : "http://178.236.141.243:8000/live",
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
			$.when( this.sound.play( 'click' ) ).done( function() {
				try {
					_self._prepare( _self.songs );
					$( this ).off( 'canplay' );
					_self.audio.currentTime = 0;
					_self.audio.play();
				} catch (e) {
					console.log(e);
				}
			});
		},

		_stop	: function( buttons ) {
			if( !buttons ) {
				this._updateButtons( 'stop' );
				this.sound.play( 'click' );
			}
			this.audio.pause();
			this._clearSrc();
		},

		_clear: function() {
			this.$audioEl.children( 'source' ).remove();
		},

		_clearSrc: function() {
			this.audio.src = "";
		},
	};

	$.Ajaxes = function	() {
	};
	$.Ajaxes.prototype = {
		url: 'http://192.168.1.5:10001/',
		intervalId: 0,

		setTitleInterval: function(interval) {
			this.setTitleAjax();
			intervalId = setInterval(this.setTitleAjax.bind(this), interval);
		},

		setTitleAjax : function() {
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
							$('.js-group').empty().text(data.autor);
							$('.js-song').empty().text(data.songName);
							$('.js-album').empty().text(data.album);
						}
					} else {
						toastr.error("Oh, something went wrong... Can't connect to stream.");
						clearInterval(intervalId);
					}
				} else
					toastr.error('Oh, something went wrong...');
			});
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
