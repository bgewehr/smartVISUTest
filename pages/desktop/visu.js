

// ----- browser and platform identification -----------------------------------------------------
var b = document.documentElement;
    b.setAttribute('data-useragent',  navigator.userAgent);
    b.setAttribute('data-platform', navigator.platform );
    b.className += ((!!('ontouchstart' in window) || !!('onmsgesturechange' in window))?' touch':'');

    
 // QLOCK screensaver
 // idleTimer() takes an optional argument that defines the idle timeout
 // timeout is in milliseconds; defaults to 30000
 $(document).on('pageinit', function() {
     if (jQuery().idleTimer && navigator.userAgent.match(/iPad/i) != null) {
         $.idleTimer(300 * 1000);
     }
 });

 $(document).bind('idle.idleTimer', function() {
     $.mobile.changePage("index.php?page=qlock");
 });

 $(document).bind('active.idleTimer', function() {
     parent.history.back();
 });
    

// ----- b a s i c 2 ------------------------------------------------------------
// ------Ergänzung von Bernd Gewehr--------------------------------------------

$(document).on('pagecreate', function(){

// ----- basic.pager ----------------------------------------------------------
$('div[data-widget="basic.pager"]').delegate('', {
	'update': function (event, response) {
		var prog = response[0].match(/prog[123]/g);
		$('#' + $(this).attr('data-val')).css("visibility", "hidden");
		$(this).attr('data-val', prog);
		$('#' + $(this).attr('data-val')).css("visibility", "visible");
	}
});


// ----- basic.httpcmd ----------------------------------------------------------
$('a[data-widget="basic.httpcmd"]').delegate('', {
	'click': function (event) {
		$.ajax($(this).attr('data-val'));
	}
});

// ----- basic.textrpl ----------------------------------------------------------
$('span[data-widget="basic.textrpl"]').delegate('', {
	'update': function (event, response) {
		var UTF8response=response[0].replace(/ÃÂ¼/g, "ü");
		UTF8response=UTF8response.replace(/ÃÂ¤/g, "ä");
		UTF8response=UTF8response.replace(/ÃÂ¶/g, "ö");
		UTF8response=UTF8response.replace(/Ã¢ÂÂ¬/g, "€");		
		$('#' + this.id).html(UTF8response);
	}
});


	// ----- basic.timecounter-----------------------------------------------------
$('span[data-widget="basic.timecounter"]').delegate('', {
	'init': function (event) {
	},
	'update': function (event, response) {
		$(this).html(ZeitAnzeigen($(this).attr('id'), $(this).attr('data'), response));
	}
});
	
	
	// ----- basic.textinput ------------------------------------------------------
$('input[data-widget="basic.textinput"]').delegate('', {
	'update': function (event, response) {
		// DEBUG: console.log("[basic.textinput] update '" + this.id + "':", response); 
		$(this).val(response);
	},

	'change': function (event) {
		// DEBUG: console.log("[basic.textinput] change '" + this.id + "':", $(this).val()); 
		io.write($(this).attr('data-item'), $(this).val());
	}
});

	// ----- basic.select_single -------------------------------------------------------
$('select[data-widget="basic.selectmenu"]').delegate('', {
	'update': function (event, response) {
		var prog = response[0].match(/prog[123]/g);
		$(this).val(prog).selectmenu('refresh');
		// DEBUG: console.log("[basic.selectmenu] update '" + this.id + "': aktuell: " +  $(this).attr('selected'), response); 
	},

	'change': function (event) {
		io.write($(this).attr('data-item'), $(this).val());
		// DEBUG: console.log("[basic.selectmenu] change '" + this.id + "':", $(this).prop('selected')); 
	}
});

	// ----- basic.img ----------------------------------------------------------
$('img[data-widget="basic.img"]').delegate('', {
	'update': function (event, response) {
	if ($('#' + this.id).attr('alt') == '') {
		$('#' + this.id).attr('src',response);
	}
	else {
		$('#' + this.id).attr('src',$('#' + this.id).attr('src') + response[0].match(new RegExp($('#' + this.id).attr('alt'),'gi')));
	}
	$('#' + this.id).attr('style',"visibility:'display'; width: 100px");	
		// DEBUG: console.log("[basic.img] '" + this.id + "'", response);console.log("[basic.img] '" + this.id + "'", response[0].match(/\d+\-\d\.jpg/gi));
	}
});

// ----- visu.lbutton ----------------------------------------------------------
$('[data-widget="basic.lbutton"]').delegate('', {
        'vmousedown': function(event) { // Short/Long Button
            event.preventDefault();
	    var items = widget.explode($(this).attr('data-item'));
            var obj = this;
            $(obj).attr('data-timer',
                setTimeout(function() {
                    $(obj).attr('data-long', true);
                    io.write(items[1], $(obj).attr('data-val'));
                }, 400)
            );
        },
        'vmouseup': function() { // Short/Long Button
            clearTimeout($(this).attr('data-timer'))
	    var items = widget.explode($(this).attr('data-item'));
            if ($(this).attr('data-long') == 'true') {
                $(this).attr('data-long', false);
            } else {
	        io.write(items[0], $(this).attr('data-val'));
            }
        },
        'click': function(event) {
        
	}
});

// ----- basic.lbutton ---------------------------------------------------------
$('a[data-widget="basic.lbutton"]').delegate('', {
	'click': function (event) {
		if ($(this).attr('data-val') != '') {
			io.write($(this).attr('data-item'), $(this).attr('data-val'));
		}
	}
});

    
// ----- basic.hider-----------------------------------------------------
$('div[data-widget="basic.hider"]').delegate('', {
	'init': function (event) {
	},
		
	'update': function (event, response) {
if (response == '') {
		$(this).html("");
//css("visibility", "hidden");
	}
}
});
	

// ----- basic.auth_switch ---------------------------------------------------------
// ---------------------------------------------------------------------------------

$('span[data-widget="basic.auth_switch"]').delegate('', {
	'update': function (event, response) {
		$('#' + this.id + ' img').attr('src', (response == $(this).attr('data-val-on') ? $(this).attr('data-pic-on') : $(this).attr('data-pic-off')));
	},
	'click': function (event) {
    
    		// öffnen des popups bei clicken des icons und ausführung der eingabefunktion
    		$('#' + this.id + '-popup').popup( "open" );
	}

});
});