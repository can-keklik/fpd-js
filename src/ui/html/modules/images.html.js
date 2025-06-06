export default (
`<div data-moduleicon="fpd-icon-images" data-defaulttext="Add Image" data-title="modules.images">

    <div class="fpd-module-tabs">
        <div data-context="upload" class="fpd-active fpd-tooltip" data-defaulttext="Uploads" title="modules.uploads">
            <span class="fpd-icon-cloud-upload"></span>
        </div>
        <div data-context="facebook" class="fpd-hidden fpd-tooltip" aria-label="Facebook">
             <span class="fpd-icon-facebook"></span>
        </div>
        <div data-context="instagram" class="fpd-hidden fpd-tooltip" aria-label="Instagram">
             <span class="fpd-icon-instagram"></span>
        </div>
        <div data-context="pixabay" class="fpd-hidden fpd-tooltip" aria-label="Pixabay">
             <span class="fpd-icon-pixabay"></span>
        </div>
        <div data-context="qr-code" class="fpd-tooltip" data-defaulttext="QR-Code" title="actions.qr_code">
            <span class="fpd-icon-qrcode"></span>
       </div>
       <div data-context="text2Img" class="fpd-hidden fpd-tooltip" data-defaulttext="Text to Images" title="modules.text_to_images">
        <span class="fpd-icon-ai"></span>
   </div>
    </div>

    <div class="fpd-module-tabs-content">
        <div data-context="upload" class="fpd-active"></div>
        <div data-context="facebook"></div>
        <div data-context="instagram"></div>
        <div data-context="pixabay"></div>
        <div data-context="qr-code"></div>
        <div data-context="text2Img"></div>
    </div>

</div>`)