var conditions = {
  buyer: {
    text: '购方公司'
  },
  seller: {
    text: '销方公司'
  },
  settlementNo: {
    text: '结算单号'
  },
  contractNo: {
    text: '合同编号'
  },
  settlementPeriod: {
    text: '结算期间'
  },
  createTime: {
    text: '日期范围',
    fromDate: '',
    toDate: ''
  },
  ext: {
    text: '业务扩展字段'
  },
  invoiceType: {
    text: '发票类型',
    isAll: false,
    checkList: [
      {
        name: '增值税普通发票',
        code: 'c',
        checked: false
      }, {
        name: '增值税专用发票',
        code: 's',
        checked: false
      }, {
        name: '增值税电子普通发票',
        code: 'ce',
        checked: false
      }
    ]
  },
  redFlag: {
    text: '单据类型',
    isAll: false,
    checkList: [
      {
        name: '红字结算单',
        code: 1,
        checked: false
      }, {
        name: '蓝字结算单',
        code: 0,
        checked: false
      }
    ]
  },
  upload: {
    text: '单据来源',
    isAll: false,
    checkList: [
      {
        name: '我方上传',
        code: 1,
        checked: false
      }, {
        name: '我方接受',
        code: 0,
        checked: false
      }
    ]
  },
  invoiceMakeStatus: {
    text: '开具状态',
    isAll: false,
    checkList: [
      {
        name: '部分开具',
        code: '1',
        checked: false
      }, {
        name: '未开具',
        code: '0',
        checked: false
      }, {
        name: '全部开具',
        code: '2',
        checked: false
      }
    ]
  },
  accountRange: {
    text: '金额范围',
    checkList: [
      {
        name: '不含税金额',
        code: '0',
        checked: false
      }, {
        name: '含税金额',
        code: '1',
        checked: false
      }, {
        name: '税额',
        code: '2',
        checked: true
      }
    ],
    minAccount: '',
    maxAccount: '',
    showText: ''
  }
};

