var SOR_OK = 0;                       //�����ɹ�
var SOR_UnknownErr 	  = 0X0B000001;   //�쳣����
var SOR_IndataLenErr  = 0X0B000200;   //�������ݳ��ȴ���
var SOR_IndataErr 	  = 0X0B000201;   //�������ݴ���
var SOR_InitializeErr = 0X0B000424;   //��ʼ��ʧ��

//�豸��Ϣ��ʶ
var  SGD_DEVICE_SORT                   =  0x00000201;  //�豸���
var  SGD_DEVICE_TYPE                   =  0x00000202;  //�豸�ͺ�
var  SGD_DEVICE_NAME                   =  0x00000203;  //�豸����
var  SGD_DEVICE_MANUFACTURER           =  0x00000204;  //��������
var  SGD_DEVICE_HARDWARE_VERSION       =  0x00000205;  //Ӳ���汾
var  SGD_DEVICE_SOFTWARE_VERSION       =  0x00000206;  //����汾
var  SGD_DEVICE_STANDARD_VERSION       =  0x00000207;  //���ϱ�׼�汾
var  SGD_DEVICE_SERIAL_NUMBER          =  0x00000208;  //�豸���
var  SGD_DEVICE_SUPPORT_ALG            =  0x00000209;  //�豸�����ֶ�,��ʶ�����豸֧�ֵķǶԳ������㷨
var  SGD_DEVICE_SUPPORT_SYM            =  0x0000020A;  //�豸�����ֶ�,��ʶ�����豸֧�ֵĶԳ������㷨
var  SGD_DEVICE_SUPPORT_HASH_ALG       =  0x0000020B;  //�豸�����ֶ�,��ʶ�����豸֧�ֵ��Ӵ������㷨
var  SGD_DEVICE_SUPPORT_STORAGE_SPACE  =  0x0000020C;  //�豸�����ֶ�,��ʶ�����豸����ļ��洢�ռ�
var  SGD_DEVICE_SUPPORT_FREE_SPACE     =  0x0000020D;  //�豸�����ֶ�,��ʶ�����豸�����ļ��洢�ռ�
var  SGD_DEVICE_RUNTIME                =  0x0000020E;  //������ʱ��
var  SGD_DEVICE_USED_TIMES             =  0x0000020F;  //�豸���ô���
var  SGD_DEVICE_LOCATION               =  0x00000210;  //�豸����λ��
var  SGD_DEVICE_DESCRIPTION            =  0x00000211;  //�豸����
var  SGD_DEVICE_MANAGER_INFO           =  0x00000212;  //�豸������������Ϣ
var  SGD_DEVICE_MAX_DATA_SIZE          =  0x00000213;  //�豸�����ֶ�,һ���ܴ������������

//֤��������ʶ
var  SGD_CERT_ALL                         =  0x00000000;  //֤����Ϣ
var  SGD_CERT_VERISON                     =  0x00000001;  //֤��汾
var  SGD_CERT_SERIAL                      =  0x00000002;  //֤�����к�
var  SGD_CERT_ISSUER                      =  0x00000005;  //֤��䷢����Ϣ
var  SGD_CERT_VALID_TIME                  =  0x00000006;  //֤����Ч��
var  SGD_CERT_SUBJECT                     =  0x00000007;  //֤��ӵ������Ϣ
var  SGD_CERT_DER_PUBLIC_KEY              =  0x00000008;  //֤�鹫Կ��Ϣ
var  SGD_CERT_DER_EXTENSIONS              =  0x00000009;  //֤����չ����Ϣ
var  SGD_EXT_AUTHORITYKEYIDENTIFIER_INFO  =  0x00000011;  //�䷢����Կ��ʶ��
var  SGD_EXT_SUBJECTKEYIDENTIFIER_INFO    =  0x00000012;  //֤���������Կ��ʶ��
var  SGD_EXT_KEYUSAGE_INFO                =  0x00000013;  //��Կ��;
var  SGD_EXT_PRIVATEKEYUSAGEPERIOD_INFO   =  0x00000014;  //˽Կ��Ч��
var  SGD_EXT_CERTIFICATEPOLICIES_INFO     =  0x00000015;  //֤�����
var  SGD_EXT_POLICYMAPPINGS_INFO          =  0x00000016;  //����ӳ��
var  SGD_EXT_BASICCONSTRAINTS_INFO        =  0x00000017;  //��������
var  SGD_EXT_POLICYCONTRAINTS_INFO        =  0x00000018;  //��������
var  SGD_EXT_EXTKEYUSAGE_INFO             =  0x00000019;  //��չ��Կ��;
var  SGD_EXT_CRLDISTRIBUTIONPOINTS_INFO   =  0x0000001A;  //CRL������
var  SGD_EXT_NETSCAPE_CERT_TYPE_INFO      =  0x0000001B;  //Netscape����
var  SGD_EXT_SELFDEFINED_EXTENSION_INFO   =  0x0000001C;  //˽�е��Զ�����չ��
var  SGD_CERT_ISSUER_CN                   =  0x00000021;  //֤��䷢��CN
var  SGD_CERT_ISSUER_O                    =  0x00000022;  //֤��䷢��O
var  SGD_CERT_ISSUER_OU                   =  0x00000023;  //֤��䷢��OU
var  SGD_CERT_SUBJECT_CN                  =  0x00000031;  //֤��ӵ������ϢCN
var  SGD_CERT_SUBJECT_O                   =  0x00000032;  //֤��ӵ������ϢO
var  SGD_CERT_SUBJECT_OU                  =  0x00000033;  //֤��ӵ������ϢOU
var  SGD_CERT_SUBJECT_EMAIL               =  0x00000034;  //֤��ӵ������ϢEMAIL

