/**
 * Created by huyuqiong on 2016/12/16.
 */
define(function(req,exp){
    "use strict";

    var service = req("utils.ajax");

    exp.registerResult=false;
    exp.registerSuccess=false;
    exp.args = {
        password:"",
        email:"",
        tel:"",
        companyName:"",
        registerFrom:"100",
        registerTime:"2017-06-11 19:20:11",
        registerIp:"127.0.0.1"
    }
    exp.onInit = function (done) {
        // 如果注册成功了
        // exp.registerSuccess=true;
        // var time=setInterval(function(){
        //     var value=parseInt($("#endtime").text());
        //     if (value==0) {
        //         clearInterval(time);
        //         exp.login();
        //     }else{
        //         value--;
        //        $("#endtime").html(value) 
        //     }
        // },1000);

        if(sessionStorage.userId){
            exp.go("list");
        }else {
            done();
        }
    }

    exp.register = function () {
        if (validate()) {
            registersend();
        };
    }

    exp.login=function(){
        exp.go("login");
    }

    exp.rewrite=function(){
        $(".ui-registerResult-con").hide();
        $(".ui-default-con").show();
    }

    exp.resend=function(){
        registersend();
    }

    exp.hideError = function () {
        $(".ui-error-text").hide();
    }
    // 发送注册请求
    function registersend(){
        service.register(exp.args,function (rs) {
            console.log(rs);
            if(rs.status == "SUCCESS"){
                sessionStorage.userId = "10001";
                $(".ui-registerResult-con").show();
                $(".ui-default-con").hide();
            }else{
                $(".ui-error-text").html("注册失败请重新注册").show();
            }
        });
    }
    const EMAIL=/^[\w\-]+@([\w\-]+\.)+(com|net|cn|com\.cn|cc|info|me|org)$/;
    const TEL=/^1[3|4|5|8][0-9]\d{4,8}$/;
    const COMPANYY=/^[A-Za-z0-9]{3,20}$/;
    const PASSWORD=/^[A-Za-z0-9_]{6,20}$/;
    // 验证是否合法字符
    function validate(){
        var errormessage="";
        if (!EMAIL.test(exp.args.email)) {
            errormessage+=" 邮箱";
        };
        if (!TEL.test(exp.args.tel)) {
            errormessage+=" 电话号码";
        };
        if (!COMPANYY.test(exp.args.companyName)) {
            errormessage+=" 公司名称";
        };
        if (!PASSWORD.test(exp.args.password)) {
            errormessage+=" 密码";
        };
        if (errormessage=="") {
            return true;
        }else{
            errormessage+="格式不合法"
            $(".ui-error-text").html(errormessage).show();
            return false;
        }
    }
});