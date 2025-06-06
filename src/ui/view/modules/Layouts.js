import html from '../../html/modules/layouts.html.js';

class LayoutsView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-module-layouts', LayoutsView );