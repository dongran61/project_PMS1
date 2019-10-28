layui.define("form", function(exports) {
	var MOD_NAME = "multiSelect",
		o = layui.jquery,
		form = layui.form,
		selected_vals = [],
        selected_text = [],
		multiSelect = function() {};

	multiSelect.prototype.init = function() {
		var ts = this;
		o('select[multiple]').each(function(idx, item) {
			var t = o(this),
				selds = [];
			t.find('option:selected').each(function() {
				selds.push(o(this).val());
				//alert(selds)

			})

		//	console.log( t.parent().html())
          //  t.next().val(selds)
			t.next().addClass('multi').find('.layui-select-title').click(function() {

                if(t.parent().find(".getVal").val()=="clear")
                    selected_text[idx] && o(this).find('input').val("");
                else
                    selected_text[idx] && o(this).find('input').val(selected_text[idx].join(','));
                t.parent().prev(".getVal").val(selds)
             //   console.log(t.parent().find(".getVal").val())
			}).next().find('dd').each(function() {
				var dt = o(this),
					checked = (dt.hasClass('layui-this') || o.inArray(dt.attr('lay-value'), selds) > -1) ? 'checked' : '',
					title = dt.text(),
					disabled = dt.attr('lay-value') === '' ? 'disabled' : '';
				dt.html('<input type="checkbox" lay-skin="primary" title="' + title + '" ' + checked + ' ' + disabled + '>');
				ts.selected(idx, t, dt);
			}).click(function(e) {
				var dt = o(this);
				// 点击下拉框每一行触发选中和反选
				if(e.target.localName == 'dd' && dt.attr('lay-value') !== '') {
					var status = dt.find('.layui-form-checkbox').toggleClass('layui-form-checked').hasClass('layui-form-checked');
					dt.find('input').prop('checked', status);
				}
				// 禁止下拉框收回
				dt.parents('.layui-form-select').addClass('layui-form-selected');
				ts.selected(idx, t, dt);
			});
		})
		form.render('checkbox');
	}

	multiSelect.prototype.selected = function(idx, t, dt) {
		// 选中值存入数组
		selected_text[idx] = [];
        selected_vals[idx] = [];
		// 先清除真实下拉款选中的值，在下面循环中重新赋值选中
		t.find('option').prop('selected', false);
		dt.parents('dl').find('[type=checkbox]:checked').each(function() {
			var val = o(this).parent().attr('lay-value');
			t.find('option[value=' + val + ']').prop('selected', true);
            selected_text[idx].push(o(this).attr('title'));
            selected_vals[idx].push(val);

		})
		// 显示已选信息
		dt.parents('dl').prev().find('input').val(selected_text[idx].join(','));
	//	alert(selected_vals)
	//	console.log(t)
        t.prev(".getVal").val(selected_vals[idx].join(','))
	}

	multiSelect.prototype.render = function(type, filter) {
		form.render(type, filter);
		this.init();
	}

	var i = new multiSelect();
	i.init();

	exports(MOD_NAME, i);
});