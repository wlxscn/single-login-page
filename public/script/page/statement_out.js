window.page = widget({
  name: 'statement-out',
  tplname: 'tpl-statement_out',
  data: {
    tabs: null, //当前结算单分类数量数据
    tabcatalog: null, //当前选中的结算单类别（待确认、有变更、对方确认中、待开票、已完成、已作废）
    secondTab: '',
    pageidx: 0, //当前结算单列表分页当前页
    unprint_idx: 0, //预制发票当前页数
    hasprint_idx: 0, //已开发票当前页数
    detail: null, //当前结算单数据
    statementid: '', //当前选中的结算单ID
    key: '', //登陆的key
    filterCondition: {
      'userRole': 1,
      'usageFlag': true
    },
    basicFilter: {
      'userRole': 1,
      'usageFlag': true
    }
  },
  create: function () {
    var self = this;
    if (window.location.href.indexOf('?') != -1) {
      var query = window
        .location
        .href
        .split('?')[1];
      var queryArr = query.split('&');
      for (var i = 0; i < queryArr.length; i++) {
        if (queryArr[i].match(/settlementId=(.*)/)) {
          var match = queryArr[i].match(/settlementId=(.*)/);
          self.data.statementid = match[1];
        } else if (queryArr[i].match(/key=(.*)/)) {
          var match = queryArr[i].match(/key=(.*)/);
          self.data.key = match[1];
        }
      }
    }
    this.ajax_login();
  },
  methods: {

    'ajax_statement_detail': function (sid) {

      var self = this;

      var url = '/api-v1/settlement/' + sid + '/detail?userRole=1&itemPage=0&itemRow=10';

      var operatekeys = [],
        hashoperate = JSON.parse(store.get('operateToken'));

      for (var key in hashoperate) {

        operatekeys.push(key);
      }

      Ajax
        .post(url, {
          'apiKey': 'x0101000',
          'data': JSON.stringify(operatekeys)
        }, function (err, data) {

          if (data) {

            self.data.detail = data;

            self.updateRightTabInfo(data);

            self.setDetailTabFocus('unprint');

            $('.right-box').show();

            loading('#detail_loading', 'stop');
          }
        });
    },

    'ajax_get_pre_invoice': function () {

      var self = this;

      var url = '/api-v1/settlement/' + self.data.statementid + '/invoice/pre?page=' + self.data.unprint_idx + '&row=1';

      Ajax.get(url, {
        'apiKey': 'x0101000'
      }, function (err, data) {

        $('#rt-scroll')
          .scrollLoading()
          .unLock();

        if (data && data.length > 0) {
          var originLen = $('.invoice-big-box').length;
          var tpl = template('tpl-invoice', {
            'list': data,
            'tab': 'unprint',
            'invoiceNums': self.data.detail.main.canMakeInvoiceNums,
            'originLen': originLen
          });

          $('#maininfo').append(tpl);

        } else {

          $('#rt-scroll')
            .scrollLoading()
            .noMore();
        }
      });
    },

    'ajax_get_print_invoice': function () {

      var self = this;

      var url = '/api-v1/settlement/' + self.data.statementid + '/invoice/list?page=' + self.data.hasprint_idx + '&row=2';

      Ajax.get(url, {
        'apiKey': 'x0101000'
      }, function (err, data) {

        $('#rt-scroll')
          .scrollLoading()
          .unLock();

        if (data && data.length > 0) {
          var originLen = $('.invoice-big-box').length;
          var tpl = template('tpl-invoice', {
            'list': data,
            'tab': 'hasprint',
            'invoiceNums': self.data.detail.main.invoiceNums,
            'originLen': originLen
          });

          $('#maininfo').append(tpl);

        } else {

          $('#rt-scroll')
            .scrollLoading()
            .noMore();
        }
      });
    },

    'ajax_register_info': function (sid) {

      var self = this;

      var url = '/api-v1/invoice/message/register';

      var time = new Date().getTime();

      Ajax.post(url, {
        'apiKey': 'x0201000',
        'data': JSON.stringify({'sessionId': time, 'userId': ''})
      }, function (err, data) {

        if (data && data.code == 1) {

          self.data.sessionId = time;
        }
      });
    },

    'ajax_get_action_record': function (sid) {

      var self = this;

      var url = '/api-v1/settlement/' + sid + '/history';

      Ajax.get(url, {
        'apiKey': 'x0101000',
        'data': {
          page: 0,
          row: 12
        }
      }, function (err, data) {

        if (data && data.length > 0) {

          var tpl = template('tpl-log-item', {'list': data});

          $('.log-con').append(tpl);
        }
      });
    },

    'ajax_login': function () {
      var self = this;

      var url = '/api-v1/security/login';

      var data = {
        "authenType": "SSO",
        "password": self.data.key,
        "username": "wam"
      }

      Ajax.post(url, {
        data: JSON.stringify(data)
      }, function (err, data) {
        var token = data.token;
        var operations = data.operations;
        store.set('token', token);
        store.set('operateToken', JSON.stringify(operations));
        self.ajax_statement_detail(self.data.statementid);
        self.ajax_register_info();
      })
    },

    initEvent: function () {

      var self = this;

      //右侧详情Tab事件代理
      $('body').delegate('#detail-tabs li', 'click', function (evt) {

        var tab = $(this).attr('tabname');

        self.setDetailTabFocus(tab);
      });

      //右侧详情中 基本信息更多展开事件
      $('body').delegate('#more-baseinfo', 'click', function () {

        if ($(this).attr('opened') == 'true') {

          $('#detail-baseinfo').animate({
            'height': '124px'
          }, 300);

          $(this).attr('opened', 'false');

        } else {

          $('#detail-baseinfo').animate({
            'height': '226px'
          }, 300);

          $(this).attr('opened', 'true');
        }
      });

      $('body').delegate('#selectall_invoice', 'change', function () {

        var isselect = $(this).prop('checked');

        $('[name=biginvoice]').prop('checked', isselect);
      });

    },

    calcFrameSize: function () {

      var wheight = $(window).height();

      $('.cbody').height(wheight + 'px');

      $('.main-panel').height(wheight + 'px');

      $(window).on('resize', function () {

        var wheight = $(window).height();

        $('.cbody').height(wheight + 'px');

        $('.main-panel').height(wheight + 'px');
      });
    },

    updateRightTabInfo: function (data) {

      $('#wkfp').html('未开发票(' + data.preInvoicesCount + ')');

      $('#ykfp').html('已开发票(' + data.main.invoiceNums + ')');
    },

    //右测 结算单状态Tab(未开发票、已开发票、结算单详情、操作记录)
    setDetailTabFocus: function (tab) {

      $('#detail-tabs li').removeClass('active');

      $('[tabname=' + tab + ']').addClass('active');

      $('#maininfo').html('');

      $('#rt-scroll')
        .scrollLoading()
        .destory();

      this.data.unprint_idx = 0;

      this.data.hasprint_idx = 0;

      if (tab == 'unprint') {

        this.refreshUnPrintTab(this.data.detail);

      } else if (tab == 'hasprint') {

        this.refreshHasPrintTab(this.data.detail);

      } else if (tab == 'detail') {

        this.refreshDetailTab(this.data.detail);

      } else if (tab == 'record') {

        this.refreshRecordTab(this.data.detail);
      }
    },

    //刷新右测Tab的内容 （未开发票）
    refreshUnPrintTab: function (data) {

      if (!data.main) {

        return;
      }

      this.data.secondTab = 'unprint';

      var baseinfo = data.main;

      var invoicelist = data.preInvoices;

      /*加入默认ICON*/
      if (!baseinfo.purchaserLogoIcon) {

        baseinfo.purchaserLogoIcon = 'assets/images/default-head-icon.png';
      }

      /*根据发票类型及不含税金额 确定发票的类型图标*/
      baseinfo.invoiceTypeCss = this.invoiceTypeForClass(baseinfo);

      var tpl = template('tpl-right-baseinfo', baseinfo);

      $('#maininfo').append(tpl);

      this.showActionButtons();

      if (invoicelist.length > 0) {

        tpl = template('tpl-invoice', {
          'list': invoicelist,
          'tab': 'unprint',
          'invoiceNums': this.data.detail.main.canMakeInvoiceNums,
          'originLen': 0
        });

        $('#maininfo').append(tpl);

        $('#rt-scroll').scrollLoading({
          'fireDistence': 30,
          'callback': function () {

            page.data.unprint_idx++;

            page.ajax_get_pre_invoice();
          }
        });

      } else {

        tpl = template('tpl-no-invoice', baseinfo);

        $('#maininfo').append(tpl);
      }
    },

    //刷新右测Tab的内容 （已开发票）
    refreshHasPrintTab: function (data) {

      if (!data.main) {

        return;
      }

      this.data.secondTab = 'hasprint';

      var baseinfo = data.main;

      /*加入默认ICON*/
      if (!baseinfo.purchaserLogoIcon) {

        baseinfo.purchaserLogoIcon = '.assets/images/default-head-icon.png';
      }

      /*根据发票类型及不含税金额 确定发票的类型图标*/
      baseinfo.invoiceTypeCss = this.invoiceTypeForClass(baseinfo);

      var tpl = template('tpl-right-baseinfo', baseinfo);

      $('#maininfo').append(tpl);

      var invoicelist = data.invoices;

      if (invoicelist.length > 0) {

        tpl = template('tpl-invoice', {
          'list': invoicelist,
          'tab': 'hasprint',
          'invoiceNums': this.data.detail.main.invoiceNums,
          'originLen': 0
        });

        $('#maininfo').append(tpl);

        $('#rt-scroll').scrollLoading({
          'fireDistence': 30,
          'callback': function () {

            page.data.hasprint_idx++;

            page.ajax_get_print_invoice();
          }
        });
      }
    },

    //刷新右测Tab的内容 （结算单详情）
    refreshDetailTab: function (data) {

      if (!data.main) {

        return;
      }

      this.data.secondTab = 'detail';

      var baseinfo = data.main;

      /*加入默认ICON*/
      if (!baseinfo.purchaserLogoIcon) {

        baseinfo.purchaserLogoIcon = '.assets/images/default-head-icon.png';
      }

      /*根据发票类型及不含税金额 确定发票的类型图标*/
      baseinfo.invoiceTypeCss = this.invoiceTypeForClass(baseinfo);

      var tpl = template('tpl-right-baseinfo', baseinfo);

      $('#maininfo').append(tpl);

      tpl = template('tpl-statement-detail', this.data.detail);

      $('#maininfo').append(tpl);

      tpl = template('tpl-sdetail-tr', this.data.detail);

      $('#maininfo')
        .find('#sdetail-panel')
        .append(tpl);
    },

    refreshRecordTab: function (data) {

      if (!data.main) {

        return;
      }

      this.data.secondTab = 'record';

      var baseinfo = data.main;

      /*加入默认ICON*/
      if (!baseinfo.purchaserLogoIcon) {

        baseinfo.purchaserLogoIcon = 'assets/images/default-head-icon.png';
      }

      /*根据发票类型及不含税金额 确定发票的类型图标*/
      baseinfo.invoiceTypeCss = this.invoiceTypeForClass(baseinfo);

      var tpl = template('tpl-right-baseinfo', baseinfo);

      $('#maininfo').append(tpl);

      var tpl = template('tpl-log-box', {});

      $('#maininfo').append(tpl);

      this.ajax_get_action_record(this.data.statementid);
    },

    showActionButtons: function () {

      var self = this;

      var tpl = template('tpl-right-operate', self.data.detail.main);

      $('#maininfo').append(tpl);

      var permission = self.data.detail.permission;

      $('.btn-group')
        .find('.btn')
        .each(function (idx, dom) {

          var hasAuth = false;

          dom = $(dom);

          var btn_auth = dom.attr('auth');

          for (var i = 0; i < permission.length; i++) {

            if (permission[i]['nodeEname'] == btn_auth && permission[i]['hasPermission'] === true) {
              hasAuth = true;
              break
            }
          }

          if (!hasAuth) {
            dom.hide();
          }
        })

      $('.operate-panel')
        .find('.btn')
        .each(function (idx, dom) {
          var hasAuth = false;

          dom = $(dom);

          var btn_auth = dom.attr('auth');
          if (self.data.secondTab == 'unprint') {
            for (var i = 0; i < permission.length; i++) {
              if (permission[i]['nodeEname'] == btn_auth && permission[i]['hasPermission'] === true) {
                hasAuth = true;
                break;
              }
            }
          }

          if (!hasAuth) {
            dom.hide();
          }

        })
    },

    invoiceTypeForClass: function (data) {

      if (data.amountWithoutTax < 0) {

        if (data.invoiceType == "s") {

          return 'zhuan red';

        } else if (data.invoiceType == "c") {

          return 'pu red'

        } else if (data.invoiceType == "ce") {

          return 'pu red'
        }

      } else {

        if (data.invoiceType == "s") {

          return 'zhuan'

        } else if (data.invoiceType == "c") {

          return 'pu'

        } else if (data.invoiceType == "ce") {

          return 'pu'
        }
      }
    },

    //根据预制发票开具或开具打印发票
    action_issue_invoice_single: function (preinvoiceId, needprint) {

      this.action_issue_invoice('PreInvoiceID', [preinvoiceId], needprint);
    },

    action_issue_invoice_multiple: function (needprint) {

      var self = this;

      if ($('#selectall_invoice').prop('checked')) {

        self.action_issue_invoice('Statement', self.data.statementid, needprint);

      } else {

        var invoiceIds = [];

        $('[name=biginvoice]').each(function (idx, dom) {

          if ($(dom).prop('checked')) {

            invoiceIds.push($(dom).attr('inv_id'));
          }
        });

        if (invoiceIds.length == 0) {

          showMessage({'type': 'warn', 'message': '没有选择发票，不能进行开具操作！'});

          return;
        }

        self.action_issue_invoice('PreInvoiceID', invoiceIds, needprint);
      }
    },

    //详情批量开具按钮
    action_issue_invoice: function (issuetype, ids, needprint) {

      var self = this;

      /*
			success_action 当操作成功后，后要进行的界面更新逻辑，当为remove时从左侧例表删除该条结算单，当为reflash时只需更新结算单详情
			*/
      var url = '',
        apiKey = '',
        param,
        success_action = '';

      if (issuetype == 'Statement') {

        param = {
          'apiKey': 'x0101000',
          'data': JSON.stringify({})
        };

        url = '/api-v1/settlement/check-with-settlement/' + ids + '?userRole=1';

        success_action = 'reflash';

      } else if (issuetype == 'PreInvoiceID') {

        param = {
          'apiKey': 'x0101473',
          'data': JSON.stringify(ids)
        };

        url = '/api-v1/settlement/check-with-preinvoices';

        success_action = 'reflash';

      }

      Ajax
        .post(url, param, function (err, data) {

          if (data && data.status == 1) {

            var mis = data.mis;
            preInvoices = data.preInvoices;

            var tpl = template('tpl_issue_invoice', data);

            showDialog({
              'title': needprint
                ? '开具并打印'
                : '开具',
              'content': tpl
            }, function () {

              var iacode = $('#issue_point').val(),
                ianame;

              for (var i = 0; i < mis.length; i++) {

                if (mis[i]['invoiceAgentCode'] == iacode) {

                  ianame = mis[i]['invoiceAgentAddr'];

                  break;
                }
              }

              var param = {
                'preInvoice': preInvoices,
                'invoiceAgentAddr': ianame,
                'invoiceAgentCode': iacode,
                'printFlag': (needprint
                  ? true
                  : false),
                'userSessionId': page.data.sessionId,
                'sellerCode': page.data.detail.main.sellerCode,
                'sellerName': page.data.detail.main.sellerName
              };

              page.invoiceIssue(param, success_action);
            });

          } else {

            if (data.message) {

              showMessage({'type': 'warn', 'message': data.message});
            }
          }
        });
    },

    invoiceIssue: function (param, update_action) {

      var self = this;

      var url = '/api-v1/settlement/invoice';

      Ajax.post(url, {
        'apiKey': 'x0101471',
        'data': JSON.stringify(param)
      }, function (err, data) {

        if (data && data.code == 1) {

          param.mqInvoiceType = data.result.mqInvoiceType;

          self.pendingInvoiceIssue(param, update_action);

        } else {

          var msg = err
            ? err.message
            : data.message;

          showMessage({'type': 'error', 'message': msg});
        }
      });
    },

    pendingInvoiceIssue: function (param, update_action) {

      var self = this;

      var tipsword = param.printFlag
        ? '发票正在开具中'
        : '发票正在开具打印中';

      var tpl = '<div class="pendingissue" style="padding-left:32%">' + tipsword + '</div>';

      var handelLoopTips = null,
        dialog;

      var loopPending = function () {

        var loopnum = 0;

        handelLoopTips = setInterval(function () {

          loopnum = ++loopnum % 6;

          var point = '';

          for (var i = 0; i < loopnum; i++) {

            point += '。';
          }

          $('.pendingissue').html(tipsword + point);

          if (loopnum == 0) {

            var url = '/api-v1/invoice/message/polling';

            Ajax.post(url, {
              'apiKey': 'x0201000',
              'data': JSON.stringify({"sessionId": page.data.sessionId, "userId": ""})
            }, function (err, data) {

              if (data && data.code == 1 && data.message != '') {

                if (/下一张/.test(data.message)) {

                  var confirm_url = '/api-v1/invoice/pre/makeoutconfirm';

                  showDialog({
                    'title': '确认',
                    'content': data.message,
                    'label_ok': '继续'
                  }, function () {

                    Ajax.post(confirm_url, {
                      'apiKey': 'x0101473',
                      'data': JSON.stringify(param)
                    });

                  }, function () {

                    dialog.remove();

                    clearInterval(handelLoopTips);
                  });

                } else {

                  dialog.remove();

                  clearInterval(handelLoopTips);

                  showDialog({'title': '结果', 'content': data.message, 'label_cancel': null});

                  if (data.message.indexOf('成功') != -1) {

                      self.ajax_statement_detail(self.data.statementid);
                  }
                }
              }
            });
          }

        }, 400);
      }

      dialog = showDialog({
        'title': '',
        'content': tpl,
        'label_ok': '关闭弹框',
        'label_cancel': null
      }, function () {

        clearInterval(handelLoopTips);
      });

      loopPending();
    },

    // 作废发票
    action_invalid_invoice: function (id) {

      var self = this;

      var url = '/api-v1/invoice/abandon?invoiceId=' + id + '&userSessionId=' + self.data.sessionId;

      Ajax.post(url, {
        'apiKey': 'x0201140',
        'data': JSON.stringify({})
      }, function (err, data) {
        var contentmsg = '';
        if (data && data.code == 1) {
          contentmsg = '作废中...'
          var dialog = showDialog({'title': '作废', 'content': contentmsg})
          self
            .methods
            .ajax_polling(dialog, 'invalid');
        } else {
          showMessage({'type': 'warn', 'message': data.message});
        }
      });
    },

    // 打印发票
    action_print_invoice: function (id) {
      var self = this;
      Ajax.post('/api-v1/invoice/print/main?invoiceId=' + id + '&userSessionId=' + self.data.sessionId, {
        'apiKey': 'x0201090',
        'data': JSON.stringify({})
      }, function (err, data) {
        if (data && data.code == 1) {
          contentmsg = '打印发票中...'
          var dialog = showDialog({'title': '打印发票', 'content': contentmsg})
          self
            .methods
            .ajax_polling(dialog);
        } else {
          showMessage({'type': 'error', 'message': data.message});
        }
      })
    },

    // 弹出打印销货清单弹框
    action_printList: function (index) {
      var detail = this.data.detail.invoices[Number(index)];
      var tpl_dialog_body = template('tpl_dialog_printList', detail);

      showDialog({'title': '', 'content': tpl_dialog_body, 'showHead': true, 'showFoot': false});
    },

    // 打印销货清单(直连打印)
    action_printDetailList_invoice: function (id) {
      var self = this;
      Ajax.post('/api-v1/invoice/print/sales?invoiceId=' + id + '&userSessionId=' + self.data.sessionId, {
        'apiKey': 'x0201091',
        'data': JSON.stringify({})
      }, function (err, data) {
        if (data && data.code == 1) {
          var contentmsg = '直连打印中...'
          var dialog = showDialog({'title': '直连打印', 'content': contentmsg})
          $('.dialog_printList')
            .closest('.dialog')
            .remove();
          self
            .methods
            .ajax_polling(dialog);
        } else {
          $('.dialog_printList')
            .closest('.dialog')
            .remove();
          showMessage({'type': 'error', 'message': data.message});
        }
      })
    },

    // 打印销货清单(导出PDF)
    action_printDetailListPDF_invoice: function (id) {
      var self = this;
      Ajax.post('/api-v1/invoice/export/account-sales?ext=pdf', {
        'apiKey': 'x0201092',
        'data': JSON.stringify([id])
      }, function (err, data) {
        if (data && data.code == 1) {
          $('.dialog_printList')
            .closest('.dialog')
            .remove();
          showMessage(data.message);
        } else {
          $('.dialog_printList')
            .closest('.dialog')
            .remove();
          showMessage({'type': 'error', 'message': data.message});
        }
      })
    },

    // 轮询后台返回消息
    ajax_polling: function (dialog, type) {
      var self = this;
      // var waitNum= 0; waitNum= ++waitNum % 6; var point= ''; for(var i=0;
      // i<waitNum; i++) {    point+= '。'; }

      Ajax.post('/api-v1/invoice/message/polling', {
        'apiKey': 'x0201000',
        'data': JSON.stringify({userId: '', sessionId: self.data.sessionId})
      }, function (err, data) {
        var contentmsg = '';
        if (data && data.code == 1) {
          if (data.message.split('___').length > 0) {
            contentmsg = data
              .message
              .split('___')
              .pop();
          }
          if (contentmsg.length > 0) {
            dialog.remove();
            showDialog({'title': '确认', 'content': contentmsg}, function() {
              self.ajax_statement_detail(self.data.statementid);
            });
          } else {
            setTimeout(bind(function () {
              self
                .methods
                .ajax_polling(dialog)
            }, self), 3000)
          }
        } else {
          showMessage({'type': 'warn', 'message': data.message});
        }
      });
    }
  },

  mounted: function () {

    this.initEvent();

    this.calcFrameSize();

  }
});

