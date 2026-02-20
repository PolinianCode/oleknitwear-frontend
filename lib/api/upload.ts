import { fetchApi } from "./client";
import type { UploadPresignedResponse } from "./types";

export async function uploadImage(file: File): Promise<string> {
    const res = await fetchApi<UploadPresignedResponse>("/api/upload/presigned-url", {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, contentType: file.type, size: file.size }),
    });

    const uploadRes = await fetch(res.data.url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });

    if (!uploadRes.ok) {
        throw new Error("Failed to upload image to storage");
    }

    let publicUrl = res.data.publicUrl;
    if (publicUrl && !publicUrl.startsWith("http")) {
        publicUrl = `https://${publicUrl}`;
    }

    return publicUrl;
}
