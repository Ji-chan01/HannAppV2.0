import { loadFromLocalStorage } from "../cryptoUtils.js";

const localhost = "http://127.0.0.1:8000";
const url = "https://z954zfbz-5500.asse.devtunnels.ms"


export async function getComments(postId, userId) {
    try {
        const res = await fetch(`${localhost}/api/comment/?postId=${postId}&userId=${userId}`, {
            method: "GET",
        });
        if (!res.ok) throw new Error(`Failed to fetch comments for post ID: ${postId}`);
        const data = await res.json();
        return data.comments;
    } catch (error) {
        console.error("Error fetching comments:", error.message);
        return [];
    }
}

export async function setComment(postId, userId, comment) {
    console.log('hi')
    const request = { postId, userId, inputComment: comment };
    const res = await fetch(`${localhost}/api/comment/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)

    });
}

const send_btn = document.querySelector(".send-message");
if (send_btn) {
    send_btn.addEventListener("click", async () => {
        const inputComment = document.getElementById("setComment");
        const user_data = await loadFromLocalStorage("Hannah143", "user_data");
        if (inputComment.value.trim() !== "") {
            const newPostId = localStorage.getItem("postId");
            setComment(newPostId, user_data.userId, inputComment.value.trim());
            localStorage.removeItem("postId");
            inputComment.value = "";
        } else {
            alert("Please enter a comment before sending.");
        }
    });
}
