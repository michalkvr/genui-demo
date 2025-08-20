import {Message, TextStreamMessage} from "@/components/message";
import {openai} from "@ai-sdk/openai";
import {CoreMessage, generateId} from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import {ReactNode} from "react";
import {z} from "zod";
import {AlbumCard} from "@/components/album-card";
import {AlbumGrid} from "@/components/album-grid";
import {StatsCard} from "@/components/stats-card";
import {NominationFormWrapper} from "@/components/nomination-form-wrapper";
import {RatingFormWrapper} from "@/components/rating-form-wrapper";
import {RatingsTable} from "@/components/ratings-table";
import {CommentsList} from "@/components/comments-list";
import * as fs from "fs";
import * as path from "path";

interface Album {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  coverUrl?: string;
  pickedAt?: string;
}

interface Rating {
  albumId: string;
  user: string;
  score: number;
  comment?: string;
}

interface BacklogAlbum {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  coverUrl?: string;
}

// Helper functions to read data from JSON files
function readAlbums(): Album[] {
  try {
    const data = fs.readFileSync(path.join(process.cwd(), 'data', 'albums.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function readRatings(): Rating[] {
  try {
    const data = fs.readFileSync(path.join(process.cwd(), 'data', 'ratings.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function readBacklog(): BacklogAlbum[] {
  try {
    const data = fs.readFileSync(path.join(process.cwd(), 'data', 'backlog.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper functions to write data to JSON files
function writeBacklog(backlog: BacklogAlbum[]): void {
  try {
    const filePath = path.join(process.cwd(), 'data', 'backlog.json');
    fs.writeFileSync(filePath, JSON.stringify(backlog, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing backlog:', error);
  }
}

function writeRatings(ratings: Rating[]): void {
  try {
    const filePath = path.join(process.cwd(), 'data', 'ratings.json');
    fs.writeFileSync(filePath, JSON.stringify(ratings, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing ratings:', error);
  }
}

function generateCustomId(): string {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

const sendMessage = async (message: string) => {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");

  messages.update([
    ...(messages.get() as CoreMessage[]),
    {role: "user", content: message},
  ]);

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value}/>;

  const {value: stream} = await streamUI({
    model: openai("gpt-4o-mini"),
    system: `\
      You are a UI orchestrator for Audio Odyssey, an album discovery and rating app. Use tools to fetch data from JSON, then return React components to render the result. 

      Available components: AlbumCard, AlbumGrid, StatsCard, NominationForm, RatingForm, RatingsTable, CommentsList.

      Workflow:
      1. When users want to "nominate" an album, use showNominationForm tool
      2. When users want to "rate" an album or get a rating form, use showRatingForm tool  
      3. When users ask about current week's album, use getCurrentWeekAlbum
      4. When users ask about backlog or nominations, use listBacklog
      5. When users ask about ratings for a specific album, use getAlbumRatings
      6. When users ask for "all ratings" or want to see all album ratings, use getAllRatings tool
      7. When users ask for "comments" or want to see ratings with comments, use getAllComments tool
      
      Always respond with React components, never raw HTML or text-only responses.
    `,
    messages: messages.get() as CoreMessage[],
    text: async function* ({content, done}) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          {role: "assistant", content},
        ]);

        contentStream.done();
      } else {
        contentStream.update(content);
      }

      return textComponent;
    },
    tools: {
      getCurrentWeekAlbum: {
        description: "Get the current week's album (most recent by pickedAt or nomination)",
        parameters: z.object({}),
        generate: async function* ({}) {
          const albums = readAlbums();
          const backlog = readBacklog();
          const currentAlbum = albums
            .filter(album => album.pickedAt)
            .sort((a, b) => new Date(b.pickedAt!).getTime() - new Date(a.pickedAt!).getTime())[0];
          const latestNomination = backlog.length > 0 ? backlog[backlog.length - 1] : null;

          let showAlbum = currentAlbum;
          let showNomination = false;
          if (latestNomination) {
            // If there is a nomination and either no album or the album is older than the nomination
            if (!currentAlbum || (currentAlbum && latestNomination.id && currentAlbum.pickedAt && parseInt(latestNomination.id.split('_')[1]) > new Date(currentAlbum.pickedAt).getTime())) {
              showAlbum = latestNomination;
              showNomination = true;
            }
          }

          const toolCallId = generateId();

          if (!showAlbum) {
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

          // Get ratings for this album (only if it's from albums.json)
          let avg = null;
          let ratingsCount = 0;
          if (!showNomination) {
            const ratings = readRatings().filter(r => r.albumId === showAlbum.id);
            avg = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length : null;
            ratingsCount = ratings.length;
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
                  result: showAlbum,
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
                    title={showAlbum.title}
                    artist={showAlbum.artist}
                    genre={showAlbum.genre}
                    coverUrl={showAlbum.coverUrl}
                  />
                  {!showNomination && <StatsCard avg={avg} count={ratingsCount}/>}
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
        generate: async function* ({limit}) {
          const backlog = readBacklog();
          const limitedBacklog = limit ? backlog.slice(0, limit) : backlog;
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
                  result: limitedBacklog,
                },
              ],
            },
          ]);

          return (
            <Message
              role="assistant"
              content={<AlbumGrid albums={limitedBacklog}/>}
            />
          );
        },
      },
      getAlbumRatings: {
        description: "Get ratings overview for a specific album",
        parameters: z.object({
          albumId: z.string(),
        }),
        generate: async function* ({albumId}) {
          const ratings = readRatings().filter(r => r.albumId === albumId);
          const avg = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
            : null;
          const comments = ratings.filter(r => r.comment).map(r => ({
            user: r.user,
            comment: r.comment,
            score: r.score
          }));

          const result = {
            albumId,
            avg,
            count: ratings.length,
            comments
          };

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
              content={<StatsCard avg={avg} count={ratings.length}/>}
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
          const albums = readAlbums();
          const currentAlbum = albums
            .filter(album => album.pickedAt)
            .sort((a, b) => new Date(b.pickedAt!).getTime() - new Date(a.pickedAt!).getTime())[0];

          const toolCallId = generateId();

          if (!currentAlbum) {
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
                  albumTitle={currentAlbum.title}
                  albumArtist={currentAlbum.artist}
                  albumId={currentAlbum.id}
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
          const ratings = readRatings();
          const albums = readAlbums();
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
          const ratings = readRatings();
          const albums = readAlbums();
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
    },
  });

  return stream;
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({state, done}) => {
    "use server";

    if (done) {
      // save to database
    }
  },
});
