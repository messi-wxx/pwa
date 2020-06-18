$(document).ready(function() {
	pageShow = 9;
	nowPage = 1;
	loadDataId = "my_poster_id";
	/*var url = window.basePath + "/h5/front/poster/toPoster";
	$.ajax({
	    url: url,
	    type: 'GET',
	    dataType: 'json',
	    data: {},
	    success: function (rest) {
	        $("#salesmanUuid").val(rest.data.salesmanUuid);
	    }
	})*/

	pageCallBack()
});

function pageCallBack() {
	loadPosterContent();
}

function loadPosterContent() {
	var storeNo = getSessionStoreNo();
	var posterType = $("#posterType").val();
	var url = window.basePath + "/h5/front/poster/ajaxSearchPoster";
	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'json',
		data: {
			currentPage: nowPage,
			pageShow: pageShow,
			storeNo: storeNo,
			posterType: posterType
		},
		success: function(rest) {
			console.log(rest)
			if (rest.result) {
				appendPosterResult(rest);
			} else {
				$(".no_search_data").show();
			}
			console.log('start')
		}
	})
}
//拼接加载出来的产品
function appendPosterResult(data) {
	var results = data.results;
	if (results != null && results.length > 0) {
		var appendHtml = "";
		for (var i = 0; i < results.length; i++) {
			var poster = results[i];
			//appendHtml += '<li><a href="javascript:void(0);" onclick="toPosterPage(\''+poster.uuid+'\',\''+poster.posterTitle+'\')"><img src="'+poster.posterImgUrl+'" alt=""/><p>'+poster.posterTitle+'</p></a></li>';
			appendHtml += '<li>' +
				'<a href="#"><img src="' + poster.posterImgUrl + '" alt=""/><p>' + poster.posterTitle + '</p></a>' +
				'</li>';
		}
		$("#my_poster_id").append(appendHtml);
		$(".no_search_data").hide();
	} else {
		if (nowPage == 1) {
			totalPage = data.totalPage;
			$(".no_search_data").show();
		}
	}
	nowPage++;
	initPreviewJs();
}


//初始化图片预览效果js
function initPreviewJs() {
	$(".haibao-list li img").click(function() {
		var imgSrc = $(this)[0].src;
		$(".mark").fadeIn();
		$(".haibao-show").fadeIn().children("img").attr("src", imgSrc);

	})

	$(".btn-close-haibao,.mark").click(function() {
		$(".mark").fadeOut();
		$(".haibao-show").fadeOut();
		$("#successHint").hide();
		$("#failHint").hide();

	})
}

//保存到相册
function savePic() {
	var picurl = $("#picurl").attr("src");
	//alert(picurl);
	savePicture(picurl);
}




var triggerEvent = "touchstart";

function savePicture(Url) {
	var blob = new Blob([''], {
		type: 'application/octet-stream'
	});
	var url = URL.createObjectURL(blob);
	var a = document.createElement('a');
	a.href = Url;
	a.download = Url.replace(/(.*\/)*([^.]+.*)/ig, "$2").split("?")[0];
	var e = document.createEvent('MouseEvents');
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	a.dispatchEvent(e);
	URL.revokeObjectURL(url);
}