//ǩ���㷨
var SGD_SM3_RSA      = 0x00010001;     //����SM3�㷨��RSA�㷨��ǩ��
var SGD_SHA1_RSA     = 0x00010002;     //����SHA_1�㷨��RSA�㷨��ǩ��
var SGD_SHA256_RSA   = 0x00010004;     //����SHA_256�㷨��RSA�㷨��ǩ��
var SGD_SM3_SM2      = 0x00020201;     //����SM3�㷨��SM2�㷨��ǩ��

//���������㷨
var SGD_SM1_ECB     = 0x00000101;         //SM1�㷨ECB����ģʽ
var SGD_SM1_CBC     = 0x00000102;         //SM1�㷨CBC����ģʽ
var SGD_SM1_CFB     = 0x00000104;         //SM1�㷨CFB����ģʽ
var SGD_SM1_OFB     = 0x00000108;         //SM1�㷨OFB����ģʽ
var SGD_SM1_MAC     = 0x00000110;         //SM1�㷨MAC����

var SGD_SSF33_ECB   = 0x00000201;         //SSF33�㷨ECB����ģʽ
var SGD_SSF33_CBC   = 0x00000202;         //SSF33�㷨CBC����ģʽ
var SGD_SSF33_CFB   = 0x00000204;         //SSF33�㷨CFB����ģʽ
var SGD_SSF33_OFB   = 0x00000208;         //SSF33�㷨OFB����ģʽ
var SGD_SSF33_MAC   = 0x00000210;         //SSF33�㷨MAC����

var SGD_SM4_ECB     = 0x00000401;         //SM4�㷨ECB����ģʽ
var SGD_SM4_CBC     = 0x00000402;         //SM4�㷨CBC����ģʽ
var SGD_SM4_CFB     = 0x00000404;         //SM4�㷨CFB����ģʽ
var SGD_SM4_OFB     = 0x00000408;         //SM4�㷨OFB����ģʽ
var SGD_SM4_MAC     = 0x00000410;         //SM4�㷨MAC����

var SGD_ZUC_EEA3    = 0x00000801;         //ZUC���֮;�������㷨128-EEA3�㷨
var SGD_ZUC_EEI3    = 0x00000802;         //ZUC���֮�������㷨128-EIA3�㷨


//��Ϣǩ����ʶ
var SIGN_FLAG_WITHOUT_ORI =  1;        //����ԭ��
var SIGN_FLAG_WITH_ORI  =    0;        //��ԭ��

//������Ϣ����
var EXACT_TYPE_PLAIN  =   1;		//ԭ��
var EXACT_TYPE_SIGNCERT =   2;  	//ǩ��֤��
var EXACT_TYPE_SIGNVALUE =  3		//ǩ��ֵ


function SOF_GetVersion(ComObj)
{
    var sVer = ComObj.SOF_GetVersion();
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code:ComObj.SOF_GetLastError(),msg:"SOF_GetVersion"};

    return sVer;
}

function GetDeviceInfo(ComObj, sContainerName, iInfoType, sTitle)
{
    return sTitle + ': ' + ComObj.SOF_GetDeviceInfo(sContainerName, iInfoType) + '\n';
}