window.showDialog = function (param, callback) {

  param.dialogid = 'dialog_' + parseInt(Math.random() * 10000000);

  if (typeof param.showHead == 'undefined') {
    param.showHead = true;
  }

  if (typeof param.showFoot == 'undefined') {
    param.showFoot = true;
  }

  var tpl = template('tpl-dialog', param);

  $('body').append(tpl);

  var dialogdom = $('#' + param.dialogid);

  dialogdom
    .find('.dialog-bg')
    .on('click', function () {
      dialogdom.remove();
    })

  dialogdom
    .find('.btn-ok')
    .on('click', function () {

      callback && callback();

      dialogdom.remove();

    });

  dialogdom
    .find('.btn-cancel')
    .on('click', function () {

      dialogdom.remove();
    });

  dialogdom.animate({
    'opacity': 1
  }, 300);

  return dialogdom;
}

window.showMessage = function (param) {

  if (typeof param == 'string') {

    param = {
      'message': param
    };
  }

  param.msgid = 'msg_' + parseInt(Math.random() * 10000000);

  param.type = param.type || '';

  var tpl = template('tpl-message', param);

  $('body').append(tpl);

  var msgdom = $('#' + param.msgid),
    current_height = parseInt(msgdom.css('top'));
  console.log('current_height:' + current_height)

  msgdom.css('margin-left', -(msgdom.width() / 2) + 'px');

  msgdom.animate({
    'opacity': 1,
    'top': current_height + 36 + 'px'
  });

  setTimeout(function () {

    msgdom
      .animate({
        'opacity': 0,
        'top': current_height + 'px'
      }, function () {

        msgdom.remove();
      });

  }, 3000);
}

window.loading = function (selector, action) {

  if (action == 'start') {

    $(selector)
      .show()
      .animate({'opacity': 1});

    var rotation = function () {

      $(selector)
        .find('img')
        .stopRotate();

      $(selector)
        .find('img')
        .rotate({
          angle: 0,
          animateTo: 3600,
          duration: 10000,
          callback: function () {
            console.log('one round');
            rotation()
          },
          easing: function (x, t, b, c, d) {
            return c * (t / d) + b;
          }
        });
    }

    rotation();

  } else {

    $(selector)
      .animate({
        'opacity': 0
      }, function () {

        $(selector)
          .hide()
          .find('img')
          .stopRotate();
      });
  }
}
