/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'linecons\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-cloud' : '&#xe000;',
			'icon-star' : '&#xe001;',
			'icon-user' : '&#xe002;',
			'icon-key' : '&#xe003;',
			'icon-settings' : '&#xe004;',
			'icon-pen' : '&#xe005;',
			'icon-eye' : '&#xe006;',
			'icon-stack' : '&#xe007;',
			'icon-news' : '&#xe008;',
			'icon-shop' : '&#xe009;',
			'icon-lab' : '&#xe00a;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};