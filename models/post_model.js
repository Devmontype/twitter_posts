const db = require('../config/db');

const PostSchema = new db.mongoose.Schema({
    content: {
        type: String,
        default: null
    },
    content_file: {
        type: String,
        default: null
    },
    content_file_type: {
        type: String,
        default: null
    },
    user_id:{
        type:db.mongoose.Types.ObjectId,
        default:null
    }
}, { timestamps: true, collection: 'posts' })

module.exports.PostModel = db.mongoose.model('Post', PostSchema);