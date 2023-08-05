import mongoose from 'mongoose';
import 'dotenv/config';

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}