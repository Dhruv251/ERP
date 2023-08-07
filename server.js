require('dotenv').config();

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const fastcsv = require("fast-csv");
const excel = require('exceljs');
const https = require("https");
const fs = require("fs");
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const md5 = require('md5');
// const bcrypt = require("bcrypt");

const app = express();
const ws = fs.createWriteStream("data_Exported.csv");

// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
// app.use(cookieParser('NotSoSecret'));
// app.use(session({
//   secret : 'something',
//   cookie: { maxAge: 60000 },
//   resave: true,
//   saveUninitialized: true
// }));



app.use(flash());
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DB,
    password: process.env.PWD
});

// pool.getConnection(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }

//     console.log('connected as id ' + pool.threadId);
// });

pool.getConnection(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + pool.threadId);
});

app.post("/", function (req, response) {

    var user = req.body.epid;
    var pass = md5(req.body.eppd);
    if(user=='RG11111'){
    pool.query("SELECT * FROM login_details where Emp_code=? and password=?", [user, pass], function (err, res, field) {
        if (res.length > 0) {

            response.render("homepage");
        }
        else {

            response.render('login', { alertMsg: "Your Email Address or password is wrong" });
        }
    })
}
  else{
    pool.query("SELECT * FROM login_details where Emp_code=? and password=?", [user, pass], function (err, res, field) {
        if (res.length > 0) {

            response.render("NAhomepage");
        }
        else {

            response.render('login', { alertMsg: "Your Email Address or password is wrong" });
        }
    })
  }

});


app.post("/add_vendor", function (req, res) {
    var req_id;
    var reqid = "REQ-V-";
    const q = "SELECT * from request;";

    pool.query("SELECT request_id FROM request ", function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            setName(rows);
        }
    });

    function setName(value) {
        req_id = value[0].request_id;
        reqid += String(req_id);
        console.log(reqid)
        var id = req_id + 1;
        console.log(id);
        pool.query("update request set request_id=?", [id], function (errorr, rt) {
            if (errorr)
                console.log(errorr);
            else {
                console.log(reqid)
                const group = req.body.group;
                const fname = req.body.fname;
                const division = req.body.division;
                const date = req.body.date;
                const intercom = req.body.intercom;
                const empid = req.body.Empid;
                const vendor_id = req.body.vendor_id;
                const username = req.body.user_name;
                const address1 = req.body.address1;
                const address2 = req.body.address2;
                const post_code = req.body.post_code;
                const country_code = req.body.country_name;
                const state_name = req.body.state_name;
                const city = req.body.city;
                const gb_posting = req.body.gb_posting;
                const vendor_posting = req.body.vendor_posting;
                const gst_type = req.body.gst_type;
                const gst = req.body.gst;
                const pan_number = req.body.pan_number;
                const contact_name = req.body.contact_name;
                const phone_number = req.body.phone_number;
                const email = req.body.email;
                const rc = req.body.rc;
                const rd = req.body.rd;
                const enterprise = req.body.enterprise;
                const payment_term = req.body.payment_term;
                const bank_name = req.body.bank_name;
                const branch_name = req.body.branch_name;
                const bank_address = req.body.bank_address;
                const bank_number = req.body.bank_number;
                const mcr = req.body.mcr;
                const code = req.body.code;
                const acount_type = req.body.acount_type;
                const account_number = req.body.account_number;
                const project_code = req.body.project_code;
                const nob = req.body.nob;
                const nos = req.body.nos;
                var update_status;
                const status = "Pending".toUpperCase();
                if (customer_id === "") {

                    update_status = "N".toUpperCase();

                }
                else {
                    update_status = "U".toUpperCase();

                }



                var query = `
	INSERT INTO vendor 
	(city, address_2,address_1,name,post_code,state_code,country_code,contact_person,phone_number,pan_number,responsibility_center,celrd,micro_small_medium_enterprise,payment_term,bank_name_of_vendor,branch_name,bank_address,bank_phone_number,micr_code,rtgs_ifsccode,account_type,account_number,generalbusinesspostinggroup,projectcode,vendor_posting_group,nod_noc,nos,gst_type,gst_number,email_address,divi_code,group_code,filled_by,date,intercom_no,emp_code,vendor_id,request_id,update_status,status) 
	VALUES ("${city}", "${address2}", "${address1}", "${username}","${post_code}", "${state_name}", "${country_code}", "${contact_name}","${phone_number}", "${pan_number}", "${rc}", "${rd}","${enterprise}", "${payment_term}", "${bank_name}", "${branch_name}","${bank_address}", "${bank_number}", "${mcr}", "${code}","${acount_type}", "${account_number}", "${gb_posting}", "${project_code}","${vendor_posting}", "${nob}", "${nos}", "${gst_type}","${gst}", "${email}", "${division}", "${group}","${fname}", "${date}", "${intercom}", "${empid}","${vendor_id}","${reqid}","${update_status}","${status}");
	`;
                pool.query(query, function (error, data) {

                    if (error) {
                        console.log(error);
                    }
                    else {

                        res.render('request.ejs', { rqi: req_id });
                    }

                })
            }
        });
    }

});

