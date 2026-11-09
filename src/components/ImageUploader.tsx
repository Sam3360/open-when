import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useId, useRef, useState } from "react";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 8 * 1024 * 1024;

export type UploadedImage = {
  storageId: string;
  previewUrl: string;
};

export function ImageUploader({
  value,
  onChange,
  disabled,
  className,
}: {
  value: UploadedImage | null;
  onChange: (value: UploadedImage | null) => void;
  disabled?: boolean;
  className?: string;
}) {
  const generateUploadUrl = useMutation(api.boxes.generateUploadUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That photo is larger than 8 MB. Try a smaller one.");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const url = await generateUploadUrl();
      const storageId = await uploadWithProgress(url, file, setProgress);
      const previewUrl = URL.createObjectURL(file);
      onChange({ storageId, previewUrl });
    } catch (uploadError) {
      console.error("[Open When] Photo upload failed", uploadError);
      setError(
        "That photo didn't upload. Check your connection and try again.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage() {
    onChange(null);
    setError(null);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED.join(",")}
        aria-label="Upload a photo"
        className="sr-only"
        disabled={disabled || uploading}
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-[4px] border border-border bg-muted/40">
          <img
            src={value.previewUrl}
            alt="Uploaded photo preview"
            className="max-h-64 w-full object-cover"
          />
          <div className="absolute right-2 top-2 flex gap-1.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
              className="h-8 bg-card/95 px-3 text-[12px] shadow-sm backdrop-blur"
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : null}
              Replace
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              disabled={disabled || uploading}
              onClick={removeImage}
              aria-label="Remove photo"
              className="bg-card/95 shadow-sm backdrop-blur"
            >
              <X className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-[4px] border border-dashed border-input bg-card/40 px-4 py-8 text-center transition-colors hover:border-foreground/30 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <Loader2
              className="size-5 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <ImagePlus
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <span className="text-[13px] font-medium text-foreground">
            {uploading ? "Uploading photo…" : "Add a photo"}
          </span>
          <span className="text-[11.5px] text-muted-foreground">
            JPG, PNG or WebP · up to 8 MB
          </span>
        </button>
      )}

      {uploading && (
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Photo upload progress"
        >
          <div
            className="h-full bg-foreground/70 transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <p role="alert" className="text-[12px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function uploadWithProgress(
  url: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        if (xhr.status < 200 || xhr.status >= 300) {
          throw new Error(`Upload failed with status ${xhr.status}`);
        }
        const data = JSON.parse(xhr.responseText) as {
          storageId?: string;
        };
        if (!data.storageId) throw new Error("Upload returned no file id");
        resolve(data.storageId);
      } catch (error) {
        reject(error);
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.onabort = () => reject(new Error("Upload cancelled"));
    xhr.send(file);
  });
}
