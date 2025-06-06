import html from '../html/views-nav.html.js';

class ViewsNav extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-views-nav', ViewsNav );