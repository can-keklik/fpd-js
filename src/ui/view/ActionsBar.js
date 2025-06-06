import html from '../html/actions-bar.html.js';

class ActionsBar extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html; 
        
    }

}

customElements.define( 'fpd-actions-bar', ActionsBar );