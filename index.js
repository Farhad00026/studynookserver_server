const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Client
const client = new MongoClient(process.env.MONGO_URI);

async function connectToMongoDB() {
    try {
        // await client.connect();
        const db = client.db("studynook");
        const destinationCollection = db.collection("studynookcollection");
        //API Here
        app.get("/study" , async(req,res)=>{
            const result = await destinationCollection.find().toArray();
            res.send(result);
        })

        ok
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
    }
}

async function disconnectFromMongoDB() {
    // await client.close();
}

// Connect to MongoDB
connectToMongoDB();

// Home Route
app.get("/", (req, res) => {
    res.send("Hello Server is started!");
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});

// Close MongoDB connection when server stops
process.on("SIGINT", async () => {
    await disconnectFromMongoDB();
    console.log("MongoDB connection closed.");
    process.exit(0);
});