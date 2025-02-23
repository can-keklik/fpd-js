export default (
`<div class="fpd-head">
    <span class="fpd-btn fpd-add-blank fpd-hidden" data-defaulttext="Add Blank Page">misc.dynamic_views_add_blank</span>
    <span class="fpd-btn fpd-add-layout" data-defaulttext="Add Page from Layouts">misc.dynamic_views_add_from_layouts</span>
    <div class="fpd-close">
        <span class="fpd-icon-close"></span>
    </div>
</div>
<div class="fpd-scroll-area">
    <div class="fpd-grid"></div>
</div>
<div class="fpd-blank-page-modal fpd-shadow-1 fpd-hidden">
    <div class="fpd-head">
        <label class="fpd-input">
            <span data-defaulttext="Width">misc.dynamic_views_width</span>
            <input type="number" min="1" step="1" data-type="width" class="fpd-tooltip">
        </label>
        <label class="fpd-input">
            <span data-defaulttext="Height">misc.dynamic_views_height</span>
            <input type="number" min="1" step="1" data-type="height" class="fpd-tooltip">
        </label>
        <span class="fpd-btn" data-defaulttext="Add Page">misc.dynamic_views_add_view</span>
        <div class="fpd-close">
            <span class="fpd-icon-close"></span>
        </div>
    </div>
    <div class="fpd-scroll-area">
        <div class="fpd-grid"></div>
    </div>
</div>
<div class="fpd-layouts-modal fpd-shadow-1 fpd-hidden">
    <div class="fpd-head">
        <div class="fpd-close">
            <span class="fpd-icon-close"></span>
        </div>
    </div>
    <div class="fpd-scroll-area">
        <div class="fpd-grid"></div>
    </div>
</div>`)
