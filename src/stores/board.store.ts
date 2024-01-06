import { create } from "zustand";

interface BoardStore {
    title: string;
    content: string;
    boardImagesFileList: File[];
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setBoardImageFileList: (boardImageFileList: File[]) => void;
    resetBoard: () => void;
};

const useBoardStore = create<BoardStore>(set => ({
    title: '',
    content: '',
    boardImagesFileList: [],
    setTitle: (title) => set(state => ({ ...state, title })),
    setContent: (content) => set(state => ({ ...state, content })),
    setBoardImageFileList: (boardImagesFileList) => set(state => ({ ...state, boardImagesFileList })),
    resetBoard: () => set(state => ({ ...state, title: '', content: '', boardImagesFileList: [] })),
}));

export default useBoardStore;