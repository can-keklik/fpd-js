export default (
`<div data-moduleicon="fpd-icon-brush" data-defaulttext="Free Drawing" data-title="plus.drawing">
    <div class="fpd-drawing-panel fpd-padding">
        <div class="fpd-scroll-area">

            <div class="fpd-drawing-tools">
                <div class="fpd-label" data-defaulttext="Brush Type">plus.drawing_brush_type</div>
                <div class="fpd-drawing-brush-type fpd-dropdown">
                    <span class="fpd-dropdown-current" title="">
                        <span data-value="pencil" data-defaulttext="Pencil">plus.drawing_pencil</span>
                    </span>
                    <div class="fpd-dropdown-arrow"><span class="fpd-icon-arrow-dropdown"></span></div>
                    <div class="fpd-dropdown-list">
                        <span class="fpd-item" data-value="Pencil" data-defaulttext="Pencil">plus.drawing_pencil</span>
                        <span class="fpd-item" data-value="Circle" data-defaulttext="Cirlce">plus.drawing_circle</span>
                        <span class="fpd-item" data-value="Spray" data-defaulttext="Spray">plus.drawing_spray</span>
                    </div>
                </div>

                <div class="fpd-label" data-defaulttext="Color">plus.drawing_color</div>
                <div>
                    <input type="text" value="" class="fpd-drawing-line-color" />
                </div>

                <div class="fpd-label" data-defaulttext="Line Width">plus.drawing_line_width</div>
                <div class="fpd-slider-group fpd-clearfix">
                    <div class="fpd-range-wrapper">
                         <input class="fpd-slider-range" type="range" value="1" step="1" min="1" max="30" />
                    </div>
                     <input class="fpd-slider-number fpd-number fpd-drawing-line-width" type="number" value="1" step="1" min="1" max="30" />
                </div>

                <div class="fpd-label" data-defaulttext="Draw Here">plus.drawing_draw_here</div>
                <canvas class="fpd-drawing-canvas" width="100" height="150"></canvas>

                <div class="fpd-buttons fpd-clearfix">
                    <span class="fpd-clear-drawing fpd-btn fpd-left fpd-secondary" data-defaulttext="Clear Drawing">plus.drawing_clear</span>
                    <span class="fpd-add-drawing fpd-btn fpd-right" data-defaulttext="Add Drawing">plus.drawing_add</span>
                </div>
            </div>

        </div>
    </div>
</div>`)