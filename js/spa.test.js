var $t=$('<div/>');
$.gevent.subscribe($t,'spa-login',function(event,user){
	console.log('hello!',user.name)
});

$.gevent.subscribe($t,'spa-updatechat',function(event,chat_map){
	console.log('chat message: ',chat_map)
});

$.gevent.subscribe($t,'spa-setchatee',function(event,chatee_map){
	console.log('chatee change: ',chatee_map)
});

$.gevent.subscribe($t,'spa-listchange',function(event,changed_list){
	console.log('*listchange:',changed_list)
});

spa.model.people.login('Fanny');
spa.model.chat.send_msg('Hi Pebbles!');

spa.model.chat.set_chatee('id_03')
