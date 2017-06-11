/**
 * Created by huyuqiong on 2016/12/16.
 */
define(function(req,exp){
    "use strict";

    var service = req("utils.ajax");
    exp.getVerifyCode="";
    exp.args = {
        password:"",
        account:""
    }
    exp.onInit = function (done) {
        
        if(sessionStorage.userId){
            exp.go("list");
        }else {
            done();
        }
        //获取验证码
        // service.getVerify(function(data){
        //     $(".getVerify").attr("src",data);
        // })
    }

    var lock=true;
    exp.login = function () {
        if (lock) {
            lock=false;
            service.verifyCheck({code:exp.getVerifyCode},function(rs){
                if (rs.status=="SUCCESS") {
                    service.login(exp.args,function (rs) {
                        lock=true;
                        if(rs.status == "SUCCESS"){
                            sessionStorage.userId =localStorage.userId= rs.userId;
                            sessionStorage.name = rs.data.name;
                            exp.go("list");
                        }else{
                            $(".ui-error-con").show();
                        }
                    });
                }else{
                    lock=true;
                    $(".ui-error-con").show();
                }
            })
        };
    }

    exp.register = function(){
        exp.go("register");
    }

    exp.resetpassword=function(){
        exp.go("resetPassword");
    }

    exp.hideError = function () {
        $(".ui-error-con").hide();
    }
});