function SOF_GetDeviceInfo(ComObj, sContainerName, iInfoType)
{
    var sDevInfo = '';

    if(iInfoType == 0x00000200)
    {
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_SORT, '�豸���');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_TYPE, '�豸�ͺ�');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_NAME, '�豸����');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_MANUFACTURER, '��������');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_HARDWARE_VERSION, 'Ӳ���汾');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_SOFTWARE_VERSION, '����汾');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_STANDARD_VERSION, '���ϱ�׼�汾');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_SERIAL_NUMBER, '�豸���');


        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_SUPPORT_ALG, '�豸�����ֶ�,��ʶ�����豸֧�ֵķǶԳ������㷨');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_SUPPORT_SYM, '�豸�����ֶ�,��ʶ�����豸֧�ֵĶԳ������㷨');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_SUPPORT_HASH_ALG, '�豸�����ֶ�,��ʶ�����豸֧�ֵ��Ӵ������㷨');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_SUPPORT_STORAGE_SPACE, '�豸�����ֶ�,��ʶ�����豸����ļ��洢�ռ�');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_SUPPORT_FREE_SPACE, '�豸�����ֶ�,��ʶ�����豸�����ļ��洢�ռ�');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_RUNTIME, '������ʱ��');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_USED_TIMES, '�豸���ô���');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_LOCATION, '�豸����λ��');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_DESCRIPTION, '�豸����');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_MANAGER_INFO, '�豸������������Ϣ');
        sDevInfo += GetDeviceInfo(ComObj, sContainerName, SGD_DEVICE_MAX_DATA_SIZE, '�豸�����ֶ�,һ���ܴ������������');
    }
    else
    {
        sDevInfo = ComObj.SOF_GetDeviceInfo(sContainerName, iInfoType);
        if(sDevInfo == "")
            throw {code: ComObj.SOF_GetLastError(), msg:"SOF_GetDeviceInfo"};
    }

    return sDevInfo;
}

function SOF_SetSignMethod(ComObj, iSignMethod)
{
    var rv = ComObj.SOF_SetSignMethod(iSignMethod);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code:rv,msg:"SOF_SetSignMethod"};
}

function SOF_GetSignMethod(ComObj)
{
    return  ComObj.SOF_GetSignMethod();
}

function SOF_SetEncryptMethod(ComObj, iEncryptMethod)
{
    var rv = ComObj.SOF_SetEncryptMethod(iEncryptMethod);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code:ComObj.SOF_GetLastError(),msg:"SOF_SetEncryptMethod"};
}

function SOF_GetEncryptMethod(ComObj)
{
    return ComObj.SOF_GetEncryptMethod();
}

function SOF_GetUserList(ComObj)
{
    console.log('ComObj:'+ JSON.stringify(ComObj));
    var sUserList = ComObj.SOF_GetUserList();
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_GetUserList"};

    return sUserList;
}

function SOF_ExportUserCert(ComObj, sContainerName)
{
    var sCertB64 = ComObj.SOF_ExportUserCert(sContainerName);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_ExportUserCert"};

    return sCertB64;
}

function SOF_Login(ComObj, sContainerName, sPassWord)
{
    var rv = ComObj.SOF_Login(sContainerName, sPassWord);
    if(SOR_OK != ComObj.SOF_GetLastError())
        throw {code:ComObj.SOF_GetLastError(),msg:"SOF_Login"};

    return true;
}

function SOF_GetPinRetryCount(ComObj, sContainerName)
{
    return ComObj.SOF_GetPinRetryCount(sContainerName);
}

function SOF_ChangePassWd(ComObj, sContainerName, sOldPassWord, sNewPassWord)
{
    var rv = ComObj.SOF_ChangePassWd(sContainerName, sOldPassWord, sNewPassWord);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code:ComObj.SOF_GetLastError(),msg:"SOF_ChangePassWd"};

    return true;
}

function SOF_ExportExChangeUserCert(ComObj, sContainerName)
{
    var sCertB64 = ComObj.SOF_ExportExChangeUserCert(sContainerName);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_ExportExChangeUserCert"};

    return sCertB64;
}

