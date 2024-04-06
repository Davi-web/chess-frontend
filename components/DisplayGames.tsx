'use client';
import { Game } from '@prisma/client';
import { Chessboard } from 'react-chessboard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface DisplayGamesProps {
  games: Game[];
  userId: string;
  username: string | null;
}
const DisplayGames: React.FC<DisplayGamesProps> = ({
  games,
  userId,
  username,
}) => {
  const router = useRouter();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
      <Card className="w-full min-w-sm">
        <CardHeader className="">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold text-primary">
              {username && `${username}'s`} Games
            </h2>
            <button
              className="text-sm text-primary"
              onClick={() => router.push('/games')}
            >
              View All Games
            </button>
          </div>
        </CardHeader>
      </Card>
      <Carousel
        opts={{
          align: 'center',
        }}
        className="w-5/6 -p-x-24 min-w-sm "
      >
        <CarouselContent>
          {games.map((game, i) => (
            <CarouselItem
              key={game.id}
              className="md:basis-1/2 lg:basis-1/3 cursor-pointer min-w-64"
              onClick={() => router.push(`/game/${game.id}`)}
            >
              <Card>
                <p className="text-lg text-green-500 text-center">
                  Game: {i + 1}
                </p>
                <p className="text-xs text-green-300 text-center">
                  {game.winnerName} vs {game.loserName}
                </p>
                <p className="text-xs text-green-300 text-center">
                  {userId === game.winnerId ? game.winnerName : game.loserName}{' '}
                  {game.winnerId === userId ? 'Won' : 'Lost'} against{' '}
                  {game.winnerId === userId ? game.loserName : game.winnerName}
                </p>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <Chessboard position={game.moves[game.moves.length - 1]} />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />

        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default DisplayGames;
