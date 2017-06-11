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
            var code=dress.substring(dress.lastIndexOf("/")+1);
            var data={};
            data.code=code;
            data.userId=localStorage.userId;
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
            
    const EMAIL=/^[\w\-]+@([\w\-]+\.)+(com|net|cn|com\.cn|cc|info|me|org)$/;
    exp.confirmclick = function () {
    	var data={};
    	data.userId=localStorage.userId;
    	data.step="100";
    	if (exp.thirdstep) {
    		if (exp.newpassword==exp.confirmpassword && exp.newpassword!="") {
    			data.step="200";
    			data.password=exp.newpassword;
    		}else{
    			$(".passworderror").html("密码不相等").show();
    			return false;
    		}
    	}else{
            if (!EMAIL.test(exp.account)) {
                $(".passworderror").html("邮箱格式不对").show();
                return false;
            };
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
                $(".passworderror").html(rs.msg).show();
            }
        });

    }

    exp.hideError=function(){
    	$(".passworderror").hide();
    }
});