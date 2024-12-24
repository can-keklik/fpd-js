import html from '../html/actions-bar.html?raw';

class ActionsBar extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html; 
        
    }

}

customElements.define( 'fpd-actions-bar', ActionsBar );