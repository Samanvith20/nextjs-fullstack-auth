import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        console.log("MongoDB connection URL:", process.env.MONGODB_URL);
        
        await mongoose.connect(process.env.MONGODB_URL!)

        const connection = mongoose.connection;
        connection.on(`connected`, () => {
            console.log('MongoDB connected successfully');
        });
        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit(1); // Exit the process upon connection error
        });
    } catch (error) {
        console.log('Something goes wrong!');
        console.error(error);
    }
};

export default connectDb;
