// export function truncate(value : string, max : number) {
//     if (max < value.length)
//         return value.slice(0, max) + '...'
//     else
//         return value
// }

// export function currency(value : number) {
//     return new Intl.NumberFormat().format(value)
// }




export default {
    install(app : any) {
        app.config.globalProperties.$numFormat = (key : string) => {
            return Number(key).toLocaleString();
        },
        app.config.globalProperties.$numFormatWithDollar = (key:string) => {
            return key ? '$' + Number(key).toLocaleString() : '-';
        }
    }
}
 