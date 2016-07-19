// Init App
var myApp = new Framework7({
    modalTitle: 'Framework7',
    // Enable Material theme
    material: true,
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {
});
// Add another view, which is in right panel
var rightView = myApp.addView('.view-right', {
});

// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function (e) {
    myApp.hideIndicator();
});

/* ===== Sortable page ===== */
myApp.onPageInit('sortable-list', function (page) {
    // Sortable toggler
    $$('.list-block.sortable').on('open', function () {
        $$('.toggle-sortable').text('Done');
    });
    $$('.list-block.sortable').on('close', function () {
        $$('.toggle-sortable').text('Edit');
    });
});

/* ===== Notifications Page ===== */
myApp.onPageInit('notifications', function (page) {
    $$('.ks-notification-1').on('click', function () {
        myApp.addNotification({
            message: 'Simple message'
        });
    });
    $$('.ks-notification-2').on('click', function () {
        myApp.addNotification({
            message: 'Multi-line message. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in magna nisi.',
        });
    });
    $$('.ks-notification-3').on('click', function () {
        myApp.addNotification({
            message: 'Nice yellow button',
            button: {
                text: 'Click me',
                color: 'yellow'
            }
        });
    });
    $$('.ks-notification-4').on('click', function () {
        myApp.addNotification({
            message: 'Close me to see Alert',
            button: {
                text: 'Close',
                color: 'lightgreen'
            },
            onClose: function () {
                myApp.alert('Notification closed');
            }
        });
    });
});
/* ======= Cookies ======= */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

/* ===== Color themes ===== */
var classList = $$('body')[0].classList;
for (var i = 0; i < classList.length; i++) {
	if (classList[i].indexOf('theme') === 0) classList.remove(classList[i]);
	if (classList[i].indexOf('layout-') === 0) classList.remove(classList[i]);
}
classList.add('theme-' + getCookie('theme-main'));
classList.add('layout-' + getCookie('theme-secondary'));

myApp.onPageInit('color-themes', function (page) {
    $$(page.container).find('.ks-color-theme').click(function () {
        var classList = $$('body')[0].classList;
        for (var i = 0; i < classList.length; i++) {
            if (classList[i].indexOf('theme') === 0) classList.remove(classList[i]);
        }
        classList.add('theme-' + $$(this).attr('data-theme'));
		setCookie("theme-main",$$(this).attr('data-theme'),365);
    });
    $$(page.container).find('.ks-layout-theme').click(function () {
        var classList = $$('body')[0].classList;
        for (var i = 0; i < classList.length; i++) {
            if (classList[i].indexOf('layout-') === 0) classList.remove(classList[i]);
        }
        classList.add('layout-' + $$(this).attr('data-theme'));
		setCookie("theme-secondary",$$(this).attr('data-theme'),365);
    });
});

/* ===== Chips  ===== */
myApp.onPageInit('chips', function (page) {
    $$(page.container).find('.chip-delete').on('click', function (e) {
        e.preventDefault();
        var chip = $$(this).parents('.chip');
        myApp.confirm('Do you want to delete this?', function () {
            chip.remove();
        });
    });
});

/* ===== Virtual List ===== */
var items = [];
$$.ajax({
	url: 'include/data/pokemon_evolutionCalc.json',
	method: 'GET',
	dataType: 'json',
	success: function (data) {
		// Find matched items
		for (var i = 0; i < data.length; i++) {
			if (data[i].hasOwnProperty("cost")) items.push(data[i]);
		}
		// Create virtual list
		var virtualList = myApp.virtualList($$(document).find('.virtual-list'), {
			// Pass array with items
			items: items,
			// Custom search function for searchbar
			searchAll: function (query, items) {
				query = query.toLowerCase();
				var found = [];
				for (var i = 0; i < items.length; i++) {
					if (items[i].name.toLowerCase().indexOf(query) >= 0 || query.trim() === '') found.push(i);
				}
				return found; //return array with mathced indexes
			},
			// List item Template7 template
			template: '<li>' +
						'<a href="#" data-popup=".evolution-popup" class="item-link item-content open-popup" onclick="evolutionPopup(this)" data-cost="{{cost}}" data-name="{{name}}" data-img="include/images/{{id}}.png" data-evolution_name="{{evolution_name}}" data-evolution_id="{{evolution_id}}">' +
						  '<div class="item-media"><img src="include/images/{{id}}.png"></div>'+
						  '<div class="item-inner">' +
							'<div class="item-title-row">' +
							  '<div class="item-title">{{name}}</div>' +
							'</div>' +
							'<div class="item-subtitle">Cost: {{cost}}</div>' +
						  '</div>' +
						'</a>' +
					  '</li>',
			// Item height
			height: 73,
		});
	}
});
myApp.onPageInit('eggs', function (page) {
	var eggs_2km = [];
	var eggs_5km = [];
	var eggs_10km = [];
	var template = 	  '<li>' +
						'<a href="#" data-popup=".pokemonInfo-popup" class="item-link item-content open-popup" onclick="pokemonInfoPopup(this)" data-cost="{{cost}}" data-name="{{name}}" data-img="include/images/{{id}}.png" data-evolution_name="{{evolution_name}}" data-evolution_id="{{evolution_id}}">' +
						  '<div class="item-media"><img src="include/images/{{id}}.png"></div>'+
						  '<div class="item-inner">' +
							'<div class="item-title-row">' +
							  '<div class="item-title">{{name}}</div>' +
							'</div>' +
							'<div class="item-subtitle" >{{egg}}km</div>' +
						  '</div>' +
						'</a>' +
					  '</li>';
	$$.ajax({
		url: 'include/data/pokemon_evolutionCalc.json',
		method: 'GET',
		dataType: 'json',
		success: function (data) {
			// Find matched items
			for (var i = 0; i < data.length; i++) {
				if (data[i].hasOwnProperty("egg") && data[i].egg === 2) eggs_2km.push(data[i]);
				if (data[i].hasOwnProperty("egg") && data[i].egg === 5) eggs_5km.push(data[i]);
				if (data[i].hasOwnProperty("egg") && data[i].egg === 10) eggs_10km.push(data[i]);
			}
			// Create virtual list
			myApp.virtualList($$(document).find('.egg-list-2km'), {
				// Pass array with items
				items: eggs_2km,
				// List item Template7 template
				template: template,
				// Item height
				height: 73,
			});
			myApp.virtualList($$(document).find('.egg-list-5km'), {
				// Pass array with items
				items: eggs_5km,
				// List item Template7 template
				template: template,
				// Item height
				height: 73,
			});
			myApp.virtualList($$(document).find('.egg-list-10km'), {
				// Pass array with items
				items: eggs_10km,
				// List item Template7 template
				template: template,
				// Item height
				height: 73,
			});
		}
	});
});

/* ===== Change statusbar bg when panel opened/closed ===== */
$$('.panel-left').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-left');
});
$$('.panel-right').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-right');
});
$$('.panel-left, .panel-right').on('close', function () {
    $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
});
