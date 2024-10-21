let prefix = '[BlueMap/MidnightE&E]';

console.log(`${prefix} Initialization started`);

/**
 * Loads a script dynamically and returns a Promise
 * @param {string} src - The source path of the script to load
 * @returns {Promise} A promise that resolves when the script is loaded
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `js/midnight-external-extender/${src}`;
        script.onload = () => {
            console.log(`${prefix} Script loaded: ${src}`);
            resolve();
        };
        script.onerror = (error) => {
            console.error(`${prefix} Error loading script: ${src}`, error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}

/**
 * Initializes the MidnightExternalExtender functionality
 * This function sets up observers, event listeners, and overrides default behaviors
 */
function initializeMidnightExternalExtender() {
    console.log(`${prefix} Initializing MidnightExternalExtender functionality`);
    // Disable zoom buttons
    bluemap.appState.controls.showZoomButtons = false;

    // Initialize observers
    initializeControlsObserver();
    initializeFollowingPlayerObserver();
    initializeMapChangeObserver();

    // Set up message listener
    window.addEventListener('message', handleMessage);

    // Send initial sunlight strength
    sendSunlightStrength();

    // Hide control bar by default
    toggleControlBarVisibility(true);

    // Override updatePageAddress function
    overrideUpdatePageAddress();

    console.log(`${prefix} MidnightExternalExtender functionality initialized`);
}

/**
 * Overrides the default updatePageAddress function
 * This function adds custom behavior to update the URL and send a message
 */
function overrideUpdatePageAddress() {
    const originalUpdatePageAddress = bluemap.updatePageAddress;
    bluemap.updatePageAddress = function(...args) {
        const result = originalUpdatePageAddress.apply(this, args);
        const currentURL = window.location.href;
        sendMessage('urlUpdate', { url: currentURL });
        return result;
    };
    console.log(`${prefix} updatePageAddress function overridden`);
}

// Load all scripts and initialize
const scriptsToLoad = [
    'utils/messaging.js',
    'utils/animation.js',
    'observers/controlsObserver.js',
    'observers/followingPlayerObserver.js',
    'observers/mapChangeObserver.js',
    'handlers/messageHandler.js',
    'handlers/settingsHandler.js',
    'ui/controlBarToggle.js'
];

console.log(`${prefix} Starting to load scripts`);
Promise.all(scriptsToLoad.map(loadScript))
    .then(() => {
        console.log(`${prefix} All scripts loaded successfully`);
        initializeMidnightExternalExtender();
    })
    .catch(error => {
        console.error(`${prefix} Error loading scripts:`, error);
    });