document.addEventListener("DOMContentLoaded", () => {
    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach((section) => {
        observer.observe(section);
    });

    // Exit Intent Modal
    let modalTriggered = false;
    let isReady = false;
    const modal = document.getElementById('exit-modal');
    const closeBtn = document.getElementById('close-modal-btn');

    // Aguarda 3 segundos para evitar que o modal dispare assim que a pessoa abre a página
    setTimeout(() => {
        isReady = true;
    }, 3000);

    document.addEventListener('mouseout', (e) => {
        if (!isReady || modalTriggered) return;
        
        // Dispara apenas quando o mouse sair do topo da janela (indicando intenção de fechar/voltar)
        if (e.clientY < 20 && e.relatedTarget === null && e.target.nodeName.toLowerCase() !== 'select') {
            modalTriggered = true;
            modal.classList.add('active');
        }
    });

    // Detect if user went to checkout and came back
    window.addEventListener('pageshow', (e) => {
        if (sessionStorage.getItem('checkoutClicked') === 'true') {
            sessionStorage.removeItem('checkoutClicked');
            // If they came back, wait a short moment and show the downsell
            setTimeout(() => {
                if (!modalTriggered) {
                    modalTriggered = true;
                    modal.classList.add('active');
                }
            }, 500);
        }
    });

    // Mark when user goes to checkout
    const checkoutLinks = document.querySelectorAll('a[href*="pay.kiwify.com.br/CFljPAo"]');
    checkoutLinks.forEach(link => {
        link.addEventListener('click', () => {
            sessionStorage.setItem('checkoutClicked', 'true');
        });
    });

    // Mobile Exit Intent 1: Back Button (Android/iOS Swipe)
    // Empurra um estado no histórico para interceptar o botão voltar do celular
    setTimeout(() => {
        history.pushState({ page: 1 }, "title 1", "");
    }, 1000);

    window.addEventListener('popstate', (e) => {
        if (!modalTriggered) {
            modalTriggered = true;
            modal.classList.add('active');
            // Empurra novamente para manter a pessoa na página na primeira tentativa
            history.pushState({ page: 2 }, "title 2", "");
        }
    });

    // Mobile Exit Intent 2: Troca de abas ou minimização do navegador
    document.addEventListener('visibilitychange', () => {
        if (!isReady || modalTriggered) return;
        
        if (document.visibilityState === 'hidden') {
            modalTriggered = true;
            modal.classList.add('active'); // O modal estará lá quando ela voltar para a aba
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
