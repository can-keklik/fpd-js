import html from '../html/mainbar.html.js';

class Mainbar extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html; 

    }

}

customElements.define( 'fpd-main-bar', Mainbar );