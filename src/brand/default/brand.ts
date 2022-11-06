import c from '../../common/cli_colors';
export default{
    cli_accent: c.magenta, 
    
    id:'default',
    cli_icon: "🐦",
    cli_logo:
`
${c.magenta}     .-.      ${c.reset}
${c.magenta}    /'v'\\    ${c.reset}
${c.magenta}   (/   \\)   ${c.reset}
${c.cyan}  ===${c.reset}${c.magenta}"${c.reset}${c.cyan}=${c.reset}${c.magenta}"${c.reset}${c.cyan}===${c.reset}
`,
render_cli_logo: (s:string)=>{
    function get(id:number){
        if (s.split('\n').length<=id)return'';
        else return s.split('\n')[id];
    }
        return `
${c.magenta}     .-.      ${c.reset}   ${get(0)}
${c.magenta}    /'v'\\    ${c.reset}   ${get(1)}
${c.magenta}   (/   \\)   ${c.reset}   ${get(2)}
${c.cyan}  ===${c.reset}${c.magenta}"${c.reset}${c.cyan}=${c.reset}${c.magenta}"${c.reset}${c.cyan}===${c.reset}
`
    },
default_motd: false
} as Brand;