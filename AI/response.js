const axios = require("axios");

const SERVER_URL = "http://127.0.0.1:8000";

// Function to fetch results after processing is complete
async function fetchResults(taskId, uid) {
    try {
        // Fetch task status
        const statusRes = await axios.get(`${SERVER_URL}/status/${taskId}`);
        console.log("Task Status:", statusRes.data);

        // If task is complete, fetch the results
        if (statusRes.data.status === "Completed") {
            const resultsRes = await axios.get(`${SERVER_URL}/results/${uid}`);
            console.log("Processed Results:", resultsRes.data);
        } else {
            console.log("Task is still processing. Please try again later.");
        }
    } catch (error) {
        console.error("Error fetching results:", error.response?.data || error.message);
    }
}

// Example taskId and UID to fetch results for
const taskId = "some-task-id";  // Replace with the actual task ID
const uid = "45372";  // Replace with the actual UID

// Fetch results after a delay to ensure processing is complete
setTimeout(() => {
    fetchResults(taskId, uid);
}, 5000);  // Wait 5 seconds before checking results (you may adjust this delay)
