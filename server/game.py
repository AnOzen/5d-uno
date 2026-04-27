import json
import random
from websockets import ServerConnection


class Game:
    def __init__(self) -> None:
        self.players: list[str] = []
        self.ready: list[bool] = []
        self.states: list[dict] = []
        self.draws: list[int] = []

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

    def init_state(self):
        hands: dict[str, list[int]] = {}
        for player in self.players:
            hands[player] = [1, 1, 1, 1, 1, 1, 1]  # TODO: fix this plz

        self.draws = self.create_draw()
        self.states.append({"coords": (0, 0), "hands": hands, "middle": self.draws[0], "turn": 0})

    def create_draw(self):
        cards = [x for x in range(1, 7)] + [x for x in range(1, 7)]
        random.shuffle(cards)
        return cards

    def __str__(self) -> str:
        return f"Game {{ players: {self.players} }}"

    async def broadcast_players(self, connections: dict[str, ServerConnection]):
        for player in self.players:
            await connections[player].send(
                json.dumps(
                    {
                        "resp": "listplayers",
                        "players": self.players,
                        "ready": self.ready,
                    }
                )
            )

    async def broadcast_start(self, connections: dict[str, ServerConnection]):
        for player in self.players:
            await connections[player].send(
                json.dumps(
                    {
                        "resp": "gamestart",
                    }
                )
            )

    async def broadcast_stateadd(
        self, connections: dict[str, ServerConnection], index: int
    ):
        for player in self.players:
            await connections[player].send(
                json.dumps({"resp": "stateadd", "state": self.states[index]})
            )
