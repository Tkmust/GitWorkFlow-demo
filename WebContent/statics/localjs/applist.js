var path = $("#path").val();
$(function(){
	//所属平台
	$.ajax({
		type:"GET",//请求类型
		url:path+"/manager/getdictionarylist",//请求的url
		data:{typeName:"所属平台"},
		dataType:"json",//ajax接口（请求url）返回的数据类型
		success:function(data){//data：返回数据（json对象）
			if(data != null){
				$("#flatformId").html("");
				var options = "<option value=\"0\">请选择</option>";
				for(var i = 0; i < data.length; i++){
						options += "<option value=\""+data[i].id+"\" >"+data[i].valueName+"</option>";
				}
				$("#flatformId").html(options);
			}
		},
		error:function(data){//当访问时候，404，500 等非200的错误状态码
			alert("加载平台失败！");
		}
	});
	//一级分类
	$.ajax({
		type:"GET",//请求类型
		url:path+"/manager/getcategorylist?level=0",//请求的url
		dataType:"json",//ajax接口（请求url）返回的数据类型
		success:function(data){//data：返回数据（json对象）
			if(data != null){
				$("#queryCategoryLevel1").html("");
				var options = "<option value=\"0\">请选择</option>";
				for(var i = 0; i < data.length; i++){
						options += "<option value=\""+data[i].id+"\" >"+data[i].categoryName+"</option>";
				}
				$("#queryCategoryLevel1").html(options);
			}
		},
		error:function(data){//当访问时候，404，500 等非200的错误状态码
			alert("加载一级分类失败！");
		}
	});
})

$("#queryCategoryLevel1").change(function(){
	var queryCategoryLevel1 = $("#queryCategoryLevel1").val();
	if(queryCategoryLevel1 != '' && queryCategoryLevel1 != null){
		$.ajax({
			type:"GET",//请求类型
			url:path+"/manager/getcategorylist?level="+queryCategoryLevel1,//请求的url
			dataType:"json",//ajax接口（请求url）返回的数据类型
			success:function(data){//data：返回数据（json对象）
				$("#queryCategoryLevel2").html("");
				var options = "<option value=\"0\">--请选择--</option>";
				for(var i = 0; i < data.length; i++){
					options += "<option value=\""+data[i].id+"\">"+data[i].categoryName+"</option>";
				}
				$("#queryCategoryLevel2").html(options);
			},
			error:function(data){//当访问时候，404，500 等非200的错误状态码
				alert("加载二级分类失败！");
			}
		});
	}else{
		$("#queryCategoryLevel2").html("");
		var options = "<option value=\"\">--请选择--</option>";
		$("#queryCategoryLevel2").html(options);
	}
	$("#queryCategoryLevel3").html("");
	var options = "<option value=\"\">--请选择--</option>";
	$("#queryCategoryLevel3").html(options);
});

$("#queryCategoryLevel2").change(function(){
	var queryCategoryLevel2 = $("#queryCategoryLevel2").val();
	if(queryCategoryLevel2 != '' && queryCategoryLevel2 != null){
		$.ajax({
			type:"GET",//请求类型
			url:path+"/manager/getcategorylist?level="+queryCategoryLevel2,//请求的url
			data:{typeName:"所属平台"},
			dataType:"json",//ajax接口（请求url）返回的数据类型
			success:function(data){//data：返回数据（json对象）
				$("#queryCategoryLevel3").html("");
				var options = "<option value=\"0\">--请选择--</option>";
				for(var i = 0; i < data.length; i++){
					//alert(data[i].id);
					//alert(data[i].categoryName);
					options += "<option value=\""+data[i].id+"\">"+data[i].categoryName+"</option>";
				}
				$("#queryCategoryLevel3").html(options);
			},
			error:function(data){//当访问时候，404，500 等非200的错误状态码
				alert("加载三级分类失败！");
			}
		});
	}else{
		$("#queryCategoryLevel3").html("");
		var options = "<option value= \"0\">--请选择--</option>";
		$("#queryCategoryLevel3").html(options);
	}
});

$("#search").on("click",function(){
	var softwareName = $("#softwareName").val();
	var flatformId =$("#flatformId").val();
	var categoryLevel1 = $("#queryCategoryLevel1").val();
	var categoryLevel2 = $("#queryCategoryLevel2").val();
	var categoryLevel3 = $("#queryCategoryLevel3").val();
	var pageIndex = $("pageIndex").val();
	$.ajax({
		type:"GET",//请求类型
		url:path+"/manager/backend/getapp",//请求的url
		data:{softwareName:softwareName,flatformId:flatformId,categoryLevel1:categoryLevel1,
			categoryLevel2:categoryLevel2,categoryLevel3:categoryLevel3,pageIndex:pageIndex},
		dataType:"json",//ajax接口（请求url）返回的数据类型
		success:function(data){
			var tbody = $("#tbody")
			tbody.html("");
			for(var i = 0;i < data.list.length;i++){
				var str = 
				"<tr role=\"row\" class=\"odd\">"
				+"<td tabindex=\"0\" class=\"sorting_1\">"+data.list[i].softwareName+"</td>"
				+"<td>"+data.list[i].APKName+"</td>"
				+"<td>"+data.list[i].softwareSize+"</td>"
				+"<td>"+data.list[i].flatformName+"</td>"
				+"<td>"+data.list[i].categoryLevel1Name+"->"+data.list[i].categoryLevel2Name+"->"+data.list[i].categoryLevel3Name+"</td>"
				+"<td>"+data.list[i].statusName+"</td>"
				+"<td>"+data.list[i].downloads+"</td>"
				+"<td>"+data.list[i].versionNo+"</td>"
				+"<td><button type=\"button\" class=\"btn btn-default checkApp\""
				+"appinfoid=\""+data.list[i].id+"\" versionid=\""+data.list[i].versionId+"\" status=\""+data.list[i].status+"\""
				+"statusname=\""+data.list[i].statusName+"\" path=\"${pageContext.request.contextPath }\""									
				+"data-toggle=\"tooltip\" data-placement=\"top\" title=\"\" data-original-title=\"查看并审核APP\">审核</button>"
				+"</td></tr>";
				tbody.append(str);
			};
			var pageStr = "共"+data.rows+"条记录"+
			data.nowPage+"/"+data.contPage+"页";
			$("#datatable-responsive_info").html(pageStr)
		},
		error:function(data){//当访问时候，404，500 等非200的错误状态码
			alert("查询失败！");
		}
	});
	
});

$(".checkApp").on("click",function(){
	var obj = $(this);
	var status = obj.attr("status");
	var vid = obj.attr("versionid");
	if(status == "1" && vid != "" && vid != null){//待审核状态下才可以进行审核操作
		window.location.href=obj.attr("path")+"/check?aid="+ obj.attr("appinfoid") + "&vid="+ obj.attr("versionid");
	}else if(vid != "" || vid != null){
		alert("该APP应用没有上传最新版本,不能进行审核操作！");
	}else if(status != "1"){
		alert("该APP应用的状态为：【"+obj.attr("statusname")+"】,不能进行审核操作！");
	}
});



	
