export default function WarningSVG({color,width,height}) {
    return <svg style={{width: width || "24px",height: height || "20px"}} version="1.0" xmlns="http://www.w3.org/2000/svg" width="48.000000pt" height="43.000000pt" viewBox="0 0 48.000000 43.000000" preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0.000000,43.000000) scale(0.100000,-0.100000)"
        fill={color||"#8D0000"} stroke="none">
        <path d="M223 422 c-20 -13 -224 -375 -221 -392 3 -13 35 -15 238 -15 203 0
        235 2 238 15 4 21 -211 394 -229 397 -8 2 -19 -1 -26 -5z m110 -169 c46 -82
        94 -165 107 -185 l22 -38 -221 0 c-122 0 -221 3 -221 6 0 3 8 18 19 32 10 15
        58 96 105 180 48 83 91 152 96 152 4 0 46 -66 93 -147z"/>
        <path d="M225 287 c-3 -7 -5 -47 -3 -88 2 -58 6 -74 18 -74 12 0 15 16 15 84
        0 59 -4 86 -12 88 -7 3 -15 -2 -18 -10z"/>
        <path d="M220 91 c0 -19 23 -35 34 -24 14 15 5 43 -14 43 -13 0 -20 -7 -20
        -19z"/>
        </g>
    </svg>;
}