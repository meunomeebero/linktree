// Blackboard Drawing Mode - Auto-enabled, draws only outside container
(function() {
    let isDrawing = false;
    let canvas = null;
    let ctx = null;
    let lastX = 0;
    let lastY = 0;

    // Check if point is inside the central container
    function isInsideContainer(x, y) {
        const container = document.querySelector('.container');
        if (!container) return false;

        const rect = container.getBoundingClientRect();
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    }

    // Create canvas overlay
    function createCanvas() {
        canvas = document.createElement('canvas');
        canvas.id = 'blackboard-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            pointer-events: none;
        `;
        document.body.appendChild(canvas);

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Setup context
        ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    // Drawing functions
    function startDrawing(e) {
        const touch = e.touches ? e.touches[0] : e;
        const x = touch.clientX;
        const y = touch.clientY;

        // Only start drawing if outside container
        if (isInsideContainer(x, y)) return;

        isDrawing = true;
        lastX = x;
        lastY = y;
    }

    function draw(e) {
        if (!isDrawing) return;

        const touch = e.touches ? e.touches[0] : e;
        const x = touch.clientX;
        const y = touch.clientY;

        // Stop drawing if we enter the container
        if (isInsideContainer(x, y)) {
            isDrawing = false;
            return;
        }

        e.preventDefault();

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        lastX = x;
        lastY = y;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Handle window resize
    function handleResize() {
        if (!canvas) return;

        // Save current drawing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Resize canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Restore drawing
        ctx.putImageData(imageData, 0, 0);

        // Restore style
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    // Initialize on DOM ready
    function init() {
        createCanvas();

        // Add event listeners on document (not canvas)
        document.addEventListener('mousedown', startDrawing);
        document.addEventListener('mousemove', draw);
        document.addEventListener('mouseup', stopDrawing);

        // Touch events
        document.addEventListener('touchstart', startDrawing, { passive: false });
        document.addEventListener('touchmove', draw, { passive: false });
        document.addEventListener('touchend', stopDrawing);

        // Resize handler
        window.addEventListener('resize', handleResize);
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('🎨 Blackboard mode ativo! Desenhe fora do container central.');
})();
