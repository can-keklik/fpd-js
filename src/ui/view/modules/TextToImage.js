import html from '../../html/modules/text-to-image.html?raw';

class TextToImageView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-module-text-to-image', TextToImageView );