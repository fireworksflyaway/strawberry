/**
 * Created by Mason Jackson in Office on 3/28/18.
 */
module.exports={
        EventStatus:{
                Waiting: 0,
                Running: 1,
                Success: 2,
                Failed: 3,
                Expired: 4,
                None: 5
        },

        EventType:{
                PE: 0,
                DG: 1,
                RS: 2
        },

        DiseaseType: {
                AD: 0,
                VD: 1,
                SVD: 2,
                FD: 3,
                MS: 4,
                PK: 5,
                PSBC: 6
        }
}