class NotificationState {
    message = $state("");
    isVisible = $state(false);
    type = $state("error");

    show(msg, type = "error") {
        this.message = msg;
        this.type = type;
        this.isVisible = true;
        
        setTimeout(() => {
            this.isVisible = false;
        }, 15000);
    }

    close() {
        this.isVisible = false;
    }
}

export const notification = new NotificationState();