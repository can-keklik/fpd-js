import html from '../../html/modules/facebook-images.html?raw';

class FacebookImagesView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-module-facebook-images', FacebookImagesView );