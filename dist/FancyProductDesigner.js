import tinycolor from 'tinycolor2';
import { fabric as fabric$1 } from 'fabric';
import WebFont from 'webfontloader';
import Picker from 'vanilla-picker/csp';
import QRious from 'qrious';
import download from 'downloadjs';

const Modal = (htmlContent='', fullscreen=false, type='', container=document.body) => {
    
    if(container === document.body) {
        container.classList.add('fpd-overflow-hidden');
    }
    
    if(type === 'prompt') {
        htmlContent = `
            <input type="text" placeholder="${htmlContent}" />
            <span class="fpd-btn"></span>
        `;
    }
    else if(type === 'confirm') {
        htmlContent = `
            <div class="fpd-confirm-msg">${htmlContent}</div>
            <span class="fpd-btn fpd-confirm"></span>
        `;
    }
    
    let html = `
        <div class="fpd-modal-inner fpd-shadow-3">
            <div class="fpd-modal-close">
                <span class="fpd-icon-close"></span>
            </div>
            <div class="fpd-modal-content">${htmlContent}</div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = `fpd-modal-internal fpd-modal-overlay fpd-container ${fullscreen ? 'fpd-fullscreen' : ''}`;
    modal.innerHTML = html;
    modal.dataset.type = type;
    
    container.append(modal);
    
    addEvents(
        modal.querySelector('.fpd-modal-close'),
        ['click'],
        (evt) => {
            container.classList.remove('fpd-overflow-hidden');
            modal.remove();
        }
    ); 
    
    return modal;   
};

const Snackbar = (text='', autoRemove=true) => {
    
    let snackbarWrapper = document.body.querySelector('.fpd-snackbar-wrapper');
    
    if(!snackbarWrapper) {
        
        snackbarWrapper = document.createElement('div');
        snackbarWrapper.className = 'fpd-snackbar-wrapper';
        
        document.body.append(snackbarWrapper);
        
    }
    
    let content = document.createElement('div');
    content.className = 'fpd-snackbar fpd-shadow-1';
    content.innerHTML = '<p>'+text+'</p>';
    content.addEventListener('click', (evt) => {
        content.remove();
        content = null;
    });
    
    snackbarWrapper.append(content);
    
    if(autoRemove) {

        setTimeout(() => {   

            if(content)  {
                content.remove();
                content = null;
            }        
                
        }, 5000);

    }
    
    return content;  
};

window.FPDSnackbar = Snackbar;

const isPlainObject = (value) => {
    return Object.prototype.toString.call(value) === '[object Object]';
};

const objectHasKeys = (obj, keys) => {

    if (obj && typeof obj === 'object') {

        let hasAllKeys = true;
        for (var i = 0; i < keys.length; ++i) {

            var key = keys[i];
            if (!obj.hasOwnProperty(key)) {
                hasAllKeys = false;
                break;
            }

        }

        return hasAllKeys;

    }
    else {
        return false;
    }

};

const deepMerge = (obj1, obj2) => {

    // Create a new object that combines the properties of both input objects
    const merged = {
        ...obj1,
        ...obj2
    };
    
    if (Object.keys(obj2).length) {

        // Loop through the properties of the merged object
        for (const key of Object.keys(merged)) {

            // Check if the property is an object            
            if (isPlainObject(merged[key])) {

                if (obj1[key] && obj2[key]) {
                    merged[key] = deepMerge(obj1[key], obj2[key]);
                }

            }
        }

    }

    return merged;
};


const objectGet = (obj, path, defValue) => {

    // If path is not defined or it has false value
    if (!path) return undefined
    // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
    // Find value
    const result = pathArray.reduce(
        (prevObj, key) => prevObj && prevObj[key],
        obj
    );
    // If found value is undefined return default value; otherwise return the value
    return result === undefined ? defValue : result;
};

const isUrl = (s) => {

    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);

};
    

const removeUrlParams = (url) => {
    return url.replace(/\?.*$/, '');
};

/**
 * Makes an unique array.
 *
 * @method arrayUnique
 * @param {Array} array The target array.
 * @return {Array} Returns the edited array.
 * @static
 */
const arrayUnique = (array) => {

    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

const isZero = (value) => {

    return value === 0 || (typeof value === 'string' && value === "0");

};

const addEvents = (elements, events = [], listener = () => { }, useCapture = false) => {

    events = typeof events == 'string' ? [events] : events;
    const controller = new AbortController();
    const { signal } = controller;

    events.forEach(eventType => {

        if (elements instanceof HTMLElement || elements instanceof window.constructor) {

            elements.addEventListener(eventType, listener, { capture: useCapture, signal: signal });
            elements.abortController = controller;

        }
        else if (Array.from(elements).length) {

            if (elements && elements.forEach) {
                
                elements.forEach(elem => {
                    elem.addEventListener(eventType, listener, { capture: useCapture, signal: signal });
                    elem.abortController = controller;
                });
                

            }

        }
        else {
            elements.addEventListener(eventType, listener, { capture: useCapture, signal: signal });
            elements.abortController = controller;
        }

    });

};

const fireEvent = (target, eventName, eventDetail={}) => {
    
    if(window) {

        target.dispatchEvent(
            new CustomEvent(eventName, {
                detail: eventDetail
            })
        );

    }   

    if(window.jQuery && target.container) {

        jQuery(target.container).trigger(eventName, Object.values(eventDetail));

    }

};

const addElemClasses = (elements = [], classes = []) => {

    if (elements) {

        if (elements instanceof HTMLElement) {

            classes.forEach(c => {
                elements.classList.add(c);
            });

        }
        else {

            elements.forEach(elem => {
                classes.forEach(c => {
                    elem.classList.add(c);
                });
            });

        }

    }

    return elements;

};

const removeElemClasses = (elements = [], classes = []) => {

    if (elements) {

        if (elements instanceof HTMLElement) {

            classes.forEach(c => {
                elements.classList.remove(c);
            });

        }
        else {

            elements.forEach(elem => {
                classes.forEach(c => {
                    elem.classList.remove(c);
                });

            });

        }


    }

    return elements;

};

const toggleElemClasses = (elements = [], classes = [], toggle = true) => {

    if (elements) {

        if (elements instanceof HTMLElement) {

            classes.forEach(c => {
                elements.classList.toggle(c, toggle);
            });

        }
        else {

            elements.forEach(elem => {
                classes.forEach(c => {
                    elem.classList.toggle(c, toggle);
                });
            });

        }

    }

    return elements;

};

const loadGridImage = (pictureElem, source = null) => {

    if (pictureElem) {

        pictureElem.classList.add('fpd-on-loading');

        var image = new Image();
        image.src = source ? source : pictureElem.dataset.img;

        image.onload = function () {
            pictureElem.dataset.originwidth = this.width;
            pictureElem.dataset.originheight = this.height;
            pictureElem.classList.remove('fpd-on-loading');
            pictureElem.style.backgroundImage = 'url("' + this.src + '")';
        };

        image.onerror = function () {
            pictureElem.parentNode.remove();

        };

    }

};

const isEmpty = (value) => {

    if (value === undefined)
        return true;

    if (value == null)
        return true;

    if (typeof value === 'string')
        return !value.trim().length;

    if (Array.isArray(value))
        return !value.length;

    if (typeof value === 'object')
        return !Object.keys(value).length;

    return false;

};

/**
 * Checks if the browser local storage is available.
 *
 * @method localStorageAvailable
 * @return {Boolean} Returns true if local storage is available.
 * @static
 * @ignore
 */
const localStorageAvailable = () => {

    var localStorageAvailable = true;
    //execute this because of a ff issue with localstorage
    try {
        window.localStorage.length;
        window.localStorage.setItem('fpd-storage', 'just-testing');
        //window.localStorage.clear();
    }
    catch (error) {
        localStorageAvailable = false;
        //In Safari, the most common cause of this is using "Private Browsing Mode". You are not able to save products in your browser.
    }

    return localStorageAvailable;

};

const createImgThumbnail = (opts = {}) => {

    if (!opts.url) return;

    const thumbnail = document.createElement('div');
    thumbnail.className = 'fpd-item fpd-hover-thumbnail';
    thumbnail.dataset.source = opts.url;

    if (!opts.disableDraggable) {
        thumbnail.classList.add('fpd-draggable');
    }

    if (opts.title) {
        thumbnail.dataset.title = opts.title;
        thumbnail.setAttribute('aria-label', opts.title);
    }

    const picElem = document.createElement('picture');
    picElem.dataset.img = opts.thumbnailUrl ? opts.thumbnailUrl : opts.url;
    thumbnail.append(picElem);

    const img = new Image();
    img.onerror = () => {
        thumbnail.remove();
    };
    img.src = picElem.dataset.img;
    
    if (!opts.disablePrice) {
        
        const priceElem = document.createElement('span');
        priceElem.className = "fpd-price";
        priceElem.innerHTML = opts.price;
        thumbnail.append(priceElem);

        toggleElemClasses(priceElem, ['fpd-hidden'], !Boolean(opts.price));

    }

    if (opts.removable) {
        const removeElem = document.createElement('span');
        removeElem.className = 'fpd-delete fpd-icon-remove';
        thumbnail.append(removeElem);
    }

    return thumbnail;

};

const getItemPrice = (fpdInstance, container, price = null) => {
    
    if (!fpdInstance.currentViewInstance) return '';

    let currentViewOptions = fpdInstance.currentViewInstance.options;

    //get price from upload zone if module is inside upload-zone-content    
    if (document.querySelector('.fpd-upload-zone-content').contains(container)
        && fpdInstance.currentViewInstance.currentUploadZone
    ) {

        const uploadZone = fpdInstance.currentViewInstance.fabricCanvas.getUploadZone(
            fpdInstance.currentViewInstance.currentUploadZone
        );

        if (uploadZone && uploadZone.price) {
            price = uploadZone.price;

        }

    }

    //only apply general price if null    
    if (price == null) {
        price = objectGet(currentViewOptions, 'customImageParameters.price', 0);
    }

    const priceStr = price ? formatPrice(price, fpdInstance.mainOptions.priceFormat) : '';

    return priceStr;

};

/**
 * Checks if the dimensions of an image is within the allowed range set in the customImageParameters of the view options.
 *
 * @method checkImageDimensions
 * @param {FancyProductDesigner} fpdInstance Instance of FancyProductDesigner.
 * @param {Number} imageW The image width.
 * @param {Number} imageH The image height.
 * @return {Array} Returns true if image dimension is within allowed range(minW, minH, maxW, maxH).
 * @static
 * @ignore
 */
const checkImageDimensions = (fpdInstance, imageW, imageH) => {

    const viewInst = fpdInstance.currentViewInstance;
    let imageRestrictions = viewInst.options.customImageParameters;

    const uploadZone = viewInst.fabricCanvas.getUploadZone(viewInst.currentUploadZone);
    if (uploadZone) {
        imageRestrictions = deepMerge(imageRestrictions, uploadZone);
    }

    if (imageW > imageRestrictions.maxW ||
        imageW < imageRestrictions.minW ||
        imageH > imageRestrictions.maxH ||
        imageH < imageRestrictions.minH) {

        fpdInstance.loadingCustomImage = false;

        if (fpdInstance.mainBar) {

            fpdInstance.mainBar.toggleContentDisplay(false);

            if (viewInst.currentUploadZone) {
                fpdInstance.mainBar.toggleUploadZonePanel(false);
            }

        }

        let sizeAlert = fpdInstance.translator.getTranslation(
            'misc',
            'uploaded_image_size_alert'
        );

        sizeAlert = sizeAlert
            .replace('%minW', imageRestrictions.minW)
            .replace('%minH', imageRestrictions.minH)
            .replace('%maxW', imageRestrictions.maxW)
            .replace('%maxH', imageRestrictions.maxH);

        Modal(sizeAlert);

        return false;

    }
    else {
        return true;
    }

};

const getFileExtension = (str) => {
    //ext > lowercase > remove query params
    return str.split('.').pop().toLowerCase().split('?')[0];
};

const getFilename = (str) => {
    return str.split('/').pop();};

const isBitmap = (url) => {

    return ['jpeg', 'jpg', 'png'].includes(getFileExtension(url));
};

/**
 * Returns the available colors of an element.
 *
 * @method elementAvailableColors
 * @param {fabric.Object} element The target element.
 * @param {FancyProductDesigner} fpdInstance Instance of FancyProductDesigner.
 * @return {Array} Available colors.
 * @static
 * @ignore
 */
const elementAvailableColors = (element, fpdInstance) => {

    var availableColors = [];
    if (element.type == 'group') {

        const paths = element.getObjects();
        if (paths.length === 1) {
            availableColors = element.colors === true || element.colors === 1 ? ['#000'] : element.colors;
        }
        else {
            availableColors = [];
            paths.forEach((path) => {

                const color = tinycolor(path.fill);
                availableColors.push(color.toHexString());

            });

        }

    }
    else if (element.__editorMode) {
        return ['#000'];
    }
    else if (element.colorLinkGroup && fpdInstance.colorLinkGroups[element.colorLinkGroup]) {
        availableColors = fpdInstance.colorLinkGroups[element.colorLinkGroup].colors;

    }
    else {
        availableColors = element.colors === true || element.colors === 1 ? ['#000'] : element.colors;
    }

    return availableColors;

};

const getBgCssFromElement = (element) => {

    let currentFill = element.fill;

    //fill: hex
    if (typeof currentFill === 'string') {
        return currentFill;
    }
    //fill: pattern or svg fill
    else if (typeof currentFill === 'object') {

        if (currentFill.source) { //pattern
            currentFill = currentFill.source.src;
            return 'url(' + currentFill + ')';
        }
        else { //svg has fill
            return currentFill[0];
        }

    }
    //element: svg
    else if (element.colors === true && element.type === 'group') {
        return tinycolor(element.getObjects()[0].fill);
    }
    //no fill, only colors set
    else if (currentFill === false && element.colors && element.colors[0]) {
        return element.colors[0];
    }

};

const popupBlockerAlert = (popup, msg) => {

    if (popup == null || typeof (popup) == 'undefined') {
        Snackbar(msg);
    }

};

const getScript = (src) => {

    return new Promise(function (resolve, reject) {

        if (document.querySelector("script[src='" + src + "']") === null) {

            var script = document.createElement('script');
            script.onload = () => {
                resolve();
            };
            script.onerror = () => {
                reject();
            };

            script.src = src;
            document.body.appendChild(script);

        } else {
            resolve();
        }

    });

};

const unitToPixel = (length, unit='inch', dpi = 72) => {

    const ppi = length * dpi;

    if (unit == 'cm') {
        return Math.round(ppi / 2.54);
    }
    else if (unit == 'mm') {
        return Math.round(ppi / 25.4);
    }
    else {
        return Math.round(ppi);
    }

};

const pixelToUnit = (pixel, unit='inch', dpi = 72) => {

    const inches = pixel / dpi;

    if (unit == 'cm') {
        return Math.round(inches * 2.54);
    }
    else if (unit == 'mm') {
        return Math.round(inches * 25.4);
    }
    else {
        return Math.round(inches);
    }

};

const formatPrice = (price, priceFormatOpts = {}) => {
    
    if (!isNaN(price) && typeof priceFormatOpts === 'object') {

        const thousandSep = priceFormatOpts.thousandSep || ',';
        const decimalSep = priceFormatOpts.decimalSep || '.';

        let splitPrice = price.toString().split('.'),
            absPrice = splitPrice[0],
            decimalPrice = splitPrice[1],
            tempAbsPrice = '';

        if (typeof absPrice != 'undefined') {

            for (var i = absPrice.length - 1; i >= 0; i--) {
                tempAbsPrice += absPrice.charAt(i);
            }

            tempAbsPrice = tempAbsPrice.replace(/(\d{3})/g, "$1" + thousandSep);
            if (tempAbsPrice.slice(-thousandSep.length) == thousandSep) {
                tempAbsPrice = tempAbsPrice.slice(0, -thousandSep.length);
            }

            absPrice = '';
            for (var i = tempAbsPrice.length - 1; i >= 0; i--) {
                absPrice += tempAbsPrice.charAt(i);
            }

            if (typeof decimalPrice != 'undefined' && decimalPrice.length > 0) {
                //if only one decimal digit add zero at end
                if (decimalPrice.length == 1) {
                    decimalPrice += '0';
                }
                absPrice += decimalSep + decimalPrice;
            }

        }

        const currency = priceFormatOpts.currency || '&#36;%d';

        absPrice = currency.replace('%d', absPrice.toString());

        return absPrice;

    }

    return price;

};

const showModal = ((...args) => {   
    Modal(...args);
});

const showMessage = ((...args) => {   
    Snackbar(...args);
});

if (typeof window !== 'undefined') {
    
    /**
     * A class with some static helper functions. You do not need to initiate the class, just call the methods directly, e.g. FPDUtil.showModal();
     *
     * @class FPDUtils
     */
    window.FPDUtils = {};

    /**
	 * Displays a modal dialog.
	 *
	 * @method showModal
	 * @param {String} htmlContent The html content for the modal.
     * @param {Boolean} [fullscreen=false] Displays the modal in full screen.
     * @param {String} [type=''] Empty, 'prompt' or 'confirm'.
     * @param {HTMLElement} [container=document.body] The container for the modal.
	 * @static
	 */
    window.FPDUtils.showModal = showModal;

    /**
	 * Displays a message in a snackbar (bottom-left).
	 *
	 * @method showMessage
	 * @param {String} text The text for the message.
     * @param {Boolean} [autoRemove=true] Either to remove the message automatcially or not.
	 * @static
	 */
    window.FPDUtils.showMessage = showMessage;
        
    /**
     * Checks if a string is an URL.
     *
     * @method isUrl
     * @param {String} s The string.
     * @return {Boolean} Returns true if string is an URL.
     * @static
     */
    window.FPDUtils.isUrl = isUrl;

    /**
     * Converts a pixel value to any metric value considering the DPI.
     *
     * @method pixelToUnit
     * @param {Number} pixel The pixel value.
     * @param {String} [unit='inch'] Target metric - 'inch', 'mm', 'cm'.
     * @param {Number} [dpi=72] Target DPI.
     * @return {Boolean} Returns the pixel value.
     * @static
     */
    window.FPDUtils.pixelToUnit = pixelToUnit;

    /**
     * Converts a metric value to pixel considering the DPI.
     *
     * @method unitToPixel
     * @param {Number} pixel The pixel value.
     * @param {String} [unit='inch'] Target metric - 'inch', 'mm', 'cm'.
     * @param {Number} [dpi=72] Target DPI.
     * @return {Boolean} Returns the metric value.
     * @static
     */
    window.FPDUtils.unitToPixel = unitToPixel;

}

/**
 *
 * @class Options
 */
class Options {
	/**
	 * The default options.
	 *
	 * @property defaults
	 * @static
	 * @memberof Options
	 * @type {Object}
	 */
	static defaults = {
		imageLoadTimestamp: false,
		/**
		 * The stage(canvas) width for the product designer.
		 *
		 * @property stageWidth
		 * @memberof Options.defaults
		 * @type {Number}
		 * @default 900
		 */
		stageWidth: 900,
		/**
		 * The stage(canvas) height for the product designer.
		 *
		 * @property stageHeight
		 * @memberof Options.defaults
		 * @type {Number}
		 * @default 600
		 */
		stageHeight: 600,
		/**
		 * Enables the editor mode, which will add a helper box underneath the product designer with some options of the current selected element.
		 *
		 * @property editorMode
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 */
		editorMode: false,
		/**
		 * The properties that will be displayed in the editor box when an element is selected.
		 *
		 * @property editorBoxParameters
		 * @memberof Options.defaults
		 * @type {Array}
		 * @default ['left', 'top', 'angle', 'fill', 'width', 'height', 'fontSize', 'price']
		 */
		editorBoxParameters: ["left", "top", "angle", "fill", "width", "height", "fontSize", "price"],
		/**
		 * An array containing all available fonts.
		 *
		 * @property fonts
		 * @memberof Options.defaults
		 * @type {Aarray}
		 * @default [{name: 'Arial'}, {name: 'Lobster', url: 'google'}]
		 * @example [{name: "Lobster", url: "google"}, {name: 'Custom', url: 'https://yourdomain.com/fonts/custom.ttf"}, {name: 'Aller', url: 'path/Aller.ttf', variants: {'n7': 'path/Aller__bold.ttf','i4': 'path/Aller__italic.ttf','i7': 'path/Aller__bolditalic.ttf'}}]
		 */
		fonts: [{ name: "Arial" }, { name: "Lobster", url: "google" }],
		/**
		 * To add photos from Facebook, you have to set your own Facebook API key.
		 *
		 * @property facebookAppId
		 * @memberof Options.defaults
		 * @type {String}
		 * @default ''
		 */
		facebookAppId: "",
		/**
		 * To add photos from Instagram, you have to set an Instagram client ID.
		 *
		 * @property instagramClientId
		 * @memberof Options.defaults
		 * @type {String}
		 * @default ''
		 */
		instagramClientId: "", //the instagram client ID
		/**
		 * This URI to the html/instagram_auth.html. You have to update this option if you are using a different folder structure.
		 *
		 * @property instagramRedirectUri
		 * @memberof Options.defaults
		 * @type {String}
		 * @default ''
		 */
		instagramRedirectUri: "",
		/**
		 * The URI to the script that get the access token from Instagram. You need the enter the Instagram Secret ID.
		 *
		 * @property instagramTokenUri
		 * @memberof Options.defaults
		 * @type {String}
		 * @default ''
		 */
		instagramTokenUri: "",
		/**
		 * Set custom names for your hexdecimal colors. key=hexcode without #, value: name of the color.
		 *
		 * @property hexNames
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {}
		 * @example hexNames: {000000: 'dark',ffffff: 'white'}
		 */
		hexNames: {},
		/**
		 * The border color of the selected element.
		 *
		 * @property selectedColor
		 * @memberof Options.defaults
		 * @type {String}
		 * @default '#d5d5d5'
		 */
		selectedColor: "#f5f5f5",
		/**
		 * The border color of the bounding box.
		 *
		 * @property boundingBoxColor
		 * @memberof Options.defaults
		 * @type {String}
		 * @default '#005ede'
		 */
		boundingBoxColor: "#2185d0",
		/**
		 * The border color of the element when its outside of his bounding box.
		 *
		 * @property outOfBoundaryColor
		 * @memberof Options.defaults
		 * @type {String}
		 * @default '#990000'
		 */
		outOfBoundaryColor: "#990000",
		/**
		 * If true only the initial elements will be replaced when changing the product. Custom added elements will not be removed.
		 *
		 * @property replaceInitialElements
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 */
		replaceInitialElements: false,
		/**
		 * An object that contains the settings for the AJAX post when a custom added image is added to the canvas (Uploaded Images, Facebook/Instagram Photos). This allows to send the URL of the image to a custom-built script, that returns the data URI of the image or uploads the image to your server and returns the new URL on your server. By default the URL is send to php/custom-image-handler.php. See the official jQuery.ajax documentation for more information. The data object has a reserved property called url, which is the image URL that will send to the script. The success function is also reserved.
		 *
		 * @property fileServerURL
		 * @memberof Options.defaults
		 * @type {String}
		 */
		fileServerURL: null,
		/**
		 * Make the canvas and the elements in the canvas responsive.
		 *
		 * @property responsive
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default true
		 */
		responsive: true,
		/**
		 * Hex color value defining the color for the corner icon controls.
		 *
		 * @property cornerIconColor
		 * @memberof Options.defaults
		 * @type {String}
		 * @default '#000000'
		 */
		cornerIconColor: "#000000", //hex
		/**
		 * The URL to the JSON file or an object containing all content from the JSON file. Set to false, if you do not need it.
		 *
		 * @property langJSON
		 * @memberof Options.defaults
		 * @type {Object | Boolean}
		 * @default 'lang/default.json'
		 */
		langJSON: {},
		/**
		 * The color palette when the color wheel is displayed.
		 *
		 * @property colorPickerPalette
		 * @memberof Options.defaults
		 * @type {Array}
		 * @default []
		 * @example ['#000', '#fff']
		 */
		colorPickerPalette: [], //when colorpicker is enabled, you can define a default palette
		/**
		 * An object defining the available actions in the different zones.
		 *
		 * @property actions
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {left: ['info', 'download', 'print', 'preview-lightbox', 'reset-product'], center: ['undo', 'redo'], right: ['zoom', 'ruler', 'guided-tour']}
		 */
		actions: {
			left: ["info", "download", "print", "preview-lightbox", "reset-product"],
			center: ["undo", "redo"],
			right: ["zoom", "ruler", "guided-tour"],
		},
		/**
		 * An array defining the available modules in the main bar. Possible values: 'products', 'images', 'text', 'designs'. 'names-numbers', 'drawing'
		 *
		 * @property mainBarModules
		 * @memberof Options.defaults
		 * @type {Array}
		 * @default ['products', 'images', 'text', 'designs']
		 */
		mainBarModules: ["products", "images", "text", "designs", "manage-layers"],
		/**
		 * Set the initial active module.
		 *
		 * @property initialActiveModule
		 * @memberof Options.defaults
		 * @type {String}
		 * @default ''
		 */
		initialActiveModule: "",
		/**
		 * An object defining the maximum values for input elements in the toolbar.
		 *
		 * @property maxValues
		 * @memberof Options.defaults
		 * @type {String}
		 * @default {}
		 */
		maxValues: {},
		/**
		 * Set a watermark image when the user downloads/prints the product via the actions. To pass a watermark, just enter a string with an image URL.
		 *
		 * @property watermark
		 * @memberof Options.defaults
		 * @type {Boolean | String}
		 * @default false
		 */
		watermark: false,
		/**
		 * An object containing the currency string(use %d as placeholder for price), decimal separator and thousand separator.
		 *
		 * @property priceFormat
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {currency: '&#36;%d', decimalSep: '.', thousandSep: ','}
		 */
		priceFormat: { currency: "&#36;%d", decimalSep: ".", thousandSep: "," },
		/**
		 * The ID of an element that will be used as container for the main bar.
		 *
		 * @property mainBarContainer
		 * @memberof Options.defaults
		 * @type {Boolean | String}
		 * @default false
		 * @example #customMainBarContainer
		 */
		mainBarContainer: false,
		/**
		 * The ID of an element that will be used to open the modal, in which the designer is included.
		 *
		 * @property modalMode
		 * @memberof Options.defaults
		 * @type {Boolean | String}
		 * @default false
		 * @example #modalButton
		 */
		modalMode: false,
		/**
		 * Enable keyboard control. Use arrow keys to move and backspace key to delete selected element.
		 *
		 * @property keyboardControl
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default true
		 */
		keyboardControl: true,
		/**
		 * Deselect active element when clicking outside of the product designer.
		 *
		 * @property deselectActiveOnOutside
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default true
		 */
		deselectActiveOnOutside: true,
		/**
		 * All upload zones will be always on top of all elements.
		 *
		 * @property uploadZonesTopped
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default true
		 */
		uploadZonesTopped: true,
		/**
		 * Loads the first initial product into stage.
		 *
		 * @property loadFirstProductInStage
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default true
		 */
		loadFirstProductInStage: true,
		/**
		 * If the user leaves the page without saving the product or the getProduct() method is not, a alert window will pop up.
		 *
		 * @property unsavedProductAlert
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 */
		unsavedProductAlert: false,
		/**
		 * If the user adds something and off-canvas panel or dialog is opened, it will be closed.
		 *
		 * @property hideDialogOnAdd
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default true
		 */
		hideDialogOnAdd: true,
		/**
		 * Set the placement of the toolbar. For smartphones the toolbar will be fixed at the bottom of the page. Possible values:'smart', 'sidebar'
		 *
		 * @property toolbarPlacement
		 * @memberof Options.defaults
		 * @type {String}
		 * @default 'smart'
		 */
		toolbarPlacement: "smart",
		/**
		 * The grid size for snap action. First value defines the width on the a-axis, the second on the y-axis.
		 *
		 * @property snapGridSize
		 * @memberof Options.defaults
		 * @type {Array}
		 * @default [50, 50]
		 * @ignore
		 */
		snapGridSize: [50, 50],
		/**
		 * An object containing options for the fabricjs canvas.
		 *
		 * @property fabricCanvasOptions
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {}
		 */
		fabricCanvasOptions: {},
		/**
		 * Defines the values for the select element in the names & numbers module.
		 *
		 * @property namesNumbersDropdown
		 * @memberof Options.defaults
		 * @type {Array}
		 * @default []
		 */
		namesNumbersDropdown: [],
		/**
		 * Sets price for any extra entry in the names & numbers module.
		 *
		 * @property namesNumbersEntryPrice
		 * @memberof Options.defaults
		 * @type {Number}
		 * @default 0
		 */
		namesNumbersEntryPrice: 0,
		/**
		 * Sets the placement for the color selection. Create a HTML element inside your document and use the selector for that element as value, e.g. #my-color-selection.
		 *
		 * @property colorSelectionPlacement
		 * @memberof Options.defaults
		 * @type {String}
		 * @default ''
		 * @example #my-color-selection
		 */
		colorSelectionPlacement: "",
		/**
		 * Sets the placement for the Bulk-Add Variations Form. Just enter ID or class of another element(#my-color-selection).
		 *
		 * @property bulkVariationsPlacement
		 * @memberof Options.defaults
		 * @type {String}
		 * @default ''
		 */
		bulkVariationsPlacement: "",
		/**
		 * The available variations for the Bulk-Add Variations Form.
		 *
		 * @property bulkVariations
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {}
		 * @example {'Size': ['XL', 'L', 'M', 'S'], 'Color': ['Red', 'Blue']}
		 */
		bulkVariations: {},
		/**
		 * The element where the toolbar will be appended when toolbarPlacement='smart'.
		 *
		 * @property toolbarDynamicContext
		 * @memberof Options.defaults
		 * @type {String}
		 * @default 'body'
		 */
		toolbarDynamicContext: "body",
		/**
		 * Addtional properties for the bounding box. Can be used to set the stroke width etc.. See http://fabricjs.com/docs/fabric.Rect.html
		 *
		 * @property boundingBoxProps
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {strokeWidth: 1}
		 */
		boundingBoxProps: { strokeWidth: 1 },
		/**
		 * If the image (custom uploaded or design) is larger than the canvas, it will be scaled down to fit into the canvas.
		 *
		 * @property fitImagesInCanvas
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 */
		fitImagesInCanvas: false,
		/**
		 * Set a maximum price for all products or for specific views. -1 disables the max. price.
		 *
		 * @property maxPrice
		 * @memberof Options.defaults
		 * @type {Number}
		 * @default -1
		 */
		maxPrice: -1,
		/**
		 * The text can be edited in the canvas by double click/tap.
		 *
		 * @property inCanvasTextEditing
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default true
		 */
		inCanvasTextEditing: true,
		/**
		 * The text input in the toolbar when be opened when an editable text is selected.
		 *
		 * @property openTextInputOnSelect
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 */
		openTextInputOnSelect: false,
		/**
		 * An array of design category titles (only top-level categories) to enable particular design categories for an upload zone or for the view. An empty array will enable all design categories.
		 *
		 * @property designCategories
		 * @type {Array}
		 * @memberof Options.defaults
		 * @default []
		 */
		designCategories: [],
		/**
		 * Will make the view(s) optional, so the user have to unlock it. The price for the elements in the view will be added to the total product price as soon as the view is unlocked.
		 *
		 * @property optionalView
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 */
		optionalView: false,
		/**
		 * When using the save/load actions, store the product in user's browser storage.
		 *
		 * @property saveActionBrowserStorage
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default true
		 */
		saveActionBrowserStorage: true,
		/**
		 * An array containing the pricing rules groups. Use the online tool to generate pricing rules.
		 *
		 * @property pricingRules
		 * @memberof Options.defaults
		 * @type {Array}
		 * @default []
		 */
		pricingRules: [],
		/**
		 * Enables an agreement modal that needs to be confirmed before uploaded images can be used in the product designer. The text in the agreement modal can be set through the language JSON.
		 *
		 * @property uploadAgreementModal
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 */
		uploadAgreementModal: false,
		/**
		 * An object containing the settings for the image editor.
		 *
		 * @property imageEditorSettings
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {masks: []}
		 */
		imageEditorSettings: {
			/**
			 * An array containing the SVG urls for custom mask shapes. Use only one path per SVG, only the first path will be used as mask shape.
			 *
			 * @property masks
			 * @type {Array}
			 * @memberof Options.defaults.imageEditorSettings
			 * @default []
			 */
			masks: [],
		},
		/**
		 * An object containing left, top, width and height properties that represents a printing box. A printing box is a rectangle which is always visible in the canvas and represents the printing area. It is used in the ADMIN solution to create a PDF with a specific printing area.
		 *
		 * @propert printingBox
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default null
		 */
		printingBox: null,
		/**
		 * Open the Info modal when product designer is loaded. The Info action needs to be added to show the modal.
		 *
		 * @property autoOpenInfo
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 */
		autoOpenInfo: false,
		/**
		* Create a custom guided tour by definifing an object with a key/css selector for the target element and the value for the text in the guided tour step. The first part of the key string defines the target type (module or action) followed by a a colon and the name of the module/action or just enter a custom CSS selector string, e.g. module:products, action:manage-layers or #any-element.
		*
		* @property guidedTour
		* @memberof Options.defaults
		* @type {Null | Object}
		* @default null
		* @example guidedTour: {
"module:products": "This is the text for first step.",
"action:manage-layers": "This is the text for second step.",
"#any-element": "Pointer on a custom HTML element"
}
		*/
		guidedTour: null,
		/**
		 * As soon as an element with a color link group is added, the colours of this element will be used for the color group. If false, the colours of all element in the color group will be concatenated.
		 *
		 * @property replaceColorsInColorGroup
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 */
		replaceColorsInColorGroup: false,
		/**
		 * Defines the image types in lowercase that can be uploaded. Currently the designer supports jpg, svg, png images and PDF files.
		 *
		 * @property allowedImageTypes
		 * @memberof Options.defaults
		 * @type {Array}
		 * @default ['jpeg', 'png', 'svg', 'pdf']
		 */
		allowedImageTypes: ["jpeg", "png", "svg", "pdf"],
		/**
		 * To add photos from Pixabay, you have to set an Pixabay API key.
		 *
		 * @property pixabayApiKey
		 * @memberof Options.defaults
		 * @type {String}
		 * @default ''
		 */
		pixabayApiKey: "",
		/**
		 * If you want to access high-resolution images, enable this option and you have to ask Pixabay for permission. You can easily do that here, next to the headline.
		 *
		 * @property pixabayHighResImages
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 */
		pixabayHighResImages: false,
		/**
		 * Language code of the language to be searched in. Accepted values: cs, da, de, en, es, fr, id, it, hu, nl, no, pl, pt, ro, sk, fi, sv, tr, vi, th, bg, ru, el, ja, ko, zh.
		 *
		 * @property pixabayLang
		 * @memberof Options.defaults
		 * @type {String}
		 * @default ''
		 * @version 4.7.5
		 */
		pixabayLang: "en",
		/**
		 * Shows the current image size (px, mm or cm) in a tooltip above the image element when its selected. The option rulerUnit controls the unit of measurement.
		 *
		 * @property sizeTooltip
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 */
		sizeTooltip: false,
		/**
		 * Highlight objects (editable texts and upload zones) with a dashed border. To enable this just define a hexadecimal color value.
		 *
		 * @property highlightEditableObjects
		 * @memberof Options.defaults
		 * @type {String}
		 * @default ''
		 * @version 3.7.2
		 */
		highlightEditableObjects: "",
		/**
		 * When an element is replaced, apply fill(color) from replaced element to added element.
		 *
		 * @property applyFillWhenReplacing
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default true
		 * @version 3.7.2
		 */
		applyFillWhenReplacing: true,
		/**

		* When an element is replaced, apply the size (scaleX and scaleX) from the replace element to added element.
		*
		* @property applySizeWhenReplacing
		* @memberof Options.defaults
		* @type {Boolean}
		* @default true
		* @version 6.1.9
		*/
		applySizeWhenReplacing: false,
		/**
		 * An array containing layouts. A layout is technically a view that will replace all elements in a view when selected.
		 *
		 * @property layouts
		 * @memberof Options.defaults
		 * @type {Array}
		 * @default []
		 * @version 4.7.0
		 */
		layouts: [],
		/**
		 * Options for the Dynamic Views modul.
		 *
		 * @property dynamicViewsOptions
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {}
		 * @version 4.7.0
		 */
		dynamicViewsOptions: {
			/**
			 * Set the length unit that you would like to set the canvas site: 'mm', 'cm', 'inch'
			 *
			 * @property unit
			 * @type {String}
			 * @memberof Options.defaults.dynamicViewsOptions
			 * @default 'mm'
			 */
			unit: "mm",
			/**
			* An array will all available formats when adding a new view.
			*
			* @property formats
			* @type {Array}
			* @memberof Options.defaults.dynamicViewsOptions
			* @default []
			*@example [
	[100, 100],
	[500, 500],
	[1000, 1000]
]
			*/
			formats: [],
			/**
			 * Charge price per area in centimeter. For example if you want to charge a price of 1 per 10cm2, you have to enter 0.1.
			 *
			 * @property pricePerArea
			 * @type {Number}
			 * @memberof Options.defaults.dynamicViewsOptions
			 * @default 0
			 */
			pricePerArea: 0,
			/**
			 * Minimum width that the user can enter as view width.
			 *
			 * @property minWidth
			 * @type {Number}
			 * @memberof Options.defaults.dynamicViewsOptions
			 * @default 0
			 */
			minWidth: 0,
			/**
			 * Minimum height that the user can enter as view height.
			 *
			 * @property minHeight
			 * @type {Number}
			 * @memberof Options.defaults.dynamicViewsOptions
			 * @default 0
			 */
			minHeight: 0,
			/**
			 * Maximum width that the user can enter as view width.
			 *
			 * @property maxWidth
			 * @type {Number}
			 * @memberof Options.defaults.dynamicViewsOptions
			 * @default 10000
			 */
			maxWidth: 10000,
			/**
			 * Maximum height that the user can enter as view height.
			 *
			 * @property maxHeight
			 * @type {Number}
			 * @memberof Options.defaults.dynamicViewsOptions
			 * @default 10000
			 */
			maxHeight: 10000,
		},
		/**
		 * Enable dynamic views, so the user can remove, duplicate and add own views.
		 *
		 * @property enableDynamicViews
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {}
		 * @version 6.0.0
		 */
		enableDynamicViews: false,
		/**
		 * Emojis in text elements will be removed when changing or adding text.
		 *
		 * @property disableTextEmojis
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 * @version 4.7.4
		 */
		disableTextEmojis: false,
		/**
		 * Enable guide lines to align the selected object to the edges of the other objects.
		 *
		 * @property smartGuides
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 * @version 4.7.7
		 */
		smartGuides: true,
		/**
		 * If a printing box has been defined for a view and the element has no individual bounding box, the printing box will be used as bounding box.
		 *
		 * @property usePrintingBoxAsBounding
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 * @version 4.8.0
		 */
		usePrintingBoxAsBounding: false,
		/**
		 * An object defining the printing area when exporting the product as SVG. The visibility property shows the printing box to the customers.
		 *
		 * @property printingBox
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {}
		 * @version 4.7.0
		 * @example {top: 100, left: 100, width: 400, height: 500, visibility: true}
		 */
		printingBox: {},
		/**
		 * A JSON object or URL to a JSON file that stores all initial products. These products will be displayed in the Products module.
		 *
		 * @property productsJSON
		 * @memberof Options.defaults
		 * @type {String}
		 * @default null
		 * @version 4.9.0
		 */
		productsJSON: null,
		/**
		 * A JSON object or URL to a JSON file that stores all designs. These designs will be displayed in the Designs module.
		 *
		 * @property designsJSON
		 * @memberof Options.defaults
		 * @type {String}
		 * @default null
		 * @version 4.9.0
		 */
		designsJSON: null,
		/**
		 * When the customizationRequired argument in the getProduct is set to true, you can control if any view needs to be customized or all. Possible values: any, all.
		 *
		 * @property customizationRequiredRule
		 * @memberof Options.defaults
		 * @type {String}
		 * @default 'any'
		 * @version 4.9.4
		 */
		customizationRequiredRule: "any",
		/**
		 * Display the notification that the product is going to be changed when clicking on a product item in the Products module.
		 *
		 * @property swapProductConfirmation
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 * @version 4.9.5
		 */
		swapProductConfirmation: false,
		/**
		 * Define additional properties that will be applied to all text elements in the same textLinkGroup. E.g.: ['fontFamily', 'fontSize', 'fontStyle']
		 *
		 * @property textLinkGroupProps
		 * @memberof Options.defaults
		 * @type {Array}
		 * @default []
		 * @version 5.0.3
		 */
		textLinkGroupProps: [],
		/**
		 * Text Templates that will appear in the Text module.
		 *
		 * @property textTemplates
		 * @memberof Options.defaults
		 * @type {Array}
		 * @default []
		 * @example [{text: 'Hello World', properties: {fontFamily: 'Arial', textSize: 35}}]
		 * @version 5.1.0
		 */
		textTemplates: [],
		/**
		 * Multiple objects can be selected and moved at the same time.
		 *
		 * @property multiSelection
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 * @version 5.1.0
		 */
		multiSelection: false,
		/**
		 * The border color when multiple elements are selected.
		 *
		 * @property multiSelectionColor
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default '#54dfe6'
		 * @version 5.0.0
		 */
		multiSelectionColor: "#54dfe6",
		/**
		 * The maximum canvas height related to the window height. A number between 0 and 1, e.g. 0.8 will set a maximum canvas height of 80% of the window height. A value of 1 will disable a calculation of a max. height.
		 *
		 * @property canvasHeight
		 * @memberof Options.defaults
		 * @type {Number}
		 * @default 'auto'
		 * @version 6.0.0
		 */
		canvasHeight: "auto",
		/**
		 * The maximum canvas height related to the window height. A number between 0 and 1, e.g. 0.8 will set a maximum canvas height of 80% of the window height. A value of 1 will disable a calculation of a max. height.
		 *
		 * @property maxCanvasHeight
		 * @memberof Options.defaults
		 * @type {Number}
		 * @default 0.8
		 * @version 5.1.1
		 */
		maxCanvasHeight: 0.8,
		/**
		 * Set the behaviour for mobile gestures. Possible values:  'none': No behaviour, 'pinchPanCanvas': Zoom in/out and pan canvas, 'pinchImageScale': Scale selected image with pinch.
		 *
		 * @property mobileGesturesBehaviour
		 * @memberof Options.defaults
		 * @type {String}
		 * @default 'none'
		 * @version 5.1.3
		 */
		mobileGesturesBehaviour: "none",
		/**
		 * Enable image quality ratings for uploaded images. Therefore you can define low, mid and high quality steps. The object receives low, mid and high keys. The values of these keys are arrays, where the first entry defines the width and the second entry defines the height.
		 *
		 * @property imageQualityRatings
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default null
		 * @example {low: [100, 200], mid: [500, 600], high: [1000, 1200]}
		 * @version 5.1.4
		 */
		imageQualityRatings: null,
		/**
		 * Displays the paths of a SVG in the advanced image editor.
		 *
		 * @property splitMultiSVG
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 * @version 5.1.4
		 * @ignore
		 */
		splitMultiSVG: false,
		/**
		 * Set corner controls style: "basic" (Rescale and Rotate) or "advanced" (Rescale, Rotate, Delete, Duplicate).
		 *
		 * @property cornerControlsStyle
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default "advanced"
		 * @version 5.1.4
		 */
		cornerControlsStyle: "advanced",
		/**
		 * The filename when the user downloads the product design as image or PDF.
		 *
		 * @property downloadFilename
		 * @memberof Options.defaults
		 * @type {String}
		 * @default 'Product'
		 * @version 5.1.5
		 */
		downloadFilename: "Product",
		/**
		 * Fill all upload zones with the first uploaded images.
		 *
		 * @property autoFillUploadZones
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 * @version 5.2.7
		 */
		autoFillUploadZones: false,
		/**
		 * Drag & Drop images from the images and designs module into upload zones or on canvas.
		 *
		 * @property dragDropImagesToUploadZones
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 * @version 5.2.7
		 */
		dragDropImagesToUploadZones: false,
		/**
		 * Controls the breakpoints for a responsive layout. You can define small and medium breakpoints. As soon as the window width will be under one of these values, it will change to small (smartphone) or medium (tablet) layout, otherwise it uses the standard layout for large screens (desktop).
		 *
		 * @property responsiveBreakpoints
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {small: 768, medium: 1024}
		 * @version 6.0.0
		 */
		responsiveBreakpoints: {
			small: 768,
			medium: 1024,
		},
		/**
		 * Define our dynamic designs module.
		 *
		 * @property dynamicDesigns
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {}
		 * @version 5.0.0
		 */
		dynamicDesigns: {},
		/**
		 * Add custom text as textbox (the max. width can be adjusted by side controls).
		 *
		 * @property customTextAsTextbox
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default true
		 * @version 6.0.2
		 */
		customTextAsTextbox: false,
		/**
		 * Display the views as thumbnails in an own HTML wrapper by defining a CSS selector or use 'main-wrapper' to display inside main wrapper of the designer.
		 *
		 * @property viewThumbnailsWrapper
		 * @memberof Options.defaults
		 * @type {String}
		 * @default true
		 * @version 6.0.4
		 */
		viewThumbnailsWrapper: "",
		/**
		 * The unit of measurement for the ruler. Possible values: px, mm, cm. Metric values only works when the view has a printing box.
		 *
		 * @property rulerUnit
		 * @memberof Options.defaults
		 * @type {String}
		 * @default 'px'
		 * @version 6.0.9
		 */
		rulerUnit: "px",
		/**
		 * The position of ruler. Display the ruler for the whole canvas or for around the current view printing box. Possible values: 'canvas', 'pb'.
		 *
		 * @property rulerPosition
		 * @memberof Options.defaults
		 * @type {String}
		 * @default 'canvas'
		 * @version 6.2.1
		 */
		rulerPosition: "canvas",
		/**
		 * The ruler is always visible.
		 *
		 * @property rulerFixed
		 * @memberof Options.defaults
		 * @type {Boolean}
		 * @default false
		 * @version 6.2.1
		 */
		rulerFixed: false,
		/**
		 * An object to define the AI service.
		 *
		 * @property aiService
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {serverURL: null, removeBG: true, superRes: true}
		 * @version 6.1.0
		 */
		aiService: {
			/**
			 * URL to server that handles the AI requests.
			 *
			 * @property serverURL
			 * @memberof Options.defaults.aiService
			 * @type {String}
			 * @default null
			 * @version 6.1.0
			 */
			serverURL: null,
			/**
			 * Toggles the remove background service.
			 *
			 * @property removeBG
			 * @memberof Options.defaults.aiService
			 * @type {Boolean}
			 * @default true
			 * @version 6.1.0
			 */
			removeBG: true,
			/**
			 * Toggles the super resolution service.
			 *
			 * @property superRes
			 * @memberof Options.defaults.aiService
			 * @type {Boolean}
			 * @default true
			 * @version 6.1.0
			 */
			superRes: true,
			/**
			 * Toggles the Text2Images tab in the images module.
			 *
			 * @property text2Img
			 * @memberof Options.defaults.aiService
			 * @type {Boolean}
			 * @default true
			 * @version 6.1.0
			 */
			text2Img: true,
		},
		/**
		 * An array containing the SVG urls for the crop masks, when advanced editing is enabled. Use only one path per SVG, only the first path will be used as mask shape.
		 *
		 * @property cropMasks
		 * @memberof Options.defaults
		 * @type {Array}
		 * @default []
		 * @version 6.1.1
		 */
		cropMasks: [],
		/**
		 * Enable specific behaviours for different printing industries.
		 * <ul>
		 * <li>'engraving': Custom Text will have an opacity. Bitmap images will be converted to black&white image with opacity. opts: {opacity:<0-1>, negative: false}</li>
		 * </ul>
		 *
		 * @property industry
		 * @memberof Options.defaults
		 * @type {Object}
		 * @default {type: null, opts: {}}
		 */
		industry: {
			type: null,
			opts: {},
		},
		/**
		 * An object containing the default element parameters in addition to the default Fabric Object properties. See Options.defaults.elementParameters.
		 *
		 * @property elementParameters
		 * @memberof Options.defaults
		 * @type {Object}
		 */
		elementParameters: {
			objectCaching: false,
			/**
			 * Allows to set the z-index of an element, -1 means it will be added on the stack of layers
			 *
			 * @property z
			 * @type {Number}
			 * @memberof Options.defaults.elementParameters
			 * @default -1
			 */
			z: -1,
			/**
			 * The price for the element.
			 *
			 * @property price
			 * @type {Number}
			 * @memberof Options.defaults.elementParameters
			 * @default 0
			 */
			price: 0, //how much does the element cost
			/**
			 * If false, no colorization for the element is possible.One hexadecimal color will enable the colorpicker. Mulitple hexadecimal colors separated by commmas will show a range of colors the user can choose from.
			 *
			 * @property colors
			 * @type {Boolean | String}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 * @example colors: "#000000" => Colorpicker, colors: "#000000,#ffffff" => Range of colors
			 */
			colors: false,
			/**
			 * If true the user can remove the element.
			 *
			 * @property removable
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			removable: false,
			/**
			 * If true the user can drag the element.
			 *
			 * @property draggable
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			draggable: false,
			/**
			 * If true the user can rotate the element.
			 *
			 * @property rotatable
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			rotatable: false,
			/**
			 * If true the user can resize the element.
			 *
			 * @property resizable
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			resizable: false,
			/**
			 * If true the user can copy non-initial elements. Copyable property is enabled for designs and custom added elements automatically.
			 *
			 * @property copyable
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			copyable: false,
			/**
			 * If true the user can change the z-position the element.
			 *
			 * @property zChangeable
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			zChangeable: false,
			/**
			 * Defines a bounding box for the element.
			 * <ul>
			 * <li>False = no bounding box. </li>
			 * <li>The title of an element in the same view, then the boundary of that target element will be used as bounding box. </li>
			 * <li>An object with x,y,width and height defines the bounding box. You can use also borderRadius to define a border radius.</li>
			 * </ul>
			 *
			 * @property boundingBox
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 * @example {x: 10, y: 30, width: 300, height: 400, borderRadius: 40}
			 */
			boundingBox: false,
			/**
			 * Set the mode for the bounding box. Possible values: 'none', 'clipping', 'limitModify', 'inside'
			 *
			 * @property {'none'|'clipping'|'limitModify'|'inside'} boundingBoxMode
			 * @type {String}
			 * @memberof Options.defaults.elementParameters
			 * @default 'clipping'
			 */
			boundingBoxMode: "clipping",
			/**
			 * Centers the element in the canvas or when it has a bounding box in the bounding box.
			 *
			 * @property autoCenter
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			autoCenter: false,
			/**
			 * Replaces an element with the same type and replace value.
			 *
			 * @property replace
			 * @type {String}
			 * @memberof Options.defaults.elementParameters
			 * @default ''
			 */
			replace: "",
			/**
			 * If a replace value is set, you can decide if the element replaces the elements with the same replace value in all views or only in the current showing view.
			 *
			 * @property replaceInAllViews
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default ''
			 */
			replaceInAllViews: false,
			/**
			 * Selects the element when its added to stage.
			 *
			 * @property autoSelect
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			autoSelect: false,
			/**
			 * Sets the element always on top.
			 *
			 * @property topped
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			topped: false,
			/**
			 * You can define different prices when using a range of colors, set through the colors option.
			 *
			 * @property colorPrices
			 * @type {Object}
			 * @memberof Options.defaults.elementParameters
			 * @default {}
			 * @example colorPrices: {"000000": 2, "ffffff: "3.5"}
			 */
			colorPrices: {},
			/**
			 * Include the element in a color link group. So elements with the same color link group are changing to same color as soon as one element in the group is changing the color.
			 *
			 * @property colorLinkGroup
			 * @type {Boolean | String}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 * @example 'my-color-group'
			 */
			colorLinkGroup: false,
			/**
			 * An array of URLs to pattern image - onyl for SVG images or text elements.
			 *
			 * @property patterns
			 * @type {Array}
			 * @memberof Options.defaults.elementParameters
			 * @default []
			 * @example patterns: ['patterns/pattern_1.png', 'patterns/pattern_2.png',]
			 */
			patterns: [],
			/**
			 * An unique identifier for the element.
			 *
			 * @property sku
			 * @type {String}
			 * @memberof Options.defaults.elementParameters
			 * @default ''
			 */
			sku: "",
			/**
			 * When true the element is not exported in SVG. If you are going to use one of the data URI methods, you need to set onlyExportable=true in the options, so the element is not exported in the data URL.
			 *
			 * @property excludeFromExport
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			excludeFromExport: false,
			/**
			 * Shows the element colors in color selection panel.
			 *
			 * @property showInColorSelection
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			showInColorSelection: false,
			/**
			 * By the default the element will be locked and needs to be unlocked by the user via the "Manage Layers" module.
			 *
			 * @property locked
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			locked: false,
			/**
			 * Allow user to unlock proportional scaling in the toolbar. After that the user scale the element unproportional via toolbar or element boundary controls.
			 *
			 * @property uniScalingUnlockable
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			uniScalingUnlockable: false,
			/**
			 * The layer is fixed and will stay on the canvas when changing the product.
			 *
			 * @property fixed
			 * @type {Boolean}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 */
			fixed: false,
			/**
			 * The color of the shadow.
			 *
			 * @property shadowColor
			 * @type {String}
			 * @memberof Options.defaults.elementParameters
			 * @default ''
			 */
			shadowColor: "",
			/**
			 * Shadow Blur.
			 *
			 * @property shadowBlur
			 * @type {Number}
			 * @memberof Options.defaults.elementParameters
			 * @default 0
			 */
			shadowBlur: 0,
			/**
			 * Shadow horizontal offset.
			 *
			 * @property shadowOffsetX
			 * @type {Number}
			 * @memberof Options.defaults.elementParameters
			 * @default 0
			 */
			shadowOffsetX: 0,
			/**
			 * Shadow vertical offset.
			 *
			 * @property shadowOffsetY
			 * @type {Number}
			 * @memberof Options.defaults.elementParameters
			 * @default 0
			 */
			shadowOffsetY: 0,
			/**
			 * Enter the name of the 3D layer to link the color of the layer in the connected 3d model..
			 *
			 * @property colorLink3DLayer
			 * @type {Boolean | String}
			 * @memberof Options.defaults.elementParameters
			 * @default false
			 * @example 'base'
			 */
			colorLink3DLayer: false,
			originX: "center",
			originY: "center",
			cornerSize: 24,
			fill: false,
			lockUniScaling: true,
			pattern: false,
			top: 0,
			left: 0,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			scaleX: 1,
			scaleY: 1,
		},
		/**
		 * An object containing the default text element parameters in addition to the default Fabric IText properties. The properties in the object will merge with the properties in the elementParameters.
		 *
		 * @property textParameters
		 * @memberof Options.defaults
		 * @type {Object}
		 */
		textParameters: {
			/**
			 * The maximal allowed characters. 0 means unlimited characters.
			 *
			 * @property maxLength
			 * @type {Number}
			 * @memberof Options.defaults.textParameters
			 * @default 0
			 */
			maxLength: 0,
			/**
			 * If true the text will be curved.
			 *
			 * @property curved
			 * @type {Boolean}
			 * @memberof Options.defaults.textParameters
			 * @default false
			 */
			curved: false,
			/**
			 * If true the the user can switch between curved and normal text.
			 *
			 * @property curvable
			 * @type {Boolean}
			 * @memberof Options.defaults.textParameters
			 * @default false
			 */
			curvable: false,
			/**
			 * The radius when the text is curved.
			 *
			 * @property curveRadius
			 * @type {Number}
			 * @memberof Options.defaults.textParameters
			 * @default 80
			 */
			curveRadius: 80,
			/**
			 * The max. curve radius an user can set trough toolbar.
			 *
			 * @property maxCurveRadius
			 * @type {Number}
			 * @memberof Options.defaults.textParameters
			 * @default 400
			 */
			maxCurveRadius: 400,
			/**
			 * Reverses the curved text.
			 *
			 * @property curveReverse
			 * @type {Boolean}
			 * @memberof Options.defaults.textParameters
			 * @default false
			 */
			curveReverse: false,
			/**
			 * The maximal allowed lines. 0 means unlimited lines.
			 *
			 * @property maxLines
			 * @type {Number}
			 * @memberof Options.defaults.textParameters
			 * @default 0
			 */
			maxLines: 0,
			/**
			 * Enables the text element as a text box. A text box has a fixed width and not be resized.
			 *
			 * @property textBox
			 * @type {Boolean}
			 * @memberof Options.defaults.textParameters
			 * @default false
			 */
			textBox: false,
			/**
			 * Enables the text element as a placeholder for the Names & Numbers module. You can enable this parameter for one text element in a view.
			 *
			 * @property textPlaceholder
			 * @type {Boolean | Array}
			 * @memberof Options.defaults.textParameters
			 * @default false
			 */
			textPlaceholder: false,
			/**
			 * Enables the text element as a number placeholder for the Names & Numbers module. You can enable this parameter for one text element in a view. If you want to define a range of allowed numbers, just use an array. The first value in the array defines the minimum value, the second value defines the maximum value, e.g. [0, 10].
			 *
			 * @property numberPlaceholder
			 * @type {Boolean}
			 * @memberof Options.defaults.textParameters
			 * @default false
			 */
			numberPlaceholder: false,
			/**
			 * Addtional space between letters.
			 *
			 * @property letterSpacing
			 * @type {Number}
			 * @memberof Options.defaults.textParameters
			 * @default 0
			 */
			letterSpacing: 0,
			/**
			 * The price will be charged first after the text has been edited.
			 *
			 * @property chargeAfterEditing
			 * @type {Boolean}
			 * @memberof Options.defaults.textParameters
			 * @default false
			 */
			chargeAfterEditing: false,
			/**
			 * The minimum font size.
			 *
			 * @property minFontSize
			 * @type {Number}
			 * @memberof Options.defaults.textParameters
			 * @default 1
			 */
			minFontSize: 1,
			/**
			 * Set the text transform - none, lowercase, uppercase.
			 *
			 * @property textTransform
			 * @type {String}
			 * @memberof Options.defaults.textParameters
			 * @default 'none'
			 */
			textTransform: "none",
			/**
			 * Set a width for the text, so the text will be scaled up/down to the given area.
			 *
			 * @property widthFontSize
			 * @type {Number}
			 * @memberof Options.defaults.textParameters
			 * @default 0
			 */
			widthFontSize: 0,
			/**
			 * The maximum font size. Using a value higher than 200 can cause performance issues with text boxes.
			 *
			 * @property maxFontSize
			 * @type {Number}
			 * @memberof Options.defaults.textParameters
			 * @default 1
			 */
			maxFontSize: 200,
			/**
			 * Link the text of different text elements, changing the text of one element will also change the text of text elements with the same textLinkGroup value.
			 *
			 * @property textLinkGroup
			 * @type {String}
			 * @memberof Options.defaults.textParameters
			 * @default ""
			 */
			textLinkGroup: "",
			/**
			 * The colors for the stroke. If empty, the color wheel will be displayed.
			 *
			 * @property strokeColors
			 * @type {Array}
			 * @memberof Options.defaults.textParameters
			 * @default []
			 */
			strokeColors: [],
			/**
			 * Enable neon effect to text.
			 *
			 * @property neonText
			 * @type {Boolean}
			 * @memberof Options.defaults.textParameters
			 * @default []
			 */
			neonText: false,
			editable: true,
			fontFamily: "Arial",
			fontSize: 18,
			lineHeight: 1,
			fontWeight: "normal", //set the font weight - bold or normal
			fontStyle: "normal", //'normal', 'italic'
			textDecoration: "normal", //'normal' or 'underline'
			padding: 10,
			textAlign: "left",
			stroke: null,
			strokeWidth: 0,
			charSpacing: 0,
		},
		/**
		 * An object containing the default image element parameters in addition to the default Fabric Image properties. See Options.defaults.imageParameters. The properties in the object will merge with the properties in the elementParameters.
		 *
		 * @property imageParameters
		 * @memberof Options.defaults
		 * @type {Object}
		 */
		imageParameters: {
			/**
			 * If true the image will be used as upload zone. That means the image is a clickable area in which the user can add different media types.
			 *
			 * @property uploadZone
			 * @type {Boolean}
			 * @memberof Options.defaults.imageParameters
			 * @default false
			 */
			uploadZone: false,
			/**
			 * Sets a filter on the image. Possible values: 'grayscale', 'sepia' or any filter name from FPDFilters class.
			 *
			 * @property filter
			 * @type {Boolean}
			 * @memberof Options.defaults.imageParameters
			 * @default null
			 */
			filter: null,
			/**
			 * Defines the colorization method for the element. Possible values: 
			 *  'tint' (default) - The color will be applied fully to the element.
			 *  'multiply' - The color will be multiplied with the element color.
			 * @property colorMode
			 * @type {String}
			 * @memberof Options.defaults.imageParameters
			 * @default 'tint'
			 */
			colorMode: 'tint',
			/**
			 * Set the scale mode when image is added into an upload zone or resizeToW/resizeToH properties are set. Possible values: 'fit', 'cover'
			 *
			 * @property scaleMode
			 * @type {String}
			 * @memberof Options.defaults.imageParameters
			 * @default 'fit'
			 */
			scaleMode: "fit",
			/**
			 * Resizes the uploaded image to this width. 0 means it will not be resized.
			 *
			 * @property resizeToW
			 * @type {Number}
			 * @memberof Options.defaults.imageParameters
			 * @default 0
			 */
			resizeToW: 0,
			/**
			 * Resizes the uploaded image to this height. 0 means it will not be resized.
			 *
			 * @property resizeToH
			 * @type {Number}
			 * @memberof Options.defaults.imageParameters
			 * @default 0
			 */
			resizeToH: 0,
			/**
			 * Enables advanced editing, the user can crop, set filters and manipulate the color of the image. This works only for png or jpeg images. If the original image has been edited via the image editor, the original image will be replaced by a PNG with 72DPI!
			 *
			 * @property advancedEditing
			 * @type {Boolean}
			 * @memberof Options.defaults.imageParameters
			 * @default false
			 */
			advancedEditing: false,
			/**
			 * If true the upload zone can be moved by the user.
			 *
			 * @property uploadZoneMovable
			 * @type {Boolean}
			 * @memberof Options.defaults.imageParameters
			 * @default false
			 * version 4.8.2
			 */
			uploadZoneMovable: false,
			/**
			 * If true the upload zone can be removed by the user.
			 *
			 * @property uploadZoneRemovable
			 * @type {Boolean}
			 * @memberof Options.defaults.imageParameters
			 * @default false
			 * version 5.0.0
			 */
			uploadZoneRemovable: false,
			padding: 0,
			minScaleLimit: 0.01,
		},
		/**
		 * An object containing the default parameters for custom added images. See  Options.defaults.customImageParameters. The properties in the object will merge with the properties in the elementParameters and imageParameters.
		 *
		 * @property customImageParameters
		 * @memberof Options.defaults
		 * @type {Object}
		 */
		customImageParameters: {
			/**
			 * The minimum upload size width.
			 *
			 * @property minW
			 * @type {Number}
			 * @memberof Options.defaults.customImageParameters
			 * @default 100
			 */
			minW: 100,
			/**
			 * The minimum upload size height.
			 *
			 * @property minH
			 * @type {Number}
			 * @memberof Options.defaults.customImageParameters
			 * @default 100
			 */
			minH: 100,
			/**
			 * The maximum upload size width.
			 *
			 * @property maxW
			 * @type {Number}
			 * @memberof Options.defaults.customImageParameters
			 * @default 10000
			 */
			maxW: 10000,
			/**
			 * The maximum upload size height.
			 *
			 * @property maxH
			 * @type {Number}
			 * @memberof Options.defaults.customImageParameters
			 * @default 10000
			 */
			maxH: 10000,
			/**
			 * The minimum allowed DPI for uploaded images. Works only with JPEG images.
			 *
			 * @property minDPI
			 * @type {Number}
			 * @memberof Options.defaults.customImageParameters
			 * @default 72
			 */
			minDPI: 72,
			/**
			 * The maxiumum image size in MB.
			 *
			 * @property maxSize
			 * @type {Number}
			 * @memberof Options.defaults.customImageParameters
			 * @default 10
			 */
			maxSize: 10,
			autoCenter: true,
		},
		/**
		 * An object containing additional parameters for custom added text.The properties in the object will merge with the properties in the elementParameters and textParameters.
		 *
		 * @property customTextParameters
		 * @memberof Options.defaults
		 * @type {Object}
		 */
		customTextParameters: {
			autoCenter: true,
			copyable: true,
		},
		/**
		 * An object containing the supported media types the user can add in the product designer.
		 *
		 * @property customAdds
		 * @memberof Options.defaults
		 * @type {Object}
		 */
		customAdds: {
			/**
			 * If true the user can add images from the designs library.
			 *
			 * @property designs
			 * @type {Boolean}
			 * @memberof Options.defaults.customAdds
			 * @default true
			 */
			designs: true,
			/**
			 * If true the user can add an own image.
			 *
			 * @property uploads
			 * @type {Boolean}
			 * @memberof Options.defaults.customAdds
			 * @default true
			 */
			uploads: true,
			/**
			 * If true the user can add own text.
			 *
			 * @property texts
			 * @type {Boolean}
			 * @memberof Options.defaults.customAdds
			 * @default true
			 */
			texts: true,
			/**
			 * If true the user can add own drawings.
			 *
			 * @property drawing
			 * @type {Boolean}
			 * @memberof Options.defaults.customAdds
			 * @default true
			 */
			drawing: true,
		},
		/**
		 * An object containing the properties (parameters) for the QR code.
		 *
		 * @property qrCodeProps
		 * @memberof Options.defaults
		 * @type {Object}
		 */
		qrCodeProps: {
			/**
			 * @property autoCenter
			 * @type {Boolean}
			 * @memberof Options.defaults.qrCodeProps
			 * @default true
			 */
			autoCenter: true,
			/**
			 * @property draggable
			 * @type {Boolean}
			 * @memberof Options.defaults.qrCodeProps
			 * @default true
			 */
			draggable: true,
			/**
			 * @property removable
			 * @type {Boolean}
			 * @memberof Options.defaults.qrCodeProps
			 * @default true
			 */
			removable: true,
			/**
			 * @property resizable
			 * @type {Boolean}
			 * @memberof Options.defaults.qrCodeProps
			 * @default true
			 */
			resizable: true,
		},
	};

	/**
	 * Merges the default options with custom options.
	 *
	 * @method merge
	 * @static
	 * @memberof Options
	 * @param {Object} defaults The default object.
	 * @param {Object} [merge] The merged object, that will be merged into the defaults.
	 * @return {Object} The new options object.
	 */
	static merge(defaults = {}, merge = {}) {
		var options = deepMerge(defaults, merge);
		return options;
	}

	/**
	 * Returns all element parameter keys.
	 *
	 * @method getParameterKeys
	 * @static
	 * @memberof Options
	 * @return {Array} An array containing all element parameter keys.
	 */
	static getParameterKeys() {
		var elementParametersKeys = Object.keys(this.defaults.elementParameters),
			imageParametersKeys = Object.keys(this.defaults.imageParameters),
			textParametersKeys = Object.keys(this.defaults.textParameters);

		elementParametersKeys = elementParametersKeys.concat(imageParametersKeys);
		elementParametersKeys = elementParametersKeys.concat(textParametersKeys);

		return elementParametersKeys;
	}
}

if (window) window.FPDOptions = Options;

class PricingRules {

	constructor(fpdInstance) {

		this.fpdInstance = fpdInstance;

		addEvents(
			fpdInstance, 
			[
				'elementModify',
				'productCreate',
				'elementAdd',
				'elementRemove',
				'viewCreate',
				'viewRemove',
				'elementFillChange',
				'textLinkApply'
			],
			this.doPricingRules.bind(this)
		);

	}

	doPricingRules(evt) {

		const unitFormat =this.fpdInstance.mainOptions.dynamicViewsOptions ? this.fpdInstance.mainOptions.dynamicViewsOptions.unit : 'mm';

		this.fpdInstance.pricingRulesPrice = 0;
					
		var pricingRules = this.fpdInstance.mainOptions.pricingRules;
		if( pricingRules && pricingRules.length > 0) {

			//loop all pricing groups
			pricingRules.forEach((pGroup) => {

				if(!pGroup.property || !pGroup.target) return;

				var targetElems = [];
				
				//get view instance as target
				if(pGroup.property == 'canvasSize' || pGroup.property == 'coverage') {

					targetElems = this.fpdInstance.viewInstances;

				}
				//get single element as target
				else if(pGroup.target.elements !== undefined && pGroup.target.elements.charAt(0) === '#') {

					targetElems.push(
						this.fpdInstance.currentViewInstance.fabricCanvas.getElementByTitle(
							pGroup.target.elements.replace('#', ''), 
							pGroup.target.views
						)
					);
				}
				//get custom elements as target
				else if(pGroup.target.elements !== undefined && pGroup.target.elements.search('custom') !== -1) {

					targetElems = this.fpdInstance.getCustomElements(
						pGroup.target.elements.replace('custom', '').toLowerCase(),
						pGroup.target.views,
						false
					);

				}
				//get mutliple elements as target
				else {
										
					targetElems = this.fpdInstance.getElements(pGroup.target.views, pGroup.target.elements, false);
					

				}	
				
				//ignore upload zones
				targetElems = targetElems.filter((obj) => {                
					return !obj.uploadZone;
				});

				//loop all target elements in group
				var property,
					loopTargetsOnce = false;

				//only loop once for these props
				if(['elementsLength', 'colorsLength'].indexOf(pGroup.property) !== -1) {
					loopTargetsOnce = true;
				}

				targetElems.forEach((targetElem, index) => {

					if(!targetElem || (loopTargetsOnce && index > 0)) {
						return;
					}

					//getCustomElements returns an object with the element
					if(targetElem.hasOwnProperty('element')) {
						targetElem = targetElem.element;
					}

					//get property for condition					
					if(pGroup.property === 'textLength') { //for text in all views
						property = targetElem.text ? targetElem.text.replace(/\s/g, "").length : null;						
					}
					else if(pGroup.property === 'linesLength') { //for text in all views
						property = targetElem.text ? targetElem.text.split("\n").length : null;
					}
					if(pGroup.property === 'fontSize') { //for text in all views
						property = targetElem.text ? targetElem.fontSize : null;
					}
					else if(pGroup.property === 'imageSize') { //for image in all views
						property = targetElem.getType() === 'image' && targetElem.title ? {width: targetElem.width, height: targetElem.height} : null;
					}
					else if(pGroup.property === 'imageSizeScaled') { //for image in all views
						property = targetElem.getType() === 'image' && targetElem.title ? {width: targetElem.width * targetElem.scaleX, height: targetElem.height * targetElem.scaleY} : null;
					}
					else if (pGroup.property === 'printableSizeScaled') { //for image in all views
						property = (targetElem.text || targetElem.getType() === 'image') && targetElem.title ? { targetElem, width: targetElem.width * targetElem.scaleX, height: targetElem.height * targetElem.scaleY } : null;
					}
					else if(pGroup.property === 'canvasSize') { //views: all
						property = {width: pixelToUnit(targetElem.options.stageWidth, unitFormat), height: pixelToUnit(targetElem.options.stageHeight, unitFormat) };
					}
					else if(pGroup.property === 'coverage') { //views: all						
						property = this.#getCoverageinPB(targetElem);
					}
					else if(pGroup.property === 'pattern') { //text and svg in all views
						property = targetElem.pattern;
					}
					// ---- one time loop props
					else if(pGroup.property === 'elementsLength') { //views: all, elements: all
						property = targetElems.length;						
					}
					else if(pGroup.property === 'colorsLength') { //views: all
						property = this.fpdInstance.getUsedColors(pGroup.target.views).length;
					}

					//property for element is not valid
					if(property === null || property === undefined) {
						return;
					}

					//add real property to every rule
					pGroup.rules.forEach((pRule) => {
						pRule.property = property;
					});

					if(pGroup.type === 'any') { //if-else
						pGroup.rules.some(this.#loopPricingGroup.bind(this));
					}
					else { //all, if-loop
						pGroup.rules.forEach(this.#loopPricingGroup.bind(this));
					}

				});

			});

		}

		this.fpdInstance.calculatePrice();

	}

	#loopPricingGroup(pRule, index) {

		if(typeof pRule.price === 'function') {
			this.fpdInstance.pricingRulesPrice += pRule.price(pRule.property);
			return true;
		}
		else if(this.#condition(pRule.operator, pRule.property, pRule.value)) {

			if(typeof pRule.price === 'number') {
				this.fpdInstance.pricingRulesPrice += pRule.price;
				
			}
			return true;
		}
		else
			return false;

	};

	#condition(oper, prop, value) {

		//check if prop is an object that contains more props to compare
		if(typeof value === 'object') {

			var keys = Object.keys(value),
				tempReturn = null;

			//as soon as if one is false in the prop object, the whole condition becomes false
			keys.forEach((key) => {

				if(tempReturn !== false) {
					tempReturn = this.#operator(oper, prop[key], value[key]);
				}

			});
			return tempReturn;
		}
		else { //just single to compare
			return this.#operator(oper, prop, value);
		}

	}

	#operator(oper, prop, value) {

		if(oper === '=') {
			return prop === value;
		}
		else if(oper === '>') {
			return prop > value;
		}
		else if(oper === '<') {
			return prop < value;
		}
		else if(oper === '>=') {
			return prop >= value;
		}
		else if(oper === '<=') {
			return prop <= value;
		}

	}

	#getCoverageinPB(viewInst) {
		
		if(!viewInst || !viewInst.fabricCanvas || !objectHasKeys(viewInst.options.printingBox, ['left','top','width','height'])) return null;

		let minX, minY, maxX, maxY;
		viewInst.fabricCanvas.forEachObject((fObj) => {

			if(!fObj.excludeFromExport && !fObj._ignore) {

				var boundingRect = fObj.getBoundingRect(true);

				if (minX === undefined || boundingRect.left < minX) {
					minX = boundingRect.left;
				}
				if (minY === undefined || boundingRect.top < minY) {
					minY = boundingRect.top;
				}
				if (maxX === undefined || boundingRect.left + boundingRect.width > maxX) {
					maxX = boundingRect.left + boundingRect.width;
				}
				if (maxY === undefined || boundingRect.top + boundingRect.height > maxY) {
					maxY = boundingRect.top + boundingRect.height;
				}

			}			

		});

		let allObjsBB = {};
		if(minX) {

			allObjsBB = {
				minX: minX,
				minY: minY,
				maxX: maxX,
				maxY: maxY
			};

		}
		
				
		if(!objectHasKeys(allObjsBB, ['minX','minY','maxX','maxY'])) return null;

		const pb = viewInst.options.printingBox;

		//calc the left point & total width
		const minLeft = Math.max(pb.left, allObjsBB.minX);
		const maxLeft = Math.min(pb.left+pb.width, allObjsBB.maxX);
		const totalWidth = maxLeft - minLeft;

		//calc the top point & total height
		const minTop = Math.max(pb.top, allObjsBB.minY);
		const maxTop = Math.min(pb.top+pb.height, allObjsBB.maxY);
		const totalHeight = maxTop - minTop;

		const allObjsArea = totalWidth * totalHeight;
		const pbArea = pb.width * pb.height;

		//calculate and return the percentage coverage
		const percentage = (allObjsArea / pbArea) * 100;

		return percentage;
		

	}

}

const renderRectY = (ctx, left, top, styleOverride, fabricObject) => {

    styleOverride = styleOverride || {};
    
    let xSize = 6,
        ySize = 15;

    const borderRadius = 4;

    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric$1.util.degreesToRadians(fabricObject.angle));
    ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
    ctx.beginPath();
    if(ctx.roundRect)
        ctx.roundRect(-3, -7.5, xSize, ySize, borderRadius);
    else
        ctx.rect(-3, -7.5, xSize, ySize);
    ctx.filter = 'drop-shadow(0px 0px 2px rgba(0,0,0, 0.3))';
    ctx.fill();
    ctx.restore();
    
};

const renderRectX = (ctx, left, top, styleOverride, fabricObject) => {

    styleOverride = styleOverride || {};
    
    let xSize = 15,
        ySize = 6;

    const borderRadius = 4;

    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric$1.util.degreesToRadians(fabricObject.angle));
    ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
    ctx.beginPath();
    if(ctx.roundRect)
        ctx.roundRect(-7.5, -3, xSize, ySize, borderRadius);
    else
        ctx.rect(-7.5, -3, xSize, ySize);
    ctx.filter = 'drop-shadow(0px 0px 2px rgba(0,0,0, 0.3))';
    ctx.fill();
    ctx.restore();
    
};

fabric$1.Control.prototype.touchSizeX = 40;
fabric$1.Control.prototype.touchSizeY = 40;
fabric$1.Object.prototype.transparentCorners = false;

//vertical and horizontal bars for unpropoprtional scaling
fabric$1.Object.prototype.controls.ml.render = renderRectY;  
fabric$1.Object.prototype.controls.mr.render = renderRectY;   
fabric$1.Object.prototype.controls.mt.render = renderRectX;  
fabric$1.Object.prototype.controls.mb.render = renderRectX;  
fabric$1.Textbox.prototype.controls.ml.render = renderRectY;  
fabric$1.Textbox.prototype.controls.mr.render = renderRectY;  

//hide bottom-left corner
fabric$1.Object.prototype.controls.bl.visible = false;   

//rotate
fabric$1.Object.prototype.controls.mtr.withConnection = false;
fabric$1.Object.prototype.controls.mtr.y = 0.5;
fabric$1.Object.prototype.controls.mtr.offsetY = 25;
fabric$1.Object.prototype.controls.mtr.offsetX = -8;

//circle corner (basic)
fabric$1.Object.prototype.controls.tl.render = 
fabric$1.Object.prototype.controls.tr.render =
fabric$1.Object.prototype.controls.mtr.render =
fabric$1.Object.prototype.controls.br.render = function(ctx, left, top, styleOverride, fabricObject) {
    fabric$1.controlsUtils.renderCircleControl.call(this, ctx, left, top, styleOverride, fabricObject);
};

//crop-mask done
fabric$1.Object.prototype.controls.cropMaskDoneControl = new fabric$1.Control({
    x: 0.5,
    y: -0.5,
    actionName: 'crop-mask-done',
    offsetY: -20,
    offsetX: -45,
    cursorStyle: 'pointer',
    mouseDownHandler: cropMaskDone,
    render: (ctx, left, top, styleOverride, fabricObject) => {
        
        if(fabricObject.name !== 'crop-mask') return;
        
        styleOverride.cornerColor = '#2ecc71';
        styleOverride.cornerIconColor = '#fff';

        // renderIcon(
        //     ctx, 
        //     left, 
        //     top, 
        //     styleOverride, 
        //     fabricObject,
        //     String.fromCharCode('0xe90a'),
        //     0,
        //     0
        // )
    },
    cornerSize: 24
});

function cropMaskDone(eventData, transform) {

    const maskObj = transform.target;
    if(maskObj.targetElement) ;
    
}

//crop-mask cancel
fabric$1.Object.prototype.controls.cropMaskCancelControl = new fabric$1.Control({
    x: 0.5,
    y: -0.5,
    actionName: 'crop-mask-cancel',
    offsetY: -20,
    offsetX: -12,
    cursorStyle: 'pointer',
    mouseDownHandler: cropMaskCancel,
    render: (ctx, left, top, styleOverride, fabricObject) => {

        if(fabricObject.name !== 'crop-mask') return;
        
        styleOverride.cornerColor = '#c44d56';
        styleOverride.cornerIconColor = '#fff';

        // renderIcon(
        //     ctx, 
        //     left, 
        //     top, 
        //     styleOverride, 
        //     fabricObject,
        //     String.fromCharCode('0xe944'),
        //     0,
        //     0
        // )
    },
    cornerSize: 24
});

function cropMaskCancel(eventData, transform) {

    const maskObj = transform.target;
    if(maskObj.targetElement) {
        maskObj.canvas.removeElement(maskObj);
        maskObj.targetElement.cropMask = null;
    }
    
}

const initAdvancedCorners = () => {

    const renderIcon = (control, ctx, left, top, styleOverride, fabricObject, iconString, offsetX=8, offsetY=8) => {    

        styleOverride = styleOverride || {};
    
        let xSize = control.sizeX || styleOverride.cornerSize || fabricObject.cornerSize,
            ySize = control.sizeY || styleOverride.cornerSize || fabricObject.cornerSize,
            xSizeBy2 = xSize / 2, 
            ySizeBy2 = ySize / 2;
    
        const borderRadius = 4;
        const iconSize = xSize * 0.6;
        const iconColor = styleOverride.cornerIconColor || fabricObject.cornerIconColor || '#000000';
    
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric$1.util.degreesToRadians(fabricObject.angle));
        ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
        ctx.beginPath();
        if(ctx.roundRect)
            ctx.roundRect(-xSizeBy2+offsetX, -ySizeBy2+offsetY, xSize, ySize, borderRadius);
        else
            ctx.rect(-xSizeBy2+offsetX, -ySizeBy2+offsetY, xSize, ySize);
        ctx.filter = 'drop-shadow(0px 0px 2px rgba(0,0,0, 0.3))';
        ctx.fill();
        ctx.font = iconSize + 'px FontFPD';
        ctx.fillStyle = iconColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.filter = 'none';
        ctx.fillText(iconString, -(iconSize*0.5)+offsetX, -(iconSize*0.5)+offsetY);
        ctx.restore();
        
    };

    //copy
    fabric$1.Object.prototype.controls.tl.cursorStyleHandler = () => {
        return 'pointer';
    };

    fabric$1.Object.prototype.controls.tl.mouseDownHandler = function(eventData, transform) {

        const target = transform.target;
        
        if(target.canvas.viewOptions.cornerControlsStyle === 'advanced') {
            target.canvas.duplicateElement(target);
        }
    
    };
    fabric$1.Object.prototype.controls.tl.actionHandler = null;
    fabric$1.Object.prototype.controls.tl.render = function(ctx, left, top, styleOverride, fabricObject) {
        
        renderIcon(
            this,
            ctx, 
            left, 
            top, 
            styleOverride, 
            fabricObject,
            String.fromCharCode('0xe94d'),
            -8,
            -8
        );
        
    };

    fabric$1.Object.prototype.controls.tr.cursorStyleHandler = () => {
        return 'pointer';
    };
    fabric$1.Object.prototype.controls.tr.mouseDownHandler = function(eventData, transform) {
    
        const target = transform.target;
        target.canvas.removeElement(target);
        
    };
    fabric$1.Object.prototype.controls.tr.actionHandler = null;
    fabric$1.Object.prototype.controls.tr.render = function(ctx, left, top, styleOverride, fabricObject) {
            
        renderIcon(
            this,
            ctx, 
            left, 
            top, 
            styleOverride, 
            fabricObject,
            String.fromCharCode('0xe907'),
            8,
            -8
        );
        
    };


    //rotate
    fabric$1.Object.prototype.controls.mtr.render = function(ctx, left, top, styleOverride, fabricObject) {
        
        renderIcon(
            this,
            ctx, 
            left, 
            top, 
            styleOverride, 
            fabricObject,
            String.fromCharCode('0xe957')
        );
        
    };


    //scale
    fabric$1.Object.prototype.controls.br.render = function(ctx, left, top, styleOverride, fabricObject) {
        
        renderIcon(
            this,
            ctx, 
            left, 
            top, 
            styleOverride, 
            fabricObject,
            String.fromCharCode('0xe922')
        );
        
    };

};

fabric$1.Group.prototype.changeObjectColor = function (index, hexColor) {
    
    let colors = [];
    
    this.getObjects().forEach((path) => {
        
        const tc = tinycolor(path.fill);
        colors.push(tc.toHexString());
        
    });
    
    colors[index] = hexColor;
    
    this.changeColor(colors);
    
    return colors;

};

fabric$1.Text.prototype.initialize = (function (originalFn) {
	return function (...args) {
		originalFn.call(this, ...args);
		this._TextInit();
		return this;
	};
})(fabric$1.Text.prototype.initialize);

fabric$1.Text.prototype.toImageSVG = function (args) {
	//disable clippath otherwise shadow text is not working
	let tempCliPath = this.clipPath;
	this.clipPath = null;

	let multiplier = 1;
	if (this?.canvas?.viewOptions?.printingBox && this?.canvas?.viewOptions?.output) {
		const dpi = Math.ceil(
			(this.canvas.viewOptions.printingBox.width * 25.4) / this.canvas.viewOptions.output.width
		);
		multiplier = parseInt(300 / dpi);
	}

	let ctx = this;
	let ctxWidth = ctx.width;
	let ctxHeight = ctx.height;

	if (this.shadow?.color) {
		var shadow = this.shadow;
		// Calculate shadow offset and blur
		ctxWidth += (Math.abs(shadow.offsetX) + shadow.blur) * 2;
		ctxHeight += (Math.abs(shadow.offsetY) + shadow.blur) * 2;
	}

	let svgDataURL = ctx.toDataURL({
		withoutShadow: false,
		withoutTransform: true,
		multiplier: multiplier,
		enableRetinaScaling: false,
	});

	this.clipPath = tempCliPath;

	return this._createBaseSVGMarkup(
		[
			`<image href="${svgDataURL}" width = "${ctxWidth}" height = "${ctxHeight}" x = "${-ctxWidth / 2}" y="${
				-ctxHeight / 2
			}" style="scale: ${1.0 / this.scaleX} ${1.0 / this.scaleY}"/>`,
		],
		{
			reviver: args[0],
			noStyle: true,
			withShadow: false,
		}
	);
};

fabric$1.Text.prototype.toSVG = (function (originalFn) {
	return function (...args) {
		//convert text to image data uri in print mode for specific text options
		if (this.canvas.printMode && (this.opacity != 1 || this.shadow?.color || this.pattern)) {
			return this.toImageSVG(args);
		}
		return originalFn.call(this, ...args);
	};
})(fabric$1.Text.prototype.toSVG);

fabric$1.Text.prototype._constrainScale = (function (originalFn) {
	return function (value) {
		value = originalFn.call(this, value);

		if (this.minFontSize !== undefined) {
			const scaledFontSize = parseFloat(Number(value * this.fontSize).toFixed(0));
			if (scaledFontSize < this.minFontSize) {
				return this.minFontSize / this.fontSize;
			}
		}

		if (this.maxFontSize !== undefined) {
			const scaledFontSize = parseFloat(Number(value * this.fontSize).toFixed(0));
			if (scaledFontSize > this.maxFontSize) {
				return this.maxFontSize / this.fontSize;
			}
		}

		return value;
	};
})(fabric$1.Text.prototype._constrainScale);

fabric$1.Text.prototype._TextInit = function () {
	const _updateFontSize = (elem) => {
		if (!elem.curved && !elem.uniScalingUnlockable) {
			let newFontSize = elem.fontSize * elem.scaleX;
			newFontSize = parseFloat(Number(newFontSize).toFixed(0));

			elem.scaleX = 1;
			elem.scaleY = 1;
			elem._clearCache();
			elem.set("fontSize", newFontSize);

			if (elem.canvas)
				elem.canvas.fire("elementModify", {
					element: elem,
					options: { fontSize: newFontSize },
				});
		}
	};

	this.on({
		modified: (opts) => {
			_updateFontSize(this);
		},
	});
};

fabric$1.Text.prototype._createTextCharSpan = function (_char, styleDecl, left, top) {
	const multipleSpacesRegex = /  +/g;

	//FPD: add text styles to tspan
	styleDecl.fontWeight = this.fontWeight;
	styleDecl.fontStyle = this.fontStyle;

	var shouldUseWhitespace = _char !== _char.trim() || _char.match(multipleSpacesRegex),
		styleProps = this.getSvgSpanStyles(styleDecl, shouldUseWhitespace);

	//FPD: add underlined text
	styleProps += this.textDecoration === "underline" ? " text-decoration: underline;" : "";

	let fillStyles = styleProps ? 'style="' + styleProps + '"' : "",
		dy = styleDecl.deltaY,
		dySpan = "",
		NUM_FRACTION_DIGITS = fabric$1.Object.NUM_FRACTION_DIGITS;

	if (dy) {
		dySpan = ' dy="' + fabric$1.util.toFixed(dy, NUM_FRACTION_DIGITS) + '" ';
	}
	return [
		'<tspan x="',
		fabric$1.util.toFixed(left, NUM_FRACTION_DIGITS),
		'" y="',
		fabric$1.util.toFixed(top, NUM_FRACTION_DIGITS),
		'" ',
		dySpan,
		fillStyles,
		">",
		fabric$1.util.string.escapeXml(_char),
		"</tspan>",
	].join("");
};

fabric$1.Text.prototype._getSVGLeftTopOffsets = (function (originalFn) {
	return function (...args) {
		const offsets = originalFn.call(this, ...args);

		//Change the left offset if direction is "rtl".  Note for "ltr" the original function sets textLeft to "-this.width / 2".
		//This is to fix a bug where the SVG is placed in the wrong position when using "rtl".
		if (this.direction === "rtl")
			offsets.textLeft = this.width / 2;

		return offsets;
	}
})(fabric$1.Text.prototype._getSVGLeftTopOffsets);

fabric$1.Text.prototype._renderChars = (function (originalFn) {
	return function (...args) {
		//Change ctx direction to "rtl" if needed.  Fixes a bug where the text was drawn in the wrong position when 
		//usePrintingBoxAsBounding set to 1.
		if (this.direction === "rtl") {
			const ctx = args[1];
			if (ctx)
				ctx.direction = "rtl";
		}

		originalFn.call(this, ...args);
	};
})(fabric$1.Text.prototype._renderChars);

const getScaleByDimesions = (imgW, imgH, resizeToW = 0, resizeToH = 0, mode = "fit") => {
	resizeToW = typeof resizeToW !== "number" ? 0 : resizeToW;
	resizeToH = typeof resizeToH !== "number" ? 0 : resizeToH;

	let scaling = 1,
		rwSet = resizeToW !== 0,
		rhSet = resizeToH !== 0;

	if (mode === "cover") {
		//cover whole area

		let dW = resizeToW - imgW,
			dH = resizeToH - imgH;

		if (dW < dH) {
			//scale width
			scaling = rwSet ? Math.max(resizeToW / imgW, resizeToH / imgH) : 1;
		} else {
			//scale height
			scaling = rhSet ? Math.max(resizeToW / imgW, resizeToH / imgH) : 1;
		}
	} else {
		//fit into area

		if (imgW > imgH) {
			scaling = rwSet ? Math.min(resizeToW / imgW, resizeToH / imgH) : 1;
		} else {
			scaling = rhSet ? Math.min(resizeToW / imgW, resizeToH / imgH) : 1;
		}
	}

	return parseFloat(scaling.toFixed(10));
};

const drawCirclePath = (cx, cy, r) => {
	return (
		"M" +
		cx +
		"," +
		cy +
		"m" +
		-r +
		",0a" +
		r +
		"," +
		r +
		" 0 1,0 " +
		r * 2 +
		",0a" +
		r +
		"," +
		r +
		" 0 1,0 " +
		-r * 2 +
		",0"
	);
};

const getFilter = (key, opts = {}) => {
	if (typeof key === "string") {
		key = key.toLowerCase();

		switch (key) {
			case "grayscale":
				return new fabric$1.Image.filters.Grayscale();
			case "sepia":
				return new fabric$1.Image.filters.Sepia();
			case "kodachrome":
				return new fabric$1.Image.filters.Kodachrome();
			case "black_white":
				return new fabric$1.Image.filters.BlackWhite();
			case "vintage":
				return new fabric$1.Image.filters.Vintage();
			case "technicolor":
				return new fabric$1.Image.filters.Technicolor();
			case "brightness":
				return new fabric$1.Image.filters.Brightness(opts);
			case "contrast":
				return new fabric$1.Image.filters.Contrast(opts);
			case "removewhite":
				return new fabric$1.Image.filters.RemoveColor(opts);
		}
	} else if (Array.isArray(key)) {
		return new fabric$1.Image.filters.ColorMatrix({
			matrix: key,
		});
	}

	return null;
};

const isHexColor = (hex) => {
	return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

if (window) {
	window.FPDFabricUtils = {
		getScaleByDimesions: getScaleByDimesions,
	};
}

fabric$1.IText.prototype.initialize = (function (originalFn) {
	return function (...args) {
		originalFn.call(this, ...args);
		this._ITextInit();
		return this;
	};
})(fabric$1.IText.prototype.initialize);

fabric$1.IText.prototype._ITextInit = function () {
	this.on({
		added: () => {
			if (this.setTextPath) this.setTextPath();
		},
		"editing:entered": () => {
			//prevent text editing in canvas, useful to make text editing only possible via external input
			if (!this.canvas.viewOptions.inCanvasTextEditing) this.exitEditing();

			if (this.curved) this.exitEditing();
		},
		changed: () => {
			//max. lines
			if (this.maxLines != 0 && this.textLines.length > this.maxLines) {
				let textLines = this.textLines.slice(0, this.maxLines);
				this.set("text", textLines.join("\n"));
				this.exitEditing();
			}

			//max. characters
			if (this.maxLength != 0 && this.text.length > this.maxLength) {
				this.set("text", this.text.substr(0, this.maxLength));
				this.exitEditing();
			}

			//remove emojis
			if (this.canvas.viewOptions.disableTextEmojis) {
				let text = this.text.replace(FPDEmojisRegex, "");
				text = text.replace(String.fromCharCode(65039), ""); //fix: some emojis left a symbol with char code 65039
				this.set("text", text);
			}

			if (this.widthFontSize) {
				let resizedFontSize;
				if (this.width > this.widthFontSize) {
					resizedFontSize = this.fontSize * (this.widthFontSize / (this.width + 1)); //decrease font size
				} else {
					resizedFontSize = this.fontSize * (this.widthFontSize / (this.width - 1)); //increase font size
				}

				if (resizedFontSize < this.minFontSize) {
					resizedFontSize = this.minFontSize;
				} else if (resizedFontSize > this.maxFontSize) {
					resizedFontSize = this.maxFontSize;
				}

				resizedFontSize = parseInt(resizedFontSize);
				this.set("fontSize", resizedFontSize);
			}
		},
	});
};

fabric$1.Textbox.prototype.initialize = (function(originalFn) {
    return function(...args) {
        originalFn.call(this, ...args);
        this._TextboxInit();
        return this;
    };
})(fabric$1.Textbox.prototype.initialize);

fabric$1.Textbox.prototype._TextboxInit = function() {
    
    this.on({
        'added': () => {

            //calc the longest line width
            if(this._calcWidth) {

                //set temp width in order to calc the longest line width
                this.set('width', 1000);

                const longestLineWidth = this.calcTextWidth();
                this.set('width', longestLineWidth);

                delete this._calcWidth;                
                
            }
            
        }
    });
    
};

const NeonText = fabric$1.util.createClass(fabric$1.Group, {

    type: 'neon-text',
    text: '',
    fontFamily: 'Arial',
    fontSize: 40,
    lineHeight: 1,
    charSpacing: 0,
    textAlign: 'left',

    initialize: function (text, options) {
        
        options || (options = {});

        this.text = text;
        this.texts = [];
        
        const shadows = [
            {
                color: '#fff',
                offsetX: 0,
                offsetY: 0,
                blur: 5
            },
            {
                color: '#fff',
                offsetX: 0,
                offsetY: 0,
                blur: 10
            },
            {
                color: options.fill,
                offsetX: 0,
                offsetY: 0,
                blur: 40
            },
            {
                color: options.fill,
                offsetX: 0,
                offsetY: 0,
                blur: 80
            }
        ];

        shadows.forEach((shadow, i) => {            
            
            const shadowedText = new fabric$1.IText(text, {
                left: 0,
                top: 0,
                originX: 'center',
                originY: 'center',
                fontSize: options.fontSize,
                fontFamily: options.fontFamily,
                fill: '#fff',
                shadow: new fabric$1.Shadow(shadow)
            });

            this.texts.push(shadowedText);

        });

        this.callSuper('initialize', this.texts, options);
    },

    set: function(key, value) {
        
        if (['fill', 'fontFamily', 'text', 'fontSize', 'lineHeight', 
            'charSpacing', 'textAlign'].includes(key)) {
                        
            this.texts.forEach(text => {

                if(key == 'text')
                    text[key] = value;
                else {

                    if(key == 'fill') {

                        this.texts[2].shadow.color = value;
                        this.texts[3].shadow.color = value;

                    }
                    else {                        
                        text[key] = value;
                    }
                    
                }
   
            });

        }

        setTimeout(() => {
            
            this.width = this.texts[0].width;
            this.height = this.texts[0].height;
            this.canvas && this.canvas.renderAll();

        }, 10);

        this.callSuper('set', key, value);

    },

});

// Register the new type so that it can be created from an object
fabric$1.NeonText = NeonText;
fabric$1.NeonText.fromObject = function (object, callback) {
    return fabric$1.Object._fromObject('NeonText', object, callback);
};

fabric.CurvedText = fabric.util.createClass(fabric.IText, {
	type: "curved-text",

	initialize: function (text, options) {
		options || (options = {});
		this.callSuper("initialize", text, options);

		this.curveRadius = options.curveRadius || 50;
		this.curveReverse = options.curveReverse || false;
		this.effect = options.effect || "curved";
		this.startAngle = options.startAngle || -Math.PI / 2;

		this.on({
			//selected
			selected: () => {
				if (this.path) this.path.visible = true;
			},
			deselected: () => {
				if (this.path) this.path.visible = false;
			},
		});
	},

	_set: function (key, value) {
		this.callSuper("_set", key, value);

		return this;
	},

	_escapeXml: function (str) {
		return str.replace(/[<>&'"]/g, function (match) {
			switch (match) {
				case "<":
					return "&lt;";
				case ">":
					return "&gt;";
				case "&":
					return "&amp;";
				case "'":
					return "&apos;";
				case '"':
					return "&quot;";
				default:
					return match;
			}
		});
	},

	_getLetterPositions: function () {
		if (!(this.textLines?.length > 0 && this.textLines[0].length > 0 && this.curveRadius > 0)) {
			console.error("ERROR: Can't calculate letter positions.");
			return [];
		}

		//Get the first line of text only.  Currently on the Canvas/PNG other lines are drawn on top of the first.
		const text = this.textLines[0];

		//Temp canvas and context.
		const tempCanvas = fabric.util.createCanvasElement();
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.font = this.fontSize + "px " + this.fontFamily;

		//Compute distance along path for each char.
		const charMetrics = [];
		const charSpacingPx = this.letterSpacing * 0.1 * this.fontSize;

		let distance = 0;
		let spacingLast = 0;
		for (let i = 0; i < text.length; i++) {
			const spacingCurrent = tempCtx.measureText(text[i]).width;
			if (i === 0) {
				//First char.
				distance += spacingCurrent / 2;
			} else {
				const spacingBoth = tempCtx.measureText(text[i - 1] + text[i]).width;
				//Chars can have different sizes, so get spacing between them.
				const spacingDelta = spacingBoth - spacingCurrent / 2 - spacingLast / 2;
				distance += charSpacingPx + spacingDelta;
			}
			spacingLast = spacingCurrent;

			charMetrics.push({ char: text[i], distance });
		}

		const totalWidth = this.calcTextWidth();
		const totalAngle = totalWidth / this.curveRadius;

		//Works for the default textAlign = "left" only (which currently works more like "center").
		const angleRadOffset = totalAngle / 2 + Math.PI;
		const angleRadStart = this.startAngle + (this.curveReverse ? angleRadOffset : -angleRadOffset - Math.PI);

		return charMetrics.map((metric) => {
			const angleRad = angleRadStart + (metric.distance / this.curveRadius) * (this.curveReverse ? -1 : 1);

			return {
				char: metric.char,
				x: this.curveRadius * Math.cos(angleRad),
				y: this.curveRadius * Math.sin(angleRad),
				rotation: (angleRad * 180) / Math.PI + (this.curveReverse ? 270 : 90),
			};
		});
	},

	toSVG: function (...args) {
		if (this.canvas.printMode && (this.opacity != 1 || this.shadow?.color || this.pattern)) {
			return this.toImageSVG(args);
		}

		const markup = ["<g ", this.getSvgTransform(), this.getSvgFilter()];

		if (this.clipPath && !this.clipPath.excludeFromExport) {
			markup.push(' clip-path="url(#', this.clipPath.clipPathId, ')"');
		}
		markup.push(">");

		const letterPositions = this._getLetterPositions();

		// Common text styles
		const textStyles = [
			'font-family="',
			this.fontFamily ? this._escapeXml(this.fontFamily) : "Times New Roman",
			'" ',
			'font-size="',
			this.fontSize,
			'" ',
			'font-style="',
			this.fontStyle,
			'" ',
			'font-weight="',
			this.fontWeight,
			'" ',
			'text-decoration="',
			this.textDecoration || "",
			'" ',
			'style="',
			this.getSvgStyles(true),
			'"',
			this.addPaintOrder(),
		].join("");

		// Add each letter as an individual text element
		letterPositions.forEach((pos) => {
			markup.push(
				"<text ",
				textStyles,
				'text-anchor="middle" ',
				'dominant-baseline="middle" ',
				'transform="translate(',
				pos.x.toFixed(2),
				",",
				pos.y.toFixed(2),
				") rotate(",
				pos.rotation.toFixed(2),
				')"',
				">",
				this._escapeXml(pos.char),
				"</text>\n"
			);
		});

		markup.push("</g>\n");

		return markup.join("");
	},

	setTextPath: function () {
		const path = new fabric.Path(drawCirclePath(0, 0, this.curveRadius), {
			fill: "transparent",
			strokeWidth: 1,
			stroke: "rgba(0,0,0, 0.1)",
			visible: false,
		});

		this.set("path", path);
		this.updateTextPosition();
	},

	updateTextPosition: function () {
		if (this.path) {
			this.pathSide = this.curveReverse ? "left" : "right";
			const offset = this.curveReverse ? Math.PI * this.curveRadius * 2 * 0.25 : (Math.PI * this.curveRadius) / 2;
			this.pathStartOffset = offset - this.calcTextWidth() / 2;
			this.pathAlign = "center";
		}
	},

	toObject: function (propertiesToInclude) {
		return fabric.util.object.extend(this.callSuper("toObject", propertiesToInclude), {
			curveRadius: this.curveRadius,
			curveReverse: this.curveReverse,
			effect: this.effect,
			startAngle: this.startAngle,
		});
	},
});

// Register fromObject method
fabric.CurvedText.fromObject = function (object, callback) {
	return fabric.Object._fromObject("CurvedText", object, callback);
};

/**
 * An array containting properties to include when exporting.
 *
 * @property propertiesToInclude
 * @type {Array}
 * @extends fabric.Object
 */
fabric$1.Object.propertiesToInclude = [
	"_isInitial",
	"lockMovementX",
	"lockMovementY",
	"lockRotation",
	"lockScalingX",
	"lockScalingY",
	"lockScalingFlip",
	"lockUniScaling",
	"resizeType",
	"boundingBox",
	"boundingBoxMode",
	"selectable",
	"evented",
	"title",
	"editable",
	"cornerColor",
	"cornerIconColor",
	"borderColor",
	"isEditable",
	"hasUploadZone",
	"cornerSize",
	"source",
	"_optionsSet",
];

fabric$1.Object.prototype._limitModifyOpts = {};
fabric$1.Object.prototype.__editorMode = false;

fabric$1.Object.prototype.initialize = (function (originalFn) {
	return function (...args) {
		originalFn.call(this, ...args);
		this._elementInit();
		return this;
	};
})(fabric$1.Object.prototype.initialize);

fabric$1.Object.prototype._elementInit = function () {
	this.on({
		added: () => {
			if (this.isCustom && !this.hasUploadZone && !this.replace) {
				this.copyable = this.originParams.copyable = true;
			}
		},
		moving: () => {
			this._checkContainment();
		},
		rotating: () => {
			this._checkContainment();
		},
		scaling: () => {
			this._checkContainment();
		},
		selected: () => {
			this._elementControls();
		},
	});
};

fabric$1.Object.prototype._elementControls = function () {
	let widthControls = Boolean(!this.lockUniScaling || this.__editorMode),
		heightControls = Boolean(!this.lockUniScaling || this.__editorMode),
		copyControl = Boolean(this.copyable || this.__editorMode),
		removeControl = Boolean(this.removable || this.__editorMode),
		resizeControl = Boolean((this.resizable || this.__editorMode) && !this.curved),
		rotateControl = Boolean(this.rotatable || this.__editorMode);

	if (this.textBox && !this.curved) widthControls = true;

	if (this.canvas && this.canvas.viewOptions.cornerControlsStyle == "basic") {
		this.controls.mtr.offsetX = 0;
		this.cornerSize = 16;
	}

	if (this.name == "printing-boxes" || this.name == "view-mask") {
		widthControls = false;
		heightControls = false;
		rotateControl = false;
		copyControl = false;
		removeControl = false;
	}

	this.setControlsVisibility({
		ml: widthControls,
		mr: widthControls,
		mt: heightControls,
		mb: heightControls,
		tr: removeControl,
		tl: copyControl,
		mtr: rotateControl,
		br: resizeControl,
	});
};

//checks if an element is in its containment (bounding box)
fabric$1.Object.prototype._checkContainment = function () {
	if (this.canvas && this.canvas.currentBoundingObject && !this.hasUploadZone) {
		this.setCoords();

		if (this.boundingBoxMode === "limitModify") {
			let targetBoundingRect = this.getBoundingRect(),
				bbBoundingRect = this.canvas.currentBoundingObject.getBoundingRect(),
				minX = bbBoundingRect.left,
				maxX = bbBoundingRect.left + bbBoundingRect.width - targetBoundingRect.width,
				minY = bbBoundingRect.top,
				maxY = bbBoundingRect.top + bbBoundingRect.height - targetBoundingRect.height;

			//check if target element is not contained within bb
			if (!this.isContainedWithinObject(this.canvas.currentBoundingObject)) {
				if (targetBoundingRect.left > minX && targetBoundingRect.left < maxX) {
					this._limitModifyOpts.left = this.left;
				}

				if (targetBoundingRect.top > minY && targetBoundingRect.top < maxY) {
					this._limitModifyOpts.top = this.top;
				}

				this.setOptions(this._limitModifyOpts);
			} else {
				this._limitModifyOpts = {
					left: this.left,
					top: this.top,
					angle: this.angle,
					scaleX: this.scaleX,
					scaleY: this.scaleY,
				};

				if (this.getType() == "text") {
					this._limitModifyOpts.fontSize = this.fontSize;
					this._limitModifyOpts.lineHeight = this.lineHeight;
					this._limitModifyOpts.charSpacing = this.charSpacing;
				}
			}
		} else if (this.boundingBoxMode === "inside" || this.boundingBoxMode === "clipping") {
			var isOut = false,
				tempIsOut = this.isOut;

			isOut = !this.isContainedWithinObject(this.canvas.currentBoundingObject);

			if (isOut) {
				if (this.boundingBoxMode === "inside") {
					this.borderColor = this.canvas.viewOptions.outOfBoundaryColor;
				}

				this.isOut = true;
			} else {
				if (this.boundingBoxMode === "inside") {
					this.borderColor = this.canvas.viewOptions.selectedColor;
				}

				this.isOut = false;
			}

			if (tempIsOut != this.isOut && tempIsOut != undefined) {
				if (isOut) {
					/**
					 * Gets fired as soon as an element is outside of its bounding box.
					 *
					 * @event fabric.Object#elementOut
					 * @param {Event} event
					 */
					this.canvas.fire("elementOut", {
						target: this,
					});
				} else {
					/**
					 * Gets fired as soon as an element is inside of its bounding box again.
					 *
					 * @event fabric.Object#elementIn
					 * @param {Event} event
					 */
					this.canvas.fire("elementIn", {
						target: this,
					});
				}
			}

			this.canvas.fire("elementCheckContainemt", {
				target: this,
				boundingBoxMode: this.boundingBoxMode,
			});
		}
	}
};

fabric$1.Object.prototype._clipElement = function () {
	var clippingObj = this.getClippingObject();

	if (clippingObj) {
		if (clippingObj.type) {
			clippingObj.clone((clonedPath) => {
				clonedPath.set({
					absolutePositioned: true,
					opacity: 1,
				});

				this.clipPath = clonedPath;
			});
		} else {
			const clipRect = new fabric$1.Rect({
				originX: "left",
				originY: "top",
				angle: clippingObj.angle || 0,
				left: clippingObj.left,
				top: clippingObj.top,
				width: clippingObj.width,
				height: clippingObj.height,
				fill: "#DDD",
				absolutePositioned: true,
				rx: clippingObj.borderRadius,
				ry: clippingObj.borderRadius,
			});

			this.clipPath = clipRect;
		}

		this.canvas.renderAll();
	}
};

/**
 * Gets the type of an element.
 *
 * @method getType
 * @param {String} [fabricType] Checks this fabrich type instead of this.
 * @returns {String} The element type - text or image.
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.getType = function (fabricType) {
	fabricType = fabricType ? fabricType : this.type;

	if (
		fabricType === "text" ||
		fabricType === "i-text" ||
		fabricType === "textbox" ||
		fabricType === "neon-text" ||
		fabricType === "engraved-text" ||
		fabricType === "curved-text"
	) {
		return "text";
	} else {
		return "image";
	}
};

/**
 * Checks if the element is a SVG.
 *
 * @method isSVG
 * @returns {Boolean} State
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.isSVG = function () {
	return this.type === "group" || this.type === "path" || (this.source && this.source.includes(".svg"));
};

/**
 * Checks if the element is colorizable.
 *
 * @method isColorizable
 * @returns {Boolean} State
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.isColorizable = function () {
	if (this.getType() === "text") {
		return "text";
	}

	if (!this.source) {
		return false;
	}

	const imageParts = this.source.split(".");
	//its base64 encoded
	if (imageParts.length == 1) {
		if (this.source.includes("data:image/png;")) {
			return "dataurl";
		} else {
			this.fill = this.colors = false;
			return false;
		}
	}
	//its a url
	else {
		let url = removeUrlParams(this.source);

		//only png and svg are colorizable
		if (url.includes(".png") || this.isSVG()) {
			return this.isSVG() ? "svg" : "png";
		} else {
			this.fill = this.colors = false;
			return false;
		}
	}
};

/**
 * Checks if the element is a bitmap image.
 *
 * @method isBitmap
 * @returns {Boolean} State
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.isBitmap = function () {
	return this.type === "image";
};

/**
 * Checks if the element has a color selection.
 *
 * @method hasColorSelection
 * @returns {Boolean} State
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.hasColorSelection = function () {
	return (
		(Array.isArray(this.colors) || Boolean(this.colors) || this.colorLinkGroup || this.__editorMode) &&
		this.isColorizable() !== false
	);
};

/**
 * Checks if the element can be edited by the user.
 *
 * @method checkEditable
 * @param {Object} checkProps Pass an object of properties instead of using this element.
 * @returns {Boolean} Editable state
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.checkEditable = function (checkProps) {
	checkProps = checkProps ? checkProps : this;

	return (
		typeof checkProps.colors === "object" ||
		checkProps.colors === true ||
		checkProps.colors == 1 ||
		checkProps.removable ||
		checkProps.draggable ||
		checkProps.resizable ||
		checkProps.rotatable ||
		checkProps.zChangeable ||
		checkProps.advancedEditing ||
		checkProps.editable ||
		checkProps.uploadZone ||
		(checkProps.colorLinkGroup && checkProps.colorLinkGroup.length > 0) ||
		checkProps.__editorMode
	);
};

/**
 * Changes the color of an element.
 *
 * @method changeColor
 * @param {String | Array} colorData Hex color value or any array of hex color values.
 * @param {Boolean} [colorLinking=true] If element is color linked, execute it.
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.changeColor = function (colorData, colorLinking = true) {
	const colorizable = this.isColorizable();

	//check if hex color has only 4 digits, if yes, append 3 more
	if (typeof colorData === "string" && isHexColor(colorData)) colorData = tinycolor(colorData).toHexString();

	//text
	if (this.getType() === "text") {
		if (typeof colorData == "object") {
			colorData = colorData[0];
		}

		//set color of a text element
		this.set("fill", colorData);
		this.canvas.renderAll();
		this.pattern = null;
	}
	//path groups (svg)
	else if (this.type == "group" && typeof colorData == "object") {
		const objects = this.getObjects();
		colorData.forEach((hexColor, i) => {
			if (objects[i]) {
				objects[i].set("fill", hexColor);
			}
		});
		this.canvas.renderAll();

		this.svgFill = colorData;
		delete this["fill"];
	}
	//image
	else {
		if (typeof colorData == "object") {
			colorData = colorData[0];
		}

		if (typeof colorData !== "string") {
			colorData = false;
		}

		//colorize png or dataurl image
		if ((colorizable == "png" || colorizable == "dataurl") && colorData) {
			this.filters = [];
			this.filters.push(
				new fabric$1.Image.filters.BlendColor({ mode: this.colorMode, color: colorData, alpha: 1 })
			);

			this.applyFilters();
			this.canvas.renderAll();
			this.fill = colorData;
		}
		//colorize svg (single path)
		else if (colorizable == "svg") {
			this.set("fill", colorData);
			this.canvas.renderAll();
		}
	}

	this.canvas.fire("elementFillChange", { element: this, colorLinking: colorLinking });
};

/**
 * Sets the pattern for an element.
 *
 * @method setPattern
 * @param {String} patternUrl The URL of the image used as pattern.
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.setPattern = function (patternUrl) {
	if (patternUrl) {
		if (this.canvas.proxyFileServer) {
			patternUrl = this.canvas.proxyFileServer + patternUrl;
		}

		fabric$1.util.loadImage(patternUrl, (img) => {
			if (this.isSVG()) {
				//group of paths
				if (this.hasOwnProperty("getObjects")) {
					const paths = this.getObjects();
					for (var i = 0; i < paths.length; ++i) {
						paths[i].set(
							"fill",
							new fabric$1.Pattern({
								source: img,
								repeat: "repeat",
							})
						);
					}
				}
				//single path
				else {
					this.set(
						"fill",
						new fabric$1.Pattern({
							source: img,
							repeat: "repeat",
						})
					);
				}
			}
			//text
			else if (this.getType() == "text") {
				this.set(
					"fill",
					new fabric$1.Pattern({
						source: img,
						repeat: "repeat",
					})
				);
			}
			//for all other revert to color
			else {
				let color = this.fill ? this.fill : this.colors[0];
				color = color ? color : "#000000";
				this.set("fill", color);
			}

			this.canvas.renderAll();
			this.canvas.fire("elementFillChange", { element: this });
		});

		this.pattern = patternUrl;
	}
};

/**
 * Gets the z-index of an element.
 *
 * @method getZIndex
 * @returns {Number} The z-index.
 * @extends fabric.Object
 */
fabric$1.Object.prototype.getZIndex = function () {
	const objects = this.canvas.getObjects();
	return objects.indexOf(this);
};

/**
 * Centers an element horizontal or/and vertical.
 *
 * @method centerElement
 * @param {Boolean} [hCenter=true] Center horizontal.
 * @param {Boolean} [vCenter=true] Center vertical.
 * @extends fabric.Object
 */
fabric$1.Object.prototype.centerElement = function (hCenter = true, vCenter = true) {
	let boundingBox = this.getBoundingBoxCoords(),
		left = this.left,
		top = this.top;

	if (hCenter) {
		if (boundingBox) {
			left = boundingBox.cp ? boundingBox.cp.x : boundingBox.left + boundingBox.width * 0.5;
		} else {
			left = this.canvas.viewOptions.stageWidth * 0.5;
		}
	}

	if (vCenter) {
		if (boundingBox) {
			top = boundingBox.cp ? boundingBox.cp.y : boundingBox.top + boundingBox.height * 0.5;
		} else {
			top = this.canvas.viewOptions.stageHeight * 0.5;
		}
	}

	this.setPositionByOrigin(new fabric$1.Point(left, top), "center", "center");

	this.canvas.renderAll();
	this.setCoords();
	this._checkContainment();

	this.autoCenter = false;
};

/**
 * Returns the bounding box of an element.
 *
 * @method getBoundingBoxCoords
 * @param {fabric.Object} element A fabric object
 * @returns {Object | Boolean} The bounding box object with x,y,width and height or false.
 */
fabric$1.Object.prototype.getBoundingBoxCoords = function () {
	if (this.boundingBox || this.uploadZone) {
		if (typeof this.boundingBox == "object") {
			if (
				this.boundingBox.hasOwnProperty("x") &&
				this.boundingBox.hasOwnProperty("y") &&
				this.boundingBox.width &&
				this.boundingBox.height
			) {
				return {
					left: this.boundingBox.x,
					top: this.boundingBox.y,
					width: this.boundingBox.width,
					height: this.boundingBox.height,
					borderRadius: this.boundingBox.borderRadius || 0,
				};
			} else {
				return false;
			}
		} else {
			const targetObject = this.canvas.getElementByTitle(this.boundingBox);

			if (targetObject) {
				const topLeftPoint = targetObject.getPointByOrigin("left", "top");
				return {
					left: topLeftPoint.x,
					top: topLeftPoint.y,
					width: targetObject.width * targetObject.scaleX,
					height: targetObject.height * targetObject.scaleY,
					angle: targetObject.angle || 0,
					cp: targetObject.getCenterPoint(),
				};
			}
		}
	}

	return false;
};

/**
 * Gets the object for the clipping. Could be an object with coordinates or a fabric.Object.
 *
 * @method getClippingObject
 * @returns {Object | fabric.Object} The object used for clipping.
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.getClippingObject = function () {
	if (this.boundingBox || this.uploadZone) {
		if (typeof this.boundingBox == "object") {
			return this.getBoundingBoxCoords();
		} else {
			const targetObject = this.canvas.getElementByTitle(this.boundingBox);

			if (targetObject) {
				if (targetObject.type == "image") {
					return this.getBoundingBoxCoords();
				} else {
					return targetObject;
				}
			}
		}
	}

	return false;
};

/**
 * Gets the JSON representation of the element.
 *
 * @method getElementJSON
 * @param {Boolean} [addPropertiesToInclude=false] Add properties from propertiesToInclude property.
 * @param {Array} [propertyKeys=[]] Addtional property keys to include.
 * @returns {Object} A JSON representation of the element.
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.getElementJSON = function (addPropertiesToInclude = false, propertyKeys = []) {
	if (this.canvas) {
		propertyKeys = Object.keys(this.canvas.viewOptions.elementParameters);

		if (this.getType() === "text") {
			propertyKeys = propertyKeys.concat(Object.keys(this.canvas.viewOptions.textParameters));
		} else {
			propertyKeys = propertyKeys.concat(Object.keys(this.canvas.viewOptions.imageParameters));
		}
	}

	if (addPropertiesToInclude) {
		propertyKeys = propertyKeys.concat(fabric$1.Object.propertiesToInclude);
	}

	if (this.uploadZone) {
		propertyKeys.push("customAdds");
		propertyKeys.push("designCategories");
		propertyKeys.push("designCategories[]"); //fpd-admin
	}

	if (this.getType() === "text") {
		propertyKeys.push("text");
		propertyKeys.push("_initialText");
	}

	if (this.type === "group") {
		propertyKeys.push("svgFill");
	}

	propertyKeys.push("width");
	propertyKeys.push("height");
	propertyKeys.push("isEditable");
	propertyKeys.push("hasUploadZone");
	propertyKeys.push("evented");
	propertyKeys.push("isCustom");
	propertyKeys.push("currentColorPrice");
	propertyKeys.push("_isPriced");
	propertyKeys.push("originParams");
	propertyKeys.push("originSource");
	propertyKeys.push("_printingBox");
	propertyKeys.push("_optionsSet");
	propertyKeys.push("_isQrCode");
	propertyKeys.push("cropMask");
	propertyKeys.push("isCustomImage");
	propertyKeys = propertyKeys.sort();

	let elementProps = {};
	propertyKeys.forEach((key) => {
		if (this[key] !== undefined) {
			elementProps[key] = this[key];
		}
	});

	return elementProps;
};

/**
 * Aligns an element.
 *
 * @method alignToPosition
 * @param {String} [pos='left'] Allowed values: left, right, top or bottom.
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.alignToPosition = function (pos = "left") {
	let localPoint = this.getPointByOrigin("left", "top"),
		boundingBox = this.getBoundingBoxCoords(),
		posOriginX = "left",
		posOriginY = "top";

	if (pos === "left") {
		localPoint.x = boundingBox ? boundingBox.left : 0;
		localPoint.x += this.padding + 1;
	} else if (pos === "top") {
		localPoint.y = boundingBox ? boundingBox.top : 0;
		localPoint.y += this.padding + 1;
	} else if (pos === "right") {
		localPoint.x = boundingBox
			? boundingBox.left + boundingBox.width - this.padding
			: this.canvas.viewOptions.stageWidth - this.padding;
		posOriginX = "right";
	} else {
		localPoint.y = boundingBox
			? boundingBox.top + boundingBox.height - this.padding
			: this.canvas.viewOptions.stageHeight;
		posOriginY = "bottom";
	}

	this.setPositionByOrigin(localPoint, posOriginX, posOriginY);
	this.canvas.renderAll();
	this._checkContainment();
};

/**
 * Toggles the visibility of an upload zone.
 * The upload zone is visible if it contains an element and hidden when empty.
 *
 * @method toggleUploadZone
 * @extends fabric.Canvas
 */
fabric$1.Object.prototype.toggleUploadZone = function () {
	if (this.hasUploadZone && this.canvas) {
		//check if upload zone contains objects
		let objects = this.canvas.getObjects(),
			uploadZoneEmpty = true;

		for (var i = 0; i < objects.lenth; ++i) {
			var object = objects[i];
			if (object.replace == this.replace) {
				uploadZoneEmpty = false;
				break;
			}
		}

		//get upload zone of element
		var uploadZoneObject = this.canvas.getUploadZone(this.replace);
		if (uploadZoneObject) {
			//show/hide upload zone
			uploadZoneObject.set("opacity", uploadZoneEmpty ? 1 : 0);
			uploadZoneObject.evented = uploadZoneEmpty;
		}

		this.canvas.renderAll();
	}
};

fabric.Canvas.prototype.historyProcessing = true;

/**
 * Override the initialize function for the _historyInit();
 */
fabric.Canvas.prototype.initialize = (function (originalFn) {
    return function (...args) {
        originalFn.call(this, ...args);
        this._historyInit();
        return this;
    };
})(fabric.Canvas.prototype.initialize);

/**
 * Override the dispose function for the _historyDispose();
 */
fabric.Canvas.prototype.dispose = (function (originalFn) {
    return function (...args) {
        originalFn.call(this, ...args);
        this._historyDispose();
        return this;
    };
})(fabric.Canvas.prototype.dispose);

/**
 * Returns current state of the string of the canvas
 */
fabric.Canvas.prototype._historyNext = function () {

    let jsonObj = {version: fabric.version, objects: this.getElementsJSON(false, false)};
    
    jsonObj.objects.forEach(element => {        

        if(element.curved) {
            delete element.path;
        }
        
    });   
     
    return JSON.stringify(jsonObj);
};

/**
 * Returns an object with fabricjs event mappings
 */
fabric.Canvas.prototype._historyEvents = function () {
    return {
        'elementAdd': this.historySaveAction,
        'elementRemove': this.historySaveAction,
        'object:modified': this.historySaveAction,
    }
};

/**
 * Initialization of the plugin
 */
fabric.Canvas.prototype._historyInit = function () {
    this.historyUndo = [];
    this.historyRedo = [];
    this.historyNextState = this._historyNext();

    this.on(this._historyEvents());
};

/**
 * Remove the custom event listeners
 */
fabric.Canvas.prototype._historyDispose = function () {
    this.off(this._historyEvents());
};

/**
 * It pushes the state of the canvas into history stack
 */
fabric.Canvas.prototype.historySaveAction = function () {
    
    if (this.historyProcessing)
        return;
    
    const json = this.historyNextState;
        
    this.isCustomized = this.initialElementsLoaded;
    
    this.historyUndo.push(json);
    this.historyNextState = this._historyNext();
    this.fire('history:append', { json: json });
};

/**
 * Undo to latest history. 
 * Pop the latest state of the history. Re-render.
 * Also, pushes into redo history.
 */
fabric.Canvas.prototype.undo = function (callback) {
    // The undo process will render the new states of the objects
    // Therefore, object:added and object:modified events will triggered again
    // To ignore those events, we are setting a flag.
    this.historyProcessing = true;
    this.deselectElement();

    const history = this.historyUndo.pop();
    if (history) {
        // Push the current state to the redo history
        this.historyRedo.push(this._historyNext());
        this.historyNextState = history;
        this._loadHistory(history, 'history:undo', callback);
    } else {
        this.historyProcessing = false;
    }
};

/**
 * Redo to latest undo history.
 */
fabric.Canvas.prototype.redo = function (callback) {
    // The undo process will render the new states of the objects
    // Therefore, object:added and object:modified events will triggered again
    // To ignore those events, we are setting a flag.
    this.historyProcessing = true;
    this.deselectElement();

    const history = this.historyRedo.pop();
    if (history) {
        // Every redo action is actually a new action to the undo history
        this.historyUndo.push(this._historyNext());
        this.historyNextState = history;
        this._loadHistory(history, 'history:redo', callback);
    } else {
        this.historyProcessing = false;
    }
};

fabric.Canvas.prototype._loadHistory = function (history, event, callback) {

    if(typeof history === 'string')
        history = JSON.parse(history);
    
    this.clear();
    this.addElements(history.objects, () => {

        this.fire(event);
        this.historyProcessing = false;
        if (callback && typeof callback === 'function') callback();

    });
   
};

/**
 * Clear undo and redo history stacks
 */
fabric.Canvas.prototype.clearHistory = function () {
    this.historyUndo = [];
    this.historyRedo = [];
    //this.isCustomized = false;
    this.fire('history:clear');
};

/**
 * On the history
 */
fabric.Canvas.prototype.onHistory = function () {
    this.historyProcessing = false;

    this.historySaveAction();
};

/**
 * Off the history
 */
fabric.Canvas.prototype.offHistory = function () {
    this.historyProcessing = true;
};

fabric.Canvas.prototype.panCanvas = false;

const ZoomPan = (canvas, type) => {

    let mouseDownStage = false,
        lastTouchX,
		lastTouchY,
        pinchElementScaleX,
        pinchElementScaleY,
        initialDist = null;
            
    canvas.on({
        'mouse:down': (opts) => {
            
            mouseDownStage = true;

            if(opts.e.touches) {

                lastTouchX = opts.e.touches[0].clientX;
                lastTouchY = opts.e.touches[0].clientY;
                                                
                if(canvas.currentElement) {
                    pinchElementScaleX = canvas.currentElement.scaleX;
                    pinchElementScaleY = canvas.currentElement.scaleY;
                }
                
            }

        },
        'mouse:up': function(opts) {
            
            mouseDownStage = false;
            initialDist = null;

        },
        'mouse:move': function(opts) {
            
            let scale = null;
            if((type == 'pinchImageScale' || type == 'pinchPanCanvas')
                && opts.e.touches
                && opts.e.touches.length == 2)
            {

                let touch1 = opts.e.touches[0],
                    touch2 = opts.e.touches[1];

                if(initialDist === null) {
                    initialDist = Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));
                }

                let dist = Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));
                
                scale =  dist / initialDist;

            }
            
            //on touch            
            if( type == 'pinchImageScale'
                && scale !== null 
                && canvas.currentElement 
                && canvas.currentElement.getType() == 'image' 
                && canvas.currentElement.resizable) 
            {
                                
                canvas.setElementOptions({
                    scaleX: pinchElementScaleX * scale,
                    scaleY: pinchElementScaleY * scale,
                }, canvas.currentElement);

            } 
            //pinch
            else if(type == 'pinchPanCanvas' && opts.e.touches && scale !== null) {                        
                canvas.setResZoom(scale);
            }
            else if(canvas.panCanvas) {
                
                //on touch
                if(opts.e.touches) {
                    
                    //pan                    
                    if(opts.e.touches.length == 1) {

                        let currentTouchX = opts.e.touches[0].clientX,
                            currentTouchY = opts.e.touches[0].clientY;

                            canvas.relativePan(new fabric.Point(
                            currentTouchX - lastTouchX,
                            currentTouchY - lastTouchY
                        ));

                        lastTouchX = currentTouchX;
                        lastTouchY = currentTouchY;

                    }

                }
                //on mouse
                else {

                    //drag canvas with mouse
                    if(mouseDownStage) {

                        canvas.relativePan(new fabric.Point(
                            opts.e.movementX,
                            opts.e.movementY
                        ));

                    }

                }
                
            }

        },
    });
    
    
};

fabric.Canvas.prototype.snapToObjects = false;
fabric.Canvas.prototype.snapToGrid = false;
fabric.Canvas.prototype.snapGridSize = [50, 50];

const Snap = (canvas) => {

    let ctx = canvas.getSelectionContext(),
        aligningLineOffset = 1,
        aligningLineMargin = 4,
        aligningLineWidth = 1,
        aligningLineColor = 'rgba(255,0,241,0.5)',
        viewportTransform,
        zoom = 1;

    function drawVerticalLine(x) {

        drawLine(
            x - aligningLineWidth,
            0,
            x - aligningLineWidth,
            canvas.getHeight() / zoom
        );
    }

    function drawHorizontalLine(y) {

        drawLine(
            0,
            y - aligningLineWidth,
            canvas.getWidth() / zoom,
            y - aligningLineWidth
        );

    }

    function drawLine(x1, y1, x2, y2) {

        ctx.save();
        ctx.lineWidth = aligningLineWidth;
        ctx.strokeStyle = aligningLineColor;
        ctx.beginPath();
        if (!canvas.snapToGrid)
            ctx.setLineDash([5, 10]);
        ctx.moveTo(((x1 + viewportTransform[4]) * zoom), ((y1 + viewportTransform[5]) * zoom));
        ctx.lineTo(((x2 + viewportTransform[4]) * zoom), ((y2 + viewportTransform[5]) * zoom));
        ctx.stroke();
        ctx.restore();

    }

    function isInRange(value1, value2) {

        value1 = Math.round(value1);
        value2 = Math.round(value2);
        for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
            if (i === value2) {
                return true;
            }
        }

        return false;
    }

    var verticalLines = [],
        horizontalLines = [];

    canvas.on('mouse:down',  () => {

        viewportTransform = canvas.viewportTransform;
        zoom = canvas.getZoom();

    });

    canvas.on('object:moving', (e) => {

        let activeObject = e.target,
            canvasObjects = canvas.getObjects(),
            activeObjectCenter = activeObject.getCenterPoint(),
            activeObjectLeft = activeObjectCenter.x,
            activeObjectTop = activeObjectCenter.y,
            activeObjectBoundingRect = activeObject.getBoundingRect(),
            activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
            activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
            horizontalInTheRange = false,
            verticalInTheRange = false,
            transform = canvas._currentTransform;

        if (canvas.snapToGrid) ;

        if (!canvas.snapToObjects || canvas.snapToGrid) return;     

        if (!transform) return;

        for (var i = canvasObjects.length; i--;) {

            if (canvasObjects[i] === activeObject) continue;

            var objectCenter = canvasObjects[i].getCenterPoint(),
                objectLeft = objectCenter.x,
                objectTop = objectCenter.y,
                objectBoundingRect = canvasObjects[i].getBoundingRect(),
                objectHeight = objectBoundingRect.height / viewportTransform[3],
                objectWidth = objectBoundingRect.width / viewportTransform[0];

            // snap by the horizontal center line
            if (isInRange(objectLeft, activeObjectLeft)) {
                verticalInTheRange = true;
                verticalLines.push({
                    x: objectLeft,
                    y1: (objectTop < activeObjectTop)
                        ? (objectTop - objectHeight / 2 - aligningLineOffset)
                        : (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop)
                        ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                        : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
            }

            // snap by the left edge
            if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
                verticalInTheRange = true;
                verticalLines.push({
                    x: objectLeft - objectWidth / 2,
                    y1: (objectTop < activeObjectTop)
                        ? (objectTop - objectHeight / 2 - aligningLineOffset)
                        : (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop)
                        ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                        : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
            }

            // snap by the right edge
            if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
                verticalInTheRange = true;
                verticalLines.push({
                    x: objectLeft + objectWidth / 2,
                    y1: (objectTop < activeObjectTop)
                        ? (objectTop - objectHeight / 2 - aligningLineOffset)
                        : (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop)
                        ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                        : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
            }

            // snap by the vertical center line
            if (isInRange(objectTop, activeObjectTop)) {
                horizontalInTheRange = true;
                horizontalLines.push({
                    y: objectTop,
                    x1: (objectLeft < activeObjectLeft)
                        ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                        : (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft)
                        ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                        : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
            }

            // snap by the top edge
            if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
                horizontalInTheRange = true;
                horizontalLines.push({
                    y: objectTop - objectHeight / 2,
                    x1: (objectLeft < activeObjectLeft)
                        ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                        : (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft)
                        ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                        : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
            }

            // snap by the bottom edge
            if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
                horizontalInTheRange = true;
                horizontalLines.push({
                    y: objectTop + objectHeight / 2,
                    x1: (objectLeft < activeObjectLeft)
                        ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                        : (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft)
                        ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                        : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
            }
        }

        if (!horizontalInTheRange) {
            horizontalLines.length = 0;
        }

        if (!verticalInTheRange) {
            verticalLines.length = 0;
        }
    });

    canvas.on('before:render', () => {

        if(canvas.contextTop)
            canvas.clearContext(canvas.contextTop);

    });

    canvas.on('after:render', () => {

        if(canvas.panCanvas) return;

        if (canvas.snapToGrid) {

            viewportTransform = canvas.viewportTransform;
            zoom = canvas.getZoom();

            if (canvas.snapGridSize) {

                const linesX = Math.round((canvas.width / zoom) / canvas.snapGridSize[0]);
                for (let i = 0; i < linesX; ++i) {
                    drawVerticalLine(i * canvas.snapGridSize[0]);
                }

                const linesY = Math.round((canvas.height / zoom) / canvas.snapGridSize[1]);
                for (let i = 0; i < linesY; ++i) {
                    drawHorizontalLine(i * canvas.snapGridSize[1]);
                }

            }

        }
        else {

            for (var i = verticalLines.length; i--;) {
                drawVerticalLine(verticalLines[i].x);
            }
            for (var i = horizontalLines.length; i--;) {
                drawHorizontalLine(horizontalLines[i].y);
            }

            verticalLines.length = horizontalLines.length = 0;

        }

    });

    canvas.on('mouse:up', () => {

        verticalLines.length = horizontalLines.length = 0;
        canvas.renderAll();

    });

};

fabric.Canvas.prototype.enableRuler = false;
fabric.Canvas.prototype.rulerBg = 'rgba(0,0,0, 0.6)';
fabric.Canvas.prototype.rulerTickColor = '#ccc';

const Ruler = (canvas) => {

    canvas.on('after:render', () => {

        if (canvas.viewOptions && canvas.enableRuler) {
            
            const tickSize = 10;
            const majorTickSize = 100;
            const unit = canvas.viewOptions.rulerUnit;
            const rulerPosition = canvas.viewOptions.rulerPosition;
            const pb = canvas.viewOptions.printingBox;
            const zoom = canvas.getZoom();
            const ctx = canvas.getSelectionContext();    
            
            if(!ctx) return;
            
            const viewWidth = canvas.viewOptions.stageWidth;
            const viewHeight = canvas.viewOptions.stageHeight; 

            const _calculateTickInterval = (inputWidth) => {

                const rawInterval = inputWidth / tickSize;
                const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)));
                const residual = rawInterval / magnitude;

                if (residual >= 5) {
                    return 5 * magnitude;
                } else if (residual >= 2) {
                    return 2 * magnitude;
                } else {
                    return magnitude;
                }
            };

            let unitFactor = unit == 'cm' ? 10 : 1;
            let widthRatio = 1;
            let heightRatio = 1;
            let viewOutput;

            if(unit != 'px' 
                && objectHasKeys(pb, ['left','top','width','height']) 
                && objectHasKeys(canvas.viewOptions.output, ['width','height'])
            ) {

                viewOutput = canvas.viewOptions.output;

                //one pixel in mm                
                widthRatio = viewOutput.width / pb.width;                
                heightRatio = viewOutput.height / pb.height; 
                
                
            }
            else {
                unitFactor = 1;
            }

            let rulerXHeight = 20 * zoom,
                rulerYWidth = 20 * zoom,
                rulerXLeft = 0,
                rulerXTop = 0,
                rulerYLeft = canvas.width - rulerYWidth,
                rulerYTop = 0,
                rulerXWidth = viewWidth,
                
                rulerYHeight = viewHeight,
                loopXWidth = viewWidth * widthRatio,
                loopYHeight = viewHeight * heightRatio;

            if(rulerPosition == 'pb' && viewOutput) {
                
                rulerXLeft = pb.left * zoom;
                rulerXTop = (pb.top-rulerXHeight) * zoom;
                rulerXWidth = pb.width * zoom;

                rulerYLeft = (pb.left+pb.width) * zoom;
                rulerYTop = pb.top * zoom;
                rulerYHeight = pb.height * zoom;

                loopXWidth = viewOutput.width;
                loopYHeight = viewOutput.height;

            }

            // Render the ruler on the X axis
            ctx.fillStyle = canvas.rulerBg;
            ctx.fillRect(rulerXLeft, rulerXTop, rulerXWidth, rulerXHeight);
                            
            for (var i = 0; i <= loopXWidth; i += _calculateTickInterval(loopXWidth)) {
                                
                const tickHeight = i % majorTickSize === 0 ? rulerXHeight : rulerXHeight / 3;
                const tickX = ((i * zoom) / widthRatio);

                ctx.fillRect(rulerXLeft+tickX, rulerXTop, 1, tickHeight);
                
                if (i % majorTickSize === 0) {

                    ctx.fillStyle = canvas.rulerTickColor;
                    ctx.font = '10px Arial';   
                    
                    let tickLabelX = rulerXLeft + tickX;
                    const textMetrics = ctx.measureText(Math.round(i / unitFactor));
                    tickLabelX += i == 0 ? 2 : -(textMetrics.width+2);
                    
                    ctx.fillText(Math.round(i / unitFactor) + (i == 0 ? ' '+unit.toUpperCase() : ''), tickLabelX, rulerXTop+rulerXHeight-2);

                }

            }

            // Render the ruler on the Y axis
            ctx.fillStyle = canvas.rulerBg;
            ctx.fillRect(rulerYLeft, rulerYTop, rulerYWidth, rulerYHeight);

            for (var j = 0; j <= loopYHeight; j += _calculateTickInterval(loopYHeight)) {
                
                const tickWidth = (j % majorTickSize === 0 ? rulerYWidth : rulerYWidth / 3);
                const tickY = ((j * zoom) / heightRatio); 
                                    
                ctx.fillRect(rulerYLeft, rulerYTop+tickY, tickWidth, 1);

                if (j % majorTickSize === 0) {

                    ctx.fillStyle = canvas.rulerTickColor;
                    ctx.font = '10px Arial';

                    let tickLabelY = rulerYTop + tickY;
                    tickLabelY += j == 0 ? 12 : -2;
                    
                    ctx.fillText(Math.round(j / unitFactor), rulerYLeft, tickLabelY);
                    
                }

            }

        }

    });

    canvas.on('before:render', () => {

        if(canvas.contextTop)
            canvas.clearContext(canvas.contextTop);

    });

};

fabric$1.Canvas.prototype.viewOptions = {};
fabric$1.Canvas.prototype.elements = [];
fabric$1.Canvas.prototype.currentElement = null;
fabric$1.Canvas.prototype.responsiveScale = 1;
fabric$1.Canvas.prototype.currentBoundingObject = null;
fabric$1.Canvas.prototype.initialElementsLoaded = false;
fabric$1.Canvas.prototype.isCustomized = false;
fabric$1.Canvas.prototype.printingBoxObject = null;
fabric$1.Canvas.prototype._canvasCreated = false;
fabric$1.Canvas.prototype._doHistory = false;
fabric$1.Canvas.prototype.forbiddenTextChars = /<|>/g;

fabric$1.Canvas.prototype.proxyFileServer = "";

fabric$1.Canvas.prototype.initialize = (function (originalFn) {
	return function (...args) {
		originalFn.call(this, ...args);
		this._fpdCanvasInit();
		return this;
	};
})(fabric$1.Canvas.prototype.initialize);

fabric$1.Canvas.prototype._onTouchStart = (function (originalFn) {
	return function (e) {
		const target = this.findTarget(e);

		if (this.allowTouchScrolling && !target && !this.isDrawingMode) {
			return;
		}

		originalFn.call(this, e);
	};
})(fabric$1.Canvas.prototype._onTouchStart);

fabric$1.Canvas.prototype._fpdCanvasInit = function () {
	if (this.containerClass.includes("fpd-hidden-canvas")) return;

	let modifiedType = null;

	this.on({
		"after:render": () => {
			if (!this._canvasCreated) {
				this._onCreated();
			}

			if (
				this.viewOptions &&
				this.viewOptions.highlightEditableObjects &&
				this.viewOptions.highlightEditableObjects.length > 3
			) {
				this.contextContainer.strokeStyle = this.viewOptions.highlightEditableObjects;
				this.forEachObject((obj) => {
					if (
						obj !== this.getActiveObject() &&
						!obj.isMoving &&
						((obj.getType() === "text" && obj.editable) || obj.uploadZone)
					) {
						const bound = obj.getBoundingRect();
						this.contextContainer.setLineDash([5, 15]);
						this.contextContainer.strokeRect(bound.left, bound.top, bound.width, bound.height);
					} else {
						this.contextContainer.setLineDash([]);
					}
				});
			}
		},
		"object:added": ({ target }) => {
			this._bringToppedElementsToFront();
		},
		"object:moving": ({ target }) => {
			modifiedType = "moving";

			/**
			 * Gets fired as soon as an element is selected.
			 *
			 * @event fabric.CanvasView#elementSelect
			 * @param {Event} event
			 * @param {fabric.Object} currentElement - The current selected element.
			 */
			this.fire("elementChange", { type: "moving", element: target });
		},
		"object:rotating": ({ target }) => {
			modifiedType = "rotating";

			this.fire("elementChange", { type: "rotating", element: target });
		},
		"object:scaling": ({ target }) => {
			modifiedType = "scaling";

			this.fire("elementChange", { type: "scaling", element: target });
		},
		"object:modified": ({ target }) => {
			const element = target;

			if (modifiedType !== null) {
				let modifiedProps = {};

				switch (modifiedType) {
					case "moving":
						modifiedProps.left = Number(element.left);
						modifiedProps.top = Number(element.top);
						break;
					case "scaling":
						if (element.getType() === "text" && !element.curved && !element.uniScalingUnlockable) {
							modifiedProps.fontSize = parseInt(element.fontSize);
						} else {
							modifiedProps.scaleX = parseFloat(element.scaleX);
							modifiedProps.scaleY = parseFloat(element.scaleY);
						}
						break;
					case "rotating":
						modifiedProps.angle = element.angle;
						break;
				}

				this.fire("elementModify", { element: element, options: modifiedProps });
			}

			modifiedType = null;
		},
		"selection:created": ({ selected }) => {
			if (selected.length == 1) {
				this._onSelected(selected[0]);
			} else {
				this._onMultiSelected(selected);
			}
		},
		"selection:updated": ({ selected }) => {
			if (selected.length == 1) {
				this._onSelected(selected[0]);
			} else {
				this._onMultiSelected(selected);
			}
		},
		"mouse:down": (opts) => {
			//fix: when editing text via textarea and doing a modification via corner controls
			if (opts.target && opts.target.__corner && typeof opts.target.exitEditing === "function") {
				opts.target.exitEditing();
			}

			if (opts.target == undefined) {
				this.deselectElement();
			}
		},
		elementAdd: () => {
			this.forEachObject((obj) => {
				//render clipping
				if (!obj.clipPath && ((obj.boundingBox && obj.boundingBoxMode === "clipping") || obj.hasUploadZone)) {
					obj._clipElement();
				}
			});
		},
		"text:changed": ({ target }) => {
			this.fire("elementModify", { element: target, options: { text: target.text } });
		},
	});
};

fabric$1.Canvas.prototype._onCreated = function () {
	this._canvasCreated = true;

	ZoomPan(this, this.viewOptions.mobileGesturesBehaviour);
	Snap(this);
	Ruler(this);

	this._renderPrintingBox();
};

fabric$1.Canvas.prototype._onSelected = function (element) {
	//remove crop mask object when exists
	if (element.name !== "crop-mask") {
		const cropMaskObj = this.getObjects().find((obj) => obj.name === "crop-mask");
		if (cropMaskObj) this.remove(cropMaskObj);
	}

	this.deselectElement(false);

	//dont select anything when in dragging mode
	if (this.dragStage) {
		this.deselectElement();
		return false;
	}

	this.currentElement = element;

	/**
	 * Gets fired as soon as an element is selected.
	 *
	 * @event fabric.CanvasView#elementSelect
	 * @param {Event} event
	 * @param {fabric.Object} currentElement - The current selected element.
	 */
	this.fire("elementSelect", { element: element });

	//change cursor to move when element is draggable
	this.hoverCursor = element.draggable ? "move" : "pointer";

	//check for a boundingbox
	if (element.boundingBox && !element.uploadZone) {
		this._renderElementBoundingBox(element);
	}
};

fabric$1.Canvas.prototype._onMultiSelected = function (selectedElements) {
	const activeSelection = this.getActiveObject();

	if (this.viewOptions.multiSelection) {
		activeSelection.set({
			lockScalingX: !Boolean(this.viewOptions.editorMode),
			lockScalingY: !Boolean(this.viewOptions.editorMode),
			lockRotation: !Boolean(this.viewOptions.editorMode),
			hasControls: Boolean(this.viewOptions.editorMode),
			borderDashArray: [8, 8],
			cornerSize: 24,
			transparentCorners: false,
			borderColor: this.viewOptions.multiSelectionColor,
			borderScaleFactor: 3,
		});

		selectedElements.forEach((obj) => {
			if ((!obj.draggable && !this.viewOptions.editorMode) || !obj.evented) {
				activeSelection.removeWithUpdate(obj);
			}
		});

		activeSelection.setControlsVisibility({
			tr: false,
			tl: false,
			mtr: false,
		});

		/**
		 * Gets fired as soon as mutiple elements are selected.
		 *
		 * @event fabric.CanvasView#multiSelect
		 * @param {Event} event
		 * @param {fabric.Object} activeSelection - The current selected object.
		 */
		this.fire("multiSelect", { activeSelection: activeSelection });
	}
};

fabric$1.Canvas.prototype._renderElementBoundingBox = function (element) {
	if (this.currentBoundingObject) {
		this.remove(this.currentBoundingObject);
		this.currentBoundingObject = null;
	}

	const _bbCreated = (bbObj = null) => {
		if (bbObj) {
			this.add(bbObj);
			bbObj.bringToFront();

			/**
			 * Gets fired when bounding box is toggling.
			 *
			 * @event fabric.CanvasView#boundingBoxToggle
			 * @param {Event} event
			 * @param {fabric.Object} currentBoundingObject - The current bounding box object.
			 * @param {Boolean} state
			 */
			this.fire("boundingBoxToggle", {
				currentBoundingObject: this.currentBoundingObject,
				state: true,
			});
		}
	};

	if (element && (!element._printingBox || !this.viewOptions.printingBox.visibility)) {
		var bbCoords = element.getBoundingBoxCoords();

		if (bbCoords && element.boundingBoxMode != "none") {
			let boundingBoxProps = {
				stroke: this.viewOptions.boundingBoxColor,
				strokeWidth: 1,
				strokeLineCap: "square",
				strokeDashArray: [10, 10],
				fill: false,
				selectable: false,
				evented: false,
				name: "bounding-box",
				excludeFromExport: true,
				_ignore: true,
				rx: bbCoords.borderRadius,
				ry: bbCoords.borderRadius,
			};

			boundingBoxProps = deepMerge(boundingBoxProps, this.viewOptions.boundingBoxProps);

			if (!element.clipPath || element.clipPath.type == "rect") {
				boundingBoxProps = deepMerge(boundingBoxProps, {
					left: bbCoords.left,
					top: bbCoords.top,
					width: bbCoords.width,
					height: bbCoords.height,
					angle: bbCoords.angle || 0,
					originX: "left",
					originY: "top",
				});

				this.currentBoundingObject = new fabric$1.Rect(boundingBoxProps);
				_bbCreated(this.currentBoundingObject);
			} else if (element.clipPath) {
				element.clipPath.clone((clonedObj) => {
					boundingBoxProps = deepMerge(boundingBoxProps, {
						fill: "transparent",
					});

					clonedObj.set(boundingBoxProps);

					if (clonedObj.type == "group") {
						//transparent background for objects in group
						clonedObj.forEachObject((obj) => {
							obj.set("fill", "transparent");
						});
					}

					this.currentBoundingObject = clonedObj;
					_bbCreated(this.currentBoundingObject);
					element._checkContainment();
				});
			}
		}

		element._checkContainment();
	}
};

fabric$1.Canvas.prototype._renderPrintingBox = function () {
	if (this.printingBoxObject) {
		this.remove(this.printingBoxObject);
		this.printingBoxObject = null;
	}

	if (objectHasKeys(this.viewOptions.printingBox, ["left", "top", "width", "height"])) {
		const printingBox = new fabric$1.Rect({
			left: 100,
			top: 100,
			width: this.viewOptions.printingBox.width,
			height: this.viewOptions.printingBox.height,
			stroke: this.viewOptions.printingBox.visibility || this.viewOptions.editorMode ? "#db2828" : "transparent",
			strokeWidth: 1,
			strokeLineCap: "square",
			fill: false,
			originX: "left",
			originY: "top",
			name: "printing-box",
			excludeFromExport: true,
			_ignore: true,
		});

		this.printingBoxObject = new fabric$1.Group([printingBox], {
			left: this.viewOptions.printingBox.left,
			top: this.viewOptions.printingBox.top,
			evented: false,
			resizable: true,
			removable: false,
			copyable: false,
			rotatable: false,
			uniformScaling: false,
			lockRotation: true,
			borderColor: "transparent",
			transparentCorners: true,
			cornerColor: this.viewOptions.selectedColor,
			cornerIconColor: this.viewOptions.cornerIconColor,
			cornerSize: 24,
			originX: "left",
			originY: "top",
			name: "printing-boxes",
			excludeFromExport: true,
			selectable: false,
			_ignore: true,
		});

		this.viewOptions?.output?.bleed;

		this.add(this.printingBoxObject);
		this.printingBoxObject.setCoords();
		this.renderAll();
	}
};

fabric$1.Canvas.prototype._bringToppedElementsToFront = function () {
	let objects = this.getObjects(),
		bringToFrontObjs = [];

	objects.forEach((object) => {
		if (object.topped || (object.uploadZone && this.viewOptions.uploadZonesTopped)) {
			bringToFrontObjs.push(object);
		}
	});

	bringToFrontObjs.forEach((object) => {
		object.bringToFront();
	});

	if (this.currentBoundingObject) {
		this.currentBoundingObject.bringToFront();
	}

	if (this.printingBoxObject) {
		this.printingBoxObject.bringToFront();
	}
};

/**
 * Adds a set of elements into the view.
 *
 * @param {Array} elements An array containing elements.
 * @param {Function} [callback] A function that will be called when all elements have beed added.
 * @method addElement
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.addElements = function (elements, callback) {
	let countElements = -1;

	//iterative function when element is added, add next one
	const _addElement = () => {
		countElements++;

		//add all elements of a view
		if (countElements < elements.length) {
			const element = elements[countElements];
			if (!_removeNotValidElementObj(element)) {
				this.addElement(element.type, element.source, element.title, element.parameters);
			}
		}
		//all initial elements are added, view is created
		else {
			this.off("elementAdd", _addElement);
			if (typeof callback !== "undefined") {
				callback.call(callback, this);
			}

			this.initialElementsLoaded = true;
		}
	};

	const _removeNotValidElementObj = (element) => {
		if (element.type === undefined || element.source === undefined || element.title === undefined) {
			const removeInd = elements.indexOf(element);
			if (removeInd !== -1) {
				console.log(
					"Element index " + removeInd + " from elements removed, its not a valid element object!",
					"info"
				);

				_addElement();
				return true;
			}
		} else {
			this.elements.push(element);
		}

		return false;
	};

	let element = elements[0];
	//check if view contains at least one element
	if (element) {
		//listen when element is added
		this.on("elementAdd", _addElement);

		//add first element of view
		_addElement();
	}
	//no elements in view, view is created without elements
	else {
		if (typeof callback !== "undefined") {
			callback.call(callback, this);
		}

		this.initialElementsLoaded = true;
	}
};

/**
 * Adds a new element to the view.
 *
 * @method addElement
 * @param {string} type The type of an element you would like to add, 'image' or 'text'.
 * @param {string} source For image the URL to the image and for text elements the default text.
 * @param {string} title Only required for image elements.
 * @param {object} [parameters={}] An object with the parameters, you would like to apply on the element.
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.addElement = function (type, source, title, params = {}) {
	if (type === undefined || source === undefined || title === undefined) return;

	/**
	 * Gets fired as soon as an element will be added (before its added to canvas).
	 *
	 * @event fabric.CanvasView#beforeElementAdd
	 * @param {Event} event
	 * @param {String} type - The element type.
	 * @param {String} source - URL for image, text string for text element.
	 * @param {String} title - The title for the element.
	 * @param {Object} params - The default properties.
	 */
	this.fire("beforeElementAdd", {
		type: type,
		source: source,
		title: title,
		params: params,
	});

	if (type === "text") {
		//strip HTML tags
		source = source.replace(/(<([^>]+)>)/gi, "");
		source = source.replace(this.forbiddenTextChars, "");
		title = title.replace(/(<([^>]+)>)/gi, "");
	}

	if (params.colorLinkGroup) {
		let currentElems = this.getElements();
		if (currentElems) {
			//get first element with the same color link group and copy the fill of that element to the new element
			const targetElem = currentElems.find((elem) => elem["colorLinkGroup"] === params.colorLinkGroup);
			if (targetElem && targetElem.fill) {
				params.fill = targetElem.fill;
			}
		}
	}

	//check that fill is a string
	if (typeof params.fill !== "string" && !Array.isArray(params.fill)) {
		params.fill = false;
	}

	//merge default options
	let defaultsParams;
	if (type.toLowerCase().includes("text")) {
		defaultsParams = deepMerge(this.viewOptions.elementParameters, this.viewOptions.textParameters);
	} else {
		defaultsParams = deepMerge(this.viewOptions.elementParameters, this.viewOptions.imageParameters);
	}

	params = deepMerge(defaultsParams, params);

	//store current color and convert colors in string to array
	if (params.colors && typeof params.colors == "string") {
		//check if string contains hex color values
		if (params.colors.indexOf("#") == 0) {
			//convert string into array
			var colors = params.colors.replace(/\s+/g, "").split(",");
			params.colors = colors;
		}
	}

	params._isInitial = !this.initialElementsLoaded;

	if (type.toLowerCase().includes("text")) {
		var defaultTextColor = params.colors[0] ? params.colors[0] : "#000000";
		params.fill = params.fill ? params.fill : defaultTextColor;
	}

	let fabricParams = {
		source: source,
		title: title,
		id: String(new Date().getTime()),
	};

	if (!this.viewOptions.editorMode) {
		fabricParams = deepMerge(fabricParams, {
			selectable: false,
			lockRotation: true,
			hasRotatingPoint: false,
			lockScalingX: true,
			lockScalingY: true,
			lockMovementX: true,
			lockMovementY: true,
			hasControls: false,
			evented: false,
			lockScalingFlip: true,
		});
	} else {
		params.__editorMode = this.viewOptions.editorMode;
		fabricParams.selectable = fabricParams.evented = true;
	}

	fabricParams = deepMerge(params, fabricParams);

	if (fabricParams.isCustom) {
		//engraving mode
		if (objectGet(this.viewOptions, "industry.type") == "engraving") {
			fabricParams.opacity = objectGet(this.viewOptions, "industry.opts.opacity", 0.5);
		}

		this.isCustomized = true;
	}

	let elemHasBB = false;
	if (typeof fabricParams.boundingBox == "string" && fabricParams.boundingBox.length > 0) {
		elemHasBB = true;
	} else if (
		typeof fabricParams.boundingBox == "object" &&
		objectHasKeys(fabricParams.boundingBox, ["width", "height"]) &&
		fabricParams.boundingBox.width > 0 &&
		fabricParams.boundingBox.height > 0
	) {
		elemHasBB = true;
	}

	if (
		this.viewOptions.usePrintingBoxAsBounding &&
		!elemHasBB &&
		objectHasKeys(this.viewOptions.printingBox, ["left", "top", "width", "height"])
	) {
		fabricParams.boundingBox = {
			x: this.viewOptions.printingBox.left - 1,
			y: this.viewOptions.printingBox.top - 1,
			width: this.viewOptions.printingBox.width + 1,
			height: this.viewOptions.printingBox.height + 1,
		};

		fabricParams._printingBox = fabricParams.boundingBox;
	}

	if (type == "image" || type == "path" || type == "group") {
		//remove url parameters
		if (source.search("<svg ") === -1) {
			var splitURLParams = source.split("?");
			source = fabricParams.source = splitURLParams[0];
		}

		const _fabricImageLoaded = (fabricImage, params, vectorImage, originParams = {}) => {
			if (fabricImage) {
				params.originParams = deepMerge(params, originParams);

				fabricImage.setOptions(params);
				this.add(fabricImage);
				this.setElementOptions(params, fabricImage);

				fabricImage.originParams.angle = fabricImage.angle;
				fabricImage.originParams.z = fabricImage.getZIndex();
			} else {
				this.fire("imageFail", { url: params.source });
			}

			/**
			 * Gets fired as soon as an element has beed added.
			 *
			 * @event fabric.Canvas#elementAdd
			 * @param {Event} event
			 * @param {fabric.Object} object - The fabric object.
			 */
			this.fire("elementAdd", { element: fabricImage });
		};

		if (source === undefined || source.length === 0) {
			console.log("No image source set for: " + title);
			return;
		}

		//add SVG from string
		if (source.search("<svg") !== -1) {
			fabric$1.loadSVGFromString(source, (objects, options) => {
				var svgGroup = fabric$1.util.groupSVGElements(objects, options);

				//replace fill prop with svgFill
				if (fabricParams.fill) {
					if (!fabricParams.svgFill) {
						fabricParams.svgFill = fabricParams.fill;
					}

					delete fabricParams["fill"];
				}
				//if no default colors are set, use the initial path colors
				else if (!fabricParams.fill && !fabricParams.svgFill) {
					if (objects) {
						params.colors = [];
						for (var i = 0; i < objects.length; ++i) {
							var color =
								objects[i].fill.length > 0 ? tinycolor(objects[i].fill).toHexString() : "transparent";
							params.colors.push(color);
						}
						params.svgFill = params.colors;
					}

					fabricParams.svgFill = params.svgFill;
				}

				delete fabricParams["boundingBox"];
				delete fabricParams["originParams"];
				delete fabricParams["colors"];
				delete fabricParams["svgFill"];
				delete fabricParams["width"];
				delete fabricParams["height"];
				delete fabricParams["originX"];
				delete fabricParams["originY"];
				delete fabricParams["objectCaching"];

				_fabricImageLoaded(svgGroup, fabricParams, true, { svgFill: params.svgFill });
			});
		}
		//load svg from url
		else if (source.split(".").includes("svg")) {
			let timeStamp = Date.now().toString(),
				url = isUrl(source) ? new URL(this.proxyFileServer + source) : source;

			//add timestamp when option enabled or is cloudfront url
			if ((source.includes(".cloudfront.net/") || this.viewOptions.imageLoadTimestamp) && !this.proxyFileServer) {
				url.searchParams.append("t", timeStamp);
			}

			if (typeof url === "object") {
				url = url.toString();
			}

			fabric$1.loadSVGFromURL(url, (objects, options) => {
				//if objects is null, svg is loaded from external server with cors disabled
				var svgGroup = objects ? fabric$1.util.groupSVGElements(objects, options) : null;

				//replace fill prop with svgFill
				if (fabricParams.fill) {
					if (!fabricParams.svgFill) {
						fabricParams.svgFill = fabricParams.fill;
					}

					delete fabricParams["fill"];
				}
				//if no default colors are set, use the initial path colors
				else if (!fabricParams.fill && !fabricParams.svgFill) {
					if (objects) {
						params.colors = [];
						for (var i = 0; i < objects.length; ++i) {
							var color =
								objects[i].fill.length > 0 ? tinycolor(objects[i].fill).toHexString() : "transparent";
							params.colors.push(color);
						}
						params.svgFill = params.colors;
					}

					fabricParams.svgFill = params.svgFill;
				}

				_fabricImageLoaded(svgGroup, fabricParams, true, { svgFill: params.svgFill });
			});
		}
		//load png/jpeg from url
		else {
			let timeStamp = Date.now().toString(),
				url;

			if (!source.includes("data:image/")) {
				//do not add timestamp to data URI

				url = isUrl(source) ? new URL(this.proxyFileServer + source) : source;

				if (this.viewOptions.imageLoadTimestamp && !this.proxyFileServer) {
					url.searchParams.append("t", timeStamp);
				}

				if (typeof url === "object") {
					url = url.toString();
				}
			} else {
				url = source;
			}

			new fabric$1.Image.fromURL(
				url,
				function (fabricImg) {
					//if src is empty, image is loaded from external server with cors disabled
					fabricImg = fabricImg.getSrc() === "" ? null : fabricImg;
					_fabricImageLoaded(fabricImg, fabricParams);
				},
				{ crossOrigin: "anonymous" }
			);
		}
	} else if (type.toLowerCase().includes("text")) {
		source = source.replace(/\\n/g, "\n");
		params.text = params.text ? params.text : source;
		fabricParams._initialText = params.hasOwnProperty("_initialText") ? params._initialText : params.text;

		fabricParams.originParams = { ...params };

		//ensure origin text is always the initial text, even when action:save
		if (params.originParams && params.originParams.text) {
			fabricParams.originParams.text = fabricParams._initialText;
		}

		//make text curved
		var fabricText;
		if (params.curved) {
			fabricText = new fabric$1.CurvedText(source.replace(/(?:\r\n|\r|\n)/g, ""), fabricParams);
		}
		//make text box
		else if (params.textBox) {
			fabricText = new fabric$1.Textbox(source, fabricParams);
		}
		//neon-text
		else if (params.neonText) {
			fabricText = new fabric$1.NeonText(source, fabricParams);
		}
		//i-text
		else {
			fabricText = new fabric$1.IText(source, fabricParams);
		}

		if (fabricParams.textPlaceholder || fabricParams.numberPlaceholder) {
			this[fabricParams.textPlaceholder ? "textPlaceholder" : "numberPlaceholder"] = fabricText;
		}

		this.add(fabricText);
		this.setElementOptions(fabricParams, fabricText);

		fabricText.originParams = deepMerge(fabricText.toJSON(), fabricText.originParams);
		fabricText.originParams.z = fabricText.getZIndex();

		this.fire("elementAdd", { element: fabricText });
	}
};

/**
 * Deselects the current selected element.
 *
 * @method deselectElement
 * @param {Boolean} discardActiveObject Discards currently active object and fire events
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.deselectElement = function (discardActiveObject = true) {
	if (this.currentBoundingObject) {
		this.remove(this.currentBoundingObject);
		this.fire("boudingBoxToggle", {
			boundingBox: this.currentBoundingObject,
			state: false,
		});

		this.currentBoundingObject = null;
	}

	if (discardActiveObject) {
		this.discardActiveObject();
	}

	this.currentElement = null;

	this.fire("elementSelect", { element: null });
};

/**
 * Resets the canvas size considering the available space on the device.
 *
 * @method resetSize
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.resetSize = function () {
	if (!this.wrapperEl || !this.wrapperEl.parentNode) return;

	const viewStage = this.wrapperEl;
	const viewStageWidth = viewStage.parentNode.clientWidth;
	let allowedHeight = window.innerHeight * parseFloat(this.viewOptions.maxCanvasHeight || 1);
	let canvasHeight = this.viewOptions.stageHeight;
	let fixedHeight = null;

	this.responsiveScale =
		viewStageWidth < this.viewOptions.stageWidth ? viewStageWidth / this.viewOptions.stageWidth : 1;

	let potentialHeight = canvasHeight * this.responsiveScale;

	//set a fixed height
	if (this.viewOptions.canvasHeight && this.viewOptions.canvasHeight !== "auto") {
		if (this.viewOptions.canvasHeight.includes("px")) {
			fixedHeight = parseInt(this.viewOptions.canvasHeight);
			allowedHeight = fixedHeight;
		}
	}

	//adjust to height if necessary
	if (potentialHeight > allowedHeight) {
		this.responsiveScale = allowedHeight / canvasHeight;
	}

	this.responsiveScale = parseFloat(Number(this.responsiveScale.toFixed(7)));
	this.responsiveScale = Math.min(this.responsiveScale, 1);

	if (!this.viewOptions.responsive) {
		this.responsiveScale = 1;
	}

	this.setDimensions({
		width: this.viewOptions.stageWidth * this.responsiveScale,
		height: this.viewOptions.stageHeight * this.responsiveScale,
	})
		.setZoom(this.responsiveScale)
		.calcOffset()
		.renderAll();

	this.fire("sizeUpdate", {
		responsiveScale: this.responsiveScale,
		canvasHeight: fixedHeight ? fixedHeight : canvasHeight * this.responsiveScale || canvasHeight,
	});

	return this.responsiveScale;
};

/**
 * Sets the zoom of the stage. 1 is equal to no zoom.
 *
 * @method setResZoom
 * @param {number} value The zoom value.
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.setResZoom = function (value) {
	this.deselectElement();

	var point = new fabric$1.Point(this.getWidth() * 0.5, this.getHeight() * 0.5);

	this.zoomToPoint(point, value * this.responsiveScale);

	if (value == 1) {
		this.resetZoom();
	}
};

/**
 * Resets the the zoom.
 *
 * @method resetZoom
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.resetZoom = function () {
	this.deselectElement();

	this.zoomToPoint(new fabric$1.Point(0, 0), this.responsiveScale);
	this.absolutePan(new fabric$1.Point(0, 0));
};

/**
 * Returns an array with fabricjs objects.
 *
 * @method getElements
 * @returns {Array} An array with fabricjs objects.
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.getElements = function (elementType = "all", deselectElement = true) {
	if (deselectElement) {
		this.deselectElement();
	}

	let allElements = this.getObjects();

	//remove ignore objects
	allElements = allElements.filter((obj) => {
		return !obj._ignore;
	});

	if (elementType === "text") {
		return allElements.filter((elem) => {
			return elem.getType() === "text";
		});
	} else if (elementType === "image") {
		return allElements.filter((elem) => {
			return elem.getType() === "image";
		});
	}

	return allElements;
};

/**
 * Returns an fabric object by title.
 *
 * @method getElementsJSON
 * @param {string} title The title of an element.
 * @returns {Object} FabricJS Object.
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.getElementsJSON = function (onlyEditableElements = false, deselectElement = true) {
	let viewElements = this.getElements("all", deselectElement),
		jsonViewElements = [];

	viewElements.forEach((element) => {
		if (element.title !== undefined && element.source !== undefined) {
			var jsonItem = {
				title: element.title,
				source: element.source,
				parameters: element.getElementJSON(),
				type: element.getType(),
			};

			const printingBox = this.viewOptions && this.viewOptions.printingBox ? this.viewOptions.printingBox : null;
			if (printingBox && printingBox.hasOwnProperty("left") && printingBox.hasOwnProperty("top")) {
				let pointLeftTop = element.getPointByOrigin("left", "top");

				jsonItem.printingBoxCoords = {
					left: pointLeftTop.x - printingBox.left,
					top: pointLeftTop.y - printingBox.top,
				};
			}

			if (onlyEditableElements) {
				if (element.isEditable) jsonViewElements.push(jsonItem);
			} else {
				jsonViewElements.push(jsonItem);
			}
		}
	});

	return jsonViewElements;
};

/**
 * Returns an fabric object by title.
 *
 * @method getElementByTitle
 * @param {string} title The title of an element.
 * @returns {Object} FabricJS Object.
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.getElementByTitle = function (title) {
	const objects = this.getObjects();

	for (var i = 0; i < objects.length; ++i) {
		if (objects[i].title === title) {
			return objects[i];
		}
	}
};

/**
 * Returns an fabric object by ID.
 *
 * @method getElementByID
 * @param {String} id The ID of an element.
 * @returns {Object} FabricJS Object.
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.getElementByID = function (id) {
	const objects = this.getObjects();

	for (var i = 0; i < objects.length; ++i) {
		if (objects[i].id == id) {
			return objects[i];
		}
	}

	return false;
};

/**
 * Removes the canvas and resets all relevant view properties.
 *
 * @method reset
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.reset = function (removeCanvas = true) {
	this.clear();

	if (removeCanvas) {
		this.wrapperEl.remove();
	}

	this.fire("clear");
};

/**
 * Removes an element using the fabric object or the title of an element.
 *
 * @method removeElement
 * @param {object|string} element Needs to be a fabric object or the title of an element.
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.removeElement = function (element) {
	if (typeof element === "string") {
		element = this.getElementByTitle(element);
	}

	this.deselectElement();

	if (element.toggleUploadZone) element.toggleUploadZone();

	this.remove(element);

	/**
	 * Gets fired as soon as an element has been removed.
	 *
	 * @event fabric.Canvas#elementRemove
	 * @param {Event} event
	 * @param {fabric.Object} element - The fabric object that has been removed.
	 * @extends fabric.Canvas
	 */
	this.fire("elementRemove", { element: element });
};

/**
 * Gets an elment by replace property.
 *
 * @method getElementByReplace
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.getElementByReplace = function (replaceValue) {
	const objects = this.getObjects();

	for (var i = 0; i < objects.length; ++i) {
		const object = objects[i];
		if (object.replace === replaceValue) {
			return object;
		}
	}

	return null;
};

/**
 * Sets the parameters for a specified element.
 *
 * @method setElementOptions
 * @param {object} parameters An object with the parameters that should be applied to the element.
 * @param {fabric.Object | string} [element] A fabric object or the title of an element. If no element is set, the parameters will be applied to the current selected element.
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.setElementOptions = function (parameters, element) {
	element = typeof element === "undefined" ? this.getActiveObject() : element;

	if (!element || parameters === undefined) return false;

	//if element is string, get by title
	if (typeof element == "string") {
		element = this.getElementByTitle(element);
	}

	const elemType = element.getType();

	if (parameters.scale !== undefined) {
		parameters.scaleX = parameters.scaleY = Number(parameters.scale);
	}

	//scale image into bounding box (cover or fit)
	if (
		elemType == "image" &&
		!element._isInitial &&
		!element._optionsSet &&
		!element._addToUZ &&
		element.scaleX === 1
	) {
		//only scale to bb when no scale value is set
		let scale = null;
		if (!isZero(element.resizeToW) || !isZero(element.resizeToH)) {
			let scaleToWidth = element.resizeToW,
				scaleToHeight = element.resizeToH;

			scaleToWidth = isNaN(scaleToWidth)
				? (parseFloat(scaleToWidth) / 100) * this.viewOptions.stageWidth
				: parseInt(scaleToWidth);
			scaleToHeight = isNaN(scaleToHeight)
				? (parseFloat(scaleToHeight) / 100) * this.viewOptions.stageHeight
				: parseInt(scaleToHeight);

			scale = getScaleByDimesions(element.width, element.height, scaleToWidth, scaleToHeight, element.scaleMode);
		} else if (element.boundingBox) {
			const bb = element.getBoundingBoxCoords();
			scale = getScaleByDimesions(element.width, element.height, bb.width, bb.height, element.scaleMode);
		} else if (this.viewOptions.fitImagesInCanvas && element.isCustom) {
			const iconTolerance = element.cornerSize * 3;

			if (
				element.width * element.scaleX + iconTolerance > this.viewOptions.stageWidth ||
				element.height * element.scaleY + iconTolerance > this.viewOptions.stageHeight
			) {
				scale = getScaleByDimesions(
					element.width,
					element.height,
					this.viewOptions.stageWidth - iconTolerance,
					this.viewOptions.stageHeight - iconTolerance
				);
			}
		}

		if (scale !== null) {
			parameters = deepMerge(parameters, { scaleX: scale, scaleY: scale });
		}
	}

	//adds the element into a upload zone
	if (Boolean(element._addToUZ)) {
		parameters.z = -1;
		let uploadZoneObj = this.getElementByTitle(element._addToUZ),
			scale = 1;

		if (element.getType() == "image") {
			scale = getScaleByDimesions(
				element.width,
				element.height,
				uploadZoneObj.width * uploadZoneObj.scaleX,
				uploadZoneObj.height * uploadZoneObj.scaleY,
				uploadZoneObj.scaleMode
			);
		}

		parameters = deepMerge(parameters, {
			boundingBox: element._addToUZ,
			boundingBoxMode: "clipping",
			scaleX: scale,
			scaleY: scale,
			autoCenter: true,
			removable: true,
			zChangeable: false,
			autoSelect: false,
			copyable: false,
			hasUploadZone: true,
			z: this.getElementByTitle(element._addToUZ).getZIndex(),
			rotatable: uploadZoneObj.rotatable,
			draggable: uploadZoneObj.draggable,
			resizable: uploadZoneObj.resizable,
			price: uploadZoneObj.price ? uploadZoneObj.price : parameters.price,
			replace: element._addToUZ,
			lockUniScaling: uploadZoneObj.lockUniScaling,
			uniScalingUnlockable: uploadZoneObj.uniScalingUnlockable,
			advancedEditing: uploadZoneObj.advancedEditing,
			originX: uploadZoneObj.originX,
			originY: uploadZoneObj.originY,
			angle: uploadZoneObj.angle,
		});

		//set some origin params that are needed when resetting element in UZ
		parameters.originParams = deepMerge(parameters.originParams, {
			boundingBox: parameters.boundingBox,
			replace: parameters.replace,
			rotatable: parameters.rotatable,
			draggable: parameters.draggable,
			resizable: parameters.resizable,
			lockUniScaling: parameters.lockUniScaling,
			uniScalingUnlockable: parameters.uniScalingUnlockable,
			price: parameters.price,
			scaleX: parameters.scaleX,
			scaleY: parameters.scaleY,
			hasUploadZone: true,
			autoCenter: true,
			originX: parameters.originX,
			originY: parameters.originY,
			angle: parameters.angle,
		});

		delete parameters[""];
		delete element["_addToUZ"];
	}

	//if topped, z-index can not be changed
	if (parameters.topped) {
		parameters.zChangeable = false;
	}

	//new element added
	if (element.checkEditable(parameters)) {
		parameters.isEditable = parameters.evented = parameters.selectable = true;
	}

	//upload zones have no controls
	if (!parameters.uploadZone || this.viewOptions.editorMode) {
		if (parameters.draggable) {
			parameters.lockMovementX = parameters.lockMovementY = false;
		}

		if (parameters.rotatable) {
			parameters.lockRotation = false;
			parameters.hasRotatingPoint = true;
		}

		if (parameters.resizable) {
			parameters.lockScalingX = parameters.lockScalingY = false;
		}

		if (parameters.resizable || parameters.rotatable || parameters.removable) {
			parameters.hasControls = true;
		}
	}

	if (parameters.uploadZone) {
		if (!this.viewOptions.editorMode) {
			if (parameters.uploadZoneMovable) {
				parameters.lockMovementX = parameters.lockMovementY = false;
			}

			if (parameters.uploadZoneRemovable) {
				parameters.removable = true;
				parameters.copyable = false;
				parameters.hasControls = true;
			}
		}

		parameters.borderColor = "transparent";
		parameters.excludeFromExport = true;
	}

	if (parameters.fixed) {
		if (isEmpty(parameters.replace)) {
			parameters.replace = element.title;
		}
	}

	if (!this.viewOptions.editorMode && parameters.replace && parameters.replace != "") {
		let replacedElement = this.getElementByReplace(parameters.replace);

		//element with replace in view found and replaced element is not the new element
		if (replacedElement !== null && replacedElement !== element) {
			parameters.z = replacedElement.getZIndex();
			parameters.left = element.originParams.left = replacedElement.left;
			parameters.top = element.originParams.top = replacedElement.top;
			parameters.autoCenter = false;

			if (this.viewOptions.applySizeWhenReplacing) {
				const scale = replacedElement.getScaledWidth() / element.getScaledWidth();

				parameters.scaleX = element.originParams.scaleX = scale;
				parameters.scaleY = element.originParams.scaleY = scale;
			}

			if (this.viewOptions.applyFillWhenReplacing && !element._isQrCode) {
				parameters.fill = parameters.svgFill = replacedElement.fill;
			}

			this.removeElement(replacedElement);
		}
	}

	if (elemType === "text") {
		//needs to before setOptions
		if (typeof parameters.text === "string") {
			let text = parameters.text;
			text = text.replace(this.forbiddenTextChars, "");

			if (element.maxLength != 0 && text.length > element.maxLength) {
				text = text.substr(0, element.maxLength);
				element.set("text", text);
			}

			//check lines length
			if (element.maxLines != 0) {
				if (element.maxLines != 0 && text.split("\n").length > element.maxLines) {
					let textLines = text.split("\n").slice(0, element.maxLines);
					text = textLines.join("\n");
				}
			}

			if (element.textTransform === "uppercase") {
				text = text.toUpperCase();
			} else if (element.textTransform === "lowercase") {
				text = text.toLowerCase();
			}

			parameters.text = text;
		}

		if (parameters.hasOwnProperty("textDecoration")) {
			parameters.underline = parameters.textDecoration === "underline";
		}

		if (parameters.letterSpacing !== undefined) {
			parameters.charSpacing = parameters.letterSpacing * 100;
		}

		if (parameters.fontSize && parameters.fontSize < element.minFontSize) {
			parameters.fontSize = element.minFontSize;
		} else if (parameters.fontSize && parameters.fontSize > element.maxFontSize) {
			parameters.fontSize = element.maxFontSize;
		}

		if (parameters.textTransform) {
			let text = element.text;
			if (parameters.textTransform === "uppercase") {
				text = text.toUpperCase();
			} else if (parameters.textTransform === "lowercase") {
				text = text.toLowerCase();
			}

			parameters.text = text;
		}
	}

	if (
		parameters.hasOwnProperty("shadowColor") ||
		parameters.hasOwnProperty("shadowBlur") ||
		parameters.hasOwnProperty("shadowOffsetX") ||
		(parameters.hasOwnProperty("shadowOffsetY") && !element.neonText)
	) {
		if (parameters.shadowColor === null) {
			element.set("shadow", null);
		} else {
			let currentShadow = {};
			if (element.shadow) {
				currentShadow = element.shadow.toObject();
			}

			let shadowObj = {
				color: parameters.hasOwnProperty("shadowColor") ? parameters.shadowColor : currentShadow.color,
				blur: parameters.hasOwnProperty("shadowBlur") ? parameters.shadowBlur : currentShadow.blur,
				offsetX: parameters.hasOwnProperty("shadowOffsetX") ? parameters.shadowOffsetX : currentShadow.offsetX,
				offsetY: parameters.hasOwnProperty("shadowOffsetY") ? parameters.shadowOffsetY : currentShadow.offsetY,
			};

			element.set("shadow", shadowObj);
		}
	}

	delete parameters["paths"]; //no paths in parameters
	element.setOptions(parameters);

	if ((parameters.fontSize || parameters.fontFamily || parameters.letterSpacing) && element.updateTextPosition)
		element.updateTextPosition();

	if (element.type == "i-text" && element.widthFontSize && element.text.length > 0) {
		let resizedFontSize;
		if (element.width > element.widthFontSize) {
			resizedFontSize = element.fontSize * (element.widthFontSize / (element.width + 1)); //decrease font size
		} else {
			resizedFontSize = element.fontSize * (element.widthFontSize / (element.width - 1)); //increase font size
		}

		if (resizedFontSize < element.minFontSize) {
			resizedFontSize = element.minFontSize;
		} else if (resizedFontSize > element.maxFontSize) {
			resizedFontSize = element.maxFontSize;
		}

		resizedFontSize = parseInt(resizedFontSize);
		element.set("fontSize", resizedFontSize);
	}

	if (element.updateTextPosition) element.updateTextPosition();

	if (parameters.autoCenter) element.centerElement();

	if (parameters.hasOwnProperty("lockUniScaling")) element._elementControls();

	//set filter
	if (parameters.filter) {
		const fabricFilter = getFilter(parameters.filter);

		if (fabricFilter && element.applyFilters) {
			element.filters = [fabricFilter];
			element.applyFilters();
		} else if (element.applyFilters) {
			element.filters = [];
			element.applyFilters();
		}
	}

	//change element color
	if (parameters.fill !== undefined || parameters.svgFill !== undefined) {
		const fill = parameters.svgFill !== undefined ? parameters.svgFill : parameters.fill;

		element.changeColor(fill);
		element.pattern = undefined;
	}

	//set pattern
	if (parameters.pattern !== undefined) {
		element.setPattern(parameters.pattern);
	}

	//set z position, check if element has canvas prop, otherwise its not added into canvas
	if (element.canvas && parameters.z >= 0) {
		element.moveTo(parameters.z);
		this._bringToppedElementsToFront();
	}

	if (parameters.hasOwnProperty("curved") && element.setTextPath) {
		if (parameters.curved) {
			if (element.type == "textbox") {
				let textboxProps = element.getElementJSON();
				delete textboxProps["width"];
				this.addElement("text", textboxProps.text, element.title, textboxProps);

				this.removeElement(element);
				return;
			}

			element.setTextPath();

			if (element == this.getActiveObject() && element.path) {
				element.path.visible = true;
			}

			//replace new lines in curved text
			element.textAlign = "left";
			element.set("text", element.text.replace(/[\r\n]+/g, ""));
			element.updateTextPosition();
		} else {
			element.set("path", null);
		}
	}

	if (parameters.hasOwnProperty("curveRadius") && element.setTextPath) {
		element.setTextPath();

		if (element == this.getActiveObject() && element.path) {
			element.path.visible = true;
		}
	}

	if (element.uploadZone) {
		element.evented = element.opacity !== 0;
	} else if (element.isEditable && !this.viewOptions.editorMode) {
		element.evented = !parameters.locked;
	}

	if (element.textPlaceholder || element.numberPlaceholder) {
		element.removable = false;
	}

	//check if a upload zone contains an object
	var objects = this.getObjects();
	for (var i = 0; i < objects.length; ++i) {
		var object = objects[i];

		if (object.uploadZone && object.title == parameters.replace) {
			object.opacity = 0;
			object.evented = false;
		}
	}

	element.setCoords();
	this.renderAll().calcOffset();

	/**
	 * Gets fired as soon as an element is modified.
	 *
	 * @event fabric.Canvas#elementModify
	 * @param {Event} event
	 * @param {fabric.Object} currentElement - The current selected element.
	 * @extends fabric.Canvas
	 */
	this.fire("elementModify", { element: element, options: parameters });

	element._checkContainment();

	if (this._doHistory) {
		this.historySaveAction();
	}

	if (parameters.autoSelect && element.isEditable && !this.editorMode && this.wrapperEl.offsetParent) {
		setTimeout(() => {
			this.setActiveObject(element);
			this.renderAll();
		}, 200);
	}

	element._optionsSet = true;
};

/**
 * Duplicates an element in the canvas.
 *
 * @method duplicateElement
 * @param {fabric.Object} element The target element.
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.duplicateElement = function (element) {
	var newOpts = element.getElementJSON();

	newOpts.top = newOpts.top + 30;
	newOpts.left = newOpts.left + 30;

	if (!this.viewOptions.editorMode) {
		newOpts.autoSelect = true;
	}

	this.addElement(element.getType(), element.source, "Copy " + element.title, newOpts);
};

/**
 * Gets an upload zone by title.
 *
 * @method getUploadZone
 * @param {String} title The target title of an element.
 * @returns {fabric.Object} A fabric object representing the upload zone.
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.getUploadZone = function (title) {
	const objects = this.getObjects();

	for (var i = 0; i < objects.length; ++i) {
		if (objects[i].uploadZone && objects[i].title == title) {
			return objects[i];
		}
	}
};

/**
 * Use a SVG image as mask for the whole view. The image needs to be a SVG file with only one path. The method toSVG() does not include the mask.
 *
 * @method setMask
 * @param {Object|Null} maskOptions An object containing the URL to the svg. Optional: scaleX, scaleY, left and top.
 * @param {Function} [callback] A function when mask is loaded and set. Returns the mask or null, when mask could not be loaded.
 * @extends fabric.Canvas
 */
fabric$1.Canvas.prototype.setMask = function (maskOptions = {}, callback = () => {}) {
	if (maskOptions && maskOptions.url && maskOptions.url.includes(".svg")) {
		const maskURL = this.proxyFileServer + maskOptions.url;
		this.maskOptions = maskOptions;

		fabric$1.loadSVGFromURL(maskURL, (objects, options) => {
			let svgGroup = null;
			if (objects) {
				//if objects is null, svg is loaded from external server with cors disabled
				svgGroup = objects ? fabric$1.util.groupSVGElements(objects, options) : null;

				svgGroup.setOptions({
					left: maskOptions.left ? Number(maskOptions.left) : 0,
					top: maskOptions.top ? Number(maskOptions.top) : 0,
					scaleX: maskOptions.scaleX ? Number(maskOptions.scaleX) : 1,
					scaleY: maskOptions.scaleY ? Number(maskOptions.scaleY) : 1,
					selectable: true,
					evented: false,
					resizable: true,
					lockUniScaling: false,
					lockRotation: true,
					borderColor: "transparent",
					fill: "rgba(0,0,0,0)",
					transparentCorners: true,
					cornerColor: this.viewOptions.selectedColor,
					cornerIconColor: this.viewOptions.cornerIconColor,
					cornerSize: 24,
					originX: "left",
					originY: "top",
					name: "view-mask",
					objectCaching: false,
					excludeFromExport: true,
					_ignore: true,
				});

				this.maskObject = svgGroup;
				this.clipPath = svgGroup;

				this.resetSize();
			}

			callback(svgGroup);
		});
	} else {
		this.maskObject = this.maskOptions = this.clipPath = null;
		this.renderAll();
		callback(null);
	}
};

const parseFontsToEmbed = (fontItem) => {

    let embedString = '';
    
    if(fontItem.hasOwnProperty('url')) {

        let fontFamily = fontItem.name,
            fontFormat = fontItem.url.search('.woff') !== -1 ? 'woff' : 'TrueType',
            fontURL = FancyProductDesigner.proxyFileServer + fontItem.url;

        fontFamily += ':n4';
        embedString += '@font-face {font-family:"'+fontItem.name+'"; font-style: normal; font-weight: normal; src:url("'+fontURL+'") format("'+fontFormat+'");}\n';

        if(fontItem.variants) {

            for (const fv in fontItem.variants) {

                let ffVars = {
                    'n7': 'font-style: normal; font-weight: bold;',
                    'i4': 'font-style: italic; font-weight: normal;',
                    'i7': 'font-style: italic; font-weight: bold;'
                };

                fontURL = FancyProductDesigner.proxyFileServer + fontItem.variants[fv];
                embedString += '@font-face {font-family:"'+fontItem.name+'"; '+ffVars[fv]+' src:url("'+fontURL+'") format("'+fontFormat+'");}\n';

            }

            fontFamily += ','+Object.keys(fontItem.variants).toString();

        }

    }

    return embedString;

};

const loadFonts = (fpdInstance, callback) => {    
    
    let fonts = fpdInstance.mainOptions.fonts;
    
    if(fonts && fonts.length > 0 && typeof fonts[0] === 'object') {
                
        //sort fonts alphabetically
        fonts.sort((a, b) => {
            
            let nameA = a.name.toUpperCase(), // ignore upper and lowercase
                nameB = b.name.toUpperCase(); // ignore upper and lowercase
                
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
        
            //same
            return 0;
        });
            
        let googleFonts = [],
            customFonts = [],
            fontStateCount = 0;
        
        const styleFontsElem = document.createElement('style');
        styleFontsElem.id = 'fpd-fonts';
        fpdInstance.container.before(styleFontsElem);
        
        fonts.forEach((fontItem) => {
    
            if(fontItem.hasOwnProperty('url')) {
    
                if(fontItem.url == 'google') { //from google fonts
                    googleFonts.push(fontItem.name+':400,400i,700,700i');
                }
                else { //custom fonts
    
                    let fontFamily = fontItem.name;
    
                    fontFamily += ':n4';
    
                    if(fontItem.variants) {
                        fontFamily += ','+Object.keys(fontItem.variants).toString();
                    }
    
                    customFonts.push(fontFamily);
                    styleFontsElem.append(parseFontsToEmbed(fontItem));
    
                }
    
            }
    
        });
    
        var _fontActiveState = function(state, familyName, fvd) {            
    
            if(state == 'inactive') {
                console.log(familyName+' font could not be loaded.');
            }
    
            if(fontStateCount == (googleFonts.length + customFonts.length)-1) {
                callback(fonts);
            }
    
            fontStateCount++;
    
        };
    
        var WebFontOpts = {
            fontactive: function(familyName, fvd) {
                _fontActiveState('active', familyName, fvd);
            },
            fontinactive: function(familyName, fvd) {
                _fontActiveState('inactive', familyName, fvd);
            },
            timeout: 3000
        };
    
        if(googleFonts.length > 0) {
            WebFontOpts.google = {families: googleFonts};
        }
    
        if(customFonts.length > 0) {
            WebFontOpts.custom = {families: customFonts};
        }
    
        if((googleFonts.length > 0 || customFonts.length > 0)) {
            WebFont.load(WebFontOpts);
        }
        else {
            callback(fonts);
        }
    
    
    }
    else {
        callback(fonts);
    }
    
};

/**
 * Creates a new FancyProductDesignerView.
 *
 * @class FancyProductDesignerView
 * @param  {HTMLElement} container - The container for the Fancy Product Designer View.
 * @param  {Object} [viewData={}] - The initial view data.
 * @param  {Function} [callback] - Callback when view is created.
 * @param  {Object} [fabricCanvasOptions={}] - Options for fabricJS canvas.
 * @extends EventTarget
 */
class FancyProductDesignerView extends EventTarget {
    
    /**
     * Relevant options for the view.
     *
     * @type Array
     * @memberof FancyProductDesigner
     * @static      
     */
    static relevantOptions = [
        'stageWidth',
        'stageHeight',
        'selectedColor',
        'boundingBoxColor',
        'outOfBoundaryColor',
        'cornerIconColor',
        'customAdds',
        'elementParameters',
        'imageParameters',
        'textParameters',
        'customImageParameters',
        'customTextParameters',
        'maxPrice',
        'optionalView',
        'designCategories',
        'printingBox',
        'output',
        'layouts',
        'usePrintingBoxAsBounding',
        'threeJsPreviewModel',
        'editorMode',
        'imageLoadTimestamp',
        'fitImagesInCanvas',
        'inCanvasTextEditing',
        'applyFillWhenReplacing',
        'disableTextEmojis',
        'cornerControlsStyle',
        'responsive',
        'canvasHeight',
        'maxCanvasHeight',
        'boundingBoxProps',
        'highlightEditableObjects',
        'multiSelection',
        'multiSelectionColor',
        'mobileGesturesBehaviour',
        'smartGuides',
        'snapGridSize',
        'rulerUnit',
        'namesNumbersEntryPrice',
        'applySizeWhenReplacing',
        'rulerPosition',
        'rulerFixed',
        'industry'
    ];
    
    /**
     * The total price for the view without max. price.
     *
     * @type Number
     * @default 0
     * @memberof FancyProductDesignerView
     * @inner     
     * @readonly 
     */
    totalPrice = 0;
    
    /**
     * The total price for the view including max. price and corrert formatting.
     *
     * @type Number
     * @default 0
     * @memberof FancyProductDesignerView
     * @inner     
     * @readonly 
     */
    truePrice = 0;

    /**
     * Additional price for the view.
     *
     * @type Number
     * @default 0
     * @memberof FancyProductDesignerView
     * @inner   
     * @readonly   
     */
    additionalPrice = 0;

    /**
     * The locked state of the view.
     *
     * @type Boolean
     * @default false
     * @readonly
     */
    locked = false;

    /**
     * The properties for the mask object (url, left, top, width, height).
     *
     * @type Object
     * @default null
     * @memberof FancyProductDesignerView
     * @inner    
     * @readonly  
     */
    mask = null;

    viewData;
    onCreatedCallback;
    title;
    thumbnail;
    options;
    names_numbers;
    canvasElem = null;
    fabricCanvas = null;
    elementsAdded = false;
    
    constructor(container, viewData={}, callback, fabricCanvasOptions={}) {
        
        super();
        
        this.viewData = viewData;
        this.onCreatedCallback = callback;
        this.title = viewData.title;
        this.thumbnail = viewData.thumbnail;
        this.options = viewData.options;
        this.mask = viewData.mask;
        this.locked = viewData.locked !== undefined ? viewData.locked : this.options.optionalView;
        this.names_numbers = viewData.names_numbers ? viewData.names_numbers : null;
        
        fabric.Canvas.prototype.snapGridSize = this.options.snapGridSize;
        fabric.Canvas.prototype.snapToObjects = this.options.smartGuides;
        
        const selectedColor = this.options.selectedColor;
        fabric.Object.prototype.borderColor = selectedColor;
        fabric.Object.prototype.cornerColor = selectedColor;
        fabric.Object.prototype.cornerIconColor = this.options.cornerIconColor;
                
        fabricCanvasOptions = deepMerge({
            containerClass: 'fpd-view-stage fpd-hidden',
            selection: this.options.multiSelection,
            selectionBorderColor: this.options.multiSelectionColor,
            selectionColor: tinycolor(this.options.multiSelectionColor).setAlpha(0.1).toRgbString(),
            hoverCursor: 'pointer',
            controlsAboveOverlay: true,
            centeredScaling: true,
            allowTouchScrolling: true,
            preserveObjectStacking: true,
            enablePointerEvents: false
        }, fabricCanvasOptions);        
        
        this.fabricOptions = fabricCanvasOptions;
        
        //create canvas tag for fabricjs
        this.canvasElem = document.createElement('canvas');
        container.append(this.canvasElem);

        fabric.Canvas.prototype.forbiddenTextChars = FancyProductDesigner.forbiddenTextChars;
        fabric.Canvas.prototype.proxyFileServer = FancyProductDesigner.proxyFileServer;
        
        this.fabricCanvas = new fabric.Canvas(this.canvasElem, fabricCanvasOptions);
        this.fabricCanvas.viewOptions = this.options;
        this.fabricCanvas.setDimensions({
            width: this.options.stageWidth, 
            height: this.options.stageHeight
        });
        
        this.fabricCanvas.on({
            'imageFail': ({url}) => {
                
                Modal(`
                    <p>The image with the URL<br /><i style='font-size: 10px;'>${url}</i><br />can not be loaded into the canvas.</p>
                    <p><b>Troubleshooting</b>
                        <ul>
                            <li>The URL is not correct!</li>
                            <li>The image has been blocked by <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS' target='_blank'>CORS policy</a>. You need to host the image under the same protocol and domain or enable 'Access-Control-Allow-Origin' on the server where you host the image. <a href='http://enable-cors.org/' target='_blank'>Read more about it here.</a><
                            /li>
                        </ul>
                    </p>
                `);
    
            }
        });
        
        this.toggleLock(Boolean(this.locked));

        const _onTextChanged = (textElem) => {

            if (textElem.chargeAfterEditing) {

                if (!textElem._isPriced) {
                    this.changePrice(textElem.price, '+');
                    textElem._isPriced = true;
                }
                                
                if (textElem._initialText === textElem.text && textElem._isPriced) {
                    this.changePrice(textElem.price, '-');
                    textElem._isPriced = false;
                }
    
            }
            
        };

        this.fabricCanvas.on({
			'object:added': (opts) => {

				let element = opts.target,
					price = element.price;

				//if element is added into upload zone, use upload zone price if one is set
				if((element._addToUZ && element._addToUZ != '')) {

					var uploadZoneObj = this.fabricCanvas.getElementByTitle(element._addToUZ);
					price = uploadZoneObj && uploadZoneObj.price ? uploadZoneObj.price : price;

				}

				if(price !== undefined &&
					price !== 0 &&
					!element.uploadZone &&
					!element._ignore &&
					(!element.chargeAfterEditing || element._isPriced)
				) {
					this.changePrice(price, '+');

				}

			},
			'object:removed': (opts) => {

				const element = opts.target;

				if(element.price !== undefined && element.price !== 0 && !element.uploadZone
					&& (!element.chargeAfterEditing || element._isPriced)) {
					this.changePrice(element.price, '-');
				}

			},
            'text:changed': (opts) => {

                _onTextChanged(opts.target);                

            },
            'elementModify': (opts) => {

                if(this.elementsAdded && opts.options.hasOwnProperty('text')) {
                    _onTextChanged(opts.element);
                }
                
            },
            'elementFillChange': (opts) => {

                this.#setColorPrice(opts.element);

            }
		});
                
    }
    
    /**
     * This method needs to be called to initialize the generation.
     *
     * @method init
     */
    init() {
        
        this.loadElements(this.viewData.elements, this.#afterSetup.bind(this));
    
    };
    
    /**
     * Removes the current elements and loads a set of new elements into the view.
     *
     * @param {Array} elements An array containing elements.
     * @param {Function} callback A function that will be called when all elements have beed added.
     * @method loadElements
     */
    loadElements(elements, callback) {
    
        if(this.fabricCanvas.initialElementsLoaded) {
            this.fabricCanvas.reset(false);
        }
                
        this.fabricCanvas.offHistory();
        this.fabricCanvas.addElements(elements, callback);
    
    }
    
    #afterSetup() {

        this.elementsAdded = true;
        this.fabricCanvas._doHistory = true;

        if(this.mask) {
			this.fabricCanvas.setMask(this.mask);
		}

        if(this.onCreatedCallback)
            this.onCreatedCallback(this);  
        
        this.dispatchEvent(
            new CustomEvent('priceChange', {
                detail: {
                    elementPrice: 0,
                    truePrice: this.truePrice
                }
            })
        );
    
    }

    /**
	 * Creates a data URL of the view.
	 *
	 * @method toDataURL
	 * @param {Function} callback A function that will be called when the data URL is created. The function receives the data URL.
	 * @param {Object} [options] See fabricjs documentation http://fabricjs.com/docs/fabric.Canvas.html#toDataURL.
	 * @param {Boolean} [options.onlyExportable=false] If true elements with excludeFromExport=true are not exported in the image.
     * @param {String} [options.backgroundColor="transparent"] The background color as hexadecimal value. For 'png' you can also use 'transparent'.
	 * @param {fabric.Image} [options.watermarkImg] A fabricJS image that includes the watermark image.
	 * @param {Boolean} [deselectElement=true] Deselect current selected element.
	 */
	toDataURL(callback, options={}, deselectElement=true) {

		callback = callback === undefined ? function() {} : callback;
		options.onlyExportable = options.onlyExportable === undefined ? false : options.onlyExportable;
		options.multiplier = options.multiplier === undefined ? 1 : options.multiplier;
        options.backgroundColor = options.backgroundColor === undefined ? 'transparent' : options.backgroundColor;
        options.watermarkImg = options.watermarkImg === undefined ? null : options.watermarkImg;
        
		let hiddenObjs = [],
			tempHighlightEditableObjects = this.options.highlightEditableObjects;

		this.options.highlightEditableObjects = 'transparent';
		this.fabricCanvas.getObjects().forEach((obj) => {

			if(obj.excludeFromExport && options.onlyExportable) {

				obj.visible = false;
				hiddenObjs.push(obj);

			}

		});

		if(deselectElement) {
			this.fabricCanvas.deselectElement();
		}
        
		this.fabricCanvas
        .setDimensions({width: this.options.stageWidth, height: this.options.stageHeight})
        .setZoom(1);

		this.fabricCanvas.setBackgroundColor(options.backgroundColor, () => {

			if(options.watermarkImg) {
				this.fabricCanvas.add(options.watermarkImg);
				options.watermarkImg.center();
				options.watermarkImg.bringToFront();
			}

			//get data url
			callback(this.fabricCanvas.toDataURL(options));

			if(options.watermarkImg) {
				this.fabricCanvas.remove(options.watermarkImg);
			}

			if(this.fabricCanvas.wrapperEl.offsetParent) {
				this.fabricCanvas.resetSize();
			}

			this.fabricCanvas.setBackgroundColor('transparent', () => {
				this.fabricCanvas.renderAll();
			});

			for(var i=0; i<hiddenObjs.length; ++i) {
				hiddenObjs[i].visible = true;
			}

			this.fabricCanvas.renderAll();

			this.options.highlightEditableObjects = tempHighlightEditableObjects;

		});

	}

    /**
	 * Returns the view as SVG.
	 *
	 * @method toSVG
	 * @param {Object} [options] See fabricjs documentation http://fabricjs.com/docs/fabric.Canvas.html#toSVG
     * @param {fabric.Image} [options.watermarkImg] A fabricJS image that includes the watermark image.
	 * @param {Function} [options.reviver] See fabricjs documentation http://fabricjs.com/docs/fabric.Canvas.html#toSVG
	 * @param {Boolean} [options.respectPrintingBox=false] Only generate SVG from printing box
	 * @param {Array} [fontsToEmbed=[]] Aan array containing fonts to embed in the SVG. You can use <a href="https://jquerydoc.fancyproductdesigner.com/classes/FancyProductDesigner.html#method_getUsedColors" target="_blank">getUsedFonts method</a>
	 * @returns {String} A XML representing a SVG.
	 */
	toSVG(options={}, fontsToEmbed=[]) {

        options.respectPrintingBox = options.respectPrintingBox === undefined ? false : options.respectPrintingBox;
        options.watermarkImg = options.watermarkImg === undefined ? null : options.watermarkImg;

		let svg;

        this.fabricCanvas.deselectElement();
        
		if(options.respectPrintingBox && objectHasKeys(this.options.printingBox, ['left','top','width','height'])) {

			let offsetX = 0,
				offsetY = 0;

			if(objectHasKeys(this.options.output, ['bleed', 'width', 'height'])) {
				offsetX = (this.options.output.bleed / this.options.output.width) * this.options.printingBox.width,
				offsetY = (this.options.output.bleed / this.options.output.height) * this.options.printingBox.height;
			}

			options.viewBox = {
				x: this.options.printingBox.left - offsetX,
				y: this.options.printingBox.top - offsetY,
				width: this.options.printingBox.width + (offsetX * 2),
				height: this.options.printingBox.height  + (offsetY * 2)
			};

			this.fabricCanvas.setDimensions({
                width: this.options.printingBox.width, 
                height: this.options.printingBox.height
            })
            .setZoom(1);
		}
		else {

			this.fabricCanvas.setDimensions({
                width: this.options.stageWidth, 
                height: this.options.stageHeight
            }).setZoom(1);

		}

		//remove background, otherwise unneeeded rect is added in the svg
		let tempCanvasBackground = this.fabricCanvas['backgroundColor'];
		if(tempCanvasBackground == 'transparent') {
			this.fabricCanvas['backgroundColor'] = false;
		}

		if(options.watermarkImg) {
			this.fabricCanvas.add(options.watermarkImg);
			options.watermarkImg.center();
			options.watermarkImg.bringToFront();
		}

		svg = this.fabricCanvas.toSVG(options, options.reviver);

		if(options.watermarkImg) {
			this.fabricCanvas.remove(options.watermarkImg);
		}

		this.fabricCanvas['backgroundColor'] = tempCanvasBackground;

        if(this.fabricCanvas.wrapperEl.offsetParent) {
            this.fabricCanvas.resetSize();
        }

        const tempSVG = document.createElement('div');
        tempSVG.innerHTML = svg;

        const defsTag = tempSVG.querySelector('defs');

        const clipPaths = tempSVG.querySelectorAll('clipPath');
        // Move each clipPath to the defs element
        clipPaths.forEach(clipPath => {
            defsTag.appendChild(clipPath);
        });

        const styleTag = document.createElement('style');

        let googleFontsUrl = '',
            customFontsStr = '';

        fontsToEmbed.forEach((fontItem) => {

            if(fontItem.hasOwnProperty('url')) {

                if(fontItem.url == 'google') {
                    googleFontsUrl += fontItem.name.replace(/\s/g, "+") + ':ital,wght@0,400;0,700;1,700&';
                }
                else {
                    customFontsStr += parseFontsToEmbed(fontItem);
                }

            }
        });

        if(googleFontsUrl.length > 0) {

            styleTag.insertAdjacentHTML(
                'beforeend', 
                '@import url("https://fonts.googleapis.com/css2?family='+googleFontsUrl.replace(/&/g, "&amp;")+'display=swap");'
            );
        }

        if(customFontsStr.length > 0) {

            styleTag.insertAdjacentHTML(
                'beforeend', 
                customFontsStr
            );
        }

        defsTag.appendChild(styleTag);

        let svgString = tempSVG.innerHTML;

		svgString = svgString
			//replace all newlines
			.replace(/(?:\r\n|\r|\n)/g, '');

		return svgString;

	}

    /**
	 * Toggles the lockment of view. If the view is locked, the price of the view will not be added to the total product price.
	 *
	 * @method toggleLock
	 * @param {Boolean} toggle The toggle state.
	 * @returns {Boolean} The toggle state.
	 */
	toggleLock(locked=true) {

		this.locked = locked;

        toggleElemClasses(
            this.fabricCanvas.wrapperEl,
            ['fpd-disabled'],
            locked
        );
        
        this.dispatchEvent(
            new CustomEvent('priceChange', {
                detail: {
                    elementPrice: 0,
                    truePrice: this.truePrice
                }
            })
        );

		return locked;

	}

    /**
	 * Changes the price by an operator, + or -.
	 *
	 * @method changePrice
	 * @param {Number} price Price as number.
	 * @param {String} operator "+" or "-".
	 * @returns {Number} The total price of the view.
	 */
	changePrice(price, operator, additionalPrice=null) {

		if(typeof price !== 'number') {
			price = Number(price);
		}

		if(operator === '+') {
			this.totalPrice += price;
		}
		else {
			this.totalPrice -= price;
		}
        
        
		if(additionalPrice !== null) {

			let tempAdditionalPrice = this.additionalPrice;
			this.totalPrice -= tempAdditionalPrice;

			this.additionalPrice = additionalPrice;
			this.totalPrice += additionalPrice;

		}

		this.truePrice = this.totalPrice;

		//consider max. view price
		if(typeof this.options.maxPrice === 'number' && this.options.maxPrice != -1 && this.truePrice > this.options.maxPrice) {
			this.truePrice = Number(this.options.maxPrice);
		}
        

		//price has decimals, set max. decimals to 2
		if(this.truePrice % 1 != 0) {
			this.truePrice = Number(this.truePrice.toFixed(2));
		}

		/**
	     * Gets fired as soon as the price has changed.
	     *
	     * @event priceChange
	     * @param {Event} event
	     * @param {number} event.detail.elementPrice - The price of the added element.
	     * @param {number} event.detail.truePrice - The total price.
	     */
        this.dispatchEvent(
            new CustomEvent('priceChange', {
                detail: {
                    elementPrice: price,
                    truePrice: this.truePrice
                }
            })
        );

		return this.truePrice;

	}

    //sets the price for the element if it has color prices
	#setColorPrice(element) {
        

		//only execute when initial elements are loaded and element has color prices and colors is an object
		if(this.elementsAdded && element.colorPrices && typeof element.colors === 'object' && element.colors.length > 1) {

			//subtract current color price, if set and is hex
			if(element.currentColorPrice !== undefined) {
				element.price -= element.currentColorPrice;
				this.changePrice(element.currentColorPrice, '-');
			}

            const hexFill = element.fill;
			if(typeof hexFill === 'string') {

				var hexKey = hexFill.replace('#', '');

				if(element.colorPrices.hasOwnProperty(hexKey) || element.colorPrices.hasOwnProperty(hexKey.toUpperCase())) {

					var elementColorPrice = element.colorPrices[hexKey] === undefined ? element.colorPrices[hexKey.toUpperCase()] : element.colorPrices[hexKey];

					element.currentColorPrice = elementColorPrice;
					element.price += element.currentColorPrice;
					this.changePrice(element.currentColorPrice, '+');

				}
				else {
					element.currentColorPrice = 0;
				}

			}
			else {
				element.currentColorPrice = 0;
			}

		}

	}
    
}

window.FancyProductDesigner = FancyProductDesignerView;

const getJSON = (props) => {
    
    let url = props.url;
    
    if(props.params) {
        url += '?'+new URLSearchParams(props.params).toString();
    }
    
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("GET", url);
    xhr.onreadystatechange = (evt) => {
        
        if(xhr.readyState == 4 && xhr.status == 200) {
            
            if(props.onSuccess)
                props.onSuccess(xhr.response);
            
        }
        else if (xhr.status !== 200) {
            if(props.onError)
                props.onError(xhr);
        }
        
    };
    
    xhr.send();
    return xhr;
    
};

const postJSON = (props) => {
    
    let url = props.url;

    let headers = {
        'Accept': 'application/json'
    };
    
    if(!(props.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
        
    return fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers: headers,
        body: props.body instanceof FormData ? props.body : JSON.stringify(props.body)
    })
    .then((response) => response.json())
    .then((data) => {
        
        if(props.onSuccess)
            props.onSuccess(data);    
        
    })
    .catch(error => {
        
        if(props.onError)
            props.onError(error);
        
    })
    
};

const fetchText = (props) => {
    
    let url = props.url;
    
    return fetch(url)
    .then(res => {
        
        if(res.ok) {
            
            res.text().then(text => {
                if(props.onSuccess)
                    props.onSuccess(text);
            });
            
        }
        else {
            
            res.text().then(error => {
                if(props.onError)
                    props.onError(error);
            });
            
        }
        
    })
    
};

class Translator extends EventTarget {

    langJSON = null;

    constructor() {

        super();

    }

    /**
     * Loads the languages JSON.
     *
     * @method loadLangJSON
     * @param {JSON|String} langJSON The language data. Can be URL string to the location of the JSON file or a JSON directly.
     * @param {Function} callback The function that will be invoked when the language data is set.
     */
    loadLangJSON(langJSON = null, callback = () => { }) {

        //load language JSON
        if (langJSON !== false) {

            if (typeof langJSON === 'object') {

                this.langJSON = langJSON;
                callback.call(this);

            }
            else {

                getJSON({
                    url: langJSON,
                    onSuccess: (data) => {

                        this.langJSON = data;
                        callback.call(this);

                    },
                    onError: (error) => {

                        alert('Language JSON "' + langJSON + '" could not be loaded or is not valid. Make sure you set the correct URL in the options and the JSON is valid!');

                        callback.call(this);
                    }
                });

            }

        }
        else {
            callback.call(this);
        }

    }

    /**
     * Translates a HTML element.
     *
     * @method translateElement
     * @param {HTMLElement} htmlElem The HTML element to be translated.
     */
    translateElement(htmlElem) {

        let label = '';

        if (this.langJSON) {

            let objString = '';

            if (htmlElem.getAttribute('placeholder')) {
                objString = htmlElem.getAttribute('placeholder');
            }
            else if (htmlElem.getAttribute('title')) {
                objString = htmlElem.getAttribute('title');
            }
            else if (htmlElem.dataset.title) {
                objString = htmlElem.dataset.title;
            }
            else {
                objString = htmlElem.innerHTML;
            }

            //already translated, use content                        
            if (!objString.includes('.') || /\s/.test(objString)) {

                label = objString;
                
            }
            //add translation
            else {

                let keys = objString.toLowerCase().split('.'),
                    rootObject = this.langJSON[keys[0]];   
                                
                if (rootObject) { //check if object exists

                    label = rootObject[keys[1]];

                    if (label === undefined) { //if label does not exist in JSON, take default text
                        console.log("FPD label not found: " + htmlElem.dataset.defaulttext, keys);
                        label = htmlElem.dataset.defaulttext;
                    }

                }
                else {
                    label = htmlElem.dataset.defaulttext;
                }

            }


        }
        //no json labels
        else {
            label = htmlElem.dataset.defaulttext;
        }
        
        if (htmlElem.getAttribute('placeholder')) {
            htmlElem.setAttribute('placeholder', label);
            htmlElem.innerText = '';
        }
        else if (htmlElem.getAttribute('title')) {
            htmlElem.setAttribute('title', label);
        }
        else if (htmlElem.dataset.title) {
            htmlElem.dataset.title = label;
        }
        else {            
            htmlElem.innerHTML = label;
        }

        return label;

    }

    /**
     * Get the translation of a label.
     *
     * @method getTranslation
     * @param {String} section The section key you want - toolbar, actions, modules or misc.
     * @param {String} label The label key.
     */
    getTranslation(section, label, defaulText = '') {
        
        let translatedText = defaulText;

        if (!isEmpty(this.langJSON)) {

            section = this.langJSON[section];

            if (section) {
                translatedText = section[label] ? section[label] : defaulText;
            }

        }

        translatedText.replace(/\n/g, '');

        return translatedText;

    }

    translateArea(area) {

        const labels = area.querySelectorAll('[data-defaulttext]');

        Array.from(labels)
            .forEach(item => {

                this.translateElement(
                    item
                );

            });

    }

}

var html$m = (
`<input type="text" class="fpd-dropdown-current" />
<div class="fpd-dropdown-arrow"><span class="fpd-icon-arrow-dropdown"></span></div>
<div class="fpd-dropdown-list">
    <div class="fpd-scroll-area"></div>
</div>`);

class FPD_Dropdown extends HTMLElement {
    
    placeholder = '';
    value = '';
    searchable = false;
    inputElem = null;
    listElem = null;
    
    constructor() {
        
        super();
    
    }
    
    connectedCallback() {

        this.innerHTML = html$m;
        this.inputElem = this.querySelector('input.fpd-dropdown-current');
        this.listElem = this.querySelector('.fpd-dropdown-list');

        //close dropdown when clicked outside of container
        document.addEventListener('click', (evt) => {

            if(!this.contains(evt.target)) {
                this.classList.remove('fpd-active');
            }
            
        });
        
        this.addEventListener('click', () => {

            this.#updatePosition();
            this.classList.toggle('fpd-active');
            
        });
        
        this.querySelector('.fpd-dropdown-arrow').addEventListener('click', (evt) => {
            
            evt.stopPropagation();
            this.#updatePosition();
            this.classList.toggle('fpd-active');
            
            
        });        
        
        this.inputElem
        .addEventListener('keyup', (evt) => {
            
            if(this.searchable) {
                
                const searchStr = evt.currentTarget.value;
                
                this.listElem.querySelectorAll('.fpd-item').forEach((item) => {
                    
                    if(searchStr.length == 0) {
                        item.classList.remove('fpd-hidden');
                    }
                    else {
                        item.classList.toggle(
                            'fpd-hidden', 
                            !item.innerText.toLowerCase().includes(searchStr.toLowerCase()));
                    }
            
                });
                
            }
            
        });

        window.addEventListener('scroll', () => {
            this.#updatePosition();
        });

        const anyParentScrolled = (elem) => {

            var parentElem = elem.parentNode;

            if(parentElem) {

                elem.addEventListener('scroll', () => {
                    this.#updatePosition();
                });
                anyParentScrolled(parentElem);
                
            }
        };
        anyParentScrolled(this);

        this.inputElem.setAttribute('placeholder', this.getAttribute('placeholder') || '');
        this.#updatePosition();
        
    }
    
    static get observedAttributes() {
        
        return ['searchable', 'placeholder', 'value']
        
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        
        if (oldValue !== newValue) {
                        
            if(this.inputElem) {

                if(name === 'placeholder') {

                    this.inputElem.setAttribute('placeholder', newValue);

                }
                else if(name === 'value') {

                    this.inputElem.value = newValue;

                }

            }
            
            if(name === 'searchable') {

                this.searchable = this.hasAttribute('searchable');
                
            }
            
        }
        
    }

    #updatePosition() {

        const bounding = this.getBoundingClientRect();

        this.listElem.style.width = bounding.width+'px';
        this.listElem.style.left = bounding.left+'px';
        this.listElem.style.top = (bounding.top+bounding.height)+'px';        
    
    }

}

customElements.define( 'fpd-dropdown', FPD_Dropdown );

class FPD_RangeSlider extends HTMLElement {

    min = 0;
    max = 10;
    value = 0;
    step = 1;
    inputElem = null;
    
    constructor() {
        
        super();
    
    }
    
    connectedCallback() {
        
        this.inputElem = document.createElement('input');
        this.inputElem.type = 'range';
        this.inputElem.value = this.getAttribute('value');
        this.inputElem.min = this.getAttribute('min');
        this.inputElem.max = this.getAttribute('max');
        this.inputElem.step = this.getAttribute('step');

        this.append(this.inputElem);
        this.inputElem.addEventListener('input', this.#onInput.bind(this));

        this.#update();
        
    }

    static get observedAttributes() {
        
        return ['value', 'step', 'min', 'max']
        
    }

    attributeChangedCallback(name, oldValue, newValue) {
        
        if(this.inputElem) {
            this.inputElem[name] = newValue; 
            this.#update();
        }    

    }

    #onInput(evt) {
        
        this.#update();

        if(this.onInput)
            this.onInput(evt);
                
        const event = new CustomEvent("onInput", { detail: Number(this.inputElem.value) });
        this.dispatchEvent(event);
        
    }

    #update() {

        this.inputElem.style.setProperty('--value', this.inputElem.value);
        this.inputElem.style.setProperty('--min', this.inputElem.min);
        this.inputElem.style.setProperty('--max', this.inputElem.max);

    }

}

customElements.define( 'fpd-range-slider', FPD_RangeSlider );

var html$l = (
`<div class="fpd-uncollapsed-menu fpd-visible-hidden fpd-hidden"></div>
<div class="fpd-collapsed-menu fpd-hidden">
    <div class="fpd-dropdown-btn">
        <i></i>
        <span class="fpd-label"></span>
        <div class="fpd-dropdown-menu fpd-shadow-1"></div>
    </div>
</div>`);

var html$k = (
`<div data-pos="left">
    <fpd-actions-menu data-font-icon="fpd-icon-menu"></fpd-actions-menu>
</div>
<div data-pos="center">
    <fpd-actions-menu class="fpd-only-uncollapsed"></fpd-actions-menu>
</div>
<div data-pos="right">
    <fpd-actions-menu data-font-icon="fpd-icon-more"></fpd-actions-menu>
</div>
<div data-pos="modal">
    <span class="fpd-btn fpd-btn-fill fpd-close fpd-done">
        <i class="fpd-icon-done"></i>
        <span class="fpd-label" data-defaulttext="Done">actions.modal_done</span>
        <span class="fpd-total-price">10.00$</span>  
    </span>
    <span class="fpd-btn fpd-close">
        <i class="fpd-icon-close"></i>
    </span>
</div>`);

let ActionsBar$1 = class ActionsBar extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$k; 
        
    }

};

customElements.define( 'fpd-actions-bar', ActionsBar$1 );

var html$j = (
`<div>
    <input type="text" data-defaulttext="Enter a URL, some text..." placeholder="modules.qr_code_input" />
    <div class="fpd-qr-code-colors">
        <div class="fpd-qr-code-color-dark"></div>
        <div class="fpd-qr-code-color-light"></div>
    </div>
    <span class="fpd-add-qr-code fpd-btn" data-defaulttext="Add QR-Code">modules.qr_code_add_btn</span>
</div>`);

class QRCodeView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$j;
        
    }

}

customElements.define( 'fpd-module-qr-code', QRCodeView );

class QRCodeModule extends EventTarget {

    constructor(fpdInstance, wrapper) {

        super();

        this.fpdInstance = fpdInstance;
        this.darkColor = '#000';
        this.lightColor = '#fff';

        this.container = document.createElement("fpd-module-qr-code");
        wrapper.append(this.container);

        const colorDarkElem = this.container.querySelector('.fpd-qr-code-color-dark');
        colorDarkElem.style.backgroundColor = '#000';
        new Picker({
            parent: colorDarkElem,
            popup: 'bottom',
            alpha: false,
            color: this.darkColor,
            onChange: (color) => {
                
                this.darkColor = tinycolor(color.rgbaString).toHexString();                
                colorDarkElem.style.backgroundColor = this.darkColor;
                
                
    
            }
        });

        const colorLightElem = this.container.querySelector('.fpd-qr-code-color-light');
        colorLightElem.style.backgroundColor = this.lightColor;
        new Picker({
            parent: colorLightElem,
            popup: 'bottom',
            alpha: false,
            color: this.lightColor,
            onChange: (color) => {
                
                this.lightColor = tinycolor(color.rgbaString).toHexString();
                colorLightElem.style.backgroundColor = this.lightColor;
    
            }
        });

        addEvents(
            this.container.querySelector('.fpd-btn'),
            'click',
            (evt) => {

                fireEvent(this, 'qrCodeModuleBtnClick');                

                const text = this.container.querySelector('input[type="text"]').value;
                
                if(text && text.length > 0) {
                    
                    const qr = new QRious({
                        background: this.lightColor,
                        backgroundAlpha: 1,
                        foreground: this.darkColor,
                        foregroundAlpha: 1,
                        size: 500,
                        value: this.container.querySelector('input[type="text"]').value
                    });

                    const options = deepMerge(
                        fpdInstance.mainOptions.qrCodeProps,
                        {
                            _addToUZ: fpdInstance.currentViewInstance.currentUploadZone,
                            _isQrCode: true
                        }
                    );

                    fpdInstance._addCanvasImage(
                        qr.toDataURL(),
                        'QR-Code: ' + text,
                        options
                    );                        

                }

            }
        );

    }

}

var html$i = (
`<div data-moduleicon="fpd-icon-save" data-defaulttext="Saved Designs" data-title="modules.save_load">
    <div class="fpd-save-design">
        <input type="text" data-defaulttext="Optional: Enter a title" placeholder="modules.save_load_input_placeholder">
        <div class="fpd-btn">
            <span data-defaulttext="Save Design">modules.save_load_add_btn</span> 
        </div>
    </div>
    <div class="fpd-saved-designs fpd-scroll-area">
        <div class="fpd-grid fpd-grid-contain"></div>
    </div>
</div>`);

class SaveLoadView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$i;
        
    }

}

customElements.define( 'fpd-module-save-load', SaveLoadView );

class SaveLoadModule extends EventTarget {
        
    constructor(fpdInstance, wrapper) {

        super();

        this.fpdInstance = fpdInstance;

        this.container = document.createElement("fpd-module-save-load");
        wrapper.append(this.container);

        this.inputElem = this.container.querySelector('input'); 
        this.gridElem = this.container.querySelector('.fpd-grid');        

        addEvents(
            this.container.querySelector('.fpd-btn'),
            'click',
            (evt) => {
                
                const scale = getScaleByDimesions(
                    this.fpdInstance.currentViewInstance.options.stageWidth, 
                    this.fpdInstance.currentViewInstance.options.stageHeight, 
                    300, 
                    300, 
                    'cover'
                );

                fpdInstance.viewInstances[0].toDataURL((thumbnail) => {

                    const product = this.fpdInstance.getProduct();
                    const title = this.inputElem.value || '';
                    const savedProduct = {
                        thumbnail: thumbnail, 
                        product: product, 
                        title: title
                    };

					if(product && this.fpdInstance.mainOptions.saveActionBrowserStorage) {

						//check if there is an existing products array
						let savedProducts = this.#getSavedProducts();
						if(!savedProducts) {
							savedProducts = [];
						}

                        this.addSavedProduct(savedProduct);

						savedProducts.push(savedProduct);
						window.localStorage.setItem(
                            this.fpdInstance.container.id, 
                            JSON.stringify(savedProducts)
                        );

						Snackbar(this.fpdInstance.translator.getTranslation('misc', 'product_saved'));

					}

                    if(product) {

                        this.fpdInstance.dispatchEvent(
                            new CustomEvent('actionSave', {detail: savedProduct})
                        );

                        this.fpdInstance.doUnsavedAlert = false;

                    }
                    

				}, {multiplier: scale, format: 'png', backgroundColor:'transparent'});
                
            }
        );

        if(this.fpdInstance.mainOptions.saveActionBrowserStorage) {

            let savedProducts = this.#getSavedProducts();
            if(savedProducts && savedProducts.length > 0) {

                savedProducts.forEach((savedProduct) => {
                    this.addSavedProduct(savedProduct);
                });
                
            }

        }

    }

    //returns an object with the saved products for the current showing product
	#getSavedProducts() {
		return localStorageAvailable() ? JSON.parse(window.localStorage.getItem(this.fpdInstance.container.id)) : false;
	}

    //add a saved product to the load dialog
    addSavedProduct({thumbnail, product, title=''}) {
        
        const thumbnailElem = createImgThumbnail({
            url: thumbnail,
            title: title,
            removable: true,
            disablePrice: true,
            disableDraggable: true
        }); 

        this.fpdInstance.lazyBackgroundObserver.observe(thumbnailElem.querySelector('picture'));

        thumbnailElem.product = product;

        this.gridElem.append(thumbnailElem);

        addEvents(
            thumbnailElem,
            'click',
            (evt) => {
                this.fpdInstance.loadProduct(thumbnailElem.product);
		        this.fpdInstance.currentProductIndex = -1;

            }
        );

        addEvents(
            thumbnailElem.querySelector('.fpd-delete'),
            'click',
            (evt) => {
                
                evt.stopPropagation();

                const itemElem = evt.currentTarget.parentNode;
                const index = Array.from(this.gridElem.querySelectorAll('.fpd-item')).indexOf(itemElem);
                
                if(this.fpdInstance.mainOptions.saveActionBrowserStorage) {

                    let savedProducts = this.#getSavedProducts();
                        savedProducts.splice(index, 1);
    
                    window.localStorage.setItem(
                        this.fpdInstance.container.id, 
                        JSON.stringify(savedProducts)
                    );
    
                }

                this.fpdInstance.dispatchEvent(
                    new CustomEvent('actionLoad:Remove', {detail: {
                        index: index,
                        item: itemElem,
                    }})
                );

                itemElem.remove();

            }
        );

        return thumbnailElem;

	}

}

window.FPDSaveLoadModule = SaveLoadModule;

class ActionsBar extends EventTarget {

	static toggleActions = [
		'ruler',
	];

	static availableActions = {
		'print': {
			icon: 'fpd-icon-print',
			title: 'Print'
		},
		'reset-product': {
			icon: 'fpd-icon-reset',
			title: 'Reset Product'
		},
		'undo': {
			icon: 'fpd-icon-undo',
			title: 'Undo'
		},
		'redo': {
			icon: 'fpd-icon-redo',
			title: 'Redo'
		},
		'info': {
			icon: 'fpd-icon-info',
			title: 'Info'
		},
		'zoom': {
			icon: 'fpd-icon-zoom-in',
			title: 'Zoom'
		},
		'download': {
			icon: 'fpd-icon-download',
			title: 'Download'
		},
		'preview-lightbox': {
			icon: 'fpd-icon-preview-lightbox',
			title: 'Preview Lightbox'
		},
		'ruler': {
			icon: 'fpd-icon-ruler',
			title: 'Ruler'
		},
		'previous-view': {
			icon: 'fpd-icon-back',
			title: 'Previous View'
		},
		'next-view': {
			icon: 'fpd-icon-forward',
			title: 'Next View'
		},
		'guided-tour': {
			icon: 'fpd-icon-guided-tour',
			title: 'Guided Tour'
		},
		'qr-code': {
			icon: 'fpd-icon-qrcode',
			title: 'QR-Code'
		},
		'save-load': {
			icon: 'fpd-icon-save',
			title: 'Saved Designs'
		}
	};

	currentActions = {};

	constructor(fpdInstance) {

		super();

		this.fpdInstance = fpdInstance;

		this.container = document.createElement("fpd-actions-bar");
		fpdInstance.container.append(this.container);

		this.leftActionsMenu = this.container.querySelector('[data-pos="left"] fpd-actions-menu');
		this.leftActionsMenu.setAttribute('placeholder', this.fpdInstance.translator.getTranslation('actions', 'menu_file'));

		this.centerActionsMenu = this.container.querySelector('[data-pos="center"] fpd-actions-menu');

		this.rightActionsMenu = this.container.querySelector('[data-pos="right"] fpd-actions-menu');
		this.rightActionsMenu.setAttribute('placeholder', this.fpdInstance.translator.getTranslation('actions', 'menu_more'));

		addEvents(
			fpdInstance.container.querySelectorAll('.fpd-close'),
			'click',
			(evt) => {

				removeElemClasses(
					this.fpdInstance.modalWrapper,
					['fpd-show']
				);

				/**
				 * Gets fired when the modal with the product designer closes.
				 *
				 * @event FancyProductDesigner#modalDesignerClose
				 * @param {Event} event
				 */
				this.fpdInstance.dispatchEvent(
					new CustomEvent('modalDesignerClose')
				);

			}
		);

		addEvents(
			fpdInstance.container.querySelector('.fpd-done'),
			'click',
			(evt) => {

				/**
				 * Gets fired when the modal with the product designer closes.
				 *
				 * @event FancyProductDesigner#modalDesignerDone
				 * @param {Event} event
				 */
				this.fpdInstance.dispatchEvent(
					new CustomEvent('modalDesignerDone')
				);

			}
		);

		addEvents(
			fpdInstance,
			['viewSelect'],
			(evt) => {

				this.reset();

			}
		);

		addEvents(
			window,
			'resize',
			(evt) => {

				if(fpdInstance.inTextField) return;
				
				this.reset();

			}
		);
		
		addEvents(
            window,
            ['resize', 'fpdModalDesignerOpen'],
            () => {
                
				if(this.leftActionsMenu)
                	this.leftActionsMenu.toggleMenus();

				if(this.rightActionsMenu)
                	this.rightActionsMenu.toggleMenus();

            }
        );

		this.setup(fpdInstance.mainOptions.actions);

	}

	#setPosActions(pos, actions) {
		
		if (Array.isArray(actions) && actions.length) {

			actions.forEach(action => {

				let wrapper;
				if (pos == 'left') {

					wrapper = this.leftActionsMenu;

				}
				else if (pos == 'center') {

					wrapper = this.centerActionsMenu;

				}
				else if (pos == 'right') {

					wrapper = this.rightActionsMenu;

				}

				if (wrapper)
					this.addActionBtn(wrapper, action, true);

			});

		}
		else {

			//hide actions wrapper			
			if (pos == 'left' || pos == 'right') {

				addElemClasses(
					this.container.querySelector('[data-pos="'+pos+'"]'), 
					['fpd-visible-hidden']
				);

			}	

		}

	}

	addActionBtn(wrapper, action, smartMenu=false) {

		if (ActionsBar.availableActions.hasOwnProperty(action)) {

			const actionData = ActionsBar.availableActions[action];
			const label = this.fpdInstance.translator.getTranslation(
				'actions', 
				action.replace(/-/g, '_'),
				actionData.title
			);
						
			if(smartMenu) {

				actionData.type = action;
				actionData.title = label;
				actionData.handler = (evt) => {
					

					const switchElem = evt.currentTarget.querySelector('.fpd-switch');
					if (switchElem && !evt.target.classList.contains('fpd-switch')) {
						switchElem.checked = !switchElem.checked;
					}

					this.doAction(evt.currentTarget.dataset.action);
				};
							
				wrapper.items = [...wrapper.items, actionData];

			}
			else {

				const actionBtn = document.createElement('div');
				actionBtn.className = 'fpd-btn fpd-tooltip';
				actionBtn.setAttribute('aria-label', label);
				actionBtn.dataset.action = action;
				actionBtn.innerHTML = `<i class="${actionData.icon}"></i><span>${label}</span>`;

				if (ActionsBar.toggleActions.includes(action)) {

					actionBtn.insertAdjacentHTML(
						'beforeend',
						'<input type="checkbox" class="fpd-switch" />'
					);

				}

				wrapper.append(actionBtn);

				addEvents(
					actionBtn,
					'click',
					(evt) => {

						const switchElem = evt.currentTarget.querySelector('.fpd-switch');
						if (switchElem && !evt.target.classList.contains('fpd-switch')) {
							switchElem.checked = !switchElem.checked;
						}

						this.doAction(evt.currentTarget.dataset.action);

					}
				);

			}

		}

	}

	doAction(action) {

		if (!this.fpdInstance.currentViewInstance) { return; }

		this.fpdInstance.deselectElement();

		if (action === 'print') {

			this.fpdInstance.print();

		}
		else if (action === 'reset-product') {

			var confirmModal = Modal(
				this.fpdInstance.translator.getTranslation(
					'misc',
					'reset_confirm'
				),
				false,
				'confirm',
				this.fpdInstance.container
			);

			const confirmBtn = confirmModal.querySelector('.fpd-confirm');
			confirmBtn.innerText = this.fpdInstance.translator.getTranslation(
				'actions',
				'reset_product'
			);

			addEvents(
				confirmBtn,
				['click'],
				() => {

					this.fpdInstance.loadProduct(this.fpdInstance.productViews);
					confirmModal.remove();

				}
			);

		}
		else if (action === 'undo') {

			this.fpdInstance.currentViewInstance.fabricCanvas.undo();

		}
		else if (action === 'redo') {

			this.fpdInstance.currentViewInstance.fabricCanvas.redo();

		}
		else if (action === 'info') {

			Modal(
				this.fpdInstance.translator.getTranslation('actions', 'info_content'),
				false,
				'',
				this.fpdInstance.container
			);

		}
		else if (action === 'preview-lightbox') {

			this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler = false;

			this.fpdInstance.getProductDataURL((dataURL) => {

				const image = new Image();
				image.src = dataURL;

				image.onload = () => {

					const previewModal = Modal(
						'<div style="background: url('+ image.src +'); height: 90vh; width:100%; background-size:contain; background-repeat:no-repeat; background-position:center;"></div>',
						true
					);

					/**
					 * Gets fired when an element is added.
					 *
					 * @event FancyProductDesigner#actionPreviewModalOpen
					 * @param {Event} event
					 */
					fireEvent(this.fpdInstance, 'actionPreviewModalOpen', {
						modal: previewModal
					});

				};

				this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler = this.fpdInstance.mainOptions.rulerFixed;
				this.fpdInstance.currentViewInstance.fabricCanvas.renderAll();

			});

		}
		else if (action === 'snap') {

			this.fpdInstance.currentViewInstance.fabricCanvas.snapToGrid = !this.fpdInstance.currentViewInstance.fabricCanvas.snapToGrid;
			this.fpdInstance.currentViewInstance.fabricCanvas.renderAll();

		}
		else if (action === 'zoom') {

			const existingZoomWrapper = this.fpdInstance.mainWrapper.container.querySelector('.fpd-zoom-wrapper');
			if (existingZoomWrapper) {
				existingZoomWrapper.remove();
				return;
			}

			const zoomWrapper = document.createElement('div');
			zoomWrapper.className = 'fpd-zoom-wrapper fpd-shadow-1';

			const startVal = this.fpdInstance.currentViewInstance.fabricCanvas.getZoom() / this.fpdInstance.currentViewInstance.fabricCanvas.responsiveScale;
			const zoomSlider = document.createElement('fpd-range-slider');
			zoomSlider.className = 'fpd-progress';
			zoomSlider.setAttribute('value', startVal);
			zoomSlider.setAttribute('step', 0.02);
			zoomSlider.setAttribute('min', 1);
			zoomSlider.setAttribute('max', 3);
			zoomSlider.onInput = (evt) => {

				this.fpdInstance.currentViewInstance.fabricCanvas.setResZoom(Number(evt.currentTarget.value));

			};
			zoomWrapper.append(zoomSlider);

			const panElem = document.createElement('div');
			panElem.className = "fpd-stage-pan fpd-toggle";
			panElem.innerHTML = '<span class="fpd-icon-drag"></span>';
			zoomWrapper.append(panElem);

			addEvents(
				panElem,
				'click',
				(evt) => {

					this.fpdInstance.currentViewInstance.fabricCanvas.panCanvas = !this.fpdInstance.currentViewInstance.fabricCanvas.panCanvas;

					toggleElemClasses(panElem, ['fpd-active'], this.fpdInstance.currentViewInstance.fabricCanvas.panCanvas);

				}
			);

			const closeElem = document.createElement('div');
			closeElem.className = "fpd-close";
			closeElem.innerHTML = '<span class="fpd-icon-close"></span>';
			zoomWrapper.append(closeElem);
			
			addEvents(
				closeElem,
				'click',
				(evt) => {

					if (zoomWrapper) {
						zoomWrapper.remove();
					}
					

				}
			);

			this.fpdInstance.mainWrapper.container.append(zoomWrapper);

		}
		else if (action === 'download') {

			const downloadHTML = `<div class="fpd-modal-download">
			<span data-value="jpeg">
				<span class="fpd-icon-jpg"></span>
			</span>
			<span data-value="png">
				<span class="fpd-icon-png"></span>
			</span>
			<span data-value="pdf">
				<span class="fpd-icon-pdf"></span>
			</span>
			<span data-value="svg">
				<span class="fpd-icon-svg"></span>
			</span>
			<div class="fpd-switch-wrapper">
				<input type="checkbox" class="fpd-switch" id="fpd-action-download-single-view" />
				<label for="fpd-action-download-single-view">${this.fpdInstance.translator.getTranslation('actions', 'download_current_view')}</label>
			</div>
		</div>`;

			const downloadModal = Modal(
				downloadHTML,
				false,
				'',
				this.fpdInstance.container
			);

			addEvents(
				downloadModal.querySelectorAll('span[data-value]'),
				'click',
				(evt) => {

					this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler = false;

					this.downloadFile(
						evt.currentTarget.dataset.value,
						downloadModal.querySelector('.fpd-switch').checked
					);

					downloadModal.remove();

					this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler = this.fpdInstance.mainOptions.rulerFixed;
					this.fpdInstance.currentViewInstance.fabricCanvas.renderAll();

				}
			);

		}
		else if (action === 'ruler') {

			this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler = !this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler;
			this.fpdInstance.currentViewInstance.fabricCanvas.renderAll();

		}
		else if (action === 'previous-view') {

			this.fpdInstance.selectView(this.fpdInstance.currentViewIndex - 1);

		}
		else if (action === 'next-view') {

			this.fpdInstance.selectView(this.fpdInstance.currentViewIndex + 1);

		}
		else if (action === 'guided-tour' && this.fpdInstance.guidedTour) {

			this.fpdInstance.guidedTour.start();

		}
		else if (action === 'qr-code') {

			const existingModal = this.fpdInstance.container.querySelector('.fpd-modal-internal');
			if(existingModal)
				existingModal.remove();
			
			const modal = Modal(
				'',
				false,
				'',
				this.fpdInstance.container
			);
			
			const qrCodeModule = new QRCodeModule(
				this.fpdInstance,
				modal.querySelector('.fpd-modal-content') 
			);

			this.fpdInstance.translator.translateArea(modal);

			addEvents(
				qrCodeModule,
				'qrCodeModuleBtnClick',
				() => {

					modal.remove();
					
				}
			);

			
		}
		else if (action === 'save-load') {

			const existingModal = this.fpdInstance.container.querySelector('.fpd-modal-internal');
			if(existingModal)
				existingModal.remove();
			
			const modal = Modal(
				'',
				false,
				'',
				this.fpdInstance.container
			);
			
			new SaveLoadModule(
				this.fpdInstance,
				modal.querySelector('.fpd-modal-content') 
			);

			this.fpdInstance.translator.translateArea(modal);
			
		}

		/**
		 * Gets fired when an element is added.
		 *
		 * @event FancyProductDesigner#actionClick
		 * @param {Event} event
		 * @param {String} event.detail.action - The action type.
		 */
		fireEvent(this.fpdInstance, 'actionClick', {
            action: action,
        });

	}

	//download png, jpeg or pdf
	downloadFile(type, onlyCurrentView = false) {

		if (!this.fpdInstance.currentViewInstance) { return; }

		const downloadFilename = this.fpdInstance.mainOptions.downloadFilename;

		if (type === 'jpeg' || type === 'png') {

			document.createElement('a');
				var bgColor = type === 'jpeg' ? '#fff' : 'transparent';

			if (onlyCurrentView) {

				this.fpdInstance.currentViewInstance.toDataURL((dataURL) => {

					download(dataURL, downloadFilename + '.' + type, 'image/' + type);

				}, { format: type, backgroundColor: bgColor, watermarkImg: this.fpdInstance.watermarkImg });

			}
			else {

				this.fpdInstance.getProductDataURL((dataURL) => {

					download(dataURL, downloadFilename + '.' + type, 'image/' + type);

				}, { format: type, backgroundColor: bgColor });

			}

		}
		else if (type === 'svg') {

			download(
				this.fpdInstance.currentViewInstance.toSVG({ suppressPreamble: false, watermarkImg: this.fpdInstance.watermarkImg }),
				'Product_' + this.fpdInstance.currentViewIndex + '.svg',
				'image/svg+xml'
			);

		}
		else {

			getScript(
				'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
			).then(() => {

				const _createPDF = (dataURLs) => {

					dataURLs = typeof dataURLs === 'string' ? [dataURLs] : dataURLs;

					let doc;
					for (let i = 0; i < dataURLs.length; ++i) {

						const index = onlyCurrentView ? this.fpdInstance.currentViewIndex : i;
						let viewWidth = this.fpdInstance.viewInstances[index].options.stageWidth,
							viewHeight = this.fpdInstance.viewInstances[index].options.stageHeight,
							orien = viewWidth > viewHeight ? 'l' : 'p';

						if (i != 0) { //non-first pages
							doc.addPage([viewWidth, viewHeight], orien);
						}
						else { //first page
							doc = new jspdf.jsPDF({ orientation: orien, unit: 'px', format: [viewWidth, viewHeight] });
						}

						doc.addImage(dataURLs[i], 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

					}

					doc.save(downloadFilename + '.pdf');

				};
				
				if (jspdf)
					onlyCurrentView ?
						this.fpdInstance.currentViewInstance.toDataURL(_createPDF, { format: 'png', watermarkImg: this.fpdInstance.watermarkImg})
						:
						this.fpdInstance.getViewsDataURL(_createPDF, { format: 'png' });

			});

		}

	}

	reset() {
		
		//uncheck all switches
		const switchElems = this.container.querySelectorAll('.fpd-switch');
		if (switchElems) {

			switchElems.forEach(switchElem => {
				switchElem.checked = false;

			});

		}

		//remove and reset zoom
		const zoomWrapper = this.fpdInstance.mainWrapper.container.querySelector('.fpd-zoom-wrapper');
		if (zoomWrapper)
			zoomWrapper.remove();

		if (this.fpdInstance.currentViewInstance)
			this.fpdInstance.currentViewInstance.fabricCanvas.setResZoom(1);

	}

	setup(actions = {}) {

		this.currentActions = actions;

		if (typeof actions === 'object') {

			this.container.querySelectorAll('fpd-actions-menu').forEach(actionMenu => {

				actionMenu.items = [];
				
			});

			for (const pos in actions) {

				this.#setPosActions(pos, actions[pos]);

			}

		}

		this.fpdInstance.translator.translateArea(this.container);

	}

}

window.FPDActions = ActionsBar;

class FPD_ActionsMenu extends HTMLElement {

    constructor() {
        
        super();
        this.items = [];        
    
    }
    
    connectedCallback() {

        this.innerHTML = html$l;
        this.uncollapsedMenu = this.querySelector('.fpd-uncollapsed-menu');
        this.collapsedMenu = this.querySelector('.fpd-collapsed-menu');

        this.collapsedMenu.querySelector('.fpd-dropdown-btn > i').className = this.dataset.fontIcon || '';
        
        addEvents(
			this.collapsedMenu.querySelectorAll('.fpd-dropdown-btn'),
			'click',
			(evt) => {
				                
				const menu = evt.currentTarget.querySelector('.fpd-dropdown-menu');
				toggleElemClasses(
					menu,
					['fpd-show'],
					!menu.classList.contains('fpd-show')
				);

			}
		);

    }

    static get observedAttributes() {
        
        return ['items', 'placeholder']
        
    }

    attributeChangedCallback(name, oldValue, newValue) {
                
        if (oldValue !== newValue) {

            if(name == 'placeholder' && this.collapsedMenu) {
                this.collapsedMenu.querySelector('.fpd-dropdown-btn > .fpd-label').innerText = newValue;
            }
            
        }

    }

    get items() {
        return this._items;
    }

    set items(newValue) {
        
        this._items = newValue;
        this.#updateItems();

    }

    #updateItems() {

        this.#reset();
        
        this._items.forEach(actionItem => {

            const actionBtn = document.createElement('div');
			actionBtn.className = 'fpd-btn fpd-tooltip';
			actionBtn.setAttribute('aria-label', actionItem.title);
			actionBtn.dataset.action = actionItem.type;
			actionBtn.innerHTML = `<i class="${actionItem.icon}"></i><span>${actionItem.title}</span>`;            

            if (ActionsBar.toggleActions.includes(actionItem.type)) {
				actionBtn.insertAdjacentHTML(
					'beforeend',
					'<input type="checkbox" class="fpd-switch" />'
				);
			}
            
            this.uncollapsedMenu.append(actionBtn);
            const clonedActionBtn = actionBtn.cloneNode(true);
            this.collapsedMenu.querySelector('.fpd-dropdown-menu').append(clonedActionBtn);

            addEvents(
                [actionBtn, clonedActionBtn],
                'click',
                actionItem.handler
            );
            
        });
        
        this.toggleMenus();
        
    }

    toggleMenus() {
        
        if(this.isConnected && this.uncollapsedMenu) {

            removeElemClasses(
                this.uncollapsedMenu,
                ['fpd-hidden']
            );
            
            //show collapsed menu (dropdown)            
            if(this.uncollapsedMenu.offsetWidth > this.offsetWidth && !this.classList.contains('fpd-only-uncollapsed')) {

                addElemClasses(
                    this.uncollapsedMenu,
                    ['fpd-visible-hidden']
                );

                addElemClasses(
                    this.uncollapsedMenu,
                    ['fpd-hidden']
                );

                removeElemClasses(
                    this.collapsedMenu,
                    ['fpd-hidden']
                );
                

            }
            //show uncollapsed menu
            else {

                removeElemClasses(
                    this.uncollapsedMenu,
                    ['fpd-visible-hidden']
                );

                addElemClasses(
                    this.collapsedMenu,
                    ['fpd-hidden']
                );                

            }

        }

    }

    #reset() {

        if(this.isConnected && this.uncollapsedMenu) {

            this.uncollapsedMenu.innerHTML = '';
            this.collapsedMenu.querySelector('.fpd-dropdown-menu').innerHTML = '';

        }

    }

}

customElements.define( 'fpd-actions-menu', FPD_ActionsMenu );

var MainLoaderHTML = (
`<div class="fpd-loader-wrapper">
    <div class="fpd-loader">
        <div class="fpd-loader-circle"></div>
        <span class="fpd-loader-text" data-defaulttext="Initializing Product Designer">misc.initializing</span>
    </div>
</div>`);

var html$h = (
`<div class="fpd-navigation fpd-scrollbar-hidden"></div>
<div class="fpd-module-content"></div>
<div class="fpd-secondary-content">
    <div class="fpd-upload-zone-panel">
        <div class="fpd-upload-zone-content"></div>
        <div class="fpd-bottom-nav fpd-module-tabs">
            <div class="fpd-add-image" data-module="images">
                <span class="fpd-icon-photo"></span>
            </div>
            <div class="fpd-add-text" data-module="text">
                <span class="fpd-icon-text-secondary"></span>
            </div>
            <div class="fpd-add-design" data-module="designs">
                <span class="fpd-icon-design-library"></span>
            </div>
        </div>
    </div>
</div>
<div class="fpd-close">
    <span class="fpd-icon-close"></span>
</div>
<div class="fpd-draggable-dialog fpd-container fpd-shadow-2">
    <div class="fpd-dialog-head">
        <div class="fpd-dialog-drag-handle">
            <div>
                <span class="fpd-icon-drag"></span><span class="fpd-dialog-title"></span>
            </div>
        </div>
        <div class="fpd-close-dialog">
            <span class="fpd-icon-close"></span>
        </div>
    </div>
</div>`);

let Mainbar$1 = class Mainbar extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$h; 

    }

};

customElements.define( 'fpd-main-bar', Mainbar$1 );

var html$g = (
`<div data-moduleicon="fpd-icon-grid" data-defaulttext="Swap Product" data-title="modules.products">
    <fpd-dropdown
        class="fpd-product-categories"
        searchable
    ></fpd-dropdown>
    <div class="fpd-scroll-area">
        <div class="fpd-grid fpd-grid-contain fpd-padding">
        </div>
    </div>
</div>`);

class ProductsView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$g;
        
    }

}

customElements.define( 'fpd-module-products', ProductsView );

class ProductsModule extends EventTarget {
        
    currentCategoryIndex = 0;
    
    constructor(fpdInstance, wrapper) {
        
        super();
        
        this.fpdInstance = fpdInstance;
        this.container = document.createElement("fpd-module-products");
        wrapper.append(this.container);
                
        fpdInstance.addEventListener('productsSet', (evt) => {
                        
            const catListAreaElem = this.container.querySelector('.fpd-dropdown-list > .fpd-scroll-area');
            
            catListAreaElem.innerHTML = '';
            
            if(this.fpdInstance.products && this.fpdInstance.products.length > 0) {
                
                if(this.fpdInstance.products[0].category !== undefined && this.fpdInstance.products.length > 1) { //categories are used
                
                    this.container.classList.add('fpd-categories-enabled');
                
                    this.fpdInstance.products.forEach((item, i) => {
                        
                        const itemElem = document.createElement('span');
                        itemElem.className = 'fpd-item';
                        itemElem.dataset.index = i;
                        itemElem.innerText = item.category;
                        itemElem.addEventListener('click', (evt) => {
                            
                            this.selectCategory(evt.currentTarget.dataset.index);
                            
                        });
                        
                        catListAreaElem.append(itemElem);
                    });
                
                }
                
                this.#checkProductsLength();
                this.selectCategory(0);
                
            }
            
        });
        
        //when adding a product after products are set with productsSetup()
        fpdInstance.addEventListener('productAdd', (evt, views, category, catIndex) => {
        
            if(catIndex == this.currentCategoryIndex) {
                this.#addGridProduct(views);
            }
        
        });

    }
    
    #checkProductsLength() {
    
        if(this.fpdInstance.mainOptions.editorMode) { return; }
    
        let firstProductItem = this.fpdInstance.products[0],
            hideProductsModule = firstProductItem === undefined; //hide if no products exists at all
            
        //at least one product exists
        if(firstProductItem !== undefined) { 
    
            if((!firstProductItem.hasOwnProperty('category') && this.fpdInstance.products.length < 2) //no categories are used
                || (firstProductItem.hasOwnProperty('category') && firstProductItem.products.length < 2 && this.fpdInstance.products.length < 2)) //categories are used
            {
                hideProductsModule = true;
            }
            else {
                hideProductsModule = false;
            }
    
        }
                
        this.fpdInstance.container.classList.toggle('fpd-products-module-hidden', hideProductsModule);

        //select another item if products module is selected
        const selectedNavItem = this.fpdInstance.mainBar.navElem.querySelector('.fpd-active');
        if(hideProductsModule && selectedNavItem && selectedNavItem.dataset.module == 'products') {

            selectedNavItem.nextSibling && selectedNavItem.nextSibling.click();
            
        }
    
    };
    
    #addGridProduct(views, index) {
                
        let thumbnail = views[0].productThumbnail ? views[0].productThumbnail : views[0].thumbnail,
            productTitle = views[0].productTitle ? views[0].productTitle : views[0].title;
        
        //create grid item
        const itemElem = document.createElement('div');
        itemElem.className = 'fpd-item fpd-hover-thumbnail';
        itemElem.dataset.title = productTitle;
        itemElem.dataset.source = thumbnail;
        itemElem.dataset.index = index;
        itemElem.addEventListener('click', (evt) => {
            
            evt.preventDefault();
            
            if(this.fpdInstance.mainOptions.swapProductConfirmation) {
                
                var confirmModal = Modal(
                    this.fpdInstance.translator.getTranslation(
                        'modules', 
                        'products_confirm_replacement'
                    ), 
                    false, 
                    'confirm', 
                    this.fpdInstance.container
                );
                
                const confirmBtn = confirmModal.querySelector('.fpd-confirm');
                confirmBtn.innerText = this.fpdInstance.translator.getTranslation(
                    'modules', 
                    'products_confirm_button'
                );
                
                addEvents(
                    confirmBtn,
                    ['click'],
                    () => {
                        
                        this.fpdInstance.selectProduct(index, this.currentCategoryIndex);
                        confirmModal.remove();
                        
                    }
                );
            
            }
            else {
                this.fpdInstance.selectProduct(
                    Number(evt.currentTarget.dataset.index), 
                    this.currentCategoryIndex
                );
            }
            
        });
        
        this.container.querySelector('.fpd-grid')
        .append(itemElem);
        
        //create picture item
        const pictureElem = document.createElement('picture');
        pictureElem.dataset.img = thumbnail;
        itemElem.append(pictureElem);
        
        this.fpdInstance.lazyBackgroundObserver.observe(pictureElem);
        
    }
    
    selectCategory(index=0) {
        
        this.currentCategoryIndex = index;
        this.container.querySelector('.fpd-grid').innerHTML = '';
        
        if(this.fpdInstance.products && this.fpdInstance.products.length > 0) {
        
            let productsObj;
            if(this.fpdInstance.products[0].category !== undefined) { //categories are used
                
                productsObj = this.fpdInstance.products[index].products;
                
                this.container
                .querySelector('.fpd-dropdown-current')
                .value = this.fpdInstance.products[index].category;
                
            }
            else {                
                productsObj = this.fpdInstance.products;
            }
            
            productsObj.forEach((productItem, i) => {
                this.#addGridProduct(productItem, i);
            });
        
        
        }
        
        
    }

}

window.FPDProductsModule = ProductsModule;

var html$f = (
`<div data-moduleicon="fpd-icon-text-secondary" data-defaulttext="Add Text" data-title="modules.text">
    <div class="fpd-add-text">
        <textarea data-defaulttext="Enter some text" placeholder="modules.text_input_placeholder"></textarea>
        <div class="fpd-btn">
            <span data-defaulttext="Add Text">modules.text_add_btn</span> 
            <span class="fpd-price"></span>
        </div>
    </div>
    <div class="fpd-text-templates fpd-scroll-area">
        <div class="fpd-grid fpd-padding"></div>
    </div>
</div>`);

class TextView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$f;
        
    }

}

customElements.define( 'fpd-module-text', TextView );

class TextsModule extends EventTarget {
        
    constructor(fpdInstance, wrapper) {
        
        super();
        
        this.fpdInstance = fpdInstance;
        
        this.container = document.createElement("fpd-module-text");
        wrapper.append(this.container);        
        
        this.container.querySelector('.fpd-btn')
        .addEventListener('click', (evt) => {
        
            let textarea = this.container.querySelector('textarea'),
                text = textarea.value;
                
            if(fpdInstance.currentViewInstance && text.length > 0) {
                
                const currentViewOptions = fpdInstance.currentViewInstance.options;
        
                let textParams = deepMerge(
                    currentViewOptions.customTextParameters, 
                    {
                        textBox: Boolean(this.fpdInstance.mainOptions.customTextAsTextbox),
                        resizable: true,
                        isCustom: true, 
                        _addToUZ: fpdInstance.currentViewInstance.currentUploadZone,
                        _calcWidth: true
                    }
                );
        
                fpdInstance.currentViewInstance.fabricCanvas.addElement(
                    'text',
                    text,
                    text,
                    textParams
                );
        
            }
        
            textarea.value = '';
        
        });
        
        addEvents(
            this.container.querySelector('textarea'),
            ['input', 'change'],
            (evt) => {

                const currentViewOptions = fpdInstance.currentViewInstance.options;
                
                let text = evt.currentTarget.value,
                    maxLength = currentViewOptions.customTextParameters.maxLength,
                    maxLines = currentViewOptions.customTextParameters.maxLines;
                                    
                text = text.replace(FancyProductDesigner.forbiddenTextChars, '');
                
                //remove emojis
                if(fpdInstance.mainOptions.disableTextEmojis) {
                    text = text.replace(FPDEmojisRegex, '');
                    //fix: some emojis left a symbol with char code 65039
                    text = text.replace(String.fromCharCode(65039), ""); 
                }
                
                //max. characters
                if(maxLength != 0 && text.length > maxLength) {
                    text = text.substr(0, maxLength);
                }
                
                // max. lines
                if(maxLines != 0 && text.split("\n").length > maxLines) {
                    text = text.replace(/([\s\S]*)\n/, "$1");
                }
                
                evt.currentTarget.value = text;

            }
        );

        addEvents(
            fpdInstance,
            ['viewSelect', 'secondaryModuleCalled'], 
            (evt) => {

                if(!fpdInstance.currentViewInstance) return;
            
                const currentViewOptions = fpdInstance.currentViewInstance.options;
                let price = null;
                
                //get upload zone price
                if(fpdInstance.currentViewInstance.currentUploadZone 
                    && this.container.parentNode.classList.contains('fpd-upload-zone-content')
                ) { 
                
                    const uploadZone = fpdInstance.currentViewInstance.fabricCanvas.getUploadZone(
                                        fpdInstance.currentViewInstance.currentUploadZone
                                    );
                                    
                    if(objectGet(uploadZone, 'price')) {
                        price = uploadZone.price;
                    }
                
                }

                const viewTextPrice = objectGet(currentViewOptions, 'customTextParameters.price', 0);
                if(price == null && viewTextPrice) {
                    price = viewTextPrice;
                }

                const priceElem = this.container.querySelector('.fpd-btn > .fpd-price');
                if(priceElem)
                    priceElem.innerHTML = price ? (' - '+fpdInstance.formatPrice(price)) : '';
        
            }
        );
                
        if(Array.isArray(fpdInstance.mainOptions.textTemplates)) {
        
            var textTemplatesGridElem = this.container.querySelector('.fpd-text-templates .fpd-grid');
        
            fpdInstance.mainOptions.textTemplates.forEach((item) => {
        
                var props = item.properties,
                    styleAttr = 'font-family:'+ (props.fontFamily ? props.fontFamily : 'Arial');
        
                styleAttr += '; text-align:'+ (props.textAlign ? props.textAlign : 'left');
                
                //create text template element
                const textTemplateElem = document.createElement('div');
                textTemplateElem.className = 'fpd-item';
                textTemplateElem.addEventListener('click', (evt) => {
                    
                    if(fpdInstance.currentViewInstance) {

                        const currentViewOptions = fpdInstance.currentViewInstance.options;
                                                
                        let templateProps = {...item.properties};                        
                        templateProps.isCustom = true;
                        templateProps.textBox = Boolean(this.fpdInstance.mainOptions.customTextAsTextbox);
                        templateProps.resizable = true;
                        templateProps._addToUZ = fpdInstance.currentViewInstance.currentUploadZone;
                        templateProps._calcWidth = true;
                        
                        let textParams = deepMerge(
                            currentViewOptions.customTextParameters,
                            templateProps
                        );
                        
                        fpdInstance.currentViewInstance.fabricCanvas.addElement(
                            'text',
                            item.text,
                            item.text,
                            textParams
                        );
                    
                    }
                    
                });
                
                //create inner content
                const textTemplateInnerElem = document.createElement('div');
                textTemplateInnerElem.setAttribute('style', styleAttr); 
                textTemplateInnerElem.innerHTML = item.text.replace(/(?:\r\n|\r|\n)/g, '<br>');
                
                textTemplateElem.append(textTemplateInnerElem);
                textTemplatesGridElem.append(textTemplateElem);
        
            });
        
        }
        
    }

}

window.FPDTextsModule = TextsModule;

var html$e = (
`<div data-moduleicon="fpd-icon-design-library" data-defaulttext="Add Designs" data-title="modules.designs">
    <div class="fpd-head">
        <div class="fpd-input-back-search">
            <div class="fpd-back fpd-btn">
                <span class="fpd-icon-back"></span>
            </div>
            <div class="fpd-input-search">
                <input type="text" />
                <span class="fpd-icon-magnify"></span>
            </div>
        </div>
    </div>
    <div class="fpd-scroll-area">
        <div class="fpd-grid fpd-grid-contain fpd-padding"></div>
    </div>
</div>`);

class DesignsView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$e;
        
    }

}

customElements.define( 'fpd-module-designs', DesignsView );

class DesignsModule extends EventTarget {
    
    #searchInLabel = '';
    #categoriesUsed = false;
    #categoryLevelIndexes = [];
    #currentCategories = null;
    #dynamicDesignsId = null;

    constructor(fpdInstance, wrapper, dynamicDesignsId=null) {
        
        super();        
        
        this.#searchInLabel = fpdInstance.translator.getTranslation('modules', 'designs_search_in', 'Search in').toUpperCase();        
        this.fpdInstance = fpdInstance;
        this.#dynamicDesignsId = dynamicDesignsId;
        
        this.container = document.createElement("fpd-module-designs");
        wrapper.append(this.container);
        
        if(dynamicDesignsId) {
            this.container.dataset.dynamicDesignsId = dynamicDesignsId;            
        }
        
        this.headElem = this.container.querySelector('.fpd-head');
        this.gridElem = this.container.querySelector('.fpd-grid');
        
        this.headElem.querySelector('.fpd-input-search input')
        .addEventListener('keyup', (evt) => {
            
            const inputElem = evt.currentTarget;
            const gridItems = this.gridElem.querySelectorAll('.fpd-item');
            
            if(inputElem.value == '') { //no input, display all
                
                for (let item of gridItems) {
                    item.classList.remove('fpd-hidden');
                }
                
            }
            else {
        
                const searchQuery = inputElem.value.toLowerCase().trim();
                
                for (let item of gridItems) {
                    
                    item.classList.add('fpd-hidden');
                    
                    if(item.dataset.search.includes(searchQuery)) {
                        item.classList.remove('fpd-hidden');
                    }
                }
                
            }
        
        });
        
        addEvents(
            this.headElem.querySelector('.fpd-back'),
            'click',
            (evt) => {
                
                if(this.gridElem.querySelectorAll('.fpd-category').length > 0) {
                    this.#categoryLevelIndexes.pop(); //remove last level index
                }
            
                //loop through design categories to receive parent category
                let displayCategories = this.fpdInstance.designs,
                    parentCategory;
            
                this.#categoryLevelIndexes.forEach((levelIndex) => {
            
                    parentCategory = displayCategories[levelIndex];
                    displayCategories = parentCategory.category;
            
                });
            
                this.#currentCategories = displayCategories;
            
                if(displayCategories) { //display first level categories
                    this.#displayCategories(this.#currentCategories, parentCategory);
                }
            
                //only toggle categories for top level
                if(parentCategory === undefined) {
                    this.toggleCategories();
                }

            }
        );
        
        //when adding a product after products are set with productsSetup()
        let designsSet = false;
        addEvents(
            fpdInstance,
            ['designsSet'],
            (evt) => {
                
                if(designsSet) return;
                designsSet = true;                

                const designs = fpdInstance.designs;
            
                if(!Array.isArray(designs) || designs.length === 0) {
                    return;
                }
            
                if(designs[0].hasOwnProperty('source')) { //check if first object is a design image
            
                    this.container.classList.add('fpd-single-cat');
                    this.#displayDesigns(designs);
            
                }
                else {
            
                    if(designs.length > 1 || designs[0].category) { //display categories
                        this.#categoriesUsed = true;
                        this.toggleCategories();
                    }
                    else if(designs.length === 1 && designs[0].designs) { //display designs in category, if only one category exists
                        this.container.classList.add('fpd-single-cat');
                        this.#displayDesigns(designs[0].designs);
                    }
            
            
                }

            }
        );

        addEvents(
            fpdInstance,
            'viewSelect',
            () => {

                this.toggleCategories();
                
            }
        );
        
    }
    
    #displayCategories(categories, parentCategory) {
            
        this.gridElem.innerHTML = '';
        this.headElem.querySelector('.fpd-input-search input').value = '';
        this.container.classList.remove('fpd-designs-active');
        this.container.classList.add('fpd-categories-active');
    
        categories.forEach((category, i) => {
            this.#addDesignCategory(category);
        });
    
        //set category title
        if(parentCategory) {
            
            this.headElem.querySelector('.fpd-input-search input')
            .setAttribute('placeholder', this.#searchInLabel + ' ' + parentCategory.title.toUpperCase());            
            this.container.classList.add('fpd-head-visible');
            
        }
    
    };
    
    #addDesignCategory(category) {
                            
        const gridItem = document.createElement('div');
        gridItem.className = 'fpd-category fpd-item';
        gridItem.dataset.title = category.title;
        gridItem.dataset.search = category.title.toLowerCase();
        
        if(category.thumbnail) {
            
            const picElem = document.createElement('picture');
            picElem.dataset.img = category.thumbnail;
            gridItem.append(picElem);
            this.fpdInstance.lazyBackgroundObserver.observe(picElem);
            
            const titleElem = document.createElement('span');
            titleElem.innerText = category.title;
            gridItem.append(titleElem);
            
        }
        else {
            gridItem.innerHTML = '<span>'+category.title+'</span>';
        }
        
        gridItem.addEventListener('click', (evt) => {
            
            let targetItem = evt.currentTarget,
                index = Array.from(this.gridElem.querySelectorAll('.fpd-item')).indexOf(targetItem),
                selectedCategory = this.#currentCategories[index];
                    
            if(selectedCategory.category) {
            
                this.#categoryLevelIndexes.push(index);
                this.#currentCategories = selectedCategory.category;
                this.#displayCategories(this.#currentCategories, selectedCategory);
            
            }
            else {
                this.#displayDesigns(selectedCategory.designs, selectedCategory.parameters);
            }
            
            this.headElem.querySelector('.fpd-input-search input')
            .setAttribute('placeholder', this.#searchInLabel + ' ' +targetItem.dataset.search.toUpperCase());
            
        });
        
        this.gridElem.append(gridItem);
    
    };
    
    #displayDesigns(designObjects, categoryParameters={}) {
        
        this.gridElem.innerHTML = '';
        this.headElem.querySelector('.fpd-input-search input').value = '';
        this.container.classList.remove('fpd-categories-active');
        this.container.classList.add('fpd-designs-active', 'fpd-head-visible');
        
        designObjects.forEach((designObject) => {
            
            designObject.parameters = deepMerge(categoryParameters, designObject.parameters);
            this.#addGridDesign(designObject);
    
        });
    
    };
    
    //adds a new design to the designs grid
    #addGridDesign(design) {
    
        design.thumbnail = design.thumbnail === undefined ? design.source : design.thumbnail;
                
        const priceStr = getItemPrice(this.fpdInstance, this.container, design.parameters.price);
        const thumbnailItem = createImgThumbnail({
                url: design.source,
                thumbnailUrl: design.thumbnail,
                title: design.title,
                price: priceStr,
                disablePrice: !Boolean(priceStr)
        });
        
        thumbnailItem.dataset.search = design.title.toLowerCase();
        thumbnailItem.parameters = design.parameters;
        thumbnailItem.addEventListener('click', (evt) => {
            
            const item = evt.currentTarget;
            
            this.fpdInstance.addCanvasDesign(
                item.dataset.source,
                item.dataset.title,
                item.parameters
            );
            
        });
                 
        this.gridElem.append(thumbnailItem);
        
        this.fpdInstance.lazyBackgroundObserver
        .observe(thumbnailItem.querySelector('picture'));
  
    };
    
    toggleCategories() {
                
        if(!this.#categoriesUsed) {
            return;
        }
    
        this.#categoryLevelIndexes = [];
    
        //reset to default view(head hidden, top-level cats are displaying)
        this.container.classList.remove('fpd-head-visible', 'fpd-single-cat');
    
        this.#currentCategories = this.fpdInstance.designs;
        
        this.#displayCategories(this.#currentCategories);
    
        let catTitles = [];
        
        //display dynamic designs        
        if(typeof this.#dynamicDesignsId == 'string') {
            catTitles = this.fpdInstance.mainOptions.dynamicDesigns[this.#dynamicDesignsId].categories;
        }
        else if(this.fpdInstance.currentViewInstance) {
    
            const element = this.fpdInstance.currentElement;
    
            //element (upload zone) has design categories            
            if(element && element.uploadZone && element.designCategories) {
                catTitles = this.fpdInstance.currentElement.designCategories;
                
            }
            //enabled for the view
            else {
                catTitles = this.fpdInstance.currentViewInstance.options.designCategories;
            }
    
        }        
    
        catTitles = catTitles.map(ct => ct.toLowerCase());
    
        //check for particular design categories
        var allCatElems = this.container.querySelectorAll('.fpd-category');
        if(catTitles.length > 0) {
                        
            let visibleCats = [];
            for (let item of allCatElems) {
                                
                if(catTitles.includes(item.dataset.title.toLowerCase())) {
                    item.classList.remove('fpd-hidden');
                    visibleCats.push(item);
                }
                else {                    
                    item.classList.add('fpd-hidden');
                }
                
            }
            
            //when only one category is enabled, open it            
            if(visibleCats.length === 1) {
                this.container.classList.add('fpd-single-cat');
                visibleCats[0].click();
            }
    
        }
        else {
            for (let item of allCatElems) {            
                item.classList.remove('fpd-hidden');
            }
        }
    
    };
}

window.FPDDesignsModule = DesignsModule;

var html$d = (
`<div data-moduleicon="fpd-icon-images" data-defaulttext="Add Image" data-title="modules.images">

    <div class="fpd-module-tabs">
        <div data-context="upload" class="fpd-active fpd-tooltip" data-defaulttext="Uploads" title="modules.uploads">
            <span class="fpd-icon-cloud-upload"></span>
        </div>
        <div data-context="facebook" class="fpd-hidden fpd-tooltip" aria-label="Facebook">
             <span class="fpd-icon-facebook"></span>
        </div>
        <div data-context="instagram" class="fpd-hidden fpd-tooltip" aria-label="Instagram">
             <span class="fpd-icon-instagram"></span>
        </div>
        <div data-context="pixabay" class="fpd-hidden fpd-tooltip" aria-label="Pixabay">
             <span class="fpd-icon-pixabay"></span>
        </div>
        <div data-context="qr-code" class="fpd-tooltip" data-defaulttext="QR-Code" title="actions.qr_code">
            <span class="fpd-icon-qrcode"></span>
       </div>
       <div data-context="text2Img" class="fpd-hidden fpd-tooltip" data-defaulttext="Text to Images" title="modules.text_to_images">
        <span class="fpd-icon-ai"></span>
   </div>
    </div>

    <div class="fpd-module-tabs-content">
        <div data-context="upload" class="fpd-active"></div>
        <div data-context="facebook"></div>
        <div data-context="instagram"></div>
        <div data-context="pixabay"></div>
        <div data-context="qr-code"></div>
        <div data-context="text2Img"></div>
    </div>

</div>`);

class ImagesView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$d;
        
    }

}

customElements.define( 'fpd-module-images', ImagesView );

var html$c = (
`<div class="fpd-upload-image">
    <span data-defaulttext="Drop images here">modules.upload_zone</span>
    <span class="fpd-btn" data-defaulttext="Browse File">modules.browse_file</span>
    <span class="fpd-price"></span>
</div>
<input 
    type="file" 
    multiple="multiple" 
    class="fpd-upload-input fpd-hidden" 
    name="files[]" 
    accept="image/jpeg,image/jpg,image/png,image/svg+xml,application/pdf" 
/>
<div class="fpd-scroll-area">
    <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div>
</div>`);

class UploadsView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$c;
        
    }

}

customElements.define( 'fpd-module-uploads', UploadsView );

class UploadsModule extends EventTarget {
    
    #allowedFileTypes;
    #uploadCounter = 0;
    #firstUploadDone = false; //add first upload to canvas, when product is created
    #allUploadZones = [];
    #totalUploadFiles = 0;
    
    constructor(fpdInstance, wrapper) {
        
        super();
                
        this.fpdInstance = fpdInstance;
                        
        this.container = document.createElement("fpd-module-uploads");
        wrapper.append(this.container);
        
        this.gridElem = this.container.querySelector('.fpd-grid');
        const uploadZone = this.container.querySelector('.fpd-upload-image');
        
        //setup for allowed file types
        this.#allowedFileTypes = fpdInstance.mainOptions.allowedImageTypes;
        if(this.#allowedFileTypes.includes('jpeg') && !this.#allowedFileTypes.includes('jpg')) {
            this.#allowedFileTypes.push('jpg');
        }
        
        const uploadInput = this.container.querySelector('.fpd-upload-input');
        let acceptTypes = [];
        this.#allowedFileTypes.forEach((imageTpye) => {
        
            if(imageTpye == 'pdf') {
                acceptTypes.push('application/pdf');
            }
            else {
            
                if(imageTpye == 'svg') {
                    imageTpye += '+xml';
                }
                acceptTypes.push('image/'+imageTpye);
            
            }
        
        });
        uploadInput.setAttribute('accept', acceptTypes.join());
        
        //open file picker
        addEvents(
            uploadZone,
            'click',
            async (evt) => {
                
                evt.preventDefault();
                uploadInput.click();
                                
            }
        );
        
        //add files per click
        addEvents(
            uploadInput,
            'change', 
            (evt) => {
                this.#parseFiles(evt.currentTarget.files);
            }
        );
        
        //add files per drag&drop
        addEvents(
            uploadZone,
            ['dragover', 'dragleave'],
            (evt) => {
                
                evt.stopPropagation();
                evt.preventDefault();
                evt.currentTarget.classList.toggle('fpd-hover', evt.type === 'dragover');
                
            }
        ); 
        
        addEvents(
            uploadZone,
            'drop',
            (evt) => {
                
                evt.stopPropagation();
                evt.preventDefault();
                
                const files = evt.target.files || evt.dataTransfer.files;
                this.#parseFiles(files);
                
            }
        );
        
        addEvents(
            fpdInstance,
            'productCreate',
            (evt) => {
                
                this.#firstUploadDone = false;
                
            }
        ); 
        
        //window.localStorage.removeItem('fpd_uploaded_images');
        //get stored uploaded images from browser storage        
        if(localStorageAvailable() && window.localStorage.getItem('fpd_uploaded_images')) {
        
            const storageImages = JSON.parse(window.localStorage.getItem('fpd_uploaded_images'));
        
            storageImages.forEach((storageImage) => {
                
                this.#addGridItem(
                    storageImage.url,
                    storageImage.title,
                );
        
                const image = new Image();
                image.src = storageImage.url;
                image.onerror = () => {
        
                    storageImages.forEach((storedImg, key) => {
                        storageImages.splice(key, 1);
                    });
        
                };
        
            });

            window.localStorage.setItem('fpd_uploaded_images', JSON.stringify(storageImages));
        
        }
        
    }
    
    #parseFiles(files) {
        
        if(this.fpdInstance.mainOptions.uploadAgreementModal) {
            
            var confirmModal = Modal(
                this.fpdInstance.translator.getTranslation(
                    'modules', 
                    'images_agreement'
                ), 
                false, 
                'confirm', 
                this.fpdInstance.container
            );
            
            const confirmBtn = confirmModal.querySelector('.fpd-confirm');
            confirmBtn.innerText = this.fpdInstance.translator.getTranslation(
                'modules', 
                'images_confirm_button'
            );
            
            addEvents(
                confirmBtn,
                ['click'],
                () => {
                    
                    this.#addFiles(files);
                    confirmModal.remove();
                    
                }
            );
    
        }
        else {
            this.#addFiles(files);
        }
    
    };
    
    #addFiles(files) {
    
        this.#uploadCounter = 0;
        this.#totalUploadFiles = files.length;
        
        for(var i=0; i < this.fpdInstance.viewInstances.length; ++i) {
    
            this.fpdInstance.getElements(i).forEach((elem) => {

                if(elem.uploadZone) {
                    this.#allUploadZones.push({uz: elem.title, viewIndex: i});
                }
    
            });
    
        }        
        
        this.fpdInstance.loadingCustomImage = true;        
        Array.from(files).forEach((file, i) => {
            
            if(this.#allowedFileTypes.includes(getFileExtension(file.name))) {
                this.#initUpload(file, i == 0);
            }
            
        });
        
        this.container.querySelector('.fpd-upload-image')
        .classList.remove('fpd-hover');

        this.container.querySelector('.fpd-upload-input').value = '';
    
    }
    
    #initUpload(file, addToStage) {
    
        //check maximum allowed size
        const maxSizeBytes = this.fpdInstance.mainOptions.customImageParameters.maxSize * 1024 * 1024;
    
        if(file.size > maxSizeBytes) {
            
            Snackbar(
                this.fpdInstance.translator.getTranslation('misc', 'maximum_size_info')
                .replace('%filename', file.name)
                .replace('%mb', this.fpdInstance.mainOptions.customImageParameters.maxSize)
            );
            
            this.fpdInstance.loadingCustomImage = false;
            return;
            
        }
        
        if(file.type === 'application/pdf') {
            this.#uploadPdf(file, addToStage);            
        }
        else {
            this.#uploadImage(file, addToStage);
        }
    
    }
    
    #uploadImage(file, addToStage=false) {
        
        const mainOptions = this.fpdInstance.mainOptions;
        
        //load image with FileReader
        const reader = new FileReader();
        
        reader.onload = (evt) => {
                    
            const imgDataURI = evt.currentTarget.result;
                        
            const thumbnail = this.#addGridItem(
                imgDataURI,
                file.name,
            );
                        
            if(FancyProductDesigner.uploadsToServer) {

                if(!mainOptions.fileServerURL) {
                    thumbnail.remove();
                    alert('You need to set the fileServerURL in the option, otherwise file uploading does not work!');
                    return;
                }
                
                thumbnail.classList.add('fpd-loading');
                thumbnail.insertAdjacentHTML(
                    'beforeend', 
                    '<div class="fpd-loading-bar"><div class="fpd-loading-progress"></div></div>'
                );
        
            }
                    
            //check image dimensions
            const checkDimImage = new Image();
            checkDimImage.onload = (evt) => {
                                
                const image = evt.currentTarget;
        
                let imageH = image.height,
                    imageW = image.width;
        
                if(checkImageDimensions(this.fpdInstance, imageW, imageH)) {
                    
                    if(FancyProductDesigner.uploadsToServer) {
                        
                        const formData = new FormData();
                        formData.append('images[]', file);
                        
                        const xhr = new XMLHttpRequest();
                        xhr.responseType = 'json';
                        
                        xhr.onreadystatechange = (evt) => {
                            
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                
                                const status = xhr.status;
                                if (status === 0 || (status >= 200 && status < 400)) {
                                    
                                    const data = xhr.response;
                                                                        
                                    if(data.image_src) {
                                        
                                        this.#storeUploadedImage(data.image_src, data.filename);
                                        
                                        //update source to local server image
                                        thumbnail
                                        .dataset.source =  data.image_src;                                         
                                        
                                        thumbnail.classList.remove('fpd-loading');
                                        thumbnail.querySelector('.fpd-loading-bar').remove();
                                        
                                        this.#addToStage(thumbnail, addToStage);
                                        this.#uploadCounter++;
                                        
                                        thumbnail.xhr = null;
                                        
                                    }  
                                    
                                    this.fpdInstance.loadingCustomImage = false;
                                    
                                } 
                                
                            }
                        
                        };
                        
                        xhr.upload.onprogress = (evt) => {
                            
                            let max = evt.total,
                                current = evt.loaded,
                                percentage = parseInt((current * 100)/max);
                                
                            thumbnail
                            .querySelector('.fpd-loading-progress')
                            .style.width = percentage+'%';
                            
                        };
                        
                        xhr.upload.onerror = (evt) => {
                            
                            this.fpdInstance.loadingCustomImage = false;
                            thumbnail.remove();
                            Snackbar('Upload failed. Please try again or check your web console!');
                        
                        };
                                                                        
                        xhr.open('POST', this.fpdInstance.getFileServerURL());
                        xhr.send(formData);
                        
                        thumbnail.xhr = xhr;
        
                    }
                    else { //do not save on server
        
                        this.#storeUploadedImage(image, file.name);
                        this.#addToStage(thumbnail, addToStage);
                        this.#uploadCounter++;
        
                    }
        
                }
                else { //remove thumbnail when dimensions are not in the range
                    
                    thumbnail.remove();
                    this.fpdInstance.currentViewInstance.currentUploadZone = null;
                    
                }
        
            };
            checkDimImage.src = imgDataURI;
    
        };
        
        //add file to start loading
        reader.readAsDataURL(file);
        
    }
    
    #uploadPdf(file, addToStage=false) {
        
        this.fpdInstance.mainOptions;
        
        const uploadSnackBar = Snackbar(
            this.fpdInstance.translator.getTranslation('modules', 'images_pdf_upload_info'), 
            false
        );
        
        const formData = new FormData();
        formData.append('pdf', file);
        
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onreadystatechange = (evt) => {
            
            if (xhr.readyState === XMLHttpRequest.DONE) {
                
                const status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    
                    const data = xhr.response;
                                        
                    this.#totalUploadFiles--;
                    data.pdf_images.forEach((pdfImageData, i) => {
                        
                        const thumbnail = this.#addGridItem(
                            pdfImageData.image_url,
                            pdfImageData.filename
                        );
                                                            
                        this.#addToStage(
                            thumbnail, 
                            i == 0
                        );
                        
                        this.#storeUploadedImage(
                            pdfImageData.image_url, 
                            pdfImageData.filename
                        );
                        
                        this.#uploadCounter++;
                
                    });
                
                    uploadSnackBar.remove();
                    this.#totalUploadFiles++;
                    this.fpdInstance.loadingCustomImage = false;
                    
                } 
                
            }
        
        };
        
        xhr.upload.onerror = () => {
                                        
            this.fpdInstance.loadingCustomImage = false;
            uploadSnackBar.remove();
            Snackbar('Upload failed. Please try again or check your web console!');
        
        };
        
        xhr.open('POST', this.fpdInstance.getFileServerURL());
        xhr.send(formData);
        
    }
    
    #storeUploadedImage(url, title) {
    
        if(localStorageAvailable()) {
    
            var savedLocalFiles = window.localStorage.getItem('fpd_uploaded_images') ? JSON.parse(window.localStorage.getItem('fpd_uploaded_images')) : [],
                imgObj = {
                    url: url,
                    title: title,
                };
    
            savedLocalFiles.push(imgObj);
            window.localStorage.setItem('fpd_uploaded_images', JSON.stringify(savedLocalFiles));
    
        }
    
    }
    
    #addGridItem(imgUrl, title) {
                
        const thumbnail = createImgThumbnail({
                url: imgUrl,
                title: title,
                price: getItemPrice(this.fpdInstance, this.container),
                removable: true
        });  
        
        this.#imageQualityRatings(thumbnail, imgUrl);
        
        this.gridElem.append(thumbnail);
        this.fpdInstance
        .lazyBackgroundObserver.observe(thumbnail.querySelector('picture'));
        
        addEvents(
            thumbnail,
            ['click'],
            (evt) => {
                
                if(!this.fpdInstance.loadingCustomImage) {
                    this.fpdInstance._addGridItemToCanvas(
                        evt.currentTarget,
                        {},
                        undefined,
                        false
                    );
                }
                
            }
        );
        
        //remove upload item
        addEvents(
            thumbnail.querySelector('.fpd-delete'),
            'click',
            (evt) => {
                                    
                evt.stopPropagation();
                evt.preventDefault();
                
                const index = Array.from(this.gridElem.children).indexOf(thumbnail);
                
                if(!thumbnail.classList.contains('fpd-loading')) {
                    
                    var storageImages = JSON.parse(window.localStorage.getItem('fpd_uploaded_images'));
    
                    storageImages.splice(index, 1);
                    window.localStorage.setItem('fpd_uploaded_images', JSON.stringify(storageImages));
                    
                    if(thumbnail.xhr) {
                        thumbnail.xhr.abort();
                    }
                    
                    thumbnail.remove();
                    
                }
                                    
            }
        );
        
        return thumbnail;
        
    }
        
    #addToStage(item, addToStage) {
                
        if(!this.#firstUploadDone && this.fpdInstance.mainOptions.autoFillUploadZones) {
    
            const targetUploadzone = this.#allUploadZones[this.#uploadCounter] ? this.#allUploadZones[this.#uploadCounter] : null;    
            if(targetUploadzone) {
    
                this.fpdInstance._addGridItemToCanvas(
                    item,
                    {_addToUZ: targetUploadzone.uz},
                    targetUploadzone.viewIndex,
                    false
                );
    
            }
    
        }
        else if(addToStage) {

            this.fpdInstance._addGridItemToCanvas(
                item,
                {},
                undefined,
                false
            );
            
        }
    
        if(this.#uploadCounter == this.#totalUploadFiles-1) {
            this.#firstUploadDone = true;
        }
    
    }
    
    #imageQualityRatings(thumbnail, imgUrl) {
        
        const opts = this.fpdInstance.mainOptions.imageQualityRatings;        
        
        if(opts && typeof opts == 'object') {
    
            let low = opts.low ? opts.low : null,
                mid = opts.mid ? opts.mid : null,
                high = opts.high ? opts.high : null,
                icon = 'fpd-icon-star',
                iconOutline = 'fpd-icon-star-outline';
    
            const image = new Image();
            image.onload = () => {

                const ratingsWrapper = document.createElement('div');
                ratingsWrapper.className = 'fpd-image-quality-ratings';
                thumbnail.append(ratingsWrapper);
    
                let qualityLabel;
                                
                if(low && low.length == 2) {

                    const lowIcon = image.width < Number(low[0]) || image.height < Number(low[1]) ? iconOutline : icon;
                    const lowElem = document.createElement('span');
                    lowElem.className = lowIcon;
                    ratingsWrapper.append(lowElem);
    
                    if(lowIcon == icon) {
                        qualityLabel = this.fpdInstance.translator.getTranslation('misc', 'image_quality_rating_low');
                    }
    
                }
    
                if(mid && mid.length == 2) {

                    const midIcon = image.width < Number(mid[0]) || image.height < Number(mid[1]) ? iconOutline : icon;
                    const midElem = document.createElement('span');
                    midElem.className = midIcon;
                    ratingsWrapper.append(midElem);
    
                    if(midIcon == icon) {
                        qualityLabel = this.fpdInstance.translator.getTranslation('misc', 'image_quality_rating_mid');
                    }
    
                }
    
                if(high && high.length == 2) {
                    
                    const highIcon = image.width < Number(high[0]) || image.height < Number(high[1]) ? iconOutline : icon;
                    const highElem = document.createElement('span');
                    highElem.className = highIcon;
                    ratingsWrapper.append(highElem);
    
                    if(highIcon == icon) {
                        qualityLabel = this.fpdInstance.translator.getTranslation('misc', 'image_quality_rating_high');
                    }
    
    
                }
    
                if(qualityLabel) {
                    ratingsWrapper.dataset.qualityLabel = qualityLabel;
                }
    
            };
    
            image.src = imgUrl;
    
        }
    
    }

}

window.FPDUploadsModule = UploadsModule;

var html$b = (
`<div class="fpd-head">
    <div class="fpd-facebook-login">
        <fb:login-button 
            data-max-rows="1" 
            data-show-faces="false" 
            data-scope="user_photos">
        </fb:login-button>
    </div>
    <fpd-dropdown
        class="fpd-facebook-albums"
        placeholder="Select An Album" 
        searchable
    ></fpd-dropdown>
</div>
<div class="fpd-scroll-area">
    <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div>
</div>`);

class FacebookImagesView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$b;
        
    }

}

customElements.define( 'fpd-module-facebook-images', FacebookImagesView );

class FacebookImagesModule extends EventTarget {
    
    constructor(fpdInstance, wrapper) {
        
        super();
        
        this.fpdInstance = fpdInstance;
        
        this.container = document.createElement("fpd-module-facebook-images");
        wrapper.append(this.container);
        
        this.dropdown = this.container.querySelector('fpd-dropdown');
        this.dropdownList = this.container.querySelector('.fpd-dropdown-list > .fpd-scroll-area');
        this.gridElem = this.container.querySelector('.fpd-grid');
        
        this.#authenticate();
        
    }
    
    #authenticate() {
        
        const scriptTag = document.createElement('script');
        scriptTag.src = '//connect.facebook.com/en_US/sdk.js';
        scriptTag.addEventListener("load", () => {
            
            //init facebook
            FB.init({
                appId: this.fpdInstance.mainOptions.facebookAppId,
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v16.0'
            });
            
            FB.getLoginStatus(this.#checkLoginStatus.bind(this));
            FB.Event.subscribe('auth.statusChange', this.#checkLoginStatus.bind(this));
            
        });
        
        document.body.appendChild(scriptTag);
        
    }
    
    #checkLoginStatus(response) {
        
        if (response.status === 'connected') {
            
            // the user is logged in and has authenticated your app
            addElemClasses(
                this.container,
                ['fpd-facebook-logged-in']
            );
    
            FB.api('/me/albums?fields=name,count,id', (response) => {
                
                //add all albums to select
                const albums = response.data;
                
                if(albums) {
                    
                    albums.forEach(album => {
                    
                        const albumItem = document.createElement('span');
                        albumItem.className = 'fpd-item';
                        albumItem.dataset.albumid = album.id;
                        albumItem.innerText = album.name;
                        albumItem.addEventListener('click', (evt) => {
                                                        
                            this.dropdown.setAttribute('value', evt.currentTarget.innerText);
                            this.#selectAlbum(evt.currentTarget.dataset.albumid);
                            
                        });
                        
                        this.dropdownList.append(albumItem);
                        
                    });

                }
                    
                removeElemClasses(
                    this.dropdown,
                    ['fpd-on-loading']
                );
    
            });
    
        }
    
    }
    
    #selectAlbum(albumId) {
        
        this.gridElem.innerHTML = '';
        
        addElemClasses(
            this.dropdown,
            ['fpd-on-loading']
        );
                
        FB.api('/'+albumId+'?fields=count', (response) => {
        
            const albumCount = response.count;
   
            FB.api(
                '/'+albumId+'?fields=photos.limit('+albumCount+').fields(source,images)',
                (response) => {
                    
                    removeElemClasses(
                        this.dropdown,
                        ['fpd-on-loading']
                    );
            
                    if(!response.error) {
            
                        const photos = response.photos.data;
                        
                        photos.forEach(photo => {
                            
                            const photoLargest = photo.images[0] ? photo.images[0].source : photo.source;
                            const photoThumbnail = photo.images[photo.images.length-1] ? photo.images[photo.images.length-1].source : photo.source;
                            
                            const thumbnail = createImgThumbnail({
                                    url: photoLargest, 
                                    thumbnailUrl: photoThumbnail, 
                                    title: photo.id,
                                    price: getItemPrice(this.fpdInstance, this.container)
                            });                            
                            
                            addEvents(
                                thumbnail,
                                ['click'],
                                (evt) => {
                                    
                                    if(!this.fpdInstance.loadingCustomImage) {
                                        this.fpdInstance._addGridItemToCanvas(evt.currentTarget);
                                    }
                                    
                                }
                            );
                            
                            this.gridElem.append(thumbnail);
                            this.fpdInstance.lazyBackgroundObserver.observe(thumbnail.querySelector('picture'));
                            
                        });
            
                    }
            
                    this.fpdInstance.toggleSpinner(false);
        
            });
        
        });
        
    }

}

var html$a = (
`<div class="fpd-scroll-area">
    <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div>
</div>`);

class InstagramImagesView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$a;
        
    }

}

customElements.define( 'fpd-module-instagram-images', InstagramImagesView );

class InstgramImagesModule extends EventTarget {
    
    accessToken = null;
    nextStack = null;
    loadingStack = false;
    scrollArea = null;
    
    constructor(fpdInstance, wrapper) {
        
        super();
        
        this.fpdInstance = fpdInstance;
        
        this.container = document.createElement("fpd-module-instagram-images");
        wrapper.append(this.container);
        
        this.gridElem = this.container.querySelector('.fpd-grid');
        this.scrollArea = this.container.querySelector('.fpd-scroll-area');
        
        //infinite scroll and load next stack of instagram images
        this.scrollArea.addEventListener('scroll', this.#nextStack.bind(this));
           
    }
    
    authenticate() {
        
        const mainOptions = this.fpdInstance.mainOptions;
        
        if(localStorageAvailable()) {
            
            //window.localStorage.removeItem('fpd_insta_access_token');
            const browserAccessToken = window.localStorage.getItem('fpd_insta_access_token');
            if(!isEmpty(browserAccessToken)) {
                
                this.accessToken = browserAccessToken;
                this.#loadImages();
                return;
                
            }
            
        }
    
        let popupLeft = (window.screen.width - 700) / 2,
            popupTop = (window.screen.height - 500) / 2,
            authUrl = 'https://api.instagram.com/oauth/authorize',
            authUrlQuery = {
                app_id: mainOptions.instagramClientId,
                redirect_uri: mainOptions.instagramRedirectUri,
                scope: 'user_profile,user_media',
                response_type: 'code'
            },
            urlParams = new URLSearchParams(authUrlQuery).toString();
        
        var popup = window.open(authUrl+'?'+urlParams, '', 'width=700,height=500,left='+popupLeft+',top='+popupTop+'');
    
        var interval = setInterval(() => {
    
            if(popup.closed) {
                clearInterval(interval);
            }
    
            try {
    
                if(popup.location && popup.location.href) {
    
                    var url = new URL(popup.location.href),
                        code = url.searchParams.get('code');
                            
                    if(code) {
    
                        code = code.replace('#_', '');
                        this.#getAccessToken(code);
                        popup.close();
    
                    }
    
                }
    
            }
            catch(evt) {}
    
        }, 500);
    
    };
    
    #getAccessToken(code) {
        
        const mainOptions = this.fpdInstance.mainOptions;
    
        this.fpdInstance.toggleSpinner(true);
        
        getJSON({
            url: mainOptions.instagramTokenUri,
            params: {
                code: code,
                client_app_id: mainOptions.instagramClientId,
                redirect_uri: mainOptions.instagramRedirectUri
            },
            onSuccess: (data) => {
                
                if(data.access_token) {
                    
                    if(localStorageAvailable()) {
                        window.localStorage
                        .setItem('fpd_insta_access_token', data.access_token);
                    }
                
                    this.accessToken = data.access_token;
                    this.#loadImages();
                
                }
                else if(data.error_message) {
                    this.fpdInstance.toggleSpinner(false);
                } 
                
            },
            onError: (evt) => {
                this.fpdInstance.toggleSpinner(false);
            }
        });
    
    };
    
    //load photos from instagram using an endpoint
    #loadImages(endpoint='https://graph.instagram.com/me/media', emptyGrid=true) {
        
        this.loadingStack = true;
        this.fpdInstance.toggleSpinner(true);
        
        let getOpts = {
            url: endpoint,
            onSuccess: (response) => {
                
                if(response.data) {
                    
                    this.nextStack = (response.paging && response.paging.next) ? response.paging.next : null;
                                                            
                    response.data.forEach((item) => {
                        
                        if(item.media_type !== 'VIDEO') {
                            
                            const thumbnail = createImgThumbnail({
                                        url: item.media_url, 
                                        thumbnailUrl: item.thumbnail_url ? item.thumbnail_url : item.media_url, 
                                        title: item.id,
                                        price: getItemPrice(this.fpdInstance, this.container) 
                            });
                            
                            addEvents(
                                thumbnail,
                                ['click'],
                                (evt) => {
                                    
                                    if(!this.fpdInstance.loadingCustomImage) {
                                        this.fpdInstance._addGridItemToCanvas(evt.currentTarget);
                                    }
                                    
                                }
                            );
                            
                            this.gridElem.append(thumbnail);
                            this.fpdInstance.lazyBackgroundObserver.observe(thumbnail.querySelector('picture'));
                        
                        }
                        
                    });
                    
                }
                
                this.fpdInstance.toggleSpinner(false);
                this.loadingStack = false;
                this.#nextStack();
                
            },
            onError: ( xhr) => {
                
                if(xhr.response && xhr.response.error && xhr.response.error.code) {
                    
                    if(localStorageAvailable() && xhr.response.error.code == 190) {
                        
                        window.localStorage.removeItem('fpd_insta_access_token');
                        this.accessToken = null;
                        
                        this.authenticate();
                    }
                    
                }
                
                this.fpdInstance.toggleSpinner(false);
                this.loadingStack = false;
            }
        };
        
        if(emptyGrid) {
            
            this.gridElem.innerHTML = '';
            
            getOpts.params = {
                fields: 'id,caption,media_url,media_type',
                access_token: this.accessToken
            };
            
        }
        
        getJSON(getOpts);
    
    }

    #nextStack() {

        const offset = 100;
        let areaHeight = this.scrollArea.scrollHeight;
        let currentScroll = this.scrollArea.clientHeight + this.scrollArea.scrollTop;
                
        if(currentScroll+offset > areaHeight || this.gridElem.clientHeight < areaHeight) {
            
            if(this.nextStack !== null && !this.loadingStack) {
                this.#loadImages(this.nextStack, false);
            }
            
        }

    }

}

var html$9 = (
`<div class="fpd-loader-wrapper">
    <div class="fpd-loader">
        <div class="fpd-loader-circle"></div>
    </div>
</div>
<div class="fpd-head">
    <a 
        href="https://pixabay.com/" 
        target="_blank" 
        class="fpd-pixabay-logo">
    </a>
    <div class="fpd-input-search">
        <input 
            type="text" 
            data-defaulttext="Search in Pixabay library" 
            placeholder="modules.pixabay_search" 
        />
        <span class="fpd-icon-magnify"></span>
    </div>
</div>
<div class="fpd-scroll-area">
    <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div>
</div>`);

class PixabayImagesView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$9;
        
    }

}

customElements.define( 'fpd-module-pixabay-images', PixabayImagesView );

class PixabayImagesModule extends EventTarget {
    
    loadingStack = false;
    currentQuery = '';
    pixabayPage = 1;
    
    constructor(fpdInstance, wrapper) {
        
        super();
        
        this.fpdInstance = fpdInstance;
        
        this.container = document.createElement("fpd-module-pixabay-images");
        wrapper.append(this.container);
        
        this.gridElem = this.container.querySelector('.fpd-grid');
        this.loader = this.container.querySelector('.fpd-loader-wrapper');
        const scrollArea = this.container.querySelector('.fpd-scroll-area');

        //infinite scroll and load next stack of instagram images
        scrollArea
        .addEventListener('scroll', (evt) => {
            
            const offset = 100;
            let areaHeight = scrollArea.scrollHeight;
            let currentScroll = scrollArea.clientHeight + scrollArea.scrollTop;
            
            if(currentScroll+offset > areaHeight) {
                
                if(!this.loadingStack) {
                
                    this.pixabayPage++;
                    this.loadImages(undefined, false);
                
                }
                
            }
            
        });
        
        addEvents(
            this.container.querySelector('input'),
            ['keypress'],
            (evt) => {
                
                if(evt.which == 13) {
                
                    this.pixabayPage = 1;
                    this.loadImages(evt.currentTarget.value);
                
                }
                
            }
        );
           
    }
    
    loadImages(query, emptyGrid=true) {
    
        if(this.currentQuery === query) {
            return false;
        }
                
        const mainOptions = this.fpdInstance.mainOptions;
    
        this.loadingStack = true;
        this.currentQuery = query === undefined ? this.currentQuery : query;
    
        var perPage = 40,
            highResParam = mainOptions.pixabayHighResImages ? '&response_group=high_resolution' : '',
            url = 'https://pixabay.com/api/?safesearch=true&key='+mainOptions.pixabayApiKey+'&page='+this.pixabayPage+'&per_page='+perPage+'&min_width='+mainOptions.customImageParameters.minW+'&min_height='+mainOptions.customImageParameters.minH+highResParam+'&q='+encodeURIComponent(this.currentQuery)+'&lang='+mainOptions.pixabayLang;
    
        if(emptyGrid) {
            this.gridElem.innerHTML = '';
        }
        
        removeElemClasses(
            this.loader,
            ['fpd-hidden']
        );
        
        getJSON({
            url: url,
            onSuccess: (data) => {
                
                addElemClasses(
                    this.loader,
                    ['fpd-hidden']
                );
                
                if (data.hits.length > 0) {
                
                    data.hits.forEach((item) => {
                                                
                        const thumbnail = createImgThumbnail({
                                    url: item.imageURL ? item.imageURL : item.webformatURL, 
                                    thumbnailUrl: item.webformatURL, 
                                    title: item.id ? item.id : item.id_hash,
                                    price: getItemPrice(this.fpdInstance, this.container)
                        });
                        
                        addEvents(
                            thumbnail,
                            ['click'],
                            (evt) => {
                                
                                if(!this.fpdInstance.loadingCustomImage) {
                                    this.fpdInstance._addGridItemToCanvas(evt.currentTarget);
                                }
                                
                            }
                        );
                        
                        this.gridElem.append(thumbnail);
                        this.fpdInstance.lazyBackgroundObserver.observe(thumbnail.querySelector('picture'));
                
                    });
                
                }
                
                this.loadingStack = false;
                                
            },
            onError: (evt) => {
                
                addElemClasses(
                    this.loader,
                    ['fpd-hidden']
                );
                
            }
        });
    
    };
    
}

var html$8 = (
`<div class="fpd-head">
    <div class="fpd-info" data-defaulttext="Describe your image">modules.text_to_images_info</div>
    <textarea placeholder="e.g. Beautiful sunset with a white sandy beach"></textarea>
    <span class="fpd-btn" data-defaulttext="Generate">modules.text_to_images_generate</span>
</div>
<div class="fpd-scroll-area">
    <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div>
</div>`);

class TextToImageView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$8;
        
    }

}

customElements.define( 'fpd-module-text-to-image', TextToImageView );

class TextToImageModule extends EventTarget {
    
    #isLoading = false;
    
    constructor(fpdInstance, wrapper) {
        
        super();
        
        this.fpdInstance = fpdInstance;
        
        this.container = document.createElement("fpd-module-text-to-image");
        wrapper.append(this.container);
        
        this.inputElem = this.container.querySelector('.fpd-head textarea');
        this.gridElem = this.container.querySelector('.fpd-grid');
        
        this.container.querySelector('.fpd-head .fpd-btn')
        .addEventListener('click', (evt) => {
            
            const btnElem = evt.currentTarget;
            
            if(!isEmpty(this.inputElem.value) && !this.#isLoading) {

                this.#isLoading = true;
                btnElem.classList.add('fpd-loading');

                postJSON({
                    url: fpdInstance.mainOptions.aiService.serverURL,
                    body: {
                        service: 'text2Img',
                        prompt: this.inputElem.value,
                    },
                    onSuccess: (data) => {
                            
                        if(data && data.images) {
                            
                            this.#gridImagedLoaded(data.images);

                            data.images.forEach(imgURL => {

                                if(localStorageAvailable()) {

                                    let currentAiImages = window.localStorage.getItem('fpd_ai_images');
    
                                    if(currentAiImages) {
                                        currentAiImages = JSON.parse(currentAiImages);
                                    }
                                    else {
                                        currentAiImages = [];
                                    }
    
                                    currentAiImages.push(imgURL);
    
                                    window.localStorage.setItem('fpd_ai_images', JSON.stringify(currentAiImages));
    
                                }

                            });
                            

                        }
                        else {
        
                            fpdInstance.aiRequestError(data.error);
            
                        }

                        this.#isLoading = false;
                        btnElem.classList.remove('fpd-loading');
        
                        
                    },
                    onError: () => {

                        this.#isLoading = false;
                        btnElem.classList.remove('fpd-loading');
                        fpdInstance.aiRequestError.bind(fpdInstance);

                    }
                });
                
            }
            
        });

        addEvents(fpdInstance, 'productCreate', this.#productCreated.bind(this));

        
    }

    #productCreated() {

        this.gridElem.innerHTML = '';

        //saved ai images from local storage
        //window.localStorage.removeItem('fpd_ai_images');
        let currentAiImages = window.localStorage.getItem('fpd_ai_images');
        if(localStorageAvailable() && currentAiImages) {

            currentAiImages = JSON.parse(currentAiImages);
            this.#gridImagedLoaded(currentAiImages);

        }

    }
    
    #gridImagedLoaded(images=[]) {
        
        images.forEach((imgURL) => {

            const thumbnail = createImgThumbnail({
                url: imgURL,
                title: getFilename(imgURL),
                price: getItemPrice(this.fpdInstance, this.container),
                removable: true
            });
            
            this.gridElem.prepend(thumbnail);
            this.fpdInstance
            .lazyBackgroundObserver.observe(thumbnail.querySelector('picture'));

            addEvents(
                thumbnail,
                ['click'],
                (evt) => {
                    
                    if(!this.fpdInstance.loadingCustomImage) {
                        this.fpdInstance._addGridItemToCanvas(evt.currentTarget);
                    }
                    
                }
            );

            //remove stored image
            addEvents(
                thumbnail.querySelector('.fpd-delete'),
                'click',
                (evt) => {
                                        
                    evt.stopPropagation();
                    evt.preventDefault();
                    
                    const index = Array.from(this.gridElem.children).indexOf(thumbnail);
                    
                    if(!thumbnail.classList.contains('fpd-loading')) {
                        
                        let storageImages = JSON.parse(window.localStorage.getItem('fpd_ai_images'));
        
                        storageImages.splice(index, 1);
                        window.localStorage.setItem('fpd_ai_images', JSON.stringify(storageImages));
                        
                        if(thumbnail.xhr) {
                            thumbnail.xhr.abort();
                        }
                        
                        thumbnail.remove();
                        
                    }
                                        
                }
            );
            
        });
                
    }

}

window.FPDTextToImageModule = TextToImageModule;

class ImagesModule extends EventTarget {
    
    constructor(fpdInstance, wrapper) {
        
        super();
                
        this.fpdInstance = fpdInstance;
        
        this.container = document.createElement("fpd-module-images");
        wrapper.append(this.container);
        
        const tabs = Array.from(
            this.container.querySelectorAll('.fpd-module-tabs > div')
        );
        const tabContents = Array.from(
            this.container.querySelectorAll('.fpd-module-tabs-content > div')
        );        
        
        let instaInstance = null,
            pixabayInstance = null;
                
        //tabs handler
        addEvents(
            tabs,
            'click',
            (evt) => {
                
                const targetTab = evt.currentTarget;
                
                removeElemClasses(
                    tabs,
                    ['fpd-active']
                );
                
                removeElemClasses(
                    tabContents,
                    ['fpd-active']
                );
                
                addElemClasses(
                    targetTab,
                    ['fpd-active']
                );
                
                addElemClasses(
                    tabContents.find( t => t.dataset.context == targetTab.dataset.context ),
                    ['fpd-active']
                );
                
                if(targetTab.dataset.context == 'instagram' && instaInstance && !instaInstance.accessToken) {
                    instaInstance.authenticate();
                }
                else if(targetTab.dataset.context == 'pixabay' && pixabayInstance) {
                    pixabayInstance.loadImages();
                }
                
            }
        );
        
        const mainOptions = fpdInstance.mainOptions;
                
        new UploadsModule(
            fpdInstance,
            tabContents.find( t => t.dataset.context == 'upload' ),
        );
        
        //set price in upload drop zone
        addEvents(
            fpdInstance,
            ['viewSelect', 'secondaryModuleCalled'],
            (evt) => {
                                
                const priceStr = getItemPrice(fpdInstance, this.container); 
                const priceElems = this.container.querySelectorAll('.fpd-price');

                if(priceElems) {

                    //hide prices when empty or 0
                    toggleElemClasses(
                        priceElems,
                        ['fpd-hidden'],
                        !Boolean(priceStr)
                    );
    
                    priceElems.forEach(elem => {
                        elem.innerHTML = priceStr;
                    });

                }
                    
                
            }
        );
        
        if(!isEmpty(mainOptions.facebookAppId)) {
            
            new FacebookImagesModule(
                fpdInstance,
                tabContents.find( t => t.dataset.context == 'facebook' )
            );
            
            tabs.find( t => t.dataset.context == 'facebook' )
            .classList.remove('fpd-hidden');
            
        }
        
        if(!isEmpty(mainOptions.instagramClientId)) {
            
            instaInstance = new InstgramImagesModule(
                fpdInstance,
                tabContents.find( t => t.dataset.context == 'instagram' )
            );
            
            tabs.find( t => t.dataset.context == 'instagram' )
            .classList.remove('fpd-hidden');
            
        }
        
        if(!isEmpty(mainOptions.pixabayApiKey)) {
            
            pixabayInstance = new PixabayImagesModule(
                fpdInstance,
                tabContents.find( t => t.dataset.context == 'pixabay' )
            );
            
            tabs.find( t => t.dataset.context == 'pixabay' )
            .classList.remove('fpd-hidden');
            
        }
        
        if(!isEmpty(mainOptions.aiService.serverURL) && mainOptions.aiService.text2Img) {
            
             new TextToImageModule(
                fpdInstance,
                tabContents.find( t => t.dataset.context == 'text2Img' )
            );
            
            tabs.find( t => t.dataset.context == 'text2Img' )
            .classList.remove('fpd-hidden');
            
        }

        new QRCodeModule(
            fpdInstance,
            tabContents.find( t => t.dataset.context == 'qr-code' )
        );
        
        //hide tabs if only one tab is available
        if(tabs.filter( t => !t.classList.contains('fpd-hidden')).length < 2) {
            this.container.classList.add('fpd-hide-tabs');
        }
        
    }

}

window.FPDImagesModule = ImagesModule;

var html$7 = (
`<div data-moduleicon="fpd-icon-layers" data-defaulttext="Manage Layers" data-title="modules.manage_layers">
    <div class="fpd-scroll-area">
        <div class="fpd-list"></div>
    </div>
</div>`);

class LayersView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$7;
        
    }

}

customElements.define( 'fpd-module-manage-layers', LayersView );

const ColorPicker = (props) => {
    
    let initialSet = false; //picker change is fired on initial set, so only fire callbacks on interaction
    const changeTimeout = 500; //change callback after 500ms of no-dragging
    let changeTimeoutHandle = null;
    
    const colorPickerWrapper = document.createElement('div');
    colorPickerWrapper.className = 'fpd-colorpicker-wrapper';
    
    const picker = new Picker({
        parent: colorPickerWrapper,
        popup: false,
        alpha: false,
        color: tinycolor(props.initialColor).isValid() ? props.initialColor : '#fff',
        onChange: (color) => {
            
            const hexColor = tinycolor(color.rgbaString).toHexString();
            
            if(initialSet && props.onMove)
                props.onMove(hexColor);
            
            if (typeof changeTimeoutHandle === "number") {
                clearTimeout(changeTimeoutHandle);
            }
            
            changeTimeoutHandle = setTimeout(
                () => {
                    if(initialSet && props.onChange)
                        props.onChange(hexColor);
                        
                    initialSet = true;
                },
                changeTimeout
            );

        }
    });
    
    if (window.EyeDropper !== undefined) {
        
        const eyeDropperHandle = picker.domElement.querySelector('.picker_sample');
        
        const eyeDropperIcon = document.createElement('span');
        eyeDropperIcon.className = 'fpd-icon-color';
        eyeDropperHandle.append(eyeDropperIcon);
        
        addEvents(
            eyeDropperHandle,
            'click',
            (evt) => {
                
                const eyeDropper = new EyeDropper();
                
                eyeDropper.open()
                .then((result) => {
                    picker.setColor(result.sRGBHex);
                })
                .catch((err) => {
                    console.log(err);
                });   
                
            }
        );
        
    }
    
    if(props.palette && Array.isArray(props.palette)) {
        
        const colorPickerPalette = ColorPalette({
            colors: props.palette,
            colorNames: props.colorNames,
            onChange: (color) => {
                
                if(props.onChange)
                    props.onChange(color);
                
            }
        });
        
        colorPickerWrapper.append(colorPickerPalette);
        
    }
    
    return colorPickerWrapper;
    
};

const ColorPalette = (props) => {
    
    const scrollArea = document.createElement('div');
    scrollArea.className = 'fpd-scroll-area';
    
    if(props.enablePicker || props.subPalette)
        addElemClasses(scrollArea, ['fpd-has-subpanel']);
    
    const wrapper = document.createElement('div');
    wrapper.className = 'fpd-color-palette';
    scrollArea.append(wrapper);
    
    let currentSubPanel;    
    if(props.colors && Array.isArray(props.colors)) {
                
        props.colors.forEach((color, index) => {
            
            let tooltipTxt = color;
            
            //set color name
            if(props.colorNames) {
                
                const colorName = props.colorNames[color.replace('#', '').toLowerCase()];
                if(colorName)
                    tooltipTxt = colorName.toUpperCase();

            }
            
            const colorItem = document.createElement('span');
            colorItem.className = 'fpd-item';
            colorItem.style.backgroundColor = color;
            colorItem.setAttribute('aria-label', tooltipTxt);
            colorItem.dataset.hex = color;
            wrapper.append(colorItem);
            
            if(!props.enablePicker && !props.subPalette)
                addElemClasses(colorItem, ['fpd-tooltip']);
            
            addEvents(
                colorItem,
                'click',
                (evt) => {
                    
                    evt.stopPropagation();
                    
                    if(props.enablePicker || props.subPalette) {
                        
                        if(currentSubPanel) {
                            currentSubPanel.remove();
                            currentSubPanel = null;
                        }
                        
                        const activeClicked = colorItem.classList.contains('fpd-active');
                        
                        if(!activeClicked) {
                            
                            if(props.enablePicker) {
                                
                                currentSubPanel = ColorPicker({
                                    initialColor: color,
                                    colorNames: props.colorNames,
                                    palette: props.palette,
                                    onMove: (hexColor) => {
                                        
                                        if(props.onMove)
                                            props.onMove(hexColor, index);
                                        
                                    },
                                    onChange: (hexColor) => {
                                        
                                        colorItem.style.backgroundColor = hexColor;
                                        
                                        if(props.onChange)
                                            props.onChange(hexColor, index);
                                        
                                    }
                                });
                                
                            }
                            else {
                                
                                currentSubPanel = ColorPalette({
                                    colors: props.palette, 
                                    colorNames: props.colorNames,
                                    onChange: (hexColor) => {
                                        
                                        colorItem.style.backgroundColor = hexColor;
                                        
                                        if(props.onChange)
                                            props.onChange(hexColor, index);
                                        
                                    }
                                });
                                
                            }
                            
                            wrapper.append(currentSubPanel);
                            
                        }
                        
                        removeElemClasses(wrapper, ['fpd-sub-show']);
                        removeElemClasses(wrapper.querySelectorAll('.fpd-item'), ['fpd-active']);
                        
                        if(!activeClicked) {
                            
                            addElemClasses(wrapper, ['fpd-sub-show']);
                            addElemClasses(colorItem, ['fpd-active']);
                            
                        }
                        
                    }
                    else {
                        
                        if(props.onChange)
                            props.onChange(color);
                        
                    }
                    
                }
            );
            
        });
        
    }
    
    return scrollArea;
    
};

const Patterns = (props) => {
    
    const scrollArea = document.createElement('div');
    scrollArea.className = 'fpd-scroll-area';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'fpd-patterns-wrapper';
    scrollArea.append(wrapper);
    
    if(props.images && Array.isArray(props.images)) {
        
        props.images.forEach((img, index) => {
            
            const title = img.replace(/^.*[\\\/]/, '')
                                .replace(/\.[^/.]+$/, "")
                                .replace('_', ' ')
                                .toUpperCase();
            
            const item = document.createElement('span');
            item.className = 'fpd-item fpd-tooltip';
            item.style.backgroundImage = `url("${img}")`;
            item.setAttribute('aria-label', title);
            wrapper.append(item);
            
            addEvents(
                item,
                'click',
                (evt) => {
                    
                    if(props.onChange)
                        props.onChange(img);
                    
                }
            );
            
        });
           
    }
    
    return scrollArea;
    
};

const ColorPanel = (fpdInstance, props) => {

    if(!props.colors) return;

    const colorPanel = document.createElement('div');
    colorPanel.className = 'fpd-color-panel';

    if(props.colors.length === 1) {
                    
        const colorPicker = ColorPicker({
            initialColor: props.colors[0],
            colorNames: fpdInstance.mainOptions.hexNames,
            palette: fpdInstance.mainOptions.colorPickerPalette,
            onMove: (hexColor) => {
                
                if(props.onMove)
                    props.onMove(hexColor);
                
            },
            onChange: (hexColor) => {

                if(props.onChange)
                    props.onChange(hexColor);
                                
            }
        });
        
        colorPanel.append(colorPicker);
                        
    }
    else {
        
        const colorPalette = ColorPalette({
            colors: props.colors, 
            colorNames: fpdInstance.mainOptions.hexNames,
            palette: fpdInstance.mainOptions.colorPickerPalette,
            onChange: (hexColor) => {
                
                if(props.onChange)
                    props.onChange(hexColor);
                
            }
        });
        
        colorPanel.append(colorPalette);
        
    }

    if(props.patterns) {
            
        const patternsPanel = Patterns({
            images: props.patterns,
            onChange: (patternImg) => {

                if(props.onPatternChange)
                    props.onPatternChange(patternImg);
                
            }
        });
        
        colorPanel.append(patternsPanel);
        
    }

    return colorPanel;

};

/**
*  area-sortable.js
*  A simple js class to sort elements of an area smoothly using drag-and-drop (desktop and mobile)
*  @VERSION: 1.2.2
*
*  https://github.com/foo123/area-sortable.js
*
**/
const r = function (root, name, factory) {
    const _f = factory();
    /*
    if ('object' === typeof exports)
        // CommonJS module
        module.exports = _f
    else if ('function' === typeof define && define.amd)
        // AMD. Register as an anonymous module.
        define(function (req) { return _f });
    else
        root[name] = _f;
    */
    return _f;
}('undefined' !== typeof self ? self : undefined, 'AreaSortable', function (undef) {

    var VERSION = '1.2.2', $ = '$areaSortable',
        RECT = 'rect', SCROLL = 'scroll', STYLE = 'style',
        MARGIN = 'margin', PADDING = 'padding',
        LEFT = 'left', RIGHT = 'right', WIDTH = 'width',
        TOP = 'top', BOTTOM = 'bottom', HEIGHT = 'height',
        NEXT = 'nextElementSibling', PREV = 'previousElementSibling',
        STOP = 'scrollTop', SLEFT = 'scrollLeft',
        VERTICAL = 1, HORIZONTAL = 2,
        UNRESTRICTED = VERTICAL + HORIZONTAL,
        stdMath = Math, Str = String, int = parseInt,
        hasProp = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString,
        trim_re = /^\s+|\s+$/g, mouse_evt = /mousedown|pointerdown/,
        trim = Str.prototype.trim
            ? function (s) { return s.trim(); }
            : function (s) { return s.replace(trim_re, ''); },
        eventOptionsSupported = null
        ;

    // add custom property to Element.prototype to avoid browser issues
    if (
        window.Element
        && !hasProp.call(window.Element.prototype, $)
    )
        window.Element.prototype[$] = null;

    function sign(x, signOfZero) {
        return 0 > x ? -1 : (0 < x ? 1 : (signOfZero || 0));
    }
    function is_callable(x) {
        return 'function' === typeof x;
    }
    function is_string(x) {
        return '[object String]' === toString.call(x);
    }
    function concat(a) {
        for (var i = 1, args = arguments, n = args.length; i < n; ++i)
            a.push.apply(a, args[i]);
        return a;
    }
    function throttle(f, interval) {
        var inThrottle = false;
        return function () {
            if (!inThrottle) {
                f.apply(this, arguments);
                inThrottle = true;
                setTimeout(function () { inThrottle = false; }, interval);
            }
        };
    }
    function hasEventOptions() {
        var passiveSupported = false, options = {};
        try {
            Object.defineProperty(options, 'passive', {
                get: function () {
                    passiveSupported = true;
                    return false;
                }
            });
            window.addEventListener('test', null, options);
            window.removeEventListener('test', null, options);
        } catch (e) {
            passiveSupported = false;
        }
        return passiveSupported;
    }
    function addEvent(target, event, handler, options) {
        if (null == eventOptionsSupported) eventOptionsSupported = hasEventOptions();
        if (target.attachEvent) target.attachEvent('on' + event, handler);
        else target.addEventListener(event, handler, eventOptionsSupported ? options : ('object' === typeof (options) ? !!options.capture : !!options));
    }
    function removeEvent(target, event, handler, options) {
        if (null == eventOptionsSupported) eventOptionsSupported = hasEventOptions();
        // if (el.removeEventListener) not working in IE11
        if (target.detachEvent) target.detachEvent('on' + event, handler);
        else target.removeEventListener(event, handler, eventOptionsSupported ? options : ('object' === typeof (options) ? !!options.capture : !!options));
    }
    function hasClass(el, className) {
        return el.classList
            ? el.classList.contains(className)
            : -1 !== (' ' + el.className + ' ').indexOf(' ' + className + ' ')
            ;
    }
    function addClass(el, className) {
        if (el.classList) el.classList.add(className);
        else if (!hasClass(el, className)) el.className = '' === el.className ? className : (el.className + ' ' + className);
    }
    function removeClass(el, className) {
        if (el.classList) el.classList.remove(className);
        else el.className = trim((' ' + el.className + ' ').replace(' ' + className + ' ', ' '));
    }
    function scrollingElement(document) {
        return document.scrollingElement || document.documentElement || document.body;
    }
    function canScroll(el, scrollAxis) {
        if (0 === el[scrollAxis]) {
            el[scrollAxis] = 1;
            if (1 === el[scrollAxis]) {
                el[scrollAxis] = 0;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }
    function computedStyle(el) {
        return (is_callable(window.getComputedStyle) ? window.getComputedStyle(el, null) : el.currentStyle) || {};
    }
    function elementsAt(document, x, y) {
        return document.elementsFromPoint(x, y);
    }
    function closestElement(el, className) {
        if (el.closest) return el.closest('.' + className);
        while (el) {
            if (hasClass(el, className)) return el;
            el = el.parentNode;
        }
    }
    function storeStyle(el, props) {
        return props.reduce(function (style, prop) {
            style[prop] = el[STYLE].getPropertyValue(prop);
            return style;
        }, {});
    }
    function restoreStyle(el, props, style) {
        style = style || el[$][STYLE];
        props.forEach(function (prop) {
            if (hasProp.call(style, prop) && ('' !== style[prop])) el[STYLE][prop] = style[prop];
            else el[STYLE].removeProperty(prop);
        });
    }
    function repaint(el) {
        return el.offsetWidth;
    }
    function animate(el, ms, offset) {
        if (0 < ms) {
            if (el[$] && el[$].animation) el[$].animation.stop();
            var trs = 'transform ' + Str(ms) + 'ms',
                trf = 'translate3d(0,0,0)',
                time = null,
                stop = function stop() {
                    if (time) clearTimeout(time);
                    time = null;
                    if (el[$] && el[$].animation && (stop === el[$].animation.stop)) el[$].animation = null;
                    if (el[STYLE].transform === trf && el[STYLE].transition === trs) {
                        el[STYLE].transition = 'none';
                        el[STYLE].transform = 'none';
                    }
                }
                ;
            el[STYLE].transition = 'none';
            el[STYLE].transform = 'translate3d(' + Str(-(offset[LEFT] || 0)) + 'px,' + Str(-(offset[TOP] || 0)) + 'px,0)';
            repaint(el);
            el[STYLE].transform = trf;
            el[STYLE].transition = trs;
            time = setTimeout(stop, ms);
            el[$].animation = { stop: stop };
        }
        return el;
    }
    function intersect1D(nodeA, nodeB, scroll, axis, size) {
        var rectA = nodeA[$].r, rectB = nodeB[$][RECT];
        return stdMath.max(
            0.0,
            stdMath.min(
                1.0,
                stdMath.max(
                    0,
                    stdMath.min(
                        rectA[axis] + rectA[size],
                        rectB[axis] - scroll[axis] + rectB[size]
                    )
                    -
                    stdMath.max(
                        rectA[axis],
                        rectB[axis] - scroll[axis]
                    )
                )
                /
                stdMath.min(
                    rectA[size],
                    rectB[size]
                )
            )
        );
    }
    function intersect2D(nodeA, nodeB, scroll, axis, size) {
        var rectA = nodeA[$].r, rectB = nodeB[$][RECT],
            overlapX = 0, overlapY = 0;
        overlapX = stdMath.max(
            0,
            stdMath.min(
                rectA[LEFT] + rectA[WIDTH],
                rectB[LEFT] - scroll[LEFT] + rectB[WIDTH]
            )
            -
            stdMath.max(
                rectA[LEFT],
                rectB[LEFT] - scroll[LEFT]
            )
        );
        overlapY = stdMath.max(
            0,
            stdMath.min(
                rectA[TOP] + rectA[HEIGHT],
                rectB[TOP] - scroll[TOP] + rectB[HEIGHT]
            )
            -
            stdMath.max(
                rectA[TOP],
                rectB[TOP] - scroll[TOP]
            )
        );
        return stdMath.max(
            0.0,
            stdMath.min(
                1.0,
                (overlapX * overlapY)
                /
                (
                    stdMath.min(
                        rectA[WIDTH],
                        rectB[WIDTH]
                    )
                    *
                    stdMath.min(
                        rectA[HEIGHT],
                        rectB[HEIGHT]
                    )
                )
            )
        );
    }
    function updateIndex(el, limit, dir, placeholder) {
        el = el[(0 > dir ? NEXT : PREV)];
        while (el) {
            if (el !== placeholder) el[$].index += (0 > dir ? 1 : -1);
            if (el === limit) return;
            el = el[(0 > dir ? NEXT : PREV)];
        }
    }
    function lineStart(el, line) {
        var next;
        //while ((el[$].line < line) && (next = el[NEXT])) el = next;
        while ((next = el[PREV]) && (next[$] && next[$].line >= line)) el = next;
        return el;
    }
    function layout1(el, line, parent, movedNode, placeholder, scroll, axis, size, axis_opposite) {
        // layout "horizontal" positions and lines
        // to compute which "visual" line {el} is placed
        // assume no absolute or fixed positioning
        // and row-first ordering instead of column-first (default browser element ordering)
        var runningEnd = 0, end;
        while (el) {
            if (el !== placeholder) {
                if (el[$] && el[$].animation) el[$].animation.stop();
                end = el[$][MARGIN][axis] + el[$][RECT][size] + el[$][MARGIN][axis_opposite];
                if ((0 < runningEnd) && (parent[$][PADDING][axis] + runningEnd + end + parent[$][PADDING][axis_opposite] > parent[$][RECT][size])) {
                    line++;
                    runningEnd = 0;
                }
                el[$].line = line;
                el[$].prev[axis] = el[$][RECT][axis];
                el[$][RECT][axis] = parent[$][RECT][axis] - parent[$][SCROLL][axis] + parent[$][PADDING][axis] + runningEnd + el[$][MARGIN][axis];
                (el === movedNode ? placeholder : el)[STYLE][axis] = Str(el[$][RECT][axis] - parent[$][RECT][axis] + parent[$][SCROLL][axis] - (el === movedNode ? 0 : el[$][MARGIN][axis])) + 'px';
                runningEnd += end;
            }
            el = el[NEXT];
        }
    }
    function layout2(el, lines, parent, movedNode, placeholder, scroll, axis, size, axis_opposite) {
        // layout "vertical" positions
        // to compute which "visual" line {el} is placed
        // assume no absolute or fixed positioning
        // and row-first ordering instead of column-first (default browser element ordering)
        var o = el, currentLine = el[$].line, lineSize = 0, line, lineTop, end;
        while (el) {
            if (el !== placeholder) {
                line = el[$].line;
                end = el[$][MARGIN][axis] + el[$][RECT][size] + el[$][MARGIN][axis_opposite];
                if (line === currentLine) {
                    lineSize = stdMath.max(lineSize, end);
                }
                else {
                    lines[line] = lines[currentLine] + lineSize;
                    currentLine = line;
                    lineSize = end;
                }
            }
            el = el[NEXT];
        }
        if (0 < lineSize) lines[currentLine + 1] = lines[currentLine] + lineSize;
        el = o;
        while (el) {
            if (el !== placeholder) {
                line = el[$].line;
                lineTop = lines[line];
                el[$].prev[axis] = el[$][RECT][axis];
                switch (el[$].$.verticalAlign) {
                    case 'bottom':
                        el[$][RECT][axis] = parent[$][RECT][axis] - parent[$][SCROLL][axis] + lines[line + 1] - el[$][RECT][size] - el[$][MARGIN][axis_opposite];
                        break;
                    case 'top':
                    default:
                        el[$][RECT][axis] = parent[$][RECT][axis] - parent[$][SCROLL][axis] + lineTop + el[$][MARGIN][axis];
                        break;
                }
                (el === movedNode ? placeholder : el)[STYLE][axis] = Str(el[$][RECT][axis] - (el === movedNode ? 0 : el[$][MARGIN][axis]) - parent[$][RECT][axis] + parent[$][SCROLL][axis]) + 'px';
            }
            el = el[NEXT];
        }
    }
    function computeScroll(parent, scrollParent) {
        return scrollParent ? {
            top: (scrollParent[STOP] - scrollParent[$][SCROLL].top0) || 0,
            left: (scrollParent[SLEFT] - scrollParent[$][SCROLL].left0) || 0
        } : {
            top: 0,
            left: 0
        };
    }

    function setup(self, TYPE) {
        var attached = false, canHandle = false, isDraggingStarted = false, isTouch = false,
            placeholder, dragged, handler, closest, dragTimer = null,
            first, last, items, lines, scrollEl, scrollParent, parent,
            X0, Y0, lastX, lastY, lastDeltaX, lastDeltaY, dirX, dirY, curX, curY,
            scrolling = null, scroll, dir, overlap, moved,
            delay = 60, fps = 60, dt = 1000 / fps, move, intersect, hasSymmetricItems = false,
            size = HORIZONTAL === TYPE ? WIDTH : HEIGHT,
            axis = HORIZONTAL === TYPE ? LEFT : TOP,
            axis_opposite = LEFT === axis ? RIGHT : BOTTOM, DOC
            ;

        var clear = function () {
            placeholder = null;
            dragged = null;
            handler = null;
            closest = null;
            first = null;
            last = null;
            scrollEl = null;
            scrollParent = null;
            parent = null;
            items = null;
            lines = null;
            DOC = null;
            moved = false;
            overlap = 0;
        };

        var prepare = function () {
            var line = 0, runningEnd = 0, axis = LEFT, size = WIDTH, axis_opposite = RIGHT,
                tag = (parent.tagName || '').toLowerCase();

            scrollEl = scrollingElement(DOC);
            scrollParent = null;
            if (self.options.autoscroll) {
                scrollParent = parent;
                while (scrollParent) {
                    if (
                        (scrollEl === scrollParent)
                        || ((HORIZONTAL !== TYPE)
                            && (scrollParent.scrollHeight > scrollParent.clientHeight)
                            && canScroll(scrollParent, STOP))
                        || ((VERTICAL !== TYPE)
                            && (scrollParent.scrollWidth > scrollParent.clientWidth)
                            && canScroll(scrollParent, SLEFT))
                    ) break;
                    scrollParent = scrollParent.parentNode;
                }
            }
            parent[$] = {
                rect: parent.getBoundingClientRect(),
                scroll: {
                    top: parent[STOP] || 0,
                    left: parent[SLEFT] || 0,
                    width: parent.scrollWidth,
                    height: parent.scrollHeight,
                    top0: parent[STOP] || 0,
                    left0: parent[SLEFT] || 0
                },
                $: computedStyle(parent),
                style: storeStyle(parent, ['width', 'height', 'max-width', 'max-height', 'box-sizing', 'padding-left', 'padding-top', 'padding-right', 'padding-bottom'])
            };
            parent[$][PADDING] = {
                left: int(parent[$].$.paddingLeft) || 0,
                right: int(parent[$].$.paddingRight) || 0
            };
            if (scrollParent && (scrollParent !== parent)) {

                scrollParent[$] = {
                    rect: scrollParent.getBoundingClientRect(),
                    scroll: {
                        top: scrollParent[STOP] || 0,
                        left: scrollParent[SLEFT] || 0,
                        width: scrollParent.scrollWidth,
                        height: scrollParent.scrollHeight,
                        top0: scrollParent[STOP] || 0,
                        left0: scrollParent[SLEFT] || 0
                    }
                };
            }
            items = [].map.call(parent.children, function (el, index) {
                var end, r = el.getBoundingClientRect(), style = computedStyle(el);
                el[$] = {
                    index: index,
                    line: 0,
                    prev: {},
                    rect: {
                        top: r[TOP],
                        left: r[LEFT],
                        width: r[WIDTH],
                        height: r[HEIGHT]
                    },
                    r: {
                        top: r[TOP],
                        left: r[LEFT],
                        width: r[WIDTH],
                        height: r[HEIGHT]
                    },
                    margin: {
                        top: int(style.marginTop) || 0,
                        right: int(style.marginRight) || 0,
                        bottom: int(style.marginBottom) || 0,
                        left: int(style.marginLeft) || 0
                    },
                    $: style,
                    style: storeStyle(el, [
                        'position',
                        'box-sizing',
                        'overflow',
                        'top',
                        'left',
                        'width',
                        'height',
                        'transform',
                        'transition'
                    ]),
                    animation: null
                };
                // to compute which "visual" line {el} is placed
                // assume no absolute or fixed positioning
                // and row-first ordering instead of column-first (default browser element ordering)
                end = el[$][MARGIN][axis] + el[$][RECT][size] + el[$][MARGIN][axis_opposite];
                // does not miss lines
                if ((0 < runningEnd) && (parent[$][PADDING][axis] + runningEnd + end + parent[$][PADDING][axis_opposite] > parent[$][RECT][size])) {
                    line++;
                    runningEnd = 0;
                }
                el[$].line = line;
                runningEnd += end /*+ mrg*/;
                //mrg += el[$][MARGIN][axis_opposite];
                return el;
            });
            if (items.length) {
                first = items[0];
                last = items[items.length - 1];
            }

            axis = TOP; size = HEIGHT; axis_opposite = BOTTOM;
            // at most so many lines as items, pre-allocate mem to avoid changing array size all the time
            lines = new Array(items.length);
            items.forEach(function (el) {
                // take 1st (highest) element of each line to define the visual line start position
                // take care of margin bottom/top collapse between siblings and parent/child
                var lineNum = el[$].line, lineStart = el[$][RECT][axis] - el[$][MARGIN][axis] - parent[$][RECT][axis] + parent[$][SCROLL][axis];
                lines[lineNum] = null == lines[lineNum] ? lineStart : stdMath.min(lineStart, lines[lineNum]);
            });

            addClass(parent, self.options.activeArea || 'dnd-sortable-area');
            parent[STYLE].boxSizing = 'border-box';
            parent[STYLE][WIDTH] = Str(parent[$][RECT][WIDTH]) + 'px';
            parent[STYLE][HEIGHT] = Str(parent[$][RECT][HEIGHT]) + 'px';
            parent[STYLE].maxWidth = Str(parent[$][RECT][WIDTH]) + 'px';
            parent[STYLE].maxHeight = Str(parent[$][RECT][HEIGHT]) + 'px';
            dragged.draggable = false; // disable native drag
            addClass(dragged, self.options.activeItem || 'dnd-sortable-dragged');
            hasSymmetricItems = true;
            items.forEach(function (el) {
                var ref = items[0];
                el[STYLE].position = 'absolute';
                el[STYLE].boxSizing = 'border-box';
                el[STYLE].overflow = 'hidden';
                el[STYLE][TOP] = Str(el[$][RECT][TOP] - parent[$][RECT][TOP] + parent[$][SCROLL][TOP] - el[$][MARGIN][TOP]) + 'px';
                el[STYLE][LEFT] = Str(el[$][RECT][LEFT] - parent[$][RECT][LEFT] + parent[$][SCROLL][LEFT] - el[$][MARGIN][LEFT]) + 'px';
                el[STYLE][WIDTH] = Str(el[$][RECT][WIDTH]) + 'px';
                el[STYLE][HEIGHT] = Str(el[$][RECT][HEIGHT]) + 'px';
                if (
                    (el[$][RECT][WIDTH] !== ref[$][RECT][WIDTH])
                    || (el[$][RECT][HEIGHT] !== ref[$][RECT][HEIGHT])
                    || (el[$][MARGIN][TOP] !== ref[$][MARGIN][TOP])
                    || (el[$][MARGIN][BOTTOM] !== ref[$][MARGIN][BOTTOM])
                    || (el[$][MARGIN][LEFT] !== ref[$][MARGIN][LEFT])
                    || (el[$][MARGIN][RIGHT] !== ref[$][MARGIN][RIGHT])
                )
                    hasSymmetricItems = false;
            });
            placeholder = DOC.createElement('ul' === tag || 'ol' === tag ? 'li' : ('tr' === tag ? 'td' : ('tbody' === tag || 'thead' === tag || 'tfoot' === tag || 'table' === tag ? 'tr' : 'span')));
            addClass(placeholder, self.options.placeholder || 'dnd-sortable-placeholder');
            placeholder[STYLE].position = 'absolute';
            placeholder[STYLE].display = 'block';
            placeholder[STYLE].boxSizing = 'border-box';
            placeholder[STYLE].margin = '0';
            if (parent === scrollParent) {
                // make parent keep its scroll dimensions
                parent[STYLE].paddingLeft = Str(parent[$][SCROLL][WIDTH] - parent[$][RECT][WIDTH]) + 'px';
                parent[STYLE].paddingTop = Str(parent[$][SCROLL][HEIGHT] - parent[$][RECT][HEIGHT]) + 'px';
                parent[STYLE].paddingRight = '0px';
                parent[STYLE].paddingBottom = '0px';
                parent[SLEFT] = parent[$][SCROLL][LEFT];
                parent[STOP] = parent[$][SCROLL][TOP];
            }
            if (isTouch) {
                addEvent(DOC, 'touchmove', dragMove, false);
                addEvent(DOC, 'touchend', dragEnd, false);
                addEvent(DOC, 'touchcancel', dragEnd, false);
            }
            else {
                addEvent(DOC, 'mousemove', dragMove, false);
                addEvent(DOC, 'mouseup', dragEnd, false);
            }
            dragTimer = setInterval(actualDragMove, delay);
        };

        var restore = function () {
            if (isDraggingStarted) {
                if (scrolling) {
                    clearInterval(scrolling);
                    scrolling = null;
                }
                if (isTouch) {
                    removeEvent(DOC, 'touchmove', dragMove, false);
                    removeEvent(DOC, 'touchend', dragEnd, false);
                    removeEvent(DOC, 'touchcancel', dragEnd, false);
                }
                else {
                    removeEvent(DOC, 'mousemove', dragMove, false);
                    removeEvent(DOC, 'mouseup', dragEnd, false);
                }
                if (dragTimer) {
                    clearInterval(dragTimer);
                    dragTimer = null;
                }
                if (placeholder && placeholder.parentNode) {
                    placeholder.parentNode.removeChild(placeholder);
                    placeholder[$] = null;
                }
                removeClass(parent, self.options.activeArea || 'dnd-sortable-area');
                restoreStyle(parent, ['width', 'height', 'max-width', 'max-height', 'box-sizing', 'padding-left', 'padding-top', 'padding-right', 'padding-bottom'], parent[$].style);
                if (closest) removeClass(closest, self.options.closestItem || 'dnd-sortable-closest');
                removeClass(dragged, self.options.activeItem || 'dnd-sortable-dragged');
                items.forEach(function (el) {
                    restoreStyle(el, [
                        'position',
                        'box-sizing',
                        'overflow',
                        'top',
                        'left',
                        'width',
                        'height',
                        'transform',
                        'transition'
                    ]);
                    /*if ('absolute' === el[$].$.position)
                    {
                        // item has probably moved, update the final position
                        el[STYLE][TOP] = Str(el[$][RECT][TOP] - parent[$][RECT][TOP] + parent[$][SCROLL][TOP] - el[$][MARGIN][TOP]) + 'px';
                        el[STYLE][LEFT] = Str(el[$][RECT][LEFT] - parent[$][RECT][LEFT] + parent[$][SCROLL][LEFT] - el[$][MARGIN][LEFT]) + 'px';
                    }
                    else if ('fixed' === el[$].$.position)
                    {
                        // item has probably moved, update the final position
                        el[STYLE][TOP] = Str(el[$][RECT][TOP] - el[$][MARGIN][TOP]) + 'px';
                        el[STYLE][LEFT] = Str(el[$][RECT][LEFT] - el[$][MARGIN][LEFT]) + 'px';
                    }*/
                    el[$] = null;
                });
                parent[$] = null;
                if (scrollParent) scrollParent[$] = null;
                isDraggingStarted = false;
            }
        };

        var moveTo = function (movedNode, refNode, dir) {
            if (0 > dir) {
                // Move `movedNode` before the `refNode`
                if (first === refNode) first = movedNode;
                if (last === movedNode) last = placeholder[PREV]; // placeholder is right before movedNode
                parent.insertBefore(movedNode, refNode);
            }
            else if (0 < dir) {
                // Move `movedNode` after the `refNode`
                if (first === movedNode) first = movedNode[NEXT];
                if (refNode[NEXT]) {
                    parent.insertBefore(movedNode, refNode[NEXT]);
                }
                else {
                    parent.appendChild(movedNode);
                    last = movedNode;
                }
            }
            movedNode[$].index = refNode[$].index;
            parent.insertBefore(placeholder, movedNode);

            if (is_callable(self.options.onChange))
                self.options.onChange(movedNode);

        };

        var move1D = function (movedNode, refNode, dir, ms) {
            var target = refNode, next, limitNode, offset, delta = 0, margin = 0;
            if (0 > dir) {
                limitNode = movedNode[NEXT];
                moveTo(movedNode, refNode, dir);
                movedNode[$].prev[axis] = movedNode[$][RECT][axis];
                margin = movedNode[$][MARGIN][axis] - refNode[$][MARGIN][axis];
                movedNode[$][RECT][axis] = refNode[$][RECT][axis] + margin;
                placeholder[STYLE][axis] = Str(movedNode[$][RECT][axis] - parent[$][RECT][axis] + parent[$][SCROLL][axis]) + 'px';
                delta = movedNode[$][RECT][size] - refNode[$][RECT][size];
                margin += movedNode[$][MARGIN][axis_opposite] - refNode[$][MARGIN][axis_opposite];
                while ((next = refNode[NEXT]) && (next !== limitNode)) {
                    if (refNode[$].animation) refNode[$].animation.stop();
                    refNode[$].index++;
                    refNode[$].prev[axis] = refNode[$][RECT][axis];
                    margin += refNode[$][MARGIN][axis] - next[$][MARGIN][axis];
                    refNode[$][RECT][axis] = next[$][RECT][axis] + delta + margin;
                    margin += refNode[$][MARGIN][axis_opposite] - next[$][MARGIN][axis_opposite];
                    refNode[STYLE][axis] = Str(refNode[$][RECT][axis] - parent[$][RECT][axis] + parent[$][SCROLL][axis] - refNode[$][MARGIN][axis]) + 'px';
                    delta += refNode[$][RECT][size] - next[$][RECT][size];
                    refNode = next;
                }
                if (refNode[$].animation) refNode[$].animation.stop();
                refNode[$].index++;
                refNode[$].prev[axis] = refNode[$][RECT][axis];
                refNode[$][RECT][axis] = movedNode[$].prev[axis] + delta + margin - movedNode[$][MARGIN][axis] + refNode[$][MARGIN][axis];
                refNode[STYLE][axis] = Str(refNode[$][RECT][axis] - parent[$][RECT][axis] + parent[$][SCROLL][axis] - refNode[$][MARGIN][axis]) + 'px';
            }
            else if (0 < dir) {
                limitNode = movedNode[NEXT];
                moveTo(movedNode, refNode, dir);
                refNode = limitNode;
                next = movedNode;
                margin = 0;
                delta = 0;
                next[$].prev[axis] = next[$][RECT][axis];
                do {
                    if (refNode[$].animation) refNode[$].animation.stop();
                    refNode[$].index--;
                    refNode[$].prev[axis] = refNode[$][RECT][axis];
                    margin += refNode[$][MARGIN][axis] - next[$][MARGIN][axis];
                    refNode[$][RECT][axis] = next[$].prev[axis] + delta + margin;
                    refNode[STYLE][axis] = Str(refNode[$][RECT][axis] - parent[$][RECT][axis] + parent[$][SCROLL][axis] - refNode[$][MARGIN][axis]) + 'px';
                    delta += -(next[$][RECT][size] - refNode[$][RECT][size]);
                    margin += refNode[$][MARGIN][axis_opposite] - next[$][MARGIN][axis_opposite];
                    next = refNode;
                    refNode = refNode[NEXT];
                }
                while ((refNode) && (refNode !== placeholder));
                movedNode[$][RECT][axis] = next[$].prev[axis] + delta + margin - next[$][MARGIN][axis] + movedNode[$][MARGIN][axis];
                placeholder[STYLE][axis] = Str(movedNode[$][RECT][axis] - parent[$][RECT][axis] + parent[$][SCROLL][axis]) + 'px';
            }
            offset = {};
            offset[axis] = target[$][RECT][axis] - target[$].prev[axis];
            animate(target, ms, offset);
        };

        var move2D = function (movedNode, refNode, dir, ms) {
            var target = refNode, line, next, limitNode;
            if (hasSymmetricItems) {
                // simpler, faster algorithm for symmetric items
                if (0 > dir) {
                    limitNode = movedNode[NEXT];
                    moveTo(movedNode, refNode, dir);
                    movedNode[$].prev.line = movedNode[$].line;
                    movedNode[$].prev[TOP] = movedNode[$][RECT][TOP];
                    movedNode[$].prev[LEFT] = movedNode[$][RECT][LEFT];
                    movedNode[$].line = refNode[$].line;
                    movedNode[$][RECT][TOP] = refNode[$][RECT][TOP];
                    movedNode[$][RECT][LEFT] = refNode[$][RECT][LEFT];
                    placeholder[STYLE][TOP] = Str(movedNode[$][RECT][TOP] - parent[$][RECT][TOP] + parent[$][SCROLL][TOP]) + 'px';
                    placeholder[STYLE][LEFT] = Str(movedNode[$][RECT][LEFT] - parent[$][RECT][LEFT] + parent[$][SCROLL][LEFT]) + 'px';
                    while ((next = refNode[NEXT]) && (next !== limitNode)) {
                        if (refNode[$].animation) refNode[$].animation.stop();
                        refNode[$].index++;
                        refNode[$].prev.line = refNode[$].line;
                        refNode[$].prev[TOP] = refNode[$][RECT][TOP];
                        refNode[$].prev[LEFT] = refNode[$][RECT][LEFT];
                        refNode[$].line = next[$].line;
                        refNode[$][RECT][TOP] = next[$][RECT][TOP];
                        refNode[$][RECT][LEFT] = next[$][RECT][LEFT];
                        refNode[STYLE][TOP] = Str(refNode[$][RECT][TOP] - parent[$][RECT][TOP] + parent[$][SCROLL][TOP] - refNode[$][MARGIN][TOP]) + 'px';
                        refNode[STYLE][LEFT] = Str(refNode[$][RECT][LEFT] - parent[$][RECT][LEFT] + parent[$][SCROLL][LEFT] - refNode[$][MARGIN][LEFT]) + 'px';
                        refNode = next;
                    }
                    if (refNode[$].animation) refNode[$].animation.stop();
                    refNode[$].index++;
                    refNode[$].prev.line = refNode[$].line;
                    refNode[$].prev[TOP] = refNode[$][RECT][TOP];
                    refNode[$].prev[LEFT] = refNode[$][RECT][LEFT];
                    refNode[$].line = movedNode[$].prev.line;
                    refNode[$][RECT][TOP] = movedNode[$].prev[TOP];
                    refNode[$][RECT][LEFT] = movedNode[$].prev[LEFT];
                    refNode[STYLE][TOP] = Str(refNode[$][RECT][TOP] - parent[$][RECT][TOP] + parent[$][SCROLL][TOP] - refNode[$][MARGIN][TOP]) + 'px';
                    refNode[STYLE][LEFT] = Str(refNode[$][RECT][LEFT] - parent[$][RECT][LEFT] + parent[$][SCROLL][LEFT] - refNode[$][MARGIN][LEFT]) + 'px';
                }
                else if (0 < dir) {
                    limitNode = movedNode[NEXT];
                    moveTo(movedNode, refNode, dir);
                    refNode = limitNode;
                    next = movedNode;
                    next[$].prev.line = next[$].line;
                    next[$].prev[TOP] = next[$][RECT][TOP];
                    next[$].prev[LEFT] = next[$][RECT][LEFT];
                    do {
                        if (refNode[$].animation) refNode[$].animation.stop();
                        refNode[$].index--;
                        refNode[$].prev.line = refNode[$].line;
                        refNode[$].prev[TOP] = refNode[$][RECT][TOP];
                        refNode[$].prev[LEFT] = refNode[$][RECT][LEFT];
                        refNode[$].line = next[$].prev.line;
                        refNode[$][RECT][TOP] = next[$].prev[TOP];
                        refNode[$][RECT][LEFT] = next[$].prev[LEFT];
                        refNode[STYLE][TOP] = Str(refNode[$][RECT][TOP] - parent[$][RECT][TOP] + parent[$][SCROLL][TOP] - refNode[$][MARGIN][TOP]) + 'px';
                        refNode[STYLE][LEFT] = Str(refNode[$][RECT][LEFT] - parent[$][RECT][LEFT] + parent[$][SCROLL][LEFT] - refNode[$][MARGIN][LEFT]) + 'px';
                        next = refNode;
                        refNode = refNode[NEXT];
                    }
                    while ((refNode) && (refNode !== placeholder));
                    movedNode[$].line = next[$].prev.line;
                    movedNode[$][RECT][TOP] = next[$].prev[TOP];
                    movedNode[$][RECT][LEFT] = next[$].prev[LEFT];
                    placeholder[STYLE][TOP] = Str(movedNode[$][RECT][TOP] - parent[$][RECT][TOP] + parent[$][SCROLL][TOP]) + 'px';
                    placeholder[STYLE][LEFT] = Str(movedNode[$][RECT][LEFT] - parent[$][RECT][LEFT] + parent[$][SCROLL][LEFT]) + 'px';
                }
                animate(target, ms, {
                    top: target[$][RECT][TOP] - target[$].prev[TOP],
                    left: target[$][RECT][LEFT] - target[$].prev[LEFT]
                });
            }
            else {
                // general algorithm for asymmetric items
                if (0 > dir) {
                    next = placeholder[PREV];
                    limitNode = refNode[PREV] || refNode;
                    moveTo(movedNode, refNode, dir);
                }
                else if (0 < dir) {
                    next = movedNode[NEXT];
                    limitNode = placeholder[PREV] || movedNode[NEXT];
                    moveTo(movedNode, refNode, dir);
                }
                updateIndex(movedNode, next, dir, placeholder);
                line = limitNode[$].line;
                limitNode = lineStart(limitNode, line);
                // update layout
                layout1(limitNode, line, parent, movedNode, placeholder, scroll, LEFT, WIDTH, RIGHT);
                layout2(limitNode, lines, parent, movedNode, placeholder, scroll, TOP, HEIGHT, BOTTOM);
                animate(target, ms, {
                    top: target[$][RECT][TOP] - target[$].prev[TOP],
                    left: target[$][RECT][LEFT] - target[$].prev[LEFT]
                });
            }
        };

        move = UNRESTRICTED === TYPE ? move2D : move1D;
        intersect = UNRESTRICTED === TYPE ? intersect2D : intersect1D;

        var dragStart = function (e) {
            if (!canHandle || isDraggingStarted || !self.options.container) return;
            // not with right click
            if (mouse_evt.test(e.type) && (0 !== e.button)) return;

            clear();

            handler = e.target;
            if (
                !handler
                || !hasClass(handler, self.options.handle || 'dnd-sortable-handle')
            ) {
                clear();
                return;
            }

            dragged = closestElement(handler, self.options.item || 'dnd-sortable-item');
            if (!dragged) {
                clear();
                return;
            }

            parent = dragged.parentNode;
            if (
                !parent
                || (is_string(self.options.container)
                    && (parent.id !== self.options.container))
                || (!is_string(self.options.container)
                    && (parent !== self.options.container))
            ) {
                clear();
                return;
            }

            if (is_callable(self.options.onStart))
                self.options.onStart(dragged);

            if (is_callable(self.options.itemFilter)) {
                dragged = self.options.itemFilter(dragged);
                if (!dragged) {
                    clear();
                    return;
                }
            }

            isDraggingStarted = true;
            DOC = dragged.ownerDocument || document;
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
            e.stopImmediatePropagation && e.stopImmediatePropagation();

            isTouch = e.touches && e.touches.length;

            prepare();

            curX = lastX = isTouch ? e.touches[0].clientX : e.clientX;
            curY = lastY = isTouch ? e.touches[0].clientY : e.clientY;
            X0 = lastX;
            Y0 = lastY;
            lastDeltaX = 0;
            lastDeltaY = 0;
            dirX = 0;
            dirY = 0;

            parent.insertBefore(placeholder, dragged);
            placeholder[STYLE][WIDTH] = Str(dragged[$][RECT][WIDTH]) + 'px';
            placeholder[STYLE][HEIGHT] = Str(dragged[$][RECT][HEIGHT]) + 'px';
            placeholder[STYLE][TOP] = Str(dragged[$][RECT][TOP] - parent[$][RECT][TOP] + parent[$][SCROLL][TOP]) + 'px';
            placeholder[STYLE][LEFT] = Str(dragged[$][RECT][LEFT] - parent[$][RECT][LEFT] + parent[$][SCROLL][LEFT]) + 'px';

            if (HORIZONTAL !== TYPE) dragged[STYLE][TOP] = Str(lastY - Y0 + dragged[$][RECT][TOP] - parent[$][RECT][TOP] + parent[$][SCROLL][TOP] - dragged[$][MARGIN][TOP]) + 'px';
            if (VERTICAL !== TYPE) dragged[STYLE][LEFT] = Str(lastX - X0 + dragged[$][RECT][LEFT] - parent[$][RECT][LEFT] + parent[$][SCROLL][LEFT] - dragged[$][MARGIN][LEFT]) + 'px';
        };

        var dragMove = throttle(function (e) {
            curX = isTouch ? e.touches[0].clientX : e.clientX;
            curY = isTouch ? e.touches[0].clientY : e.clientY;
        }, delay);

        var actualDragMove = function () {
            var hovered, p = 0.0, Y, X, deltaX, deltaY, delta, centerX, centerY,
                c = TOP, s = HEIGHT, zc = LEFT, zs = WIDTH, z,
                d = 25, d1, d2, d3, d4, sx, sy, tX = 0, tY = 0,
                changedDirX = false, changedDirY = false;

            if (VERTICAL === TYPE) {
                zc = TOP;
                zs = HEIGHT;
            }

            X = curX;
            Y = curY;
            deltaX = X - lastX;
            deltaY = Y - lastY;
            lastDeltaX = 0 === lastDeltaX ? deltaX : lastDeltaX;
            lastDeltaY = 0 === lastDeltaY ? deltaY : lastDeltaY;
            dirX = 0 !== deltaX ? sign(deltaX) : (0 !== lastDeltaX ? sign(lastDeltaX) : dirX);
            dirY = 0 !== deltaY ? sign(deltaY) : (0 !== lastDeltaY ? sign(lastDeltaY) : dirY);
            lastX = X;
            lastY = Y;

            scroll = computeScroll(parent, scrollParent);
            if (HORIZONTAL !== TYPE) {
                dragged[$].r[TOP] = lastY - Y0 + dragged[$][RECT][TOP];
                dragged[STYLE][TOP] = Str(dragged[$].r[TOP] - parent[$][RECT][TOP] + parent[$][SCROLL][TOP] - dragged[$][MARGIN][TOP] + scroll[TOP]) + 'px';
                changedDirY = 0 > deltaY * lastDeltaY;
            }
            if (VERTICAL !== TYPE) {
                dragged[$].r[LEFT] = lastX - X0 + dragged[$][RECT][LEFT];
                dragged[STYLE][LEFT] = Str(dragged[$].r[LEFT] - parent[$][RECT][LEFT] + parent[$][SCROLL][LEFT] - dragged[$][MARGIN][LEFT] + scroll[LEFT]) + 'px';
                changedDirX = 0 > deltaX * lastDeltaX;
            }

            if (self.options.autoscroll && scrollParent && (!scrolling || changedDirX || changedDirY)) {
                if (scrolling) {
                    clearInterval(scrolling);
                    scrolling = null;
                }
                if (scrollEl === scrollParent) {
                    d1 = scrollParent[$][RECT][WIDTH];
                    d2 = 0;
                    d3 = scrollParent[$][RECT][HEIGHT];
                    d4 = 0;
                    sx = 1.5;
                    sy = 1.5;
                }
                else {
                    d1 = scrollParent[$][RECT][RIGHT];
                    d2 = scrollParent[$][RECT][LEFT];
                    d3 = scrollParent[$][RECT][BOTTOM];
                    d4 = scrollParent[$][RECT][TOP];
                    sx = 1.2;
                    sy = 1.2;
                }
                if (
                    (VERTICAL !== TYPE)
                    && ((0 < dirX
                        && scrollParent[SLEFT] + scrollParent[$][RECT][WIDTH] < scrollParent[$][SCROLL][WIDTH]
                        && dragged[$].r[LEFT] + dragged[$].r[WIDTH] >= d1)
                        || (0 > dirX
                            && 0 < scrollParent[SLEFT]
                            && dragged[$].r[LEFT] <= d2))
                ) {
                    tX = stdMath.round(dirX * sx * dragged[$].r[WIDTH]);
                }
                if (
                    (HORIZONTAL !== TYPE)
                    && ((0 < dirY
                        && scrollParent[STOP] + scrollParent[$][RECT][HEIGHT] < scrollParent[$][SCROLL][HEIGHT]
                        && dragged[$].r[TOP] + dragged[$].r[HEIGHT] >= d3)
                        || (0 > dirY
                            && 0 < scrollParent[STOP]
                            && dragged[$].r[TOP] <= d4))
                ) {
                    tY = stdMath.round(dirY * sy * dragged[$].r[HEIGHT]);
                }
                if (tX || tY) scrolling = (function (tX, tY, tS, dt) {
                    var sT = scrollParent[STOP] || 0, sL = scrollParent[SLEFT] || 0,
                        duration = 0, vX = tX / (tS || dt), vY = tY / (tS || dt);
                    return setInterval(function () {
                        duration += dt;
                        sT += vY * dt;
                        sL += vX * dt;
                        scrollParent[STOP] = stdMath.min(stdMath.max(0, sT), scrollParent[$][SCROLL][HEIGHT] - scrollParent[$][RECT][HEIGHT]);
                        scrollParent[SLEFT] = stdMath.min(stdMath.max(0, sL), scrollParent[$][SCROLL][WIDTH] - scrollParent[$][RECT][WIDTH]);
                        if (scrolling && (duration >= tS)) {
                            clearInterval(scrolling);
                            scrolling = null;
                        }
                    }, dt);
                })(stdMath.abs(tX) > stdMath.abs(tY) ? tX : 0, stdMath.abs(tY) >= stdMath.abs(tX) ? tY : 0, self.options.scrollAnimationMs || 0, dt);
            }

            lastDeltaX = deltaX;
            lastDeltaY = deltaY;
            // correct
            centerX = dragged[$].r[LEFT] + dragged[$].r[WIDTH] / 2;
            centerY = dragged[$].r[TOP] + dragged[$].r[HEIGHT] / 2;
            z = dragged[$].r[zc];

            hovered = concat(
                elementsAt(DOC, X, Y), // current mouse pos
                VERTICAL === TYPE ? [] : elementsAt(DOC, dragged[$].r[LEFT] + 2, centerY), // left side
                VERTICAL === TYPE ? [] : elementsAt(DOC, dragged[$].r[LEFT] + dragged[$].r[WIDTH] - 2, centerY), // right side
                HORIZONTAL === TYPE ? [] : elementsAt(DOC, centerX, dragged[$].r[TOP] + 2), // top side
                HORIZONTAL === TYPE ? [] : elementsAt(DOC, centerX, dragged[$].r[TOP] + dragged[$].r[HEIGHT] - 2) // bottom side
            ).reduce(function (candidate, el) {
                if ((el !== dragged) && (el !== placeholder) && (el.parentNode === parent)) {
                    var pp = intersect(dragged, el, scroll, axis, size);
                    if (pp > p) {
                        p = pp;
                        candidate = el;
                    }
                }
                return candidate;
            }, null);


            if (UNRESTRICTED === TYPE) {
                if (
                    !hovered
                    && (dragged !== first)
                    && (0 <= first[$][RECT][zc] - scroll[zc] - (z + dragged[$][RECT][zs]))
                    && (first[$][RECT][zc] - scroll[zc] - (z + dragged[$][RECT][zs]) < d)
                    && (0.7 < (p = intersect1D(dragged, first, scroll, c, s)))
                )
                    hovered = first;

                if (
                    !hovered
                    && (dragged !== last)
                    && (0 <= z - (last[$][RECT][zc] - scroll[zc] + last[$][RECT][zs]))
                    && (z - (last[$][RECT][zc] - scroll[zc] + last[$][RECT][zs]) < d)
                    && (0.7 < (p = intersect1D(dragged, last, scroll, c, s)))
                )
                    hovered = last;

                delta = hovered ? hovered[$].index - dragged[$].index : (stdMath.abs(dirY) >= stdMath.abs(dirX) ? dirY : dirX);
            }
            else {
                if (
                    !hovered
                    && (dragged !== first)
                    && (first[$][RECT][zc] - scroll[zc] > (z + dragged[$][RECT][zs]))
                )
                    hovered = first;

                if (
                    !hovered
                    && (dragged !== last)
                    && (z > (last[$][RECT][zc] - scroll[zc] + last[$][RECT][zs]))
                )
                    hovered = last;

                delta = HORIZONTAL === TYPE ? dirX : dirY;
            }

            if (
                closest
                && (
                    (0 > dir && 0 < delta && overlap < 0.5)
                    || (0 < dir && 0 > delta && overlap < 0.5)
                    || (hovered && (closest !== hovered) && (overlap < p))
                    || (!intersect(dragged, closest, scroll, axis, size))
                )
            ) {
                removeClass(closest, self.options.closestItem || 'dnd-sortable-closest');
                overlap = 0; closest = null;
            }

            if (!closest && hovered && p) {
                closest = hovered;
                dir = 0 < delta ? 1 : -1;
                overlap = p;
                moved = false;
            }

            if (closest) {
                p = p || intersect(dragged, closest, scroll, axis, size);
                if (p) {
                    overlap = p;
                    if (p > 0.2) {
                        addClass(closest, self.options.closestItem || 'dnd-sortable-closest');
                        if ((p > 0.5) && !moved) {
                            X0 -= dragged[$][RECT][LEFT];
                            Y0 -= dragged[$][RECT][TOP];
                            moved = true;
                            move(dragged, closest, dir, self.options.animationMs || 0);
                            X0 += dragged[$][RECT][LEFT];
                            Y0 += dragged[$][RECT][TOP];
                        }
                    }
                    else {
                        removeClass(closest, self.options.closestItem || 'dnd-sortable-closest');
                    }
                }
                else {
                    removeClass(closest, self.options.closestItem || 'dnd-sortable-closest');
                    overlap = 0; closest = null;
                }
            }
        };

        var dragEnd = function (e) {
            var el = dragged;
            restore();
            clear();
            if (is_callable(self.options.onEnd))
                self.options.onEnd(el);
        };

        self.start = self.options.callable ? function () {
            if (canHandle) return;
            attached = false;
            canHandle = true;
            self.handle = dragStart;
        } : function () {
            if (canHandle) return;
            canHandle = true;
            if (!attached) {
                attached = true;
                addEvent(document, 'touchstart', dragStart, { capture: true, passive: false });
                addEvent(document, 'mousedown', dragStart, { capture: true, passive: false });
            }
        };

        self.stop = function () {
            self.handle = null;
            canHandle = false;
            if (attached) {
                removeEvent(document, 'touchstart', dragStart, { capture: true, passive: false });
                removeEvent(document, 'mousedown', dragStart, { capture: true, passive: false });
                attached = false;
            }
            restore();
            clear();
        };
    }

    function AreaSortable(type, options) {
        var self = this;
        if (!(self instanceof AreaSortable)) return new AreaSortable(type, options);
        self.options = options || {};
        type = Str(type);
        switch (type.toLowerCase()) {
            case 'unrestricted':
                setup(self, UNRESTRICTED);
                break;
            case 'horizontal':
                setup(self, HORIZONTAL);
                break;
            case 'vertical':
                setup(self, VERTICAL);
                break;
            default:
                throw new TypeError('AreaSortable invalid sort mode:' + type);
        }
        self.start();
    }
    AreaSortable.VERSION = VERSION;
    AreaSortable.prototype = {
        constructor: AreaSortable
        , options: null
        , start: null
        , handle: null
        , stop: null
        , dispose: function () {
            var self = this;
            if (self.stop) self.stop();
            self.options = null;
            self.start = null;
            self.handle = null;
            self.stop = null;
            return self;
        }
    };

    return AreaSortable;
});

class LayersModule extends EventTarget {
    
    #areaSortable = null;
    
    constructor(fpdInstance, wrapper) {
        
        super();
        
        this.fpdInstance = fpdInstance;
        
        this.container = document.createElement("fpd-module-manage-layers");
        wrapper.append(this.container);
        
        this.listElem = this.container.querySelector('.fpd-list');
        
        addEvents(
            fpdInstance,
            ['elementAdd', 'elementRemove', 'viewSelect', 'productCreate'], 
            (evt) => {
                
                if(fpdInstance.productCreated) {
                    this.#updateList();
                }
            }
        );

        addEvents(
            fpdInstance,
            ['elementModify', 'textLinkApply'], 
            (evt) => {
                
                if(fpdInstance.productCreated) {
                    
                    const {element, options} = evt.detail;
                    const rowElem = this.listElem.querySelector('.fpd-list-row[id="'+element.id+'"]');

                    if(rowElem) {
                        
                        const textInput = rowElem.querySelector('textarea');
                        if(options.text && textInput)
                            textInput.value =  options.text;

                    }

                }

            }
        );

        addEvents(
            fpdInstance,
            ['elementModify', 'elementChange'], 
            (evt) => {
                                
                if(fpdInstance.productCreated) {
                    
                    const {element, options, type} = evt.detail;

                    if((options && options.scaleX) || type == 'scaling') {
                        this.#updateSizeDisplay(element);
                    }
                    

                }

            }
        );

        addEvents(
            fpdInstance,
            'elementFillChange', 
            (evt) => {
                
                if(fpdInstance.productCreated) {

                    const element = evt.detail.element;
                    const rowElem = this.listElem.querySelector('.fpd-list-row[id="'+element.id+'"]');

                    if(rowElem && rowElem.querySelector('.fpd-current-color')) {
                        
                        rowElem.querySelector('.fpd-current-color').style.background = getBgCssFromElement(element);
                        
                    }
                    
                }
                
            }
        );
        
    }
    
    #updateList() {
        
        this.listElem.innerHTML = '';
                
        this.fpdInstance.getElements(this.fpdInstance.currentViewIndex, 'all', false)
        .forEach((element) => {
                        
            if(element.checkEditable()) {
                this.#appendLayerItem(element);
            }
        
        });
        
        if(this.#areaSortable) {
            this.#areaSortable.dispose();
        }
        
        this.#areaSortable = r('vertical', {
            container: this.listElem,
            handle: 'fpd-icon-reorder',
            item: 'fpd-list-row',
            placeholder: 'fpd-sortable-placeholder',
            activeItem: 'fpd-sortable-dragged',
            closestItem: 'fpd-sortable-closest',
            autoscroll: true,
            animationMs: 0,
            onStart: (item) => {
                
                // disable scroll
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
                window.onscroll = () => {
                    window.scrollTo({top: scrollTop});
                };
                
                
            },
            onChange: (item) => {
                    
                    const fabricCanvas = this.fpdInstance.currentViewInstance.fabricCanvas;
                    //get target element
                    const targetElement = fabricCanvas.getElementByID(item.id);
                    
                    //get index of related item depeding on sort direction
                    let closestItem = this.listElem.querySelector('.fpd-sortable-closest');
                    
                    const fabricElem = fabricCanvas.getElementByID(closestItem ? closestItem.id : item.id);
                    let newIndex = fabricElem.getZIndex();
                    
                    //no related item, use origin t of target and increase by one
                    if(!closestItem)
                        newIndex++;
                                        
                    fabricCanvas
                    .setElementOptions({z: newIndex}, targetElement);
                    
                
            },
            onEnd: (item)=> {
                
                window.onscroll = () => {};                
                
            }

        });
                
    }
    
    #appendLayerItem(element) {
        
        //create row node
        const rowElem = document.createElement('div');
        rowElem.className = 'fpd-list-row';
        rowElem.id = element.id;
        
        //create color selection
        let colorElem = document.createElement('span');
        let availableColors = null; //the amount of available colors of an object
                
        if(!element.uploadZone && element.hasColorSelection()) {
            
            availableColors = elementAvailableColors(element, this.fpdInstance);
            const cssBg = getBgCssFromElement(element); 
               
            colorElem.style.background = cssBg;
            colorElem.className = 'fpd-current-color';
            
            rowElem.colors = availableColors;
            
        }
        
        //create color wrapper
        const colorWrapper = document.createElement('div');
        colorWrapper.className = 'fpd-cell-0';
        colorWrapper.append(colorElem);
        rowElem.append(colorWrapper);
        
        //create label (textarea)
        let sourceContent = element.title;
        if(element.getType() === 'text' && element.editable) {
        
            sourceContent = document.createElement('textarea');
            sourceContent.value = element.text;
            
            addEvents(
                sourceContent,
                'keyup',
                (evt) => {
                    
                    evt.stopPropagation();
                    
                    let txt = evt.target.value;
                    txt = txt.replace(FancyProductDesigner.forbiddenTextChars, '');
                    
                    //remove emojis
                    if(this.fpdInstance.mainOptions.disableTextEmojis) {
                        txt = txt.replace(FPDEmojisRegex, '');
                        txt = txt.replace(String.fromCharCode(65039), ""); //fix: some emojis left a symbol with char code 65039
                    }
                    
                    this.fpdInstance.currentViewInstance.fabricCanvas.
                    setElementOptions({text: txt}, element);
                    
                }
            );
            
            //update input when text has changed
            element.on({
                'editing:exited': () => {
                    sourceContent.value = element.text;
                }
            });
        
        }
        
        const textWrapper = document.createElement('div');
        textWrapper.className = 'fpd-cell-1';
        textWrapper.append(sourceContent);

        if(element.isBitmap()) {

            const imgMetaWrapper = document.createElement('div');
            imgMetaWrapper.className = 'fpd-img-meta';
            imgMetaWrapper.innerHTML = 'W: <span data-prop="width"></span>H: <span data-prop="height"></span>';
            imgMetaWrapper.innerHTML += '<div class="fpd-dpi">DPI: <span data-prop="dpi"></span></div>';
            textWrapper.append(imgMetaWrapper);

        }

        rowElem.append(textWrapper);
        
        //create actions
        const actionsWrapper = document.createElement('div');
        actionsWrapper.className = 'fpd-cell-2';
        rowElem.append(actionsWrapper);
        
        if(element.uploadZone) {
            
            addElemClasses(
                rowElem,
                ['fpd-add-layer']
            );
            
            const addIcon = document.createElement('span');
            addIcon.className = 'fpd-icon-add';
            actionsWrapper.append(addIcon);
                
        }
        else {
            
            //z-sorting
            if(element.zChangeable) {
                
                const sortIcon = document.createElement('span');
                sortIcon.className = 'fpd-icon-reorder';
                actionsWrapper.append(sortIcon);
                
            }
            
            //lock/unlock element
            const lockClass = element.locked ? 'fpd-icon-locked' : 'fpd-icon-unlocked';     
            const lockIcon = document.createElement('span');
            lockIcon.className = 'fpd-lock-element';
            lockIcon.innerHTML = `<span class="${lockClass}"></span>`;
            actionsWrapper.append(lockIcon);
            
            addEvents(
                lockIcon,
                'click',
                (evt) => {
                    
                    evt.stopPropagation();
                    
                    removeElemClasses(
                        rowElem,
                        ['fpd-show-colors']
                    );
                    
                    element.evented = !element.evented;
                    element.locked = !element.evented;
                    
                    const lockSymbol = evt.currentTarget.querySelector('span');
                    toggleElemClasses(
                        lockSymbol,
                        ['fpd-icon-unlocked'],
                        element.evented
                    );
                    
                    toggleElemClasses(
                        lockSymbol,
                        ['fpd-icon-locked'],
                        !element.evented
                    );
                    
                    toggleElemClasses(
                        rowElem,
                        ['fpd-locked'],
                        !element.evented
                    );
                    
                }
            );
            
            toggleElemClasses(
                rowElem,
                ['fpd-locked'],
                element.locked
            );

            //toggle visbility
            const visibleClass = element.visible ? 'fpd-icon-eye-hide' : 'fpd-icon-eye';     
            const visibleElem = document.createElement('span');
            visibleElem.className = 'fpd-visible-element';
            visibleElem.innerHTML = `<span class="${visibleClass}"></span>`;
            actionsWrapper.append(visibleElem);

            addEvents(
                visibleElem,
                'click',
                (evt) => {

                    element.set('visible', !element.visible);
                    element.canvas.renderAll();
                    
                    toggleElemClasses(
                        visibleElem.querySelector('span'),
                        ['fpd-icon-eye-hide'],
                        element.visible
                    );
                    
                    toggleElemClasses(
                        visibleElem.querySelector('span'),
                        ['fpd-icon-eye'],
                        !element.visible
                    );

                }
            );
            
        }
        
        let enableRemove = element.removable || element.__editorMode;
        if(element.uploadZone)
            enableRemove = element.uploadZoneRemovable;
        
        if(enableRemove) {
            
            const removeIcon = document.createElement('span');
            removeIcon.className = 'fpd-remove-element';
            removeIcon.innerHTML = `<span class="fpd-icon-bin"></span>`;
            actionsWrapper.append(removeIcon);
            
            addEvents(
                removeIcon,
                'click',
                (evt) => {
                    
                    evt.stopPropagation();
                    this.fpdInstance.currentViewInstance.fabricCanvas.removeElement(element);
                    
                }
            );
            
        }
        
        this.listElem.prepend(rowElem);        
        
        let colorPanel;

        if(availableColors) {
            
            colorPanel = document.createElement('div');
                        
            //color panel for object group(multi-paths)
            if(element.type === 'group' && element.getObjects().length > 1) {
                
                const paletterPerPath = Array.isArray(element.colors)  && element.colors.length > 1;

                let colorPalette = ColorPalette({
                    colors: availableColors, 
                    colorNames: this.fpdInstance.mainOptions.hexNames,
                    palette: element.colors,
                    subPalette: paletterPerPath,
                    enablePicker: !paletterPerPath,
                    onChange: (hexColor, pathIndex) => {
                        
                        this.#updateGroupPath(element, pathIndex, hexColor);
                        
                        
                    },
                    //only for colorpicker per path
                    onMove: (hexColor, pathIndex) => {
                        
                        element.changeObjectColor(pathIndex, hexColor);
                        
                    },
                });
                
                colorPanel.append(colorPalette);
                
            }
            //color panel for text, png, svg with one path, path
            else {

                colorPanel = ColorPanel(this.fpdInstance, {
                    colors: availableColors,
                    patterns: Array.isArray(element.patterns) && (element.isSVG() || element.getType() === 'text') ? element.patterns : null,
                    onMove: (hexColor) => {
                                                
                        this.#updateElementColor(element, hexColor);
                        
                    },
                    onChange: (hexColor) => {
                        
                        this.#setElementColor(element, hexColor);
                        
                    },
                    onPatternChange: (patternImg) => {

                        rowElem.querySelector('.fpd-current-color')
                        .style.backgroundImage = `url("${patternImg}")`;
                        
                        this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
                            {pattern: patternImg}, 
                            element
                        );

                    }
                });
                
            }

            if(colorPanel) {

                addElemClasses(colorPanel, ['fpd-cell-full']);
                rowElem.append(colorPanel);

            }
            
            
            //show color options
            addEvents(
                rowElem.querySelector('.fpd-current-color'),
                'click', 
                (evt) => {
                    
                    const toggle = !rowElem.classList.contains('fpd-show-colors');
                    
                    removeElemClasses(
                        this.listElem.querySelectorAll('.fpd-list-row'),
                        ['fpd-show-colors'],
                    );
                    
                    toggleElemClasses(
                        rowElem,
                        ['fpd-show-colors'],
                        toggle
                    );
                }
            );
            
        }
        
        //select associated element on canvas when choosing one from the layers list
        addEvents(
            rowElem.querySelector('.fpd-cell-1'),
            'click',
            (evt) => {
                
                const row = evt.currentTarget.parentNode;
                
                if(row.classList.contains('fpd-locked') ||  evt.target.nodeName == 'TEXTAREA') {
                    return;
                }
                
                const targetElement = this.fpdInstance.currentViewInstance.fabricCanvas.getElementByID(row.id);
                if(targetElement) {

                    targetElement.canvas.setActiveObject(targetElement)
                    .renderAll();
                    
                }
                
            }
        );

        this.#updateSizeDisplay(element);
        
    }
    
    #updateElementColor(element, hexColor) {
        
        let elementType = element.isColorizable();
        
        if(elementType !== 'png') {
            element.changeColor(hexColor);
        }        
        
    }
    
    #setElementColor(element, hexColor) {

        const rowElem = this.listElem.querySelector('.fpd-list-row[id="'+element.id+'"]');

        if(rowElem && rowElem.querySelector('.fpd-current-color')) {

            rowElem.querySelector('.fpd-current-color').style.background = getBgCssFromElement(element);
            
        }
                
        this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({fill: hexColor}, element);
        
    }
    
    #updateGroupPath(element, pathIndex, hexColor) {
        
        const groupColors = element.changeObjectColor(pathIndex, hexColor);
        this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({fill: groupColors}, element);
        
    }

    #updateSizeDisplay(element) {

        const rowElem = this.listElem.querySelector('.fpd-list-row[id="'+element.id+'"]');

        if(rowElem && element.isBitmap()) {

            const imgSize = this.fpdInstance.calcDisplaySize(element);

            if(rowElem.querySelector('[data-prop="width"]')) {

                rowElem.querySelector('[data-prop="width"]').innerText = imgSize.width+imgSize.unit;
                rowElem.querySelector('[data-prop="height"]').innerText = imgSize.height+imgSize.unit;

            }

            if(imgSize.dpi) {

                rowElem.querySelector('[data-prop="dpi"]').innerText = imgSize.dpi;                

            }
            else {
                addElemClasses(rowElem, ['fpd-hide-dpi']);
            }

        }

    }

}

window.FPDLayersModule = LayersModule;

var html$6 = (
`<div data-moduleicon="fpd-icon-text-layers" data-defaulttext="Text Layers" data-title="modules.text_layers">
    <div class="fpd-scroll-area">
        <div class="fpd-list"></div>
    </div>
</div>`);

class TextLayersView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$6;
        
    }

}

customElements.define( 'fpd-module-text-layers', TextLayersView );

class TextLayersModule extends EventTarget {

    constructor(fpdInstance, wrapper) {

        super();

        this.fpdInstance = fpdInstance;

        this.container = document.createElement("fpd-module-text-layers");
        wrapper.append(this.container);

        this.listElem = this.container.querySelector('.fpd-list');

        addEvents(
            fpdInstance,
            ['elementAdd', 'elementRemove', 'viewSelect', 'productCreate'],
            (evt) => {

                if (fpdInstance.productCreated) {
                    this.#updateList();
                }
            }
        );

        addEvents(
            fpdInstance,
            ['elementModify', 'textLinkApply'],
            (evt) => {

                if (fpdInstance.productCreated) {

                    const { element, options } = evt.detail;
                    const rowElem = this.listElem.querySelector('.fpd-list-row[id="' + element.id + '"]');

                    if (rowElem) {

                        const fontSizeInput = rowElem.querySelector('[data-control="fontSize"]');
                        if (options.fontSize && fontSizeInput)
                            fontSizeInput.value = options.fontSize;

                        const fontFamilyDropdown = rowElem.querySelector('fpd-dropdown');
                        if (options.fontFamily && fontFamilyDropdown)
                            fontFamilyDropdown.setAttribute('value', options.fontFamily);

                        const textInput = rowElem.querySelector('.fpd-text-input');

                        if (options.text && textInput)
                            textInput.value = options.text;

                    }

                }

            }
        );

    }

    #updateList() {

        this.listElem.innerHTML = '';

        this.fpdInstance.getElements(this.fpdInstance.currentViewIndex, 'all', false)
            .forEach((element) => {

                if (element.checkEditable() && element.getType() == 'text') {
                    this.#appendLayerItem(element);
                }

            });

    }

    #createFontsDropdown(fonts, wrapper, element) {

        const fontsDropdown = document.createElement('fpd-dropdown');
        fontsDropdown.searchable = true;
        wrapper.append(fontsDropdown);

        const listArea = fontsDropdown.querySelector('.fpd-dropdown-list > .fpd-scroll-area');
        fonts.forEach((fontObj, i) => {

            if(!listArea) return;
            
            if (typeof fontObj == 'object') {
                fontObj = fontObj.name;
            }

            const fontItem = document.createElement('span');
            fontItem.className = 'fpd-item';
            fontItem.family = fontObj;
            fontItem.style.fontFamily = fontObj;
            fontItem.innerText = fontObj;
            fontItem.addEventListener('click', (evt) => {

                fontsDropdown.setAttribute('value', evt.currentTarget.innerText);

                this.fpdInstance.currentViewInstance.fabricCanvas.
                    setElementOptions({ fontFamily: fontObj }, element);

            });

            listArea.append(fontItem);

        });

        return fontsDropdown;

    }

    #appendLayerItem(element) {

        //create row node
        const rowElem = document.createElement('div');
        rowElem.className = 'fpd-list-row';
        rowElem.id = element.id;
        this.listElem.prepend(rowElem);

        if (element.editable) {

            //title display
            const titleElem = document.createElement('div');
            titleElem.className = 'fpd-cell-full fpd-title';
            titleElem.innerText = element.title;
            rowElem.append(titleElem);

            //text input
            const textWrapper = document.createElement('div');
            textWrapper.className = 'fpd-cell-full';
            rowElem.append(textWrapper);

            let textInput;
            if (element.maxLines == 1) {

                textInput = document.createElement('input');
                textInput.value = element.text;
                textWrapper.append(textInput);

            }
            else {

                textInput = document.createElement('textarea');
                textInput.value = element.text;
                if(element.maxLines)
                    textInput.rows = element.maxLines;
                textWrapper.append(textInput);

            }

            textInput.className = 'fpd-text-input';

            const textClear = document.createElement('span');
            textClear.className = 'fpd-clear-text';
            textClear.innerText = this.fpdInstance.translator.getTranslation('modules', 'text_layers_clear', 'Clear');
            textWrapper.append(textClear);

            addEvents(
                textClear,
                'click',
                (evt) => {

                    evt.stopPropagation();

                    this.fpdInstance.currentViewInstance.fabricCanvas.
                        setElementOptions({ text: '' }, element);

                    textInput.value = '';

                }
            );

            //update input when text has changed
            element.on({
                'editing:exited': () => {
                    textInput.value = element.text;
                },
            });

            addEvents(
                textInput,
                'keyup',
                (evt) => {

                    evt.stopPropagation();

                    let txt = evt.target.value;
                    txt = txt.replace(FancyProductDesigner.forbiddenTextChars, '');

                    //remove emojis
                    if (this.fpdInstance.mainOptions.disableTextEmojis) {
                        txt = txt.replace(FPDEmojisRegex, '');
                        txt = txt.replace(String.fromCharCode(65039), ""); //fix: some emojis left a symbol with char code 65039
                    }

                    this.fpdInstance.currentViewInstance.fabricCanvas.
                        setElementOptions({ text: txt }, element);

                }
            );

            //font-family
            const availableFonts = Array.isArray(this.fpdInstance.mainOptions.fonts) ? this.fpdInstance.mainOptions.fonts : [];
            if (availableFonts.length) {

                const fontsWrapper = document.createElement('div');
                fontsWrapper.className = 'fpd-cell-1';
                rowElem.append(fontsWrapper);

                const fontsDropdown = this.#createFontsDropdown(availableFonts, fontsWrapper, element);
                fontsDropdown.setAttribute('value', element.fontFamily);

            }

        }

        //font size
        if (element.resizable || element.__editorMode) {

            const fontSizeWrapper = document.createElement('div');
            fontSizeWrapper.className = 'fpd-cell-2';
            rowElem.append(fontSizeWrapper);

            const fontSizeInput = document.createElement('input');
            fontSizeInput.className = 'fpd-tooltip';
            fontSizeInput.setAttribute('aria-label', this.fpdInstance.translator.getTranslation('toolbar', 'font_size', 'Font Size'));
            fontSizeInput.type = 'number';
            fontSizeInput.value = element.fontSize;
            fontSizeInput.dataset.control = 'fontSize';
            fontSizeInput.min = element.minFontSize;
            fontSizeInput.max = element.maxFontSize;
            fontSizeWrapper.append(fontSizeInput);

            addEvents(
                fontSizeInput,
                'change',
                (evt) => {

                    this.fpdInstance.currentViewInstance.fabricCanvas.
                        setElementOptions({ fontSize: parseInt(evt.currentTarget.value) }, element);

                    fontSizeInput.value = element.fontSize;

                }
            );

        }

        //color panel
        if (element.hasColorSelection()) {

            const colorPanelWrapper = document.createElement('div');
            colorPanelWrapper.className = 'fpd-cell-full';
            rowElem.append(colorPanelWrapper);

            const availableColors = elementAvailableColors(element, this.fpdInstance);

            const colorPanel = ColorPanel(this.fpdInstance, {
                colors: availableColors,
                patterns: Array.isArray(element.patterns) && (element.isSVG() || element.getType() === 'text') ? element.patterns : null,
                onMove: (hexColor) => {

                    element.changeColor(hexColor);

                },
                onChange: (hexColor) => {

                    this.fpdInstance.currentViewInstance.fabricCanvas
                        .setElementOptions({ fill: hexColor }, element);

                },
                onPatternChange: (patternImg) => {

                    this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
                        { pattern: patternImg },
                        element
                    );

                }
            });

            if (colorPanel)
                colorPanelWrapper.append(colorPanel);

        }

    }

}

window.FPDTextLayersModule = TextLayersModule;

var html$5 = (
`<div data-moduleicon="fpd-icon-layouts" data-defaulttext="Layouts" data-title="modules.layouts">
    <div class="fpd-scroll-area">
        <div class="fpd-grid fpd-grid-contain fpd-padding"></div>
    </div>
</div>`);

class LayoutsView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$5;
        
    }

}

customElements.define( 'fpd-module-layouts', LayoutsView );

class LayoutsModule extends EventTarget {

    #layoutElementLoadingIndex = 0;
	#totalLayoutElements = 0;
    #toggleLoader = false;
        
    constructor(fpdInstance, wrapper) {
        
        super();
        
        this.fpdInstance = fpdInstance;
        
        this.container = document.createElement("fpd-module-layouts");
        wrapper.append(this.container);

        this.gridElem = this.container.querySelector('.fpd-grid');

        addEvents(
            fpdInstance,
            'layoutsSet',
            (evt) => {

                this.layoutsData = fpdInstance.currentLayouts;
                this.#setup();

            }
        );

        addEvents(
            this.fpdInstance,
            'beforeElementAdd',
            this.#loadingLayoutElement.bind(this)
        );

    }

    #loadingLayoutElement(evt) {

        const element = evt.detail.element;
        
        if(this.#toggleLoader) {

            this.#layoutElementLoadingIndex++;
            
            const loadElementState = element.title + '<br>' + String(this.#layoutElementLoadingIndex) + '/' + this.#totalLayoutElements;
            this.fpdInstance.mainLoader.querySelector('.fpd-loader-text').innerHTML = loadElementState;

        }

	};

    #setup() {

        this.gridElem.innerHTML = '';

        if(Array.isArray(this.layoutsData)) {            

            this.layoutsData.forEach(layoutObj => {
                
                const layoutItem = createImgThumbnail({
                    url: layoutObj.thumbnail,
                    title: layoutObj.title,
                    disablePrice: true,
                    disableDraggable: true
                });

                addEvents(
                    layoutItem,
                    'click',
                    (evt => {

                        if(!this.fpdInstance.productCreated) return;

                        var confirmModal = Modal(
                            this.fpdInstance.translator.getTranslation(
                                'modules', 
                                'layouts_confirm_replacement',
                                'Yes, please!'
                            ), 
                            false, 
                            'confirm', 
                            this.fpdInstance.container
                        );
                        
                        const confirmBtn = confirmModal.querySelector('.fpd-confirm');
                        confirmBtn.innerText = this.fpdInstance.translator.getTranslation(
                            'modules', 
                            'layouts_confirm_button',
                            'Sure?'
                        );                        
                                                                        
                        addEvents(
                            confirmBtn,
                            'click',
                            () => {

                                this.#layoutElementLoadingIndex = 0;
                                this.#totalLayoutElements = layoutObj.elements.length;

                                this.fpdInstance.globalCustomElements = [];
                                if(this.fpdInstance.mainOptions.replaceInitialElements) {
                                    this.fpdInstance.globalCustomElements = this.fpdInstance.getCustomElements();
                                }

                                this.fpdInstance.deselectElement();
                                this.fpdInstance.toggleSpinner(true);
                                this.#toggleLoader = true;

                                const relevantOptions = {};
                                if(isPlainObject(layoutObj.options)) {

                                    FancyProductDesignerView.relevantOptions.forEach(key =>  {

                                        if(typeof layoutObj.options[key] !== 'undefined') {
                                            relevantOptions[key] = layoutObj.options[key];
                                        }
                                        
                                    });
                                    
                                }

                                this.fpdInstance.currentViewInstance.options = {...this.fpdInstance.currentViewInstance.options, ...relevantOptions};
                                this.fpdInstance.currentViewInstance.fabricCanvas.viewOptions = this.fpdInstance.currentViewInstance.options;

                                this.fpdInstance.currentViewInstance.loadElements(layoutObj.elements, () => {

                                    this.#toggleLoader = false;
                                    this.fpdInstance.toggleSpinner(false);
                                    
                                    /**
                                     * Gets fired when a all elements of layout are added.
                                     *
                                     * @event FancyProductDesigner#layoutElementsAdded
                                     * @param {Event} event
                                     * @param {Array} elements - Added elements.
                                     */
                                    this.fpdInstance.dispatchEvent(
                                        new CustomEvent('layoutElementsAdded', {
                                            detail: {
                                                layoutView: layoutObj
                                            }
                                        })
                                    );

                                    this.fpdInstance.currentViewInstance.fabricCanvas._renderPrintingBox();
                                    this.fpdInstance.currentViewInstance.fabricCanvas.resetSize();

                                });
                                
                                confirmModal.remove();
                                
                            }
                        );
                        
                        
                    })
                );

                this.gridElem.append(layoutItem);
                this.fpdInstance.lazyBackgroundObserver.observe(layoutItem.querySelector('picture'));
                

            });

        }
        

    }

}
    
window.FPDLayoutsModule = LayoutsModule;

var html$4 = (
`<div 
    data-moduleicon="fpd-icon-name-number" 
    data-defaulttext="Names & Numbers" 
    data-title="modules.names_numbers"
>
    <div class="fpd-head">
        <span class="fpd-btn" data-defaulttext="Add New">modules.names_numbers_add_new</span>
    </div>
    <div class="fpd-scroll-area">
        <div class="fpd-list"></div>
    </div>
</div>`);

class NamesNumbersView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$4;
        
    }

}

customElements.define( 'fpd-module-names-numbers', NamesNumbersView );

class NamesNumbersModule extends EventTarget {
        
    constructor(fpdInstance, wrapper) {
        
        super();
        
        this.fpdInstance = fpdInstance;
        
        this.container = document.createElement("fpd-module-names-numbers");
        wrapper.append(this.container);

        this.listElem = this.container.querySelector('.fpd-list');

        addEvents(
            fpdInstance,
            'viewSelect',
            (evt) => {

                this.#updateList();

            }
        );

        addEvents(
            this.container.querySelector('.fpd-btn'),
            'click',
            (evt) => {

                const rowElem = this.#addRow();
			    this.#selectRow(rowElem);
                
			    fpdInstance.currentViewInstance.names_numbers = this.getViewNamesNumbers();

                if(fpdInstance.mainOptions.namesNumbersEntryPrice) {

                    fpdInstance.currentViewInstance.changePrice(
                        fpdInstance.mainOptions.namesNumbersEntryPrice, 
                        '+'
                    );
        
                }

            }
        );

    }

    #selectRow(rowElem) {

        rowElem.querySelector('input').focus();
        
        const numberCol = rowElem.querySelector('.fpd-number-col');
        if(numberCol) {
            this.#setPlaceholderText(
                numberCol.querySelector('input').value || numberCol.querySelector('input').placeholder
            );
        }

        const nameCol = rowElem.querySelector('.fpd-name-col');
        if(nameCol) {
            this.#setPlaceholderText(
                null,
                nameCol.querySelector('input').value || nameCol.querySelector('input').placeholder
            );
        }

    }

    #updateList() {

        this.listElem.innerHTML = '';

        const viewInst = this.fpdInstance.currentViewInstance;

        if(viewInst.fabricCanvas.textPlaceholder || viewInst.fabricCanvas.numberPlaceholder) {
                        
			if(viewInst.names_numbers && Array.isArray(viewInst.names_numbers)) {

                viewInst.names_numbers.forEach(nnData => {

                    this.#addRow(nnData.number, nnData.name, nnData.select);

                });

			}
			else {
				this.#addRow();
			}

            removeElemClasses(this.container, ['fpd-disabled']);

		}
        else {
            addElemClasses(this.container, ['fpd-disabled']);
        }

    }

    #addRow(number='', name='', selectVal) {

        const viewInst = this.fpdInstance.currentViewInstance;
        const fCanvas = viewInst.fabricCanvas;

        const rowElem = document.createElement('div');
        rowElem.className = 'fpd-row';

        const removeColumn = document.createElement('div');
        removeColumn.className = 'fpd-remove-col';

        const removeElem = document.createElement('span');
        removeElem.innerText = this.fpdInstance.translator.getTranslation('modules', 'names_numbers_remove', 'Remove');
        removeColumn.append(removeElem);

        addEvents(
            removeElem,
            'click',
            (evt) => {

                rowElem.remove();
                
                this.#selectRow(this.container.querySelector('.fpd-row:first-child'));

                this.fpdInstance.currentViewInstance.names_numbers = this.getViewNamesNumbers();
                
				if(this.fpdInstance.mainOptions.namesNumbersEntryPrice) {

                    this.fpdInstance.currentViewInstance.changePrice(
                        this.fpdInstance.mainOptions.namesNumbersEntryPrice, 
                        '-'
                    );
        
                }

            }
        );

        rowElem.append(removeColumn);

        if(fCanvas.numberPlaceholder)
            rowElem.append(this.#createNumberCol(number));

        if(fCanvas.textPlaceholder)
            rowElem.append(this.#createNameCol(name));

        if((this.fpdInstance.mainOptions.namesNumbersDropdown 
            && this.fpdInstance.mainOptions.namesNumbersDropdown.length > 0) 
            || selectVal
        ) {
            rowElem.append(this.#createDropdown(selectVal));
        }

        this.listElem.append(rowElem);
                
        return rowElem;

    }

    #createNumberCol(defaultValue='') {

        const viewInst = this.fpdInstance.currentViewInstance;
        const fCanvas = viewInst.fabricCanvas;

        const column = document.createElement('div');
        column.className = 'fpd-number-col fpd-input-col';

        const inputElem = document.createElement('input');
        inputElem.type = 'number';
        column.append(inputElem);
        
        if(Array.isArray(fCanvas.numberPlaceholder.numberPlaceholder)) {
            inputElem.setAttribute('min', Number(fCanvas.numberPlaceholder.numberPlaceholder[0]));
            inputElem.setAttribute('max', Number(fCanvas.numberPlaceholder.numberPlaceholder[1]));
        }

        inputElem.setAttribute('placeholder', fCanvas.numberPlaceholder.originParams.text);
        inputElem.value = defaultValue;

        addEvents(
            inputElem,
            ['mouseup', 'keyup'],
            (evt) => {
                
                //check if min/max limits are set and apply
                if(Array.isArray(fCanvas.numberPlaceholder.numberPlaceholder)) {

                    if( inputElem.value > Number(inputElem.max) ) {
                        inputElem.value = Number(inputElem.max);
                    }

                    if( inputElem.value < Number(inputElem.min) ) {
                        inputElem.value = Number(inputElem.min);
                    }

                }      

                inputElem.value = this.#setPlaceholderText(inputElem.value);
                this.fpdInstance.currentViewInstance.names_numbers = this.getViewNamesNumbers();                

            }
        );

        return column;
    }

    #createNameCol(defaultValue='') {

        const viewInst = this.fpdInstance.currentViewInstance;
        const fCanvas = viewInst.fabricCanvas;

        const column = document.createElement('div');
        column.className = 'fpd-name-col fpd-input-col';

        const inputElem = document.createElement('input');
        inputElem.type = 'text';
        column.append(inputElem);

        inputElem.setAttribute('placeholder', fCanvas.textPlaceholder.originParams.text);
        inputElem.value = defaultValue;

        addEvents(
            inputElem,
            ['mouseup', 'keyup'],
            (evt) => {

                inputElem.value = this.#setPlaceholderText(null, inputElem.value);
                this.fpdInstance.currentViewInstance.names_numbers = this.getViewNamesNumbers();
                

            }
        );

        return column;
    }

    #createDropdown(selectVal='') {

        const column = document.createElement('div');
        column.className = 'fpd-select-col fpd-input-col';

        const selectElem = document.createElement('select');
        column.append(selectElem);

        let selectValArr = [selectVal],
            dropdownProps = this.fpdInstance.mainOptions.namesNumbersDropdown.length > 0 ? this.fpdInstance.mainOptions.namesNumbersDropdown : selectValArr;

        dropdownProps.forEach(prop => {
            
            const optionElem = document.createElement('option');
            optionElem.value = prop;
            optionElem.selected = selectVal === prop;
            optionElem.innerText = prop;
            selectElem.append(optionElem);

        });

        addEvents(
            selectElem,
            'change',
            (evt) => {

                this.fpdInstance.currentViewInstance.names_numbers = this.getViewNamesNumbers();
                

            }
        );

        return column;
    }

    #setPlaceholderText(number=null, name=null) {

        const viewInst = this.fpdInstance.currentViewInstance;
        const fCanvas = viewInst.fabricCanvas;
        const fElem = typeof number == 'string' ? fCanvas.numberPlaceholder : fCanvas.textPlaceholder;
        let value = typeof number == 'string' ? number : name;

        const targetMaxLength = fElem.maxLength;

        if(targetMaxLength != 0 && value.length > targetMaxLength) {
            value = value.substr(0, targetMaxLength);
        }

        value = value.replace(FancyProductDesigner.forbiddenTextChars, '');
            
        //remove emojis
        if(this.fpdInstance.mainOptions.disableTextEmojis) {
            value = value.replace(FPDEmojisRegex, '');
            value = value.replace(String.fromCharCode(65039), ""); //fix: some emojis left a symbol with char code 65039
        }

        fCanvas.setElementOptions({text: value}, fElem);
        
        return value;

    }

    getViewNamesNumbers() {

		let nnArr = [];

		this.container.querySelectorAll('.fpd-list .fpd-row').forEach((row) => {

			let rowObj = {};

            const numberCol = row.querySelector('.fpd-number-col');
			if(numberCol) {
				rowObj.number = numberCol.querySelector('input').value;
			}

            const nameCol = row.querySelector('.fpd-name-col');
			if(nameCol) {
				rowObj.name = nameCol.querySelector('input').value;
			}

            const selectCol = row.querySelector('.fpd-select-col');
			if(selectCol) {
				rowObj.select = selectCol.querySelector('select').value;
			}

			nnArr.push(rowObj);

		});

		return nnArr;

	}

}

window.FPDNamesNumbersModule = NamesNumbersModule;

class ModuleWrapper extends EventTarget {
    
    constructor(fpdInstance, wrapper, moduleKey) {
        
        super();
        
        let moduleInstance;        
                
        if(moduleKey === 'products') {
            moduleInstance = new ProductsModule(fpdInstance, wrapper);
        }
        else if(moduleKey === 'text') {
            moduleInstance = new TextsModule(fpdInstance, wrapper);
        }
        else if(moduleKey.includes('designs')) {
            
            let dynamicDesignId = null;
            if(moduleKey.includes('designs_')) {
        
                if(!isEmpty(fpdInstance.mainOptions.dynamicDesigns)) {
        
                    dynamicDesignId = moduleKey.split('_').pop();
        
                    if(dynamicDesignId && fpdInstance.mainOptions.dynamicDesigns[dynamicDesignId]) {
        
                        var dynamicDesignConfig = fpdInstance.mainOptions.dynamicDesigns[dynamicDesignId];
                        
                        const moduleAttrs = {};
                        moduleAttrs['data-dynamic-designs-id'] = dynamicDesignId;
                        
                        this.configs = {
                            icon: !isEmpty(dynamicDesignConfig.icon) && dynamicDesignConfig.icon.includes('.svg') ? dynamicDesignConfig.icon : 'fpd-icon-design-library',
                            defaultText: dynamicDesignConfig.name,
                            attrs: moduleAttrs
                        };                         
        
                    }
                    else { //dynamic designs module does not exist
                        return;
                    }
                }
        
            }
            
            moduleInstance = new DesignsModule(fpdInstance, wrapper, dynamicDesignId);
        }
        else if(moduleKey === 'images') {
            moduleInstance = new ImagesModule(fpdInstance, wrapper);
        }
        else if(moduleKey === 'manage-layers') {
            moduleInstance = new LayersModule(fpdInstance, wrapper);
        }
        else if(moduleKey === 'save-load') {
            moduleInstance = new SaveLoadModule(fpdInstance, wrapper);            
        }
        else if(moduleKey === 'text-layers') {
            moduleInstance = new TextLayersModule(fpdInstance, wrapper);            
        }
        else if(moduleKey === 'layouts') {
            moduleInstance = new LayoutsModule(fpdInstance, wrapper);
        }
        else if(moduleKey === 'names-numbers') {
            moduleInstance = new NamesNumbersModule(fpdInstance, wrapper);
        }
        // else if(moduleKey === 'drawing') {
        //     moduleInstance = new FPDDrawingModule(this.fpdInstance, $moduleClone);
        // }

        //additional custom modules: add your own modules
        //example: FancyProductDesigner.additionalModules = {'module-key': ModuleClass}
        if(FancyProductDesigner.additionalModules && !moduleInstance) {

            const ClassModule = FancyProductDesigner.additionalModules[moduleKey];            
            if(ClassModule)
                moduleInstance = new ClassModule(fpdInstance, wrapper);
            
        }        
        
        if(!moduleInstance) { return; }
        
        this.moduleInstance = moduleInstance;
        fpdInstance['moduleInstance_'+moduleKey] = moduleInstance;
        
        //store module configs
        if(!moduleKey.includes('designs_')) {
            
            const configsElem = moduleInstance.container.querySelector('div');
            this.configs = {
                icon: configsElem.dataset.moduleicon,
                langId: configsElem.dataset.title,
                langKeys: configsElem.dataset.title.split('.'),
                defaultText: configsElem.dataset.defaulttext
            };
            
        }
 
    }

}

class Mainbar extends EventTarget {
	static availableModules = [
		"products",
		"images",
		"text",
		"designs",
		"manage-layers",
		"text-layers",
		"layouts",
		"save-load",
		"names-numbers",
	];

	#dialogContainer = null;
	#draggableDialog = null;
	#isDragging = false;
	#dragX = 0;
	#dragY = 0;
	#diffX = 0;
	#diffY = 0;
	#draggableDialogEnabled = false;
	#offCanvasEnabled = false;
	contentElem = null;
	navElem = null;
	currentModuleKey = "";
	currentModules = [];

	constructor(fpdInstance) {
		super();

		this.fpdInstance = fpdInstance;

		const fpdContainer = fpdInstance.container;

		this.container = document.createElement("fpd-main-bar");
		if (fpdInstance.mainOptions.mainBarContainer && !fpdInstance.mainOptions.modalMode) {
			const mainBarWrapper = document.querySelector(fpdInstance.mainOptions.mainBarContainer);
			if (mainBarWrapper) {
				removeElemClasses(fpdContainer, ["fpd-off-canvas", "fpd-topbar"]);

				addElemClasses(fpdContainer, ["fpd-main-bar-container-enabled", "fpd-sidebar"]);

				addElemClasses(mainBarWrapper, ["fpd-container", "fpd-main-bar-container", "fpd-sidebar"]);

				mainBarWrapper.append(this.container);
			} else {
				fpdContainer.append(this.container);
			}
		} else {
			fpdContainer.append(this.container);
		}

		this.contentElem = this.container.querySelector(".fpd-module-content");
		this.navElem = this.container.querySelector(".fpd-navigation");
		this.secContent = this.container.querySelector(".fpd-secondary-content");

		//draggable dialog
		this.#dialogContainer = document.querySelector(
			this.fpdInstance.mainOptions.modalMode ? ".fpd-modal-product-designer" : "body"
		);

		this.#draggableDialog = document.querySelector(".fpd-draggable-dialog");
		this.#dialogContainer.append(this.#draggableDialog);

		//prevent right click context menu & document scrolling when in dialog content
		// addEvents(
		//     this.#draggableDialog,
		//     ['contextmenu'],
		//     evt => evt.preventDefault()
		// )

		addEvents(this.#draggableDialog, ["mousedown", "touchstart"], this.#draggableDialogStart.bind(this));

		addEvents(document, ["mouseup", "touchend"], this.#draggableDialogEnd.bind(this));

		addEvents(document, ["mousemove", "touchmove"], this.#draggableDialogMove.bind(this));

		addEvents(
			this.#draggableDialog.querySelector(".fpd-close-dialog"),
			["click", "touchstart"],
			this.#closeDialog.bind(this)
		);

		addEvents(this.container.querySelector(".fpd-close"), ["click", "touchmove"], this.#closeDialog.bind(this));

		addEvents(fpdInstance, "viewSelect", this.#viewSelected.bind(this));

		if (fpdContainer.classList.contains("fpd-off-canvas")) {
			let touchStartX = 0,
				touchStartY = 0,
				diffX = 0;

			this.contentElem.addEventListener("touchstart", (evt) => {
				touchStartX = evt.touches[0].pageX;
				touchStartY = evt.touches[0].pageY;
				addElemClasses(this.container, ["fpd-is-dragging"]);
			});

			this.contentElem.addEventListener("touchmove", (evt) => {
				let moveX = evt.touches[0].pageX;
				let moveY = evt.touches[0].pageY;

				diffX = touchStartX - moveX;
				let diffY = touchStartY - moveY;

				if (Math.abs(diffX) > Math.abs(diffY)) {
					diffX = Math.abs(diffX) < 0 ? 0 : Math.abs(diffX);
					this.contentElem.style.left = -diffX + "px";
					this.contentElem.previousElementSibling.style.left = this.contentElem.clientWidth - diffX + "px";

					evt.preventDefault();
				}
			});

			this.contentElem.addEventListener("touchend", (evt) => {
				if (Math.abs(diffX) > 100) {
					this.toggleContentDisplay(false);
				} else {
					this.contentElem.style.left = "0px";
					this.contentElem.previousElementSibling.style.left = this.contentElem.clientWidth + "px";
				}

				diffX = 0;
				removeElemClasses(this.container, ["fpd-is-dragging"]);
			});
		}

		this.updateContentWrapper();
		this.setup(fpdInstance.mainOptions.mainBarModules);
		this.fpdInstance.translator.translateArea(this.container);

		if (this.#draggableDialogEnabled) {
			this.fpdInstance.translator.translateArea(this.#draggableDialog);
		}
	}

	#draggableDialogStart(evt) {
		if (this.#draggableDialog.querySelector(".fpd-dialog-drag-handle").contains(evt.target)) {
			evt.preventDefault();

			this.#isDragging = true;

			this.#dragX = evt.touches ? event.touches[0].clientX : evt.clientX;
			this.#dragY = evt.touches ? event.touches[0].clientY : evt.clientY;
			this.#diffX = this.#dragX - this.#draggableDialog.offsetLeft;
			this.#diffY = this.#dragY - this.#draggableDialog.offsetTop;
		}
	}

	#draggableDialogMove(evt) {
		if (!this.#isDragging) return;

		const containerWidth =
			this.#dialogContainer.clientWidth < window.innerWidth
				? window.innerWidth
				: this.#dialogContainer.clientWidth;
		const containerHeight =
			this.#dialogContainer.clientHeight < window.innerHeight
				? window.innerHeight
				: this.#dialogContainer.clientHeight;
		const rightBarrier = containerWidth - this.#draggableDialog.clientWidth;
		const bottomBarrier = containerHeight - this.#draggableDialog.clientHeight;

		const newMouseX = evt.touches ? event.touches[0].clientX : evt.clientX;
		const newMouseY = evt.touches ? event.touches[0].clientY : evt.clientY;

		let newElmTop = newMouseY - this.#diffY;
		let newElmLeft = newMouseX - this.#diffX;

		if (newElmLeft < 0) {
			newElmLeft = 0;
		}
		if (newElmTop < 0) {
			newElmTop = 0;
		}
		if (newElmLeft > rightBarrier) {
			newElmLeft = rightBarrier;
		}
		if (newElmTop > bottomBarrier) {
			newElmTop = bottomBarrier;
		}

		this.#draggableDialog.style.top = newElmTop + "px";
		this.#draggableDialog.style.left = newElmLeft + "px";
	}

	#draggableDialogEnd(evt) {
		this.#isDragging = false;
	}

	#navItemSelect(evt) {
		evt.stopPropagation();

		this.fpdInstance.deselectElement();

		if (this.fpdInstance.currentViewInstance) {
			this.fpdInstance.currentViewInstance.currentUploadZone = null;
		}

		// hide dialog when clicking on active nav item
		if (evt.currentTarget.classList.contains("fpd-active") && this.contentClosable) {
			this.toggleContentDisplay(false);
		} else {
			this.callModule(evt.currentTarget.dataset.module, evt.currentTarget.dataset.dynamicDesignsId);
		}

		this.fpdInstance.dispatchEvent(
			new CustomEvent("navItemSelect", {
				detail: {
					item: evt.currentTarget,
				},
			})
		);
	}

	#closeDialog(evt) {
		evt.preventDefault();

		//close for element toolbar when using sidebar
		if (
			document.body.classList.contains("fpd-toolbar-visible") &&
			this.fpdInstance.container.classList.contains("fpd-sidebar")
		) {
			this.fpdInstance.toolbar.toggle(false);
			this.fpdInstance.deselectElement();
			return;
		}

		if (this.fpdInstance.currentViewInstance && this.fpdInstance.currentViewInstance.currentUploadZone) {
			this.fpdInstance.currentViewInstance.fabricCanvas.deselectElement();
		}

		this.toggleContentDisplay(false);
	}

	#viewSelected() {
		const viewInst = this.fpdInstance.currentViewInstance;
		const viewOpts = viewInst.options;
		const viewAdds = viewOpts.customAdds;

		toggleElemClasses(
			document.querySelectorAll('.fpd-nav-item[data-module^="designs"], fpd-module-designs'),
			["fpd-disabled"],
			!viewAdds.designs
		);

		toggleElemClasses(
			document.querySelectorAll('.fpd-nav-item[data-module="images"], fpd-module-images'),
			["fpd-disabled"],
			!viewAdds.uploads
		);

		toggleElemClasses(
			document.querySelectorAll('.fpd-nav-item[data-module="text-to-image"]'),
			["fpd-disabled"],
			!viewAdds.uploads
		);

		toggleElemClasses(
			document.querySelectorAll('.fpd-nav-item[data-module="text"], fpd-module-text'),
			["fpd-disabled"],
			!viewAdds.texts
		);

		toggleElemClasses(
			document.querySelectorAll('.fpd-nav-item[data-module="names-numbers"], fpd-module-names-numbers'),
			["fpd-disabled"],
			!viewInst.fabricCanvas.textPlaceholder && !viewInst.fabricCanvas.numberPlaceholder
		);

		//for sidebar
		if (!this.contentClosable) {
			//select first firsr visible module if current one is disabled for the view
			document
				.querySelectorAll('.fpd-nav-item[data-module="' + this.currentModuleKey + '"]')
				.forEach((navItem) => {
					if (navItem.classList.contains("fpd-disabled")) {
						const firstActiveNavItem = this.navElem.querySelector(".fpd-nav-item:not(.fpd-disabled)");
						if (firstActiveNavItem) {
							this.callModule(firstActiveNavItem.dataset.module);
						}
					}
				});
		}

		this.toggleContentDisplay(false);
	}

	callModule(name, dynamicDesignsId = null) {
		//unselect current module
		removeElemClasses(this.navElem.querySelectorAll(".fpd-nav-item"), ["fpd-active"]);

		removeElemClasses(Array.from(this.contentElem.children), ["fpd-active"]);
		if (dynamicDesignsId) {
			addElemClasses(
				this.navElem.querySelector('.fpd-nav-item[data-dynamic-designs-id="' + dynamicDesignsId + '"]'),
				["fpd-active"]
			);

			addElemClasses(this.contentElem.querySelector('[data-dynamic-designs-id="' + dynamicDesignsId + '"]'), [
				"fpd-active",
			]);
		} else {
			addElemClasses(this.navElem.querySelector('.fpd-nav-item[data-module="' + name + '"]'), [
				"fpd-active",
			]);

			const selectedModule = this.contentElem.querySelector("fpd-module-" + name);
			addElemClasses(selectedModule, ["fpd-active"]);

			//focus textarea when text module is selected
			if (name == "text") selectedModule.querySelector("textarea").focus();
		}

		this.toggleContentDisplay();
		this.currentModuleKey = name;

		this.fpdInstance.dispatchEvent(
			new CustomEvent("moduleCalled", {
				detail: {
					moduleName: name,
				},
			})
		);
	}

	callSecondary(name) {
		//deselect main modules
		removeElemClasses(this.navElem.querySelectorAll(".fpd-nav-item"), ["fpd-active"]);

		addElemClasses(this.secContent.querySelector(".fpd-" + name), ["fpd-active"]);

		addElemClasses([this.fpdInstance.container, this.#draggableDialog], ["fpd-secondary-visible"]);

		this.fpdInstance.dispatchEvent(
			new CustomEvent("secondaryModuleCalled", {
				detail: {
					moduleName: name,
				},
			})
		);
	}

	get contentClosable() {
		const fpdContainer = this.fpdInstance.container;

		return (
			this.#offCanvasEnabled ||
			this.#draggableDialogEnabled ||
			fpdContainer.classList.contains("fpd-layout-small")
		);
	}

	toggleContentDisplay(toggle = true) {
		removeElemClasses([this.fpdInstance.container, this.#draggableDialog], ["fpd-secondary-visible"]);
		toggleElemClasses([this.fpdInstance.container, this.#draggableDialog], ["fpd-module-visible"], toggle);

		//for topbar, off-canvas
		if (this.contentClosable) {
			if (!toggle) {
				removeElemClasses(this.navElem.querySelectorAll(".fpd-nav-item"), ["fpd-active"]);
			}
		}

		if (this.#offCanvasEnabled) {
			//deselect element when main bar is showing
			if (!toggle && this.currentModuleKey.length) {
				this.fpdInstance.deselectElement();
			}

			this.contentElem.style.removeProperty("left");
			this.contentElem.previousElementSibling.style.removeProperty("left");
			this.container.style.setProperty(
				"--fpd-content-height",
				this.fpdInstance.mainWrapper.container.clientHeight + "px"
			);

			toggleElemClasses(this.container, ["fpd-show"], toggle);
		} else if (this.#draggableDialogEnabled) {
			if (toggle) {
				this.#draggableDialog.querySelector(".fpd-dialog-title").innerText = this.navElem.querySelector(
					".fpd-nav-item.fpd-active .fpd-label"
				).innerText;
			}

			toggleElemClasses(this.#draggableDialog, ["fpd-show"], toggle);
		}

		if (!toggle && this.contentClosable) {
			this.currentModuleKey = "";
		}

		if (!toggle && this.fpdInstance.currentViewInstance) {
			this.fpdInstance.currentViewInstance.currentUploadZone = null;
		}
	}

	updateContentWrapper() {
		const fpdContainer = this.fpdInstance.container;

		this.toggleContentDisplay(false);
		this.#offCanvasEnabled = false;
		this.#draggableDialogEnabled = false;

		removeElemClasses(this.navElem.querySelectorAll(".fpd-nav-item"), ["fpd-active"]);

		if (fpdContainer.classList.contains("fpd-off-canvas")) {
			this.#offCanvasEnabled = true;
			this.container.append(this.contentElem);
		} else if (fpdContainer.classList.contains("fpd-sidebar")) {
			this.container.append(this.contentElem);
		} else {
			this.#draggableDialogEnabled = true;
			this.#draggableDialog.append(this.contentElem);
			this.#draggableDialog.append(this.secContent);

			this.fpdInstance.translator.translateArea(this.#draggableDialog);
		}

		this.fpdInstance.translator.translateArea(this.container);
	}

	toggleUploadZonePanel(toggle = true, customAdds = {}) {
		//do nothing when custom image is loading
		if (this.fpdInstance.loadingCustomImage) {
			return;
		}

		if (toggle) {
			if (this.#draggableDialogEnabled) {
				this.#draggableDialog.querySelector(".fpd-dialog-title").innerText = "";
			}

			toggleElemClasses(
				this.uploadZoneNavItems.find((navItem) => navItem.classList.contains("fpd-add-image")),
				["fpd-hidden"],
				!Boolean(customAdds.uploads)
			);

			toggleElemClasses(
				this.uploadZoneNavItems.find((navItem) => navItem.classList.contains("fpd-add-text")),
				["fpd-hidden"],
				!Boolean(customAdds.texts)
			);

			toggleElemClasses(
				this.uploadZoneNavItems.find((navItem) => navItem.classList.contains("fpd-add-design")),
				["fpd-hidden"],
				!Boolean(customAdds.designs)
			);

			if (this.fpdInstance.UZmoduleInstance_designs) {
				this.fpdInstance.UZmoduleInstance_designs.toggleCategories();
			}

			//select first visible nav item
			const firstVisibleNavItem = this.uploadZoneNavItems.find(
				(navItem) => !navItem.classList.contains("fpd-hidden")
			);
			if (firstVisibleNavItem) firstVisibleNavItem.click();

			this.callSecondary("upload-zone-panel");
		} else {
			this.fpdInstance.currentViewInstance.currentUploadZone = null;
		}

		toggleElemClasses([this.fpdInstance.container, this.#draggableDialog], ["fpd-secondary-visible"], toggle);

		if (this.#draggableDialogEnabled) {
			toggleElemClasses(this.#draggableDialog, ["fpd-show"], toggle);
		}
	}

	setup(modules = []) {
		this.currentModules = [];

		let selectedModule = this.fpdInstance.mainOptions.initialActiveModule
			? this.fpdInstance.mainOptions.initialActiveModule
			: "";

		const navElem = this.container.querySelector(".fpd-navigation");

		//if only one modules exist, select it and hide nav
		if (modules.length == 0 && !this.fpdInstance.mainOptions.editorMode) {
			addElemClasses(this.fpdInstance.container, ["fpd-no-modules-mode"]);
		} else if (
			modules.length == 1 &&
			!this.fpdInstance.container.classList.contains("fpd-topbar") &&
			!this.fpdInstance.mainOptions.editorMode
		) {
			selectedModule = modules[0] ? modules[0] : "";
			addElemClasses(this.fpdInstance.container, ["fpd-one-module-mode"]);
		} else if (this.fpdInstance.container.classList.contains("fpd-sidebar") && selectedModule == "") {
			selectedModule = modules[0] ? modules[0] : "";
		} else {
			navElem.classList.remove("fpd-hidden");
		}

		navElem.innerHTML = this.contentElem.innerHTML = "";

		if (FancyProductDesigner.additionalModules) {
			Object.keys(FancyProductDesigner.additionalModules).forEach((moduleKey) => {
				modules.push(moduleKey);
			});
		}

		//add selected modules
		modules.forEach((moduleKey) => {
			let navItemTitle = "";
			const moduleWrapper = new ModuleWrapper(this.fpdInstance, this.contentElem, moduleKey);

			if (!moduleWrapper.moduleInstance || !moduleWrapper.configs) return;

			this.currentModules.push(moduleKey);

			//create nav item element
			const navItemElem = document.createElement("div");
			navItemElem.classList.add("fpd-nav-item");
			navItemElem.dataset.module = moduleKey;
			navItemElem.addEventListener("click", this.#navItemSelect.bind(this));
			navElem.appendChild(navItemElem);

			//create nav icon
			let moduleIcon = document.createElement("span");

			if (typeof moduleWrapper.configs.icon == "string" && moduleWrapper.configs.icon.includes(".svg")) {
				fetchText({
					url: moduleWrapper.configs.icon,
					onSuccess: (svgStr) => {
						moduleIcon.innerHTML = svgStr;
					},
					onError: (error) => {
						console.log(error);
					},
				});
			} else {
				moduleIcon.classList.add("fpd-nav-icon");
				moduleIcon.classList.add(moduleWrapper.configs.icon);
			}

			navItemElem.append(moduleIcon);

			//create label inside nav item
			if (moduleWrapper.configs.langKeys) {
				//get translation for nav item label
				const langKeys = moduleWrapper.configs.langKeys;
				navItemTitle = this.fpdInstance.translator.getTranslation(
					langKeys[0],
					langKeys[1],
					moduleWrapper.configs.defaultText
				);
			} else if (moduleWrapper.configs.defaultText) {
				navItemTitle = moduleWrapper.configs.defaultText;
			}

			//create nav item label
			const navItemLabelElem = document.createElement("span");
			navItemLabelElem.className = "fpd-label";
			navItemLabelElem.innerText = navItemTitle;
			navItemElem.append(navItemLabelElem);

			//attach attributes to nav item
			if (moduleWrapper.configs.attrs) {
				for (const [key, value] of Object.entries(moduleWrapper.configs.attrs)) {
					navItemElem.setAttribute(key, value);
				}
			}
		});

		const selectedNav = navElem.querySelector(`[data-module="${selectedModule}"]`);
		if (!this.contentClosable && selectedNav) {
			selectedNav.click();
		}

		//upload zone panel
		this.uploadZoneContent = this.secContent.querySelector(".fpd-upload-zone-content");

		if (!this.fpdInstance.mainOptions.editorMode) {
			const imagesModuleWrapper = new ModuleWrapper(this.fpdInstance, this.uploadZoneContent, "images");
			this.fpdInstance["UZmoduleInstance_images"] = imagesModuleWrapper.moduleInstance;

			const textModuleWrapper = new ModuleWrapper(this.fpdInstance, this.uploadZoneContent, "text");
			this.fpdInstance["UZmoduleInstance_text"] = textModuleWrapper.moduleInstance;

			const designModuleWrapper = new ModuleWrapper(this.fpdInstance, this.uploadZoneContent, "designs");
			this.fpdInstance["UZmoduleInstance_designs"] = designModuleWrapper.moduleInstance;
		}

		this.uploadZoneNavItems = Array.from(
			this.secContent.querySelectorAll(".fpd-upload-zone-panel .fpd-bottom-nav > div")
		);
		addEvents(this.uploadZoneNavItems, "click", (evt) => {
			removeElemClasses(this.uploadZoneNavItems, ["fpd-active"]);

			addElemClasses(evt.currentTarget, ["fpd-active"]);

			removeElemClasses(Array.from(this.uploadZoneContent.children), ["fpd-active"]);

			addElemClasses(this.uploadZoneContent.querySelector("fpd-module-" + evt.currentTarget.dataset.module), [
				"fpd-active",
			]);
		});

		this.fpdInstance.translator.translateArea(this.container);
	}
}

window.FPDMainBar = Mainbar;

var html$3 = (
`<div class="fpd-product-stage"></div>
<div class="fpd-warnings"></div>
<div class="fpd-advanced-image-editor fpd-hidden">
    <canvas></canvas>
    <span class="fpd-close"><span class="fpd-icon-close"></span></span>
    <span class="fpd-done"><span class="fpd-icon-done"></span></span>
</div>`);

let MainWrapper$1 = class MainWrapper extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$3; 
        
    }

};

customElements.define( 'fpd-main-wrapper', MainWrapper$1 );

class MainWrapper {
    

    constructor(fpdInstance) {
        
        this.container = document.createElement("fpd-main-wrapper");
        fpdInstance.container.append(this.container);
        
    }

}

var html$2 = (
`<div class="fpd-view-edit-size fpd-hidden">
    <label class="fpd-input">
        <span>W</span>
        <input type="number" min="1" step="1" data-type="width" class="fpd-tooltip">
    </label>
    <label class="fpd-input fpd-tooltip">
        <span>H</span>
        <input type="number" min="1" step="1" data-type="height" class="fpd-tooltip">
    </label>
</div>
<div class="fpd-view-locker">
    <span class="fpd-icon-locked"></span>
    <span class="fpd-icon-unlocked fpd-hidden"></span>
</div>
<div class="fpd-view-prev">
    <span class="fpd-icon-forward"></span>
</div>
<div class="fpd-show-views-grid">
    <span class="fpd-icon-pages"></span>
    <span class="fpd-current-view">0</span>
    <span class="fpd-total-views">0</span>
</div>
<div class="fpd-view-next">
    <span class="fpd-icon-forward"></span>
</div>`);

let ViewsNav$1 = class ViewsNav extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$2;
        
    }

};

customElements.define( 'fpd-views-nav', ViewsNav$1 );

class ViewsNav extends EventTarget {
	#maxStageSize = 1000; //when adding blank page or editing size, this will be max. canvas width/height
	#pbOffset = 100;

	constructor(fpdInstance) {
		super();

		this.fpdInstance = fpdInstance;
		this.container = document.createElement("fpd-views-nav");
		this.unitFormat = fpdInstance.mainOptions.dynamicViewsOptions.unit;
		this.minWidth = parseInt(fpdInstance.mainOptions.dynamicViewsOptions.minWidth);
		this.minHeight = parseInt(fpdInstance.mainOptions.dynamicViewsOptions.minHeight);
		this.maxWidth = parseInt(fpdInstance.mainOptions.dynamicViewsOptions.maxWidth);
		this.maxHeight = parseInt(fpdInstance.mainOptions.dynamicViewsOptions.maxHeight);

		fpdInstance.mainWrapper.container.append(this.container);

		let editSizeWrapper = null;
		if (Boolean(fpdInstance.mainOptions.enableDynamicViews)) {
			editSizeWrapper = this.container.querySelector(".fpd-view-edit-size");
			removeElemClasses(editSizeWrapper, ["fpd-hidden"]);

			const inputWidth = editSizeWrapper.querySelector('[data-type="width"]');
			inputWidth.setAttribute(
				"aria-label",
				this.minWidth + this.unitFormat + " - " + this.maxWidth + this.unitFormat
			);
			inputWidth.setAttribute(
				"placeholder",
				this.minWidth + this.unitFormat + " - " + this.maxWidth + this.unitFormat
			);

			const inputHeight = editSizeWrapper.querySelector('[data-type="height"]');
			inputHeight.setAttribute(
				"aria-label",
				this.minHeight + this.unitFormat + " - " + this.maxHeight + this.unitFormat
			);
			inputHeight.setAttribute(
				"placeholder",
				this.minHeight + this.unitFormat + " - " + this.maxHeight + this.unitFormat
			);
		}

		addEvents(fpdInstance, ["viewCreate", "viewRemove"], (evt) => {
			this.container.querySelector(".fpd-total-views").innerText = fpdInstance.viewInstances.length;
		});

		addEvents(fpdInstance, ["viewSelect"], (evt) => {
			toggleElemClasses(
				this.container.querySelector(".fpd-view-locker"),
				["fpd-hidden"],
				!fpdInstance.currentViewInstance.options.optionalView
			);

			this.container.querySelector(".fpd-current-view").innerText = fpdInstance.currentViewIndex + 1;

			this.#toggleViewLock(fpdInstance.currentViewInstance);

			if (editSizeWrapper) {
				const viewInstance = fpdInstance.currentViewInstance;

				let viewWidthUnit = pixelToUnit(viewInstance.options.stageWidth, this.unitFormat),
					viewHeightUnit = pixelToUnit(viewInstance.options.stageHeight, this.unitFormat);

				//check if canvas output is set
				if (objectHasKeys(viewInstance.options.output, ["width", "height"])) {
					viewWidthUnit = viewInstance.options.output.width;
					viewHeightUnit = viewInstance.options.output.height;
				}

				const inputWidth = editSizeWrapper.querySelector('[data-type="width"]');
				const inputHeight = editSizeWrapper.querySelector('[data-type="height"]');

				inputWidth.min = this.minWidth;
				inputWidth.max = this.maxWidth;
				inputWidth.value = viewWidthUnit;

				inputHeight.min = this.minHeight;
				inputHeight.max = this.maxHeight;
				inputHeight.value = viewHeightUnit;
			}
		});

		addEvents(this.container.querySelector(".fpd-view-prev"), "click", (evt) => {
			fpdInstance.selectView(fpdInstance.currentViewIndex - 1);
		});

		addEvents(this.container.querySelector(".fpd-view-next"), "click", (evt) => {
			fpdInstance.selectView(fpdInstance.currentViewIndex + 1);
		});

		addEvents(this.container.querySelector(".fpd-show-views-grid"), "click", (evt) => {
			fpdInstance.deselectElement();

			toggleElemClasses(fpdInstance.viewsGrid.container, ["fpd-show"], true);
		});

		addEvents(this.container.querySelector(".fpd-view-locker"), "click", (evt) => {
			if (fpdInstance.currentViewInstance) {
				fpdInstance.deselectElement();
				fpdInstance.currentViewInstance.toggleLock(!fpdInstance.currentViewInstance.locked);
				this.#toggleViewLock(fpdInstance.currentViewInstance);

				if (!fpdInstance.currentViewInstance.locked) {
					Snackbar(
						fpdInstance.translator.getTranslation("misc", "view_unlocked_info", "The view is unlocked")
					);
				}
			}
		});

		//edit size
		if (editSizeWrapper) {
			addEvents(editSizeWrapper.querySelectorAll("input"), "change", (evt) => {
				const inputElem = evt.currentTarget;
				this.checkDimensionLimits(inputElem.dataset.type, inputElem);

				const viewInstance = fpdInstance.currentViewInstance;

				let widthPx = unitToPixel(editSizeWrapper.querySelector('[data-type="width"]').value, this.unitFormat),
					heightPx = unitToPixel(
						editSizeWrapper.querySelector('[data-type="height"]').value,
						this.unitFormat
					);

				let viewOptions = this.calcPageOptions(widthPx, heightPx);
				viewInstance.options = deepMerge(viewInstance.options, viewOptions);
				viewInstance.fabricCanvas.viewOptions = viewInstance.options;

				viewInstance.fabricCanvas._renderPrintingBox();
				viewInstance.fabricCanvas.resetSize();

				this.doPricing(viewInstance);
			});
		}
	}

	#toggleViewLock(viewInstance) {
		const viewLocker = this.container.querySelector(".fpd-view-locker");

		toggleElemClasses(viewLocker.querySelector(".fpd-icon-locked"), ["fpd-hidden"], !viewInstance.locked);

		toggleElemClasses(viewLocker.querySelector(".fpd-icon-unlocked"), ["fpd-hidden"], viewInstance.locked);
	}

	checkDimensionLimits(type, input) {
		let inputVal = parseInt(input.value);

		if (type == "width") {
			if (inputVal < this.minWidth) {
				inputVal = this.minWidth;
			} else if (inputVal > this.maxWidth) {
				inputVal = this.maxWidth;
			}
		} else {
			if (inputVal < this.minHeight) {
				inputVal = this.minHeight;
			} else if (inputVal > this.maxHeight) {
				inputVal = this.maxHeight;
			}
		}

		input.value = inputVal;

		return inputVal;
	}

	calcPageOptions(widthPx, heightPx) {
		let aspectRatio = Math.min(
			(this.#maxStageSize - this.#pbOffset) / widthPx,
			(this.#maxStageSize - this.#pbOffset) / heightPx
		);
		const pbWidth = parseInt(widthPx * aspectRatio);
		const pbHeight = parseInt(heightPx * aspectRatio);

		let viewOptions = {
			stageWidth: pbWidth + this.#pbOffset,
			stageHeight: pbHeight + this.#pbOffset,
			printingBox: {
				width: pbWidth,
				height: pbHeight,
				left: (pbWidth + this.#pbOffset) / 2 - pbWidth / 2,
				top: (pbHeight + this.#pbOffset) / 2 - pbHeight / 2,
				visibility: true,
			},
			usePrintingBoxAsBounding: true,
			output: {
				width: pixelToUnit(widthPx, "mm"),
				height: pixelToUnit(heightPx, "mm"),
			},
		};

		return viewOptions;
	}

	doPricing(viewInstance) {
		if (viewInstance && this.fpdInstance.mainOptions.dynamicViewsOptions.pricePerArea) {
			let width = pixelToUnit(viewInstance.options.stageWidth, "cm"),
				height = pixelToUnit(viewInstance.options.stageHeight, "cm");

			//check if canvas output is set
			if (objectHasKeys(viewInstance.options.output, ["width", "height"])) {
				width = viewInstance.options.output.width / 10;
				height = viewInstance.options.output.height / 10;
			}

			let cm2 = Math.ceil(width * height),
				cm2Price = cm2 * Number(this.fpdInstance.mainOptions.dynamicViewsOptions.pricePerArea);

			viewInstance.changePrice(0, "+", cm2Price);
		}
	}
}

var html$1 = (
`<div class="fpd-head">
    <span class="fpd-btn fpd-add-blank fpd-hidden" data-defaulttext="Add Blank Page">misc.dynamic_views_add_blank</span>
    <span class="fpd-btn fpd-add-layout" data-defaulttext="Add Page from Layouts">misc.dynamic_views_add_from_layouts</span>
    <div class="fpd-close">
        <span class="fpd-icon-close"></span>
    </div>
</div>
<div class="fpd-scroll-area">
    <div class="fpd-grid"></div>
</div>
<div class="fpd-blank-page-modal fpd-shadow-1 fpd-hidden">
    <div class="fpd-head">
        <label class="fpd-input">
            <span data-defaulttext="Width">misc.dynamic_views_width</span>
            <input type="number" min="1" step="1" data-type="width" class="fpd-tooltip">
        </label>
        <label class="fpd-input">
            <span data-defaulttext="Height">misc.dynamic_views_height</span>
            <input type="number" min="1" step="1" data-type="height" class="fpd-tooltip">
        </label>
        <span class="fpd-btn" data-defaulttext="Add Page">misc.dynamic_views_add_view</span>
        <div class="fpd-close">
            <span class="fpd-icon-close"></span>
        </div>
    </div>
    <div class="fpd-scroll-area">
        <div class="fpd-grid"></div>
    </div>
</div>
<div class="fpd-layouts-modal fpd-shadow-1 fpd-hidden">
    <div class="fpd-head">
        <div class="fpd-close">
            <span class="fpd-icon-close"></span>
        </div>
    </div>
    <div class="fpd-scroll-area">
        <div class="fpd-grid"></div>
    </div>
</div>`);

let ViewsGrid$1 = class ViewsGrid extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html$1;
        
    }

};

customElements.define( 'fpd-views-grid', ViewsGrid$1 );

class ViewsGrid extends EventTarget {
	constructor(fpdInstance) {
		super();

		this.fpdInstance = fpdInstance;
		this.formats = fpdInstance.mainOptions.dynamicViewsOptions.formats;
		this.currentLayouts = [];

		this.container = document.createElement("fpd-views-grid");
		fpdInstance.container.append(this.container);

		toggleElemClasses(
			fpdInstance.container,
			["fpd-dynamic-views-enabled"],
			fpdInstance.mainOptions.enableDynamicViews
		);

		this.gridElem = this.container.querySelector(".fpd-grid");
		this.blankPageModal = this.container.querySelector(".fpd-blank-page-modal");
		this.layoutsModal = this.container.querySelector(".fpd-layouts-modal");

		if (fpdInstance.mainOptions.enableDynamicViews) {
			this.blankPageCustomWidthInput = this.blankPageModal.querySelectorAll(".fpd-head input")[0];
			this.blankPageCustomHeightInput = this.blankPageModal.querySelectorAll(".fpd-head input")[1];
			this.blankPageCustomWidthInput.setAttribute("placeholder", this.fpdInstance.viewsNav.unitFormat);
			this.blankPageCustomHeightInput.setAttribute("placeholder", this.fpdInstance.viewsNav.unitFormat);

			if (Array.isArray(this.formats) && this.formats.length) {
				removeElemClasses(this.container.querySelector(".fpd-btn.fpd-add-blank"), ["fpd-hidden"]);

				this.formats.forEach((format) => {
					const formatWidth = format[0];
					const formatHeight = format[1];

					const itemSize = 150;
					let itemWidth, itemHeight;
					if (formatWidth > formatHeight) {
						itemWidth = itemSize;
						itemHeight = (itemSize / formatWidth) * formatHeight;
					} else {
						itemHeight = itemSize;
						itemWidth = (itemSize / formatHeight) * formatWidth;
					}

					const formatItem = document.createElement("div");
					formatItem.className = "fpd-shadow-1 fpd-item";
					formatItem.innerHTML =
						"<span>" +
						formatWidth +
						"x" +
						formatHeight +
						"<br>" +
						this.fpdInstance.viewsNav.unitFormat +
						"</span>";
					formatItem.style.width = itemWidth + "px";
					formatItem.style.height = itemHeight + "px";
					this.blankPageModal.querySelector(".fpd-grid").append(formatItem);

					addEvents(formatItem, "click", (evt) => {
						this.#addBlankPage(formatWidth, formatHeight);
					});
				});
			}

			let startIndex;
			r("unrestricted", {
				container: this.gridElem,
				handle: "fpd-sort",
				item: "fpd-item",
				placeholder: "fpd-sortable-placeholder",
				activeItem: "fpd-sortable-dragged",
				closestItem: "fpd-sortable-closest",
				autoscroll: true,
				animationMs: 0,
				onStart: (item) => {
					startIndex = Array.from(this.gridElem.querySelectorAll(".fpd-item")).indexOf(item);

					// disable scroll
					const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
					window.onscroll = () => {
						window.scrollTo({ top: scrollTop });
					};
				},
				onEnd: (item) => {
					const endIndex = Array.from(this.gridElem.querySelectorAll(".fpd-item")).indexOf(item);

					if (startIndex != endIndex) {
						this.#array_move(fpdInstance.viewInstances, startIndex, endIndex);
						fpdInstance.productStage.innerHTML = "";
						fpdInstance.viewInstances.forEach((viewInst) => {
							fpdInstance.productStage.append(viewInst.fabricCanvas.wrapperEl);
						});

						/**
						 * Gets fired when a view is moved into a new position.
						 *
						 * @event viewMove
						 * @param {Event} event
						 */
						fireEvent(fpdInstance, "viewMove");

						fpdInstance.selectView(0);
					}

					window.onscroll = () => {};
				},
			});

			addEvents(
				this.container.querySelectorAll(".fpd-btn.fpd-add-blank, .fpd-btn.fpd-add-layout"),
				"click",
				(evt) => {
					addElemClasses(this.container, ["fpd-modal-visible"]);

					if (evt.currentTarget.classList.contains("fpd-add-blank")) {
						removeElemClasses(this.blankPageModal, ["fpd-hidden"]);
					} else {
						removeElemClasses(this.layoutsModal, ["fpd-hidden"]);
					}
				}
			);

			addEvents(
				this.container.querySelectorAll(".fpd-blank-page-modal .fpd-close, .fpd-layouts-modal .fpd-close"),
				"click",
				() => {
					removeElemClasses(this.container, ["fpd-modal-visible"]);

					addElemClasses(this.blankPageModal, ["fpd-hidden"]);

					addElemClasses(this.layoutsModal, ["fpd-hidden"]);
				}
			);

			addEvents(fpdInstance, "layoutsSet", () => {
				toggleElemClasses(
					this.container.querySelectorAll(".fpd-btn.fpd-add-layout"),
					["fpd-hidden"],
					!(fpdInstance.currentLayouts && fpdInstance.currentLayouts.length > 0)
				);

				if (fpdInstance.currentLayouts && fpdInstance.currentLayouts.length) {
					fpdInstance.currentLayouts.forEach((layout) => {
						const layoutItem = document.createElement("div");
						layoutItem.className = "fpd-shadow-1 fpd-item";
						layoutItem.innerHTML =
							'<picture  style="background-image: url(' +
							layout.thumbnail +
							');"></picture><span>' +
							layout.title +
							"</span>";
						this.layoutsModal.querySelector(".fpd-grid").append(layoutItem);

						addEvents(layoutItem, "click", (evt) => {
							fpdInstance.addView(layout);
							this.hideModals();
						});
					});
				}
			});

			addEvents(this.blankPageModal.querySelector(".fpd-head .fpd-btn"), "click", (evt) => {
				if (this.blankPageCustomWidthInput.value && this.blankPageCustomHeightInput.value) {
					const width = parseInt(Math.abs(this.blankPageCustomWidthInput.value));
					const height = parseInt(Math.abs(this.blankPageCustomHeightInput.value));

					this.#addBlankPage(width, height);
				}
			});

			this.blankPageModal.querySelector('.fpd-input input[data-type="width"]').value =
				this.fpdInstance.viewsNav.minWidth;
			this.blankPageModal
				.querySelector('.fpd-input input[data-type="width"]')
				.setAttribute(
					"aria-label",
					this.fpdInstance.viewsNav.minWidth +
						this.fpdInstance.viewsNav.unitFormat +
						" - " +
						this.fpdInstance.viewsNav.maxWidth +
						this.fpdInstance.viewsNav.unitFormat
				);

			this.blankPageModal.querySelector('.fpd-input input[data-type="height"]').value =
				this.fpdInstance.viewsNav.minHeight;
			this.blankPageModal
				.querySelector('.fpd-input input[data-type="height"]')
				.setAttribute(
					"aria-label",
					this.fpdInstance.viewsNav.minHeight +
						this.fpdInstance.viewsNav.unitFormat +
						" - " +
						this.fpdInstance.viewsNav.maxHeight +
						this.fpdInstance.viewsNav.unitFormat
				);

			addEvents(this.blankPageModal.querySelectorAll(".fpd-input input"), "change", (evt) => {
				evt.currentTarget.value = this.fpdInstance.viewsNav.checkDimensionLimits(
					evt.currentTarget.dataset.type,
					evt.currentTarget
				);
			});
		}

		addEvents(fpdInstance, "viewCreate", (evt) => {
			const viewInstance = evt.detail.viewInstance;
			const viewImageURL = FancyProductDesigner.proxyFileServer
				? FancyProductDesigner.proxyFileServer + viewInstance.thumbnail
				: viewInstance.thumbnail;

			const viewItem = document.createElement("div");
			viewItem.className = "fpd-shadow-1 fpd-item";
			viewItem.title = viewInstance.title;
			viewItem.innerHTML =
				'<picture style="background-image: url(' +
				viewImageURL +
				');"></picture><span>' +
				viewItem.title +
				"</span>";
			this.gridElem.append(viewItem);

			if (fpdInstance.mainOptions.enableDynamicViews) {
				const sortElem = document.createElement("div");
				sortElem.className = "fpd-sort";
				sortElem.innerHTML = '<span class="fpd-icon-drag"></span>';
				viewItem.append(sortElem);

				const optionsElem = document.createElement("div");
				optionsElem.className = "fpd-options";
				optionsElem.innerHTML = "···";
				viewItem.append(optionsElem);

				const dropdownMenu = document.createElement("div");
				dropdownMenu.className = "fpd-dropdown-menu fpd-shadow-1";
				dropdownMenu.innerHTML = `
                        <span data-option="edit-size">${fpdInstance.translator.getTranslation(
							"misc",
							"view_edit_size"
						)}</span>
                        <span data-option="duplicate">${fpdInstance.translator.getTranslation(
							"misc",
							"view_duplicate"
						)}</span>
                        <span data-option="delete">${fpdInstance.translator.getTranslation(
							"misc",
							"view_delete"
						)}</span>
                    `;
				optionsElem.append(dropdownMenu);

				let viewWidthUnit = pixelToUnit(viewInstance.options.stageWidth, this.fpdInstance.viewsNav.unitFormat),
					viewHeightUnit = pixelToUnit(
						viewInstance.options.stageHeight,
						this.fpdInstance.viewsNav.unitFormat
					);

				//check if canvas output is set
				if (objectHasKeys(viewInstance.options.output, ["width", "height"])) {
					viewWidthUnit = viewInstance.options.output.width;
					viewHeightUnit = viewInstance.options.output.height;
				}

				const editSizeOverlay = document.createElement("div");
				editSizeOverlay.className = "fpd-edit-size-overlay";
				editSizeOverlay.innerHTML = `
                        <input type="number" data-type="width" step=1 class="fpd-tooltip" min=${
							this.fpdInstance.viewsNav.minWidth
						} max=${this.fpdInstance.viewsNav.maxWidth} value=${viewWidthUnit} aria-label="${
					this.fpdInstance.viewsNav.minWidth +
					this.fpdInstance.viewsNav.unitFormat +
					" - " +
					this.fpdInstance.viewsNav.maxWidth +
					this.fpdInstance.viewsNav.unitFormat
				}" />
                        <input type="number" data-type="height" step=1 class="fpd-tooltip" min=${
							this.fpdInstance.viewsNav.minHeight
						} max=${this.fpdInstance.viewsNav.maxHeight} value=${viewHeightUnit} aria-label="${
					this.fpdInstance.viewsNav.minHeight +
					this.fpdInstance.viewsNav.unitFormat +
					" - " +
					this.fpdInstance.viewsNav.maxHeight +
					this.fpdInstance.viewsNav.unitFormat
				}" />
                        <span class="fpd-btn"><span class="fpd-icon-done"></span></span>
                        <span class="fpd-btn fpd-secondary"><span class="fpd-icon-close"></span></span>
                    `;

				viewItem.append(editSizeOverlay);

				//change size of view canvas
				addEvents(editSizeOverlay.querySelectorAll(".fpd-btn"), "click", (evt) => {
					if (!evt.currentTarget.classList.contains("fpd-secondary")) {
						let widthPx = unitToPixel(
								editSizeOverlay.querySelector('[data-type="width"]').value,
								this.fpdInstance.viewsNav.unitFormat
							),
							heightPx = unitToPixel(
								editSizeOverlay.querySelector('[data-type="height"]').value,
								this.fpdInstance.viewsNav.unitFormat
							);

						let viewOptions = this.fpdInstance.viewsNav.calcPageOptions(widthPx, heightPx);
						viewInstance.options = deepMerge(viewInstance.options, viewOptions);
						viewInstance.fabricCanvas.viewOptions = viewInstance.options;

						viewInstance.fabricCanvas._renderPrintingBox();
						if (viewInstance == this.fpdInstance.currentViewInstance) {
							viewInstance.fabricCanvas.resetSize();
						}

						this.fpdInstance.viewsNav.doPricing(viewInstance);

						this.reset();
					}

					removeElemClasses(editSizeOverlay, ["fpd-show"]);
				});

				//limits of changing view size
				addEvents(editSizeOverlay.querySelectorAll("input"), "change", (evt) => {
					const inputElem = evt.currentTarget;

					if (inputElem.dataset.type == "width") {
						this.fpdInstance.viewsNav.checkDimensionLimits("width", inputElem);
						this.fpdInstance.viewsNav.checkDimensionLimits("height", inputElem.nextElementSibling);
					} else {
						this.fpdInstance.viewsNav.checkDimensionLimits("height", inputElem);
						this.fpdInstance.viewsNav.checkDimensionLimits("width", inputElem.previousElementSibling);
					}
				});

				addEvents(optionsElem, "click", (evt) => {
					evt.stopPropagation();

					const dropdownMenu = optionsElem.querySelector(".fpd-dropdown-menu");

					toggleElemClasses(dropdownMenu, ["fpd-show"], !dropdownMenu.classList.contains("fpd-show"));
				});

				addEvents(dropdownMenu.querySelectorAll("span"), "click", (evt) => {
					const option = evt.currentTarget.dataset.option;

					if (option == "edit-size") {
						addElemClasses(editSizeOverlay, ["fpd-show"]);
					} else if (option == "duplicate") {
						this.#duplicateView(viewInstance);
					} else if (option == "delete") {
						const viewIndex = Array.from(this.gridElem.querySelectorAll(".fpd-item")).indexOf(viewItem);
						fpdInstance.removeView(viewIndex);
					}
				});

				this.fpdInstance.viewsNav.doPricing(viewInstance);
			}

			addEvents(viewItem.querySelector("picture"), "click", (evt) => {
				const viewIndex = Array.from(this.gridElem.querySelectorAll(".fpd-item")).indexOf(viewItem);

				fpdInstance.selectView(viewIndex);

				this.reset();
			});
		});

		addEvents(fpdInstance, "viewRemove", (evt) => {
			const viewItem = this.gridElem.querySelectorAll(".fpd-item").item(evt.detail.viewIndex);
			if (viewItem) viewItem.remove();
		});

		addEvents(fpdInstance, "clear", () => {
			this.gridElem.innerHTML = "";
		});

		addEvents(this.container.querySelector(".fpd-close"), "click", this.reset.bind(this));

		addEvents(fpdInstance, "navItemSelect", this.reset.bind(this));
	}

	#addBlankPage(width, height) {
		if (!width || !height) return;

		const widthPx = unitToPixel(Number(width), this.fpdInstance.viewsNav.unitFormat);
		const heightPx = unitToPixel(Number(height), this.fpdInstance.viewsNav.unitFormat);

		let viewOptions = this.fpdInstance.viewsNav.calcPageOptions(widthPx, heightPx);
		this.fpdInstance.addView({
			title: width + "x" + height,
			thumbnail: "",
			elements: [],
			options: viewOptions,
		});

		this.hideModals();
	}

	#duplicateView(viewInstance) {
		let viewElements = viewInstance.fabricCanvas.getObjects(),
			jsonViewElements = [];

		viewElements.forEach((element) => {
			if (element.title !== undefined && element.source !== undefined) {
				const jsonItem = {
					title: element.title,
					source: element.source,
					parameters: element.getElementJSON(),
					type: element.getType(),
				};

				jsonViewElements.push(jsonItem);
			}
		});

		this.fpdInstance.addView({
			title: viewInstance.title,
			thumbnail: viewInstance.thumbnail,
			elements: jsonViewElements,
			options: viewInstance.options,
		});
	}

	#array_move(arr, fromIndex, toIndex) {
		let element = arr[fromIndex];
		arr.splice(fromIndex, 1);
		arr.splice(toIndex, 0, element);
	}

	hideModals() {
		removeElemClasses(this.container, ["fpd-modal-visible"]);

		addElemClasses(this.blankPageModal, ["fpd-hidden"]);

		addElemClasses(this.layoutsModal, ["fpd-hidden"]);
	}

	reset() {
		this.hideModals();
		removeElemClasses(this.container, ["fpd-show"]);
	}
}

var html = (
`<div class="fpd-close-sub-panel">
    <span class="fpd-icon-back"></span>
    <span class="fpd-label" data-defaulttext="Back">toolbar.sub_panel_back</span>
</div>

<div class="fpd-close">
    <span class="fpd-icon-close"></span>
</div>

<div class="fpd-tools-nav fpd-scroll-area">

    <div class="fpd-primary-tools">
        <div class="fpd-tool-color" data-panel="color">
            <span class="fpd-current-fill"></span>
            <span class="fpd-label" data-defaulttext="Color">toolbar.color</span>
        </div>
        <div class="fpd-tool-edit-text" data-panel="edit-text">
            <span class="fpd-icon-text-input"></span>
            <span class="fpd-label" data-defaulttext="Edit Text">toolbar.edit_text</span>
        </div>
        <div class="fpd-tool-text-size" data-panel="text-size">
            <input type="text" class="fpd-input">
            <span class="fpd-icon-font-size"></span>
            <span class="fpd-label" data-defaulttext="Size & Spacing">toolbar.text_size_spacing</span>
        </div>
        <div class="fpd-tool-font-family" data-panel="font-family">
            <fpd-dropdown placeholder=""></fpd-dropdown>
            <span class="fpd-icon-font"></span>
            <span class="fpd-label" data-defaulttext="Font">toolbar.font</span>
        </div>
    </div>

    <div class="fpd-secondary-tools fpd-scroll-area">
        <div class="fpd-tool-text-format" data-panel="text-format">
            <span class="fpd-icon-text-format"></span>
            <span class="fpd-label" data-defaulttext="Format">toolbar.text_format</span>
        </div>
        <div class="fpd-tool-transform" data-panel="transform">
            <span class="fpd-icon-transform"></span>
            <span class="fpd-label" data-defaulttext="Transform">toolbar.transform</span>
        </div>
        <div class="fpd-tool-position" data-panel="position">
            <span class="fpd-icon-position"></span>
            <span class="fpd-label" data-defaulttext="Position">toolbar.position</span>
        </div>
        
        <div class="fpd-tool-curved-text" data-panel="curved-text">
            <span class="fpd-icon-curved-text"></span>
            <span class="fpd-label" data-defaulttext="Curved Text">toolbar.curved_text</span>
        </div>
        <div class="fpd-tool-advanced-editing" data-panel="advanced-editing">
            <span class="fpd-icon-effects"></span>
            <span class="fpd-label" data-defaulttext="Edit Image">toolbar.advanced_editing</span>
        </div>
        <div class="fpd-tool-remove-bg">
            <span class="fpd-icon-remove-bg"></span>
            <span class="fpd-label" data-defaulttext="Remove Background">toolbar.remove_background</span>
        </div>
        <div class="fpd-tool-reset">
            <span class="fpd-icon-reset"></span>
            <span class="fpd-label" data-defaulttext="Reset">toolbar.reset</span>
        </div>
        <div class="fpd-tool-duplicate">
            <span class="fpd-icon-copy"></span>
            <span class="fpd-label" data-defaulttext="Duplicate">toolbar.duplicate</span>
        </div>
        <div class="fpd-tool-remove">
            <span class="fpd-icon-bin"></span>
            <span class="fpd-label" data-defaulttext="Remove">toolbar.remove</span>
        </div>
    </div>

</div>
<div class="fpd-sub-panel">

    <div class="fpd-panel-color">

        <div class="fpd-panel-tabs">
            <span data-tab="fill" data-defaulttext="Fill" class="fpd-active">toolbar.fill</span>
            <span data-tab="stroke" data-defaulttext="Stroke" class="fpd-tool-text-stroke">toolbar.stroke</span>
            <span data-tab="shadow" data-defaulttext="Shadow" class="fpd-tool-text-shadow">toolbar.shadow</span>
        </div>

        <div class="fpd-panel-tabs-content fpd-scroll-area">

            <div data-id="fill" class="fpd-active">

                <div class="fpd-color-wrapper"></div>

                <div class="fpd-tool-fill-opacity fpd-input">
                    <span class="fpd-label" data-defaulttext="Transparency">toolbar.transparency</span>
                    <fpd-range-slider 
                        class="fpd-progress"
                        value="1" 
                        step="0.01" 
                        min="0" 
                        max="1"
                        data-control="opacity"
                    ></fpd-range-slider>
                    <input 
                        class="fpd-slider-number fpd-number" 
                        type="number" 
                        value="1" 
                        step="0.01" 
                        min="0" 
                        max="1"
                        data-control="opacity" 
                    />
                </div>

            </div>

            <div data-id="stroke">

                <div class="fpd-stroke-color-wrapper"></div>
                
                <div class="fpd-tool-stroke-width fpd-input">
                    <span class="fpd-label" data-defaulttext="Stroke Width">toolbar.stroke_width</span>
                    <fpd-range-slider 
                        class="fpd-progress"
                        value="0" 
                        step="1" 
                        min="0" 
                        max="20"
                        data-control="strokeWidth"
                    ></fpd-range-slider>
                    <input 
                        class="fpd-slider-number fpd-number" 
                        type="number" 
                        value="0" 
                        step="1" 
                        min="0" 
                        max="20"
                        data-control="strokeWidth" 
                    />
                </div>

            </div>

            <div data-id="shadow">

                <div class="fpd-shadow-color-wrapper"></div>

                <div class="fpd-tool-shadow-blur fpd-input">
                    <span class="fpd-label" data-defaulttext="Blur">toolbar.shadow_blur</span>
                    <fpd-range-slider 
                        class="fpd-progress"
                        value="0" 
                        step="1" 
                        min="0" 
                        max="200"
                        data-control="shadowBlur"
                    ></fpd-range-slider>
                    <input 
                        class="fpd-slider-number fpd-number" 
                        type="number" 
                        value="0" 
                        step="1" 
                        min="0" 
                        max="200"
                        data-control="shadowBlur" 
                    />
                </div>

                <div class="fpd-tool-shadow-offsetX fpd-input">
                    <span class="fpd-label" data-defaulttext="Offset X">toolbar.shadow_offset_x</span>
                    <fpd-range-slider 
                        class="fpd-progress"
                        value="0" 
                        step="1" 
                        min="-100" 
                        max="100"
                        data-control="shadowOffsetX"
                    ></fpd-range-slider>
                    <input 
                        class="fpd-slider-number fpd-number" 
                        type="number" 
                        value="0" 
                        step="1" 
                        min="-100" 
                        max="100"
                        data-control="shadowOffsetX" 
                    />
                </div>

                <div class="fpd-tool-shadow-offsetY fpd-input">
                    <span class="fpd-label" data-defaulttext="Offset Y">toolbar.shadow_offset_y</span>
                    <fpd-range-slider 
                        class="fpd-progress"
                        value="0" 
                        step="1" 
                        min="-100" 
                        max="100"
                        data-control="shadowOffsetY"
                    ></fpd-range-slider>
                    <input 
                        class="fpd-slider-number fpd-number" 
                        type="number" 
                        value="0" 
                        step="1" 
                        min="-100" 
                        max="100"
                        data-control="shadowOffsetY" 
                    />
                </div>

                <div class="fpd-btn fpd-secondary fpd-remove-shadow" data-defaulttext="Remove Shadow">toolbar.remove_shadow</div>

            </div>

        </div>

    </div><!-- Fill Panel -->

    <div class="fpd-panel-edit-text fpd-padding">

        <textarea data-control="text"></textarea>

    </div><!-- Edit-Text Panel -->

    <div class="fpd-panel-text-size fpd-padding">
        <div class="fpd-tool-text-size fpd-input">
            <span class="fpd-label" data-defaulttext="Font Size">toolbar.font_size</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="12" 
                step="1" 
                min="1" 
                max="200"
                data-control="fontSize"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="12" 
                step="1" 
                min="1" 
                max="200"
                data-control="fontSize" 
            />
        </div>
        <div class="fpd-tool-text-line-spacing fpd-input">
            <span class="fpd-label" data-defaulttext="Line Spacing">toolbar.line_spacing</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="1" 
                step="0.1" 
                min="-2" 
                max="3"
                data-control="lineHeight"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="1" 
                step="0.1" 
                min="-2" 
                max="3"
                data-control="lineHeight" 
            />
        </div>
        <div class="fpd-tool-text-letter-spacing fpd-input">
            <span class="fpd-label" data-defaulttext="Letter Spacing">toolbar.letter_spacing</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="0" 
                step="1" 
                min="-30" 
                max="30"
                data-control="letterSpacing"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="0" 
                step="1" 
                min="-30" 
                max="30"
                data-control="letterSpacing" 
            />
        </div>
    </div><!-- Text-Size & Spacing Panel -->

    <div class="fpd-panel-text-format fpd-padding">

        <div class="fpd-tools-group">

            <div class="fpd-tool-text-bold fpd-toggle" data-defaulttext="Bold" data-control="fontWeight"
                data-enabled="bold" data-disabled="normal" title="toolbar.bold">
                <span class="fpd-icon-format-bold"></span>
            </div>
            <div class="fpd-tool-text-italic fpd-toggle" data-defaulttext="Italic" data-control="fontStyle"
                data-enabled="italic" data-disabled="normal" title="toolbar.italic">
                <span class="fpd-icon-format-italic"></span>
            </div>
            <div class="fpd-tool-text-underline fpd-toggle" data-defaulttext="Underline"
                data-control="textDecoration" data-enabled="underline" data-disabled="normal" title="toolbar.underline">
                <span class="fpd-icon-format-underline"></span>
            </div>
            <div class="fpd-tool-text-transform fpd-btn-options" data-control="textTransform"
                data-options='{"none": "fpd-icon-text-transform", "uppercase": "fpd-icon-uppercase", "lowercase": "fpd-icon-lowercase"}'
                data-defaulttext="Text Transform" title="toolbar.text_transform">
                <span class="fpd-icon-text-transform"></span>
            </div>

        </div>
        <div class="fpd-tool-text-align fpd-btn-group" data-control="textAlign">
            <span class="fpd-icon-format-align-left" data-option="left"></span>
            <span class="fpd-icon-format-align-center" data-option="center"></span>
            <span class="fpd-icon-format-align-right" data-option="right"></span>
            <span class="fpd-icon-format-align-justify" data-option="justify"></span>
        </div>

    </div><!-- Text-Format Panel -->

    <div class="fpd-panel-font-family fpd-padding" data-control="fontFamily">
        <input type="text" data-defaulttext="Search Fonts" placeholder="toolbar.font_family_search" />
        <div class="fpd-scroll-area">
            <div class="fpd-fonts-list"></div>
        </div>
    </div><!-- Font Panel -->

    <div class="fpd-panel-curved-text fpd-padding">

        <div class="fpd-curved-options">
            <span data-value="normal">
                <svg width="48" height="14" viewBox="0 0 48 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.04787 13.327H0L4.60146 0.673004H6.83039L11.4318 13.327H9.38398L5.76899 2.97148H5.6691L2.04787 13.327ZM2.39126 8.37167H9.03434V9.97814H2.39126V8.37167Z" fill="#485563"/>
                    <path d="M13.2784 13.327V0.673004H17.961C18.8684 0.673004 19.6197 0.821293 20.2149 1.11787C20.8101 1.41033 21.2555 1.80783 21.551 2.31036C21.8465 2.80878 21.9943 3.37104 21.9943 3.99715C21.9943 4.5244 21.8965 4.96926 21.7008 5.33175C21.5052 5.69011 21.243 5.97845 20.9142 6.19677C20.5895 6.41096 20.2315 6.56749 19.8403 6.66635V6.78992C20.2648 6.81052 20.679 6.94645 21.0827 7.19772C21.4906 7.44487 21.8278 7.79705 22.0942 8.25428C22.3606 8.7115 22.4938 9.26759 22.4938 9.92253C22.4938 10.5692 22.3398 11.15 22.0317 11.6649C21.7279 12.1757 21.2575 12.5814 20.6207 12.8821C19.9839 13.1787 19.1701 13.327 18.1795 13.327H13.2784ZM15.2076 11.6896H17.9922C18.9162 11.6896 19.578 11.5125 19.9776 11.1583C20.3772 10.804 20.577 10.3612 20.577 9.82985C20.577 9.43029 20.475 9.06369 20.2711 8.73004C20.0671 8.39639 19.7758 8.1307 19.397 7.93298C19.0224 7.73527 18.577 7.63641 18.0609 7.63641H15.2076V11.6896ZM15.2076 6.14734H17.7924C18.2253 6.14734 18.6145 6.06496 18.9599 5.90019C19.3096 5.73542 19.5864 5.50475 19.7903 5.20817C19.9984 4.90748 20.1025 4.55323 20.1025 4.14544C20.1025 3.62231 19.9173 3.18362 19.5468 2.82937C19.1764 2.47513 18.6082 2.298 17.8424 2.298H15.2076V6.14734Z" fill="#485563"/>
                    <path d="M35.4022 4.78802H33.4542C33.3793 4.37611 33.2399 4.01362 33.0359 3.70057C32.8319 3.38752 32.5822 3.12183 32.2867 2.90352C31.9912 2.6852 31.6602 2.52044 31.294 2.40922C30.9318 2.298 30.5468 2.2424 30.1389 2.2424C29.4022 2.2424 28.7425 2.4257 28.1597 2.7923C27.5812 3.1589 27.1233 3.69645 26.7862 4.40494C26.4532 5.11343 26.2867 5.97845 26.2867 7C26.2867 8.02979 26.4532 8.89892 26.7862 9.60741C27.1233 10.3159 27.5832 10.8514 28.166 11.2139C28.7487 11.5764 29.4043 11.7576 30.1327 11.7576C30.5364 11.7576 30.9194 11.7041 31.2815 11.597C31.6478 11.4857 31.9787 11.323 32.2742 11.1088C32.5697 10.8946 32.8195 10.6331 33.0234 10.3241C33.2315 10.0111 33.3751 9.65273 33.4542 9.24905L35.4022 9.25523C35.2981 9.87722 35.0963 10.4498 34.7966 10.9729C34.501 11.4919 34.1202 11.9409 33.654 12.3199C33.192 12.6947 32.6634 12.9851 32.0682 13.1911C31.4729 13.397 30.8236 13.5 30.1202 13.5C29.013 13.5 28.0265 13.2405 27.1608 12.7215C26.295 12.1984 25.6124 11.4507 25.1129 10.4786C24.6176 9.5065 24.3699 8.34696 24.3699 7C24.3699 5.64892 24.6197 4.48939 25.1191 3.52139C25.6186 2.54927 26.3012 1.80371 27.167 1.2847C28.0328 0.761565 29.0172 0.5 30.1202 0.5C30.7986 0.5 31.4313 0.5968 32.0182 0.7904C32.6093 0.97988 33.14 1.25998 33.6103 1.6307C34.0806 1.99731 34.4698 2.44629 34.7778 2.97766C35.0858 3.50491 35.294 4.10837 35.4022 4.78802Z" fill="#485563"/>
                    <path d="M41.8502 13.327H37.7107V0.673004H41.9813C43.2341 0.673004 44.3101 0.926331 45.2092 1.43299C46.1082 1.93552 46.7971 2.65843 47.2758 3.60171C47.7586 4.54087 48 5.66746 48 6.98146C48 8.29959 47.7565 9.43235 47.2695 10.3798C46.7867 11.3272 46.0874 12.0562 45.1717 12.567C44.256 13.0737 43.1488 13.327 41.8502 13.327ZM39.64 11.6587H41.744C42.718 11.6587 43.5276 11.4775 44.1727 11.115C44.8179 10.7484 45.3007 10.2191 45.6212 9.52709C45.9417 8.83096 46.102 7.98241 46.102 6.98146C46.102 5.98875 45.9417 5.14639 45.6212 4.45437C45.3049 3.76236 44.8325 3.23717 44.204 2.8788C43.5754 2.52044 42.795 2.34125 41.8626 2.34125H39.64V11.6587Z" fill="#485563"/>
                </svg>
            </span>
            <span data-value="curved">
                <svg width="60" height="26" viewBox="0 0 60 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.30362 19.2601L2.8934 20.2466L0 9.08293L1.5349 8.00919L10.7657 14.7396L9.35546 15.7261L1.90512 10.1456L1.83632 10.1938L4.30362 19.2601ZM2.16616 15.591L6.74076 12.3909L7.51036 13.5267L2.93577 16.7269L2.16616 15.591Z" fill="#485563"/>
                    <path d="M17.9225 11.7765L15.7371 1.14353L19.5693 0.330317C20.3119 0.172734 20.9524 0.166864 21.4907 0.312707C22.0283 0.455088 22.4615 0.711755 22.7901 1.08271C23.1181 1.4502 23.3361 1.897 23.4442 2.42311C23.5353 2.86615 23.5321 3.25695 23.4346 3.59552C23.3364 3.93062 23.1716 4.21845 22.9401 4.459C22.7114 4.69537 22.4455 4.88907 22.1424 5.04008L22.1637 5.14392C22.5147 5.0875 22.8772 5.1298 23.251 5.27081C23.6275 5.40765 23.9642 5.64504 24.2612 5.98298C24.5582 6.32091 24.7632 6.76505 24.8763 7.31539C24.988 7.85881 24.9623 8.37359 24.7991 8.85974C24.6387 9.34171 24.3238 9.76433 23.8546 10.1276C23.3846 10.4874 22.7443 10.7533 21.9336 10.9254L17.9225 11.7765ZM19.2186 10.0656L21.4975 9.58204C22.2537 9.42157 22.7648 9.1578 23.0306 8.79074C23.2964 8.42367 23.3835 8.01689 23.2917 7.57039C23.2227 7.23465 23.0759 6.9443 22.8514 6.69936C22.6268 6.45442 22.3425 6.28177 21.9984 6.18141C21.6576 6.08032 21.2761 6.0746 20.8537 6.16423L18.5186 6.65975L19.2186 10.0656ZM18.2614 5.4085L20.3768 4.95961C20.7311 4.88443 21.0353 4.74762 21.2896 4.54917C21.5473 4.35 21.734 4.1081 21.8497 3.82347C21.9681 3.53466 21.9921 3.21892 21.9216 2.87625C21.8313 2.43667 21.6039 2.10021 21.2396 1.86688C20.8752 1.63355 20.3797 1.58338 19.7529 1.71639L17.5966 2.17395L18.2614 5.4085Z" fill="#485563"/>
                    <path d="M43.1012 4.5657L41.5023 4.25126C41.5069 3.89201 41.4506 3.56401 41.3335 3.26726C41.2163 2.9705 41.054 2.70627 40.8464 2.47458C40.6389 2.24288 40.3938 2.05061 40.111 1.89775C39.8316 1.74557 39.5245 1.63655 39.1897 1.57071C38.5849 1.45179 38.014 1.49978 37.4768 1.71468C36.9431 1.93025 36.481 2.30938 36.0905 2.85206C35.7035 3.39541 35.428 4.09755 35.264 4.95849C35.0987 5.82637 35.0958 6.58574 35.2554 7.23659C35.4184 7.88811 35.71 8.41365 36.1301 8.81321C36.5502 9.21276 37.0592 9.47133 37.6571 9.58891C37.9885 9.65408 38.3114 9.67076 38.6258 9.63896C38.9443 9.60435 39.2421 9.52064 39.519 9.38783C39.796 9.25501 40.043 9.07488 40.26 8.84744C40.481 8.6172 40.6564 8.33836 40.7861 8.01091L42.3841 8.33056C42.1988 8.83796 41.9412 9.28792 41.6112 9.68042C41.2854 10.0701 40.9007 10.3871 40.4572 10.6312C40.0178 10.8725 39.5373 11.0319 39.0157 11.1094C38.494 11.1869 37.9445 11.1689 37.3671 11.0553C36.4584 10.8766 35.6903 10.4987 35.063 9.92152C34.4363 9.34089 33.996 8.60062 33.7421 7.70072C33.4916 6.80149 33.4745 5.78428 33.6907 4.64909C33.9076 3.51043 34.2987 2.57351 34.8641 1.83833C35.4301 1.09968 36.1101 0.581522 36.904 0.283862C37.6986 -0.0172703 38.5486 -0.0788126 39.454 0.0992351C40.0109 0.208751 40.5146 0.392457 40.9653 0.650354C41.42 0.90545 41.8107 1.22718 42.1372 1.61554C42.4644 2.00042 42.7118 2.44164 42.8793 2.93918C43.0475 3.43326 43.1215 3.97543 43.1012 4.5657Z" fill="#485563"/>
                    <path d="M51.5599 16.7757L48.7094 14.7817L54.7715 5.8346L57.7123 7.89185C58.5751 8.49539 59.1947 9.19283 59.5711 9.98417C59.9494 10.7726 60.0775 11.6156 59.9552 12.5131C59.8378 13.4097 59.4643 14.3226 58.8348 15.2517C58.2033 16.1837 57.493 16.8673 56.7038 17.3025C55.9174 17.7398 55.0866 17.9185 54.2113 17.8385C53.338 17.7556 52.4542 17.4013 51.5599 16.7757ZM50.8371 14.5315L52.2861 15.5451C52.9568 16.0143 53.6011 16.2761 54.219 16.3306C54.8389 16.3822 55.425 16.2405 55.9772 15.9056C56.5314 15.5678 57.0483 15.0451 57.5278 14.3373C58.0034 13.6354 58.2966 12.9626 58.4074 12.319C58.5211 11.6773 58.4473 11.0784 58.1862 10.5222C57.9251 9.96604 57.4735 9.4634 56.8314 9.01425L55.3008 7.94352L50.8371 14.5315Z" fill="#485563"/>
                    <path d="M57.0036 24.5816C53.8499 20.4523 49.8075 17.1117 45.1862 14.816C40.565 12.5203 35.4877 11.3305 30.3437 11.3379C25.1997 11.3453 20.1257 12.5496 15.5109 14.8585C10.896 17.1675 6.86285 20.5196 3.7207 24.658L5.4326 25.1704C8.37306 21.2977 12.1473 18.1607 16.466 16C20.7846 13.8393 25.5329 12.7123 30.3467 12.7054C35.1605 12.6984 39.9119 13.8119 44.2366 15.9602C48.5612 18.1085 52.3442 21.2347 55.2954 25.0989L57.0036 24.5816Z" fill="#485563"/>
                </svg>    
            </span>
            <span data-value="curveReverse">
                <svg width="54" height="25" viewBox="0 0 54 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M54.0007 1.3373C50.9302 5.23068 46.9944 8.38039 42.495 10.5449C37.9956 12.7094 33.0522 13.8312 28.0439 13.8242C23.0356 13.8173 18.0954 12.6818 13.6023 10.5048C9.10912 8.32778 5.18233 5.16714 2.12305 1.26525L3.78979 0.747006C6.65271 4.39845 10.3275 7.35622 14.5322 9.39348C18.737 11.4307 23.36 12.4934 28.0469 12.4999C32.7337 12.5064 37.3598 11.4566 41.5704 9.43103C45.781 7.40546 49.4642 4.45791 52.3376 0.814432L54.0007 1.3373Z" fill="#485563"/>
                    <path d="M1.37302 16.3375L0 15.4074L8.98733 9.06152L10.4818 10.0739L7.66465 20.5998L6.29163 19.6696L8.69804 11.1241L8.63106 11.0787L1.37302 16.3375ZM3.91457 13.19L8.36853 16.2073L7.61922 17.2783L3.16527 14.2609L3.91457 13.19Z" fill="#485563"/>
                    <path d="M15.9304 23.9401L18.0582 13.9146L21.7893 14.6814C22.5123 14.83 23.086 15.0705 23.5104 15.4029C23.9355 15.7321 24.2236 16.1199 24.3745 16.5665C24.5262 17.0097 24.5494 17.4794 24.4441 17.9754C24.3554 18.3932 24.2027 18.7296 23.9859 18.9848C23.7697 19.2367 23.5123 19.4222 23.2136 19.5413C22.9189 19.6578 22.6073 19.7232 22.279 19.7375L22.2582 19.8354C22.593 19.9212 22.9001 20.0967 23.1796 20.3619C23.4631 20.6245 23.6725 20.9588 23.8079 21.3646C23.9432 21.7705 23.9559 22.2329 23.8457 22.7518C23.737 23.2641 23.5166 23.6991 23.1846 24.0566C22.8566 24.4115 22.4136 24.6559 21.8556 24.7899C21.2983 24.9206 20.625 24.9048 19.8356 24.7426L15.9304 23.9401ZM17.7429 22.9587L19.9617 23.4147C20.698 23.566 21.2551 23.534 21.6331 23.3188C22.011 23.1036 22.2447 22.7855 22.334 22.3645C22.4012 22.0479 22.3816 21.7408 22.2752 21.443C22.1688 21.1453 21.9813 20.8871 21.7128 20.6684C21.4475 20.4504 21.1093 20.2992 20.698 20.2147L18.4245 19.7475L17.7429 22.9587ZM18.6749 18.5677L20.7345 18.991C21.0794 19.0618 21.4033 19.0603 21.7063 18.9863C22.0126 18.913 22.272 18.7756 22.4843 18.574C22.7007 18.3699 22.8432 18.1062 22.9118 17.7832C22.9998 17.3687 22.9259 16.9908 22.6903 16.6495C22.4547 16.3082 22.0318 16.0748 21.4215 15.9494L19.3222 15.518L18.6749 18.5677Z" fill="#485563"/>
                    <path d="M39.1873 17.1784L37.6305 17.4749C37.5063 17.159 37.3382 16.8922 37.1263 16.6744C36.9144 16.4567 36.6732 16.2836 36.403 16.1551C36.1327 16.0266 35.8425 15.9461 35.5323 15.9134C35.2256 15.8802 34.9092 15.8946 34.5832 15.9567C33.9944 16.0688 33.4958 16.3148 33.0874 16.6948C32.6824 17.0742 32.4005 17.571 32.2418 18.1853C32.0864 18.799 32.0885 19.5117 32.2482 20.3235C32.4091 21.1417 32.678 21.807 33.0549 22.3194C33.4351 22.831 33.8863 23.1865 34.4087 23.3859C34.931 23.5852 35.4832 23.6295 36.0654 23.5186C36.388 23.4572 36.6857 23.3563 36.9583 23.2161C37.2337 23.072 37.4727 22.8923 37.6754 22.6772C37.8781 22.462 38.0368 22.2161 38.1515 21.9396C38.2689 21.6592 38.3277 21.3525 38.3278 21.0197L39.8855 20.7282C39.8995 21.2383 39.8277 21.724 39.67 22.1853C39.5149 22.6427 39.2807 23.0574 38.9674 23.4295C38.6567 23.7977 38.2797 24.1089 37.8362 24.3631C37.3927 24.6174 36.8899 24.798 36.3277 24.9051C35.4429 25.0736 34.614 25.0175 33.841 24.7369C33.0673 24.4529 32.4049 23.9627 31.8538 23.2663C31.3061 22.5692 30.9269 21.6855 30.7164 20.6152C30.5052 19.5416 30.5236 18.5822 30.7715 17.737C31.0187 16.8885 31.4477 16.1921 32.0585 15.648C32.6686 15.1005 33.4144 14.7428 34.2959 14.575C34.8381 14.4717 35.3589 14.4523 35.8581 14.5168C36.3601 14.5775 36.828 14.7193 37.2618 14.9423C37.695 15.162 38.0762 15.4595 38.4054 15.8349C38.7339 16.207 38.9946 16.6548 39.1873 17.1784Z" fill="#485563"/>
                    <path d="M51.4414 18.6799L48.666 20.5601L42.7638 12.1242L45.6271 10.1845C46.4671 9.61549 47.3066 9.29566 48.1457 9.22507C48.9829 9.15173 49.782 9.32077 50.5429 9.7322C51.3046 10.139 51.992 10.7804 52.6049 11.6564C53.2197 12.5351 53.5848 13.4009 53.7002 14.2536C53.8183 15.1045 53.6896 15.9082 53.3139 16.6646C52.9362 17.4183 52.3121 18.0901 51.4414 18.6799ZM49.1814 18.5717L50.5921 17.616C51.2451 17.1736 51.7034 16.6851 51.9668 16.1504C52.2284 15.613 52.3052 15.0408 52.1973 14.4339C52.0875 13.8242 51.7992 13.1858 51.3323 12.5185C50.8693 11.8567 50.3689 11.3679 49.8313 11.0521C49.2964 10.7345 48.7347 10.5989 48.1461 10.6455C47.5576 10.6921 46.9508 10.9271 46.3256 11.3506L44.8354 12.3601L49.1814 18.5717Z" fill="#485563"/>
                </svg>    
            </span>
        </div>

        <div class="fpd-tool-curved-text-radius fpd-input">
            <span class="fpd-label" data-defaulttext="Radius">toolbar.radius</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="80" 
                step="1" 
                min="0" 
                max="400"
                data-control="curveRadius"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="80" 
                step="1" 
                min="0" 
                max="400"
                data-control="curveRadius" 
            />
        </div>

    </div><!-- Curved Text -->

    <div class="fpd-panel-transform fpd-padding">

        <div class="fpd-tool-angle fpd-input">
            <span class="fpd-label" data-defaulttext="Rotate">toolbar.rotate</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="1" 
                step="1" 
                min="0" 
                max="359"
                data-control="angle"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="1" 
                step="1" 
                min="0" 
                max="359"
                data-control="angle" 
            />
        </div>

        <div class="fpd-tool-scaleX fpd-tool-scale fpd-input">
                <span class="fpd-label" data-defaulttext="Scale X">toolbar.scaleX</span>
                <fpd-range-slider 
                    class="fpd-progress"
                    value="1" 
                    step="0.01" 
                    min="0" 
                    max="5"
                    data-control="scaleX"
                ></fpd-range-slider>
                <input 
                    class="fpd-slider-number fpd-number" 
                    type="number" 
                    value="1" 
                    step="0.01" 
                    min="0" 
                    max="5"
                    data-control="scaleX" 
                />
        </div>

        <div 
            class="fpd-tool-uniscaling-locker fpd-tool-scale fpd-toggle" 
            data-control="lockUniScaling"
            data-enabled="true" 
            data-disabled="false"
        >
            <span class="fpd-icon-unlocked"></span>
        </div>

        <div class="fpd-tool-scaleY fpd-tool-scale fpd-input">
            <span class="fpd-label" data-defaulttext="Scale Y">toolbar.scaleY</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="1" 
                step="0.01" 
                min="0" 
                max="5"
                data-control="scaleY"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="1" 
                step="0.01" 
                min="0" 
                max="5"
                data-control="scaleY" 
            />
        </div>

        <div class="fpd-tool-flip fpd-tools-group">
            <div data-do="flip-x">
                <span class="fpd-icon-flip-horizontal"></span>
                <span data-defaulttext="Flip Horizontal">toolbar.flip_h</span>
            </div>
            <div data-do="flip-y">
                <span class="fpd-icon-flip-vertical"></span>
                <span data-defaulttext="Flip Vertical">toolbar.flip_v</span>
            </div>
        </div>

    </div><!-- Transform Panel -->

    <div class="fpd-panel-position">

        <div class="fpd-panel-tabs">
            <span data-tab="align" data-defaulttext="Align">toolbar.align</span>
            <span data-tab="arrange" data-defaulttext="Arrange" class="fpd-active">toolbar.arrange</span>
        </div>

        <div class="fpd-panel-tabs-content fpd-scroll-area">

            <div data-id="align">

                <div class="fpd-tool-position-align fpd-tools-group">
                    <div data-do="align-top">
                        <span class="fpd-icon-align-top"></span>
                        <span data-defaulttext="Top">toolbar.align_top</span>
                    </div>
                    <div data-do="align-middle">
                        <span class="fpd-icon-align-horizontal-middle"></span>
                        <span data-defaulttext="Middle">toolbar.center_h</span>
                    </div>
                    <div data-do="align-bottom">
                        <span class="fpd-icon-align-bottom"></span>
                        <span data-defaulttext="Bottom">toolbar.align_bottom</span>
                    </div>
                    <div data-do="align-left">
                        <span class="fpd-icon-align-left"></span>
                        <span data-defaulttext="Left">toolbar.align_left</span>
                    </div>
                    <div data-do="align-center">
                        <span class="fpd-icon-align-vertical-middle"></span>
                        <span data-defaulttext="Center">toolbar.center_v</span>
                    </div>
                    <div data-do="align-right">
                        <span class="fpd-icon-align-right"></span>
                        <span data-defaulttext="Right">toolbar.align_right</span>
                    </div>
                </div>
                
            </div>

            <div data-id="arrange">

                <div class="fpd-tool-layer-depth fpd-tools-group">
                    <div data-do="layer-up">
                        <span class="fpd-icon-move-up"></span>
                        <span data-defaulttext="Move Up">toolbar.move_up</span>
                    </div>
                    <div data-do="layer-down">
                        <span class="fpd-icon-move-down"></span>
                        <span data-defaulttext="Move Down">toolbar.move_down</span>
                    </div>
                </div>
                
            </div>
            
        </div>

    </div><!-- Position Panel -->

    <div class="fpd-panel-advanced-editing">

        <div class="fpd-panel-tabs">
            <span data-tab="filters" data-defaulttext="Filters" class="fpd-active">toolbar.filters</span>
            <span data-tab="crop" data-defaulttext="Crop">toolbar.crop</span>
        </div>

        <div class="fpd-panel-tabs-content">
            <div data-id="filters">
                <div class="fpd-tool-filters fpd-grid fpd-scroll-area fpd-padding"></div>
            </div>
            <div data-id="crop">
                <div class="fpd-tool-crop-masks fpd-grid fpd-scroll-area fpd-padding"></div>
            </div>
        </div>

        
    </div><!-- Advanced Editing -->

</div>`);

let ElementToolbar$1 = class ElementToolbar extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html; 

    }

};

customElements.define( 'fpd-element-toolbar', ElementToolbar$1 );

const FPDFilters =  {

	none: {
		name: 'None',
		preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAABGhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+eG1wLmlpZDozNDlGNUFEOERDNDhFNDExOThFMDgyRUM1NERENjU5QTwvc3RSZWY6aW5zdGFuY2VJRD4KICAgICAgICAgICAgPHN0UmVmOmRvY3VtZW50SUQ+QzA2NTAzMzhGRDBGRjNDNTQ2NjQ5MTdERjU4RTZBOUY8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6NDJBOTU5NjZBQTVFMTFFNDg3MTc5QzUzNEZBREI5NjI8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6NDJBOTU5NjVBQTVFMTFFNDg3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'
	},

	grayscale: {
		name: 'Grayscale',
		preview: 'data:image/png;base64,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'
	},

	sepia: {
		name: 'Sepia',
		preview: 'data:image/png;base64,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'
	},

	vintage: {
		name: 'Vintage',
		preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAEDWlDQ1BJQ0MgUHJvZmlsZQAAOI2NVV1oHFUUPrtzZyMkzlNsNIV0qD8NJQ2TVjShtLp/3d02bpZJNtoi6GT27s6Yyc44M7v9oU9FUHwx6psUxL+3gCAo9Q/bPrQvlQol2tQgKD60+INQ6Ium65k7M5lpurHeZe58853vnnvuuWfvBei5qliWkRQBFpquLRcy4nOHj4g9K5CEh6AXBqFXUR0rXalMAjZPC3e1W99Dwntf2dXd/p+tt0YdFSBxH2Kz5qgLiI8B8KdVy3YBevqRHz/qWh72Yui3MUDEL3q44WPXw3M+fo1pZuQs4tOIBVVTaoiXEI/MxfhGDPsxsNZfoE1q66ro5aJim3XdoLFw72H+n23BaIXzbcOnz5mfPoTvYVz7KzUl5+FRxEuqkp9G/Ajia219thzg25abkRE/BpDc3pqvphHvRFys2weqvp+krbWKIX7nhDbzLOItiM8358pTwdirqpPFnMF2xLc1WvLyOwTAibpbmvHHcvttU57y5+XqNZrLe3lE/Pq8eUj2fXKfOe3pfOjzhJYtB/yll5SDFcSDiH+hRkH25+L+sdxKEAMZahrlSX8ukqMOWy/jXW2m6M9LDBc31B9LFuv6gVKg/0Szi3KAr1kGq1GMjU/aLbnq6/lRxc4XfJ98hTargX++DbMJBSiYMIe9Ck1YAxFkKEAG3xbYaKmDDgYyFK0UGYpfoWYXG+fAPPI6tJnNwb7ClP7IyF+D+bjOtCpkhz6CFrIa/I6sFtNl8auFXGMTP34sNwI/JhkgEtmDz14ySfaRcTIBInmKPE32kxyyE2Tv+thKbEVePDfW/byMM1Kmm0XdObS7oGD/MypMXFPXrCwOtoYjyyn7BV29/MZfsVzpLDdRtuIZnbpXzvlf+ev8MvYr/Gqk4H/kV/G3csdazLuyTMPsbFhzd1UabQbjFvDRmcWJxR3zcfHkVw9GfpbJmeev9F08WW8uDkaslwX6avlWGU6NRKz0g/SHtCy9J30o/ca9zX3Kfc19zn3BXQKRO8ud477hLnAfc1/G9mrzGlrfexZ5GLdn6ZZrrEohI2wVHhZywjbhUWEy8icMCGNCUdiBlq3r+xafL549HQ5jH+an+1y+LlYBifuxAvRN/lVVVOlwlCkdVm9NOL5BE4wkQ2SMlDZU97hX86EilU/lUmkQUztTE6mx1EEPh7OmdqBtAvv8HdWpbrJS6tJj3n0CWdM6busNzRV3S9KTYhqvNiqWmuroiKgYhshMjmhTh9ptWhsF7970j/SbMrsPE1suR5z7DMC+P/Hs+y7ijrQAlhyAgccjbhjPygfeBTjzhNqy28EdkUh8C+DU9+z2v/oyeH791OncxHOs5y2AtTc7nb/f73TWPkD/qwBnjX8BoJ98VVBg/m8AAAAJcEhZcwAACxMAAAsTAQCanBgAABUNSURBVGgFjZpLjyRXVsdPxjMjH/Xuh9ttj7vNYpBnPEay0SDBhg0IIfgGiD1fwuITsOKjsGY2wAyix2DMLLA9ZXe37a6uqqzKR0TGm9//RKbdRjPSRFdkRNy499zz/J9zb/To/B//rA+DwMKR+dHxq7Pcdna9Ku0/v9zapxctbb01bWd11/vZ06fnR8PiMLAUGglEJklgGec4pi0eWRKHXENLopFF9OOVBVyjKGAs/4LRbm7uRzsmoKlj/6S5mM3/6MSLkZ6s83sIjqA36ncEIDh07m2EJOoDLxbDTAPHLQJUHYK0vXG7OzTWjCZradHZMNZP2iLOjrE6B7Z66zXglWN4Gug4X9++2/eDH9qGX11FS08jC/y2Q6DeIp/AicO1bLFTs+QKQ7MMQUSp4aexAKGwjgiIEO0B2ui4H86hX6tnFNRyNh0a9yt9maJnCppcuJB5nZRTE2uDQKLuB/2Q/JVbBPDnQRwJpDPkEsEbPIVYR7NokNjYMcnTGFEDXKaV2l1lAbL2LoRzpjYkcoYQys1OW8NYWUTD3CrQlAJktYE1bhj1LfM0OnmR0yunqEZ/8B90MDx/TxjaoBvt+NiNRgDUNbgCkkIkwZcjCULvDkZ7n0UkYUHCayb9IUzAc8QZcB/KXM7ZIBxPzpOaNSrgXcSDj+NeXTXfftjQm46vHKgbLuBax85S/ji41qtDhk7SuGsLJ4w5JcyYYM24pnCRMCGPMDQIt0X9OaqX/4v+ELTcMLH66FdPkhtvheHBouon5on97wsiSX/DMXDHgEGPg8JFmCPqu5pAFmrRDQE6ObF7/CCMBHlzGthDJDgchzbPQuMPQToYg3m6bZvebrdmV2Vv1zVxQptiRhR2cw6C8CzNO1JxL+27IGrjRQBd8aX7nbO6GtQmtnSVgnUjhUkpmkA8RG1VOMHWYu/dd5XHQAv0VNvKmk1jdzSAEXHV2xgqSdTaOIssjmJQLWbiwB4cmBX1yG6q0J6ue3sJfDdYSXDrM0kCDv2KeT0O1hLTukcxcKf7kZS6O1wgaeN7h4KeBs7B1UCtvinQYGMhTPXAa55Xtl7VtrxpbLForECQgVgLOrRWZ0BxBndVZH0a2WiSWTye4O9mM3xuOpnYEe+frUZ2fttaWaMiZkVchxEPfthuOQMCTk4njXaYR4JI02JQxyu3gy5o28eIxuwPhULUbDdutuWqt8trXGSJv5MIm6Yx+Hb/jQK0xSgFfMipeGkrhOrlR7X19E1nMw+CyCo7nqY2G8d2gDv+eiHXwzr4WwNngsoBsPklOERZ4OC28KvYkwjfyuP37vn7VmjshRQSSqbom+dLu7g0u74RxIbW8aav68F/gd6OQG6ZPUTlHYK17ci2xIP0G+GkRJXVKCNUJp8iDNbtoTHGSj+IIwQK7POr0oryO+AVEwPrgys5fzvm90IMba/87jlXP/5khb0Qsk700cdoNcDX4apT5q7gnBfuvwpAHwRBeuteg0uGyA1n89giyg8RqtYri5KI5xQfjxC65j6xu0cJtAM7vyysVMr/fwdD6Q/h3+VQNwZoPo3zc/cTlGi3p4ZSYFdFjQUElzrxGsEP9xooaxDXfuhZWTsvWhAPRoCbTh04e1zNfZVOPc8B6HY8T+3h6RiQ4BVjRfU3H79dIB+jsRDwBCu0kvdwqv6LlLE7TpGQW0k7rQRwbMOvK8xGEKuskE1Ve9U1rsb7usL34VtulkynzmS9LSgilRBJX9DqQMEAi5wijJDwcr1FOIjxNwg0BPtgFLX4RLurON/1211hEZpqG+q/vWDoSPEqze0IEg+esAUf/CkfCEoGp1AbTgcKEN/A68iKorI4AZRhvOY+SLBOA1JNVds4Ae8fp7GdHmfWQLxCcYovzyFiWUjCAY/8iGPN40/eqCblt66V1SUCPDBGildTyzsXRMmmJ7m5VqR6OlF+0VNONhzSsCrgfWUsbZckwCQGd6LUJ+9aoLrmeSLBJAR1Wyh/hMqotTQN7QTLLAh8KU4KY1qPR2fctUUDnO+DWbNX9dbKvGBuAAapI5gL4CcKIpBThawUI77FtAhC2ItDEXSNIAj3JS4kIRUzGXkEet4eZdIKEwkgYCdOU2JEkKZxtEFYoCGj+pV5Jsi1oX+J1gUKLIY02fBPVabuNCmEAwIw365tW4CKMBdErncHnBFeEZSNjXuARUKFSCIm96b0ex51qFk/YrZGiymJTvEh3mjCJYkXJl8tt3ZyNgOiIRpKOlyReAhxJ8+U2F/9xXNIVRBvr+ziemnJZG7jyYFbLQRJlJTF8Eh+gyIJY6tQzGC9IebU2mORFqQNAoQhVcxx5Uj+NxxwzL0EUejLMnIsPetK/rOEjkIpIYVWg3KvimAPi4b+WA03ChGiBgqDRJUCJkDYIGS1IMVDxyteEOTFZy9tMlnYo0f3rMG0i3xjI6A7nc6tpA6YyT3r0pNtMIo9Vkc7ZqUU1Xla8wQJXKEcBFGyG4RwNHglLlxGBFLsRfSpys4mVIzKbcojY5KdxlS4Xr4uLcNvHHIRsne4ozAJ6SDXJX7y60u7uFjas6/WtGfQYt3SlJYkqY3x98sXF/ar9Vd23s/tp49P7SjkHdrfx34rOJc+EEtL75G/Q6FS4J8/nH7ogsLsUGy78WCIZ9pkD/3zPkgm94jI4m4xLCLX3OcbBXuj0gUzCcFGaE1JUmQ2Nwv7/NOvbLFsLM5SOzweW0Yp40UP/p6miXVJZv/yrLR//mRpN6vcfv/exMbpmNG7IBYTnPIEcekO7i7D2kY+P9zDLhMrP+B6bkq5gpKPhjiyYa3VprMk7S0FZrV+j/rQg71bAcn49ph5ywKXwFQzavvDo9LCbGxL8kc0O7QjL07xR/c15ScigQmaqqLwq+we82+Kzq5uqQxGuA2A4AzKn4BMxYcqEKUAWUTxI5eLoM8DAqBpCSEYG0oRhBAY6aCz4zX9ZLWWgcL1lBo9UPAAiRuguANiK5CtbQZQuF5SUD5b2ulrVMZnKdbxKIMJJhMTmhA6UqTiTrnlh3dam0Vrz1Oaeu9WvZINsSJfHlRLZ3jx9RM0og3rBmXiBPRp0bjWEDzSR3bwG59IdHoFMs0qTypQqWJ9UqVoBE6QjWd8GE1HZH+BwuKWCSahnc0maAlB3bb0R2v8Mqa3LbS2CCGFKy/MjxN7/0FsS0BCVh1KJr3lgAnNo7Fw48KPKFLVHh0fB3ZxRSlCh4TJpB2tLXSVMB4numcw8zmDohYr+OWCWELwHhM3otECCC1WLnm4LUb2xv0xMRFZ69bE+lCSIm5hcgOadcmUPbAhaRYtcdVn9kd/PLWLxdYWWHja5CCh1jPkqUjxgjqUyPxwJpEDQd5/lzL7qdnnX3S2hgltpPXuXnDF4clSGoeYWlxArtJuTYki4UrMFABlcg2hW4lVr9dU0kFi80MCWskL4Vtc6hoBCmD2+PiuddRlq+3KrgAChnCGNqH8Pzs6tvl0S+lfWo5WU/jp+opKYmVxS8Utptw0rmHrFV9rUOStB4G9/mBsn533dv60cD8f4x6KR9ZUsuJgTI2TNByNmEfLoqfDd04QIoSjLbF8mRtJMrYpNZcy9RIkW8Pk/PiOncCY1jw3myXKK9EoEEvZH6AJzXm5vEGILe2MLfEU2ubj1I6OT0gBuW03a8v6xL2/0+IOHqKiCHx7NJtv7d0/OLV7DxL75S/XdpuzLqfqFQgwra8MpQgUijUUF4NSJCdLEteoShlZ6AbXYqVsjw4TtkvNbrXahIkDSph1vmI9X+BOkU3SjISKphnUQnAEfLv1kEbu4gIy25aA6/KcwNe6aWzBLLTbza2lVOYxbdJl9PDtuV1+s7VrVnGt5fb62w9tcrC2f//FS1aOmEzuQqAoVlTpUA14kbZ3MV09FLGO3iGLvSRu2NKww4OY5S0ud3oKLKf24volY1ELwZljkSmJbDqeWbHCtWBHe2JFRV6n/BA+DhArpQFG2QFuWAIot7hfZvPJKeXRigXdll2dDM8pN3ZyMrI7d1nZdSxJlxubnR7bn/zpm/bOO4deLhe4UUk85GgZoNoJwxWmleXVvsHC7FPYgusVFbA2EzJyTYsAB/NDu769tlrrewJVW1AauypywKO2Q8oSbZ9GoMbgqlgIUTrwX9pOWGnWaKnE/XogOy8r6C2oJM4shddlt7Go68esuWt3oeldCAKnRCGY39l77x3Z0VFsTz5a2IKdFe0eqsbK5pEteVato6DvEJJbI4/hUp2xeWJj+sVRZ9ODCUwT4FhAcFsrOXEVTHfkkgLXyqLEDrIp4IEWQDJBvayTCKV40DpEoilQCTfLcNGIfhco55DCc3b2mkVa4o7QxNGDhxRgKcvdAkjdoO4VCc/s8duv2dHJxD79fGmffbG2clraow8w60Vqv/i3Z5CHOm6l/LLC15fcbLjqc4JgOQVamZtNiIw4wrIIWiNYhWAjrtJ4TZmYsjgLRqxroCWt4F3EHn6NIFtZhjMm+EOSqvbRalmWsYt8bdOU7agl6rvzFiY6OLJ6fWXN8gUWQds1ddMWrR7e2pTS4r2f3LXnYWVfUBzay0t7//Eb9nhxx/7jvy88UNGlb5uuQC3lk8MZga4KFmlu1jfuViFaHIMeGRpqYVwWEDOyUIPWE8oXlRcSIC/ZbyP4Y8ZjHE5lEiGP+rJdJQujIW2a5Cg+8v0moFGBxTLFuuwOgZMjMShBeNe32vfa2keXjT25oHQAlrubzp6cf2nv/vh11upv2s+ePLeXBIrHj9TPfMfTxAK5qVwIbrWKG5amfJxAm3JTX1HyXqtErUNSmD7I5vbs6rmdzU98fbIoVrgzfCCUlrRyMwGPitVOtRd8RwgZ/tXj2YfaTUwpIwKq0hZc7wJgsUkZHMFAbM+vS/vZi5XdyE3FG+6kYjJH2EePDu1Hr59ZCMRqNyMHKrVg/OAHx3b3pAcBQRQSYw7+Uzf4uFoLfghpuSqI9WUrCCbIVe304uW1zal6TwCJFgEqSn0Vh7EkoL9QNEa4CAtmuBqrQwv/4q3Zh5psNJmyyYYWkTQvSHQQDoLGVlcb+/lFYU+pRyi1BleQ0iEWMmlDLE2PxvbDN+7ZB/dD+/EbJD02ux8csZWaoq0UVDq850gT4ONjJo61fhAjMCWNylLoWj7GiWshREICkhASTJbQO5VOEeZTleCfI7jCLn0aizKSS0Byyhe4DQlmxPrh5gJ8BuJUQN5Stj9lbQyiOjK5UuSzzFmzB3q90Resr22d1XbEivD+vLPXfzKFCW39rO2rlyu7d+eRnRGDq3zpLnQNoFS8Dz2YoQutRFmcIG6IT21SCGo3WFFxQyahrzY4JDQgIXCGn5Y++q45IilGK1LwZr303fX14tZueU5nrNjmM1td3Nqv2QcWpOIMEJNGpDOuEN5CqANzt2wn5fWl1WMAYwX08pMdIAzZ8Rm1yuPb59RcD8nqrDNWdMCFImV2rFMpi8pf0XiJJhXoJUpMQgBBmternb3oyPzDslebirKTQI4IVB5xQW1JzaWMq8VSr8zcrHGxxi627CbCuYRgfi8iFZgVZtczrz0p4v1odmFFeGB3iKtuzU7+ms8M0P/k/Nw+eOfEsvHUlsClvgL7YN7Jv4VONUGsKlh8KwZleQnRkER1r40+1V6DcMpRxAVFqMbKI4kX1hRgp/ZzR6CAVowF0KcSvcWfCrStXfQEtPL1vahzOmqghZrA0VcGvA+pKBjDpd32E1aHkWVYq8c1Pvk6p676lb3zez+yk4NTh0vlDZRqOSWJb7AhnHKOYPiAGmwND5qvYg5ZSYCgXCJAaOmj1aEUMo4mjCMHSVwR1GJHdZC07OhBm8oIrVu01Sk/5o+AZx3CjWJGh76dq2pVX60StywF1qDZV2FhX6OctAzII4E9+fLK/ut/P7YZ/n//+D46D6mdNsrXMDIsZ7fsmmiWBJ4GZONJ82GVCIBw1NOaBesLbLRhqH+C8uDNd96wMTFR8iGwgjslMJUb/kEUqaa4m4RR4EvKrdYgEgIigk7PsryXZZQIC35yhFG2Lo7YiIBetw3t+XJkPz+/tn/9n4+Za0kmp8yAyRrm5QEqSQQQYnCDlRriL0TryiFitq4om7gXcxKoR6AQxJG1BMHh3/3l2x8e3SNICcw1G21aropRlerScoWrfUODtqi0GS0EUbvW9rKQ5PO4cl3yjIBaMnPBJTtb0Wudh5QSg4sucirt5aWdTCI7xs2kIClDCCaGZWGVL0yjqEMwxYECm2UzVmmAK8G4vt9rrnk2Yy5WkX/zh6cfxkDu2WuHdng2YSg7JevaClkITZcItoDzgmWw3EtuCG1nu0c7ygH+vyEkIhp2DtCqQlYbEaqrcq6XN8OXqxamr6kCnl8vQKe13T+Ye/XrCY7xCfvIbmXiQJl/zGpSc0jAmPcZdVWMJ0wRQHH2YnlhT56e2+if/v6ve32hlZnUWRlmycro6muC9qbgS1aJW2ztE+obDI52YJWqNmbjTUJpE0K7fmwsQkPsS8P04ZS8HZqTgm/5tLegNNAXutkUhrVByLiTaWhv3Znbo7undvdgZocwKJ8vcDlBs1DNQQbtuQAgX04deLPN7WLF17ZVwX4yCf0f/vanfcJHzTGZVEHn/wmGZ32Jcg3DUY9GVwxeQbgGxbRiK+FuDVQVtG8pOSqVKGhR3x51L38XGmkXcstZEn8bvvZuwOuMHcYxdZhcXhJrI2NGNaD67O48szdP53b/cA7SpShMFYBAaNhBUezKteV6qeIDVEzQYHS1YLseYvL5CPSRVbSdI5zWzkiMcPqfPAqqA96FLJYCBofUYyJOxPt4AYRcT4cuOlUoDu44LJTUpvjT1RdSzKvglicOq1C5586yfh3e+SY2z/z5qYSsTOhRymLQXU8j95PJb6RJ5ZVgRLZEgCgAHbSpIAGZUTCtHCKBHfYQRv9tSfdSiGo1/Ucb3ScS1Bkd3tHMI/fig6sk8m/q3iY1D4zuNYHHI+jQ5hl8d4+3iixjh3eiiSGkHzUygTOjl8MIvfGTYFPJrP8dpC/kw+ci2ujm6KVkgDDKP/vKUrT6nRDqJwv4/yTSHHSXJYZjd+XiQnq/HT90GIlr/UHjOyXovRDUXw3W1T7Urrj0FZtXlSCUNIxyd5LDhJjSuRPYlU2H7xQw9HfiTEo3H+sa5V5uIO17uyRAQ6I1qErvRUsvXjlebZDB3Kf0Xr3lWgNP4vn/AMLONRo1AfMuAAAAAElFTkSuQmCC'
	},

	kodachrome: {
		name: 'Kodachrome',
		preview: 'data:image/png;base64,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'
	},

	technicolor: {
		name: 'Technicolor',
		preview: 'data:image/png;base64,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'
	},

	black_white: {
		name: 'Black & White',
		preview: 'data:image/png;base64,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'
	},

	cold: {
		name: 'Cold',
		array: [
			1,0,0,0,0,
			0,1,0,0,0,
			-0.2, 0.2, 0.1, 0.4, 0,
			0,0,0,1,0
		],
		preview: 'data:image/png;base64,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'
	},

	old: {
		name: 'Old',
		array: [
			1,0,0,0,0,
			-0.4,1.3,-0.4,0.2,-0.1,
			0,0,1,0,0,
			0,0,0,1,0
		],
		preview: 'data:image/png;base64,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'
	},

	milk: {
		name: 'Milk',
		array: [
			0,1,0,0,0,
			0,1,0,0,0,
			0,0.6,1,0,0,
			0,0,0,1,0
		],
		preview: 'data:image/png;base64,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'
	},

	purple: {
		name: 'Purple',
		array: [
			1,-0.2,0,0,0,
			0,1,0,-0.1,0,
			0,1.2,1,0.1,0,
			0,0,1.7,1,0
		],
		preview: 'data:image/png;base64,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'
	},

	yellow: {
		name: 'Yellow',
		array: [
			1,0,0,0,0,
			-0.2,1,0.3,0.1,0,
			-0.1,0,1,0,0,
			0,0,0,1,0
		],
		preview: 'data:image/png;base64,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'
	}

};

class ElementToolbar extends EventTarget {
	currentPlacement = "";
	#colorWrapper;

	constructor(fpdInstance) {
		super();

		this.fpdInstance = fpdInstance;
		this.container = document.createElement("fpd-element-toolbar");

		this.#setWrapper();

		//set max values in inputs
		const maxValuesKeys = Object.keys(fpdInstance.mainOptions.maxValues);
		maxValuesKeys.forEach((key) => {
			const inputElem = this.container.querySelector('[data-control="' + key + '"]');

			if (inputElem) {
				inputElem.setAttribute("max", fpdInstance.mainOptions.maxValues[key]);
			}
		});

		//fonts
		if (Array.isArray(fpdInstance.mainOptions.fonts) && fpdInstance.mainOptions.fonts.length) {
			const fontsList = this.subPanel.querySelector(".fpd-fonts-list");

			fpdInstance.mainOptions.fonts.forEach((fontObj) => {
				let fontName = typeof fontObj == "object" ? fontObj.name : fontObj;

				const fontListItem = document.createElement("span");
				fontListItem.className = "fpd-item";
				fontListItem.dataset.value = fontName;
				fontListItem.innerText = fontName;
				fontListItem.style.fontFamily = fontName;
				fontsList.append(fontListItem);

				addEvents(fontListItem, "click", (evt) => {
					removeElemClasses(Array.from(fontsList.children), ["fpd-active"]);

					addElemClasses(fontListItem, ["fpd-active"]);

					fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({ fontFamily: fontName });

					this.#updateVariantStylesBtn(fpdInstance.currentElement);
				});
			});

			addEvents(this.subPanel.querySelector(".fpd-panel-font-family input"), "keyup", (evt) => {
				const searchStr = evt.currentTarget.value;
				fontsList.querySelectorAll(".fpd-item").forEach((item) => {
					if (searchStr.length == 0) {
						item.classList.remove("fpd-hidden");
					} else {
						item.classList.toggle(
							"fpd-hidden",
							!item.innerText.toLowerCase().includes(searchStr.toLowerCase())
						);
					}
				});
			});
		} else {
			this.navElem.querySelector(".fpd-tool-font-family").style.display = "none";
		}

		//advanced editing - filters
		const filtersGrid = this.subPanel.querySelector(".fpd-tool-filters");
		for (const filterKey in FPDFilters) {
			const filterItem = document.createElement("div");
			const filterData = FPDFilters[filterKey];
			filterItem.className = "fpd-item";
			filterItem.setAttribute("aria-label", filterData.name);
			filterItem.style.backgroundImage = `url(${filterData.preview})`;
			filtersGrid.append(filterItem);

			addEvents(filterItem, "click", (evt) => {
				fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({
					filter: filterData.array || filterKey,
				});
			});
		}

		//advanced editing - crop
		const cropMasksGrid = this.subPanel.querySelector(".fpd-tool-crop-masks");
		if (Array.isArray(fpdInstance.mainOptions.cropMasks)) {
			fpdInstance.mainOptions.cropMasks.forEach((maskURL) => {
				const maskItem = document.createElement("div");
				maskItem.className = "fpd-item";
				maskItem.setAttribute("aria-label", getFilename(maskURL));
				maskItem.style.backgroundImage = `url(${maskURL})`;
				cropMasksGrid.append(maskItem);

				addEvents(maskItem, "click", (evt) => {
					this.toggle(false);
					fpdInstance.advancedImageEditor.loadImage(fpdInstance.currentElement, maskURL);
				});
			});
		}

		addEvents(fpdInstance, "elementSelect", () => {
			const selectedElem = fpdInstance.currentElement;

			if (this.#hasToolbar(selectedElem)) {
				this.#update(selectedElem);
				this.#updatePosition();

				if (selectedElem.getType() == "text") {
					selectedElem.off("changed", this.#updatePosition.bind(this));
					selectedElem.on("changed", this.#updatePosition.bind(this));
				}

				this.#updateVariantStylesBtn(selectedElem);
			} else {
				this.toggle(false);
			}
		});

		addEvents(fpdInstance, "elementChange", () => {
			if (this.currentPlacement == "smart") this.toggle(false);
		});

		addEvents(fpdInstance, "elementModify", (evt) => {
			const { options } = evt.detail;

			if (options.fontSize !== undefined) {
				this.#updateUIValue("fontSize", options.fontSize);
				this.navElem.querySelector(".fpd-tool-text-size > input").value = options.fontSize;
			}

			if (options.fontFamily !== undefined) {
				this.navElem.querySelector(".fpd-tool-font-family fpd-dropdown > input").value = options.fontFamily;
			}

			if (options.scaleX !== undefined) {
				this.#updateUIValue("scaleX", parseFloat(Number(options.scaleX).toFixed(2)));
			}

			if (options.scaleY !== undefined) {
				this.#updateUIValue("scaleY", parseFloat(Number(options.scaleY).toFixed(2)));
			}

			if (options.angle !== undefined) {
				this.#updateUIValue("angle", parseInt(options.angle));
			}

			if (options.text !== undefined) {
				this.#updateUIValue("text", options.text);
			}
		});

		addEvents(document.body, ["mouseup", "touchend"], () => {
			if (this.fpdInstance.currentElement) {
				this.#updatePosition();
			}
		});

		addEvents(this.subPanel.querySelectorAll(".fpd-number"), "change", (evt) => {
			const inputElem = evt.currentTarget;
			let numberParameters = {};

			if (inputElem.value > Number(inputElem.max)) {
				inputElem.value = Number(inputElem.max);
			}

			if (inputElem.value < Number(inputElem.min)) {
				inputElem.value = Number(inputElem.min);
			}

			let value = Number(inputElem.value);

			if (inputElem.classList.contains("fpd-slider-number")) {
				inputElem.previousElementSibling.setAttribute("value", value);

				if (
					inputElem.dataset.control === "scaleX" &&
					fpdInstance.currentElement &&
					fpdInstance.currentElement.lockUniScaling
				) {
					numberParameters.scaleY = value;
					this.#updateUIValue("scaleY", value);
				}
			}

			numberParameters[inputElem.dataset.control] = value;

			if (fpdInstance.currentViewInstance) {
				fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(numberParameters);
			}
		});

		addEvents(this.subPanel.querySelectorAll("fpd-range-slider"), "onInput", (evt) => {
			const slider = evt.currentTarget;
			const value = evt.detail;

			if (fpdInstance.currentViewInstance && fpdInstance.currentElement) {
				var props = {},
					propKey = slider.dataset.control;

				props[propKey] = value;

				//proportional scaling
				if (propKey === "scaleX" && fpdInstance.currentElement && fpdInstance.currentElement.lockUniScaling) {
					props.scaleY = value;
					this.#updateUIValue("scaleY", value);
				}

				fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(props);
			}

			const numberInput = evt.currentTarget.nextElementSibling;
			if (numberInput && numberInput.classList.contains("fpd-slider-number")) {
				numberInput.value = value;
			}
		});

		//call content in tab
		addEvents(this.subPanel.querySelectorAll(".fpd-panel-tabs > span"), "click", (evt) => {
			const targetTab = evt.currentTarget;
			const tabsPanel = targetTab.parentNode;
			const tabsContent = tabsPanel.nextElementSibling;

			//select tab
			removeElemClasses(tabsPanel.querySelectorAll("span"), ["fpd-active"]);
			addElemClasses(targetTab, ["fpd-active"]);

			//select tab content
			const contentTabs = Array.from(tabsContent.children);
			removeElemClasses(contentTabs, ["fpd-active"]);

			addElemClasses(
				contentTabs.filter((ct) => ct.dataset.id == targetTab.dataset.tab),
				["fpd-active"]
			);
		});

		//toggle options
		addEvents(this.subPanel.querySelectorAll(".fpd-toggle"), "click", (evt) => {
			const item = evt.currentTarget;
			let toggleParameters = {};

			toggleElemClasses(item, ["fpd-enabled"], !item.classList.contains("fpd-enabled"));

			toggleParameters[item.dataset.control] = item.classList.contains("fpd-enabled")
				? item.dataset.enabled
				: item.dataset.disabled;

			if (["true", "false"].includes(toggleParameters[item.dataset.control])) {
				toggleParameters[item.dataset.control] =
					toggleParameters[item.dataset.control] === "true" ? true : false;
			}

			if (item.classList.contains("fpd-tool-uniscaling-locker")) {
				this.#lockUniScaling(toggleParameters[item.dataset.control]);
			}

			fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(toggleParameters);
		});

		//buttons with mulitple options
		addEvents(this.subPanel.querySelectorAll(".fpd-btn-options"), "click", (evt) => {
			evt.preventDefault();

			const item = evt.currentTarget;
			const options = JSON.parse(item.dataset.options);
			const optionKeys = Object.keys(options);
			const currentVal = fpdInstance.currentElement
				? fpdInstance.currentElement[item.dataset.control]
				: optionKeys[0];
			const nextOption =
				optionKeys.indexOf(currentVal) == optionKeys.length - 1
					? optionKeys[0]
					: optionKeys[optionKeys.indexOf(currentVal) + 1];
			const fpdOpts = {};

			fpdOpts[item.dataset.control] = nextOption;
			item.querySelector("span").className = options[nextOption];

			fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(fpdOpts);
		});

		//button group
		addEvents(this.subPanel.querySelectorAll(".fpd-btn-group [data-option]"), "click", (evt) => {
			evt.preventDefault();

			const item = evt.currentTarget;
			const option = item.dataset.option;

			removeElemClasses(Array.from(item.parentNode.children), ["fpd-active"]);

			addElemClasses(item, ["fpd-active"]);

			const fpdOpts = {};
			fpdOpts[item.parentNode.dataset.control] = option;

			fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(fpdOpts);
		});

		//do action inside group
		addEvents(this.subPanel.querySelectorAll(".fpd-tools-group > [data-do]"), "click", (evt) => {
			const btn = evt.currentTarget;
			const doAction = btn.dataset.do;

			if (doAction == "align-left") fpdInstance.currentElement.alignToPosition("left");
			else if (doAction == "align-right") fpdInstance.currentElement.alignToPosition("right");
			else if (doAction == "align-top") fpdInstance.currentElement.alignToPosition("top");
			else if (doAction == "align-bottom") fpdInstance.currentElement.alignToPosition("bottom");
			else if (doAction == "align-middle") fpdInstance.currentElement.centerElement(false, true);
			else if (doAction == "align-center") fpdInstance.currentElement.centerElement(true, false);
			else if (doAction == "layer-up" || doAction == "layer-down") {
				let currentZ = fpdInstance.currentElement.getZIndex();

				currentZ = doAction == "layer-up" ? currentZ + 1 : currentZ - 1;
				currentZ = currentZ < 0 ? 0 : currentZ;

				fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({ z: currentZ });
			} else if (doAction == "flip-x" || doAction == "flip-y") {
				const flipOpts = {};

				if (doAction == "flip-x") flipOpts.flipX = !fpdInstance.currentElement.flipX;
				else flipOpts.flipY = !fpdInstance.currentElement.flipY;

				fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(flipOpts);
			}
		});

		//edit text panel
		addEvents(this.subPanel.querySelector('textarea[data-control="text"]'), "keyup", (evt) => {
			evt.stopPropagation;
			evt.preventDefault();

			var selectionStart = evt.currentTarget.selectionStart,
				selectionEnd = evt.currentTarget.selectionEnd;

			fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({
				text: evt.currentTarget.value,
			});

			evt.currentTarget.selectionStart = selectionStart;
			evt.currentTarget.selectionEnd = selectionEnd;
		});

		//curved text
		addEvents(this.subPanel.querySelectorAll(".fpd-curved-options > span"), "click", (evt) => {
			const item = evt.currentTarget;
			let curvedOpts = {};

			if (item.dataset.value == "normal") {
				curvedOpts.curved = false;
			} else {
				curvedOpts.curved = true;
				curvedOpts.curveReverse = item.dataset.value == "curveReverse";
			}

			fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(curvedOpts);

			this.#toggleCurvedOptions(curvedOpts);
		});

		//reset
		addEvents(this.navElem.querySelector(".fpd-tool-reset"), "click", (evt) => {
			let originParams = fpdInstance.currentElement.originParams;
			delete originParams["clipPath"];
			delete originParams["path"];

			//if element has bounding box, rescale for scale mode
			if (fpdInstance.currentElement.boundingBox) {
				fpdInstance.currentElement.scaleX = 1;
				originParams.boundingBox = fpdInstance.currentElement.boundingBox;
			}

			fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(originParams);
			fpdInstance.deselectElement();
		});

		//duplicate
		addEvents(this.navElem.querySelector(".fpd-tool-duplicate"), "click", (evt) => {
			fpdInstance.currentViewInstance.fabricCanvas.duplicateElement(fpdInstance.currentElement);
		});

		//remove
		addEvents(this.navElem.querySelector(".fpd-tool-remove"), "click", (evt) => {
			fpdInstance.currentViewInstance.fabricCanvas.removeElement(fpdInstance.currentElement);
		});

		//remove shadow
		addEvents(this.subPanel.querySelector(".fpd-panel-color .fpd-remove-shadow"), "click", (evt) => {
			fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({
				shadowColor: null,
			});
		});

		addEvents(this.navElem.querySelector(".fpd-tool-remove-bg"), "click", (evt) => {
			let element = fpdInstance.currentElement;

			fpdInstance.deselectElement();
			fpdInstance.toggleSpinner(true, fpdInstance.translator.getTranslation("misc", "loading_image"));

			postJSON({
				url: fpdInstance.mainOptions.aiService.serverURL,
				body: {
					service: "removeBG",
					image: element.source,
				},
				onSuccess: (data) => {
					if (data && data.new_image) {
						element.setSrc(
							data.new_image,
							() => {
								element.source = data.new_image;
								element.canvas.renderAll();

								Snackbar(fpdInstance.translator.getTranslation("misc", "ai_remove_bg_success"));
							},
							{ crossOrigin: "anonymous" }
						);
					} else {
						fpdInstance.aiRequestError(data.error);
					}

					fpdInstance.toggleSpinner(false);
				},
				onError: fpdInstance.aiRequestError.bind(fpdInstance),
			});
		});

		//nav item
		addEvents(this.navElem.querySelectorAll("[class^=fpd-tool-]"), "click", (evt) => {
			const navItem = evt.currentTarget;

			if (navItem.dataset.panel) {
				//has a sub a panel

				//add active state to nav item
				removeElemClasses(this.navElem.querySelectorAll("[class^=fpd-tool-]"), ["fpd-active"]);
				addElemClasses(navItem, ["fpd-active"]);

				const subPanels = Array.from(this.subPanel.children);
				const targetPanel = subPanels.filter((p) => p.classList.contains("fpd-panel-" + navItem.dataset.panel));
				removeElemClasses(subPanels, ["fpd-active"]);
				addElemClasses(targetPanel, ["fpd-active"]);

				if (this.currentPlacement == "smart") {
					addElemClasses(this.container, ["fpd-panel-visible"]);

					this.#updatePosition();
				}
			}
		});

		addEvents(this.container.querySelector(".fpd-close"), "click", (evt) => {
			this.toggle(false);
			fpdInstance.deselectElement();
		});

		addEvents(this.container.querySelector(".fpd-close-sub-panel"), "click", (evt) => {
			removeElemClasses(Array.from(this.subPanel.children), ["fpd-active"]);

			removeElemClasses(this.container, ["fpd-panel-visible"]);
		});
	}

	#updateVariantStylesBtn(elem) {
		if (elem.hasOwnProperty("fontFamily")) {
			this.#toggleVariantStylesBtn(false, false);

			if (Array.isArray(this.fpdInstance.mainOptions.fonts) && this.fpdInstance.mainOptions.fonts.length) {
				const targetFontObj = this.fpdInstance.mainOptions.fonts.find(
					(fontObj) => fontObj.name == elem.fontFamily
				);

				//hide style buttons for fonts that do not have a bold or italic variant
				if (targetFontObj?.url && targetFontObj.url.toLowerCase().includes(".ttf")) {
					if (targetFontObj.variants) {
						this.#toggleVariantStylesBtn(
							Boolean(targetFontObj.variants.n7),
							Boolean(targetFontObj.variants.i4)
						);
					} else {
						this.#toggleVariantStylesBtn(false, false);
					}
				} else if (targetFontObj?.url === "google") {
					//google webfonts

					if (targetFontObj.variants) {
						this.#toggleVariantStylesBtn(
							Boolean(targetFontObj.variants.includes("bold")),
							Boolean(targetFontObj.variants.includes("italic"))
						);
					}
				}
			}
		}
	}

	#toggleVariantStylesBtn(bold = true, italic = true) {
		toggleElemClasses(this.subPanel.querySelector(".fpd-tool-text-bold"), ["fpd-disabled"], !bold);

		toggleElemClasses(this.subPanel.querySelector(".fpd-tool-text-italic"), ["fpd-disabled"], !italic);
	}

	#toggleNavItem(tool, toggle = true) {
		const tools = this.navElem.querySelectorAll(".fpd-tools-nav .fpd-tool-" + tool);

		toggleElemClasses(tools, ["fpd-hidden"], !Boolean(toggle));

		return tools;
	}

	#togglePanelTool(panel, tools, toggle) {
		toggle = Boolean(toggle);

		const panelElem = this.subPanel.querySelector(".fpd-panel-" + panel);

		toggleElemClasses(panelElem.querySelectorAll(".fpd-tool-" + tools), ["fpd-hidden"], !toggle);

		return panel;
	}

	#togglePanelTab(panel, tab, toggle) {
		const panelElem = this.subPanel.querySelector(".fpd-panel-" + panel);

		toggleElemClasses(
			panelElem.querySelectorAll('.fpd-panel-tabs [data-tab="' + tab + '"]'),
			["fpd-hidden"],
			!toggle
		);
	}

	#updateElementColor(element, hexColor) {
		let elementType = element.isColorizable();

		if (elementType !== "png") {
			element.changeColor(hexColor);
		}
	}

	#setElementColor(element, hexColor) {
		this.navElem.querySelector(".fpd-current-fill").style.background = hexColor;
		this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({ fill: hexColor }, element);
	}

	#updateGroupPath(element, pathIndex, hexColor) {
		const groupColors = element.changeObjectColor(pathIndex, hexColor);
		this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({ fill: groupColors }, element);
	}

	#lockUniScaling(locked) {
		const lockElem = this.subPanel.querySelector(".fpd-tool-uniscaling-locker > span");
		lockElem.className = locked ? "fpd-icon-locked" : "fpd-icon-unlocked";

		toggleElemClasses(this.subPanel.querySelector(".fpd-tool-scaleY"), ["fpd-disabled"], locked);
	}

	#toggleCurvedOptions(opts = {}) {
		const curvedOptionsElem = this.subPanel.querySelector(".fpd-curved-options");

		removeElemClasses(curvedOptionsElem.querySelectorAll("[data-value]"), ["fpd-active"]);

		if (opts.curved) {
			if (opts.curveReverse) {
				addElemClasses(curvedOptionsElem.querySelectorAll('[data-value="curveReverse"]'), ["fpd-active"]);
			} else {
				addElemClasses(curvedOptionsElem.querySelectorAll('[data-value="curved"]'), ["fpd-active"]);
			}
		} else {
			addElemClasses(curvedOptionsElem.querySelectorAll('[data-value="normal"]'), ["fpd-active"]);
		}

		toggleElemClasses(this.subPanel.querySelector(".fpd-tool-curved-text-radius"), ["fpd-hidden"], !opts.curved);
	}

	#hasToolbar(elem) {
		return elem && !elem._ignore && !elem.uploadZone;
	}

	#update(element) {
		this.#reset();
		removeElemClasses(this.container, ["fpd-type-image"]);

		let colorPanel;

		//COLOR: colors array, true=svg colorization
		if (element.hasColorSelection()) {
			let availableColors = elementAvailableColors(element, this.fpdInstance);

			if (element.type === "group" && element.getObjects().length > 1) {
				const paletterPerPath = Array.isArray(element.colors) && element.colors.length > 1;

				colorPanel = ColorPalette({
					colors: availableColors,
					colorNames: this.fpdInstance.mainOptions.hexNames,
					palette: element.colors,
					subPalette: paletterPerPath,
					enablePicker: this.fpdInstance.mainOptions.editorMode ? true : !paletterPerPath,
					onChange: (hexColor, pathIndex) => {
						this.#updateGroupPath(element, pathIndex, hexColor);
					},
					//only for colorpicker per path
					onMove: (hexColor, pathIndex) => {
						element.changeObjectColor(pathIndex, hexColor);
					},
				});
			} else {
				colorPanel = ColorPanel(this.fpdInstance, {
					colors: availableColors,
					patterns:
						Array.isArray(element.patterns) && (element.isSVG() || element.getType() === "text")
							? element.patterns
							: null,
					onMove: (hexColor) => {
						this.#updateElementColor(element, hexColor);
					},
					onChange: (hexColor) => {
						this.#setElementColor(element, hexColor);
					},
					onPatternChange: (patternImg) => {
						this.navElem.querySelector(".fpd-current-fill").style.background = `url("${patternImg}")`;

						this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
							{ pattern: patternImg },
							element
						);
					},
				});
			}

			if (colorPanel) this.#colorWrapper.append(colorPanel);

			//stroke
			const strokeColorWrapper = this.subPanel.querySelector(".fpd-stroke-color-wrapper");
			strokeColorWrapper.innerHTML = "";
			const strokeColorPanel = ColorPanel(this.fpdInstance, {
				colors:
					Array.isArray(element.strokeColors) && element.strokeColors.length > 0
						? element.strokeColors
						: [element.stroke ? element.stroke : "#000"],
				onMove: (hexColor) => {
					this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({ stroke: hexColor }, element);
				},
				onChange: (hexColor) => {
					this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({ stroke: hexColor }, element);
				},
			});
			strokeColorWrapper.append(strokeColorPanel);

			//shadow
			const shadowColorWrapper = this.subPanel.querySelector(".fpd-shadow-color-wrapper");
			shadowColorWrapper.innerHTML = "";
			const shadowColorPicker = ColorPicker({
				initialColor: tinycolor(element.shadowColor).isValid() ? element.shadowColor : "#000000",
				colorNames: this.fpdInstance.mainOptions.hexNames,
				palette: this.fpdInstance.mainOptions.colorPickerPalette,
				onMove: (hexColor) => {
					this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
						{ shadowColor: hexColor },
						element
					);
				},
				onChange: (hexColor) => {
					this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
						{ shadowColor: hexColor },
						element
					);
				},
			});
			shadowColorWrapper.append(shadowColorPicker);

			this.#toggleNavItem("color");
			this.#togglePanelTab("color", "fill", true);
			this.#togglePanelTab("color", "stroke", element.getType() === "text");
			this.#togglePanelTab("color", "shadow", true);
		}

		//enable only patterns
		if (
			!colorPanel &&
			(element.isSVG() || element.getType() === "text") &&
			element.patterns &&
			element.patterns.length
		) {
			colorPanel = ColorPanel(this.fpdInstance, {
				colors: [],
				patterns: element.patterns,
				onPatternChange: (patternImg) => {
					this.navElem.querySelector(".fpd-current-fill").style.background = `url("${patternImg}")`;

					this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
						{ pattern: patternImg },
						element
					);
				},
			});

			this.#colorWrapper.append(colorPanel);

			this.#toggleNavItem("color");
			this.#togglePanelTab("color", "fill", true);
		}

		//TRANSFORM
		let showScale = Boolean(
			(element.resizable && element.getType() === "image") || element.uniScalingUnlockable || element.__editorMode
		);
		if (showScale || element.rotatable) {
			this.#toggleNavItem("transform");
			this.#togglePanelTool("transform", "scale", showScale);
			this.#lockUniScaling(element.lockUniScaling);
			this.#togglePanelTool(
				"transform",
				"uniscaling-locker",
				Boolean(element.uniScalingUnlockable || element.__editorMode)
			);
			this.#togglePanelTool("transform", "angle", Boolean(element.rotatable || element.__editorMode));
			this.#togglePanelTool("transform", "flip", Boolean(showScale || element.__editorMode));
		}

		//POSITION
		if (element.draggable || element.zChangeable || element.__editorMode) {
			this.#toggleNavItem("position");
			this.#togglePanelTab("position", "arrange", Boolean(element.zChangeable || element.__editorMode));
			this.#togglePanelTab("position", "align", Boolean(element.draggable || element.__editorMode));
		}
		//EDIT TEXT
		if (element.getType() === "text" && (element.editable || element.__editorMode)) {
			this.#toggleNavItem("edit-text");
			this.#toggleNavItem(
				"text-size",
				Boolean(element.resizable || element.__editorMode) && !element.widthFontSize
			);
			this.#toggleNavItem("font-family");
			this.#toggleNavItem("text-format");

			if (element.curvable) {
				this.#toggleNavItem("curved-text");
				this.#toggleCurvedOptions(element);

				this.subPanel
					.querySelector('fpd-range-slider[data-control="curveRadius"]')
					.setAttribute("max", element.maxCurveRadius);
			}

			this.subPanel.querySelector('textarea[data-control="text"]').value = element.text;

			this.#toggleNavItem("edit-text", !element.textPlaceholder && !element.numberPlaceholder);
		} else if (element.getType() !== "text") {
			addElemClasses(this.container, ["fpd-type-image"]);
		}

		if (element.advancedEditing && element.source && isBitmap(element.source)) {
			this.#toggleNavItem("advanced-editing");
			this.#togglePanelTab("advanced-editing", "filters", true);
			this.#togglePanelTab(
				"advanced-editing",
				"crop",
				Boolean(
					Array.isArray(this.fpdInstance.mainOptions.cropMasks) &&
						this.fpdInstance.mainOptions.cropMasks.length
				)
			);

			this.#toggleNavItem(
				"remove-bg",
				Boolean(
					this.fpdInstance.mainOptions.aiService.serverURL && this.fpdInstance.mainOptions.aiService.removeBG
				)
			);
		}

		this.#togglePanelTool("text-size", "text-line-spacing", !element.curved);
		this.#toggleNavItem("reset");
		this.#toggleNavItem("duplicate", element.copyable || element.__editorMode);
		this.#toggleNavItem("remove", element.removable || element.__editorMode);

		//display only enabled tabs and when tabs length > 1
		this.subPanel.querySelectorAll(".fpd-panel-tabs").forEach((tabs) => {
			const visibleTabs = tabs.querySelectorAll("[data-tab]:not(.fpd-hidden)");

			toggleElemClasses(tabs, ["fpd-hidden"], visibleTabs.length <= 1);

			//select first visible tab
			if (visibleTabs.item(0)) visibleTabs.item(0).click();
		});

		//set UI value by selected element
		this.container.querySelectorAll("[data-control]").forEach((uiElement) => {
			const parameter = uiElement.dataset.control;

			if (uiElement.classList.contains("fpd-number")) {
				if (element[parameter] !== undefined) {
					var numVal =
						uiElement.step && uiElement.step.length > 1
							? parseFloat(element[parameter]).toFixed(2)
							: parseInt(element[parameter]);
					uiElement.value = numVal;

					if (uiElement.classList.contains("fpd-slider-number")) {
						const inputSlider = uiElement.previousElementSibling;
						if (parameter == "fontSize") {
							inputSlider.setAttribute("min", element.minFontSize);
							inputSlider.setAttribute("max", element.maxFontSize);
						} else if (parameter == "scaleX" || parameter == "scaleY") {
							inputSlider.setAttribute("min", element.minScaleLimit);
						}

						inputSlider.setAttribute("value", numVal);
					}
				}
			} else if (uiElement.classList.contains("fpd-toggle")) {
				toggleElemClasses(uiElement, ["fpd-enabled"], element[parameter] === uiElement.dataset.enabled);
			} else if (uiElement.classList.contains("fpd-btn-options")) {
				const options = JSON.parse(uiElement.dataset.options);
				uiElement.querySelector("span").className = options[element[parameter]];
			} else if (uiElement.classList.contains("fpd-btn-group")) {
				removeElemClasses(Array.from(uiElement.children), ["fpd-active"]);

				const control = uiElement.dataset.control;
				addElemClasses(uiElement.querySelector('[data-option="' + element[control] + '"]'), ["fpd-active"]);
			} else if (parameter == "fontFamily") {
				this.navElem.querySelector(".fpd-tool-font-family fpd-dropdown > input").value = element[parameter];

				if (element[parameter] !== undefined) {
					removeElemClasses(this.subPanel.querySelectorAll(".fpd-fonts-list .fpd-item"), ["fpd-active"]);

					addElemClasses(
						this.subPanel.querySelector(
							'.fpd-fonts-list .fpd-item[data-value="' + element[parameter] + '"]'
						),
						["fpd-active"]
					);
				}
			} else if (parameter == "fontSize") {
				this.navElem.querySelector(".fpd-tool-text-size > input").value = element[parameter];
			}

			const bgCss = getBgCssFromElement(element);
			if (bgCss) {
				this.navElem.querySelector(".fpd-current-fill").style.background = bgCss;
			}
		});

		//select first visible nav item
		if (this.currentPlacement == "sidebar") {
			this.navElem.querySelector("[data-panel]:not(.fpd-hidden)").click();
		}

		this.toggle();

		//reset scroll
		this.container.querySelectorAll(".fpd-scroll-area").forEach((scrollArea) => {
			scrollArea.scrollLeft = scrollArea.scrollTop = 0;
		});

		this.container.dataset.fabricType = element.type;
		this.container.dataset.elementType = element.getType();
	}

	#updatePosition() {
		if (
			this.currentPlacement !== "smart" ||
			!this.#hasToolbar(this.fpdInstance.currentElement) ||
			this.fpdInstance.container.classList.contains("fpd-aie-visible")
		)
			return;

		this.toggle(Boolean(this.fpdInstance.currentElement));

		if (this.fpdInstance.currentElement) {
			const fpdElem = this.fpdInstance.currentElement;
			const fpdContRect = this.fpdInstance.container.getBoundingClientRect();

			//top
			const elemBoundingRect = fpdElem.getBoundingRect();
			const lowestY =
				elemBoundingRect.top + elemBoundingRect.height + fpdElem.controls.mtr.offsetY + fpdElem.cornerSize;
			let posTop = this.fpdInstance.productStage.getBoundingClientRect().top + lowestY;

			//below container
			if (posTop > fpdContRect.height + fpdContRect.top) {
				posTop = fpdContRect.height + fpdContRect.top;
			}

			//stay in viewport
			if (posTop > window.innerHeight - this.container.clientHeight) {
				posTop = window.innerHeight - this.container.clientHeight;
			}

			//left
			const oCoords = fpdElem.oCoords;
			const halfWidth = this.container.offsetWidth / 2;
			const viewStageRect = this.fpdInstance.currentViewInstance.fabricCanvas.wrapperEl.getBoundingClientRect();
			let posLeft = viewStageRect.left + oCoords.mt.x;
			posLeft = posLeft < halfWidth ? halfWidth : posLeft; //move toolbar not left outside of document
			posLeft = posLeft > window.innerWidth - halfWidth ? window.innerWidth - halfWidth : posLeft; //move toolbar not right outside of document

			this.container.style.top = posTop + "px";
			this.container.style.left = posLeft + "px";
		}
	}

	toggle(toggle = true) {
		toggleElemClasses(this.container, ["fpd-show"], toggle);
		toggleElemClasses(document.body, ["fpd-toolbar-visible"], toggle);
	}

	#setWrapper() {
		const layout = this.fpdInstance.container.dataset.layout;
		this.container.className = "fpd-layout-" + layout;

		if (!this.fpdInstance.container.classList.contains("fpd-sidebar")) {
			this.fpdInstance.mainOptions.toolbarPlacement = "smart";
		}

		if (
			this.fpdInstance.mainOptions.toolbarPlacement == "smart" ||
			this.fpdInstance.container.classList.contains("fpd-layout-small")
		) {
			if (this.currentPlacement != "smart") {
				if (this.fpdInstance.mainOptions.toolbarDynamicContext == "body")
					document.body.appendChild(this.container);
				else
					document
						.querySelector(this.fpdInstance.mainOptions.toolbarDynamicContext)
						.appendChild(this.container);
			}

			this.currentPlacement = "smart";
			this.container.className += " fpd-container fpd-smart";
		} else {
			if (this.currentPlacement != "sidebar") {
				this.fpdInstance.mainBar.container.appendChild(this.container);
			}

			this.currentPlacement = "sidebar";
			this.container.className += " fpd-container fpd-sidebar";
		}

		this.navElem = this.container.querySelector(".fpd-tools-nav");
		this.subPanel = this.container.querySelector(".fpd-sub-panel");
		this.#colorWrapper = this.subPanel.querySelector(".fpd-color-wrapper");

		removeElemClasses(this.fpdInstance.container, ["fpd-toolbar-smart", "fpd-toolbar-sidebar"]);

		addElemClasses(this.fpdInstance.container, ["fpd-toolbar-" + this.currentPlacement]);
	}

	#updateUIValue(tool, value) {
		this.subPanel.querySelectorAll('[data-control="' + tool + '"]').forEach((toolInput) => {
			toolInput.value = value;
			toolInput.setAttribute("value", value);
		});
	}

	#reset() {
		this.#colorWrapper.innerHTML = "";

		removeElemClasses(this.container, ["fpd-panel-visible"]);

		//hide tool in row
		addElemClasses(this.navElem.querySelectorAll("[class^=fpd-tool-]"), ["fpd-hidden"]);

		removeElemClasses(this.navElem.querySelectorAll("[class^=fpd-tool-]"), ["fpd-active"]);

		//hide all sub panels in sub toolbar
		removeElemClasses(Array.from(this.subPanel.children), ["fpd-active"]);

		addElemClasses(this.subPanel.querySelectorAll(".fpd-panel-tabs > span"), ["fpd-hidden"]);

		//remove active tabs
		removeElemClasses(this.subPanel.querySelectorAll(".fpd-panel-tabs-content > *, .fpd-panel-tabs > *"), [
			"fpd-active",
		]);
	}
}

class GuidedTour {
	constructor(fpdInstance) {
		this.fpdInstance = fpdInstance;
	}

	start() {
		if (this.fpdInstance.mainOptions.guidedTour && Object.keys(this.fpdInstance.mainOptions.guidedTour).length) {
			const firstKey = Object.keys(this.fpdInstance.mainOptions.guidedTour)[0];
			this.selectStep(firstKey);
		}
	}

	selectStep = (target) => {
		const currentStep = document.body.querySelector(".fpd-gt-step");
		if (currentStep) currentStep.remove();

		let keyIndex = Object.keys(this.fpdInstance.mainOptions.guidedTour).indexOf(target),
			splitTarget = target.split(":"),
			targetElem = null;

		if (splitTarget[0] === "module") {
			targetElem = this.fpdInstance.mainBar.container.querySelector(
				'.fpd-navigation > [data-module="' + splitTarget[1] + '"]'
			);
		} else if (splitTarget[0] === "action") {
			targetElem = document.body.querySelector('.fpd-btn[data-action="' + splitTarget[1] + '"]');
		} else if (splitTarget.length === 1) {
			//css selector
			targetElem = document.body.querySelector(splitTarget[0]);
		}

		if (targetElem) {
			//if module or action is not available, go to next
			if (targetElem.length === 0) {
				if (Object.keys(this.fpdInstance.mainOptions.guidedTour)[keyIndex + 1]) {
					this.selectStep(Object.keys(this.fpdInstance.mainOptions.guidedTour)[keyIndex + 1]);
				}

				return;
			}

			const stepElem = document.createElement("div");
			stepElem.className = "fpd-container fpd-gt-step";
			stepElem.innerHTML = `<div class="fpd-gt-pointer">
                <span class="fpd-icon-arrow-dropdown"></span>
            </div>
            <div class="fpd-gt-close">
                <span class="fpd-icon-close"></span>
            </div>
            <div class="fpd-gt-text">${this.fpdInstance.mainOptions.guidedTour[target]}</div>
            <div class="fpd-gt-actions">
                <div class="fpd-gt-next fpd-btn fpd-primary">${this.fpdInstance.translator.getTranslation(
					"misc",
					"guided_tour_next",
					"Next"
				)}</div>
                <div class="fpd-gt-back fpd-btn fpd-primary">${this.fpdInstance.translator.getTranslation(
					"misc",
					"guided_tour_back",
					"Back"
				)}</div>
                <span class="fpd-gt-counter">${
					String(keyIndex + 1) + "/" + Object.keys(this.fpdInstance.mainOptions.guidedTour).length
				}</span>
            </div>`;

			document.body.append(stepElem);

			let domRect = targetElem.getBoundingClientRect(),
				offsetX = domRect.width * 0.5,
				posLeft = domRect.left + offsetX,
				posTop = domRect.top + domRect.height;

			if (posLeft < 24) {
				posLeft = 24;
			}

			stepElem.style.left = posLeft + "px";
			stepElem.style.top = posTop + "px";

			const stepDomRect = stepElem.getBoundingClientRect();

			//if step is outside viewport, reposition step and pointer
			if (stepDomRect.width + stepDomRect.left > window.innerWidth) {
				offsetX = window.innerWidth - (stepDomRect.width + posLeft);
				stepElem.style.left = posLeft + offsetX + "px";
				stepElem.querySelector(".fpd-gt-pointer").style.marginLeft = Math.abs(offsetX) + "px";
			}

			let maxTop = window.innerHeight - stepDomRect.height;
			if (posTop > maxTop) {
				posTop -= stepDomRect.height;
				stepElem.style.top = posTop + "px";
				addElemClasses(stepElem, ["fpd-reverse"]);
			}

			const backElem = stepElem.querySelector(".fpd-gt-back");
			const prevTarget = Object.keys(this.fpdInstance.mainOptions.guidedTour)[keyIndex - 1];
			if (prevTarget) {
				addEvents(backElem, "click", (evt) => {
					this.selectStep(prevTarget);
				});
			} else {
				addElemClasses(backElem, ["fpd-hidden"]);
			}

			const nextElem = stepElem.querySelector(".fpd-gt-next");
			const nextTarget = Object.keys(this.fpdInstance.mainOptions.guidedTour)[keyIndex + 1];
			if (nextTarget) {
				addEvents(nextElem, "click", (evt) => {
					this.selectStep(nextTarget);
				});
			} else {
				addElemClasses(nextElem, ["fpd-hidden"]);
			}

			addEvents(stepElem.querySelector(".fpd-gt-close"), "click", (evt) => {
				if (localStorageAvailable()) {
					window.localStorage.setItem("fpd-gt-closed", "yes");
				}

				stepElem.remove();
			});
		}
	};
}

/**
 * The class to create the Bulk Variations that is related to FancyProductDesigner class.
 * <h5>Example</h5><pre>fpdInstance.bulkVariations.getOrderVariations();</pre>
 * But you can just use the getOrder() method of FancyProductDesigner class, this will also include the order variations object. <pre>fpdInstance.getOrder();</pre>
 *
 * @class FPDBulkVariations
 * @constructor
 * @param {FancyProductDesigner} fpdInstance - An instance of FancyProductDesigner class.
 * @extends EventTarget
 */
class BulkVariations extends EventTarget {

    enabled = false;

    constructor(fpdInstance) {

        super();

        this.fpdInstance = fpdInstance;
        this.variations = fpdInstance.mainOptions.bulkVariations;

        if(fpdInstance.mainOptions.bulkVariationsPlacement && typeof this.variations === 'object') {

            this.container = document.querySelector(fpdInstance.mainOptions.bulkVariationsPlacement);
            if(this.container) {

                this.enabled = true;

                const headElem = document.createElement('div');
                headElem.className = 'fpd-head';
                this.container.append(headElem);

                const headline = document.createElement('div');
                headline.className = 'fpd-headline';
                headline.innerText = fpdInstance.translator.getTranslation('misc', 'bulk_add_variations_title', 'Bulk Order');
                headElem.append(headline);

                const addBtn = document.createElement('span');
                addBtn.className = 'fpd-btn';
                addBtn.innerText = fpdInstance.translator.getTranslation('misc', 'bulk_add_variations_add', 'Add');
                headElem.append(addBtn);

                addEvents(
                    addBtn,
                    'click',
                    (evt) => {

                        this.#createRow();

                    }
                );

                this.listElem = document.createElement('div');
                this.listElem.className = 'fpd-variations-list';
                this.container.append(this.listElem);                

                addElemClasses(this.container, ['fpd-bulk-variations', 'fpd-container']);
                this.#createRow();

                addEvents(
                    fpdInstance,
                    'getOrder',
                    () => {
        
                        fpdInstance._order.bulkVariations = this.getOrderVariations();
        
                    }
                );

            }

        }

    }

    #createRow(rowData={}) {

        const rowElem = document.createElement('div');
        rowElem.className = 'fpd-row';
        this.listElem.append(rowElem);

        const variationData = rowData.variation || {};
        for (const varKey in this.variations) {

            const selectElem = document.createElement('select');
            selectElem.name = varKey;            
            selectElem.innerHTML = `<option value='' disabled selected>${varKey}</option>`;
            rowElem.append(selectElem);

            const variationAttrs = this.variations[varKey];
            variationAttrs.forEach(attr => {

                const optionElem = document.createElement('option');
                optionElem.value = attr;
                optionElem.innerText = attr;

                if(variationData[varKey] == attr)
                    optionElem.selected = true;

                selectElem.append(optionElem);

            });

            addEvents(
                selectElem,
                ['change'],
                (evt) => {

                    removeElemClasses(selectElem, ['fpd-error']);

                }
            );

        }
        
        const inputElem = document.createElement('input');
        inputElem.className = 'fpd-quantity';
        inputElem.type = 'number';
        inputElem.min = 1;
        inputElem.step = 1;
        inputElem.value = rowData.quantity || 1;
        rowElem.append(inputElem);

        addEvents(
            inputElem,
            'change',
            (evt) => {

                if( inputElem.value < Number(inputElem.min) ) {
                    inputElem.value = Number(inputElem.min);
                }
                if(inputElem.inputElem == '') {
                    inputElem.value = 1;
                }

                this.#setTotalQuantity();
                
            }
        );

        const deleteElem = document.createElement('span');
        deleteElem.className = 'fpd-icon-close';
        rowElem.append(deleteElem);

        addEvents(
            deleteElem,
            'click',
            (evt) => {
                
                rowElem.remove();
                this.#setTotalQuantity();
                
            }
        );

        this.#setTotalQuantity();

    }

    #setTotalQuantity() {

		let totalQuantity = 0;
		this.listElem.querySelectorAll('.fpd-quantity').forEach((input) => {
			totalQuantity += parseInt(input.value);
		});
        

		this.fpdInstance.setOrderQuantity(parseInt(totalQuantity));

	}

    /**
	 * Gets the variation(s) from the UI.
	 *
	 * @method getOrderVariations
	 * @return {Array|Boolean} An array containing objects with variation and quantity properties. If a variation in the UI is not set, it will return false.
	 */
    getOrderVariations() {

        if(!this.listElem) return false;

        let variations = [];
		this.listElem.querySelectorAll('.fpd-row').forEach(row => {

			var variation = {};
            
			row.querySelectorAll('select').forEach(select => {
                
				if(isEmpty(select.value)) {

					variations = false;

                    addElemClasses(
                        select,
                        ['fpd-error']
                    );

				}

				variation[select.name] = select.value;

			});

			if(variations !== false) {

				variations.push({
                    variation: variation, 
                    quantity: parseInt(row.querySelector('.fpd-quantity').value) 
                });

			}
            else {
                Snackbar(this.fpdInstance.translator.getTranslation('misc', 'bulk_add_variations_term'));
            }


		});

		return variations;

    }

    /**
	 * Loads variation(s) in the UI.
	 *
	 * @method setup
	 * @param {Array} variations An array containing objects with variation and quantity properties.
	 */
    setup(data) {

        if(Array.isArray(data)) {

			this.listElem.innerHTML = '';
			data.forEach(rowData => {
                
                this.#createRow(rowData); 

			});

		}

		this.#setTotalQuantity();

    }

}

/**
 * The class to create the Color Selection that is related to FancyProductDesigner class.
 *
 * @class FPDColorSelection
 * @constructor
 * @param {FancyProductDesigner} fpdInstance - An instance of FancyProductDesigner class.
 * @extends EventTarget
 */
class ColorSelection extends EventTarget {

    constructor(fpdInstance) {

        super();

        this.fpdInstance = fpdInstance;

        if(!isEmpty(fpdInstance.mainOptions.colorSelectionPlacement)) {

            this.container = document.querySelector(fpdInstance.mainOptions.colorSelectionPlacement);
            if(this.container) {

                addElemClasses(
                    this.container,
                    ['fpd-color-selection', 'fpd-container']
                );

                addEvents(
                    fpdInstance,
                    'productCreate',
                    this.#updateList.bind(this)
                );

                addEvents(
                    fpdInstance,
                    'elementAdd',
                    this.#updateList.bind(this)
                );

            }

        }

        addEvents(
            fpdInstance,
            'elementRemove',
            (evt) => {

                const { element } = evt.detail;

                if(element && element.showInColorSelection) {
                    
                    const targetItem = this.container.querySelector('.fpd-cs-item[data-id="'+element.id+'"]');
                    if(targetItem)
                        targetItem.remove();

                }                

            }
        );

    }

    #updateList() {

        this.container.innerHTML = '';

        //get all elements in first view for color selection panel
        const csElements = this.fpdInstance.getElements(0).filter(fElem => {
            return fElem.showInColorSelection;
        });

        toggleElemClasses(
            this.container,
            ['fpd-hidden'],
            csElements.length == 0
        );
        

        csElements.forEach(csElement => {

            this.#createColorItem(csElement); 
            
        });
        
    }

    #createColorItem(element) {
        
        if(element.hasColorSelection()) {

            const item = document.createElement('div');
            item.className = 'fpd-cs-item';
            item.dataset.id = element.id;
            item.innerHTML = `<div class="fpd-title">${element.title}</div>`;
            this.container.append(item);

            let availableColors = elementAvailableColors(element, this.fpdInstance);

            let colorPanel;
            if(element.type === 'group' && element.getObjects().length > 1) {

                const paletterPerPath = Array.isArray(element.colors)  && element.colors.length > 1;

                colorPanel = ColorPalette({
                    colors: availableColors, 
                    colorNames: this.fpdInstance.mainOptions.hexNames,
                    palette: element.colors,
                    subPalette: paletterPerPath,
                    enablePicker: !paletterPerPath,
                    onChange: (hexColor, pathIndex) => {
                        
                        this.#updateGroupPath(element, pathIndex, hexColor);
                        
                        
                    },
                    //only for colorpicker per path
                    onMove: (hexColor, pathIndex) => {
                        
                        element.changeObjectColor(pathIndex, hexColor);
                        
                    },
                });
                
            }
            else {

                colorPanel = ColorPanel(this.fpdInstance, {
                    colors: availableColors,
                    patterns: Array.isArray(element.patterns) && (element.isSVG() || element.getType() === 'text') ? element.patterns : null,
                    onMove: (hexColor) => {
                                                
                        this.#updateElementColor(element, hexColor);
                        
                    },
                    onChange: (hexColor) => {
                        
                        this.#setElementColor(element, hexColor);
                        
                    },
                    onPatternChange: (patternImg) => {
                        
                        this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
                            {pattern: patternImg}, 
                            element
                        );
    
                    }
                });

            }
            
            if(colorPanel)
                item.append(colorPanel);

        }

    }

    #updateGroupPath(element, pathIndex, hexColor) {

        const groupColors = element.changeObjectColor(pathIndex, hexColor);
        this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({fill: groupColors}, element);

    }

    #updateElementColor(element, hexColor) {

        let elementType = element.isColorizable();
        
        if(elementType !== 'png') {
            element.changeColor(hexColor);
        } 

    }

    #setElementColor(element, hexColor) {

        this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions({fill: hexColor}, element);

    }

}

window.FPDColorSelection = ColorSelection;

class ViewThumbnails {

    constructor(fpdInstance) {

        this.fpdInstance = fpdInstance;
        
        if(fpdInstance.mainOptions.viewThumbnailsWrapper) {

            let targetWrapper;
            if(fpdInstance.mainOptions.viewThumbnailsWrapper == 'main-wrapper') {                

                targetWrapper = document.createElement('div');
                this.fpdInstance.mainWrapper.container.append(targetWrapper);
                
            }
            else {
                targetWrapper = fpdInstance.mainOptions.viewThumbnailsWrapper;
            }

            this.container = typeof targetWrapper === 'string' ? document.querySelector(targetWrapper) : targetWrapper;
            if(this.container) {

                addElemClasses(
                    this.container,
                    ['fpd-view-thumbnails-wrapper']
                );

                addEvents(
                    this.fpdInstance,
                    ['viewCreate', 'viewRemove', 'viewMove'],
                    this.#updateGrid.bind(this)
                );

            }

        }

    }

    #updateGrid(evt) {

        this.container.innerHTML = '';
        this.fpdInstance.viewInstances.forEach((viewInst, i) => {
                        
            const viewItem = document.createElement('div');
            viewItem.className = 'fpd-item fpd-tooltip fpd-shadow-1';
            viewItem.setAttribute('aria-label', viewInst.title);
            viewItem.style.backgroundImage = `url("${viewInst.thumbnail}")`;
            this.container.append(viewItem);

            addEvents(
                viewItem,
                'click',
                () => {

                    this.fpdInstance.selectView(i);

                }
            );            

        });

        toggleElemClasses(
            this.container,
            ['fpd-hidden'],
            this.fpdInstance.viewInstances.length < 2
        );

    }

}

class AdvancedImageEditor extends EventTarget {

    constructor(fpdInstance) {

        super();

        this.fpdInstance = fpdInstance;
        this.container = fpdInstance.mainWrapper.container.querySelector('.fpd-advanced-image-editor');
        this.currentElement = null;
        this.fImg = null;
        this.mask = null;
       
        this.fabricCanvas = new fabric.Canvas(this.container.querySelector('canvas'), {
            containerClass: 'fpd-aie-canvas',
            selection: false
        });

        this.fabricCanvas.setBackgroundColor('#fff', this.fabricCanvas.renderAll.bind(this.fabricCanvas));
        
        addEvents(
            this.container.querySelector('.fpd-close'),
            'click',
            () => {

                this.fabricCanvas.clear();
                this.toggle(false);

            }
        );

        addEvents(
            this.container.querySelector('.fpd-done'),
            'click',
            () => {
                
                this.mask.set('fill', 'transparent');
                this.fabricCanvas.clipPath = this.mask;

                let opts = {
                    format: 'png',
                    top: this.fImg.top,
                    left: this.fImg.left,
                    width: this.fImg.getScaledWidth(),
                    height: this.fImg.getScaledHeight(),
                    multiplier: this.fImg.width / this.fabricCanvas.width
                };
                                
                const dataURL = this.fabricCanvas.toDataURL(opts);

                fpdInstance._downloadRemoteImage(
                    dataURL,
                    'mask',
                    {},
                    (data) => {

                        if(data.url) {

                            this.currentElement.setSrc(data.url, () => {

                                this.currentElement.source = data.url;
                                this.currentElement.canvas.renderAll();
                                
                                fireEvent(fpdInstance, 'viewCanvasUpdate', {
                                    viewInstance: fpdInstance.currentViewInstance
                                });
                                
                            }, {crossOrigin: 'anonymous'});

                        }
                        else if(data.error) {
                            Snackbar(data.error);
                        }

                        removeElemClasses(
                            fpdInstance.viewsNav.container,
                            ['fpd-disabled']
                        );

                        fpdInstance.loadingCustomImage = false;
                        fpdInstance.toggleSpinner(false);        

                    }
                );

                this.toggle(false);
                
            }
        );

    }

    toggle(state=true) {

        this.fabricCanvas.clipPath = null;
        this.fabricCanvas.clear();

        toggleElemClasses(
            this.container,
            ['fpd-hidden'],
            !state
        );

        toggleElemClasses(
            this.fpdInstance.container,
            ['fpd-aie-visible'],
            state
        );

    }

    loadImage(targetElement, maskURL) {

        this.mask = null;
        this.currentElement = targetElement;
        this.toggle();

        //set canvas size to available space
        this.fabricCanvas.setDimensions({
            width: this.container.offsetWidth,
            height: this.container.offsetHeight
        });

        //load target image to canvas        
        fabric.Image.fromURL(targetElement.originParams.source, (fImg) => {

            this.fImg = fImg;
            fImg.evented = false;

            if(fImg.width > fImg.height) {
                fImg.scaleToWidth(this.fabricCanvas.width);
            }
            else {
                fImg.scaleToHeight(this.fabricCanvas.height);
            }
            
            this.fabricCanvas.add(fImg);
            fImg.center();

            //load mask object
            fabric.loadSVGFromURL(maskURL, (objects, options) => {            

                if(objects) {
    
                    this.mask = objects ? fabric.util.groupSVGElements(objects, options) : null;
    
                    this.mask.setOptions({
                        selectable: true,
                        evented: true,
                        resizable: true,
                        rotatable: true,
                        lockUniScaling: false,
                        lockRotation: false,
                        borderColor: 'transparent',
                        fill: 'rgba(184,233,134,0.4)',
                        centeredScaling: true,
                        transparentCorners: true,
                        absolutePositioned: false, 
                        cornerSize: 24,
                        objectCaching: false,
                    });
                    
                    if(this.fabricCanvas.width < this.fabricCanvas.height) {
                        
                        this.mask.scaleToWidth(this.fabricCanvas.width-100);
                    }
                    else {
                        this.mask.scaleToHeight(this.fabricCanvas.height-100);
                    }                    
                    
                    this.fabricCanvas.add(this.mask);
                    this.mask.center();
                    this.fabricCanvas.setActiveObject(this.mask);
    
                }
    
            });

        }, {crossOrigin: "anonymous"});

    }

}

class UIManager extends EventTarget {
    
    #currentWindowWidth = 0;
    currentLayout = '';
    
    constructor(fpdInstance) {
        
        super();
        
        this.fpdInstance = fpdInstance;
                        
    }
    
    init() {

        //add product designer into modal
		if(this.fpdInstance.mainOptions.modalMode) {

            this.fpdInstance.mainOptions.maxCanvasHeight = 0.75;
            this.fpdInstance.mainOptions.canvasHeight = 'auto';
            this.fpdInstance.mainOptions.fabricCanvasOptions.allowTouchScrolling = false;

            let modalProductDesignerOnceOpened = false;

            addElemClasses(
                document.body,
                ['fpd-modal-mode-active']
            );

            removeElemClasses(
                this.fpdInstance.container,
                ['fpd-off-canvas', 'fpd-topbar']
            );

            addElemClasses(
                this.fpdInstance.container,
                ['fpd-sidebar']
            );

            const modalWrapper = document.createElement('div');
            modalWrapper.className = 'fpd-modal-product-designer fpd-modal-overlay fpd-fullscreen';
            document.body.append(modalWrapper);
            this.fpdInstance.modalWrapper = modalWrapper;

            const modalInner = document.createElement('div');
            modalInner.className = 'fpd-modal-inner';
            modalInner.append(this.fpdInstance.container);
            modalWrapper.append(modalInner);

            //get modal opener
            const modalOpener = document.querySelector(this.fpdInstance.mainOptions.modalMode);
            addEvents(
                modalOpener,
                'click',
                (evt) => {

                    evt.preventDefault();

                    addElemClasses(
                        document.body,
                        ['fpd-overflow-hidden', 'fpd-modal-designer-visible']
                    );

                    addElemClasses(
                        modalWrapper,
                        ['fpd-show']
                    );
                    
                    this.fpdInstance.selectView(0);

                    if(this.fpdInstance.currentViewInstance) {

                        this.fpdInstance.currentViewInstance.fabricCanvas.resetZoom();

                        if(!modalProductDesignerOnceOpened) {
                            this.fpdInstance.doAutoSelect();
                        }

                    }

                    modalProductDesignerOnceOpened = true;

                    /**
                     * Gets fired when the modal with the product designer opens.
                     *
                     * @event FancyProductDesigner#modalDesignerOpen
                     * @param {Event} event
                     */
                    fireEvent(this.fpdInstance, 'modalDesignerOpen', {});

                    fireEvent(window, 'fpdModalDesignerOpen', {});

                }
            );

            addEvents(
                this.fpdInstance,
                'modalDesignerClose',
                () => {

                    removeElemClasses(
                        document.body,
                        ['fpd-overflow-hidden', 'fpd-modal-designer-visible']
                    );
                    
                }
            );

            addEvents(
                this.fpdInstance,
                'priceChange',
                () => {

                    modalWrapper.querySelector('fpd-actions-bar .fpd-total-price')
                    .innerHTML = this.fpdInstance.formatPrice(this.fpdInstance.currentPrice); 
                    
                }
            );

		}
        
        this.fpdInstance.container.classList.add('fpd-container');
        this.fpdInstance.container.classList.add('fpd-wrapper');
        
        const loader = document.createElement('div');
        loader.innerHTML = MainLoaderHTML;
        
        this.fpdInstance.container.appendChild(loader.firstChild.cloneNode(true));
        this.fpdInstance.mainLoader = this.fpdInstance.container.querySelector('.fpd-loader-wrapper');
        
        this.fpdInstance.actionsBar = new ActionsBar(this.fpdInstance);
        this.fpdInstance.mainBar = new Mainbar(this.fpdInstance);
        
        this.fpdInstance.mainWrapper = new MainWrapper(this.fpdInstance);
        this.fpdInstance.productStage = this.fpdInstance.mainWrapper.container.querySelector('.fpd-product-stage');
        this.fpdInstance.viewsNav = new ViewsNav(this.fpdInstance);
        this.fpdInstance.viewsGrid = new ViewsGrid(this.fpdInstance);
        this.fpdInstance.advancedImageEditor = new AdvancedImageEditor(this.fpdInstance);

        //addons
        this.fpdInstance.bulkVariations = new BulkVariations(this.fpdInstance);
        this.fpdInstance.colorSelection = new ColorSelection(this.fpdInstance);

        //view thumbnails
        this.fpdInstance.viewThumbnails = new ViewThumbnails(this.fpdInstance);

        //guided tour
        this.fpdInstance.guidedTour = new GuidedTour(this.fpdInstance);
        
        this.fpdInstance.translator.translateArea(this.fpdInstance.container);

        this.dispatchEvent(
            new CustomEvent('ready')
        );
        
        window.addEventListener("resize", this.#updateResponsive.bind(this));
        
        this.#updateResponsive();
        this.#hoverThumbnail();
        this.#setMainTooltip();
        
    }
    
    #updateResponsive() {
        
        const breakpoints = this.fpdInstance.mainOptions.responsiveBreakpoints;
        
        this.#currentWindowWidth = window.innerWidth;
        
        let currentLayout;
        if(this.#currentWindowWidth < breakpoints.small) {
            this.fpdInstance.container.classList.remove('fpd-layout-medium');
            this.fpdInstance.container.classList.remove('fpd-layout-large');
            this.fpdInstance.container.classList.add('fpd-layout-small');
            currentLayout = 'small';
        }
        else if(this.#currentWindowWidth < breakpoints.medium) {
            this.fpdInstance.container.classList.remove('fpd-layout-small');
            this.fpdInstance.container.classList.remove('fpd-layout-large');
            this.fpdInstance.container.classList.add('fpd-layout-medium');
            currentLayout = 'medium';
        }
        else {
            this.fpdInstance.container.classList.remove('fpd-layout-medium');
            this.fpdInstance.container.classList.remove('fpd-layout-small');
            this.fpdInstance.container.classList.add('fpd-layout-large');
            currentLayout = 'large';
        }

        this.fpdInstance.container.dataset.layout = currentLayout;

        if(currentLayout != this.currentLayout) {

            this.currentLayout = currentLayout;
            
            this.updateToolbarWrapper();

            /**
             * Gets fired when the UI layout changes.
             *
             * @event uiLayoutChange
             * @param {CustomEvent} event
             * @param {Array} event.detail.layout - The current layout: small, medium or large.
             */
            this.fpdInstance.dispatchEvent(
                new CustomEvent('uiLayoutChange', {
                    detail: {
                        layout: currentLayout,
                    }
                })
            );
            
        }
        
    }

    updateToolbarWrapper() {

        const presentToolbar = document.querySelector('fpd-element-toolbar');
        if(presentToolbar)
            presentToolbar.remove();

        this.fpdInstance.toolbar = new ElementToolbar(this.fpdInstance);
        this.fpdInstance.translator.translateArea(this.fpdInstance.toolbar.container);
        
    }

    #hoverThumbnail() {

        const context = document.body;

        let thumbnailPreview;
        thumbnailPreview = document.createElement('div');
        thumbnailPreview.className = "fpd-thumbnail-preview fpd-shadow-1 fpd-hidden";
        thumbnailPreview.innerHTML = '<picture></picture>';

        const titleElem = document.createElement('div');
        titleElem.className = "fpd-preview-title";
        thumbnailPreview.append(titleElem);

        context.append(thumbnailPreview);

        addEvents(
            context,
            ['mouseover', 'mouseout', 'mousemove', 'click'],
            (evt) => {

                if(this.fpdInstance.draggedPlaceholder) {
                    thumbnailPreview.classList.add('fpd-hidden');
                    return;
                }
                const target = evt.target;
                            
                if(target.classList.contains('fpd-hover-thumbnail') 
                    && thumbnailPreview.classList.contains('fpd-hidden')
                    && evt.type === 'mouseover' 
                    && target.dataset.source
                ) {
                    
                    if(thumbnailPreview.querySelector('.fpd-price'))
                        thumbnailPreview.querySelector('.fpd-price').remove();

                    if(thumbnailPreview.querySelector('.fpd-image-quality-ratings'))
                        thumbnailPreview.querySelector('.fpd-image-quality-ratings').remove();

                    thumbnailPreview.querySelector('picture').style.backgroundImage = `url("${target.dataset.source}")`;

                    if(target.dataset.title) {
                        titleElem.innerText = target.dataset.title;
                    }
                    toggleElemClasses(
                        titleElem,
                        ['fpd-hidden'],
                        !target.dataset.title
                    );

                    toggleElemClasses(
                        thumbnailPreview,
                        ['fpd-title-enabled'],
                        target.dataset.title
                    );
                    
                    const targetPrice = target.querySelector('.fpd-price');                    
                    if(targetPrice) {
                        thumbnailPreview.append(targetPrice.cloneNode(true));
                    }

                    const targetRatings = target.querySelector('.fpd-image-quality-ratings');                                        
                    if(targetRatings) {

                        const clonedRatings = targetRatings.cloneNode(true);
                        const ratingLabel = document.createElement('span');
                        ratingLabel.className = "fpd-image-quality-rating-label";
                        ratingLabel.innerText = targetRatings.dataset.qualityLabel;
                        clonedRatings.prepend(ratingLabel);
                        thumbnailPreview.append(clonedRatings);

                    }

                    thumbnailPreview.classList.remove('fpd-hidden');
                    
                }
                                
                if(!thumbnailPreview.classList.contains('fpd-hidden') 
                    && (evt.type === 'mousemove' || evt.type === 'mouseover')) 
                {
                                        
                    const leftPos = evt.pageX + 10 + thumbnailPreview.offsetWidth > window.innerWidth ? window.innerWidth - thumbnailPreview.offsetWidth : evt.pageX + 10;
                    thumbnailPreview.style.left = leftPos+'px';
                    thumbnailPreview.style.top = (evt.pageY + 10)+'px';

                }
                else if(evt.type === 'mouseout' || evt.type == 'click') {
                                            
                    thumbnailPreview.classList.add('fpd-hidden');

                }

            }
        );

    }
    
    #setMainTooltip() {
        
        const tooltipContext = document.body;
        
        const mainTooltip = document.createElement('div');
        mainTooltip.className = 'fpd-main-tooltip';
        tooltipContext.append(mainTooltip);
        this.fpdInstance.mainTooltip = mainTooltip;
        
        tooltipContext.addEventListener('mouseover', (evt) => {
            
            const currentElem = evt.target;
            
            if(currentElem.classList.contains('fpd-tooltip')) {
                
                let txt = currentElem.getAttribute('aria-label');
                if(txt === null)
                    txt = currentElem.getAttribute('title');

                    mainTooltip.innerHTML = txt;
                
                const extraOffset = 5;
                const { x, y, width, height } = currentElem.getBoundingClientRect();
                
                let topPos = Math.floor(y - mainTooltip.clientHeight - extraOffset);
                let leftPos = Math.floor(x + width / 2 - mainTooltip.clientWidth / 2);
                
                if(topPos < 0) {
                    topPos = Math.floor(y + height + extraOffset);
                }
                
                if(leftPos < 0) {
                    leftPos = 0;
                }
                else if(leftPos > window.outerWidth - mainTooltip.clientWidth) {
                    leftPos = window.outerWidth - mainTooltip.clientWidth - extraOffset;
                }
                
                mainTooltip.style.left = `${leftPos}px`;
                mainTooltip.style.top = `${topPos}px`;
                mainTooltip.classList.add('fpd-show');
                
            }
            else {
                mainTooltip.classList.remove('fpd-show');
            }
            
        });
        
        tooltipContext.addEventListener('touchstart', (evt) => {
            
                mainTooltip.classList.remove('fpd-show');
            
        });
        
    }
    
}

class EditorBox {
    
    constructor(fpdInstance) {

        const wrapper = document.querySelector(fpdInstance.mainOptions.editorMode);

        if(wrapper) {
            
            addElemClasses(wrapper, ['fpd-editor-box-wrapper', 'fpd-container']);

            this.titleElem = document.createElement('div');
            this.titleElem.className = 'fpd-eb-title';
            wrapper.append(this.titleElem);

            this.gridElem = document.createElement('div');
            this.gridElem.className = 'fpd-eb-grid';
            wrapper.append(this.gridElem);
            
            fpdInstance.mainOptions.editorBoxParameters.forEach(param => {
                            
                const inputElem = document.createElement('div');
                inputElem.innerHTML = '<span>'+param+'</span><input type="text" readonly data-prop="'+param+'" />';     
                this.gridElem.append(inputElem);
                
            });

        }
        
        addEvents(
            fpdInstance,
            ['elementSelect', 'elementChange'],
            (evt) => {

                if(wrapper) {

                    if(fpdInstance.currentElement) {
                        
                        this.titleElem.innerText = fpdInstance.currentElement.title;

                        fpdInstance.mainOptions.editorBoxParameters.forEach(param => {
                            
                            let value = fpdInstance.currentElement[param];

                            if(value !== undefined) {

                                value = typeof value === 'number' ? value.toFixed(2) : value;
                                value = (typeof value === 'object' && value.source) ? value.source.src : value;
                                if(param === 'fill' && fpdInstance.currentElement.type === 'group') {
                                    value = fpdInstance.currentElement.svgFill;
                                }

                                const inputElem =this.gridElem.querySelector('input[data-prop="'+param+'"]');
                                if(inputElem)
                                    inputElem.value = value;
                                
                            }

                        });

                    }
                    else {
                        this.titleElem.innerText = '';
                    }

                    toggleElemClasses(this.gridElem, ['fpd-hidden'], !fpdInstance.currentElement);

                }
                
            }
        );     

    }

}

/**
 * Creates a new FancyProductDesigner.
 *
 * @class FancyProductDesigner
 * @param  {HTMLElement} elem - The container for the Fancy Product Designer.
 * @param  {Object} [opts={}] - {@link Options Options for configuration}.
 * @extends EventTarget
 */
let FancyProductDesigner$1 = class FancyProductDesigner extends EventTarget {
	static version = "6.3.3";
	static forbiddenTextChars = /<|>/g;
	static proxyFileServer = "";
	static uploadsToServer = true;

	/**
	 * You can register your own modules and add them in this static property.
	 *
	 * @public additionalModules
	 * @type {Object}
	 * @readonly
	 * @default {}
	 * @example {'my-module': ModuleClass}
	 * @memberof FancyProductDesigner
	 * @static
	 */
	static additionalModules = {};

	/**
	 * The container for the Fancy Product Designer.
	 *
	 * @type {HTMLElement}
	 * @readonly
	 * @default null
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	container = null;

	/**
	 * The main options set for this Product Designer.
	 *
	 * @type Object
	 * @readonly
	 * @default {}
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	mainOptions = {};

	/**
	 * The current selected view instance.
	 *
	 * @type {FancyProductDesignerView}
	 * @readonly
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	currentViewInstance = null;

	/**
	 * The current selected view index.
	 *
	 * @type Number
	 * @default 0
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	currentViewIndex = 0;

	/**
	 * Array containing all products.
	 *
	 * @type {Array}
	 * @readonly
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	products = [];

	/**
	 * Array containing all designs.
	 *
	 * @type {Array}
	 * @readonly
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	designs = [];

	/**
	 * The container for internal modals.
	 *
	 * @type HTMLElement
	 * @default document.body
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	modalContainer = document.body;

	/**
	 * The current selected product category index.
	 *
	 * @type Number
	 * @default 0
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	currentCategoryIndex = 0;

	/**
	 * The current selected product index.
	 *
	 * @type Number
	 * @default 0
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	currentProductIndex = 0;

	/**
	 * Array containing all FancyProductDesignerView instances of the current showing product.
	 *
	 * @type Array
	 * @default []
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	viewInstances = [];

	/**
	 * The initial views of the current product.
	 *
	 * @type Array
	 * @default null
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	productViews = null;

	/**
	 * The current selected element.
	 *
	 * @property currentElement
	 * @type fabric.Object
	 * @default null
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	currentElement = null;

	/**
	 * Indicates if the product is created or not.
	 *
	 * @type Boolean
	 * @default false
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	productCreated = false;

	/**
	 * Object containing all color link groups.
	 *
	 * @type Object
	 * @default {}
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	colorLinkGroups = {};

	/**
	 * Array with all added custom elements.
	 *
	 * @type Array
	 * @default []
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	globalCustomElements = [];

	/**
	 * Indicates if the product was saved.
	 *
	 * @type Boolean
	 * @default false
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	doUnsavedAlert = false;

	/**
	 * The price considering the elements price in all views with order quantity.
	 *
	 * @property currentPrice
	 * @type Number
	 * @default 0
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	currentPrice = 0;

	/**
	 * The price considering the elements price in all views without order quantity.
	 *
	 * @property singleProductPrice
	 * @type Number
	 * @default 0
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	singleProductPrice = 0;

	/**
	 * The calculated price for the pricing rules.
	 *
	 * @property pricingRulesPrice
	 * @type Number
	 * @default 0
	 * @memberof FancyProductDesigner
	 * @inner
	 */
	pricingRulesPrice = 0;

	/**
	 * URL to the watermark image if one is set via options.
	 *
	 * @property watermarkImg
	 * @type String
	 * @default null
	 */
	watermarkImg = null;

	/**
	 * An array with the current layouts.
	 *
	 * @property currentLayouts
	 * @type Array
	 * @default []
	 */
	currentLayouts = [];

	/**
	 * The order quantity.
	 *
	 * @property orderQuantity
	 * @type Number
	 * @default 1
	 */
	orderQuantity = 1;

	/**
	 * If FPDBulkVariations is used with the product designer, this is the instance to the FPDBulkVariations class.
	 *
	 * @property bulkVariations
	 * @type FPDBulkVariations
	 * @default null
	 */
	bulkVariations = null;

	/**
	 * The product mode type set through main options.
	 *
	 * @property industryType
	 * @type String
	 * @default null
	 */
	industryType = null;

	loadingCustomImage = false;
	lazyBackgroundObserver = null;
	draggedPlaceholder = null;
	mouseOverCanvas = false;
	firstProductCreated = false;

	#totalProductElements = 0;
	#productElementLoadingIndex = 0;
	inTextField = false;
	_order = {};

	constructor(elem, opts = {}) {
		super();

		if (!elem) {
			console.log("No DOM element found for FPD.");
			return;
		}

		this.lazyBackgroundObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					loadGridImage(entry.target);
					this.lazyBackgroundObserver.unobserve(entry.target);
				}
			});
		});

		this.container = elem;
		this.container.instance = this;
		this.mainOptions = Options.merge(Options.defaults, opts);

		//lowercase all keys in hexNames
		let newHexNames = {};
		Object.keys(this.mainOptions.hexNames).forEach((hexKey) => {
			newHexNames[hexKey.toLowerCase()] = this.mainOptions.hexNames[hexKey];
		});
		this.mainOptions.hexNames = newHexNames;

		//set rtl or ltr for text elements
		this.mainOptions.textParameters.direction = window.getComputedStyle(
			document.body || document.documentElement
		).direction;
		if (this.mainOptions.textParameters.direction == "rtl") {
			this.mainOptions.textParameters.textAlign = "right";
		}

		if (this.mainOptions.cornerControlsStyle == "advanced") {
			initAdvancedCorners();
		}

		if (elem.classList.contains("fpd-off-canvas") || elem.classList.contains("fpd-topbar"))
			this.mainOptions.toolbarPlacement = "smart";

		if (Array.isArray(this.mainOptions.pricingRules) && this.mainOptions.pricingRules.length) {
			this.pricingRulesInstance = new PricingRules(this);
		}

		if (this.mainOptions.editorMode) {
			addElemClasses(document.body, ["fpd-editor-mode"]);
		}

		this.translator = new Translator();
		this.translator.loadLangJSON(this.mainOptions.langJSON, this.#langLoaded.bind(this));
	}

	#langLoaded() {
		loadFonts(this, (fonts) => {
			this.mainOptions.fonts = fonts;

			//timeout when no language json file is loaded
			setTimeout(() => {
				this.uiManager = new UIManager(this);
				this.uiManager.addEventListener("ready", this.#ready.bind(this));
				this.uiManager.init();
			}, 1);
		});
	}

	#ready() {
		/**
		 * Gets fired as soon as product designer is ready, e.g. to make any method call.
		 *
		 * @event ready
		 * @param {CustomEvent} event
		 */
		fireEvent(this, "ready", {});

		this.warningsWrapper = this.container.querySelector(".fpd-warnings");

		if (this.mainOptions.productsJSON) {
			if (typeof this.mainOptions.productsJSON === "object") {
				this.setupProducts(this.mainOptions.productsJSON);
			} else {
				getJSON({
					url: this.mainOptions.productsJSON,
					onSuccess: (data) => {
						this.setupProducts(data);
					},
					onError: () => {
						alert(
							"Products JSON could not be loaded. Please check that your URL is correct! URL: " +
								this.mainOptions.productsJSON
						);
					},
				});
			}
		}

		if (this.mainOptions.designsJSON) {
			if (typeof this.mainOptions.designsJSON === "object") {
				this.setupDesigns(this.mainOptions.designsJSON);
			} else {
				getJSON({
					url: this.mainOptions.designsJSON,
					onSuccess: (data) => {
						this.setupDesigns(data);
					},
					onError: () => {
						alert(
							"Design JSON could not be loaded. Please check that your URL is correct! URL: " +
								this.mainOptions.designsJSON
						);
					},
				});
			}
		}

		if (this.mainOptions.keyboardControl) {
			addEvents(document, "keydown", (evt) => {
				if (this.currentViewInstance && this.currentViewInstance.fabricCanvas) {
					const viewInst = this.currentViewInstance;
					const targetNodename = evt.target.nodeName;
					const currentElement = viewInst.fabricCanvas.getActiveObject();

					if (currentElement && !["TEXTAREA", "INPUT"].includes(targetNodename)) {
						switch (evt.which) {
							case 8:
								//remove element
								if (currentElement.removable) {
									viewInst.fabricCanvas.removeElement(currentElement);
								}

								break;
							case 37: // left
								if (currentElement.draggable) {
									viewInst.fabricCanvas.setElementOptions({
										left: currentElement.left - 1,
									});
								}

								break;
							case 38: // up
								if (currentElement.draggable) {
									viewInst.fabricCanvas.setElementOptions({
										top: currentElement.top - 1,
									});
								}

								break;
							case 39: // right
								if (currentElement.draggable) {
									viewInst.fabricCanvas.setElementOptions({
										left: currentElement.left + 1,
									});
								}

								break;
							case 40: // down
								if (currentElement.draggable) {
									viewInst.fabricCanvas.setElementOptions({
										top: currentElement.top + 1,
									});
								}

								break;

							default:
								return; //other keys
						}

						evt.preventDefault();
					}
				}
			});
		}

		//load watermark image
		if (this.mainOptions.watermark) {
			fabric.Image.fromURL(
				this.mainOptions.watermark,
				(fabricImg, error) => {
					if (!error) this.watermarkImg = fabricImg;
				},
				{ crossOrigin: "anonymous" }
			);
		}

		if (this.mainOptions.unsavedProductAlert) {
			window.onbeforeunload = () => {
				if (this.doUnsavedAlert) {
					return "";
				}
			};
		}

		//window resize handler
		let currentWindowWidth = 0;
		window.addEventListener("resize", (evt) => {
			//fix for android browser, because keyboard trigger resize event
			if (window.innerWidth === currentWindowWidth || this.inTextField) {
				return;
			}

			currentWindowWidth = window.innerWidth;

			//deselect element if one is selected and active element is not input (FB browser fix)
			if (this.currentElement && !["INPUT", "TEXTAREA"].includes(document.activeElement)) {
				this.deselectElement();
			}

			if (this.currentViewInstance) {
				//timeout to get correct with
				setTimeout(() => {
					this.currentViewInstance.fabricCanvas.resetSize();
				}, 100);
			}
		});

		addEvents(this, ["productCreate", "layoutElementsAdded"], this.#addGlobalElements.bind(this));

		//window.localStorage.setItem('fpd-gt-closed', 'no');
		addEvents(this, ["productCreate", "modalDesignerOpen"], (evt) => {
			if (
				(!this.firstProductCreated && !this.mainOptions.modalMode) ||
				(!this.firstProductCreated && evt.type === "modalDesignerOpen")
			) {
				if (this.mainOptions.autoOpenInfo && this.actionsBar) {
					this.actionsBar.doAction("info");
				}

				if (this.guidedTour) {
					if (localStorageAvailable()) {
						if (window.localStorage.getItem("fpd-gt-closed") !== "yes") {
							this.guidedTour.start();
						}
					} else {
						this.guidedTour.start();
					}
				}
			}

			this.firstProductCreated = this.mainOptions.modalMode && evt.type === "modalDesignerOpen";
		});

		addEvents(
			document.body,
			["focusin", "blur"],
			(evt) => {
				if (["TEXTAREA", "INPUT"].includes(evt.target.nodeName)) {
					this.inTextField = evt.type == "focusin";
				}
			},
			true
		);

		addEvents(
			document.body,
			["mouseup", "touchend"],
			(evt) => {
				let fpdContainers = Array.from(document.querySelectorAll(".fpd-container"));
				const clickedWithinContainer = Boolean(
					fpdContainers.find((container) => container.contains(evt.target))
				);

				//deselect element if click outside of a fpd-container
				if (!clickedWithinContainer && this.mainOptions.deselectActiveOnOutside) {
					this.deselectElement();
				}
			},
			true
		);

		//dragging image/design to canvas or upload zone
		if (this.mainOptions.dragDropImagesToUploadZones) {
			let targetGridItem = null;
			addEvents(document.body, ["mousedown", "touchstart"], (evt) => {
				//only left mouse
				if (evt.which == 1) {
					const target = evt.target;
					if (target.classList.contains("fpd-draggable")) {
						targetGridItem = target;

						this.draggedPlaceholder = document.createElement("div");
						this.draggedPlaceholder.className = "fpd-dragged-image fpd-shadow-1 fpd-hidden";
						this.draggedPlaceholder.style.backgroundImage = `url("${
							target.querySelector("picture").dataset.img
						}")`;
						document.body.append(this.draggedPlaceholder);
					}
				}
			});

			addEvents(document.body, ["mousemove"], (evt) => {
				if (this.draggedPlaceholder) {
					this.draggedPlaceholder.style.left = evt.pageX - targetGridItem.offsetWidth * 0.5 + "px";
					this.draggedPlaceholder.style.top = evt.pageY - targetGridItem.offsetHeight * 0.5 + "px";

					removeElemClasses(this.draggedPlaceholder, ["fpd-hidden"]);
					setTimeout(() => {
						if (this.draggedPlaceholder) {
							addElemClasses(this.draggedPlaceholder, ["fpd-animate"]);
						}
					}, 1);

					evt.stopPropagation();
					evt.preventDefault();
				}
			});

			addEvents(document.body, ["mouseup"], (evt) => {
				if (this.draggedPlaceholder) {
					this.draggedPlaceholder.remove();
					this.draggedPlaceholder = null;
				}

				if (!this.loadingCustomImage && targetGridItem && this.mouseOverCanvas) {
					this._addGridItemToCanvas(
						targetGridItem,
						this.mouseOverCanvas.uploadZone ? { _addToUZ: this.mouseOverCanvas.title } : {}
					);
				}

				targetGridItem = null;
				this.mouseOverCanvas = false;
			});
		}

		if (typeof this.mainOptions.editorMode === "string") {
			new EditorBox(this);
		}
	}

	#addGlobalElements() {
		const globalElements = this.globalCustomElements.concat(this.fixedElements);
		if (!globalElements.length) return;

		let globalElementsCount = 0;
		const _addCustomElement = (object) => {
			const viewInstance = this.viewInstances[object.viewIndex];

			if (viewInstance) {
				//add element to correct view

				const fpdElement = object.element;

				//if element exists, do not add
				if (!viewInstance.fabricCanvas.getElementByTitle(fpdElement.title)) {
					let propertyKeys = Object.keys(this.mainOptions.elementParameters);
					if (fpdElement.getType() === "text") {
						propertyKeys = propertyKeys.concat(Object.keys(this.mainOptions.textParameters));
					} else {
						propertyKeys = propertyKeys.concat(Object.keys(this.mainOptions.imageParameters));
					}

					let elementProps = fpdElement.getElementJSON(false, propertyKeys);

					//delete old printing box to fetch printing box from current view
					if (elementProps._printingBox) {
						delete elementProps.boundingBox;
					}

					viewInstance.fabricCanvas.addElement(
						fpdElement.getType(),
						fpdElement.source,
						fpdElement.title,
						elementProps
					);
				}
			} else {
				_customElementAdded();
			}
		};

		const _customElementAdded = () => {
			globalElementsCount++;
			if (globalElementsCount < globalElements.length) {
				_addCustomElement(globalElements[globalElementsCount]);
			} else {
				this.removeEventListener("elementAdd", _customElementAdded);
			}
		};

		addEvents(this, "elementAdd", _customElementAdded);

		if (globalElements[0]) _addCustomElement(globalElements[0]);
	}

	//get category index by category name
	#getCategoryIndexInProducts(catName) {
		var catIndex = this.products.findIndex((obj) => obj.category === catName);
		return catIndex === -1 ? false : catIndex;
	}

	setupProducts(products = []) {
		this.products = [];

		products.forEach((productItem) => {
			if (productItem.hasOwnProperty("category")) {
				//check if products JSON contains categories

				productItem.products.forEach((singleProduct) => {
					this.addProduct(singleProduct, productItem.category);
				});
			} else {
				this.addProduct(productItem);
			}
		});

		//load first product
		if (this.mainOptions.loadFirstProductInStage && products.length > 0) {
			this.selectProduct(0);
		} else {
			this.toggleSpinner(false);
		}

		/**
		 * Gets fired as soon as products are set.
		 *
		 * @event productsSet
		 * @param {CustomEvent} event
		 */
		fireEvent(this, "productsSet", {});
	}

	/**
	 * Set up the designs with a JSON.
	 *
	 * @method setupDesigns
	 * @param {Array} designs An array containg the categories with designs.
	 */
	setupDesigns(designs) {
		this.designs = designs;

		/**
		 * Gets fired as soon as the designs are set.
		 *
		 * @event designsSet
		 * @param {CustomEvent} event
		 */
		fireEvent(this, "designsSet", {});
	}

	/**
	 * Adds a new product to the product designer.
	 *
	 * @method addProduct
	 * @param {array} views An array containing the views for a product. A view is an object with a title, thumbnail and elements property. The elements property is an array containing one or more objects with source, title, parameters and type.
	 * @param {string} [category] If categories are used, you need to define the category title.
	 */
	addProduct(views, category) {
		var catIndex = this.#getCategoryIndexInProducts(category);

		if (category === undefined) {
			this.products.push(views);
		} else {
			if (catIndex === false) {
				catIndex = this.products.length;
				this.products[catIndex] = { category: category, products: [] };
			}

			this.products[catIndex].products.push(views);
		}

		/**
		 * Gets fired when a product is added.
		 *
		 * @event productAdd
		 * @param {CustomEvent} event
		 * @param {Array} event.detail.views - The product views.
		 * @param {String} event.detail.category - The category title.
		 * @param {Number} event.detail.catIndex - The index of the category.
		 */
		fireEvent(this, "productAdd", {
			views: views,
			category: category,
			catIndex: catIndex,
		});
	}

	selectProduct(index, categoryIndex) {
		this.#totalProductElements = this.#productElementLoadingIndex = 0;
		this.currentCategoryIndex = categoryIndex === undefined ? this.currentCategoryIndex : categoryIndex;

		let productsObj;
		if (this.products && this.products.length && this.products[0].category) {
			//categories enabled
			const category = this.products[this.currentCategoryIndex];
			productsObj = category.products;
		} else {
			//no categories enabled
			productsObj = this.products;
		}

		this.currentProductIndex = index;
		if (index < 0) {
			this.currentProductIndex = 0;
		} else if (index > productsObj.length - 1) {
			this.currentProductIndex = productsObj.length - 1;
		}

		const product = productsObj[this.currentProductIndex];

		this.loadProduct(product, this.mainOptions.replaceInitialElements);
	}

	/**
	 * Loads a new product to the product designer.
	 *
	 * @method loadProduct
	 * @param {array} views An array containing the views for the product.
	 * @param {Boolean} [onlyReplaceInitialElements=false] If true, the initial elements will be replaced. Custom added elements will stay on the canvas.
	 * @param {Boolean} [mergeMainOptions=false] Merges the main options into every view options.
	 */
	loadProduct(views, replaceInitialElements = false, mergeMainOptions = false) {
		if (!views) {
			return;
		}

		/**
		 * Gets fired when a product is selected.
		 *
		 * @event productSelect
		 * @param {CustomEvent} event
		 * @param {Object} event.detail.product - An object containing the product (views).
		 */
		fireEvent(this, "productSelect", {
			product: views,
		});

		this.toggleSpinner(true);

		//reset when loading a product
		this.productCreated = false;
		this.colorLinkGroups = {};

		this.globalCustomElements = [];
		if (replaceInitialElements) {
			this.globalCustomElements = this.getCustomElements();
		} else {
			this.doUnsavedAlert = false;
		}

		this.fixedElements = this.getFixedElements();

		this.reset();

		views.forEach((view, i) => {
			if (mergeMainOptions) {
				view.options = Options.merge(this.mainOptions, view.options);
			}

			const relevantOptions = {};

			if (isPlainObject(view.options)) {
				FancyProductDesignerView.relevantOptions.forEach((key) => {
					if (typeof view.options[key] !== "undefined") {
						relevantOptions[key] = view.options[key];
					}
				});
			}

			view.options = relevantOptions;
		});

		this.productViews = views;

		this.#totalProductElements = this.#productElementLoadingIndex = 0;
		views.forEach((view, i) => {
			this.#totalProductElements += view.elements.length;
		});

		addEvents(this, "viewCreate", this.#onViewCreated);

		if (views) {
			this.addView(views[0]);
		}
	}

	/**
	 * Adds a view to the current visible product.
	 *
	 * @method addView
	 * @param {object} view An object with title, thumbnail and elements properties.
	 */
	addView(view) {
		//get relevant view options
		let relevantMainOptions = {};
		FancyProductDesignerView.relevantOptions.forEach((key) => {
			let mainProp = this.mainOptions[key];
			relevantMainOptions[key] = isPlainObject(mainProp) ? { ...mainProp } : mainProp;
		});

		view.options = isPlainObject(view.options) ? deepMerge(relevantMainOptions, view.options) : relevantMainOptions;

		//first view containing also product options
		document.body.dataset.fpdIndustryType = "";
		this.industryType = null;
		if (this.viewInstances.length == 0 && view.options.industry && view.options.industry.type) {
			this.industryType = view.options.industry.type;
			document.body.dataset.fpdIndustryType = this.industryType;
		}

		let viewInstance = new FancyProductDesignerView(
			this.productStage,
			view,
			this.#viewStageAdded.bind(this),
			this.mainOptions.fabricCanvasOptions
		);

		viewInstance.fabricCanvas.on({
			"mouse:move": (opts) => {
				this.mouseOverCanvas = opts.target ? opts.target : true;
			},
			"mouse:out": (opts) => {
				this.mouseOverCanvas = false;
			},
			beforeElementAdd: (opts) => {
				opts.params;

				if (this.mainBar && this.uiManager && this.uiManager.currentLayout == "small") {
					this.mainBar.toggleContentDisplay(false);
				}

				if (!this.productCreated) {
					this.#productElementLoadingIndex++;

					const txt =
						opts.title +
						"<br>" +
						String(this.#productElementLoadingIndex) +
						"/" +
						this.#totalProductElements;
					this.mainLoader.querySelector(".fpd-loader-text").innerHTML = txt;
				}

				/**
				 * Gets fired when an element is added.
				 *
				 * @event beforeElementAdd
				 * @param {Event} event
				 * @param {fabric.Object} element
				 */
				fireEvent(this, "beforeElementAdd", {
					element: opts,
				});
			},
			elementAdd: ({ element }) => {
				if (!element) {
					this.toggleSpinner(false);
					return;
				}

				if (this.productCreated && element.getType() == "image" && element.isCustom) {
					this.toggleSpinner(false);
				}

				//element should be replaced in all views
				if (!this.mainOptions.editorMode && element.replace && element.replaceInAllViews) {
					this.viewInstances.forEach((viewInst, i) => {
						if (this.currentViewIndex != i) {
							const replacedElem = viewInst.fabricCanvas.getElementByReplace(element.replace);

							if (replacedElem && !element._replaceAdded) {
								viewInst.fabricCanvas.addElement(element.getType(), element.source, element.title, {
									...element.originParams,
									_replaceAdded: true,
								});
							}
						}
					});
				}

				//check if element has a color linking group
				if (element.colorLinkGroup && element.colorLinkGroup.length > 0 && !this.mainOptions.editorMode) {
					var viewIndex = this.getViewIndexByWrapper(viewInstance.fabricCanvas.wrapperEl);

					if (this.colorLinkGroups.hasOwnProperty(element.colorLinkGroup)) {
						//check if color link object exists for the link group

						//add new element with id and view index of it
						this.colorLinkGroups[element.colorLinkGroup].elements.push({
							id: element.id,
							viewIndex: viewIndex,
						});

						if (typeof element.colors === "object") {
							//create color group colors
							const colorGroupColors = this.mainOptions.replaceColorsInColorGroup
								? element.colors
								: this.colorLinkGroups[element.colorLinkGroup].colors.concat(element.colors);
							this.colorLinkGroups[element.colorLinkGroup].colors = arrayUnique(colorGroupColors);
						} else if (element.colors === 1 || element.colors === true) {
							this.colorLinkGroups[element.colorLinkGroup].colors = ["#000"];
						}
					} else {
						//create initial color link object
						this.colorLinkGroups[element.colorLinkGroup] = {
							elements: [{ id: element.id, viewIndex: viewIndex }],
							colors: [],
						};

						if (typeof element.colors === "object") {
							this.colorLinkGroups[element.colorLinkGroup].colors = element.colors;
						} else if (element.colors === 1 || element.colors === true) {
							this.colorLinkGroups[element.colorLinkGroup].colors = ["#000"];
						}
					}
				}

				if (this.productCreated && this.mainOptions.hideDialogOnAdd && this.mainBar) {
					this.mainBar.toggleContentDisplay(false);
				}

				/**
				 * Gets fired when an element is added.
				 *
				 * @event elementAdd
				 * @param {Event} event
				 * @param {fabric.Object} element
				 */
				fireEvent(this, "elementAdd", {
					element: element,
				});

				fireEvent(this, "viewCanvasUpdate", {
					viewInstance: viewInstance,
				});
			},
			elementRemove: ({ element }) => {
				//delete fixed element
				const deleteIndex = this.fixedElements.findIndex((item) => {
					return item.element.title == element.title;
				});

				if (deleteIndex != -1) {
					this.fixedElements.splice(deleteIndex, 1);
				}

				/**
				 * Gets fired as soon as an element has been removed.
				 *
				 * @event elementRemove
				 * @param {Event} event
				 * @param {fabric.Object} element - The fabric object that has been removed.
				 */
				fireEvent(this, "elementRemove", {
					element: element,
				});

				fireEvent(this, "viewCanvasUpdate", {
					viewInstance: viewInstance,
				});
			},
			elementSelect: ({ element }) => {
				this.currentElement = element;

				this.#updateElementTooltip();

				if (element && !element._ignore && this.currentViewInstance) {
					//upload zone is selected
					if (element.uploadZone && !this.mainOptions.editorMode) {
						let customAdds = deepMerge(
							this.currentViewInstance.options.customAdds,
							element.customAdds || {}
						);

						//mobile fix: elementSelect is triggered before click, this was adding an image on mobile
						setTimeout(() => {
							this.currentViewInstance.currentUploadZone = element.title;
							this.mainBar.toggleUploadZonePanel(true, customAdds);
						}, 100);

						return;
					}
					//if element has no upload zone and an upload zone is selected, close dialogs and call first module
					else if (this.currentViewInstance.currentUploadZone) {
						this.mainBar.toggleUploadZonePanel(false);
					}
				}

				/**
				 * Gets fired when an element is selected.
				 *
				 * @event elementSelect
				 * @param {Event} event
				 */
				fireEvent(this, "elementSelect", {});

				if (
					this.mainOptions.openTextInputOnSelect &&
					element &&
					element.getType() === "text" &&
					element.editable &&
					this.toolbar
				) {
					this.toolbar.container.querySelector(".fpd-tool-edit-text").click();
				}

				this.#setWarnings();
			},
			multiSelect: ({ activeSelection }) => {
				/**
				 * Gets fired as soon as mutiple elements are selected.
				 *
				 * @event multiSelect
				 * @param {Event} event
				 * @param {fabric.Object} activeSelection - The current selected object.
				 */
				fireEvent(this, "multiSelect", { activeSelection: activeSelection });
			},
			elementCheckContainemt: ({ target, boundingBoxMode }) => {
				if (boundingBoxMode === "inside") {
					this.#updateElementTooltip();
				}
			},
			elementFillChange: ({ element, colorLinking }) => {
				if (
					this.productCreated &&
					colorLinking &&
					element.colorLinkGroup &&
					element.colorLinkGroup.length > 0
				) {
					const group = this.colorLinkGroups[element.colorLinkGroup];

					if (group && group.elements) {
						group.elements.forEach((groupElem) => {
							if (element.id != groupElem.id) {
								const targetView = this.viewInstances[groupElem.viewIndex];
								const targetElem = targetView.fabricCanvas.getElementByID(groupElem.id);

								if (targetElem) targetElem.changeColor(element.fill, false);
							}
						});
					}
				}

				/**
				 * Gets fired when the color of an element is changed.
				 *
				 * @event elementFillChange
				 * @param {Event} event
				 * @param {fabric.Object} element
				 * @param {String} hex Hexadecimal color string.
				 * @param {Boolean} colorLinking Color of element is linked to other colors.
				 */
				fireEvent(this, "elementFillChange", {
					element: element,
					colorLinking: colorLinking,
				});

				fireEvent(this, "viewCanvasUpdate", {
					viewInstance: viewInstance,
				});

				this.applyTextLinkGroup(element, { fill: element.fill });
			},
			elementChange: ({ element, type }) => {
				this.#updateElementTooltip();

				if (type === "scaling") {
					this.#setWarnings(element);
				}

				fireEvent(this, "elementChange", {
					type: type,
					element: element,
				});
			},
			elementModify: ({ element, options }) => {
				this.#updateElementTooltip();
				this.applyTextLinkGroup(element, options);
				this.#setWarnings(element);

				/**
				 * Gets fired when an element is modified.
				 *
				 * @event elementModify
				 * @param {CustomEvent} event
				 * @param {Object} event.detail.options - Ab object containing the modified options(parameters).
				 * @param {fabric.Object} event.detail.element - The modified element.
				 */
				fireEvent(this, "elementModify", {
					options: options,
					element: element,
				});

				fireEvent(this, "viewCanvasUpdate", {
					viewInstance: viewInstance,
				});
			},
			"text:changed": ({ target }) => {
				this.applyTextLinkGroup(target, { text: target.text });
			},
			"history:append": () => {
				this.#historyAction("append");
			},
			"history:clear": () => {
				this.#historyAction("clear");
			},
			"history:undo": () => {
				this.#historyAction("undo");
			},
			"history:redo": () => {
				this.#historyAction("redo");
			},
		});

		addEvents(viewInstance, "priceChange", (evt) => {
			this.calculatePrice();
		});

		viewInstance.init();
	}

	#onViewCreated() {
		//add all views of product till views end is reached
		if (this.viewInstances.length < this.productViews.length) {
			this.addView(this.productViews[this.viewInstances.length]);
		}
		//all views added
		else {
			this.removeEventListener("viewCreate", this.#onViewCreated);

			this.toggleSpinner(false);
			this.selectView(0);

			//select element with autoSelect enabled
			if (
				!this.mainOptions.editorMode &&
				this.currentViewInstance &&
				this.currentViewInstance.fabricCanvas.wrapperEl.offsetParent //canvas is visible
			) {
				this.doAutoSelect();
			}

			this.productCreated = true;

			const productLayouts = this.productViews[0].options.layouts;
			if (typeof productLayouts == "string") {
				getJSON({
					url: productLayouts,
					onSuccess: (data) => {
						this.currentLayouts = data;
						fireEvent(this, "layoutsSet", {});
					},
					onError: () => {
						alert(
							"Layouts JSON could not be loaded. Please check that your URL is correct! URL: " +
								this.mainOptions.layouts
						);
					},
				});
			} else if (Array.isArray(productLayouts)) {
				this.currentLayouts = productLayouts;
				fireEvent(this, "layoutsSet", {});
			}

			/**
			 * Gets fired as soon as a product has been fully added to the designer.
			 *
			 * @event productCreate
			 * @param {Event} event
			 */
			fireEvent(this, "productCreate");
		}
	}

	#historyAction(type) {
		if (["undo", "redo"].includes(type)) {
			this.currentViewInstance.fabricCanvas._renderPrintingBox();
		}

		/**
		 * Gets fired as soon as any action for canvas history is executed.
		 *
		 * @event historyAction
		 * @param {Event} event
		 */
		fireEvent(this, "historyAction", { type: type });

		this.#toggleUndoRedoBtns();
	}

	#toggleUndoRedoBtns() {
		if (this.currentViewInstance) {
			const historyUndo = this.currentViewInstance.fabricCanvas.historyUndo;
			const historyRedo = this.currentViewInstance.fabricCanvas.historyRedo;

			if (historyUndo.length) this.doUnsavedAlert = true;

			if (historyUndo) {
				toggleElemClasses(
					document.body.querySelectorAll('.fpd-btn[data-action="undo"]'),
					["fpd-disabled"],
					historyUndo.length == 0
				);

				toggleElemClasses(
					document.body.querySelectorAll('.fpd-btn[data-action="redo"]'),
					["fpd-disabled"],
					historyRedo.length == 0
				);
			}
		}
	}

	doAutoSelect() {
		if (this.currentViewInstance.locked) return;

		let selectElement = null;
		const viewElements = this.currentViewInstance.fabricCanvas.getObjects();
		viewElements.forEach((obj) => {
			if (obj.autoSelect && !obj.hasUploadZone) {
				selectElement = obj;
			}
		});

		if (selectElement) {
			setTimeout(() => {
				this.currentViewInstance.fabricCanvas.setActiveObject(selectElement).renderAll();
			}, 500);
		}
	}

	#viewStageAdded(viewInstance) {
		//do not add view instance, if wrapper is not in dom, e.g. has been removed
		if (!viewInstance.fabricCanvas.wrapperEl.parentNode) return;

		this.viewInstances.push(viewInstance);

		viewInstance.fabricCanvas.on("sizeUpdate", ({ canvasHeight }) => {
			let mainHeight = canvasHeight + "px";

			this.productStage.style.height = mainHeight;

			const mainBarClasslist = this.container.classList;
			if (mainBarClasslist.contains("fpd-sidebar")) {
				this.mainBar.container.style.height = mainHeight;

				//if main wrapper has a different height, adjust main bar height to that height
				if (canvasHeight != this.mainWrapper.container.offsetHeight)
					this.mainBar.container.style.height = this.mainWrapper.container.offsetHeight + "px";
			}
		});

		if (viewInstance.names_numbers && viewInstance.names_numbers.length > 1) {
			viewInstance.changePrice(
				(viewInstance.names_numbers.length - 1) * viewInstance.options.namesNumbersEntryPrice,
				"+"
			);
		}

		/**
		 * Gets fired when a view is created.
		 *
		 * @event viewCreate
		 * @param {Event} event
		 * @param {FancyProductDesignerView} viewInstance
		 */
		fireEvent(this, "viewCreate", { viewInstance: viewInstance });

		viewInstance.fabricCanvas.onHistory();
		viewInstance.fabricCanvas.clearHistory();
	}

	#updateElementTooltip() {
		if (!this.mainTooltip) return;

		const element = this.currentElement;

		if (this.productCreated && element && !element.uploadZone && !element.__editorMode) {
			if (element.isOut && element.boundingBoxMode === "inside") {
				const label = this.translator.getTranslation(
					"misc",
					"out_of_bounding_box",
					"Move element inside the boundary!"
				);
				this.mainTooltip.innerHTML = label;
				this.mainTooltip.classList.add("fpd-show");
			} else if (this.mainOptions.sizeTooltip) {
				const displaySize = this.calcDisplaySize(element);
				let displayText = displaySize.width + "x" + displaySize.height + displaySize.unit;

				if (displaySize.dpi) {
					displayText += " | DPI:" + displaySize.dpi;
				}

				this.mainTooltip.innerHTML = displayText;
				this.mainTooltip.classList.add("fpd-show");
			} else {
				this.mainTooltip.classList.remove("fpd-show");
			}

			if (this.mainTooltip.classList.contains("fpd-show")) {
				const oCoords = element.oCoords;
				const viewStageRect = this.currentViewInstance.fabricCanvas.wrapperEl.getBoundingClientRect();

				let leftPos = viewStageRect.left + oCoords.mt.x - this.mainTooltip.clientWidth / 2;
				let topPos = viewStageRect.top + oCoords.mt.y - this.mainTooltip.clientHeight - 20;

				const contRect = this.container.getBoundingClientRect();
				if (topPos < contRect.top) topPos = contRect.top - this.mainTooltip.clientHeight;

				topPos = topPos < 0 ? 0 : topPos;

				this.mainTooltip.style.left = leftPos + "px";
				this.mainTooltip.style.top = topPos + "px";
			}
		} else {
			this.mainTooltip.classList.remove("fpd-show");
		}
	}

	#setWarnings() {
		if (!this.warningsWrapper || this.mainOptions.editorMode) return;
		this.warningsWrapper.innerHTML = "";

		const element = this.currentElement;

		if (this.productCreated && element) {
			const dpi = this.calcElementDPI(element);

			if (element.isCustomImage && dpi !== null && dpi < this.mainOptions.customImageParameters.minDPI) {
				const sizeWarning = document.createElement("div");
				sizeWarning.className = "fpd-size-warning";
				sizeWarning.innerHTML =
					"<span>" + this.translator.getTranslation("misc", "dpi_warning", "Low resolution!") + "</span>";
				this.warningsWrapper.append(sizeWarning);

				if (this.mainOptions.aiService.serverURL && this.mainOptions.aiService.superRes) {
					const superResBtn = document.createElement("span");
					superResBtn.className = "fpd-btn";
					superResBtn.innerText = this.translator.getTranslation("misc", "ai_upscale_btn");
					sizeWarning.append(superResBtn);

					addEvents(superResBtn, "click", (evt) => {
						const displaySize = this.calcDisplaySize(element);
						const lin = displaySize.unit == "mm" ? 25.4 : 2.54;
						const toPx = parseInt(
							(this.mainOptions.customImageParameters.minDPI * displaySize.width) / lin
						);

						let scaleTo = toPx / element.width;
						scaleTo = Math.ceil(scaleTo);
						scaleTo = scaleTo > 4 ? 4 : scaleTo;
						console.log("AI SuperRes - Scale:", scaleTo);

						this.deselectElement();
						this.toggleSpinner(true, this.translator.getTranslation("misc", "loading_image"));

						postJSON({
							url: this.mainOptions.aiService.serverURL,
							body: {
								service: "superRes",
								image: element.source,
								scale: scaleTo,
							},
							onSuccess: (data) => {
								if (data && data.new_image) {
									let tempScaledWidth = element.getScaledWidth();

									element.setSrc(
										data.new_image,
										() => {
											element.source = data.new_image;

											//fix: two times
											element.scaleToWidth(tempScaledWidth);
											element.scaleToWidth(tempScaledWidth);
											element.canvas.renderAll();

											Snackbar(this.translator.getTranslation("misc", "ai_upscale_success"));

											fireEvent(this, "elementModify", {
												options: { scaleX: element.scaleX },
												element: element,
											});
										},
										{ crossOrigin: "anonymous" }
									);
								} else {
									this.aiRequestError(data.error);
								}

								this.toggleSpinner(false);
							},
							onError: this.aiRequestError.bind(this),
						});
					});
				}

				/**
				 * Gets fired when the DPI of an image is below the minDPI and the warning is shown.
				 *
				 * @event imageDPIWarningOn
				 * @param {Event} event
				 */
				fireEvent(this, "imageDPIWarningOn", {
					element: element,
					dpi: dpi,
				});
			} else {
				/**
				 * Gets fired when the DPI of an image is in range.
				 *
				 * @event imageDPIWarningOff
				 * @param {Event} event
				 */
				fireEvent(this, "imageDPIWarningOff", {
					element: element,
					dpi: dpi,
				});
			}
		}
	}

	aiRequestError(error) {
		Snackbar(error);
		this.toggleSpinner(false);
	}

	calcElementDPI(element) {
		if (
			element &&
			!element.uploadZone &&
			element.isBitmap() &&
			objectHasKeys(this.currentViewInstance.options.output, ["width", "height"]) &&
			objectHasKeys(this.currentViewInstance.options.printingBox, ["left", "top", "width", "height"])
		) {
			const dpi = Math.ceil(
				(this.currentViewInstance.options.printingBox.width * 25.4) /
					this.currentViewInstance.options.output.width /
					element.scaleX
			);
			return dpi;
		}

		return null;
	}

	calcDisplaySize(element) {
		let unit = this.mainOptions.rulerUnit;
		let unitFactor = unit == "cm" ? 10 : 1;
		let widthRatio = 1;
		let heightRatio = 1;
		let dpi = null;

		if (
			objectHasKeys(this.currentViewInstance.options.printingBox, ["left", "top", "width", "height"]) &&
			objectHasKeys(this.currentViewInstance.options.output, ["width", "height"])
		) {
			dpi = this.calcElementDPI(element);

			if (unit != "px") {
				//one pixel in mm
				widthRatio =
					this.currentViewInstance.options.output.width / this.currentViewInstance.options.printingBox.width;
				heightRatio =
					this.currentViewInstance.options.output.height /
					this.currentViewInstance.options.printingBox.height;
			}
		} else {
			unitFactor = 1;
			unit = "px";
		}

		let sizeWidth = parseInt(element.width * element.scaleX * widthRatio);
		sizeWidth = parseInt(sizeWidth / unitFactor);

		let sizeHeight = parseInt(element.height * element.scaleY * heightRatio);
		sizeHeight = parseInt(sizeHeight / unitFactor);

		return {
			width: sizeWidth,
			height: sizeHeight,
			unit: unit,
			dpi: dpi,
		};
	}

	applyTextLinkGroup(element, options = {}) {
		if (!element) return;

		//text link group
		if (!isEmpty(element.textLinkGroup)) {
			const textLinkGroupProps = this.mainOptions.textLinkGroupProps || [];

			this.viewInstances.forEach((viewInst) => {
				viewInst.fabricCanvas.getObjects().forEach((fabricObj) => {
					if (
						fabricObj !== element &&
						fabricObj.getType() === "text" &&
						fabricObj.textLinkGroup === element.textLinkGroup
					) {
						if (typeof options.text === "string") {
							fabricObj.set("text", element.text);
							fabricObj.fire("changed");

							fireEvent(this, "textLinkApply", {
								element: fabricObj,
								options: {
									text: element.text,
								},
							});
						}

						//get all property keys that are in textLinkGroupProps option
						const linkedPropKeys = Object.keys(element).filter((key) => textLinkGroupProps.includes(key));
						//copy linked props to other text elements
						linkedPropKeys.forEach((propKey) => {
							fabricObj.set(propKey, element[propKey]);

							fireEvent(this, "textLinkApply", {
								element: fabricObj,
								options: {
									[propKey]: element[propKey],
								},
							});
						});

						viewInst.fabricCanvas.renderAll();
					}
				});
			});
		}
	}

	/**
	 * Gets the index of the view.
	 *
	 * @method getIndex
	 * @returns {Number} The index.
	 */
	getViewIndexByWrapper(wrapperEl) {
		return Array.from(this.productStage.querySelectorAll(".fpd-view-stage")).indexOf(wrapperEl);
	}

	toggleSpinner(toggle = true, msg = "") {
		if (!this.mainLoader) return false;

		this.mainLoader.querySelector(".fpd-loader-text").innerText = msg;
		this.mainLoader.classList.toggle("fpd-hidden", !toggle);

		return this.mainLoader;
	}

	/**
	 * Selects a view from the current visible views.
	 *
	 * @method selectView
	 * @param {number} index The requested view by an index value. 0 will load the first view.
	 */
	selectView(index = 0) {
		if (this.viewInstances.length <= 0) {
			return;
		}

		if (this.currentViewInstance && this.currentViewInstance.fabricCanvas)
			this.currentViewInstance.fabricCanvas.resetZoom();

		this.currentViewIndex = index;
		if (index < 0) {
			this.currentViewIndex = 0;
		} else if (index > this.viewInstances.length - 1) {
			this.currentViewIndex = this.viewInstances.length - 1;
		}

		if (this.currentViewInstance && this.currentViewInstance.fabricCanvas)
			this.currentViewInstance.fabricCanvas.clearHistory();

		this.currentViewInstance = this.viewInstances[this.currentViewIndex];

		this.deselectElement();

		//select view wrapper and render stage of view
		const viewStages = this.productStage.querySelectorAll(".fpd-view-stage");
		addElemClasses(viewStages, ["fpd-hidden"]);

		removeElemClasses(viewStages.item(this.currentViewIndex), ["fpd-hidden"]);

		//toggle next/previous view buttons
		toggleElemClasses(
			document.body.querySelectorAll('.fpd-btn[data-action="previous-view"], .fpd-btn[data-action="next-view"]'),
			["fpd-hidden"],
			this.viewInstances.length <= 1
		);

		toggleElemClasses(
			document.body.querySelectorAll("fpd-views-nav"),
			["fpd-hidden"],
			this.viewInstances.length <= 1 && !this.mainOptions.enableDynamicViews
		);

		toggleElemClasses(
			document.body.querySelectorAll('.fpd-btn[data-action="previous-view"], .fpd-view-prev'),
			["fpd-disabled"],
			this.currentViewIndex == 0
		);

		toggleElemClasses(
			document.body.querySelectorAll('.fpd-btn[data-action="next-view"], .fpd-view-next'),
			["fpd-disabled"],
			this.currentViewIndex === this.viewInstances.length - 1
		);

		this.#toggleUndoRedoBtns();
		this.currentViewInstance.fabricCanvas.snapToGrid = false;
		this.currentViewInstance.fabricCanvas.enableRuler = this.mainOptions.rulerFixed;

		//reset view canvas size
		this.currentViewInstance.fabricCanvas.resetSize();

		/**
		 * Gets fired as soon as a view has been selected.
		 *
		 * @event viewSelect
		 * @param {Event} event
		 */
		fireEvent(this, "viewSelect");
	}

	/**
	 * Returns an array with fabricjs objects.
	 *
	 * @method getElements
	 * @param {Number} [viewIndex=-1] The index of the target view. By default all views are target.
	 * @param {String} [elementType='all'] The type of elements to return. By default all types are returned. Possible values: text, image.
	 * @param {String} [deselectElement=true] Deselect current selected element.
	 * @returns {Array} An array containg the elements.
	 */
	getElements(viewIndex, elementType = "all", deselectElement = true) {
		viewIndex = viewIndex === undefined || isNaN(viewIndex) ? -1 : viewIndex;

		if (deselectElement) {
			this.deselectElement();
		}

		let allElements = [];
		if (viewIndex === -1) {
			for (var i = 0; i < this.viewInstances.length; ++i) {
				allElements = allElements.concat(
					this.viewInstances[i].fabricCanvas.getElements(elementType, deselectElement)
				);
			}
		} else {
			if (this.viewInstances[viewIndex]) {
				allElements = this.viewInstances[viewIndex].fabricCanvas.getElements(elementType, deselectElement);
			} else {
				return [];
			}
		}

		return allElements;
	}

	/**
	 * Returns an array with all custom added elements.
	 *
	 * @method getCustomElements
	 * @param {string} [type='all'] The type of elements. Possible values: 'all', 'image', 'text'.
	 * @param {Number} [viewIndex=-1] The index of the target view. By default all views are target.
	 * @param {String} [deselectElement=true] Deselect current selected element.
	 * @returns {array} An array with objects with the fabric object and the view index.
	 */
	getCustomElements(type = "all", viewIndex = -1, deselectElement = true) {
		let customElements = [];

		const elements = this.getElements(viewIndex, type, deselectElement);
		elements.forEach((element) => {
			if (element.isCustom) {
				const viewIndex = this.getViewIndexByWrapper(element.canvas.wrapperEl);

				customElements.push({ element: element, viewIndex: viewIndex });
			}
		});

		return customElements;
	}

	/**
	 * Returns an array with all fixed elements.
	 *
	 * @method getFixedElements
	 * @param {string} [type='all'] The type of elements. Possible values: 'all', 'image', 'text'.
	 * @param {Number} [viewIndex=-1] The index of the target view. By default all views are target.
	 * @param {String} [deselectElement=true] Deselect current selected element.
	 * @returns {array} An array with objects with the fabric object and the view index.
	 */
	getFixedElements(type = "all", viewIndex = -1, deselectElement = true) {
		let fixedElements = [];

		const elements = this.getElements(viewIndex, type, deselectElement);
		elements.forEach((element) => {
			if (element.fixed) {
				const viewIndex = this.getViewIndexByWrapper(element.canvas.wrapperEl);
				fixedElements.push({ element: element, viewIndex: viewIndex });
			}
		});

		return fixedElements;
	}

	/**
	 * Clears the product stage and resets everything.
	 *
	 * @method reset
	 */
	reset() {
		if (this.productViews === null) return;

		this.removeEventListener("viewCreate", this.#onViewCreated);

		this.deselectElement();
		if (this.currentViewInstance) this.currentViewInstance.fabricCanvas.resetZoom();

		this.currentViewIndex = this.currentPrice = this.singleProductPrice = this.pricingRulesPrice = 0;
		this.currentViewInstance = this.productViews = this.currentElement = null;

		this.viewInstances.forEach((viewInst) => {
			viewInst.fabricCanvas.dispose();
		});

		this.productStage.innerHTML = "";
		this.viewInstances = [];

		/**
		 * Gets fired as soon as the stage has been cleared.
		 *
		 * @event clear
		 * @param {Event} event
		 */
		fireEvent(this, "clear");
		fireEvent(this, "priceChange");
	}

	/**
	 * Deselects the selected element of the current showing view.
	 *
	 * @method deselectElement
	 */
	deselectElement() {
		if (this.currentViewInstance && this.currentViewInstance.fabricCanvas) {
			this.currentViewInstance.fabricCanvas.deselectElement();
			this.currentElement = null;
		}
	}

	/**
	 * Adds a new custom image to the product stage. This method should be used if you are using an own image uploader for the product designer. The customImageParameters option will be applied on the images that are added via this method.
	 *
	 * @method addCustomImage
	 * @param {string} source The URL of the image.
	 * @param {string} title The title for the design.
	 * @param {Object} options Additional options.
	 * @param {number} [viewIndex] The index of the view where the element needs to be added to. If no index is set, it will be added to current showing view.
	 */
	addCustomImage(source, title, options = {}, viewIndex) {
		viewIndex = viewIndex === undefined ? this.currentViewIndex : viewIndex;

		const image = new Image();
		image.crossOrigin = "anonymous";
		image.src = source;

		this.toggleSpinner(true, this.translator.getTranslation("misc", "loading_image"));
		addElemClasses(this.viewsNav.container, ["fpd-disabled"]);

		image.onload = () => {
			this.loadingCustomImage = false;

			let imageH = image.height,
				imageW = image.width,
				currentCustomImageParameters = this.currentViewInstance.options.customImageParameters;

			if (!checkImageDimensions(this, imageW, imageH)) {
				this.toggleSpinner(false);
				return false;
			}

			let fixedParams = {
				isCustom: true,
				isCustomImage: true,
			};

			//enable color wheel for svg and when no colors are set
			if (image.src.includes(".svg") && !currentCustomImageParameters.colors) {
				fixedParams.colors = true;
			}

			let imageParams = deepMerge(currentCustomImageParameters, fixedParams);
			imageParams = deepMerge(imageParams, options);

			this.viewInstances[viewIndex].fabricCanvas.addElement("image", source, title, imageParams, viewIndex);

			removeElemClasses(this.viewsNav.container, ["fpd-disabled"]);
		};

		image.onerror = () => {
			removeElemClasses(this.viewsNav.container, ["fpd-disabled"]);

			Snackbar("Image could not be loaded!");
		};
	}

	_addGridItemToCanvas(item, additionalOpts = {}, viewIndex, isRemoteImage = true) {
		if (!this.currentViewInstance) {
			return;
		}
		viewIndex = viewIndex === undefined ? this.currentViewIndex : viewIndex;

		const options = deepMerge({ _addToUZ: this.currentViewInstance.currentUploadZone }, additionalOpts);

		if (this.productCreated && this.mainOptions.hideDialogOnAdd && this.mainBar) {
			this.mainBar.toggleContentDisplay(false);
		}

		this._addCanvasImage(item.dataset.source, item.dataset.title, options, viewIndex, isRemoteImage);
	}

	_addCanvasImage(source, title, options = {}, viewIndex, isRemoteImage = true) {
		if (!this.currentViewInstance) return;
		viewIndex = viewIndex === undefined ? this.currentViewIndex : viewIndex;

		//download remote image to local server (FB, Instagram, Pixabay)
		if (FancyProductDesigner.uploadsToServer && isRemoteImage) {
			this._downloadRemoteImage(source, title, options);
		}
		//add data uri or local image to canvas
		else {
			this.loadingCustomImage = true;
			this.addCustomImage(source, title, options, viewIndex);
		}
	}

	_downloadRemoteImage(source, title, options = {}, callback = null) {
		if (!this.mainOptions.fileServerURL) {
			alert("You need to set the fileServerURL in the option, otherwise file uploading does not work!");
			return;
		}

		this.loadingCustomImage = true;
		this.toggleSpinner(true, this.translator.getTranslation("misc", "loading_image"));
		addElemClasses(this.viewsNav.container, ["fpd-disabled"]);

		const formData = new FormData();
		formData.append("url", source);

		const _errorHandler = (errorMsg) => {
			removeElemClasses(this.viewsNav.container, ["fpd-disabled"]);

			this.toggleSpinner(false);
			Snackbar(errorMsg);
		};

		postJSON({
			url: this.getFileServerURL(),
			body: formData,
			onSuccess: (data) => {
				if (data && data.image_src) {
					if (callback) {
						callback({ url: data.image_src });
					} else {
						this.addCustomImage(data.image_src, data.filename ? data.filename : title, options);
					}
				} else {
					if (callback) {
						callback({ error: data.image_src });
					} else {
						_errorHandler(data.error);
					}
				}
			},
			onError: _errorHandler,
		});
	}

	addCanvasDesign(source, title, params = {}) {
		if (!this.currentViewInstance) {
			return;
		}

		this.toggleSpinner(true, this.translator.getTranslation("misc", "loading_image"));

		params = deepMerge(this.currentViewInstance.options.customImageParameters, params);

		params.isCustom = true;
		if (this.currentViewInstance.currentUploadZone) {
			params._addToUZ = this.currentViewInstance.currentUploadZone;
		}

		if (this.productCreated && this.mainOptions.hideDialogOnAdd && this.mainBar) {
			this.mainBar.toggleContentDisplay(false);
		}

		if (Array.isArray(params.relatedViewImages)) {
			params.replaceInAllViews = false;

			//add main design to first view
			this.viewInstances[0].fabricCanvas.addElement("image", source, title, params);

			//loop through related view images
			params.relatedViewImages.forEach((item) => {
				//only add if viewIndex > 0 and view insatance view index exists
				if (
					!isEmpty(item.viewIndex) &&
					!isEmpty(item.url) &&
					!isEmpty(item.title) &&
					item.viewIndex > 0 &&
					this.viewInstances[item.viewIndex]
				) {
					this.viewInstances[item.viewIndex].fabricCanvas.addElement("image", item.url, item.title, {
						replaceInAllViews: false,
						replace: params.replace,
					});
				}
			});
		} else {
			this.currentViewInstance.fabricCanvas.addElement("image", source, title, params);
		}
	}

	/**
	 * Toggle the responsive behavior.
	 *
	 * @method toggleResponsive
	 * @param {Boolean} [toggle] True or false.
	 * @returns {Boolean} Returns true or false.
	 */
	toggleResponsive(toggle) {
		toggle = toggle === undefined ? this.container.classList.contains("fpd-not-responsive") : toggle;

		toggleElemClasses(this.container, ["fpd-not-responsive"], !toggle);

		this.viewInstances.forEach((viewInst, viewIndex) => {
			viewInst.options.responsive = toggle;

			if (viewIndex == this.currentViewIndex) {
				viewInst.fabricCanvas.resetSize();
			}
		});

		return toggle;
	}

	/**
	 * Returns the current showing product with all views and elements in the views.
	 *
	 * @method getProduct
	 * @param {boolean} [onlyEditableElements=false] If true, only the editable elements will be returned.
	 * @param {boolean} [customizationRequired=false] To receive the product the user needs to customize the initial elements.
	 * @returns {array} An array with all views. A view is an object containing the title, thumbnail, custom options and elements. An element object contains the title, source, parameters and type.
	 */
	getProduct(onlyEditableElements = false, customizationRequired = false) {
		let customizationChecker = false,
			jsMethod = this.mainOptions.customizationRequiredRule == "all" ? "every" : "some";

		customizationChecker = this.viewInstances[jsMethod]((viewInst) => {
			return viewInst.fabricCanvas.isCustomized;
		});

		if (customizationRequired && !customizationChecker) {
			Snackbar(this.translator.getTranslation("misc", "customization_required_info"));
			return false;
		}

		this.deselectElement();
		this.currentViewInstance.fabricCanvas.resetZoom();

		this.doUnsavedAlert = false;

		//check if an element is out of his containment
		let product = [];

		this.getElements().forEach((element) => {
			if (element.isOut && element.boundingBoxMode === "inside" && !element.__editorMode) {
				Snackbar(element.title + ": " + this.translator.getTranslation("misc", "out_of_bounding_box"));

				product = false;
			}
		});

		//abort process
		if (product === false) {
			return false;
		}

		//add views
		this.viewInstances.forEach((viewInst, i) => {
			const viewObj = {
				title: viewInst.title,
				thumbnail: viewInst.thumbnail,
				elements: viewInst.fabricCanvas.getElementsJSON(onlyEditableElements),
				options: viewInst.options,
				names_numbers: viewInst.names_numbers,
				mask: viewInst.mask,
				locked: viewInst.locked,
			};
			if (i == 0 && this.productViews[0].hasOwnProperty("productTitle")) {
				viewObj.productTitle = this.productViews[0].productTitle;
			}

			product.push(viewObj);
		});

		//returns an array with all views
		return product;
	}

	/**
	 * Creates all views in one data URL. The different views will be positioned below each other.
	 *
	 * @method getProductDataURL
	 * @param {Function} callback A function that will be called when the data URL is created. The function receives the data URL.
	 * @param {Object} [options] See {@link FancyProductDesignerView#toDataURL}.
	 * @param {Array} [viewRange=[]] An array defining the start and the end indexes of the exported views. When not defined, all views will be exported.
	 * @example fpd.getProductDataURL( function(dataURL){} );
	 */
	getProductDataURL(callback = () => {}, options = {}, viewRange = []) {
		options.onlyExportable = options.onlyExportable === undefined ? false : options.onlyExportable;
		options.enableRetinaScaling = options.enableRetinaScaling === undefined ? false : options.enableRetinaScaling;
		options.watermarkImg = this.watermarkImg;

		if (this.viewInstances.length === 0) {
			callback("");
			return;
		}

		this.currentViewInstance.fabricCanvas.resetZoom();

		//create hidden canvas
		const hiddenCanvas = document.createElement("canvas");

		let printCanvas = new fabric.Canvas(hiddenCanvas, {
				containerClass: "fpd-hidden fpd-hidden-canvas",
				enableRetinaScaling: false,
			}),
			viewCount = 0,
			multiplier = options.multiplier ? options.multiplier : 1,
			targetViews =
				viewRange.length == 2 ? this.viewInstances.slice(viewRange[0], viewRange[1]) : this.viewInstances;

		const _addCanvasImage = (viewInst) => {
			viewInst.toDataURL((dataURL) => {
				fabric.Image.fromURL(
					dataURL,
					(img) => {
						printCanvas.add(img);

						if (viewCount > 0) {
							img.set("top", printCanvas.getHeight());
							printCanvas.setDimensions({
								height: printCanvas.getHeight() + viewInst.options.stageHeight * multiplier,
							});
						}

						viewCount++;
						if (viewCount < targetViews.length) {
							_addCanvasImage(targetViews[viewCount]);
						} else {
							delete options["multiplier"];

							setTimeout(function () {
								callback(printCanvas.toDataURL(options));
								printCanvas.dispose();

								if (this.currentViewInstance) {
									this.currentViewInstance.fabricCanvas.resetSize();
								}
							}, 100);
						}
					},
					{ crossOrigin: "anonymous" }
				);
			}, options);

			if (viewInst.options.stageWidth * multiplier > printCanvas.getWidth()) {
				printCanvas.setDimensions({ width: viewInst.options.stageWidth * multiplier });
			}
		};

		const firstView = targetViews[0];
		printCanvas.setDimensions({
			width: firstView.options.stageWidth * multiplier,
			height: firstView.options.stageHeight * multiplier,
		});
		_addCanvasImage(firstView);
	}

	/**
	 * Gets the views as data URL.
	 *
	 * @method getViewsDataURL
	 * @param {Function} callback A function that will be called when the data URL is created. The function receives the data URL.
	 * @param {string} [options] See {@link FancyProductDesignerView#toDataURL}.
	 * @returns {array} An array with all views as data URLs.
	 */
	getViewsDataURL(callback = () => {}, options = {}) {
		options.watermarkImg = this.watermarkImg;

		let dataURLs = [];

		this.currentViewInstance.fabricCanvas.resetZoom();
		for (var i = 0; i < this.viewInstances.length; ++i) {
			this.viewInstances[i].toDataURL((dataURL) => {
				dataURLs.push(dataURL);

				if (dataURLs.length === this.viewInstances.length) {
					callback(dataURLs);
				}
			}, options);
		}
	}

	/**
	 * Opens the current showing product in a Pop-up window and shows the print dialog.
	 *
	 * @method print
	 */
	print() {
		const _createPopupImage = (dataURLs) => {
			let images = [],
				imageLoop = 0;

			//load all images first
			for (var i = 0; i < dataURLs.length; ++i) {
				let image = new Image();
				image.src = dataURLs[i];
				image.onload = () => {
					images.push(image);
					imageLoop++;

					//add images to popup and print popup
					if (imageLoop == dataURLs.length) {
						const popup = window.open(
							"",
							"",
							"width=" +
								images[0].width +
								",height=" +
								images[0].height * dataURLs.length +
								",location=no,menubar=no,scrollbars=yes,status=no,toolbar=no"
						);
						popupBlockerAlert(popup, this.translator.getTranslation("misc", "popup_blocker_alert"));

						popup.document.title = "Print Image";
						for (var j = 0; j < images.length; ++j) {
							popup.document.body.append(images[j]);
						}

						setTimeout(() => {
							popup.print();
						}, 1000);
					}
				};
			}
		};

		this.getViewsDataURL(_createPopupImage);
	}

	/**
	 * Get all fonts used in the product.
	 *
	 * @method getUsedFonts
	 * @returns {array} An array with objects containing the font name and optional the URL to the font.
	 */
	getUsedFonts() {
		let _usedFonts = [], //temp to check if already included
			usedFonts = [];

		this.getElements(-1, "all", false).forEach((element) => {
			if (element.getType() === "text") {
				if (_usedFonts.indexOf(element.fontFamily) === -1) {
					var fontObj = { name: element.fontFamily },
						result = this.mainOptions.fonts.find((e) => e.name == element.fontFamily);

					//check if result contains props and url prop
					if (result) {
						if (result.url) {
							fontObj.url = result.url;
						}

						if (result.variants) {
							Object.keys(result.variants).forEach((key) => {
								var fontName = element.fontFamily;
								//bold
								if (key == "n7") {
									fontName += " Bold";
								}
								//italic
								else if (key == "i4") {
									fontName += " Italic";
								}
								//bold-italic
								else if (key == "i7") {
									fontName += " Bold Italic";
								}

								_usedFonts.push(fontName);
								usedFonts.push({ name: fontName, url: result.variants[key] });
							});
						}
					}

					_usedFonts.push(element.fontFamily);
					usedFonts.push(fontObj);
				}
			}
		});

		return usedFonts;
	}

	/**
	 * Returns the views as SVG.
	 *
	 * @param {Object} options See {@link FancyProductDesignerView#toSVG}.
	 * @returns {array} An array with all views as SVG.
	 */
	getViewsSVG(options) {
		let SVGs = [];

		for (var i = 0; i < this.viewInstances.length; ++i) {
			SVGs.push(this.viewInstances[i].toSVG(options, this.getUsedFonts()));
		}

		return SVGs;
	}

	/**
	 * Get all used colors from a single or all views.
	 *
	 * @param {Number} [viewIndex=-1] The index of the target view. By default all views are target.
	 * @returns {array} An array with hexdecimal color values.
	 */
	getUsedColors(viewIndex = -1) {
		var usedColors = [];
		this.getElements(viewIndex, "all", false).forEach((element) => {
			const type = element.isColorizable();

			if (type) {
				if (type === "svg") {
					if (element.type === "group") {
						element.getObjects().forEach((path) => {
							if (tinycolor(path.fill).isValid()) {
								usedColors.push(tinycolor(path.fill).toHexString());
							}
						});
					} else {
						//single path

						if (tinycolor(element.fill).isValid()) {
							usedColors.push(tinycolor(element.fill).toHexString());
						}
					}
				} else {
					if (tinycolor(element.fill).isValid()) {
						usedColors.push(tinycolor(element.fill).toHexString());
					}
				}
			}
		});

		return arrayUnique(usedColors);
	}

	/**
	 * Removes a view by index. If no viewIndex is set, it will remove the first view.
	 *
	 * @method removeView
	 * @param {Number} [viewIndex=0] The index of the target view.
	 */
	removeView(viewIndex = 0) {
		const viewInst = this.viewInstances[viewIndex];

		viewInst.fabricCanvas.wrapperEl.remove();
		this.viewInstances.splice(viewIndex, 1);

		//select next view if removing view is showing
		if (this.viewInstances.length > 0) {
			viewIndex == this.currentViewIndex ? this.selectView(0) : this.selectView(viewIndex);
		}

		/**
		 * Gets fired when a view is removed.
		 *
		 * @event viewRemove
		 * @param {Event} event
		 */
		fireEvent(this, "viewRemove", {
			viewIndex: viewIndex,
		});

		this.calculatePrice();
	}

	/**
	 * Sets the order quantity.
	 *
	 * @method setOrderQuantity
	 * @param {Number} quantity The width in pixel.
	 */
	setOrderQuantity(quantity = 1) {
		quantity = quantity == "" || quantity < 0 ? 1 : quantity;
		this.orderQuantity = quantity;

		this.calculatePrice();
	}

	/**
	 * Returns an order object containing the product from the getProduct() method, usedFonts from getUsedFonts() and usedColors from getUsedColors().
	 *
	 * @method getOrder
	 * @param {Object} [options={}] Options for the methods that are called inside this mehtod, e.g. getProduct() can receive two parameters.
	 * @returns {object} An object containing different objects representing important order data.
	 * @example
	 * // includes only editable elements and the user needs to customize the initial product
	 * fpd.getOrder( {onlyEditableElements: true, customizationRequired: true} );
	 */
	getOrder(options = {}) {
		this._order.product = this.getProduct(options.onlyEditableElements, options.customizationRequired);

		this._order.usedFonts = this.getUsedFonts();
		this._order.usedColors = [];

		this.getUsedColors().forEach((hexValue) => {
			let colorName = this.mainOptions.hexNames[hexValue.replace("#", "").toLowerCase()],
				colorItem = { hex: hexValue };

			if (colorName) {
				colorItem.name = colorName;
			}

			this._order.usedColors.push(colorItem);
		});

		/**
		 * Gets fired before the data of getOrder is returned. Useful to manipulate order data.
		 *
		 * @event getOrder
		 * @param {Event} event
		 */
		fireEvent(this, "getOrder", {});

		return this._order;
	}

	/**
	 * Generates an object that will be used for the print-ready export. This objects includes the used fonts and the SVG data strings to generate the PDF.
	 *
	 * @method getPrintOrderData
	 */
	getPrintOrderData(includeSVGData = true) {
		let printOrderData = {
			used_fonts: this.getUsedFonts(),
			svg_data: [],
			custom_images: [],
		};

		if (includeSVGData) {
			this.viewInstances.forEach((viewInst) => {
				printOrderData.svg_data.push({
					svg: viewInst.toSVG({ respectPrintingBox: true }),
					output: viewInst.options.output,
				});
			});
		}

		this.getCustomElements("image").forEach((img) => {
			if (!printOrderData.custom_images.includes(img.element.source))
				printOrderData.custom_images.push(img.element.source);
		});

		return printOrderData;
	}

	#calculateViewsPrice() {
		this.currentPrice = this.singleProductPrice = 0;

		//calulate total price of all views
		this.viewInstances.forEach((viewInst) => {
			if (!viewInst.locked) {
				this.singleProductPrice += viewInst.truePrice;
			}
		});
	}

	/**
	 * Calculates the total price considering the elements price in all views and pricing rules.
	 *
	 * @method calculatePrice
	 * @param {Boolean} [considerQuantity=true] Calculate with or without quantity.
	 * @param {Boolean} [triggerEvent=true] Trigger the priceChange event.
	 * @returns {Number} The calculated price.
	 */
	calculatePrice(considerQuantity = true, triggerEvent = true) {
		this.#calculateViewsPrice();

		this.currentPrice;

		let calculatedPrice = this.singleProductPrice;
		this.currentPrice = calculatedPrice;

		calculatedPrice += this.pricingRulesPrice;

		if (considerQuantity) {
			calculatedPrice *= this.orderQuantity;
		}

		//price has decimals, set max. decimals to 2
		if (calculatedPrice % 1 != 0) {
			calculatedPrice = Number(calculatedPrice.toFixed(2));
		}

		this.currentPrice = calculatedPrice;

		if (triggerEvent) {
			/**
			 * Gets fired as soon as the price changes in a view.
			 *
			 * @event priceChange
			 * @param {Event} event
			 */
			fireEvent(this, "priceChange");
		}

		return this.currentPrice;
	}

	formatPrice(price) {
		return formatPrice(price, this.mainOptions.priceFormat);
	}

	getFileServerURL() {
		let fileServerURL = new URL(this.mainOptions.fileServerURL);

		if (objectGet(this.viewInstances[0].options, "industry.type") == "engraving") {
			if (objectGet(this.viewInstances[0].options, "industry.opts.negative"))
				fileServerURL.searchParams.set("filter", "threshold_negative");
			else fileServerURL.searchParams.set("filter", "threshold");
		}

		return fileServerURL.href;
	}
};

window.FancyProductDesigner = FancyProductDesigner$1;
window.FPDEmojisRegex =
	/(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F/g;

export { FancyProductDesigner$1 as default };
