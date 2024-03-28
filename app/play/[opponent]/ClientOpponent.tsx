'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types';
import { Player } from '@/app/page';
import Game from '@/app/Game';
import InitGame from '@/app/InitGame';
import socket from '../../socket';
import { Button } from '@/components/ui/button';
import { signIn, signOut } from 'next-auth/react';
import { User } from '@prisma/client';
import { OpponentType } from '@/enums';
import { getUserById } from '@/app/actions/getCurrentUser';
interface ClientOpponentProps {
  user: User;
  opponent: OpponentType;
}

export default function ClientOpponent({
  user,
  opponent,
}: ClientOpponentProps) {
  const [username, setUsername] = useState(user.name);
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  const [room, setRoom] = useState('');
  const [orientation, setOrientation] = useState<BoardOrientation>('white');
  const [players, setPlayers] = useState<Player[]>([]);

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom('');
    setOrientation('white');
    setPlayers([]);
  }, []);
  useEffect(() => {
    if (user) {
      socket.emit('user', user);
      console.log('emitted username', user);
    }
  }, [user]);

  useEffect(() => {
    socket.on('opponentJoined', (roomData) => {
      console.log('roomData', roomData);

      setPlayers(roomData.players);
    });
  }, []);
  console.log(players);
  return (
    <div>
      {/* <Button
        onClick={() => {
          signIn();
        }}
      >
        Sign In
      </Button>
      <Button
        onClick={() => {
          signOut();
        }}
      >
        Sign Out
      </Button> */}

      {room ? (
        <Game
          room={room}
          orientation={orientation}
          username={user.name!}
          players={players}
          // the cleanup function will be used by Game to reset the state when a game is over
          cleanup={cleanup}
          roomId={room}
        />
      ) : (
        <InitGame
          setRoom={setRoom}
          setOrientation={setOrientation}
          setPlayers={setPlayers}
        />
      )}
    </div>
  );
}