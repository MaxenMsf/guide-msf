// Déterminer le chemin de base selon le dossier courant
// Fonctionne avec les slashes (web) et backslashes (Windows local)
const pathname = window.location.pathname.replace(/\\/g, '/');
const basePath = (pathname.includes('/ères/') || pathname.includes('%C3%A8res/')) ? '../' : '';

// Charger le header
fetch(basePath + 'header.html')
.then(response => {
    if (!response.ok) throw new Error('Header not found');
    return response.text();
})
.then(data => {
    document.getElementById('header-container').innerHTML = data;
    // Corriger les chemins des liens dans le header s'il y a un basePath
    if (basePath) {
        // Corriger les liens CSS
        document.querySelectorAll('#header-container link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('../')) {
                link.setAttribute('href', basePath + href);
            }
        });
        // Corriger les liens de navigation
        document.querySelectorAll('#header-container a[href]').forEach(link => {
            const href = link.getAttribute('href');
            // Si le lien ne commence pas par http et n'est pas déjà corrigé
            if (href && !href.startsWith('http') && !href.startsWith('../')) {
                link.setAttribute('href', basePath + href);
            }
        });
        // Corriger les images
        document.querySelectorAll('#header-container img[src]').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('../')) {
                img.setAttribute('src', basePath + src);
            }
        });
    }
})
.catch(error => console.error('Erreur chargement header:', error));



fetch(basePath + 'footer.html')
.then(response => {
    if (!response.ok) throw new Error('Footer not found');
    return response.text();
})
.then(data => {
    document.getElementById('footer-container').innerHTML = data;
    // Corriger les chemins des liens dans le footer s'il y a un basePath
    if (basePath) {
        document.querySelectorAll('#footer-container a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('../')) {
                link.setAttribute('href', basePath + href);
            }
        });
        document.querySelectorAll('#footer-container img[src]').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('../')) {
                img.setAttribute('src', basePath + src);
            }
        });
    }
})
.catch(error => console.error('Erreur chargement footer:', error));

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