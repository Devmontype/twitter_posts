const Busboy = require('busboy');
const fs=require('fs');
const path=require('path');
require('dotenv').config({ path: '.env' })

const db=require('../config/db');
const {UserModel}=require('../models/user_model');
const {PostModel}=require('../models/post_model');
const {FollowModel}=require('../models/follow_user_model');
var successResp = require('../helper/success_handler').SuccessResponse;
var errorResp = require('../helper/error_handler').errorResponse;


async function check_email_exist(req,res,next){
    try{
        let data={}
        let email=await UserModel.find({email:req.body.email}).count()
        if(email!=0){
            data.exist=false;
        }else{
            data.exist=true;
        }
        res.send(data.exist)
    }catch(err){
        errorResp(res, "something wrong", 201, {});
    }
}

async function signin(req,res,next){
    try{
        let sess=req.session

        let data={}

        data.error=sess.error_msg!=undefined?`${sess.error_msg}`:''
        data.success=sess.success_msg!=undefined?`${sess.success_msg}`:''

        req.session.error_msg=''
        req.session.success_msg=''

        if(Object.keys(req.body).length!=0){
            let user=await UserModel.findOne({email:req.body.email,password:req.body.password})
            if(user!=undefined && user!=null && user.length!=0){
                req.session.user=user
                return res.redirect('/dashboard');
            }else{
                req.session.user=''
                req.session.error_msg="Sorry No user found";
                return res.redirect('/');
            }
            

        }else{
            
            res.render('index',{...data});
        }
        
    }catch(err){
        req.session.error_msg="Sorry something wrong";
        res.redirect('/');
    }
    
}


async function signup(req,res,next){
    
    try{
        let sess=req.session

        let data={}
        data.base_url=process.env.project_url+'email_exist'
        data.error=sess.error_msg!=undefined?`${sess.error_msg}`:''
        data.success=sess.success_msg!=undefined?`${sess.success_msg}`:''

        req.session.error_msg=''
        req.session.success_msg=''

        if(Object.keys(req.body).length!=0){

            let user_obj=new UserModel({
                email:req.body.email,
                fullname:req.body.fullname,
                password:req.body.password,
                about:req.body.about,
                location:req.body.location
            })
            let user=await user_obj.save()
            if(user!=undefined && user!=null && user.length!=0){
                req.session.user=user
                req.session.success_msg="Signup successfull"
            }else{
                req.session.error_msg="Sorry Something wrong.Please try again";
            }
            res.redirect('/dashboard');

        }else{
            
            res.render('signup',{...data});
        }
        
    }catch(err){
        req.session.error_msg="Sorry something wrong";
        res.redirect('/signup');
    }
}

