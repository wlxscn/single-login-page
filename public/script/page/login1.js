window.page = widget({
    name: 'login',
    tplname: 'tpl-login',
    data: {
        taxNo: '',
        companyName: '',
        amount: '',
        remark: '',
        capcha: '',
        timestamp: ''
    },

    methods: {

        'ajax_login': function () {

            var pinCode = $('.pinCode').val();

            if (!CheckPlugin()) {
                return;
            }

            $('#loginBtn').val('登陆中...')

            var ReadOutSignCert = ""; //读出的用户签名证书
            var ReadOutEncCert = ""; //读出的用户加密证书

            try {
                //枚举用户,解析容器名
                var sUserList = SOF_GetUserList(GDCACom);
                var UserList = sUserList.split("&&&");
                if (UserList.length == 0) {
                    alert("用户列表为空!");
                    return false;
                }

                var sContainer = UserList[0].split("||")[1];

                if (pinCode == "") {
                    alert("请输入密码!");
                    return false;
                }

                //用户登陆
                SOF_Login(GDCACom, sContainer, pinCode);

                //读取用户签名证书
                ReadOutSignCert = SOF_ExportUserCert(GDCACom, sContainer);

                //读取用户加密证书
                ReadOutEncCert = SOF_ExportExChangeUserCert(GDCACom, sContainer);

                //验证证书
                SOF_ValidateCert(GDCACom, ReadOutSignCert);

                var random = SOF_GenRandom(GDCACom, 12);

                var clientSignData = SOF_SignData(GDCACom, sContainer, random);

                var handleFunc = function (data) {
                    console.log("We come here");
                    console.log(data);
                    if (data.code == 1) {
                        window
                            .sessionStorage
                            .setItem("token", data.token);
                        window
                            .sessionStorage
                            .setItem("operateToken", JSON.stringify(data.operations));

                        var api2 = new XforceImscApi.AccountApi();
                        var handleFunc4 = function (data) {
                            console.log(data);
                            if (data.code == 3) {
                                window.location.href = "/usercenter.html";
                            } else {
                                window.location.href = "/imscentry.html";
                            }
                        };

                        var operateToken = getOperateToken('g0101000');
                        var callback4 = apiCallback(handleFunc4);
                        var XOperateToken = callback4.defaultClient.authentications['X-Operation-Token'];
                        XOperateToken.apiKey = operateToken;
                        var XAccessToken = callback4.defaultClient.authentications['X-Access-Token'];
                        XAccessToken.apiKey = window
                            .sessionStorage
                            .getItem("token");

                        api2.analyseAccountStatus(callback4);
                        //window.location.href= "/imscentry.html";
                    } else if (data.code == -1) {
                        alert(data.message);
                        //_this.loginTelIsRegiter = true;
                    } else if (data.code == -2) {
                        _this.loginPwdIsError = true;
                    }
                }

                var url = '/api-v1/security/ca/login';

                var data = {};
                data.userSignCert = ReadOutSignCert;
                data.userPin = pinCode;
                data.userSignData = clientSignData;
                data.randomData = random;

                Ajax.post(url, {
                    data: JSON.stringify(data)
                }, function (err, data) {
                    if (data && data.code == 1) {
                        store.set('token', data.token);

                        store.set('operations', data.operations);

                        console.log('login success -> ', data);

                        window.location.href = "/imscentry.html";
                    }
                })
            } catch (ex) {
                if (ex.msg == 'SOF_Login') {
                    alert('密码错误')
                } else {
                    alert('Ukey未插入或证书错误')
                }
                console.log(ex.message);
            }
        },

        'ajax_application': function () {
            var self = this;

            var url = '/api-v1/security/ca/register';

            function validate() {
                if (self.data.taxNo.length < 15 || self.data.taxNo.length > 18) {
                    $('.error.taxNo').show();
                    return false;
                } else {
                    $('.error.taxNo').hide();
                }

                if (self.data.companyName > 50) {
                    $('.error.companyName').show();
                    return false;
                } else {
                    $('.error.companyName').hide();
                }

                if (!/\d{1,10}/.test(self.data.amount)) {
                    $('.error.amount').show();
                    return false;
                } else {
                    $('.error.amount').hide();
                }

                if (self.data.remark.length > 50) {
                    $('.error.remark').show();
                    return false;
                } else {
                    $('.error.remark').hide();
                }

                if (self.data.capcha.length != 4) {
                    $('.error.capcha').show();
                    return false;
                } else {
                    $('.error.capcha').hide();
                }
            }

            var flag = validate();

            if (!flag) {
                return;
            }

            var request = {};
            request.taxNo = this.data.taxNo;
            request.companyName = this.data.companyName;
            request.amount = this.data.amount;
            request.remark = this.data.remark;
            request.capcha = this.data.capcha;
            request.timestamp = this.data.timestamp + '-' + this.data.capcha;

            Ajax.post(url, {
                data: JSON.stringify(request)
            }, function (err, data) {
                if (data && data.code == 1) {
                    var dialog_body = template('tpl-payCode', {payCode: data.message});

                    var dialog = showDialog({title: '', content: dialog_body})
                } else {
                    showMessage({type: 'warn', message: data.message})
                }
            })

        },

        'initEvent': function () {
            var self = this;

            $('.rh-btn-container span').on('click', function () {

                var cls = $(this).attr('class');

                $('.rh-btn-container span').removeClass('clickActive');

                $(this).addClass('clickActive');

                if (cls == 'loginTab') {
                    $('.submitApplication').hide();
                    $('.login-content').show();
                } else if (cls == 'registerTab') {
                    self.data.timestamp = new Date().getTime();

                    $('.captchaImg').attr('src', 'http://114.55.30.73:8081/jcaptcha?timestamp=' + self.data.timestamp);
                    $('.login-content').hide();
                    $('.submitApplication').show();
                }

            })

            $('.captchaImg').on('click', function () {
                self.data.timestamp = new Date().getTime();

                $('.captchaImg').attr('src', 'http://114.55.30.73:8081/jcaptcha?timestamp=' + self.data.timestamp);
            })

            $('.checkGuide').on('click', function () {
                var dialog_body= template('tpl-applicationGuide', {});
                var dialog= showDialog({
                    title: '申请指南',
                    content: dialog_body,
                    showFoot: false
                })
                $('.rf-readed input').on('click', function() {
                    dialog.remove();
                })
            })


        }
    },

    mounted: function () {
        template.defaults.escape = false;

        this.initEvent();

    }
});