const axios = require("axios");

const SERVER_URL = "http://127.0.0.1:8000";

const requestData = {
    uid: "45372",
    video_url: "https://drive.google.com/uc?id=1i-aQC78v_XmMIfbrz8ANx1QMMgsoHjXy",
    priority: "low", // low, medium, high
    time_stamp: "12:45:17"
};

async function sendRequest() {
    console.log("Sending request to server...");

    try {
        const response = await axios.post(`${SERVER_URL}/process`, requestData, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("Server Response:", response.data);

        // Fetch task status after a delay
        setTimeout(async () => {
            const statusRes = await axios.get(`${SERVER_URL}/status/${response.data.task_id}`);
            console.log("Task Status:", statusRes.data);
        }, 5000);  // Wait 5 seconds before checking status

    } catch (error) {
        console.error("Error sending request:", error.response?.data || error.message);
    }
}

sendRequest();
