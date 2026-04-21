import json

from websockets import ServerConnection


class Game:
    def __init__(self) -> None:
        self.players: list[str] = []
        self.ready: list[bool] = []

    def add_player(self, username: str) -> bool:
        try:
            self.players.index(username)
            return False
        except:
            self.players.append(username)
            self.ready.append(False)
            return True

    def remove_player(self, username: str) -> bool:
        try:
            self.ready.pop(self.players.index(username))
            self.players.remove(username)
            return True
        except:
            return False
    
    def set_ready(self, username: str, ready: bool):
        self.ready[self.players.index(username)] = ready

    def __str__(self) -> str:
        return f"Game {{ players: {self.players} }}"

    async def broadcast_players(self, connections: dict[str, ServerConnection]):
        for player in self.players:
            await connections[player].send(
                json.dumps({"resp": "listplayers", "players": self.players, "ready": self.ready})
            )
