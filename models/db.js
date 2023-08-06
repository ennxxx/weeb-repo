import mongoose from 'mongoose';
import 'dotenv/config';

const url = 'mongodb+srv://nigelvalero:XloSADr3TnVr5S4C@ccapdev-weeblib.5vjgoqs.mongodb.net/ccapdev-weeblib?retryWrites=true&w=majority'
export async function connectToDB() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}