import mongoose from 'mongoose';
import 'dotenv/config';

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.PORT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}