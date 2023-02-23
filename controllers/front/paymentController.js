let config = require('../../config');
let paymentModel = require('../../models/front/paymentModel');

module.exports = {
    sms_price: function(req, res){
        res.render('payment/sms_price');
    },
    charge_history: function(req, res){
        res.render('payment/charge_history');
    },
    send_history: function(req, res){
        res.render('payment/send_history');
    },

    /* 문자 단가 */

    // 충전요청
    chargeRequest: async function(req, res){
        let data = req.body;
        let rslt = await paymentModel.chargeRequest(data);

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        if(rslt.code == 200){
            res.write("<script>alert('충전 요청이 완료되었습니다.')</script>");
        }else{
            res.write("<script>alert('충전 요청 중 오류가 발생하였습니다.')</script>");
        }

        res.write("<script>window.location=\"/front/payment/sms_price\"</script>");

        
    },
};
