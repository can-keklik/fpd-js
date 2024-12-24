import html from '../../html/modules/qr-code.html?raw';

class QRCodeView extends HTMLElement {
    
    constructor() {
        
        super();
                
    }

    connectedCallback() {
        
        this.innerHTML = html;
        
    }

}

customElements.define( 'fpd-module-qr-code', QRCodeView );