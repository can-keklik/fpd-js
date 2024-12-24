import html from '../../html/modules/uploads.html?raw';

class UploadsView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-module-uploads', UploadsView );