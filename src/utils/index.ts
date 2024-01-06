// file 객체로 typescript에서 사용 가능하게 //
export const converUrlToFile = async (url: string) => {
    const response = await fetch(url);
    const data = await response.blob();
    const extend = url.split('.').pop();
    const fileName = url.split('/').pop();
    const meta = { type: `image/${extend}` };

    return new File([data], fileName as string, meta);
}

export const converUrlsToFile = async (urls: string[]) => {
    const files: File[] = [];
    for (const url of urls) {
        const file = await converUrlToFile(url);
        files.push(file);
    }

    return files;
}