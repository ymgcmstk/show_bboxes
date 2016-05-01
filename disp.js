$(function(){
    var colors = ['blue', 'green', 'navy', 'red', 'purple', 'maroon', 'gray'];
    function csv2Array(filePath) {
	var csvData = new Array();
	var data = new XMLHttpRequest();
	data.open("GET", filePath, false);
	data.send(null);
	var LF = String.fromCharCode(10);
	var lines = data.responseText.split(LF);
	for (var i = 0; i < lines.length;++i) {
	    var cells = lines[i].replace('"', '').replace('"', '').split(",");
	    // TODO: sanitize
	    if( cells.length != 1 ) {
		csvData.push(cells);
	    }
	}
	return csvData;
    }
    function addCanvas(URL, curid, bboxArray) {
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
	    var ctx = $('#' + cnvID)[0].getContext('2d');
	    ctx.drawImage(img, 0, 0);
	    for (var i = 0; i < bboxArray.length; i++) {
		addBBox(URL, curid, bboxArray[i][0], bboxArray[i][1],
			bboxArray[i][2], bboxArray[i][3], bboxArray[i][4],
			bboxArray[i][5]);
	    }
	}
	addbr(curid);
	addbr(curid);
	return;
    }
    function addBBox(URL, curid, x1, x2, y1, y2, label, curCount) {
	var cnvID =  'cnv' + curid.toString()
	var ctx = $('#' + cnvID)[0].getContext('2d');
	var thisColor = colors[curCount % colors.length];
	ctx.strokeStyle = thisColor;
	ctx.strokeRect(x1, y1, x2-x1, y2-y1);
	$('#' + cnvID + 'div').append(
	    '<div style="color: ' + thisColor + ';">' + label + '</div>'
	);
	return;
    }
    function addbr(curid) {
	var cnvID =  'cnv' + curid.toString()
	$('#' + cnvID + 'div').append('<br>');
	return;
    }
    function rewriteBody(filePath) {
	$('#images').empty();
	var targArray = csv2Array(filePath);
	var prevURL = '';
	var count = 0;
	var curURLCount = 0;
	var bboxArray = [];
	for (var i = 0; i < targArray.length; i++) {
	    curURLCount++;
	    if (prevURL != targArray[i][0]) {
		curURLCount = 0; // remove this line if you wanna do so
		if (bboxArray.length > 0) {
		    addCanvas(prevURL, count++, bboxArray);
		}
		prevURL = targArray[i][0];
		bboxArray = [];
	    }
	    bboxArray.push([targArray[i][1], targArray[i][2],
			    targArray[i][3], targArray[i][4],
			    targArray[i][5], curURLCount])
	}
	if (bboxArray.length > 0) {
	    addCanvas(prevURL, count++, bboxArray);
	}
	return;
    }
    function getCSVPath() {
	return $('#images').attr('data-csv');
    }

    rewriteBody(getCSVPath());

    $('#submit').on('click', function() {
	if($('#text').val() == null) {
            return;
	}
	rewriteBody($('#text').val());
    });

});
