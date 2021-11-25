const db = require('../config/db');

const FollowSchema = new db.mongoose.Schema({
    followed_by: {
        type:db.mongoose.Types.ObjectId,
        default:null
    },
    follow_to:{
        type:db.mongoose.Types.ObjectId,
        default:null
    },
    is_follow:{
        type:Number,
        default:0
    },
}, { timestamps: true, collection: 'follows' })

module.exports.FollowModel = db.mongoose.model('Follow', FollowSchema);