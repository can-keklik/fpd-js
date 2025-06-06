import html from '../html/main-wrapper.html.js';

class MainWrapper extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html; 
        
    }

}

customElements.define( 'fpd-main-wrapper', MainWrapper );