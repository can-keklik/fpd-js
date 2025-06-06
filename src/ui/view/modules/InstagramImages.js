import html from '../../html/modules/instagram-images.html.js';

class InstagramImagesView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-module-instagram-images', InstagramImagesView );