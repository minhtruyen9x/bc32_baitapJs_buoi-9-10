function createToast({ title, message, type, duration }) {
    const root = document.getElementById("toast");

    if (root) {
        const icon = {
            success: "<i class='bx bxs-check-circle'></i>",
            warning: "<i class='bx bxs-error'></i>",
            error: "<i class='bx bxs-error-circle'></i>",
            info: "<i class='bx bxs-info-circle'></i>"
        }
        const delay = (duration / 1000).toFixed(2)

        const toast = document.createElement("div");
        toast.classList.add("toast", `toast--${type}`)

        // xu ly remove toast tu dong
        const toastID = setTimeout(() => {
            toast.remove()
        }, duration + 300)
        root.appendChild(toast)

        //xu ly remove toast khi click close
        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                toast.remove()
                clearTimeout(toastID);
            }
        }

        toast.innerHTML = `
            <div class="toast__bar"></div>
            <div class="toast__icon">
                ${icon[type] && icon[type] || ''}
            </div>
            <div class="toast__body">
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
            <div class="toast__close">
                <i class='bx bx-x'></i>
            </div>
        `
        toast.style.animation = `slideIn 0.5s ease, fadeOut 0.3s ease ${delay}s`;

    }
}



function sendSuccessMess(message) {
    createToast({
        title: "Success ! Everything is worked !",
        message: message || "Congrate, Your request has been aplied",
        type: "success",
        duration: 3000
    })
}

function sendErrorMess(message) {
    createToast({
        title: "Uh oh, something went wrong",
        message: message || "Sorry ! There was a problem with your request. !",
        type: "error",
        duration: 3000
    })
}

function sendInfoMess(message) {
    createToast({
        title: "Did you know?",
        message: message || "Here is something that you might like to know.",
        type: "info",
        duration: 3000
    })
}