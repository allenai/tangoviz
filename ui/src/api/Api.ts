import axios from 'axios';

export const noCacheOptions: any = { cachePolicy: 'no-cache' };

export const getArtifact = (name: string, wsid: string, aid: string) => {
    axios.get(`/api/workspace/${wsid}/artifact/${aid}`, { responseType: 'blob' }).then((blob) => {
        const url = window.URL.createObjectURL(blob.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });
};
