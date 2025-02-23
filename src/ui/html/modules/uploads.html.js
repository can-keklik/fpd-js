export default (
`<div class="fpd-upload-image">
    <span data-defaulttext="Drop images here">modules.upload_zone</span>
    <span class="fpd-btn" data-defaulttext="Browse File">modules.browse_file</span>
    <span class="fpd-price"></span>
</div>
<input 
    type="file" 
    multiple="multiple" 
    class="fpd-upload-input fpd-hidden" 
    name="files[]" 
    accept="image/jpeg,image/jpg,image/png,image/svg+xml,application/pdf" 
/>
<div class="fpd-scroll-area">
    <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div>
</div>`)