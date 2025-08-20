import {createGetCurrentWeekAlbumTool} from "./getCurrentWeekAlbum";
import {createListBacklogTool} from "./listBacklog";
import {createGetAlbumRatingsTool} from "./getAlbumRatings";
import {createShowNominationFormTool} from "./showNominationForm";
import {createShowRatingFormTool} from "./showRatingForm";
import {createGetAllRatingsTool} from "./getAllRatings";
import {createGetAllCommentsTool} from "./getAllComments";

export const createTools = (messages: any) => ({
  getCurrentWeekAlbum: createGetCurrentWeekAlbumTool(messages),
  listBacklog: createListBacklogTool(messages),
  getAlbumRatings: createGetAlbumRatingsTool(messages),
  showNominationForm: createShowNominationFormTool(messages),
  showRatingForm: createShowRatingFormTool(messages),
  getAllRatings: createGetAllRatingsTool(messages),
  getAllComments: createGetAllCommentsTool(messages),
});