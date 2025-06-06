import html from '../html/views-grid.html.js';

class ViewsGrid extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-views-grid', ViewsGrid );