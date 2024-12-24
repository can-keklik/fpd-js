import html from '../html/main-wrapper.html?raw';

class MainWrapper extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html; 
        
    }

}

customElements.define( 'fpd-main-wrapper', MainWrapper );