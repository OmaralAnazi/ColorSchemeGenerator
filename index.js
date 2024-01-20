const colorInput = document.getElementById('color');
const modeInput = document.getElementById('mode');
const scheme = document.getElementById('scheme');

colorInput.addEventListener('change', generateColorScheme);
document.addEventListener('keyup', e => {
    if (e.code === 'Space') {
        setRandomColor();
        generateColorScheme();
    }
});
document.addEventListener('click', e => {
    if (e.target.id === 'random-scheme') {
        setRandomColor();
        generateColorScheme();
    }

    if (e.target.classList[0] === 'hex') {
        const hexElementContent = e.target.parentElement.textContent;
        const hexCode = hexElementContent.substring(hexElementContent.indexOf('#'));
        navigator.clipboard.writeText(hexCode);
        showNotificationMessage('Color copied!');
    }
});

function setRandomColor() {
    const getRandomHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')}`;
    colorInput.value = getRandomHex();
}

function generateColorScheme() {
    const color = colorInput.value.slice(1); // delete the # from the hex value
    const mode = modeInput.value;
    
    fetch(`https://www.thecolorapi.com/scheme?hex=${color}&mode=${mode}`)
        .then(response => response.json())
        .then(data => renderNewScheme(data.colors));
}

function renderNewScheme(colors) {
    scheme.innerHTML = colors.map((color, index) => `
        <div class="color-scheme" id="color${index}" style="background: ${color.hex.value}"></div>
        <p id="hex${index}"> ${color.name.value} <br> <span class="hex">${color.hex.value}</span> </p>
    `).join('');
}

function renderColorModes() {
    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
    const modes = getAvailableColorModes();
    
    modeInput.innerHTML = modes.map(mode => 
        `<option value="${mode}">${capitalize(mode)}</option>`
    ).join('');
}

function getAvailableColorModes() {
    return ['monochrome', 'monochrome-dark', 'monochrome-light', 'analogic',
            'complement', 'analogic-complement', 'triad', 'quad'];
}

function showNotificationMessage(message) {
    let notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.top = '15px';
        notification.style.opacity = '1'; // Fade in
    }, 0);
    
    setTimeout(() => {
        notification.style.top = '-100px';
        notification.style.opacity = '0'; // Fade out
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}

renderColorModes();
setRandomColor();
generateColorScheme();
