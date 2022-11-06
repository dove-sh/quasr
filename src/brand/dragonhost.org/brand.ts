import c from '../../common/cli_colors';
const semired = `${c.red}${c.dim}`;
export default{
    cli_accent: c.red, 
    id:'dragonhost.org',
    cli_icon: "🐲",
    cli_logo:
/*`
#########${semired}###${c.reset}#########################8
#######${semired}#${c.reset}${c.red}888${c.reset}${semired}#${c.reset}#########################
#######${semired}#${c.reset}${c.red}888${c.reset}${semired}#${c.reset}${c.red}8${c.reset}#########################
#######${semired}#${c.reset}${c.red}8${c.reset}${semired}#${c.reset}${c.red}888${c.reset}${semired}#${c.reset}########################
########${c.red}8${c.reset}#############################
#########${c.red}8${c.reset}############################
#######${c.red}88888${c.reset}##########################
#######${c.red}88888${c.reset}##########################
#######${c.red}88888${c.reset}##########################
########${c.red}888${c.reset}###########################
#########${c.red}888${c.reset}##########################
########${c.red}8${c.reset}##${c.red}888${c.reset}########################
###########${c.red}8${c.reset}##########################
######################################`*/
`       
       ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}  
      ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset} 
     ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset} 
    ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}
  ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}
${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset} 
  ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}
    ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${semired}:${c.reset}
     ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}
      ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${c.red}o${c.reset}
     ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}
    ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset} 
        ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}  
`,
    render_cli_logo: (s:string)=>{
        function get(id:number){
            if (s.split('\n').length<=id)return'';
            else return s.split('\n')[id];
        }
        return `       
        ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}     ${get(0)}
       ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}    ${get(1)}
      ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}    ${get(2)} 
     ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}   ${get(3)}
   ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}   ${get(4)}
 ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}    ${get(5)} 
   ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}   ${get(6)}
     ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${semired}:${c.reset}   ${get(7)}
      ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}   ${get(8)}
       ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${c.red}o${c.reset}   ${get(9)}
      ${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}   ${get(10)}
     ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${c.red}o${c.reset}${c.red}o${c.reset}${semired}:${c.reset}    ${get(11)} 
         ${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}${semired}:${c.reset}     ${get(12)}
`
    },
default_motd: 'running on dragonhost.org'
} as Brand;
