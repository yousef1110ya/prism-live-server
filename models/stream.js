const mongoose = require('mongoose');


const StreamModel = mongoose.Schema(
    {
        streamerName : {type:String , trim:true},
        streamerImage : {type:String},
        streamerId : {
            type : Number,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
              }
        },
        views: {
            type : Number,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
              }
        },
        is_active:{
            type:Boolean,
            default:true,
        },
        streamKey : {
            type:String , required:true 
        },
        streamURL : {
            type:String , required:true
        },
        
    },
    {
        timestamps: true,
    }
);

const Stream = mongoose.model("Stream" , StreamModel);

module.exports = Stream;