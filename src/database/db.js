import mongoose from 'mongoose';

const connectDatabase = () => {
    console.log("MongoDB Atlas Conectando...");

    mongoose.connect(process.env.MONGODB_URI).then(() => console.log("MongoDB Atlas Conectado")).catch((error) => console.log(error));
};

export default connectDatabase;