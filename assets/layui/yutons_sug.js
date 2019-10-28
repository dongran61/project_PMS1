/**
 * @Title：yutons_sug搜索框提示插件||输入框提示插件
 * @Version：1.0
 * @Auth：yutons
 * @Date: 2018/10/4
 * @Time: 14:07
 */
layui.define(['jquery', 'table', 'form', 'layer'], function (exports) {
    "use strict";
    const $ = layui.jquery,
        table = layui.table, form = layui.form, layer = layui.layer;

    var yutons_sug = function () {
        this.v = '1.0.1';
    };
    /**
     * yutons_sug搜索框提示插件||输入框提示插件初始化
     */
    yutons_sug.prototype.render = function (opt) {
        opt.urlBak = opt.url;
        //设置默认初始化参数
        opt.type = opt.type || 'sug'; //默认sug，传入sug||sugTable
        opt.elem = "#yutons_sug_" + opt.id;
        opt.height = opt.height || '229';
        opt.cellMinWidth = opt.cellMinWidth || '80'; //最小列宽
        opt.page = opt.page || false;
        opt.limits = opt.limits || [3];
        opt.loading = opt.loading || true;
        opt.limit = opt.limit || 3;
        opt.size = opt.size || 'sm'; //小尺寸的表格
        //opt.currVal=opt.currVal || ''; //获取当前文本框的值
        //初始化输入框提示容器
      //  $("#" + opt.id).after("<div id='sugItem" + opt.id + "' class='subTable' style='background-color: #fff;display: none;z-index:1;position: absolute;width:100%;'></div>");
        //console.log("初始化输入框：",opt.id.replace("roomNum_",""))
        $("#" + opt.id).after("<div id='sugItem" + opt.id + "' class='subTable' style='background-color: #fff;display: none;z-index:1;position: absolute;width:100%;'></div>");

        //输入框提示容器移出事件：鼠标移出隐藏输入提示框
        $("#" + opt.id).parent().mouseleave(function () {
            $("#" + opt.id).next().hide().html("");
        });
        if (!opt.page) {
            $(".layui-table-page").css("display", "none !important")
        }

        if (opt.type == "sugTable") {
            //如果type为sugTable，则初始化下拉表格
            /* 输入框鼠标松开事件 */
            $("#" + opt.id).mouseup(function (e) {
                console.log("ceshi")
                opt.obj = this;
                getSugTable(opt);
            })
            /* 输入框键盘抬起事件 */
            $("#" + opt.id).keyup(function (e) {
                opt.obj = this;
                getSugTable(opt);
            })
        } else if (opt.type == "sug") {
            //如果type为sug，则初始化下拉框
            $("#" + opt.id).next().css("border", "solid #e6e6e6 0.5px");
            /* 输入框鼠标松开事件 */
            $("#" + opt.id).mouseup(function (e) {
                opt.obj = this;
                getSug(opt);
            })
            /* 输入框键盘抬起事件 */
            $("#" + opt.id).keyup(function (e) {
                opt.obj = this;
                getSug(opt);
            })
        }
    }

    function setCheckbox(data, txtVal) {
        console.log("data:", data)
        for (var i = 0; i < data.length; i++) {
            console.log("data[" + i + "].roomNumber:", data[i].roomNum)
            //  for (var j = 0; j < ids.length; j++) {
            //数据id和要勾选的id相同时checkbox选中
            if (data[i].roomNum == txtVal) {
                console.log("111:", txtVal)
                //这里才是真正的有效勾选
                data[i]["LAY_CHECKED"] = 'true';
                //找到对应数据改变勾选样式，呈现出选中效果
                var index = data[i]['LAY_TABLE_INDEX'];
                $('.layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                $('.layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
            }
            //  }
        }

    }

    function addRow(str,index) {

        var $row = $("#order_room_table").find(".order_room_list").eq(index).clone();
        $("#order_room_table").append($row);
        var row_id = parseInt($("#txtRowIndex").val()) + 1
        $("#txtRowIndex").val(row_id);
        //   $("#order_room_table .layui-input-group").find("input").val('');
        var rowCount = $("#order_room_table .order_room_list").length
        $("#order_room_table .order_room_list").eq(rowCount - 1).attr("id", row_id);
        $("#order_room_table .order_room_list").eq(rowCount - 1).find(".roomNum").attr("id", "roomNum_" + row_id)
        $("#roomNum_" + row_id).val(str)
        $("#order_room_table .order_room_list").eq(rowCount - 1).find(".ddlMemberType").attr("lay-filter", "ddl_" + row_id);
        $("#order_room_table .order_room_list").eq(rowCount - 1).find(".housePriceType").attr("id", "ddl_fjm_" + row_id);
        $("#order_room_table .order_room_list").eq(rowCount - 1).find(".roomQty").attr("id", "txtRoomQty_" + row_id);
        $("#order_room_table .order_room_list").eq(rowCount - 1).find(".subTable").remove();
        $("#order_room_table .order_room_list").eq(rowCount - 1).find(".cbo_checkIn").attr("id", "cboCheckIn_" + row_id)
        $("#order_room_table .order_room_list").eq(rowCount - 1).find(".div_cbo_rz").attr("lay-filter", "cboCheckIn_" + row_id);
        form.render('select', 'ddl_'+ row_id);//重新加载下拉框
        form.render('checkbox');
        $("#ddl_fjm_" + row_id).next().find(".layui-input").val($("#ddl_fjm_" + index).val())
        $("#ddl_fjm_" + row_id).val($("#ddl_fjm_" + index).val())
        console.log("房价类型："+$("#ddl_fjm_" + index).val())
        $("#txtRoomQty_" + index).val(parseInt($("#txtRoomQty_" + index).val())-1)
        $("#txtRoomQty_" + row_id).val(1)
        //新增一行初始化房id号列表
        //初始化房号号输入提示框
        //初始化新增行  房号号输入提示框
        yutons_sug.render({
            id: "roomNum_"+row_id, //设置容器唯一id
            name:"roomNumTable",
            height: "167",
            cols: [
                [{
                    type: 'checkbox',
                    title: '房型'
                },{
                    field: 'project',
                    title: '房型'
                }, {
                    field: 'roomNum',
                    title: '房号'
                }, {
                    field: 'caozuoyuan',
                    title: '状态'
                }, {
                    field: 'banci',
                    title: '特征'
                }]
            ], //设置表头
            page:false,
            type: 'sugTable', //设置输入框提示类型：sug-下拉框，sugTable-下拉表格
            url: sessionStorage.getItem("url") + "?params=" //设置异步数据接口,url为必填项
        });
    }

    //搜索框提示插件||输入框提示插件--sugTable-下拉表格
    function getSugTable(opt) {

        //如果输入信息为"",则隐藏输入提示框,不再执行下边代码

        var kw = $.trim($(opt.obj).val());
        /* if (kw == "") {
            $("#" + opt.id).next().hide().html("");
            return false;
        }
*/
        //下拉表格初始化table容器
        var html = '<table id="yutons_sug_' + opt.obj.getAttribute("id") + '" lay-filter="yutons_sug_' + opt.obj.getAttribute(
            "id") +
            '"></table>';
        $("#" + opt.obj.getAttribute("id")).next().show().html(html);

        //下拉表格初始化
        opt.url = opt.urlBak + kw;
        var checkedQty = 0;//已选择 数量

        //table.render(opt);
        table.render({
            cols: opt.cols,
            page: opt.page,

            type: 'sugTable', //设置输入框提示类型：sug-下拉框，sugTable-下拉表格
            url: opt.url,
            elem: opt.elem,
            done: function (res, curr, count) {
                //数据表格加载完成时调用此函数
                //如果是异步请求数据方式，res即为你接口返回的信息。
                // table_data=res.data;

                //在缓存中找到id ,然后设置data表格中的选中状态
                //循环所有数据，找出对应关系，设置checkbox选中状态

                for (var i = 0; i < res.data.length; i++) {
                    //    console.log("res.data["+i+"].roomNumber:",res.data[i].roomNum)
                    //	console.log(opt.id+"：",$("#"+opt.id).val());
                    //  for (var j = 0; j < ids.length; j++) {
                    //数据id和要勾选的id相同时checkbox选中
                    if (res.data[i].roomNum == $("#" + opt.id).val()) {
                        checkedQty += 1;//已选择 数量
                        //这里才是真正的有效勾选
                        res.data[i]["LAY_CHECKED"] = 'true';

                        //找到对应数据改变勾选样式，呈现出选中效果
                        var index = res.data[i]['LAY_TABLE_INDEX'];
                        // console.log("111:",opt.id)
                        $('#sugItem' + opt.id + ' tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                        $('#sugItem' + opt.id + ' tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                    }
                }
            }
        });
        //设置下拉表格样式
        $(opt.elem).next().css("margin-top", "0").css("background-color", "#ffffff");
        //监听下拉表格行单击事件（单击||双击事件为：row||rowDouble）设置单击或双击选中对应的行
        //	table.on('rowDouble(' + "yutons_sug_" + opt.id + ')', function(obj) {
        var str = "";
        var checkedStr = "";

        table.on('checkbox(' + "yutons_sug_" + opt.id + ')', function (obj) {
            //获取选中行所传入字段的值

            //    console.log(obj.checked); //当前是否选中状态
            //    console.log(obj.data); //选中行的相关数据
            //    console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
            //	$("#" + opt.id).val(obj.data[opt.id]);
            //	$("#" + opt.id).next().hide().html("");

            if (obj.checked) {
                checkedQty++
                //    console.log(obj.data.roomNum);
                checkedStr += obj.data.roomNum + ","
                str = obj.data.roomNum;
               /*
                if (str != "" && str != null&&str!=$.trim($("#" + opt.id).val())) {
                    addRow(str)
                }*/
               var currRow=opt.id.substr(opt.id.indexOf("-"),opt.id.length)
               var currRoomQty= $("#txtRoomQty_" + currRow).val()
                if(checkedQty>currRoomQty)
                {
                    return false
                }
                if (($.trim($("#" + opt.id).val()) == "" || $.trim($("#" + opt.id).val()) != null||$.trim($("#" + opt.id).val())!=str)&&checkedQty<2) {
                    $("#" + opt.id).val(str)
                }
                else
                {
                    addRow(str,currRow)
                }


                console.log("checkedQty+：", checkedQty)
            }
            else {

                str = str.replace(obj.data.roomNum + ",", "")
                var count = $("#order_room_table .order_room_list").length
                console.log("checkedQty-：", checkedQty)
                console.log("count：", count)
                if (count > 1) {
                    $(".order_room_list").each(function () {
                        var txtNum = $.trim($(this).find(".roomNum").val())

                        if (txtNum == obj.data.roomNum) {
                            if (checkedQty > 1) {
                                console.log("要删除的房价号" + txtNum)
                                $(this).remove()
                            }
                            else
                                $(this).find(".roomNum").val("")
                        }
                    })
                }
                else {
                    $("#" + opt.id).val("")
                    //layer.msg('初始行不能删除');
                }
                checkedQty--;
                //   console.log("false+str："+str)
                //$("#roomNume_" + opt.id).val($("#roomNume_" + opt.id).val().replace("obj.data.roomNum",""))
            }

        });

    }

    //搜索框提示插件||输入框提示插件--sug-下拉框
    /*
    function getSug(opt) {
        sessionStorage.setItem("inputId", opt.id)
        var kw = $.trim($(opt.obj).val());
        if (kw == "") {
            $("#" + opt.id).next().hide().html("");
            return false;
        }
        //sug下拉框异步加载数据并渲染下拉框
        $.ajax({
            type: "get",
            url: opt.urlBak + kw,
            success: function (data) {
                var html = "";
                layui.each(data.data, (index, item) = > {
                    //if (item[sessionStorage.getItem("inputId")].indexOf(decodeURI(kw)) >= 0) {
                    html +=
                    "<div class='item' style='padding: 3px 10px;cursor: pointer;' onmouseenter='getFocus(this)' onClick='getCon(this);'>" +
                    item[sessionStorage.getItem("inputId")] + "</div>";
                //}
            })
                ;
                if (html != "") {
                    $("#" + sessionStorage.getItem("inputId")).next().show().html(html);
                } else {
                    $("#" + sessionStorage.getItem("inputId")).next().hide().html("");
                }
            }
        });
    }
*/
    //搜索框提示插件||输入框提示插件--sug-下拉框上下键移动事件和回车事件
    $(document).keydown(function (e) {
        e = e || window.event;
        var keycode = e.which ? e.which : e.keyCode;
        if (keycode == 38) {
            //上键事件
            if ($.trim($("#" + sessionStorage.getItem("inputId")).next().html()) == "") {
                return;
            }
            movePrev(sessionStorage.getItem("inputId"));
        } else if (keycode == 40) {
            //下键事件
            if ($.trim($("#" + sessionStorage.getItem("inputId")).next().html()) == "") {
                return;
            }
            $("#" + sessionStorage.getItem("inputId")).blur();
            if ($(".item").hasClass("addbg")) {
                moveNext();
            } else {
                $(".item").removeClass('addbg').css("background", "").eq(0).addClass('addbg').css("background", "#e6e6e6");
            }
        } else if (keycode == 13) {
            //回车事件
            dojob();
        }
    });
    //上键事件
    var movePrev = function (id) {
        $("#" + id).blur();
        var index = $(".addbg").prevAll().length;
        if (index == 0) {
            $(".item").removeClass('addbg').css("background", "").eq($(".item").length - 1).addClass('addbg').css(
                "background", "#e6e6e6");
        } else {
            $(".item").removeClass('addbg').css("background", "").eq(index - 1).addClass('addbg').css("background", "#e6e6e6");
        }
    }
    //下键事件
    var moveNext = function () {
        var index = $(".addbg").prevAll().length;
        if (index == $(".item").length) {
            $(".item").removeClass('addbg').css("background", "").eq(0).addClass('addbg').css("background", "#e6e6e6");
        } else {
            $(".item").removeClass('addbg').css("background", "").eq(index + 1).addClass('addbg').css("background", "#e6e6e6");
        }
    }
    //回车事件
    var dojob = function () {
        var value = $(".addbg").text();
        $("#" + sessionStorage.getItem("inputId")).blur();
        $("#" + sessionStorage.getItem("inputId")).val(value);
        $("#" + sessionStorage.getItem("inputId")).next().hide().html("");
    }

    //上下键选择和鼠标选择事件改变颜色
    window.getFocus = function (obj) {
        $(".item").css("background", "");
        $(obj).css("background", "#e6e6e6");
    }

    //点击选中事件，获取选中内容并回显到输入框
    window.getCon = function (obj) {
        var value = $(obj).text();
        //alert(value)
        $("#" + $(".item").parent().prev().attr("id")).val(value);
        $("#" + $(".item").parent().prev().attr("id")).next().hide().html("");
    }

    //自动完成渲染
    yutons_sug = new yutons_sug();
    //暴露方法
    exports("yutons_sug", yutons_sug);
});