function SOF_GetCertInfo(ComObj, sCertB64, iInfoType)
{
    var sCertInfo = '';

    if(iInfoType == 0)
    {
        sCertInfo += '֤��汾: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_VERISON) + '\n';
        sCertInfo += '֤�����к�: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_SERIAL) + '\n';
        sCertInfo += '֤��䷢����Ϣ: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_ISSUER) + '\n';
        sCertInfo += '֤����Ч��: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_VALID_TIME) + '\n';
        sCertInfo += '֤��ӵ������Ϣ: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_SUBJECT) + '\n';
        sCertInfo += '֤�鹫Կ��Ϣ: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_DER_PUBLIC_KEY) + '\n';
        sCertInfo += '֤����չ����Ϣ: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_DER_EXTENSIONS) + '\n';
        sCertInfo += '�䷢����Կ��ʶ��: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_EXT_AUTHORITYKEYIDENTIFIER_INFO) + '\n';
        sCertInfo += '֤���������Կ��ʶ��: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_EXT_SUBJECTKEYIDENTIFIER_INFO) + '\n';
        sCertInfo += '��Կ��;: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_EXT_KEYUSAGE_INFO) + '\n';
        sCertInfo += '˽Կ��Ч��: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_EXT_PRIVATEKEYUSAGEPERIOD_INFO) + '\n';
        sCertInfo += '֤�����: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_EXT_CERTIFICATEPOLICIES_INFO) + '\n';
        sCertInfo += '����ӳ��: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_EXT_POLICYMAPPINGS_INFO) + '\n';
        sCertInfo += '��������: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_EXT_BASICCONSTRAINTS_INFO) + '\n';
        sCertInfo += '��������: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_EXT_POLICYCONTRAINTS_INFO) + '\n';
        sCertInfo += '��չ��Կ��;: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_EXT_EXTKEYUSAGE_INFO) + '\n';
        sCertInfo += 'CRL������: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_EXT_CRLDISTRIBUTIONPOINTS_INFO) + '\n';
        sCertInfo += 'Netscape����: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_EXT_NETSCAPE_CERT_TYPE_INFO) + '\n';
        sCertInfo += '֤��䷢��CN: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_ISSUER_CN) + '\n';
        sCertInfo += '֤��䷢��O: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_ISSUER_O) + '\n';
        sCertInfo += '֤��䷢��OU: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_ISSUER_OU) + '\n';
        sCertInfo += '֤��ӵ������ϢCN: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_SUBJECT_CN) + '\n';
        sCertInfo += '֤��ӵ������ϢO: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_SUBJECT_O) + '\n';
        sCertInfo += '֤��ӵ������ϢOU: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_SUBJECT_OU) + '\n';
        sCertInfo += '֤��ӵ������ϢEMAIL: ' + ComObj.SOF_GetCertInfo(sCertB64, SGD_CERT_SUBJECT_EMAIL) + '\n';
    }
    else
    {
        var sCertInfo = ComObj.SOF_GetCertInfo(sCertB64, iInfoType);
         if(ComObj.SOF_GetLastError() != SOR_OK)
            throw {code: ComObj.SOF_GetLastError(), msg:"SOF_GetCertInfo"};
    }

    return sCertInfo;
}

function SOF_GetCertInfoByOid(ComObj, sCertB64, sOID)
{
    var sCertInfo = ComObj.SOF_GetCertInfoByOid(sCertB64, sOID);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_GetCertInfoByOid"};

    return sCertInfo;
}

function SOF_ValidateCert(ComObj, sCertB64)
{
    var rv = ComObj.SOF_ValidateCert(sCertB64);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code: rv, msg:"SOF_ValidateCert"};
}

function SOF_SignData(ComObj, sContainerName, sInData)
{
    var sSignedDataB64 = ComObj.SOF_SignData(sContainerName, sInData);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_SignData"};

    return sSignedDataB64;
}

function SOF_VerifySignedData(ComObj, sCertB64, sOrignalData, sSignedDataB64)
{
    var bRet = ComObj.SOF_VerifySignedData(sCertB64, sOrignalData, sSignedDataB64);
    if(SOR_OK != ComObj.SOF_GetLastError())
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_VerifySignedData"};
}

function SOF_EncryptData(ComObj, sEncryptCertB64, sPlainData)
{
    var sEncryptedDataB64 = ComObj.SOF_EncryptData(sEncryptCertB64, sPlainData);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_EncryptData"};

    return sEncryptedDataB64;
}

function SOF_DecryptData(ComObj, sContainerName, sEncryptedDataB64)
{
    var sDecryptedData = ComObj.SOF_DecryptData(sContainerName, sEncryptedDataB64);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_DecryptData"};

    return sDecryptedData;
}

function SOF_SignMessage(ComObj, lFlag, sContainerName, sOrignalData)
{
    var sSignedDataB64 = ComObj.SOF_SignMessage(lFlag, sContainerName, sOrignalData);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_SignMessage"};

    return sSignedDataB64;
}

function SOF_VerifySignedMessage(ComObj, sSignedDataB64, sPlainData)
{
    var bRet = ComObj.SOF_VerifySignedMessage(sSignedDataB64, sPlainData);
    if(SOR_OK != ComObj.SOF_GetLastError())
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_VerifySignedMessage"};
}

function SOF_GetInfoFromSignedMessage(ComObj, sSignedDataB64, lType)
{
    var sInfo = ComObj.SOF_GetInfoFromSignedMessage(sSignedDataB64, lType);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_GetInfoFromSignedMessage"};
    return sInfo;
}

function SOF_GenRandom(ComObj, iRandomLen)
{
    var sRandomDataB64 = ComObj.SOF_GenRandom(iRandomLen);
     if(ComObj.SOF_GetLastError() != SOR_OK)
        throw {code: ComObj.SOF_GetLastError(), msg:"SOF_GenRandom"};
    return sRandomDataB64;
}

function SOF_GetLastError(ComObj)
{
    return ComObj.SOF_GetLastError();
}

function ShowError(e)
{
    if (e.msg != undefined&&e.code  != undefined)
    {
       alert("����:\n��Ϣ:" + e.msg + "\n����:0x" + e.code.toString(16).toUpperCase());
    }
    else
        alert("�쳣:\n" + e.message);
}
