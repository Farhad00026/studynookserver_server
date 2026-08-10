const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// MongoDB
// ===============================

const client = new MongoClient(process.env.MONGO_URI);

let roomCollection;

async function connectToMongoDB() {
    try {
        // await client.connect();

        console.log("✅ MongoDB connected successfully");

        const db = client.db("studynook");
        const roomCollection = db.collection("studynookcollection");


        //GET  api for LIMIT-6 study rooms
        app.get("/study/limit", async (req, res) => {
            try {
                const rooms = await roomCollection.find().limit(6).toArray();

                res.status(200).send(rooms);
            } catch (error) {
                console.error("Error fetching rooms:", error);

                res.status(500).send({
                    success: false,
                    message: "Failed to fetch study rooms",
                });
            }
        });

        //GET  api for all study 
        app.get("/study", async (req, res) => {
            try {
                const rooms = await roomCollection.find().toArray();

                res.status(200).send(rooms);
            } catch (error) {
                console.error("Error fetching rooms:", error);

                res.status(500).send({
                    success: false,
                    message: "Failed to fetch study rooms",
                });
            }
        });
        //GET API BY ID : Single card rooms view 
        app.get("/study/:id", async (req, res) => {
            try {
                const { id } = req.params;
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid destination id" });
                }
                const query = {_id: new ObjectId(id)};
                const result = await roomCollection.findOne(query);

                if (!result) {
                    return res.status(404).json({ message: "Destination not found" });
                }

                res.status(200).json(result);
            } catch (error) {
                console.error("Error fetching destination:", error);
                res.status(500).json({ message: "Something went wrong" });sss
            }
        });


    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
}

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
    res.send("🚀 StudyNook server is running!");
});

async function startServer() {
    await connectToMongoDB();

    app.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}`);
    });
}

startServer();

// ===============================
// Close MongoDB connection
// ===============================

process.on("SIGINT", async () => {
    try {
        // await client.close();

        console.log("MongoDB connection closed.");

        process.exit(0);
    } catch (error) {
        console.error("Error closing MongoDB:", error);
        process.exit(1);
    }
});