window.header = widget({
  name: 'settlement-header',
  tplname: 'tpl-settlement_header',
  data: {
    filterConditions: {}, // 筛选条件
    filterShowText: {}, // 筛选条件展示文本
    currentExtType: {},
    allExtArr: [],
    buyerCompanyPageidx: 0,
    sellerCompanyPageidx: 0
  },

  create: function () {
    
  },

  methods: {
    //渲染头部
    'renderHeader': function () {
      var tpl = template('tpl-header-content', {});
      $('.head-content').append(tpl);
    },

    // 渲染filter-modal
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

      $('.datefrom').dcalendarpicker({format: 'yyyy-mm-dd'});

      $('.dateto').dcalendarpicker({format: 'yyyy-mm-dd'});

      $('.yearMonth').dcalendarpicker({format: 'yyyy-mm-dd'})

      $('.date-range .datepicker .calendar').click(function (evt) {
        self.data.filterConditions['createTime'] = self.data.filterConditions['createTime'] || {};
        var fromDate = $('.datefrom').val();
        var toDate = $('.dateto').val();
        self.data.filterConditions['createTime'].first = fromDate;
        self.data.filterConditions['createTime'].second = toDate;
        if (fromDate && !toDate) {
          self
            .methods
            .getShowArr('createTime', fromDate + '之后')
        } else if (!fromDate && toDate) {
          self
            .methods
            .getShowArr('createTime', toDate + '之前')
        } else if (!fromDate && !toDate) {
          self
            .methods
            .getShowArr('createTime', '')
        } else {
          self
            .methods
            .getShowArr('createTime', fromDate + '~' + toDate)
        }
      })

      $('.settlePeriod .calendar').click(function (evt) {
        self.data.filterConditions['settlementPeriod'] = self.data.filterConditions['settlementPeriod'] || {};
        var yearMonth = $('.yearMonth').val();
        yearMonth = yearMonth
          .replace(/-/g, "")
          .substring(0, 6);
        self.data.filterConditions['settlementPeriod'] = yearMonth;
        self
          .methods
          .getShowArr('settlementPeriod', yearMonth);
      })
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

      // 对公司条件和业务扩展进行特殊处理
      for (var j in filterConditions) {
        if (j == 'buyer') {
          var purchaserCode = [];
          var purchaserTaxNo = [];
          var purchaserName = [];
          filterConditions
            .buyer
            .forEach(function (item) {
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
          filterConditions
            .seller
            .forEach(function (item) {
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
        } else if (j == 'ext') {
          handleFilterConditions.ext = filterConditions
            .ext
            .map(function (item) {
              var extItem = {};
              extItem.first = item.extColIndex;
              extItem.second = item.extCode;
              return extItem;
            })
        }
      }

      //对于全选或者全不选进行处理
      for (var i in self.data.filterShowText) {
        if (i != 'buyer' && i != 'seller' && i != 'ext' && self.data.filterShowText[i] != '' && !/全部$/.test(self.data.filterShowText[i])) {
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
          if (i == 'redFlag') {
            handleFilterConditions[i] = Boolean(Number(filterConditions[i][0]));
          } else if (i == 'upload') {
            handleFilterConditions[i] = filterConditions[i][0];
          } else {
            handleFilterConditions[i] = filterConditions[i];
          }
        }
      }

      return handleFilterConditions;
    },

    'ajax_companyinfo': function (inner, keyword) {

      var self = this;

      if (!inner) {
        page = self.data.buyerCompanyPageidx;
      } else {
        page = self.data.sellerCompanyPageidx;
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
          data
            .forEach(function (item) {
              item.inner = 'purchaser';
            })
          var tpl = template('tpl-companyList', {'companyList': data});
          $('#searchBuyer ul')
            .append(tpl)
            .scrollLoading()
            .unLock();

          if (data.length == 0) {

            $('#searchBuyer ul')
              .scrollLoading()
              .noMore();
          }
        } else {
          data
            .forEach(function (item) {
              item.inner = 'seller';
            })
          var tpl = template('tpl-companyList', {'companyList': data});

          $('#searchSeller ul')
            .append(tpl)
            .scrollLoading()
            .unLock();

          if (data.length == 0) {

            $('#searchSeller ul')
              .scrollLoading()
              .noMore();
          }

        }
      });
    },

    'ajax_get_extArr': function () {
      var self = this;

      Ajax.get('/api-v1/settlement/extArray', {
        'apiKey': 'x0101000',
        'data': {}
      }, function (err, data) {
        if (data && data.length > 0) {
          self.data.allExtArr = data;
          self.data.currentExtType = data[0];
        } else {
          self.data.currentExtType = {};
        }

        self.renderBusinessExtend();
      })
    },

    renderBusinessExtend: function () {
      var self = this;
      var tpl = template('tpl-business', {
        list: self.data.allExtArr,
        currentType: self.data.currentExtType
      });
      $('.businessExtend').html(tpl);

      var tpl = template('tpl-searchList', {searchExtList: []});
      $('.businessExtend .helpSearch ul').html(tpl);

      $('#searchExtend .helpSearchInput').on('keyup', function () {
        var keyWord = $(this)
          .val()
          .replace(/\s/g, '');
        self
          .data
          .currentExtType
          .list
          .forEach(function (item) {
            item.extColIndex = self.data.currentExtType.extColIndex;
          })
        var searchExtList = self
          .data
          .currentExtType
          .list
          .filter(function (item) {
            return item
              .extName
              .indexOf(keyWord) > -1
          })

        for (var i in searchExtList) {
          if (self.hasExt(searchExtList[i]) >= 0) {
            searchExtList[i].operateIcon = './assets/images/delete.png';
          } else {
            searchExtList[i].operateIcon = './assets/images/add.jpg';
          }
        }

        var tpl = template('tpl-searchList', {searchExtList: searchExtList});
        $('.businessExtend .helpSearch ul').html(tpl);
      })
    },

    hasCompany: function (company) {
      var self = this;
      self.data.filterConditions['buyer'] = self.data.filterConditions['buyer'] || []
      for (var i = 0; i < self.data.filterConditions['buyer'].length; i++) {
        var nowCompany = self.data.filterConditions['buyer'][i];
        if (company.companyName == nowCompany.companyName && company.companyNo == nowCompany.companyNo && company.companyTaxNo == nowCompany.companyTaxNo) {
          return i;
        }
      }
      return -1;
    },

    hasExt: function (ext) {
      var self = this;
      self.data.filterConditions['ext'] = self.data.filterConditions['ext'] || []
      for (var i = 0; i < self.data.filterConditions['ext'].length; i++) {
        var nowExt = self.data.filterConditions['ext'][i];
        if (ext.extCode == nowExt.extCode && ext.extColIndex == nowExt.extColIndex) {
          return i;
        }
      }
      return -1;
    },

    // 改变筛选条件时动态更新显示
    getShowArr: function (type, value) {
      var self = this;
      var title = '';
      if (type == 'ext') {
        title = self.data.currentExtType.extColName;
      } else {
        title = conditions[type].text;
      }

      if (!value) {
        this.data.filterShowText[type] = value;
      } else {
        this.data.filterShowText[type] = title + ':' + value;
      }

      var tpl = template('tpl-filter-total', {filterTotal: this.data.filterShowText});
      $('.filter-total').html('');
      $('.filter-total').append(tpl);
    },

    // 初始化一些事件
    initEvent: function () {

      var self = this;

      // 筛选条件文本框改变事件
      $('body').delegate(".filter-row>span>input[type='text']", 'keyup propertychange', function (evt) {
        var value = $(this).val();
        var filterType = $(this).attr('conditionType');
        self.data.filterConditions[filterType] = value;
        self
          .methods
          .getShowArr(filterType, value);
      });

      // checkbox改变事件
      $('body').delegate(".filter-row input[type='checkbox']", 'click', function (evt) {
        var showText = '';
        var checked = this.checked;
        var filterType = $(this).attr('conditionType');
        var text = $(this)
          .next('label')
          .text();
        var value = $(this).attr('value');
        var listLength = $('input[conditionType=' + filterType + ']').length - 1;
        if (checked) {
          self.data.filterConditions[filterType] = self.data.filterConditions[filterType] || [];

          if (value == "all") {
            $('input[conditionType=' + filterType + ']').prop("checked", true);
            for (var i = 1; i < listLength + 1; i++) {
              self
                .data
                .filterConditions[filterType]
                .push($('input[conditionType=' + filterType + ']').eq(i).attr('value'));
            }
            self
              .methods
              .getShowArr(filterType, '全部');
            return;
          }

          self
            .data
            .filterConditions[filterType]
            .push(value);
          if (self.data.filterConditions[filterType].length == listLength) {
            $('input[conditionType=' + filterType + ']').prop("checked", true);
            self
              .methods
              .getShowArr(filterType, '全部');
            return;
          }

          for (var i in conditions[filterType].checkList) {
            var curItem = conditions[filterType].checkList[i];
            if (self.data.filterConditions[filterType].indexOf(curItem.code + '') >= 0) {
              showText += "  " + curItem.name;
            }
          }
          self
            .methods
            .getShowArr(filterType, showText);
        } else {
          if (value == "all") {
            $('input[conditionType=' + filterType + ']').prop("checked", false);
            self.data.filterConditions[filterType] = [];
            self
              .methods
              .getShowArr(filterType, "");
            return;
          }
          self.data.filterConditions[filterType] = self.data.filterConditions[filterType] || [];
          var index = self
            .data
            .filterConditions[filterType]
            .indexOf(value);
          self
            .data
            .filterConditions[filterType]
            .splice(index, 1);
          if (self.data.filterConditions[filterType].length != listLength) {
            $('input[conditionType=' + filterType + ']')
              .eq(0)
              .prop("checked", false);
          }
          for (var i in conditions[filterType].checkList) {
            var curItem = conditions[filterType].checkList[i];
            if (self.data.filterConditions[filterType].indexOf(curItem.code + '') >= 0) {
              showText += "  " + curItem.name;
            }
          }
          self
            .methods
            .getShowArr(filterType, showText);
        }
      });

      // 删除条件汇总的事件
      $('body').delegate('.condition-item img', 'click', function (evt) {
        var filterType = $(this)
          .parent()
          .attr('conditionType');
        self.data.filterShowText[filterType] = "";
        var inputType = $('input[conditionType=' + filterType + ']').attr('type');
        if (inputType == 'text') {
          self.data.filterConditions[filterType] = '';
          if (filterType == 'paperDrewDate') {
            self.data.filterConditions[filterType] = {};
          }
          $('input[conditionType=' + filterType + ']').val('');
        } else if (inputType == 'checkbox') {
          self.data.filterConditions[filterType] = [];
          $('input[conditionType=' + filterType + ']').prop('checked', false);
        } else {
          if (filterType == 'buyer' || filterType == 'seller' || filterType == 'ext') {
            self.data.filterConditions[filterType] = [];
          }
        }

        if (isParent(this, $('.filter-part')[0])) {
          page.data.filterCondition = $.extend({}, page.data.basicFilter, self.handleFilter());
          page.ajax_tabinfo();
        }

        $('#searchBuyer ul').html('');

        $('#searchSeller ul').html('');

        $('.businessExtend .helpSearch ul').html('');

        var tpl = template('tpl-filter-total', {filterTotal: self.data.filterShowText});
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
        var filterType = inner == 'purchaser'
          ? 'buyer'
          : 'seller';
        var curCompany = {
          companyName: curCompanyName,
          companyCode: curCompanyCode,
          CompanyTaxNo: curCompanyTaxNo
        };

        self.data.filterConditions[filterType] = self.data.filterConditions[filterType] || [];
        if (curSrc == './assets/images/add.jpg') {
          self
            .data
            .filterConditions[filterType]
            .push(curCompany);
          $(this).attr('src', './assets/images/delete.png')
        } else {
          var index = self
            .methods
            .hasCompany(curCompany);
          self
            .data
            .filterConditions[filterType]
            .splice(index, 1);
          $(this).attr('src', './assets/images/add.jpg')
        }

        for (var i in self.data.filterConditions[filterType]) {
          if (self.data.filterConditions[filterType].hasOwnProperty(i)) {
            showText += self.data.filterConditions[filterType][i].companyName + ' ';
          }
        }
        self
          .methods
          .getShowArr(filterType, showText);

        page.data.filterCondition = $.extend({}, page.data.basicFilter, self.handleFilter());

        page.ajax_tabinfo();

      })

      // 业务扩展字段类型的修改
      $('body').delegate('#searchExtend .dropdown ul li', 'click', function (evt) {
        var index = $(this).attr('currentExtIndex');
        self.data.currentExtType = self.data.allExtArr[index];
        self.renderBusinessExtend();
        self.data.filterShowText['ext'] = "";
        self.data.filterConditions['ext'] = [];
        self.renderBusinessExtend();
        var tpl = template('tpl-filter-total', {filterTotal: self.data.filterShowText});
        $('.filter-total').html(tpl);
      })

      // 业务扩展字段的加减
      $('body').delegate('.extAdd img', 'click', function (evt) {
        var showText = '';
        var extName = $(this).attr('extName');
        var extCode = $(this).attr('extCode');
        var curSrc = $(this).attr('src');
        var filterType = 'ext';

        var curExt = {
          extColIndex: self.data.currentExtType.extColIndex,
          extCode: extCode,
          extName: extName
        };

        self.data.filterConditions[filterType] = self.data.filterConditions[filterType] || [];
        if (curSrc == './assets/images/add.jpg') {
          self
            .data
            .filterConditions[filterType]
            .push(curExt);
          $(this).attr('src', './assets/images/delete.png')
        } else {
          var index = self
            .methods
            .hasExt(curExt);
          self
            .data
            .filterConditions[filterType]
            .splice(index, 1);
          $(this).attr('src', './assets/images/add.jpg')
        }

        for (var i in self.data.filterConditions[filterType]) {
          if (self.data.filterConditions[filterType].hasOwnProperty(i)) {
            showText += self.data.filterConditions[filterType][i].extName + ' ';
          }
        }

        self
          .methods
          .getShowArr(filterType, showText);
      })

      $('.account-range').delegate("input[conditionType='accountRange']", 'keyup', function () {
        var fromAccount = $('.accountfrom').val();
        var toAccount = $('.accountto').val();
        if (fromAccount && !toAccount) {
          self
            .methods
            .getShowArr('accountRange', fromAccount + '以上')
        } else if (!fromAccount && toAccount) {
          self
            .methods
            .getShowArr('accountRange', toAccount + '以下')
        } else if (!fromAccount && !toAccount) {
          self
            .methods
            .getShowArr('accountRange', '')
        } else {
          self
            .methods
            .getShowArr('accountRange', fromAccount + '~' + toAccount)
        }
      })

      $('#searchBuyer .helpSearchInput').on('keyup', throttle(function () {
        var keyword = $(this).val();
        $('#searchBuyer ul').html('');
        self
          .methods
          .ajax_companyinfo(false, keyword);
      }, 200, 1000));

      $('#searchSeller .helpSearchInput').on('keyup', function () {
        var keyword = $(this).val();
        $('#searchSeller ul').html('');
        self
          .methods
          .ajax_companyinfo(true, keyword);
      });

      $('body').delegate('#searchExtend .searchSpan', 'click', function () {
        $('#searchExtend .helpSearch').toggle();
      })

      $('.fromCompany').on('click', function (evt) {
        self.data.buyerCompanyPageidx = 0;
        $('#searchSeller ul').html('');
        $('#searchSeller .helpSearch').toggle();
        $('#searchSeller .helpSearch input').val('');
      });

      $('.toCompany').on('click', function (evt) {
        self.data.sellerCompanyPageidx = 0;
        $('#searchBuyer ul').html('')
        $('#searchBuyer .helpSearch').toggle();
        $('#searchBuyer .helpSearch input').val('');
      });

      $('.applyFilterBtn').on('click', function () {
        $('#filterModal').modal('hide');
        page.data.filterCondition = $.extend({}, page.data.basicFilter, self.handleFilter());
        page.ajax_tabinfo();
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

        if (!isParent(target, $('#searchExtend')[0])) {
          $('#searchExtend .helpSearch').hide();
        }
      })

      $('#searchBuyer .helpSearch ul').scrollLoading({
        'fireDistence': 10,
        'callback': function () {
          console.log('self.data.buyerCompanyPageidx++;')
          self.data.buyerCompanyPageidx++;

          var keyword = $('#searchBuyer .helpSearchInput').val();

          self
            .methods
            .ajax_companyinfo(false, keyword);

        }
      });

      $('#searchSeller .helpSearch ul').scrollLoading({
        'fireDistence': 10,
        'callback': function () {

          self.data.sellerCompanyPageidx++;

          var keyword = $('#searchBuyer .helpSearchInput').val();

          self
            .methods
            .ajax_companyinfo(true, keyword);

        }
      });

    }
  },

  mounted: function () {
    template.defaults.escape = false;

    this.renderHeader();

    this.renderFilterModal();

    this.ajax_get_extArr();

    this.initEvent();

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

function throttle(fn, delay, mustRunDelay) {
  var timer = null;
  var t_start;
  return function () {
    var context = this,
      args = arguments,
      t_curr = +new Date();
    clearTimeout(timer);
    if (!t_start) {
      t_start = t_curr;
    }
    if (t_curr - t_start >= mustRunDelay) {
      fn.apply(context, args);
      t_start = t_curr;
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  };
};
