<!-- A shared SVG filter that makes images look like a 1-bit black and white photocopy: grayscale, a little toner
     grain, then a hard threshold. Use with `filter: url(#xerox-bw)`. The filter region is clipped to the element so
     the grain doesn't spill past its edges. -->
<svg aria-hidden="true" width="0" height="0" class="absolute">
	<!-- Black and white copy: luminance only, then a hard threshold so every pixel is pure black or white -->
	<filter id="xerox-bw" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
		<feColorMatrix type="saturate" values="0" result="gray" />

		<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="noise" />
		<feColorMatrix in="noise" type="saturate" values="0" result="grayNoise" />
		<feComposite in="gray" in2="grayNoise" operator="arithmetic" k1="0" k2="1" k3="0.25" k4="-0.12" />

		<feComponentTransfer>
			<feFuncR type="discrete" tableValues="0 1" />
			<feFuncG type="discrete" tableValues="0 1" />
			<feFuncB type="discrete" tableValues="0 1" />
		</feComponentTransfer>
	</filter>
</svg>
