import { defineStore } from 'pinia'
import Api from '@/api'
import { FileType } from '@/types/interfaces'


export const useFileStore = defineStore('fileStore',{
    state : ()=> ({}),
    actions: {
        async uploadFile(files : Array<File>, type : FileType) {
            // let response  = {
            //     isOk : true,
            //     message : "Une erreur est survenue"
            // }
            // console.log('files', files) 
            // const formData = new FormData() 
            // files.forEach((file) => {
            //     formData.append("files", file);
            //     formData.append("type", type)
            // });

            // console.log('formData', formData)

            // try{
            //      response.data = (await Api.post('file',formData,{
            //         headers: {
            //             "Content-Type": "multipart/form-data",
            //         },
            //      })).data
            //      return response
            // }
            // catch(error){
            //     console.log(error)
            //     return response
            // }
        },


        async getFile(path: string){
            return await Api.get('file',{
                params : {
                    path
                }
            })
        },

        getFileLink(link : string){
            return `${import.meta.env.VITE_APP_FILE_API_URL}?path=${link}`
        },

        getFileSize(s: number) {
            var i = Math.floor(Math.log(s) / Math.log(1024));
            const size = (s / Math.pow(1024, i)) as any;
            return size.toFixed(2) * 1 + " " + ["B", "kB", "MB", "GB", "TB"][i];
          }


    }
})