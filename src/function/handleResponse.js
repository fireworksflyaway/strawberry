/**
 * Created by Mason Jackson in Office on 2017/12/4.
 */

export default function handleResponse(res) {
        if(res.status===401)
                return Promise.reject('10000');
        if(res.status===500)
                return res.text().then(text=>{
                        return Promise.reject(text);
                })
        else
                return res.json()
                                .then(json=>{
                                        if(res.ok){
                                                return json;
                                        } else {
                                                console.log(res);
                                                return Promise.reject(json);
                                        }
                                })
                }
