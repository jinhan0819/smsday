let config = require('../../config');
let paymentModel = require('../../models/front/paymentModel');
let page = require('../../modules/pagination');
let sess = require('../../modules/session');
let cipher = require('../../modules/cipher');

module.exports = {
    sms_price: function(req, res){
        res.render('payment/sms_price');
    },
    /* 충전내역 */
    charge_history: async function(req, res){
        let data = req.query;
        if(typeof data.curPage == 'undefined'){
            data.curPage = 1;
        }

        let param = {};
        param.searchWord = typeof data.searchWord == 'undefined' ? '' : cipher.decBase64(data.searchWord);
        param.startDate = typeof data.startDate == 'undefined' ? '' : cipher.decBase64(data.startDate);
        param.endDate = typeof data.endDate == 'undefined' ? '' : cipher.decBase64(data.endDate);

        // 로그인 정보
        let pt_id = sess.getPlain(req, 'memberInfo').mb_id;
        param.pt_id = pt_id;

        // total count
        let rsltcnt = await paymentModel.getChargeHistoryCount(param);

        if(typeof data.curPage != 'number'){
            data.curPage = parseInt(cipher.decBase64(data.curPage));
        }

        let pagination = page.pagination(data.curPage, rsltcnt.result[0].total_count);
        // list
        let rslt = await paymentModel.getChargeHistoryList(param, pagination);

        res.render('payment/charge_history', {param: param, list: rslt.result, pagination: pagination});
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
