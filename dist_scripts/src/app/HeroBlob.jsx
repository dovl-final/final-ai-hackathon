// A modern, organic fluid blob animation for the hero background
export default function HeroBlob() {
    return (<div className="absolute inset-0 z-0 overflow-hidden">
      {/* Main background SVG with fluid shapes */}
      <svg className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 w-full max-w-[1400px] h-auto opacity-90 select-none pointer-events-none" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          {/* Modern gradients with updated color palette */}
          <linearGradient id="fluid-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2"/>
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2"/>
          </linearGradient>
          
          <linearGradient id="fluid-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.25"/>
          </linearGradient>
          
          <linearGradient id="fluid-gradient-3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2"/>
          </linearGradient>
          
          {/* Filter for glow effects */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>

          {/* Noise texture pattern */}
          <pattern id="noise" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="100" height="100" fill="url(#fluid-gradient-1)" fillOpacity="0.05"/>
            <rect x="0" y="0" width="100" height="100" fill="url(#noise-filter)"/>
          </pattern>
          
          <filter id="noise-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.05"/>
            </feComponentTransfer>
          </filter>
        </defs>
        
        {/* Noise background */}
        <rect width="100%" height="100%" fill="url(#noise)" opacity="0.4"/>
        
        {/* Main fluid shape */}
        <path d="" fill="url(#fluid-gradient-1)" opacity="0.8" filter="url(#glow)">
          <animate attributeName="d" dur="20s" repeatCount="indefinite" values="
              M170,349 C237,331 288,282 339,224 C390,165 430,82 515,74 C600,66 687,133 773,139 C860,144 948,87 994,147 C1041,207 1048,383 1042,476 C1037,569 1019,579 949,589 C879,599 758,607 654,638 C550,669 464,722 383,713 C303,703 229,631 173,581 C118,530 81,502 74,444 C66,387 88,303 133,279 C178,255 247,290 302,292 C358,294 400,262 412,232 C424,201 405,171 387,158 C368,144 281,189 265,192 C248,196 209,192 188,177 C166,162 163,135 161,127 C158,120 155,131 147,148 C139,165 98,229 127,270 C156,312 256,333 256,333 C256,333 152,332 103,326 C54,321 0,364 0,364 L0,600 L1200,600 L1200,0 L0,0 L0,327 C0,327 103,367 170,349Z;
              M126,304 C141,259 133,169 188,127 C243,86 343,21 399,18 C456,15 511,85 544,120 C577,155 589,175 652,204 C716,233 812,254 864,294 C915,335 907,339 918,382 C929,425 926,463 885,518 C844,573 734,575 651,579 C567,584 510,590 432,582 C354,575 287,557 218,529 C149,501 80,462 47,405 C15,348 20,273 42,237 C64,200 113,202 141,212 C169,222 174,239 187,244 C200,248 209,249 229,235 C249,221 278,194 292,173 C306,153 304,137 296,124 C288,111 274,100 248,105 C222,110 185,131 170,146 C156,161 165,168 147,172 C130,176 88,154 71,158 C54,162 44,197 33,224 C22,251 11,270 27,284 C43,299 86,310 124,320 C163,329 198,339 219,337 C240,335 246,321 240,314 C233,308 215,308 190,305 C165,301 113,292 96,283 C78,275 62,266 52,250 C42,234 38,211 42,187 C45,163 56,133 77,115 C98,97 128,87 153,88 C177,89 184,95 204,117 C224,139 244,169 256,183 C268,198 272,196 286,188 C301,180 325,166 330,150 C335,133 311,115 289,104 C267,93 225,61 216,52 C206,44 229,38 253,32 C278,25 302,29 320,56 C337,83 344,123 366,134 C388,146 413,128 417,114 C422,100 414,93 400,83 C387,73 369,61 350,67 C332,73 321,91 308,94 C296,97 286,84 272,73 C259,61 217,38 197,31 C176,24 163,31 135,31 C108,32 67,25 56,39 C44,54 62,86 73,97 C84,107 111,97 129,106 C148,116 148,135 154,154 C161,173 163,193 186,209 C210,225 253,236 287,236 C321,236 356,219 356,219 C356,219 271,258 221,291 C170,324 151,331 137,339 C122,348 112,356 97,342 C82,328 62,294 57,283 C53,272 65,285 76,292 C87,299 110,301 116,313 C122,326 111,348 111,348 C111,348 0,312 0,312 L0,600 L1200,600 L1200,0 L0,0 L0,260 C0,260 98,276 126,304Z;
              M170,349 C237,331 288,282 339,224 C390,165 430,82 515,74 C600,66 687,133 773,139 C860,144 948,87 994,147 C1041,207 1048,383 1042,476 C1037,569 1019,579 949,589 C879,599 758,607 654,638 C550,669 464,722 383,713 C303,703 229,631 173,581 C118,530 81,502 74,444 C66,387 88,303 133,279 C178,255 247,290 302,292 C358,294 400,262 412,232 C424,201 405,171 387,158 C368,144 281,189 265,192 C248,196 209,192 188,177 C166,162 163,135 161,127 C158,120 155,131 147,148 C139,165 98,229 127,270 C156,312 256,333 256,333 C256,333 152,332 103,326 C54,321 0,364 0,364 L0,600 L1200,600 L1200,0 L0,0 L0,327 C0,327 103,367 170,349Z" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
        </path>
        
        {/* Secondary fluid shape */}
        <path d="" fill="url(#fluid-gradient-2)" opacity="0.6" filter="url(#glow)">
          <animate attributeName="d" dur="25s" repeatCount="indefinite" values="
              M138,253 C115,220 105,192 119,173 C133,154 165,148 196,154 C227,159 263,173 285,187 C307,201 315,227 335,252 C356,277 402,312 447,326 C493,340 539,333 588,342 C637,350 688,374 718,350 C747,327 756,255 789,209 C823,164 881,144 914,159 C947,175 957,243 984,296 C1011,348 1051,386 1047,425 C1042,464 985,509 938,531 C892,554 855,554 812,550 C769,546 721,539 693,513 C666,488 659,444 621,419 C583,394 547,390 487,395 C427,400 294,454 225,489 C155,524 150,541 110,549 C69,556 -8,465 1,380 C10,296 42,218 64,200 C87,182 99,223 121,242 C142,262 173,259 173,259 C173,259 137,255 106,234 C74,214 47,176 47,176 L0,176 L0,600 L1200,600 L1200,0 L0,0 L0,176 C0,176 62,197 89,209 C116,220 162,287 138,253Z;
              M110,262 C80,238 45,217 43,188 C41,160 71,122 101,101 C130,80 159,86 195,96 C231,106 350,145 383,148 C415,151 496,157 545,144 C594,131 655,98 683,90 C710,82 705,98 731,111 C756,125 814,135 854,165 C895,194 905,239 930,270 C954,302 993,319 1031,342 C1069,365 1100,401 1097,429 C1094,457 1060,478 1007,498 C954,517 862,536 802,530 C742,523 714,491 663,467 C613,443 540,429 490,412 C440,395 413,376 359,370 C304,365 221,373 186,385 C151,397 147,414 113,421 C78,428 14,426 16,376 C19,326 67,265 93,239 C120,214 124,223 144,229 C164,236 202,241 205,225 C208,210 196,194 169,181 C142,168 92,160 69,170 C47,181 47,215 34,234 C21,254 -26,285 13,300 C53,315 180,316 180,316 C180,316 140,285 110,262Z;
              M138,253 C115,220 105,192 119,173 C133,154 165,148 196,154 C227,159 263,173 285,187 C307,201 315,227 335,252 C356,277 402,312 447,326 C493,340 539,333 588,342 C637,350 688,374 718,350 C747,327 756,255 789,209 C823,164 881,144 914,159 C947,175 957,243 984,296 C1011,348 1051,386 1047,425 C1042,464 985,509 938,531 C892,554 855,554 812,550 C769,546 721,539 693,513 C666,488 659,444 621,419 C583,394 547,390 487,395 C427,400 294,454 225,489 C155,524 150,541 110,549 C69,556 -8,465 1,380 C10,296 42,218 64,200 C87,182 99,223 121,242 C142,262 173,259 173,259 C173,259 137,255 106,234 C74,214 47,176 47,176 L0,176 L0,600 L1200,600 L1200,0 L0,0 L0,176 C0,176 62,197 89,209 C116,220 162,287 138,253Z" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
        </path>
        
        {/* Accent fluid shape */}
        <path d="" fill="url(#fluid-gradient-3)" opacity="0.5" filter="url(#glow)">
          <animate attributeName="d" dur="30s" repeatCount="indefinite" values="
              M294,237 C334,220 372,184 414,173 C455,162 499,175 533,186 C567,197 591,205 627,225 C663,244 697,250 726,294 C755,338 780,421 774,469 C767,516 726,526 695,546 C664,565 639,592 615,594 C591,595 566,570 531,545 C495,521 408,447 361,418 C313,388 306,403 259,390 C212,376 131,334 110,299 C90,264 131,236 155,213 C179,189 254,257 254,257 C254,257 216,197 197,162 C177,127 176,118 176,118 L0,118 L0,600 L1200,600 L1200,0 L0,0 L0,118 C0,118 134,135 170,152 C205,170 253,254 294,237Z;
              M162,284 C180,273 197,239 219,223 C241,207 281,172 314,162 C347,153 354,169 401,187 C447,205 545,232 592,241 C639,250 657,290 679,304 C701,317 726,304 748,318 C769,333 787,373 792,406 C797,438 790,462 772,481 C755,499 726,509 693,505 C660,502 599,481 570,461 C542,440 547,420 508,399 C470,378 417,373 342,379 C267,384 216,441 165,446 C114,451 63,405 44,373 C25,341 20,301 27,288 C33,274 57,325 90,349 C124,373 167,370 185,358 C204,345 198,323 198,323 C198,323 106,262 106,262 L0,262 L0,600 L1200,600 L1200,0 L0,0 L0,262 C0,262 77,333 162,284Z;
              M294,237 C334,220 372,184 414,173 C455,162 499,175 533,186 C567,197 591,205 627,225 C663,244 697,250 726,294 C755,338 780,421 774,469 C767,516 726,526 695,546 C664,565 639,592 615,594 C591,595 566,570 531,545 C495,521 408,447 361,418 C313,388 306,403 259,390 C212,376 131,334 110,299 C90,264 131,236 155,213 C179,189 254,257 254,257 C254,257 216,197 197,162 C177,127 176,118 176,118 L0,118 L0,600 L1200,600 L1200,0 L0,0 L0,118 C0,118 134,135 170,152 C205,170 253,254 294,237Z" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
        </path>
        
        {/* Floating circles/particles */}
        <g className="particles">
          {/* Small glowing circles that float around */}
          <circle cx="300" cy="200" r="6" fill="#6366f1" opacity="0.6">
            <animate attributeName="cy" values="200;180;200" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
            <animate attributeName="opacity" values="0.6;0.8;0.6" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
          </circle>
          
          <circle cx="850" cy="250" r="8" fill="#ec4899" opacity="0.5">
            <animate attributeName="cy" values="250;220;250" dur="8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
            <animate attributeName="opacity" values="0.5;0.7;0.5" dur="8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
          </circle>
          
          <circle cx="600" cy="400" r="10" fill="#f97316" opacity="0.4">
            <animate attributeName="cy" values="400;370;400" dur="10s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
            <animate attributeName="opacity" values="0.4;0.6;0.4" dur="10s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
          </circle>
          
          <circle cx="400" cy="300" r="5" fill="#a855f7" opacity="0.6">
            <animate attributeName="cy" values="300;280;300" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
            <animate attributeName="opacity" values="0.6;0.8;0.6" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
          </circle>
          
          <circle cx="950" cy="350" r="6" fill="#0ea5e9" opacity="0.5">
            <animate attributeName="cy" values="350;320;350" dur="9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
            <animate attributeName="opacity" values="0.5;0.7;0.5" dur="9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
          </circle>
        </g>
      </svg>
    </div>);
}
