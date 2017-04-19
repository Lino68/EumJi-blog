$(function() {
    var page = $("#current-page").val();
    if (page == null || page == 0) {
        page = 1;
    }
    $.ajax({
        url: '/admin/tag/initPage',
        data: 'page=' + page,
        success: function (data) {
            $("#total-num").text(data.totalCount);
            $("#total-page").text(data.totalPageNum);
            $("#current-page").text(data.page);
            $.jqPaginator('#pagination', {
                totalPages: data.totalPageNum,
                visiblePages: 5,
                currentPage: data.page,
                prev: '<li class="prev"><a href="javascript:;">Previous</a></li>',
                next: '<li class="next"><a href="javascript:;">Next</a></li>',
                page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function (num, type) {
                    // 加载管理员列表
                    $("#current-page").text(num);
                    loadTagList();
                }
            });
        }
    });
});


// 跳转分页
function toPage(page){
	$("#page").val(page);
	loadTagList();		
}

// 加载管理员列表
function loadTagList(){
	// 收集参数
	var param = buildParam();
	
	var page = $("#page").val();
	if(isEmpty(page) || page == 0){
		page = 1;
	}
	
	// 查询列表
	$.ajax({
        url : '/admin/tag/load',
        data : 'page='+page+"&param="+param,
        success  : function(data) {
        	$("#dataList").html(data);
		}
    });

}

// 收集参数
function buildParam(){
	var param = {};
	var keyword = $("#keyword").val();
	if(!isEmpty(keyword)){
		param["tagName"] = encodeURI(encodeURI(keyword));
	}
	return JSON.stringify(param);
}

// 搜索
function search(){
	loadTagList();
}

// 删除
function deleteTag(id){
	$.ajax({
        url : '/admin/tag/delete',
        data : 'id='+id,
        success  : function(data) {
        	if(data.resultCode == 'success'){
        		autoCloseAlert(data.errorInfo,1000);
        		loadTagList();
        	}else{
        		autoCloseAlert(data.errorInfo,1000);
        	}
		}
    });
}

// 跳转编辑页
function editTag(id){
	$.ajax({
        url : '/admin/tag/editJump/',
        data: {id:id},
        success  : function(data) {
        	$('#editTagContent').html(data);
        	$('#editTagModal').modal('show');
        	$('#editTagModal').addClass('animated');
        	$('#editTagModal').addClass('flipInY');
		}
    });
}

// 关闭编辑管理员窗口
function closeEditWindow(){
	$('#editTagModal').modal('hide');
}

// 关闭新增管理员窗口
function closeAddWindow(){
	$('#addTagModal').modal('hide');
}


// 编辑管理员
function saveEditTag(){
	if(validateEditTag()){
		$.ajax({
	        url : '/admin/tag/update',
	        data : encodeURI($("#editForm").serialize()),
	        success  : function(data) {
	        	if(data.resultCode == 'success'){
	        		$('#editTagModal').modal('hide');
	            	loadTagList();
	            	closeEditWindow();
	            	autoCloseAlert(data.errorInfo,1000);
	        	}else{
	        		autoCloseAlert(data.errorInfo,1000);
	        	}
			}
	    });
	}
}

// 新增管理员
function saveAddTag(){
	if(validateAddTag()){
		$.ajax({
	        url : '/admin/tag/save',
	        data : encodeURI($("#addForm").serialize()),
	        success  : function(data) {
	        	if(data.resultCode == 'success'){
	        		$('#addTagModal').modal('hide');
	            	loadTagList();
	            	closeAddWindow();
	            	autoCloseAlert(data.errorInfo,1000);
	        	}else{
	        		autoCloseAlert(data.errorInfo,1000);
	        	}
			}
	    });
	}
}

// 校验新增管理员输入框
function validateAddTag(){
	var tagName = $("#tagName").val();
	var aliasName = $("#aliasName").val();
	if(!isEmpty(tagName)){
		if(isSpecialSymbols(tagName)){
			autoCloseAlert("标签不能包含特殊符号",1000);
			return false;
		}
	}else{
		autoCloseAlert("标签不能为空",1000);
		return false;
	}
    if(!isEmpty(aliasName)){
        if(isSpecialSymbols(aliasName)){
            autoCloseAlert("标签不能包含特殊符号",1000);
            return false;
        }
    }else{
        autoCloseAlert("标签不能为空",1000);
        return false;
    }
	return true;
}

// 校验编辑管理员输入框
function validateEditTag(){
	var tagName = $("#tagName").val();
	if(!isEmpty(tagName)){
		if(isSpecialSymbols(tagName)){
			autoCloseAlert("标签不能包含特殊符号",1000);
			return false;
		}
	}else{
		autoCloseAlert("标签不能为空",1000);
		return false;
	}

	return true;
}

// 跳转新增管理员页面
function addTag(){
	$.ajax({
        url : '/admin/tag/addJump',
        success  : function(data) {
        	$('#addTagContent').html(data);
        	$('#addTagModal').modal('show');
        	$('#addTagModal').addClass('animated');
        	$('#addTagModal').addClass('bounceInLeft');
		}
    });
}