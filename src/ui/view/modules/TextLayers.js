import html from '../../html/modules/text-layers.html.js';

class TextLayersView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-module-text-layers', TextLayersView );