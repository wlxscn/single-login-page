var conditions = {
	buyer: { text: '购方公司', checkedList: [], showText: '' },
	seller: { text: '销方公司', checkedList: [], showText: '' },
	paperDrewDate: { text: '开票日期', fromDate: '', toDate: '', showText: '' },
	settlementNo: { text: '结算单号', value: '', showText: '' },
	invoiceNo: { text: '发票号码', value: '', showText: '' },
	invoiceCode: { text: '发票代码', value: '', showText: '' },
	invoiceType: {
		text: '发票类型',
		isAll: false,
		checkList: [
			{ name: '增值税普通发票', code: 'c', checked: false },
			{ name: '增值税专用发票', code: 's', checked: false },
			{ name: '增值税电子普通发票', code: 'ce', checked: false },
		],
		isCheckedList: [],
		showText: ''
	},
	saleList: {
		text: '销货清单',
		isAll: false,
		checkList: [
			{ name: '无销货清单', code: '0', checked: false },
			{ name: '金税销货清单', code: '1', checked: false }
		],
		isCheckedList: [],
		showText: ''
	},
	invoiceOrig: {
		text: '发票来源',
		isAll: false,
		checkList: [
			{ name: '税控信息', code: '1', checked: false },
			{ name: '直连开票', code: '5', checked: false }
		],
		isCheckedList: [],
		showText: ''
	},
	makeRule: {
		text: '开具方式',
		isAll: false,
		checkList: [
			{ name: '未按开票规则开票', code: 0, checked: false },
			{ name: '按开票规则开票', code: 1, checked: false }
		],
		isCheckedList: [],
		showText: ''
	},
	redFlag: {
		text: '红冲状态',
		isAll: false,
		checkList: [
			{ name: '未红冲蓝票', code: '5', checked: false },  //这个千万不能改，必须保留
			{ name: '待红冲蓝票', code: '1', checked: false },
			{ name: '待部分红冲蓝票', code: '2', checked: false },
			{ name: '已红冲蓝票', code: '3', checked: false },
			{ name: '已部分红冲蓝票', code: '4', checked: false },
			{ name: '红冲票', code: '6', checked: false }      //这个千万不能改，必须保留
		],
		isCheckedList: [],
		showText: ''
	},
	invoiceStatus: {
		text: '发票状态',
		isAll: false,
		checkList: [
			{ name: '已开具', code: '0', checked: false },
			{ name: '已寄送', code: '1', checked: false },
			{ name: '已部分寄送', code: '2', checked: false },
			{ name: '寄送异常', code: '3', checked: false },
			{ name: '已签收', code: '4', checked: false },
			{ name: '已部分签收', code: '5', checked: false },
			{ name: '已付款', code: '6', checked: false },
			{ name: '已部分付款', code: '7', checked: false }
		],
		isCheckedList: [],
		showText: ''
	},
	accountRange: {
		text: '金额范围',
		checkList: [
			{ name: '含税金额', code: '0', checked: false },
			{ name: '不含税金额', code: '1', checked: false },
			{ name: '税额', code: '2', checked: true }
		],
		minAccount: '',
		maxAccount: '',
		showText: ''
	}
};
window.page = widget({
	name: 'invoice-out',
	tplname: 'tpl-invoice_out',
	data: {
		tabs: null,
		tabcatalog: null,
		detailTab: '',
		pageidx: 0,
		sellerCompanyPageidx: 0,
		buyerCompanyPageidx: 0,
		logPageidx: 0,
		detail: null,
		invoiceId: '',
		selectIds: [],
		selectAll: false,
		filterConditions: {}, // 筛选条件
		filterShowText: {}, // 筛选条件展示文本
		userSessionId: ''
	},
	create: function () {

		this.ajax_tabinfo();

		this.registerListener();

	},
	methods: {
		//渲染头部
		'renderHeader': function () {
			var tpl = template('tpl-header-content', {});
			$('.head-content').append(tpl);
		},

		//获取tab信息
		'ajax_tabinfo': function () {

			var self = this;

			var handleFilterConditions = self.methods.handleFilter();

			Ajax.call('获取销项发票tab信息', 'post', JSON.stringify(handleFilterConditions), function (err, data) {
				console.log('获取销项发票tab信息')
				self.data.tabs = data;

				var tpl = template('tpl-tabitem', { 'list': data });

				$('#tabbar').html(tpl);

				self.setTabFocus(1);
			});
		},

		'ajax_invoice_list': function () {

			var self = this;

			var handleFilterConditions = self.methods.handleFilter();

			var url = '/api-v1/invoice/seller/list?catalog=' + this.data.tabcatalog + '&page=' + this.data.pageidx + '&row=10';

			Ajax.post(url, JSON.stringify(handleFilterConditions), function (err, data) {
				data.forEach(function(item) {
                  item.invoiceTypeCss = self.invoiceTypeForClass(item);
				})

				var tpl = template('tpl-left-card', { 'list': data });

				$('#card-list').append(tpl).scrollLoading().unLock();

				if (self.data.selectAll) {
					$('[sid] input').prop('checked', true);
				}

				if (data.length == 0) {

					$('#card-list').scrollLoading().noMore();
				}
			});
		},

		'ajax_invoice_detail': function (sid) {

			var self = this;

			var url = '/api-v1/invoice/seller/' + sid;

			var operatekeys = [], hashoperate = store.get('operations');

			for (var key in hashoperate) {

				operatekeys.push(key);
			}

			Ajax.post(url, {
				'apiKey': 'x0201000',
				'data': JSON.stringify(operatekeys)
			}, function (err, data) {
				data.invoiceMain.invoiceTypeCss = self.invoiceTypeForClass(data.invoiceMain);
				
				if (data) {
					if (data.invoiceMain.invoiceOrig == '5') {
						data.invoiceMain.originText = '直连开票';
					} else if (data.invoiceMain.invoiceOrig == '7') {
						data.invoiceMain.originText = '手工回填';
					} else if (data.invoiceMain.invoiceOrig == '1') {
						data.invoiceMain.originText = '税控信息';
					}

					if(data.invoiceMain.invoiceType == 's') {
						data.invoiceMain.invoiceSrc = './assets/images/outinvoice_full_invoice_origen_s.png';
					} else {
						data.invoiceMain.invoiceSrc = './assets/images/outinvoice_full_invoice_origen_c.png';
					}

					data.invoiceMain.settlementSrc = '/statement_out.html?settlementId' +data.invoiceMain.settlementId

					self.data.detail = data;

					$('#detail-tabs li').removeClass('active');

					$('#detail-tabs li').eq(0).addClass('active');

					var tab = $(this).attr('tabname');

					self.setDetailTabFocus('invoiceBasic');

					loading('#detail_loading', 'stop');
				}
			});
		},

		'ajax_companyinfo': function (inner, keyword) {

			var self = this;

			var page= 0;

			if(!inner) {
               page= self.data.buyerCompanyPageidx;
			} else {
				page= self.data.sellerCompanyPageidx;
			}

			var url = encodeURI('/api-v1/company/item/search?keyword=' + keyword + '&inner=' + inner + '&page=' + page + '&row=10');

			Ajax.get(url, {
				'apiKey': 'x0101000',
				'data': {}
			}, function (err, data) {
				for (var i in data) {
					if (self.hasCompany(data[i]) >= 0) {
						data[i].operateIcon = './assets/images/delete.png';
					} else {
						data[i].operateIcon = './assets/images/add.jpg';
					}
				}
				if (!inner) {
					data.forEach(function (item) {
						item.inner = 'purchaser';
					})
					var tpl = template('tpl-companyList', { 'companyList': data });
					$('#searchBuyer ul').append(tpl).scrollLoading().unLock();

					if (data.length == 0) {

						$('#searchBuyer ul').scrollLoading().noMore();
					}
				} else {
					data.forEach(function (item) {
						item.inner = 'seller';
					})
					var tpl = template('tpl-companyList', { 'companyList': data });

					$('#searchSeller ul').append(tpl).scrollLoading().unLock();

					if (data.length == 0) {

						$('#searchSeller ul').scrollLoading().noMore();
					}

				}
			});
		},

		'registerListener': function () {
			var self = this;
			var sessionId = (new Date()).getTime().toString();
			var userId = "";
			Ajax.post('/api-v1/invoice/message/register', {
				'apiKey': 'x0201000',
				'data': JSON.stringify({
					sessionId: sessionId,
					userId: ''
				})
			}, function (err, data) {
				self.data.userSessionId = sessionId;
			})
		},

		'ajax_get_action_record': function () {
			var self = this;

			var url = '/api-v1/invoice/history-info';

			Ajax.post(url, {
				'apiKey': 'x0201000',
				'data': JSON.stringify({
					invoiceId: self.data.invoiceId,
					page: self.data.logPageidx,
					row: 12
				})
			}, function (err, data) {

				if (data && data.length > 0) {

					var tpl = template('tpl-log-item', { 'list': data });

					$('#maininfo').append(tpl).scrollLoading().unLock();

					if (data.length == 0) {

						$('#maininfo').scrollLoading().noMore();
					}
				}
			});
		},

		'ajax_get_task': function() {
			 $('.task-dropdown ul').html(''); 

			var self= this;
			
			var url= '/api-v1/invoice/common/file-list?page=0&row=8'

			Ajax.post(url, {
			   apiKey: 'x0201000',
			   data: JSON.stringify({})
			},function(err, data) {
               if(data instanceof Array) {

				  $('.dropdown-container').show();
				  
				  $('.task-title a').on('click', function() {
                       self.ajax_remove_task()
				  })
				  

				  if(data[0].filePath != '') {
					  var tpl= template('tpl_task_list',{list: data});
					  
					  $('.task-dropdown ul').append(tpl); 

					  var liTotal= $('.task-dropdown ul li');
					  
					  for(var i=0; i < liTotal.length; i++) {
						  if(i % 2 == 0) {
                              liTotal.eq(i).css('background', '#f2f2f2')
						  } else {
                              liTotal.eq(i).css('background', '#fff')
						  }
					  }

					  $('.noDownload').hide();		 

				  } else {
					  if($('.task-dropdown ul').length == 0) {
                        $('.noDownload').show();	
					  }
				  }	
				  
				  
			   } else {
                  showMessage({
					  message: data.message,
				      type: 'warn'		
					}); 
			   }
			})
		},

		'ajax_remove_task': function() {

		},

		// 调接口前筛选条件的处理
		'handleFilter': function () {
			var self = this;
			var accountType = $('input[type="radio"][name="accountType"]:checked').val();
			var accountfrom = $('.accountfrom').val();
			var accountto = $('.accountto').val();

			var acocuntRange = {};
			acocuntRange[accountType] = acocuntRange[accountType] || {};
			acocuntRange[accountType].first = accountfrom;
			acocuntRange[accountType].second = accountto;

			var filterConditions = $.extend({}, self.data.filterConditions, acocuntRange)
			var handleFilterConditions = {};

			// 对公司条件进行特殊处理
			for (var j in filterConditions) {
				if (j == 'buyer') {
					var purchaserCode = [];
					var purchaserTaxNo = [];
					var purchaserName = [];
					filterConditions.buyer.forEach(function (item) {
						if (item.companyCode && item.companyCode.trim()) {
							purchaserCode.push(item.companyCode.trim());
						} else {
							if (item.companyTaxNo && item.companyTaxNo.trim()) {
								purchaserTaxNo.push(item.companyTaxNo.trim());
							} else if (item.companyName && item.companyName.trim()) {
								purchaserName.push(item.companyName.trim());
							}
						}
					})
					handleFilterConditions.purchaserCode = purchaserCode;
					handleFilterConditions.purchaserTaxNo = purchaserTaxNo;
					handleFilterConditions.purchaserName = purchaserName;
				} else if (j == 'seller') {
					var sellerCode = [];
					var sellerTaxNo = [];
					var sellerName = [];
					filterConditions.seller.forEach(function (item) {
						if (item.companyCode && item.companyCode.trim()) {
							sellerCode.push(item.companyCode.trim());
						} else {
							if (item.companyTaxNo) {
								sellerTaxNo.push(item.companyTaxNo.trim());
							} else if (item.companyName.trim()) {
								sellerName.push(item.companyName.trim());
							}
						}
					})
					handleFilterConditions.sellerCode = sellerCode;
					handleFilterConditions.sellerTaxNo = sellerTaxNo;
					handleFilterConditions.sellerName = sellerName;
				}
			}

			//对于全选或者全不选进行处理
			for (var i in self.data.filterShowText) {
				if (i != 'buyer' && i != 'seller' && self.data.filterShowText[i] != '' && self.data.filterShowText[i].indexOf('全部') < 0) {
					if (i == 'accountRange') {
						if (filterConditions['amountWithoutTax']) {
							handleFilterConditions['amountWithoutTax'] = filterConditions['amountWithoutTax'];
						}
						if (filterConditions['amountWithTax']) {
							handleFilterConditions['amountWithTax'] = filterConditions['amountWithoutTax'];
						}
						if (filterConditions['taxAmount']) {
							handleFilterConditions['taxAmount'] = filterConditions['taxAmount'];
						}
					}
					if (i == 'makeRule') {
                       handleFilterConditions[i] = Boolean(filterConditions[i][0]);
					} else {
                       handleFilterConditions[i] = filterConditions[i];
					}
				}
			}

			return handleFilterConditions;
		},

		// 从左侧列表删除一条数据
		removeInvoiceItemFormLeftList: function (sid) {

			var itemdom = $('#card-list > [sid=' + sid + ']');

			itemdom.animate({ 'opacity': 0 }, function () {

				itemdom.animate({ 'height': '0px' }, function () {

					itemdom.next().click();

					itemdom.remove();
				});
			});
		},

		hasCompany: function (company) {
			var self = this;
			self.data.filterConditions['buyer'] = self.data.filterConditions['buyer'] || []
			for (var i = 0; i < self.data.filterConditions['buyer'].length; i++) {
				var nowCompany = self.data.filterConditions['buyer'][i];
				if (company.companyName == nowCompany.companyName &&
					company.companyNo == nowCompany.companyNo &&
					company.companyTaxNo == nowCompany.companyTaxNo) {
					return i;
				}
			}
			return -1;
		},

		// 改变筛选条件时动态更新显示
		getShowArr: function (type, value) {
			var self = this;
			var title = conditions[type].text;
			if (!value) {
				this.data.filterShowText[type] = value;
			} else {
				this.data.filterShowText[type] = title + ':' + value;
			}

			var tpl = template('tpl-filter-total', { filterTotal: this.data.filterShowText });
			$('.filter-total').html('');
			$('.filter-total').append(tpl);
		},

		// 初始化一些事件
		initEvent: function () {

			var self = this;

			$('body').delegate('#tabbar li', 'click', this.setTabFocus);

			$('body').delegate('[sid]', 'click', function (evt) {

				self.hideBottom();

				$('.statement_item.active').removeClass('active');

				$(this).addClass('active');

				$('.right-box').show();

				var sid = $(this).attr('sid');

				self.data.invoiceId = sid;

				loading('#detail_loading', 'start');

				self.ajax_invoice_detail(sid);

			});

			$('body').delegate('#detail-tabs li', 'click', function (evt) {

				$('#detail-tabs li').removeClass('active');

				$(this).addClass('active');

				var tab = $(this).attr('tabname');

				self.setDetailTabFocus(tab);
			});

			$('body').delegate('[sid] input', 'click', function (event) {
				event.stopPropagation();

				var sid = $(this).parent().attr('sid');

				var totalLength = 0;

				var selectLength = 0;

				var curIndex = self.data.selectIds.indexOf(sid);

				if (curIndex < 0) {
					self.data.selectIds.push(sid);
				} else {
					self.data.selectIds.splice(curIndex, 1);
				}

				selectLength = self.data.selectIds.length;

				for (var i = 0; i < self.data.tabs.length; i++) {
					if (self.data.tabs[i].catalog == self.data.tabcatalog) {
						totalLength = self.data.tabs[i].count;
					}
				}

				var tpl = template('tpl-bottom', { totalLength: totalLength, selectLength: selectLength });
				$('.bottomBar').html(tpl);
				$('.bottomBar').show();
			});

		    $('body').delegate('.user-center', 'click', function (evt) {
                $('#user-menu').toggle();
			})

			$('body').delegate('.task-circle', 'click', function(evt) {
				if($('.dropdown-container').css('display') == 'none') {
                   self.ajax_get_task();
				} else{
					$('.dropdown-container').hide();
				}
			})

			// 筛选条件文本框改变事件
			$('body').delegate(".filter-row>span input[type='text']", 'keyup propertychange', function (evt) {
				var value = $(this).val();
				var filterType = $(this).attr('conditionType');
				self.data.filterConditions[filterType] = value;
				self.methods.getShowArr(filterType, value);
			});

			// checkbox改变事件
			$('body').delegate(".filter-row input[type='checkbox']", 'click', function (evt) {
				var showText = '';
				var checked = this.checked;
				var filterType = $(this).attr('conditionType');
				var text = $(this).next('label').text();
				var value = $(this).attr('value');
				var listLength = $('input[conditionType=' + filterType + ']').length - 1;
				if (checked) {
					self.data.filterConditions[filterType] = self.data.filterConditions[filterType] || [];

					if (value == "all") {
						$('input[conditionType=' + filterType + ']').prop("checked", true);
						for (var i = 1; i < listLength + 1; i++) {
							self.data.filterConditions[filterType].push($('input[conditionType=' + filterType + ']').eq(i).attr('value'));
						}
						self.methods.getShowArr(filterType, '全部');
						return;
					}

					self.data.filterConditions[filterType].push(value);
					if (self.data.filterConditions[filterType].length == listLength) {
						$('input[conditionType=' + filterType + ']').prop("checked", true);
						self.methods.getShowArr(filterType, '全部');
						return;
					}

					for (var i in conditions[filterType].checkList) {
						var curItem = conditions[filterType].checkList[i];
						if (self.data.filterConditions[filterType].indexOf(curItem.code + '') >= 0) {
							showText += "  " + curItem.name;
						}
					}
					self.methods.getShowArr(filterType, showText);
				} else {
					if (value == "all") {
						$('input[conditionType=' + filterType + ']').prop("checked", false);
						self.data.filterConditions[filterType] = [];
						self.methods.getShowArr(filterType, "");
						return;
					}
					self.data.filterConditions[filterType] = self.data.filterConditions[filterType] || [];
					var index = self.data.filterConditions[filterType].indexOf(value);
					self.data.filterConditions[filterType].splice(index, 1);
					if (self.data.filterConditions[filterType].length != listLength) {
						$('input[conditionType=' + filterType + ']').eq(0).prop("checked", false);
					}
					for (var i in conditions[filterType].checkList) {
						var curItem = conditions[filterType].checkList[i];
						if (self.data.filterConditions[filterType].indexOf(curItem.code + '') >= 0) {
							showText += "  " + curItem.name;
						}
					}
					self.methods.getShowArr(filterType, showText);
				}
			});

			// 删除条件汇总的事件
			$('body').delegate('.condition-item img', 'click', function (evt) {
				var filterType = $(this).parent().attr('conditionType');
				self.data.filterShowText[filterType] = "";
				var inputType = $('input[conditionType=' + filterType + ']').attr('type');
				if (inputType == 'text') {
					self.data.filterConditions[filterType] = '';
					if (filterType == 'createTime') {
						self.data.filterConditions[filterType] = {};
					}
					$('input[conditionType=' + filterType + ']').val('');
				} else if (inputType == 'checkbox') {
					self.data.filterConditions[filterType] = [];
					$('input[conditionType=' + filterType + ']').prop('checked', false);
				} else {
					if (filterType == 'buyer' || filterType == 'seller') {
						self.data.filterConditions[filterType] = [];
					}
				}

				if (isParent(this, $('.filter-part')[0])) {
					self.methods.ajax_tabinfo();
				}

				var tpl = template('tpl-companyList', { companyList: [] });

				$('#searchBuyer ul').html(tpl);

				$('#searchSeller ul').html(tpl);

				var tpl = template('tpl-filter-total', { filterTotal: self.data.filterShowText });
				$('.filter-total').html(tpl);
			})

			// 公司加减的事件
			$('body').delegate('.companyAdd img', 'click', function (evt) {
				var showText = '';
				var curCompanyName = $(this).attr('companyName');
				var curCompanyCode = $(this).attr('companyCode');
				var curCompanyTaxNo = $(this).attr('companyTaxNo');
				var curSrc = $(this).attr('src');
				var inner = $(this).attr('inner');
				var filterType = inner == 'purchaser' ? 'buyer' : 'seller';
				var curCompany = {
					companyName: curCompanyName,
					companyCode: curCompanyCode,
					CompanyTaxNo: curCompanyTaxNo
				};

				self.data.filterConditions[filterType] = self.data.filterConditions[filterType] || [];
				if (curSrc == './assets/images/add.jpg') {
					self.data.filterConditions[filterType].push(curCompany);
					$(this).attr('src', './assets/images/delete.png')
				} else {
					var index = self.methods.hasCompany(curCompany);
					self.data.filterConditions[filterType].splice(index, 1);
					$(this).attr('src', './assets/images/add.jpg')
				}

				for (var i in self.data.filterConditions[filterType]) {
					if(self.data.filterConditions[filterType].hasOwnProperty(i)){
                       showText += self.data.filterConditions[filterType][i].companyName + ' ';
					}	
				}
				self.methods.getShowArr(filterType, showText);


				self.methods.ajax_tabinfo();
			})

			$('.account-range').delegate("input[conditionType='accountRange']", 'keyup', function () {
				var fromAccount = $('.accountfrom').val();
				var toAccount = $('.accountto').val();
				if (fromAccount && !toAccount) {
					self.methods.getShowArr('accountRange', fromAccount + '以上')
				} else if (!fromAccount && toAccount) {
					self.methods.getShowArr('accountRange', toAccount + '以下')
				} else if (!fromAccount && !toAccount) {
					self.methods.getShowArr('accountRange', '')
				} else {
					self.methods.getShowArr('accountRange', fromAccount + '~' + toAccount)
				}
			})

			$('#searchBuyer .helpSearchInput').on('keyup', throttle(function () {
				var keyword = $(this).val();
				$('#searchBuyer ul').html('');
				self.methods.ajax_companyinfo(false, keyword);
			}, 200 ,1000));

			$('#searchSeller .helpSearchInput').on('keyup', function () {
				var keyword = $(this).val();
				$('#searchSeller ul').html('');
				self.methods.ajax_companyinfo(true, keyword);
			});

			$('.fromCompany').on('click', function (evt) {
				self.data.buyerCompanyPageidx = 0;
				$('#searchSeller ul').html('');
				$('#searchSeller .helpSearch').toggle();
			});

			$('.toCompany').on('click', function (evt) {
				self.data.sellerCompanyPageidx = 0;
				$('#searchBuyer ul').html('')
				$('#searchBuyer .helpSearch').toggle();
			});

			$('.applyFilterBtn').on('click', function () {
				$('#filterModal').modal('hide');
				self.methods.ajax_tabinfo();
			});

			$('body').on('click', function (evt) {
				var event = window.event || evt;
				var target = event.target || event.srcElement;

				if (!isParent(target, $('#searchSeller')[0])) {
					$('#searchSeller .helpSearch').hide();
				}

				if (!isParent(target, $('#searchBuyer')[0])) {
					$('#searchBuyer .helpSearch').hide();
				}
			})

			$('body').delegate('.bottomBar .selectAll', 'click', function () {
				var selectAll = $(this).prop('checked');
				self.data.selectAll = selectAll;
				$('[sid] input').prop('checked', selectAll);

				$('[sid] input').attr("disabled", selectAll);

				var totalLength = 0;
				for (var i = 0; i < self.data.tabs.length; i++) {
					if (self.data.tabs[i].catalog == self.data.tabcatalog) {
						totalLength = self.data.tabs[i].count;
					}
				}

				var tpl = template('tpl-bottom', { totalLength: totalLength, selectLength: totalLength });
				$('.bottomBar').html(tpl);
				$('.bottomBar .selectAll').prop('checked', selectAll);
			});

			$('#card-list').scrollLoading({
				'fireDistence': 30,
				'callback': function () {

					self.data.pageidx++;

					self.ajax_invoice_list();
				}
			});

			$('#maininfo').scrollLoading({
				'fireDistence': 10,
				'callback': function () {

					self.data.logPageidx++;

					self.methods.ajax_get_action_record()
				}
			})

			$('#searchBuyer .helpSearch ul').scrollLoading({
				'fireDistence': 10,
				'callback': function () {

					self.data.buyerCompanyPageidx++;

					var keyword = $('#searchBuyer .helpSearchInput').val();

					self.methods.ajax_companyinfo(false, keyword);

				}
			});

			$('#searchSeller .helpSearch ul').scrollLoading({
				'fireDistence': 10,
				'callback': function () {

					self.data.sellerCompanyPageidx++;

					var keyword = $('#searchBuyer .helpSearchInput').val();

					self.methods.ajax_companyinfo(true, keyword);

				}
			});



		},

		calcFrameSize: function () {

			var wheight = $(window).height();

			$('.cbody').height((wheight - 96) + 'px');

			$('#maininfo').height((wheight - 150) + 'px');

			$('.main-panel').height(wheight + 'px');

			$(window).on('resize', function () {

				var wheight = $(window).height();

				$('.cbody').height((wheight - 60) + 'px');

				$('#maininfo').height((wheight - 105) + 'px');

				$('.main-panel').height(wheight + 'px');
			});
		},

		invoiceTypeForClass:function(data){

	        if(data.amountWithoutTax<0){

	          	if(data.invoiceType == "s"){

	            	return 'zhuan red';

	          	}else if(data.invoiceType == "c"){

	            	return 'pu red'

	          	}else if(data.invoiceType == "ce"){

	            	return 'pu red'
	          	}

	        }else{

	          	if(data.invoiceType == "s"){

	            	return 'zhuan'

	          	}else if(data.invoiceType == "c"){

	            	return 'pu'

	          	}else if(data.invoiceType == "ce"){

	            	return 'pu'
	          	}
	        }
      	},

		setTabFocus: function (arg) {

			var tabcatalog = null;

			if (typeof arg == 'number') {

				tabcatalog = arg;

				$('[tabcatalog]').removeClass('focus');

				$('[tabcatalog=' + arg + ']').addClass('focus');

			} else {

				if (arg.target) {

					tabcatalog = $(arg.target).parents('li').attr('tabcatalog');

					$('[tabcatalog]').removeClass('focus');

					$('[tabcatalog=' + tabcatalog + ']').addClass('focus');
				}
			}

			if (tabcatalog) {

				this.data.pageidx = 0;

				this.data.tabcatalog = tabcatalog;

				$('#card-list').html('');

				$('.right-box').hide();

				$('#card-list').scrollLoading().reset();

				this.ajax_invoice_list();
			}
		},

		setDetailTabFocus: function (tab) {
			$('.maininfo').scrollLoading().lock();

			$('#maininfo').html('');

			this.data.detailTab = tab;

			if (tab == 'invoiceBasic') {

				this.refreshInvoiceBasic(this.data.detail);
			}

			if (tab == 'invoiceDetail') {

				this.refreshInvoiceDetailList(this.data.detail);
			}

			if (tab == 'invoiceLog') {

				this.refreshInvoiceLogs(this.data.detail);
			}
		},

		refreshInvoiceBasic: function (data) {

			if (!data.invoiceMain) {

				return;
			}

			var baseinfo = data.invoiceMain;
			var details = data.invoiceDetails;

			var tpl = template('tpl-right-baseinfo', { baseinfo: baseinfo, details: details });

			$('#maininfo').append(tpl);

			var tpl = template('tpl-full-invoice', { baseinfo: baseinfo, details: details });

			$('#maininfo').append(tpl);

			this.showActionButtons();
		},

		refreshInvoiceDetailList: function (data) {

			if (!data.invoiceMain) {

				return;
			}

			var baseinfo = data.invoiceMain;
			var details = data.invoiceDetails;

			var tpl = template('tpl-right-baseinfo', { baseinfo: baseinfo, details: details });

			$('#maininfo').append(tpl);

			var tpl = template('tpl-invoice-detailList', { baseinfo: baseinfo, details: details });

			$('#maininfo').append(tpl);

			this.showActionButtons();

			var detailsTr = $('.detailBox tr');
			for (var i = 0; i < detailsTr.length; i++) {
				if (i % 2 == 1) {
					$(detailsTr[i]).css('backgroundColor', '#f2f2f2')
				}
			}
		},

		refreshInvoiceLogs: function (data) {
			if (!data.invoiceMain) {

				return;
			}

			$('#maininfo').scrollLoading().reset();

			this.data.logPageidx = 0;

			var baseinfo = data.invoiceMain;
			var details = data.invoiceDetails;

			var tpl = template('tpl-right-baseinfo', { baseinfo: baseinfo, details: details });

			$('#maininfo').append(tpl);

			var tpl = template('tpl-log-box', {});

			$('#maininfo').append(tpl);

			this.ajax_get_action_record(this.data.invoiceId);

		},

		renderFilterModal: function () {

			var self = this;

			var tpl = template('tpl-filter-modal', conditions);

			$('.head').append(tpl);

			var wheight = $(window).height();

			$('.filter-modal .modal-body').css('maxHeight', (wheight - 48) + 'px');

			$(window).on('resize', function () {

				var wheight = $(window).height();

				$('.filter-modal .modal-body').css('maxHeight', (wheight - 48) + 'px');
			});

			$('.datefrom').dcalendarpicker({ format: 'yyyy-mm-dd' });

			$('.dateto').dcalendarpicker({ format: 'yyyy-mm-dd' });

			$('.calendar').click(function (evt) {
				self.data.filterConditions['paperDrewDate'] = self.data.filterConditions['paperDrewDate'] || {};
				var fromDate = $('.datefrom').val();
				var toDate = $('.dateto').val();
				self.data.filterConditions['paperDrewDate'].first = fromDate.replace(/-/g, '') + '000000000';
				self.data.filterConditions['paperDrewDate'].second = toDate.replace(/-/g, '') + '235959999';
				if (fromDate && !toDate) {
					self.methods.getShowArr('paperDrewDate', fromDate + '之后')
				} else if (!fromDate && toDate) {
					self.methods.getShowArr('paperDrewDate', toDate + '之前')
				} else if (!fromDate && !toDate) {
					self.methods.getShowArr('paperDrewDate', '')
				} else {
					self.methods.getShowArr('paperDrewDate', fromDate + '~' + toDate)
				}

			})
		},

		renderTaskCenter: function() {
			 console.log('renderTaskCenter')

			 var self= this;
			 
			 var tpl= template('tpl_task_center', {});

			 $('.head').append(tpl);
		},

		// 操作按钮的显示控制
		showActionButtons: function () {

			var self = this;


			var permission = self.data.detail.permission;

			$('.operateBtn').each(function (idx, dom) {

				dom = $(dom);

				var invoiceMain = self.data.detail.invoiceMain;

				var btn_tabs = dom.attr('tabs'),
					btn_auth = dom.attr('auth'),
					btn_catalog = dom.attr('catalog'),
					btn_invoiceOrigin = dom.attr('invoiceOrigin'),
					btn_invoiceType = dom.attr('invoiceType'),
					btn_redFlag = dom.attr('redFlag');

				if(!btn_catalog) {
					for (var i = 0; i < permission.length; i++) {
						if (btn_auth.indexOf(permission[i]['nodeEname']) != -1 && permission[i]['hasPermission'] === true) {
                           dom.show();
						}
				    } 
				}
					
				if (btn_catalog && btn_catalog.indexOf(self.data.tabcatalog) != -1 &&
					btn_tabs.indexOf(self.data.detailTab) != -1) {

					for (var i = 0; i < permission.length; i++) {

						if (btn_auth.indexOf(permission[i]['nodeEname']) != -1 && permission[i]['hasPermission'] === true) {
							if (btn_invoiceOrigin.indexOf(invoiceMain.invoiceOrig) != -1 && btn_invoiceType.indexOf(invoiceMain.invoiceType)) {
								if (!btn_redFlag) {
									dom.show();
								} else if (btn_redFlag && btn_redFlag.indexOf(invoiceMain.redFlag) != -1) {

									dom.hide();
								} else {
									if (invoiceMain.paperDrewDate.substr(4, 2) == new Date().getMonth() + 1) {
										dom.show();
									}
								}
							}
						}
					}
				}
			});
		},

		// 弹出export弹框
		show_export_dialog: function () {
			var tpl_dialog_body = template('tpl_dialog_export', {});

			showDialog({
				'title': '请选择发票导出类型',
				'content': tpl_dialog_body,
				'showFoot': false
			});
		},


		// 导出发票
		action_export_invoice: function () {
			var self = this;
			var detailFlag = Boolean($("dialog_export input[name='exportFlag']:checked").val());

			if (self.data.selectAll) {
				var url = '/api-v1/invoice/export-with-cond?hadDetails=' + detailFlag + '&handleStatus=' + self.data.tabcatalog;
				var handleFilterConditions = self.handleFilter();
				Ajax.post(url, {
					'apiKey': 'x0201080',
					'data': JSON.stringify(handleFilterConditions)
				}, function (err, data) {
					if (data && data.code == 1) {
						$('.dialog_export').closest('.dialog').remove();
						showMessage('导出发票成功');
					}
				})
			} else {
				var url = '/api-v1/invoice/export-with-ids?hadDetails=' + detailFlag;
				Ajax.post(url, {
					'apiKey': 'x0201080',
					'data': JSON.stringify(self.data.selectIds)
				}, function (err, data) {
					if (data && data.code == 1) {
						$('.dialog_export').closest('.dialog').remove();
						showMessage('导出发票成功');
					}
				})
			}

		},

		// 作废发票
		action_invalid_invoice: function () {

			var self = this;

			var url = '/api-v1/invoice/abandon?invoiceId=' + self.data.invoiceId + '&userSessionId=' + self.data.userSessionId;

			Ajax.post(url, {
				'apiKey': 'x0201140',
				'data': JSON.stringify({})
			}, function (err, data) {
				var contentmsg = '';
				if (data && data.code == 1) {
					contentmsg = '作废中...'
					var dialog = showDialog({
						'title': '作废',
						'content': contentmsg
					})
					self.methods.ajax_polling(dialog, 'invalid');
				} else {
					showMessage({ 'type': 'warn', 'message': data.message });
				}
			});
		},

		click_redEdit: function () {
			var self = this;
			if (self.data.detail.invoiceMain.invoiceType == 's') {
				var detail = this.data.detail;
				var tpl_dialog_body = template('tpl_dialog_redEdit', {});

				showDialog({
					'title': '红冲发票',
					'content': tpl_dialog_body,
					'showFoot': false
				});
			} else {
				self.action_red_invoice();
			}
		},

		// 红冲发票
		action_red_invoice: function () {
			var self = this;
			var redNotificationNo = '';
			if ($('.dialog_redEdit input')) {
				redNotificationNo = $('.dialog_redEdit input').val();
			}

			Ajax.post('/api-v1/invoice/red-edit', {
				'apiKey': 'x0201130',
				'data': JSON.stringify({ 'invoiceId': self.data.invoiceId, 'redNotificationNo': redNotificationNo })
			}, function (err, data) {
				if (data && data.code == 1) {
					showMessage({ 'type': '', 'message': data.message });
				} else {
					showMessage({ 'type': 'error', 'message': data.message });
				}
			})
		},

		// 打印发票
		action_print_invoice: function () {
			var self = this;
			Ajax.post('/api-v1/invoice/print/main?invoiceId=' + self.data.invoiceId + '&userSessionId=' + self.data.userSessionId, {
				'apiKey': 'x0201090',
				'data': JSON.stringify({})
			}, function (err, data) {
				if (data && data.code == 1) {
					contentmsg = '打印发票中...'
					var dialog = showDialog({
						'title': '打印发票',
						'content': contentmsg
					})
					self.methods.ajax_polling(dialog);
				} else {
					showMessage({ 'type': 'error', 'message': data.message });
				}
			})
		},

		action_printList: function () {
			var detail = this.data.detail;
			var tpl_dialog_body = template('tpl_dialog_printList', detail);

			showDialog({
				'title': '',
				'content': tpl_dialog_body,
				'showHead': false,
				'showFoot': false
			});
		},

		// 打印销货清单(直连打印)
		action_printDetailList_invoice: function () {
			var self = this;
			Ajax.post('/api-v1/invoice/print/sales?invoiceId=' + self.data.invoiceId + '&userSessionId=' + self.data.userSessionId, {
				'apiKey': 'x0201091',
				'data': JSON.stringify({})
			}, function (err, data) {
				if (data && data.code == 1) {
					contentmsg = '直连打印中...'
					var dialog = showDialog({
						'title': '直连打印',
						'content': contentmsg
					})
					$('.dialog_printList').closest('.dialog').remove();
					self.methods.ajax_polling(dialog);
				} else {
					$('.dialog_printList').closest('.dialog').remove();
					showMessage({ 'type': 'error', 'message': data.message });
				}
			})
		},

		// 打印销货清单(导出PDF)
		action_printDetailListPDF_invoice: function () {
			var self = this;
			Ajax.post('/api-v1/invoice/export/account-sales?ext=pdf', {
				'apiKey': 'x0201092',
				'data': JSON.stringify([self.data.invoiceId])
			}, function (err, data) {
				if (data && data.code == 1) {
					$('.dialog_printList').closest('.dialog').remove();
					showMessage(data.message);
				} else {
					$('.dialog_printList').closest('.dialog').remove();
					showMessage({ 'type': 'error', 'message': data.message });
				}
			})
		},

		// 轮询后台返回消息
		ajax_polling: function (dialog, type) {
			var self = this;
			Ajax.post('/api-v1/invoice/message/polling', {
				'apiKey': 'x0201000',
				'data': JSON.stringify({
					userId: '',
					sessionId: self.data.userSessionId
				})
			}, function (err, data) {
				var contentmsg = '';
				if (data && data.code == 1) {
					if (data.message.split('___').length > 0) {
						contentmsg = data.message.split('___').pop();
					}
					if (contentmsg.length > 0) {
						dialog.remove();
						showDialog({
							'title': '确认',
							'content': contentmsg
						}, function () {
							self.removeInvoiceItemFormLeftList(self.data.detail.invoiceId);
						});
					} else {
						setTimeout(bind(function () { self.methods.ajax_polling(dialog) }, self), 3000)
					}
				} else {
					showMessage({ 'type': 'warn', 'message': data.message });
				}
			});
		},

		// 隐藏底部
		hideBottom: function() {
			$('.bottomBar').hide();
		}

	},

	mounted: function () {
		template.defaults.escape = false;

		this.initEvent();

		this.calcFrameSize();

		this.renderHeader();

		this.renderTaskCenter();

		this.renderFilterModal();
	}
});

function isParent(obj, parentObj) {
	while (obj) {
		if (obj == parentObj) {
			return true;
		}
		obj = obj.parentNode;
	}
	return false;
}

function throttle(fn, delay, mustRunDelay){
 	var timer = null;
 	var t_start;
 	return function(){
 		var context = this, args = arguments, t_curr = +new Date();
 		clearTimeout(timer);
 		if(!t_start){
 			t_start = t_curr;
 		}
 		if(t_curr - t_start >= mustRunDelay){
 			fn.apply(context, args);
 			t_start = t_curr;
 		}
 		else {
 			timer = setTimeout(function(){
 				fn.apply(context, args);
 			}, delay);
 		}
 	};
 };