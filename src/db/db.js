import mongoose from "mongoose"

const dbconnection=async()=>{
    try {
        const db=await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`)
        console.log(db.connection.host)
        console.log("db connected")

    } catch (error) {
        throw new Error("DB not connected",error)
    }
}
export default dbconnection
