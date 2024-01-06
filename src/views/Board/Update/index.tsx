import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import useBoardStore from 'stores/board.store';
import { useLoginuserStore } from 'stores';
import { useNavigate, useParams } from 'react-router-dom';
import { MAIN_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { getBoardRequest } from 'apis';
import { GetBoardResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { converUrlsToFile } from 'utils';

// component: 게시물 수정 컴포넌트 //
export default function BoardWrite() {

  // state: title 요소 참조 상태 //
  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  // state: textarea 요소 참조 상태 //
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  // state file input 요소 참조 상태 //
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // state: board 상태 //
  const { title, setTitle, content, setContent, boardImagesFileList, setBoardImageFileList, resetBoard } = useBoardStore();

  // state: boardNumber Path variable 상태 //
  const { boardNumber } = useParams();

  // state: login user 상태 //
  const { loginUser } = useLoginuserStore();

  // state: cookie 상태 //
  const [cookies, setCookie] = useCookies();

  // state: board image 미리보기 url 상태 //
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // function: navigate //
  const navigator = useNavigate();

  // function: getBoardResponse //
  const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === 'NB') alert('존재하지 않는 게시물입니다.');
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    if (code !== 'SU') {
      navigator(MAIN_PATH());
      return;
    }

    const { title, content, boardImageList, writerEmail } = responseBody as GetBoardResponseDto;
    setTitle(title);
    setContent(content);
    setImageUrls(boardImageList);
    converUrlsToFile(boardImageList).then(boardImagesFileList => setBoardImageFileList(boardImagesFileList));

    if (!loginUser || loginUser.email !== writerEmail) {
      navigator(MAIN_PATH());
      return;
    }
  }

  // event handler: title 변경 처리 //
  const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setTitle(value);

    // 스크롤 바 삭제
    if (!titleRef.current) return;
    titleRef.current.style.height = 'auto';
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  }

  // event handler: content 변경 처리 //
  const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setContent(value);

    // 스크롤 바 삭제
    if (!contentRef.current) return;
    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  }

  // event handler: image change 이벤트 처리 //
  const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) return;
    const file = event.target.files[0];

    // 미리보기 용 URL
    const imageUrl = URL.createObjectURL(file);
    const newImageUrls = imageUrls.map(item => item);
    newImageUrls.push(imageUrl);
    setImageUrls(newImageUrls);

    // 업로드 용 URL
    const newBoardImageFileList = boardImagesFileList.map(item => item);
    newBoardImageFileList.push(file);
    setBoardImageFileList(newBoardImageFileList);

    // 중복 사진 변경 인식
    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';
  }

  // event handler: image upload button 클릭 이벤트 처리 //
  const onImageUploadButtonClickHandler = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  }

  // event handler: image close button 클릭 이벤트 처리 //
  const onClolseButtonClickHandler = (deletIndex: number) => {
    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';

    // 해당 index filter 제거 처리
    const newImageUrls = imageUrls.filter((url, index) => index !== deletIndex);
    setImageUrls(newImageUrls);

    const newBoardImageFileList = boardImagesFileList.filter((file, index) => index !== deletIndex);
    setBoardImageFileList(newBoardImageFileList);
  }



  // effect: 마운트 할 때마다 실행 //
  useEffect(() => {
    // 쿠키에 token이 없으면 메인 화면으로 //
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      navigator(MAIN_PATH());
      return;
    }
    if (!boardNumber) return;
    getBoardRequest(boardNumber).then(getBoardResponse);
  }, [boardNumber]);

  // render: 게시물 수정 컴포넌트 렌더링 //
  return (
    <div id='board-update-wrapper'>
      <div className='board-update-container'>
        <div className='board-update-box'>
          <div className='board-update-title-box'>
            <textarea ref={titleRef} className='board-update-title-textarea' rows={1} placeholder='제목을 작성해주세요.' value={title} onChange={onTitleChangeHandler} />
          </div>
          <div className='divider'></div>
          <div className='board-update-content-box'>
            <textarea ref={contentRef} className='board-update-content-textarea' placeholder='본문을 작성해주세요.' value={content} onChange={onContentChangeHandler} />
            <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
              <div className='icon image-box-light-icon'></div>
            </div>
            <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onImageChangeHandler} />
          </div>
          <div className='board-update-images-box'>
            {imageUrls.map((imageUrl, index) => (
              <div className='board-update-image-box'>
                <img className='board-update-image' src={imageUrl} />
                <div className='icon-button image-close' onClick={() => onClolseButtonClickHandler(index)}>
                  <div className='icon close-icon'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
