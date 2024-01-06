import ResponseDto from "../response.dto";

export default interface GetRealationListResponseDto extends ResponseDto {
    relativeWordList: string[];
}