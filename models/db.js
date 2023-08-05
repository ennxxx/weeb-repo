import mongoose from 'mongoose';
import 'dotenv/config';

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI + process.env.DB_NAME, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}