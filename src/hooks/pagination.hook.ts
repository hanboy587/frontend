import { useEffect, useState } from "react"

// 호출 할 때 타입을 결정하도록 -> <T> 제너릭 타입 활용 //
const usePagination = <T>(countPerPage: number) => {

    // state: 전체 리스트 상태 //
    const [totalList, setTotalList] = useState<T[]>([]);

    // state: 보여줄 리스트 상태 //
    const [viewList, setViewList] = useState<T[]>([]);

    // state: 현재 페이지 번호 상태 //
    const [currentPage, setCurrentPage] = useState<number>(1);

    // state: 전체 페이지 번호 리스트 상태 //
    const [totalPageList, setTotalPageList] = useState<number[]>([1]);

    // state: 보여줄 페이지 번호 리스트 상태 //
    const [viewPageList, setViewPageList] = useState<number[]>([1]);

    // state: 현재 섹션 상태 //
    const [currentSection, setCurrentSection] = useState<number>(1);

    // state: 전체 섹션 상태 //
    const [totalSection, setTotalSection] = useState<number>(1);

    // function: viewList 추출 //
    const setView = () => {
        const FIRST_INDEX = countPerPage * (currentPage - 1);
        const LAST_INDEX = totalList.length > countPerPage * currentPage ? countPerPage * currentPage : totalList.length;
        const viewList = totalList.slice(FIRST_INDEX, LAST_INDEX);
        setViewList(viewList);
    }

    // function: viewPageList 추출 //
    const setViewPage = () => {
        const FIRST_INDEX = 10 * (currentSection - 1);
        const LAST_INDEX = totalPageList.length > 10 * currentSection ? 10 * currentSection : totalPageList.length;
        const viewPageList = totalPageList.slice(FIRST_INDEX, LAST_INDEX);
        setViewPageList(viewPageList);
    }

    // effect: totalList 변경 될 때 마다 //
    useEffect(() => {
        const totalPage = Math.ceil(totalList.length / countPerPage);
        const totalPageList: number[] = [];
        // 페이지 10개씩 출력 //
        for (let page = 1; page <= totalPage; page++) totalPageList.push(page);
        setTotalPageList(totalPageList);
        
        const totalSection = Math.ceil(totalList.length / (countPerPage * 10));
        setTotalSection(totalSection);

        setCurrentPage(1);
        setCurrentSection(1);

        setView();
        setViewPage();
        // console.log('totalList : ', totalList);
        // console.log('viewPageList : ', viewPageList);
    }, [totalList]);

    // effect: currentPage가 변경 될 때 마다 //
    useEffect(setView, [currentPage]);
    
    // effect: currentSection가 변경 될 때 마다 //
    useEffect(setViewPage, [currentPage]);

    return {
        currentPage,
        setCurrentPage,
        currentSection,
        setCurrentSection,
        viewList,
        viewPageList,
        totalSection,
        setTotalList
    }
}

export default usePagination;