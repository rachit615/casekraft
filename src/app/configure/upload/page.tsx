"use client";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import Dropzone, { FileRejection } from "react-dropzone";

const Upload = () => {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPending, startTransition] = useTransition();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId;
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },
    onUploadProgress(progress) {
      setUploadProgress(progress);
    },
  });

  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles, { configId: undefined });
    setIsDragOver(false);
  };
  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    console.log(rejectedFiles);
    setIsDragOver(false);
  };
  return (
    <div
      className={cn(
        "relative h-full flex-1 w-full my-16 p-2 rounded-xl lg:rounded-2xl bg-gray-900/5  ring-inset flex flex-col justify-center items-center",
        { "ring-blue-900/25 bg-blue-900/10": isDragOver }
      )}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          onDragOver={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
          onDropAccepted={onDropAccepted}
          onDropRejected={onDropRejected}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full items-center justify-center flex flex-1 flex-col"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="h-6 w-6 text-zinc-500 mb-2 animate-spin" />
              ) : (
                <Image className="h-6 w-6 text-zinc-500 mb-2" />
              )}

              <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                {isUploading ? (
                  <div>
                    <span>Uploading...</span>
                    <Progress
                      value={uploadProgress}
                      className="mt-2  w-40 h-2 bg-gray-300"
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <span>Redirecting, please wait...</span>
                  </div>
                ) : isDragOver ? (
                  <div>
                    <span className=" font-semibold">Drop file</span>
                    to upload
                  </div>
                ) : (
                  <span>
                    Drag and drop your image here, or click to select a file
                  </span>
                )}
              </div>
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default Upload;
