import {generateId} from "ai";
import {CoreMessage} from "ai";
import {z} from "zod";
import {Message} from "@/components/message";
import {AlbumCard} from "@/components/album-card";
import {AlbumGrid} from "@/components/album-grid";
import {StatsCard} from "@/components/stats-card";
import {NominationFormWrapper} from "@/components/nomination-form-wrapper";
import {RatingFormWrapper} from "@/components/rating-form-wrapper";
import {RatingsTable} from "@/components/ratings-table";
import {CommentsList} from "@/components/comments-list";
import {AlbumService} from "../services/album";

// Tool factory functions that return tool definitions
export const createTools = (messages: any) => ({
  getCurrentWeekAlbum: {
    description: "Get the current week's album (most recent by pickedAt or nomination)",
    parameters: z.object({}),
    generate: async function* ({}) {
      const result = AlbumService.getCurrentWeekAlbum();
      const toolCallId = generateId();

      if (!result) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                toolCallId,
                toolName: "getCurrentWeekAlbum",
                args: {},
              },
            ],
          },
          {
            role: "tool",
            content: [
              {
                type: "tool-result",
                toolName: "getCurrentWeekAlbum",
                toolCallId,
                result: "No current week album found",
              },
            ],
          },
        ]);
        return <Message role="assistant" content="No current week album found."/>;
      }

      const {album, isNomination} = result;

      // Get ratings for this album (only if it's from albums.json)
      let avg = null;
      let ratingsCount = 0;
      if (!isNomination) {
        const stats = AlbumService.getAlbumRatingsStats(album.id);
        avg = stats.avg;
        ratingsCount = stats.count;
      }

      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId,
              toolName: "getCurrentWeekAlbum",
              args: {},
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolName: "getCurrentWeekAlbum",
              toolCallId,
              result: album,
            },
          ],
        },
      ]);

      return (
        <Message
          role="assistant"
          content={
            <div className="flex flex-col gap-4">
              <AlbumCard
                title={album.title}
                artist={album.artist}
                genre={album.genre}
                coverUrl={album.coverUrl}
              />
              {!isNomination && <StatsCard avg={avg} count={ratingsCount}/>}
            </div>
          }
        />
      );
    },
  },

  listBacklog: {
    description: "List albums in the backlog",
    parameters: z.object({
      limit: z.number().optional(),
    }),
    generate: async function* ({limit}: { limit?: number }) {
      const backlog = AlbumService.getBacklogAlbums(limit);
      const toolCallId = generateId();

      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId,
              toolName: "listBacklog",
              args: {limit},
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolName: "listBacklog",
              toolCallId,
              result: backlog,
            },
          ],
        },
      ]);

      return (
        <Message
          role="assistant"
          content={<AlbumGrid albums={backlog}/>}
        />
      );
    },
  },

  getAlbumRatings: {
    description: "Get ratings overview for a specific album",
    parameters: z.object({
      albumId: z.string(),
    }),
    generate: async function* ({albumId}: { albumId: string }) {
      const result = AlbumService.getAlbumRatings(albumId);
      const toolCallId = generateId();

      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId,
              toolName: "getAlbumRatings",
              args: {albumId},
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolName: "getAlbumRatings",
              toolCallId,
              result: result,
            },
          ],
        },
      ]);

      return (
        <Message
          role="assistant"
          content={<StatsCard avg={result.avg} count={result.count}/>}
        />
      );
    },
  },

  showNominationForm: {
    description: "Show the album nomination form when user wants to nominate an album",
    parameters: z.object({}),
    generate: async function* ({}) {
      const toolCallId = generateId();

      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId,
              toolName: "showNominationForm",
              args: {},
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolName: "showNominationForm",
              toolCallId,
              result: "Nomination form displayed",
            },
          ],
        },
      ]);

      return (
        <Message
          role="assistant"
          content={<NominationFormWrapper/>}
        />
      );
    },
  },

  showRatingForm: {
    description: "Show the rating form for the current week's album",
    parameters: z.object({}),
    generate: async function* ({}) {
      const result = AlbumService.getCurrentWeekAlbum();
      const toolCallId = generateId();

      if (!result || result.isNomination) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                toolCallId,
                toolName: "showRatingForm",
                args: {},
              },
            ],
          },
          {
            role: "tool",
            content: [
              {
                type: "tool-result",
                toolName: "showRatingForm",
                toolCallId,
                result: "No current album found",
              },
            ],
          },
        ]);

        return <Message role="assistant" content="No current album found to rate."/>;
      }

      const {album} = result;

      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId,
              toolName: "showRatingForm",
              args: {},
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolName: "showRatingForm",
              toolCallId,
              result: "Rating form displayed",
            },
          ],
        },
      ]);

      return (
        <Message
          role="assistant"
          content={
            <RatingFormWrapper
              albumTitle={album.title}
              albumArtist={album.artist}
              albumId={album.id}
            />
          }
        />
      );
    },
  },

  getAllRatings: {
    description: "Get all album ratings displayed in a table format",
    parameters: z.object({}),
    generate: async function* ({}) {
      const {ratings, albums} = AlbumService.getAllRatings();
      const toolCallId = generateId();

      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId,
              toolName: "getAllRatings",
              args: {},
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolName: "getAllRatings",
              toolCallId,
              result: "All ratings table displayed",
            },
          ],
        },
      ]);

      return (
        <Message
          role="assistant"
          content={<RatingsTable ratings={ratings} albums={albums}/>}
        />
      );
    },
  },

  getAllComments: {
    description: "Get all album ratings with comments and stars displayed in a detailed format",
    parameters: z.object({}),
    generate: async function* ({}) {
      const {ratings, albums} = AlbumService.getAllComments();
      const toolCallId = generateId();

      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId,
              toolName: "getAllComments",
              args: {},
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              toolName: "getAllComments",
              toolCallId,
              result: "All comments and ratings displayed",
            },
          ],
        },
      ]);

      return (
        <Message
          role="assistant"
          content={<CommentsList ratings={ratings} albums={albums}/>}
        />
      );
    },
  },
});