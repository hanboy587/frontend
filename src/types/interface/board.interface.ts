export default interface Board {

    boardNumber: number;
    title: string;
    content: string;
    boardImageList: string[];
    writeDateTime: string;
    writerEmail: string;
    writerNickname: string;
    writerProfileImage: string | null;
}
