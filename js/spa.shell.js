spa.shell = (function(){
	'use strict';
	var configMap = {
		main_html:	'<div class="spa-shell-head">'
			          + '<div class="spa-shell-head-logo">'
			            + '<h1>SPA</h1>'
			            + '<p>javascript end to end</p>'
			          + '</div>'
			          + '<div class="spa-shell-head-acct"></div>'
			        + '</div>'
			        + '<div class="spa-shell-main">'
			          + '<div class="spa-shell-main-nav"></div>'
			          + '<div class="spa-shell-main-content"></div>'
			        + '</div>'
			        + '<div class="spa-shell-foot"></div>'
			        + '<div class="spa-shell-modal"></div>',
		chat_extend_time: 1000,
		chat_retract_time: 300,
		chat_extend_height: 450,
		chat_retract_height: 15,
		resize_interval : 200
	},
	stateMap = { // 将在整个模块中共享的动态信息放在stateMap中
					$container : null,
					is_chat_retracted : true,
					resize_idto : undefined
				},
	jqueryMap = {}, // 缓存jquery对象
	setJqueryMap,onHashchange, setChatAnchor,initModule,
	onResize,onTapAcct,onLogin,onLogout
	;

	setJqueryMap = function(){
		var $container=stateMap.$container;
		jqueryMap = {
			$container: $container,
			$acct      : $container.find('.spa-shell-head-acct'),
      		$nav       : $container.find('.spa-shell-main-nav')
		}
	}

	// toggleChat = function(do_extend,callback){ 
	// 	var
	// 		px_chat_ht = jqueryMap.$chat.height(),
	// 		is_open = px_chat_ht===configMap.chat_extend_height?true:false,
	// 		is_close = px_chat_ht===configMap.chat_retract_height?true:false,
	// 		is_sliding = !is_open&& !is_close;
	// 		if(is_sliding) return false;
	// 		if(do_extend){
	// 			jqueryMap.$chat.animate(
	// 				{height: configMap.chat_extend_height},
	// 				configMap.chat_extend_time,
	// 				function(){
	// 					stateMap.is_chat_retracted = false;
	// 					if(callback){ callback(jqueryMap.$chat);}
	// 				}
	// 			)
	// 			return true;
	// 		}
	// 		else{
	// 			jqueryMap.$chat.animate(
	// 				{height: configMap.chat_retract_height},
	// 				configMap.chat_retract_time,
	// 				function(){
	// 					stateMap.is_chat_retracted = true;
	// 					if(callback){ callback(jqueryMap.$chat);}
	// 				}
	// 			)
	// 			return true;
	// 		}
	// }

	// onClickChat= function (){ // 会有问题吧？
	// 	$.uriAnchor.setAnchor({chat:(stateMap.is_chat_retracted?"opened":"closed")});
	// 	return false;
	// }

	onHashchange= function(){
		var anchor_map_proposed;
		anchor_map_proposed=$.uriAnchor.makeAnchorMap();
		if(anchor_map_proposed.chat==="closed"||anchor_map_proposed.chat===""){
			spa.chat.setSliderPosition('closed');
		}
		else if(anchor_map_proposed.chat==="opened"){
			spa.chat.setSliderPosition('opened');
		}
		else if(anchor_map_proposed.chat==="hidden"){
			spa.chat.setSliderPosition('hidden');
		}
	}

	setChatAnchor = function(position_type){
		$.uriAnchor.setAnchor({chat:position_type});
	}

	onResize = function (){
	    if ( stateMap.resize_idto ){ return true; }

	    spa.chat.handleResize();
	    stateMap.resize_idto = setTimeout(
	      function (){ stateMap.resize_idto = undefined; },
	      configMap.resize_interval
	    );

	    return true;
	  };

	  onTapAcct = function ( event ) {
	    var acct_text, user_name, user = spa.model.people.get_user();
	    if ( user.get_is_anon() ) {
	      user_name = prompt( 'Please sign-in' );
	      spa.model.people.login( user_name );
	      jqueryMap.$acct.text( '... processing ...' );
	    }
	    else {
	     spa.model.people.logout();
	    }
	    return false;
	  };

	  onLogin = function ( event, login_user ) {
	    jqueryMap.$acct.text( login_user.name );
	  };

	  onLogout = function ( event, logout_user ) {
	    jqueryMap.$acct.text( 'Please sign-in' );
	  };


	initModule = function ($container){
		stateMap.$container=$container;
		$container.html(configMap.main_html);
		setJqueryMap();

		spa.chat.configModule( {
			set_chat_anchor : setChatAnchor

		} );
    	spa.chat.initModule( jqueryMap.$container );
		// jqueryMap.$chat.bind('click',onClickChat);
		$(window)
			.bind('resize',onResize)
			.bind('hashchange',onHashchange)
			.trigger('hashchange');


		$.gevent.subscribe( $container, 'spa-login',  onLogin  );
	    $.gevent.subscribe( $container, 'spa-logout', onLogout );

	    jqueryMap.$acct
	      .text( 'Please sign-in')
	      .bind( 'utap', onTapAcct );
	}


	return {initModule: initModule};
})();