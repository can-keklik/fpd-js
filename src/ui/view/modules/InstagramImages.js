import html from '../../html/modules/instagram-images.html?raw';

class InstagramImagesView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-module-instagram-images', InstagramImagesView );