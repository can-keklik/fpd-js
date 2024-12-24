import html from '../html/views-nav.html?raw';

class ViewsNav extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-views-nav', ViewsNav );