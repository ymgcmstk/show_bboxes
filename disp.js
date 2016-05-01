$(function(){
    var colors = ['blue', 'navy', 'green', 'red', 'purple', 'maroon', 'gray'];
    function csv2Array(filePath) {
	var csvData = new Array();
	var data = new XMLHttpRequest();
	data.open("GET", filePath, false);
	data.send(null);
	var LF = String.fromCharCode(10);
	var lines = data.responseText.split(LF);
	for (var i = 0; i < lines.length;++i) {
	    var cells = lines[i].split(",");
	    // TODO: sanitize
	    if( cells.length != 1 ) {
		csvData.push(cells);
	    }
	}
	return csvData;
    }
    function addCanvas(URL, curid, x1, x2, y1, y2, label, curCount) {
	var cnvID =  'cnv' + curid.toString();
	var img = new Image();
	$('#images').append('<div id="' + cnvID + 'div"></div>');
	img.src = URL;
	img.onload = function() {
	    $('#' + cnvID + 'div').append(
		'<canvas id="' + cnvID + '" width="' +
		    img.width + '" height="' +
		    img.height + '"></canvas>'
	    );
	    var ctx = $('#' + cnvID).getContext('2d');
	    ctx.drawImage(img, 0, 0);
	    addBBox(URL, curid, x1, x2, y1, y2, label, curCount);
	}
	return;
    }
    function addBBox(URL, curid, x1, x2, y1, y2, label, curCount) {
	var cnvID =  'cnv' + curid.toString()
	var ctx = $('#' + cnvID).getContext('2d');
	var thisColor = colors[curCount % colors.length];
	ctx.fillStyle = thisColor;
	ctx.strokeRect(x1, y1, x2-x1, y2-y1);
	$('#' + cnvID + 'div').append(
	    '<div style="color: ' + thisColor + ';">' + label + '</div>'
	);
	return;
    }
    function rewriteBody() {
	var targArray = csv2Array(getCSVPath());
	var prevURL = '';
	var count = 0;
	var curURLCount = 0;
	for (var i = 0; i < targArray.length; i++) {
	    curURLCount++;
	    if (prevURL != targ_array[i][0]) {
		curURLCount = 0; // いらない気もする
		addCanvas(targ_array[i][0], count++, targ_array[i][1],
			  targ_array[i][2], targ_array[i][3], targ_array[i][4],
			  targ_array[i][5], curURLCount);
		prevURL = targ_array[i][0];
	    } else {
		addBBox(targ_array[i][0], count, targ_array[i][1],
			targ_array[i][2], targ_array[i][3], targ_array[i][4],
			targ_array[i][5], curURLCount);
	    }
	}
	return;
    }
    function getCSVPath() {
	return $('#images').attr('data-csv');
    }
    rewriteBody();
});