async function dashboard(req,res,next){
    try{
        
        let sess=req.session
        let data={}
        
        data.base_url=process.env.project_url
        data.posts=[]
        

        //list my posts
        let list_user_posts=await PostModel.find({user_id:sess.user._id})

        if(list_user_posts.length>0){

            await Promise.all(list_user_posts.map(async function(lup){
                let obj={
                    ...lup._doc
                }

                obj.content_file=process.env.project_url+'static/uploads/'+lup.content_file;
                data.posts.push(obj);
            }))
        }


        data.followings=await FollowModel.find({followed_by:sess.user._id,is_follow:1}).count()
        data.followers=await FollowModel.find({follow_to:sess.user._id,is_follow:1}).count()
        //follow new user
        data.new_users=[]
        let new_users=await UserModel.find({_id:{$ne:sess.user._id}})

        if(new_users.length!=0){
            await Promise.all(new_users.map(async function(nu){
                let obj2={
                    ...nu._doc
                }

                let check_user_followed_by=await FollowModel.find({followed_by:sess.user._id,follow_to:nu._id})
                
                if(check_user_followed_by.length!=0){
                    if(check_user_followed_by[0].is_follow!=1){
                        
                        data.new_users.push(obj2)
                    }
                }else{
                    data.new_users.push(obj2)
                }
                
            }))
        }

        //timeline
        let timeline=await PostModel.aggregate([
            {$sort: {createdAt: -1}},
            {
                $lookup:{
                    from:"users",
                    localField:"user_id",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {
                $project:{
                    "_id":1,
                    "content":1,
                    "content_file":1,
                    "content_file_type":1,
                    "createdAt":1,
                    "user.fullname":1,
                    "user._id":1
                }
            },
            
        ])
        
        data.timeline=[]
        if(timeline.length>0){

            await Promise.all(timeline.map(async function(tp){
                let obj3={
                    ...tp
                }

                obj3.content_file=process.env.project_url+'static/uploads/'+tp.content_file;
                if(sess.user._id==tp.user[0]._id){
                    data.timeline.push(obj3);
                }else{
                    let user_followed_or_not=await FollowModel.find({followed_by:sess.user._id,follow_to:tp.user[0]._id,is_follow:1})
                    if(user_followed_or_not.length!=0){
                        data.timeline.push(obj3);
                    }
                }   
                
            }))
        }

        if(data.timeline.length!=0){
            data.timeline.sort(function(a, b) {
                var keyA = new Date(a.createdAt),
                  keyB = new Date(b.createdAt);
                if (keyA < keyB) return 1;
                if (keyA > keyB) return -1;
                return 0;
            });
        }   
        
        
        data.error=sess.error_msg!=undefined?`${sess.error_msg}`:''
        data.success=sess.success_msg!=undefined?`${sess.success_msg}`:''

        req.session.error_msg=''
        req.session.success_msg=''

        data.user=sess.user
        
        res.render('dashboard',{...data});
    }catch(err){
        
        req.session.error_msg="Sorry something wrong";
        res.redirect('/dashboard');
    }
    
}

async function signout(req,res,next){
    try{
        req.session.user='';
        req.session.destroy();
        res.redirect('/');
    }catch(err){
        
        req.session.error_msg="Sorry something wrong";
        res.redirect('/dashboard');
    }
}


async function addPost(req,res,next){
    try{
        let post_data={}
        let busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
            
            let new_file=new Date().getTime()+path.extname(filename);
            if(mimetype.includes('image')){
                post_data.content_file_type='image'
            }else{
                post_data.content_file_type='video'

            }
            
            post_data.content_file=new_file
            let saveTo = path.join(__dirname, '../public/uploads/' + new_file);
            file.pipe(fs.createWriteStream(saveTo));
        })

        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            if(fieldname=="post_owner_id"){
                post_data.user_id=db.mongoose.Types.ObjectId(val)
            }
            if(fieldname=="content"){
                post_data.content=val
            }
        });

        busboy.on('finish', async function() {
            let new_post_obj=new PostModel(post_data);
            let new_post_data=await new_post_obj.save();
            req.session.success_msg="Post uploaded"
            // res.redirect('/dashboard');
        });
        let req_stream = req.pipe(busboy);
        req_stream.on('finish', function () {
            res.redirect('/dashboard');
        });
        // return req.pipe(busboy); 
    }catch(err){
        
        req.session.error_msg="Sorry something wrong";
        res.redirect('/dashboard');
        
    }
}

async function follow_unfollow_user(req,res,next){
    try{
        let followed_by=db.mongoose.Types.ObjectId(req.body.user_id)
        let follow_to=db.mongoose.Types.ObjectId(req.body.follow_user_id)
        let is_follow=Number(req.body.is_follow)
        let data={is_follow:is_follow}

        let follow_user=await FollowModel.findOneAndUpdate({followed_by:followed_by,follow_to:follow_to},{is_follow:is_follow},{upsert: true, new: true})

        if(follow_user!=undefined && follow_user!=null && follow_user.length!=0){
            
            successResp(res, "Ok", 200, data);
        }else{
            errorResp(res, "something wrong", 201, data);
        }

        
    }catch(err){
        
        errorResp(res, "something wrong", 201, err);
    }
}


module.exports={
    signin,
    signup,
    dashboard,
    signout,
    addPost,
    follow_unfollow_user,
    check_email_exist
}