const mongoose=require('mongoose');
require('dotenv').config({ path: '.env' })

const db_username=process.env.db_username
const db_password=process.env.db_password
const host_port=process.env.db_host_with_port
const db_name=process.env.db_name


// let connection_url=`mongodb://`

let connection_url=`mongodb://`

if(db_username!='' && db_password!=''){
    connection_url+=db_username+':'+db_password
}

connection_url+=host_port+'/'+db_name

//connection_url+="?retryWrites=true&w=majority";
let live_connection_url="mongodb+srv://biswajit_dev_01:biswajitdev@cluster0.oodta.mongodb.net/twitter_posts?retryWrites=true&w=majority"
const db={}

db.mongoose=mongoose;
db.connect=mongoose.connect(`${live_connection_url}`);


module.exports = db