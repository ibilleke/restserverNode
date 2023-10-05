import mongoose from "mongoose"

const dbConnetion = async() => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectando en: ${url}`);
    } catch (error) {
        console.log(`Error: ${error.menssage}`);
    }
}

export default dbConnetion