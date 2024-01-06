import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import useBoardStore from 'stores/board.store';
import { useLoginuserStore } from 'stores';
import { log } from 'console';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from 'constant';
import { useCookies } from 'react-cookie';

// component: 게시물 작성 컴포넌트 //
export default function BoardWrite() {

  // state: title 요소 참조 상태 //
  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  // state: textarea 요소 참조 상태 //
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  // state file input 요소 참조 상태 //
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // state: board 상태 //
  const { title, setTitle, content, setContent, boardImagesFileList, setBoardImageFileList, resetBoard } = useBoardStore();

  // state: login user 상태 //
  const { loginUser } = useLoginuserStore();

  // state: cookie 상태 //
  const [cookies, setCookie] = useCookies();

  // state: board image 미리보기 url 상태 //
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // function: navigate //
  const navigater = useNavigate();

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
      navigater(MAIN_PATH());
      return;
    }
    resetBoard();
  },[])

  // render: 게시물 작성 컴포넌트 렌더링 //
  return (
    <div id='board-write-wrapper'>
      <div className='board-write-container'>
        <div className='board-write-box'>
          <div className='board-write-title-box'>
            <textarea ref={titleRef} className='board-write-title-textarea' rows={1} placeholder='제목을 작성해주세요.' value={title} onChange={onTitleChangeHandler} />
          </div>
          <div className='divider'></div>
          <div className='board-write-content-box'>
            <textarea ref={contentRef} className='board-write-content-textarea' placeholder='본문을 작성해주세요.' value={content} onChange={onContentChangeHandler} />
            <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
              <div className='icon image-box-light-icon'></div>
            </div>
            <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onImageChangeHandler} />
          </div>
          <div className='board-write-images-box'>
            {imageUrls.map((imageUrl, index) => (

              <div className='board-write-image-box'>
              <img className='board-write-image' src={imageUrl} />
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
