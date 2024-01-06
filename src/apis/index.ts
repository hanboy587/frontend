import axios from "axios";
import { SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { SignInResponseDto, SignUpResponseDto } from "./response/auth";
import { ResponseDto } from "./response";
import { GetSignInUserResponseDto, GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto } from "./response/user";
import { PatchBoardRequestDto, PostBoardRequestDto, PostCommentRequestDto } from "./request/board";
import { PostBoardResponseDto, GetBoardResponseDto, IncreaseViewCountResponseDto, GetFavoriteListReponseDto, GetCommentListResponseDto, PutFavoriteResponseDto, PostCommentResponseDto, DeleteBoardResponseDto, PatchBoardResponseDto, GetLatestBoardListResponseDto, GetTop3BoardListResponseDto, GetSearchBoardListResponseDto, GetUserBoardListResponseDto } from "./response/board";
import { GetPopularListResponseDto, GetRealationListResponseDto } from "./response/search";
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from "./request/user";
import { request } from "http";

const DOMAIN = 'http://localhost:4000';

const API_DOMAIN = `${DOMAIN}/api/v1`;

// token header 생성 //
const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
}

// links //
// 로그인 요청 //
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
// 회원가입 요청 //
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
// 게시물 작성 //
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;
// 유저 로그인 정보 반환 //
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
// 게시물 가져오기 //
const GET_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
// 게시물 조회수 증가 //
const INCREASE_VIEW_COUNT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/increase-view-count`;
// 좋아요 리스트 불러오기 //
const GET_FAVORITE_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite-list`;
// 댓글 리스트 불러오기 //
const GET_COMMENT_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment-list`;
// 검색 리스트 불러오기 //
const GET_SEARCH_BOARD_LIST_URL = (searchWord: string, preSearchWord: string | null) => `${API_DOMAIN}/board/search-list/${searchWord}${preSearchWord ? '/' + preSearchWord : ''}`;
// 연관 검색어 리스트 불러오기 //
const GET_RELATION_LIST_URL = (searchWord: string) => `${API_DOMAIN}/search/${searchWord}/relation-list`;
// 내 게시물 불러오기 //
const GET_USER_BOARD_LIST_URL = (email: string) => `${API_DOMAIN}/board/user-board-list/${email}`
// 유저 정보 불러오기 //
const GET_USER_URL = (email: string) => `${API_DOMAIN}/user/${email}`;
// 좋아요 누르기 동작 //
const PUT_FAVORITE_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite`;
// 댓글 작성 //
const POST_COMMENT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment`;
// 게시물 삭제 //
const DELETE_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
// 게시물 수정 //
const PATCH_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
// 닉네임 수정 //
const PATCH_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
// 프로필 이미지 수정 //
const PATCH_PROFILE_IMAGE_URL = () => `${API_DOMAIN}/user/profile-image`;
// 이미지 업로드 //
const FILE_DOMAIN = `${DOMAIN}/file`
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;

// main 화면 그리기 //
const GET_LATEST_BOARD_LIST_URL = () => `${API_DOMAIN}/board/latest-list`;
const GET_TOP_3_BOARD_LIST_URL = () => `${API_DOMAIN}/board/top-3`;
const GET_POPULAR_LIST_URL = () => `${API_DOMAIN}/search/popular-list`;

// 로그인 요청 //
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(res => {
            const responseBody: SignInResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response.data) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })

        return result;
}

// 회원가입 요청 //
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(res => {
            const responseBody: SignUpResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response.data) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })

    return result;
}


// 게시물 작성 //
export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string) => {
    const result = await axios.post(POST_BOARD_URL(), requestBody, authorization(accessToken))
        .then(res => {
            const responseBody: PostBoardResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })

        return result;
}



// 유저 로그인 정보 반환 //
export const getSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(res => { 
            const responseBody: GetSignInUserResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response.data) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        });

    return result;
}



// 이미지 업로드 //
const multipartForm = { headers: { 'Content-Type': 'multipart/fomr-data' } };

export const fileUploadReqeust = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartForm)
        .then(res => {
            const responseBody: string = res.data;
            return responseBody;
        })
        .catch(err => {
            return null;
        })
    return result;
}



// 게시물 가져오기 //
export const getBoardRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_BOARD_URL(boardNumber))
        .then(res => {
            const responseBody: GetBoardResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })
        return result;
}

// 게시물 조회수 증가 //
export const increaseViewCountRequest = async (boardNumber: number | string) => {
    const result = await axios.get(INCREASE_VIEW_COUNT_URL(boardNumber))
        .then(res => {
            const responseBody: IncreaseViewCountResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })
        
        return result;
}

// 좋아요 리스트 불러오기 //
export const getFavoriteListRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_FAVORITE_LIST_URL(boardNumber))
        .then(res => {
            const responseBody: GetFavoriteListReponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })
        return result;
}

// 댓글 리스트 불러오기 //
export const getCommentListRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_COMMENT_LIST_URL(boardNumber))
        .then(res => {
            const responseBody: GetCommentListResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })

        return result;
}

// 좋아요 누르기 //
export const putFavoriteRequest = async (boardNumber: number | string, accessToken: string) => {
    const result = await axios.put(PUT_FAVORITE_URL(boardNumber), {}, authorization(accessToken))
        .then(res => {
            const responseBody: PutFavoriteResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })

    return result;
}

// 댓글 작성 //
export const postCommentRequest = async (boardNumber: number | string, requestBody: PostCommentRequestDto, accessToken: string) => {
    const result = await axios.post(POST_COMMENT_URL(boardNumber), requestBody, authorization(accessToken))
        .then(res => {
            const responseBody: PostCommentResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })
    return result;
}

// 게시물 삭제 //
export const deleteBoardRequest = async (boardNumber: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_BOARD_URL(boardNumber), authorization(accessToken))
        .then(res => {
            const responseBody: DeleteBoardResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })
    return result;
}

// 게시물 수정 //
export const patchBoardRequest = async (boardNumber: number | string, requestBody: PatchBoardRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_BOARD_URL(boardNumber), requestBody, authorization(accessToken))
        .then(res => {
            const responseBody: PatchBoardResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })

    return result;
}

// 최근 게시물 불러오기 //
export const getLatestBoardListRequest = async () => {
    const result = await axios.get(GET_LATEST_BOARD_LIST_URL())
        .then(res => {
            const responseBody: GetLatestBoardListResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })

    return result;
}

// 조회수 top 3 게시물 불러오기 //
export const getTop3BoardListRequest = async () => {
    const result = await axios.get(GET_TOP_3_BOARD_LIST_URL())
        .then(res => {
            const responseBody: GetTop3BoardListResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })
    return result;
}


// 인기 검색어 불러오기 //
export const getPopularListRequest = async () => {
    const result = await axios.get(GET_POPULAR_LIST_URL())
        .then(res => {
            const responseBody: GetPopularListResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })

    return result;
}

// 검색 리스트 불러오기 //
export const getSearchBoardListRequest = async (searchWord: string, preSearchWord: string | null) => {
    const result = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord))
        .then(res => {
            const responseBody: GetSearchBoardListResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })

    return result;
}

// 연관 검색어 리스트 불러오기 //
export const getRelationListRequest = async (searchWord: string) => {
    const result = await axios.get(GET_RELATION_LIST_URL(searchWord))
        .then(res => {
            const responseBody: GetRealationListResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })

    return result;
}

// 내 게시물 불러오기 //
export const getUserBoardListRequest = async (email: string) => {
    const result = await axios.get(GET_USER_BOARD_LIST_URL(email))
        .then(res => {
            const responseBody: GetUserBoardListResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })

    return result;
}

// 유저 정보 불러오기 //
export const getUserRequest = async (email: string) => {
    const result = await axios.get(GET_USER_URL(email))
        .then(res => {
            const responseBody: GetUserResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })
    return result;
}

// 닉네임 수정 //
export const patchNicknameRequest = async (requestBody: PatchNicknameRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_NICKNAME_URL(), requestBody, authorization(accessToken))
        .then(res => {
            const responseBody: PatchNicknameResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })
    return result;
}


// 프로필 사진 수정 //
export const patchProfileImageRequest = async (requestBody: PatchProfileImageRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_PROFILE_IMAGE_URL(), requestBody, authorization(accessToken))
        .then(res => {
            // console.log('api : ', res);
            const responseBody: PatchProfileImageResponseDto = res.data;
            return responseBody;
        })
        .catch(err => {
            if (!err.response) return null;
            const responseBody: ResponseDto = err.response.data;
            return responseBody;
        })
    return result;
}