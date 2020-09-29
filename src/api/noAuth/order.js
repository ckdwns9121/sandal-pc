import axios from 'axios';
import {Paths} from '../../paths';

export const noAuth_order = async (
    cart_ids,
    s_hp,
    post_num,
    addr1,
    addr2='',
    lat,
    lng,
    order_type='reserve',
    order_memo,
    delivery_memo,
    delivery_req_time
     // cp_id,
    // point_price,
    
) => {
    const req = Paths.api + 'noauth/order';

    const form_data = {
        cart_ids,
        s_hp,
        post_num,
        addr1,
        addr2,
        lat,
        lng,
        order_type,
        order_memo,
        delivery_memo,
        delivery_req_time,
    };
    console.log(form_data);
    axios.defaults.headers.post['Context-Type'] = 'application/json';
    const res = await axios.post(req, form_data);
    return res;
};


export const noAuthOrderView = async(order_id)=>{
    const req = Paths.api +`noauth/order/view?order_id=${order_id}`;
    axios.defaults.baseURL = req;
    const res = await axios.get();
    console.log(res);
    return res.data.query;
    
}
export const noAutuOrderCancle = async(order_id,s_hp)=>{
  
    console.log(order_id);
    console.log("취소시작");
    const req = Paths.api + 'noauth/order/cancel';

    const form_data = {
        order_id:order_id,
        s_hp : s_hp,
    };
    axios.defaults.headers.post['Context-Type'] = 'application/json';
    const res = await axios.put(req, form_data);
    console.log(res);
    return res;
}