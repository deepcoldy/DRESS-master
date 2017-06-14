/**
 * Created by huyuqiong on 2016/12/16.
 */
define(function(req,exp){
    "use strict";

    var service = req("utils.ajax");
    exp.thirdstep=false;
    exp.account ="";
    exp.newpassword ="";
    exp.confirmpassword ="";
    exp.onInit = function (done) {
        var dress=window.location.href;
        if (dress.indexOf("activation/")>0) {
            exp.thirdstep=true;
            var start=dress.indexOf("activation/")+11;
            var code=dress.substring(start,dress.indexOf("/user_id"));
            var data={};
            data.code=code;
            data.userId=dress.substring(dress.lastIndexOf("/")+1);
            data.registerFrom="100",
            data.type="100";
            service.activation(data,function (rs) {
                if(rs.status == "SUCCESS"){
                    // console.log("SUCCESS")
                    $(".ui-resetpassword-con .step-con").removeClass("isactive");
                    $(".ui-resetpassword-con .step-con").eq(2).addClass("isactive");
                }else{
                    $(".passworderror").html("邮箱验证码出错重新发送").show();
                    exp.go("resetPassword");
                }
            });
        }else{
            exp.thirdstep=false;
        }
        done();
    }
            
    exp.confirmclick = function () {
        if (!exp.hideError()) {
            return false;
        };
        var data={};
        data.userId=exp.account;
        data.step=100;
        if (exp.thirdstep) {
            data.step=200;
            data.password=exp.newpassword;
        }

        service.resetpassword(data,function (rs) {
            if(rs.status == "SUCCESS"){
                if (exp.thirdstep) {
                    exp.go("login");
                }else{
                    $(".resetaccount").html(exp.account);
                    $(".ui-resetpassword-con .step-con").removeClass("isactive")
                    $(".ui-resetpassword-con .step-con").eq(1).addClass("isactive")
                    $(".secondstep").show();
                    $(".ui-resetpassword-con button,.ui-resetpassword-con .firststep,.passworderror").hide();
                }
            }else{
                if (exp.thirdstep) {
                    $(".passworderror").html(rs.msg).show();
                }else{
                    $(".passworderror").html("用户名不存在").show();
                }
                
            }
        });

    }

    const EMAIL=/^[\w\-]+@([\w\-]+\.)+(com|net|cn|com\.cn|cc|info|me|org)$/;
    exp.hideError=function(){
        var flag=false;
        if (exp.thirdstep) {
            if (exp.newpassword==exp.confirmpassword && exp.newpassword!="") {
                flag=true;
            }else{
                $(".passworderror").html("密码不相等").show();
            }
        }else{
            if (EMAIL.test(exp.account)) {
                flag=true;
            }else{
                $(".passworderror").html("邮箱格式不对").show();
            }
        }
        if (flag) { 
            $(".passworderror").hide();
            $(".ui-resetpassword-con button").css("backgroundColor","#0099ff");
        }else{
            $(".ui-resetpassword-con button").css("backgroundColor","#c1c1c1");
        }
        return flag;
    }
});