import { extend } from "dayjs";
import ResponseDto from "../response.dto";
import { FavoriteListItem } from "types/interface";

export default interface GetFavoriteListReponseDto extends ResponseDto {
    favoriteList: FavoriteListItem[];
}