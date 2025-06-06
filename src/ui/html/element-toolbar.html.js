export default (
`<div class="fpd-close-sub-panel">
    <span class="fpd-icon-back"></span>
    <span class="fpd-label" data-defaulttext="Back">toolbar.sub_panel_back</span>
</div>

<div class="fpd-close">
    <span class="fpd-icon-close"></span>
</div>

<div class="fpd-tools-nav fpd-scroll-area">

    <div class="fpd-primary-tools">
        <div class="fpd-tool-color" data-panel="color">
            <span class="fpd-current-fill"></span>
            <span class="fpd-label" data-defaulttext="Color">toolbar.color</span>
        </div>
        <div class="fpd-tool-edit-text" data-panel="edit-text">
            <span class="fpd-icon-text-input"></span>
            <span class="fpd-label" data-defaulttext="Edit Text">toolbar.edit_text</span>
        </div>
        <div class="fpd-tool-text-size" data-panel="text-size">
            <input type="text" class="fpd-input">
            <span class="fpd-icon-font-size"></span>
            <span class="fpd-label" data-defaulttext="Size & Spacing">toolbar.text_size_spacing</span>
        </div>
        <div class="fpd-tool-font-family" data-panel="font-family">
            <fpd-dropdown placeholder=""></fpd-dropdown>
            <span class="fpd-icon-font"></span>
            <span class="fpd-label" data-defaulttext="Font">toolbar.font</span>
        </div>
    </div>

    <div class="fpd-secondary-tools fpd-scroll-area">
        <div class="fpd-tool-text-format" data-panel="text-format">
            <span class="fpd-icon-text-format"></span>
            <span class="fpd-label" data-defaulttext="Format">toolbar.text_format</span>
        </div>
        <div class="fpd-tool-transform" data-panel="transform">
            <span class="fpd-icon-transform"></span>
            <span class="fpd-label" data-defaulttext="Transform">toolbar.transform</span>
        </div>
        <div class="fpd-tool-position" data-panel="position">
            <span class="fpd-icon-position"></span>
            <span class="fpd-label" data-defaulttext="Position">toolbar.position</span>
        </div>
        
        <div class="fpd-tool-curved-text" data-panel="curved-text">
            <span class="fpd-icon-curved-text"></span>
            <span class="fpd-label" data-defaulttext="Curved Text">toolbar.curved_text</span>
        </div>
        <div class="fpd-tool-advanced-editing" data-panel="advanced-editing">
            <span class="fpd-icon-effects"></span>
            <span class="fpd-label" data-defaulttext="Edit Image">toolbar.advanced_editing</span>
        </div>
        <div class="fpd-tool-remove-bg">
            <span class="fpd-icon-remove-bg"></span>
            <span class="fpd-label" data-defaulttext="Remove Background">toolbar.remove_background</span>
        </div>
        <div class="fpd-tool-reset">
            <span class="fpd-icon-reset"></span>
            <span class="fpd-label" data-defaulttext="Reset">toolbar.reset</span>
        </div>
        <div class="fpd-tool-duplicate">
            <span class="fpd-icon-copy"></span>
            <span class="fpd-label" data-defaulttext="Duplicate">toolbar.duplicate</span>
        </div>
        <div class="fpd-tool-remove">
            <span class="fpd-icon-bin"></span>
            <span class="fpd-label" data-defaulttext="Remove">toolbar.remove</span>
        </div>
    </div>

</div>
<div class="fpd-sub-panel">

    <div class="fpd-panel-color">

        <div class="fpd-panel-tabs">
            <span data-tab="fill" data-defaulttext="Fill" class="fpd-active">toolbar.fill</span>
            <span data-tab="stroke" data-defaulttext="Stroke" class="fpd-tool-text-stroke">toolbar.stroke</span>
            <span data-tab="shadow" data-defaulttext="Shadow" class="fpd-tool-text-shadow">toolbar.shadow</span>
        </div>

        <div class="fpd-panel-tabs-content fpd-scroll-area">

            <div data-id="fill" class="fpd-active">

                <div class="fpd-color-wrapper"></div>

                <div class="fpd-tool-fill-opacity fpd-input">
                    <span class="fpd-label" data-defaulttext="Transparency">toolbar.transparency</span>
                    <fpd-range-slider 
                        class="fpd-progress"
                        value="1" 
                        step="0.01" 
                        min="0" 
                        max="1"
                        data-control="opacity"
                    ></fpd-range-slider>
                    <input 
                        class="fpd-slider-number fpd-number" 
                        type="number" 
                        value="1" 
                        step="0.01" 
                        min="0" 
                        max="1"
                        data-control="opacity" 
                    />
                </div>

            </div>

            <div data-id="stroke">

                <div class="fpd-stroke-color-wrapper"></div>
                
                <div class="fpd-tool-stroke-width fpd-input">
                    <span class="fpd-label" data-defaulttext="Stroke Width">toolbar.stroke_width</span>
                    <fpd-range-slider 
                        class="fpd-progress"
                        value="0" 
                        step="1" 
                        min="0" 
                        max="20"
                        data-control="strokeWidth"
                    ></fpd-range-slider>
                    <input 
                        class="fpd-slider-number fpd-number" 
                        type="number" 
                        value="0" 
                        step="1" 
                        min="0" 
                        max="20"
                        data-control="strokeWidth" 
                    />
                </div>

            </div>

            <div data-id="shadow">

                <div class="fpd-shadow-color-wrapper"></div>

                <div class="fpd-tool-shadow-blur fpd-input">
                    <span class="fpd-label" data-defaulttext="Blur">toolbar.shadow_blur</span>
                    <fpd-range-slider 
                        class="fpd-progress"
                        value="0" 
                        step="1" 
                        min="0" 
                        max="200"
                        data-control="shadowBlur"
                    ></fpd-range-slider>
                    <input 
                        class="fpd-slider-number fpd-number" 
                        type="number" 
                        value="0" 
                        step="1" 
                        min="0" 
                        max="200"
                        data-control="shadowBlur" 
                    />
                </div>

                <div class="fpd-tool-shadow-offsetX fpd-input">
                    <span class="fpd-label" data-defaulttext="Offset X">toolbar.shadow_offset_x</span>
                    <fpd-range-slider 
                        class="fpd-progress"
                        value="0" 
                        step="1" 
                        min="-100" 
                        max="100"
                        data-control="shadowOffsetX"
                    ></fpd-range-slider>
                    <input 
                        class="fpd-slider-number fpd-number" 
                        type="number" 
                        value="0" 
                        step="1" 
                        min="-100" 
                        max="100"
                        data-control="shadowOffsetX" 
                    />
                </div>

                <div class="fpd-tool-shadow-offsetY fpd-input">
                    <span class="fpd-label" data-defaulttext="Offset Y">toolbar.shadow_offset_y</span>
                    <fpd-range-slider 
                        class="fpd-progress"
                        value="0" 
                        step="1" 
                        min="-100" 
                        max="100"
                        data-control="shadowOffsetY"
                    ></fpd-range-slider>
                    <input 
                        class="fpd-slider-number fpd-number" 
                        type="number" 
                        value="0" 
                        step="1" 
                        min="-100" 
                        max="100"
                        data-control="shadowOffsetY" 
                    />
                </div>

                <div class="fpd-btn fpd-secondary fpd-remove-shadow" data-defaulttext="Remove Shadow">toolbar.remove_shadow</div>

            </div>

        </div>

    </div><!-- Fill Panel -->

    <div class="fpd-panel-edit-text fpd-padding">

        <textarea data-control="text"></textarea>

    </div><!-- Edit-Text Panel -->

    <div class="fpd-panel-text-size fpd-padding">
        <div class="fpd-tool-text-size fpd-input">
            <span class="fpd-label" data-defaulttext="Font Size">toolbar.font_size</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="12" 
                step="1" 
                min="1" 
                max="200"
                data-control="fontSize"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="12" 
                step="1" 
                min="1" 
                max="200"
                data-control="fontSize" 
            />
        </div>
        <div class="fpd-tool-text-line-spacing fpd-input">
            <span class="fpd-label" data-defaulttext="Line Spacing">toolbar.line_spacing</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="1" 
                step="0.1" 
                min="-2" 
                max="3"
                data-control="lineHeight"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="1" 
                step="0.1" 
                min="-2" 
                max="3"
                data-control="lineHeight" 
            />
        </div>
        <div class="fpd-tool-text-letter-spacing fpd-input">
            <span class="fpd-label" data-defaulttext="Letter Spacing">toolbar.letter_spacing</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="0" 
                step="1" 
                min="-30" 
                max="30"
                data-control="letterSpacing"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="0" 
                step="1" 
                min="-30" 
                max="30"
                data-control="letterSpacing" 
            />
        </div>
    </div><!-- Text-Size & Spacing Panel -->

    <div class="fpd-panel-text-format fpd-padding">

        <div class="fpd-tools-group">

            <div class="fpd-tool-text-bold fpd-toggle" data-defaulttext="Bold" data-control="fontWeight"
                data-enabled="bold" data-disabled="normal" title="toolbar.bold">
                <span class="fpd-icon-format-bold"></span>
            </div>
            <div class="fpd-tool-text-italic fpd-toggle" data-defaulttext="Italic" data-control="fontStyle"
                data-enabled="italic" data-disabled="normal" title="toolbar.italic">
                <span class="fpd-icon-format-italic"></span>
            </div>
            <div class="fpd-tool-text-underline fpd-toggle" data-defaulttext="Underline"
                data-control="textDecoration" data-enabled="underline" data-disabled="normal" title="toolbar.underline">
                <span class="fpd-icon-format-underline"></span>
            </div>
            <div class="fpd-tool-text-transform fpd-btn-options" data-control="textTransform"
                data-options='{"none": "fpd-icon-text-transform", "uppercase": "fpd-icon-uppercase", "lowercase": "fpd-icon-lowercase"}'
                data-defaulttext="Text Transform" title="toolbar.text_transform">
                <span class="fpd-icon-text-transform"></span>
            </div>

        </div>
        <div class="fpd-tool-text-align fpd-btn-group" data-control="textAlign">
            <span class="fpd-icon-format-align-left" data-option="left"></span>
            <span class="fpd-icon-format-align-center" data-option="center"></span>
            <span class="fpd-icon-format-align-right" data-option="right"></span>
            <span class="fpd-icon-format-align-justify" data-option="justify"></span>
        </div>

    </div><!-- Text-Format Panel -->

    <div class="fpd-panel-font-family fpd-padding" data-control="fontFamily">
        <input type="text" data-defaulttext="Search Fonts" placeholder="toolbar.font_family_search" />
        <div class="fpd-scroll-area">
            <div class="fpd-fonts-list"></div>
        </div>
    </div><!-- Font Panel -->

    <div class="fpd-panel-curved-text fpd-padding">

        <div class="fpd-curved-options">
            <span data-value="normal">
                <svg width="48" height="14" viewBox="0 0 48 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.04787 13.327H0L4.60146 0.673004H6.83039L11.4318 13.327H9.38398L5.76899 2.97148H5.6691L2.04787 13.327ZM2.39126 8.37167H9.03434V9.97814H2.39126V8.37167Z" fill="#485563"/>
                    <path d="M13.2784 13.327V0.673004H17.961C18.8684 0.673004 19.6197 0.821293 20.2149 1.11787C20.8101 1.41033 21.2555 1.80783 21.551 2.31036C21.8465 2.80878 21.9943 3.37104 21.9943 3.99715C21.9943 4.5244 21.8965 4.96926 21.7008 5.33175C21.5052 5.69011 21.243 5.97845 20.9142 6.19677C20.5895 6.41096 20.2315 6.56749 19.8403 6.66635V6.78992C20.2648 6.81052 20.679 6.94645 21.0827 7.19772C21.4906 7.44487 21.8278 7.79705 22.0942 8.25428C22.3606 8.7115 22.4938 9.26759 22.4938 9.92253C22.4938 10.5692 22.3398 11.15 22.0317 11.6649C21.7279 12.1757 21.2575 12.5814 20.6207 12.8821C19.9839 13.1787 19.1701 13.327 18.1795 13.327H13.2784ZM15.2076 11.6896H17.9922C18.9162 11.6896 19.578 11.5125 19.9776 11.1583C20.3772 10.804 20.577 10.3612 20.577 9.82985C20.577 9.43029 20.475 9.06369 20.2711 8.73004C20.0671 8.39639 19.7758 8.1307 19.397 7.93298C19.0224 7.73527 18.577 7.63641 18.0609 7.63641H15.2076V11.6896ZM15.2076 6.14734H17.7924C18.2253 6.14734 18.6145 6.06496 18.9599 5.90019C19.3096 5.73542 19.5864 5.50475 19.7903 5.20817C19.9984 4.90748 20.1025 4.55323 20.1025 4.14544C20.1025 3.62231 19.9173 3.18362 19.5468 2.82937C19.1764 2.47513 18.6082 2.298 17.8424 2.298H15.2076V6.14734Z" fill="#485563"/>
                    <path d="M35.4022 4.78802H33.4542C33.3793 4.37611 33.2399 4.01362 33.0359 3.70057C32.8319 3.38752 32.5822 3.12183 32.2867 2.90352C31.9912 2.6852 31.6602 2.52044 31.294 2.40922C30.9318 2.298 30.5468 2.2424 30.1389 2.2424C29.4022 2.2424 28.7425 2.4257 28.1597 2.7923C27.5812 3.1589 27.1233 3.69645 26.7862 4.40494C26.4532 5.11343 26.2867 5.97845 26.2867 7C26.2867 8.02979 26.4532 8.89892 26.7862 9.60741C27.1233 10.3159 27.5832 10.8514 28.166 11.2139C28.7487 11.5764 29.4043 11.7576 30.1327 11.7576C30.5364 11.7576 30.9194 11.7041 31.2815 11.597C31.6478 11.4857 31.9787 11.323 32.2742 11.1088C32.5697 10.8946 32.8195 10.6331 33.0234 10.3241C33.2315 10.0111 33.3751 9.65273 33.4542 9.24905L35.4022 9.25523C35.2981 9.87722 35.0963 10.4498 34.7966 10.9729C34.501 11.4919 34.1202 11.9409 33.654 12.3199C33.192 12.6947 32.6634 12.9851 32.0682 13.1911C31.4729 13.397 30.8236 13.5 30.1202 13.5C29.013 13.5 28.0265 13.2405 27.1608 12.7215C26.295 12.1984 25.6124 11.4507 25.1129 10.4786C24.6176 9.5065 24.3699 8.34696 24.3699 7C24.3699 5.64892 24.6197 4.48939 25.1191 3.52139C25.6186 2.54927 26.3012 1.80371 27.167 1.2847C28.0328 0.761565 29.0172 0.5 30.1202 0.5C30.7986 0.5 31.4313 0.5968 32.0182 0.7904C32.6093 0.97988 33.14 1.25998 33.6103 1.6307C34.0806 1.99731 34.4698 2.44629 34.7778 2.97766C35.0858 3.50491 35.294 4.10837 35.4022 4.78802Z" fill="#485563"/>
                    <path d="M41.8502 13.327H37.7107V0.673004H41.9813C43.2341 0.673004 44.3101 0.926331 45.2092 1.43299C46.1082 1.93552 46.7971 2.65843 47.2758 3.60171C47.7586 4.54087 48 5.66746 48 6.98146C48 8.29959 47.7565 9.43235 47.2695 10.3798C46.7867 11.3272 46.0874 12.0562 45.1717 12.567C44.256 13.0737 43.1488 13.327 41.8502 13.327ZM39.64 11.6587H41.744C42.718 11.6587 43.5276 11.4775 44.1727 11.115C44.8179 10.7484 45.3007 10.2191 45.6212 9.52709C45.9417 8.83096 46.102 7.98241 46.102 6.98146C46.102 5.98875 45.9417 5.14639 45.6212 4.45437C45.3049 3.76236 44.8325 3.23717 44.204 2.8788C43.5754 2.52044 42.795 2.34125 41.8626 2.34125H39.64V11.6587Z" fill="#485563"/>
                </svg>
            </span>
            <span data-value="curved">
                <svg width="60" height="26" viewBox="0 0 60 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.30362 19.2601L2.8934 20.2466L0 9.08293L1.5349 8.00919L10.7657 14.7396L9.35546 15.7261L1.90512 10.1456L1.83632 10.1938L4.30362 19.2601ZM2.16616 15.591L6.74076 12.3909L7.51036 13.5267L2.93577 16.7269L2.16616 15.591Z" fill="#485563"/>
                    <path d="M17.9225 11.7765L15.7371 1.14353L19.5693 0.330317C20.3119 0.172734 20.9524 0.166864 21.4907 0.312707C22.0283 0.455088 22.4615 0.711755 22.7901 1.08271C23.1181 1.4502 23.3361 1.897 23.4442 2.42311C23.5353 2.86615 23.5321 3.25695 23.4346 3.59552C23.3364 3.93062 23.1716 4.21845 22.9401 4.459C22.7114 4.69537 22.4455 4.88907 22.1424 5.04008L22.1637 5.14392C22.5147 5.0875 22.8772 5.1298 23.251 5.27081C23.6275 5.40765 23.9642 5.64504 24.2612 5.98298C24.5582 6.32091 24.7632 6.76505 24.8763 7.31539C24.988 7.85881 24.9623 8.37359 24.7991 8.85974C24.6387 9.34171 24.3238 9.76433 23.8546 10.1276C23.3846 10.4874 22.7443 10.7533 21.9336 10.9254L17.9225 11.7765ZM19.2186 10.0656L21.4975 9.58204C22.2537 9.42157 22.7648 9.1578 23.0306 8.79074C23.2964 8.42367 23.3835 8.01689 23.2917 7.57039C23.2227 7.23465 23.0759 6.9443 22.8514 6.69936C22.6268 6.45442 22.3425 6.28177 21.9984 6.18141C21.6576 6.08032 21.2761 6.0746 20.8537 6.16423L18.5186 6.65975L19.2186 10.0656ZM18.2614 5.4085L20.3768 4.95961C20.7311 4.88443 21.0353 4.74762 21.2896 4.54917C21.5473 4.35 21.734 4.1081 21.8497 3.82347C21.9681 3.53466 21.9921 3.21892 21.9216 2.87625C21.8313 2.43667 21.6039 2.10021 21.2396 1.86688C20.8752 1.63355 20.3797 1.58338 19.7529 1.71639L17.5966 2.17395L18.2614 5.4085Z" fill="#485563"/>
                    <path d="M43.1012 4.5657L41.5023 4.25126C41.5069 3.89201 41.4506 3.56401 41.3335 3.26726C41.2163 2.9705 41.054 2.70627 40.8464 2.47458C40.6389 2.24288 40.3938 2.05061 40.111 1.89775C39.8316 1.74557 39.5245 1.63655 39.1897 1.57071C38.5849 1.45179 38.014 1.49978 37.4768 1.71468C36.9431 1.93025 36.481 2.30938 36.0905 2.85206C35.7035 3.39541 35.428 4.09755 35.264 4.95849C35.0987 5.82637 35.0958 6.58574 35.2554 7.23659C35.4184 7.88811 35.71 8.41365 36.1301 8.81321C36.5502 9.21276 37.0592 9.47133 37.6571 9.58891C37.9885 9.65408 38.3114 9.67076 38.6258 9.63896C38.9443 9.60435 39.2421 9.52064 39.519 9.38783C39.796 9.25501 40.043 9.07488 40.26 8.84744C40.481 8.6172 40.6564 8.33836 40.7861 8.01091L42.3841 8.33056C42.1988 8.83796 41.9412 9.28792 41.6112 9.68042C41.2854 10.0701 40.9007 10.3871 40.4572 10.6312C40.0178 10.8725 39.5373 11.0319 39.0157 11.1094C38.494 11.1869 37.9445 11.1689 37.3671 11.0553C36.4584 10.8766 35.6903 10.4987 35.063 9.92152C34.4363 9.34089 33.996 8.60062 33.7421 7.70072C33.4916 6.80149 33.4745 5.78428 33.6907 4.64909C33.9076 3.51043 34.2987 2.57351 34.8641 1.83833C35.4301 1.09968 36.1101 0.581522 36.904 0.283862C37.6986 -0.0172703 38.5486 -0.0788126 39.454 0.0992351C40.0109 0.208751 40.5146 0.392457 40.9653 0.650354C41.42 0.90545 41.8107 1.22718 42.1372 1.61554C42.4644 2.00042 42.7118 2.44164 42.8793 2.93918C43.0475 3.43326 43.1215 3.97543 43.1012 4.5657Z" fill="#485563"/>
                    <path d="M51.5599 16.7757L48.7094 14.7817L54.7715 5.8346L57.7123 7.89185C58.5751 8.49539 59.1947 9.19283 59.5711 9.98417C59.9494 10.7726 60.0775 11.6156 59.9552 12.5131C59.8378 13.4097 59.4643 14.3226 58.8348 15.2517C58.2033 16.1837 57.493 16.8673 56.7038 17.3025C55.9174 17.7398 55.0866 17.9185 54.2113 17.8385C53.338 17.7556 52.4542 17.4013 51.5599 16.7757ZM50.8371 14.5315L52.2861 15.5451C52.9568 16.0143 53.6011 16.2761 54.219 16.3306C54.8389 16.3822 55.425 16.2405 55.9772 15.9056C56.5314 15.5678 57.0483 15.0451 57.5278 14.3373C58.0034 13.6354 58.2966 12.9626 58.4074 12.319C58.5211 11.6773 58.4473 11.0784 58.1862 10.5222C57.9251 9.96604 57.4735 9.4634 56.8314 9.01425L55.3008 7.94352L50.8371 14.5315Z" fill="#485563"/>
                    <path d="M57.0036 24.5816C53.8499 20.4523 49.8075 17.1117 45.1862 14.816C40.565 12.5203 35.4877 11.3305 30.3437 11.3379C25.1997 11.3453 20.1257 12.5496 15.5109 14.8585C10.896 17.1675 6.86285 20.5196 3.7207 24.658L5.4326 25.1704C8.37306 21.2977 12.1473 18.1607 16.466 16C20.7846 13.8393 25.5329 12.7123 30.3467 12.7054C35.1605 12.6984 39.9119 13.8119 44.2366 15.9602C48.5612 18.1085 52.3442 21.2347 55.2954 25.0989L57.0036 24.5816Z" fill="#485563"/>
                </svg>    
            </span>
            <span data-value="curveReverse">
                <svg width="54" height="25" viewBox="0 0 54 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M54.0007 1.3373C50.9302 5.23068 46.9944 8.38039 42.495 10.5449C37.9956 12.7094 33.0522 13.8312 28.0439 13.8242C23.0356 13.8173 18.0954 12.6818 13.6023 10.5048C9.10912 8.32778 5.18233 5.16714 2.12305 1.26525L3.78979 0.747006C6.65271 4.39845 10.3275 7.35622 14.5322 9.39348C18.737 11.4307 23.36 12.4934 28.0469 12.4999C32.7337 12.5064 37.3598 11.4566 41.5704 9.43103C45.781 7.40546 49.4642 4.45791 52.3376 0.814432L54.0007 1.3373Z" fill="#485563"/>
                    <path d="M1.37302 16.3375L0 15.4074L8.98733 9.06152L10.4818 10.0739L7.66465 20.5998L6.29163 19.6696L8.69804 11.1241L8.63106 11.0787L1.37302 16.3375ZM3.91457 13.19L8.36853 16.2073L7.61922 17.2783L3.16527 14.2609L3.91457 13.19Z" fill="#485563"/>
                    <path d="M15.9304 23.9401L18.0582 13.9146L21.7893 14.6814C22.5123 14.83 23.086 15.0705 23.5104 15.4029C23.9355 15.7321 24.2236 16.1199 24.3745 16.5665C24.5262 17.0097 24.5494 17.4794 24.4441 17.9754C24.3554 18.3932 24.2027 18.7296 23.9859 18.9848C23.7697 19.2367 23.5123 19.4222 23.2136 19.5413C22.9189 19.6578 22.6073 19.7232 22.279 19.7375L22.2582 19.8354C22.593 19.9212 22.9001 20.0967 23.1796 20.3619C23.4631 20.6245 23.6725 20.9588 23.8079 21.3646C23.9432 21.7705 23.9559 22.2329 23.8457 22.7518C23.737 23.2641 23.5166 23.6991 23.1846 24.0566C22.8566 24.4115 22.4136 24.6559 21.8556 24.7899C21.2983 24.9206 20.625 24.9048 19.8356 24.7426L15.9304 23.9401ZM17.7429 22.9587L19.9617 23.4147C20.698 23.566 21.2551 23.534 21.6331 23.3188C22.011 23.1036 22.2447 22.7855 22.334 22.3645C22.4012 22.0479 22.3816 21.7408 22.2752 21.443C22.1688 21.1453 21.9813 20.8871 21.7128 20.6684C21.4475 20.4504 21.1093 20.2992 20.698 20.2147L18.4245 19.7475L17.7429 22.9587ZM18.6749 18.5677L20.7345 18.991C21.0794 19.0618 21.4033 19.0603 21.7063 18.9863C22.0126 18.913 22.272 18.7756 22.4843 18.574C22.7007 18.3699 22.8432 18.1062 22.9118 17.7832C22.9998 17.3687 22.9259 16.9908 22.6903 16.6495C22.4547 16.3082 22.0318 16.0748 21.4215 15.9494L19.3222 15.518L18.6749 18.5677Z" fill="#485563"/>
                    <path d="M39.1873 17.1784L37.6305 17.4749C37.5063 17.159 37.3382 16.8922 37.1263 16.6744C36.9144 16.4567 36.6732 16.2836 36.403 16.1551C36.1327 16.0266 35.8425 15.9461 35.5323 15.9134C35.2256 15.8802 34.9092 15.8946 34.5832 15.9567C33.9944 16.0688 33.4958 16.3148 33.0874 16.6948C32.6824 17.0742 32.4005 17.571 32.2418 18.1853C32.0864 18.799 32.0885 19.5117 32.2482 20.3235C32.4091 21.1417 32.678 21.807 33.0549 22.3194C33.4351 22.831 33.8863 23.1865 34.4087 23.3859C34.931 23.5852 35.4832 23.6295 36.0654 23.5186C36.388 23.4572 36.6857 23.3563 36.9583 23.2161C37.2337 23.072 37.4727 22.8923 37.6754 22.6772C37.8781 22.462 38.0368 22.2161 38.1515 21.9396C38.2689 21.6592 38.3277 21.3525 38.3278 21.0197L39.8855 20.7282C39.8995 21.2383 39.8277 21.724 39.67 22.1853C39.5149 22.6427 39.2807 23.0574 38.9674 23.4295C38.6567 23.7977 38.2797 24.1089 37.8362 24.3631C37.3927 24.6174 36.8899 24.798 36.3277 24.9051C35.4429 25.0736 34.614 25.0175 33.841 24.7369C33.0673 24.4529 32.4049 23.9627 31.8538 23.2663C31.3061 22.5692 30.9269 21.6855 30.7164 20.6152C30.5052 19.5416 30.5236 18.5822 30.7715 17.737C31.0187 16.8885 31.4477 16.1921 32.0585 15.648C32.6686 15.1005 33.4144 14.7428 34.2959 14.575C34.8381 14.4717 35.3589 14.4523 35.8581 14.5168C36.3601 14.5775 36.828 14.7193 37.2618 14.9423C37.695 15.162 38.0762 15.4595 38.4054 15.8349C38.7339 16.207 38.9946 16.6548 39.1873 17.1784Z" fill="#485563"/>
                    <path d="M51.4414 18.6799L48.666 20.5601L42.7638 12.1242L45.6271 10.1845C46.4671 9.61549 47.3066 9.29566 48.1457 9.22507C48.9829 9.15173 49.782 9.32077 50.5429 9.7322C51.3046 10.139 51.992 10.7804 52.6049 11.6564C53.2197 12.5351 53.5848 13.4009 53.7002 14.2536C53.8183 15.1045 53.6896 15.9082 53.3139 16.6646C52.9362 17.4183 52.3121 18.0901 51.4414 18.6799ZM49.1814 18.5717L50.5921 17.616C51.2451 17.1736 51.7034 16.6851 51.9668 16.1504C52.2284 15.613 52.3052 15.0408 52.1973 14.4339C52.0875 13.8242 51.7992 13.1858 51.3323 12.5185C50.8693 11.8567 50.3689 11.3679 49.8313 11.0521C49.2964 10.7345 48.7347 10.5989 48.1461 10.6455C47.5576 10.6921 46.9508 10.9271 46.3256 11.3506L44.8354 12.3601L49.1814 18.5717Z" fill="#485563"/>
                </svg>    
            </span>
        </div>

        <div class="fpd-tool-curved-text-radius fpd-input">
            <span class="fpd-label" data-defaulttext="Radius">toolbar.radius</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="80" 
                step="1" 
                min="0" 
                max="400"
                data-control="curveRadius"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="80" 
                step="1" 
                min="0" 
                max="400"
                data-control="curveRadius" 
            />
        </div>

    </div><!-- Curved Text -->

    <div class="fpd-panel-transform fpd-padding">

        <div class="fpd-tool-angle fpd-input">
            <span class="fpd-label" data-defaulttext="Rotate">toolbar.rotate</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="1" 
                step="1" 
                min="0" 
                max="359"
                data-control="angle"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="1" 
                step="1" 
                min="0" 
                max="359"
                data-control="angle" 
            />
        </div>

        <div class="fpd-tool-scaleX fpd-tool-scale fpd-input">
                <span class="fpd-label" data-defaulttext="Scale X">toolbar.scaleX</span>
                <fpd-range-slider 
                    class="fpd-progress"
                    value="1" 
                    step="0.01" 
                    min="0" 
                    max="5"
                    data-control="scaleX"
                ></fpd-range-slider>
                <input 
                    class="fpd-slider-number fpd-number" 
                    type="number" 
                    value="1" 
                    step="0.01" 
                    min="0" 
                    max="5"
                    data-control="scaleX" 
                />
        </div>

        <div 
            class="fpd-tool-uniscaling-locker fpd-tool-scale fpd-toggle" 
            data-control="lockUniScaling"
            data-enabled="true" 
            data-disabled="false"
        >
            <span class="fpd-icon-unlocked"></span>
        </div>

        <div class="fpd-tool-scaleY fpd-tool-scale fpd-input">
            <span class="fpd-label" data-defaulttext="Scale Y">toolbar.scaleY</span>
            <fpd-range-slider 
                class="fpd-progress"
                value="1" 
                step="0.01" 
                min="0" 
                max="5"
                data-control="scaleY"
            ></fpd-range-slider>
            <input 
                class="fpd-slider-number fpd-number" 
                type="number" 
                value="1" 
                step="0.01" 
                min="0" 
                max="5"
                data-control="scaleY" 
            />
        </div>

        <div class="fpd-tool-flip fpd-tools-group">
            <div data-do="flip-x">
                <span class="fpd-icon-flip-horizontal"></span>
                <span data-defaulttext="Flip Horizontal">toolbar.flip_h</span>
            </div>
            <div data-do="flip-y">
                <span class="fpd-icon-flip-vertical"></span>
                <span data-defaulttext="Flip Vertical">toolbar.flip_v</span>
            </div>
        </div>

    </div><!-- Transform Panel -->

    <div class="fpd-panel-position">

        <div class="fpd-panel-tabs">
            <span data-tab="align" data-defaulttext="Align">toolbar.align</span>
            <span data-tab="arrange" data-defaulttext="Arrange" class="fpd-active">toolbar.arrange</span>
        </div>

        <div class="fpd-panel-tabs-content fpd-scroll-area">

            <div data-id="align">

                <div class="fpd-tool-position-align fpd-tools-group">
                    <div data-do="align-top">
                        <span class="fpd-icon-align-top"></span>
                        <span data-defaulttext="Top">toolbar.align_top</span>
                    </div>
                    <div data-do="align-middle">
                        <span class="fpd-icon-align-horizontal-middle"></span>
                        <span data-defaulttext="Middle">toolbar.center_h</span>
                    </div>
                    <div data-do="align-bottom">
                        <span class="fpd-icon-align-bottom"></span>
                        <span data-defaulttext="Bottom">toolbar.align_bottom</span>
                    </div>
                    <div data-do="align-left">
                        <span class="fpd-icon-align-left"></span>
                        <span data-defaulttext="Left">toolbar.align_left</span>
                    </div>
                    <div data-do="align-center">
                        <span class="fpd-icon-align-vertical-middle"></span>
                        <span data-defaulttext="Center">toolbar.center_v</span>
                    </div>
                    <div data-do="align-right">
                        <span class="fpd-icon-align-right"></span>
                        <span data-defaulttext="Right">toolbar.align_right</span>
                    </div>
                </div>
                
            </div>

            <div data-id="arrange">

                <div class="fpd-tool-layer-depth fpd-tools-group">
                    <div data-do="layer-up">
                        <span class="fpd-icon-move-up"></span>
                        <span data-defaulttext="Move Up">toolbar.move_up</span>
                    </div>
                    <div data-do="layer-down">
                        <span class="fpd-icon-move-down"></span>
                        <span data-defaulttext="Move Down">toolbar.move_down</span>
                    </div>
                </div>
                
            </div>
            
        </div>

    </div><!-- Position Panel -->

    <div class="fpd-panel-advanced-editing">

        <div class="fpd-panel-tabs">
            <span data-tab="filters" data-defaulttext="Filters" class="fpd-active">toolbar.filters</span>
            <span data-tab="crop" data-defaulttext="Crop">toolbar.crop</span>
        </div>

        <div class="fpd-panel-tabs-content">
            <div data-id="filters">
                <div class="fpd-tool-filters fpd-grid fpd-scroll-area fpd-padding"></div>
            </div>
            <div data-id="crop">
                <div class="fpd-tool-crop-masks fpd-grid fpd-scroll-area fpd-padding"></div>
            </div>
        </div>

        
    </div><!-- Advanced Editing -->

</div>`)