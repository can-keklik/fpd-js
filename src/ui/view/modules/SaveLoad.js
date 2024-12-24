import html from '../../html/modules/save-load.html?raw';

class SaveLoadView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-module-save-load', SaveLoadView );