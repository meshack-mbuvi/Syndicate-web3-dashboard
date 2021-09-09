import React from 'react'
import { Spinner } from "@/components/shared/spinner";

interface Props {
    file: any;
    importing: boolean;
    deleteFile: () => void;
    handleUpload: (event: React.FormEvent<HTMLInputElement>) => void;
    title: string;
    fileType?: string;
}


const FileUpload = (props: Props) =>{
    const hiddenFileInput = React.useRef(null);
    const {file, importing, deleteFile, handleUpload, title, fileType = "*"} = props;
    return (
        <>
            {file?
                importing?
                <>
                <div className="flex">
                    <img src="/images/file-icon-gray.svg" alt="File icon"/>
                    <span className="ml-2.5">{file.name}</span>
                </div>
                <Spinner height="h-4" width="w-4" margin="my-0" /> 
                </>
                :
                <>
                <div className="flex">
                    <img src="/images/file-icon-white.svg" alt="File icon"/>
                    <span className="ml-2.5 text-white">{file.name}</span>
                </div>
                <span className="cursor-pointer hover:opacity-70" onClick={deleteFile}>
                    <img src="/images/close-circle.svg" alt="Close Icon" />
                </span>
                </>:
                <>
                <input type="file" className="hidden" onChange={handleUpload} ref={hiddenFileInput} accept={fileType}/>
                <button className="cursor-pointer hover:opacity-70 flex" onClick={() => hiddenFileInput.current.click()} >
                    <img src="/images/file-upload.svg" alt={title}/>
                    <span className="leading-4 ml-2.5">{title}</span>
                </button>
                </>
                }
        </>
    )
}

export default FileUpload;
