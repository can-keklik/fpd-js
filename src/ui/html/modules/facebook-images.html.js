export default (
`<div class="fpd-head">
    <div class="fpd-facebook-login">
        <fb:login-button 
            data-max-rows="1" 
            data-show-faces="false" 
            data-scope="user_photos">
        </fb:login-button>
    </div>
    <fpd-dropdown
        class="fpd-facebook-albums"
        placeholder="Select An Album" 
        searchable
    ></fpd-dropdown>
</div>
<div class="fpd-scroll-area">
    <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div>
</div>`)