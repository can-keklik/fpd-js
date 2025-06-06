import html from '../../html/modules/designs.html.js';

class DesignsView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-module-designs', DesignsView );