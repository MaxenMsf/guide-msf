// Charger le header
fetch('header.html')
.then(response => response.text())
.then(data => {
    document.getElementById('header-container').innerHTML = data;
});



fetch('footer.html')
.then(response => response.text())
.then(data => {
    document.getElementById('footer-container').innerHTML = data;
});

document.addEventListener('DOMContentLoaded', () => {
    const tierlistImage = document.querySelector('.tierlist-image');

    if (!tierlistImage) {
        return;
    }

    tierlistImage.addEventListener('click', async () => {
        try {
            if (document.fullscreenElement === tierlistImage) {
                await document.exitFullscreen();
                return;
            }

            if (document.fullscreenElement) {
                await document.exitFullscreen();
            }

            await tierlistImage.requestFullscreen();
        } catch (error) {
            console.error('Impossible de basculer en plein écran :', error);
        }
    });
});