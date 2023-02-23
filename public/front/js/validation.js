$(function(){
    // 전화번호 keyup
    $(document).on("keyup", "#mb_hp,#pt_tel,#pt_fax,#pt_manager_hp", function() { 
        $(this).val( $(this).val().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-") ); 
    });

    // 사업자번호 keyup
    $(document).on("keyup", "#pt_saupja", function() { 
        $(this).val($(this).val().replace(/[^0-9]/g, "").replace(/([0-9]{3})([0-9]{2})([0-9]{5})?/,"$1-$2-$3").replace("--", "-") ); 
    });

    // 금액 keyup
    $(document).on("keyup", "#pf_fee", function() { 
        $(this).val($(this).val().replace(/\,/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'));
    });
})
// 이메일 형식 체크
function doCheckEmail(email){
    let emailRegExp = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9_-]+[A-Za-z0-9_-]*[.]{1}[A-Za-z]{1,3}$/;
    return emailRegExp.test(email);
    // if (!emailRegExp.test(email)) {
    //     alert('이메일 형식이 올바르지 않습니다.');
    //     return false;
    // }else{
    //     return true;
    // }
}

// 비밀번호 영문, 숫자, 특수문자 정규식
function passwordValidationCheck(password){
    let regPass = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    return regPass.test(password);
    // if (!regPass.test(password)) {
    //     alert('비밀번호 정규식에 맞게 입력해주세요.');
    //     return false;
    // }else{
    //     return true;
    // }
}

// 비밀번호 체크
function doCheckPassword(){
    if($('#cur_password').val() == ''){
        alert('현재 비밀번호를 입력하세요.');
        $('#cur_password').focus();
        return false;
    }
    if($('#new_password').val() == ''){
        alert('새 비밀번호를 입력하세요.');
        $('#new_password').focus();
        return false;
    }
    if($('#new_password_confirm').val() == ''){
        alert('비밀번호 확인을 입력하세요.');
        $('#new_password_confirm').focus();
        return false;
    }
    if($('#cur_password').val() == $('#new_password').val()){
        alert('현재 비밀번호와 새 비밀번호가 같습니다. \n확인해주세요.');
        return false;
    }
    if($('#new_password').val() != $('#new_password_confirm').val()){
        alert('비밀번호가 서로 일치하지 않습니다. \n확인해주세요.');
        return false;
    }
    let pass =  $('#new_password').val();
    if(pass.length < 4 || pass.length > 26){
        alert('비밀번호를 다시 확인해주세요. \n(4~26/영문/숫자 가능)');
        $('#new_password').val('');
        $('#new_password_confirm').val('');
        return false;
    }

    return true;
}