import html from '../../html/modules/layouts.html?raw';

class LayoutsView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-module-layouts', LayoutsView );