app.post("/ven_u", function (req, res) {
    const group = req.body.group;
    const fname = req.body.fname;
    const division = req.body.division;
    const intercom = req.body.intercom;
    const empid = req.body.Empid;
    const vendor_id = req.body.vendor_id;
    const username = req.body.user_name;
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const post_code = req.body.post_code;
    const country_code = req.body.country_name;
    const state_name = req.body.state_name;
    const city = req.body.city;
    const gb_posting = req.body.gb_posting;
    const vendor_posting = req.body.vendor_posting;
    const gst_type = req.body.gst_type;
    const gst = req.body.gst;
    const pan_number = req.body.pan_number;
    const contact_name = req.body.contact_name;
    const phone_number = req.body.phone_number;
    const email = req.body.email;
    const rc = req.body.rc;
    const rd = req.body.rd;
    const enterprise = req.body.enterprise;
    const payment_term = req.body.payment_term;
    const bank_name = req.body.bank_name;
    const branch_name = req.body.branch_name;
    const bank_address = req.body.bank_address;
    const bank_number = req.body.bank_number;
    const mcr = req.body.mcr;
    const code = req.body.code;
    const account_type = req.body.acount_type;
    const account_number = req.body.account_number;
    const project_code = req.body.project_code;
    const nob = req.body.nob;
    const nos = req.body.nos;



    if (city !== "") {
        pool.query("update vendor SET city = ?  where vendor_id=? ", [city, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (address2 !== "") {
        pool.query("update vendor set  address_2 = ?  where vendor_id=? ", [address2, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (address1 !== "") {
        pool.query("update vendor set  address_1 = ?  where vendor_id=? ", [address1, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (username !== "") {
        pool.query("update vendor set  name = ?  where vendor_id=? ", [username, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (post_code !== "") {
        pool.query("update vendor set post_code = ?  where vendor_id=? ", [post_code, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (state_name !== "") {
        pool.query("update  vendor set state_code = ?  where vendor_id=? ", [state_name, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (country_code !== "") {
        pool.query("update vendor set country_code = ?  where vendor_id=? ", [country_code, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (contact_name !== "") {
        pool.query("update vendor set contact_person = ?  where vendor_id=? ", [contact_name, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (phone_number !== "") {
        pool.query("update vendor set phone_number = ?  where vendor_id=? ", [phone_number, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (pan_number !== "") {
        pool.query("update vendor set pan_number = ?  where vendor_id=? ", [pan_number, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (rc !== "") {
        pool.query("update vendor set responsibility_center = ?  where vendor_id=? ", [rc, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (rd !== "") {
        pool.query("update vendor set celrd = ?  where vendor_id=? ", [rd, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (enterprise !== "") {
        pool.query("update vendor set micro_small_medium_enterprise = ?  where vendor_id=? ", [enterprise, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (payment_term !== "") {
        pool.query("update vendor set payment_term = ?  where vendor_id=? ", [payment_term, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (bank_name !== "") {
        pool.query("update vendor set bank_name_of_vendor = ?  where vendor_id=? ", [bank_name, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (branch_name !== "") {
        pool.query("update vendor set branch_name = ?  where vendor_id=? ", [branch_name, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (bank_address !== "") {
        pool.query("update vendor set bank_address = ?  where vendor_id=? ", [bank_address, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (bank_number !== "") {
        pool.query("update vendor set bank_phone_number = ?  where vendor_id=? ", [bank_number, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (mcr !== "") {
        pool.query("update vendor set  micr_code = ?  where vendor_id=? ", [mcr, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (code !== "") {
        pool.query("update vendor set  rtgs_ifsccode = ?  where vendor_id=? ", [code, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (account_type !== "") {
        pool.query("update  vendor set account_type = ?  where vendor_id=? ", [account_type, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (account_number !== "") {
        pool.query("update vendor set  account_number = ?  where vendor_id=? ", [account_number, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (gb_posting !== "") {
        pool.query("update vendor set  generalbusinesspostinggroup = ?  where vendor_id=? ", [gb_posting, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (project_code !== "") {
        pool.query("update vendor set  projectcode = ?  where vendor_id=? ", [project_code, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (vendor_posting !== "") {
        pool.query("update vendor set  vendor_posting_group = ?  where vendor_id=? ", [vendor_posting, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (nob !== "") {
        pool.query("update vendor set  nod_noc = ?  where vendor_id=? ", [nob, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (nos !== "") {
        pool.query("update vendor set nos = ?  where vendor_id=? ", [nos, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (gst !== "") {
        pool.query("update vendor set  gst_number = ?  where vendor_id=? ", [gst, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (email !== "") {
        pool.query("update vendor set  email_address = ?  where vendor_id=? ", [email, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (gst_type !== "") {
        pool.query("update vendor set gst_type = ?  where vendor_id=? ", [gst_type, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (division !== "") {
        pool.query("update vendor set  divi_code = ?  where vendor_id=? ", [division, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (group !== "") {
        pool.query("update vendor set  group_code = ?  where vendor_id=? ", [group, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (fname !== "") {
        pool.query("update vendor set  filled_by = ?  where vendor_id=? ", [fname, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (intercom !== "") {
        pool.query("update vendor set  intercom_no = ?  where vendor_id=? ", [intercom, vendor_id], function (err, res) {
            if (err)
                console.log(err);
        })
    }
    res.render("homepage");


})



// ITEM QUERIES
app.post("/add_item", function (req, res) {
    var req_id;
    var reqid = "REQ-I-";
    const q = "SELECT * from request;";

    pool.query("SELECT request_id FROM request ", function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            setName(rows);
        }
    });

    function setName(value) {
        req_id = value[0].request_id;
        reqid += String(req_id);
        console.log(reqid)
        var id = req_id + 1;
        console.log(id);
        pool.query("update request set request_id=?", [id], function (errorr, rt) {
            if (errorr)
                console.log(errorr);
            else {
                const group = req.body.group;
                const fname = req.body.fname;
                const division = req.body.divison;
                const date = req.body.date;
                const intercom = req.body.intercom;
                const empid = req.body.empid;
                const user_name = req.body.user_name;
                const rc = req.body.rc;
                const description1 = req.body.description1;
                const description2 = req.body.description2;
                const unit = req.body.unit;
                const item_category = req.body.item_category;
                const prod_gr = req.body.prod_gr;
                const gp = req.body.gp;
                const ip = req.body.ip;
                const qc = req.body.qc;
                const noseries = req.body.noseries;
                const item_no = req.body.item_no;
                var update_status;
                const status = "Pending".toUpperCase();
                if (customer_id === "") {

                    update_status = "N".toUpperCase();

                }
                else {
                    update_status = "U".toUpperCase();

                }

                var query = `
	INSERT INTO item 
	(Number_Series,Item_No,Divi_Code,Group_Code,Filled_By,Date,Intercom_No,Emp_Code,Name,Description_1,Description_2,Unit,Item_Category,Product_Group,Res_Center,Gp_Posting,In_Posting,Quality_Check,Update_Status,Status) 
	VALUES ("${noseries}", "${item_no}", "${division}", "${group}","${fname}","${date}", "${intercom}", "${empid}", "${user_name}","${description1}", "${description2}", "${unit}", "${item_category}","${prod_gr}", "${rc}", "${gp}", "${ip}","${qc}","${update_status}","${status}");`;
                pool.query(query, function (error, data) {

                    if (error) {
                        console.log(error);
                    }
                    else {
                        res.render('request.ejs', { rqi: req_id });
                    }

                });
            }
        });
    }
});

app.post("/item_u", function (req, res) {
    const group = req.body.group;
    const fname = req.body.fname;
    const division = req.body.divison;
    const intercom = req.body.intercom;
    const user_name = req.body.user_name;
    const rc = req.body.rc;
    const description1 = req.body.description1;
    const description2 = req.body.description2;
    const unit = req.body.unit;
    const item_category = req.body.item_category;
    const prod_gr = req.body.prod_gr;
    const gp = req.body.gp;
    const ip = req.body.ip;
    const qc = req.body.qc;
    const item_no = req.body.item_no;

    if (group !== "") {
        pool.query("update item set Group_Code = ? where item_no=? ", [group, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    }
    if (division !== "") {
        pool.query("update item set Divi_Code = ? where item_no=?", [division, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (fname !== "") {
        pool.query("update item set  Filled_By = ? where item_no=? ", [fname, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (intercom !== "") {
        pool.query("update  item set Intercom_No = ? where item_no=? ", [intercom, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (user_name !== "") {
        pool.query("update item set  Name = ? where item_no=? ", [user_name, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (description1 !== "") {
        pool.query("update item set  Description_1 = ? where item_no=? ", [description1, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (description2 !== "") {
        pool.query("update  item set Description_2 = ? where item_no=? ", [description2, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (unit !== "") {
        pool.query("update item set  Unit = ? where item_no=? ", [unit, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (item_category !== "") {
        pool.query("update item set  Item_Category = ? where item_no=? ", [item_category, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (prod_gr !== "") {
        pool.query("update item set  Product_Group = ? where item_no=? ", [prod_gr, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (rc !== "") {
        pool.query("update item set  Res_Center = ? where item_no=?", [rc, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (gp !== "") {
        pool.query("update item set  Gp_Posting = ? where item_no=? ", [gp, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (ip !== "") {
        pool.query("update item set  In_Posting = ? where item_no=? ", [ip, item_no], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (qc !== "") {
        pool.query("update item set  Quality_Check = ? where item_no=?", [qc, item_no], function (err, res) {
            if (err)
                console.log(err);
        })

    }

    res.render("homepage");

})


// CUSTOMER



app.post("/add_customer", function (req, res) {
    var req_id;
    var reqid = "REQ-C-";
    var ttt = "";
    const q = "SELECT * from request;";

    pool.query("SELECT request_id FROM request ", function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            setName(rows);
        }
    });


    function setName(value) {
        req_id = value[0].request_id;
        reqid += String(req_id);
        console.log(reqid)
        var id = req_id + 1;
        console.log(id);
        pool.query("update request set request_id=?", [id], function (errorr, rt) {
            if (errorr)
                console.log(errorr);
            else {
                const group = req.body.group;
                const fname = req.body.fname;
                const division = req.body.division;
                const date = req.body.date;
                const intercom = req.body.intercom;
                const empid = req.body.empid;
                const customer_id = req.body.customer_id;
                const user_name = req.body.user_name;
                const address1 = req.body.address1;
                const address2 = req.body.address2;
                const post_code = req.body.post_code;
                const country_name = req.body.country_name;
                const state_name = req.body.state_name;
                const city = req.body.city;
                const gb_posting = req.body.gb_posting;
                const customer_posting = req.body.customer_posting;
                const gst_type = req.body.gst_type;
                const gst = req.body.gst;
                const pan_number = req.body.pan_number;
                const contact_name = req.body.contact_name;
                const phone_number = req.body.phone_number;
                const email = req.body.email;
                const rc = req.body.rc;
                const rd = req.body.rd;
                const project_code = req.body.project_code;
                var update_status;
                const status = "Pending".toUpperCase();
                if (customer_id === "") {

                    update_status = "N".toUpperCase();

                }
                else {
                    update_status = "U".toUpperCase();

                }


                var query = `
	INSERT INTO customer 
	(Request_id,Status,Update_Status,Project_Code,RES_Center,CEL_RD,Email,Contact_Person,Phone_No,PAN_No,GST_No,Country_Code,City,GB_Posting,Customer_Posting,GST_Type,State_Code,Address_1,Name,Intercom_No,Emp_Code,Address_2,Post_code,Customer_Id,Divi_Code,Group_code,Date,Filled_By) 
	VALUES ("${reqid}","${status}", "${update_status}", "${project_code}", "${rc}","${rd}", "${email}", "${contact_name}", "${phone_number}","${pan_number}", "${gst}", "${country_name}","${city}", "${gb_posting}", "${customer_posting}", "${gst_type}","${state_name}", "${address1}", "${user_name}", "${intercom}","${empid}", "${address2}", "${post_code}","${customer_id}", "${division}", "${group}", "${date}","${fname}");
	`;
                pool.query(query, function (error, data) {

                    if (error) {
                        console.log(error);
                    }
                    else {
                        res.render('request.ejs', { rqi: req_id });
                    }

                })
            }
        });
    }
});

app.post("/cus_u", function (req, res) {
    const group = req.body.group;
    const fname = req.body.fname;
    const division = req.body.division;
    const date = req.body.date;
    const intercom = req.body.intercom;
    const empid = req.body.empid;
    const customer_id = req.body.customer_id;
    const user_name = req.body.user_name;
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const post_code = req.body.post_code;
    const country_name = req.body.country_name;
    const state_name = req.body.state_name;
    const city = req.body.city;
    const gb_posting = req.body.gb_posting;
    const customer_posting = req.body.customer_posting;
    const gst_type = req.body.gst_type;
    const gst = req.body.gst;
    const pan_number = req.body.pan_number;
    const contact_name = req.body.contact_name;
    const phone_number = req.body.phone_number;
    const email = req.body.email;
    const rc = req.body.rc;
    const rd = req.body.rd;
    const project_code = req.body.project_code;
    var update_status;


    if (group !== "") {
        pool.query("update customer set Group_code = ? where customer_id=? ", [group, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (fname !== "") {
        pool.query("update customer set  Filled_By = ? where customer_id=?", [fname, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (division !== "") {
        pool.query("update customer set  Divi_Code = ? where customer_id=?", [division, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (intercom !== "") {
        pool.query("update customer set  Intercom_No = ? where customer_id=?", [intercom, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (user_name !== "") {
        pool.query("update customer set  Name = ? where customer_id=?", [user_name, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (address1 !== "") {
        pool.query("update customer set  Address_1 = ? where customer_id=?", [address1, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (address2 !== "") {
        pool.query("update customer set  Address_2 = ? where customer_id=?", [address2, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (post_code !== "") {
        pool.query("update customer set  Post_code = ? where customer_id=?", [post_code, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (country_name !== "") {
        pool.query("update customer set  Country_Code = ? where customer_id=?", [country_name, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (state_name !== "") {
        pool.query("update customer set  State_Code = ? where customer_id=?", [state_name, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (city !== "") {
        pool.query("update customer set  City = ? where customer_id=?", [city, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (gb_posting !== "") {
        pool.query("update customer set  GB_Posting = ? where customer_id=?", [gb_posting, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (customer_posting !== "") {
        pool.query("update customer set  Customer_Posting = ? where customer_id=?", [customer_posting, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (gst_type !== "") {
        pool.query("update customer set  GST_Type = ? where customer_id=?", [gst_type, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (gst !== "") {
        pool.query("update customer set  GST_No = ? where customer_id=?", [gst, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (pan_number !== "") {
        pool.query("update customer set  PAN_No = ? where customer_id=?", [pan_number, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (contact_name !== "") {
        pool.query("update customer set  Contact_Person = ? where customer_id=?", [contact_name, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (phone_number !== "") {
        pool.query("update customer set  Phone_No = ? where customer_id=?", [phone_number, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (email !== "") {
        pool.query("update customer set  Email = ? where customer_id=?", [email, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (rc !== "") {
        pool.query("update customer set  RES_Center = ? where customer_id=?", [rc, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (rd !== "") {
        pool.query("update customer set  CEL_RD = ? where customer_id=?", [rd, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    } if (project_code !== "") {
        pool.query("update customer set  Project_Code = ? where customer_id=?", [project_code, customer_id], function (err, res) {
            if (err)
                console.log(err);
        })
    }
    res.render("homepage");
})



// FIXED ASSETS

app.post("/add_fixed_asset", function (req, res) {
    var req_id;
    var reqid = "REQ-FA-";
    var ttt = "";
    const q = "SELECT * from request;";

    pool.query("SELECT request_id FROM request ", function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            setName(rows);
        }
    });

    function setName(value) {
        req_id = value[0].request_id;
        reqid += String(req_id);
        console.log(reqid)
        var id = req_id + 1;
        console.log(id);
        pool.query("update request set request_id=?", [id], function (errorr, rt) {
            if (errorr)
                console.log(errorr);
            else {
                const group = req.body.group;
                const fname = req.body.fname;
                const division = req.body.divison;
                const date = req.body.date;
                const intercom = req.body.intercom;
                const empid = req.body.empid;
                const description2 = req.body.description2;
                const description1 = req.body.description1;
                const gst = req.body.gst;
                const rc = req.body.rc;
                const rs = req.body.rs;
                const fa_no = req.body.fa_no;
                const bu = req.body.bu;
                const vc = req.body.vc;
                const purpose = req.body.purpose;
                const idg = req.body.idg;
                const fa_loc = req.body.fa_loc;
                const fa_pg = req.body.fa_pg;
                const fa_code = req.body.fa_code;
                const fa_sub = req.body.fa_sub;
                const dm = req.body.dm;
                const dp = req.body.dp;
                var update_status;
                const status = "Pending".toUpperCase();
                if (customer_id === "") {

                    update_status = "N".toUpperCase();

                }
                else {
                    update_status = "U".toUpperCase();

                }

                var query = `
	INSERT INTO fixed_assets 
	(Request_Id,Number,Divi_Code,Group_Code,Filled_By,Date,Intercom_No,Emp_Code,Description_1,Business_Unit,Description_2,Unit,Res_Center,Hsn_Gst,Rep_Sys,Vendor_Code,Purpose,Import_Duty,Fa_Location,Fa_Posting,Fa_Class,Depreciation_Method,Fa_Sub,Depreciation_Per,Update_Status,Status) 
	VALUES ("${reqid}", "${fa_no}", "${division}", "${group}","${fname}", "${date}", "${intercom}", "${empid}","${description1}", "${bu}", "${description2}", "${unit}","${rc}", "${gst}", "${rs}", "${vc}","${purpose}", "${idg}", "${fa_loc}", "${fa_pg}","${fa_code}", "${dm}", "${fa_sub}", "${dp}","${update_status}","${status}");
	`;
                pool.query(query, function (error, data) {

                    if (error) {
                        console.log(error);
                    }
                    else {
                        res.render('request.ejs', { rqi: req_id });
                    }

                })
            }
        });
    }
});





// app.get("/admin",function(req,res){
//     res.render("admin");
// }) 


app.post("/search", function (req, res) {
    var rep = req.body.reqID;
    var ven = "REQ-V-" + String(rep);
    var fa = "REQ-FA-" + String(rep);
    var it = "REQ-I-" + String(rep);
    var cus = "REQ-C-" + String(rep);
    pool.query("select status from vendor  where request_id=?", [ven], function (err, ress) {
        var ans = ress[0];
        if (ress.length > 0) {
            console.log(ans);
            res.render("search", { rqi: ven, stat: ans.status });
        } else {
            pool.query("select status from customer  where request_id=?", [cus], function (err, ress2) {
                var ans2 = ress2[0];
                if (ress2.length > 0) {
                    res.render("search", { rqi: cus, stat: ans2.status });
                } else {


                    pool.query("select status from fixed_assets where request_id=?", [fa], function (err, ress3) {
                        var ans3 = ress3[0];
                        if (ress3.length > 0) {
                            res.render("search", { rqi: fa, stat: ans3.status });
                        } else {


                            pool.query("select status from item where request_id=?", [it], function (err, ress4) {
                                var ans4 = ress4[0];
                                if (ress4.length > 0) {
                                    res.render("search", { rqi: it, stat: ans4.status });
                                } else {


                                    var temp = "not Exist";
                                    res.render("search", { rqi: rep, stat: temp });
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

app.get("/admin", function (req, res) {

    pool.query("Select vendor_id,request_id,name,address_1,city,state_code,gst_number,divi_code,group_code,update_status,date from vendor  where status='PENDING'", function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log("fetching ");

            pool.query("Select Customer_Id,Request_Id,Name,Address_1,City,State_Code,GST_No,Divi_Code,Group_Code,Update_Status,Date from customer  where Status='PENDING'", function (errr, rows1, fields) {
                if (errr) {
                    console.log(errr);
                }
                else {
                    console.log("fetching ");
                    pool.query("Select Item_No,Request_Id,Number_Series,Description_1,Description_2,Filled_By,Divi_Code,Group_Code,Date,Gp_Posting,In_Posting,Update_Status from item where Status='PENDING'", function (errrr, rows2, fields) {
                        if (errrr) {
                            console.log(errrr);
                        }
                        else {
                            console.log("fetching ");

                            pool.query("Select Request_Id,Number,Description_1,Description_2,RES_Center,Fa_Location,Fa_Posting,Fa_Class,Divi_Code,Group_code,Update_Status from fixed_assets where Status='PENDING'", function (errrrr, rows3, fields) {
                                if (errrrr) {
                                    console.log(errrrr);
                                }
                                else {
                                    console.log("sending ");

                                    res.render("admin", { Data: rows, Data_cus: rows1, Data_item: rows2, Data_fa: rows3 });
                                }
                            })
                        }
                    })
                }
            })
        }

    })
});


app.post("/download_ven", (req, res) => {
    // var reqid=req.body.reqqq.value;
    // var cus = req.body.ven_id;
    // var qqqq='update vendor SET vendor_id=? where status="pending";';
    // pool.query(qqqq,[cus],function(err,rep){
    //     if(err)
    //     console.log(err);
    //     else
    //     console.log("done");
    // });
    pool.query("Select vendor_id,request_id,name,address_1,city,state_code,gst_number,divi_code,group_code from vendor where status='PENDING';", function (err, rows, fields) {

        if (err)
            console.log(err);
        else {
            const jsonCustomers = JSON.parse(JSON.stringify(rows));
            var workbook = new excel.Workbook(); //creating workbook
            var worksheet = workbook.addWorksheet('Export.xlsx'); //creating worksheet

            worksheet.columns = [
                { header: 'vendor_id', key: 'vendor_id', width: 10 },
                { header: 'request_id', key: 'request_id', width: 30 },
                { header: 'name', key: 'name', width: 30 },
                { header: 'address_1', key: 'address_1', width: 10, outlineLevel: 1 },
                { header: 'city', key: 'city', width: 10, outlineLevel: 1 },
                { header: 'state_code', key: 'state_code', width: 10, outlineLevel: 1 },
                { header: 'gst_number', key: 'gst_number', width: 10, outlineLevel: 1 },
                { header: 'divi_code', key: 'divi_code', width: 10, outlineLevel: 1 },
                { header: 'group_code', key: 'group_code', width: 10, outlineLevel: 1 },

            ];

            worksheet.addRows(jsonCustomers);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            // res.setHeader(
            //     "Content-Disposition",
            //     "attachment; filename=" + "Export.xlsx"
            // );

            return workbook.xlsx.write(res).then(function () {
                pool.query("Select vendor_id,request_id,name,address_1,city,state_code,gst_number,divi_code,group_code,update_status,date from vendor  where status='PENDING'", function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("fetching ");

                        pool.query("Select Customer_Id,Request_Id,Name,Address_1,City,State_Code,GST_No,Divi_Code,Group_Code,Update_Status,Date from customer  where Status='PENDING'", function (errr, rows1, fields) {
                            if (errr) {
                                console.log(errr);
                            }
                            else {
                                console.log("fetching ");
                                pool.query("Select Item_No,Request_Id,Number_Series,Description_1,Description_2,Filled_By,Divi_Code,Group_Code,Date,Gp_Posting,In_Posting,Update_Status from item where Status='PENDING'", function (errrr, rows2, fields) {
                                    if (errrr) {
                                        console.log(errrr);
                                    }
                                    else {
                                        console.log("fetching ");

                                        pool.query("Select Request_Id,Number,Description_1,Description_2,RES_Center,Fa_Location,Fa_Posting,Fa_Class,Divi_Code,Group_code,Update_Status from fixed_assets where Status='PENDING'", function (errrrr, rows3, fields) {
                                            if (errrrr) {
                                                console.log(errrrr);
                                            }
                                            else {
                                                console.log("sending ");

                                                res.render("admin", { Data: rows, Data_cus: rows1, Data_item: rows2, Data_fa: rows3 });
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }

                })
            }
            )
        }
    })





    // workbook.xlsx.writeFile("Export.xlsx")
    // .then(function() {

    // 	res.download("Export.xlsx")
});



app.post("/download_cus", (req, res) => {
   var chee=req.body.checker;
   console.log(chee==='on');
    pool.query("Select Customer_Id,Request_Id,Name,Address_1,City,State_Code,GST_No,Divi_Code,Group_Code from customer where status='PENDING'and Customer_Id!='' ;", function (err, rows, fields) {

        if (err)
            console.log(err);
        else {
            const jsonCustomers = JSON.parse(JSON.stringify(rows));
            var workbook = new excel.Workbook(); //creating workbook
            var worksheet = workbook.addWorksheet('Export_CUS.xlsx'); //creating worksheet

            worksheet.columns = [
                { header: 'Customer_Id', key: 'Customer_Id', width: 10 },
                { header: 'Request_Id', key: 'Request_Id', width: 30 },
                { header: 'Name', key: 'Name', width: 30 },
                { header: 'Address_1', key: 'Address_1', width: 10, outlineLevel: 1 },
                { header: 'City', key: 'City', width: 10, outlineLevel: 1 },
                { header: 'State_Code', key: 'State_Code', width: 10, outlineLevel: 1 },
                { header: 'GST_No', key: 'GST_No', width: 10, outlineLevel: 1 },
                { header: 'Divi_Code', key: 'Divi_Code', width: 10, outlineLevel: 1 },
                { header: 'Group_Code', key: 'Group_Code', width: 10, outlineLevel: 1 },

            ];

            worksheet.addRows(jsonCustomers);
            
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                 res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "Export_CUS.xlsx"
                );
            return workbook.xlsx.write(res).then(function () {

                pool.query("Select vendor_id,request_id,name,address_1,city,state_code,gst_number,divi_code,group_code,update_status,date  where status='PENDING'", function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("fetching ");

                        pool.query("Select Customer_Id,Request_Id,Name,Address_1,City,State_Code,GST_No,Divi_Code,Group_Code,Update_Status,Date where customer_id=? where Status='PENDING'", function (errr, rows1, fields) {
                            if (errr) {

                            }
                            else {
                                console.log("fetching ");
                                pool.query("Select Item_No,Request_Id,Number_Series,Description_1,Description_2,Filled_By,Divi_Code,Group_Code,Date,Gp_Posting,In_Posting,Update_Status from item where Status='PENDING'", function (errrr, rows2, fields) {
                                    if (errrr) {

                                    }
                                    else {
                                        console.log("fetching ");

                                        pool.query("Select Request_Id,Number,Description_1,Description_2,RES_Center,Fa_Location,Fa_Posting,Fa_Class,Divi_Code,Group_code,Update_Status from fixed_assets where Status='PENDING'", function (errrrr, rows3, fields) {
                                            if (errrrr) {
                                                console.log(errrrr);
                                            }
                                            else {
                                                console.log("sending ");

                                                res.render("admin", { Data: rows, Data_cus: rows1, Data_item: rows2, Data_fa: rows3 });
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }

                })
                                            
                })
            

        
            }})

});

app.post("/up_cus", (req, res) => {
    var reqid = req.body.reqqq;
    console.log(reqid);
    var cus = req.body.cus_id;
    console.log(cus);
    var stat = "created";
    var qqqq = `update customer SET Customer_Id=? where Request_Id=? and  Status='PENDING';`;
    pool.query(qqqq, [cus, reqid], function (err, rep) {
       if(err)
       console.log(err);
       else
       console.log("Updated");
            });
    });

// pool.query("Select Customer_Id,Request_Id,Name,Address_1,City,State_Code,GST_No,Divi_Code,Group_Code from customer where Status='PENDING';", function (err, rows, fields) {

//     if (err)
//         console.log(err);
//     else {
//         const jsonCustomers = JSON.parse(JSON.stringify(rows));
//         var workbook = new excel.Workbook(); //creating workbook
//         var worksheet = workbook.addWorksheet('Export_CUS.xlsx'); //creating worksheet

//         worksheet.columns = [
//             { header: 'Customer_Id', key: 'Customer_Id', width: 10 },
//             { header: 'Request_Id', key: 'Request_Id', width: 30 },
//             { header: 'Name', key: 'Name', width: 30 },
//             { header: 'Address_1', key: 'Address_1', width: 10, outlineLevel: 1 },
//             { header: 'City', key: 'City', width: 10, outlineLevel: 1 },
//             { header: 'State_Code', key: 'State_Code', width: 10, outlineLevel: 1 },
//             { header: 'GST_No', key: 'GST_No', width: 10, outlineLevel: 1 },
//             { header: 'Divi_Code', key: 'Divi_Code', width: 10, outlineLevel: 1 },
//             { header: 'Group_Code', key: 'Group_Code', width: 10, outlineLevel: 1 },

//         ];

//         worksheet.addRows(jsonCustomers);
//         res.setHeader(
//             "Content-Type",
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         res.setHeader(
//             "Content-Disposition",
//             "attachment; filename=" + "Export_CUS.xlsx"
//         );

//         return workbook.xlsx.write(res).then(function () {
//             pool.query("Select vendor_id,request_id,name,address_1,city,state_code,gst_number,divi_code,group_code,update_status,date  where status='PENDING'", function (err, rows, fields) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log("fetching ");

//                     pool.query("Select Customer_Id,Request_Id,Name,Address_1,City,State_Code,GST_No,Divi_Code,Group_Code,Update_Status,Date where customer_id=? where Status='PENDING'", function (errr, rows1, fields) {
//                         if (errr) {

//                         }
//                         else {
//                             console.log("fetching ");
//                             pool.query("Select Item_No,Request_Id,Number_Series,Description_1,Description_2,Filled_By,Divi_Code,Group_Code,Date,Gp_Posting,In_Posting,Update_Status from item where Status='PENDING'", function (errrr, rows2, fields) {
//                                 if (errrr) {

//                                 }
//                                 else {
//                                     console.log("fetching ");

//                                     pool.query("Select Request_Id,Number,Description_1,Description_2,RES_Center,Fa_Location,Fa_Posting,Fa_Class,Divi_Code,Group_code,Update_Status from fixed_assets where Status='PENDING'", function (errrrr, rows3, fields) {
//                                         if (errrrr) {
//                                             console.log(errrrr);
//                                         }
//                                         else {
//                                             console.log("sending ");

//                                             res.render("admin", { Data: rows, Data_cus: rows1, Data_item: rows2, Data_fa: rows3 });
//                                         }
//                                     })
//                                 }
//                             })
//                         }
//                     })
//                 }

//             })



// workbook.xlsx.writeFile("Export.xlsx")
// .then(function() {

// 	res.download("Export.xlsx")
// });

// });



app.post("/download_fa", (req, res) => {
    // var reqid=req.body.reqqq.value;
    // var cus = req.body.ven_id;
    // var qqqq='update vendor SET vendor_id=? where status="pending";';
    // pool.query(qqqq,[cus],function(err,rep){
    //     if(err)
    //     console.log(err);
    //     else
    //     console.log("done");
    // });
    pool.query("Select Request_Id,Number,Description_1,Description_2,RES_Center,Fa_Location,Fa_Posting,Fa_Class,Divi_Code,Group_code from fixed_assets where Status='PENDING';", function (err, rows, fields) {

        if (err)
            console.log(err);
        else {
            const jsonCustomers = JSON.parse(JSON.stringify(rows));
            var workbook = new excel.Workbook(); //creating workbook
            var worksheet = workbook.addWorksheet('Export_FA.xlsx'); //creating worksheet

            worksheet.columns = [
                { header: 'Request_Id', key: 'Request_Id', width: 10 },
                { header: 'Number', key: 'Number', width: 30 },
                { header: 'Description_1', key: 'Description_1', width: 30 },
                { header: 'Description_2', key: 'Description_2', width: 10, outlineLevel: 1 },
                { header: 'RES_Center', key: 'RES_Center', width: 10, outlineLevel: 1 },
                { header: 'Fa_Location', key: 'Fa_Location', width: 10, outlineLevel: 1 },
                { header: 'Fa_Posting', key: 'Fa_Posting', width: 10, outlineLevel: 1 },
                { header: 'Fa_Class', key: 'Fa_Class', width: 10, outlineLevel: 1 },
                { header: 'Divi_Code', key: 'Divi_Code', width: 10, outlineLevel: 1 },
                { header: 'Group_code', key: 'Group_code', width: 10, outlineLevel: 1 },

            ];

            worksheet.addRows(jsonCustomers);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "Export_FA.xlsx"
            );

            return workbook.xlsx.write(res).then(function () {
                pool.query("Select vendor_id,request_id,name,address_1,city,state_code,gst_number,divi_code,group_code,update_status,date  where status='PENDING'", function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("fetching ");

                        pool.query("Select Customer_Id,Request_Id,Name,Address_1,City,State_Code,GST_No,Divi_Code,Group_Code,Update_Status,Date where customer_id=? where Status='PENDING'", function (errr, rows1, fields) {
                            if (errr) {

                            }
                            else {
                                console.log("fetching ");
                                pool.query("Select Item_No,Request_Id,Number_Series,Description_1,Description_2,Filled_By,Divi_Code,Group_Code,Date,Gp_Posting,In_Posting,Update_Status from item where Status='PENDING'", function (errrr, rows2, fields) {
                                    if (errrr) {

                                    }
                                    else {
                                        console.log("fetching ");

                                        pool.query("Select Request_Id,Number,Description_1,Description_2,RES_Center,Fa_Location,Fa_Posting,Fa_Class,Divi_Code,Group_code,Update_Status from fixed_assets where Status='PENDING'", function (errrrr, rows3, fields) {
                                            if (errrrr) {
                                                console.log(errrrr);
                                            }
                                            else {
                                                console.log("sending ");

                                                res.render("admin", { Data: rows, Data_cus: rows1, Data_item: rows2, Data_fa: rows3 });
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }

                })



                // workbook.xlsx.writeFile("Export.xlsx")
                // .then(function() {

                // 	res.download("Export.xlsx")
            });

        }
    })
});



app.post("/download_item", (req, res) => {
    // var reqid=req.body.reqqq.value;
    // var cus = req.body.ven_id;
    // var qqqq='update vendor SET vendor_id=? where status="pending";';
    // pool.query(qqqq,[cus],function(err,rep){
    //     if(err)
    //     console.log(err);
    //     else
    //     console.log("done");
    // });
    pool.query("Select Item_No,Request_Id,Number_Series,Description_1,Description_2,Filled_By,Divi_Code,Group_Code,Gp_Posting,In_Posting from item where Status='PENDING';", function (err, rows, fields) {

        if (err)
            console.log(err);
        else {
            const jsonCustomers = JSON.parse(JSON.stringify(rows));
            var workbook = new excel.Workbook(); //creating workbook
            var worksheet = workbook.addWorksheet('Export_ITEM.xlsx'); //creating worksheet

            worksheet.columns = [
                { header: 'Item_No', key: 'Item_No', width: 10 },
                { header: 'Request_Id', key: 'Request_Id', width: 30 },
                { header: 'Number_Series', key: 'Number_Series', width: 30 },
                { header: 'Description_1', key: 'Description_1', width: 10, outlineLevel: 1 },
                { header: 'Description_2', key: 'Description_2', width: 10, outlineLevel: 1 },
                { header: 'Filled_By', key: 'Filled_By', width: 10, outlineLevel: 1 },
                { header: 'Divi_Code', key: 'Divi_Code', width: 10, outlineLevel: 1 },
                { header: 'Group_Code', key: 'Group_Code', width: 10, outlineLevel: 1 },
                { header: 'Gp_Posting', key: 'Gp_Posting', width: 10, outlineLevel: 1 },
                { header: 'In_Posting', key: 'In_Posting', width: 10, outlineLevel: 1 },

            ];

            worksheet.addRows(jsonCustomers);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "Export_ITEM.xlsx"
            );

            return workbook.xlsx.write(res).then(function () {
                pool.query("Select vendor_id,request_id,name,address_1,city,state_code,gst_number,divi_code,group_code,update_status,date  where status='PENDING'", function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("fetching ");

                        pool.query("Select Customer_Id,Request_Id,Name,Address_1,City,State_Code,GST_No,Divi_Code,Group_Code,Update_Status,Date where customer_id=? where Status='PENDING'", function (errr, rows1, fields) {
                            if (errr) {

                            }
                            else {
                                console.log("fetching ");
                                pool.query("Select Item_No,Request_Id,Number_Series,Description_1,Description_2,Filled_By,Divi_Code,Group_Code,Date,Gp_Posting,In_Posting,Update_Status from item where Status='PENDING'", function (errrr, rows2, fields) {
                                    if (errrr) {

                                    }
                                    else {
                                        console.log("fetching ");

                                        pool.query("Select Request_Id,Number,Description_1,Description_2,RES_Center,Fa_Location,Fa_Posting,Fa_Class,Divi_Code,Group_code,Update_Status from fixed_assets where Status='PENDING'", function (errrrr, rows3, fields) {
                                            if (errrrr) {
                                                console.log(errrrr);
                                            }
                                            else {
                                                console.log("sending ");

                                                res.render("admin", { Data: rows, Data_cus: rows1, Data_item: rows2, Data_fa: rows3 });
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }

                })



                // workbook.xlsx.writeFile("Export.xlsx")
                // .then(function() {

                // 	res.download("Export.xlsx")
            });

        }
    })
});


app.post("/issue", function (req, res) {
    var req_id;
    var reqid = "REQ-IS-";
    var ttt = "";
    const q = "SELECT * from request;";

    pool.query("SELECT request_id FROM request ", function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            setName(rows);
        }
    });


    function setName(value) {
        req_id = value[0].request_id;
        reqid += String(req_id);
        console.log(reqid)
        var id = req_id + 1;
        console.log(id);
        pool.query("update request set request_id=?", [id], function (errorr, rt) {
            if (errorr)
                console.log(errorr);
            else {
                const group = req.body.group;
                const fname = req.body.fname;
                const division = req.body.division;
                const date = req.body.date;
                const Empid = req.body.Empid;
                const customer_id = req.body.customer_id;
                const type = req.body.type;
                const issue = req.body.issue;
                const depart = req.body.depart;
                const desg = req.body.desg;
                var update_status;
                const status = "Pending".toUpperCase();
                if (customer_id === "") {

                    update_status = "N".toUpperCase();

                }
                else {
                    update_status = "U".toUpperCase();
                }
                var query = `
	INSERT INTO issues 
	(Request_Id,Emp_Code,Divi_Code,Group_Code,Filled_By,Date,Department,Designation,Type,Issue_Description,Update_Status,Status) 
	VALUES ("${reqid}","${Empid}", "${division}", "${group}", "${fname}","${date}", "${depart}", "${desg}", "${type}","${issue}","${update_status}","${status}");`;
                pool.query(query, function (error, data) {

                    if (error) {
                        console.log(error);
                    }
                    else {
                        res.render('request.ejs', { rqi: req_id });
                    }

                })
            }
        });
    }
});

app.post("/ict", function (req, res) {
    var req_id;
    var reqid = "REQ-IT-";
    var ttt = "";
    const q = "SELECT * from request;";

    pool.query("SELECT request_id FROM request ", function (err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            setName(rows);
        }
    });


    function setName(value) {
        req_id = value[0].request_id;
        reqid += String(req_id);
        console.log(reqid)
        var id = req_id + 1;
        console.log(id);
        pool.query("update request set request_id=?", [id], function (errorr, rt) {
            if (errorr)
                console.log(errorr);
            else {
                const group = req.body.group;
                const NSCI = req.body.NSCI;
                const division = req.body.division;
                const date = req.body.date;
                const Empid = req.body.Empid;
                const NSC = req.body.NSC;
                const LIC = req.body.LIC;
                const VPF = req.body.VPF;
                const HRR = req.body.HRR;
                const name = req.body.name;
                const ULIP = req.body.ULIP;
                const PPF = req.body.PPF;
                const RPL = req.body.RPL;
                const MF = req.body.MF;
                const US_80D = req.body.US_80D;
                const US_80DD = req.body.US_80DD;
                const US_80E = req.body.US_80E;
                const OTHSAV = req.body.OTHSAV;
                const ONAME = req.body.ONAME;
                const OPAN = req.body.OPAN;
                const US_24B = req.body.US_24B;
                const US_80CCD = req.body.US_80CCD;
                const status = "Pending".toUpperCase();

                var query = `
	INSERT INTO income_tax 
	(EMP_KEY,EMP_NAME,EMP_DIV,HRR,VPF,LIC,NSC,NSCI,ULIP,PPF,RPL,MF,US_80D,US_80DD,US_80E,OTHSAV,ONAME,OPAN,US_80CCD,US_24B,REQUEST_ID,ITR_STATUS
    ) 
	VALUES ("${Empid}","${name}", "${division}", "${HRR}", "${VPF}","${LIC}", "${NSC}", "${NSCI}", "${ULIP}","${PPF}","${RPL}","${MF}","${US_80D}","${US_80DD}","${US_80E}","${OTHSAV}","${ONAME}","${OPAN}","${US_80CCD}","${US_24B}","${reqid}","${status}");`;
                pool.query(query, function (error, data) {

                    if (error) {
                        console.log(error);
                    }
                    else {
                        res.render('request.ejs', { rqi: req_id });
                    }

                })
            }
        });
    }
});
app.get('/register', function (req, res, next) {
    res.render('registration');
});
app.post('/register', function (req, res, next) {


    var name = req.body.ename;
    var empid = req.body.epid;
    var password = md5(req.body.pwd);
    var confirm_password = md5(req.body.conpwd);


    var sql = 'SELECT * FROM login_details WHERE Emp_Code =?';
    pool.query(sql, [empid], function (err, data, fields) {
        if (err) console.log(err);
        if (data.length > 1) {
            var msg = empid + "was already exist";
        } else if (confirm_password != password) {
            var msg = "Password & Confirm Password is not Matched";
        } else {

            // save users data into database
            var query = `
            INSERT INTO login_details
            (Name,Emp_Code,Password) 
            VALUES ("${name}","${empid}", "${password}");`;
            pool.query(query, function (err, data) {
                if (err) console.log(err);
                else {
                    var msg = "Your are successfully registered";
                    res.render('registration', { alertMsg: msg });
                }
            });

        }

    })

});
app.get("/registration", function (req, res) {
    res.render('registration');
})
app.get("/after", function (req, res) {
    res.render('homepage');
});
app.get("/log", function (req, res) {
    // req.session.destroy();
    // pool.end();
    res.redirect("/");
});
app.get("/", function (req, res) {
    res.render('login');
});
app.get("/na", function (req, res) {
    res.render('NAhomepage');
});
// app.get("/register",function(req,res){
//     res.render("registration");
// })
app.listen(8080, function (req, res) {
    console.log("server started");
});