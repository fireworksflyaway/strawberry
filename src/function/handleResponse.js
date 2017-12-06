/**
 * Created by Mason Jackson in Office on 2017/12/4.
 */

export default function handleResponse(res) {
        return res.json()
                                .then(json=>{
                                        if(res.ok){
                                                return json;
                                        } else {
                                                return Promise.reject(json);
                                        }
                                })
                }
