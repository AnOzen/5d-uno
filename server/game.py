import json

from websockets import ServerConnection


class Game:
    def __init__(self) -> None:
        self.players: list[str] = []

    def add_player(self, username: str) -> bool:
        try:
            self.players.index(username)
            return False
        except:
            self.players.append(username)
            return True

    def remove_player(self, username: str) -> bool:
        try:
            self.players.remove(username)
            return True
        except:
            return False
    
    def __str__(self) -> str:
        return f"Game {{ players: {self.players} }}"
    
    async def broadcast_players(self, connections: dict[str,ServerConnection]):
        for player in self.players:
            await connections[player].send(json.dumps({"resp": "listplayers", "players": self.players}))

