import fetch from 'node-fetch'; // install if needed: npm install node-fetch

const SELF_URL = "https://umar-mern-api.onrender.com"; // apne render URL ka use karo

export const keepAlive = async () => {
setInterval(() => {
  fetch(SELF_URL)
    .then((res) => console.log("Self-ping:", res.status))
    .catch((err) => console.error("Self-ping error:", err));
}, 1000 * 60 * 9);
}
