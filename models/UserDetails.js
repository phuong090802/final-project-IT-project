import mongoose from 'mongoose';

const userDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        ref: {
            type: String
        },
        url: {
            type: String
        }
    },
    description: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, { timestamps: true }
);

const userDetails = mongoose.model('UserDetails', userDetailsSchema);
export default userDetails;
